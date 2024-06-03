// tried to match file format with other provided code

// graphs the strongest Pokemons' total strength by Pokemon type
const margin1 = { top: 20, right: 30, bottom: 70, left: 120 }, // Increase bottom margin
    width1 = 960 - margin1.left - margin1.right,
    height1 = 800 - margin1.top - margin1.bottom; // Increase the total height

const svg1 = d3.select("#chart1")
    .attr("width", width1 + margin1.left + margin1.right)
    .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);


    const colorScale = d3.scaleOrdinal()
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
// Create an empty object to store icon paths
// const iconPaths = {};

// // Generate icon paths for each unique Type 1 variable
// data.forEach(d => {
//     const type1Variable = d['Type 1'];
//     iconPaths[type1Variable] = type1Variable + '.png';
// });



const tooltip1 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("strongest_pokemon.csv").then(data => {
    data.forEach((d, i) => d.index = i); 
    const iconPaths = {};

// Generate icon paths for each unique Type 1 variable
    data.forEach(d => {
    const type1Variable = d['Type 1'];
    iconPaths[type1Variable] = type1Variable + '.png';
});
    data.forEach(d => {
    d.iconPath = iconPaths[d['Type 1']] || 'default/icon.png'; // Use default icon path if not found
});

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
        .padding(0.1);
        svg1.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y1))
        .selectAll("text")
        .attr("class", "axis-label")
       

    svg1.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -height1 / 2)
        .attr("y", -margin1.left +15)
        .attr("transform", "rotate(-90)")
        .text("Pokemon Type 1")
    
        const drag = d3.drag()
        .on("start", function(event, d) {
            d3.select(this).raise().attr("stroke", "black");
        })
        .on("drag", function(event, d) {
            const yPosition = d3.pointer(event, this)[1] - margin1.top;
            const centerY = yPosition + y1.bandwidth() / 2;
            d3.select(this).attr("y", yPosition);
    
            // Update the position of the corresponding icon
            const bar = d3.select(this);
            const icon = svg1.selectAll(".icon")
                .filter(function(e) {
                    return e.index === d.index;
                });
            icon.raise() // Bring the icon to the front
                .attr("x", x1(d.Total) - 20) // Adjust the position of the icon horizontally
                .attr("y", centerY - 20); // Adjust the position of the icon vertically
        })
        .on("end", function(event, d) {
            const yPosition = d3.pointer(event, this)[1] - margin1.top;
            const newIndex = Math.max(0, Math.min(data.length - 1, Math.floor(yPosition / y1.step())));
            data.splice(d.index, 1);
            data.splice(newIndex, 0, d);
            data.forEach((d, i) => d.index = i);
            y1.domain(data.map(d => d['Type 1']));
            svg1.selectAll("rect")
                .data(data, d => d.index)
                .transition().duration(200)
                .attr("y", d => y1(d['Type 1']));
            svg1.select(".y-axis")
                .transition().duration(200)
                .call(d3.axisLeft(y1));
            d3.select(this).attr("stroke", null);
    
            // Update the position of all icons after dragging ends and ensure they are on top of the bars
            svg1.selectAll(".icon")
                .attr("y", iconD => {
                    const barIndex = data.findIndex(barD => barD.index === iconD.index);
                    return y1(data[barIndex]['Type 1']) - 20; // Adjust the position of the icon vertically
                })
                .raise(); // Ensure the icon is on top
        });
    

    


        const pokemonTypeColors = {
            "Grass": "#78C850",
            "Fire": "#F08030",
            "Water": "#6890F0",
            "Bug": "#A8B820",
            // Add more colors for other Pokémon types as needed
        };
