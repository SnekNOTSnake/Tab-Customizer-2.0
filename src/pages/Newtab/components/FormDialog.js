import React from 'react';
import { useForm } from 'react-hook-form';

import { idbAction, readerFactory } from '../../utils/helpers';
import useStyle from '../styles/FormDialog-style';
import DataContext from '../dataContext';

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

const URLRegex = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const FormDialog = ({ editIndex, open, onClose, title }) => {
	const context = React.useContext(DataContext);
	const { setShortcuts } = context;
	const [image, setImage] = React.useState('');

	// Using the new shiny react-hook-form with uncontrolled inputs
	const { setValue, register, trigger, handleSubmit, errors } = useForm();

	// Edit
	const [oldImageBuffer, setOldImageBuffer] = React.useState('');
	const fetchSc = React.useCallback(async () => {
		if (editIndex) {
			const sc = await idbAction('shortcuts', 'getOne', editIndex, {
				noConversion: true,
			});
			const imageDisplay = await readerFactory(sc.image, 'readAsDataURL');
			setImage(imageDisplay);
			setOldImageBuffer(sc.image);
			setValue('name', sc.name);
			setValue('url', sc.url);
		}
	}, [editIndex, setValue]);
	React.useEffect(() => {
		fetchSc();
	}, [fetchSc]);

	// Edit and Add Form Confirm
	const handleConfirm = async ({ name, url, files }) => {
		if (editIndex) {
			// Edit shortcut
			// Check whether user is updating the image or not
			const updatedSc = files.length
				? { name, url, image: files[0] }
				: { name, url, image: oldImageBuffer };
			const result = await idbAction('shortcuts', 'updateOne', {
				data: updatedSc,
				key: editIndex,
			});
			if (result)
				setShortcuts((initVal) => {
					const newShortcuts = JSON.parse(JSON.stringify(initVal));
					const alteredIdx = newShortcuts.findIndex((sc) => {
						return sc.key === editIndex;
					});
					newShortcuts.splice(alteredIdx, 1, {
						key: editIndex,
						...result.data,
						image,
					});
					return newShortcuts;
				});
			else console.log('Unable to update');
		} else {
			// Add shortcut
			const newSc = { name, url, image: files[0] };
			const newScId = await idbAction('shortcuts', 'createOne', newSc);
			const imageURL = await readerFactory(files[0], 'readAsDataURL');
			setShortcuts((initVal) => [
				...initVal,
				{ ...newSc, image: imageURL, key: newScId },
			]);
		}

		onClose();
	};
	const handleCancel = () => {
		setTimeout(() => setImage(''), 225);
		onClose(false);
	};

	// File Input Handling
	const onFileInput = async (e) => {
		const { files } = e.target;
		const valid = await trigger('files');
		if (valid) {
			const imageURL = await readerFactory(files[0], 'readAsDataURL');
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
		<Dialog open={open} onClose={handleCancel}>
			<form className="test" onSubmit={handleSubmit(handleConfirm)}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<TextField
						variant="outlined"
						className={classes.textField}
						placeholder="Lorem ipsum is good"
						label="Name"
						name="name"
						inputRef={register({ required: true, maxLength: 32 })}
						error={Boolean(errors.name)}
					/>
					<TextField
						variant="outlined"
						className={classes.textField}
						placeholder="loremipsum.com"
						label="URL"
						name="url"
						inputRef={register({ required: true, pattern: URLRegex })}
						error={Boolean(errors.url)}
					/>
					{image && <RenderImage />}
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
							ref={register({
								validate: {
									imageOnly: (files) => {
										if (files.length) return files[0].type.startsWith('image/');
									},
								},
							})}
							onChange={onFileInput}
						/>
					</Button>
					{errors.files && (
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

export default FormDialog;
