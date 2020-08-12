import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	root: {
		height: '100%',
		backgroundColor: ({ defaultColor }) => defaultColor,
		backgroundPosition: 'top center',
		backgroundSize: 'cover',
		position: 'relative',
	},
	optionsButton: {
		position: 'fixed',
		bottom: '5%',
		left: '5%',
	},
	settingsIcon: {
		marginRight: theme.spacing(1),
	},
	shortcuts: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '90%',
		maxWidth: 1200,
		color: '#fff',
	},
	sortable: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	shortcut: {
		textDecoration: 'none',
		color: '#fff',
		width: theme.spacing(10),
		display: 'inline-block',
		margin: theme.spacing(1),
		textAlign: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
		position: 'relative',
		bottom: 0,
		transition: `transform 0s ease-out, ${theme.transitions.create('bottom', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeOut,
		})}`,
		'&:hover': {
			bottom: 5,
		},
	},
	addShortcut: {
		'&:hover': { transform: 'initial' },
		'& $icon': {
			cursor: 'pointer',
			transition: theme.transitions.create('transform', {
				duration: theme.transitions.duration.shorter,
				easing: theme.transitions.easing.easeOut,
			}),
			'&:hover': {
				bottom: 5,
			},
		},
	},
	addShortcutIcon: {
		fill: 'rgba(0, 0, 0, 0.57)',
		fontSize: '4rem',
	},
	icon: {
		display: 'inline-flex',
		width: theme.spacing(9),
		height: theme.spacing(9),
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		'text-shadow':
			'0px 1px 1px rgba(0,0,0,0.35), 0px 1px 1px rgba(0,0,0,0.24), 0px 1px 3px rgba(0,0,0,0.21)',
		fontSize: '1em',
		width: '100%',
		maxHeight: 32,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}));
