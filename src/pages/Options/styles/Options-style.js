import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;
const linkBorder = 4;

export default makeStyles((theme) => ({
	root: {
		minHeight: '100vh',
		backgroundColor: '#fff',
	},
	icon: {
		fill: '#fff !important',
	},
	drawer: {
		width: drawerWidth,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.short,
		}),
		backgroundColor: '#4C5A69',
		color: '#fff',
	},
	drawerClose: {
		width: theme.spacing(7),
	},
	drawerToolbar: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: theme.spacing(2, 0),
		backgroundColor: '#2C3A49',
	},
	link: {
		paddingLeft: `${16 + linkBorder}px !important`,
		'&::before': {
			content: '""',
			display: 'block',
			width: linkBorder,
			height: '100%',
			position: 'absolute',
			top: 0,
			left: 0,
			backgroundColor: 'rgba(255, 255, 255, 0)',
			transition: theme.transitions.create('background-color', {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.short,
			}),
		},
		'&.active::before': {
			backgroundColor: 'rgba(255, 255, 255, 1)',
		},
	},
	main: {
		marginLeft: drawerWidth,
		padding: theme.spacing(5, 0),
		transition: theme.transitions.create('margin-left', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.short,
		}),
		position: 'relative',
	},
	mainClose: {
		marginLeft: theme.spacing(7),
	},
	progress: {
		position: 'absolute !important',
		top: 0,
		left: 0,
		width: '100%',
		visibility: 'hidden',
	},
	progressShow: {
		visibility: 'visible',
	},
}));
