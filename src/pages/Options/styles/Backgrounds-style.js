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
}));
