import React from 'react';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const BackgroundOptions = ({ setProgress }) => {
	React.useEffect(() => {
		setProgress(100);
		const timeout = setTimeout(() => setProgress(null), 750);
		return () => clearTimeout(timeout);
	}, [setProgress]);
	return (
		<Container fixed>
			<Typography variant="h4">Wallpaper Options</Typography>
		</Container>
	);
};

export default BackgroundOptions;
