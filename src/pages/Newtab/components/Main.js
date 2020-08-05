import React from 'react';
import clsx from 'clsx';
import arrayMove from 'array-move';

import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/AddRounded';

import DataContext from '../dataContext';
import useStyle from '../styles/Main-style';
import ContextMenu from './ContextMenu';
import FormDialog from './FormDialog';
import SortableList from './SortableList';
import { idbAction } from '../../utils/helpers';

// Loader element
const loader = document.querySelector('.loader');

const Main = () => {
	const { setShortcuts, bgKeys, shortcuts, defaultColor } = React.useContext(
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
		const target = e.currentTarget;
		setAnchorEl(target);
	};
	const closeContext = () => setAnchorEl(null);

	// Form Dialog
	const [editIndex, setEditIndex] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const openDialog = (editIndex) => {
		setOpen(true);
		if (Boolean(editIndex)) setEditIndex(editIndex);
	};
	const closeDialog = () => {
		setEditIndex(null);
		setOpen(false);
	};

	// Fetch The Background
	const fetchBackground = React.useCallback(async () => {
		if (bgKeys.length) {
			// Load random image from DB
			const rand = bgKeys[Math.floor(Math.random() * bgKeys.length)];
			const bg = await idbAction.get('backgrounds', rand);
			setBackground(bg.image);
		}
	}, [bgKeys]);
	React.useEffect(() => {
		fetchBackground();
	}, [fetchBackground]);

	// Preload the background
	React.useEffect(() => {
		const img = new Image();
		img.src = background;
		img.addEventListener('load', () => {
			root.current.style.backgroundImage = `url(${background})`;
			loader.classList.add('loaded');
		});
	}, [background]);

	// OnSortEnd
	const onSortEnd = ({ oldIndex, newIndex }) => {
		setShortcuts((initVal) => {
			const sorted = arrayMove(initVal, oldIndex, newIndex);
			const keys = sorted.map((item) => item.key);
			chrome.storage.sync.set({ order: keys });
			return sorted;
		});
	};

	const classes = useStyle({ defaultColor });
	return (
		<div ref={root} className={classes.root}>
			<div className={classes.shortcuts}>
				<SortableList
					distance={2}
					items={shortcuts}
					onSortEnd={onSortEnd}
					axis="xy"
					classes={classes}
					openContext={openContext}
				/>
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
				setShortcuts={setShortcuts}
				editIndex={editIndex}
				open={open}
				onClose={closeDialog}
				title="Add shortcut"
			/>
		</div>
	);
};

export default Main;
