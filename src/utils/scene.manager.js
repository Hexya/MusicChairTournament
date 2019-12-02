import * as THREE from 'three';
import * as OrbitControls from 'orbit-controls-es6';
import * as datGUI from 'dat.gui';

import LoaderManager from './loader.manager';
import InteractionManager from './interaction.manager';

class SceneManager {
	constructor(canvas) {
		this.canvas = canvas;
		this.clock = new THREE.Clock();

		this.screenDimensions = { width: this.canvas.width, height: this.canvas.height };

		// Build our scene
		this.scene = this.buildScene();
		this.renderer = this.buildRenderer(this.screenDimensions);
		this.camera = this.buildCamera(this.screenDimensions);
		this.loader = new LoaderManager();

		// Container of components
		this.components = [];

		// Interactions controls
		this.controls = this.buildControls(this.camera, this.renderer);

		this.interaction = new InteractionManager(
			this.renderer,
			this.scene,
			this.camera,
			this.components,
		);

		this.gui = new datGUI.GUI();
		this.buildGUI();
	}

	buildScene() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color('#000');

		return scene;
	}

	buildRenderer({ width, height }) {
		const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
		const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;

		renderer.setPixelRatio(DPR);
		renderer.setSize(width, height);

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		return renderer;
	}

	buildCamera({ width, height }) {
		const aspectRatio = width / height;
		const fieldOfView = 60;
		const nearPlane = 1;
		const farPlane = 100;
		const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

		camera.position.set(0, 0, 1);

		return camera;
	}

	buildControls(camera, renderer) {
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enabled = true;
		controls.maxDistance = 1500;
		controls.minDistance = 0;

		return controls;
	}

	/*
	 * UpdateComponents and onResize call it in the high component level
	 */

	updateComponents() {
		for (let i = 0; i < this.components.length; i++) {
			this.components[i].update(this.clock);
		}

		this.renderer.render(this.scene, this.camera);
	}

	onResize() {
		const { width, height } = this.canvas;

		this.screenDimensions.width = width;
		this.screenDimensions.height = height;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	sceneIsLoaded() {
		return this.loader.isLoaded();
	}

	buildGUI() {
		for (let i = 0; i < this.components.length; i++) {
			this.components[i].addGUI(this.gui);
		}
	}

	/*
	 * addComponents and removeComponents call it in the scene extends of this class
	 */
	addComponents(component) {
		this.components.push(component);
		this.interaction.onClick();
		this.buildGUI();
	}

	removeComponents() {}
}

export default SceneManager;
