"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface GroupCardProps {
  group: {
    id: string;
    name: string;
    description?: string | null;
    budget?: number | null;
    currency: string;
    inviteCode: string;
    createdAt: Date;
    members: Array<{
      id: string;
      role: string;
      user: { id: string; name: string; email: string };
    }>;
    _count?: { expenses: number };
  };
}

export function GroupCard({ group }: GroupCardProps) {
  const [copied, setCopied] = useState(false);

  const copyInviteLink = async () => {
    const link = `${window.location.origin}/join/${group.inviteCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const memberCount = group.members?.length || 0;

  return (
    <Card className="hover:border-[var(--border)] transition-all duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{group.name}</CardTitle>
            {group.description && (
              <CardDescription className="mt-1">{group.description}</CardDescription>
            )}
          </div>
          {group.members?.[0]?.role === "admin" && (
            <Badge variant="secondary">Admin</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Members */}
        <div className="flex items-center mb-4">
          <div className="flex -space-x-2 mr-3">
            {group.members?.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="w-8 h-8 rounded-full bg-[var(--secondary)] border-2 border-[var(--background)] flex items-center justify-center text-xs font-medium"
                title={member.user.name}
              >
                {member.user.name[0]}
              </div>
            ))}
            {memberCount > 4 && (
              <div className="w-8 h-8 rounded-full bg-[var(--muted)] border-2 border-[var(--background)] flex items-center justify-center text-xs">
                +{memberCount - 4}
              </div>
            )}
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
          <span>{group._count?.expenses || 0} expenses</span>
          <span>•</span>
          <span>Created {formatDate(group.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <Link href={`/app/groups/${group.id}`} className="flex-1">
            <Button className="w-full">Open Group</Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={copyInviteLink}>
            {copied ? "✓" : "📋"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
