import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  Share,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { generateJSONExport } from '../utils/formatters';
import moment from 'moment';

const SettingsScreen = ({ route }) => {
  const { groupId } = route.params || {};
  const {
    groups,
    profile,
    debugLogs,
    clearDebugLogs,
    updateGroupTheme,
    exportGroupData,
    getGroupBalances,
    getSettlements,
  } = useContext(AppContext);

  const group = groupId ? groups.find(g => g.id === groupId) : null;
  const [showDebugLogs, setShowDebugLogs] = useState(false);

  const handleExportData = () => {
    if (group) {
      const balances = getGroupBalances(groupId);
      const settlements = getSettlements(groupId);
      const jsonData = generateJSONExport(group, balances, settlements);
      const jsonString = JSON.stringify(jsonData, null, 2);

      Share.share({
        message: jsonString,
        title: `${group.name} - Expenses Report`,
        url: 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonString),
      }).catch(error => {
        Alert.alert('Export Error', error.message);
      });
    }
  };

  const handleChangeGroupTheme = () => {
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

    Alert.alert(
      'Select Theme',
      '',
      [
        ...themes.map(color => ({
          text: '',
          onPress: () => updateGroupTheme(groupId, color),
          style: 'default',
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderDebugLog = ({ item }) => (
    <View style={[styles.logItem, getLevelColor(item.level)]}>
      <View style={styles.logContent}>
        <Text style={styles.logTitle}>{item.title}</Text>
        {item.message && (
          <Text style={styles.logMessage}>{item.message}</Text>
        )}
        <Text style={styles.logTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  const getLevelColor = level => {
    switch (level) {
      case 'error':
        return { borderLeftColor: '#ff6b6b', borderLeftWidth: 4 };
      case 'warning':
        return { borderLeftColor: '#ff9800', borderLeftWidth: 4 };
      case 'success':
        return { borderLeftColor: '#4CAF50', borderLeftWidth: 4 };
      default:
        return { borderLeftColor: '#6200ee', borderLeftWidth: 4 };
    }
  };

  return (
    <ScrollView style={styles.container}>
      {group && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Settings</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangeGroupTheme}
          >
            <View style={styles.settingContent}>
              <View
                style={[
                  styles.themePreview,
                  { backgroundColor: group.theme },
                ]}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Group Theme</Text>
                <Text style={styles.settingValue}>{group.name}</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingContent}>
              <MaterialIcons name="file-download" size={24} color="#666" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Export Group</Text>
                <Text style={styles.settingValue}>
                  Export as JSON or ODS
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug & Logs</Text>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setShowDebugLogs(!showDebugLogs)}
        >
          <View style={styles.settingContent}>
            <MaterialIcons name="bug-report" size={24} color="#666" />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>View Debug Logs</Text>
              <Text style={styles.settingValue}>
                {debugLogs.length} logs
              </Text>
            </View>
          </View>
          <MaterialIcons
            name={showDebugLogs ? 'expand-less' : 'expand-more'}
            size={24}
            color="#999"
          />
        </TouchableOpacity>

        {showDebugLogs && (
          <View style={styles.logContainer}>
            {debugLogs.length === 0 ? (
              <Text style={styles.emptyLog}>No debug logs yet</Text>
            ) : (
              <FlatList
                data={debugLogs.slice(0, 50)}
                renderItem={renderDebugLog}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            )}
            {debugLogs.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  Alert.alert(
                    'Clear Logs',
                    'Are you sure?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Clear',
                        onPress: () => clearDebugLogs(),
                        style: 'destructive',
                      },
                    ]
                  );
                }}
              >
                <MaterialIcons name="delete-forever" size={20} color="white" />
                <Text style={styles.clearBtnText}>Clear All Logs</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Version</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>App</Text>
          <Text style={styles.aboutValue}>Yupana - CuentasClaras</Text>
        </View>
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Build</Text>
          <Text style={styles.aboutValue}>Expo React Native</Text>
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
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 16,
  },
  settingText: {
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
  logContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logContent: {
    paddingLeft: 8,
  },
  logTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  logMessage: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  logTime: {
    fontSize: 10,
    color: '#999',
  },
  emptyLog: {
    textAlign: 'center',
    color: '#999',
    paddingVertical: 16,
  },
  clearBtn: {
    flexDirection: 'row',
    backgroundColor: '#ff6b6b',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  clearBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  aboutLabel: {
    fontSize: 14,
    color: '#666',
  },
  aboutValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
