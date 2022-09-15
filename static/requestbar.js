var BrowserText = (function () {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    
    /**
     * Measures the rendered width of arbitrary text given the font size and font face
     * @param {string} text The text to measure
     * @param {number} fontSize The font size in pixels
     * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
     * @returns {number} The width of the text
     **/
    function getWidth(text, fontSize, fontFace) {
        context.font = fontSize + 'px ' + fontFace;
        return context.measureText(text).width;
    }
    
    return {
        getWidth: getWidth
    };
    })();
function bar_request(key,order){
    console.log('click');
    key = key
    console.log(key);

    $.ajax({
        type: "POST",
        url:"/temp",
        data:{key:key},
        success: function(data,textStatus,jqXHR){
            pratice_plot.selectAll("g").remove()
            head_brush_plot.selectAll("g").remove()
            head_brush_plot.selectAll("rect").remove()
            console.log(data['hist']);
            let hist = data['hist']
            
            var NewArray = new Array();
            var NewArray = key.split("L");
            // scatter_plot.selectAll('text').remove();
            // scatter_plot.append('text')
            // .attr('x',10).attr('y',20)
            // .attr('id','layer')
            // .style('fill', 'steelblue')
            // .style('font-size', '24px')
            // .style('font-weight', 'bold')
            // .attr("dy", "0em")
            // .text('Base Layer: '+NewArray[0] +'Large Layer :'+NewArray[1])
            let myColor = d3.scaleLinear()
                .range(["white", "black"])
                .domain([0,1])


            let x = d3.scaleBand()
                .range([ 0, width ])
                .domain(order['base']['L'+NewArray[0]])
                .padding(0.01);
                pratice_plot.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

                head_brush_plot.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

                // Build X scales and axis:
                let y = d3.scaleBand()
                .range([ height, 0 ])
                .domain(order['large']['L'+NewArray[1]])
                .padding(0.01);
                pratice_plot.append("g")
                .call(d3.axisLeft(y));

                head_brush_plot.append("g")
                .call(d3.axisLeft(y));

            const p_x = d3.scaleLinear()
                .range([ 0, x.bandwidth() ])
                .domain([0,1]);
            const p_y = d3.scaleLinear()
                .range([ y.bandwidth(),0])
                .domain([0,500])


            const histogram_1 = d3.histogram()
                    .value(function(d) { return d.values; })   // I need to give the vector of value
                    .domain([0,1])  // then the domain of the graphic
                    .thresholds(p_x.ticks(5)); // then the numbers of bins

           
            const histogram_0 = d3.histogram()
            .value(function(d) {if( d.sentiment==0) return d.values; })   // I need to give the vector of value
            .domain([0,1])  // then the domain of the graphic
            .thresholds(p_x.ticks(5)); // then the numbers of bins
            
            var node = hist.map(function(node, index) {
                return {
                    key :Object.keys(node)[0],
                    value_0 : histogram_0(node[Object.keys(node)[0]]),
                    value_1 : histogram_1(node[Object.keys(node)[0]]),
                    values : node.head_values
                   
                    
                };
                });
                var nodes_brush = head_brush_plot       
                    .selectAll()
                    .data(node)
                    .enter()
                    .append('g')
                    .on('click',function(d){scatter_request(d.key)})//show_head(d)



                nodes_brush
                    .append('rect')    
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                            var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                        var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("width", x.bandwidth() )
                      .attr("height", y.bandwidth() )
                      .attr("fill", function(d){return myColor(d.values)})


            var hist_brush = head_brush_plot.append('g') ;

            var brush = d3.brush()
            .extent([[0, 0], [width, height]])
                .on("end", bar_brushed);
            hist_brush.call(brush)


            
            var nodes = pratice_plot             
                    .selectAll()
                    .data(node)
                    .enter()
                    .append('g')
                    .on('click',function(d){scatter_request(d.key)})//show_head(d)
            
     
            
        
             nodes
                    .append('rect')    
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                            var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                        var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("width", x.bandwidth() )
                      .attr("height", y.bandwidth() )
                      .attr("fill", function(d){return myColor(d.values)})

                
                      nodes.append('rect')
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                          var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                      var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("transform", function(d) { return "translate(" + 0 + "," + p_y(d['value_1'][0].length) + ")"; })
                      .attr("width", function(d) { return p_x(d['value_1'][0].x1) - p_x(d['value_1'][0].x0) -1 ; })
                      .attr("height", function(d) { 
                          return  y.bandwidth() - p_y(d['value_1'][0].length); })
                      .style("fill", "#69b3a2")

              nodes.append('rect')
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                          var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                      var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("transform", function(d) { return "translate(" + x.bandwidth()/5 + "," + p_y(d['value_1'][1].length) + ")"; })
                      .attr("width", function(d) { return p_x(d['value_1'][1].x1) - p_x(d['value_1'][1].x0) -1 ; })
                      .attr("height", function(d) { 
                          return  y.bandwidth() - p_y(d['value_1'][1].length); })
                      .style("fill", "#69b3a2")

              
              nodes.append('rect')
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                          var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                      var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("transform", function(d) { return "translate(" + x.bandwidth()/5*2 + "," + p_y(d['value_1'][2].length) + ")"; })
                      .attr("width", function(d) { return p_x(d['value_1'][2].x1) - p_x(d['value_1'][2].x0) -1 ; })
                      .attr("height", function(d) { 
                          return  y.bandwidth() - p_y(d['value_1'][2].length); })
                      .style("fill", "#69b3a2")

              
                              
              nodes.append('rect')
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                          var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                      var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("transform", function(d) { return "translate(" + x.bandwidth()/5*3 + "," + p_y(d['value_1'][3].length) + ")"; })
                      .attr("width", function(d) { return p_x(d['value_1'][3].x1) - p_x(d['value_1'][3].x0) -1 ; })
                      .attr("height", function(d) { 
                          return  y.bandwidth() - p_y(d['value_1'][3].length); })
                      .style("fill", "#69b3a2")

              
                               
              nodes.append('rect')
                      .attr('x',function(d){ 
                          var NewArray = new Array();
                          var NewArray = d.key.split("H");
                      return x(+NewArray[0])
                      } )
                      .attr('y',function(d){  
                      var NewArray = new Array();
                      var NewArray = d.key.split("H");
                      return y(+NewArray[1])
                      } )
                      .attr("transform", function(d) { return "translate(" + x.bandwidth()/5*4 + "," + p_y(d['value_1'][4].length) + ")"; })
                      .attr("width", function(d) { return p_x(d['value_1'][4].x1) - p_x(d['value_1'][4].x0) -1 ; })
                      .attr("height", function(d) { 
                          return  y.bandwidth() - p_y(d['value_1'][4].length); })
                      .style("fill", "#69b3a2")
//////////////////////////////////////////////////////////////////
                nodes.append('rect')
                        .attr('x',function(d){ 
                            var NewArray = new Array();
                            var NewArray = d.key.split("H");
                        return x(+NewArray[0])
                        } )
                        .attr('y',function(d){  
                        var NewArray = new Array();
                        var NewArray = d.key.split("H");
                        return y(+NewArray[1])
                        } )
                        .attr("transform", function(d) { return "translate(" + 0 + "," + p_y(d['value_0'][0].length) + ")"; })
                        .attr("width", function(d) { return p_x(d['value_0'][0].x1) - p_x(d['value_0'][0].x0) -1 ; })
                        .attr("height", function(d) { 
                            return  y.bandwidth() - p_y(d['value_0'][0].length); })
                        .style("fill", "red")

                nodes.append('rect')
                        .attr('x',function(d){ 
                            var NewArray = new Array();
                            var NewArray = d.key.split("H");
                        return x(+NewArray[0])
                        } )
                        .attr('y',function(d){  
                        var NewArray = new Array();
                        var NewArray = d.key.split("H");
                        return y(+NewArray[1])
                        } )
                        .attr("transform", function(d) { return "translate(" + x.bandwidth()/5 + "," + p_y(d['value_0'][1].length) + ")"; })
                        .attr("width", function(d) { return p_x(d['value_0'][1].x1) - p_x(d['value_0'][1].x0) -1 ; })
                        .attr("height", function(d) { 
                            return  y.bandwidth() - p_y(d['value_0'][1].length); })
                        .style("fill", "red")

                
                nodes.append('rect')
                        .attr('x',function(d){ 
                            var NewArray = new Array();
                            var NewArray = d.key.split("H");
                        return x(+NewArray[0])
                        } )
                        .attr('y',function(d){  
                        var NewArray = new Array();
                        var NewArray = d.key.split("H");
                        return y(+NewArray[1])
                        } )
                        .attr("transform", function(d) { return "translate(" + x.bandwidth()/5*2 + "," + p_y(d['value_0'][2].length) + ")"; })
                        .attr("width", function(d) { return p_x(d['value_0'][2].x1) - p_x(d['value_0'][2].x0) -1 ; })
                        .attr("height", function(d) { 
                            return  y.bandwidth() - p_y(d['value_0'][2].length); })
                        .style("fill", "red")

                
                                
                nodes.append('rect')
                        .attr('x',function(d){ 
                            var NewArray = new Array();
                            var NewArray = d.key.split("H");
                        return x(+NewArray[0])
                        } )
                        .attr('y',function(d){  
                        var NewArray = new Array();
                        var NewArray = d.key.split("H");
                        return y(+NewArray[1])
                        } )
                        .attr("transform", function(d) { return "translate(" + x.bandwidth()/5*3 + "," + p_y(d['value_0'][3].length) + ")"; })
                        .attr("width", function(d) { return p_x(d['value_0'][3].x1) - p_x(d['value_0'][3].x0) -1 ; })
                        .attr("height", function(d) { 
                            return  y.bandwidth() - p_y(d['value_0'][3].length); })
                        .style("fill", "red")

                
                                 
                nodes.append('rect')
                        .attr('x',function(d){ 
                            var NewArray = new Array();
                            var NewArray = d.key.split("H");
                        return x(+NewArray[0])
                        } )
                        .attr('y',function(d){  
                        var NewArray = new Array();
                        var NewArray = d.key.split("H");
                        return y(+NewArray[1])
                        } )
                        .attr("transform", function(d) { return "translate(" + x.bandwidth()/5*4 + "," + p_y(d['value_0'][4].length) + ")"; })
                        .attr("width", function(d) { return p_x(d['value_0'][4].x1) - p_x(d['value_0'][4].x0) -1 ; })
                        .attr("height", function(d) { 
                            return  y.bandwidth() - p_y(d['value_0'][4].length); })
                        .style("fill", "red")

                //////////////////////////////////
                     
    
        function bar_brushed(){
            var extent = d3.event.selection;
            selected_data = []

            nodes_brush.classed("selected",function(d){var NewArray = new Array();var NewArray = d.key.split("H");
            selected = x(+NewArray[0])  >= extent[0][0] &&   x(+NewArray[0]) <= extent[1][0] &&  y(+NewArray[1]) >= extent[0][1] && y(+NewArray[1]) <= extent[1][1];
            if(selected){
                selected_data.push(d)
            }     
            })
            console.log(selected_data);
            base = []
            large = []
            selected_data.forEach(function(d){var NewArray = new Array();var NewArray = d.key.split("H");
        base.push(+NewArray[0]);large.push(+NewArray[1])})
        var threshold = document.getElementById("mySlider").value
        $.ajax({
            type:"POST",
            url:"/temp6",
            data:{threshold:threshold,base_cluster:JSON.stringify(Array.from(new Set(base))),large_cluster:JSON.stringify(Array.from(new Set(large)))},
            dataType:"json",
            success: function(data,textStatus,jqXHR){
                console.log(data['cross_head_attention']);
              
            let attention = data['cross_head_attention']

            
            token_plot3.selectAll("rect").remove()
            token_plot3.selectAll("g").remove()
            token_plot3
                    .selectAll()
                    .data(attention)
                    .enter()
                    .append('rect')
                        .attr("width",width/10)
                        .attr("height",height/10)
                        .attr("x",function(d,i){return (i%10)*(width/10)})
                        .attr("y",function(d,i){return (parseInt(i/10)+1)*(height/10)})
                        .attr("fill",function(d){
                            if (d.base_attention==1 & d.large_attention==0){return "#2171b5" }
                            else if (d.base_attention==0 & d.large_attention==1){return "#41ab5d"}
                            else if (d.base_attention==1 & d.large_attention==1){return "#6a51a3" }
                            else{return 'white'}
                        })
                       
                    
            token_plot3.append('g')
                        .selectAll('text')
                        .data(attention)
                        .enter()
                        .append('text')
                        .attr("x",function(d,i){return (i%10)*(width/10)})
                        .attr("y",function(d,i){return (parseInt(i/10)+1)*(height/10)+(height/10)/2})
                        .attr('font-size', '0.75em')
                 
                    .text(function(d){return d.token;})


            }

        })
   
        }

      
            
        }
    })

}

