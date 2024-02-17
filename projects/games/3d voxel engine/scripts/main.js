console.log("hello");
import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import Stats from './Stats.js'; //132.2
import { World } from './world.js';
import { setupUI } from './ui.js';
console.log("got all modules");


// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x80a0e0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 64, 64);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(16, 64, 16);
controls.update();

// Scene setup
const scene = new THREE.Scene();
const world = new World();
world.generate();
scene.add(world);

function setupLighting() {
  const sun = new THREE.DirectionalLight();
  sun.intensity = 1.5;
  sun.position.set(128, 256, 128);
  sun.castShadow = true;

  // Set the size of the sun's shadow box
  sun.shadow.camera.left = -256;
  sun.shadow.camera.right = 256;
  sun.shadow.camera.top = 256;
  sun.shadow.camera.bottom = -256;
  sun.shadow.camera.near = 0.1;
  sun.shadow.camera.far = 512;
  sun.shadow.bias = -0.001;
  scene.add(sun);

  //scene.add(new THREE.CameraHelper(sun.shadow.camera));

  const ambient = new THREE.AmbientLight();
  ambient.intensity = 0.3;
  scene.add(ambient);
}

// Events
window.addEventListener('resize', () => {
  // Resize camera aspect ratio and renderer size to the new window size
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// UI Setup
const stats = new Stats();
document.body.appendChild(stats.dom);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
}

setupUI(world);
setupLighting();
animate();