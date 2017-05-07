import React, { Component } from 'react';
import Chart from "./Chart";
import { NAMES, toTitleCase, color } from "./constants";

import './stylesheets/Personalities.css';

let summaryData = [
	{xValue: "Front End", yValue: 0.75},
	{xValue: "Back End", yValue: 0.6},
	{xValue: "Theory", yValue: 0.4},
	{xValue: "Analytics", yValue: 0.5},
	{xValue: "Misc", yValue: 0.6},
]

class Personalities extends Component {
    constructor(props) {
        super(props);
        this.diameter = 225;
        this.margin = 50;
        this.labelDistance = 1.2;
        let personalities = NAMES.map((name) => {
        	let data = require(`../analytics/data/personality-${name}.json`)["personality"];
        	let filteredTraits = [
        		data[0]["children"][4], //intellect
        		data[2]["children"][2], //cheerfulness
        		data[1]["children"][2], //dutifulness
        		data[0]["children"][1], //artistic
        		data[4]["children"][5]  //stress
        	]
        	filteredTraits[1]["name"] = "Cheer";
        	filteredTraits[2]["name"] = "Duty";
        	filteredTraits[3]["name"] = "Artistry";
        	filteredTraits[4]["name"] = "Stress";
        	return {
        		name: name,
        		traits: filteredTraits
        	};
        });
        this.state = {
        	personalities: personalities,
        }
    }

    render() {
    	let radarCharts = this.state.personalities.map(personality => {
            return (
	        	<div key={personality.name} className="personalityRadar">
	        		<h2>{toTitleCase(personality.name)}</h2>
		            <Chart
		                type={"radar"}
		                height={this.diameter}
		                width={this.diameter}
		                margin={this.margin}
		                labelDistance={this.labelDistance}
		                color={color(personality.name)}
		                data={[personality.traits]}
		            />
	            </div>)
    	});
        return (
            <div className="page">
	            <h1>The One Where They Feel The Same Way</h1>
	            <div className="personality-container">
		            <div className="radar-container">
		            	<div className="inline-container">
			            	{radarCharts.slice(0,3)}
		            	</div>
		            	<div className="inline-container">
			            	{radarCharts.slice(3,6)}
		            	</div>
	            	</div>
            	</div>
            </div>
        );
    }
}

export default Personalities;
