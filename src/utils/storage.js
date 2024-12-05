export const getStorageData = async (key) => {
  try {
    const result = await chrome.storage.sync.get(key);
    return result[key];
  } catch (error) {
    console.error('Storage access error:', error);
    return null;
  }
};

export const setStorageData = async (key, value) => {
  try {
    await chrome.storage.sync.set({ [key]: value });
    return true;
  } catch (error) {
    console.error('Storage write error:', error);
    return false;
  }
};