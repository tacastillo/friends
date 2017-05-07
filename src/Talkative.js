import React, { Component } from 'react';
import Chart from "./Chart";

import { toTitleCase, round, toComma, color } from "./constants.js";

import './stylesheets/Talkative.css';

let data = require('../analytics/data/most-talkative.json')
// let radarData = require('../analytics/data/personality-ROSS.json')
class Talkative extends Component {

    constructor(props) {
        super(props);
        let median = data.shift().words;
        let {newData, sum}  = this._adjustScale(data);
        this.state = {
            data: {
                children: newData,
	        },
	        median: median,
	        total: sum
        }
    }

    _adjustScale(data) {
    	let sum = 0;
    	let adjusted = data.map((value) => {
    		sum += value.words;
    		return {
    			name: value.name,
    			scaledWords: (1 + (value.frequency * 5)) * value.words,
    			words: value.words,
    			image: `./assets/bubble-${value.name.toLowerCase()}.jpg`
    		}
    	});
    	return {
    		newData: adjusted,
    		sum: sum
    	}
    }

    _updateDetail = (data) => {
    	data.name = data.name || "";
    	this.setState(() => {
    		return {
    			currentName: toTitleCase(data.name) || "",
    			currentWords: data.words,
    			currentPercent: round(data.words/this.state.total*100, 2)
    		}
    	});
    }

    render() {
    	let currentName = this.state.currentName ? `${toComma(this.state.currentName)} said` : '';
    	let currentWords = this.state.currentWords ? `${toComma(this.state.currentWords)} words` : '';
    	let currentPercent = !isNaN(this.state.currentPercent) ? `(${this.state.currentPercent}%)` : ''
        return (
        	<div className="page">
	        	<h1>The One Who Talks Too Much</h1>
	        	<div className="chart-container">
	        		<div className="bubble-stats">
	        			<h3 className="bubble-stat">{currentName}</h3>
	        			<h3 className="bubble-stat">{currentWords}</h3>
	        			<h3 className="bubble-stat">{currentPercent}</h3>
	        		</div>
		            <Chart
		                type={"bubble"}
		                height={600}
		                width={600}
		                updateDetail={this._updateDetail}
                        color={color}
		                data={this.state.data}
		            />
	            </div>
            </div>
        );
    }
}

export default Talkative;
