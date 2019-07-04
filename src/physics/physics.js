import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';

let collisions;
let yVelocity = 0;
let xVelocity = 0;
let gravity = 0.028;
let xAcceleration = 1.1;
let yAcceleration = 1.1;
let xDeceleration = .9;
let xMaxSpeed = 1;
let yMaxSpeed = 1;
let jumping = false;
let zeroTol = 0.001;

export const updateCharacter = () => {
    if (Math.abs(xVelocity) < zeroTol) xVelocity = 0;
    getInput();
    let character = Initialize.character;
	collisions = CollisionDetection.getCollisions(Initialize.walls, Initialize.character);
    let gravityThisTurn = gravity;
    for (var i = 0; i < collisions.length; i++) {
        if (collisions[i] == 'top') {
            jumping = false;
            gravityThisTurn = 0;
            yVelocity = 0;
        }
    }
    yVelocity -= gravityThisTurn;
    character.position.y += yVelocity;
    character.position.x += xVelocity;
}

const getInput = () => {
    console.log(xVelocity);
    if (keyEvents.length == 0) {
        if (Math.abs(xVelocity) > 0)
            skid();
    }
    if (keyEvents[0] == 'left') {
        if (xVelocity > 0) skid();
        else goLeft();
    } else if (keyEvents[0] == 'right'){
        if (xVelocity < 0) skid();
        else goRight();
    }
}

const goLeft = () => {
    if (xVelocity == 0) xVelocity = -0.1;
    if (xVelocity < 0){
        if (Math.abs(xVelocity) < xMaxSpeed) {
            xVelocity *= xAcceleration;
        }
    }
}

const goRight = () => {
    if (xVelocity == 0) xVelocity = 0.1;
    if (xVelocity > 0){
        if (Math.abs(xVelocity) < xMaxSpeed) {
            xVelocity *= xAcceleration;
        }
    }
}

const jump = () => {
    if (yVelocity == 0 && !jumping){
        yVelocity = 0.6;
        jumping = true;
    } else if (jumping && yVelocity < yMaxSpeed){
        yVelocity += yAcceleration;
    }
}

const skid = () => {
    xVelocity *= 0.9;
    // shortSkid
    // longSkid
}


let keyEvents = [];
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
	let keyCode = event.which;
	//37 Left 38 Up 39 R 40 Down
    if (keyCode == 37) {
        addKey('left');
    } else if (keyCode == 39){
        addKey('right')
    } else if (keyCode == 38) {
        addKey('up');
    }
	// if (keyCode == 37){
 //        // goLeft();
            // keyEvents[0] = 1;
	// }
	// else if (keyCode == 38 || keyCode == 90) {
 //        // jump();
 //        keyEvents[1] = 1;
 //    }
	// else if (keyCode == 39) {
 //        // goRight();
 //        if (keyEvents[0]) keyEvents[2] = 2;
 //        else keyEvents[2] = 1;
 //    }
	// else if (keyCode == 40) {
 //        keyEvents[3] = 1;
 //    }
}

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
	let keyCode = event.which;
	// //37 Left 38 Up 39 R 40 Down
    if (keyCode == 37) {
        removeKey('left');
    } else if (keyCode == 39){
        removeKey('right');
    } else if (keyCode == 38) {
        removeKey('up');
    }

	// let button;
	// if (keyCode == 37) {
 //        keyEvents[0] = 0;
 //        if (keyEvents[2]){
 //            // goRight();
 //        }
 //    }
	// else if (keyCode == 38 || keyCode == 90) {
 //        jumping = false;
 //        keyEvents[1] = 0;
 //    }
	// else if (keyCode == 39) { 
 //        keyEvents[2] = 0;
 //        if (keyEvents[0]){
 //            // goLeft();
 //        }
 //    }
	// else if (keyCode == 40) {
 //        keyEvents[3] = 0;
 //    }

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


