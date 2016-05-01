var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connection = [], player = [];
var speed = 6;

server.listen(3000);
console.log('server is now running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


var food = {
	x : 100,
	y : 100,
	rad: 7
}

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
}

function calcNewTopLeftPoint(oldValue, keyCode1, keyCode2, maxValue, keysPressed){
	var newValue = oldValue
                   - (keysPressed[keyCode1] ? speed : 0)
                   + (keysPressed[keyCode2] ? speed : 0);
    return newValue < 0 ? 0 : newValue > maxValue ? maxValue : newValue;
}

function redraw(){
	io.emit('draw', {player : player, food : food});
}

setInterval(function() {

	// update all players snakes positions
	for(i = 0; i < player.length; i++){
		var p = player[i];

		var newX = calcNewTopLeftPoint(p.snake.rectangles[0].x, 37, 39, 1000 - p.snake.rectangles[0].width, p.keysPressed);    
		var newY = calcNewTopLeftPoint(p.snake.rectangles[0].y, 38, 40, 600 - p.snake.rectangles[0].height, p.keysPressed); 

		//if the head of snake didn't moved
		if(newX == p.snake.rectangles[0].x && newY == p.snake.rectangles[0].y)
			continue;

		// move the head
		p.snake.rectangles[0].x = newX;
		p.snake.rectangles[0].y = newY;


		// move the body of the snake
		for(j = p.snake.rectangles.length -1; j > 0; j--){
			p.snake.rectangles[j].x = p.snake.rectangles[j-1].x;
			p.snake.rectangles[j].y = p.snake.rectangles[j-1].y;
		}


		// collision detection
		var rect = p.snake.rectangles[0];
		var borderPoints = [rect.x, rect.y, rect.x+rect.width, rect.y, rect.x, rect.y+rect.height, 
		rect.x+rect.width, rect.y+rect.height]; // 4 points
		var centerPointX = food.x + 4, centerPointY = food.y + 4;

		for(j = 0; j < 8; j += 2){
			var dis = Math.sqrt((borderPoints[j]-centerPointX)*(borderPoints[j]-centerPointX) + 
				(borderPoints[j+1]-centerPointY) * (borderPoints[j+1]-centerPointY));

			console.log(dis);
			if(dis <= 9.5){
				food.x = 10 + (1000 - 20) * Math.random();
				food.y = 10 + (600 - 20) * Math.random();

				p.snake.rectangles.push(new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.color));
				break;
			}
		}
		redraw();
	}

}, 20);


io.on('connection', function(socket){
	console.log('new player in');
	connection.push(socket);

	// add new player
	var snake = new Snake();
	snake.rectangles.push(new Rectangle(10, 10, 20, 20, "#33cc33"));
	player.push(new Player(snake, "player"));
	redraw();

	// disconnect
	socket.on('disconnect', function(){
		var playerIndex = connection.indexOf(socket);
		player.splice(playerIndex, 1);
		connection.splice(playerIndex, 1);
		console.log('player number ' + (playerIndex + 1) + ' disconnect');
	});

	// detect player direction changes
	socket.on('direction change', function(which){
		var p = player[connection.indexOf(socket)];

		if(p.prevKey != null) 
			p.keysPressed[p.prevKey] = false;
	
		p.keysPressed[which] = true; 
		p.prevKey = which;
	});
});