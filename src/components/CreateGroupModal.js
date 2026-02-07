import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { t } from '../utils/i18n';

export const CreateGroupModal = ({
  visible,
  onClose,
  onCreate,
  themeColor,
}) => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert(t('error'), t('enterMemberName'));
      return;
    }
    setMembers(prev => [...prev, { id: Date.now().toString(), name: newMemberName.trim() }]);
    setNewMemberName('');
  };

  const handleRemoveMember = (memberId) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert(t('error'), t('enterGroupName'));
      return;
    }

    onCreate({
      name: groupName.trim(),
      members: members,
    });

    // Reset form
    setGroupName('');
    setMembers([]);
    setNewMemberName('');
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <View style={[styles.header, { backgroundColor: themeColor }]}>
          <Text style={styles.title}>{t('createGroup')}</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('groupName')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('enterGroupName')}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{t('members')} ({members.length})</Text>
            
            {members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Text style={styles.memberName}>{member.name}</Text>
                <TouchableOpacity onPress={() => handleRemoveMember(member.id)}>
                  <MaterialIcons name="close" size={20} color="#999" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addMemberRow}>
              <TextInput
                style={styles.memberInput}
                placeholder={t('addMember')}
                value={newMemberName}
                onChangeText={setNewMemberName}
                onSubmitEditing={handleAddMember}
              />
              <TouchableOpacity
                style={[styles.addMemberBtn, { backgroundColor: themeColor }]}
                onPress={handleAddMember}
              >
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: themeColor }]}
            onPress={handleCreateGroup}
          >
            <Text style={styles.createButtonText}>{t('create')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    maxHeight: '90%',
    width: '100%',
    maxWidth: 500,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  addMemberRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  memberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addMemberBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
