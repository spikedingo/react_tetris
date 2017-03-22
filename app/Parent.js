import React from 'react';
import Child from './Child.js';

export default class Parent extends React.Component {

	constructor(props){
		super(props);
		this.state = {color:""}
		this.changeColor = this.changeColor.bind(this);
		this.child1ChangeColor = this.child1ChangeColor.bind(this);
		this.child2ChangeColor = this.child2ChangeColor.bind(this);
	}

	changeColor(e){
		this.setState({
			color: e.target.getAttribute('data-color')
		});
	}

	child1ChangeColor(e){
		this.refs['child1'].changeColor(e);
	}

	child2ChangeColor(e){
		this.refs['child2'].changeColor(e);
	}

	render() {
		return (
			<div style={{backgroundColor: this.state.color}} className="col-xs-10 col-xs-offset-1 parent">
				<ul className="list-inline">
				    <li>对应第一个child</li>
					<li>
						<a href="#" data-color="#286090" className="btn btn-primary" onClick={this.child1ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#31b0d5" className="btn btn-info" onClick={this.child1ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#c9302c" className="btn btn-danger" onClick={this.child1ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#ec971f" className="btn btn-warning" onClick={this.child1ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#e6e6e6" className="btn btn-default" onClick={this.child1ChangeColor}>&nbsp;</a>
					</li>
				</ul>
				<ul className="list-inline">
				    <li>对应第二个child</li>
					<li>
						<a href="#" data-color="#286090" className="btn btn-primary" onClick={this.child2ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#3160d5" className="btn btn-info" onClick={this.child2ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#c9302c" className="btn btn-danger" onClick={this.child2ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#ec971f" className="btn btn-warning" onClick={this.child2ChangeColor}>&nbsp;</a>
					</li>
					<li>
						<a href="#" data-color="#e6e6e6" className="btn btn-default" onClick={this.child2ChangeColor}>&nbsp;</a>
					</li>
				</ul>
				<hr/>

				<Child ref="child1" parentChangeColor={this.changeColor} />
				<Child ref="child2" parentChangeColor={this.changeColor} />
			</div>
		);
	}
}