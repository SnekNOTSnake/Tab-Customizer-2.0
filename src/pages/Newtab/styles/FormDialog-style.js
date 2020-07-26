import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	textField: {
		width: '100%',
		display: 'block',
		margin: `${theme.spacing(1, 0)} !important`,
	},
	shortcutIcon: {
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		margin: `${theme.spacing(1, 0)} !important`,
	},
	addFileButton: {
		margin: `${theme.spacing(1, 0)} !important`,
	},
	inputFile: {
		display: 'none',
	},
}));
