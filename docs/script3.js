const margin3 = { top: 20, right: 30, bottom: 50, left: 120 },
  width3 = 960 - margin3.left - margin3.right,
  height3 = 600 - margin3.top - margin3.bottom,
  radius = Math.min(width3, height3) / 2;

const svg3 = d3.select("#chart3")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", `translate(${(width3 + margin3.left + margin3.right) / 2}, ${(height3 + margin3.top + margin3.bottom) / 2})`);

const tooltip3 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

d3.csv("Pokemon.csv").then(data => {
  const total = data.length;
  const typeCounts = [
    { type: "Pokémons With One Type", count: data.filter(d => !d['Type 2']).length },
    { type: "Pokémons With Two Types", count: data.filter(d => d['Type 2']).length }
  ];

  const color = d3.scaleOrdinal()
    .domain(typeCounts.map(d => d.type))
    .range(d3.schemeCategory10);

  const pie = d3.pie()
    .value(d => d.count);

  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  const arcs = svg3.selectAll("arc")
    .data(pie(typeCounts))
    .enter()
    .append("g")
    .attr("class", "arc");

  arcs.append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.type))
    .on("mouseover", function (event, d) {
      tooltip3.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip3.html(`${d.data.type}<br>Count: ${d.data.count} (${(d.data.count / total * 100).toFixed(2)}%)`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
      d3.selectAll(".arc path").style("opacity", 0.5);
      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function (event, d) {
      tooltip3.transition()
        .duration(500)
        .style("opacity", 0);
      d3.selectAll(".arc path").style("opacity", 1);
    });

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("dy", "-0.35em") // Positioning the label above the percentage
    .style("font-size", "20px") // Set font size
    .text(d => `${d.data.type}`);

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("dy", "0.85em") // Positioning the percentage below the label
    .style("font-size", "40px") // Set font size
    .text(d => `${(d.data.count / total * 100).toFixed(2)}%`);
});
