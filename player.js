
function Snake(){
	this.rectangles = [];
}

function Rectangle(x, y, width, height, color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
}

function Player(snake, name){
	this.keysPressed = {},
    this.prevKey,
    this.snake = snake,
    this.name = name;
    this.points = 0;
}
