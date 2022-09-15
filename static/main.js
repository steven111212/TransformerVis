
var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


var layersimilarity = d3.select('#layersimilarity')
.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,10)");

var headsimilarity = d3.select('#headsimilarity')
.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,10)");

var chosenscatter = d3.select('#chosenscatter')
.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,10)");

var chosenlayer = d3.select('#layersimilarity')
.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,10)");

var chosenhead = d3.select('#headsimilarity')
.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,10)");

var token = d3.select('#token')
.append('svg')
  .attr("width", width + margin.left + margin.right+200)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,10)");

var token_attention_legend = d3.select('#token_attentoin_legend')
.append('svg')
  .attr("width", 700)
  .attr("height", 120)

var scatter_label = d3.select('#scatterlabel')
.append('svg')
  .attr("width", 300)
  .attr("height", 120)

  var similarity_range = d3.select('#similarity_value_range')
  .append('svg')
    .attr("width", 100)
    .attr("height", 50)



var token_legend = d3.select('#token_legend')
.append('svg')
  .attr("width", 150)
  .attr("height", 120 )

var token_legend_Button = d3.select('#token_legend')
.append('select')

var allGroup = ["POS","NER"]

token_legend_Button // Add a button
  .selectAll('myOptions') // Next 4 lines add 6 options = 6 colors
 	.data(allGroup)
  .enter()
	.append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button


  var selfbase = d3.select('#modalbody')
.append('svg')
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom )
.append('g')
    .attr("transform","translate(60,15)");

  var selflarge = d3.select('#modalbody')
  .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom )
  .append('g')
      .attr("transform","translate(60,15)");



  selfbase
  .append("text")
  .attr("x", -(height / 2))
  .attr("y", -40)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("bert-base self")
  selflarge
  .append("text")
  .attr("x", -(height / 2))
  .attr("y", -40)
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("bert-large self")

  layersimilarity
  .append("text")
  .attr("transform", "translate("+width/2+"," + 0 + ")")
  .attr("font-size", "13px")
  .attr("text-anchor", "middle")
  .text("All instances")

  layersimilarity
    .append("text")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Layer of bert-large")

  layersimilarity
  .append("text")
  .attr("transform", "translate("+width/2+"," + 490 + ")")
  .attr("font-size", "15px")
  .attr("text-anchor", "middle")
  .text("Layer of bert-base")



token_attention_legend.append("text").attr("transform","translate(1,17)").text("Background").style("font-size", "20px").attr("alignment-baseline","middle")
token_attention_legend.append('rect').attr("x",1).attr('y',40).attr('width',15).attr('height',15).attr("fill",'#fccde5').attr('stroke','black')
token_attention_legend.append('rect').attr("x",1).attr('y',70).attr('width',15).attr('height',15).attr("fill",'#ccebc5').attr('stroke','black')
token_attention_legend.append("text").attr("transform","translate(20,47)").text(": Negative").style("font-size", "15px").attr("alignment-baseline","middle")
token_attention_legend.append("text").attr("transform","translate(20,77)").text(": Positive").style("font-size", "15px").attr("alignment-baseline","middle")

token_attention_legend.append("text").attr("transform","translate(180,17)").text("Font color").style("font-size", "20px").attr("alignment-baseline","middle")
token_attention_legend.append("text").attr("transform","translate(180,47)").text("Words: ").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill','blue')
token_attention_legend.append("text").attr("transform","translate(180,77)").text("Words: ").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill','green')
token_attention_legend.append("text").attr("transform","translate(180,107)").text("Words: ").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill','#ff7f00')

token_attention_legend.append("text").attr("transform","translate(230,47)").text("Attention words of bert-base").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill','blue')
token_attention_legend.append("text").attr("transform","translate(230,77)").text("Attention words of bert-large").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill','green')
token_attention_legend.append("text").attr("transform","translate(230,107)").text("Attention words of two models").style("font-size", "15px").attr("alignment-baseline","middle").attr('fill','#ff7f00')

token_attention_legend.append("text").attr("transform","translate(470,17)").text("Circle color").style("font-size", "20px").attr("alignment-baseline","middle")
token_attention_legend.append("circle").attr('cx',480 ).attr('cy',47 ).attr("r",6).attr('fill',"green")
token_attention_legend.append("circle").attr('cx',480 ).attr('cy',77 ).attr("r",6).attr('fill',"blue")

token_attention_legend.append("text").attr("transform","translate(490,47)").text(" : BERT-large predict wrong").style("font-size", "15px").attr("alignment-baseline","middle")
token_attention_legend.append("text").attr("transform","translate(490,77)").text(" : BERT-base predict wrong").style("font-size", "15px").attr("alignment-baseline","middle")