function show_head(d){
    scatter_plot.selectAll('#head').remove();
    var NewArray = new Array();
    var NewArray = d.key.split("H");
    scatter_plot.append('text')
    .attr('id','head')
    .attr('x',10).attr('y',50)
    .style('fill', 'steelblue')
    .style('font-size', '24px')
    .style('font-weight', 'bold')
    .attr("dy", "0em")
    .text('Base Head: '+ NewArray[0]+'   Large Head :'+NewArray[1])

}

function scatter_request(head){
    console.log('click');
    var head = head
 
    $.ajax({
        type: "POST",
        url:"/temp2",
        data:{head:head},
        success: function(data,textStatus,jqXHR){
        scatter = data['scatter']
        var result
        console.log(scatter);
        scatter_plot.selectAll('g').remove()
        scatter_plot.selectAll('circle').remove()
        parallel_plot.selectAll('g').remove()
        //Range
    
        dimensions = Object.keys(scatter[0]).filter(function(d) { return d != "Sentiment" })

        console.log(dimensions);
        var line = d3.line(),
        //        axis = d3.svg.axis().orient("left"),
                foreground;

        parallel_x = d3.scalePoint()
        .range([0, width*2])
        .domain(dimensions);

        parallel_y = {}

            for (i in dimensions) {
                var name = dimensions[i]
                parallel_y[name] = d3.scaleLinear()
                .domain( d3.extent(scatter, function(d) { return d[name]; }) )
                .range([height, 0])

                parallel_y[name].brush = d3.brushY()
                .extent([[-5, parallel_y[name].range()[1]], [5, parallel_y[name].range()[0]]]) //刷子范围
                .on("brush", brush)
                .on("end",enbrushed)
            }

        foreground = parallel_plot.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(scatter)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function(d) { if (d.sentiment == 0){return "Negative"}
                                         else {return "Positive"; }});

        var g = parallel_plot.selectAll(".dimensions")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "trait")
            .attr("transform", function(d) { return "translate(" + parallel_x(d) + ")"; })

        
        g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(d3.axisLeft(parallel_y[d])); })
        .append("text")
        .attr("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) {return d; })
        .style("fill", "black");

        g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(parallel_y[d].brush); })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

        function path(d) {
            return line(dimensions.map(function(p) { return [parallel_x(p), parallel_y[p](d[p])]; }));
        }

        function brush() {
            actives = [];
            //filter brushed extents
            parallel_plot.selectAll(".brush")
                .filter(function(d) {
                    return d3.brushSelection(this);
                })
                .each(function(d) {
                    actives.push({
                        dimension: d,
                        extent: d3.brushSelection(this)
                    });
                });
    
            //set un-brushed foreground line disappear
            foreground.classed("fade", function(d,i) {
    
               
                return !actives.every(function(active) {
                    var dim = active.dimension;


                    return active.extent[0] <= parallel_y[dim](d[dim]) && parallel_y[dim](d[dim])  <= active.extent[1];
                });
            });
    
        }

        function enbrushed(){
            scatter_plot.selectAll("circle").remove()
            selected_data = []
            foreground.classed("fad", function(d) {
                //console.log(d);
              const selected = active=> active.extent[0] <= parallel_y[active.dimension](d[active.dimension]) && parallel_y[active.dimension](d[active.dimension])  <= active.extent[1];
                
             if (actives.every(selected)){
                 selected_data.push(d)
             }
            })
            console.log(selected_data);
            
            scatter_plot.selectAll('dot')
            .data(selected_data)
            .enter()
            .append('circle')
                .attr("cx",function(d){return x(d.Similarity);})
                .attr("cy",function(d){return y(d['logits_base']);})
                .attr("r",function(d){return 5})
                //.attr("r",function(d){return Math.sqrt(Math.abs(d.logits_base-d.logits_large)*200)})
                .attr("fill",function(d){if (d.sentiment !=d.base){return 'black'}
                else if (d.sentiment==0){return 'red'}
                                    else{return "#69b3a2"}})
                .on('click',function(d){attention_request(d.Sentiment);})

            scatter_plot.selectAll('dot')
            .data(selected_data)
            .enter()
            .append('circle')
                .attr("cx",function(d){return x(d.Similarity);})
                .attr("cy",function(d){return y2(d['logits_large']);})
                .attr("r",function(d){return Math.sqrt(Math.abs(d.logits_base-d.logits_large)*200)})
                .attr("fill",function(d){if(d.sentiment !=d.large){return 'black'}
                    else if (d.sentiment==0){return 'red'}
                                        else{return "#69b3a2"}})
                .on('click',function(d){attention_request(d.Sentiment);})
         }
         
         d3.select("#typeButton").on("change", changetype )


        x = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_large)])
        .range([ 0, width]);
        scatter_plot.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      
        
          // Add Y axis
        y = d3.scaleLinear()
        .domain([0, 1])
        .range([ height, 0]);
        scatter_plot.append("g")
        .call(d3.axisLeft(y));

        // y2 = d3.scaleLinear()
        // .domain([0.5, d3.max(scatter,d=>d.logits_large)])
        // .range([ height/2, height]);
        // scatter_plot.append("g")
        // .call(d3.axisLeft(y2));

        scatter =  scatter_plot.selectAll('dot')
        .data(scatter)
        .enter()
        scatter.append('circle')
        .attr("cx",function(d){return x(d['logits_base']);})
        .attr("cy",function(d){return y(d.Similarity);})
        .attr("r",function(d){return 5})
        .attr("fill",function(d){if (d.sentiment !=d.base){return 'black'}
        else if (d.sentiment==0){return 'red'}
                            else{return "#69b3a2"}})
        .on('click',function(d){attention_request(d.Sentiment);})

        scatter.append('rect')
                .attr("x",function(d){return x(d['logits_large']);})
                .attr("y", function(d){return y(d.Similarity);})
                .attr("width",10 )
                .attr("height", 10 )
                .attr("fill",function(d){if (d.sentiment !=d.base){return 'black'}
                else if (d.sentiment==0){return 'red'}
                                    else{return "#69b3a2"}})


        var line = d3.line()
        .x(function(d) {
            return d.x;
        })
        .y(function(d) {
            return d.y;
        });

        scatter.append('line')
                .attr('x1',function(d){return x(d['logits_base'])})
                .attr('y1',function(d){return y(d.Similarity)})
                .attr('x2',function(d){return x(d['logits_large'])})
                .attr('y2',function(d){return y(d.Similarity)})
                .style('stroke', 'red').style('stroke-width', 1);


       
        
        // circles1
        //         .attr("cx",function(d){return x(d.Similarity);})
        //         .attr("cy",function(d){return y(d['logits_base']);})
        //         .attr("r",function(d){return 5})
        //         .attr("fill",function(d){if (d.sentiment !=d.base){return 'black'}
        //         else if (d.sentiment==0){return 'red'}
        //                             else{return "#69b3a2"}})
        //         .on('click',function(d){attention_request(d.Sentiment);})

        // scatter_plot.append('g')
        // .selectAll('dot')
        // .data(scatter)
        // .enter()
        // .append('circle')
        //     .attr("cx",function(d){return x(d.Similarity);})
        //     .attr("cy",function(d){return y2(d['logits_large']);})
        //     .attr("r",function(d){return 5})
        //     //.attr("r",function(d){return Math.sqrt(Math.abs(d.logits_base-d.logits_large)*200)})
        //     .attr("fill",function(d){if(d.sentiment !=d.large){return 'black'}
        //         else if (d.sentiment==0){return 'red'}
        //                             else{return "#69b3a2"}})
        //     .on('click',function(d){attention_request(d.Sentiment);})


     
                
       }
    })
   
}



