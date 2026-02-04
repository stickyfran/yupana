/**
 * Settlement calculation algorithm
 * Finds optimal payment settlements with minimum number of transactions
 */

export const calculateSettlements = (balances) => {
  const settlements = [];
  const debtors = []; // People who owe money
  const creditors = []; // People who should receive money

  // Separate debtors and creditors
  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance < 0) {
      debtors.push({ memberId, amount: Math.abs(balance) });
    } else if (balance > 0) {
      creditors.push({ memberId, amount: balance });
    }
  });

  // Sort by amount
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // Match debtors with creditors
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.memberId,
      to: creditor.memberId,
      amount: amount,
    });

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) debtorIndex++;
    if (creditor.amount === 0) creditorIndex++;
  }

  return settlements;
};
