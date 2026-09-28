// The wolf's body, shared by the village world (the packs that come down at dusk) and the dens (the pack
// asleep below by day): low and grey, four legs, a tail and ears, eyes that catch the light.
import * as THREE from 'three';
export interface WolfBody { group: THREE.Group; legs: THREE.Mesh[]; tail: THREE.Mesh; hide: THREE.MeshStandardMaterial; eyes: THREE.Mesh[] }
export const wolfHide = (): THREE.MeshStandardMaterial => new THREE.MeshStandardMaterial({ color: '#6a655c', emissive: '#000000', roughness: 0.95, flatShading: true });
const wolfEye = new THREE.MeshBasicMaterial({ color: '#ffe070' }), direEye = new THREE.MeshBasicMaterial({ color: '#ff2a1a' });
/** S4c (SETTLEMENTS.md §6): a dire wolf is black and red-eyed. */
export const DIRE_HIDE = '#17141a', WOLF_GREY = '#6a655c';
export function makeWolf(hide: THREE.MeshStandardMaterial = wolfHide()): WolfBody {
  const group = new THREE.Group(), legs: THREE.Mesh[] = [], eyes: THREE.Mesh[] = [];
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 9, 7), hide); body.scale.set(1.9, 0.8, 0.7); body.position.y = 0.58; group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 6), hide); head.scale.set(1.3, 0.9, 0.85); head.position.set(0.72, 0.72, 0); group.add(head);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.13, 0.15), hide); snout.position.set(0.98, 0.66, 0); group.add(snout);
  for (const zz of [-0.09, 0.09]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 5), hide); ear.position.set(0.62, 0.92, zz); group.add(ear); const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 5, 4), wolfEye); eye.position.set(0.88, 0.76, zz); group.add(eye); eyes.push(eye); }
  for (let i = 0; i < 4; i++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.5, 5), hide); leg.position.set(-0.4 + Math.floor(i / 2) * 0.8, 0.26, (i % 2 ? 1 : -1) * 0.17); group.add(leg); legs.push(leg); }
  const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.5, 5), hide); tail.position.set(-0.75, 0.62, 0); tail.rotation.z = 1.2; group.add(tail);
  return { group, legs, tail, hide, eyes };
}
/** Make a wolf dire (black, red-eyed) or ordinary again. */
export function setDireLook(w: { hide: THREE.MeshStandardMaterial; eyes: THREE.Mesh[] }, dire: boolean): void { w.hide.color.set(dire ? DIRE_HIDE : WOLF_GREY); for (const e of w.eyes) { e.material = dire ? direEye : wolfEye; e.scale.setScalar(dire ? 1.5 : 1); } }
