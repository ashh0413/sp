import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSettlementsForUser, createSettlement, confirmSettlement } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settlements = await getSettlementsForUser(session.user.id);
    return NextResponse.json({ success: true, data: settlements });
  } catch (error) {
    console.error("Get settlements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settlements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { groupId, toUserId, amount } = body;

    if (!groupId || !toUserId || !amount) {
      return NextResponse.json(
        { error: "Group ID, recipient ID, and amount are required" },
        { status: 400 }
      );
    }

    const settlement = await createSettlement({
      groupId,
      fromUserId: session.user.id,
      toUserId,
      amount: Number(amount),
    });

    return NextResponse.json({ success: true, data: settlement }, { status: 201 });
  } catch (error) {
    console.error("Create settlement error:", error);
    return NextResponse.json(
      { error: "Failed to create settlement" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { settlementId, action } = body;

    if (!settlementId) {
      return NextResponse.json(
        { error: "Settlement ID is required" },
        { status: 400 }
      );
    }

    if (action === "mark_paid" || action === "confirm") {
      const settlement = await confirmSettlement(settlementId, session.user.id);
      return NextResponse.json({ success: true, data: settlement });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Update settlement error:", error);
    return NextResponse.json(
      { error: "Failed to update settlement" },
      { status: 500 }
    );
  }
}
