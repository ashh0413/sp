"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateUPIUrl } from "@/lib/upi";
import { formatCurrency } from "@/lib/utils";

interface SettlementCardProps {
  settlement: {
    id: string;
    fromUserName: string;
    toUserName: string;
    toUserUpiId?: string | null;
    amount: number;
    status: "pending" | "paid" | "confirmed";
  };
  currentUserId?: string;
  onMarkPaid?: () => void;
}

export function SettlementCard({ settlement, currentUserId, onMarkPaid }: SettlementCardProps) {
  const [showUPI, setShowUPI] = useState(false);

  const isOwed = settlement.status === "pending";
  const isPaid = settlement.status === "paid";
  const isConfirmed = settlement.status === "confirmed";

  const upiUrl = settlement.toUserUpiId
    ? generateUPIUrl({ pa: settlement.toUserUpiId, pn: settlement.toUserName, am: settlement.amount.toString() })
    : null;

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center font-medium">
              {settlement.fromUserName[0]}
            </div>
            <div>
              <p className="font-medium">
                {settlement.fromUserName} owes {settlement.toUserName}
              </p>
              <p className="text-[var(--muted-foreground)] text-sm">
                {formatCurrency(settlement.amount)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConfirmed ? (
              <span className="text-[var(--success)] text-sm font-medium">Settled</span>
            ) : isPaid ? (
              <span className="text-blue-600 text-sm font-medium">Paid</span>
            ) : (
              <Button variant="secondary" size="sm" onClick={onMarkPaid}>
                Mark Paid
              </Button>
            )}
          </div>
        </div>

        {showUPI && upiUrl && (
          <div className="mt-4 p-3 bg-[var(--secondary)] rounded-lg">
            <p className="text-sm text-[var(--muted-foreground)] mb-2">
              Pay to UPI ID: <strong>{settlement.toUserUpiId}</strong>
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Amount: <strong>{formatCurrency(settlement.amount)}</strong>
            </p>
            <Link href={upiUrl}>
              <Button size="sm" className="mt-2 w-full">
                Open Payment App
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
