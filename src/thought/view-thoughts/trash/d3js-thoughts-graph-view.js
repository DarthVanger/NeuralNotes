import d3 from 'd3';

console.debug('thoughts-graph-view.js');

console.debug('d3.js: ', d3);

var thoughts = [];

export default {set, render};

function set(p_thoughts) {
  thoughts = p_thoughts;
}

function render() {
  console.debug('redner!');

  //Make an SVG Container
  var svgContainer = d3.select("#output").append("svg")
    .attr("width", 1000)
    .attr("height", 500);

  thoughts.forEach(function (thought, index) {
    if (thought.name.length > 10) {
      thought.name = thought.name.substr(0, 8) + '...';
    }
    var period = 2 * Math.PI / thoughts.length;
    var thoughtCenterX = 2 * 135 * Math.cos(index * period) + 350;
    var thoughtCenterY = 2 * 100 * Math.sin(index * period) + 250;

    //Draw the Circle
    svgContainer.append("text")
      .text(thought.name)
      .attr("x", function () {
        return thoughtCenterX - this.getComputedTextLength() / 2;
      })
      .attr("y", thoughtCenterY);

    //Draw the Center of thought
    svgContainer.append("circle")
      .attr('cx', thoughtCenterX)
      .attr('cy', thoughtCenterY)
      .attr('r', 1)
      .attr('fill', 'black');

    //Draw the Circle
    svgContainer.append("ellipse")
      .attr("cx", thoughtCenterX)
      .attr("cy", thoughtCenterY)
      .attr("rx", 80)
      .attr("ry", 30)
      .style('fill', 'transparent')
      .style('fill-opacity', 0)
      .style('stroke', 'pink');
  });
}
