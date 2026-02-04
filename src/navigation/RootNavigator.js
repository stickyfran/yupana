import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

// Screens
import GroupsScreen from '../screens/GroupsScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import GroupSettingsScreen from '../screens/GroupSettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const GroupsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="GroupsList"
        component={GroupsScreen}
      />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
      />
      <Stack.Screen
        name="GroupSettings"
        component={GroupSettingsScreen}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="SettingsPage"
        component={SettingsScreen}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <GroupsStack />
    </NavigationContainer>
  );
};
