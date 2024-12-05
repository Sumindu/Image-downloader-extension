export const setupContextMenu = () => {
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