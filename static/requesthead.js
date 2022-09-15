function bar_request(key,order){
    key = key

    $.ajax({
        type:"POST",
        url:"/temp",
        data:{key:key},

        success: function(data){
            var NewArray = new Array();
            var NewArray = key.split("L");
            let myColor = d3.scaleLinear()
            .range(["white", "black"])
            .domain([0,1])
            headsimilarity.selectAll("g").remove()
            selfbase.selectAll('g').remove()
            selflarge.selectAll('g').remove()

            console.log(data['selfbase']);
            console.log(data['selflarge']);

        d3.select("#layercombination").selectAll('text').remove()  
        d3.select("#layercombination").selectAll('svg').remove()  

        let layercombinatoin =  d3.select("#layercombination").append('svg').attr('width',400).attr('height',20)


        layercombinatoin
         .append('text')
         .attr("transform", "translate(30,15)")
         .attr("font-size", "15px")
         .text('BERT-base layer: '+data['baselayer'])

        layercombinatoin
         .append('text')
         .attr("transform", "translate(180,15)")
         .attr("font-size", "15px")
         .text('BERT-large layer: '+data['largelayer'])





            let selfbase_x = d3.scaleBand().range([ 0,width ]).domain(order['base']['L'+NewArray[0]]).padding(0.01);
            selfbase.append('g').attr("transform", "translate(0," + height + ")").call(d3.axisBottom(selfbase_x))
            let selfbase_y = d3.scaleBand().range([ height, 0 ]).domain(order['base']['L'+NewArray[0]]).padding(0.01);
            selfbase.append("g").call(d3.axisLeft(selfbase_y));
            let selflarge_x = d3.scaleBand().range([0,width]).domain(order['large']['L'+NewArray[1]]).padding(0.01);
            selflarge.append('g').attr("transform", "translate(0," + height + ")").call(d3.axisBottom(selflarge_x))
            let selflarge_y = d3.scaleBand().range([ height, 0 ]).domain(order['large']['L'+NewArray[1]]).padding(0.01);
            selflarge.append("g").call(d3.axisLeft(selflarge_y));

           selfbase            
            .selectAll()
            .data(data['selfbase'])
            .enter()
            .append('g')
            .append('rect')    
              .attr('x',function(d){
                  var NewArray = new Array();
                    var NewArray = Object.keys(d)[0].split("H");
              return selfbase_x(+NewArray[0])
              } )
              .attr('y',function(d){  
                var NewArray = new Array();
              var NewArray = Object.keys(d)[0].split("H");
              return selfbase_y(+NewArray[1])
              } )
              .attr("width", selfbase_x.bandwidth() )
              .attr("height", selfbase_y.bandwidth() )
              .attr("fill", function(d){return myColor(d[Object.keys(d)[0]])})

              selflarge         
              .selectAll()
              .data(data['selflarge'])
              .enter()
              .append('g')
              .append('rect')    
                .attr('x',function(d){
                    var NewArray = new Array();
                      var NewArray = Object.keys(d)[0].split("H");
                return selflarge_x(+NewArray[0])
                } )
                .attr('y',function(d){  
                  var NewArray = new Array();
                var NewArray = Object.keys(d)[0].split("H");
                return selflarge_y(+NewArray[1])
                } )
                .attr("width", selflarge_x.bandwidth() )
                .attr("height", selflarge_y.bandwidth() )
                .attr("fill", function(d){return myColor(d[Object.keys(d)[0]])})


           

            let hist = data['hist']

           console.log(hist);
        
           
            let x = d3.scaleBand()
            .range([ 0, width ])
            .domain(order['base']['L'+NewArray[0]])
            .padding(0.01);
            headsimilarity.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            let y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(order['large']['L'+NewArray[1]])
            .padding(0.01);
            headsimilarity.append("g")
            .call(d3.axisLeft(y));

            headsimilarity.append("g")
            .append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("font-size", "15px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Head index of bert-large")
        
          headsimilarity.append("g")
          .append("text")
          .attr("transform", "translate("+width/2+"," + 490 + ")")
          .attr("font-size", "15px")
          .attr("text-anchor", "middle")
          .text("Head index of bert-base")

          headsimilarity
          .append("text")
          .attr("transform", "translate("+width/2+"," + 0 + ")")
          .attr("font-size", "13px")
          .attr("text-anchor", "middle")
          .text("All instances")
          

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
    var nodes = headsimilarity             
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

        }
        
    })
}

