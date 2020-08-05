import { openDB } from 'idb';

// Default values
import {
	getInitBackgrounds,
	getInitShortcuts,
	chromeOptions,
} from '../../assets/defaultValues';

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
chrome.runtime.onInstalled.addListener(async () => {
	// Set chrome options
	chrome.storage.sync.set({ ...chromeOptions });
	chrome.browserAction.setBadgeText({
		text: chromeOptions.showNsfw ? 'ON' : '',
	});

	// Fetch all of the initial files
	const initScs = await getInitShortcuts();
	const initBgs = await getInitBackgrounds();

	const db = await openDB('newTab2', 1, {
		// onupgradeneeded
		upgrade: (db) => {
			db.createObjectStore('shortcuts', { autoIncrement: true });
			const bgs = db.createObjectStore('backgrounds', { autoIncrement: true });
			bgs.createIndex('safe_index', 'safe');
		},

		// On blocks
		blocked: () =>
			window.alert(
				'One of the other tab has an older database version, please reload the tab'
			),
		blocking: () => window.alert('Database outdated, please reload'),

		// Terminated
		terminated: () => window.alert('Database opening abnormally terminated'),
	});

	// Add all initial Shortcuts
	{
		const tx = db.transaction('shortcuts', 'readwrite');
		await Promise.all([...initScs.map((sc) => tx.store.add(sc)), tx.done]);
	}

	// Add all initial Backgrounds
	{
		const tx = db.transaction('backgrounds', 'readwrite');
		await Promise.all([...initBgs.map((sc) => tx.store.add(sc)), tx.done]);
	}
});
