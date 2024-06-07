const margin2 = { top: 20, right: 30, bottom: 70, left: 160 },
    width2 = 960 - margin2.left - margin2.right,
    height2 = 800 - margin2.top - margin2.bottom;

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
            const boundedY = Math.max(0, Math.min(height2 - y2.bandwidth(), yPosition));
            const index = Math.floor(boundedY / y2.step());

            // Check if the dragged bar is swapping places with another bar
            if (index !== d.index) {
                const targetIndex = Math.max(0, Math.min(formattedData.length - 1, index));
                const draggedBar = formattedData[d.index];
                const targetBar = formattedData[targetIndex];

                formattedData[d.index] = targetBar;
                formattedData[targetIndex] = draggedBar;

                formattedData.forEach((d, i) => d.index = i);
                y2.domain(formattedData.map(d => d.type));

                svg2.selectAll("rect")
                    .data(formattedData, d => d.index)
                    .attr("y", d => y2(d.type));

                svg2.selectAll(".icon")
                    .data(formattedData, d => d.index)
                    .attr("y", d => y2(d.type) + y2.bandwidth() / 2 - 20);
            }

            d3.select(this).attr("y", y2(d.type));
        })
        .on("end", function(event, d) {
            y2.domain(formattedData.map(d => d.type));

            svg2.selectAll("rect")
                .data(formattedData, d => d.index)
                .transition().duration(200)
                .attr("y", d => y2(d.type));

            svg2.select(".y-axis")
                .transition().duration(200)
                .call(d3.axisLeft(y2));

            svg2.selectAll(".icon")
                .attr("x", d => x2(d.count) - 20)
                .attr("y", d => y2(d.type) + y2.bandwidth() / 2 - 20)
                .raise(); // Ensure the icon is on top

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
        .attr("fill", d => colorMap[d.type] || "#888888") // Default color if type not found in colorMap
        .attr("rx", 12) // Adjust the corner radius for the x-axis
        .attr("ry", 12) // Adjust the corner radius for the y-axis
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
        .attr("y", d => y2(d.type) + y2.bandwidth() / 2 - 20) // Position the icon in the middle of the bar
        .attr("width", 40)
        .attr("height", 40)
        .attr("class", "icon");

    svg2.selectAll(".axis-label")
        .style("fill", "white");
});