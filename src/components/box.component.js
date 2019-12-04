import * as THREE from 'three';

import ComponentManager from '../utils/components.manager';

import UV_box from '../textures/uv_grid.jpg';

class Box extends ComponentManager {
	constructor(scene) {
		super(scene);

		this.geometry = this.geometry();
		this.material = this.material();
		this.mesh = this.mesh();
		scene.add(this.mesh);
	}

	mesh() {
		const mesh = new THREE.Mesh(this.geometry, this.material);

		return mesh;
	}

	geometry() {
		return new THREE.BoxGeometry(1, 1, 1);
	}

	material() {
		let texture = new THREE.TextureLoader().load(UV_box);
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

		return new THREE.MeshBasicMaterial({ map: texture });
	}

	loadTexture(url) {
		return new Promise(resolve => {
			new THREE.TextureLoader.load(url, resolve);
		});
	}

	update(time) {
		this.mesh.position.y = Math.sin(time) * 2;
	}

	click(event) {
		//console.log('Cube touched !');
	}

	addGUI(gui) {
		let folder = gui.addFolder('test');

		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);
	}
}

export default Box;
