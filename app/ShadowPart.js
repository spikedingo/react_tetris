import React from 'react';
import $ from 'jquery';
import cx from 'classnames';

export default class ShadowPart extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			type:null,
			shape:null,
			wrapLeft:null,
			wrapTop:null,
			shapeTypes:this.props.shapeTypes,
			color:null,
			opacity:1
		}
		this.getPreviewPos = this.getPreviewPos.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
	}

	getPreviewPos(arr,move){
		var check = this.props.checkCanAction(arr,move);
		return check;
	}

	updatePosition(){
		var oW = this.props.blockWidth;
		var shapeType = this.props.shapeTypes;
		var	oTop = shapeType[this.state.type][this.state.shape].top;
		var oLeft = shapeType[this.state.type][this.state.shape].left;
		var posMarks = [];
		var _this = this;
		oTop.map(function(x,i) {
			posMarks.push((x+_this.state.wrapTop/oW)*10+(oLeft[i]+_this.state.wrapLeft/oW));
		});
		return posMarks;
	}

	componentDidUpdate(){
		var oW = this.props.blockWidth;
		var posMarks = this.updatePosition();
		var check = this.getPreviewPos(posMarks,10);
		if (check) {
			this.setState({
				wrapTop:this.state.wrapTop + oW
			})
		}
	}

	render(){
		var shapeType = this.state.shapeTypes;

		if ((this.state.type !== null) && (this.state.shape !== null)) {
			var oW,oStyle;
			oW = this.props.blockWidth;

			oStyle = {
				left:this.state.wrapLeft + 'px',
				top:this.state.wrapTop +'px',
				opacity:this.state.opacity
			}

			var	oTop = shapeType[this.state.type][this.state.shape].top;
			var oLeft = shapeType[this.state.type][this.state.shape].left;
			var _this = this;
			return (
				<div style={oStyle} className="littleShadowPart-wrap" data-shape={this.state.shape}>
					{	
						oTop.map(function(x,i){
							return (
								<div ref='littleShadowParts' key={i} className="littleShadowPart" style={{
									width:oW+'px',
									height:oW + 'px',
									top:x*oW + 'px',
									left:oLeft[i]*oW + 'px'
								}}>
									<div style={{borderColor:_this.state.color,opacity:_this.state.opacity}} className="inner-shadowPart"></div>
								</div>
							)
						})
					}
				</div>
			)
		}else{
			return(
				<div></div>
			)
		}
	}
}