const margin5 = { top: 50, right: 50, bottom: 120, left: 70 }; // Adjusted bottom margin
const width5 = 1000 - margin5.left - margin5.right; // Adjusted width
const height5 = 600 - margin5.top - margin5.bottom; // Adjusted height

// Append an SVG element to the body with adjusted dimensions and margins
const svg5 = d3.select("#chart5")
  .append("svg")
  .attr("width", width5 + margin5.left + margin5.right) // Adjusted width
  .attr("height", height5 + margin5.top + margin5.bottom) // Adjusted height
  .append("g")
  .attr("transform", "translate(" + margin5.left + "," + margin5.top + ")"); // Adjusted transform

// Define a color map for the primary types
const colorMap5 = {
  "Grass": "#78C850",
  "Fire": "#F08030",
  "Water": "#6890F0",
  "Bug": "#A8B820",
  "Normal": "#A8A878",
  "Poison": "#A040A0",
  "Electric": "#F8D030",
  "Ground": "#E0C068",
  "Fairy": "#EE99AC",
  "Fighting": "#C03028",
  "Psychic": "#F85888",
  "Rock": "#B8A038",
  "Ghost": "#705898",
  "Ice": "#98D8D8",
  "Dragon": "#7038F8",
  "Dark": "#705848",
  "Steel": "#B8B8D0",
  "Flying": "#A890F0"
};

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
  const xScale5 = d3.scaleBand()
    .domain(top15Combinations.map(d => d.typeCombination))
    .range([0, width5]) // Adjusted range
    .padding(0.1);

  const yScale5 = d3.scaleLinear()
    .domain([0, d3.max(top15Combinations, d => d.averageTotal)])
    .range([height5, 0]); // Adjusted range

  // Draw bars for each type combination with tooltips
  svg5.selectAll("rect")
    .data(top15Combinations)
    .enter()
    .append("rect")
    .attr("x", d => xScale5(d.typeCombination))
    .attr("y", d => yScale5(d.averageTotal))
    .attr("width", xScale5.bandwidth())
    .attr("height", d => height5 - yScale5(d.averageTotal))
    .attr("fill", d => {
      const primaryType = d.typeCombination.split('-')[0];
      return colorMap5[primaryType] || "#56949f"; // Default color if type not found
    })
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
  svg5.append("g")
    .attr("transform", "translate(0," + height5 + ")") // Adjusted transform
    .call(d3.axisBottom(xScale5))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.5em")
    .attr("dy", "0.5em");

  // Add y-axis
  svg5.append("g")
    .call(d3.axisLeft(yScale5));

  // Add y-axis label
  svg5.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height5 / 2)
    .attr("y", -margin5.left + 20) // Adjusted position
    .style("text-anchor", "middle")
    .style("fill", "white") // Set fill color to white
    .text("Average Total Strength");

  // Add x-axis label
  svg5.append("text")
    .attr("x", width5 / 2)
    .attr("y", height5 + margin5.top + 60) // Adjusted position
    .style("text-anchor", "middle")
    .style("fill", "white") // Set fill color to white
    .text("Type Combinations");

  // Add chart title
  svg5.append("text")
    .attr("x", width5 / 2)
    .attr("y", -margin5.top / 2) // Adjusted position
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Top 15 Average Total Strength by Type Combinations");
});
