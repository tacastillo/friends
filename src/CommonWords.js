import React, { Component } from 'react';
import Chart from "./Chart";
import { NAMES, stopwords, color } from "./constants";

import './stylesheets/CommonWord.css';

let Waypoint = require('react-waypoint');

class CommonWords extends Component {

    constructor(props) {
        super(props);

        this.cloudData = require(`../analytics/data/word-count.json`);
        this.bubbleData = require('../analytics/data/phrase-count.json');
        this.state = {
        	focus: "",
        	opacities: NAMES.reduce((acc, name) => {
        		acc[name] = 0.65;
        		return acc;
        	}, {}),
            inView: false
        }
    }

    _updateFocus = (name) => {
    	this.setState(() => {
    		return {
    			focus: name
    		}
    	});
    }

    _scroll = () => {
        this.setState(() => {
            return {inView: !this.state.inView};
        });
    }

    render() {
    	let clouds = this.cloudData.slice(0,6).map((person) => {

		    let mappedWords = Object.keys(person["words"])
	    		.filter(d => stopwords.indexOf(d) < 0)
	    		.map(d => {
		            return {
		                text: d,
		                size: person["words"][d]
		            };	
	        	});

    		return (
    			<div key={person.name} className="flex-chart">
    				<h2 className="cloud-label">{person.name}</h2>
	    			<Chart
		                type={"cloud"}
		                width={325}
		                height={325}
		                color={color(person.name)}
		                name={person.name}
		                focus={this.state.focus}
                        inView={this.state.inView}
		                updateFocus={this._updateFocus}
		                opacity={this.state.opacities[person.name]}
		                data={mappedWords}
		            />
	            </div>)
    	});
        return (
            <div className="page">
            	<h1>The One With the Vocabulary</h1>
                <h4>Hover over a word to see how it compares among other characters</h4>
                <h4>Click on a cloud to filter out those words from everyone else&#39;s cloud</h4>
                 <Waypoint
                    onEnter={this._scroll}
                    onLeave={this._scroll}
                    topOffset={"70%"}
                    bottomOffset={"40%"}>
                	<div className="flex-container">
                		<div className="flex-inner-container">
    		            	<div className="inline-container">
    			            	{clouds.slice(0,3)}
    		            	</div>
    		            	<div className="inline-container">
    			            	{clouds.slice(3,6)}
    		            	</div>
    	            	</div>
                	</div>
                </Waypoint>
                <div className="caption-container">
                    <p className="caption">
                        Please. Use the above charts as an example as to why people should not use word clouds to deduce and analyze statistical data. I only made word clouds to convey this lesson, but I also wanted to show that <b>SOME</b> value can be made. After filtering out any single character's most common words, you can see how the friends share 95% of most frequently said words. However, some interesting words can be found, ie. Ross&apos;s problem with saying &quot;Uh&quot; or when Monica had a little too much fun saying &quot;7&quot;.
                    </p>
                </div>
            </div>
        );
    }
}

export default CommonWords;
