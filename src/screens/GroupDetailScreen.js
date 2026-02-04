import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { AppContext } from '../context/AppContext';
import { ActivityLog } from '../components/ActivityLog';
import { groupExpensesByDate } from '../utils/expenseGrouping';
import { t } from '../utils/i18n';

const GroupDetailScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const {
    groups,
    addExpense,
    deleteExpense,
    editExpense,
    getGroupBalances,
    getSettlements,
    updateGroupTheme,
    profile,
  } = useContext(AppContext);

  const group = groups.find(g => g.id === groupId);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [addExpenseModal, setAddExpenseModal] = useState({
    show: false,
    description: '',
    amount: '',
    paidBy: null,
    splitWith: [],
  });
  const [editExpenseModal, setEditExpenseModal] = useState({
    show: false,
    expenseId: null,
    description: '',
    amount: '',
    paidBy: null,
    splitWith: [],
  });

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const balances = getGroupBalances(groupId) || {};
  const balancesArray = Object.keys(balances).map(memberId => ({
    memberId,
    balance: balances[memberId]
  }));
  const settlements = getSettlements(groupId) || [];



  const handleEditExpense = (expense) => {
    setEditExpenseModal({
      show: true,
      expenseId: expense.id,
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      splitWith: [...expense.splitWith],
      splitAmounts: expense.splitAmounts ? [...expense.splitAmounts] : [],
    });
  };

  const confirmEditExpense = () => {
    const amount = parseFloat(editExpenseModal.amount);
    if (
      editExpenseModal.description.trim() &&
      amount > 0 &&
      editExpenseModal.paidBy &&
      editExpenseModal.splitWith.length > 0
    ) {
      // Calculate split amounts equally
      const splitAmounts = editExpenseModal.splitWith.map(() => 
        parseFloat((amount / editExpenseModal.splitWith.length).toFixed(2))
      );

      editExpense(
        groupId,
        editExpenseModal.expenseId,
        editExpenseModal.description,
        amount,
        editExpenseModal.paidBy,
        editExpenseModal.splitWith,
        splitAmounts
      );
      setEditExpenseModal({
        show: false,
        expenseId: null,
        description: '',
        amount: '',
        paidBy: null,
        splitWith: [],
      });
    } else {
      alert('Please fill all fields: description, amount, who paid, and who it\'s split between');
    }
  };

  const handleAddExpense = () => {
    const amount = parseFloat(addExpenseModal.amount);
    if (
      addExpenseModal.description.trim() &&
      amount > 0 &&
      addExpenseModal.paidBy &&
      addExpenseModal.splitWith.length > 0
    ) {
      // Calculate split amounts equally
      const splitAmounts = addExpenseModal.splitWith.map(() => 
        parseFloat((amount / addExpenseModal.splitWith.length).toFixed(2))
      );

      addExpense(
        groupId,
        addExpenseModal.description,
        amount,
        addExpenseModal.paidBy,
        addExpenseModal.splitWith,
        splitAmounts
      );
      setAddExpenseModal({
        show: false,
        description: '',
        amount: '',
        paidBy: null,
        splitWith: [],
      });
    } else {
      alert('Please fill all fields: description, amount, who paid, and who it\'s split between');
    }
  };

  const renderExpense = ({ item }) => {
    const paidByMember = group.members.find(m => m.id === item.paidBy);
    const splitMembers = item.splitWith.map(id => group.members.find(m => m.id === id)?.name).filter(Boolean);
    const eachAmount = item.splitAmounts ? item.splitAmounts[0] : item.amount / item.splitWith.length;
    const expenseTime = moment(item.date);

    return (
      <TouchableOpacity 
        style={styles.expenseItem}
        onPress={() => handleEditExpense(item)}
        activeOpacity={0.7}
      >
        <View style={styles.expenseTimeBox}>
          <Text style={styles.expenseTime}>{expenseTime.format('HH:mm')}</Text>
        </View>
        <View style={styles.expenseContent}>
          <Text style={styles.expenseDesc}>{item.description}</Text>
          <Text style={styles.expenseSubtext}>
            {t('paidBy')} <Text style={styles.expenseName}>{paidByMember?.name}</Text>
          </Text>
          <View style={styles.expenseDivider} />
          <View style={styles.expenseBottomRow}>
            <Text style={styles.expenseSubtext}>
              {t('splitBetween')}{' '}
              <Text style={styles.expenseName}>
                {splitMembers.join(', ')}
              </Text>
            </Text>
            <Text style={styles.expenseTotalAmount}>${item.amount.toFixed(2)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderExpenseGroup = ({ item: group }) => (
    <View style={styles.expenseGroup}>
      <Text style={styles.groupDateLabel}>{group.label}</Text>
      <FlatList
        data={group.expenses}
        renderItem={renderExpense}
        keyExtractor={expense => expense.id}
        scrollEnabled={false}
      />
    </View>
  );

  const renderSettlement = ({ item }) => {
    const fromMember = group.members.find(m => m.id === item.from);
    const toMember = group.members.find(m => m.id === item.to);
    return (
      <View style={styles.settlementItem}>
        <Text style={styles.settlementText}>
          <Text style={styles.settlementFromName}>{fromMember?.name}</Text>
          <Text style={styles.settlementDebeA}> {t('owesTo')} </Text>
          <Text style={styles.settlementToName}>{toMember?.name}</Text>
        </Text>
        <Text style={styles.settlementAmount}>${item.amount.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleSection}>
          <Text style={styles.headerTitle}>{group.name}</Text>
          <Text style={styles.headerSubtitle}>
            {group.members.length} {t('members')} - {t('total')} ${group.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            onPress={() => {
              const groupData = JSON.stringify(group, null, 2);
              alert('Group JSON copied to clipboard:\n\n' + groupData);
            }}
            style={styles.headerBtn}
          >
            <MaterialIcons name="share" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowActivityModal(true)}
            style={styles.headerBtn}
          >
            <MaterialIcons name="history" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('GroupSettings', {
                groupId,
                groupName: group.name,
              })
            }
            style={styles.headerBtn}
          >
            <MaterialIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* SECTION 1: BALANCE TOTAL */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceCardTitle}>{t('balanceTotal')}</Text>
          {balancesArray.map(balance => (
            <View key={balance.memberId} style={styles.balanceRow}>
              <Text style={styles.balanceName}>
                {group.members.find(m => m.id === balance.memberId)?.name}
              </Text>
              <Text style={[
                styles.balanceAmount,
                balance.balance > 0 ? styles.balancePositive : styles.balanceNegative
              ]}>
                {balance.balance > 0 ? '+' : ''}${Math.abs(balance.balance).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* SECTION 2: WHO OWES WHO */}
        <View style={styles.settlementsCard}>
          <Text style={styles.settlementsCardTitle}>{t('whoOwesWho')}</Text>
          {settlements.length === 0 ? (
            <Text style={styles.emptyText}>{t('allSettled')}</Text>
          ) : (
            <FlatList
              data={settlements}
              renderItem={renderSettlement}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          )}
        </View>

        {/* SECTION 3: ALL EXPENSES */}
        <View style={styles.expensesSection}>
          <View style={styles.expensesHeader}>
            <Text style={styles.expensesSectionTitle}>{t('expenses')}</Text>
            <View style={styles.expenseCountBadge}>
              <Text style={styles.expenseCountText}>{group.expenses.length}</Text>
            </View>
          </View>
          {group.expenses.length === 0 ? (
            <Text style={styles.emptyText}>{t('noExpenses')}</Text>
          ) : (
            <FlatList
              data={groupExpensesByDate(group.expenses)}
              renderItem={renderExpenseGroup}
              keyExtractor={(item, index) => `${item.label}-${index}`}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#2196F3' }]}
        onPress={() => setAddExpenseModal({
          show: true,
          description: '',
          amount: '',
          paidBy: group.members[0]?.id || null,
          splitWith: group.members.map(m => m.id),
        })}
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Activity Modal */}
      <Modal
        visible={showActivityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActivityModal(false)}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowActivityModal(false)}>
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{t('activityHistory')}</Text>
            <View style={{ width: 28 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            <ActivityLog activities={group.activities || []} />
          </ScrollView>
        </View>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        visible={addExpenseModal.show}
        animationType="slide"
        onRequestClose={() =>
          setAddExpenseModal({
            show: false,
            description: '',
            amount: '',
            paidBy: null,
            splitWith: [],
          })
        }
      >
        <View style={styles.fullScreenModalContainer}>
          {/* Header */}
          <View style={styles.editModalHeader}>
            <TouchableOpacity
              onPress={() =>
                setAddExpenseModal({
                  show: false,
                  description: '',
                  amount: '',
                  paidBy: null,
                  splitWith: [],
                })
              }
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.editModalHeaderTitle}>{t('addExpense')}</Text>
          </View>

          <ScrollView style={styles.editModalContent}>
            <Text style={styles.editSectionTitle}>{t('expenseDetails')}</Text>

            <Text style={styles.editLabel}>{t('description')}</Text>
            <TextInput
              style={styles.editInput}
              placeholder="Gasto"
              placeholderTextColor="#999"
              value={addExpenseModal.description}
              onChangeText={(description) =>
                setAddExpenseModal({ ...addExpenseModal, description })
              }
            />

            <Text style={styles.editLabel}>{t('amount')}</Text>
            <TextInput
              style={styles.editInput}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={addExpenseModal.amount}
              onChangeText={(amount) =>
                setAddExpenseModal({ ...addExpenseModal, amount })
              }
              keyboardType="decimal-pad"
            />

            <Text style={styles.editLabel}>{t('whoPaid')}</Text>
            <View style={styles.editMemberContainer}>
              {group.members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() =>
                    setAddExpenseModal({ ...addExpenseModal, paidBy: member.id })
                  }
                  style={styles.editMemberRow}
                >
                  <View style={[
                    styles.radioButton,
                    addExpenseModal.paidBy === member.id && styles.radioButtonSelected
                  ]}>
                    {addExpenseModal.paidBy === member.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.editMemberName}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.editLabel}>{t('splitBetweenLabel')}</Text>
            <View style={styles.editMemberContainer}>
              {group.members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => {
                    if (addExpenseModal.splitWith.includes(member.id)) {
                      setAddExpenseModal({
                        ...addExpenseModal,
                        splitWith: addExpenseModal.splitWith.filter(id => id !== member.id),
                      });
                    } else {
                      setAddExpenseModal({
                        ...addExpenseModal,
                        splitWith: [...addExpenseModal.splitWith, member.id],
                      });
                    }
                  }}
                  style={styles.editMemberRow}
                >
                  <View style={[
                    styles.checkbox,
                    addExpenseModal.splitWith.includes(member.id) && styles.checkboxSelected
                  ]}>
                    {addExpenseModal.splitWith.includes(member.id) && (
                      <MaterialIcons name="check" size={18} color="white" />
                    )}
                  </View>
                  <Text style={styles.editMemberName}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveChangesBtn}
              onPress={handleAddExpense}
            >
              <Text style={styles.saveChangesBtnText}>{t('addExpense')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        visible={editExpenseModal.show}
        animationType="slide"
        onRequestClose={() =>
          setEditExpenseModal({
            show: false,
            expenseId: null,
            description: '',
            amount: '',
            paidBy: null,
            splitWith: [],
          })
        }
      >
        <View style={styles.fullScreenModalContainer}>
          {/* Header */}
          <View style={styles.editModalHeader}>
            <TouchableOpacity
              onPress={() =>
                setEditExpenseModal({
                  show: false,
                  expenseId: null,
                  description: '',
                  amount: '',
                  paidBy: null,
                  splitWith: [],
                })
              }
              style={styles.backButton}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.editModalHeaderTitle}>{t('addExpense')}</Text>
          </View>

          <ScrollView style={styles.editModalContent}>
            <Text style={styles.editSectionTitle}>{t('expenseDetails')}</Text>

            <Text style={styles.editLabel}>{t('description')}</Text>
            <TextInput
              style={styles.editInput}
              placeholder="Gasto"
              placeholderTextColor="#999"
              value={editExpenseModal.description}
              onChangeText={(description) =>
                setEditExpenseModal({ ...editExpenseModal, description })
              }
            />

            <Text style={styles.editLabel}>{t('amount')}</Text>
            <TextInput
              style={styles.editInput}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={editExpenseModal.amount}
              onChangeText={(amount) =>
                setEditExpenseModal({ ...editExpenseModal, amount })
              }
              keyboardType="decimal-pad"
            />

            <Text style={styles.editLabel}>{t('whoPaid')}</Text>
            <View style={styles.editMemberContainer}>
              {group.members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() =>
                    setEditExpenseModal({ ...editExpenseModal, paidBy: member.id })
                  }
                  style={styles.editMemberRow}
                >
                  <View style={[
                    styles.radioButton,
                    editExpenseModal.paidBy === member.id && styles.radioButtonSelected
                  ]}>
                    {editExpenseModal.paidBy === member.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.editMemberName}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.editLabel}>{t('splitBetweenLabel')}</Text>
            <View style={styles.editMemberContainer}>
              {group.members.map(member => (
                <TouchableOpacity
                  key={member.id}
                  onPress={() => {
                    if (editExpenseModal.splitWith.includes(member.id)) {
                      setEditExpenseModal({
                        ...editExpenseModal,
                        splitWith: editExpenseModal.splitWith.filter(id => id !== member.id),
                      });
                    } else {
                      setEditExpenseModal({
                        ...editExpenseModal,
                        splitWith: [...editExpenseModal.splitWith, member.id],
                      });
                    }
                  }}
                  style={styles.editMemberRow}
                >
                  <View style={[
                    styles.checkbox,
                    editExpenseModal.splitWith.includes(member.id) && styles.checkboxSelected
                  ]}>
                    {editExpenseModal.splitWith.includes(member.id) && (
                      <MaterialIcons name="check" size={18} color="white" />
                    )}
                  </View>
                  <Text style={styles.editMemberName}>{member.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.saveChangesBtn}
              onPress={confirmEditExpense}
            >
              <Text style={styles.saveChangesBtnText}>{t('saveChanges')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteExpenseBtn}
              onPress={() => {
                deleteExpense(groupId, editExpenseModal.expenseId);
                setEditExpenseModal({
                  show: false,
                  expenseId: null,
                  description: '',
                  amount: '',
                  paidBy: null,
                  splitWith: [],
                });
              }}
            >
              <MaterialIcons name="delete" size={20} color="#d32f2f" />
              <Text style={styles.deleteExpenseBtnText}>{t('deleteExpense')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBackBtn: {
    padding: 8,
  },
  headerSettingsBtn: {
    padding: 8,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#6200ee',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#6200ee',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  balanceName: {
    fontSize: 16,
    color: '#333',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balancePositive: {
    color: '#4CAF50',
  },
  balanceNegative: {
    color: '#f44336',
  },
  settlementsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settlementsCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  expensesSection: {
    marginBottom: 32,
  },
  expensesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expensesSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  expenseCountBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: 'center',
  },
  expenseCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  expenseGroup: {
    marginBottom: 24,
  },
  groupDateLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  expenseItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,
    elevation: 2,
    position: 'relative',
  },
  expenseTimeBox: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  expenseContent: {
    flex: 1,
    paddingRight: 60,
  },
  expenseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 6,
  },
  expenseDesc: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  expenseTime: {
    fontSize: 14,
    color: '#999',
    fontWeight: '400',
  },
  expenseAmountBox: {
    alignItems: 'flex-end',
    marginLeft: 8,
    minWidth: 50,
  },
  expenseTotalLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  expenseTotalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  expenseSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    lineHeight: 20,
  },
  expenseName: {
    fontWeight: '600',
    color: '#333',
  },
  expenseDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  expenseBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  expensePerPersonSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flex: 1,
  },
  expensePerPersonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  expenseEachLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
    marginBottom: 2,
  },
  expenseEachAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  expenseActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionIcon: {
    padding: 3,
  },
  expenseActionsHidden: {
    position: 'absolute',
    bottom: -100,
    right: 16,
    flexDirection: 'row',
    gap: 4,
    opacity: 0,
  },
  settlementItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementText: {
    fontSize: 16,
    flex: 1,
  },
  settlementFromName: {
    fontWeight: 'bold',
    color: '#333',
  },
  settlementDebeA: {
    color: '#999',
  },
  settlementToName: {
    fontWeight: 'bold',
    color: '#333',
  },
  settlementAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 24,
  },
  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1000,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: '#2196F3',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 450,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  modalScrollContent: {
    flex: 1,
  },
  modalScrollContentInner: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  memberSelectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  memberSelectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  memberSelectBtnActive: {
    borderColor: 'transparent',
  },
  memberSelectText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  memberSelectTextActive: {
    color: 'white',
  },
  modalScrollContent: {
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelModalBtnText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addMemberModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addMemberModalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  editModalHeader: {
    backgroundColor: '#2196F3',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  editModalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  editModalContent: {
    flex: 1,
    padding: 20,
  },
  editSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 16,
  },
  editInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  editMemberContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  editMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  editMemberName: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#2196F3',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  saveChangesBtn: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  saveChangesBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteExpenseBtn: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  deleteExpenseBtnText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default GroupDetailScreen;
