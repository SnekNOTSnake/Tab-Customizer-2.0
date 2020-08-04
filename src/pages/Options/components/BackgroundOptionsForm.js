import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import { chromeOptions } from '../../../assets/defaultValues';
import useStyle from '../styles/BackgroundOptionsForm-style';

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';

const BackgroundOptionsForm = (props) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		handleSubmit,
		setFieldValue,
	} = props;

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
		const { openSnackbar } = props;
		const openSnackbarHandler = () =>
			openSnackbar('success', 'Options Updated!');

		chrome.storage.sync.set(values, openSnackbarHandler);
		chrome.browserAction.setBadgeText({ text: values.showNsfw ? 'ON' : '' });
		setSubmitting(false);
	},
});

export default EnhancedForm(BackgroundOptionsForm);
