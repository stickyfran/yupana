import moment from 'moment';
import { t } from './i18n';

export const groupExpensesByDate = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return [];
  }

  // Sort expenses by date (newest first)
  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const grouped = {};

  sorted.forEach(expense => {
    const expenseDate = moment(expense.date);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');
    const weekAgo = moment().subtract(7, 'day').startOf('day');

    let groupKey;
    let groupLabel;

    if (expenseDate.isSame(today, 'day')) {
      groupKey = 'today';
      groupLabel = t('today') + ' - ' + expenseDate.format('DD/MM/YY');
    } else if (expenseDate.isSame(yesterday, 'day')) {
      groupKey = 'yesterday';
      groupLabel = t('yesterday') + ' - ' + expenseDate.format('DD/MM/YY');
    } else if (expenseDate.isAfter(weekAgo)) {
      groupKey = 'lastweek';
      groupLabel = t('lastWeek');
    } else {
      groupKey = expenseDate.format('DD/MM/YYYY');
      groupLabel = expenseDate.format('DD/MM/YY');
    }

    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        label: groupLabel,
        sortOrder: getSortOrder(groupKey),
        expenses: [],
      };
    }

    grouped[groupKey].expenses.push(expense);
  });

  // Sort groups by sort order
  return Object.values(grouped).sort((a, b) => a.sortOrder - b.sortOrder);
};

const getSortOrder = (groupKey) => {
  const order = {
    'today': 0,
    'yesterday': 1,
    'lastweek': 2,
  };
  return order[groupKey] !== undefined ? order[groupKey] : 3;
};
