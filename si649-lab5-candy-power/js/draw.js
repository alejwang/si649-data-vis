var data = []; // the variable that holds the data from csv file
var origin_data = [];

$(document).ready(function () {
    loadData();

});

function loadData() {
    d3.csv("data/candy-data.csv", function (d) {
      origin_data = d;
      origin_data.sort((a, b) => b.winpercent - a.winpercent)
      for (var i = 0; i < origin_data.length; i++) {
          origin_data[i].ranknum = i + 1;
      }
      data = origin_data;
      sortData('rank');
      }
    );
}

function filterDataForAll() {
    var current = $("#all")[0].checked;
    $("input:checkbox[name=filter]").each(function(){
      if (current == true) { $(this).prop("checked", true); }
      else { $(this).prop("checked", false); }
    });
    filterData();
}

function filterData() {
    var selected = []
    $("input:checkbox[name=filter]:checked").each(function(){
      if ($(this).val() != 'all') { selected.push($(this).val()); }
    });
    if (selected.length == 6) { $("#all").prop("checked", true); }
    else { $("#all").prop("checked", false); }
    data = origin_data.filter(function(d) {
        for (var i = 0; i < selected.length; i++) {
          if (d[selected[i]] == 1) { return true; }
        }
        return false;
    });
    console.log("filter" + data);
    // visualizeBarChart(data);
    updateChar(data);
}

function sortData(option){
  switch (option) {
    case "rank": data.sort((a, b) => b.winpercent - a.winpercent); break;
    case "price": data.sort((a, b) => b.pricepercent - a.pricepercent); break;
    case "sugar": data.sort((a, b) => b.sugarpercent - a.sugarpercent); break;
  }
  // visualizeBarChart(data);
  updateChar(data);
};

function updateChar(ds) {
    // var svg = d3.select("#chart1")
    var bar = d3.selectAll(".bar")
              .data(ds)
              
    console.log(bar)
    
    var margin = { top: 20, right: 20, bottom: 100, left: 60 },
        width = 940 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var x = d3.scaleBand()
        .domain(data.map(function (d) { return d.competitorname; }))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(ds, function (d) { return d.winpercent; })])
        .range([height, 0]);
        

    bar.transition()
      .duration(500)
      // .append("rect")
      // .attr("class", "bar")
      // .style("mix-blend-mode", "multiply")
      // .attr("fill", "#5b717c")
      .attr("width", x.bandwidth())
      // .attr("opacity", "0.7")
      .attr("y", height)
      .attr("x", function (d) { return x(d.competitorname); })
      .attr("y", function (d) { return y(d.winpercent); })
      .attr("height", function (d) { return height - y(d.winpercent); })
      .delay((d, i) => i * 20)
    bar.exit()
      .transition(t)
      .attr("width", 0)
      .remove()
}

function visualizeBarChart(ds) {
    console.log("input is " + ds);
    var margin = { top: 20, right: 20, bottom: 100, left: 60 },
        width = 940 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(data.map(function (d) { return d.competitorname; }))
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(ds, function (d) { return d.winpercent; })])
        .range([height, 0]);

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    d3.selectAll("svg").remove();

    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const t = svg.transition()
        .duration(750);

    var bar = svg.selectAll(".bar")
                .data(ds)
    bar.enter()
      .append("rect")
      .attr("class", "bar")
      .style("mix-blend-mode", "multiply")
      .attr("fill", "#5b717c")
      .attr("width", x.bandwidth())
      .attr("opacity", "0.7")
      .attr("y", height)
      .attr("x", function (d) { return x(d.competitorname); })
      .transition(t)
      .attr("y", function (d) { return y(d.winpercent); })
      .attr("height", function (d) { return height - y(d.winpercent); })
      .delay((d, i) => i * 20)

    svg.selectAll(".bar")
        .on("mousemove", function (d) {
                    tooltip
                        .style("left", d3.event.pageX + 50 + "px")
                        .style("top", d3.event.pageY - 70 + "px")
                        .style("display", "inline-block")
                        .html("<b> #" + d.ranknum + "<br> Rank: "+ d.winpercent + "<br> Price: "+ d.pricepercent + "<br> Sugar: "+ d.sugarpercent);
                })
                .on("mouseout", function (d) {
                    tooltip.style("display", "none");
                });

    bar.exit()
      .transition(t)
      .attr("width", 0)
      .remove()


    bartext = svg.selectAll(".bartext")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "bartext")
                .attr("text-anchor", "middle")
                .attr("fill", "#f7f7f7")
                .attr("x", function(d,i) {
                    return x(d.competitorname)+x.bandwidth()/2;
                })
                .attr("y", function(d,i) {
                    return  y(d.winpercent) + 20;
                })
                .text(function(d){
                     return d.ranknum;
                });

    var gx = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "0.8em")
        .attr("transform", "rotate(-45)");

    var gy = svg.append("g")
        .call(d3.axisLeft(y));

};
