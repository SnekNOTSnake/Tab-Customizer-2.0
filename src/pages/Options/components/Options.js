import React from 'react';
import { Switch, NavLink, Route, Redirect } from 'react-router-dom';
import clsx from 'clsx';

import Backgrounds from './Backgrounds';
import BackgroundOptions from './BackgroundOptions';
import NotFound from './NotFound';
import useStyle from '../styles/Options-style.js';

import LinearProgress from '@material-ui/core/LinearProgress';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import SettingsIcon from '@material-ui/icons/Settings';

const loader = document.querySelector('.loader');

const Options = () => {
	// Snackbar
	const [snackbarIsOpen, setSnackbarIsOpen] = React.useState(false);

	// Drawer
	const [drawerIsOpen, setDrawerIsOpen] = React.useState(true);
	const toggleDrawer = () => setDrawerIsOpen((initVal) => !initVal);
	const [progress, setProgress] = React.useState(4);

	React.useEffect(() => {
		loader.classList.add('loaded');
	}, []);

	const classes = useStyle();
	return (
		<div className={classes.root}>
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerClose]: !drawerIsOpen,
				})}
				classes={{
					paper: clsx(classes.drawer, {
						[classes.drawerClose]: !drawerIsOpen,
					}),
				}}
			>
				<div className={classes.drawerToolbar}>
					<ListItem button onClick={toggleDrawer}>
						<ListItemIcon>
							<ChevronRightIcon className={classes.icon} />
						</ListItemIcon>
					</ListItem>
				</div>
				<List>
					<ListItem
						exact
						to="/wallpapers"
						component={NavLink}
						button
						isActive={(match, location) => {
							return /(^\/wallpapers$|^\/wallpapers\/[0-9]*$)/.test(
								location.pathname
							);
						}}
						className={classes.link}
					>
						<ListItemIcon>
							<WallpaperIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText>Wallpapers</ListItemText>
					</ListItem>
					<ListItem
						exact
						to="/wallpaper-options"
						component={NavLink}
						button
						className={classes.link}
					>
						<ListItemIcon>
							<SettingsIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText>Wallpaper Options</ListItemText>
					</ListItem>
				</List>
			</Drawer>
			<main
				className={clsx(classes.main, {
					[classes.mainClose]: !drawerIsOpen,
				})}
			>
				<LinearProgress
					className={clsx(classes.progress, {
						[classes.progressShow]: Boolean(progress),
					})}
					variant="determinate"
					value={progress}
				/>
				<Switch>
					<Route
						exact
						path={['/', '/options.html']}
						render={() => <Redirect to="/wallpapers" />}
					/>
					<Route
						exact
						path={['/wallpapers', '/wallpapers/:page']}
						render={({ match }) => (
							<Backgrounds setProgress={setProgress} match={match} />
						)}
					/>
					<Route
						exact
						path="/wallpaper-options"
						render={() => (
							<BackgroundOptions
								setSnackbarIsOpen={setSnackbarIsOpen}
								snackbarIsOpen={snackbarIsOpen}
								setProgress={setProgress}
							/>
						)}
					/>
					<Route render={() => <NotFound />} />
				</Switch>
			</main>
		</div>
	);
};

export default Options;
