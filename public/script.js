// Set the dimensions and margins of the graph
const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("strongest_pokemon.csv").then(data => {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Total)])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("class", "axis-label");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(d => d['Type 1']))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .attr("class", "axis-label");

  // Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d['Type 1']))
    .attr("width", d => x(d.Total))
    .attr("height", y.bandwidth() )
    .attr("class", "bar");
});