import moment from 'moment';

/**
 * Generates a CSV string from group data
 */
export const generateCSV = (group) => {
  const headers = [
    'Date',
    'Description',
    'Amount',
    'Paid By',
    'Split Members',
  ];

  const rows = group.expenses.map(expense => {
    const paidByMember = group.members.find(m => m.id === expense.paidBy);
    const splitMemberNames = expense.splitWith
      .map(id => group.members.find(m => m.id === id)?.name)
      .join(', ');

    return [
      moment(expense.date).format('YYYY-MM-DD'),
      expense.description,
      expense.amount.toFixed(2),
      paidByMember?.name || 'Unknown',
      splitMemberNames,
    ];
  });

  const csv = [
    headers.join(','),
    ...rows.map(row =>
      row
        .map(cell =>
          typeof cell === 'string' && cell.includes(',')
            ? `"${cell}"`
            : cell
        )
        .join(',')
    ),
  ].join('\n');

  return csv;
};

/**
 * Generates a summary report of the group
 */
export const generateSummaryReport = (group, balances) => {
  const summary = {
    groupName: group.name,
    createdAt: group.createdAt,
    members: group.members.length,
    totalExpenses: group.expenses.reduce((sum, e) => sum + e.amount, 0),
    expenseCount: group.expenses.length,
    memberBalances: {},
  };

  group.members.forEach(member => {
    summary.memberBalances[member.name] = {
      balance: balances[member.id] || 0,
      owes: balances[member.id] < 0 ? Math.abs(balances[member.id]) : 0,
      isOwnAt: balances[member.id] > 0 ? balances[member.id] : 0,
    };
  });

  return summary;
};

/**
 * Formats data for JSON export
 */
export const generateJSONExport = (group, balances, settlements) => {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    group: {
      id: group.id,
      name: group.name,
      theme: group.theme,
      createdAt: group.createdAt,
      members: group.members,
      expenses: group.expenses,
      activities: group.activities || [],
    },
    summary: {
      totalExpenses: group.expenses.reduce((sum, e) => sum + e.amount, 0),
      expenseCount: group.expenses.length,
      memberCount: group.members.length,
      memberBalances: balances,
    },
    settlements: settlements,
  };
};

/**
 * Formats data for ODS/Excel export (requires additional processing)
 */
export const generateODSData = (group, balances, settlements) => {
  return {
    sheets: {
      'Expenses': {
        headers: [
          'Date',
          'Description',
          'Amount',
          'Paid By',
          'Split Members',
        ],
        data: group.expenses.map(expense => {
          const paidByMember = group.members.find(m => m.id === expense.paidBy);
          const splitMemberNames = expense.splitWith
            .map(id => group.members.find(m => m.id === id)?.name)
            .join(', ');

          return [
            moment(expense.date).format('YYYY-MM-DD'),
            expense.description,
            expense.amount,
            paidByMember?.name,
            splitMemberNames,
          ];
        }),
      },
      'Summary': {
        headers: ['Member', 'Balance', 'Owes', 'Owed At'],
        data: group.members.map(member => [
          member.name,
          balances[member.id] || 0,
          Math.min(balances[member.id] || 0, 0) * -1,
          Math.max(balances[member.id] || 0, 0),
        ]),
      },
      'Settlements': {
        headers: ['From', 'To', 'Amount'],
        data: settlements.map(s => {
          const fromMember = group.members.find(m => m.id === s.from);
          const toMember = group.members.find(m => m.id === s.to);
          return [fromMember?.name, toMember?.name, s.amount];
        }),
      },
    },
  };
};
