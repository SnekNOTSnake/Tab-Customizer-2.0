import React from 'react';
import filesize from 'filesize';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { idbAction } from '../../utils/helpers';

const BackgroundOptionsDetail = () => {
	const [data, setData] = React.useState({
		backgrounds: { files: 0, totalSize: 0 },
		shortcuts: { files: 0, totalSize: 0 },
	});
	const fetchData = async () => {
		const bgsRawData = await idbAction.getAll('backgrounds', null, true);
		const scsRawData = await idbAction.getAll('shortcuts', null, true);
		const bgsSizes = bgsRawData.map((item) => item?.image?.size ?? 0);
		const scsSizes = scsRawData.map((item) => item?.image?.size ?? 0);
		// bgsSize(numbers), scsSize(numbers), total
		const data = {
			backgrounds: {
				files: bgsSizes.length,
				totalSize: bgsSizes.reduce((p, c) => p + c, 0),
			},
			shortcuts: {
				files: scsSizes.length,
				totalSize: scsSizes.reduce((p, c) => p + c, 0),
			},
		};
		setData(data);
	};
	React.useEffect(() => {
		fetchData();
	}, []);
	return (
		<TableContainer style={{ maxWidth: 500 }}>
			<Table>
				<TableBody>
					<TableRow>
						<TableCell variant="head">Backgrounds</TableCell>
						<TableCell>
							{filesize(data.backgrounds.totalSize)} ({data.backgrounds.files})
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Shortcuts</TableCell>
						<TableCell>
							{filesize(data.shortcuts.totalSize)} ({data.shortcuts.files})
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell variant="head">Total</TableCell>
						<TableCell>
							{filesize(data.backgrounds.totalSize + data.shortcuts.totalSize)}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default BackgroundOptionsDetail;
