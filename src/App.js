import React, { Component } from 'react';
import './stylesheets/App.css';

import Talkative from "./Talkative";
import NetworkPage from "./NetworkPage";
import Personalities from "./Personalities"

class App extends Component {
    render() {
        return (
            <div>
                <div className="bg-container"/>
                <Talkative/>
                <NetworkPage/>
                <Personalities/>
            </div>
        );
    }
}

export default App;
