import { Platform, NativeModules } from 'react-native';
import * as Localization from 'expo-localization';

const getDeviceLanguage = () => {
  let locale = 'en';
  
  try {
    // Try expo-localization first (works on all platforms)
    if (Localization.locale) {
      locale = Localization.locale;
    } else if (Platform.OS === 'ios') {
      locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
               NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
               'en';
    } else if (Platform.OS === 'android') {
      locale = NativeModules.I18nManager?.localeIdentifier || 'en';
    }
  } catch (error) {
    console.warn('Error getting device language:', error);
    locale = 'en';
  }
  
  return locale.toLowerCase();
};

const deviceLanguage = getDeviceLanguage();
const isSpanish = deviceLanguage.startsWith('es');

const translations = {
  en: {
    // Header
    yupana: 'Yupana',
    
    // Group Detail
    balanceTotal: 'Total Balance',
    whoOwesWho: 'Who Owes Who',
    expenses: 'Expenses',
    paidBy: 'Paid by',
    splitBetween: 'Split between',
    owesTo: 'owes to',
    members: 'members',
    total: 'Total',
    allSettled: 'All settled!',
    noExpenses: 'No expenses yet',
    
    // Add/Edit Expense
    addExpense: 'Add Expense',
    editExpense: 'Edit Expense',
    expenseDetails: 'Expense Details',
    description: 'Description',
    amount: 'Amount',
    whoPaid: 'Who Paid?',
    splitBetweenLabel: 'Split Between',
    saveChanges: 'Save Changes',
    deleteExpense: 'Delete Expense',
    
    // Groups Screen
    createGroup: 'Create Group',
    groupName: 'Group Name',
    create: 'Create',
    cancel: 'Cancel',
    noGroups: 'No groups yet',
    tapToCreate: 'Tap + to create your first group',
    deleteGroup: 'Delete Group',
    confirmDelete: 'Are you sure you want to delete',
    
    // Members
    addMember: 'Add Member',
    memberName: 'Member Name',
    editMember: 'Edit Member',
    deleteMember: 'Delete Member',
    
    // Activity
    activityHistory: 'Activity History',
    noActivity: 'No activity yet',
    
    // Profile & Settings
    profile: 'Profile',
    settings: 'Settings',
    yourName: 'Your Name',
    save: 'Save',
    debugLogs: 'Debug & Logs',
    clearLogs: 'Clear Logs',
    
    // Import/Export
    importGroup: 'Import Group',
    pasteJson: 'Paste Group JSON:',
    import: 'Import',
    groupImported: 'Group imported successfully!',
    invalidJson: 'Invalid group JSON format. Missing required fields.',
    parseError: 'Failed to parse JSON',
    
    // Common
    today: 'Today',
    yesterday: 'Yesterday',
    lastWeek: 'Last Week',
    
    // Group Settings
    groupSettings: 'Group Settings',
    managemembers: 'Manage Members',
    noMembers: 'No members yet',
    confirmDeleteMember: 'Delete member',
    
    // Activity types
    memberAdded: 'added member',
    memberRemoved: 'removed member',
    memberRenamed: 'renamed',
    to: 'to',
    expenseAdded: 'added expense',
    expenseDeleted: 'deleted expense',
    expenseEdited: 'edited expense',
    by: 'by',
    noActivities: 'No activities yet',
  },
  es: {
    // Header
    yupana: 'Yupana',
    
    // Group Detail
    balanceTotal: 'Balance Total',
    whoOwesWho: 'Quién Debe a Quién',
    expenses: 'Gastos',
    paidBy: 'Pagado por',
    splitBetween: 'Dividido entre',
    owesTo: 'debe a',
    members: 'miembros',
    total: 'Total',
    allSettled: '¡Todo liquidado!',
    noExpenses: 'Sin gastos aún',
    
    // Add/Edit Expense
    addExpense: 'Añadir Gasto',
    editExpense: 'Editar Gasto',
    expenseDetails: 'Detalles del Gasto',
    description: 'Descripción',
    amount: 'Monto',
    whoPaid: '¿Quién Pagó?',
    splitBetweenLabel: 'Dividir Entre',
    saveChanges: 'Guardar Cambios',
    deleteExpense: 'Eliminar Gasto',
    
    // Groups Screen
    createGroup: 'Crear Grupo',
    groupName: 'Nombre del Grupo',
    create: 'Crear',
    cancel: 'Cancelar',
    noGroups: 'Sin grupos aún',
    tapToCreate: 'Toca + para crear tu primer grupo',
    deleteGroup: 'Eliminar Grupo',
    confirmDelete: '¿Estás seguro de que quieres eliminar',
    
    // Members
    addMember: 'Añadir Miembro',
    memberName: 'Nombre del Miembro',
    editMember: 'Editar Miembro',
    deleteMember: 'Eliminar Miembro',
    
    // Activity
    activityHistory: 'Historial de Actividad',
    noActivity: 'Sin actividad aún',
    
    // Profile & Settings
    profile: 'Perfil',
    settings: 'Configuración',
    yourName: 'Tu Nombre',
    save: 'Guardar',
    debugLogs: 'Depuración y Registros',
    clearLogs: 'Limpiar Registros',
    
    // Import/Export
    importGroup: 'Importar Grupo',
    pasteJson: 'Pegar JSON del Grupo:',
    import: 'Importar',
    groupImported: '¡Grupo importado exitosamente!',
    invalidJson: 'Formato JSON del grupo inválido. Faltan campos requeridos.',
    parseError: 'Error al analizar JSON',
    
    // Common
    today: 'Hoy',
    yesterday: 'Ayer',
    lastWeek: 'Última Semana',
    
    // Group Settings
    groupSettings: 'Configuración del Grupo',
    managemembers: 'Gestionar Miembros',
    noMembers: 'Sin miembros aún',
    confirmDeleteMember: 'Eliminar miembro',
    
    // Activity types
    memberAdded: 'añadió miembro',
    memberRemoved: 'eliminó miembro',
    memberRenamed: 'renombró',
    to: 'a',
    expenseAdded: 'añadió gasto',
    expenseDeleted: 'eliminó gasto',
    expenseEdited: 'editó gasto',
    by: 'por',
    noActivities: 'Sin actividades aún',
  }
};

const currentLanguage = isSpanish ? 'es' : 'en';

export const t = (key) => {
  return translations[currentLanguage][key] || key;
};

export const getCurrentLanguage = () => currentLanguage;
