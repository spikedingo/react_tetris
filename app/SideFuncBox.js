import React from 'react';

export default class SideFuncBox extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			partType: this.props.partType
		}

		this.getLeft = this.getLeft.bind(this);
		this.getTop = this.getTop.bind(this);
		this.getColor = this.getColor.bind(this);
	}

	getColor(partType){
		var wholeTypes = this.props.wholeTypes;
		var colorType = this.props.colorTypes;
		return colorType[wholeTypes.indexOf(partType)];
	}

	getLeft(oLeft){
		var oW = this.props.blockWidth;
		var oWmin = oW*3/4;

		var widthArr = [];
		oLeft.map(function(x) {
			if (widthArr.indexOf(x) === -1) {
				widthArr.push(x);
			}
		});
		var oWidth = widthArr.length;
		if (this.state.partType == 'I' || this.state.partType == 'J') {
			var offsetX = 1;
		}else{
			var offsetX = 0;
		}

		return (oW*4-oWmin*oWidth)/2 - offsetX*oWmin;
	}

	getTop(oTop){
		var oW = this.props.blockWidth;
		var oWmin = oW*3/4;

		var heightArr = [];
		oTop.map(function(x) {
			if (heightArr.indexOf(x) === -1) {
				heightArr.push(x);
			}
		});
		var oHeight = heightArr.length;

		var offsetY;
		if (oHeight==2) {
			offsetY = 1;
		}else{
			offsetY = 0;
		}

		return (oW*4-oWmin*oHeight)/2 - offsetY*oWmin;
	}

	render(){
		var oW = this.props.blockWidth;
		var oWmin = oW*3/4;

		if (this.state.partType) {
			var shapeType = this.props.shapeTypes;

			var	oTop = shapeType[this.state.partType][0].top;
			var oLeft = shapeType[this.state.partType][0].left;
			var _this = this;
			return (
				<div className="predictBox"  style={{
					width:oW*4-2+'px',
					height: oW*4-2+'px', 
					background: this.props.cName=='predictBox' ? this.props.backColor : '',
					border: this.props.cName=='predictBox' ? '' : 'solid 2px ' + this.props.backColor,
					backgroundOpacity: this.props.backOpa,
					float:'left',
					textAlign:'center',
					border:'solid 2px '+ this.props.backColor,
					marginBottom:'2px'
				}}>
					<div className="littlePart-wrap"
						style={{
							left:this.getLeft(oLeft) + 'px',
							top:this.getTop(oTop) + 'px',
						}}
						data-shape={this.state.partType}>
						{
							oTop.map(function(x,i){
								return (
									<div ref='littleParts' key={x*10+oLeft[i]} className="littlePart" style={{
										width:oWmin+'px',
										height:oWmin + 'px',
										top:x*oWmin + _this.props.count*oW*4 + 'px',
										left:oLeft[i]*oWmin + 'px'
									}}>
										<div style={{background:_this.getColor(_this.state.partType)}} className="inner-littlePart"></div>
									</div>
								)
							})
						}
					</div>
				</div>
			)
		}else{
			return(
				<div className="predictBox"  style={{
					width:oW*4-2+'px',
					height: oW*4-2+'px', 
					background: this.props.cName=='predictBox' ? this.props.backColor : '',
					border: this.props.cName=='predictBox' ? '' : 'solid 2px ' + this.props.backColor,
					backgroundOpacity: this.props.backOpa,
					float:'left',
					textAlign:'center',
					border:'solid 2px '+ this.props.backColor,
					marginBottom:'2px'
				}}>
				</div>
			)
		}
	}
}