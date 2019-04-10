var data;

var x;
var x1;
var y;
var svg;

var filterTypes = ["all"];
var hasAll = true;
var filteredData;

var sortType = "winpercent";
var sortedData;


var margin = {top: 30, right: 20, bottom: 100, left: 60},
    width = $(window).width() * 0.8 - (margin.left + margin.right);
    height = 450 - (margin.top + margin.bottom);

const t = d3.transition()
            .duration(250);

const delay = function(d, i) { return i * 0; };




d3.csv("data/candy-data.csv", function (d) {
    data = d;
    var winepercentSortedData = sortData(data, "winpercent");

    // Manipulate the data: change numString to num; add a column "rank"
    data.forEach((item) => {
        let keys = Object.keys(item);

        for (let i = 0; i < keys.length; i ++){
            if(keys[i] != 'competitorname'){
                item[keys[i]] = parseInt(item[keys[i]])
            }
        }

        let rank = winepercentSortedData.indexOf(item) + 1
        item.rank = rank;
    });

    x = d3.scaleBand()
            .range([0, width])
            .padding(0.3);

    x1 = d3.scaleBand()
            .range([0, width])
            .padding(0.3);

    y = d3.scaleLinear()
            .range([height, 0]);




    svg = d3.select("#chart").append("svg")
        .attr("width", width + (margin.left + margin.right))
        .attr("height", height + (margin.top + margin.bottom))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // First Chart
    drawBarChart(filterTypes, sortType);


    // When checkbox label is clicked
    d3.selectAll(".checkbox_lable").on("click", function(d){
        var inputElement = this.parentElement.querySelector("input");
        inputElement.checked = !inputElement.checked;
        filterChange();
    });
    // When checkbox value changes
    d3.selectAll("input[type=checkbox]").on("change", filterChange);


    // When sort button has been clicked
    d3.selectAll("button").on("click", sortChange);
});





function sortData(filteredData, sortType){
    return filteredData.sort( (a, b)=> b[sortType]- a[sortType] );
}







function drawBarChart(filterTypes, sortType){
    //get filteredData
    if( JSON.stringify(filterTypes) !== JSON.stringify(["all"]) ){

        filteredData = data.filter((item) => {
            let sum = 0;
            for (let i = 0; i < filterTypes.length; i ++){
                let filterType = filterTypes[i];
                sum += item[filterType];
            };
            return sum;
        })

    } else{
        filteredData = data;
    };
    //get sortedData
    sortedData = sortData(filteredData, sortType);

    x.domain(sortedData.map((d) => d.competitorname));
    y.domain([0, 0.9]);

    // Create bar groups
    var bar = svg.selectAll(".bar")
                .data(sortedData);

    // ENTER section
    const barEnter = bar.enter()
                        .append("g")
                        .attr("class", "bar")
                        .attr("transform", (d, i) => `translate(${x(d.competitorname)},${y(d.winpercent / 100)})`);

    const rect = barEnter.append("rect")
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr("width", x.bandwidth())
                            .attr("height", d => height - y(d.winpercent / 100))
                            .attr("fill", "#2ABAFC");


    // Create Lable on the bar inside the group
    barEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dx", x.bandwidth() / 2)
            .attr("dy", "1.2em")
            .attr("font-size", ".4em")
            .attr("fill", "white")
            .text((d) => d.rank);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "xAxis")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("font-size", "0.8em")
        .attr("transform", "rotate(60)")
        .attr("text-anchor", "start");


    // add the y Axis
    svg.append("g")
        .attr("class", "yAxis")
        .call(
            d3.axisLeft(y)
                .tickFormat(d3.format(".0%"))
        )
        .selectAll("text")
        .attr("font-size", "0.8em");

    // add lable for y Axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-size", "0.8em")
        .attr("font-family", "sans-serif")
        .style("text-anchor", "middle")
        .text("Wine Pervent");


    // for the use of next time
    x.domain(sortedData.map((d) => d.competitorname));
}







function filterChange(){
    var clickedBox = this;

    // if clickedbox was not in the array (means it's checked), then add it in
    if (! filterTypes.includes(clickedBox.value)){
        filterTypes.push(clickedBox.value);
        // if it's not "all", but "all" was selected, then uncheck all
        if (hasAll && clickedBox.value !== "all"){
            hasAll = false;
            d3.select("#checkbox_all").property("checked", false);
            filterTypes.splice(filterTypes.indexOf("all"),1);
        }
        // if "all" is clicked, and "all" was not selected, then uncheck others
        else if (!hasAll && clickedBox.value === "all") {
            hasAll = true;
            d3.selectAll(".checkbox_notAll").property("checked", false);
            filterTypes = ["all"];
        }
    }
    // if clickedbox was in the array (means it's unchecked), then remove it out
    else{
        filterTypes.splice(filterTypes.indexOf(clickedBox.value), 1)
        // if the array becomes empty, the "all" must be checked
        if (filterTypes.length == 0) {
            hasAll = true;
            d3.select("#checkbox_all").property("checked", true);
            filterTypes = ["all"];
        }
    }


    $("svg").remove();

    svg = d3.select("#chart").append("svg")
        .attr("width", width + (margin.left + margin.right))
        .attr("height", height + (margin.top + margin.bottom))
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    drawBarChart(filterTypes, sortType);
}








function sortChange(){
    //button style
    d3.select(".selected").classed('selected', false);
    this.classList.add("selected");

    //get sortedData
    sortType = this.value;
    sortedData = sortData(filteredData, sortType);

    x1.domain(sortedData.map((d) => d.competitorname));

    d3.selectAll(".bar")
        .transition(t)
        .delay(delay)
        .attr("transform", (d, i) => `translate(${x1(d.competitorname)},${y(d.winpercent / 100)})`);

    d3.selectAll(".xAxis")
        .transition(t)
        .delay(delay)
        .call(d3.axisBottom(x1));
}
