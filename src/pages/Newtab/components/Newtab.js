import React from 'react';

import useStyle from '../styles/Newtab-style';
import Main from './Main';
import DataContext from '../dataContext';
import { idbAction } from '../../utils/helpers';

const Newtab = () => {
	const [backgrounds, setBackgrounds] = React.useState([]);
	const [shortcuts, setShortcuts] = React.useState([]);

	React.useEffect(() => {
		const openRequest = indexedDB.open('newTab2');
		openRequest.onupgradeneeded = () => alert('Please re-install extension');
		openRequest.onsuccess = async () => {
			// Shortcuts
			const shortcuts = await idbAction('shortcuts', 'getAll');
			setShortcuts(shortcuts.data);

			// Backgrounds
			const backgrounds = await idbAction('backgrounds', 'getAllKeys');
			setBackgrounds(backgrounds);
		};
		openRequest.onerror = () => console.error(openRequest.error);
	}, []);

	const defaultColor = '#aaa';
	const classes = useStyle({ defaultColor });
	return (
		<DataContext.Provider
			value={{
				defaultColor,
				shortcuts,
				backgrounds,
				setBackgrounds,
				setShortcuts,
			}}
		>
			<div className={classes.root}>
				<Main />
			</div>
		</DataContext.Provider>
	);
};

export default Newtab;
