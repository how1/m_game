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
let xMaxJumpingSpeed = .5;
let jumping = false;
let jumpFrame = false;
let zeroTol = 0.01;
let elevation = 0;
let maxJumpHeight = 50;
let jumpSpeed = 1.5;
let hanging = false;
let sliding = false;
let jumpKey = false;
let gravityThisTurn = gravity;

export const updateCharacter = () => {
    Initialize.camera.position.x = Initialize.character.mesh.position.x;
    Initialize.camera.position.y = Initialize.character.mesh.position.y;
    character = Initialize.character;
    gravityThisTurn = gravity;
    getSAT(character, Initialize.obstacle);
    // scene.remove(Initialize.obstacle);
    if (Math.abs(xVelocity) < zeroTol) xVelocity = 0;
    getInput();
	collisions = CollisionDetection.getCollisions(Initialize.walls, Initialize.character.mesh);
    if (collisions.length == 0) jumping = true;
    for (var i = 0; i < collisions.length; i++) {
        if (collisions[i] == 'top') {
            if (!jumpFrame){
                sliding = false;
                hanging = false;
                jumping = false;
                gravityThisTurn = 0;
                yVelocity = 0;
            }
        } else if (collisions[i] == 'left'){
            if (hanging) hang();
            if (!jumpFrame){
                if (xVelocity > 0) xVelocity = 0;
            }
            if (keyEvents[0] == 'right'){
                hang();
            }
        } else if (collisions[i] == 'right'){
            if (hanging) hang();
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
        for (var i = collisions.length - 1; i >= 0; i--) {
            if (collisions[i] == 'left')  hanging = true;
            else if (collisions[i] == 'right') hanging =false;
        }
        goLeft();
    } else if (keyEvents[0] == 'right'){
        for (var i = collisions.length - 1; i >= 0; i--) {
            if (collisions[i] == 'right') hanging = true;
            else if (collisions[i] == 'left') hanging = false;
        }
        goRight();
    } else if (keyEvents[0] == 'up'){
        // console.log(keyEvents, jumpKey);
        if (keyEvents.length == 1 && jumpKey && !jumping) {
            console.log("skid here now you skidher now");
            skid();
        }
        else {
            jump();
        }
        for (var i = keyEvents.length - 1; i >= 0; i--) {
            if (keyEvents[i] == 'left') {
                goLeft();
            } else if (keyEvents[i] == 'right') {
                goRight();
            }
        }
    }
    if ((!keyEvents.includes('up') && jumping) || character.mesh.position.y > elevation + maxJumpHeight){
        gravity = GRAVITATION;
    }
}

const goLeft = () => {
    if (xVelocity > 0) skid();
    else {
        if (!jumping) {
            if (xVelocity == 0) xVelocity = -0.3;
            if (xVelocity < 0){
                if (Math.abs(xVelocity) < xMaxSpeed) {
                    // if (!jumping)
                        xVelocity *= xAcceleration;
                }
            }
        } else {
            if (xVelocity == 0) xVelocity = -0.3;
            if (xVelocity < 0){
                if (Math.abs(xVelocity) < xMaxJumpingSpeed) {
                    // if (!jumping)
                        xVelocity *= (xAcceleration);
                }
            }
        }
    }
}

const goRight = () => {
    if (xVelocity < 0) skid();
    else {
        if (!jumping) {
            if (xVelocity == 0) xVelocity = 0.3;
            if (xVelocity > 0){
                if (Math.abs(xVelocity) < xMaxSpeed) {
                        xVelocity *= xAcceleration;
                }
            }
        } else {
            if (xVelocity == 0) xVelocity = 0.3;
            if (xVelocity > 0){
                if (Math.abs(xVelocity) < xMaxJumpingSpeed) {
                        xVelocity *= (xAcceleration);
                }
            }
        }
    }
}

const jump = () => {
    if (!jumpKey){
        jumpKey = true;
        if (!jumping){
            if (hanging) {
                if (yVelocity > 0) yVelocity *= 1.5;
                hanging = false;
                for (var i = collisions.length - 1; i >= 0; i--) {
                    if (collisions[i] == 'left') {
                        xVelocity = -.35;
                    } else if (collisions [i] == 'right') {
                        xVelocity = .35;
                    }
                }
                yVelocity = jumpSpeed * .6;
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
            } else if (sliding) {
                sliding = false;
                yVelocity = jumpSpeed;
                jumping = true;
                jumpFrame = true;
                gravity = 0;
                elevation = character.mesh.position.y;
            }
        } else if (jumping) {

        }
    }
}

const hang = () => {
    hanging = true;
    jumping = false;
    // if (!sliding){
        // console.log("go down here ");
    if (yVelocity < 0){
        yVelocity = -0.4;
    }
    // }
}

const skid = () => {
    if (sliding){
        if (keyEvents.length != 0) {
            xVelocity *= 0.5;
        }
    } else {
        if (keyEvents.length == 0) {
            xVelocity *= 0.95;
        } else {
            xVelocity *= 0.9;
        }
    }
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
        jumpKey = false;
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
    let minO = 100;
    let axis = new THREE.Vector3();
    for (var i = 0; i < axesA.length; i++) {
        let aP = getProjection(axesA[i], a);
        let bP = getProjection(axesA[i], b);
        if (aP[0] > bP[1]) {
            sliding = false;
            return false;
        }
        else if (aP[1] < bP[0]) {
            sliding = false;
            return false
        }
        else {
            if (aP[1] > bP[0]){
                let o = Math.abs(aP[1] - bP[0]);
                if (minO > o){
                    minO = o; 
                    axis = axesA[i];
                } 
            } else if (aP[0] < bP[1]) {
                let o = Math.abs(aP[0] - bP[1]);
                if (minO > o) {
                    minO = o;
                    axis = axesA[i];
                }
            }
        }
    }
    for (var i = 0; i < axesB.length; i++) {
        let aP = getProjection(axesB[i], a);
        let bP = getProjection(axesB[i], b);
        if (aP[0] > bP[1]) {
            sliding = false;
            return false;
        }
        else if (aP[1] < bP[0]) {
            sliding = false;
            return false;
        }
        else {
            if (aP[1] > bP[0]){
                let o = Math.abs(aP[1] - bP[0]);
                if (minO > o) {
                    minO = o; 
                    axis = axesB[i];
                }
            } else if (aP[0] < bP[1]) {
                let o = Math.abs(aP[0] - bP[1]);
                if (minO > o) {
                    minO = o;
                    axis = axesB[i];
                }
            } 
        }
    }
    if (axis.y < 0) {
        sliding = true;
    }
    if (collisions.length == 0){
        console.log('no cols');
        let tmp = new THREE.Vector3();
        tmp.copy(axis);
        let Vn = tmp.multiplyScalar(axis.dot(new THREE.Vector3(xVelocity, yVelocity, 0)));
        let temp = new THREE.Vector3(xVelocity, yVelocity, 0);
        let Vt = temp.sub(Vn);
        let newVelocityVector = Vt.sub(Vn.multiplyScalar(.001));
        xVelocity = newVelocityVector.x;
        yVelocity = newVelocityVector.y;
    }
    if (collisions.length > 0){
        yVelocity = 0;
        gravityThisTurn = 0;
        let angle = THREE.Math.radToDeg(b.mesh.rotation.z);
        console.log(angle);
        let otherAngle = 180 - angle - 90;
        let leg = minO;
        let hypo = leg / Math.sin(THREE.Math.degToRad(otherAngle));
        let minVector = new THREE.Vector3(0,1,0).multiplyScalar(hypo);
        Initialize.character.mesh.position.add(minVector);
    } else {
        let minVector = axis.multiplyScalar(minO).negate();
        Initialize.character.mesh.position.add(minVector);
    }
    jumping = false;
    // let tmpVec = new THREE.Vector3(xVelocity, yVelocity, 0);
    // perpAxis.multiplyScalar(tmpVec.length());
    // xVelocity = perpAxis.x;
    // yVelocity = perpAxis.y;
    return true;
}
