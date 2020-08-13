import React from 'react';
import { render } from 'react-dom';
import Board from './Board.jsx';
const data = require('./data/base.json');

render(
	<Board
		data={data}
		draggable
		// editable
	/>,
	document.querySelector('#root')
);
