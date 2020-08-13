import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
	root: {
		height: '100%',
		backgroundColor: '#aaa',
		backgroundPosition: 'top center',
		backgroundSize: 'cover',
		position: 'relative',
	},
	optionsButton: {
		zIndex: 5,
		position: 'fixed',
		bottom: 20,
		left: 20,
	},
	settingsIcon: {
		marginRight: theme.spacing(1),
	},
	shortcuts: {
		boxSizing: 'border-box',
		padding: theme.spacing(1, 0),
		zIndex: 5,
		position: 'absolute',
		top: ({ options }) => {
			switch (options?.shortcutsPosition) {
				case 'bottom':
					return '80%';
				case 'center':
					return '50%';
				default:
					return 0;
			}
		},
		left: ({ options }) => {
			switch (options?.shortcutsPosition) {
				case 'left':
					return 0;
				case 'right':
					return 'initial';
				default:
					return '50%';
			}
		},
		right: ({ options }) =>
			options?.shortcutsPosition === 'right' ? 0 : 'initial',
		transform: ({ options }) =>
			options?.shortcutsPosition === 'center' ||
			options?.shortcutsPosition === 'bottom'
				? 'translate(-50%, -50%)'
				: 'initial',
		width: '90%',
		maxWidth: ({ options }) =>
			options?.shortcutsPosition === 'bottom' ||
			options?.shortcutsPosition === 'center'
				? 1200
				: 96,
		color: '#fff',
		height: ({ options }) =>
			options?.shortcutsPosition === 'center' ||
			options?.shortcutsPosition === 'bottom'
				? 'initial'
				: '100vh',
	},
	sortable: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: ({ options }) =>
			options?.shortcutsPosition === 'center' ||
			options?.shortcutsPosition === 'bottom'
				? 'center'
				: 'flex-start',
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
		fontSize: ({ options }) =>
			options?.shortcutsSize === 'small' ? '3rem' : '4rem',
	},
	icon: {
		display: 'inline-flex',
		width: ({ options }) =>
			theme.spacing(options?.shortcutsSize === 'small' ? 7 : 9),
		height: ({ options }) =>
			theme.spacing(options?.shortcutsSize === 'small' ? 7 : 9),
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
		maxHeight: 28,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
}));
