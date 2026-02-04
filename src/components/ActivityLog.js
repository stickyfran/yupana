import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { t } from '../utils/i18n';

export const ActivityLog = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'expense_added':
        return 'receipt';
      case 'member_added':
        return 'person-add';
      case 'member_removed':
        return 'person-remove';
      case 'member_renamed':
        return 'edit';
      case 'expense_deleted':
        return 'delete';
      case 'group_created':
        return 'group';
      default:
        return 'info';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'expense_added':
        return '#4CAF50';
      case 'member_added':
        return '#2196F3';
      case 'member_removed':
        return '#FF9800';
      case 'member_renamed':
        return '#9C27B0';
      case 'expense_deleted':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const getActivityDescription = (item) => {
    switch (item.type) {
      case 'member_added':
        return `${item.author} ${t('memberAdded')} ${item.member}`;
      case 'member_removed':
        return `${item.author} ${t('memberRemoved')} ${item.member}`;
      case 'member_renamed':
        return `${item.author} ${t('memberRenamed')} ${item.oldName} ${t('to')} ${item.newName}`;
      case 'expense_added':
        return `${item.author} ${t('expenseAdded')} ${item.expense} (${item.amount})`;
      case 'expense_deleted':
        return `${item.author} ${t('expenseDeleted')} ${item.expense}`;
      case 'expense_edited':
        return `${item.author} ${t('expenseEdited')} ${item.expense} (${item.amount})`;
      default:
        return item.description || '';
    }
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityItem}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: getActivityColor(item.type) },
        ]}
      >
        <MaterialIcons
          name={getActivityIcon(item.type)}
          size={20}
          color="white"
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{getActivityDescription(item)}</Text>
        <Text style={styles.activityTime}>
          {moment(item.timestamp).format('MMM D, YYYY h:mm A')}
        </Text>
        <Text style={styles.activityAuthor}>{t('by')} {item.author}</Text>
      </View>
    </View>
  );

  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="history" size={48} color="#ccc" />
        <Text style={styles.emptyText}>{t('noActivities')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={activities.sort(
        (a, b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
      )}
      renderItem={renderActivity}
      keyExtractor={item => item.id}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  activityAuthor: {
    fontSize: 11,
    color: '#bbb',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#999',
  },
});
