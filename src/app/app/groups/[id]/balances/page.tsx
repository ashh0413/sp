"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const DEMO_BALANCES = [
  { id: "1", name: "Rahul", initial: "R", net: 3200 },
  { id: "2", name: "Priya", initial: "P", net: -850 },
  { id: "3", name: "Amit", initial: "A", net: -1200 },
  { id: "4", name: "Sneha", initial: "S", net: -150 },
];

const DEMO_SETTLEMENTS = [
  { from: "Priya", to: "Rahul", amount: 850, fromInitial: "P", toInitial: "R" },
  { from: "Amit", to: "Rahul", amount: 1200, fromInitial: "A", toInitial: "R" },
  { from: "Sneha", to: "Rahul", amount: 150, fromInitial: "S", toInitial: "R" },
];

export default function BalancesPage() {
  const params = useParams();
  const groupId = params.id as string;

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <Link href={`/app/groups/${groupId}`} className="text-sm text-[var(--muted-foreground)] mb-4 inline-block">
        ← Back to Group
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Balances</h1>

      {/* Net Balances */}
      <Card className="p-5 mb-6">
        <h2 className="text-sm text-[var(--muted-foreground)] mb-4">Net Balances</h2>
        <div className="space-y-4">
          {DEMO_BALANCES.map((balance) => (
            <div key={balance.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center font-medium">
                  {balance.initial}
                </div>
                <span className="font-medium">{balance.name}</span>
              </div>
              <span className={`text-lg font-semibold ${
                balance.net > 0 ? "text-[var(--primary)]" :
                balance.net < 0 ? "text-[var(--error)]" :
                "text-[var(--muted-foreground)]"
              }`}>
                {balance.net > 0 ? `+${formatCurrency(balance.net)}` : formatCurrency(balance.net)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Settlements */}
      <Card className="p-5">
        <h2 className="text-sm text-[var(--muted-foreground)] mb-4">Suggested Settlements</h2>
        <div className="space-y-4">
          {DEMO_SETTLEMENTS.map((settlement, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-sm font-medium">
                  {settlement.fromInitial}
                </div>
                <span className="text-sm">{settlement.from}</span>
              </div>
              <div className="text-[var(--muted-foreground)]">→</div>
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center text-sm font-medium">
                  {settlement.toInitial}
                </div>
                <span className="text-sm">{settlement.to}</span>
              </div>
              <span className="font-medium">{formatCurrency(settlement.amount)}</span>
              <Button size="sm" variant="secondary">
                Pay
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
