import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';
import * as App from '../app.js';

let character;
let collisions = [];
let yVelocity = 0;
let xVelocity = 0;
let gravity = 0.05;
const GRAVITATION = 0.05;
let xAcceleration = 1.08;
let yAcceleration = 1.1;
let xDeceleration = .9;
let xMaxSpeed = 1;
let yMaxSpeed = 1;
let jumping = false;
let jumpFrame = false;
let zeroTol = 0.01;
let elevation = 0;
let maxJumpHeight = 50;
let jumpSpeed = 2.5;
let hanging = false;


export const updateCharacter = () => {
    character = Initialize.character;
    if (getSAT(character, Initialize.obstacle)){
        console.log('green');
        Initialize.obstacle.mesh.material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.FrontSide});
    }
    else{
        Initialize.obstacle.mesh.material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide});
    }
    // scene.remove(Initialize.obstacle);
    if (Math.abs(xVelocity) < zeroTol) xVelocity = 0;
    getInput();
	collisions = CollisionDetection.getCollisions(Initialize.walls, Initialize.character.mesh);
    let gravityThisTurn = gravity;
    for (var i = 0; i < collisions.length; i++) {
        if (collisions[i] == 'top') {
            if (!jumpFrame){
                hanging = false;
                jumping = false;
                gravityThisTurn = 0;
                yVelocity = 0;
            }
        } else if (collisions[i] == 'left'){
            if (!jumpFrame){
                if (xVelocity > 0) xVelocity = 0;
            }
            if (keyEvents[0] == 'right'){
                hang();
            }
        } else if (collisions[i] == 'right'){
            if (!jumpFrame){
                if (xVelocity < 0) xVelocity = 0;
            }
            if (keyEvents[0] == 'left'){
                hang();
            }
        }
    }
    yVelocity -= gravityThisTurn;
    character.mesh.position.y += yVelocity;
    character.mesh.position.x += xVelocity;
    Initialize.camera.position.x = character.mesh.position.x;
    if (jumpFrame) jumpFrame = false;
}

const getInput = () => {
    if (keyEvents.length == 0) {
        if (!jumping){
            if (Math.abs(xVelocity) > 0)
                skid();
        }
    }
    if (keyEvents[0] == 'left') {
        goLeft();
    } else if (keyEvents[0] == 'right'){
        goRight();
    } else if (keyEvents[0] == 'up'){
        jump();
    }
    if ((!keyEvents.includes('up') && jumping) || character.mesh.position.y > elevation + maxJumpHeight){
        gravity = GRAVITATION;
    }
}

const goLeft = () => {
    if (xVelocity > 0) skid();
    else {
        if (xVelocity == 0) xVelocity = -0.3;
        if (xVelocity < 0){
            if (Math.abs(xVelocity) < xMaxSpeed) {
                // if (!jumping)
                    xVelocity *= xAcceleration;
            }
        }
    }
}

const goRight = () => {
    if (xVelocity < 0) skid();
    else {
        if (xVelocity == 0) xVelocity = 0.3;
        else if (xVelocity > 0){
            if (Math.abs(xVelocity) < xMaxSpeed) {
                // if (!jumping)
                    xVelocity *= xAcceleration;
            }
        }
    }
}

const jump = () => {
    if (!jumping){
        if (hanging) {
            console.log('hanging');
            hanging = false;
            for (var i = collisions.length - 1; i >= 0; i--) {
                if (collisions[i] == 'left') {
                    xVelocity = -.3;
                    console.log('go right');
                } else if (collisions [i] == 'right') {
                    xVelocity = .3;
                    console.log('go left');
                }
            }
            // if (keyEvents[1] == 'left'){
            //     xVelocity = .3;
            // } else if (keyEvents[1] == 'right'){
            //     console.log('jump left');
            //     xVelocity = -.3;
            // }
            yVelocity = jumpSpeed;
            jumping = true;
            jumpFrame = true;
            gravity = 0;
            elevation = character.mesh.position.y;
        } else if (yVelocity == 0 && !jumping){
            yVelocity = jumpSpeed;
            jumping = true;
            jumpFrame = true;
            gravity = 0;
            elevation = character.mesh.position.y;
        }
    }
}

const hang = () => {
    hanging = true;
    jumping = false;
    if (yVelocity < 0){
        yVelocity = -.2;
    }
}

