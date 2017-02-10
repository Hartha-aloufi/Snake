let app = require('express')();
let server = require('http').createServer(app);
let serveStatic = require('serve-static');
let serve = serveStatic('../Snake');
let io = require('socket.io').listen(server);
let dateformat = require('dateformat');

server.listen(process.env.PORT || 8080);
console.log('server is now running...');

app.use(serve);

let connection = [];
// let doubleConnectionHandler = 0;

io.on('connection', function(socket){
  // add new player

	socket.on('players data res', data => {
		io.emit('set player data', data);
		io.emit('add player');
	});

  if(connection.length != 0){
		 connection[0].emit('get players data');
	} else
		io.emit('add player');

	connection.push(socket);
	console.log('new player in ......... # players is ' + connection.length );

	// disconnect
	socket.on('disconnect', function(){
		let playerIndex = connection.indexOf(socket);

    connection.splice(playerIndex, 1);
    console.log('player number ' + (playerIndex + 1) + ' disconnect');

    io.emit('remove player', playerIndex);

	});

	// detect player direction changes
	socket.on('direction change', function(dir){
		let playerIndex = connection.indexOf(socket);
    io.emit('change player direction', playerIndex, dir);
	});

	socket.on('change food pos', pos => {
			io.emit('set food pos', pos);
	});

	socket.on('send message', function(message, playerName){

		io.emit('send message', {name : playerName, message : message});
	});
});
