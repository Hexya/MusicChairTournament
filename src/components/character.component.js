import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import anime from 'animejs';
import ComponentManager from '../utils/components.manager';

import Body from '../models/body.glb';

import yelo from '../textures/matCap/yelo.png';
import Orange from '../textures/matCap/perso-orange.png';
import Blue from '../textures/matCap/perso-blue.png';
import Green from '../textures/matCap/perso-green.png';
import Purple from '../textures/matCap/perso-purple.png';
import darkBlue from '../textures/matCap/dark-blue.png';

class Character extends ComponentManager {
	constructor(scene, options) {
		super(scene);

		this.options = {
			...options,
			side: 0,
			stoped: false,
			currentChair: 0,
		};

		this.stepBetweenChair = (2 * Math.PI) / this.options.nbCharacters;

		this.promiseAllCharacters = [];

		this.characters = [];
		this.mixerWalking = [];
		this.meshCharacters = new THREE.Group();
		this.meshCharacters.name = 'Characters';

		this.meshGates = new THREE.Group();
		this.meshGates.name = 'Gates';

		var loader = new THREE.TextureLoader();
		this.pink = loader.load(yelo);
		this.orange = loader.load(Orange);
		this.blue = loader.load(Blue);
		this.green = loader.load(Green);
		this.purple = loader.load(Purple);
		this.darkBlue = loader.load(darkBlue);

		this.createScene(6);
	}

	createScene(nb) {
		for (let i = 0; i < this.options.nbCharacters; i++) {
			// Set position X Y of characters
			let x = Math.sin((2 * i * Math.PI) / this.options.nbCharacters);
			let z = Math.cos((2 * i * Math.PI) / this.options.nbCharacters);

			// Create character
			let loadCharacter = this.generateCharacter().then(character => {
				character.name = 'Character n°' + i;
				character.scene.name = 'Character n°' + i;

				character.scene.position.x = x * this.options.distRadius;
				character.scene.position.z = z * this.options.distRadius;
				character.scene.scale.set(0.185, 0.185, 0.185);

				var geometryGate = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 32);
				var material = new THREE.MeshStandardMaterial({
					side: THREE.DoubleSide,
					color: 0xffffff,
				});
				var trouMat = new THREE.TextureLoader().load(darkBlue);
				material.map = trouMat;
				var gate = new THREE.Mesh(geometryGate, material);
				gate.position.x = x * this.options.distRadius * 0.85;
				gate.position.y = 0;
				gate.position.z = z * this.options.distRadius * 0.85;
				gate.visible = false;
				gate.name = 'Gate n°' + i;

				character.scene.traverse(child => {
					switch (i) {
						case 0:
							child.material = new THREE.MeshMatcapMaterial({
								matcap: this.orange,
								color: 0xffffff,
								skinning: true,
							});
							break;

						case 1:
							child.material = new THREE.MeshMatcapMaterial({
								matcap: this.blue,
								color: 0xffffff,
								skinning: true,
							});
							break;

						case 2:
							child.material = new THREE.MeshMatcapMaterial({
								matcap: this.green,
								color: 0xffffff,
								skinning: true,
							});
							break;

						case 3:
							child.material = new THREE.MeshMatcapMaterial({
								matcap: this.purple,
								color: 0xffffff,
								skinning: true,
							});
							break;
					}

					if (child.name == 'bonnet') {
						child.material = new THREE.MeshMatcapMaterial({
							matcap: this.pink,
							color: 0xffffff,
							skinning: true,
						});
					}

					if (child.name == 'nez') {
						child.material = new THREE.MeshPhongMaterial({
							color: Math.random() * 0xffffff,
							skinning: true,
						});
					}

					if (child.name == 'lunette') {
						child.material = new THREE.MeshPhongMaterial({
							color: 0x00ff00,
							skinning: true,
						});
					}

					//console.log(child.name);
				});

				// character.scene.traverse(child => {
				// 	/*child.material.color = new THREE.Color(Math.random() * 0xffffff);
				// 	child.material.emissive = new THREE.Color(Math.random() * 0xffffff);*/
				// });

				//console.log(character.scene);

				character.scene.rotation.y =
					(this.options.side == 1 ? -Math.PI : Math.PI) / 2 +
					((2 * Math.PI) / this.options.nbCharacters) * i;

				// Animation walking
				let mixer = new THREE.AnimationMixer(character.scene);

				let walking = THREE.AnimationClip.findByName(character.animations, 'Walking');
				character.animations[0].mixer = { value: mixer };
				character.animations[0].clip = { value: walking };

				// Animation turning
				let turning = THREE.AnimationClip.findByName(character.animations, 'Turning');
				character.animations[1].mixer = { value: mixer };
				character.animations[1].clip = { value: turning };

				// Animation sitting
				// let sitting = THREE.AnimationClip.findByName(character.animations, 'Sitting');
				// character.animations[2].mixer = { value: mixer };
				// character.animations[2].clip = { value: sitting };

				this.meshCharacters.add(character.scene);
				this.characters.push(character);
				this.meshGates.add(gate);
			});

			this.promiseAllCharacters.push(loadCharacter);
		}

