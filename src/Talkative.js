import React, { Component } from 'react';
import Chart from "./Chart";
import { toTitleCase, round, toComma, color } from "./constants.js";

import './stylesheets/Talkative.css';

let Waypoint = require('react-waypoint');

let data = require('../analytics/data/most-talkative.json')

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
	        total: sum,
            inView: false
        }
    }

    _adjustScale(data) {
    	let sum = 0;
    	let adjusted = data.map((value) => {
    		sum += value.words;
    		return {
    			name: value.name,
    			scaledWords: (1 + (value.frequency * 3)) * value.words,
    			words: value.words
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

    _scroll = () => {
        this.setState(() => {
            return {inView: !this.state.inView};
        });
    }

    render() {
    	let currentName = this.state.currentName ? `${toComma(this.state.currentName)} said` : '';
    	let currentWords = this.state.currentWords ? `${toComma(this.state.currentWords)} words` : '';
    	let currentPercent = !isNaN(this.state.currentPercent) ? `(${this.state.currentPercent}%)` : ''
        return (
        	<div className="talkative page">
	        	<h1>The One Who Talks Too Much</h1>
                <h4>Hover over each friend to see how much each character talks</h4>
                <Waypoint
                    onEnter={this._scroll}
                    onLeave={this._scroll}
                    topOffset={"70%"}
                    bottomOffset={"70%"}>
    	        	<div className="chart-container">
    	        		<div className="bubble-stats">
    	        			<h3 className="bubble-stat">{currentName}</h3>
    	        			<h3 className="bubble-stat">{currentWords}</h3>
    	        			<h3 className="bubble-stat">{currentPercent}</h3>
    	        		</div>
    		            <Chart
    		                type={"bubble"}
    		                height={750}
    		                width={750}
                            inView={this.state.inView}
    		                updateDetail={this._updateDetail}
                            color={color}
    		                data={this.state.data}
    		            />
    	            </div>
                </Waypoint>
                <div className="caption-container">
                    <p className="caption">
                        Now, first things first: who talks the most, and thus, who is Friends <b>REALLY</b> about? You can more or less figure out which friend gets the spotlight the most based on how often and how much they talk. Above is a bubble chart representing how many total words each friend had said over the course of the series. <br/> Surprisingly, each friend <i>almost</i> had an equal amount of speaking parts. However, of course Ross and Rachel say just slightly more than everyone else, 18.18% and 17.92% of all conversations by the friends, respectively.
                    </p>
                </div>
            </div>
        );
    }
}

export default Talkative;
