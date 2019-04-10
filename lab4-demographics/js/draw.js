var data = [];
var USER_SEX = "2",
    USER_RACESIMP = "1",
    USER_AGEGRP = "2";

var category_colors = {
  "married": "rgb(91, 123, 233)",
  "children": "rgb(224, 210, 46)",
  "healthcare": "rgb(44, 206, 246)",
  "college": "rgb(251, 127, 35)",
  "employed": "rgb(214, 60, 163)",
  "selfemp": "rgb(195, 128, 20)",
  "publictrans": "rgb(226, 64, 98)",
  "income_moremed": "rgb(91, 185, 35)",
  "inpoverty": "rgb(85, 85, 85)",
  "isveteran": "rgb(177, 144, 208)",
  "bornoutus": "rgb(188, 200, 50)",
  "diffmovecog": "rgb(238, 123, 156)",
  "diffhearvis": "rgb(242, 153, 179)",
  "widowed": "rgb(1, 217, 159)"
}

var category_name = {
  "married": "MARRIED",
  "children": "OWN CHILDREN IN HOUSEHOLD",
  "healthcare": "HAS HEALTHCARE COVERAGE",
  "college": "BACHELOR'S DEGREE OR MORE",
  "employed": "EMPLOYED",
  "selfemp": "SELF-EMPLOYED",
  "publictrans": "PRIMARILY PUB. TRANS. TO WORK",
  "income_moremed": "PERSONAL INCOME ABOVE NAT. MED.",
  "inpoverty": "BELOW POVERTY LINE",
  "isveteran": "VETERAN",
  "bornoutus": "BORN OUTSIDE US",
  "diffmovecog": "COG. OR PHYS. DIFFICULTY",
  "diffhearvis": "HEARING OR VIS. DIFFICULTY",
  "widowed": "WIDOWED"
}

$(document).ready(function () {
    loadData();
    wireButtonClickEvents();
});

// Loads the CSV file
function loadData() {
    // load the demographics.csv file
    // assign it to the data variable, and call the visualize function by first filtering the data
    // call the visualization function by first findingDataItem
    d3.csv("data/demographics.csv", function (d) {
      data = d;
      data.forEach(function (item) {
        item.total = parseInt(item.total)
      });
      // console.log(data)
      visualizeSquareChart(findDataItem());
    });
}

// Finds the dataitem that corresponds to USER_SEX + USER_RACESIMP + USER_AGEGRP variable values
function findDataItem() {
    // you will find the SINGLE item in "data" array that corresponds to
    //the USER_SEX (sex), USER_RACESIMP (racesimp), and USER_AGEGRP(agegrp) variable values


    //HINT: uncomment and COMPLETE the below lines of code
    var item = data.filter(function (d) {
        return (d.sex == USER_SEX) && (d.racesimp == USER_RACESIMP) && (d.agegrp == USER_AGEGRP)
    })

    if (item.length == 1) {
       // console.log(item[0])
       return item[0];
    }
    return null;
}

//Pass a single dataitem to this function by first calling findDataItem. visualizes square chart
function visualizeSquareChart(item) {
    // visualize the square plot per attribute in the category_color variable
    var chart = d3.select("#chart1").append("div")
                  .attr('id', "chart")
                  .attr("width", "670px")
                  .attr("height", "579px");

    //HINT: you will iterate through the category_colors variable and draw a square chart for each item
    var fields = d3.keys(category_colors)
    fields.forEach(function(field, i) {
        // console.log(field)
        var div = chart.append("div")
                     .attr('class', "chartholder")
                     .attr('id', field)

        var h3 = div.append("h3")
                    .html(category_name[field])

        var svg =  div.append("svg")
                      .attr('class', "squarepie")
                      .style("width", 134)
                      .style("height", 134)

        var rects =  svg.selectAll("rect")
                        .data(d3.range(100).reverse())
                        .enter().append("rect")
                        .attr("x", function (d, i) {
                                     return 12.3 * (i %10);
                        })
                        .attr("y", function (d, i) {
                                     return 12.3 * Math.floor(i / 10);
                        })
                        .attr("height", 12.3)
                        .attr("width", 12.3)
                        .attr("stroke", "white")
                        .attr("fill", function (d) {
                            if (d >= parseInt(item[field])) {
                              return "rgb(224,224,224)";
                            }
                            return category_colors[field];
                        });
    });


    // Update the count div whose id is "n" with item.total
    var count = d3.select("#n").html(item["total"])



}


//EXTRA CREDITS
function wireButtonClickEvents() {
    // We have three groups of button, each sets one variable value.
    //The first one is done for you. Try to implement it for the other two groups

    //SEX
    d3.selectAll("#sex .button").on("click", function () {
        USER_SEX = d3.select(this).attr("data-val");
        d3.select("#sex .current").classed("current", false);
        d3.select(this).classed("current", true);
        $("#chart1").empty();
        visualizeSquareChart(findDataItem());
    });

    // RACE
    d3.selectAll("#racesimp .button").on("click", function () {
        USER_RACESIMP = d3.select(this).attr("data-val");
        d3.select("#racesimp .current").classed("current", false);
        d3.select(this).classed("current", true);
        $("#chart1").empty();
        visualizeSquareChart(findDataItem());
    });

    //AGEGROUP
    d3.selectAll("#agegrp .button").on("click", function () {
        USER_AGEGRP = d3.select(this).attr("data-val");
        d3.select("#agegrp .current").classed("current", false);
        d3.select(this).classed("current", true);
        $("#chart1").empty();
        visualizeSquareChart(findDataItem());
    });

}
