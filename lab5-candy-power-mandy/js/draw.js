var data = [];
var udata = [];
var checkedFilter = {
  chocolate: "0",
  fruity: "0",
  caramel: "0",
  peanutyalmondy: "0",
  nougat: "0",
  crispedricewafer: "0",
};

$(document).ready(function() {
  loadData();
  wireButtonClickEvents();
});

function loadData() {
  d3.csv("data/candy-data.csv", function(d) {
    data = d;
    udata = d;
    data.forEach(function(d) {
      d.winpercent = parseInt(d.winpercent);
    });
    visualizeBarChart(sortByWinpercent(data));
  });
}

function findDataItem() {

  var item = data.filter(

    function (d) {
        return d.chocolate == checkedFilter.chocolate && 
          d.fruity == checkedFilter.fruity && 
          d.caramel == checkedFilter.caramel && 
          d.peanutyalmondy == checkedFilter.peanutyalmondy && 
          d.nougat == checkedFilter.nougat && 
          d.crispedricewafer == checkedFilter.crispedricewafer
    });

    return item;
}

function sortByWinpercent(dataitems) {
  
  dataitems.sort(function(a, b) {
    return d3.descending(a.winpercent, b.winpercent);
  });
  return dataitems;
}


function visualizeBarChart(dataitems, update=false) {
    var margin = { top: 20, right: 20, bottom: 100, left: 60 },
      width = 1100 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


  var x = d3.scaleBand()
    .domain(dataitems.map(function(d) {
      return d.competitorname;
    }))
    .range([0, width])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(dataitems, function(d) {
      return d.winpercent;
    })])
    .range([height, 0]);

  var tooltip = d3.select("body").append("div")
        .attr("class", "toolTip")
        .style("opacity", 0);

  if(update){ //consulted Ruchi for the update part because I really couldn't figure out how to do it here.
      var svg = d3.select('svg');
      svg.selectAll(".bar")
        .transition()
        .duration(300)
        .delay(200)
        .attr("x", function(d, i) {
          return x(d.competitorname); })
      }
  else {

  var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
    .append("g")
    .attr("transform", "translate(" + 50 + "," + 50 + ")");

  svg.selectAll(".bar")
    .data(dataitems)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("fill", "#7eccb9")
    .attr("x", function(d) {
      return x(d.competitorname);})
    .attr("width", x.bandwidth())
    .transition()
    .attr("y", function(d) {
      return y(d.winpercent);})
    .attr("height", function(d) {
      return height - y(d.winpercent);
    });

    svg.selectAll(".bar")
    .on("mouseover", function(d, i) {
      tooltip.transition()
          .duration(100)
          .style("opacity", 1);
          tooltip.html("Rank:" + (i+1) + "<br/> Sugar:"  + d.sugarpercent + "<br/> Price:"  + d.pricepercent)
          .style("left", (d3.event.pageX) + 10 + "px")
          .style("top", (d3.event.pageY) - 100 + "px");
      })
    .on("mouseout", function(d) {
        tooltip.transition()
          .duration(100)
          .style("opacity", 0);
        });

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("text-anchor", "end")
          .attr("font-family", "Lucida Console")
          .attr("transform", "rotate(-60)")
          .attr("dx", "-.5em")
          .attr("dy", ".2em");
  
  svg.append("g")
    .call(d3.axisLeft(y));

  }
}

function wireButtonClickEvents() {
  d3.select("#winpercent").on("click", function() {
    d3.select(".current").classed("current", false);
    d3.select(this).classed("current", true);
  });
  d3.select("#pricepercent").on("click", function() {
    d3.select(".current").classed("current", false);
    d3.select(this).classed("current", true);
  });
  d3.select("#sugarpercent").on("click", function() {
    d3.select(".current").classed("current", false);
    d3.select(this).classed("current", true);
  });
}

function plotChart(prop, event) {
  $("#chart").empty();
  if(prop.value == 'all'){
    $("#chocolate")[0].checked = false
    $("#fruity")[0].checked = false
    $("#caramel")[0].checked = false
    $("#peanutyalmondy")[0].checked = false
    $("#nougat")[0].checked = false
    $("#crispedricewafer")[0].checked = false
    udata = data;
  }
  else{
    $("#all")[0].checked = false
    if(checkedFilter[prop.value] == "1"){
      checkedFilter[prop.value] = "0"
    }
    else{
      checkedFilter[prop.value] = "1"
    }

    udata = findDataItem();
  }
  visualizeBarChart(udata);
}

function resort(prop, event){
  var property = prop.id;
  udata.sort(function(a, b) {
    return d3.descending(a[property], b[property]);
  });
  visualizeBarChart(udata, true);
}

function sortChart(element, event){
  var property = element.id + "percent";
  udata.sort(function(a, b) {
    return d3.descending(a[property], b[property])
  })
  visualizeBarChart(udata, true);

}

