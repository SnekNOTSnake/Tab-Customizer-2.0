import React from 'react';
import snsLogo from '../../../assets/img/sns-logo.png';

import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const About = () => {
	return (
		<Container fixed>
			<Typography variant="h4">About</Typography>
			<img
				style={{ margin: '16px 0', width: 200, height: 'auto' }}
				alt="logo"
				src={snsLogo}
			/>
			<Typography variant="body1">
				Created with{' '}
				<Link target="_blank" href="https://material-ui.com/">
					Material-UI
				</Link>{' '}
				by{' '}
				<Link target="_blank" href="https://github.com/SnekNOTSnake">
					SnekNOTSnake
				</Link>
			</Typography>
		</Container>
	);
};

export default About;
