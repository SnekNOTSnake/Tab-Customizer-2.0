import React from 'react';
import { Switch, NavLink, Route, Redirect } from 'react-router-dom';
import clsx from 'clsx';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import WallpaperIcon from '@material-ui/icons/Wallpaper';
import SettingsIcon from '@material-ui/icons/Settings';
import InfoIcon from '@material-ui/icons/Info';

import Backgrounds from './Backgrounds';
import BackgroundOptions from './BackgroundOptions';
import NotFound from './NotFound';
import About from './About';
import useStyle from '../styles/Options-style.js';

const loader = document.querySelector('.loader');

// Accept the HMR
if (module.hot) module.hot.accept();

const Options = () => {
	// Drawer
	const [drawerIsOpen, setDrawerIsOpen] = React.useState(true);
	const toggleDrawer = () => setDrawerIsOpen((initVal) => !initVal);

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
					<ListItem
						className={classes.whiteHover}
						button
						onClick={toggleDrawer}
					>
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
						className={clsx(classes.link, classes.whiteHover)}
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
						className={clsx(classes.link, classes.whiteHover)}
					>
						<ListItemIcon>
							<SettingsIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText>Wallpaper Options</ListItemText>
					</ListItem>
					<ListItem
						exact
						to="/about"
						component={NavLink}
						button
						className={clsx(classes.link, classes.whiteHover)}
					>
						<ListItemIcon>
							<InfoIcon className={classes.icon} />
						</ListItemIcon>
						<ListItemText>About</ListItemText>
					</ListItem>
				</List>
			</Drawer>
			<main
				className={clsx(classes.main, {
					[classes.mainClose]: !drawerIsOpen,
				})}
			>
				<Switch>
					<Route
						exact
						path={['/', '/options.html']}
						render={() => <Redirect to="/wallpapers" />}
					/>
					<Route
						exact
						path={['/wallpapers', '/wallpapers/:page']}
						render={({ match }) => <Backgrounds match={match} />}
					/>
					<Route
						exact
						path="/wallpaper-options"
						render={() => <BackgroundOptions />}
					/>
					<Route exact path="/about" render={() => <About />} />
					<Route render={() => <NotFound />} />
				</Switch>
			</main>
		</div>
	);
};

export default Options;
