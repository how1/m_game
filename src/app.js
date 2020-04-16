import * as THREE from 'three';
import * as Init from "./physics/Initialize.js";
import * as Physics from './physics/physics.js';
import 'normalize.css';
import './styles/styles.scss';
Init.init();

let mousePos = document.createElement('div');
// mousePos.style.position = 'absolute';
mousePos.style.color = 'white';
mousePos.style.backgroundColor='green';
let posText = document.createElement('div');
// posText.style.position = 'absolute';
posText.style.backgroundColor='0xff0000';
// posText.style.top = '-10px';
posText.innerHTML= 
Init.character.points[0].x + "," + Init.character.points[0].y + "), (" 
+ Init.character.points[1].x + ", "
+ Init.character.points[1].y + "), ("
 + Init.character.points[2].x + ","
 + Init.character.points[2].y + "), ("
  + Init.character.points[3].x + ", " +
  + Init.character.points[3].y;
document.body.appendChild(posText);
document.body.appendChild(mousePos);
let vec = new THREE.Vector3();
export let pos = new THREE.Vector3();
let mouse = {
    clientX: 0,
    clientY: 0
};

Init.renderer.domElement.onmousemove = function(event){
    getMouseCoords(event);
}

const getMouseCoords = (event) => {
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;
}

export const getMousePos = () => {
    vec.set(
    ( mouse.clientX / Init.renderer.domElement.width ) * 2 - 1,
    - ( mouse.clientY / Init.renderer.domElement.height ) * 2 + 1,
    0.5 );
    vec.unproject( Init.camera );
    vec.sub( Init.camera.position ).normalize();
    let distance = ( 0 - Init.camera.position.z ) / vec.z;
    pos.copy( Init.camera.position ).add( vec.multiplyScalar( distance ) );
    mousePos.innerHTML= pos.x.toFixed(2) + ", " + pos.y.toFixed(2);
}

const update = () => {
	getMousePos();
	Physics.updateCharacter();
};

const render = () => {
	Init.renderer.render( Init.scene, Init.camera );
};

const GameLoop = () => {	
	requestAnimationFrame( GameLoop );
	update();
	render();
};

GameLoop();