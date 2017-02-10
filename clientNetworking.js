socket.on('add player', () => {
  // add new player
  let snake = new Snake();
  player.push(new Player(snake, "player"));
  snake.rectangles.push(new Rectangle(10, 10, 20, 20, color[(player.length-1)%color.length]));

});


socket.on('remove player', playerIndex => {
  player.splice(playerIndex, 1);
});


socket.on('change player direction', (playerIndex, dir) => {
  let p = player[playerIndex];

	if(p.prevKey != null)
		p.keysPressed[p.prevKey] = false;

	p.keysPressed[dir] = true;
	p.prevKey = dir;

})




$(window).keydown(function(event) {
	socket.emit('direction change', event.which);
});
