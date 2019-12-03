let uniqueKey = require('../Templates/uniqueKey.tpl');
let progressBar = require('../Templates/progressBar.tpl');
let kamehameha = require('../Templates/kamehameha.tpl');
let lastStay = require('../Templates/lastStay.tpl');

import imgValidate from '../assets/img/Check.svg';

export default class App {
	constructor(numberGame) {
		this.choice;

		this.gameArray = [
			this.uniqueKey.bind(this),
			this.progressBar.bind(this),
			this.kamehameha.bind(this),
		];

		this.winnerArray = []; //First to finish
		this.loserArray = []; //First to lose

		this.winner = ['player-1', 'player-2', 'player-3', 'player-4'];
		this.incre = 1;

		// this.gameArray[numberGame]();
		//this.randomGame();
	}

	randomGame() {
		this.choice = Math.floor(Math.random() * this.gameArray.length);
		return this.gameArray[1]();
		//return this.gameArray[this.choice]();
	}

	fullCircle(player) {
		document.querySelector('.' + player + ' .bar-progress').classList.add('full-bar');
		setTimeout(() => {
			document.querySelector('.' + player + '').classList.add('complete');
		}, 500);

		if (this.winnerArray.indexOf(player) === -1) {
			this.winnerArray.push(player);
		}
	}

	uniqueKey() {
		document.querySelector('.game-container').innerHTML = uniqueKey;
		for (let i = 0; i < document.querySelectorAll('.validate-icon img').length; i++) {
			document.querySelectorAll('.validate-icon img')[i].src = imgValidate;
		}

		//Check player
		for (let i = 0; i < document.querySelectorAll('.player-cont').length; i++) {
			if (
				this.winner[0] != document.querySelectorAll('.player-cont')[i].className.split(' ')[1] &&
				this.winner[1] != document.querySelectorAll('.player-cont')[i].className.split(' ')[1] &&
				this.winner[2] != document.querySelectorAll('.player-cont')[i].className.split(' ')[1] &&
				this.winner[3] != document.querySelectorAll('.player-cont')[i].className.split(' ')[1]
			) {
				document.querySelectorAll('.player-cont')[i].style.display = 'none';
			} else {
				document.querySelectorAll('.player-cont')[i].classList.add('winner-' + this.incre);
				this.incre += 1;
			}
		}

		let randomArray = ['haut', 'droite', 'bas', 'gauche'];
		let rand = Math.floor(Math.random() * randomArray.length);

		document
			.querySelector('.unique-pad .' + randomArray[rand] + '-touch')
			.classList.add('active-touch');

		return new Promise(resolve => {
			window.addEventListener('keydown', e => {
				let keyCode = e.keyCode || e.which;
				switch (randomArray[rand]) {
					case 'haut':
						if (keyCode == 90) {
							//Z
							this.fullCircle('player-1');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 79) {
							//O
							this.fullCircle('player-2');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 38) {
							//^
							this.fullCircle('player-3');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 53) {
							//5
							this.fullCircle('player-4');
							this.isFinish(resolve, 4);
						}
						break;
					case 'droite':
						if (keyCode == 68) {
							//D
							this.fullCircle('player-1');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 77) {
							//M
							this.fullCircle('player-2');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 39) {
							//>
							this.fullCircle('player-3');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 51) {
							//3
							this.fullCircle('player-4');
							this.isFinish(resolve, 4);
						}
						break;
					case 'bas':
						if (keyCode == 83) {
							//S
							this.fullCircle('player-1');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 76) {
							//L
							this.fullCircle('player-2');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 40) {
							//v
							this.fullCircle('player-3');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 50) {
							//2
							this.fullCircle('player-4');
							this.isFinish(resolve, 4);
						}
						break;
					case 'gauche':
						if (keyCode == 81) {
							//Q
							this.fullCircle('player-1');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 75) {
							//K
							this.fullCircle('player-2');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 37) {
							//<
							this.fullCircle('player-3');
							this.isFinish(resolve, 4);
						}
						if (keyCode == 49) {
							//1
							this.fullCircle('player-4');
							this.isFinish(resolve, 4);
						}
						break;
					default:
				}
			});
		});
	}

	incrementProgressBar(player) {
		if (
			document.querySelector('.' + player + ' .bar-progress-2').offsetWidth <
			document.querySelector('.' + player + ' .bar-progress-cont-2').offsetWidth
		) {
			document.querySelector('.' + player + ' .bar-progress-2').style.width =
				document.querySelector('.' + player + ' .bar-progress-2').offsetWidth + 20 + 'px';
		} else {
			document.querySelector('.' + player + '').classList.add('complete');

			console.log(document.querySelector('.' + player + ' .bar-progress-2').offsetWidth);
			console.log(document.querySelector('.' + player + ' .bar-progress-cont-2').offsetWidth);

			if (this.winnerArray.indexOf(player) == -1) {
				this.winnerArray.push(player);
			}
		}
	}

