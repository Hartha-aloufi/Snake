let app = require('express')();
let server = require('http').createServer(app);
let serveStatic = require('serve-static');
let serve = serveStatic('./Client');
let io = require('socket.io').listen(server);
let game = require('./game');

server.listen(process.env.PORT || 8080);
console.log('server is now running at 8080...');

app.use(serve);

io.on('connection', function(socket){
	game.initGame(io, socket);
	console.log('connect');
});
