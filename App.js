import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text, ScrollView } from 'react-native';
import { AppProvider, AppContext } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Global error handler to catch crashes
const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (error, isFatal) => {
      console.error('Global error:', error);
      setError({ message: error.toString(), stack: error.stack, isFatal });
    };

    const prevHandler = ErrorUtils.setGlobalHandler(errorHandler);
    
    return () => {
      ErrorUtils.setGlobalHandler(prevHandler);
    };
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f8d7da' }}>
        <ScrollView>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#721c24', marginBottom: 10 }}>
            App Crashed {error.isFatal ? '(Fatal)' : ''}
          </Text>
          <Text style={{ fontSize: 14, color: '#721c24', marginBottom: 10 }}>
            {error.message}
          </Text>
          <Text style={{ fontSize: 12, color: '#721c24', fontFamily: 'monospace' }}>
            {error.stack}
          </Text>
        </ScrollView>
      </View>
    );
  }

  return children;
};

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
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
