import React from 'react';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { chromeOptions } from 'DefaultValues';
import useStyle from '../styles/BackgroundOptionsForm-style';

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
			{
				itemsPerPage: 9,
				showNsfw: false,
				shortcutsPosition: 'bottom',
				shortcutsSize: 'medium',
			},
			({ itemsPerPage, showNsfw, shortcutsPosition, shortcutsSize }) => {
				setFieldValue('itemsPerPage', itemsPerPage);
				setFieldValue('showNsfw', showNsfw);
				setFieldValue('shortcutsPosition', shortcutsPosition);
				setFieldValue('shortcutsSize', shortcutsSize);
			}
		);
	}, [setFieldValue]);

	// Reset Form
	const handleReset = () => {
		setFieldValue('itemsPerPage', chromeOptions.itemsPerPage);
		setFieldValue('showNsfw', chromeOptions.showNsfw);
		setFieldValue('shortcutsPosition', chromeOptions.shortcutsPosition);
		setFieldValue('shortcutsSize', chromeOptions.shortcutsSize);
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
			<FormGroup className={classes.formGroup}>
				<FormControl
					variant="outlined"
					error={touched.shortcutsPosition && errors.shortcutsPosition}
				>
					<InputLabel id="shortcuts-position">Shortcuts Position</InputLabel>
					<Select
						labelId="shortcuts-position"
						name="shortcutsPosition"
						value={values.shortcutsPosition}
						onChange={handleChange}
						onBlur={handleBlur}
						label="Shortcuts Position"
					>
						<MenuItem value="bottom">Bottom</MenuItem>
						<MenuItem value="center">Center</MenuItem>
						<MenuItem value="left">Left</MenuItem>
						<MenuItem value="right">Right</MenuItem>
					</Select>
				</FormControl>
			</FormGroup>
			<FormGroup className={classes.formGroup}>
				<FormControl
					variant="outlined"
					error={touched.shortcutsSize && errors.shortcutsSize}
				>
					<InputLabel id="shortcuts-size">Shortcuts Size</InputLabel>
					<Select
						labelId="shortcuts-size"
						name="shortcutsSize"
						value={values.shortcutsSize}
						onChange={handleChange}
						onBlur={handleBlur}
						label="Shortcuts Size"
					>
						<MenuItem value="medium">Medium</MenuItem>
						<MenuItem value="small">Small</MenuItem>
					</Select>
				</FormControl>
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
	mapPropsToValues: (props) => ({
		itemsPerPage: chromeOptions.itemsPerPage,
		showNsfw: chromeOptions.showNsfw,
		shortcutsPosition: chromeOptions.shortcutsPosition,
		shortcutsSize: chromeOptions.shortcutsSize,
	}),

	// Validation
	validationSchema: Yup.object().shape({
		itemsPerPage: Yup.number()
			.required('Items per page is required')
			.max(99, 'Max 99')
			.min(1, 'Min 1'),
		showNsfw: Yup.boolean().required('Show NSFW should be boolean'),
		shortcutsPosition: Yup.string()
			.required('Shortcuts Position is required')
			.oneOf(
				['bottom', 'center', 'left', 'right'],
				'Invalid shortcuts position value'
			),
		shortcutsSize: Yup.string()
			.required('Shortcuts Size is required')
			.oneOf(['medium', 'small'], 'Invalid shortcuts size value'),
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
