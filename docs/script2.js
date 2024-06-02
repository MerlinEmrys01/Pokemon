// same idea as the first graph, but now includes all Pokemons instead of just the strongest ones
// graphs Pokemon type by count in the total dataset

const margin2 = { top: 20, right: 30, bottom: 50, left: 120 },
    width2 = 960 - margin2.left - margin2.right,
    height2 = 600 - margin2.top - margin2.bottom;

const svg2 = d3.select("#chart2")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

const tooltip2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("Pokemon.csv").then(data => {
    data.forEach((d, i) => d.index = i);

    const typeCounts = d3.rollup(
        data,
        v => v.length,
        d => d['Type 1']
    );

    const formattedData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

    formattedData.sort((a, b) => d3.descending(a.count, b.count));

    console.log(formattedData);

    const x2 = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.count)])
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", `translate(0,${height2})`)
        .call(d3.axisBottom(x2))
        .selectAll("text")
        .attr("class", "axis-label");

    svg2.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", width2 / 2)
        .attr("y", height2 + margin2.bottom - 10)
        .text("Count");

    const y2 = d3.scaleBand()
        .range([0, height2])
        .domain(formattedData.map(d => d.type))
        .padding(.1);
    svg2.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y2))
        .selectAll("text")
        .attr("class", "axis-label");

    svg2.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -height2 / 2)
        .attr("y", -margin2.left + 60)
        .attr("transform", "rotate(-90)")
        .text("Pokemon Type 1");

    const drag = d3.drag()
        .on("start", function(event, d) {
            d3.select(this).raise().attr("stroke", "black");
        })
        .on("drag", function(event, d) {
            const yPosition = d3.pointer(event, this)[1] - margin2.top;
            d3.select(this).attr("y", yPosition);
        })
        .on("end", function(event, d) {
            const yPosition = d3.pointer(event, this)[1] - margin2.top;
            const newIndex = Math.max(0, Math.min(formattedData.length - 1, Math.floor(yPosition / y2.step())));
            formattedData.splice(d.index, 1);
            formattedData.splice(newIndex, 0, d);
            formattedData.forEach((d, i) => d.index = i);
            y2.domain(formattedData.map(d => d.type));
            svg2.selectAll("rect")
                .data(formattedData, d => d.index)
                .transition().duration(200)
                .attr("y", d => y2(d.type));
            svg2.select(".y-axis")
                .transition().duration(200)
                .call(d3.axisLeft(y2));
            d3.select(this).attr("stroke", null);
        });

    svg2.selectAll("myRect")
        .data(formattedData)
        .enter()
        .append("rect")
        .attr("x", x2(0))
        .attr("y", d => y2(d.type))
        .attr("width", d => x2(d.count))
        .attr("height", y2.bandwidth())
        .attr("class", "bar")
        .call(drag)
        .on("mouseover", function(event, d) {
            tooltip2.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip2.html(d.count)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(event, d) {
            tooltip2.transition()
                .duration(500)
                .style("opacity", 0);
        });
});


// export default function renderChart2() {
//   const margin2 = { top: 20, right: 30, bottom: 50, left: 120 },
//     width2 = 960 - margin2.left - margin2.right,
//     height2 = 600 - margin2.top - margin2.bottom;

//   const svg2 = d3.select("#chart2")
//     .attr("width", width2 + margin2.left + margin2.right)
//     .attr("height", height2 + margin2.top + margin2.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin2.left},${margin2.top})`);

//   const tooltip2 = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

//   d3.csv("Pokemon.csv").then(data => {
//     data.forEach((d, i) => d.index = i);

//     const typeCounts = d3.rollup(
//       data,
//       v => v.length,
//       d => d['Type 1']
//     );

//     const formattedData = Array.from(typeCounts, ([type, count]) => ({ type, count }));

//     formattedData.sort((a, b) => d3.descending(a.count, b.count));

//     const x2 = d3.scaleLinear()
//       .domain([0, d3.max(formattedData, d => d.count)])
//       .range([0, width2]);
//     svg2.append("g")
//       .attr("transform", `translate(0,${height2})`)
//       .call(d3.axisBottom(x2))
//       .selectAll("text")
//       .attr("class", "axis-label");

//     svg2.append("text")
//       .attr("class", "axis-label")
//       .attr("text-anchor", "end")
//       .attr("x", width2 / 2)
//       .attr("y", height2 + margin2.bottom - 10)
//       .text("Count");

//     const y2 = d3.scaleBand()
//       .range([0, height2])
//       .domain(formattedData.map(d => d.type))
//       .padding(.1);
//     svg2.append("g")
//       .attr("class", "y-axis")
//       .call(d3.axisLeft(y2))
//       .selectAll("text")
//       .attr("class", "axis-label");

//     svg2.append("text")
//       .attr("class", "axis-label")
//       .attr("text-anchor", "end")
//       .attr("x", -height2 / 2)
//       .attr("y", -margin2.left + 60)
//       .attr("transform", "rotate(-90)")
//       .text("Pokemon Type 1");

//     const drag = d3.drag()
//       .on("start", function(event, d) {
//         d3.select(this).raise().attr("stroke", "black");
//       })
//       .on("drag", function(event, d) {
//         const yPosition = d3.pointer(event, this)[1] - margin2.top;
//         d3.select(this).attr("y", yPosition);
//       })
//       .on("end", function(event, d) {
//         const yPosition = d3.pointer(event, this)[1] - margin2.top;
//         const newIndex = Math.max(0, Math.min(formattedData.length - 1, Math.floor(yPosition / y2.step())));
//         formattedData.splice(d.index, 1);
//         formattedData.splice(newIndex, 0, d);
//         formattedData.forEach((d, i) => d.index = i);
//         y2.domain(formattedData.map(d => d.type));
//         svg2.selectAll("rect")
//           .data(formattedData, d => d.index)
//           .transition().duration(200)
//           .attr("y", d => y2(d.type));
//         svg2.select(".y-axis")
//           .transition().duration(200)
//           .call(d3.axisLeft(y2));
//         d3.select(this).attr("stroke", null);
//       });

//     svg2.selectAll("myRect")
//       .data(formattedData)
//       .enter()
//       .append("rect")
//       .attr("x", x2(0))
//       .attr("y", d => y2(d.type))
//       .attr("width", d => x2(d.count))
//       .attr("height", y2.bandwidth())
//       .attr("class", "bar")
//       .call(drag)
//       .on("mouseover", function(event, d) {
//         tooltip2.transition()
//           .duration(200)
//           .style("opacity", 0.9);
//         tooltip2.html(d.count)
//           .style("left", (event.pageX) + "px")
//           .style("top", (event.pageY - 28) + "px");
//       })
//       .on("mouseout", function(event, d) {
//         tooltip2.transition()
//           .duration(500)
//           .style("opacity", 0);
//       });
//   });
// }
