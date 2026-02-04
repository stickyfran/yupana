# AppContext API Reference

Complete reference for all functions and state available in AppContext.

---

## 📚 Table of Contents
- [State](#state)
- [Group Functions](#group-functions)
- [Member Functions](#member-functions)
- [Expense Functions](#expense-functions)
- [Calculation Functions](#calculation-functions)
- [Profile Functions](#profile-functions)
- [Debug Functions](#debug-functions)
- [Export Functions](#export-functions)
- [Usage Examples](#usage-examples)

---

## State

### groups
**Type:** `Array<Group>`

Array of all groups in the app.

```javascript
const { groups } = useContext(AppContext);

groups.map(g => ({
  id: string,
  name: string,
  theme: string,
  members: Array<Member>,
  expenses: Array<Expense>,
  activities: Array<Activity>,
  createdAt: string
}))
```

### profile
**Type:** `Object`

User profile information.

```javascript
const { profile } = useContext(AppContext);

profile = {
  name: string,        // User's display name
  theme: string        // Hex color code
}
```

### debugLogs
**Type:** `Array<DebugLog>`

Array of debug log entries (max 1000).

```javascript
const { debugLogs } = useContext(AppContext);

debugLogs.map(log => ({
  id: string,
  timestamp: string,   // ISO timestamp
  title: string,
  level: 'info' | 'warning' | 'error' | 'success',
  message: string
}))
```

### loading
**Type:** `Boolean`

Indicates if app is loading data from storage.

```javascript
const { loading } = useContext(AppContext);
if (loading) return <LoadingScreen />;
```

---

## Group Functions

### createGroup(groupName)
**Parameters:** `groupName: string`  
**Returns:** `Group object`  
**Description:** Creates a new group.

```javascript
const { createGroup } = useContext(AppContext);

createGroup('My Group');
// Returns: { id: 'uuid', name: 'My Group', ... }
```

### deleteGroup(groupId)
**Parameters:** `groupId: string`  
**Returns:** `void`  
**Description:** Deletes a group and all its data.

```javascript
const { deleteGroup } = useContext(AppContext);

deleteGroup('group-id');
// Group and all related data deleted
```

### updateGroupTheme(groupId, theme)
**Parameters:** `groupId: string, theme: string (hex color)`  
**Returns:** `void`  
**Description:** Changes group's theme color.

```javascript
const { updateGroupTheme } = useContext(AppContext);

updateGroupTheme('group-id', '#FF6B6B');
// Group theme changed to red
```

---

## Member Functions

### addMember(groupId, memberName)
**Parameters:** `groupId: string, memberName: string`  
**Returns:** `void`  
**Description:** Adds a new member to a group.

```javascript
const { addMember } = useContext(AppContext);

addMember('group-id', 'Alice');
// Alice added to group
// Activity log entry created
```

### removeMember(groupId, memberId)
**Parameters:** `groupId: string, memberId: string`  
**Returns:** `void`  
**Description:** Removes a member from a group.
- Also removes related expenses
- Creates activity log entry
- Clears member's balance

```javascript
const { removeMember } = useContext(AppContext);

removeMember('group-id', 'member-id');
// Member removed and cleaned up
```

### updateMemberName(groupId, memberId, newName)
**Parameters:** `groupId: string, memberId: string, newName: string`  
**Returns:** `void`  
**Description:** Renames a member.

```javascript
const { updateMemberName } = useContext(AppContext);

updateMemberName('group-id', 'member-id', 'Alice Smith');
// Member renamed with activity log
```

---

## Expense Functions

### addExpense(groupId, description, amount, paidBy, splitWith, splitAmounts)

**Parameters:**
- `groupId: string` - Group ID
- `description: string` - Expense description
- `amount: number` - Total amount
- `paidBy: string` - Member ID who paid
- `splitWith: Array<string>` - Member IDs split between
- `splitAmounts: Array<number>` - Amount each person owes

**Returns:** `void`

**Description:** Adds a new expense to a group.

```javascript
const { addExpense } = useContext(AppContext);

addExpense(
  'group-id',
  'Dinner',
  45.00,
  'alice-id',
  ['alice-id', 'bob-id', 'carol-id'],
  [15, 15, 15]  // Equal split
);

// For custom split:
addExpense(
  'group-id',
  'Lunch',
  30.00,
  'bob-id',
  ['bob-id', 'alice-id'],
  [20, 10]  // Bob pays 20, Alice pays 10
);
```

### deleteExpense(groupId, expenseId)
**Parameters:** `groupId: string, expenseId: string`  
**Returns:** `void`  
**Description:** Removes an expense from a group.

```javascript
const { deleteExpense } = useContext(AppContext);

deleteExpense('group-id', 'expense-id');
// Expense deleted, activity logged
```

---

## Calculation Functions

### getGroupBalances(groupId)
**Parameters:** `groupId: string`  
**Returns:** `{[memberId: string]: number}`

**Description:** Calculates balance for each member.
- Positive = member is owed money
- Negative = member owes money
- Zero = settled

```javascript
const { getGroupBalances } = useContext(AppContext);

const balances = getGroupBalances('group-id');
// {
//   'alice-id': 20.50,    // Alice is owed $20.50
//   'bob-id': -15.00,     // Bob owes $15.00
//   'carol-id': -5.50     // Carol owes $5.50
// }
```

**Usage:**
```javascript
const balances = getGroupBalances(groupId);

member.balance = balances[memberId] || 0;

if (balance > 0) {
  // Person is owed money
  const text = `Owed: $${balance.toFixed(2)}`;
} else if (balance < 0) {
  // Person owes money
  const text = `Owes: $${Math.abs(balance).toFixed(2)}`;
}
```

### getSettlements(groupId)
**Parameters:** `groupId: string`  
**Returns:** `Array<{from: string, to: string, amount: number}>`

**Description:** Returns optimal payment settlements.
- Minimum number of transactions
- Settles all debts completely

```javascript
const { getSettlements } = useContext(AppContext);

const settlements = getSettlements('group-id');
// [
//   { from: 'alice-id', to: 'bob-id', amount: 25.00 },
//   { from: 'alice-id', to: 'carol-id', amount: 10.00 },
//   { from: 'dave-id', to: 'bob-id', amount: 5.00 }
// ]
```

**Algorithm:** Greedy matching of debtors to creditors

---

## Profile Functions

### updateProfile(newProfile)
**Parameters:** `newProfile: {name?: string, theme?: string}`  
**Returns:** `void`

**Description:** Updates user profile settings.

```javascript
const { updateProfile } = useContext(AppContext);

// Change name only
updateProfile({ name: 'Franco' });

// Change theme only
updateProfile({ theme: '#6200ee' });

// Change both
updateProfile({
  name: 'Franco',
  theme: '#FF6B6B'
});
```

---

## Debug Functions

### addDebugLog(title, level, message)

**Parameters:**
- `title: string` - Log title
- `level: 'info' | 'warning' | 'error' | 'success'` - Log level
- `message?: string` - Optional additional message

**Returns:** `void`

**Description:** Adds a debug log entry.

```javascript
const { addDebugLog } = useContext(AppContext);

// Simple log
addDebugLog('Expense added', 'success');

// With message
addDebugLog('Error creating group', 'error', 'Group name is empty');

// Info log
addDebugLog('User clicked settings', 'info');

// Warning
addDebugLog('Large dataset', 'warning', '500+ expenses loaded');
```

**Automatic Logging:** Already called by all CRUD operations

### clearDebugLogs()
**Parameters:** None  
**Returns:** `void`  
**Description:** Clears all debug logs.

```javascript
const { clearDebugLogs } = useContext(AppContext);

clearDebugLogs();
// All logs deleted, activity logged
```

---

## Export Functions

### exportGroupData(groupId, format)

**Parameters:**
- `groupId: string`
- `format: 'json' | 'ods'` - Export format

**Returns:** `string | null`

**Description:** Exports group data.

```javascript
const { exportGroupData } = useContext(AppContext);

// JSON export
const jsonData = exportGroupData('group-id', 'json');
// Returns: '{ "version": "1.0", "group": {...}, ... }'

// ODS export (Excel)
const odsData = exportGroupData('group-id', 'ods');
// Returns: formatted ODS data
```

### importGroupData(jsonString)

**Parameters:** `jsonString: string`  
**Returns:** `boolean` - Success status

**Description:** Imports group data from JSON.

```javascript
const { importGroupData } = useContext(AppContext);

const jsonString = '{"id":"...","name":"...","members":[...],...}';

if (importGroupData(jsonString)) {
  // Group imported successfully
} else {
  // Import failed
}
```

**Validation:**
- Checks for required fields
- Prevents duplicate group IDs
- Logs errors

---

## Usage Examples

### Example 1: Create Group and Add Members

```javascript
import { useContext } from 'react';
import { AppContext } from './context/AppContext';

export const GroupSetupExample = () => {
  const { createGroup, addMember } = useContext(AppContext);

  const setupGroup = () => {
    // Create group
    const group = createGroup('Roommates');
    const groupId = group.id;

    // Add members
    addMember(groupId, 'Alice');
    addMember(groupId, 'Bob');
    addMember(groupId, 'Carol');
  };

  return (
    <Button onPress={setupGroup} title="Setup Group" />
  );
};
```

### Example 2: Add Expense with Custom Split

```javascript
const { addExpense, groups } = useContext(AppContext);

const group = groups[0];
const alice = group.members.find(m => m.name === 'Alice');
const bob = group.members.find(m => m.name === 'Bob');

// Alice pays $50, split as: Bob owes $30, Alice owes $20
addExpense(
  group.id,
  'Dinner',
  50,
  alice.id,
  [alice.id, bob.id],
  [20, 30]
);
```

### Example 3: Calculate and Display Balances

```javascript
const { groups, getGroupBalances } = useContext(AppContext);

export const BalancesList = () => {
  const group = groups[0];
  const balances = getGroupBalances(group.id);

  return (
    <View>
      {group.members.map(member => {
        const balance = balances[member.id] || 0;
        return (
          <View key={member.id}>
            <Text>{member.name}</Text>
            <Text>
              {balance > 0
                ? `Owed: $${balance.toFixed(2)}`
                : `Owes: $${Math.abs(balance).toFixed(2)}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
```

### Example 4: Display Settlements

```javascript
const { groups, getSettlements } = useContext(AppContext);

export const SettlementsList = () => {
  const group = groups[0];
  const settlements = getSettlements(group.id);

  if (settlements.length === 0) {
    return <Text>All settled!</Text>;
  }

  return (
    <View>
      {settlements.map((settlement, index) => {
        const fromMember = group.members.find(m => m.id === settlement.from);
        const toMember = group.members.find(m => m.id === settlement.to);

        return (
          <View key={index}>
            <Text>
              {fromMember?.name} → {toMember?.name}: ${settlement.amount.toFixed(2)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
```

### Example 5: Complete CRUD Cycle

```javascript
const {
  createGroup,
  addMember,
  addExpense,
  getGroupBalances,
  updateMemberName,
  deleteExpense,
  deleteGroup
} = useContext(AppContext);

// Create
const group = createGroup('Vacation');

// Create (members)
addMember(group.id, 'Alice');
addMember(group.id, 'Bob');

// Create (expenses)
const members = group.members;
addExpense(
  group.id,
  'Hotel',
  200,
  members[0].id,
  [members[0].id, members[1].id],
  [100, 100]
);

// Read
const balances = getGroupBalances(group.id);
console.log(balances);

// Update
updateMemberName(group.id, members[0].id, 'Alice Smith');

// Delete
deleteExpense(group.id, group.expenses[0].id);

// Clean up
deleteGroup(group.id);
```

---

## Data Structures

### Group
```typescript
interface Group {
  id: string;
  name: string;
  theme: string;
  members: Member[];
  expenses: Expense[];
  activities: Activity[];
  createdAt: string;
}
```

### Member
```typescript
interface Member {
  id: string;
  name: string;
  addedAt: string;
}
```

### Expense
```typescript
interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;          // Member ID
  splitWith: string[];     // Member IDs
  splitAmounts: number[];
  date: string;
}
```

### Activity
```typescript
interface Activity {
  id: string;
  type: 'expense_added' | 'expense_deleted' | 'member_added' | 'member_removed' | 'member_renamed';
  author: string;
  timestamp: string;
  description: string;
  [key: string]: any;      // Additional type-specific fields
}
```

---

## Best Practices

1. **Always check loading state:**
```javascript
if (loading) return <LoadingScreen />;
```

2. **Get fresh references:**
```javascript
const group = groups.find(g => g.id === groupId);
```

3. **Handle empty states:**
```javascript
if (!group) return <Text>Group not found</Text>;
```

4. **Use findIndex for updates:**
```javascript
const groupIndex = groups.findIndex(g => g.id === groupId);
```

5. **Log important actions:**
```javascript
addDebugLog('Settlement calculated', 'success', `${settlements.length} transactions`);
```

---

## Debugging Tips

1. View all logs in Settings → Debug & Logs
2. Check Activity Log in each group
3. Log important state changes
4. Monitor performance with debug logs
5. Export data for analysis

---

**Last Updated:** January 26, 2024  
**Version:** 1.0.0

