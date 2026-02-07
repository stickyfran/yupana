import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateSettlements } from '../utils/settlements';
import { t } from '../utils/i18n';

// Simple UUID v4 generator (pure JS, no native dependencies)
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [profile, setProfile] = useState({ name: 'User', theme: '#6200ee' });
  const [debugLogs, setDebugLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadAppData();
  }, []);

  // Save groups to AsyncStorage
  useEffect(() => {
    if (!loading) {
      saveGroups();
    }
  }, [groups]);

  // Save profile to AsyncStorage
  useEffect(() => {
    if (!loading) {
      saveProfile();
    }
  }, [profile]);

  const loadAppData = async () => {
    try {
      const [groupsData, profileData, logsData] = await Promise.all([
        AsyncStorage.getItem('groups'),
        AsyncStorage.getItem('profile'),
        AsyncStorage.getItem('debugLogs'),
      ]);

      if (groupsData) setGroups(JSON.parse(groupsData));
      if (profileData) setProfile(JSON.parse(profileData));
      if (logsData) setDebugLogs(JSON.parse(logsData));
    } catch (error) {
      addDebugLog('Error loading app data', 'error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveGroups = async () => {
    try {
      await AsyncStorage.setItem('groups', JSON.stringify(groups));
      addDebugLog('Groups saved', 'info');
    } catch (error) {
      addDebugLog('Error saving groups', 'error', error.message);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      addDebugLog('Profile saved', 'info');
    } catch (error) {
      addDebugLog('Error saving profile', 'error', error.message);
    }
  };

  const addDebugLog = (title, level = 'info', message = '') => {
    const timestamp = new Date().toISOString();
    const log = { timestamp, title, level, message, id: generateUUID() };
    setDebugLogs(prev => {
      const updated = [log, ...prev];
      if (updated.length > 1000) updated.pop();
      AsyncStorage.setItem('debugLogs', JSON.stringify(updated));
      return updated;
    });
  };

  const createGroup = (groupName, importedData = null, initialMembers = []) => {
    if (importedData) {
      // Use imported data with a new ID
      const newGroup = {
        ...importedData,
        id: generateUUID(),
        createdAt: new Date().toISOString(),
      };
      setGroups(prev => [...prev, newGroup]);
      addDebugLog(`Group imported: ${newGroup.name}`, 'info');
      return newGroup;
    } else {
      // Create new empty group with optional initial members
      const membersWithIds = initialMembers.map(m => ({
        id: m.id || generateUUID(),
        name: m.name,
      }));
      
      const newGroup = {
        id: generateUUID(),
        name: groupName,
        theme: '#6200ee',
        members: membersWithIds,
        expenses: [],
        activities: [],
        createdAt: new Date().toISOString(),
      };
      setGroups(prev => [...prev, newGroup]);
      addDebugLog(`Group created: ${groupName} with ${membersWithIds.length} members`, 'info');
      return newGroup;
    }
  };

  const deleteGroup = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    setGroups(prev => prev.filter(g => g.id !== groupId));
    addDebugLog(`Group deleted: ${group?.name}`, 'info');
  };

  const updateGroupTheme = (groupId, theme) => {
    setGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, theme } : g))
    );
    addDebugLog('Group theme updated', 'info');
  };

  const addMember = (groupId, memberName) => {
    const newMember = {
      id: generateUUID(),
      name: memberName,
      addedAt: new Date().toISOString(),
    };
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? {
              ...g,
              members: [...g.members, newMember],
              activities: [
                ...g.activities,
                {
                  id: generateUUID(),
                  type: 'member_added',
                  author: profile.name,
                  member: memberName,
                  timestamp: new Date().toISOString(),
                  description: `${profile.name} ${t('memberAdded')} ${memberName}`,
                },
              ],
            }
          : g
      )
    );
    addDebugLog(`Member added: ${memberName}`, 'info');
  };

  const removeMember = (groupId, memberId) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const member = g.members.find(m => m.id === memberId);
          return {
            ...g,
            members: g.members.filter(m => m.id !== memberId),
            expenses: g.expenses.filter(
              e => e.paidBy !== memberId && !e.splitWith.includes(memberId)
            ),
            activities: [
              ...g.activities,
              {
                id: generateUUID(),
                type: 'member_removed',
                author: profile.name,
                member: member?.name,
                timestamp: new Date().toISOString(),
                description: `${profile.name} ${t('memberRemoved')} ${member?.name}`,
              },
            ],
          };
        }
        return g;
      })
    );
    addDebugLog('Member removed', 'info');
  };

  const updateMemberName = (groupId, memberId, newName) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const oldName = g.members.find(m => m.id === memberId)?.name;
          return {
            ...g,
            members: g.members.map(m =>
              m.id === memberId ? { ...m, name: newName } : m
            ),
            activities: [
              ...g.activities,
              {
                id: generateUUID(),
                type: 'member_renamed',
                author: profile.name,
                memberId,
                oldName,
                newName,
                timestamp: new Date().toISOString(),
                description: `${profile.name} ${t('memberRenamed')} ${oldName} ${t('to')} ${newName}`,
              },
            ],
          };
        }
        return g;
      })
    );
    addDebugLog(`Member renamed`, 'info');
  };

  const addExpense = (groupId, description, amount, paidBy, splitWith, splitAmounts) => {
    const newExpense = {
      id: generateUUID(),
      description,
      amount,
      paidBy,
      splitWith,
      splitAmounts,
      date: new Date().toISOString(),
    };
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const paidByMember = g.members.find(m => m.id === paidBy)?.name;
          return {
            ...g,
            expenses: [...g.expenses, newExpense],
            activities: [
              ...g.activities,
              {
                id: generateUUID(),
                type: 'expense_added',
                author: profile.name,
                expense: description,
                amount,
                paidBy: paidByMember,
                timestamp: new Date().toISOString(),
                description: `${profile.name} ${t('expenseAdded')} ${description} (${amount})`,
              },
            ],
          };
        }
        return g;
      })
    );
    addDebugLog(`Expense added: ${description} (${amount})`, 'info');
  };

  const deleteExpense = (groupId, expenseId) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const expense = g.expenses.find(e => e.id === expenseId);
          return {
            ...g,
            expenses: g.expenses.filter(e => e.id !== expenseId),
            activities: [
              ...g.activities,
              {
                id: generateUUID(),
                type: 'expense_deleted',
                author: profile.name,
                expense: expense?.description,
                timestamp: new Date().toISOString(),
                description: `${profile.name} ${t('expenseDeleted')} ${expense?.description}`,
              },
            ],
          };
        }
        return g;
      })
    );
    addDebugLog('Expense deleted', 'info');
  };

  const editExpense = (groupId, expenseId, description, amount, paidBy, splitWith, splitAmounts) => {
    setGroups(prev =>
      prev.map(g => {
        if (g.id === groupId) {
          const oldExpense = g.expenses.find(e => e.id === expenseId);
          const paidByMember = g.members.find(m => m.id === paidBy)?.name;
          return {
            ...g,
            expenses: g.expenses.map(e =>
              e.id === expenseId
                ? {
                    ...e,
                    description,
                    amount,
                    paidBy,
                    splitWith,
                    splitAmounts,
                    updatedAt: new Date().toISOString(),
                  }
                : e
            ),
            activities: [
              ...g.activities,
              {
                id: generateUUID(),
                type: 'expense_edited',
                author: profile.name,
                expense: description,
                amount,
                paidBy: paidByMember,
                timestamp: new Date().toISOString(),
                description: `${profile.name} ${t('expenseEdited')} ${description} (${amount})`,
              },
            ],
          };
        }
        return g;
      })
    );
    addDebugLog(`Expense edited: ${description} (${amount})`, 'info');
  };

  const getGroupBalances = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return {};

    const balances = {};
    group.members.forEach(m => {
      balances[m.id] = 0;
    });

    group.expenses.forEach(expense => {
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
      expense.splitWith.forEach((memberId, index) => {
        balances[memberId] =
          (balances[memberId] || 0) -
          (expense.splitAmounts ? expense.splitAmounts[index] : expense.amount / expense.splitWith.length);
      });
    });

    return balances;
  };

  const getSettlements = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];

    const balances = getGroupBalances(groupId);
    return calculateSettlements(balances);
  };

  const updateProfile = (newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    addDebugLog('Profile updated', 'info');
  };

  const clearDebugLogs = async () => {
    setDebugLogs([]);
    await AsyncStorage.setItem('debugLogs', JSON.stringify([]));
    addDebugLog('Debug logs cleared', 'info');
  };

  const exportGroupData = (groupId, format = 'json') => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return null;

    if (format === 'json') {
      return JSON.stringify(group, null, 2);
    }
    // ODS export will be handled by a separate utility
    return null;
  };

  const importGroupData = (jsonData) => {
    try {
      const importedGroup = JSON.parse(jsonData);
      if (!importedGroup.id || !importedGroup.name) {
        throw new Error('Invalid group data');
      }
      const existingGroup = groups.find(g => g.id === importedGroup.id);
      if (existingGroup) {
        throw new Error('Group already exists');
      }
      setGroups(prev => [...prev, importedGroup]);
      addDebugLog(`Group imported: ${importedGroup.name}`, 'info');
      return true;
    } catch (error) {
      addDebugLog('Error importing group', 'error', error.message);
      return false;
    }
  };

  const value = {
    groups,
    profile,
    debugLogs,
    loading,
    createGroup,
    deleteGroup,
    updateGroupTheme,
    addMember,
    removeMember,
    updateMemberName,
    addExpense,
    deleteExpense,
    editExpense,
    getGroupBalances,
    getSettlements,
    updateProfile,
    clearDebugLogs,
    addDebugLog,
    exportGroupData,
    importGroupData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