		Promise.all(this.promiseAllCharacters).then(() => {
			this.startWalking();

			this.scene.add(this.meshGates);
			this.scene.add(this.meshCharacters);
		});
	}

	stoppedCharacters() {
		this.options.stoped = true;
		this.options.speed = 2.0;
	}

	getAction(animation) {
		// this.characters[i].animations[0]
		let mixer = animation.mixer.value;
		let clip = animation.clip.value;
		let action = mixer.clipAction(clip);

		return action;
	}

	startWalking() {
		for (let i = 0; i < this.characters.length; i++) {
			let walking = this.getAction(this.characters[i].animations[0]);
			let turning = this.getAction(this.characters[i].animations[1]);

			turning.reset();
			turning.stop();

			walking.reset();
			walking.play();
			turning.crossFadeTo(walking, 1, true);
		}
	}

	stopWalking() {
		for (let i = 0; i < this.characters.length; i++) {
			let walking = this.getAction(this.characters[i].animations[0]);
			let turning = this.getAction(this.characters[i].animations[1]);

			turning.loop = THREE.LoopOnce;
			turning.clampWhenFinished = true;
			turning.play();

			walking.crossFadeTo(turning, 1, true);
		}
	}

	deleteCharacter(nbCharacterDeleted) {
		let characterRemoved = nbCharacterDeleted; // 0 to 5
		let currentChair = this.options.currentChair + characterRemoved;

		if (currentChair >= this.options.nbCharacters) {
			currentChair = currentChair - this.options.nbCharacters;
		}

		let gate = this.scene.getObjectByName('Gates').children[currentChair];
		gate.visible = true;

		//console.log(this.scene.getObjectByName('Chairs').children[currentChair].position);

		anime({
			targets: gate.scale,
			x: [0.1, 1],
			z: [0.1, 1],
			duration: 300,
			easing: 'linear',
		});

		anime({
			targets: this.scene.getObjectByName('Chairs').children[currentChair].position,
			y: -2,
			duration: 2000,
			delay: 600,
			// easing: 'linear',
		});

		anime({
			targets: this.scene.getObjectByName('Character n°' + characterRemoved.toString()).position,
			y: -2,
			duration: 2000,
			delay: 600,
			// easing: 'linear',
		});

		setTimeout(() => {
			this.scene
				.getObjectByName('Characters')
				.remove(this.scene.getObjectByName('Character n°' + characterRemoved.toString()));

			this.characters.splice(nbCharacterDeleted, 1);

			this.scene.getObjectByName('Gate n°' + currentChair.toString()).visible = false;

			// for (let i = 0; i < this.scene.getObjectByName('Gates').children.length; i++) {
			// 	this.scene.getObjectByName('Gate n°' + i.toString()).scale.set(0.01, 0.01, 0.01);
			// }
		}, 1000);

		this.options.nbCharacters--;
	}

	updateWalking(deltatime) {
		for (let i = 0; i < this.options.nbCharacters; i++) {
			this.characters[i].animations[0].mixer.value.update(deltatime);
		}
	}

	generateCharacter() {
		const loader = new GLTFLoader();

		return new Promise(resolve => {
			loader.load(Body, obj => {
				resolve(obj);
			});
		});
	}

	update(clock) {
		let speed = clock.getDelta() * this.options.speed;

		if (this.characters.length > 0) {
			this.updateWalking(speed);

			let walkingMixer = this.characters[0].animations[0].mixer.value;
			let walkingClip = this.characters[0].animations[0].clip.value;
			let walkingAction = walkingMixer.clipAction(walkingClip);

			if (this.options.side == 1) {
				this.meshCharacters.rotation.y -= speed * 0.65 * walkingAction.getEffectiveWeight();
			} else {
				this.meshCharacters.rotation.y += speed * 0.65 * walkingAction.getEffectiveWeight();
			}

			if (this.meshCharacters.rotation.y + Math.PI / 9 > this.stepBetweenChair) {
				this.stepBetweenChair += (2 * Math.PI) / this.options.nbCharacters;

				if (this.options.currentChair < this.characters.length - 1) {
					this.options.currentChair++;
				} else {
					this.options.currentChair = 0;
				}

				if (this.options.stoped) {
					this.stopWalking();
					this.options.stoped = false;
					this.options.speed = 1.2;
				}
			}
		}
	}

	resizeScene() {
		for (let i = 0; i < this.options.nbCharacters; i++) {
			let character = this.scene.getObjectByName('Characters').children[i];
			let gate = this.scene.getObjectByName('Gates').children[i];

			let x = Math.sin((2 * i * Math.PI) / this.options.nbCharacters);
			let z = Math.cos((2 * i * Math.PI) / this.options.nbCharacters);

			character.position.x = x * this.options.distRadius;
			character.position.z = z * this.options.distRadius;

			gate.position.x = x * this.options.distRadius * 0.85;
			gate.position.z = z * this.options.distRadius * 0.85;

			character.rotation.y =
				(this.options.side == 1 ? -Math.PI : Math.PI) / 2 +
				((2 * Math.PI) / this.options.nbCharacters) * i;
		}

		this.stepBetweenChair = (2 * Math.PI) / this.options.nbCharacters;
		this.options.currentChair = 0;

		/*
		this.characters = [];
		this.mixerWalking = [];
		this.meshCharacters = new THREE.Group();
		this.meshCharacters.name = 'Characters';
		*/
		// for (let i = 0; i < this.meshCharacters.children.length; i++) {
		// 	if (this.meshCharacters.children[i].name == 'Character n°' + (2).toString()) {
		// 		this.meshCharacters.remove(this.meshCharacters.children[i]);
		// 	}
		// }
		// this.characters.splice(2, 1);
	}

	click(event) {
		//console.log(this.scene.children);
	}

	addGUI(gui) {
		//gui.add(this.test, 'scale', 0, 1);
	}
}

export default Character;
