import React from 'react';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import useStyle from '../styles/BackgroundOptions-style';
import BackgroundOptionsForm from './BackgroundOptionsForm';
import BackgroundOptionsDangerZone from './BackgroundOptionsDangerZone';
import BackgroundOptionsDetail from './BackgroundOptionsDetail';

// Small Alert Component
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const BackgroundOptions = ({ setProgress }) => {
	// Snackbar
	const [snackbarOpen, setSnackbarOpen] = React.useState(false);
	const [snackbar, setSnackbar] = React.useState({ message: '', severity: '' });
	const openSnackbar = (severity, message) => {
		setSnackbar({ message, severity });
		setSnackbarOpen(true);
	};
	const closeSnackbar = () => {
		setSnackbarOpen(false);
		setTimeout(() => setSnackbar({ message: '', severity: '' }), 250);
	};

	// Progress Effect
	React.useEffect(() => {
		setProgress(100);
		const timeout = setTimeout(() => setProgress(null), 750);
		return () => clearTimeout(timeout);
	}, [setProgress]);

	const classes = useStyle();
	return (
		<Container fixed>
			<Typography variant="h4">General Options</Typography>
			<BackgroundOptionsForm openSnackbar={openSnackbar} />

			<Typography className={classes.storageTitle} variant="h5">
				Storage
			</Typography>
			<BackgroundOptionsDetail />

			<BackgroundOptionsDangerZone openSnackbar={openSnackbar} />

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				autoHideDuration={4000}
				open={snackbarOpen}
				onClose={closeSnackbar}
			>
				<Alert className={classes.snackbarAlert} severity={snackbar.severity}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default BackgroundOptions;
