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
