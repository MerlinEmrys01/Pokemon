<<<<<<< Updated upstream
=======
// const margin3 = { top: 20, right: 30, bottom: 50, left: 120 },
//     width3 = 960 - margin3.left - margin3.right,
//     height3 = 600 - margin3.top - margin3.bottom;

// const svg3 = d3.select("#chart3")
//     .attr("width", width3 + margin3.left + margin3.right)
//     .attr("height", height3 + margin3.top + margin3.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin3.left},${margin3.top})`);

// const tooltip3 = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

// d3.csv("Pokemon.csv").then(data => {
//     // Group the data by Type 1 and calculate the average stats
//     const typeStats = data.reduce((acc, d) => {
//         const type = d["Type 1"];
//         if (!acc[type]) {
//             acc[type] = {
//                 count: 0,
//                 total: 0,
//                 avgTotal: 0,
//                 avgHP: 0,
//                 avgAttack: 0,
//                 avgDefense: 0,
//                 avgSpAtk: 0,
//                 avgSpDef: 0,
//                 avgSpeed: 0
//             };
//         }
//         acc[type].count++;
//         acc[type].total += +d.Total;
//         acc[type].avgHP += +d.HP;
//         acc[type].avgAttack += +d.Attack;
//         acc[type].avgDefense += +d.Defense;
//         acc[type].avgSpAtk += +d["Sp. Atk"];
//         acc[type].avgSpDef += +d["Sp. Def"];
//         acc[type].avgSpeed += +d.Speed;
//         return acc;
//     }, {});

//     // Calculate average stats
//     Object.keys(typeStats).forEach(type => {
//         const avg = typeStats[type];
//         avg.avgTotal = avg.total / avg.count;
//         avg.avgHP /= avg.count;
//         avg.avgAttack /= avg.count;
//         avg.avgDefense /= avg.count;
//         avg.avgSpAtk /= avg.count;
//         avg.avgSpDef /= avg.count;
//         avg.avgSpeed /= avg.count;
//     });

//     // Convert typeStats object to an array of objects
//     const typeStatsArray = Object.keys(typeStats).map(type => ({
//         type,
//         ...typeStats[type]
//     }));

//     // Sort the data by average total stats
//     typeStatsArray.sort((a, b) => d3.ascending(a.avgTotal, b.avgTotal));

//     // Define scales
//     const x3 = d3.scaleLinear()
//         .domain([0, d3.max(typeStatsArray, d => d.avgTotal)])
//         .range([0, width3]);

//     const y3 = d3.scaleBand()
//         .range([height3, 0])
//         .domain(typeStatsArray.map(d => d.type))
//         .padding(0.1);

//     // Draw bars
//     svg3.selectAll(".bar")
//         .data(typeStatsArray)
//         .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", 0)
//         .attr("y", d => y3(d.type))
//         .attr("width", d => x3(d.avgTotal))
//         .attr("height", y3.bandwidth())
//         .attr("fill", "steelblue")
//         .on("mouseover", function(event, d) {
//             tooltip3.transition()
//                 .duration(200)
//                 .style("opacity", 0.9);
//             tooltip3.html(`${d.type}<br>Avg Total: ${d.avgTotal.toFixed(2)}<br>Avg HP: ${d.avgHP.toFixed(2)}<br>Avg Attack: ${d.avgAttack.toFixed(2)}<br>Avg Defense: ${d.avgDefense.toFixed(2)}<br>Avg Sp. Atk: ${d.avgSpAtk.toFixed(2)}<br>Avg Sp. Def: ${d.avgSpDef.toFixed(2)}<br>Avg Speed: ${d.avgSpeed.toFixed(2)}`)
//                 .style("left", (event.pageX) + "px")
//                 .style("top", (event.pageY - 28) + "px");
//         })
//         .on("mouseout", function(event, d) {
//             tooltip3.transition()
//                 .duration(500)
//                 .style("opacity", 0);
//         });

//     // Draw axes
//     svg3.append("g")
//         .attr("class", "x-axis")
//         .attr("transform", `translate(0,${height3})`)
//         .call(d3.axisBottom(x3));

//     svg3.append("g")
//         .attr("class", "y-axis")
//         .call(d3.axisLeft(y3));
// });



>>>>>>> Stashed changes
const margin3 = { top: 20, right: 30, bottom: 50, left: 120 },
  width3 = 960 - margin3.left - margin3.right,
  height3 = 600 - margin3.top - margin3.bottom,
  radius = Math.min(width3, height3) / 2;

const svg3 = d3.select("#chart3")
  .attr("width", width3 + margin3.left + margin3.right)
  .attr("height", height3 + margin3.top + margin3.bottom)
  .append("g")
