import React from 'react';
import clsx from 'clsx';

import DataContext from '../dataContext';
import useStyle from '../styles/Main-style';
import ContextMenu from './ContextMenu';
import FormDialog from './FormDialog';
import { idbAction } from '../../utils/helpers';

import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/AddRounded';

// Loader element
const loader = document.querySelector('.loader');

const Main = () => {
	const { backgrounds: bgKeys, shortcuts, defaultColor } = React.useContext(
		DataContext
	);

	const root = React.useRef();
	const [background, setBackground] = React.useState('');

	// Open Options
	const openOptionsPage = () => {
		if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
		else window.open(chrome.runtime.getURL('options.html'));
	};

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

	const fetchBackground = React.useCallback(async () => {
		if (bgKeys.length) {
			// Load random image from DB
			const rand = bgKeys[Math.floor(Math.random() * bgKeys.length)];
			const bg = await idbAction('backgrounds', 'getOne', rand);
			setBackground(bg.image);
		}
	}, [bgKeys]);

	React.useEffect(() => {
		fetchBackground();
	}, [fetchBackground]);

	React.useEffect(() => {
		const img = new Image();
		img.src = background;
		img.addEventListener('load', () => {
			root.current.style.backgroundImage = `url(${background})`;
			loader.classList.add('loaded');
		});
	}, [background]);

	const classes = useStyle({ defaultColor });
	return (
		<div ref={root} className={classes.root}>
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

			<div className={classes.optionsButton}>
				<Button
					onClick={openOptionsPage}
					size="small"
					variant="contained"
					color="primary"
				>
					<SettingsIcon className={classes.settingsIcon} />
					Options
				</Button>
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
