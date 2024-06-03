const margin4 = { top: 20, right: 30, bottom: 80, left: 120 },
  width4 = 960 - margin4.left - margin4.right,
  height4 = 600 - margin4.top - margin4.bottom;

const svg4 = d3.select("#chart4")
  .attr("width", width4 + margin4.left + margin4.right)
  .attr("height", height4 + margin4.top + margin4.bottom)
  .append("g")
  .attr("transform", `translate(${margin4.left},${margin4.top})`);

const tooltip4 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
    .attr("fill", d => colorScale(d.typeCombo))
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
      d3.select(this).attr("fill", colorScale(d.typeCombo));
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
    .text(d => d.count);
});
