import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import ComponentManager from '../utils/components.manager';

import TerrainGltf from '../models/terrains/WaterPools.glb';
import AileronsGltf from '../models/terrains/ailerons.glb';

import pink from '../textures/matCap/pink.png';
import lightPink from '../textures/matCap/lightPink.png';
import cyan from '../textures/matCap/cyan.png';
import yellow from '../textures/matCap/yelo.png';
import boue from '../textures/boue.png';
import water from '../textures/water.jpg';
import waterGeo from '../textures/waterGeo.jpeg';
import { since } from 'most';

//import waterVertex from '../shader/waterVertex.glsl';
//import waterFragment from '../shader/waterFragment.glsl';


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
	}

	createTerrain() {
		this.loadGltf(TerrainGltf).then(obj => {
			//obj.scene.rotation.x = Math.PI / 2;
			obj.scene.scale.set(1.75, 1.75, 1.75);
			obj.scene.position.y = -0.25;

			obj.scene.traverse((child) => {
				console.log(child.name)
				child.material = new THREE.MeshMatcapMaterial({ matcap: this.pink, color: 0xffffff });
				if (child.name == "bouées" || child.name == "bouées001") { //boué
					child.material = new THREE.MeshPhongMaterial({ map: this.yel });
				}
				if (child.name == "barrièresGRADINS") { // barriere
				}
				if (child.name == "barrièresPoteauxGRADINS") { // pillone
					//child.material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, emissive: 0xf0f0f, specular: 0xa83131, shininess: 30 });
				}
				if (child.name == "suspensions_chaises") { // glissiere de chaise
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
				if (child.name == "terrain_") { // plateau
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

			this.ailerons = obj.scene.children[0];

			this.scene.add(obj.scene);
		});

		const uniforms = {
			u_time: { type: "f", value: 0 },
			u_Alpha: { type: "f", value: 1. },
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
				vertexShader: ` 
				  varying vec2 vUv;
  
                  void main(){  
					vUv = uv; 
					
                    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewPosition;
                  }`,
				fragmentShader: ` 
				#define PI 3.14159265359
				#define PI2 6.28318530718
				#define S(a,b,n) smoothstep(a,b,n)
			
				uniform float u_time;
				uniform float u_progress;
				uniform float u_Alpha;
				
				uniform vec2 u_resolution;    
				uniform vec2 u_mouse;
			
				uniform sampler2D u_text0;
				uniform sampler2D u_text1;
			
				varying vec2 vUv;
			
				vec2 random2(vec2 st){
					st = vec2( dot(st,vec2(127.1,311.7)),
							  dot(st,vec2(269.5,183.3)) );
					return -1.0 + 2.0*fract(sin(st)*43758.5453123);
				}
				
				mat2 scale2D(vec2 _scale){
					return mat2(_scale.x,0.0,
								0.0,_scale.y);
				}
			
				vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
				vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
				vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
			
				float snoise(vec2 v) {
					const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
										0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
										-0.577350269189626,  // -1.0 + 2.0 * C.x
										0.024390243902439); // 1.0 / 41.0
					vec2 i  = floor(v + dot(v, C.yy) );
					vec2 x0 = v -   i + dot(i, C.xx);
					vec2 i1;
					i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
					vec4 x12 = x0.xyxy + C.xxzz;
					x12.xy -= i1;
					i = mod289(i); // Avoid truncation effects in permutation
					vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
						+ i.x + vec3(0.0, i1.x, 1.0 ));
			
					vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
					m = m*m ;
					m = m*m ;
					vec3 x = 2.0 * fract(p * C.www) - 1.0;
					vec3 h = abs(x) - 0.5;
					vec3 ox = floor(x + 0.5);
					vec3 a0 = x - ox;
					m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
					vec3 g;
					g.x  = a0.x  * x0.x  + h.x  * x0.y;
					g.yz = a0.yz * x12.xz + h.yz * x12.yw;
					return 130.0 * dot(m, g);
				}
			
				void main(){
				  vec2 uv = vUv;
				  vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
			
				  vec2 m = vec2(u_mouse.x, u_resolution.y - u_mouse.y);
				  float dist = distance(gl_FragCoord.xy, m);
			
				  vec3 color = vec3(0.0);
				  vec2 pos = vec2(uv * 2.);
			
				  float DF = 0.0;
			
				  // Add a random position
				  float a = 0.0;
				  vec2 vel = vec2(u_time*.1);
				  DF += snoise(pos+vel)* 1. + .5;
			
				  // Add a random position
				  a = snoise(pos*vec2(cos(u_time * 0.15),sin(u_time * 0.1))*0.1) * PI;
				  vel = vec2(cos(a),sin(a));
				  DF += snoise(pos+vel) * 1. + .5;
			
				  vec2 mask = S(.5, 2.,fract(DF)) * vec2(uv - .5);
			
				  float x = uv.y * 2. * PI + u_time * .5;
				  float y = uv.x * 2. * PI + u_time * .5;
			
				  vec2 wave = vec2( cos(x+y) * .05 * cos(y), sin(x-y) * .05 * cos(y) );
			
				  vec2 distortion = uv * wave;     
				  
				  float m_rel = S(.05, 1., clamp((dist - 20.)/50., 0., 1. ));
			
				  vec4 tx = texture2D(u_text0, uv + mask + distortion) * texture2D(u_text0, (vec2(uv.x + DF, uv.y + DF)) * abs((uv - 1.)) / 7.);
			
				  gl_FragColor = pow(DF, 2.) * tx * tx * tx + tx / .2;
				  gl_FragColor *= u_Alpha;
				}
				`
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
			this.ailerons.rotation.z -= 0.0025;
			// this.ailerons.position.z += 1 - Math.sin(this.ailerons.position.z) * 0.5;
			// console.log(this.ailerons.position.y);
		}
		if (this.bouees) {
			this.bouees.rotation.z -= Math.sin(this.waterDeform) / 1000;
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
