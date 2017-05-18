import React, { Component } from 'react';
import Chart from "./Chart";
import { toTitleCase, color } from "./constants.js"

import './stylesheets/NetworkPage.css';

let data = require('../analytics/data/network.json');

class NetworkPage extends Component {

    constructor(props) {
        super(props);
        this.names = data[0].map(node => node.name);
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
    			color: color(name),
    			countMap: links
    		}
    	});
    }

    render() {
    	let charList = data[0]
	    	.filter(node => node.name)
	    	.map(node => {
	    		let highlight = (this.state.focus === node.name) ? { color: color(node.name) } : {};
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
	        	<h4>Hover over each friend's bubble or name to see highlight their connections with others</h4>
	        	<div className="chart-container">
		            <Chart
		            	className="network-chart"
		                type={"force"}
		                height={825}
		                width={775}
		                setFocus={this._focus}
		                focus={this.state.focus}
		                data={this.state.data}
		            />
		            <div className="network-info">
		            	{charList}
		            </div>
	            </div>
	            <div className="caption-container">
                    <p className="caption">
                        Ramping it up a bit, we are now going to look at a question less about what about they say, and focus more on "who" they say. Loosely inspired by the famous <a href="https://bost.ocks.org/mike/miserables/" target="_blank">Les Miserables Character Co-Occurences</a> data set, a network was constructed to visualize how many times a friend refers to any other given friend. The thickness of the link is associated with how many times the character of that matching color says the other person's name. <br/> Some of these connections are very obvious, such as Ross to Rachel and Chandler to Monica, and vice versa. What this does point out though is how weak some connections are, ie. Joey and Phoebe or Rachel and Chandler.
                    </p>
                </div>
            </div>
        );
    }
}

export default NetworkPage;