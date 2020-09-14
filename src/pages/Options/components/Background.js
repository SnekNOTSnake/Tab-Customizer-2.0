import React from 'react';
import clsx from 'clsx';
import filesize from 'filesize';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';

import useStyle from '../styles/Background-style';
import idbAction from 'Utils/idbAction';
import readerFactory from 'Utils/readerFactory';

const Background = ({ bg, forceUpdate, openPreview, openInfo }) => {
	const [imageURL, setImageURL] = React.useState('');

	React.useEffect(() => {
		readerFactory(bg.image, 'readAsDataURL').then((img) => setImageURL(img));
	}, [bg.image]);

	// Open Info
	const paperRef = React.useRef(null);
	const openInfoHandler = async (e) => {
		const img = new Image();
		img.src = imageURL;
		img.onload = () => {
			openInfo(
				{
					name: bg.image.name,
					size: filesize(bg.image.size),
					lastModified: new Date(bg.image.lastModified).toLocaleString(),
					type: bg.image.type,
					width: img.naturalWidth + 'px',
					height: img.naturalHeight + 'px',
				},
				paperRef.current
			);
		};
	};

	// Open Preview
	const openPreviewHandler = (e) => {
		if (e.target === e.currentTarget) openPreview({ ...bg, imageURL });
	};

	// BackgroundActions
	const deleteBackground = async (key) => {
		const result = await idbAction.delete('backgrounds', key);
		if (!result) {
			console.log(`Deleted ${key}`);
			forceUpdate();
		}
	};
	const tagNsfwBackground = async (key, safe) => {
		const result = await idbAction.put('backgrounds', key, {
			safe: Number(safe),
		});
		if (result) {
			console.log(`Updated ${key}`);
			forceUpdate();
		}
	};

	const classes = useStyle();
	return (
		<Grid item sm={12} md={6} lg={4} xl={3}>
			<Paper
				onClick={openPreviewHandler}
				className={classes.item}
				style={{
					backgroundImage: `url(${bg.thumbnail})`,
				}}
				ref={paperRef}
			>
				{Boolean(!bg.safe) && (
					<Tooltip title="Tagged as NSFW" arrow>
						<div
							onClick={() => tagNsfwBackground(bg.key, !bg.safe)}
							className={classes.nsfwButton}
						>
							N
						</div>
					</Tooltip>
				)}
				<Tooltip title="Wallpaper Info" arrow>
					<div onClick={openInfoHandler} className={classes.infoButton}>
						i
					</div>
				</Tooltip>
				<div className={classes.itemMenu}>
					<Tooltip title={bg.safe ? 'Tag as NSFW' : 'Tag as SFW'} arrow>
						<Button
							variant="contained"
							color="primary"
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
	);
};

export default Background;
