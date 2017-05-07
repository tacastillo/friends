/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
///////// Adapted to E6 and D3 v4 by tacastillo /////////
/////////////////////////////////////////////////////////

// Extraversion, Intellect, Dutifulness, Artistic interests, Outgoing

import * as d3 from "d3";
import BaseChart from "./BaseChart";
	
export default class RadarChart extends BaseChart{
	
	create(data) {
		// console.log(data);
		let config = {
			w: this.props.width,				//Width of the circle
			h: this.props.height,				//Height of the circle
			margin: this.props.margin, //The margins of the SVG
			levels: 4,				//How many levels or inner circles should there be drawn
			maxValue: 1, 			//What is the value that the biggest circle will represent
			labelFactor: this.props.labelDistance || 1.2, 	//How much farther than the radius of the outer circle should the labels be placed
			wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
			opacityArea: 0.5, 	//The opacity of the area of the blob
			dotRadius: 3, 			//The size of the colored circles of each blog
			opacityCircles: 0.2, 	//The opacity of the circles of each blob
			strokeWidth: 2, 		//The width of the stroke around each blob
			roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed),
		};
		
		//If the supplied maxValue is smaller than the actual one, replace by the max in the data
		const maxValue = Math.max(config.maxValue, d3.max(data, i => d3.max(i.map(o => o.percentile))));

		let allAxis = (data[0].map((i,j) => i.name)),	//Names of each axis
			total = allAxis.length,					//The number of different axes
			radius = Math.min(config.w/2, config.h/2), 	//Radius of the outermost circle
			Format = d3.format(".0%"),			 	//Percentage formatting
			angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
		
		//Scale for the radius
		let rScale = d3.scaleLinear()
			.range([0, radius])
			.domain([0, maxValue]);
			
		/////////////////////////////////////////////////////////
		//////////// Create the container SVG and g /////////////
		/////////////////////////////////////////////////////////
		
		//Initiate the radar chart SVG
		let svg = d3.select(this.el).append("svg")
            .attr("width",  config.w + config.margin + config.margin)
			.attr("height", config.h + config.margin + config.margin)
            .attr("class", "radar");
        this.svg = svg;
		//Append a g element		
		let g = svg.append("g")
				.attr("transform", `translate(${config.w/2 + config.margin},${config.h/2 + config.margin})`);

		/////////////////////////////////////////////////////////
		/////////////// Draw the Circular grid //////////////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the grid & axes
		let axisGrid = g.append("g").attr("class", "axisWrapper");
		
		//Draw the background circles
		axisGrid.selectAll(".levels")
		   .data(d3.range(1,(config.levels+1)).reverse())
		   .enter()
			.append("circle")
			.attr("class", "gridCircle")
			.attr("r", (d, i) => {return radius/config.levels*d;})
			.style("fill", "#CDCDCD")
			.style("stroke", "#CDCDCD")
			.style("fill-opacity", config.opacityCircles)

		//Text indicating at what % each level is
		axisGrid.selectAll(".axisLabel")
		   .data(d3.range(1,(config.levels+1)).reverse())
		   .enter().append("text")
		   .attr("class", "axisLabel")
		   .attr("x", 4)
		   .attr("y", function(d){return -d*radius/config.levels;})
		   .attr("dy", "0.4em")
		   .style("font-size", "10px")
		   .attr("fill", "#737373")
		   .text(function(d,i) { return Format(maxValue * d/config.levels); });

		/////////////////////////////////////////////////////////
		//////////////////// Draw the axes //////////////////////
		/////////////////////////////////////////////////////////
		
		//Create the straight lines radiating outward from the center
		let axis = axisGrid.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");
		//Append the lines
		axis.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", function(d, i){ return rScale(maxValue) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y2", function(d, i){ return rScale(maxValue) * Math.sin(angleSlice*i - Math.PI/2); })
			.attr("class", "line")
			.style("stroke", "white")
			.style("stroke-width", "1px");

		//Append the labels at each axis
		axis.append("text")
			.attr("class", "legend")
			.style("font-size", "14px")
			.attr("text-anchor", "middle")
			.attr("dy", "0.35em")
			.attr("x", function(d, i){ return rScale(maxValue * config.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("y", function(d, i){ return rScale(maxValue * config.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
			.text(function(d){return d})
			.on("mouseover", function(d) {})
			.call(wrap, config.wrapWidth);

		/////////////////////////////////////////////////////////
		///////////// Draw the radar chart blobs ////////////////
		/////////////////////////////////////////////////////////
		
		//The radial line function
		let radarLine = d3.radialLine()
			.radius(function(d) { return rScale(d.percentile); })
			.angle(function(d,i) {	return i*angleSlice; })
			.curve(d3.curveLinearClosed);
			
		if(config.roundStrokes) {
			radarLine.curve(d3.curveCardinalClosed);
		}
					
		//Create a wrapper for the blobs	
		let blobWrapper = g.selectAll(".radarWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarWrapper");
				
		//Append the backgrounds	
		blobWrapper
			.append("path")
			.attr("class", "radarArea")
			.attr("d", (d,i) => radarLine(d))
			.style("fill", this.props.color)
			.style("fill-opacity", config.opacityArea)
			.on('mouseover', function (d,i){
				// d3.select(this).transition().duration(200)
				// 	.style("fill-opacity", 0.85);
				// config.mouseOutFunction();
			})
			.on('mouseout', function(){
				//Bring back all blobs
				// d3.select(this).transition().duration(200)
				// 	.style("fill-opacity", config.opacityArea);
			});
			
		//Create the outlines	
		blobWrapper.append("path")
			.attr("class", "radarStroke")
			.attr("d", d => radarLine(d))
			.style("stroke-width", config.strokeWidth + "px")
			.style("stroke", this.props.color)
			.style("fill", "none")
		
		//Append the circles
		blobWrapper.selectAll(".radarCircle")
			.data(d => d)
			.enter().append("circle")
			.attr("class", "radarCircle")
			.attr("r", config.dotRadius)
			.attr("cx", (d,i) => rScale(d.percentile) * Math.cos(angleSlice*i - Math.PI/2))
			.attr("cy", (d,i) => rScale(d.percentile) * Math.sin(angleSlice*i - Math.PI/2))
			.style("fill", this.props.color)
			.style("fill-opacity", 0.8)

		/////////////////////////////////////////////////////////
		//////// Append invisible circles for tooltip ///////////
		/////////////////////////////////////////////////////////
		
		//Wrapper for the invisible circles on top
		let blobCircleWrapper = g.selectAll(".radarCircleWrapper")
			.data(data)
			.enter().append("g")
			.attr("class", "radarCircleWrapper");
			
		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", config.dotRadius*1.5)
			.attr("cx", function(d,i){ return rScale(d.percentile) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.percentile) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				let newX =  parseFloat(d3.select(this).attr('cx')) - 10;
				let newY =  parseFloat(d3.select(this).attr('cy')) - 10;
						
				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(Format(d.percentile))
					.transition().duration(200)
					.style('opacity', 1);
			})
			.on("mouseout", function(){
				tooltip.transition().duration(200)
					.style("opacity", 0);
			});
			
		//Set up the small tooltip for when you hover over a circle
		let tooltip = g.append("text")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
		/////////////////////////////////////////////////////////
		/////////////////// Helper Function /////////////////////
		/////////////////////////////////////////////////////////

		//Taken from http://bl.ocks.org/mbostock/7555321
		//Wraps SVG text	
		function wrap(text, width) {
		  text.each(function() {
			let text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
				
			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
		  });
		}//wrap	
	}
}//RadarChart