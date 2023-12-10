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

camera.position.y = 2

generateFloor()
// const cubeGeometry = new THREE.BoxGeometry( 8, 0.5, 8 );
// const cubeMaterial = new THREE.MeshBasicMaterial( { color: cubeColor } );
// const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
// scene.add( cube );


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


function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./textures/placeholder/placeholder.png");
    const sandBaseColor = textureLoader.load("./textures/sand/Sand 002_COLOR.jpg");
    const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: sandBaseColor, normalMap: sandNormalMap,
            displacementMap: sandHeightMap, displacementScale: 0.1,
            aoMap: sandAmbientOcclusion
        })
    wrapAndRepeatTexture(material.map)
    wrapAndRepeatTexture(material.normalMap)
    wrapAndRepeatTexture(material.displacementMap)
    wrapAndRepeatTexture(material.aoMap)
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    scene.add(floor)

	function wrapAndRepeatTexture(map) {
		map.wrapS = map.wrapT = THREE.RepeatWrapping;
		map.repeat.x = map.repeat.y = 10;
	}

	function light() {
		scene.add(new THREE.AmbientLight(0xffffff, 0.7))
	
		const dirLight = new THREE.DirectionalLight(0xffffff, 1)
		dirLight.position.set(- 60, 100, - 10);
		dirLight.castShadow = true;
		dirLight.shadow.camera.top = 50;
		dirLight.shadow.camera.bottom = - 50;
		dirLight.shadow.camera.left = - 50;
		dirLight.shadow.camera.right = 50;
		dirLight.shadow.camera.near = 0.1;
		dirLight.shadow.camera.far = 200;
		dirLight.shadow.mapSize.width = 4096;
		dirLight.shadow.mapSize.height = 4096;
		scene.add(dirLight);
		// scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
	}
	light()
}