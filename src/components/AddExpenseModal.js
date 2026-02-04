import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const AddExpenseModal = ({
  visible,
  groupMembers,
  onClose,
  onAdd,
  themeColor,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(groupMembers[0]?.id || '');
  const [selectedMembers, setSelectedMembers] = useState(
    groupMembers.map(m => m.id)
  );
  const [useEqual, setUseEqual] = useState(true);
  const [customSplits, setCustomSplits] = useState({});

  const toggleMember = memberId => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(m => m !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAddExpense = () => {
    if (!description.trim() || !amount.trim() || !paidBy) {
      alert('Please fill in all fields');
      return;
    }

    const expenseAmount = parseFloat(amount);
    const splitAmounts = useEqual
      ? selectedMembers.map(() => expenseAmount / selectedMembers.length)
      : selectedMembers.map(m => parseFloat(customSplits[m] || 0));

    onAdd({
      description: description.trim(),
      amount: expenseAmount,
      paidBy,
      splitWith: selectedMembers,
      splitAmounts,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy(groupMembers[0]?.id || '');
    setSelectedMembers(groupMembers.map(m => m.id));
    setUseEqual(true);
    setCustomSplits({});
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={[styles.header, { backgroundColor: themeColor }]}>
          <Text style={styles.title}>Add Expense</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dinner"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInput}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Paid By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {groupMembers.map(member => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberButton,
                    paidBy === member.id && {
                      backgroundColor: themeColor,
                    },
                  ]}
                  onPress={() => setPaidBy(member.id)}
                >
                  <Text
                    style={[
                      styles.memberButtonText,
                      paidBy === member.id && { color: 'white' },
                    ]}
                  >
                    {member.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.splitHeader}>
              <Text style={styles.label}>Split</Text>
              <View style={styles.splitToggle}>
                <Text style={styles.splitToggleLabel}>
                  {useEqual ? 'Equal' : 'Custom'}
                </Text>
                <Switch
                  value={!useEqual}
                  onValueChange={() => setUseEqual(!useEqual)}
                />
              </View>
            </View>

            {groupMembers.map(member => (
              <View key={member.id} style={styles.memberSplit}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleMember(member.id)}
                >
                  {selectedMembers.includes(member.id) && (
                    <MaterialIcons name="check" size={20} color={themeColor} />
                  )}
                </TouchableOpacity>
                <Text style={styles.memberName}>{member.name}</Text>
                {!useEqual && selectedMembers.includes(member.id) && (
                  <TextInput
                    style={styles.customSplitInput}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={customSplits[member.id] || ''}
                    onChangeText={val =>
                      setCustomSplits(prev => ({
                        ...prev,
                        [member.id]: val,
                      }))
                    }
                  />
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: themeColor }]}
            onPress={handleAddExpense}
          >
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  memberButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  memberButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  splitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  splitToggleLabel: {
    fontSize: 12,
    color: '#666',
  },
  memberSplit: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  customSplitInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
