import React, { useContext, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import ProfileScreen from './ProfileScreen';
import SettingsScreen from './SettingsScreen';
import { t } from '../utils/i18n';

const GroupsScreen = ({ navigation }) => {
  const { groups, createGroup, deleteGroup, profile } = useContext(AppContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, groupId: null, groupName: '' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    createGroup(groupName);
    setGroupName('');
    setShowCreateForm(false);
  };

  const handleDeleteGroup = (groupId, name) => {
    setDeleteModal({ show: true, groupId, groupName: name });
  };

  const confirmDelete = () => {
    if (deleteModal.groupId) {
      deleteGroup(deleteModal.groupId);
      setDeleteModal({ show: false, groupId: null, groupName: '' });
    }
  };

  const handleImportGroup = () => {
    try {
      const importedData = JSON.parse(importJson);
      if (importedData.id && importedData.name && importedData.members && importedData.expenses) {
        createGroup(importedData.name, importedData);
        setImportJson('');
        setShowImportModal(false);
        alert(t('groupImported'));
      } else {
        alert(t('invalidJson'));
      }
    } catch (error) {
      alert(t('parseError') + ': ' + error.message);
    }
  };

  const renderGroupItem = ({ item }) => {
    // Calculate total expended in the group
    const totalExpended = item.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return (
      <TouchableOpacity
        style={[styles.groupCard, { borderLeftColor: item.theme }]}
        onPress={() =>
          navigation.navigate('GroupDetail', {
            groupId: item.id,
            groupName: item.name,
          })
        }
      >
        <View style={styles.groupContent}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupInfo}>
            {item.members.length} {t('members')} - {item.expenses.length} {t('expenses')}
          </Text>
        </View>
        <View style={styles.groupAmountSection}>
          <View style={styles.totalAmountBox}>
            <Text style={styles.totalAmountLabel}>{t('total')}</Text>
            <Text style={styles.totalAmountValue}>${totalExpended.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteGroup(item.id, item.name)}
            style={styles.deleteBtn}
          >
            <MaterialIcons name="delete" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="account-balance-wallet" size={28} color="white" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Yupana</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={() => setShowImportModal(true)}
            style={styles.headerBtn}
          >
            <MaterialIcons name="file-download" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="groups"
              size={64}
              color="#ccc"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.emptyText}>No groups yet</Text>
            <Text style={styles.emptySubtext}>
              Create a group to start tracking expenses
            </Text>
          </View>
        ) : (
          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#2196F3' }]}
        onPress={() => setShowCreateForm(!showCreateForm)}
      >
        <MaterialIcons
          name={showCreateForm ? 'close' : 'group-add'}
          size={28}
          color="white"
        />
      </TouchableOpacity>

      {showCreateForm && (
        <View style={styles.createForm}>
          <Text style={styles.formTitle}>{t('createGroup')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            placeholderTextColor="#999"
            value={groupName}
            onChangeText={setGroupName}
          />
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.createBtn, { backgroundColor: profile.theme }]}
              onPress={handleCreateGroup}
            >
              <Text style={styles.createBtnText}>{t('create')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setGroupName('');
                setShowCreateForm(false);
              }}
            >
              <Text style={styles.cancelBtnText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={deleteModal.show}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModal({ show: false, groupId: null, groupName: '' })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('deleteGroup')}</Text>
            <Text style={styles.modalMessage}>
              {t('confirmDelete')} "{deleteModal.groupName}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setDeleteModal({ show: false, groupId: null, groupName: '' })}
              >
                <Text style={styles.cancelModalBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalBtn}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteModalBtnText}>{t('deleteGroup')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{t('profile')}</Text>
            <View style={{ width: 28 }} />
          </View>
          <ProfileScreen />
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View style={styles.fullScreenModal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <MaterialIcons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>{t('settings')}</Text>
            <View style={{ width: 28 }} />
          </View>
          <SettingsScreen />
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal
        visible={showImportModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowImportModal(false);
          setImportJson('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('importGroup')}</Text>
            <Text style={styles.modalLabel}>{t('pasteJson')}</Text>
            <TextInput
              style={[styles.modalInput, { height: 150, textAlignVertical: 'top' }]}
              placeholder="Paste the JSON here"
              placeholderTextColor="#999"
              value={importJson}
              onChangeText={setImportJson}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => {
                  setShowImportModal(false);
                  setImportJson('');
                }}
              >
                <Text style={styles.cancelModalBtnText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.importModalBtn}
                onPress={handleImportGroup}
              >
                <Text style={styles.importModalBtnText}>{t('import')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerBtn: {
    padding: 8,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    backgroundColor: '#2196F3',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  groupCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupInfo: {
    fontSize: 13,
    color: '#666',
  },
  groupAmountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },
  totalAmountBox: {
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 2,
  },
  totalAmountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  deleteBtn: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1000,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  createForm: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  createBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
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
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
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
  deleteModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
  },
  deleteModalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
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
  importModalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  importModalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default GroupsScreen;
