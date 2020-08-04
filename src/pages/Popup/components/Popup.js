import React from 'react';
import useStyle from '../styles/Popup-style';
import logo from '../../../assets/img/sns-logo.png';

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

const setShowNsfw = (showNsfw) =>
	chrome.browserAction.setBadgeText({ text: showNsfw ? 'ON' : '' });

const Popup = () => {
	const [showNsfw, setSwitchValue] = React.useState(false);

	// Fetch the current state
	React.useEffect(() => {
		chrome.storage.sync.get({ showNsfw: false }, ({ showNsfw }) => {
			setSwitchValue(showNsfw);
			setShowNsfw(showNsfw);
		});
	}, []);

	const handleChange = (e) => {
		const { checked } = e.target;
		chrome.storage.sync.set({ showNsfw: checked }, () => {
			setShowNsfw(checked);
			setSwitchValue(checked);
		});
	};

	const classes = useStyle();
	return (
		<Paper className={classes.root}>
			<Typography className={classes.title} variant="h6">
				<img alt="SNS" src={logo} className={classes.logo} />
				Tab Customizer 2.0
			</Typography>
			<FormControlLabel
				control={<Switch checked={showNsfw} onChange={handleChange} />}
				label="Show NSFW"
			/>
		</Paper>
	);
};

export default Popup;
