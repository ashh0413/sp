"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

const DEMO_GROUP = {
  id: "1",
  name: "Goa Trip 2026",
  description: "Weekend getaway with college friends",
  inviteCode: "GOA2026",
  members: [
    { id: "1", name: "Rahul", avatar: "R", net: 1200 },
    { id: "2", name: "Priya", avatar: "P", net: -425 },
    { id: "3", name: "Amit", avatar: "A", net: -475 },
    { id: "4", name: "Sneha", avatar: "S", net: 200 },
  ],
};

const DEMO_EXPENSES = [
  { id: "1", description: "Pista House Biryani", amount: 1200, paidBy: "Rahul", category: "Food" },
  { id: "2", description: "Uber to Airport", amount: 850, paidBy: "Priya", category: "Travel" },
  { id: "3", description: "Club Tickets", amount: 2400, paidBy: "Amit", category: "Entertainment" },
  { id: "4", description: "Hotel Booking", amount: 8000, paidBy: "Sneha", category: "Stay" },
];

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Food",
    paidBy: "Rahul",
    splitWith: DEMO_GROUP.members.map((m) => m.id),
  });

  const totalSpent = DEMO_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
  const yourShare = totalSpent / DEMO_GROUP.members.length;

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link href="/app/groups" className="text-sm text-[var(--muted-foreground)] mb-2 inline-block">
          ← Groups
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{DEMO_GROUP.name}</h1>
            <p className="text-sm text-[var(--muted-foreground)]">{DEMO_GROUP.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)}>
            ◈
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Total Spent</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold">{DEMO_GROUP.members.length}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Members</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold">{formatCurrency(yourShare)}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Your Share</p>
        </Card>
      </div>

      {/* Balances */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold tracking-tight">Balances</h2>
          <Link href={`/app/groups/${groupId}/balances`}>
            <Button variant="ghost" size="sm">Details</Button>
          </Link>
        </div>
        <Card className="p-4">
          <div className="space-y-3">
            {DEMO_GROUP.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-sm font-medium">
                    {member.avatar}
                  </div>
                  <span className="text-[15px]">{member.name}</span>
                </div>
                <span className={`text-[15px] font-medium ${
                  member.net > 0 ? "text-[var(--primary)]" :
                  member.net < 0 ? "text-[var(--error)]" :
                  "text-[var(--muted-foreground)]"
                }`}>
                  {member.net > 0 ? `+${formatCurrency(member.net)}` : formatCurrency(member.net)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Expenses */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold tracking-tight">Expenses</h2>
          <Button size="sm" onClick={() => setShowAddExpense(true)}>
            + Add
          </Button>
        </div>
        <Card className="divide-y divide-[var(--border)]">
          {DEMO_EXPENSES.map((expense) => (
            <div key={expense.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {expense.paidBy} paid · {expense.category}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(expense.amount)}</p>
            </div>
          ))}
        </Card>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        title="Add Expense"
      >
        <div className="space-y-4">
          <Input
            label="Description"
            placeholder="What was this for?"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          />
          <Button className="w-full" onClick={() => setShowAddExpense(false)}>
            Add Expense
          </Button>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Invite Link"
      >
        <div className="space-y-4">
          <div className="bg-[var(--secondary)] rounded-xl p-4 text-center">
            <p className="text-sm text-[var(--muted-foreground)] mb-1">Invite Code</p>
            <p className="text-2xl font-mono font-semibold tracking-wider">{DEMO_GROUP.inviteCode}</p>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] text-center">
            Share this code or link with friends to join the group
          </p>
          <Button className="w-full" onClick={() => setShowShareModal(false)}>
            Copy Link
          </Button>
        </div>
      </Modal>
    </div>
  );
}
