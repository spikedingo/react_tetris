import React from 'react';
import PlayGround from './PlayGround.js';
import '../styles/tetrisBasic.css';

export default class Tetris extends React.Component {
	render() {
		return (
			<div className="tetris">
				<PlayGround />
			</div>
		);
	}
}