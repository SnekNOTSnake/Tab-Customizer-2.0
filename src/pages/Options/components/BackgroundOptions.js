import React from 'react';
import { useForm } from 'react-hook-form';
import useStyle from '../styles/BackgroundOptions-style';
import { chromeOptions } from '../../../assets/defaultValues';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const BackgroundOptions = ({ setProgress }) => {
	const { setValue, register, handleSubmit, errors } = useForm();

	// Snackbar
	const [open, setOpen] = React.useState(false);
	const openSnackbar = () => setOpen(true);
	const closeSnackbar = () => setOpen(false);

	// Progress Effect
	React.useEffect(() => {
		setProgress(100);
		const timeout = setTimeout(() => setProgress(null), 750);
		return () => clearTimeout(timeout);
	}, [setProgress]);

	// Fetch Options Effect
	React.useEffect(() => {
		chrome.storage.sync.get({ itemsPerPage: 9 }, ({ itemsPerPage }) =>
			setValue('itemsPerPage', itemsPerPage)
		);
	}, [setValue]);

	const onSubmitHandler = async ({ itemsPerPage }) => {
		chrome.storage.sync.set({ itemsPerPage }, openSnackbar);
	};
	const onResetHandler = () => {
		setValue('itemsPerPage', chromeOptions.itemsPerPage);
	};

	const classes = useStyle();
	return (
		<Container fixed>
			<Typography variant="h4">Wallpaper Options</Typography>
			<form onSubmit={handleSubmit(onSubmitHandler)}>
				<FormGroup className={classes.formGroup}>
					<TextField
						error={Boolean(errors.itemsPerPage)}
						name="itemsPerPage"
						type="number"
						inputRef={register({ required: true, max: 100, min: 1 })}
						variant="outlined"
						label="Wallpaper items per page"
						helperText={(() => {
							if (errors.itemsPerPage) {
								switch (errors.itemsPerPage.type) {
									case 'required':
										return 'Items is required';
									case 'max':
										return 'Items must be between 10 and 100';
									case 'min':
										return 'Items must be between 10 and 100';
									default:
										break;
								}
							}
						})()}
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
					onClick={onResetHandler}
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
				open={open}
				onClose={closeSnackbar}
			>
				<Alert className={classes.snackbarAlert} severity="success">
					Options updated
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default BackgroundOptions;
