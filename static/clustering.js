///////////////cluster
function hierarch(data,keys,plot,type){
    plot.selectAll("g").remove()
    plot.selectAll("path").remove()
    var cluster = d3.cluster()
    .size([height, width - 100]);  // 100 is the margin I will have on the right side

    // Give the data to this cluster layout:
    var root = d3.hierarchy(data[keys][type], function(d) {
    return d.children;
    });
    cluster(root);
    //console.log( root.descendants());

    plot.selectAll('path')
    .data( root.descendants().slice(1) )
    .enter()
    .append('path')
    .attr("d", function(d) {
        return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 50) + "," + d.x
                + " " + (d.parent.y + 150) + "," + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d.parent.y + "," + d.parent.x;
            })
    .style("fill", 'none')
    .attr("stroke", '#ccc')


    plot.selectAll("g")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")"
    })
    .append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2)



    plot.append('g')
        .selectAll('text')
        .data(root.descendants())
        .enter()
        .append('text')
        .attr('fill', 'black')
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")"
        })
        .text(function(d) {return d.data['name']})
    }