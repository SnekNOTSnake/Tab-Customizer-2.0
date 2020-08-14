import React from 'react';
import cloneDeep from 'lodash.clonedeep';

import DataContext from '../dataContext';
import { idbAction } from 'Utils/helpers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const ContextMenu = ({ anchorEl, onClose, openDialog }) => {
	const { setShortcuts } = React.useContext(DataContext);

	// Open in new tab Shortcut
	const openInNewTab = () => {
		onClose();
		window.open(anchorEl.attributes.href.value, '_blank');
	};

	// Edit Shortcut
	const openEditDialog = () => {
		openDialog(Number(anchorEl.attributes.index.value));
		onClose();
	};

	// Delete Shortcut
	const deleteHandler = () => {
		const key = anchorEl.attributes.index.value;
		chrome.storage.sync.get({ order: [] }, ({ order }) => {
			const index = order.findIndex((item) => item === Number(key));
			const newOrder = [...order];
			newOrder.splice(index, 1);
			chrome.storage.sync.set({ order: newOrder });

			setShortcuts((initVal) => {
				const newShortcuts = cloneDeep(initVal);
				idbAction.delete('shortcuts', Number(key));
				return newShortcuts.filter((el) => el.key !== Number(key));
			});
		});
		onClose();
	};
	return (
		<Menu
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			onClose={onClose}
			keepMounted
			transitionDuration={200}
		>
			<MenuItem onClick={openInNewTab}>Open in New Tab</MenuItem>
			<MenuItem onClick={openEditDialog}>Edit</MenuItem>
			<MenuItem onClick={deleteHandler}>Delete</MenuItem>
		</Menu>
	);
};

export default ContextMenu;
