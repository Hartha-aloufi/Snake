socket.on('add player', () => {
  // add new player
  let snake = new Snake();
  player.push(new Player(snake, "player"));
  snake.rectangles.push(new Rectangle(10, 10, 20, 20, color[(player.length-1)%color.length]));
  console.log('clinet new player added');
});

socket.on('get players data', () => {
  console.log('player data req');
  socket.emit('players data res', {player : player, foodPos : {x : food.x, y : food.y}});
})

socket.on('set player data', data => {
  player = data.player;
  food.x = data.foodPos.x;
  food.y = data.foodPos.y;
  console.log('clinet set players to new conneection')
})

socket.on('remove player', playerIndex => {
  player.splice(playerIndex, 1);
});


socket.on('change player direction', (playerIndex, dir) => {
  let p = player[playerIndex];
  console.log('player {0} change his dir' , playerIndex);
	if(p.prevKey != null)
		p.keysPressed[p.prevKey] = false;

	p.keysPressed[dir] = true;
	p.prevKey = dir;

})


socket.on('set food pos', pos => {
  food.x = pos.x;
  food.y = pos.y;
    console.log('food change');
});



$(window).keydown(function(event) {
	socket.emit('direction change', event.which);
});
