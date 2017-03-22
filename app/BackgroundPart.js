import React from 'react';
import $ from 'jquery';

export default class BackgroundPart extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			shadowing : false,
			stored : false,
			clearing: false
		}
	}

	render(){
		
		var oW = this.props.blockWidth;
		return (
			<div style={{ width:oW*10 + 'px', height:oW*20 + 'px' }} className="backgroundBox">
			</div>
		)
	}
}