function attention_request(text){
    console.log('click');
    console.log(document.getElementById("mySlider").value);
    var threshold = document.getElementById("mySlider").value
    var text = text
    console.log(text);
    $.ajax({
        type: "POST",
        url:"/temp3",
        data:{text:text,threshold:threshold},
        success: function(data,textStatus,jqXHR){
            console.log(data['attention']);
            let attention = data['attention']
            token_plot.selectAll("rect").remove()
            token_plot.selectAll("g").remove()
          

        
            var index = 0
            // token_plot
            //         .selectAll()
            //         .data(attention)
            //         .enter()
            //         .append('rect')
            //             .attr("width",function(d){return BrowserText.getWidth(d.token,16,"Times New Roman")})
            //             .attr("height",20)
            //             .attr("x",function(d,i){if(i%10==0){index =0}
            //             index += BrowserText.getWidth(d.token,16,"Times New Roman")
            //             return index - BrowserText.getWidth(d.token,16,"Times New Roman") })
            //             .attr("y",function(d,i){return (parseInt(i/10)+1)*20})
            //             .attr("fill",function(d){
            //                 if (d.base_attention==1 & d.large_attention==0){return "#2171b5" }
            //                 else if (d.base_attention==0 & d.large_attention==1){return "#41ab5d"}
            //                 else if (d.base_attention==1 & d.large_attention==1){return "#6a51a3" }
            //                 else{return 'white'}
            //             })
            //             .attr("stroke", "black")
            index = 0  
            token_plot.append('g')
                        .selectAll('text')
                        .data(attention)
                        .enter()
                        .append('text')
                        .attr("x",function(d,i){if(i%10==0){index =0}
                        index += BrowserText.getWidth(d.token,16,"Times New Roman")
                        return index - BrowserText.getWidth(d.token,16,"Times New Roman") })
                        .attr("y",function(d,i){return (parseInt(i/10)+1)*15+20})
                        .attr('font-size', '0.75em')
                 
                    .text(function(d){return d.token;})

                    

        }
    })
}
function difference(data,val){
   
    let result = data.filter(d=>Math.abs(d.logits_base-d.logits_large)>=val[0]);
    let result2 = result.filter(d=>Math.abs(d.logits_base-d.logits_large)<=val[1]);
    console.log(result2);
    scatter_plot.selectAll('circle').remove()


    scatter_plot
    .selectAll('dot')
    .data(result2)
    .enter()
    .append('circle')
        .attr("cx",function(d){return x(d.Similarity);})
        .attr("cy",function(d){return y(d['logits_base']);})
        .attr("r",function(d){return 5})
        //.attr("r",function(d){return Math.sqrt(Math.abs(d.logits_base-d.logits_large)*200)})
        .attr("fill",function(d){if(d.sentiment !=d.base){return 'black'}
            else if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
        .on('click',function(d){attention_request(d.Sentiment);})

    scatter_plot
    .selectAll('dot')
        .data(result2)
        .enter()
        .append('circle')
            .attr("cx",function(d){return x(d.Similarity);})
            .attr("cy",function(d){return y2(d['logits_large']);})
            .attr("r",function(d){return 5})
            //.attr("r",function(d){return Math.sqrt(Math.abs(d.logits_base-d.logits_large)*200)})
            .attr("fill",function(d){if(d.sentiment !=d.large){return 'black'}
                else if (d.sentiment==0){return 'red'}
                                    else{return "#69b3a2"}})
            .on('click',function(d){attention_request(d.Sentiment);})

}

function changetype() {
    console.log(0);
    var radioValue = $("input[name='typeButton']:checked").val();
    console.log(radioValue)
    if(radioValue=="Confusion_sentiment"){
        scatter_plot.selectAll('g').remove()
        

        let x_1 = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_base)])
        .range([ 0, width/2 ]);
        scatter_plot.append("g")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(d3.axisBottom(x_1));
          // Add Y axis
        let y_1 = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_large)])
        .range([ height/2, 0]);
        scatter_plot.append("g")
        .call(d3.axisLeft(y_1));

        let x_2 =  d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_base)])
         .range([ width/2, width ]);
         scatter_plot.append("g")
         .attr("transform", "translate(10," + height/2 + ")")
         .call(d3.axisBottom(x_2));

        let y_2 = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_large)])
        .range([ height, height/2]);
        scatter_plot.append("g")
        .call(d3.axisLeft(y_2));

        circles1
        .transition(d3.transition().duration(500))
            .attr("cx",function(d){if(d.large==1){return x_1(d['logits_base']);}
            else{return x_2(d['logits_base']);}})
            .attr("cy",function(d){if(d.base==1){return y_1(d['logits_large']);}
            else{return y_2(d['logits_large'])}})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
            else{return "#69b3a2"}})

         



    }
    else if(radioValue == "Similarity"){
        scatter_plot.selectAll('g').remove()
        
    let x = d3.scaleLinear()
    .domain([0, 1])
    .range([ 0, width ]);
    scatter_plot.append("g")
    .attr("transform", "translate(0," + height/2 + ")")
    .call(d3.axisBottom(x));
  
    
      // Add Y axis
    let y = d3.scaleLinear()
    .domain([0.5, d3.max(scatter,d=>d.logits_base)])
    .range([ height/2, 0]);
    scatter_plot.append("g")
    .call(d3.axisLeft(y));

    let y2 = d3.scaleLinear()
    .domain([0.5, d3.max(scatter,d=>d.logits_large)])
    .range([ height/2, height]);
    scatter_plot.append("g")
    .call(d3.axisLeft(y2));


    
   circles1.transition(d3.transition().duration(500))
                    .attr("cx",function(d){return x(d.Similarity);})
                    .attr("cy",function(d){return y(d['logits_base']);})
                    .attr("fill",function(d){if(d.sentiment !=d.base){return 'black'}
            if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
             

    scatter_plot.append('g')
    .selectAll('dot')
    .data(scatter)
    .enter()
    .append('circle')
        .attr("cx",function(d){return x(d.Similarity);})
        .attr("cy",function(d){return y2(d['logits_large']);})
        //.attr("r",function(d){return Math.sqrt(Math.abs(d.logits_base-d.logits_large)*200)})
        .attr("r",function(d){return 5})
        .attr("fill",function(d){if(d.sentiment !=d.large){return 'black'}
            if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
        .on('click',function(d){attention_request(d.Sentiment);})
        
        
    }
    else if(radioValue == "Confusion_true"){
        scatter_plot.selectAll('g').remove()
       
        let x_1 = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_base)])
        .range([ 0, width/2 ]);
        scatter_plot.append("g")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(d3.axisBottom(x_1));
          // Add Y axis
        let y_1 = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_large)])
        .range([ height/2, 0]);
        scatter_plot.append("g")
        .call(d3.axisLeft(y_1));

        let x_2 =  d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_base)])
         .range([ width/2, width ]);
         scatter_plot.append("g")
         .attr("transform", "translate(10," + height/2 + ")")
         .call(d3.axisBottom(x_2));

        let y_2 = d3.scaleLinear()
        .domain([0.5, d3.max(scatter,d=>d.logits_large)])
        .range([ height, height/2]);
        scatter_plot.append("g")
        .call(d3.axisLeft(y_2));

    circles1.transition(d3.transition().duration(500))
            .attr("cx",function(d){if(d.large==d.sentiment){return x_1(d['logits_base']);}
            else{return x_2(d['logits_base']);}})
            .attr("cy",function(d){if(d.base== d.sentiment){return y_1(d['logits_large']);}
            else{return y_2(d['logits_large'])}})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
            else{return "#69b3a2"}})

    


    }

    }