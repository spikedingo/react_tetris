import React from 'react';
import $ from 'jquery';
import cx from 'classnames'

export default class BackgroundItem extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			stored : false,
			droping: false,
			colored: false,
			color:this.props.backColor,
			opacity:this.props.backOpa
		}
	}

	render(){
		var oW = this.props.blockWidth;
		var classname = cx({
			'backgroundBox-item':true,
			'shadowed':this.state.shadowing,
			'colored':this.state.colored,
			'stored':this.state.stored
		});
		var style = {
			width:oW + 'px',
			height:oW + 'px',
			left:(this.props.itemKey)%10*oW +'px',
			top:oW*parseInt((this.props.itemKey)/10) + 'px'
		}
		return (
			<div style={style} className={classname} data-top={style.top} data-left={style.left} data-number={this.props.itemKey}>
				<div style={{backgroundColor:this.state.color,opacity:this.state.opacity}} className="background-littlePart"></div>
			</div>
		)
	}
}

