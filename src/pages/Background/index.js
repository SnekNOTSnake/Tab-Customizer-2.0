// Default values
import {
	getInitBackgrounds,
	getInitShortcuts,
} from '../../assets/defaultValues';
import { idbAction } from '../utils/helpers';

chrome.runtime.onInstalled.addListener(() => {
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
		db.createObjectStore('backgrounds', { autoIncrement: true });
	};

	openRequest.onerror = () => {
		console.error(openRequest.error);
	};
});
