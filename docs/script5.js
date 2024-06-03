<<<<<<< Updated upstream
const margin5 = { top: 20, right: 30, bottom: 80, left: 120 },
  width5 = 960 - margin5.left - margin5.right,
  height5 = 600 - margin5.top - margin5.bottom;

const svg5 = d3.select("#chart5")
  .attr("width", width5 + margin5.left + margin5.right)
  .attr("height", height5 + margin5.top + margin5.bottom)
  .append("g")
  .attr("transform", `translate(${margin5.left},${margin5.top})`);

const tooltip5 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("Pokemon.csv").then(data => {
  const dualTypeData = data.filter(d => d['Type 1'] && d['Type 2']);

  const typeCombinations = d3.rollup(
    dualTypeData,
    v => d3.sum(v, d => +d['Total']),
    d => `${d['Type 1']} & ${d['Type 2']}`
  );

  let formattedData = Array.from(typeCombinations, ([typeCombo, total]) => ({ typeCombo, total }));
  formattedData.sort((a, b) => d3.descending(a.total, b.total));

  const top15 = formattedData.slice(0, 15);

  const x5 = d3.scaleBand()
    .range([0, width5])
    .domain(top15.map(d => d.typeCombo))
    .padding(0.1);

  const y5 = d3.scaleLinear()
    .range([height5, 0])
    .domain([0, d3.max(top15, d => d.total)]);

  svg5.append("g")
    .attr("transform", `translate(0,${height5})`)
    .call(d3.axisBottom(x5))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dy", "1.5em");

  svg5.append("g")
    .call(d3.axisLeft(y5));

  svg5.selectAll("rect")
    .data(top15)
    .enter()
    .append("rect")
    .attr("x", d => x5(d.typeCombo))
    .attr("y", d => y5(d.total))
    .attr("width", x5.bandwidth())
    .attr("height", d => height5 - y5(d.total))
    .attr("fill", d => colorScale(d.typeCombo))
    .on("mouseover", function(event, d) {
      tooltip5.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip5.html(`${d.typeCombo}<br>Total: ${d.total}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.select(this).attr("fill", "orange");
    })
    .on("mouseout", function(event, d) {
      tooltip5.transition()
        .duration(500)
        .style("opacity", 0);
      d3.select(this).attr("fill", colorScale(d.typeCombo));
    })
    .on("click", function(event, d) {
      alert(`You clicked on ${d.typeCombo} with a total score of ${d.total}!`);
    });

  svg5.selectAll("rect")
    .transition()
    .duration(1000)
    .attr("height", d => height5 - y5(d.total))
    .delay((d, i) => i * 50);

  svg5.selectAll(".label")
    .data(top15)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x5(d.typeCombo) + x5.bandwidth() / 2)
    .attr("y", d => y5(d.total) - 5)
    .attr("text-anchor", "middle")
    .text(d => d.total);
});
=======
const margin = { top: 50, right: 50, bottom: 80, left: 70 }; // Adjusted margins

const width = 1000 - margin.left - margin.right; // Adjusted width
const height = 800 - margin.top - margin.bottom; // Adjusted height

// Append an SVG element to the body with adjusted dimensions and margins
const svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right) // Adjusted width
  .attr("height", height + margin.top + margin.bottom) // Adjusted height
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // Adjusted transform

// Read the data from the CSV file
d3.csv("Pokemon.csv").then(function(data) {
  // Group the data by type combinations and calculate average total strength
  const typeCombinationGroups = d3.group(data, d => `${d['Type 1']}-${d['Type 2']}`);
  const typeCombinationAverages = Array.from(typeCombinationGroups, ([key, value]) => {
    const total = d3.mean(value, d => +d['Total']);
    return { typeCombination: key, averageTotal: total };
  });

  // Sort the data by average total strength
  typeCombinationAverages.sort((a, b) => b.averageTotal - a.averageTotal);

  // Select only the top 15 combinations
  const top15Combinations = typeCombinationAverages.slice(0, 15);

  // Define x and y scales
  const xScale = d3.scaleBand()
    .domain(top15Combinations.map(d => d.typeCombination))
    .range([0, width]) // Adjusted range
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(top15Combinations, d => d.averageTotal)])
    .range([height, 0]); // Adjusted range

  // Draw bars for each type combination with tooltips
  svg.selectAll("rect")
    .data(top15Combinations)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.typeCombination))
    .attr("y", d => yScale(d.averageTotal))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.averageTotal))
    .attr("fill", "#56949f")
    .on("mouseover", function(event, d) {
        const tooltipHeight = 60;
        tooltip2.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip2.html(`Avg Total Strength: ${d.averageTotal.toFixed(2)}`) // Display the y-axis value
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - tooltipHeight) + "px");
    })
    .on("mouseout", function(event, d) {
        tooltip2.transition()
            .duration(500)
            .style("opacity", 0);
    });

  // Add x-axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")") // Adjusted transform
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.5em");

  // Add y-axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20) // Adjusted position
    .style("text-anchor", "middle")
    .text("Average Total Strength");

  // Add x-axis label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom + 0.1) // Adjusted position
    .style("text-anchor", "middle")
    .text("Type Combinations");

  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2) // Adjusted position
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .text("Top 15 Average Total Strength by Type Combinations");
});

>>>>>>> Stashed changes
