import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportToJSON = async (data, filename) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const fileUri = `${FileSystem.documentDirectory}${filename}.json`;
    await FileSystem.writeAsStringAsync(fileUri, jsonString);
    return fileUri;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
};

export const shareFile = async (fileUri, filename) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: filename,
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    throw error;
  }
};

export const importFromJSON = async (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error importing JSON:', error);
    throw error;
  }
};
