import install from 'Utils/install';

// OnCommand
chrome.commands.onCommand.addListener((command) => {
	switch (command) {
		case 'toggle_nsfw':
			chrome.storage.sync.get({ showNsfw: false }, ({ showNsfw }) => {
				chrome.storage.sync.set({ showNsfw: !showNsfw }, () => {
					chrome.browserAction.setBadgeText({ text: !showNsfw ? 'ON' : '' });
				});
			});
			break;
		default:
			break;
	}
});

// OnInstall
chrome.runtime.onInstalled.addListener(install);
