import React from 'react';
import $ from 'jquery';
import PlayPart from './PlayPart.js';
import BackgroundItem from './BackgroundItem.js';
import ShadowPart from './shadowPart.js';

export default class PlayBox extends React.Component{
	constructor(props){

		var wholeTypes = ['O','I','S','Z','L','J','T'];

		super(props);
		this.state = {
			ordering:0,
			arrForCheck:[],
			shapeTypes:this.props.shapeTypes,
			colorTypes:this.props.colorTypes,
			wholeTypes:wholeTypes,
			started: false
		}

		this.resetShadowPart = this.resetShadowPart.bind(this);
		this.checkCanAction = this.checkCanAction.bind(this);
		this.checkCanChange = this.checkCanChange.bind(this);
		this.partStoredAction = this.partStoredAction.bind(this);
		this.checkClear = this.checkClear.bind(this);
		this.getPlace = this.getPlace.bind(this);
		this.getNextPart = this.getNextPart.bind(this);
	}


	checkClear(fn){
		var arr1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
		var arr2 = [0,1,2,3,4,5,6,7,8,9];
		var arrComplete = [];
		var arrUnComplete = [];
		var _this = this;
		var lineMark = [], toMove = [];
		var nextDelay = false;

		//获取被消除行的数组 与 未消除行的数组
		arr1.forEach(function(x,i) {
			var j = x;
			if (arr2.some(function(x,i) {
				return _this.refs['bItem-' + (j*10+i)].state.stored === true
			})) {
				if (arr2.every(function(x,i) {
					return _this.refs['bItem-' + (j*10+i)].state.stored === true
				})){
					arrComplete.push(i*10); //被消除行
				}else{
					arrUnComplete.push(i*10); //未消除行
				}
			}
		})

		//设置被消除的行数标记，因为最多会产生两个空当，所以lineMark的长度最多为2；
		//遍历消除行数组，当有下一个元素比当前元素大超过10的情况时，存入当前索引值，此为第一节被消除区域的行数。
		//而当lineMark长度大于0时，表示被消除行已被截断，则存入消除行数组的长度减去lineMark第一个元素的数字，此为第二节被消除区域的行数。
		//当没有下一个元素比当前元素大超过10的情况时，直接存入消除行数组的长度。
		if (arrComplete.length > 0) {
			arrComplete.reduce(function(s,x,i) {
				if ((x-s)>10) {
					lineMark.push(i);
					return x;
				}else{
					return x;
				}
			});
			if (lineMark.length>0) {
				lineMark.push(arrComplete.length-lineMark[0]);
				lineMark[0] = lineMark[0] + lineMark[1];
			}else{
				lineMark.push(arrComplete.length);
			}
		}
		console.log(lineMark,'split count');

		//将未消除行根据中间的空隙分成N个数组，每个数组记录每一大块未消除行的行编号。比如消除了一行，未消除行就被分解成length为2的数组。
		var arrUnCompleteSplit = [[]];
		var flag = 0;
		if (arrUnComplete.length > 0) {
			arrUnComplete.forEach(function(x,i,arr) {
				if (arr[i+1]&&(arr[i+1]-x)>10) {
					arrUnCompleteSplit[flag].push(x);
					arrUnCompleteSplit.push([]);
					flag++;
				}else{
					arrUnCompleteSplit[flag].push(x);
				}
			})
		}

		if (arrComplete.length > 0) {
			nextDelay = true;
			arrComplete.forEach(function(x,i) {
				var j = x;
				arr2.forEach(function(x,i) {
					setTimeout(function() {
						_this.refs['bItem-' + (j+x)].setState({
							stored:false,
							color:_this.props.backColor,
							opacity:_this.props.backOpa
						})
					},i*50)
				})
			})

			return	setTimeout(function() {
				var oldMap = lineMark.map(function(x,i) {
					return _this.getPlace(arrUnCompleteSplit[i],lineMark[i]*10,true)
				}).reduce(function(s,x,i) {return s.concat(x)});
				var newMap = lineMark.map(function(x,i) {
					return _this.getPlace(arrUnCompleteSplit[i],lineMark[i]*10,false)
				}).reduce(function(s,x,i) {return s.concat(x)});
				var colorMap = lineMark.map(function(x,i) {
					return _this.getPlace(arrUnCompleteSplit[i],lineMark[i]*10,'color')
				}).reduce(function(s,x,i) {return s.concat(x)});
				
				oldMap.forEach(function(x,i) {
					_this.refs['bItem-' + x].setState({
						stored:false,
						color:_this.props.backColor,
						opacity:_this.props.backOpa
					});
				})

				setTimeout(function() {
					newMap.forEach(function(x,i) {
						_this.refs['bItem-' + x].setState({
							stored:true,
							color:colorMap[i],
							opacity:1
						})
					})
				},16.7)
			},501);
		}
		return nextDelay;
	}

