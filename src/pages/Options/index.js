import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router } from 'react-router-dom';

import './styles/index.css';
import Options from './components/Options';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Options />
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);
