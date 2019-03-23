(function(){
	"use strict";

  window.addEventListener('load', function(){
    	/* Main Method */
		function BombMan() {
			this.core = new app.Core();
			this.gui = new app.Gui(this.core);
			this.core.addGameGui(this.gui);
		}

		window.addEventListener( 'resize', onWindowResize, false );

		function onWindowResize(){	
    		game.gui.resize();
		}

		let game = new BombMan();
		let updateInterval;
		hideGame();
		let roomId = null;

		let intent = {
			'up': 0,
			'down': 0,
			'left': 0,
			'right': 0,
		};

		window.addEventListener('keydown', function(e){
			switch(e.keyCode){
				case UP: intent.up = 1; break;
				case DOWN: intent.down = 1; break;
				case LEFT: intent.left = 1; break;
				case RIGHT: intent.right = 1; break;
				case PLACEBOMB: socket.emit('placeBomb', {room: roomId}); break;
				case 80: 
					console.log('DEBUG');
					console.log(game.core.state);
				break;
			}
		});

		window,addEventListener('keyup', function(e) {
			switch(e.keyCode){
				case UP: intent.up = 0; break;
				case DOWN: intent.down = 0; break;
				case LEFT: intent.left = 0; break;
				case RIGHT: intent.right = 0; break;
				//case PLACEBOMB: socket.emit('placeBomb', {room: roomId}); break;
			}
		});

		/**
		 *  receive game state
		 * 'players': player information
		 * 'bombs': bomb information
		 * 'gameboard': gameboard information
		 * */ 
		socket.on('gamestate', function(state){
			game.core.updateGameState(state);
		});

		// socket handler for starting a game
		socket.on('gamestart', (gameplay, room) =>{
			console.log(gameplay);
			roomId = room;
			game.core.startNewGame(gameplay);
			showGame();
			// send to the server information about main player on this client
			updateInterval = setInterval(updateGameState,1000/30);
		});

		socket.on('bombPlaced', (bomb) => {
			game.core.placeBomb(bomb);
		});

		socket.on('explode', (res) => {
			game.core.explode(res);
		});

		// socket handler for starting a game
		socket.on('gameover', () =>{
			clearInterval(updateInterval);
			gameOver(true);
		});

		document.getElementById('play_game_btn').addEventListener('click', async ()=>{
			// notify server to enqueue player
			socket.emit('enqueuePlayer');
			setQueueMsg();
			let promise = new Promise((resolve, reject) =>{
				setTimeout(() => {resolve("done");},6000);
			});
			await promise;
			// stay in queue for some seconds, then resolve
			promise = new Promise((resolve, reject) =>{
				resolve(socket.emit('resolveQueue', socket.id));
			});
			await promise;
			if(!roomId) setNoGameFoundMsg();
		});

		let gameOver = (didwin) => {
			if(didwin) console.log("I won");
			else console.log("I lost");
			clearInterval(updateInterval);
			game.gui.stopAnimate();
		};

		function updateGameState(){ 
			socket.emit('player_action', {'room': roomId, 'intent':intent});
		}
	});


	let showGame = () =>{
		document.getElementById('homepage').style.display = "none";
		document.getElementById('world').style.display = "block";
	}

	let hideGame = () =>{
		document.getElementById('homepage').style.display = "block";
		document.getElementById('world').style.display = "none";
	}

	let setQueueMsg = () => {
		let msg = document.getElementById('queue_msg');
		msg.innerHTML = `
		Looking for players <div class="loader"></div>
		`;
	}

	let setNoGameFoundMsg = () => {
		let msg = document.getElementById('queue_msg');
		msg.innerHTML = `
		<div id="game_not_found">No games were found. Please try again later</div>
		`;
	}


})();