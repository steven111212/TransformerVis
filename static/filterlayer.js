function filter_layer(filter_index,filter_data,filter_text){
    //console.log(filter_data);
    var length = filter_index.length
    var filter_index = JSON.stringify(filter_index); 
    var filter_data = JSON.stringify(filter_data); 
    var filter_text = JSON.stringify(filter_text); 
    var threshold = document.getElementById("mySlider").value
    $.ajax({
        type:"POST",
        url:"/temp3",
        data:{filter_index:filter_index ,filter_data:filter_data,filter_text:filter_text,threshold:threshold},
        success: function(data){
            var token_attention = data['token_attention']
            console.log(token_attention);
            var pos = data['pos']
            console.log(pos);
            pos.sort(function(b, a) {
                return a.large_value - b.large_value;
              });
            token.selectAll('g').remove()
            var subgroups = ['base_value','large_value']

            var groups = d3.map(pos,function(d){return(d.entity)}).keys()

            //console.log(groups);
            var pos_x = d3.scaleBand()
                    .domain(groups)
                    .range([0, width+200])
                    .padding([0.5])

            token.append('g')
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(pos_x).tickSize(0));

            var a = d3.max(pos,d=>d.base_value)
            var b = d3.max(pos,d=>d.large_value)
            
            var pos_y = d3.scaleLinear()
                    .domain([0, d3.max([a,b])])
                    .range([ height, 0 ]);
            token.append("g")
                .call(d3.axisLeft(pos_y));

            token.append("g")
            .append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("font-size", "15px")
            .attr("text-anchor", "middle")  
            .attr("transform", "rotate(-90)")
            .text("Number")
            
            token.append("g")
            .append("text")
            .attr("transform", "translate("+width/2+"," + 490 + ")")
            .attr("font-size", "15px")
            .attr("text-anchor", "middle")
            .text("Part of speech")
            
            var xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, pos_x.bandwidth()])
            .padding([0.05])

            var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#377eb8','#4daf4a'])

            token.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(pos)
            .enter()
            .append("g")
              .attr("transform", function(d) { return "translate(" + pos_x(d.entity) + ",0)"; })
            .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
              .attr("x", function(d) { return xSubgroup(d.key); })
              .attr("y", function(d) { return pos_y(d.value); })
              .attr("width", xSubgroup.bandwidth())
              .attr("height", function(d) { return height - pos_y(d.value); })
              .attr("fill", function(d) { return color(d.key); });
        
                

            var order = data['order']
            var key = data['key']
            var filter_Hsim = data['filter_hsim']
            var NewArray = new Array();
            var NewArray = key.split("L");
            var myGroups = Array.from(Array(12), (v,k) => k);

            var myGroups2 = Array.from(Array(24), (v,k) => k);

            var myGroups3 = Array.from(Array(16), (v,k) => k);

            chosenlayer.selectAll('g').remove()
            
            var filter_Lsim = data['filter_lsim']
           
           
            var keys = filter_Lsim.map(item =>Object.keys(item)[0])

            var nodes = filter_Lsim.map(function(node, index) {
                return {
                  key :Object.keys(node)[0],
                  value : node[Object.keys(node)[0]]
                  
                };
              });
           
             var a_x = d3.scaleBand()
              .range([ 0, width ])
              .domain(myGroups)
              .padding(0.01);
              chosenlayer.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(a_x))
            var a_y = d3.scaleBand()
                .range([ height, 0 ])
                .domain(myGroups2)
                .padding(0.01);
              chosenlayer.append("g")
                .call(d3.axisLeft(a_y));
              
            var myColor = d3.scaleLinear()
                .range(["white", "#69b3a2"])
                .domain([0,1])
            let myColor2 = d3.scaleLinear()
            .range(["white", "black"])
            .domain([0,1])
            chosenlayer.append('g')
                .selectAll()
                .data(nodes)
                .enter()
                .append('rect')
                  .attr('x',function(d){  var NewArray = new Array();
                                          var NewArray = d['key'].split("L");
                                          
                                          return a_x(+NewArray[0])
                  } )
                  .attr('y',function(d){  var NewArray = new Array();
                    var NewArray = d['key'].split("L");
                    
                    return a_y(+NewArray[1])
                  } )

                .attr("width", a_x.bandwidth() )
                .attr("height", a_y.bandwidth() )
                .style("fill", function(d) { return myColor(d.value)} )

        chosenlayer
        .append("text")
        .attr("transform", "translate("+width/2+"," + 0 + ")")
        .attr("font-size", "13px")
        .attr("text-anchor", "middle")
        .text("Selected instances")     

        chosenlayer
        .append("text")
        .attr("transform", "translate("+width/2+"," + 490 + ")")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Layer of bert-base")
        
        var layerG = chosenlayer.append('g')
       

        var brush_L = d3.brush()
                    .extent([[0, 0], [width, height]])
                    .on("end", layer_brushed);
        layerG.call(brush_L)

       

        ////////////////////////////////////

        chosenhead.selectAll('g').remove()

        let x = d3.scaleBand()
        .range([ 0, width ])
        .domain(order['base']['L'+NewArray[0]])
        .padding(0.01);
        chosenhead.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

        let y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(order['large']['L'+NewArray[1]])
        .padding(0.01);
        chosenhead.append("g")
        .call(d3.axisLeft(y));


        chosenhead.append("g")
        .append("text")
        .attr("transform", "translate("+width/2+"," + 490 + ")")
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .text("Head index of bert-base")

        chosenhead
        .append("text")
        .attr("transform", "translate("+width/2+"," + 0 + ")")
        .attr("font-size", "13px")
        .attr("text-anchor", "middle")
        .text("Selected instances")
        //console.log(filter_Hsim.length);
        const p_x = d3.scaleLinear()
        .range([ 0, x.bandwidth() ])
        .domain([0,1]);
        const p_y = d3.scaleLinear()
        .range([ y.bandwidth(),0])
        .domain([0,length])
        const histogram_1 = d3.histogram()
        .value(function(d) { return d.values; })   // I need to give the vector of value
        .domain([0,1])  // then the domain of the graphic
        .thresholds(p_x.ticks(5)); // then the numbers of bins
        const histogram_0 = d3.histogram()
        .value(function(d) {if( d.sentiment==0) return d.values; })   // I need to give the vector of value
        .domain([0,1])  // then the domain of the graphic
        .thresholds(p_x.ticks(5)); // then the numbers of bins
        //console.log(filter_Hsim);
        var node = filter_Hsim.map(function(node, index) {
            return {
                key :Object.keys(node)[0],
                value_0 : histogram_0(node[Object.keys(node)[0]]),
                value_1 : histogram_1(node[Object.keys(node)[0]]),
                values : node.head_values    
            };
            });
            console.log(node);

        nodes = chosenhead
        .selectAll()
        .data(node)
        .enter()
        .append('g')

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
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .attr("fill", function(d){return myColor2(d.values)})


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

                var headG = chosenhead.append('g')

                var brush_H = d3.brush()
                            .extent([[0, 0], [width, height]])
                            .on("end", head_brushed);
                headG.call(brush_H)

             
                
        function head_brushed(){
            var extent = d3.event.selection;
            selected_data = []
            
            nodes.classed("selected",function(d){var NewArray = new Array();var NewArray = d.key.split("H");
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
            console.log(new Set(base),new Set(large));
            var threshold = document.getElementById("mySlider").value
            $.ajax({
                type:"POST",
                url:"/temp5",
                data:{threshold:threshold,base_cluster:JSON.stringify(Array.from(new Set(base))),large_cluster:JSON.stringify(Array.from(new Set(large)))},
                success:function(data){
                var pos = data['pos']
                pos.sort(function(b, a) {
                    return a.large_value - b.large_value;
                  });
                d3.select('#token_attention').selectAll('svg').remove()
                token.selectAll('g').remove()
                console.log(pos);

                var subgroups = ['base_value','large_value']

                var groups = d3.map(pos,function(d){return(d.entity)}).keys()
    
                //console.log(groups);
                var pos_x = d3.scaleBand()
                        .domain(groups)
                        .range([0, width+200])
                        .padding([0.5])
    
                token.append('g')
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(pos_x).tickSize(0));
    
                var a = d3.max(pos,d=>d.base_value)
                var b = d3.max(pos,d=>d.large_value)
                
                var pos_y = d3.scaleLinear()
                        .domain([0, d3.max([a,b])])
                        .range([ height, 0 ]);
                token.append("g")
                    .call(d3.axisLeft(pos_y));
                
                var xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, pos_x.bandwidth()])
                .padding([0.05])
    
                var color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(['#377eb8','#4daf4a'])
    
                token.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(pos)
                .enter()
                .append("g")
                  .attr("transform", function(d) { return "translate(" + pos_x(d.entity) + ",0)"; })
                .selectAll("rect")
                .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
                .enter().append("rect")
                  .attr("x", function(d) { return xSubgroup(d.key); })
                  .attr("y", function(d) { return pos_y(d.value); })
                  .attr("width", xSubgroup.bandwidth())
                  .attr("height", function(d) { return height - pos_y(d.value); })
                  .attr("fill", function(d) { return color(d.key); });
            
                var head_attention_token = data['head_attention_token']

                for (i=0;i<head_attention_token.length;i++){
                    index = 0
                    d3.select('#token_attention')
                        .append('svg')
                            .attr("width", 800)
                            .attr("height", 40 )
                            .style("background", function(){if(data['color'][i]['sentiment']==0){return '#fff2ec'}
                                                        else{return '#f4fbf2'}})
                        .append('g')
                        .selectAll('text')
                                .data(head_attention_token[i])
                                .enter()
                                .append('text')
                                .attr("x",function(d,i){if(i%18==0){index =0}
                                index += BrowserText.getWidth(d.token,16,"Times New Roman")+3
                                return index - BrowserText.getWidth(d.token,16,"Times New Roman")-3 })
                                .attr("y",function(d,i){return (parseInt(i/18)+1)*15})
                                .attr('font-size', '0.75em')
                                .attr("fill",function(d){
                                    if (d.base_attention==1 & d.large_attention==0){return "blue" }
                                    else if (d.base_attention==0 & d.large_attention==1){return "green"}
                                    else if (d.base_attention==1 & d.large_attention==1){return "#ff7f00" }
                                    else{return '#b4b4b4'}
                                })
                         
                            .text(function(d){return d.token;})
                }


                }
            })
        
        }



        ////////////////////////////
        d3.select('#token_attention').selectAll('svg').remove()
        console.log(data['color']);
        for (i=0;i<token_attention.length;i++){
            index = 0
            let svg = d3.select('#token_attention')
                 .append('svg')
                    .attr("width", 800)
                    .attr("height", 40 )
                    .style("background", function(){if(data['color'][i]['sentiment']==0){return '#fff2ec'}
                                                    else{return '#f4fbf2'}})

                                
               
                    svg.selectAll('text')
                        .data(token_attention[i])
                        .enter()
                        .append('text')
                        .attr("x",function(d,i){if(i%18==0){index =0}
                        index += BrowserText.getWidth(d.token,16,"Times New Roman")+3
                        return index - BrowserText.getWidth(d.token,16,"Times New Roman")-3 })
                        .attr("y",function(d,i){return (parseInt(i/18)+1)*15})
                        .attr('font-size', '0.75em')
                        .attr("fill",function(d){
                                            if (d.base_attention==1 & d.large_attention==0){return "blue" }
                                            else if (d.base_attention==0 & d.large_attention==1){return "green"}
                                            else if (d.base_attention==1 & d.large_attention==1){return "#ff7f00" }
                                            else{return '#b4b4b4'}
                                        })  
                    .text(function(d){return d.token;})


                    if(data['color'][i]['sentiment']!=data['color'][i]['result_base']){svg.append('circle').attr("cx",720).attr("cy",20).attr("r",6).attr('fill','blue')}
                    if(data['color'][i]['sentiment']!=data['color'][i]['result_large']){svg.append('circle').attr("cx",735).attr("cy",20).attr("r",6).attr('fill','green')}
                 
             
                //     svg.append('circle').attr("cx",720).attr("cy",20)
                //     .attr("r",function(d){if(data['color'][i]['sentiment']!=data['color'][i]['result_base'] || data['color'][i]['sentiment']!=data['color'][i]['result_large'] ){return 6}
                //     else {return 0 }

                //     }).attr("fill",function(d){if(data['color'][i]['sentiment']!=data['color'][i]['result_base']&& data['color'][i]['sentiment']!=data['color'][i]['result_large']  ){return "black"}
                //     else if(data['color'][i]['sentiment']!=data['color'][i]['result_large']){return "green"}
                //     else{return "blue"}
                // })


                
                  

                   
                    
        }

        //////////////////////////////////////////////////////////////
        // token_attention_plot.selectAll('g').remove()
        // index = 0  
        //     token_attention_plot.append('g')
        //                 .selectAll('text')
        //                 .data(token_attention[0])
        //                 .enter()
        //                 .append('text')
        //                 .attr("x",function(d,i){if(i%10==0){index =0}
        //                 index += BrowserText.getWidth(d.token,16,"Times New Roman")
        //                 return index - BrowserText.getWidth(d.token,16,"Times New Roman") })
        //                 .attr("y",function(d,i){return (parseInt(i/10)+1)*15+20})
        //                 .attr('font-size', '0.75em')
        //                 .attr("fill",function(d){
        //                                     if (d.base_attention==1 & d.large_attention==0){return "#2171b5" }
        //                                     else if (d.base_attention==0 & d.large_attention==1){return "#41ab5d"}
        //                                     else if (d.base_attention==1 & d.large_attention==1){return "#6a51a3" }
        //                                     else{return 'black'}
        //                                 })
                 
        //             .text(function(d){return d.token;})
        }
        })
}

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

