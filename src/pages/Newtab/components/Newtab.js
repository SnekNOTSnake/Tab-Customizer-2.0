import React from 'react';

import useStyle from '../styles/Newtab-style';
import Main from './Main';
import DataContext from '../dataContext';
import { idbAction } from '../../utils/helpers';

const loader = document.querySelector('.loader');

const Newtab = () => {
	const [backgrounds, setBackgrounds] = React.useState([]);
	const [shortcuts, setShortcuts] = React.useState([]);
	const [options, setOptions] = React.useState({ showNsfw: true });

	React.useEffect(() => {
		chrome.storage.sync.get({ showNsfw: true }, ({ showNsfw }) => {
			setOptions({ showNsfw });

			const openRequest = indexedDB.open('newTab2');
			openRequest.onupgradeneeded = () => alert('Please re-install extension');
			openRequest.onsuccess = async () => {
				// Shortcuts
				const shortcuts = await idbAction('shortcuts', 'getAll');
				setShortcuts(shortcuts.data);

				// Backgrounds
				const backgrounds = await idbAction('backgrounds', 'getAllKeys', null, {
					showNsfw,
				});
				setBackgrounds(backgrounds);
				// Close the loader immediately if there's no background left
				if (!backgrounds.length) loader.classList.add('loaded');
			};
			openRequest.onerror = () => console.error(openRequest.error);
		});
	}, []);

	const defaultColor = '#aaa';
	const classes = useStyle({ defaultColor });
	return (
		<DataContext.Provider
			value={{
				defaultColor,
				shortcuts,
				backgrounds,
				options,
				setBackgrounds,
				setShortcuts,
				setOptions,
			}}
		>
			<div className={classes.root}>
				<Main />
			</div>
		</DataContext.Provider>
	);
};

export default Newtab;
