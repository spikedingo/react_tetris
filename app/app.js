import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import Tetris from './Tetris.js';
import './app.css';

// class HelloWorld extends React.Component {
// 	render() {
// 		return (
// 			<div>SpikeDingo</div>
// 		);
// 	}
// }

// function get(url) {
// 	return Promise.resolve($.ajax(url));
// }

// get('https://hacker-news.firebaseio.com/v0/topstories.json').then(function(stories){
// 	return Promise.all(stories.slice(0,30).map(itemId => get('https://hacker-news.firebaseio.com/v0/item/' + itemId + '.json')))
// }).then(function(items){
// 	render(<NewsList items={items} />, $('#content')[0]);
// }).catch(function(err){
// 	console.log('error occur', err);
// });

render(<Tetris />, $('#tetris')[0]);