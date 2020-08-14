import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;
const linkBorder = 4;

export default makeStyles((theme) => ({
	'@global': {
		h4: {
			marginBottom: theme.spacing(4),
		},
	},
	root: {
		minHeight: '100vh',
		backgroundColor: '#fff',
	},
	icon: {
		fill: '#fff',
	},
	drawer: {
		width: drawerWidth,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.short,
		}),
		backgroundColor: '#393e46',
		color: '#fff',
	},
	drawerClose: {
		width: theme.spacing(7) + linkBorder,
	},
	drawerToolbar: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: theme.spacing(2, 0),
		backgroundColor: '#222831',
	},
	link: {
		paddingLeft: 16 + linkBorder,
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
	whiteHover: {
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.075)',
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
		marginLeft: theme.spacing(7) + linkBorder,
	},
}));
