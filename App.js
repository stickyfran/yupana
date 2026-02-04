import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { AppProvider, AppContext } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function AppContent() {
  const { loading } = useContext(AppContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </AppProvider>
  );
}
