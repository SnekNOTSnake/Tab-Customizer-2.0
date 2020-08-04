import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import WarningIcon from '@material-ui/icons/Warning';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { idbAction } from '../../utils/helpers';

const BackgroundOptionsDangerZone = ({ openSnackbar }) => {
	// Delete Confirmation
	const [action, setAction] = React.useState(null);
	const closeDialog = async (value) => {
		if (!value) return setAction(null);
		switch (value) {
			case 'clearShortcuts':
				idbAction
					.clear('shortcuts')
					.then(() => openSnackbar('success', 'Shortcuts cleared!'))
					.catch(() => openSnackbar('error', 'Unable to clear shortcuts'));
				break;
			case 'clearBackgrounds':
				idbAction
					.clear('backgrounds')
					.then(() => openSnackbar('success', 'Backgrounds cleared!'))
					.catch(() => openSnackbar('error', 'Unable to clear backgrounds'));
				break;
			default:
				break;
		}
		setAction(null);
	};

	return (
		<div className="BackgroundOptionsDangerZone">
			<Accordion elevation={5} style={{ margin: '48px 0', maxWidth: 500 }}>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<WarningIcon
						color="secondary"
						style={{ fontSize: 30, marginRight: 8 }}
					/>
					<Typography variant="h6">Danger Zone</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Button
						variant="contained"
						color="primary"
						type="button"
						onClick={() => setAction('clearBackgrounds')}
						style={{ marginRight: '8px' }}
					>
						Clear Backgrounds
					</Button>
					<Button
						variant="contained"
						color="primary"
						type="button"
						onClick={() => setAction('clearShortcuts')}
					>
						Clear Shortcuts
					</Button>
				</AccordionDetails>
			</Accordion>

			<Dialog open={Boolean(action)} onClose={() => closeDialog(null)}>
				<DialogTitle>Clear Confirmation</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete all of the{' '}
						{action === 'clearShortcuts' ? 'shortcuts' : 'wallpapers'}? The
						deleted data cannot be recovered.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => closeDialog(action)}
						color="secondary"
						variant="outlined"
					>
						Yes
					</Button>
					<Button
						onClick={() => closeDialog(null)}
						color="primary"
						variant="outlined"
					>
						No
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default BackgroundOptionsDangerZone;
