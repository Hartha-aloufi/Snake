let isHuman = prompt("are you a human ?");


// globals
let isGameStarted = false;
let socket;
let food = {x : 100, y : 100, width : 5, height : 5}
let player = [];
let snakeSpeed = 6;

if(isHuman)
	socket = io();

let App = {

	gameId : 0,
	myScoketId : '',

	init : function() {
		App.cacheElements();
		App.bindEvents();
		// App.showInitScreen();
		App.$gameArea.html(App.$templateGame);
	},


	cacheElements : function() {
			App.$doc = $(document);

			// templates
			App.$gameArea = $('#gameArea');
			App.$templateIntroScreen = $('#intro-screen-template').html();
      App.$templateNewGame = $('#create-game-template').html();
			App.$templateJoinGame = $('#join-game-template').html();
      App.$templateGame = $('#game').html();
	},

	showInitScreen : function() {
		App.$gameArea.html(App.$templateIntroScreen);
	},

	bindEvents : function(){
		App.$doc.on('click', '#btnJoinGame', App.Player.onJionClick);
		App.$doc.on('click', '#btnstartGame', App.Player.onStartClick);
	},

	Player : {
		name : '',
		color : Math.random() * 255,
		
		onJoinClick : function(){
			App.Player.name = $('#inputPlayerName').val() || 'anon';
			App.Player.color = $('#inputPlayerColor').val() || 'red';

			IO.socket.emit('playerJoinGame', {name : App.Player.name,
																				color : App.Player.color});
		},

		onCreateClick : function(){

		}

	},
}

App.init();


$(window).keydown(function(event) {
	socket.emit('changeDir', event.which);
});

$(window).focus(() => {
	socket.emit('playerReturned');
});
