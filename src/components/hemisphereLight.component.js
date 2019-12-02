import * as THREE from 'three';
import ComponentManager from '../utils/components.manager';

import Body from '../models/body.glb';

class HemisphereLightComponent extends ComponentManager {
	constructor(scene) {
		super(scene);

		//this.scene.add(this.light);
		/*const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		this.scene.add(light);*/
		this.scene.add(this.light());
	}

	light() {
		const light = new THREE.HemisphereLight(0xffffff, 0x000, 1.2);

		light.position.set(0, 10, 0);

		return light;
	}

	add() {}

	update(time) {
		// this.mesh.position.y = Math.sin(time) * 2;
	}

	click(event) {
		console.log('Cube touched !');
	}

	addGUI(gui) {
		// let folder2 = gui.addFolder('Other');
		// folder2.add(this.mesh.position, 'x', -10, 10);
		// folder2.add(this.mesh.position, 'y', -10, 10);
		// folder2.add(this.mesh.position, 'z', -10, 10);
	}
}

export default HemisphereLightComponent;
