import readerFactory from './readerFactory';

const createThumbnail = (file) => {
	return new Promise(async (resolve, reject) => {
		try {
			const targetWidth = 480;
			const targetHeight = 270;
			const actualImageURL = await readerFactory(file, 'readAsDataURL');
			const image = new Image();
			image.src = actualImageURL;
			image.onload = () => {
				const canvas = document.createElement('canvas');
				const ratio = image.naturalWidth / image.naturalHeight;
				let finalWidth, finalHeight;
				if (targetHeight * ratio <= targetWidth) {
					finalWidth = targetWidth;
					finalHeight = targetWidth / ratio;
				} else {
					finalWidth = targetHeight * ratio;
					finalHeight = targetHeight;
				}
				canvas.width = finalWidth;
				canvas.height = finalHeight;
				const ctx = canvas.getContext('2d');
				ctx.imageSmoothingQuality = 'high';
				ctx.drawImage(
					image,
					0,
					0,
					image.naturalWidth,
					image.naturalHeight,
					0,
					0,
					finalWidth,
					finalHeight
				);
				ctx.canvas.toBlob(
					async (blob) => {
						const imageURL = await readerFactory(blob, 'readAsDataURL');
						resolve(imageURL);
					},
					'image/jpeg',
					0.85
				);
			};
		} catch (err) {
			reject(err);
		}
	});
};

export default createThumbnail;