// Use the color scale to fill the bars
svg1.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x1(0))
    .attr("y", d => y1(d['Type 1']))
    .attr("width", d => x1(d.Total))
    .attr("height", y1.bandwidth())
    .attr("class", "bar")
    .attr("fill", (d, i) => {
        const colors = [
            "#5060E1", "#EF4179", "#05A8D9", "#915121", "#9FA19F", "#60A1B8", "#AFA981", "#704170", "#E62829", "#EF70EF", "#624D4E", "#3FA129", "#B16232", "#FAC000", "#91A119", "#3DCEF3", "#81B9EF", "#9141CB"
        ];
        return colors[i % colors.length];
    })
    .attr("rx", 12) // Adjust the corner radius for the x-axis
    .attr("ry", 12) // Adjust the corner radius for the y-axis
    .call(drag)
    .on("mouseover", function(event, d) {
        tooltip1.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltip1.html(d.Total)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
        tooltip1.transition()
            .duration(500)
            .style("opacity", 0);
    });

    svg1.selectAll(".icon")
    .data(data)
    .enter()
    .append("image")
    .attr("xlink:href", d => d.iconPath)
    .attr("x", d => x1(d.Total) - 20)
    .attr("y", d => y1(d['Type 1']) + y1.bandwidth() / 2 - 20) // Position in the middle of the bar
    .attr("width", 40)
    .attr("height", 40)
    .attr("class", "icon");// Adjust the height of the icon
});

// export default function renderChart1() {
//   const margin1 = { top: 20, right: 30, bottom: 50, left: 120 },
//     width1 = 960 - margin1.left - margin1.right,
//     height1 = 600 - margin1.top - margin1.bottom;

//   const svg1 = d3.select("#chart1")
//     .attr("width", width1 + margin1.left + margin1.right)
//     .attr("height", height1 + margin1.top + margin1.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin1.left},${margin1.top})`);

//   const tooltip1 = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

//   d3.csv("strongest_pokemon.csv").then(data => {
//     data.forEach((d, i) => d.index = i);

//     const x1 = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.Total)])
//       .range([0, width1]);
//     svg1.append("g")
//       .attr("transform", `translate(0,${height1})`)
//       .call(d3.axisBottom(x1))
//       .selectAll("text")
//       .attr("class", "axis-label");

//     svg1.append("text")
//       .attr("class", "axis-label")
//       .attr("text-anchor", "end")
//       .attr("x", width1 / 2)
//       .attr("y", height1 + margin1.bottom - 10)
//       .text("Total Strengths");

//     const y1 = d3.scaleBand()
//       .range([0, height1])
//       .domain(data.map(d => d['Type 1']))
//       .padding(0.1);
//     svg1.append("g")
//       .attr("class", "y-axis")
//       .call(d3.axisLeft(y1))
//       .selectAll("text")
//       .attr("class", "axis-label");

//     svg1.append("text")
//       .attr("class", "axis-label")
//       .attr("text-anchor", "end")
//       .attr("x", -height1 / 2)
//       .attr("y", -margin1.left + 60)
//       .attr("transform", "rotate(-90)")
//       .text("Pokemon Type 1");

//     const drag = d3.drag()
//       .on("start", function(event, d) {
//         d3.select(this).raise().attr("stroke", "black");
//       })
//       .on("drag", function(event, d) {
//         const yPosition = d3.pointer(event, this)[1] - margin1.top;
//         d3.select(this).attr("y", yPosition);
//       })
//       .on("end", function(event, d) {
//         const yPosition = d3.pointer(event, this)[1] - margin1.top;
//         const newIndex = Math.max(0, Math.min(data.length - 1, Math.floor(yPosition / y1.step())));
//         data.splice(d.index, 1);
//         data.splice(newIndex, 0, d);
//         data.forEach((d, i) => d.index = i);
//         y1.domain(data.map(d => d['Type 1']));
//         svg1.selectAll("rect")
//           .data(data, d => d.index)
//           .transition().duration(200)
//           .attr("y", d => y1(d['Type 1']));
//         svg1.select(".y-axis")
//           .transition().duration(200)
//           .call(d3.axisLeft(y1));
//         d3.select(this).attr("stroke", null);
//       });

//     svg1.selectAll("myRect")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("x", x1(0))
//       .attr("y", d => y1(d['Type 1']))
//       .attr("width", d => x1(d.Total))
//       .attr("height", y1.bandwidth())
//       .attr("class", "bar")
//       .call(drag)
//       .on("mouseover", function(event, d) {
//         tooltip1.transition()
//           .duration(200)
//           .style("opacity", 0.9);
//         tooltip1.html(d.Total)
//           .style("left", (event.pageX) + "px")
//           .style("top", (event.pageY - 28) + "px");
//       })
//       .on("mouseout", function(event, d) {
//         tooltip1.transition()
//           .duration(500)
//           .style("opacity", 0);
//       });
//   });
// }
