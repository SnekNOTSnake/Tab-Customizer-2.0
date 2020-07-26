import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	fab: {
		position: 'fixed !important',
		bottom: '5%',
		right: '5%',
	},
	items: {
		margin: `${theme.spacing(2, 0)} !important`,
	},
	item: {
		display: 'inline-block',
		position: 'relative',
		paddingBottom: '56.25%',
		width: '100%',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
	},
	deleteButton: {
		position: 'absolute !important',
		bottom: 10,
		right: 10,
	},
}));
