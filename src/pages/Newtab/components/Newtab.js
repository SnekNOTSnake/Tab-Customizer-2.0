import React from 'react';

import useStyle from '../styles/Newtab-style';
import Main from './Main';
import DataContext from '../dataContext';
import { idbAction } from '../../utils/helpers';

const loader = document.querySelector('.loader');

const Newtab = () => {
	const [bgKeys, setBgKeys] = React.useState([]);
	const [shortcuts, setShortcuts] = React.useState([]);
	const [options, setOptions] = React.useState({ showNsfw: true });

	React.useEffect(() => {
		chrome.storage.sync.get({ showNsfw: true }, async ({ showNsfw }) => {
			setOptions({ showNsfw });

			/* idbAction
				.get('backgrounds', 1, true)
				.then((value) => console.log(value));
			idbAction
				.getAll('backgrounds', null, true, null, 3, 2)
				.then((value) => console.log(value));
			idbAction
				.keys('backgrounds', 'safe_index', 1)
				.then((value) => console.log(value));
			const time = new Date().getTime();
			idbAction
				.put('backgrounds', 1, { safe: 1 })
				.then((value) => console.log(value, new Date().getTime() - time))
				.catch((err) => console.log(err)); */
			// get, getAll, keys, put
			// add, clear, delete

			// Get Shortcuts from DB
			const scsData = await idbAction.getAll('shortcuts');
			setShortcuts(scsData);

			// Get BgKeys from DB
			const bgKeysData = await idbAction.keys(
				'backgrounds',
				'safe_index',
				showNsfw ? null : 1
			);
			setBgKeys(bgKeysData);

			// Close the loader immediately if there's no background left
			if (!bgKeysData.length) loader.classList.add('loaded');
		});
	}, []);

	const defaultColor = '#aaa';
	const classes = useStyle({ defaultColor });
	return (
		<DataContext.Provider
			value={{
				defaultColor,
				shortcuts,
				bgKeys,
				options,
				setBackgrounds: setBgKeys,
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
