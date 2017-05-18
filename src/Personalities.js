import React, { Component } from 'react';
import Chart from "./Chart";
import { NAMES, color } from "./constants";

import './stylesheets/Personalities.css';

let Waypoint = require('react-waypoint');

class Personalities extends Component {
    constructor(props) {
        super(props);
        this.diameter = 225;
        this.margin = 50;
        this.labelDistance = 1.23;
        let personalities = NAMES.map((name) => {
        	let data = require(`../analytics/data/personality-${name}.json`)["personality"];
        	let filteredTraits = [
        		data[0]["children"][4], //intellect
        		data[2]["children"][2], //cheerfulness
        		data[1]["children"][2], //dutifulness
        		data[0]["children"][1], //artistic
        		data[4]["children"][5]  //stress
        	]
            filteredTraits[0]["name"] = filteredTraits[0]["name"]; //placeholder
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
            inView: false
        }
    }

    _scroll = () => {
        this.setState(() => {
            return {inView: !this.state.inView};
        });
    }

    render() {
    	let radarCharts = this.state.personalities.map(personality => {
            return (
	        	<div key={personality.name} className="flex-chart">
	        		<h2>{personality.name}</h2>
		            <Chart
		                type={"radar"}
		                height={this.diameter}
		                width={this.diameter}
		                margin={this.margin}
                        inView={this.state.inView}
		                labelDistance={this.labelDistance}
		                color={color(personality.name)}
		                data={[personality.traits]}
		            />
	            </div>)
    	});
        return (
            <div className="page">
	            <h1>The One Where Their Personalities Match</h1>
                <h4>Hover over a dot to show the percentage</h4>
                <Waypoint
                    onEnter={this._scroll}
                    onLeave={this._scroll}
                    topOffset={"70%"}
                    bottomOffset={"40%"}>
    	            <div className="flex-container">
    		            <div className="flex-inner-container">
    		            	<div className="inline-container radar-container">
    			            	{radarCharts.slice(0,3)}
    		            	</div>
    		            	<div className="inline-container radar-container">
    			            	{radarCharts.slice(3,6)}
    		            	</div>
    	            	</div>
                	</div>
                </Waypoint>
                <div className="caption-container">
                    <p className="caption">
                        This visualization was more or less for fun than actual statistical value or analysis, but what I discovered from the results was actually fascinating. Running through a shuffled corpus of every line said by a character through IBM Watson&#39;s Personality Insights API, I was given back three dozen personality traits deduced from the text. The most interesting analysis out of all of this was that, based on what they say, all of the friends have very similar similarities, with almost always a tight standard deviation. This could have a variety of meanings that can be observed later one.
                    </p>
                </div>
            </div>
        );
    }
}

export default Personalities;
