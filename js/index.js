import * as THREE from 'three';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );

const cubeColor = new THREE.Color("Orange")

const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const cubeMaterial = new THREE.MeshBasicMaterial( { color: cubeColor } );
const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
scene.add( cube );

camera.position.z = 2
controls.update();	

function animate() {
	requestAnimationFrame( animate );


	renderer.render( scene, camera );
}

animate();