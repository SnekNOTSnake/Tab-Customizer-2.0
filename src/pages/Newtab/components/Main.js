import React from 'react';
import clsx from 'clsx';

import DataContext from '../dataContext';
import useStyle from '../styles/Main-style';
import ContextMenu from './ContextMenu';
import FormDialog from './FormDialog';
import { idbAction } from '../../utils/helpers';

import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/AddRounded';

// Loader element
const loader = document.querySelector('.loader');

const Main = () => {
	const { backgrounds, shortcuts, defaultColor } = React.useContext(
		DataContext
	);

	const [background, setBackground] = React.useState('');

	// Anchor for Context Menu
	const [anchorEl, setAnchorEl] = React.useState(null);
	const openContext = (e) => {
		e.preventDefault();
		setAnchorEl(e.currentTarget);
	};
	const closeContext = () => setAnchorEl(null);

	// Form Dialog
	const [editIndex, setEditIndex] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const openDialog = (editIndex) => {
		setOpen(true);
		if (Boolean(editIndex)) setEditIndex(editIndex);
	};
	const closeDialog = (val) => {
		setEditIndex(null);
		setOpen(false);
	};

	const closeLoader = () => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				loader.classList.add('loaded');
			});
		});
	};
	const fetchBackground = React.useCallback(async () => {
		if (backgrounds.length) {
			const rand = backgrounds[Math.floor(Math.random() * backgrounds.length)];
			const bg = await idbAction('backgrounds', 'getOne', rand);
			setBackground(bg.image);
		}
	}, [backgrounds]);

	React.useEffect(() => {
		fetchBackground();
	}, [fetchBackground]);

	const classes = useStyle({ defaultColor });
	return (
		<div
			style={{ backgroundImage: `url(${background})` }}
			className={classes.root}
		>
			<img
				style={{ display: 'none' }}
				onLoad={closeLoader}
				src={background}
				alt="Wallpaper"
			/>
			<div className={classes.shortcuts}>
				{shortcuts.map((shortcut) => (
					<a
						href={`https://${shortcut.url}`}
						index={shortcut.key}
						onContextMenu={openContext}
						className={classes.shortcut}
						key={shortcut.key}
					>
						<Paper
							style={{ backgroundImage: `url(${shortcut.image})` }}
							className={classes.icon}
						/>
						<div className={classes.text}>{shortcut.name}</div>
					</a>
				))}
				<div className={clsx(classes.shortcut, classes.addShortcut)}>
					<Paper onClick={() => openDialog()} className={classes.icon}>
						<AddIcon className={classes.addShortcutIcon} />
					</Paper>
				</div>
			</div>

			<ContextMenu
				openDialog={openDialog}
				anchorEl={anchorEl}
				onClose={closeContext}
			/>
			<FormDialog
				editIndex={editIndex}
				open={open}
				onClose={closeDialog}
				title="Add shortcut"
			/>
		</div>
	);
};

export default Main;
