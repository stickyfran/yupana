# Quick Reference Guide

## 🚀 Getting Started (Copy-Paste Commands)

### Windows
```bash
cd c:\Users\Franco\Desktop\Repo\yupana
.\setup.bat
npm start
```

### macOS/Linux
```bash
cd ~/Desktop/Repo/yupana
chmod +x setup.sh
./setup.sh
npm start
```

### Scan QR Code
Use Expo Go app on your phone to scan the QR code that appears

---

## 📱 App Navigation

### Tab Navigation
| Tab | Purpose |
|-----|---------|
| 🏠 **Groups** | Create and manage groups |
| 👤 **Profile** | Change name and theme |
| ⚙️ **Settings** | App settings and debug logs |

### Inside a Group
| Tab | Shows |
|-----|-------|
| 💰 **Expenses** | List of all expenses |
| 👥 **Members** | Members and their balances |
| ↔️ **Settle** | Who should pay whom |
| 📋 **Activity** | History of all changes |

---

## 🎯 Common Tasks

### Create a Group
1. Groups tab → **+** button → Enter name → Create

### Add Member
1. Open group → Members tab → **+ Member** → Enter name

### Add Expense
1. Open group → Expenses tab → **+ Expense** → Fill form

### View Who Owes What
1. Open group → Members tab → See balance next to name

### Get Payment Instructions
1. Open group → Settle tab → Follow the recommendations

### Export Group Data
1. Open group → ⚙️ Settings → Export Group → Share

### Change Theme
1. Profile tab → Select color
2. Or: Open group → Settings → Select color

### View Debug Logs
1. Settings tab → Debug & Logs → See logs

---

## 📊 File Locations

| What | Where |
|------|-------|
| App Logic | `src/context/AppContext.js` |
| Screens | `src/screens/*.js` |
| Components | `src/components/*.js` |
| Utilities | `src/utils/*.js` |
| Navigation | `src/navigation/RootNavigator.js` |
| Main Entry | `App.js` |

---

## 🔧 Common Commands

```bash
# Start development server
npm start

# Run on iOS (macOS only)
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web

# Install dependencies
npm install

# Update dependencies
npm update

# Clean cache
npm cache clean --force
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "expo: command not found" | `npm install -g expo-cli` |
| "Port already in use" | `npm start -- --port 8082` |
| "Dependencies error" | `npm install --legacy-peer-deps` |
| "App won't load" | `rm -rf node_modules && npm install` |
| "Can't find module" | `npm install` then restart |

---

## 💡 Key Functions (AppContext)

```javascript
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

// Get data and functions
const { 
  groups,           // Array of all groups
  profile,          // User profile {name, theme}
  debugLogs,        // Array of debug logs
  
  // Group management
  createGroup,      // (name) => void
  deleteGroup,      // (groupId) => void
  updateGroupTheme, // (groupId, color) => void
  
  // Members
  addMember,        // (groupId, name) => void
  removeMember,     // (groupId, memberId) => void
  
  // Expenses
  addExpense,       // (groupId, description, amount, paidBy, splitWith, splitAmounts) => void
  deleteExpense,    // (groupId, expenseId) => void
  
  // Calculations
  getGroupBalances, // (groupId) => {memberId: balance}
  getSettlements,   // (groupId) => [{from, to, amount}]
  
  // Profile
  updateProfile,    // (newProfile) => void
  
  // Debug
  addDebugLog,      // (title, level, message) => void
  clearDebugLogs,   // () => void
  
  // Export
  exportGroupData   // (groupId, format) => string
} = useContext(AppContext);
```

---

## 📈 Data Structures

### Group
```javascript
{
  id: "unique-id",
  name: "Roommates",
  theme: "#6200ee",
  members: [
    { id: "m1", name: "Alice", addedAt: "2024-01-26..." }
  ],
  expenses: [
    { id: "e1", description: "Dinner", amount: 45, 
      paidBy: "m1", splitWith: ["m1", "m2"], 
      splitAmounts: [22.5, 22.5], date: "2024-01-26..." }
  ],
  activities: [
    { id: "a1", type: "expense_added", author: "Alice",
      timestamp: "2024-01-26...", description: "Alice added expense..." }
  ]
}
```

### Balance Object
```javascript
{
  "member-id-1": 25.50,    // Positive = they're owed money
  "member-id-2": -10.00    // Negative = they owe money
}
```

### Settlement
```javascript
{
  from: "member-id-1",     // Who pays
  to: "member-id-2",       // Who receives
  amount: 25.50            // How much
}
```

---

## 🎨 Available Colors

```javascript
const colors = [
  "#6200ee",  // Purple (default)
  "#BB86FC",  // Light Purple
  "#03DAC6",  // Teal
  "#FF6B6B",  // Red
  "#4CAF50",  // Green
  "#FF9800",  // Orange
  "#2196F3",  // Blue
  "#E91E63"   // Pink
];
```

---

## 🧪 Test Scenarios

### Scenario 1: Simple Split
```
Alice pays $30 for dinner
Split equally among: Alice, Bob, Carol

Result:
- Alice paid $30, owes $10 → balance = +$20
- Bob owes $10 → balance = -$10
- Carol owes $10 → balance = -$10
```

### Scenario 2: Multiple Expenses
```
Expense 1: Alice pays $30 (split 3 ways)
Expense 2: Bob pays $20 (split 2 ways)

Balances:
- Alice: +20, -10 = +$10
- Bob: +10, -10 = $0
- Carol: -10, $0 = -$10
```

### Scenario 3: Complex Settlement
```
Alice: -$30, Bob: -$10
Carol: +$20, Dana: +$20

Optimal:
1. Alice → Carol: $20
2. Alice → Dana: $10
3. Bob → Dana: $10
```

---

## 🔄 App Lifecycle

```
1. App Starts
   ↓
2. AppContext Loads Data from AsyncStorage
   ↓
3. Navigation Initializes
   ↓
4. User Sees Groups Tab
   ↓
5. User Interactions
   ↓
6. Data Auto-Saves to AsyncStorage
   ↓
7. Debug Logs Recorded
   ↓
8. Activity Entries Added
```

---

## 📝 Editing Checklist

Before making changes:
- [ ] Understand the data structure
- [ ] Know which component to modify
- [ ] Check if AppContext needs updating
- [ ] Add debug logs for tracking
- [ ] Test on actual device/emulator
- [ ] Verify data persists
- [ ] Check activity log

---

## ⚡ Performance Tips

| Task | Tip |
|------|-----|
| Large groups | Split can handle 100+ members |
| Many expenses | Limit to 1000 for smooth UI |
| Debug logs | Auto-limited to 1000 entries |
| Themes | 8 colors available, minimal impact |
| Offline | Works indefinitely without network |

---

## 🚀 Production Ready Features

✅ Offline functionality  
✅ Data persistence  
✅ Activity audit trail  
✅ Error handling  
✅ Debug logging  
✅ Crash recovery  
✅ Input validation  
✅ Edge case handling  

---

## 📞 Quick Links

- **Docs:** See `README.md`
- **Setup:** See `INSTALLATION.md`
- **Details:** See `PROJECT_SUMMARY.md`
- **Changes:** See `CHANGELOG.md`
- **Dev Guidelines:** See `.github/copilot-instructions.md`

---

**Last Updated:** January 26, 2024  
**Version:** 1.0.0

