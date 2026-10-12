/**
 * Balance Calculation & Debt Simplification
 * Core algorithm for calculating "who owes whom"
 */

export interface UserBalance {
  userId: string;
  userName: string;
  net: number; // positive = owed money, negative = owes money
}

export interface SettlementSuggestion {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

export interface ExpenseSplit {
  memberId: string;
  userName: string;
  amount: number;
}

export interface MemberInfo {
  userId: string;
  userName: string;
}

/**
 * Calculate net balances for all members in a group
 */
export function calculateBalances(
  expenses: Array<{
    paidById: string;
    amount: number;
    splits: ExpenseSplit[];
  }>,
  members: MemberInfo[]
): UserBalance[] {
  const balances = new Map<string, number>();
  for (const member of members) {
    balances.set(member.userId, 0);
  }

  // Calculate balances
  for (const expense of expenses) {
    // Person who paid gains credit
    const currentPaid = balances.get(expense.paidById) || 0;
    balances.set(expense.paidById, currentPaid + expense.amount);

    // Each person in the split owes their share
    for (const split of expense.splits) {
      const currentSplit = balances.get(split.memberId) || 0;
      balances.set(split.memberId, currentSplit - split.amount);
    }
  }

  return members.map((member) => ({
    userId: member.userId,
    userName: member.userName,
    net: Math.round((balances.get(member.userId) || 0) * 100) / 100,
  }));
}

/**
 * Simplify debts - minimize number of transactions needed
 * Uses a greedy algorithm: match largest creditor with largest debtor
 */
export function simplifyDebts(balances: UserBalance[]): SettlementSuggestion[] {
  const settlements: SettlementSuggestion[] = [];

  // Separate into creditors (positive balance) and debtors (negative balance)
  const creditors: Array<{ userId: string; userName: string; amount: number }> = [];
  const debtors: Array<{ userId: string; userName: string; amount: number }> = [];

  for (const balance of balances) {
    if (balance.net > 0.01) {
      creditors.push({ userId: balance.userId, userName: balance.userName, amount: balance.net });
    } else if (balance.net < -0.01) {
      debtors.push({ userId: balance.userId, userName: balance.userName, amount: Math.abs(balance.net) });
    }
  }

  // Sort by amount (largest first) for optimal matching
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0.01) {
      settlements.push({
        fromUserId: debtor.userId,
        fromUserName: debtor.userName,
        toUserId: creditor.userId,
        toUserName: creditor.userName,
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

/**
 * Calculate equal split amount for multiple people
 */
export function calculateEqualSplit(
  totalAmount: number,
  numberOfPeople: number
): number {
  if (numberOfPeople <= 0) return 0;

  // Handle rounding to ensure total adds up
  // Round to 2 decimal places
  const baseAmount = Math.round((totalAmount / numberOfPeople) * 100) / 100;
  const remainder = Math.round((totalAmount - baseAmount * numberOfPeople) * 100) / 100;

  // For small remainders (like paise), distribute to first person
  return baseAmount;
}

/**
 * Validate that custom splits add up to the total amount
 */
export function validateSplits(
  totalAmount: number,
  splitAmounts: number[]
): { valid: boolean; difference: number } {
  const sum = splitAmounts.reduce((acc, amount) => acc + amount, 0);
  const difference = Math.round((totalAmount - sum) * 100) / 100;

  return {
    valid: Math.abs(difference) < 0.01,
    difference,
  };
}
