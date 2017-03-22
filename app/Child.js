import React from 'react';

export default class Child extends React.Component{

	constructor(props){
		super(props);
		this.state = {color:""}
		this.changeColor = this.changeColor.bind(this);
	}

	changeColor(e) {
		this.setState({
			color: e.target.getAttribute("data-color")
		});
	}

	render() {
		return (
			<div style={{backgroundColor:this.state.color}} className="col-xs-5 col-xs-offset-1 child">
				<br/>
				<ul className="list-inline">
					<li>
						<a href="#" data-color="#286090" className="btn btn-primary" onClick={this.props.parentChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#31b0d5" className="btn btn-info" onClick={this.props.parentChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#c9302c" className="btn btn-danger" onClick={this.props.parentChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#ec971f" className="btn btn-warning" onClick={this.props.parentChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#e6e6e6" className="btn btn-default" onClick={this.props.parentChangeColor}>&nbsp;</a>
					</li>
				</ul>
			</div>
		);
	}
}