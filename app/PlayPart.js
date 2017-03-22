import React from 'react';
import $ from 'jquery';
import cx from 'classnames';

export default class PlayPart extends React.Component{
	constructor(props){
		super(props)
		this.type = this.getRandomType();
		this.color = this.getColor(this.type);
		this.state = {
			type:this.type,
			shape:0,
			shapeTypes:this.props.shapeTypes,
			wrapLeft:this.props.blockWidth * 3,
			wrapTop:this.props.blockWidth * -1,
			paused:false,
			downSpeed:1000,
			verticalSpeed:0,
			pressed:false,
			color:this.color,
			opacity:1,
			childrenTop:0,
			childrenOpacity:1,
			reseting:false,
			holded:false
		}
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyDownAction = this.handleKeyDownAction.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleKeyUpAction = this.handleKeyUpAction.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchStartAction = this.handleTouchStartAction.bind(this);
		this.initShadowPart = this.initShadowPart.bind(this);
		this.updatePosition = this.updatePosition.bind(this);
		this.setMovingTimer = this.setMovingTimer.bind(this);
		this.resetPartShape = this.resetPartShape.bind(this);
		this.getRandomType = this.getRandomType.bind(this);

		this.timerDown = null;
		this.timerVertical = null;
	}

	getRandomType(){
		var arr = ['O','I','S','Z','L','J','T'];
		//var arr = ['I'];  全部是长条
		var oType = arr[Math.floor(Math.random() * arr.length + 1)-1];
		return oType;
	}

	getColor(type){
		var wholeTypes = this.props.wholeTypes;
		var colorType = this.props.colorTypes;
		var oColor = colorType[wholeTypes.indexOf(type)];
		return oColor;
	}

	resetPartShape(fast){
		if (this.state.reseting) {
			return false;
		}
		var _this = this;
		if (fast) {
			this.setState({
				reseting : true
			})
			this.timerReset = setInterval(function() {
				_this.setState({
					childrenTop:_this.state.childrenTop+30,
					childrenOpacity:(parseInt(_this.state.childrenOpacity*100-20))/100
				})
				console.log(_this.state.childrenOpacity)
				if (!_this.state.childrenOpacity) {
					_this.setState({
						childrenTop:0,
						childrenOpacity:1
					})
					clearInterval(_this.timerReset);
					_this.setState({
						reseting : false
					})
				}
			},16.7)
		}

		setTimeout(function() {
				_this.setState({
					opacity:0
				})
				_this.props.partStoredAction();
				_this.setMovingTimer()
		},50.1)
	}

	initShadowPart(){
		this.props.resetShadowPart(this.state.type,this.state.shape,this.state.wrapLeft,this.state.wrapTop,this.state.color,this.state.opacity);
	}

	setMovingTimer(){
		var _this = this;
		clearInterval(this.timerDown);
		this.timerDown = setInterval(function() {
			var targetArr = _this.updatePosition();
			var canMove = _this.props.checkCanAction(targetArr,10);
			if (canMove) {
				if (_this.state.paused) {
					return;
				}
				_this.setState({
					wrapTop: _this.state.wrapTop+_this.props.blockWidth
				})
			}else{
				clearInterval(_this.timerDown);
				_this.setState({
					holded:false
				})
				_this.resetPartShape()
			}
		},this.state.downSpeed);
	}

	setVerticalTimer(flag){
		var _this = this;
		clearInterval(this.timerVertical);
		this.timerVertical = setInterval(function() {
			var targetArr = _this.updatePosition();
			var canMove = _this.props.checkCanAction(targetArr,flag);
			if (canMove) {
				_this.setState({
					wrapLeft: _this.state.wrapLeft + _this.state.verticalSpeed * flag
				});
			}
		},100);
	}

	handleKeyDown(e){
		if (this.state.pressed) {
			return false;
		}else{
			this.handleKeyDownAction(e);
		}
	}

	handleKeyUp(e){
		this.handleKeyUpAction(e);
	}

	handleTouchStart(e){
		this.handleTouchStartAction(e);
	}

