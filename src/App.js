import React, { Component } from 'react';
import './stylesheets/App.css';

import Talkative from "./Talkative";
import NetworkPage from "./NetworkPage";
import Personalities from "./Personalities";
import CommonWords from "./CommonWords";
import CommonPhrases from "./CommonPhrases";

class App extends Component {
    render() {
        return (
            <div>
                <div className="bg-container"/>
                <div className="caption-container text-block">
                    <div className="caption">
                        <p>
                            One of the most famous shows in television history, Friends was a sitcom about six friends who weren't anything remarkable. They were just normal... well... friends in their 20s trying to figure their lives out one mishap/work day/bad date at a time. And many believe that this was the show's charm. Running it's course from 1994 to 2004, the show won both awards and hearts alike with its realistic characters and witty dialogue.</p>
                        <p>
                            This page is a collection of data visualizations on every line said by each of the six main characters of Friends. In order to get the data for this, I wrote a web scraper to grab all 200+ transcripts from the internet, Python to parse the data and them in a structured format. Afterwards I made a <a href="https://github.com/tacastillo/friends/blob/master/analytics/Friends%20Foolery.ipynb" target="_blank">Jupyter notebook</a> to run exploratory text analysis on this data. Once I had built some interesting findings, I exported the resulting data as JSON files for visualization. I used <a href="https://d3js.org" target="_blank">D3.js</a> and <a href="https://facebook.github.io/react/" target="_blank">React</a> to construct the data visualizations you're about to see.
                        </p>
                    </div>
                </div>
                <Talkative/>
                <NetworkPage/>
                <Personalities/>
                <CommonWords/>
                <CommonPhrases/>
                <div className="caption-container text-block">
                    <div className="caption">
                        <h4>The Last One</h4>
                        <p>
                            So here we are at the end of our little journey through the lives of Rachel, Ross, Monica, Chandler, Joey and Phoebe. 
                        </p>
                        <p>
                            Thank you for taking the time to look through these visualizations. If you would like to contact me, you tweet me <a href="https://twitter.com/timangcas" target="_blank">@timangcas</a>. To find any of my other work, you can check my <a href="https://tacastillo.github.io/" target="_blank">website</a>. All code from this site, including the web scraper and Jupyter notebook, can be found on its <a href="https://github.com/tacastillo/friends" target="_blank">github repo</a> for further analysis. If you're curious on how any of this code works, please free to hit me up and shoot me a question. Data visualization is all about sharing information, and I believe that it doesn't end when you're finished reading a graph.
                        </p>
                        <p>
                            This project is still a work in progress, so please provide any critique, insights, or advice as it would be much appreciated.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
