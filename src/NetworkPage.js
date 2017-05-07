import React, { Component } from 'react';
import Chart from "./Chart";
import { toTitleCase, color} from "./constants.js"

import './stylesheets/NetworkPage.css';

let data = require('../analytics/data/network.json');

class NetworkPage extends Component {

    constructor(props) {
        super(props);
        this.names = data[0].map(node => node.name);
        this.color = color;
        this.state = {
        	data: data,
        	focus: "",
        	countMap: {},
        	color: "#000000"
        };
    }

    _focus = (name) => {
     	this.setState((previous, current) => {
	    	let links = data[1]
				.filter(node => (node.source.name === name))
				.reduce((map, node) => {
					if (node.target.name) {
						map[node.target.name] = {value: node.value, percent: node.percent}
					}
					return map;
				}, {});
    		return {
    			focus: name,
    			color: this.color(name),
    			countMap: links
    		}
    	});
    }

    render() {
    	let charList = data[0]
	    	.filter(node => node.name)
	    	.map(node => {
	    		let highlight = (this.state.focus === node.name) ? { color: this.color(node.name) } : {};
	    		let count = this.state.countMap[node.name];
	    		return (
	    				<div key={node.name}>
		    				<h2
		    				style={highlight}
		    				onMouseOver={this._focus.bind(this, node.name)}
		    				onMouseOut={this._focus.bind(this, "")}>
		    					{toTitleCase(node.name)}{count ? ` - ${count.value} times - ${count.percent}%` : ""}
		    				</h2>
	    				</div>
	    			);
	    	});
        return (
            <div className="network page">
	        	<h1>The One Where They Talk To Each Other</h1>
	        	<div className="chart-container">
		            <Chart
		            	className="network-chart"
		                type={"force"}
		                height={825}
		                width={775}
		                color={this.color}
		                setFocus={this._focus}
		                focus={this.state.focus}
		                data={this.state.data}
		            />
		            <div className="network-info">
		            	{charList}
		            </div>
	            </div>
            </div>
        );
    }
}

export default NetworkPage;