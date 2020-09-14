import { openDB } from 'idb';
import createThumbnail from './createThumbnail';

// Default values
import {
	getInitBackgrounds,
	getInitShortcuts,
	chromeOptions,
} from 'DefaultValues';

// Installer
const install = async () => {
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
			console.log('upgrade');
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

	// Dynamic Import
	const initBgs2 = await Promise.all(
		initBgs.map(async (el) => {
			const thumbnail = await createThumbnail(el.image);
			return { ...el, thumbnail };
		})
	);

	// Add all initial Shortcuts
	{
		const tx = db.transaction('shortcuts', 'readwrite');
		await Promise.all([...initScs.map((sc) => tx.store.add(sc)), tx.done]);
	}

	// Add all initial Backgrounds
	{
		const tx = db.transaction('backgrounds', 'readwrite');
		await Promise.all([...initBgs2.map((bg) => tx.store.add(bg)), tx.done]);
	}
};

export default install;
