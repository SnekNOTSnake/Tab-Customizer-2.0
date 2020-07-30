import cloneDeep from 'lodash.clonedeep';

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

export const idbAction = (
	storeName,
	actionName,
	value = '',
	options = { noConversion: false, page: 1, limit: 21, showNsfw: true }
) => {
	const promise = new Promise((resolve, reject) => {
		const openReq = indexedDB.open('newTab2');
		let tx, openedStore;
		openReq.onsuccess = async () => {
			const db = openReq.result;
			switch (actionName) {
				case 'getOne':
					if (!value) throw new Error('Key is required for `get` operation');
					tx = db.transaction(storeName, 'readonly');
					openedStore = tx.objectStore(storeName);
					const dataReq = openedStore.get(Number(value));
					dataReq.onsuccess = async () => {
						if (!dataReq.result) return resolve({});
						if (options.noConversion) return resolve(dataReq.result);
						const image = await readerFactory(
							dataReq.result.image,
							'readAsDataURL'
						);
						resolve({ ...dataReq.result, image });
					};
					dataReq.onerror = () => resolve(dataReq.error);
					break;

				case 'getAllKeys':
					tx = db.transaction(storeName, 'readonly');
					openedStore = tx.objectStore(storeName);
					let keysReq;
					if (options.showNsfw) {
						keysReq = openedStore.getAllKeys();
					} else {
						const indexStore = openedStore.index('safe_index');
						keysReq = indexStore.getAllKeys(1);
					}
					keysReq.onsuccess = () => {
						resolve(keysReq.result);
					};
					keysReq.onerror = () => reject(keysReq.error);
					break;

				case 'getAll':
					tx = db.transaction(storeName, 'readonly');
					openedStore = tx.objectStore(storeName);
					let index = 0;
					const keysReq2 = openedStore.getAllKeys();
					keysReq2.onsuccess = () => {
						const allDataReq = openedStore.openCursor();
						const dataContainer = [];
						let advanced = false;
						allDataReq.onsuccess = async () => {
							const cursor = allDataReq.result;
							// Skip
							const advanceNumber = (options.page - 1) * options.limit;
							if (advanceNumber && !advanced) {
								allDataReq.result.advance(advanceNumber);
								advanced = true;
							} else {
								// Continue
								if (cursor != null && index < options.limit) {
									dataContainer.push({
										...cursor.value,
										key: cursor.primaryKey,
									});
									index++;
									cursor.continue();
								} else {
									if (options.noConversion) return resolve(dataContainer);
									const data = await Promise.all(
										dataContainer.map(async (el) => {
											const image = await readerFactory(
												el.image,
												'readAsDataURL'
											);
											return {
												...el,
												image,
											};
										})
									);
									resolve({ data, allKeys: keysReq2.result });
								}
							}
						};
					};
					keysReq2.onerror = () => reject('Something went wrong reading keys');
					break;

				case 'createOne':
					if (!value)
						throw new Error(
							'A third argument of value is required to perform creation'
						);
					tx = db.transaction(storeName, 'readwrite');
					openedStore = tx.objectStore(storeName);
					const createReq = openedStore.add(value);
					createReq.onsuccess = () => resolve(createReq.result);
					createReq.onerror = () => reject(createReq.error);
					break;

				case 'deleteOne':
					if (!value)
						throw new Error(
							'A third argument of key is required to perform deletion'
						);
					tx = db.transaction(storeName, 'readwrite');
					openedStore = tx.objectStore(storeName);
					const deleteReq = openedStore.delete(value);
					deleteReq.onsuccess = () => resolve(value);
					deleteReq.onerror = () => reject('Unable to delete');
					break;

				case 'updateOne':
					if (!value) throw new Error('Third argument is required for this');
					tx = db.transaction(storeName, 'readwrite');
					openedStore = tx.objectStore(storeName);
					const getReq = openedStore.get(Number(value.key));
					getReq.onsuccess = () => {
						const prevData = cloneDeep(getReq.result);
						delete prevData.primaryKey;
						const updateReq = openedStore.put(
							{ ...prevData, ...value.data },
							Number(value.key)
						);
						updateReq.onsuccess = () => resolve(value);
						updateReq.onerror = () => reject('Unable to update');
					};
					getReq.onerror = () => reject('Unable to update');
					break;

				default:
					reject('No operation is provided');
					break;
			}
		};
		openReq.onerror = () => reject(openReq.error);
	});
	return promise;
};
