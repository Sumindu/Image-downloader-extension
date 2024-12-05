export const handleImageDownload = async (imageData, format, settings) => {
  try {
    const timestamp = new Date().getTime();
    const filename = settings?.namePattern
      ? settings.namePattern.replace('{timestamp}', timestamp)
      : `image_${timestamp}.${format.toLowerCase()}`;

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