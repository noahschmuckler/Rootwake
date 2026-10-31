// O2 (OPENING_SEQUENCE.md §5): the snerk's work station on D has a hooded viewer, after Spock's desktop scope: a brass stand, a
// hood she puts her face to, a dark eyepiece with a faint blue glow of the deer it is tuned to. Built beside the archive's lectern.
import * as THREE from 'three';
import { DESCENT_PALETTE as P } from './descentWorld';

export function makeScope(): THREE.Group {
  const g = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: P.brass, roughness: 0.5, metalness: 0.6, flatShading: true });
  const iron = new THREE.MeshStandardMaterial({ color: P.iron, roughness: 0.8, flatShading: true });
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh => { const m = new THREE.Mesh(geo, mat); g.add(m); return m; };
  const base = add(new THREE.CylinderGeometry(0.22, 0.28, 0.08, 10), iron); base.position.y = 0.04;
  const stem = add(new THREE.CylinderGeometry(0.05, 0.07, 0.85, 7), brass); stem.position.y = 0.5;
  // The hood: a wide drum tilted toward her, its mouth open; a cowl over it.
  const hood = new THREE.Group(); hood.position.set(0, 0.98, 0); hood.rotation.x = 0.55; g.add(hood);
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.34, 12, 1, true), new THREE.MeshStandardMaterial({ color: P.brass, roughness: 0.5, metalness: 0.6, flatShading: true, side: THREE.DoubleSide })); drum.rotation.x = Math.PI / 2; hood.add(drum);
  const back = new THREE.Mesh(new THREE.CircleGeometry(0.2, 12), iron); back.position.z = -0.17; back.rotation.y = Math.PI; hood.add(back);
  const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 8, 0, Math.PI, 0, Math.PI * 0.55), iron); cowl.position.set(0, 0.02, -0.02); cowl.rotation.x = -Math.PI / 2; hood.add(cowl);
  // The eyepiece: a dark lens with a faint blue glow, the deer's colour seen through soil.
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#1a2a30') })); lens.position.z = -0.12; hood.add(lens);
  const glow = new THREE.Mesh(new THREE.RingGeometry(0.05, 0.1, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7fd6ff').multiplyScalar(1.6), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })); glow.position.z = -0.11; glow.name = 'scope-glow'; hood.add(glow);
  const light = new THREE.PointLight('#7fd6ff', 1.2, 1.6, 2); light.position.set(0, 1.0, 0.25); g.add(light);
  g.name = 'scope';
  return g;
}