	progressBar() {
		// document.querySelector('.players-container').parentNode.remove();

		document.querySelector('.game-container').innerHTML = progressBar;
		for (let i = 0; i < document.querySelectorAll('.validate-icon img').length; i++) {
			document.querySelectorAll('.validate-icon img')[i].src = imgValidate;
		}

		document.querySelector('.' + this.winnerArray[this.winnerArray.length - 1]).style.display =
			'none';
		// console.log(this.winnerArray[this.winnerArray.length - 1]);

		// Reset array of winner
		this.winnerArray = [];

		return new Promise(resolve => {
			window.addEventListener('keydown', e => {
				let key = e.keyCode || e.which;
				switch (key) {
					case 81: //Q P1
						this.incrementProgressBar('player-1');
						this.isFinish(resolve, 3);
						break;
					case 68: //D P1
						this.incrementProgressBar('player-1');
						this.isFinish(resolve, 3);
						break;
					case 75: //K P2
						this.incrementProgressBar('player-2');
						this.isFinish(resolve, 3);
						break;
					case 77: //M P2
						this.incrementProgressBar('player-2');
						this.isFinish(resolve, 3);
						break;
					case 37: //left walk P3
						this.incrementProgressBar('player-3');
						this.isFinish(resolve, 3);
						break;
					case 39: //right turn P3
						this.incrementProgressBar('player-3');
						this.isFinish(resolve, 3);
						break;
					case 49: //1 P4
						this.incrementProgressBar('player-4');
						this.isFinish(resolve, 3);
						break;
					case 51: //3 P4
						this.incrementProgressBar('player-4');
						this.isFinish(resolve, 3);
						break;
					default:
				}
			});
		});
	}

	progressKamehameha(player) {
		if (document.querySelector('.' + player + '').classList.contains('winner-1')) {
			document.querySelector('.progress-left').style.width =
				document.querySelector('.progress-left').offsetWidth + 40 + 'px';
			document.querySelector('.progress-right').style.width =
				document.querySelector('.progress-right').offsetWidth - 40 + 'px';
		}
		if (document.querySelector('.' + player + '').classList.contains('winner-2')) {
			document.querySelector('.progress-left').style.width =
				document.querySelector('.progress-left').offsetWidth - 40 + 'px';
			document.querySelector('.progress-right').style.width =
				document.querySelector('.progress-right').offsetWidth + 40 + 'px';
		}
	}

	progressBarIsReady(value) {
		return value;
	}

	//ONLY FOR 2
	kamehameha() {
		document.querySelector('.game-container').innerHTML = kamehameha;

		//Check player
		for (let i = 0; i < document.querySelectorAll('.player-cont').length; i++) {
			if (
				this.winnerArray[0] !=
					document.querySelectorAll('.player-cont')[i].className.split(' ')[1] &&
				this.winnerArray[1] != document.querySelectorAll('.player-cont')[i].className.split(' ')[1]
			) {
				console.log(document.querySelectorAll('.player-cont')[i]);
				document.querySelectorAll('.player-cont')[i].style.display = 'none';
			} else {
				document.querySelectorAll('.player-cont')[i].classList.add('winner-' + this.incre);
				this.incre += 1;
			}
		}

		// document.querySelector('.' + this.winnerArray[this.winnerArray.length - 1]).style.display =
		// 'none';

		// Reset array of winner

		return new Promise(resolve => {
			window.addEventListener('keydown', e => {
				if (
					document.querySelector('.progress-right').offsetWidth < 30 ||
					document.querySelector('.progress-right').offsetWidth > 670
				) {
					// this.isFinish(resolve, 2);
				}

				let key = e.keyCode || e.which;
				switch (key) {
					case 81: //Q P1
						this.progressKamehameha('player-1');
						this.isFinish(resolve, 2);
						break;
					case 68: //D P1
						this.progressKamehameha('player-1');
						this.isFinish(resolve, 2);
						break;
					case 75: //K P2
						this.progressKamehameha('player-2');
						this.isFinish(resolve, 2);
						break;
					case 77: //M P2
						this.progressKamehameha('player-2');
						this.isFinish(resolve, 2);
						break;
					case 37: //left walk P3
						this.progressKamehameha('player-3');
						this.isFinish(resolve, 2);
						break;
					case 39: //right turn P3
						this.progressKamehameha('player-3');
						this.isFinish(resolve, 2);
						break;
					case 49: //1 P4
						this.progressKamehameha('player-4');
						this.isFinish(resolve, 2);
						break;
					case 51: //3 P4
						this.progressKamehameha('player-4');
						this.isFinish(resolve, 2);
						break;
					default:
				}
			});
		});
	}

