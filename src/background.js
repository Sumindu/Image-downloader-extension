// Context Menu Setup
const setupContextMenu = () => {
  // Remove existing menu items
  chrome.contextMenus.removeAll();

  // Create parent menu item
  chrome.contextMenus.create({
    id: 'save-image',
    title: 'Save Image As...',
    contexts: ['image']
  });

  // Create format options
  const formats = ['PNG', 'JPEG', 'WebP'];
  formats.forEach(format => {
    chrome.contextMenus.create({
      id: `save-image-as-${format.toLowerCase()}`,
      parentId: 'save-image',
      title: format,
      contexts: ['image']
    });
  });
};

// Helper function to convert blob to data URL
const blobToDataURL = async (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
    reader.readAsDataURL(blob);
  });
};

// Image Processing
const processImage = async (imageUrl, targetFormat) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create an offscreen canvas
    const offscreenCanvas = new OffscreenCanvas(1, 1);
    const ctx = offscreenCanvas.getContext('2d');

    // Create an image bitmap
    const imageBitmap = await createImageBitmap(blob);

    // Resize the canvas to the image size
    offscreenCanvas.width = imageBitmap.width;
    offscreenCanvas.height = imageBitmap.height;

    // Draw the image bitmap to the canvas
    ctx.drawImage(imageBitmap, 0, 0);

    // Convert to desired format
    const mimeType = `image/${targetFormat.toLowerCase()}`;
    const quality = 0.92; // High quality by default
    
    const processedBlob = await offscreenCanvas.convertToBlob({ type: mimeType, quality });
    return await blobToDataURL(processedBlob); // Convert blob to data URL
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};

// Download Handler
const handleImageDownload = async (imageData, format, settings) => {
  try {
    const timestamp = new Date().getTime();
    let filename = settings?.namePattern
      ? settings.namePattern.replace('{timestamp}', timestamp)
      : `image_${timestamp}`;
    
    // Ensure filename has correct extension
    const extension = format.toLowerCase();
    if (!filename.toLowerCase().endsWith(`.${extension}`)) {
      filename += `.${extension}`;
    }

    const downloadOptions = {
      filename: filename,
      url: imageData,
      saveAs: settings?.askLocation ?? true
    };

    const downloadId = await chrome.downloads.download(downloadOptions);
    return downloadId;
  } catch (error) {
    throw new Error(`Download failed: ${error.message}`);
  }
};

// Storage Functions
const getStorageData = async (key) => {
  try {
    const result = await chrome.storage.sync.get(key);
    return result[key];
  } catch (error) {
    console.error('Storage access error:', error);
    return null;
  }
};

// Initialize context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId.startsWith('save-image-')) {
    const format = info.menuItemId.split('-')[3];
    
    // Fetch all settings
    const settings = await chrome.storage.sync.get({
      defaultFormat: 'png',
      namePattern: 'image_{timestamp}',
      askLocation: true
    });
    
    try {
      const processedImage = await processImage(info.srcUrl, format);
      await handleImageDownload(processedImage, format, settings);
    } catch (error) {
      console.error('Error processing image:', error);
      chrome.runtime.sendMessage({
        type: 'ERROR',
        payload: error.message
      });
    }
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'DOWNLOAD_IMAGE') {
    const { imageUrl, format, settings } = message.payload;
    
    processImage(imageUrl, format)
      .then(processedImage => handleImageDownload(processedImage, format, settings))
      .catch(error => {
        console.error('Error processing image:', error);
        chrome.runtime.sendMessage({
          type: 'ERROR',
          payload: error.message
        });
      });
  }
});