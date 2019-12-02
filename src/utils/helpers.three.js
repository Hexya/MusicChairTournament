import * as THREE from 'three';

export default class Helpers {
	static axes(size = 5) {
		return new THREE.AxesHelper(size);
	}

	static box(mesh) {
		return new THREE.BoxHelper(mesh, 0xff0000);
	}

	static camera(camera) {
		return new THREE.CameraHelper(camera);
	}

	static directionalLight(light, size = 5, color = 0xff0000) {
		return new THREE.DirectionalLightHelper(light, size, color);
	}

	static normal(mesh, size = 2, color = 0xff0000, lineWidth = 1) {
		return new THREE.FaceNormalsHelper(mesh, size, color, lineWidth);
	}

	static grid(size = 10, divisions = 10) {
		console.warn('Be carful if you use interaction ! Not working with this helpers');
		return new THREE.GridHelper(size, divisions);
	}

	static polar(radius = 10, radials = 16, circles = 8, divisions = 64) {
		return new THREE.PolarGridHelper(radius, radials, circles, divisions);
	}

	static audio(positionalAudio) {
		return new PositionalAudioHelper(positionalAudio);
	}

	static hemiLight(light, size = 5, color = 0xff0000) {
		return new THREE.HemisphereLightHelper(light, size, color);
	}

	static plane(mesh, size = 1, color = 0xff0000) {
		return new THREE.PlaneHelper(plane, size, color);
	}

	static pointLight(light, sphereSize = 1, color = 0xff0000) {
		new THREE.PointLightHelper(light, sphereSize);
	}

	static rectAreaLight(light, color = 0xff0000) {
		return new THREE.RectAreaLightHelper(light);
	}

	static skeleton(mesh, lineWidth = 3) {
		const helper = new THREE.SkeletonHelper(mesh);
		helper.material.lineWidth = lineWidth;

		return helper;
	}

	static spotLight(light, color = 0xff0000) {
		return new THREE.SpotLightHelper(light, color);
	}

	static vertex(mesh, size = 2, color = 0x00ff00, lineWidth = 1) {
		return new THREE.VertexNormalsHelper(mesh, size, color, lineWidth);
	}

	static info() {
		console.warn('All helpers : ', 'https://threejs.org/docs/#api/en/helpers/ArrowHelper');
	}
}
