let showDownloadButton = true; // Default state

// Load initial settings
chrome.storage.sync.get({
    showDownloadButton: true
}, (settings) => {
    showDownloadButton = settings.showDownloadButton;
    updateButtonVisibility();
});

const updateButtonVisibility = () => {
    const buttons = document.querySelectorAll('.ext-download-btn');
    buttons.forEach(button => {
        button.style.display = showDownloadButton ? 'block' : 'none';
    });
};

const createDownloadButton = () => {
  const button = document.createElement('button');
  button.className = 'ext-download-btn';
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  `;
  return button;
};

const addDownloadButtons = () => {
  if (!showDownloadButton) return;

  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (img.width < 50 || img.height < 50) return; // Skip tiny images
    
    if (!img.parentNode.classList.contains('ext-download-btn-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'ext-download-btn-wrapper';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      
      const button = createDownloadButton();
      wrapper.appendChild(button);

      button.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const settings = await chrome.storage.sync.get({
          defaultFormat: 'png',
          namePattern: 'image_{timestamp}',
          askLocation: true
        });

        chrome.runtime.sendMessage({
          type: 'DOWNLOAD_IMAGE',
          payload: {
            imageUrl: img.src,
            format: settings.defaultFormat,
            settings: settings
          }
        });
      });
    }
  });
};

// Listen for settings changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SETTINGS_UPDATED') {
        showDownloadButton = message.payload.showDownloadButton;
        updateButtonVisibility();
    }
});

// Initial setup
addDownloadButtons();

// Watch for dynamically added images
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length) {
      addDownloadButtons();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});