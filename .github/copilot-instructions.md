# Yupana - CuentasClaras Development Guidelines

## Project Overview
Yupana is a React Native Expo app for expense splitting in groups. It features:
- Offline-first architecture using AsyncStorage
- Group management with dynamic members
- Automatic balance and settlement calculations
- Activity/audit logging
- Profile customization with themes
- Data export functionality
- Built-in debug logs

## Architecture

### State Management
- **AppContext** (`src/context/AppContext.js`) - Central state for all app data
- Uses React Context API for simplicity and no external dependencies
- All data persisted to AsyncStorage automatically

### Navigation
- Bottom Tab Navigation with 3 main sections
- Stack navigation for group detail flows
- Dynamic header titles based on route params

### Key Algorithms
- **Settlement Calculation** (`src/utils/settlements.js`) - Greedy algorithm to find minimum transactions
- Handles complex multi-person debts efficiently

## Development Workflow

### Adding New Features
1. Update AppContext if new state is needed
2. Create screen component in `src/screens/`
3. Add navigation in RootNavigator if needed
4. Add debug logging via `addDebugLog()` function

### Working with Data
- All data is stored in AsyncStorage and synced with Context
- Changes to `groups` or `profile` state auto-save
- Debug logs are limited to 1000 entries for performance

### Component Pattern
```javascript
const { dataFromContext, functionFromContext } = useContext(AppContext);
```

## Testing Checklist
- [ ] Create a group with 3+ members
- [ ] Add expenses with different payers
- [ ] Verify balance calculations
- [ ] Test settlement suggestions
- [ ] Check activity log
- [ ] Change profile theme
- [ ] Export group data
- [ ] Review debug logs

## Common Tasks

### Adding a New Context Function
1. Add function to AppContext
2. Include in `value` object export
3. Document what it does
4. Add debug log calls

### Modifying State Structure
1. Update AppContext initialization
2. Update saveGroups/saveProfile functions
3. Ensure backward compatibility
4. Add data migration if needed

### Adding a New Screen
1. Create in `src/screens/ScreenName.js`
2. Add to RootNavigator or stack
3. Pass required props via route.params
4. Connect to AppContext for data

## Dependencies
- **react-navigation** - Tab and stack navigation
- **@react-native-async-storage/async-storage** - Persistent storage
- **@expo/vector-icons** - Material Design icons
- **uuid** - Unique ID generation
- **moment** - Date formatting

## Future Enhancements
- Cloud sync with backend
- Recurring expenses
- Multiple currencies
- Push notifications
- Social sharing
- Budget tracking

## Debugging
Enable debug logs in Settings > Debug & Logs to see:
- All state changes
- Data load/save operations
- User actions
- Errors and warnings

---

For questions, refer to README.md or review similar implementations in the codebase.
