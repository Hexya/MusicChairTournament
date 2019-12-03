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
				vertexShader: ` 

				//NOISE
				
				vec3 mod289(vec3 x)
				{
				  return x - floor(x * (1.0 / 289.0)) * 289.0;
				}
				
				vec4 mod289(vec4 x)
				{
				  return x - floor(x * (1.0 / 289.0)) * 289.0;
				}
				
				vec4 permute(vec4 x)
				{
				  return mod289(((x*34.0)+1.0)*x);
				}
				
				vec4 taylorInvSqrt(vec4 r)
				{
				  return 1.79284291400159 - 0.85373472095314 * r;
				}
				
				vec3 fade(vec3 t) {
				  return t*t*t*(t*(t*6.0-15.0)+10.0);
				}
				
				// Classic Perlin noise
				float cnoise(vec3 P)
				{
				  vec3 Pi0 = floor(P); // Integer part for indexing
				  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
				  Pi0 = mod289(Pi0);
				  Pi1 = mod289(Pi1);
				  vec3 Pf0 = fract(P); // Fractional part for interpolation
				  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
				  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
				  vec4 iy = vec4(Pi0.yy, Pi1.yy);
				  vec4 iz0 = Pi0.zzzz;
				  vec4 iz1 = Pi1.zzzz;
				
				  vec4 ixy = permute(permute(ix) + iy);
				  vec4 ixy0 = permute(ixy + iz0);
				  vec4 ixy1 = permute(ixy + iz1);
				
				  vec4 gx0 = ixy0 * (1.0 / 7.0);
				  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
				  gx0 = fract(gx0);
				  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
				  vec4 sz0 = step(gz0, vec4(0.0));
				  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
				  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
				
				  vec4 gx1 = ixy1 * (1.0 / 7.0);
				  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
				  gx1 = fract(gx1);
				  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
				  vec4 sz1 = step(gz1, vec4(0.0));
				  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
				  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
				
				  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
				  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
				  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
				  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
				  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
				  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
				  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
				  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
				
				  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
				  g000 *= norm0.x;
				  g010 *= norm0.y;
				  g100 *= norm0.z;
				  g110 *= norm0.w;
				  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
				  g001 *= norm1.x;
				  g011 *= norm1.y;
				  g101 *= norm1.z;
				  g111 *= norm1.w;
				
				  float n000 = dot(g000, Pf0);
				  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
				  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
				  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
				  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
				  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
				  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
				  float n111 = dot(g111, Pf1);
				
				  vec3 fade_xyz = fade(Pf0);
				  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
				  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
				  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
				  return 2.2 * n_xyz;
				}
				
				// Classic Perlin noise, periodic variant
				float pnoise(vec3 P, vec3 rep)
				{
				  vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
				  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
				  Pi0 = mod289(Pi0);
				  Pi1 = mod289(Pi1);
				  vec3 Pf0 = fract(P); // Fractional part for interpolation
				  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
				  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
				  vec4 iy = vec4(Pi0.yy, Pi1.yy);
				  vec4 iz0 = Pi0.zzzz;
				  vec4 iz1 = Pi1.zzzz;
				
				  vec4 ixy = permute(permute(ix) + iy);
				  vec4 ixy0 = permute(ixy + iz0);
				  vec4 ixy1 = permute(ixy + iz1);
				
				  vec4 gx0 = ixy0 * (1.0 / 7.0);
				  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
				  gx0 = fract(gx0);
				  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
				  vec4 sz0 = step(gz0, vec4(0.0));
				  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
				  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
				
				  vec4 gx1 = ixy1 * (1.0 / 7.0);
				  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
				  gx1 = fract(gx1);
				  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
				  vec4 sz1 = step(gz1, vec4(0.0));
				  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
				  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
				
				  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
				  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
				  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
				  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
				  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
				  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
				  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
				  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
				
				  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
				  g000 *= norm0.x;
				  g010 *= norm0.y;
				  g100 *= norm0.z;
				  g110 *= norm0.w;
				  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
				  g001 *= norm1.x;
				  g011 *= norm1.y;
				  g101 *= norm1.z;
				  g111 *= norm1.w;
				
				  float n000 = dot(g000, Pf0);
				  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
				  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
				  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
				  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
				  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
				  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
				  float n111 = dot(g111, Pf1);
				
				  vec3 fade_xyz = fade(Pf0);
				  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
				  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
				  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
				  return 2.2 * n_xyz;
				}

				//END NOISE
				
				uniform float u_time;
				varying vec2 snoise;
				varying vec2 vUv;
				varying float noise;
				
				float turbulence( vec3 p ) {
					float w = 100.0;
					float t = -.5;
					for (float f = 1.0 ; f <= 10.0 ; f++ ){
						float power = pow( 2.0, f );
						t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
					}
					return t;
				}
				void main(){  
					vUv = uv;

					float b = 0.5 * cnoise( position.y * position + vec3( 1.0 * u_time ) );
					float displacement = - b;
					
					vec3 newPosition = position + normal * displacement;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
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
				varying vec3 position;
				varying float noise;
			
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
				  vec2 pos = vec2(uv * 4.);
			
				  float DF = 0.0;
			
				  // Add a random position
				  float a = 0.0;
				  vec2 vel = vec2(u_time*.1);
				  DF += snoise(pos+vel)* 1. + .5;
			
				  // Add a random position
				  a = snoise(pos*vec2(cos(u_time * 0.15),sin(u_time * 0.1))*0.1) * PI;
				  vel = vec2(cos(a),sin(a));
				  DF += snoise(pos+vel) * 2. + .05;
			
				  vec2 mask = S(.5, 2.,fract(DF)) * vec2(uv - .5);
			
				  float x = uv.y * 2. * PI + u_time * .5;
				  float y = uv.x * 2. * PI + u_time * .5;
			
				  vec2 wave = vec2( cos(x+y) * .05 * cos(y), sin(x-y) * .05 * cos(y) );
			
				  vec2 distortion = uv * wave;     
				  
				  float m_rel = S(.05, 1., clamp((dist - 20.)/50., 0., 1. ));
			
				  vec4 tx = texture2D(u_text0, uv + mask + distortion) * texture2D(u_text0, (vec2(uv.x + DF, uv.y + DF)) * abs((uv - 1.)) / 7.);
			
				  gl_FragColor = pow(DF, 1.) * tx * tx * tx + tx / .2;
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
