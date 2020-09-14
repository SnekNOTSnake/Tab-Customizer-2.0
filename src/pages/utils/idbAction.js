import { openDB } from 'idb';
import readerFactory from './readerFactory';

const openDb = () => {
	return new Promise((resolve, reject) => {
		try {
			openDB('newTab2', 1).then((db) => {
				resolve(db);
			});
		} catch (err) {
			reject(err);
		}
	});
};

const idbAction = {
	get: async (store, key, noConversion = false) => {
		const db = await openDb();
		const getReq = db.get(store, key);
		if (noConversion) return getReq;
		return new Promise(async (resolve, reject) => {
			const data = await getReq;
			const image = await readerFactory(data.image, 'readAsDataURL');
			resolve({ ...data, image });
		});
	},

	getAll: (
		store,
		index = null,
		noConversion = false,
		key = null,
		page = 1,
		limit = 1000
	) => {
		return new Promise(async (resolve, reject) => {
			const db = await openDb();
			const tx = db.transaction(store, 'readonly');
			const dataContainer = [];

			// Whether uses index or not
			let cursor;
			if (!index) cursor = await tx.store.openCursor(key);
			else cursor = await tx.store.index(index).openCursor(key);

			let hasAdvanced = false;
			let numberOfItems = 0;
			const advanceNumber = (page - 1) * limit;
			while (cursor && numberOfItems < limit) {
				// Skip for pagination
				if (advanceNumber && !hasAdvanced) {
					hasAdvanced = true;
					cursor = await cursor.advance(advanceNumber);
				} else {
					dataContainer.push({ ...cursor.value, key: cursor.primaryKey });
					cursor = await cursor.continue();
					numberOfItems++;
				}
			}

			// No conversion
			if (noConversion) return resolve(dataContainer);
			resolve(
				await Promise.all(
					dataContainer.map(async (item) => {
						const image = await readerFactory(item.image, 'readAsDataURL');
						return { ...item, image };
					})
				)
			);
		});
	},
	put: async (store, key, val) => {
		const db = await openDb();
		const prevData = await db.get(store, key);
		delete prevData.primaryKey;
		return db.put(store, { ...prevData, ...val }, key);
	},

	add: async (store, val) => {
		const db = await openDb();
		return db.add(store, val);
	},
	delete: async (store, key) => {
		const db = await openDb();
		return db.delete(store, key);
	},
	clear: async (store) => {
		const db = await openDb();
		return db.clear(store);
	},

	keys: async (store, index = null, key = null) => {
		const db = await openDb();
		if (index) return db.getAllKeysFromIndex(store, index, key);
		return db.getAllKeys(store);
	},
};

export default idbAction;
