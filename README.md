
# Image Downloader & Converter Extension

A Chrome extension that allows you to easily download and convert images from any webpage in various formats (PNG, JPEG, WebP).

## Features

- 🖼️ Download images in multiple formats (PNG, JPEG, WebP)
- 🔄 Quick download button overlay on images
- 📁 Customizable file naming patterns
- ⚙️ Configurable save location prompt
- 📱 Responsive and user-friendly interface
- 🖱️ Right-click context menu integration

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

### Quick Download Button
- Hover over any image to see the download button in the top-right corner
- Click the button to download the image using current settings

### Context Menu
- Right-click on any image
- Select "Save Image As..." from the context menu
- Choose your desired format (PNG, JPEG, WebP)

### Settings
Access settings by clicking the extension icon in the toolbar:

- **Default Format**: Choose the default format for quick downloads
- **File Name Pattern**: Customize file names (supports {timestamp} variable)
- **Save Location**: Toggle "Always ask for save location"
- **Download Button**: Toggle the visibility of quick download buttons

## Configuration

### File Naming Pattern
- Use `{timestamp}` in the pattern to include Unix timestamp
- Example: `image_{timestamp}` becomes `image_1234567890`

### Supported Image Formats
- PNG (lossless)
- JPEG (lossy)
- WebP (modern format, both lossy and lossless)

## Development

### Project Structure