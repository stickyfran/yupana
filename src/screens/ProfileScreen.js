import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

const ProfileScreen = () => {
  const { profile, updateProfile } = useContext(AppContext);
  const [editing, setEditing] = useState(false);

  const themes = [
    '#6200ee',
    '#BB86FC',
    '#03DAC6',
    '#FF6B6B',
    '#4CAF50',
    '#FF9800',
    '#2196F3',
    '#E91E63',
  ];

  const handleChangeTheme = color => {
    updateProfile({ theme: color });
  };

  const handleChangeName = () => {
    Alert.prompt(
      'Change Name',
      'Enter your new name:',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: name => {
            if (name?.trim()) {
              updateProfile({ name: name.trim() });
              setEditing(false);
            }
          },
        },
      ],
      'plain-text',
      profile.name
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: profile.theme },
          ]}
        >
          <Text style={styles.avatarText}>
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={handleChangeName}
        >
          <View style={styles.settingContent}>
            <MaterialIcons name="person" size={24} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Name</Text>
              <Text style={styles.settingValue}>{profile.name}</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        <View style={styles.themeGrid}>
          {themes.map((color, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.themeColor,
                {
                  backgroundColor: color,
                  borderWidth: profile.theme === color ? 3 : 0,
                  borderColor: '#333',
                },
              ]}
              onPress={() => handleChangeTheme(color)}
            >
              {profile.theme === color && (
                <MaterialIcons name="check" size={24} color="white" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>App Name</Text>
          <Text style={styles.infoValue}>Yupana - CuentasClaras</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeColor: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
