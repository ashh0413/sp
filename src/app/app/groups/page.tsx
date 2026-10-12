"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";

const DEMO_GROUPS = [
  { id: "1", name: "Goa Trip 2026", memberCount: 4, balance: 1200, currency: "INR", inviteCode: "GOA2026" },
  { id: "2", name: "Weekend BBQ", memberCount: 6, balance: 0, currency: "INR", inviteCode: "BBQ2026" },
  { id: "3", name: "Office Lunch", memberCount: 8, balance: -450, currency: "INR", inviteCode: "LUNCH1" },
  { id: "4", name: "House Rent", memberCount: 3, balance: 2800, currency: "INR", inviteCode: "RENT23" },
];

function GroupsContent() {
  const searchParams = useSearchParams();
  const showCreate = searchParams.get("action") === "create";
  const [showCreateModal, setShowCreateModal] = useState(showCreate);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: "", description: "", budget: "" });
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) return;
    setIsCreating(true);
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newGroup.name,
          description: newGroup.description,
          budget: newGroup.budget ? parseFloat(newGroup.budget) : null,
        }),
      });
      if (response.ok) {
        setNewGroup({ name: "", description: "", budget: "" });
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Create group error:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;
    setIsJoining(true);
    try {
      const response = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: joinCode }),
      });
      if (response.ok) {
        setJoinCode("");
        setShowJoinModal(false);
      }
    } catch (error) {
      console.error("Join group error:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_GROUPS.map((group) => (
          <Link key={group.id} href={`/app/groups/${group.id}`}>
            <Card className="p-5 hover:border-[var(--border)] transition-all duration-200 cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{group.name}</h3>
                <span className="text-sm text-[var(--muted-foreground)]">
                  {group.memberCount} members
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${group.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {group.balance >= 0 ? "Gets back" : "Owes"} {formatCurrency(Math.abs(group.balance))}
                </span>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
          Join Group
        </Button>
        <Button onClick={() => setShowCreateModal(true)}>
          + Create
        </Button>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Group">
        <div className="space-y-4">
          <Input label="Group Name" placeholder="Goa Trip 2026" value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })} />
          <Input label="Description (optional)" placeholder="Weekend getaway..." value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} />
          <Input label="Budget (optional)" type="number" placeholder="15000" value={newGroup.budget} onChange={(e) => setNewGroup({ ...newGroup, budget: e.target.value })} />
          <Button className="w-full" onClick={handleCreateGroup} isLoading={isCreating}>Create Group</Button>
        </div>
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Group">
        <div className="space-y-4">
          <Input label="Invite Code" placeholder="GOA2026" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} />
          <Button className="w-full" onClick={handleJoinGroup} isLoading={isJoining}>Join Group</Button>
        </div>
      </Modal>
    </>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[var(--muted-foreground)]">Loading...</div>}>
      <GroupsContent />
    </Suspense>
  );
}
