import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGroupByInviteCode, addMemberToGroup } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json(
        { error: "Invite code is required" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const group = await getGroupByInviteCode(inviteCode.toUpperCase());
    if (!group) {
      return NextResponse.json(
        { error: "Invalid invite code" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const members = group.members as Array<{ user: { id: string } }>;
    const isAlreadyMember = members.some((m) => m.user.id === userId);
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 409 }
      );
    }

    await addMemberToGroup(group.id, session.user.id);

    return NextResponse.json(
      { success: true, data: group },
      { status: 200 }
    );
  } catch (error) {
    console.error("Join group error:", error);
    return NextResponse.json(
      { error: "Failed to join group" },
      { status: 500 }
    );
  }
}
