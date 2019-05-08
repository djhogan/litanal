const d3 = require('d3');
const Element = require('./helper');

const graphWidth = 800;
const graphHeight = 250;

var glue = {
  right: 25,
  left: 25,
  top: 25,
  bottom: 25
};

var Figure = new Element('g',             // tag
  glue.left + graphWidth + glue.right,    // width
  glue.top + graphHeight + glue.bottom);  // height
var Graph = new Element('g',
  graphWidth,
  graphHeight);

Figure.children = [
  {elem: Graph, x: glue.left, y: glue.top}
];

Graph.updateWithData = function(data) {
	/* add axes and plot sentence sentiment
	*/
	this.svg.selectAll('*').remove();
	this.data = data
  this.x = d3.scaleLinear()
    .domain([0, data.length])
    .range([0, this.width]);
  this.y = d3.scaleLinear()
    .domain([-3, 3])
    .range([this.height, 0]);
  this.xAxis = d3.axisBottom(this.x);
  this.yAxis = d3.axisLeft(this.y);
  this.svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + this.y(0) + ')')
    .call(this.xAxis);
  this.svg.append('g')
    .attr('class', 'y axis')
    .call(this.yAxis);
	this.svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", (d, i) => this.x(i))
		.attr("cy", (d) => this.y(d.mean))
		.attr("r", 0.8);
	var rect = this.svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", this.width)
		.attr("height", this.height)
		.style("opacity", 0.0);
	rect.on("click", () => {
		var idx = Math.floor(this.x.invert(d3.mouse(rect.node())[0]));
		d3.select(".tooltip")
			.text("Sentence " + idx + ": " + this.data[idx].sentence);
	});
};

// initialize the figure containers
Figure.initialize(d3.select('svg'));

d3.selectAll('input')
	.on('change', function() {
    d3.select(".tooltip")
      .text("Loading...");
		fetch('/book/' + this.value).then((res) => {
			res.text().then((text) => {
				// update figure with data
				json = JSON.parse(text);
				Figure.update(json);
        d3.select(".tooltip")
          .text("Loaded");
			});
		});
	});

