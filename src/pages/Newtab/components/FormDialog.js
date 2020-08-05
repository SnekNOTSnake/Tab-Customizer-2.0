import React from 'react';
import cloneDeep from 'lodash.clonedeep';
import { withFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/CloseRounded';
import CheckIcon from '@material-ui/icons/CheckRounded';
import AddIcon from '@material-ui/icons/Add';

import { idbAction, readerFactory } from '../../utils/helpers';
import useStyle from '../styles/FormDialog-style';

// Files Test Validators
const validateSize = (value) => {
	if (value) return value.size < 2000000;
	return true;
};
const validateType = (value) => {
	if (value)
		return ['image/png', 'image/gif', 'image/jpg', 'image/jpeg'].includes(
			value.type
		);
	return true;
};

const FormDialog = (props) => {
	const {
		editIndex,
		open,
		onClose,
		title,
		values,
		touched,
		errors,
		handleSubmit,
		handleChange,
		handleBlur,
		resetForm,
		setFieldValue,
		setFieldTouched,
	} = props;

	const [image, setImage] = React.useState('');

	// Edit
	const fetchSc = React.useCallback(async () => {
		if (editIndex) {
			const sc = await idbAction.get('shortcuts', editIndex, true);
			setFieldValue('name', sc.name);
			setFieldValue('url', sc.url);
			setFieldValue('files', sc.image);
			const imageDisplay = await readerFactory(sc.image, 'readAsDataURL');
			setImage(imageDisplay);
		}
	}, [editIndex, setFieldValue]);
	React.useEffect(() => {
		fetchSc();
	}, [fetchSc]);

	// Cancel Form
	const handleCancel = () => {
		setTimeout(() => {
			resetForm();
			setImage('');
		}, 225);
		onClose();
	};

	// File Input Handling
	const onFileInput = async (e) => {
		const file = e.target.files[0];
		setFieldValue('files', file, true);
		setFieldTouched('files', true, false);
		if (validateSize(file) && validateType(file)) {
			const imageURL = await readerFactory(file, 'readAsDataURL');
			setImage(imageURL);
		}
	};
	const RenderImage = () => (
		<Paper
			className={classes.shortcutIcon}
			style={{
				width: 125,
				height: 125,
				backgroundImage: `url(${image})`,
			}}
		></Paper>
	);

	const classes = useStyle();
	return (
		<Dialog
			classes={{ paper: classes.dialogPaper }}
			open={open}
			onClose={handleCancel}
		>
			<form className="test" onSubmit={handleSubmit}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						variant="outlined"
						className={classes.textField}
						placeholder="Lorem ipsum is good"
						label="Name"
						name="name"
						value={values.name}
						helperText={errors.name}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.name && touched.name}
					/>
					<TextField
						fullWidth
						variant="outlined"
						className={classes.textField}
						placeholder="loremipsum.com"
						label="URL"
						name="url"
						value={values.url}
						helperText={errors.url}
						onChange={handleChange}
						onBlur={handleBlur}
						error={errors.url && touched.url}
					/>
					{values.files && <RenderImage />}
					<Button
						className={classes.addFileButton}
						component="label"
						variant="contained"
						color="primary"
					>
						<AddIcon />
						Add icon
						<input
							name="files"
							className={classes.inputFile}
							type="file"
							accept="image/*"
							onChange={onFileInput}
							onBlur={handleBlur}
						/>
					</Button>
					{errors.files && touched.files && (
						<div style={{ color: 'red', margin: '8px 0px' }}>
							Image file only
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button type="submit" variant="outlined" color="primary">
						<CheckIcon />
					</Button>
					<Button onClick={handleCancel} variant="outlined" color="secondary">
						<CloseIcon />
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

const EnhancedForm = withFormik({
	mapPropsToValues: (props) => ({ name: '', url: '', files: undefined }),

	// Validation
	validationSchema: Yup.object().shape({
		name: Yup.string().required('Name is required'),
		url: Yup.string().required('URL is required').url('Invalid URL'),
		files: Yup.mixed()
			.notRequired()
			.test('fileSize', 'No more than 2 MB', validateSize)
			.test('fileType', 'Unsupported File Format', validateType),
	}),

	// Handle Submit
	handleSubmit: async ({ name, url, files }, { props, resetForm }) => {
		const { editIndex, setShortcuts, onClose } = props;

		// Edit and Add Form Confirm
		if (editIndex) {
			// Edit shortcut
			const result = await idbAction.put('shortcuts', editIndex, {
				name,
				url,
				image: files,
			});

			const image = await readerFactory(files, 'readAsDataURL');

			if (result)
				setShortcuts((initVal) => {
					const newShortcuts = cloneDeep(initVal);
					const alteredIdx = newShortcuts.findIndex((sc) => {
						return sc.key === editIndex;
					});

					newShortcuts.splice(alteredIdx, 1, {
						key: editIndex,
						name,
						url,
						image,
					});
					return newShortcuts;
				});
			else console.error('Unable to update');
		} else {
			// Add shortcut
			const newSc = { name, url, image: files };
			const newScId = await idbAction.add('shortcuts', newSc);
			const imageURL = await readerFactory(files, 'readAsDataURL');
			setShortcuts((initVal) => [
				...initVal,
				{ ...newSc, image: imageURL, key: newScId },
			]);
			chrome.storage.sync.get({ order: [] }, ({ order }) => {
				chrome.storage.sync.set({ order: [...order, newScId] });
			});
		}
		setTimeout(() => {
			resetForm();
		}, 250);
		onClose();
	},
});

export default EnhancedForm(FormDialog);