similarity_range.append("text").attr("transform","translate(5,40)").text("Similarity range").style("font-size", "13px").attr("alignment-baseline","middle")
scatter_label.append("text").attr("transform","translate(1,17)").text("Stroke").style("font-size", "20px").attr("alignment-baseline","middle")
scatter_label.append('circle').attr("cx",8).attr('cy',47).attr('r',6).attr("fill",'white').style('stroke','#1b9e77').style('stroke-width',3)
scatter_label.append('circle').attr("cx",8).attr('cy',77).attr('r',6).attr("fill",'white').style('stroke','blue').style('stroke-width',3)
scatter_label.append('circle').attr("cx",8).attr('cy',107).attr('r',6).attr("fill",'white').style('stroke','black').style('stroke-width',3)
scatter_label.append("text").attr("transform","translate(20,47)").text(": BERT-large predict wrong ").style("font-size", "15px").attr("alignment-baseline","middle")
scatter_label.append("text").attr("transform","translate(20,77)").text(": BERT-base predict wrong").style("font-size", "15px").attr("alignment-baseline","middle")
scatter_label.append("text").attr("transform","translate(20,107)").text(": Two models predict wrong").style("font-size", "15px").attr("alignment-baseline","middle")


token_legend.append("text").attr("transform","translate(1,17)").text("Legends").style("font-size", "20px").attr("alignment-baseline","middle")
token_legend.append('rect').attr("x",1).attr('y',40).attr('width',10).attr('height',15).style("fill","#1f78b4")
token_legend.append('rect').attr("x",1).attr('y',70).attr('width',10).attr('height',15).style("fill","#1b9e77")
token_legend.append("text").attr("transform","translate(16,47)").text(": BERT-base").style("font-size", "15px").attr("alignment-baseline","middle")
token_legend.append("text").attr("transform","translate(16,77)").text(": BERT-large").style("font-size", "15px").attr("alignment-baseline","middle")


var legend = d3.select('#legnend').append('svg')
legend.append('circle').attr("transform","translate(10,10)").attr('r',6).style("fill","#69b3a2")
legend.append('circle').attr("transform","translate(100,10)").attr('r',6).style("fill","red")
legend.append("text").attr("transform","translate(20,10)").text(": Positive").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("transform","translate(110,10)").text(": Negative").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("transform","translate(10,40)").text("Layer Similarity Value :").style("font-size", "15px").attr("alignment-baseline","middle")
legend.append("text").attr("transform","translate(10,70)").text("Head Similarity Value :").style("font-size", "15px").attr("alignment-baseline","middle")

var saturation = Array.from(Array(500), (v,k) => k);

var SaturationColor = d3.scaleLinear()
.range(["white", "#69b3a2"])
.domain([0,500])
var SaturationColor2 = d3.scaleLinear()
.range(["white", "black"])
.domain([0,500])
legend.selectAll("rect").data(saturation).enter().append('rect').attr("x",function(d){return d*0.5}).attr('y',50).attr('width',0.5).attr('height',10).attr("fill",function(d){return SaturationColor(d)})
legend.selectAll("rect2").data(saturation).enter().append('rect').attr("x",function(d){return d*0.5}).attr('y',80).attr('width',0.5).attr('height',10).attr("fill",function(d){return SaturationColor2(d)})


d3.select("#mySlider").on("change",function(d){console.log(document.getElementById("mySlider").value);})


// var token_attention_plot = d3.select('#token_attention')
//   .append('svg')
//     .attr('class',"overflow-auto")




// var layer_attention_plot = d3.select('#layer_attention')
// .append('svg')
//     .attr("width", (width + margin.left + margin.right))
//     .attr("height", (height + margin.top + margin.bottom) )
// .append('g')
//     .attr("transform","translate(" + margin.left + "," + margin.top + ")");

// var head_attention_plot = d3.select('#head_attention')
// .append('svg')
//     .attr("width", (width + margin.left + margin.right))
//     .attr("height", (height + margin.top + margin.bottom) )
// .append('g')
//     .attr("transform","translate(" + margin.left + "," + margin.top + ")");






function getRequest(){
  console.log('click');

$.ajax({
  type:"POST",
  url:"/",
  data:{},
  success:function(data){
    
    sum_data = data['sum']

    //console.log(sum_data);
    order_data = data['reorder']
    keys = sum_data.map(item =>Object.keys(item)[0])
    var nodes = sum_data.map(function(node, index) {
      return {
        key :Object.keys(node)[0],
        value : node[Object.keys(node)[0]]
        
      };
    });
    //console.log(nodes);

//start layersimilarity
var myGroups = Array.from(Array(12), (v,k) => k);

var myGroups2 = Array.from(Array(24), (v,k) => k);

var myGroups3 = Array.from(Array(16), (v,k) => k);

a_x = d3.scaleBand()
.range([ 0, width ])
.domain(myGroups)
.padding(0.01);
layersimilarity.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(a_x))
 a_y = d3.scaleBand()
  .range([ height, 0 ])
  .domain(myGroups2)
  .padding(0.01);
layersimilarity.append("g")
  .call(d3.axisLeft(a_y));
var myColor = d3.scaleLinear()
.range(["white", "#69b3a2"])
.domain([0,1])

rects = layersimilarity.append('g')
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
  .on('click',function(d) {bar_request(d.key,order_data);});


  }
//end layersimilarity
})
}
getRequest()
