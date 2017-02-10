let player = [];
let speed = 6;
let color= ['#99cc00', '#ffffff', '#0099ff', '#ff6600',
'#3333ff', '#66ff66', '#ffff00', '#990099', 'orange', 'purple', 'red',
'silver', 'teal', 'white', 'yellow'];

let food = {	x : 100,	y : 100,	rad : 7}
let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let socket = io();
let $scoreboard = $('#well2');
let counter = 0;
let $chat = $('#form');

let playerName = prompt("please enter your name","name");


function draw(){
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw snakes
	for(i = 0; i < player.length; i++){
		for(j = 0; j < player[i].snake.rectangles.length; j++){
			let rect = player[i].snake.rectangles[j];
			context.fillStyle = rect.color;
			context.fillRect(rect.x, rect.y, rect.width, rect.height);
		}

	}

	// draw the food
	context.fillStyle = "#FF0000";
	context.fillRect(food.x, food.y, 10, 10);
}


socket.on('update scorebord', function(data){

	// elem.scrollTop = elem.scrollHeight;
	$scoreboard.scrollTop = $scoreboard.scrollHeight;
	let str = '';
	for(i = 0; i < data.player.length; i++){
		str += data.player[i].name + ' : ' + data.player[i].points;

		if(i+1 != data.player.lenght)
			str += '<br/>'
	}


	$scoreboard.append('<div class="list-group"><div class="list-group-item"><h4 class="list-group-item-heading">Scorebord</h4><p id = maxScore>&#160;&#160;max score : '+data.maxScore.max+'&#160;&#160;&#160;&#160;&#160;&#160;by : '+data.maxScore.name+'&#160;&#160;&#160;&#160;&#160;'+
		data.maxScore.date+'</p><pre>' + str +
		'</pre></div></div>');

	// auto scrolling down
	let objDiv = document.getElementById("well2");
	objDiv.scrollTop = objDiv.scrollHeight;


});

$chat.submit(function(){
	if($('#message').val() != '')
		socket.emit('send message', $('#message').val());
	$('#message').val('');
	return false;
});

socket.on('send message', function(data){
	let str = '<pre><strong>' +data.name+': '+data.message+'</strong></pre>';
	$scoreboard.append(str);

	// auto scrolling down
	let objDiv = document.getElementById("well2");
	objDiv.scrollTop = objDiv.scrollHeight;

});


function calcNewTopLeftPoint(oldValue, keyCode1, keyCode2, maxValue, keysPressed){
	let newValue = oldValue
                   - (keysPressed[keyCode1] ? speed : 0)
                   + (keysPressed[keyCode2] ? speed : 0);
    return newValue < 0 ? 0 : newValue > maxValue ? maxValue : newValue;
}


setInterval(function() {

	// update all players snakes positions
	for(i = 0; i < player.length; i++){
		let p = player[i];

		let newX = calcNewTopLeftPoint(p.snake.rectangles[0].x, 37, 39, 1000 - p.snake.rectangles[0].width, p.keysPressed);
		let newY = calcNewTopLeftPoint(p.snake.rectangles[0].y, 38, 40, 600 - p.snake.rectangles[0].height, p.keysPressed);

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
		let rect = p.snake.rectangles[0];
		let borderPoints = [rect.x, rect.y, rect.x+rect.width, rect.y, rect.x, rect.y+rect.height,
		rect.x+rect.width, rect.y+rect.height, rect.x+rect.width-5, rect.y+rect.height-5]; // 5 points
		let centerPointX = food.x + 4, centerPointY = food.y + 4;

		for(j = 0; j < 8; j += 2){
			let dis = Math.sqrt((borderPoints[j]-centerPointX)*(borderPoints[j]-centerPointX) +
				(borderPoints[j+1]-centerPointY) * (borderPoints[j+1]-centerPointY));

			if(dis <= 10){
				let x = 10 + (1000 - 20) * Math.random();
				let y = 10 + (600 - 20) * Math.random();

				p.snake.rectangles.push(new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.color));
				p.snake.rectangles.push(new Rectangle(rect.x, rect.y, rect.width, rect.height, rect.color));
				// updatePlayeroints(i);

				socket.emit('change food pos', {x : x, y : y})
			}
		}
	}

	draw();
}, 30);