const skid = () => {
    if (keyEvents.length == 0){
        xVelocity *= 0.95;
    } else {
        xVelocity *= 0.9;
    }
    // shortSkid
    // longSkid
}


let keyEvents = [];
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
	let keyCode = event.which;
	//37 Left | 38 Up | 39 Right | 40 Down
    if (keyCode == 37) {
        addKey('left');
    } else if (keyCode == 39){
        addKey('right')
    } else if (keyCode == 38 || keyCode == 90) {
        addKey('up');
    }
}

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
	let keyCode = event.which;
	// //37 Left 38 Up 39 R 40 Down
    if (keyCode == 37) {
        removeKey('left');
    } else if (keyCode == 39){
        removeKey('right');
    } else if (keyCode == 38 || keyCode == 90) {
        removeKey('up');
    }

}

const removeKey = (key) => {
    for (var i = 0; i < keyEvents.length; i++) {
        if (keyEvents[i] == key) {
            keyEvents.splice(i, 1);
        }
    }
}

const addKey = (key) => {
    for (var i = 0; i < keyEvents.length; i++) {
        if (keyEvents[i] == key) {
            keyEvents.splice(i, 1);
        }
    }
    keyEvents.unshift(key);
}

export const getRotatedPoints = (mesh) => {
    let corners = [
        new THREE.Vector3(-mesh.geometry.parameters.width/2, mesh.geometry.parameters.height/2, mesh.position.z),
        new THREE.Vector3(mesh.geometry.parameters.width/2, mesh.geometry.parameters.height/2, mesh.position.z),
        new THREE.Vector3(mesh.geometry.parameters.width/2, -mesh.geometry.parameters.height/2, mesh.position.z),
        new THREE.Vector3(-mesh.geometry.parameters.width/2, -mesh.geometry.parameters.height/2, mesh.position.z)
    ];
    var axis = new THREE.Vector3( 0, 0, 1 );
    var angle = mesh.rotation.z;
    for (var i = corners.length - 1; i >= 0; i--) {
        corners[i].applyAxisAngle( axis, angle );
        corners[i].add(mesh.position);
    }
    return corners;
}

export const newObject = (m) => {
    let object = {
        points: getRotatedPoints(m),
        mesh: m,
        rotate: function(rads) {
            this.mesh.rotateZ(rads);
            this.points = getRotatedPoints(this.mesh);
        }
    }
    return object;
}

export const getPerpVector = (vec) => {
    let xP = -vec.y;
    let yP = vec.x;
    return new THREE.Vector3(xP, yP, 0).normalize();
}

export const getAxes = (obj) => {
    let axes = [];
    for (let i = 0; i < obj.points.length; i++) {
        let vecA = new THREE.Vector3(obj.points[i].x, obj.points[i].y, 0);
        let vecB = new THREE.Vector3(obj.points[(i + 1) % obj.points.length].x, obj.points[(i + 1) % obj.points.length].y, 0);
        axes.push(getPerpVector(vecA.sub(vecB)));
    }
    return axes;
}

export const getProjection = (axis, obj, pos) => {
    let min = axis.dot(obj.points[0]);
    let max = min;
    for (var i = 0; i < obj.points.length; i++) {
        let p = axis.dot(obj.points[i]);
        if (p < min) min = p;
        else if ( p > max) max = p;
    }
    let vec = new THREE.Vector3(min, max, 0);
    return [vec.x, vec.y];
}

export const getSAT = (a, b) => {
    Initialize.character.points = getRotatedPoints(Initialize.character.mesh);
    Initialize.obstacle.points = getRotatedPoints(Initialize.obstacle.mesh);
    let axesA = getAxes(a);
    let axesB = getAxes(b);
    let projA = [];
    let projB = [];
    for (var i = 0; i < axesA.length; i++) {
        let aP = getProjection(axesA[i], a);
        let bP = getProjection(axesA[i], b);
        if (aP[0] > bP[1]) return false;
        if (aP[1] < bP[0]) return false
    }
    for (var i = 0; i < axesB.length; i++) {
        let aP = getProjection(axesB[i], a);
        let bP = getProjection(axesB[i], b);
        if (aP[0] > bP[1]) return false;
        if (aP[1] < bP[0]) return false;
    }
    return true;
}
