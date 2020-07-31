import React from 'react';
import clsx from 'clsx';
import useStyle from '../styles/Background-style';
import { idbAction } from '../../utils/helpers';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import WorkIcon from '@material-ui/icons/Work';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import CheckIcon from '@material-ui/icons/Check';

const Background = ({ bg, forceUpdate, openPreview }) => {
	// Open Preview
	const openPreviewHandler = (e) => {
		if (e.target === e.currentTarget) openPreview(bg);
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

	const classes = useStyle();
	return (
		<Grid item sm={12} md={6} lg={4} xl={3}>
			<Paper
				onClick={openPreviewHandler}
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
	);
};

export default Background;
