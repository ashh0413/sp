import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGroupById, getBalancesForGroup, simplifyDebts } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id!;
    const group = await getGroupById(id);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is a member
    const members = group.members as Array<{ user: { id: string }; userId: string }>;
    const isMember = members.some((m) => m.user.id === userId);
    if (!isMember) {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 403 }
      );
    }

    // Get balances
    const result = await getBalancesForGroup(id);
    if (!result) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }
    const balances = result.balances;
    const groupData = result.group;
    const settlements = simplifyDebts(balances);

    // Calculate summary
    const expenses = groupData.expenses || [];
    const totalSpent = expenses.reduce(
      (sum, exp) => sum + Number(exp.amount),
      0
    );
    const budget = (groupData as { budget?: unknown }).budget
      ? Number((groupData as { budget?: unknown }).budget)
      : null;

    return NextResponse.json({
      success: true,
      data: {
        balances,
        settlements,
        summary: {
          totalSpent,
          budget,
          budgetUsed: budget ? (totalSpent / budget) * 100 : null,
          memberCount: members.length,
          expenseCount: expenses.length,
        },
      },
    });
  } catch (error) {
    console.error("Get balances error:", error);
    return NextResponse.json(
      { error: "Failed to calculate balances" },
      { status: 500 }
    );
  }
}
