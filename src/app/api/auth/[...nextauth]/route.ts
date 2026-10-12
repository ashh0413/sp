import { NextRequest, NextResponse } from "next/server";

// Simple auth endpoint for demo
// Replace with NextAuth when database is configured

export async function GET(request: NextRequest) {
  // Demo: return a mock session
  return NextResponse.json({
    user: {
      id: "demo-user",
      email: "demo@example.com",
      name: "Demo User",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    if (action === "login") {
      // Demo login - always succeeds
      return NextResponse.json({
        user: {
          id: "demo-user",
          email,
          name: "Demo User",
        },
      });
    }

    if (action === "logout") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 500 });
  }
}
