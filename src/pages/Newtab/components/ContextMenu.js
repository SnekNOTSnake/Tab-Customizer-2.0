import React from 'react';

import DataContext from '../dataContext';
import { idbAction } from '../../utils/helpers';
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
		const index = anchorEl.attributes.index.value;
		setShortcuts((initVal) => {
			const newShortcuts = JSON.parse(JSON.stringify(initVal));
			idbAction('shortcuts', 'deleteOne', Number(index));
			return newShortcuts.filter((el) => el.key !== Number(index));
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
