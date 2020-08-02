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
			<Typography style={{ margin: '16px 0' }} variant="h5">
				How it works
			</Typography>
			<Typography paragraph>
				In a nutshell, the extension works by storing the data (i.e. background
				and shortcuts) inside one of the browser's storage, that is IndexedDB.
				Quoting from Wikipedia,{' '}
				<q>
					The Indexed Database API is a JavaScript application programming
					interface provided by web browsers for managing a NoSQL database of
					JSON objects
				</q>
				. It allows user to store and retrieve data from the local database.
			</Typography>
			<Typography paragraph>
				When the NSFW state is off, the Newtab page reads all of the wallpaper
				records in the store and then randomly pick one. Meanwhile when the NSFW
				state is turned on, it picks a random key from background store's index
				that has a <code>safe</code> key value of <code>1</code>. It uses no{' '}
				<i>smart random</i> which means the same wallpaper could be picked from
				multiple pick attempts in a row.
			</Typography>
			<Typography paragraph>
				The extension itself is built using React boilerplate{' '}
				<Link
					target="_blank"
					href="https://github.com/lxieyang/chrome-extension-boilerplate-react"
				>
					chrome-extension-boilerplate-react
				</Link>{' '}
				with <Link href="https://material-ui.com/">Material-UI</Link> by{' '}
				<Link target="_blank" href="https://github.com/SnekNOTSnake">
					SnekNOTSnake
				</Link>
			</Typography>
		</Container>
	);
};

export default About;
