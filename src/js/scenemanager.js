import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';
import { Interaction } from 'three.interaction';

import SceneManager from '../utils/scene.manager';

import introGame from '../components/introGame.js';
import interactGame from '../components/interactGame.js';

const vertexShader = require('../shader/waterFragment.glsl');

import Helpers from '../utils/helpers.three';

// Components
import Character from '../components/character.component';
import Terrain from '../components/terrain.component';
import Chairs from '../components/chairs.component';
import HemisphereLight from '../components/hemisphereLight.component';

// Sounds
import Music from '../audios/terrain-piscine.mp3';

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
		this.soundIsReady = false;
		this.sound = null;
		this.soundLoaded = this.createSound().then(sound => {
			this.sound = sound;
			this.soundIsReady = true;
		});

		this.game = new interactGame();

		//Start game INTRO GAME
		/*new introGame().then(() => {
			this.sound.play();

			setTimeout(() => {
				//
				this.sound.stop();

				this.game.uniqueKey().then(looser => {
					this.characters.stoppedCharacters();

					setTimeout(() => {
						this.characters.deleteCharacter(parseInt(looser));

						setTimeout(() => {
							this.chairs.resizeChairs();
							this.characters.resizeScene();
							this.characters.startWalking();

							this.game.progressBar().then(looser2 => {
								this.characters.stoppedCharacters();

								// console.log(looser2);

								setTimeout(() => {
									this.characters.deleteCharacter(parseInt(looser2));
								}, 2500);
							});
						}, 2500);
					}, 1500);
				});
			}, 2500);
		});*/

		setTimeout(() => {
			this.characters.stoppedCharacters();
			// this.stopSound();

			//GAME 2
			setTimeout(() => {
				this.characters.deleteCharacter(1);

				setTimeout(() => {
					this.chairs.resizeChairs();
					this.characters.resizeScene();
					this.characters.startWalking();
					// this.playSound();
				}, 2500);
			}, 2500);
		}, 2000);
		/*
		setTimeout(() => {
			this.characters.stoppedCharacters();
			// this.stopSound();

			setTimeout(() => {
				this.characters.deleteCharacter(2);
				//GAME FINAL
				setTimeout(() => {
					this.chairs.resizeChairs();
					this.characters.resizeScene();
					this.characters.startWalking();
					// this.playSound();
				}, 5000);
			}, 2000);
		}, 12000);*/
		/*
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
