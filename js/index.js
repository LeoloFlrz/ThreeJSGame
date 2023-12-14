import * as THREE from "three";
import * as YUKA from "yuka";
import { KeyDisplay } from "./utils.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const orbitControls = new OrbitControls(camera, renderer.domElement);

const cubeColor = new THREE.Color("Orange");

camera.position.y = 2;

generateFloor();
// const cubeGeometry = new THREE.BoxGeometry( 8, 0.5, 8 );
// const cubeMaterial = new THREE.MeshBasicMaterial( { color: cubeColor } );
// const cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
// scene.add( cube );

scene.background = new THREE.CubeTextureLoader()
  .setPath("textures/")
  .load([
    "space.png",
    "space.png",
    "space.png",
    "space.png",
    "space.png",
    "space.png",
  ]);

camera.position.z = 2;
orbitControls.update();

// function animate() {
//   requestAnimationFrame(animate);

//   renderer.render(scene, camera);
// }

// animate();

function generateFloor() {
  // TEXTURES
  const textureLoader = new THREE.TextureLoader();
  const placeholder = textureLoader.load(
    "./textures/placeholder/placeholder.png"
  );
  const sandBaseColor = textureLoader.load(
    "./textures/sand/Sand 002_COLOR.jpg"
  );
  const sandNormalMap = textureLoader.load("./textures/sand/Sand 002_NRM.jpg");
  const sandHeightMap = textureLoader.load("./textures/sand/Sand 002_DISP.jpg");
  const sandAmbientOcclusion = textureLoader.load(
    "./textures/sand/Sand 002_OCC.jpg"
  );

  const WIDTH = 80;
  const LENGTH = 80;

  const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
  const material = new THREE.MeshStandardMaterial({
    map: sandBaseColor,
    normalMap: sandNormalMap,
    displacementMap: sandHeightMap,
    displacementScale: 0.1,
    aoMap: sandAmbientOcclusion,
  });
  wrapAndRepeatTexture(material.map);
  wrapAndRepeatTexture(material.normalMap);
  wrapAndRepeatTexture(material.displacementMap);
  wrapAndRepeatTexture(material.aoMap);
  // const material = new THREE.MeshPhongMaterial({ map: placeholder})

  const floor = new THREE.Mesh(geometry, material);
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  function wrapAndRepeatTexture(map) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.x = map.repeat.y = 10;
  }
}

function light() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-60, 100, -10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 50;
  dirLight.shadow.camera.bottom = -50;
  dirLight.shadow.camera.left = -50;
  dirLight.shadow.camera.right = 50;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  scene.add(dirLight);
  // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}
light();

const keysPressed = {};
const keyDisplayQueue = new KeyDisplay();

document.addEventListener(
  "keydown",
  (event) => {
    keyDisplayQueue.down(event.key);

    if (event.shiftKey && characterControls) {
      characterControls.switchRunToggle();
    } else {
      keysPressed[event.key.toLowerCase()] = true;
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (event) => {
    keyDisplayQueue.up(event.key);
    keysPressed[event.key.toLowerCase()] = false;
  },
  false
);

//Model With Animations

// TREX Model
// const dinoLoader = new GLTFLoader()
// dinoLoader.load('../resources/TRex/scene.gltf', (gltf) => {
//   const dinoModel = gltf.scene
//   dinoModel.scale.set(0.2, 0.2, 0.2)
//   gltf.scene.traverse(c => {
//     c.castShadow = true
//   })
//   scene.add(dinoModel)
// })

// Rayo Model
const loader = new GLTFLoader();
loader.load("../resources/rayo/lightning_mcqueen/scene.gltf", (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.2, 0.2, 0.2);
  gltf.scene.traverse((c) => {
    c.castShadow = true;
  });
  scene.add(model);
  model.matrixAutoUpdate = false;
  vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5);
  vehicle.setRenderComponent(model, sync);
});



const vehicle = new YUKA.Vehicle();

function sync(entity, renderComponent) {
  renderComponent.matrix.copy(entity.worldMatrix);
}

const path = new YUKA.Path();
path.add(new YUKA.Vector3(-6, 0, 4));
path.add(new YUKA.Vector3(-12, 0, 0));
path.add(new YUKA.Vector3(-6, 0, -12));
path.add(new YUKA.Vector3(0, 0, 0));
path.add(new YUKA.Vector3(8, 0, -8));
path.add(new YUKA.Vector3(10, 0, 0));
path.add(new YUKA.Vector3(4, 0, 4));
path.add(new YUKA.Vector3(0, 0, 6));

path.loop = true;

vehicle.position.copy(path.current());

vehicle.maxSpeed = 10;

const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
vehicle.steering.add(followPathBehavior);

const onPathBehavior = new YUKA.OnPathBehavior(path);
//onPathBehavior.radius = 2;
vehicle.steering.add(onPathBehavior);

const entityManager = new YUKA.EntityManager();
entityManager.add(vehicle);

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

function animate() {
  const delta = time.update().getDelta();
  entityManager.update(delta);
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