	getPlace(arr,dis,ifOld){
		var oDis = dis ? dis : 0;
		var arr1 = [0,1,2,3,4,5,6,7,8,9];
		var _this = this;
		var newArr = arr.map(function(x,i) {
			var line = x,j = i;
			var arr2 = [];
			arr1.forEach(function(x,i) {
				var oldPos = _this.refs['bItem-'+(line+x)];
				var newPos = _this.refs['bItem-'+(line+x+dis)]
				if (oldPos.state.stored) {
					if (ifOld === 'color') {
						arr2.push(_this.refs['bItem-'+(line+x)].state.color);
					}else{
						ifOld ? arr2.push(line+x) : arr2.push(line+x+dis)
					}
				}
			})
			return arr2;
		})
		return (newArr.reduce(function(s,x,i) {return s.concat(x)}));
	}

	partStoredAction(isHolding,playingType){
		var _this = this;
		if (!isHolding) {
			var posArr = this.refs.shadowPart.updatePosition();
			posArr.map(function(x) {
				_this.refs['bItem-'+x].setState({
					stored:true,
					color:_this.refs.shadowPart.state.color,
					opacity:1
				})
			})
			var flag = this.checkClear(); 
			var delay = flag ? 600 : 200 ;
		}else{
			var delay = 0;
		}
		console.log(delay,'delay')
		setTimeout(
			function (){
				//var arr = ['O','I','S','Z','L','J','T'];
				//var arr = ['L'];
				if (isHolding) {
					var oType = _this.props.holdPartFunc(playingType);
				} else {
					var oType = _this.getNextPart();
				}
				var wholeTypes = _this.state.wholeTypes;
				var colorType = _this.state.colorTypes;
				var oColor = colorType[wholeTypes.indexOf(oType)];

				_this.refs.playPart.setState({
					type:oType,
					//type:['I'],
					shape:0,
					wrapLeft:_this.props.blockWidth*3,
					wrapTop:_this.props.blockWidth*-1,
					color:oColor,
					opacity:1
				})

			},delay
		)
	}

	getNextPart(){
		return this.props.getNextPart();
	}

	//当移动操作或变形后，重新渲染shadowPart
	resetShadowPart(type,shape,left,top,color,opacity){
		this.refs.shadowPart.setState({
			type:type,
			shape:shape,
			wrapLeft:left,
			wrapTop:top,
			color:color,
			opacity:opacity
		})
	}

	startPlay(){
		var oW = this.props.blockWidth;
		if (this.state.started) {
			return (
				<div>
					<ShadowPart ref='shadowPart' 
						shapeTypes={this.state.shapeTypes}
						wholeTypes={this.state.wholeTypes}
						colorTypes={this.state.colorTypes}
						blockWidth={oW} 
						checkCanAction={this.checkCanAction} 
					/>
					<PlayPart ref='playPart' 
						shapeTypes={this.state.shapeTypes}
						colorTypes={this.state.colorTypes}
						wholeTypes={this.state.wholeTypes}
						blockWidth={oW} 
						checkCanAction={this.checkCanAction} 
						checkCanChange={this.checkCanChange}
						resetShadowPart={this.resetShadowPart}
						partStoredAction={this.partStoredAction}
					/>
				</div>
			)
		}
	}

	//当PlayPart响应键盘事件时，调用此函数，检测是否可以进行相应动作
	//arr->PlayPart传入的方块编号，与BackgroundItem所拥有的编号对应
	//遍历arr，每个元素的动作都可执行后方可返回true
	//只处理运动，变形函数另设
	checkCanAction(arr,move){
		var touchEdge;
		var oMove = !isNaN(move) ? move : 0;
		var _this = this;

		// for test
		// for test

		var notBlocked = arr.every(function(x,i) {
				return (x+oMove)<0 || (_this.refs['bItem-'+(x+oMove)] && !_this.refs['bItem-'+(x+oMove)].state.stored);
			})
		if (move === -1) {
			return notBlocked && !arr.some(function(x,i){
				return ((x%10 + move) === -1) || ((x%10 + move) === 9);
			})
		}else if (move === 1){
			return notBlocked && arr.every(function(x,i){
				return !((x + move)%10 === 0);
			})
		}else{
			return notBlocked;
		}
	}