function layer_brushed(){
    var extent = d3.event.selection;
    let x_bandwidth = width/12
    let y_bandwidth = height/24
    let base_minlayer = Math.floor(extent[0][0]/x_bandwidth-0.0000000001)
    let base_maxlayer = Math.floor(extent[1][0]/x_bandwidth-0.0000000001)
    let large_minlayer = 23-Math.floor(extent[1][1]/y_bandwidth)
    let large_maxlayer = 23-Math.floor(extent[0][1]/y_bandwidth)
    var threshold = document.getElementById("mySlider").value
    console.log(base_maxlayer,base_minlayer,large_maxlayer,large_minlayer);
$.ajax({
    type:"POST",
    url:"/temp4",
    data:{base_minlayer:base_minlayer,base_maxlayer:base_maxlayer,large_minlayer:large_minlayer,large_maxlayer:large_maxlayer,threshold:threshold},
    success:function(data){

    d3.select('#token_attention').selectAll('svg').remove()

    var pos = data['pos']
    pos.sort(function(b, a) {
        return a.large_value - b.large_value;
      });
    token.selectAll('g').remove()
    var subgroups = ['base_value','large_value']

    var groups = d3.map(pos,function(d){return(d.entity)}).keys()

    //console.log(groups);
    var pos_x = d3.scaleBand()
            .domain(groups)
            .range([0, width+200])
            .padding([0.5])

    token.append('g')
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(pos_x).tickSize(0));

    var a = d3.max(pos,d=>d.base_value)
    var b = d3.max(pos,d=>d.large_value)
    
    var pos_y = d3.scaleLinear()
            .domain([0, d3.max([a,b])])
            .range([ height, 0 ]);
    token.append("g")
        .call(d3.axisLeft(pos_y));
    
    var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, pos_x.bandwidth()])
    .padding([0.05])

    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#377eb8','#4daf4a'])

    token.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(pos)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + pos_x(d.entity) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return pos_y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - pos_y(d.value); })
      .attr("fill", function(d) { return color(d.key); });


console.log(pos);
    var layer_attention_token = data['layer_attention_token']
        for (i=0;i<layer_attention_token.length;i++){
            index = 0
            d3.select('#token_attention')
                .append('svg')
                    .attr("width", 800)
                    .attr("height", 40 )
                    .style("background", function(){if(data['color'][i]['sentiment']==0){return '#fff2ec'}
                                                    else{return '#f4fbf2'}})
                .append('g')
                .selectAll('text')
                        .data(layer_attention_token[i])
                        .enter()
                        .append('text')
                        .attr("x",function(d,i){if(i%18==0){index =0}
                        index += BrowserText.getWidth(d.token,16,"Times New Roman")+3
                        return index - BrowserText.getWidth(d.token,16,"Times New Roman")-3 })
                        .attr("y",function(d,i){return (parseInt(i/18)+1)*15})
                        .attr('font-size', '0.75em')
                        .attr("fill",function(d){
                            if (d.base_attention==1 & d.large_attention==0){return "blue" }
                            else if (d.base_attention==0 & d.large_attention==1){return "green"}
                            else if (d.base_attention==1 & d.large_attention==1){return "#ff7f00" }
                            else{return '#b4b4b4'}
                        })
                 
                    .text(function(d){return d.token;})
        }

    }
})
}

