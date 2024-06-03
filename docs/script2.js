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
        .padding(0.1);
        
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
    
            // Update the position of the corresponding icon
            const icon = svg2.selectAll(".icon")
                .filter(function(e) {
                    return e.index === d.index;
                });
            icon.raise() // Bring the icon to the front
                .attr("x", x2(d.count) - 20) // Adjust the position of the icon horizontally
                .attr("y", yPosition - 20); // Adjust the position of the icon vertically
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
    
            // Update the position of all icons after dragging ends and ensure they are on top of the bars
            svg2.selectAll(".icon")
                .attr("x", iconD => x2(iconD.count) - 20) // Adjust the position of the icon horizontally
                .attr("y", iconD => {
                    const barIndex = formattedData.findIndex(barD => barD.index === iconD.index);
                    return y2(formattedData[barIndex].type) - 20; // Adjust the position of the icon vertically
                })
                .raise(); // Ensure the icon is on top
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
        .attr("fill", (d, i) => {
            // Example: Assigning different colors based on index
    svg2.selectAll(".axis-label")
        .style("fill", "white");
            
const colors = [
    "#05A8D9", "#9FA19F","#3FA129", "#91A119","#EF4179",  "#E62829", "#FAC000",   "#AFA981",  "#915121", "#704170", "#5060E1",     "#624D4E", "#9141CB"   , "#B16232","#60A1B8","#3DCEF3",   "#EF70EF",   "#81B9EF"
                ];
            return colors[i % colors.length];
        })
        .attr("rx", 5) // Adjust the corner radius for the x-axis
        .attr("ry", 5) 
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

        svg2.selectAll(".icon")
        .data(formattedData)
        .enter()
        .append("image")
        .attr("xlink:href", d => `${d.type}.png`) // Assuming the icons are named the same as the bars
        .attr("x", d => x2(d.count) - 20) // Adjusted position to place the icon near the end of the bar
        .attr("y", d => y2(d.type)) // Position the icon at the top of the bar
        .attr("width", 40)
        .attr("height", 40)
        .attr("class", "icon");  // Adjust the height of the icon
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
