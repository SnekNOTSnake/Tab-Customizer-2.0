import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	dialogPaper: {
		width: theme.spacing(60),
	},
	textField: {
		margin: theme.spacing(1, 0),
	},
	shortcutIcon: {
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		margin: theme.spacing(1, 0),
	},
	addFileButton: {
		margin: theme.spacing(1, 0),
	},
	inputFile: {
		display: 'none',
	},
}));
