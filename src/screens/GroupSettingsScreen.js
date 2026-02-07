import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { t } from '../utils/i18n';

const GroupSettingsScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const {
    groups,
    addMember,
    removeMember,
    updateMemberName,
    profile,
  } = useContext(AppContext);

  const group = groups.find(g => g.id === groupId);
  const [addMemberModal, setAddMemberModal] = useState({ show: false, name: '' });
  const [editMemberModal, setEditMemberModal] = useState({ show: false, memberId: null, name: '' });

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Group not found</Text>
      </View>
    );
  }

  const handleAddMember = () => {
    setAddMemberModal({ show: true, name: '' });
  };

  const confirmAddMember = () => {
    if (addMemberModal.name.trim()) {
      addMember(groupId, addMemberModal.name);
      setAddMemberModal({ show: false, name: '' });
    }
  };

  const handleEditMember = (member) => {
    setEditMemberModal({ show: true, memberId: member.id, name: member.name });
  };

  const confirmEditMember = () => {
    if (editMemberModal.name.trim()) {
      updateMemberName(groupId, editMemberModal.memberId, editMemberModal.name);
      setEditMemberModal({ show: false, memberId: null, name: '' });
    }
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
      </View>
      <View style={styles.memberActions}>
        <TouchableOpacity 
          onPress={() => handleEditMember(item)}
          style={styles.memberActionBtn}
        >
          <MaterialIcons name="edit" size={18} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              t('confirmDeleteMember'),
              `"${item.name}"?`,
              [
                { text: t('cancel'), style: 'cancel' },
                { 
                  text: t('delete'), 
                  style: 'destructive',
                  onPress: () => removeMember(groupId, item.id)
                }
              ]
            );
          }}
          style={styles.memberActionBtn}
        >
          <MaterialIcons name="close" size={18} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('managemembers')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          {group.members.length === 0 ? (
            <Text style={styles.emptyText}>{t('noMembers')}</Text>
          ) : (
            <FlatList
              data={group.members}
              renderItem={renderMember}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Add Member Modal */}
      <Modal
        visible={addMemberModal.show}
        transparent
        animationType="fade"
        onRequestClose={() => setAddMemberModal({ show: false, name: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('addMember')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('memberName')}
              placeholderTextColor="#999"
              value={addMemberModal.name}
              onChangeText={(name) => setAddMemberModal({ ...addMemberModal, name })}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setAddMemberModal({ show: false, name: '' })}
              >
                <Text style={styles.cancelModalBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addMemberModalBtn, { backgroundColor: group.theme }]}
                onPress={confirmAddMember}
              >
                <Text style={styles.addMemberModalBtnText}>{t('add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        visible={editMemberModal.show}
        transparent
        animationType="fade"
        onRequestClose={() => setEditMemberModal({ show: false, memberId: null, name: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('editMember')}</Text>
            <Text style={styles.modalLabel}>{t('memberName')}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t('memberName')}
              placeholderTextColor="#999"
              value={editMemberModal.name}
              onChangeText={(name) => setEditMemberModal({ ...editMemberModal, name })}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setEditMemberModal({ show: false, memberId: null, name: '' })}
              >
                <Text style={styles.cancelModalBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addMemberModalBtn, { backgroundColor: group.theme }]}
                onPress={confirmEditMember}
              >
                <Text style={styles.addMemberModalBtnText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#2196F3' }]}
        onPress={handleAddMember}
      >
        <MaterialIcons name="person-add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBackBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginVertical: 16,
  },
  memberItem: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  memberActionBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelModalBtnText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addMemberModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addMemberModalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default GroupSettingsScreen;
