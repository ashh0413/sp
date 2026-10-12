import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGroupsForUser, createGroup } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groups = await getGroupsForUser(session.user.id);
    return NextResponse.json({ success: true, data: groups });
  } catch (error) {
    console.error("Get groups error:", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, budget, currency } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const group = await createGroup({
      name,
      description,
      budget,
      currency,
      createdById: session.user.id,
    });

    return NextResponse.json(
      { success: true, data: group },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
