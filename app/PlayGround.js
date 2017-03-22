import React from 'react';
import $ from 'jquery';
import PlayBox from './PlayBox.js';
import SideFuncBox from './SideFuncBox.js';
import TitleBlock from './TitleBlock.js';

export default class PlayGround extends React.Component{
	constructor(props){

		//根据数组设置小方块的排序以组成大方块
		var shapeTypes = {
			'O':[
				{'left':[0,1,0,1],'top':[1,1,2,2]},
				{'left':[0,1,0,1],'top':[1,1,2,2]},
				{'left':[0,1,0,1],'top':[1,1,2,2]},
				{'left':[0,1,0,1],'top':[1,1,2,2]}
			],
			'I':[
				{'left':[1,1,1,1],'top':[0,1,2,3]},
				{'left':[0,1,2,3],'top':[2,2,2,2]},
				{'left':[1,1,1,1],'top':[0,1,2,3]},
				{'left':[0,1,2,3],'top':[2,2,2,2]}
			],
			'S':[
				{'left':[1,2,0,1],'top':[1,1,2,2]},
				{'left':[0,0,1,1],'top':[0,1,1,2]},
				{'left':[1,2,0,1],'top':[1,1,2,2]},
				{'left':[0,0,1,1],'top':[0,1,1,2]}
			],
			'Z':[
				{'left':[0,1,1,2],'top':[1,1,2,2]},
				{'left':[2,1,2,1],'top':[0,1,1,2]},
				{'left':[0,1,1,2],'top':[1,1,2,2]},
				{'left':[2,1,2,1],'top':[0,1,1,2]}
			],
			'L':[
				{'left':[0,0,0,1],'top':[0,1,2,2]},
				{'left':[0,1,2,0],'top':[1,1,1,2]},
				{'left':[0,1,1,1],'top':[0,0,1,2]},
				{'left':[2,0,1,2],'top':[0,1,1,1]}
			],
			'J':[
				{'left':[2,2,1,2],'top':[0,1,2,2]},
				{'left':[0,0,1,2],'top':[1,2,2,2]},
				{'left':[0,1,0,0],'top':[0,0,1,2]},
				{'left':[0,1,2,2],'top':[0,0,0,1]}
			],
			'T':[
				{'left':[1,0,1,2],'top':[1,2,2,2]},
				{'left':[0,0,1,0],'top':[0,1,1,2]},
				{'left':[0,1,2,1],'top':[0,0,0,1]},
				{'left':[1,0,1,1],'top':[0,1,1,2]}
			],
		}

		var colorTypes = [
			'#85d536',
			'#5bd0ff',
			'#fbaa46',
			'#ff8197',
			'#b0c4ff',
			'#fff',
			'#f1ff16'
		];

		var wholeTypes = ['O','I','S','Z','L','J','T'];



		super(props);
		this.state = {
			blockWidth: 0,
			backColor : '#59708a',
			backOpa:0.5,
			oparateRight:1,
			shapeTypes:shapeTypes,
			colorTypes:colorTypes,
			wholeTypes:wholeTypes,
			started: false
		}
		this.getNextPart = this.getNextPart.bind(this);
		this.useOnePredict = this.useOnePredict.bind(this);
		this.getRandomType = this.getRandomType.bind(this);
		this.holdPartFunc = this.holdPartFunc.bind(this);
		this.startGame = this.startGame.bind(this);
	}

	componentWillMount(){
		this.setState({
			blockWidth: this.getBlockWidth()
		})
	}

	getBlockWidth(){
		var oWidth = Math.floor($(window).height()/23);
		if (oWidth * 10 > $(window).width()) {
			oWidth = Math.floor($(window).width()/10);
		}
		return oWidth;
	}

	getNextPart(){
		var nextType = this.refs['sideFuncBox-0'].state.partType;
		var secondType = this.refs['sideFuncBox-1'].state.partType;
		this.refs['sideFuncBox-0'].setState({
			partType:secondType
		});
		var thirdType = this.refs['sideFuncBox-2'].state.partType;
		this.refs['sideFuncBox-1'].setState({
			partType:thirdType
		});
		var newType = this.getRandomType();
		this.refs['sideFuncBox-2'].setState({
			partType:newType
		})
		return nextType;
	}

