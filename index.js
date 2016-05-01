var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var connection = [], player = [];
var speed = 6;
var color= ['#99cc00', '#ffffff', '#0099ff', '#ff6600', 
'#3333ff', '#66ff66', '#ffff00', '#990099', 'orange', 'purple', 'red', 
'silver', 'teal', 'white', 'yellow'];

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
    this.points = 0;
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

function updatePlayeroints(index){
	for(i = 0; i < player.length; i++){
		if(i == index)
			player[i].points++;
		
		else{
			if(player[i].points > 0)
				player[i].points--;
			
			if(player[i].points > 0)
				player[i].snake.rectangles.splice(0,2);
		}
	}
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
		rect.x+rect.width, rect.y+rect.height, rect.x+rect.width-5, rect.y+rect.height-5]; // 5 points
		var centerPointX = food.x + 4, centerPointY = food.y + 4;

		for(j = 0; j < 8; j += 2){
			var dis = Math.sqrt((borderPoints[j]-centerPointX)*(borderPoints[j]-centerPointX) + 
				(borderPoints[j+1]-centerPointY) * (borderPoints[j+1]-centerPointY));

			if(dis <= 10){
				food.x = 10 + (1000 - 20) * Math.random();
				food.y = 10 + (600 - 20) * Math.random();

				p.snake.rectangles.push(new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.color));
				p.snake.rectangles.push(new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.color));
				updatePlayeroints(i);
				io.emit('update scorebord', {player : player, index : i});
				break;
			}
		}
		redraw();
	}

}, 15);


io.on('connection', function(socket){
	console.log('new player in');
	connection.push(socket);

	// add new player
	var snake = new Snake();
	snake.rectangles.push(new Rectangle(10, 10, 20, 20, color[(connection.length-1)%color.length]));
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

	socket.on('player name', function(name){
		player[player.length-1].name = name;
	});

	socket.on('send message', function(message){
		var name = player[connection.indexOf(socket)].name;

		io.emit('send message', {name : name, message : message});
	});
});