import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import ComponentManager from '../utils/components.manager';

import TerrainGltf from '../models/terrains/WaterPools.glb';
import AileronsGltf from '../models/terrains/sharky.glb';


import pink from '../textures/matCap/pink.png';
import lightPink from '../textures/matCap/lightPink.png';
import cyan from '../textures/matCap/cyan.png';
import yellow from '../textures/matCap/yelo.png';
import sky from '../textures/sky.png';
import boue from '../textures/boue.png';
import water from '../textures/water.jpg';
import waterGeo from '../textures/waterGeo.jpeg';
import { since } from 'most';

import waterVertex from '../shader/waterVertex.glsl';
import waterFragment from '../shader/waterFragment.glsl';


class Terrain extends ComponentManager {
	constructor(scene) {
		super(scene);

		this.createTerrain();
		this.ailerons = null;
		this.waterDeform = 0;

		var loader = new THREE.TextureLoader();

		this.lightPink = loader.load(lightPink);
		this.pink = loader.load(pink);
		this.cyan = loader.load(cyan);
		this.yellow = loader.load(yellow);
		this.yel = loader.load(boue);


		this.background = loader.load(sky);
		scene.background = this.background;
	}

	createTerrain() {
		this.loadGltf(TerrainGltf).then(obj => {
			//obj.scene.rotation.x = Math.PI / 2;
			obj.scene.scale.set(1.75, 1.75, 1.75);
			obj.scene.position.y = -0.25;

			obj.scene.traverse((child) => {
				child.material = new THREE.MeshMatcapMaterial({ matcap: this.pink, color: 0xffffff });
				if (child.name == "bouées" || child.name == "bouées001") { //boué
					child.material = new THREE.MeshPhongMaterial({ map: this.yel });
				}
				if (child.name == "barrièresGRADINS") { // barriere
				}
				if (child.name == "barrièresPoteauxGRADINS") { // pillone
				}
				if (child.name == "ChaisesGradins_parties_non_assises" || child.name == "ChaisesGradins_parties_non_assises_0" || child.name == "ChaisesGradins_parties_non_assises_1" || child.name == "ChaisesGradins_parties_non_assises_2") { // chaise
					child.material = new THREE.MeshMatcapMaterial({ matcap: this.pink, color: 0xffffff });
				}
				if (child.name == "gradins" || child.name == "gradins001") { // gradins
					child.material = new THREE.MeshMatcapMaterial({ matcap: this.cyan, color: 0xffffff });
				}
				if (child.name == "terrain_centralebouée") { // plateau
					child.material = new THREE.MeshMatcapMaterial({ matcap: this.lightPink, color: 0xffffff });
				}
				if (child.name == "terrain_") { // plane
					child.material = new THREE.MeshMatcapMaterial({ matcap: this.yellow, color: 0xffffff });
				}
			});
			this.bouees = obj.scene.getObjectByName('bouées');
			this.scene.add(obj.scene);
		});

		this.loadGltf(AileronsGltf).then(obj => {
			obj.scene.rotation.x = Math.PI / 2;
			obj.scene.scale.set(1.75, 1.75, 1.75);

			obj.scene.position.y = -0.5;

			obj.scene.traverse((child) => {
				child.material = new THREE.MeshPhongMaterial({ color: 0x1A1F2E });
			});

			this.ailerons = obj.scene.children[0];

			this.scene.add(obj.scene);
		});

		const uniforms = {
			u_time: { type: "f", value: 0 },
			u_Alpha: { type: "f", value: 0.16 },
			u_resolution: {
				type: "v2",
				value: new THREE.Vector2(this.width, this.height),
			},
			u_mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
			u_text0: {
				type: "t",
				value: new THREE.TextureLoader().load(water),
			},
			u_text1: {
				type: "t",
				value: new THREE.TextureLoader().load(waterGeo),
			},
			u_progress: {
				type: "f",
				value: 0
			}
		};
		const getMaterial = () => {
			return new THREE.ShaderMaterial({
				side: THREE.DoubleSide,
				uniforms: uniforms,
				transparent: true,
				vertexShader: waterVertex,
				fragmentShader: waterFragment,
			});
		};


		var geometry = new THREE.CylinderGeometry(9, 9, 0.5, 32);
		//var material = new THREE.MeshBasicMaterial({ color: 0x14ceff });
		var material = getMaterial();
		this.cylinder = new THREE.Mesh(geometry, material);
		this.cylinder.position.y = -0.75;
		this.scene.add(this.cylinder);
	}

	loadGltf(gltf) {
		const loader = new GLTFLoader();

		return new Promise(resolve => {
			loader.load(gltf, obj => {
				resolve(obj);
			});
		});
	}

	update(time) {
		// this.mesh.position.y = Math.sin(time) * 2;
		if (this.ailerons != null) {
			this.ailerons.rotation.z += 0.0025;
			// this.ailerons.position.z += 1 - Math.sin(this.ailerons.position.z) * 0.5;
			// console.log(this.ailerons.position.y);
		}
		if (this.bouees) {
			//this.bouees.rotation.z -= Math.sin(this.waterDeform) / 1000;
			this.bouees.position.x += Math.sin(this.waterDeform) / 1000;
			this.bouees.position.z += Math.cos(this.waterDeform) / 5000;
		}

		this.waterDeform += 0.01;
		this.cylinder.material.uniforms.u_time.value = this.waterDeform;

		// console.log(this.ailerons);
	}

	click(event) {
		console.log('Cube touched !');
	}

	addGUI(gui) {
		/*let folder = gui.addFolder('tttzfz');
	
		folder.add(this.mesh.position, 'x', -10, 10);
		folder.add(this.mesh.position, 'y', -10, 10);
		folder.add(this.mesh.position, 'z', -10, 10);*/
	}
}

export default Terrain;
