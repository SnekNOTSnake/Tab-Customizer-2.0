import img1 from './img/backgrounds/01.jpg';
import img2 from './img/backgrounds/02.jpg';
import img3 from './img/backgrounds/03.jpg';
import img4 from './img/backgrounds/04.jpg';
import img5 from './img/backgrounds/05.jpg';
import img6 from './img/backgrounds/06.jpg';

import alphaIcon from './img/shortcuts/alphacoders.jpg';
import pixivIcon from './img/shortcuts/pixiv.jpg';
import mangadexIcon from './img/shortcuts/mangadex.png';
import myanimelistIcon from './img/shortcuts/myanimelist.png';

const promisify = (array) =>
	Promise.all(
		array.map((el) => {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.open('GET', el.image);
				xhr.send();
				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4 && xhr.status === 200) {
						const reader = new FileReader();
						reader.readAsArrayBuffer(xhr.response);
						reader.onload = () => {
							resolve({ ...el, image: reader.result });
						};
						reader.onerror = () => reject('Unable to read image');
					}
				};
				xhr.onerror = () => reject('Unable to load image');
			});
		})
	);

export const getInitBackgrounds = () => {
	return promisify([
		{ image: img1 },
		{ image: img2 },
		{ image: img3 },
		{ image: img4 },
		{ image: img5 },
		{ image: img6 },
	]);
};
export const getInitShortcuts = () => {
	return promisify([
		{ name: 'Alphacoders', url: 'wall.alphacoders.com', image: alphaIcon },
		{ name: 'Pixiv', url: 'pixiv.net', image: pixivIcon },
		{ name: 'Mangadex', url: 'mangadex.org', image: mangadexIcon },
		{ name: 'Myanimelist', url: 'myanimelist.net', image: myanimelistIcon },
	]);
};
