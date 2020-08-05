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
		array.map((el, i) => {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'blob';
				xhr.open('GET', el.image);
				xhr.send();
				xhr.onreadystatechange = () => {
					if (xhr.readyState === 4 && xhr.status === 200) {
						resolve({
							...el,
							image: new File([xhr.response], `0${i + 1}.jpg`, {
								type: 'image/jpeg',
							}),
						});
					}
				};
				xhr.onerror = () => reject('Unable to load image');
			});
		})
	);

const initBackgrounds = [
	{ image: img1, safe: 1 },
	{ image: img2, safe: 1 },
	{ image: img3, safe: 0 },
	{ image: img4, safe: 1 },
	{ image: img5, safe: 0 },
	{ image: img6, safe: 1 },
];

const initShortcuts = [
	{
		name: 'Alphacoders',
		url: 'https://wall.alphacoders.com',
		image: alphaIcon,
	},
	{ name: 'Pixiv', url: 'https://pixiv.net', image: pixivIcon },
	{ name: 'Mangadex', url: 'https://mangadex.org', image: mangadexIcon },
	{
		name: 'Myanimelist',
		url: 'https://myanimelist.net',
		image: myanimelistIcon,
	},
];

// Export data
export const getInitBackgrounds = () => promisify(initBackgrounds);
export const getInitShortcuts = () => promisify(initShortcuts);
export const chromeOptions = {
	itemsPerPage: 9,
	showNsfw: false,
	order: Array.from(new Array(initShortcuts.length), (_, i) => i + 1),
};
