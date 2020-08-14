import React from 'react';

import useStyle from '../styles/Newtab-style';
import Main from './Main';
import DataContext from '../dataContext';
import { idbAction } from 'Utils/helpers';

const loader = document.querySelector('.loader');
const getOptions = {
	showNsfw: true,
	order: [],
	shortcutsPosition: 'bottom',
	shortcutsSize: 'medium',
};

// Accept HMR
if (module.hot) module.hot.accept();

const Newtab = () => {
	const [bgKeys, setBgKeys] = React.useState([]);
	const [shortcuts, setShortcuts] = React.useState([]);
	const [options, setOptions] = React.useState(null);

	React.useEffect(() => {
		chrome.storage.sync.get(
			getOptions,
			async ({ showNsfw, order, shortcutsPosition, shortcutsSize }) => {
				// Get Shortcuts from DB
				const scsData = await idbAction.getAll('shortcuts');
				const orderedShortcuts = order.map((el) =>
					scsData.find((item) => item.key === el)
				);
				setShortcuts(orderedShortcuts);

				// setOptions
				setOptions({ shortcutsPosition, shortcutsSize });

				// Get BgKeys from DB
				const bgKeysData = await idbAction.keys(
					'backgrounds',
					'safe_index',
					showNsfw ? null : 1
				);
				setBgKeys(bgKeysData);

				// Close the loader immediately if there's no background left
				if (!bgKeysData.length) loader.classList.add('loaded');
			}
		);
	}, []);

	const classes = useStyle();
	return (
		<DataContext.Provider
			value={{
				shortcuts,
				bgKeys,
				setBgKeys,
				setShortcuts,
				options,
			}}
		>
			<div className={classes.root}>
				<Main />
			</div>
		</DataContext.Provider>
	);
};

export default Newtab;
