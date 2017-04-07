let IO = {

  init : () => {
    IO.bindEvents();
  },

  bindEvents : function() {
    socket.on('addNewPlayer', IO.onAddNewPlayer);
    socket.on('playersDataReq', IO.onPlayersDataReq);
    socket.on('initPlayersData', IO.onInitPlayersData);
    socket.on('playerLeft', IO.onPlayerLeft);
    socket.on('changeFoodPos', IO.onChangeFoodPos);
    socket.on('snakeEat', IO.onSnakeEat);
    socket.on('changeDir', IO.onChangeDir);
  },

  onAddNewPlayer : function() {
    player.push(new Snake(App.Player.color));
    console.log('add new Player');
  },

  onPlayersDataReq : function(isNewPlayer) {
    console.log('playerDataReq');
    socket.emit('playersDataRes', {player : player, foodPos : {x : food.x, y : food.y},
                                    isNewPlayer : isNewPlayer});
  },

  onInitPlayersData : function(data) {
    for (let i = 0; i < data.player.length; i++) {
      let p = data.player[i];
      let s = new Snake(p.color);
      s.body = p.body;
      s.dir = p.dir;

      player.push(s);
    }

    food.x = data.foodPos.x;
    food.y = data.foodPos.y;
  },

  onPlayerLeft : function(playerIndex) {
    player.splice(playerIndex, 1);
  },


  onChangeFoodPos : function(pos)  {
    food.x = pos.x;
    food.y = pos.y;
    console.log('food change');
  },

  // data {playerIdx, newFoodPos}
  onSnakeEat : function(data){
    player[data.playerIdx].eat();

    food.x = data.newFoodPos.x;
    food.y = data.newFoodPos.y;

    console.log(food.x + ' ' + food.y);
  },

  // data : {playerIdx, newDir}
  onChangeDir : function(data){
    player[data.playerIdx].dir = data.newDir;
  }

}

IO.init();


window.onFocus
