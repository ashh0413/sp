import { PrismaClient } from "@prisma/client";

// Singleton pattern for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = db;

// User operations
export async function getUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email } });
}

export async function createUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  phone?: string;
  upiId?: string;
}) {
  return db.user.create({ data });
}

// Group operations
export async function getGroupById(id: string) {
  return db.group.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      expenses: {
        include: {
          paidBy: { select: { id: true, name: true } },
          splits: {
            include: { member: { include: { user: { select: { id: true, name: true } } } } },
          },
        },
      },
    },
  });
}

export async function getGroupByInviteCode(inviteCode: string) {
  return db.group.findUnique({
    where: { inviteCode },
    include: {
      members: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function getGroupsForUser(userId: string) {
  return db.group.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createGroup(data: {
  name: string;
  description?: string;
  budget?: number;
  currency?: string;
  createdById: string;
}) {
  const inviteCode = generateInviteCode();
  return db.group.create({
    data: {
      name: data.name,
      description: data.description,
      budget: data.budget,
      currency: data.currency ?? "INR",
      inviteCode,
      createdById: data.createdById,
      members: {
        create: {
          userId: data.createdById,
          role: "ADMIN",
        },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });
}

export async function addMemberToGroup(groupId: string, userId: string) {
  return db.groupMember.create({
    data: {
      groupId,
      userId,
      role: "MEMBER",
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });
}

// Expense operations
export async function getExpensesForGroup(groupId: string) {
  return db.expense.findMany({
    where: { groupId },
    include: {
      paidBy: { select: { id: true, name: true } },
      splits: {
        include: { member: { include: { user: { select: { id: true, name: true } } } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createExpense(data: {
  description: string;
  amount: number;
  category: string;
  splitType: string;
  groupId: string;
  paidById: string;
  splits: { memberId: string; amount: number }[];
}) {
  return db.expense.create({
    data: {
      description: data.description,
      amount: data.amount,
      category: data.category,
      splitType: data.splitType,
      groupId: data.groupId,
      paidById: data.paidById,
      splits: {
        create: data.splits.map((split) => ({
          memberId: split.memberId,
          amount: split.amount,
        })),
      },
    },
    include: {
      paidBy: { select: { id: true, name: true } },
      splits: {
        include: { member: { include: { user: { select: { id: true, name: true } } } } },
      },
    },
  });
}

// Balance calculations
export async function getBalancesForGroup(groupId: string) {
  const group = await db.group.findUnique({
    where: { id: groupId },
    include: {
      members: {
        include: { user: { select: { id: true, name: true } } },
      },
      expenses: {
        include: {
          splits: true,
        },
      },
    },
  });

  if (!group) return null;

  const balances: Record<string, number> = {};

  // Initialize balances
  for (const member of group.members) {
    balances[member.userId] = 0;
  }

  // Calculate balances from expenses
  for (const expense of group.expenses) {
    // Who paid the expense
    balances[expense.paidById] =
      (balances[expense.paidById] || 0) + Number(expense.amount);

    // Subtract each member's share
    for (const split of expense.splits) {
      balances[split.memberId] =
        (balances[split.memberId] || 0) - Number(split.amount);
    }
  }

  return {
    group,
    balances,
  };
}

// Settlement operations
export async function getSettlementsForUser(userId: string) {
  return db.settlement.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    include: {
      fromUser: { select: { id: true, name: true } },
      toUser: { select: { id: true, name: true } },
      group: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSettlement(data: {
  groupId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  upiLink?: string;
}) {
  return db.settlement.create({
    data: {
      amount: data.amount,
      upiLink: data.upiLink,
      groupId: data.groupId,
      fromUserId: data.fromUserId,
      toUserId: data.toUserId,
    },
    include: {
      fromUser: { select: { id: true, name: true } },
      toUser: { select: { id: true, name: true } },
      group: { select: { id: true, name: true } },
    },
  });
}

export async function confirmSettlement(settlementId: string, confirmedById: string) {
  return db.settlement.update({
    where: { id: settlementId },
    data: {
      confirmedAt: new Date(),
      paymentConfirmations: {
        create: {
          confirmedById,
        },
      },
    },
    include: {
      fromUser: { select: { id: true, name: true } },
      toUser: { select: { id: true, name: true } },
    },
  });
}

// Utility functions
function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function simplifyDebts(
  balances: Record<string, number>
): { from: string; to: string; amount: number }[] {
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  for (const [userId, balance] of Object.entries(balances)) {
    if (balance > 0.01) {
      creditors.push({ id: userId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id: userId, amount: -balance });
    }
  }

  // Sort to minimize transactions
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const settlements: { from: string; to: string; amount: number }[] = [];
  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0.01) {
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(amount * 100) / 100,
      });
    }

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
}
