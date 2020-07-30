import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { idbAction } from '../../utils/helpers';
import useStyle from '../styles/Backgrounds-style';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import DeleteIcon from '@material-ui/icons/Delete';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import CheckIcon from '@material-ui/icons/Check';

const Backgrounds = ({ match, setProgress }) => {
	const [backgrounds, setBackgrounds] = React.useState([]);
	const [totalBgs, setTotalBgs] = React.useState(0);
	const [limit, setLimit] = React.useState(9);

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

	// BackgroundActions
	const deleteBackground = async (key) => {
		const result = await idbAction('backgrounds', 'deleteOne', key);
		if (result) {
			console.log(`Deleted ${result}`);
			forceUpdate();
		}
	};
	const tagNsfwBackground = async (key, safe) => {
		const result = await idbAction('backgrounds', 'updateOne', {
			data: { safe: Number(safe) },
			key,
		});
		if (result) {
			console.log(`Updated ${key}`);
			forceUpdate();
		}
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

	const classes = useStyle();
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
					<Grid item sm={12} md={6} lg={4} xl={3} key={bg.key}>
						<Paper
							className={classes.item}
							style={{
								backgroundImage: `url(${bg.image})`,
							}}
						>
							{Boolean(!bg.safe) && (
								<Tooltip title="Tagged as NSFW" arrow>
									<div className={classes.nsfw}>N</div>
								</Tooltip>
							)}
							<div className={classes.itemMenu}>
								<Tooltip title="Absolute Wallpaper" arrow>
									<Button
										color="primary"
										variant="contained"
										className={classes.itemMenuButton}
										type="button"
										size="small"
									>
										<CheckIcon />
									</Button>
								</Tooltip>
								<Tooltip title={bg.safe ? 'Tag as NSFW' : 'Tag as SFW'} arrow>
									<Button
										variant="contained"
										onClick={() => tagNsfwBackground(bg.key, !bg.safe)}
										className={clsx(classes.itemMenuButton, classes.workButton)}
										type="button"
										size="small"
									>
										{bg.safe ? <WorkIcon /> : <WorkOutlineIcon />}
									</Button>
								</Tooltip>
								<Tooltip title="Delete" arrow>
									<Button
										color="secondary"
										variant="contained"
										className={classes.itemMenuButton}
										type="button"
										size="small"
										onClick={() => deleteBackground(bg.key)}
									>
										<DeleteIcon />
									</Button>
								</Tooltip>
							</div>
						</Paper>
					</Grid>
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
		</Container>
	);
};

export default Backgrounds;