	//ONLY FOR 3 MAX
	//ONLY FOR 3 MAX
	lastStay() {
		document.querySelector('.game-container').innerHTML = lastStay;
		console.log('lastStay');

		let randomArray = ['haut', 'droite', 'bas', 'gauche'];
		let rand = Math.floor(Math.random() * randomArray.length);

		document
			.querySelector('.last-stay .' + randomArray[rand] + '-touch')
			.classList.add('active-touch');

		window.addEventListener('keydown', e => {
			let keyCode = e.keyCode || e.which;
			switch (randomArray[rand]) {
				case 'haut':
					if (keyCode == 90) {
						//Z
						this.fullCircle('player-1');
					}
					if (keyCode == 79) {
						//O
						this.fullCircle('player-2');
					}
					if (keyCode == 38) {
						//^
						this.fullCircle('player-3');
					}
					if (keyCode == 53) {
						//5
						this.fullCircle('player-4');
					}
					break;
				case 'droite':
					if (keyCode == 68) {
						//D
						this.fullCircle('player-1');
					}
					if (keyCode == 77) {
						//M
						this.fullCircle('player-2');
					}
					if (keyCode == 39) {
						//>
						this.fullCircle('player-3');
					}
					if (keyCode == 51) {
						//3
						this.fullCircle('player-4');
					}
					break;
				case 'bas':
					if (keyCode == 83) {
						//S
						this.fullCircle('player-1');
					}
					if (keyCode == 76) {
						//L
						this.fullCircle('player-2');
					}
					if (keyCode == 40) {
						//v
						this.fullCircle('player-3');
					}
					if (keyCode == 50) {
						//2
						this.fullCircle('player-4');
					}
					break;
				case 'gauche':
					if (keyCode == 81) {
						//Q
						this.fullCircle('player-1');
					}
					if (keyCode == 75) {
						//K
						this.fullCircle('player-2');
					}
					if (keyCode == 37) {
						//<
						this.fullCircle('player-3');
					}
					if (keyCode == 49) {
						//1
						this.fullCircle('player-4');
					}
					break;
				default:
			}
			if (
				document.querySelectorAll('.circle').length ==
				document.querySelectorAll('.full-circle').length
			) {
				window.addEventListener('keyup', e => {
					let keyCode = e.keyCode || e.which;
					switch (randomArray[rand]) {
						case 'haut':
							if (keyCode == 90) {
								//Z
								console.log('player 1 loose');
							}
							if (keyCode == 79) {
								//O
								console.log('player 2 loose');
							}
							if (keyCode == 38) {
								//^
								console.log('player 3 loose');
							}
							if (keyCode == 53) {
								//5
								console.log('player 4 loose');
							}
							break;
						case 'droite':
							if (keyCode == 68) {
								//D
								console.log('player 1 loose');
							}
							if (keyCode == 77) {
								//M
								console.log('player 2 loose');
							}
							if (keyCode == 39) {
								//>
								console.log('player 3 loose');
							}
							if (keyCode == 51) {
								//3
								console.log('player 4 loose');
							}
							break;
						case 'bas':
							if (keyCode == 83) {
								//S
								console.log('player 1 loose');
							}
							if (keyCode == 76) {
								//L
								console.log('player 2 loose');
							}
							if (keyCode == 40) {
								//v
								console.log('player 3 loose');
							}
							if (keyCode == 50) {
								//2
								console.log('player 4 loose');
							}
							break;
						case 'gauche':
							if (keyCode == 81) {
								//Q
								console.log('player 1 loose');
							}
							if (keyCode == 75) {
								//K
								console.log('player 2 loose');
							}
							if (keyCode == 37) {
								//<
								console.log('player 3 loose');
							}
							if (keyCode == 49) {
								//1
								console.log('player 4 loose');
							}
							break;
						default:
					}
				});
			}
		});
	}

	// Method for remove ui
	resetGame() {
		//remove element
		document.querySelector('.instruction').classList.remove('appear-card');

		setTimeout(() => {
			document.querySelector('.instruction').classList.add('remove-card');
			for (let i = 0; i < document.querySelectorAll('.player-cont').length; i++) {
				document.querySelectorAll('.player-cont')[i].classList.remove('appear-card');
				setTimeout(() => {
					document.querySelectorAll('.player-cont')[i].classList.add('remove-card');
				}, 100);
			}
		}, 100);

		setTimeout(() => {
			document.querySelector('.game-container').innerHTML = '';
		}, 700);
	}

	isFinish(resolve, max) {
		console.log(this.winnerArray);

		if (this.winnerArray.length == max) {
			setTimeout(() => {
				this.resetGame();
			}, 1000);

			setTimeout(() => {
				resolve(parseInt(this.winnerArray[this.winnerArray.length - 1].charAt(7)) - 1);
			}, 2000);
		}
	}
}
