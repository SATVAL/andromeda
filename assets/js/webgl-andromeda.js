import * as THREE from 'https://unpkg.com/three@0.158.0/build/three.module.js';
import { FontLoader } from 'https://unpkg.com/three@0.158.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.158.0/examples/jsm/geometries/TextGeometry.js';

const container = document.getElementById('andromeda-3d');
if (!container) return;

let renderer, scene, camera, textMesh;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070b14);

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(40, width/height, 0.1, 1000);
  camera.position.set(0, 1.6, 16);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lights
  const key = new THREE.DirectionalLight(0xb0d6ff, 1.2); key.position.set(6, 10, 10);
  const fill = new THREE.DirectionalLight(0x6ef3ff, 0.8); fill.position.set(-10, 6, 8);
  const rim = new THREE.PointLight(0x6aa9ff, 0.8); rim.position.set(0, -6, -6);
  scene.add(key, fill, rim);

  const loader = new FontLoader();
  loader.load('https://unpkg.com/three@0.158.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const geo = new TextGeometry('ANDROMEDA', {
      font, size: 2.2, height: 0.8, curveSegments: 12, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 6
    });
    geo.center();
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xdfe9ff, metalness: 0.55, roughness: 0.2, clearcoat: 0.6, clearcoatRoughness: 0.15, emissive: 0x0, envMapIntensity: 1.0
    });
    textMesh = new THREE.Mesh(geo, mat);
    scene.add(textMesh);
  });

  window.addEventListener('resize', onResize);
  animate();
}

function onResize(){
  if(!renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width/height; camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate(){
  requestAnimationFrame(animate);
  if(textMesh) {
    textMesh.rotation.y += 0.0025;
    textMesh.rotation.x = Math.sin(performance.now()*0.0004) * 0.12;
  }
  renderer?.render(scene, camera);
}

init();
