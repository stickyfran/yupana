# Yupana - CuentasClaras

yupana/
├── src/
│   ├── navigation/
│   │   └── RootNavigator.js          # App navigation setup
│   ├── screens/
│   │   ├── GroupsScreen.js           # Groups list
│   │   ├── GroupDetailScreen.js      # Group management
│   │   ├── ProfileScreen.js          # User profile
│   │   └── SettingsScreen.js         # App settings
│   ├── context/
│   │   └── AppContext.js             # Global state
│   ├── components/
│   │   ├── AddExpenseModal.js        # Expense entry form
│   │   └── ActivityLog.js            # Activity timeline
│   └── utils/
│       ├── settlements.js            # Settlement algorithm
│       ├── exportImport.js           # File handling
│       └── formatters.js             # Data formatting
├── App.js                            # Entry point
├── app.json                          # Expo config
└── package.json                      # Dependencies
```

- **React Native 0.73**
- **Expo 50**
- **React Navigation 6**
- **AsyncStorage** (offline persistence)
- **UUID** (unique identifiers)
- **Moment.js** (date handling)
- **Material Icons** (UI icons)