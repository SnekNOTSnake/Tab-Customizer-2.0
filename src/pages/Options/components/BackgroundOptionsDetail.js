import React from 'react';
import filesize from 'filesize';
import { idbAction } from '../../utils/helpers';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const BackgroundOptionsDetail = () => {
	const [data, setData] = React.useState({
		backgrounds: { files: 0, totalSize: 0 },
		shortcuts: { files: 0, totalSize: 0 },
	});
	const fetchData = async () => {
		const bgsRawData = await idbAction('backgrounds', 'getAll', null, {
			noConversion: true,
			limit: 1000,
		});
		const scsRawData = await idbAction('shortcuts', 'getAll', null, {
			noConversion: true,
			limit: 1000,
		});
		const bgsSizes = bgsRawData.data.map((item) => item.image.size);
		const scsSizes = scsRawData.data.map((item) => item.image.size);
		// bgsSize(numbers), scsSize(numbers), total
		const data = {
			backgrounds: {
				files: bgsSizes.length,
				totalSize: bgsSizes.reduce((p, c) => p + c),
			},
			shortcuts: {
				files: scsSizes.length,
				totalSize: scsSizes.reduce((p, c) => p + c),
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
