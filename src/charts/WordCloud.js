import * as d3 from "d3";
import BaseChart from "./BaseChart";

const cloud = require("d3-cloud");

export default class WordCloud extends BaseChart {

    create(data) {
        let that = this;
        this.focus = this.props.focus;

        let layout = cloud()
            .size([this.props.width, this.props.height])
            .words(this.props.data)
            .padding(0)
            .rotate(0)
            .font("Impact")
            .fontSize(d => Math.sqrt(d.size)*2)
            .on("end", draw);

        layout.start();

        function draw(words) {

            that.svg = d3.select(that.el).append("svg")
                .attr("width", that.props.width)
                .attr("height", that.props.height)
                .attr("class", "cloud");

            that.svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                    .enter().append("text")
                    .attr("class", "cloud-text")
                    .attr("id", d => `word-${d.text}`)
                    .style("font-size", function(d) {
                        return d.size + "px";
                    })
                    .style("font-family", "Impact")
                    .style("fill", that.props.color)
                    .style("opacity", 0)
                    .attr("text-anchor", "middle")
                    .text(d => d.text)
                    .on("mouseover", function(d) {
                        if (that.focus === "") {
                            d3.selectAll(`#word-${d.text}`).style("opacity", 1);
                        }
                    })
                    .on("mouseout", function(d) {
                        if (that.focus === "") {
                            d3.selectAll(`#word-${d.text}`).style("opacity", that.props.opacity);
                        }
                    })
                    .on("click", function(d) {
                        if (that.props.name !== that.focus) {
                            that.props.updateFocus(that.props.name);
                            d3.selectAll(`.cloud-text`).style("opacity", that.props.opacity);
                            layout.words().forEach(word => {
                                d3.selectAll(`#word-${word.text}`).style("opacity", 0.1);      
                            });
                        } else {
                            that.props.updateFocus("");
                            layout.words().forEach(word => {
                                d3.selectAll(`#word-${word.text}`).style("opacity", that.props.opacity);      
                            });
                        }
                    });
        }
    }

    update(props) {
        this.focus = props.focus;

        if (props.inView && this.focus === "") {
            this.svg.selectAll("text").transition().duration(1500)
                .style("opacity", this.props.opacity)
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                });
        }
    }
}