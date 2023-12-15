import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

// Crear escena, cámara y renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

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

// Texturas
const worldTexture = new THREE.TextureLoader().load(
  'textures/toonEarth.jpg',
  (texture) => {
    worldMaterial.map = texture;
    worldMaterial.needsUpdate = true;
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

// Geometría y materiales
const worldGeometry = new THREE.SphereGeometry(1, 40, 40);
const worldMaterial = new THREE.MeshPhongMaterial({ map: worldTexture });

const cloudGeometry = new THREE.SphereGeometry(1.1, 40, 40);
const cloudMaterial = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true });

// Objetos
const world = new THREE.Mesh(worldGeometry, worldMaterial);
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);

scene.add(world, clouds);

scene.background = new THREE.CubeTextureLoader()
	.setPath( 'textures/' )
	.load( [
				'stars.jpg',
				'stars.jpg',
				'stars.jpg ',
				'stars.jpg',
				'stars.jpg',
				'stars.jpg'
			] );

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Actualizar controles de órbita
  world.rotation.y += 0.002;
  clouds.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();






