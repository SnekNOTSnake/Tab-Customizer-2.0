import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import Popup from './components/Popup';

ReactDOM.render(
	<React.StrictMode>
		<Popup />
	</React.StrictMode>,
	document.getElementById('app-container')
);
