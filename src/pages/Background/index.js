// Default values
import {
	getInitBackgrounds,
	getInitShortcuts,
	chromeOptions,
} from '../../assets/defaultValues';
import { idbAction } from '../utils/helpers';

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
chrome.runtime.onInstalled.addListener(() => {
	// Set chrome options
	chrome.storage.sync.set({ ...chromeOptions });
	chrome.browserAction.setBadgeText({
		text: chromeOptions.showNsfw ? 'ON' : '',
	});

	const openRequest = indexedDB.open('newTab2', 1);

	openRequest.onsuccess = async () => {
		// Shortcuts
		const scs = await getInitShortcuts();
		scs.forEach((shortcut) => {
			idbAction('shortcuts', 'createOne', shortcut);
		});

		// Backgrounds
		const bgs = await getInitBackgrounds();
		bgs.forEach((background) => {
			idbAction('backgrounds', 'createOne', background);
		});
	};

	openRequest.onupgradeneeded = () => {
		const db = openRequest.result;
		db.createObjectStore('shortcuts', { autoIncrement: true });
		const bgs = db.createObjectStore('backgrounds', { autoIncrement: true });
		bgs.createIndex('safe_index', 'safe');
	};

	openRequest.onerror = () => {
		console.error(openRequest.error);
	};
});
