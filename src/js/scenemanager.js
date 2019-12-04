import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { Interaction } from 'three.interaction';
import { Howl, Howler } from 'howler';

import SceneManager from '../utils/scene.manager';

import introGame from '../components/introGame.js';
import interactGame from '../components/interactGame.js';

import Helpers from '../utils/helpers.three';

// Components
import Character from '../components/character.component';
import Terrain from '../components/terrain.component';
import Chairs from '../components/chairs.component';
import HemisphereLight from '../components/hemisphereLight.component';



// Sounds
import Music01 from '../audios/music-01.mp3';
import Music02 from '../audios/music-02.mp3';
import Music03 from '../audios/music-03.mp3';
import Music04 from '../audios/music-04.mp3';
import Music05 from '../audios/music-05.mp3';
import Music06 from '../audios/music-06.mp3';
import Freeze from '../audios/freeze.mp3';
import FinalRound from '../audios/finalRound.mp3';

import Applause from '../audios/applause.mp3';
import Chering from '../audios/cheering3.mp3';

class Scene01 extends SceneManager {
	constructor(canvas) {
		super(canvas);

		this.camera.position.set(5, 5, 5);
		this.camera.lookAt(0, 0, 0);

		this.scene.add(Helpers.grid());

		this.options = {
			nbCharacters: 4,
			distRadius: 2,
			speed: 1.2,
		};

		//INTERACT GAME
		// new interactGame(0);

		// Init all components
		this.addComponents(new Terrain(this.scene));

		this.characters = new Character(this.scene, this.options);
		this.addComponents(this.characters);

		this.chairs = new Chairs(this.scene, this.options);
		this.addComponents(this.chairs);

		// Lights
		let hemiLight = new HemisphereLight(this.scene);
		this.addComponents(hemiLight);
		this.scene.add(Helpers.hemiLight(hemiLight.light(), 2));

		// Sounds
		/*this.soundIsReady = false;
		this.sound = null;
		this.offset = 0;
		this.soundLoaded = this.createSound().then(sound => {
			this.sound = sound;
			this.soundIsReady = true;
		});*/

		let allMusics = [Music01, Music02, Music03, Music04, Music05, Music06];

		this.sound = new Howl({
			src: allMusics[Math.floor(Math.random() * Math.floor(allMusics.length))],
		});

		this.sound.volume = 1;

		this.soundFinal = new Howl({ src: [FinalRound] });

		this.soundFreeze = new Howl({ src: [Freeze] });

		this.soundApplause = new Howl({ src: [Applause], loop: true });
		this.soundApplause.play();

		this.soundChering = new Howl({ src: [Chering] });

		this.game = new interactGame();

		//Start game INTRO GAME
		new introGame().then(() => {
			this.sound.play();

			setTimeout(() => {
				//
				this.soundFreeze.play();
				this.sound.pause();

				// Start first game
				this.game.uniqueKey().then(looser => {
					this.characters.stoppedCharacters();

					setTimeout(() => {
						this.characters.deleteCharacter(parseInt(looser));
						this.soundChering.play();

						setTimeout(() => {
							this.game.transitionRound();
						}, 2500);

						setTimeout(() => {
							this.chairs.resizeChairs();
							this.characters.resizeScene();
							this.characters.startWalking();
							this.sound.play();

							setTimeout(() => {
								this.soundFreeze.play();
								this.sound.pause();

								// Start game two
								this.game.progressBar().then(looser => {
									this.characters.stoppedCharacters();

									setTimeout(() => {
										this.characters.deleteCharacter(parseInt(looser));
										this.soundChering.play();

										setTimeout(() => {
											this.game.transitionRound();
											setTimeout(() => {
												this.soundFinal.play();
											}, 2500);
										}, 2500);

										setTimeout(() => {
											this.chairs.resizeChairs();
											this.characters.resizeScene();
											this.characters.startWalking();
											this.sound.play();

											setTimeout(() => {
												this.soundFreeze.play();
												this.sound.pause();

												// Start game two
												this.game.kamehameha().then(looser3 => {
													this.characters.stoppedCharacters();
													setTimeout(() => {
														this.characters.deleteCharacter(parseInt(looser3));
														this.soundChering.play();

														setTimeout(() => {
															this.sound.play();
														}, 2000);
													}, 1500);
												});
											}, 20000);
										}, 6000);
									}, 2000);
								});
							}, 15000);
						}, 6000);
					}, 2000);
				});
			}, 15000);
		});

		/*setTimeout(() => {
			this.characters.stoppedCharacters();
			// this.stopSound();

			//GAME 2
			setTimeout(() => {
				this.characters.deleteCharacter(0);

				setTimeout(() => {
					this.chairs.resizeChairs();
					this.characters.resizeScene();
					this.characters.startWalking();
					// this.playSound();
				}, 2500);
			}, 2500);
		}, 2000);*/
		/*
		setTimeout(() => {
			this.characters.stoppedCharacters();
			// this.stopSound();

			setTimeout(() => {
				this.characters.deleteCharacter(1);
				//GAME FINAL
				setTimeout(() => {
					this.chairs.resizeChairs();
					this.characters.resizeScene();
					this.characters.startWalking();
					// this.playSound();
				}, 5000);
			}, 2000);
		}, 12000);

		setTimeout(() => {
			this.characters.stoppedCharacters();
			this.stopSound();

			setTimeout(() => {
				this.characters.deleteCharacter(2);

				setTimeout(() => {
					this.chairs.resizeChairs();
					this.characters.resizeScene();
					this.characters.startWalking();
					this.playSound();
				}, 5000);
			}, 2000);
		}, 35000);

		setTimeout(() => {
			this.characters.stoppedCharacters();
			// this.stopSound();

			setTimeout(() => {
				this.characters.deleteCharacter(1);
				// setTimeout(() => {
				// 	this.chairs.resizeChairs();
				// 	this.characters.resizeScene();
				// 	this.characters.startWalking();
				// 	this.playSound();
				// }, 5000);
			}, 5000);
		}, 45000);*/
	}

	createSound() {
		var listener = new THREE.AudioListener();
		this.scene.add(listener);

		var sound = new THREE.Audio(listener);
		var audioLoader = new THREE.AudioLoader();

		return new Promise(resolve => {
			audioLoader.load(Music, function (buffer) {
				sound.setBuffer(buffer);
				// sound.setLoop(true);
				// sound.setVolume(0.5);
				// sound.play();
				resolve(sound);
			});
		});
	}

	round1() {
		setTimeout(() => {
			//GAME 1
			setTimeout(() => {
				this.characters.deleteCharacter(5);

				setTimeout(() => {
					this.chairs.resizeChairs();
					this.characters.resizeScene();
					this.characters.startWalking();
					this.sound.play();
				}, 2500);
			}, 2500);
		}, 5000);
	}

	round2() {
		this.game.progressBar().then(looser => {
			// Reset for the new scene
			this.chairs.resizeChairs();
			this.characters.resizeScene();
			this.characters.startWalking();
			this.playSound();

			console.log(looser);

			setTimeout(() => {
				this.characters.stoppedCharacters();

				setTimeout(() => {
					this.characters.deleteCharacter(parseInt(looser));
				}, 1500);
			}, 2500);
		});
	}
}

export default Scene01;
