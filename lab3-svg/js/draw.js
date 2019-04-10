//VARIABLES GO HERE
var min = 1;
var max = 100;
// console.log("SI 649 Lab 3");
// console.log(Math.random());

var names = ['Kelly', 'Jim', 'John', 'Sam', 'Mike'];
var data = []

// names.forEach(function(value, i){
//   console.log(i + ":" + value);
// });

// CALLS FUNCTIONS ONCE PAGE HAS RENDERED
document.addEventListener('DOMContentLoaded', function () {
    generateData();
    draw();
    drawCircles();
}, false);

////////////////////////////////////////////////////////////////////////////////
//YOUR FUNCTIONS GO HERE:
////////////////////////////////////////////////////////////////////////////////

function generateRandomNumber() {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData() {
  names.forEach(function(l){
    data.push({
      name: l,
      score: generateRandomNumber()
    })
  });
  // console.log(data);
}



function draw() {
  // q1
  var body = d3.select("#q1");
  var para = body.append("p");
  para = para.text("alice");
  para = para.style("color", "red");

  // q2
  var para = d3.select('#q2').append("p").text("alice").style("color", "red")


  // q3
  d3.select("#q3")
    .selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text(function(each, i){
      return "Person at " + i + " in the dataset is:" + each.name;
  });


  // q4
  d3.select("#q4")
    .selectAll("p")
    .data(data)
    .enter()
    .append("p")
    .text(function(d, i){
      return "Person at " + i + " in the dataset is:" + d.name;
    })
    .style("color", function(d){
      if (d.score < 30){
        return "red";
      } else {
        return "black";
      }
  });

  // q5
  var svg = d3.select("#q5")
              .append("svg")
              .attr("width", 500)
              .attr("height", 100);

  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("width", function(d){return d.score})
     .attr("height", function(d){return d.score})
     .attr("y",10)
     .attr("x", function(d,i){return i*100});

  d3.select("#q5t")
    .selectAll("li")
    .data(data)
    .enter()
    .append("li")
    .style("width", "100px")
    .style("height", "30px")
    .style("display", "inline-block")
    .text(function(d) {
      return d.name;
    });


   // q6
   var svg2 = d3.select("#q6")
               .append("svg")
               .attr("width", 500)
               .attr("height", 100);

   svg2.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", function(d){return d.score/2})
      .attr("cy",50)
      .attr("cx", function(d,i){return i*100 + 50});

}
