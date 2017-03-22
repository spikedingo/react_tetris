import React from 'react';
import tetrisLogo from './tetris_logo.png'

export default class TitleBlock extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			display: 'block'
		}
		this.startFunc = this.startFunc.bind(this);
	}

	startFunc(){
		this.setState({
			display: 'none'
		})
		this.props.startGame();
	}

	render(){
		var oW = this.props.blockWidth;
		return (
			<div style={{
				display: this.state.display,
				position:'relative',
				zIndex:3,
				width:'100%', 
				height:this.props.outHeight + 'px',
				background: 'rgba(0,0,0,0.5)'
			}}>
				<div style={{ 
					position: 'absolute',
					zIndex: 3,
					width:oW*8 + 'px',
					marginLeft: '50%',
					left:'-'+ oW*8/2 +'px',
					marginTop: '50%',
					top: '-' + oW*10 + 'px'
				}}>
					<img src={tetrisLogo} style={{
						width:oW*8 + 'px'
					}} />
					<div className="startBtn" onClick={this.startFunc} style={{
						width:oW*4 + 'px',
						height: oW + 'px',
						lineHeight: oW + 'px',
						marginTop: oW*2 + 'px'
					}}>START</div>
				</div>
			</div>
		)
	}
}