function scatter_request(head){
    var head = head
    console.log(head);

    $.ajax({
        type: "POST",
        url:"/temp2",
        data:{head:head},
        success: function(data){

            head_base = head.split("H")[0]
            head_large = head.split("H")[1]
          
            scatter_data = data['scatter']
            console.log(scatter_data);
            chosenscatter.selectAll('g').remove()
            d3.select('div#slider-range').selectAll('svg').remove()
            chosenscatter.selectAll('circle').remove()
            // chosenscatter.selectAll('rect').remove()
            // chosenscatter.selectAll('line').remove()

            scatter_positive  = []
            scatter_negative = []
            scatter_data.forEach(d => {if(d.sentiment==0){scatter_negative.push(d)}
            else{scatter_positive.push(d)}    
            });

            d3.select("#headcombination").selectAll('text').remove()  
            d3.select("#headcombination").selectAll('svg').remove()  
    
            let headcombinatoin =  d3.select("#headcombination").append('svg').attr('width',400).attr('height',20)
    
            headcombinatoin
             .append('text')
             .attr("transform", "translate(30,15)")
             .attr("font-size", "15px")
             .text('BERT-base head: '+head_base)
    
            headcombinatoin
             .append('text')
             .attr("transform", "translate(180,15)")
             .attr("font-size", "15px")
             .text('BERT-large head: '+head_large)

            const hypotenuse = Math.sqrt(width * width + height * height);
            const scales = {
                // used to scale airport bubbles
                airports: d3.scaleSqrt()
                  .range([4, 18]),
              
                // used to scale number of segments per line
                segments: d3.scaleLinear()
                  .domain([0, hypotenuse])
                  // .range([1, 10])
                  .range([1, 25])
              };


            x = d3.scaleLinear()
            .domain([d3.min(scatter_data,d=>d.logits_base), d3.max(scatter_data,d=>d.logits_base)])
            .range([ 0, width]);
           chosenscatter.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
          
            
              // Add Y axis
            y = d3.scaleLinear()
            .domain([d3.min(scatter_data,d=>d.logits_large), d3.max(scatter_data,d=>d.logits_large)])
            .range([ height, 0]);
          chosenscatter.append("g")
            .call(d3.axisLeft(y));


       chosenscatter.append("g")
            .append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("font-size", "15px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Confidence score of bert-large")
        
         chosenscatter.append("g")
          .append("text")
          .attr("transform", "translate("+width/2+"," + 490 + ")")
          .attr("font-size", "15px")
          .attr("text-anchor", "middle")
          .text("Confidence score of bert-base")

            console.log(scatter_data);
            
         

            scatter =  chosenscatter.selectAll('dot')
            .data(scatter_data)
            .enter()

            circles = scatter.append('circle')
            .attr("cx",function(d){return x(d['logits_base']);})
            .attr("cy",function(d){return y(d['logits_large']);})
            .attr("r",function(d){return d.Similarity*10+3})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
            .style('opacity',function(d){return Math.abs(d.difference)*5+0.1})
          
            .style('stroke',function(d){ if(d.sentiment !=d.base && d.sentiment !=d.large){return 'black'}
        else if(d.sentiment != d.large){return 'green'}
       else if(d.sentiment !=d.base){return 'blue'}})
       .style('stroke-width',5)
   
   
            var chosenscatterG = chosenscatter.append('g')


            var brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start", brushed)
            .on("brush", brushed)
            .on("end", endbrushed);

            chosenscatterG.call(brush)
            

            d3.select("#typeButton").on("change", changetype )

     
var sliderRange = d3
    .sliderBottom()
    .min(0)
    .max(1)
    .width(100)
    .tickFormat(d3.format('.2'))
    .ticks(5)
    .default([0, 1])
    .fill('#2196f3')
    .on('onchange', val => {
      console.log(val);
       data = scatter_data.filter(d=>d.Similarity > val[0] && d.Similarity<val[1])

                console.log(data);
                chosenscatter.selectAll('circle').remove()
                // chosenscatter.selectAll('rect').remove()
                // chosenscatter.selectAll('line').remove()
    
                scatter =  chosenscatter.selectAll('dot')
                .data(data)
                .enter()
    
                circles = scatter.append('circle')
                .attr("cx",function(d){return x(d['logits_base']);})
                .attr("cy",function(d){return y(d['logits_large']);})
                .attr("r",function(d){return d.Similarity*10+3})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
            .attr('opacity',function(d){return Math.abs(d.difference)*5+0.1})
            .style('stroke',function(d){ 
                if(d.sentiment != d.large){return 'green'}
            else if(d.sentiment !=d.base){return 'blue'}})
            .style('stroke-width',5)




                var chosenscatterG = chosenscatter.append('g')
                chosenscatterG.call(brush)
      

     
    });

  var gRange = d3
  .select('div#slider-range')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);                   

        }
    })
}


