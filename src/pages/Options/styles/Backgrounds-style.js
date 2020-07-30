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
		overflow: 'hidden',
		'&:hover $itemMenu': {
			transform: 'translateY(0)',
		},
	},
	itemMenu: {
		position: 'absolute',
		left: 0,
		top: '70%',
		bottom: '0',
		width: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		transform: 'translateY(101%)',
		transition: theme.transitions.create('transform', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.short,
		}),
	},
	itemMenuButton: {
		margin: `${theme.spacing(0, 0.5)} !important`,
	},
	workButton: {
		backgroundColor: `${theme.palette.warning.main} !important`,
		color: '#fff !important',
	},
	nsfw: {
		display: 'flex',
		position: 'absolute',
		top: theme.spacing(2),
		right: theme.spacing(2),
		zIndex: 10,
		cursor: 'normal',
		userSelect: 'none',
		borderRadius: 100,
		backgroundColor: theme.palette.secondary.main,
		color: '#fff',
		width: theme.spacing(3),
		height: theme.spacing(3),
		alignItems: 'center',
		justifyContent: 'center',
	},
}));
