(function(window) {
	'use strict';

	/**
	 * The game plug-in interface that use to implement and register games
	 * with Core. This class is where all the game logic from
	 */
	const GAMEBOARD_SIZE = 15;

	let character = function(name, xPos, yPos, speed, power, load){
		return{
			name: name,
			xPos: xPos,
			yPos: yPos,
			speed: speed,
			power: power,
			load: load
		};
	};

	function Gameplay() {
		this.gameboard = emptyGameboard();
		this.gameboard[7][8] = 1;
		this.gameboard[10][11] = 1;
		this.character = character('myChar', 0, 0, 1, 1, 1);
		this.gameboard[this.character.yPos][this.character.xPos] = 3;

		this.left = () => {
			if (this.character.xPos > 0){
				this.gameboard[this.character.yPos][this.character.xPos] = 0;
				this.character.xPos--;
				this.gameboard[this.character.yPos][this.character.xPos] = 3;
			}
		};

		this.right = () =>{
			if (this.character.xPos < GAMEBOARD_SIZE){
				this.gameboard[this.character.yPos][this.character.xPos] = 0;
				this.character.xPos++;
				this.gameboard[this.character.yPos][this.character.xPos] = 3;
			}
		};

		this.up = () =>{
			if (this.character.yPos > 0){
				this.gameboard[this.character.yPos][this.character.xPos] = 0;
				this.character.yPos--;
				this.gameboard[this.character.yPos][this.character.xPos] = 3;
			}
		};

		this.down = () =>{
			if (this.character.yPos < GAMEBOARD_SIZE){
				this.gameboard[this.character.yPos][this.character.xPos] = 0;
				this.character.yPos++;
				this.gameboard[this.character.yPos][this.character.xPos] = 3;
			}
		};
	}

	function emptyGameboard(){
		let gameboard = [];
		for(let i = 0; i < GAMEBOARD_SIZE; i++){
			let arr = [];
			for (var j = 0; j < GAMEBOARD_SIZE; j++){
				arr.push(0);
			}
			gameboard.push(arr);
		}
		return gameboard;
	}

	

    // Export to window
    window.app = window.app || {};
    window.app.Gameplay = Gameplay;
})(window);