function changetype(){
    var radioValue = $("input[name='typeButton']:checked").val();
    console.log(radioValue);
    if(radioValue=="Origin"){

        chosenscatter.selectAll('circle').remove()
       
        scatter =  chosenscatter.selectAll('dot')
        .data(scatter_data)
        .enter()

        circles = scatter.append('circle')
        .attr("cx",function(d){return x(d['logits_base']);})
        .attr("cy",function(d){return y(d['logits_large']);})
        .attr("r",function(d){return d.Similarity*10+3})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
            .attr('opacity',function(d){return Math.abs(d.difference)*5+0.1})
            .style('stroke',function(d){ if(d.sentiment !=d.base && d.sentiment !=d.large){return 'black'}
            else if(d.sentiment != d.large){return 'green'}
           else if(d.sentiment !=d.base){return 'blue'}})
           .style('stroke-width',5)

      

        var brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start", brushed)
        .on("brush", brushed)
        .on("end", endbrushed);

        var chosenscatterG = chosenscatter.append('g')
        chosenscatterG.call(brush)
      

    }

    else if(radioValue == "Positive"){
        d3.select('div#slider-range').selectAll('svg').remove()
        chosenscatter.selectAll('circle').remove()
        // chosenscatter.selectAll('rect').remove()
        // chosenscatter.selectAll('line').remove()
        scatter =  chosenscatter.selectAll('dot')
        .data(scatter_positive)
        .enter()

        circles = scatter.append('circle')
        .attr("cx",function(d){return x(d['logits_base']);})
        .attr("cy",function(d){return y(d['logits_large']);})
        .attr("r",function(d){return d.Similarity*10+3})
        .attr("fill",function(d){if (d.sentiment==0){return 'red'}
                            else{return "#69b3a2"}})
        .attr('opacity',function(d){return Math.abs(d.difference)*5+0.1})
        .style('stroke',function(d){ if(d.sentiment !=d.base && d.sentiment !=d.large){return 'black'}
        else if(d.sentiment != d.large){return 'green'}
       else if(d.sentiment !=d.base){return 'blue'}})
       .style('stroke-width',5)



        // scatter.append('rect')
        // .attr("x",function(d){return x(d['logits_large']);})
        // .attr("y", function(d){return y(d.Similarity)-5;})
        // .attr("width",10 )
        // .attr("height", 10 )
        // .attr("fill",function(d){if (d.sentiment !=d.base){return 'black'}
        // else if (d.sentiment==0){return 'red'}
        //                     else{return "#69b3a2"}})

        // scatter.append('line')
        // .attr('x1',function(d){return x(d['logits_base'])})
        // .attr('y1',function(d){return y(d.Similarity)})
        // .attr('x2',function(d){return x(d['logits_large'])})
        // .attr('y2',function(d){return y(d.Similarity)})
        // .style('stroke', 'red').style('stroke-width', 3)
        // .attr('opacity',0.5)

        var brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start", brushed)
        .on("brush", brushed)
        .on("end", endbrushed);
        var chosenscatterG = chosenscatter.append('g')
        chosenscatterG.call(brush)

        var sliderRange = d3
    .sliderBottom()
    .min(0)
    .max(1)
    .width(100)
    .tickFormat(d3.format('.2'))
    .ticks(5)
    .default([0, 1])
    .fill('#2196f3')
    .on('onchange', val => {
      console.log(val);
       data = scatter_positive.filter(d=>d.Similarity > val[0] && d.Similarity<val[1])

                console.log(data);
                chosenscatter.selectAll('circle').remove()
                // chosenscatter.selectAll('rect').remove()
                // chosenscatter.selectAll('line').remove()
    
                scatter =  chosenscatter.selectAll('dot')
                .data(data)
                .enter()
    
                circles = scatter.append('circle')
                .attr("cx",function(d){return x(d['logits_base']);})
                .attr("cy",function(d){return y(d['logits_large']);})
                .attr("r",function(d){return d.Similarity*10+3})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
            .attr('opacity',function(d){return Math.abs(d.difference)*5+0.1})
            .style('stroke',function(d){ if(d.sentiment !=d.base && d.sentiment !=d.large){return 'black'}
            else if(d.sentiment != d.large){return 'green'}
           else if(d.sentiment !=d.base){return 'blue'}})
           .style('stroke-width',5)



                var chosenscatterG = chosenscatter.append('g')
                chosenscatterG.call(brush)
      

     
    });

  
  var gRange = d3
  .select('div#slider-range')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,30)');

  gRange.call(sliderRange);                   




       

    }
    else if(radioValue == "Negative"){
        d3.select('div#slider-range').selectAll('svg').remove()
        chosenscatter.selectAll('circle').remove()
        // chosenscatter.selectAll('rect').remove()
        // chosenscatter.selectAll('line').remove()
        scatter =  chosenscatter.selectAll('dot')
        .data(scatter_negative)
        .enter()

        circles = scatter.append('circle')
        .attr("cx",function(d){return x(d['logits_base']);})
        .attr("cy",function(d){return y(d['logits_large']);})
        .attr("r",function(d){return d.Similarity*10+3})
            .attr("fill",function(d){ if (d.sentiment==0){return 'red'}
                                else{return "#69b3a2"}})
            .attr('opacity',function(d){return Math.abs(d.difference)*5+0.1})
            .style('stroke',function(d){ if(d.sentiment !=d.base && d.sentiment !=d.large){return 'black'}
            else if(d.sentiment != d.large){return 'green'}
           else if(d.sentiment !=d.base){return 'blue'}})
           .style('stroke-width',5)
    


        // scatter.append('rect')
        // .attr("x",function(d){return x(d['logits_large']);})
        // .attr("y", function(d){return y(d.Similarity)-5;})
        // .attr("width",10 )
        // .attr("height", 10 )
        // .attr("fill",function(d){if (d.sentiment !=d.base){return 'black'}
        // else if (d.sentiment==0){return 'red'}
        //                     else{return "#69b3a2"}})

        // scatter.append('line')
        // .attr('x1',function(d){return x(d['logits_base'])})
        // .attr('y1',function(d){return y(d.Similarity)})
        // .attr('x2',function(d){return x(d['logits_large'])})
        // .attr('y2',function(d){return y(d.Similarity)})
        // .style('stroke', 'red').style('stroke-width', 3)
        // .attr('opacity',0.5)

        var brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("start", brushed)
        .on("brush", brushed)
        .on("end", endbrushed);

        var chosenscatterG = chosenscatter.append('g')
        chosenscatterG.call(brush)

                
                            

        var sliderRange = d3
        .sliderBottom()
        .min(0)
        .max(1)
        .width(100)
        .tickFormat(d3.format('.2'))
        .ticks(5)
        .default([0, 1])
        .fill('#2196f3')
        .on('onchange', val => {
          console.log(val);
           data = scatter_negative.filter(d=>d.Similarity > val[0] && d.Similarity<val[1])
    
                    console.log(data);
                    chosenscatter.selectAll('circle').remove()
                    // chosenscatter.selectAll('rect').remove()
                    // chosenscatter.selectAll('line').remove()
        
                    scatter =  chosenscatter.selectAll('dot')
                    .data(data)
                    .enter()
        
                    circles = scatter.append('circle')
                    .attr("cx",function(d){return x(d['logits_base']);})
                    .attr("cy",function(d){return y(d['logits_large']);})
                    .attr("r",function(d){return d.Similarity*10+3})
                .attr("fill",function(d){
                 if (d.sentiment==0){return 'red'}
                                    else{return "#69b3a2"}})
                .attr('opacity',function(d){return Math.abs(d.difference)*5+0.1})
                .style('stroke',function(d){ if(d.sentiment !=d.base && d.sentiment !=d.large){return 'black'}
                else if(d.sentiment != d.large){return 'green'}
               else if(d.sentiment !=d.base){return 'blue'}})
               .style('stroke-width',5)
    
    
    
                    var chosenscatterG = chosenscatter.append('g')
                    chosenscatterG.call(brush)
          
    
          
        });
    
      
      var gRange = d3
      .select('div#slider-range')
      .append('svg')
      .attr('width', 500)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)');
    
      gRange.call(sliderRange);           

    }


   
}

function brushed(){
    var extent = d3.event.selection;
    selected_index = [];
    selected_data = []
    selected_text = []

    circles.classed("selected",function(d){
        selected =  x(d['logits_base']) >= extent[0][0] && 
        x(d['logits_base']) <= extent[1][0] && 
        y(d['logits_large']) >= extent[0][1] && 
        y(d['logits_large']) <= extent[1][1];
        if (selected) {
        selected_index.push(d.index);
        selected_data.push(d)
        selected_text.push(d.Sentiment)
        
        }
        return selected
    })
}

function endbrushed(){
    console.log(selected_data);
    filter_layer(selected_index,selected_data,selected_text)
}

