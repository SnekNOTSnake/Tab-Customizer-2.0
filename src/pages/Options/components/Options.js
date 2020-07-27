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
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => setOpen((initVal) => !initVal);
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
					[classes.drawerClose]: !open,
				})}
				classes={{
					paper: clsx(classes.drawer, {
						[classes.drawerClose]: !open,
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
					[classes.mainClose]: !open,
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
						render={() => <Redirect to="/wallpaper-options" />}
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
						render={() => <BackgroundOptions setProgress={setProgress} />}
					/>
					<Route render={() => <NotFound />} />
				</Switch>
			</main>
		</div>
	);
};

export default Options;
