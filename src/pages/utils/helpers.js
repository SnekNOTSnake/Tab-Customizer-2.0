import { openDB } from 'idb';

export const readerFactory = (valueToRead, operation) => {
	const promise = new Promise((resolve, reject) => {
		const reader = new FileReader();
		switch (operation) {
			// From buffer to DataURL
			case 'readAsDataURL':
				reader.readAsDataURL(new Blob([valueToRead]));
				break;

			case 'readAsArrayBuffer':
				reader.readAsArrayBuffer(new Blob([valueToRead]));
				break;

			default:
				reject('No operation is provided');
				break;
		}
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error);
	});
	return promise;
};

const openReq = openDB('newTab2', 1);

export const idbAction = {
	get: async (store, key, noConversion = false) => {
		const getReq = (await openReq).get(store, key);
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
			const tx = (await openReq).transaction(store, 'readonly');
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
		const prevData = await (await openReq).get(store, key);
		delete prevData.primaryKey;
		return (await openReq).put(store, { ...prevData, ...val }, key);
	},

	add: async (store, val) => (await openReq).add(store, val),
	delete: async (store, key) => (await openReq).delete(store, key),
	clear: async (store) => (await openReq).clear(store),

	keys: async (store, index = null, key = null) => {
		if (index) return (await openReq).getAllKeysFromIndex(store, index, key);
		return (await openReq).getAllKeys(store);
	},
};

export const FileWithURL = function (file, url, additionalProps = null) {
	if (additionalProps) {
		Object.keys(additionalProps).forEach((key) => {
			this[key] = additionalProps[key];
		});
	}
	const fileInfo = {
		lastModified: file.lastModified,
		lastModifiedDate: file.lastModifiedDate,
		name: file.name,
		size: file.size,
		type: file.type,
	};
	this.imageInfo = fileInfo;
	this.image = url;
};
