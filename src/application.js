import './scss/style.scss';

import { $qs } from './utils/dom';
import Scene01 from './js/scenemanager.js';

import Stats from 'stats-js';

let sceneManager = null;

let stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

function bindEventListeners() {
	window.onresize = resizeCanvas;
	resizeCanvas();
}

function resizeCanvas() {
	canvas.style.width = '100vw';
	canvas.style.height = '100vh';

	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	sceneManager.onResize();
}

function render() {
	stats.begin();

	sceneManager.updateComponents();

	stats.end();

	requestAnimationFrame(render);
}

// When DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
	sceneManager = new Scene01($qs('#canvas'));

	sceneManager.sceneIsLoaded().then(() => {
		bindEventListeners();
		render();

		document.querySelector('.close-button.close-bottom').style.display = 'none';
		// document.body.appendChild(stats.dom);
	});
});
