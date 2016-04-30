var app = require('express')();
var server = require('http').createServer(app);

server.listen(3000);
console.log('server is now running...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

// power comment