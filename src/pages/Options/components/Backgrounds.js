import React from 'react';
import { NavLink } from 'react-router-dom';
import { idbAction } from '../../utils/helpers';
import useStyle from '../styles/Backgrounds-style';
import Background from './Background';

import Dialog from '@material-ui/core/Dialog';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
		setImagePreview(bg.image);
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
				type: file.type,
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
			}).then((bgs) => {
				setBackgrounds(bgs.data);
				setTotalBgs(bgs.allKeys.length);
				setProgress(100);
				timeout = setTimeout(() => setProgress(null), 500);
			});
			return () => clearTimeout(timeout);
		});
	}, [match.params.page, setProgress, state]);

	const classes = useStyle({ bg: imagePreview });
	return (
		<Container className="Backgrounds" fixed>
			<Fab component="label" className={classes.fab} color="primary">
				<AddPhotoAlternateIcon />
				<input
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

			<Dialog
				onClose={closePreview}
				open={previewIsOpen}
				maxWidth="lg"
				classes={{
					paper: classes.dialogPaper,
				}}
			>
				<div
					style={{ backgroundImage: `url(${imagePreview})` }}
					className={classes.previewImage}
				/>
			</Dialog>
		</Container>
	);
};

export default Backgrounds;
