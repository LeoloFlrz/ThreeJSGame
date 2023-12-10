import * as THREE from 'three';
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );

const cubeColor = new THREE.Color("Orange")

// const cubeGeometry = new THREE.BoxGeometry( 8, 0.5, 8 );
// const cubeMaterial = new THREE.MeshBasicMaterial( { color: cubeColor } );
// const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
// scene.add( cube );

const sphereTexture = new THREE.TextureLoader().load('textures/earth1.jpg')
const moonTexture = new THREE.TextureLoader().load('textures/moon.jpg')

const geometry = new THREE.SphereGeometry( 1, 40, 20 ); 
const material = new THREE.MeshBasicMaterial( { map: sphereTexture } ); 
const sphere = new THREE.Mesh( geometry, material ); 
scene.add( sphere );

const moonGeometry = new THREE.SphereGeometry( 0.2, 40, 20 ); 
const moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture } ); 
const moon = new THREE.Mesh( moonGeometry, moonMaterial ); 
scene.add( moon );

moon.position.x = 3
moon.position.y = 1

scene.background = new THREE.CubeTextureLoader()
	.setPath( 'textures/' )
	.load( [
				'space.png',
				'space.png',
				'space.png',
				'space.png',
				'space.png',
				'space.png'
			] );

camera.position.z = 2
controls.update();	

function animate() {
	requestAnimationFrame( animate );


	renderer.render( scene, camera );
}

animate();