	//检测是否可以变形的方法
	//加入碰撞检测，当方块的预测数组内有编号与背景编号重复时进行
	//待加入向上修正的逻辑
	//args：预测数组（变形后方块的编号），
	//		修正数值（小方块宽度*fixing则为该修正的距离），
	//		计数器（防止死循环）
	//		是否在上方（如果是则直接向上移动）
	//		当接近边缘时传入的标识，如果有标识则进一步进行边缘判断
	checkCanChange(arr,fixing,count,isTop,edge){
		console.log(arr);
		count++;
		if (count > 2) {
			return false;
		} 
		var blocked; //是否与背景方块重叠 boolean

		//获取判断数组的取余版，方便对照计算
		var fixedArr = arr.map(function(x) {return x%10});
		var checkArr = [];
		//获取判断数组取余版的去重版
		fixedArr.map(function(x) {
			if (checkArr.indexOf(x) === -1) {
				checkArr.push(x);
			}
		});

		var _this = this;
		var blockedNum = 0;  //重叠了的背景方块编号

		//获取判断数组的平均值，与阻挡位置的余数做对比，以判断阻挡位置在左或在右
		var averageNum = fixedArr.reduce(function(s,x) {return s+x},0)/fixedArr.length;
		blocked = arr.some(function(x,i) {
				if (_this.refs['bItem-'+ x] && _this.refs['bItem-'+x].state.stored){
					console.log(x,'blockedNum')
					blockedNum = x;
				};
				return _this.refs['bItem-'+ x] && _this.refs['bItem-'+x].state.stored;
			})
		console.log(blocked,'blocked');
		//获得处于重叠背景方块上方的方块数量
		var overTop = arr.reduce(function(s,x) {return (Math.floor(x/10))*10 < (Math.floor(blockedNum/10))*10 ? s+1 : s},0);

		// var isOverTop;
		// if (overTop >2) {
		// 	isOverTop = true;
		// }

		//如果有重叠，则判断重叠位置在左或右，生成要修正的数值
		if (blocked) {
			var distance=0,markItem=0;
			if (averageNum > blockedNum%10) {
				distance = checkArr.reduce(function(s,x) {return x>blockedNum%10 ? s : s+1 },0);
				markItem = 1;
			}else if(averageNum < blockedNum%10){
				distance = checkArr.reduce(function(s,x) {return x<blockedNum%10 ? s : s+1 },0);
				markItem = -1;
			}else{
				isOverTop = true;
				console.log(isTop)
			}
			console.log(averageNum,'distance',blockedNum%10,'markItem')
		}

		//如果处于边缘或与背景重叠，则计算修正后的预测数组，进行递归
		if (edge === 'left' || edge === 'right' || blocked){
			console.log(isTop,'isTop');
			var dis = 0,mark=0; // dis：变形后超过边缘的距离，mark：因左右不同而正负不同
			if (edge) {
				dis = edge === 'left'
					? checkArr.reduce(function(s,x) { return x>5 ? s+1 : s },0)
					: checkArr.reduce(function(s,x) { return x<5 ? s+1 : s },0)
				mark = edge === 'left' ? 1 : -1 ;
			}
				console.log(dis,'distance',edge);

			//既超出边缘也与背景重复或二者取其一或二者都没问题（直接变形成功）
			if (dis > 0 && blocked) {
				return false;
			}else if(!blocked && dis > 0){
				return this.checkCanChange(arr.map(function(x) {return x+dis*mark}),dis*mark,count,true);
			}else if (blocked && !(dis > 0)){
				return this.checkCanChange(arr.map(function(x) {return x+distance*markItem}),distance *markItem,count,false)
			}else {
				console.log('can pass')
				return true;
			}
		}else{
			//twoSided 表示是否修正后超出边缘的标识，如果为true，终止变形
			var twoSided = checkArr.some(function(x) {return x<1}) && checkArr.some(function(x) {return x>8})
			if (twoSided) {
				console.log('twoSided');
				return false;
			//进行最终修正
			}else if(fixing !== 0) {
				console.log(fixing,'final fixing');
				this.refs.playPart.setState({
					wrapLeft: this.refs.playPart.state.wrapLeft + this.props.blockWidth * fixing
				});
				return true;
			}else{
				return true;
			}
		}
	}

	componentWillUpdate() {
		console.log(this.state.arrForCheck)
	}

	render(){
		var arr = [];
		for ( var i = 0; i < 200; i++){
			arr.push(i);
		}
		var oW = this.props.blockWidth;
		var outH = this.props.outHeight;
		var _this = this;
		return ( 
			<div style={{ width:oW*10 + 'px', height:oW*20 + 'px',left:'-' + oW*7 + 'px',marginLeft: '50%', top:'-' + oW*10 + 'px', marginTop: outH/2 + 'px' }} className="playBox" onClick={this.checkClear}>
				<div ref='backgroundItemWrap'>
					{ arr && arr.map(function(x,i){
						return (
							<BackgroundItem ref={'bItem-' + i} backOpa={_this.props.backOpa} backColor={_this.props.backColor} key={'part-'+i} itemKey={i} blockWidth={oW} />
						)
					})}
				</div>
				{this.startPlay()}
			</div>
		)
	}
}