<<<<<<< Updated upstream
  .attr("transform", `translate(${(width3 + margin3.left + margin3.right) / 2}, ${(height3 + margin3.top + margin3.bottom) / 2})`);
=======
  .attr("transform", `translate(${margin3.left},${margin3.top})`);
>>>>>>> Stashed changes

const tooltip3 = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

<<<<<<< Updated upstream
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
    .text(d => `${d.data.type}`);

  arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("dy", "0.85em") // Positioning the percentage below the label
    .text(d => `${(d.data.count / total * 100).toFixed(2)}%`);
});
=======
// const margin3 = { top: 20, right: 30, bottom: 50, left: 120 },
//     width3 = 960 - margin3.left - margin3.right,
//     height3 = 600 - margin3.top - margin3.bottom;

// const svg3 = d3.select("#chart3")
//     .attr("width", width3 + margin3.left + margin3.right)
//     .attr("height", height3 + margin3.top + margin3.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin3.left},${margin3.top})`);

// const tooltip3 = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

d3.csv("Pokemon.csv").then(data => {
  const typeStats = data.reduce((acc, d) => {
    const type = d['Type 1'];
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        total: {
          HP: 0,
          Attack: 0,
          Defense: 0,
          "Sp. Atk": 0,
          "Sp. Def": 0,
          Speed: 0
        }
      };
    }
    acc[type].count++;
    acc[type].total.HP += +d.HP;
    acc[type].total.Attack += +d.Attack;
    acc[type].total.Defense += +d.Defense;
    acc[type].total["Sp. Atk"] += +d['Sp. Atk'];
    acc[type].total["Sp. Def"] += +d['Sp. Def'];
    acc[type].total.Speed += +d.Speed;
    return acc;
  }, {});

  const typeAverages = Object.entries(typeStats).map(([type, stats]) => ({
    type,
    avgTotal: (stats.total.HP + stats.total.Attack + stats.total.Defense + stats.total["Sp. Atk"] + stats.total["Sp. Def"] + stats.total.Speed) / stats.count,
    avgHP: stats.total.HP / stats.count,
    avgAttack: stats.total.Attack / stats.count,
    avgDefense: stats.total.Defense / stats.count,
    avgSpAtk: stats.total["Sp. Atk"] / stats.count,
    avgSpDef: stats.total["Sp. Def"] / stats.count,
    avgSpeed: stats.total.Speed / stats.count
}));


  typeAverages.sort((a, b) => d3.descending(a.avgTotal, b.avgTotal));

  const color = d3.scaleOrdinal()
    .domain(typeAverages.map(d => d.type))
    .range(d3.schemeCategory10);

  const x3 = d3.scaleLinear()
    .domain([0, d3.max(typeAverages, d => d.avgTotal)])
    .range([0, width3]);

  const y3 = d3.scaleBand()
    .domain(typeAverages.map(d => d.type))
    .range([0, height3])
    .padding(0.1);

  svg3.selectAll(".bar")
    .data(typeAverages)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => y3(d.type))
    .attr("width", d => x3(d.avgTotal))
    .attr("height", y3.bandwidth())
    .attr("fill", d => color(d.type))
    .on("mouseover", function(event, d) {
      tooltip3.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip3.html(`${d.type}<br>Avg Total: ${d.avgTotal.toFixed(2)}<br>Avg HP: ${d.avgHP.toFixed(2)}<br>Avg Attack: ${d.avgAttack.toFixed(2)}<br>Avg Defense: ${d.avgDefense.toFixed(2)}<br>Avg Sp. Atk: ${d.avgSpAtk.toFixed(2)}<br>Avg Sp. Def: ${d.avgSpDef.toFixed(2)}<br>Avg Speed: ${d.avgSpeed.toFixed(2)}`)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
      tooltip3.transition()
        .duration(500)
        .style("opacity", 0);
    });

  svg3.append("g")
    .attr("transform", `translate(0,${height3})`)
    .call(d3.axisBottom(x3))
    .selectAll("text")
    .attr("class", "axis-label");

  svg3.append("g")
    .call(d3.axisLeft(y3))
    .selectAll("text")
    .attr("class", "axis-label");

  svg3.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width3 / 2)
    .attr("y", height3 + margin3.bottom - 10)
    .text("Average Total");

  svg3.append("text")
    .attr("class", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", -height3 / 2)
    .attr("y", -margin3.left + 60)
    .attr("transform", "rotate(-90)")
    .text("Pokemon Type 1");
});

>>>>>>> Stashed changes
