import React from 'react';

import Popover from '@material-ui/core/Popover';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const Row = ({ label, value }) => (
	<TableRow>
		<TableCell>{label}</TableCell>
		<TableCell>{value}</TableCell>
	</TableRow>
);

const capitalize = (str) => {
	const newStr = str.split('');
	newStr[0] = newStr[0].toUpperCase();
	return newStr;
};

const BackgroundInfo = ({ anchorEl, fileInfo, closeInfo }) => {
	return (
		<Popover
			open={Boolean(anchorEl)}
			onClose={closeInfo}
			anchorEl={anchorEl}
			anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
			transformOrigin={{ vertical: 'top', horizontal: 'left' }}
		>
			<TableContainer>
				<Table>
					<TableBody>
						{Object.keys(fileInfo).map((el, i) => (
							<Row key={i} label={capitalize(el)} value={fileInfo[el]} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Popover>
	);
};

export default BackgroundInfo;
