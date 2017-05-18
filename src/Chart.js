import React from "react";

import BubbleChart from "./charts/BubbleChart";
import ForceGraph from "./charts/ForceGraph";
import RadarChart from "./charts/RadarChart";
import WordCloud from "./charts/WordCloud";
import SmallBubbles from "./charts/SmallBubbles";

const classnames = require('classnames');

const CHART_MAPPINGS = {
    bubble: BubbleChart,
    force: ForceGraph,
    radar: RadarChart,
    cloud: WordCloud,
    smallBubbles: SmallBubbles
};

export default class Chart extends React.Component {

    componentDidMount() {
        const el = this.refs.chart;

        if (this.props.type === "custom") {
            this.chart = new this.props.customChart(el, this.props);
        } else {
            this.chart = new CHART_MAPPINGS[this.props.type](el, this.props);
        }

        this.chart.create(this.props.data);
    }

    componentDidUpdate() {
        this.chart.update(this.props);
    }

    componentWillUnmount() {
        this.chart.unmount();
    }

    render() {
        let chartClass = classnames("chart", this.props.className);
        return (<div className={chartClass} ref="chart"></div>);
    }
}