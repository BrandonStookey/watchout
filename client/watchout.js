//============================================================
// Set up SVG game area
var board = 
  d3.select("body")
    .append("svg")
    .attr("position", "absolute")
    .attr("width", 500)
    .attr("height", 500)


var currentScore = 0;
var collisions = 0;
var highScore = 0;


//============================================================
//Build enemies 

var enemyArr = [];
for(var i = 2; i < 12; i++){
  enemyArr.push(i);
};

// gradient pattern
var grad = board.append("defs")
  .append("linearGradient")
  .attr("id", "grad")
  .attr("x1", "0%")
  .attr("x2", "0%")
  .attr("y1", "100%")
  .attr("y2", "0%");

grad.append("stop").attr("offset", "50%").style("stop-color", "white");
grad.append("stop").attr("offset", "50%").style("stop-color", "red");


var enemies = 
  board.selectAll('circle') // grab empty reference for circles to fill in 
    .data(enemyArr)        //plug in to data source to bind to each circle
    .enter()                //create a placeholder for each datum in data source
      .append("circle") // appends circle to each svg
      .attr('class', 'enemy')
      .attr("fill", "url(#grad)")
      .attr("cx", function (d, i) { return 500 * Math.random();}) 
      .attr("cy", function (d, i) { return 500 * Math.random();}) 
      .attr("r", 10);


//============================================================
// Create the player and make him draggable.
var player = 
  board.selectAll('players')
    .data([1])
    .enter()
      .append('circle')
      .attr("r", 10)
      .attr("cx", 250) 
      .attr("cy", 250) 
      .attr("fill", "green")
      .classed('player', true);

var position = [250, 250];
function on_drag() {
    // set position based on mouse position
    position = [d3.event.x, d3.event.y];
    redraw();
}
function redraw() {
    // set circle's position based on internal variable
    d3.select(".player")
        .attr("cx", position[0])
        .attr("cy", position[1]);
}

d3.behavior.drag()  // capture mouse drag event
    .on('drag', on_drag)
    .call(d3.select(".player"));

//============================================================
// Move enemies to random coordinates every 2 seconds.
function moveEnemies(){
  enemies
    .transition()
    .duration(2000)
    .attr("cx", function (d, i) { return 495 * Math.random();}) 
    .attr("cy", function (d, i) { return 495 * Math.random();});

    window.setTimeout(moveEnemies, 2000);
};
moveEnemies(enemies);

 //============================================================ 
// Return true if collision is detected between an enemy and the player.
var prevCollision = false;
function collisionDetector(){
  var collision = false;

  enemies.each(function(){
    var x = Math.abs(parseInt(player.attr("cx")) - this.cx.animVal.value); 
    var y = Math.abs(parseInt(player.attr("cy")) - this.cy.animVal.value); 
    var distance =  Math.sqrt(Math.pow(x,2) + Math.pow(y,2));

    var pR = parseInt(player.attr("r"));
    var eR = this.r.animVal.value;
    var limit = eR + pR;
    
    if(limit > distance){
      collision = true;
    }
  });

    if(collision){
      board.style("background-color", "red");
      if(currentScore > highScore){
        highScore = currentScore;
      }
      currentScore = 0;
      if(prevCollision !== collision){
        collisions++;
      }
    }else{
      board.style("background-color", "transparent");
    }
   prevCollision = collision;
};
d3.timer(collisionDetector, 1);


//==========================================================
// On load, begin incrementing currentScore
function scoreCount(){
  currentScore++;
  d3.select('#currentScore').text(currentScore);
  d3.select('#highScore').text(highScore);
  d3.select('#collisionCount').text(collisions);
  window.setTimeout(scoreCount, 10);
};

scoreCount();