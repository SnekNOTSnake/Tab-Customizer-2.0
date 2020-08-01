import React from 'react';
import { NavLink } from 'react-router-dom';
import { idbAction, readerFactory, FileWithURL } from '../../utils/helpers';
import useStyle from '../styles/Backgrounds-style';
import Background from './Background';
import BackgroundPreview from './BackgroundPreview';

import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

const Backgrounds = ({ match, setProgress }) => {
	const [backgrounds, setBackgrounds] = React.useState([]);
	const [totalBgs, setTotalBgs] = React.useState(0);
	const [limit, setLimit] = React.useState(9);

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
			const result = await idbAction('backgrounds', 'createOne', {
				image: file,
				safe: 1,
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
		chrome.storage.sync.get({ itemsPerPage: 9 }, ({ itemsPerPage }) => {
			setLimit(itemsPerPage);

			setProgress(32);
			let timeout = null;
			// Paginate backgrounds
			idbAction('backgrounds', 'getAll', null, {
				page: match.params.page || 1,
				limit: itemsPerPage,
				noConversion: true,
			}).then(async (bgs) => {
				const bgsData = await Promise.all(
					bgs.data.map(async (bg) => {
						const imgURL = await readerFactory(bg.image, 'readAsDataURL');
						return new FileWithURL(bg.image, imgURL, bg);
					})
				);
				setBackgrounds(bgsData);
				setTotalBgs(bgs.allKeys.length);
				setProgress(100);
				timeout = setTimeout(() => setProgress(null), 500);
			});
			return () => clearTimeout(timeout);
		});
	}, [match.params.page, setProgress, state]);

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
		</Container>
	);
};

export default Backgrounds;
