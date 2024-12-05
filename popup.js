document.addEventListener('DOMContentLoaded', async () => {
    // Load saved settings
    const settings = await chrome.storage.sync.get({
        defaultFormat: 'png',
        namePattern: 'image_{timestamp}',
        askLocation: true,
        showDownloadButton: true  // Add new default setting
    });

    // Set initial values
    document.getElementById('defaultFormat').value = settings.defaultFormat;
    document.getElementById('namePattern').value = settings.namePattern;
    document.getElementById('askLocation').checked = settings.askLocation;
    document.getElementById('showDownloadButton').checked = settings.showDownloadButton;

    // Save settings when changed
    const saveSettings = async () => {
        const namePattern = document.getElementById('namePattern').value;
        
        // Remove any existing file extensions from the pattern
        const cleanPattern = namePattern.replace(/\.[^/.]+$/, "");
        
        const newSettings = {
            defaultFormat: document.getElementById('defaultFormat').value,
            namePattern: cleanPattern,
            askLocation: document.getElementById('askLocation').checked,
            showDownloadButton: document.getElementById('showDownloadButton').checked
        };

        await chrome.storage.sync.set(newSettings);
        // Notify content script about the change
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'SETTINGS_UPDATED',
                payload: newSettings
            });
        });
        showStatus('Settings saved!');
    };

    // Add event listeners
    document.getElementById('defaultFormat').addEventListener('change', saveSettings);
    document.getElementById('namePattern').addEventListener('change', saveSettings);
    document.getElementById('askLocation').addEventListener('change', saveSettings);
    document.getElementById('showDownloadButton').addEventListener('change', saveSettings);
});

// Show status message
function showStatus(message, isError = false) {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.style.color = isError ? '#dc3545' : '#28a745';
    setTimeout(() => {
        statusElement.textContent = '';
    }, 3000);
}

// Listen for error messages from background script
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'ERROR') {
        showStatus(message.payload, true);
    }
});