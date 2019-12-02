import { Interaction } from 'three.interaction';

class InteractionManager {
	constructor(renderer, scene, camera, components = []) {
		this.components = components;

		this.interaction = new Interaction(renderer, scene, camera);
	}

	onClick() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	if (!this.components[i].mesh) {
		// 		break;
		// 	}
		// 	console.log(this.components[i].mesh);
		// 	this.components[i].mesh.on('click', event => this.components[i].click(event));
		// }
	}

	onTouchstart() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('touchstart', event => this.components[i].touchstart(event));
		// }
	}

	onTouchcancel() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('touchcancel', event => this.components[i].touchcancel(event));
		// }
	}

	onTouchmove() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('touchmove', event => this.components[i].touchcancel(event));
		// }
	}

	onTouchend() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('touchend', event => this.components[i].touchcancel(event));
		// }
	}

	onMousedown() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('mousedown', event => this.components[i].touchcancel(event));
		// }
	}

	onMouseout() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('mouseout', event => this.components[i].touchcancel(event));
		// }
	}

	onMouseover() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('mouseover', event => this.components[i].touchcancel(event));
		// }
	}

	onMousemove() {
		// for (let i = 0; i < this.components.length; i++) {
		// 	this.components[i].mesh.on('mousemove', event => this.components[i].touchcancel(event));
		// }
	}
}

export default InteractionManager;
