import * as THREE from 'three';
import { bodies, camera, renderer, scene, init } from "./physics/Initialize.js";
import * as Physics from './physics/physics.js';
import 'normalize.css';
import './styles/styles.scss';
init();

let mousePos = document.createElement('div');
mousePos.style.position = 'absolute';
mousePos.style.color = 'white';
mousePos.style.backgroundColor='green';
document.body.appendChild(mousePos);
let vec = new THREE.Vector3();
export let pos = new THREE.Vector3();
let mouse = {
    clientX: 0,
    clientY: 0
};

renderer.domElement.onmousemove = function(event){
    getMouseCoords(event);
}

const getMouseCoords = (event) => {
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;
}

export const getMousePos = () => {
    vec.set(
    ( mouse.clientX / renderer.domElement.width ) * 2 - 1,
    - ( mouse.clientY / renderer.domElement.height ) * 2 + 1,
    0.5 );
    vec.unproject( camera );
    vec.sub( camera.position ).normalize();
    let distance = ( 0 - camera.position.z ) / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    mousePos.innerHTML= pos.x.toFixed(2) + ", " + pos.y.toFixed(2);
}

const update = () => {
	getMousePos();
	Physics.updateCharacter();
};

const render = () => {
	renderer.render( scene, camera );
};

const GameLoop = () => {	
	requestAnimationFrame( GameLoop );
	update();
	render();
};

GameLoop();