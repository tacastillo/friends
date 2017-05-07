import * as d3 from "d3";
import BaseChart from "./BaseChart";

export default class BubbleChart extends BaseChart {

    buildImages(nodes) {
        let defs = this.svg.append('defs')
        nodes.forEach((data) => {
            let diameter = data.r*2;
            let imageUrl = require(data.data.image);
            defs.append('pattern')
                .attr('id', `bubble-image-${data.data.name}`)
                .attr('x', data.r)
                .attr('y', data.r)
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('height', diameter)
                .attr('width', diameter)
                .append('image')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('height', diameter)
                    .attr('width', diameter)
                    .attr('xlink:href', imageUrl)
                    .attr('preserveAspectRatio', 'xMinYMin slice')
        });
    }

    create(data) {
        let that = this;

        this.bubble = d3.pack()
            .size([this.props.width, this.props.height])
            .padding(5);

        this.root = d3.hierarchy(data).sum(nodeData => nodeData.scaledWords);

        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr("class", "bubble");

        let children = this.bubble(this.root).children;

        this.buildImages(children);

        this.node = this.svg.selectAll(".node")
            .data(children)
            .enter().append("g")
                .attr("class", "node")
                .attr("transform", d => { return `translate(${d.x}, ${d.y})`; });

        this.node.append("svg:circle")
            .attr("r", node => { return node.r; })
            .attr("stroke", node => { return this.props.color(node.data.name)})
            .style("fill", node => { return `url(#bubble-image-${node.data.name}` })
            .on("mouseover", function(node) {
                d3.select(this).transition().duration(200)
                    .attr("stroke-width", 8)
                that.props.updateDetail(node.data);
            })
            .on("mouseout", function(node) {
                d3.select(this).transition().duration(200)
                    .attr("stroke-width", 0)  
                that.props.updateDetail({});
            });

        d3.select(document.frameElement).style("height", `${this.props.height} px`);
    }
}