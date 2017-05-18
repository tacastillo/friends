import * as d3 from "d3";
import BaseChart from "./BaseChart";
import { color } from "../constants.js";

export default class ForceGraph extends BaseChart {

    buildImages(nodes) {
        let defs = this.svg.append('defs')
        nodes.forEach((data) => {
            let diameter = this.radius * 2 + 20;
            let imageUrl = require(`../assets/bubble-${data.name.toLowerCase()}.jpg`);
            defs.append('pattern')
                .attr('id', `network-image-${data.name}`)
                .attr('x', this.radius+10)
                .attr('y', this.radius+20)
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

        this.radius = 55;
        this.border = 4;
        this.borderHighlight = 8;

        this.svg = d3.select(this.el).append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height)
            .attr("class", "force");

        let svg = this.svg,
            width = +svg.attr("width"),
            height = +svg.attr("height");

        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink().distance(500).strength(0.4))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        let nodes = data[0],
            nodeById = d3.map(nodes, function(d) {
                return d.name;
            }),
            links = data[1],
            bilinks = [];

        this.buildImages(nodes);

        links.forEach(function(link) {
            let source = link.source = nodeById.get(link.source),
                target = link.target = nodeById.get(link.target),
                intermediate = {}, // intermediate node
                value = link.value
            nodes.push(intermediate);
            links.push({ source: source, target: intermediate }, { source: intermediate, target: target });
            bilinks.push([source, intermediate, target, value]);
        });


        let link = svg.selectAll(".link")
            .data(bilinks)
            .enter().append("path")
            .attr("stroke-width", data => `${data[3]/50}px`)
            .attr("class", "link")
            .attr("stroke", data => color(data[0].name))
            // .attr("transform", "scale(0)")
            .on("mouseover", linkMouseOver)
            .on("mouseout", linkMouseOut);

        let node = svg.selectAll(".node")
            .data(nodes.filter(d => d.name))
            .enter().append("circle")
            .attr("class", "node")
            .attr("id", data => `network-${data.name}`)
            .attr("r", this.radius)
            .attr("stroke", node => color(node.name))
            .attr("stroke-width", this.border)
            // .attr("transform", "scale(0)")
            .attr("fill", node => `url(#network-image-${node.name}`)
            .on("mouseover", function(node) {
                that.props.setFocus(node.name);
            })
            .on("mouseout", function(node) {
                that.props.setFocus("");
            })

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

        function ticked() {
            link.attr("d", positionLink);
            node.attr("transform", positionNode);
        }

        function positionLink(d) {
            return "M" + d[0].x + "," + d[0].y + "S" + d[1].x + "," + d[1].y + " " + d[2].x + "," + d[2].y;
        }

        function positionNode(d) {
            return "translate(" + d.x + "," + d.y + ")";
        }

        function linkMouseOver(data) {
            // this.parentNode.appendChild(this);
            let source = d3.select(`#network-${data[0].name}`),
                target = d3.select(`#network-${data[2].name}`);
            let path = d3.select(this);
            let currentWidth = +path.attr("stroke-width").slice(0, -2);
            path.attr("stroke-width", `${ currentWidth + 4 }px`);
            source.transition()
                .attr("r", that.radius+10)
                .attr("stroke-width", that.borderHighlight);
            target.transition()
                .attr("r", that.radius+10)
                .attr("stroke-width", that.borderHighlight);
        }

        function linkMouseOut(data) {
            let source = d3.select(`#network-${data[0].name}`),
                target = d3.select(`#network-${data[2].name}`);
            let path = d3.select(this);
            let currentWidth = +path.attr("stroke-width").slice(0, -2);
            path.attr("stroke-width", `${ currentWidth - 4 }px`);
            source.transition()
                .attr("r", that.radius)
                .attr("stroke-width", that.border);
            target.transition()
                .attr("r", that.radius)
                .attr("stroke-width", that.border);
        }
    }

    update(props) {

        this.focus = props.focus;
        if (this.focus !== "") {
            let selection = this.svg.select(`#network-${this.focus}`);
            selection.transition()
                .attr("r", this.radius+10)
                .attr("stroke-width", this.borderHighlight);
            this.svg.selectAll(".link").transition()
                .style("opacity", data => data[0].name === this.focus ? 1 : 0.15);
        } else {
            this.svg.selectAll("circle").transition()
                .attr("r", this.radius)
                .attr("stroke-width", this.border);
            this.svg.selectAll(".link").transition()
                .style("opacity", 1);
        }
    }
}
