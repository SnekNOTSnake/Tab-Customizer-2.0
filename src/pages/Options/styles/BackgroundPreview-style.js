import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	dialogPaper: {
		width: '100%',
		textAlign: 'center',
		fontSize: 0,
		'& div': {
			fontSize: '1rem',
		},
	},
	cropButton: {
		position: 'absolute',
		bottom: '5%',
		right: '5%',
		zIndex: 100,
	},
	root: {
		'& img': {
			maxWidth: '100%',
			margin: 'auto',
			display: 'block',
			maxHeight: 'calc(100vh - 64px)',
		},
	},
}));
