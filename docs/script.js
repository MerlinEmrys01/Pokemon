// tried to match file format with other provided code

//graphs the strongest Pokemons' total strength by Pokemon type

const margin1 = {top: 20, right: 30, bottom: 50, left: 120},
    width1 = 960 - margin1.left - margin1.right,
    height1 = 600 - margin1.top - margin1.bottom;

const svg1 = d3.select("#chart1")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

const tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("strongest_pokemon.csv").then(data => {
  data.forEach((d, i) => d.index = i);

  const x1 = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Total)])
    .range([0, width1]);
  svg1.append("g")
    .attr("transform", `translate(0,${height1})`)
    .call(d3.axisBottom(x1))
    .selectAll("text")
    .attr("class", "axis-label");

  svg1.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width1 / 2)
    .attr("y", height1 + margin1.bottom - 10)
    .text("Total Strengths");

  const y1 = d3.scaleBand()
    .range([0, height1])
    .domain(data.map(d => d['Type 1']))
    .padding(.1);
  svg1.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y1))
    .selectAll("text")
    .attr("class", "axis-label");

  svg1.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", -height1 / 2)
    .attr("y", -margin1.left + 60)
    .attr("transform", "rotate(-90)")
    .text("Pokemon Type 1");

  // code for drag interactive plot
  const drag = d3.drag()
    .on("start", function(event, d) {
      d3.select(this).raise().attr("stroke", "black");
    })
    .on("drag", function(event, d) {
      const yPosition = d3.pointer(event)[1];
      const newIndex = Math.max(0, Math.min(data.length - 1, Math.round(yPosition / y1.step())));
      if (newIndex !== d.index) {
        data.splice(d.index, 1);
        data.splice(newIndex, 0, d);
        data.forEach((d, i) => d.index = i);
        y1.domain(data.map(d => d['Type 1']));
        svg1.selectAll("rect")
          .transition().duration(200)
          .attr("y", d => y1(d['Type 1']));
        svg1.select(".y-axis")
          .transition().duration(200)
          .call(d3.axisLeft(y1));
      }
    })
    .on("end", function(event, d) {
      d3.select(this).attr("stroke", null);
    });

  svg1.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x1(0))
    .attr("y", d => y1(d['Type 1']))
    .attr("width", d => x1(d.Total))
    .attr("height", y1.bandwidth())
    .attr("class", "bar")
    .call(drag)
    .on("mouseover", function(event, d) {
      tooltip1.transition()
          .duration(200)
          .style("opacity", .9);
      tooltip1.html(d.Total)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
      tooltip1.transition()
          .duration(500)
          .style("opacity", 0);
    });
});
