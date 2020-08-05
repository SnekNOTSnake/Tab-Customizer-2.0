import React from 'react';

import useStyle from '../styles/Newtab-style';
import Main from './Main';
import DataContext from '../dataContext';
import { idbAction } from '../../utils/helpers';

const loader = document.querySelector('.loader');

const Newtab = () => {
	const [bgKeys, setBgKeys] = React.useState([]);
	const [shortcuts, setShortcuts] = React.useState([]);

	React.useEffect(() => {
		chrome.storage.sync.get(
			{ showNsfw: true, order: [] },
			async ({ showNsfw, order }) => {
				// Get Shortcuts from DB
				const scsData = await idbAction.getAll('shortcuts');
				const orderedShortcuts = order.map((el) =>
					scsData.find((item) => item.key === el)
				);
				setShortcuts(orderedShortcuts);

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

	const defaultColor = '#aaa';
	const classes = useStyle({ defaultColor });
	return (
		<DataContext.Provider
			value={{
				defaultColor,
				shortcuts,
				bgKeys,
				setBackgrounds: setBgKeys,
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
