export const processImage = async (imageUrl, targetFormat) => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create an image element
    const img = new Image();
    const imageLoadPromise = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
    });

    img.src = URL.createObjectURL(blob);
    await imageLoadPromise;

    // Create canvas and context
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    // Draw image to canvas
    ctx.drawImage(img, 0, 0);

    // Convert to desired format
    const mimeType = `image/${targetFormat.toLowerCase()}`;
    const quality = 0.92; // High quality by default
    
    return canvas.toDataURL(mimeType, quality);
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`);
  }
};