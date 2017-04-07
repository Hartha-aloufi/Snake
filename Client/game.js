let canvas;

function setup(){
  canvas = createCanvas(1000, 600);
  // canvas.parent('game');
  noStroke();
  frameRate(30);
}

function draw(){
  // clear the canvas
  // clear();
  background(51);

  // update players data
  update();


  for (let i = 0; i < player.length; i++) {
    fill(player[i].color);

    let snakeBody = player[i].body;
    for (let j = 0; j < snakeBody.length; j++) {
      rect(snakeBody[j].x, snakeBody[j].y, 20, 20);
    }
  }

  fill('red');
  rect(food.x, food.y, food.width, food.height)
}


function update(){
  for (let i = 0; i < player.length; i++) {
    let moved = player[i].move();

    if(player[i].canEat()){
      socket.emit('snakeEat', i);
    }
  }
}
