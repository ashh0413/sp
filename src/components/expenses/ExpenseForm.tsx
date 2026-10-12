"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EXPENSE_CATEGORIES } from "@/types";

interface ExpenseFormProps {
  groupId: string;
  members: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

export function ExpenseForm({ groupId, members, onSuccess }: ExpenseFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("other");
  const [paidById, setPaidById] = useState(members[0]?.id || "");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (splitType === "equal" && members.length > 0) {
      const splitAmount = (parseFloat(value) || 0) / members.length;
      const splits: Record<string, string> = {};
      members.forEach((m) => {
        splits[m.id] = splitAmount.toFixed(2);
      });
      setCustomSplits(splits);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const splitWith = members.map((m) => ({
        userId: m.id,
        amount: parseFloat(customSplits[m.id] || "0"),
      }));

      const response = await fetch(`/api/groups/${groupId}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          category,
          paidById,
          splitType,
          splitWith,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add expense");
      }

      // Reset form
      setDescription("");
      setAmount("");
      setCategory("other");
      setCustomSplits({});
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Description"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            required
          />

          {/* Category selector */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(EXPENSE_CATEGORIES).map(([key, { emoji, label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`p-2 rounded-lg border text-center transition-colors ${
                    category === key
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="block text-xs mt-1 truncate">{label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paid by */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Paid by</label>
            <select
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Split type */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Split</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSplitType("equal");
                  handleAmountChange(amount);
                }}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  splitType === "equal"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Equal
              </button>
              <button
                type="button"
                onClick={() => setSplitType("custom")}
                className={`flex-1 py-2 rounded-lg border transition-colors ${
                  splitType === "custom"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Custom splits */}
          {splitType === "custom" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Split amounts</label>
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{m.name}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={customSplits[m.id] || ""}
                    onChange={(e) =>
                      setCustomSplits((prev) => ({ ...prev, [m.id]: e.target.value }))
                    }
                    className="w-24 h-8 px-2 rounded border border-gray-300 text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
