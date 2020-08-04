import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	root: {
		padding: theme.spacing(1, 2),
		boxSizing: 'border-box',
		minWidth: theme.spacing(34),
	},
	title: {
		display: 'flex',
		alignItems: 'center',
	},
	logo: {
		width: theme.spacing(5),
		marginRight: theme.spacing(0.5),
	},
}));
