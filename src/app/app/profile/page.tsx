"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [upiId, setUpiId] = useState("rahul@upi");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full bg-[var(--secondary)] flex items-center justify-center text-3xl font-semibold">
          {name[0]}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-[var(--muted-foreground)]">{email}</p>
        </div>
      </div>

      {/* Profile Form */}
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Personal Info</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Done" : "Edit"}
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
          />
        </div>
      </Card>

      {/* UPI Settings */}
      <Card className="p-5 mb-6">
        <h3 className="font-semibold mb-4">Payment Details</h3>
        <div className="space-y-4">
          <Input
            label="UPI ID"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
          <p className="text-sm text-[var(--muted-foreground)]">
            Your UPI ID is used when others settle up with you
          </p>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">App Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span>Notifications</span>
            <Button variant="secondary" size="sm">Manage</Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Currency</span>
            <span className="text-[var(--muted-foreground)]">INR (₹)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