	updatePosition(shapeChange){
		var oW = this.props.blockWidth,
			shapeType = this.props.shapeTypes,
			targetShape = shapeChange ? (this.state.shape + 1)%4 : this.state.shape,
			oTop = shapeType[this.state.type][targetShape].top,
			oLeft = shapeType[this.state.type][targetShape].left,
			posMarks = [],
			_this = this;
		oTop.map(function(x,i) {
			posMarks.push((x+_this.state.wrapTop/oW)*10+(oLeft[i]+_this.state.wrapLeft/oW));
		});
		return posMarks;
	}

	handleKeyDownAction(e){
		e.preventDefault();
		if (e.keyCode !== 74) {
			this.setState({
				pressed : true
			})
		}
		if (this.state.paused && e.keyCode !== 13) {
			return false;
		}
		switch(e.keyCode){
			//move left
			case 65 :
				var targetArr = this.updatePosition();
				var canMove = this.props.checkCanAction(targetArr,-1);
				if (canMove) {
					this.setState({
						wrapLeft: (this.state.wrapLeft) - this.props.blockWidth
					});
				}
				var _this = this;
				this.timerDelay = setTimeout(function() {
					_this.setState({
						verticalSpeed: _this.props.blockWidth
					})
				},200)
				this.setVerticalTimer(-1);
				break;
			//move right
			case 68 :
				var targetArr = this.updatePosition();
				var canMove = this.props.checkCanAction(targetArr,1);
				if (canMove) {
					this.setState({
						wrapLeft: (this.state.wrapLeft) + this.props.blockWidth
					});
				}
				var _this = this;
				this.timerDelay = setTimeout(function() {
					_this.setState({
						verticalSpeed: _this.props.blockWidth
					})
				},200)
				this.setVerticalTimer(1);
				break;
			//move down
			case 83 :
				var targetArr = this.updatePosition();
				var canMove = this.props.checkCanAction(targetArr,10);
				if (canMove) {
					this.setState({
						wrapTop: (this.state.wrapTop) + this.props.blockWidth,
						downSpeed: 100
					});
				};
				this.setMovingTimer();
				break;
			case 87 :
				this.setState({
					holded:false
				})
				this.resetPartShape(true);
				break;
			case 74 :
				var oW = this.props.blockWidth;
				var shapeType = this.props.shapeTypes;
				var targetShape = this.state.shape;
				var	oTop = shapeType[this.state.type][targetShape].top;
				var oLeft = shapeType[this.state.type][targetShape].left;
				var posMarks = [];
				var _this = this;
				oTop.map(function(x,i) {
					posMarks.push((x+_this.state.wrapTop/oW)*10+(oLeft[i]+_this.state.wrapLeft/oW));
				});
				var targetArr = this.updatePosition(1);
				if (posMarks.some(function(x){return (x>0 && x%10 < 2)})) {
					var	canChange = this.props.checkCanChange(targetArr,0,0,false,'left');
				}else if (posMarks.some(function(x){return (x>0 && x%10 > 7)})) {
					var	canChange = this.props.checkCanChange(targetArr,0,0,false,'right');
				}else{
					var	canChange = this.props.checkCanChange(targetArr,0,0,false);
				}
				if (canChange) {
					this.setState({
						shape:(this.state.shape + 1)%4
					})
				}
				break;
			case 75 :
				console.log(this.state.holded)
				if (this.state.holded) {
					return false;
				}else{
					this.props.partStoredAction(true,this.state.type);
					this.setState({
						holded:true
					})
				}
				break;
			case 13 :
				if (!this.state.paused) {
					this.setState({
						paused:true
					})
				}else{
					this.setState({
						paused:false
					})
				}
				break;
			default:
				return;
				break;
		}
	}

	handleKeyUpAction(e){
		this.setState({
			pressed: false
		})
		e.preventDefault();
		if (this.state.paused && e.keyCode !== 13) {
			return false;
		}
		switch(e.keyCode){
			case 65:
				this.setState({
					verticalSpeed:0
				});
				clearInterval(this.setVerticalTimer);
				clearInterval(this.timerDelay);
				break;
			case 68:
				this.setState({
					verticalSpeed:0
				});
				clearInterval(this.setVerticalTimer);
				clearInterval(this.timerDelay);
				break;
			case 83:
				this.setState({
					downSpeed:1000
				});
				this.setMovingTimer()
				break;
			default:
				return false;
				break;
		}
	}

