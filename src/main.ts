// Bare scaffold — camera, renderer, one light rig, a placeholder mesh standing
// in for a voxel. Intentionally stops here: the trunk/branch/flower rig, face
// locking, selection, and the recede animation are Pass 0 (see DESIGN.md) and
// are the actual thing to build next, not pre-empted by this scaffold.

import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x404060, 1));
const key = new THREE.DirectionalLight(0xffffff, 1.2);
key.position.set(4, 6, 2);
scene.add(key);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x1c2418 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
scene.add(ground);

// Placeholder for the plant voxel — replace with the trunk/branch/flower rig.
const placeholder = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x4a7c3a })
);
scene.add(placeholder);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  placeholder.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();
