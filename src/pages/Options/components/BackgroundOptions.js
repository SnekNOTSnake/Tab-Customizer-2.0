import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import useStyle from '../styles/BackgroundOptions-style';
import { chromeOptions } from '../../../assets/defaultValues';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

// Small Alert Component
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const BackgroundOptions = (props) => {
	const {
		setProgress,
		snackbarIsOpen,
		setSnackbarIsOpen,
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
	} = props;

	// Snackbar
	const closeSnackbar = () => setSnackbarIsOpen(false);

	// Progress Effect
	React.useEffect(() => {
		setProgress(100);
		const timeout = setTimeout(() => setProgress(null), 750);
		return () => clearTimeout(timeout);
	}, [setProgress]);

	// Fetch Options Effect
	React.useEffect(() => {
		chrome.storage.sync.get(
			{ itemsPerPage: 9, showNsfw: false },
			({ itemsPerPage, showNsfw }) => {
				setFieldValue('itemsPerPage', itemsPerPage);
				setFieldValue('showNsfw', showNsfw);
			}
		);
	}, [setFieldValue]);

	// Reset Form
	const handleReset = () => {
		setFieldValue('itemsPerPage', chromeOptions.itemsPerPage);
		setFieldValue('showNsfw', chromeOptions.showNsfw);
	};

	const classes = useStyle();
	return (
		<Container fixed>
			<Typography variant="h4">Wallpaper Options</Typography>
			<form onSubmit={handleSubmit}>
				<FormGroup className={classes.formGroup}>
					<TextField
						error={touched.itemsPerPage && errors.itemsPerPage}
						name="itemsPerPage"
						type="number"
						variant="outlined"
						label="Wallpaper items per page"
						helperText={errors.itemsPerPage}
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.itemsPerPage}
					/>
				</FormGroup>
				<FormGroup className={classes.formGroup}>
					<FormControlLabel
						control={
							<Switch
								onChange={handleChange}
								onBlur={handleBlur}
								name="showNsfw"
								checked={values.showNsfw}
								value={values.showNsfw}
							/>
						}
						label="Show NSFW"
					/>
				</FormGroup>
				<Button
					className={classes.submitButton}
					color="primary"
					variant="contained"
					type="submit"
				>
					Save
				</Button>
				<Button
					onClick={handleReset}
					color="secondary"
					variant="contained"
					type="button"
				>
					Reset
				</Button>
			</form>

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				autoHideDuration={4000}
				open={snackbarIsOpen}
				onClose={closeSnackbar}
			>
				<Alert className={classes.snackbarAlert} severity="success">
					Options updated
				</Alert>
			</Snackbar>
		</Container>
	);
};

const EnhancedForm = withFormik({
	mapPropsToValues: (props) => ({ itemsPerPage: 9, showNsfw: false }),

	// Validation
	validationSchema: Yup.object().shape({
		itemsPerPage: Yup.number()
			.required('Items per page is required')
			.max(99, 'Max 99')
			.min(1, 'Min 1'),
		showNsfw: Yup.boolean().required('Show NSFW should be boolean'),
	}),

	// Submission
	handleSubmit: (values, { props, setSubmitting }) => {
		const { setSnackbarIsOpen } = props;
		const openSnackbar = () => setSnackbarIsOpen(true);

		chrome.storage.sync.set(values, openSnackbar);
		chrome.browserAction.setBadgeText({ text: values.showNsfw ? 'ON' : '' });
		setSubmitting(false);
	},
});

export default EnhancedForm(BackgroundOptions);
