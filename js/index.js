import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

// Crear escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controles de órbita para la interactividad
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.rotateSpeed = 0.35;

// Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Axis helper
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Texturas
const earthTexture = new THREE.TextureLoader().load(
  'textures/toonEarth.jpg',
  (texture) => {
    earthMaterial.map = texture;
    earthMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.error('Error al cargar la textura del mundo', error);
  }
);

const cloudTexture = new THREE.TextureLoader().load(
  'textures/toonClouds.png',
  (texture) => {
    cloudMaterial.map = texture;
    cloudMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.error('Error al cargar la textura de las nubes', error);
  }
);

const moonTexture = new THREE.TextureLoader().load(
  'textures/moonTexture.png',
  (texture) => {
    moonMaterial.map = texture;
    moonMaterial.needsUpdate = true;
  },
  undefined,
  (error) => {
    console.error('Error al cargar la textura de las nubes', error);
  }
);

// Geometría y materiales
const earthGeometry = new THREE.SphereGeometry(3, 40, 40);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });

const cloudGeometry = new THREE.SphereGeometry(3.10, 40, 40);
const cloudMaterial = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true });

const moonGeometry = new THREE.SphereGeometry(0.6, 20, 20);
const moonMaterial = new THREE.MeshPhongMaterial( { map: moonTexture } )



// Objetos
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

// Object positions
moon.position.z = 35
moon.position.y = 2
earth.position.z = 30;
clouds.position.z = 30;


scene.add(earth, clouds, moon);

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

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Actualizar controles de órbita
  earth.rotation.y += 0.002;
  clouds.rotation.y += 0.005;
  moon.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();






