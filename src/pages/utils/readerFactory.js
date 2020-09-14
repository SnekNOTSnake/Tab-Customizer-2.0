const readerFactory = (valueToRead, operation) => {
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
		reader.onerror = () => reject('Error while reading file', reader.error);
	});
	return promise;
};

export default readerFactory;