	getRandomType(){
		var arr = ['O','I','S','Z','L','J','T'];
		var newType = arr[Math.floor(Math.random() * arr.length + 1)-1];

		return newType;
	}

	useOnePredict(){
		var nextType = this.refs['sideFuncBox-0'].state.partType;
		var secondType = this.refs['sideFuncBox-1'].state.partType;
		this.refs['sideFuncBox-0'].setState({
			partType:secondType
		});
		var thirdType = this.refs['sideFuncBox-2'].state.partType;
		this.refs['sideFuncBox-1'].setState({
			partType:thirdType
		});
		var newType = this.getRandomType(true);
		this.refs['sideFuncBox-2'].setState({
			partType:newType
		})
		return nextType;
	}

	startGame(){
		var _this = this;
		this.setState({
			started:true
		});
		[0,1,2].map(function(x,i) {
			var oType = _this.getRandomType();
			_this.refs['sideFuncBox-' + x].setState({
				partType:oType
			})
		});
		this.refs['playBox'].setState({
			started: true
		})
	}

	holdPartFunc(playingPart){
		console.log(playingPart,'playingPart')
		var holdedType = this.refs['sideFuncBox-3'].state.partType;

		console.log(this.refs['sideFuncBox-3'].state.partType)
		this.refs['sideFuncBox-3'].setState({
			partType:playingPart
		})
		
		if (holdedType) {
			return holdedType;
		} else {
			return this.useOnePredict();
		}
	}

	render(){
		var oHeight = $(window).height();
		var oW = this.state.blockWidth;
		var arr = [1,2,3,4]
		var _this = this;
		return (
			<div style={{width:'100%', height:oHeight+'px'}} className="playGround">

				<TitleBlock outHeight={oHeight} blockWidth={this.state.blockWidth} startGame={this.startGame} />

				<PlayBox 
					ref='playBox'
					blockWidth={this.state.blockWidth} 
					backOpa={this.state.backOpa} 
					backColor={this.state.backColor} 
					outHeight={oHeight} 
					shapeTypes={this.state.shapeTypes}
					colorTypes={this.state.colorTypes}
					getNextPart={this.getNextPart}
					holdPartFunc={this.holdPartFunc}
				/>

				<div className="storePartBlock" style={{
					width:oW*4+'px',
					height: oW*16+'px',
					//background: this.state.backColor,
					opacity: this.state.backOpa,
					top:'-' + oW*10 + 'px',
					marginTop: oHeight/2 + 'px',
					marginLeft: '50%',
					left: oW*3 + 'px',
					position: 'absolute'
				}}>
				{
					arr.map(function(x,i) {
						//var oType = '';
						if (i<3) {
							return (
								<SideFuncBox 
									key={'sideFunc-'+i}
									ref={'sideFuncBox-'+i}
									class="predictBox"
									blockWidth={_this.state.blockWidth} 
									backColor={_this.state.backColor} 
									backOpa={_this.state.backOpa}  
									outHeight={oHeight} 
									shapeTypes={_this.state.shapeTypes}
									colorTypes={_this.state.colorTypes}
									wholeTypes={_this.state.wholeTypes}
									partType=''
									count={i}
									cName='predictBox'
								/>
							)
						}else{
							return (
								<SideFuncBox 
									key={'sideFunc-'+i}
									ref={'sideFuncBox-'+i}
									class="predictBox"
									blockWidth={_this.state.blockWidth} 
									backColor={_this.state.backColor} 
									backOpa={_this.state.backOpa}  
									outHeight={oHeight} 
									shapeTypes={_this.state.shapeTypes}
									colorTypes={_this.state.colorTypes}
									wholeTypes={_this.state.wholeTypes}
									partType=''
									count={i}
									cName='storeBox'
								/>
							)
						}
					})
				}
				</div>
			</div>
		)
	}
}
