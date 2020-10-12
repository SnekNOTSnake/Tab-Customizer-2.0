import React from 'react';
import ReactDOM from 'react-dom';

import '../../assets/fonts/stylesheet.css';
import './styles/index.css';
import Newtab from './components/Newtab';

ReactDOM.render(
	<React.StrictMode>
		<Newtab />
	</React.StrictMode>,
	document.getElementById('root')
);
