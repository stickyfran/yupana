# Installation Guide - Yupana CuentasClaras

## Prerequisites

Before installing Yupana, ensure you have the following installed:

### Required
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Optional (for native development)
- **Expo CLI** - Will be installed automatically via setup script
- **Xcode** (macOS, for iOS development)
- **Android Studio** (for Android development)

## Installation Steps

### Method 1: Automated Setup (Recommended)

#### Windows Users
Double-click `setup.bat` to start the installation process, or run in PowerShell:
```powershell
.\setup.bat
```

#### macOS/Linux Users
Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

### Method 2: Manual Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install Expo CLI globally (optional but recommended):**
```bash
npm install -g expo-cli
```

3. **Verify installation:**
```bash
npm list
expo --version
```

## Starting the App

### Development Server
```bash
npm start
```

This will open the Expo CLI interface with a QR code.

### Run on Different Platforms

#### iOS
```bash
npm run ios
```
(Requires macOS with Xcode installed)

#### Android
```bash
npm run android
```
(Requires Android Studio or Android emulator installed)

#### Web
```bash
npm run web
```
(Opens in default browser)

### Using Expo Go App (Easiest for Testing)

1. Download **Expo Go** app on your iOS or Android device
2. Run `npm start`
3. Scan the QR code with your device
4. App opens automatically in Expo Go

## Project Structure

```
yupana/
├── src/
│   ├── navigation/          # App navigation (RootNavigator)
│   ├── screens/             # Screen components (Groups, Profile, Settings)
│   ├── context/             # Global state (AppContext)
│   ├── components/          # Reusable components (AddExpenseModal, ActivityLog)
│   └── utils/               # Utilities (settlements, export/import)
├── App.js                   # App entry point
├── app.json                 # Expo configuration
├── package.json             # Dependencies
├── README.md                # Project documentation
└── .github/
    └── copilot-instructions.md  # Development guidelines
```

## Troubleshooting

### "expo: command not found"
```bash
npm install -g expo-cli
```

### "npm ERR! ERESOLVE unable to resolve dependency"
```bash
npm install --legacy-peer-deps
```

### Port 8081 already in use (Android)
```bash
npm start -- --port 8082
```

### Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Android emulator not starting
```bash
npx react-native doctor  # Check for issues
```

## Development Setup

### Recommended Tools
- **Visual Studio Code** - Code editor
- **React Native Tools** - VS Code extension
- **Expo CLI** - Command line tool
- **Git** - Version control

### Environment Variables (Optional)
Create `.env` file in root directory:
```
EXPO_PUBLIC_API_URL=http://your-api-url
```

## Debugging

### Debug Logs
The app has built-in debug logging. Access via:
1. Go to Settings tab
2. Select "Debug & Logs"
3. View last 50 logs

### Console Logging
```bash
npm start
# Press 'j' to open debugger in browser
```

### React DevTools (Optional)
```bash
npm install -g react-devtools
react-devtools
```

## Building for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

Requires [EAS CLI](https://github.com/expo/eas-cli) and Expo account.

## Getting Help

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **GitHub Issues**: Report bugs and feature requests
- **Discussion**: Check existing issues for solutions

## Next Steps

1. ✅ Install dependencies
2. ✅ Start the development server
3. 🎮 Try creating a group and adding expenses
4. 📖 Read [README.md](./README.md) for feature overview
5. 💻 Check [Development Guidelines](./.github/copilot-instructions.md)

Enjoy using Yupana! 🎉
