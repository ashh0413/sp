"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const DEMO_STATS = {
  totalOwed: 2400,
  totalOwing: 850,
  netBalance: 1550,
};

const DEMO_ACTIVITIES = [
  { id: "1", text: "Goa Trip 2026 - Rahul paid ₹1,200 for Pista House Biryani", time: "2h ago", type: "expense" },
  { id: "2", text: "Weekend BBQ - You settled ₹850 with Priya", time: "1d ago", type: "settlement" },
  { id: "3", text: "Office Lunch - Amit added ₹2,400", time: "2d ago", type: "expense" },
];

export default function DashboardPage() {
  return (
    <div className="px-6 py-6">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Good morning</h1>
        <p className="text-[var(--muted-foreground)]">Here's your balance overview</p>
      </div>

      {/* Balance Card */}
      <Card className="p-5 mb-6 bg-gradient-to-br from-[var(--primary)] to-blue-600 text-white border-0">
        <p className="text-sm opacity-80 mb-1">Net Balance</p>
        <p className="text-4xl font-semibold tracking-tight">
          {formatCurrency(DEMO_STATS.netBalance)}
        </p>
        <div className="flex gap-6 mt-4 text-sm">
          <div>
            <p className="opacity-80">You are owed</p>
            <p className="font-medium">{formatCurrency(DEMO_STATS.totalOwed)}</p>
          </div>
          <div>
            <p className="opacity-80">You owe</p>
            <p className="font-medium">{formatCurrency(DEMO_STATS.totalOwing)}</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/app/groups?action=create">
          <Card className="p-4 hover:bg-[var(--secondary)] transition-colors cursor-pointer">
            <p className="text-2xl mb-1">+</p>
            <p className="text-sm font-medium">New Group</p>
          </Card>
        </Link>
        <Link href="/app/groups">
          <Card className="p-4 hover:bg-[var(--secondary)] transition-colors cursor-pointer">
            <p className="text-2xl mb-1">◈</p>
            <p className="text-sm font-medium">Join Group</p>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold tracking-tight mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {DEMO_ACTIVITIES.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  activity.type === "expense" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                }`}>
                  {activity.type === "expense" ? "₹" : "✓"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] truncate">{activity.text}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{activity.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Your Groups */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Your Groups</h2>
          <Link href="/app/groups">
            <Button variant="ghost" size="sm">See All</Button>
          </Link>
        </div>
        <div className="space-y-3">
          <Link href="/app/groups/1">
            <Card className="p-4 hover:bg-[var(--secondary)] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Goa Trip 2026</p>
                  <p className="text-sm text-[var(--muted-foreground)]">4 members</p>
                </div>
                <p className="text-[var(--primary)] font-medium">+₹1,200</p>
              </div>
            </Card>
          </Link>
          <Link href="/app/groups/2">
            <Card className="p-4 hover:bg-[var(--secondary)] transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekend BBQ</p>
                  <p className="text-sm text-[var(--muted-foreground)]">6 members</p>
                </div>
                <p className="text-[var(--muted-foreground)]">Settled</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
