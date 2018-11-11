var points = [
  [480, 200],
  [580, 400],
  [680, 100],
  [780, 300],
  [180, 300],
  [280, 100],
  [380, 400]
];

var svg = d3.select("body").append("svg")
    .attr("width", 1000)
    .attr("height", 1000);

var point = svg.append("circle")
                .attr("r",25)
                .attr("cx", points[0][0])
                .attr("cy", points[0][1]);
var current_pos = 0;                
var rect = svg.append("rect")
                .attr("x", 10)
                .attr("y", 10)
                .attr("width", 10)
                .attr("height", 10)
                .on("click", runClick);
function runClick(d, i) {
    console.log(d);
    console.log(i);
    current_pos = (current_pos + 1)%points.length;
    point.transition()
            .attr("cx", points[current_pos][0])
            .attr("cy", points[current_pos][1]);
};
       

var slider_rect = svg.append("rect")
                    .attr("x", 100)
                    .attr("y", 600)
                    .attr("width", 500)
                    .attr("height", 100)
                    .attr("opacity", 0.2);
var slider_line = svg.append("rect")
                    .attr("x", 100)
                    .attr("y", 600)
                    .attr("width", 20)
                    .attr("height", 100)
                    .style("stroke-width", 5)
                    .style("stroke", "#000")
                    .style("fill", "transparent")
                    .call(d3.drag()
                            .on("drag", dragbehaviour));
slider_line_max = 100 + 500-10;
slider_line_min = 100-10;

var totalTimeStates = 3 * 12 * 60;
           
var slider_scale = d3.scaleLinear()
            .domain([0, totalTimeStates-1])
            .range([slider_line_min, slider_line_max]);
console.log(totalTimeStates);
console.log(slider_scale.invert(slider_line_min));
console.log(slider_scale.invert(slider_line_max));

function convert_timestate_to_dayhourmin (timestate) {
    day = Math.floor(timestate / (12*60));
    hour = Math.floor((timestate % (12*60)) / 60 );
    minutes = Math.floor(timestate % 60);
    
    return([day, hour, minutes]);
}

function dragbehaviour(d) {
    var new_pos = d3.event.x;
    new_pos = Math.max(new_pos, slider_line_min);
    new_pos = Math.min(new_pos, slider_line_max);
    
    d3.select(this).attr("x", new_pos);
    if (new_pos == d3.event.x) {
        var dayhourmin = convert_timestate_to_dayhourmin(slider_scale.invert(new_pos));
        move_the_points(dayhourmin[0], dayhourmin[1], dayhourmin[2]);
    }
}

function move_the_points(day, hour, minutes) {
    var new_pos = (day*12 + hour)%7;
    
    if (new_pos != current_pos) {
        current_pos = new_pos;
        point.transition()
            .attr("cx", points[current_pos][0])
            .attr("cy", points[current_pos][1]);
    }
}



/*var path = svg.append("path")
    .data([points])
    .attr("d", d3.svg.line()
    .tension(0) // Catmull–Rom
    .interpolate("cardinal-closed"));

svg.selectAll(".point")
    .data(points)
  .enter().append("circle")
    .attr("r", 4)
    .attr("transform", function(d) { return "translate(" + d + ")"; });

var circle = svg.append("circle")
    .attr("r", 13)
    .attr("transform", "translate(" + points[0] + ")");

transition();

function transition() {
  circle.transition()
      .duration(10000)
      .attrTween("transform", translateAlong(path.node()))
      .each("end", transition);
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}*/
