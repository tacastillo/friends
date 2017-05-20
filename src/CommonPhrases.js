import React, { Component } from 'react';
import Chart from "./Chart";

import './stylesheets/CommonWord.css';

let Waypoint = require('react-waypoint');

class CommonPhrases extends Component {

    constructor(props) {
        super(props);

        this.bubbleData = require('../analytics/data/phrase-count.json');

        this.state = {
        	inView: false
        }
    }

    _scroll = () => {
        this.setState(() => {
            return {inView: !this.state.inView};
        });
    }

    render() {
        return (
            <div className="page">
	            <h1>The One Where They Do It Right</h1>
                <h4>Hover over each phrase to see its numerical representation</h4>
	             <Waypoint
                    onEnter={this._scroll}
                    onLeave={this._scroll}
                    topOffset={"70%"}
                    bottomOffset={"40%"}>
	                <div className="flex-container">
	                    <div className="flex-inner-container small-bubble-container">
	                            <Chart
	                                type={"smallBubbles"}
	                                width={600}
	                                height={750}
	                                inView={this.state.inView}
	                                data={this.bubbleData}
	                            />
	                    </div>
	                </div>
                </Waypoint>
                <div className="caption-container">
                    <p className="caption">
                        Now that we know to NOT use word clouds, we can move forward by looking for alternative ways to observe who says what and how often in comparison to other friends. Feature above is a bubble matrix showing popular phrases/clusters of words with an associated bubble. Some questions that I can derive from this are &quot;Who talks the most about themselves?&quot;, &quot;Who talks the most about sex?&quot;, and &quot;Who is the most caught up in their career?&quot;. Heavily adapted from <a href="http://www.neuralengr.com/asifr/journals/" target="_blank">this</a> visualization.
                    </p>
                </div>
            </div>
        );
    }
}

export default CommonPhrases;
