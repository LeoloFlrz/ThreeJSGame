import * as THREE from 'three';
import * as YUKA from "yuka";
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
const moonMaterial = new THREE.MeshPhongMaterial( { map: moonTexture } );

const sunGeometry = new THREE.SphereGeometry(20, 50, 50);
const sunMaterial = new THREE.MeshPhongMaterial( { color: "orange" } );

// Objetos
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Object positions
moon.position.z = 35
moon.position.y = 2
// earth.position.z = 30;
// clouds.position.z = 30;


scene.add(earth, clouds, moon, sun);

// Planets Movement
const earthMove = new YUKA.Vehicle();
earth.matrixAutoUpdate = false;
// earthMove.scale = new YUKA.Vector3(0.5, 0.5, 0.5);
earthMove.setRenderComponent(earth, sync);

function sync(entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

// Movement path
const radius = 30;
const segments = 50; // Número de segmentos para el camino circular
const angleIncrement = (2 * Math.PI) / segments;

const path = new YUKA.Path();
for (let i = 0; i < segments; i++) {
    const angle = i * angleIncrement;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    path.add(new YUKA.Vector3(x, 0, z));
}

path.loop = true;

earthMove.position.copy(path.current());

earthMove.maxSpeed = 10;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
earthMove.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path);
//onPathBehavior.radius = 2;
earthMove.steering.add(onPathBehavior);

const entityManager = new YUKA.EntityManager();
entityManager.add(earthMove);

const position = [];
for (let i = 0; i < path._waypoints.length; i++) {
  const waypoint = path._waypoints[i];
  position.push(waypoint.x, waypoint.y, waypoint.z);
}

const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(position, 3)
);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
scene.add(lines);

const time = new YUKA.Time();



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
  const delta = time.update().getDelta();
  entityManager.update(delta);
  controls.update(); // Actualizar controles de órbita
  earth.rotation.y += 0.002;
  // clouds.rotation.y += 0.005;
  moon.rotation.y += 0.005;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);