	handleTouchStartAction(e){
		var moving,canMoveVertical,canDoOthers,oDisX,oDisY,_this,oW,delayChangeDir,oDir;
		e.stopPropagation();
		moving = false; //判断是否正在水平移动以防止移动过快
		canMoveVertical = false;	//判断是否可以水平移动
		canDoOthers = true;	//判断是否可以进行变形或者快速放置
		oDisX = e.targetTouches[0].pageX;	//储存刚开始触摸时的水平坐标
		oDisY = e.targetTouches[0].pageY;	//储存刚开始触摸时的垂直坐标
		oDir = 0;	//用来储存触摸滑动的距离
		_this = this;	//缓存this
		oW = _this.props.blockWidth;	//储存一个小方块的宽度
		delayChangeDir = 0;		//用以储存上一个touchmove被触发时的move方向，除了最开始触摸时为0，其他情况设置成不存在此变量为0的时刻。

		//当触摸时延迟进行水平运动，以预留进行其他操作的时间，当触摸按住满规定时间后，禁止进行其他操作，只可进行水平运动
		_this.timerDelayVertical = setTimeout(function() {
			canMoveVertical = true;
			canDoOthers = false;
			console.log('moving')
		},200)

		//处理触摸滑动的时间
		$(document.body).unbind('touchmove').on('touchmove',function(ev) {
			var oDisXNow = ev.targetTouches[0].pageX;
			if (!canMoveVertical) {		//如果没有满规定时间，无法移动
				return false;
			}
			if ((oDisXNow-oDisX)>0) {	//手指向右滑动
				oDir += oDisXNow-oDisX;		//累加手指滑动的距离
				if (delayChangeDir < 0) {	//上一次滑动方向相反，先重置方向判断计数器，重新开始计数
					delayChangeDir = 0;
					delayChangeDir ++;
				}else if (delayChangeDir > 0){	//与上一次滑动方向相同，累加计数器
					delayChangeDir ++;
					if (delayChangeDir > 5) {	//当计数器满足规定数字后，开始进行移动相关准备工作
						if (!moving && oDir > oW) {		//如果没有在水平移动中 并且 滑动的距离超过了一个小方块的宽度，直接开始移动

							//判断成立，进行移动
							oDir = 0;
							moving = true;
							setTimeout(function() {
								console.log('right');
								var targetArr = _this.updatePosition();
								var canMove = _this.props.checkCanAction(targetArr,1);
								if (canMove) {
									_this.setState({
										wrapLeft: (_this.state.wrapLeft) + _this.props.blockWidth
									});
								}
								moving = false;
							},0)
						}
					}

				//处理开始移动的第一格，当可以开始移动后直接进行移动，使操作手感更平滑。
				}else {
					var targetArr = _this.updatePosition();
					var canMove = _this.props.checkCanAction(targetArr,1);
					if (canMove) {
						_this.setState({
							wrapLeft: (_this.state.wrapLeft) + _this.props.blockWidth
						});
					}
					delayChangeDir++;
				}

			//滑动方向为右的情况，判断方式与向左相同。
			}else if ((oDisXNow-oDisX)<0){
				oDir += Math.abs(oDisXNow-oDisX);

				if (delayChangeDir >0) {
					delayChangeDir = 0;
					delayChangeDir --;
				}else if (delayChangeDir <0) {
					delayChangeDir --;
					if (delayChangeDir < -5) {
						if (!moving && oDir > oW) {
							oDir = 0;
							moving = true;
							setTimeout(function() {
								console.log('left');
								var targetArr = _this.updatePosition();
								var canMove = _this.props.checkCanAction(targetArr,-1);
								if (canMove) {
									_this.setState({
										wrapLeft: (_this.state.wrapLeft) - _this.props.blockWidth
									});
								}
								moving = false;
							},0)
						}
					}
				}else{
					var targetArr = _this.updatePosition();
					var canMove = _this.props.checkCanAction(targetArr,-1);
					if (canMove) {
						_this.setState({
							wrapLeft: (_this.state.wrapLeft) - _this.props.blockWidth
						});
					}
					delayChangeDir--;
				}
			}
			oDisX = oDisXNow;
		});

		//处理触摸结束的情况
		$(document.body).unbind('touchend').on('touchend',function(evt) {

			//储存手指离开屏幕时垂直方向滑动的距离
			var oDisYNow = evt.changedTouches[0].pageY;
			console.log(oDisYNow - oDisY);

			//如果超过了规定时间已经开始进行左右滑动了，则无法再进行相关操作
			if (!canDoOthers){
				canMoveVertical = false;
				return false;
			}else{

				//如果垂直滑动的距离超过了相关数值，则进行快速放置操作，否则进行变形操作
				if ((oDisYNow - oDisY)>50) {
					console.log('moving down')
					this.setState({
						holded:false
					})
					_this.resetPartShape(true);
				}else{
					console.log('changing');
					var oW = _this.props.blockWidth;
					var shapeType = _this.props.shapeTypes;
					var targetShape = _this.state.shape;
					var	oTop = shapeType[_this.state.type][targetShape].top;
					var oLeft = shapeType[_this.state.type][targetShape].left;
					var posMarks = [];
					oTop.map(function(x,i) {
						posMarks.push((x+_this.state.wrapTop/oW)*10+(oLeft[i]+_this.state.wrapLeft/oW));
					});
					var targetArr = _this.updatePosition(1);
					if (posMarks.some(function(x){return (x>0 && x%10 < 2)})) {
						var	canChange = _this.props.checkCanChange(targetArr,0,0,false,'left');
					}else if (posMarks.some(function(x){return (x>0 && x%10 > 7)})) {
						var	canChange = _this.props.checkCanChange(targetArr,0,0,false,'right');
					}else{
						var	canChange = _this.props.checkCanChange(targetArr,0,0,false);
					}
					if (canChange) {
						_this.setState({
							shape:(_this.state.shape + 1)%4
						})
					}
				}
				clearTimeout(_this.timerDelayVertical);
				console.log('do others')
			}
		})
	}

