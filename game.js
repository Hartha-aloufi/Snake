/**
* we will have player data in both server and Client
* to send as less as possible data throw the network
*
* --------- Server ---------
* player position, only the head position and we will move it and
* detect the collesion between player head and the food.
*
*
* -------- Client ----------
* player head, body, color and name, thees data will send to the new connections
* throw the network.
*
* player movment will be taken from the server head movment.
*/

let io;
let gameSocket;
let connections = [];

exports.initGame = function(sio, socket){
  io = sio;
  gameSocket = socket;
  connections.push(gameSocket);

  // notify the client
  gameSocket.emit('connected', {message : 'You are connected!'});
  bindEvents();

  // request player data from an arbitrary client
  let isNewPlayer = true;
  connections[0].emit('playersDataReq', isNewPlayer);
}


// add event listener to the socket
function bindEvents(){
  gameSocket.on('disconnect', onDisconnect);
  gameSocket.on('playersDataRes', onPlayerDataRes);
  gameSocket.on('changeDir', onChangeDir);
  gameSocket.on('joinGame', onJoinGame);
  gameSocket.on('snakeEat', onSnakeEat);
  gameSocket.on('playerReturned', onPlayerReturned);
}



function onDisconnect(){
  let socket = this;

  let playerIdx = connections.indexOf(socket);

  // remove player data;
  connections.splice(playerIdx, 1);

  // notify other players
  socket.broadcast.emit('playerLeft', playerIdx);
}


function onPlayerDataRes(playersData){
  // send data to the new connections
  connections[connections.length-1].emit('initPlayersData', playersData);

  if(!playersData.isNewPlayer)
    return;

  // add new player
  io.emit('addNewPlayer')
}


function onChangeDir(newDir){
  if(newDir < 37 || newDir > 40)
    return;

  let playerIdx = connections.indexOf(this);


  io.emit('changeDir', {playerIdx : playerIdx, newDir, newDir})
}

// data {name, color, gameId}
function onJoinGame(data){
  io.emit('addNewPlayer', data);
}

function onSnakeEat(playerIdx){
  let newFoodPos = {x : (800 - 20) * Math.random(),
                 y : (400 - 20) * Math.random()
               }
  io.emit('snakeEat', {playerIdx : playerIdx, newFoodPos : newFoodPos});
}


function onPlayerReturned(){
  connections[0].emit('playersDataReq', false);
}
