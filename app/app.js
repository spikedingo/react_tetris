import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import Tetris from './Tetris.js';
import './app.css';


render(<Tetris />, $('#tetris')[0]);
