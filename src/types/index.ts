// Shared types for the application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  budget?: number | null;
  currency: string;
  inviteCode: string;
  createdAt: Date;
  members?: GroupMember[];
  _count?: { expenses: number };
}

export interface GroupMember {
  id: string;
  role: "admin" | "member";
  user: User;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  paidById: string;
  paidByName?: string;
  groupId: string;
  createdAt: Date;
  splitBetween?: string[];
}

export interface Balance {
  userId: string;
  userName: string;
  net: number;
}

export interface Settlement {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  toUserUpiId?: string | null;
  amount: number;
  status: "pending" | "paid" | "confirmed";
  upiLink?: string;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export type Theme = "light" | "dark" | "system";

export const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food & Drinks", emoji: "🍔" },
  { value: "transport", label: "Transport", emoji: "🚗" },
  { value: "accommodation", label: "Accommodation", emoji: "🏨" },
  { value: "entertainment", label: "Entertainment", emoji: "🎉" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "utilities", label: "Utilities", emoji: "💡" },
  { value: "other", label: "Other", emoji: "📦" },
] as const;
