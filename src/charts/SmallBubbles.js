import * as d3 from "d3";
import BaseChart from "./BaseChart";
import { NAMES } from "../constants";

export default class SmallBubbles extends BaseChart {

	create(data) {
		const that = this;

		this.rowHeight = 28;

		function truncate(str, maxLength, suffix) {
			if (str.length > maxLength) {
				str = str.substring(0, maxLength + 1);
				str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
				str = str + suffix;
			}
			return str;
		}

		const margin = {
				top: 20,
				right: 0,
				bottom: 0,
				left: 300
			},
			width = this.props.width,
			height = this.props.height;

		const c = d3.scaleOrdinal(d3.schemeCategory20b);

		const x = d3.scaleBand()
			.range([0, width]);

		const xAxis = d3.axisTop().scale(x);

		this.svg = d3.select(this.el).append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		x.domain(NAMES);
		this.xScale = d3.scaleBand()
			.domain(NAMES)
			.range([0, width]);

		this.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(-50,0)")
			.call(xAxis);

		for (let j = 0; j < data.length; j++) {
			let g = this.svg.append("g").attr("class", "phrase");
			let y =  j * this.rowHeight + 25;

			let phrase = data[j]['counts']

			let circles = g.selectAll("circle")
				.data(phrase)
				.enter()
				.append("circle");

			let text = g.selectAll("text")
				.data(phrase)
				.enter()
				.append("text");

			let rScale = d3.scaleLinear()
				.domain([0, d3.max(phrase, (d) => d[1])])
				.range([2, 12]);

			circles
				.attr("cx", 0)
				.attr("cy", y - 3)
				.attr("r", d => rScale(d[1]))
				.style("fill", d => c(j));

			text
				.attr("y", y)
				.attr("x", 0)
				.attr("class", "value")
				.attr("font-size", "18px")
				.attr("text-anchor", "middle")
				.text(d => d[1])
				.style("fill", d => c(j))
				.style("display", "none");

			g.append("text")
				.attr("y", y)
				.attr("x", margin.left*-1)
				.attr("class", "label")
				.attr("font-size", "18px")
				.attr("font-family", 'Bitter')
				.text(truncate(data[j]['name'], 30, "..."))
				.style("fill", (d) => c(j))
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);
		};

		function mouseover(p) {
			let g = d3.select(this).node().parentNode;
			d3.select(g).selectAll("circle").style("display", "none");
			d3.select(g).selectAll("text.value").style("display", "block");
		}

		function mouseout(p) {
			let g = d3.select(this).node().parentNode;
			d3.select(g).selectAll("circle").style("display", "block");
			d3.select(g).selectAll("text.value").style("display", "none");
		}
	}

	update(props) {
		let that = this;
		if (props.inView) {
			this.svg.selectAll(".phrase").each(function(d,i) {
				d3.select(this).selectAll("circle").each(function(d,i) {
					d3.select(this).transition().duration(1000 + (i*350))
						.attr("cx", d => that.xScale(d[0]))
				});

				d3.select(this).selectAll(".value").each(function(d,i) {
					d3.select(this).transition().duration(1000 + (i*350))
						.attr("dx", d => that.xScale(d[0]))
				});
			});
		}
	}
}