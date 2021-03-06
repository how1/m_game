import * as THREE from 'three';
import * as Physics from './physics.js';

// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

export let scene = new THREE.Scene();
export let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10001);
export let renderer = new THREE.WebGLRenderer();

let width = window.innerWidth - 10;
let height = window.innerHeight - 50;
renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );

window.addEventListener('resize', () => {
	width = window.innerWidth - 10;
	height = window.innerHeight - 50;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
});

camera.position.z = 0;
export let character;

export let walls = [];
export let obstacle;

export const init = () => {
 	let geom = new THREE.PlaneGeometry(1000,100,32);
 	let geom2 = new THREE.PlaneGeometry(100,1000,32);
 	let geom3 = new THREE.PlaneGeometry(2000, 200, 32);
 	let mat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide});
 	let floor = new THREE.Mesh(geom, mat);
 	obstacle = new THREE.Mesh(geom3, mat);
 	obstacle.position.x = -200;
 	obstacle.position.y = -50;
 	console.log(obstacle.position);
	scene.add(floor);
	scene.add(obstacle);
	obstacle = Physics.newObject(obstacle);
	console.log(obstacle.points);
	obstacle.rotate(-Math.PI/3);
	console.log(obstacle.points);
	// console.log(new THREE.Vector3().copy(obstacle.points[0]).sub(obstacle.points[1]).normalize());
	let wall1 = new THREE.Mesh(geom2, mat);
	let wall2 = new THREE.Mesh(geom2, mat);
	//let ceiling = new THREE.Mesh(geom, mat);

	scene.add(wall1);
	scene.add(wall2);
	// scene.add(ceiling);

	// walls.push(wall1);
	// walls.push(wall2);
	walls.push(floor);
	//walls.push(ceiling);

	let characterGeom = new THREE.PlaneGeometry(5,20, 32);
	let characterMat = new THREE.MeshBasicMaterial({color: 0xffccff, side: THREE.FrontSide});
	character = new THREE.Mesh(characterGeom, characterMat);
	character = Physics.newObject(character);
	scene.add(character.mesh);

	wall1.position.x = -300;
	floor.position.y = -100;
	wall2.position.x = 300;
	//ceiling.position.y = 100;

 	camera.position.z += 150;
}

