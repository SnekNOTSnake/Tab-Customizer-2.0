import React from 'react';
import { NavLink } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

import { idbAction, createThumbnail } from 'Utils/helpers';
import useStyle from '../styles/Backgrounds-style';
import Background from './Background';
import BackgroundPreview from './BackgroundPreview';
import BackgroundInfo from './BackgroundInfo';

const infoInit = {
	name: '',
	lastModified: null,
	width: null,
	height: null,
	size: null,
	type: '',
};

const Backgrounds = ({ match }) => {
	const [backgrounds, setBackgrounds] = React.useState([]);
	const [totalBgs, setTotalBgs] = React.useState(0);
	const [limit, setLimit] = React.useState(null);

	// Background Info Dialog
	const [fileInfo, setFileInfo] = React.useState(infoInit);
	const [infoAnchor, setInfoAnchor] = React.useState(null);
	const openInfo = (fileInfo, anchorEl) => {
		const { name, lastModified, width, height, size, type } = fileInfo;
		setFileInfo({ name, lastModified, width, height, size, type });
		setInfoAnchor(anchorEl);
	};
	const closeInfo = () => {
		setInfoAnchor(null);
		setTimeout(() => setFileInfo(infoInit), 250);
	};

	// Preview
	const [previewIsOpen, setPreviewIsOpen] = React.useState(false);
	const [imagePreview, setImagePreview] = React.useState('');
	const openPreview = (bg) => {
		setImagePreview(bg);
		setPreviewIsOpen(true);
	};
	const closePreview = () => {
		setPreviewIsOpen(false);
		setTimeout(() => setImagePreview(''), 250);
	};

	// Force update
	const [state, setState] = React.useState();
	const forceUpdate = () => setState({});

	// Add Image
	const inputRef = React.useRef(null);
	const onChangeHandler = (e) => {
		const { files } = e.target;
		if (!files.length) return;
		// validate all images
		const validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
		const filtered = Array.from(files).filter((file) => {
			if (!validTypes.includes(file.type)) return false;
			if (file.size > 2000000) return false;
			return true;
		});
		let update = false;
		filtered.forEach(async (file, i) => {
			const thumbnail = await createThumbnail(file);
			const result = await idbAction.add('backgrounds', {
				image: file,
				safe: 1,
				thumbnail,
			});
			if (result) {
				console.log(`Added background ${file.name}`);
				update = true;
				// When it's the last element is executed,
				// and one or more operation is succeeded, forceUpdate()
				if (filtered.length === i + 1 && update) forceUpdate();
			} else console.log(`Unable to add background ${file.name}`);
		});
		inputRef.current.value = null;
	};

	React.useEffect(() => {
		chrome.storage.sync.get({ itemsPerPage: 9 }, async ({ itemsPerPage }) => {
			setLimit(itemsPerPage);
			const bgKeys = await idbAction.keys('backgrounds');
			setTotalBgs(bgKeys.length);
		});
	}, []);

	React.useEffect(() => {
		(async () => {
			if (!limit) return;
			// Paginate backgrounds
			const bgs = await idbAction.getAll(
				'backgrounds',
				null,
				true,
				null,
				match.params.page,
				limit
			);
			setBackgrounds(bgs);
		})();
	}, [match.params.page, limit, state]);

	const classes = useStyle();
	return (
		<Container className="Backgrounds" fixed>
			<Fab component="label" className={classes.fab} color="primary">
				<AddPhotoAlternateIcon />
				<input
					ref={inputRef}
					onChange={onChangeHandler}
					style={{ display: 'none' }}
					multiple
					type="file"
					accept="image/*"
				/>
			</Fab>
			<Typography variant="h4">Wallpapers</Typography>
			<Grid className={classes.items} container spacing={1}>
				{backgrounds.map((bg) => (
					<Background
						key={bg.key}
						openPreview={openPreview}
						forceUpdate={forceUpdate}
						bg={bg}
						openInfo={openInfo}
					/>
				))}
			</Grid>
			<div className="pagination">
				<Pagination
					page={Number(match.params.page || 1)}
					color="primary"
					count={Math.ceil(totalBgs / limit)}
					renderItem={(item) => (
						<PaginationItem
							component={NavLink}
							to={`/wallpapers/${item.page === 1 ? '' : item.page}`}
							{...item}
						/>
					)}
				/>
			</div>

			<BackgroundPreview
				previewIsOpen={previewIsOpen}
				closePreview={closePreview}
				imagePreview={imagePreview}
				forceUpdate={forceUpdate}
			/>
			<BackgroundInfo
				fileInfo={fileInfo}
				anchorEl={infoAnchor}
				closeInfo={closeInfo}
			/>
		</Container>
	);
};

export default Backgrounds;
