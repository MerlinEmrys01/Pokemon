const margin4 = { top: 80, right: 30, bottom: 160, left: 120 }, // Increase bottom margin
    width4 = 960 - margin4.left - margin4.right,
    height4 = 800 - margin4.top - margin4.bottom;

const svg4 = d3.select("#chart4")
  .attr("width", width4 + margin4.left + margin4.right)
  .attr("height", height4 + margin4.top + margin4.bottom)
  .append("g")
  .attr("transform", `translate(${margin4.left},${margin4.top})`);

const tooltip4 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Define a color map for the primary types
const colorMap = {
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

d3.csv("Pokemon.csv").then(data => {
  const dualTypeData = data.filter(d => d['Type 1'] && d['Type 2']);

  const typeCombinations = d3.rollup(
    dualTypeData,
    v => v.length,
    d => `${d['Type 1']} & ${d['Type 2']}`
  );

  let formattedData = Array.from(typeCombinations, ([typeCombo, count]) => ({ typeCombo, count }));
  formattedData.sort((a, b) => d3.descending(a.count, b.count));

  const top15 = formattedData.slice(0, 15);

  const x4 = d3.scaleBand()
    .range([0, width4])
    .domain(top15.map(d => d.typeCombo))
    .padding(0.1);

  const y4 = d3.scaleLinear()
    .range([height4, 0])
    .domain([0, d3.max(top15, d => d.count)]);

  svg4.append("g")
    .attr("transform", `translate(0,${height4})`)
    .call(d3.axisBottom(x4))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dy", "1.5em"); // Adjust the dy attribute to add padding

  svg4.append("g")
    .call(d3.axisLeft(y4));

  svg4.selectAll("rect")
    .data(top15)
    .enter()
    .append("rect")
    .attr("x", d => x4(d.typeCombo))
    .attr("y", d => y4(d.count))
    .attr("width", x4.bandwidth())
    .attr("height", d => height4 - y4(d.count))
    .attr("fill", d => {
      const primaryType = d.typeCombo.split(' & ')[0];
      return colorMap[primaryType] || "#56949f"; // Default color if type not found
    })
    .on("mouseover", function(event, d) {
      tooltip4.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip4.html(`${d.typeCombo}<br>Count: ${d.count}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.select(this).attr("fill", "orange");
    })
    .on("mouseout", function(event, d) {
      tooltip4.transition()
        .duration(500)
        .style("opacity", 0);
      d3.select(this).attr("fill", d => {
        const primaryType = d.typeCombo.split(' & ')[0];
        return colorMap[primaryType] || "#56949f"; // Default color if type not found
      });
    })
    .on("click", function(event, d) {
      alert(`You clicked on ${d.typeCombo} with ${d.count} Pokémon!`);
    });

  svg4.selectAll("rect")
    .transition()
    .duration(1000)
    .attr("height", d => height4 - y4(d.count))
    .delay((d, i) => i * 50);

  svg4.selectAll(".label")
    .data(top15)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x4(d.typeCombo) + x4.bandwidth() / 2)
    .attr("y", d => y4(d.count) - 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white") // Set the fill color to white
    .text(d => d.count);

  // Add y-axis label
  svg4.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height4 / 2)
    .attr("y", -margin4.left + 40) // Adjusted position
    .style("text-anchor", "middle")
    .style("fill", "white") // Set fill color to white
    .text("Count");

  // Add x-axis label
  svg4.append("text")
    .attr("x", width4 / 2)
    .attr("y", height4 + margin4.bottom - 30) // Adjusted position
    .style("text-anchor", "middle")
    .style("fill", "white") // Set fill color to white
    .text("Type Combinations");

  // Add chart title
  svg4.append("text")
    .attr("x", width4 / 2)
    .attr("y", -margin4.top / 2) // Adjusted position
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "20px")
    .text("Top 15 Dual Type Combinations by Count");
});

