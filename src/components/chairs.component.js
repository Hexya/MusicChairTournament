import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import ComponentManager from '../utils/components.manager';

import Chair from '../models/chaise.glb';
import { chainFirst } from 'fp-ts/lib/Option';

import yelo from '../textures/matCap/cyan.png';
import Red from '../textures/matCap/chair.png';

class Chairs extends ComponentManager {
	constructor(scene, options) {
		super(scene);

		this.options = {
			...options,
		};

		var loader = new THREE.TextureLoader();
		this.red = loader.load(yelo);

		this.createChairs();
	}

	createChairs() {
		let promiseAllChairs = [];
		let meshChairs = new THREE.Object3D();
		meshChairs.name = 'Chairs';

		for (let i = 0; i < this.options.nbCharacters; i++) {
			this.generateChair().then(chair => {
				// Change the material
				chair.scene.traverse(child => {
					child.material = new THREE.MeshMatcapMaterial({ matcap: this.red, color: 0xffffff });
				});

				chair.scene.name = 'Chair n°' + i;

				chair.scene.position.x =
					Math.sin((2 * i * Math.PI) / this.options.nbCharacters) * this.options.distRadius * 0.75;
				chair.scene.position.z =
					Math.cos((2 * i * Math.PI) / this.options.nbCharacters) * this.options.distRadius * 0.75;

				chair.scene.rotation.y = Math.PI / 2 + ((2 * Math.PI) / this.options.nbCharacters) * i;

				chair.scene.scale.set(0.25, 0.25, 0.25);

				meshChairs.add(chair.scene);

				promiseAllChairs.push(chair);
			});
		}

		Promise.all(promiseAllChairs).then(() => {
			this.scene.add(meshChairs);
		});
	}

	generateChair() {
		const loader = new GLTFLoader();

		return new Promise(resolve => {
			loader.load(Chair, obj => {
				resolve(obj);
			});
		});
	}

	resizeChairs() {
		this.options.nbCharacters--;

		this.scene.remove(this.scene.getObjectByName('Chairs'));

		this.createChairs();
	}

	update(time) {}
}

export default Chairs;