	componentDidMount(){
		this.initShadowPart();
		this.setMovingTimer();
		//绑定键盘事件
		$(document.body).bind('keydown', this.handleKeyDown);
		$(document.body).bind('keyup', this.handleKeyUp);
		$(document.body).bind('touchstart',this.handleTouchStart);
	}

	componentWillUpdate() {
	}

	componentDidUpdate(){
		//$(document.body).unbind('keydown').bind('keydown', this.handleKeyDown);
		//$(document.body).unbind('keyup').bind('keyup', this.handleKeyDown);
		this.initShadowPart();
		//绑定键盘事件
		//$(document.body).on('keydown', this.handleKeyDown);
	}

	render(){
		var oW,oStyle,shapeType;

		oStyle = {
			left:this.state.wrapLeft + 'px',
			top:this.state.wrapTop + 'px',
			opacity:this.state.opacity
		}

		oW = this.props.blockWidth;
		shapeType = this.props.shapeTypes;

		var	oTop = shapeType[this.state.type][this.state.shape].top;
		var oLeft = shapeType[this.state.type][this.state.shape].left;

		var _this = this;
		return (
			<div className="littlePart-wrap" style={oStyle} data-shape={this.state.shape} >
				{
					oTop.map(function(x,i){
						return (
							<div ref='littleParts' key={x*10+oLeft[i]} className="littlePart" style={{
								width:oW+'px',
								height:oW + 'px',
								top:x*oW+_this.state.childrenTop + 'px',
								left:oLeft[i]*oW + 'px',
								opacity:_this.state.childrenOpacity
							}}>
								<div style={{background:_this.state.color}} className="inner-littlePart"></div>
							</div>
						)
					})
				}
			</div>
		)
	}
}