// E1 (ECOLOGY.md): the chicken-of-the-woods, the meat-fruit: stacked fan shelves, orange to yellow (some in turkey-tail bands), that
// grow at a tree's base, break free on stubby legs to waddle and graze, and attach to another trunk to rest. Comical: a bracket
// fungus with feet and two small dark eyes on the top shelf. Cel look: flat shading and a black back-face hull.
import * as THREE from 'three';
import { mulberry32 } from './colors';

export const SIZE = 2.3;
export interface ChickenFigure { group: THREE.Group; update(x: number, y: number, z: number, heading: number, stage: 'growing' | 'free' | 'resting', grown: number, speed: number, dt: number): void; dispose(): void }
/** The colourings: orange-and-yellow, or a turkey tail's bands. Tuning. */
const COLOURS: [string, string][] = [['#f08a2a', '#f6c24a'], ['#e8742a', '#f4b03a'], ['#c07a3a', '#e8c070'], ['#b06a40', '#d8a060']];

export function createChicken(seed = 1): ChickenFigure {
  const r = mulberry32((seed * 331 + 7) >>> 0), group = new THREE.Group(), stack = new THREE.Group(); group.add(stack);
  /** The bracket's size: about half a metre across free (the vista's trunks are wide, and a hobbit is 0.46 m). Tuning. */
  stack.scale.setScalar(SIZE);
  const [c1, c2] = COLOURS[Math.floor(r() * COLOURS.length)], m1 = new THREE.MeshStandardMaterial({ color: c1, roughness: 0.95, flatShading: true }), m2 = new THREE.MeshStandardMaterial({ color: c2, roughness: 0.95, flatShading: true });
  const dark = new THREE.MeshStandardMaterial({ color: '#2a1a10', roughness: 1 }), leg = new THREE.MeshStandardMaterial({ color: '#8a6a3a', roughness: 1, flatShading: true }), hull = new THREE.MeshBasicMaterial({ color: '#2a1408', side: THREE.BackSide });
  const geoms: THREE.BufferGeometry[] = [];
  const n = 4 + Math.floor(r() * 3), shelves: THREE.Mesh[] = [];
  for (let i = 0; i < n; i++) {
    const rad = 0.2 - i * 0.028, g = new THREE.CylinderGeometry(rad * 0.4, rad, 0.035, 9, 1, false, 0, Math.PI * 1.1); geoms.push(g);
    const sh = new THREE.Mesh(g, i % 2 ? m2 : m1); sh.position.y = 0.05 + i * 0.045; sh.rotation.y = (r() - 0.5) * 0.5 - Math.PI * 0.55; sh.rotation.z = 0.12; stack.add(sh); shelves.push(sh);
    const o = new THREE.Mesh(g, hull); o.scale.setScalar(1.06); o.renderOrder = -1; sh.add(o);
  }
  // The eyes on the top shelf's lip, looking the way it waddles (-z).
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), dark); geoms.push(e.geometry); e.position.set(s * 0.04, 0.05 + (n - 1) * 0.045 + 0.02, -0.14); stack.add(e); }
  const legs: THREE.Mesh[] = [];
  for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.018, 0.07, 6), leg); geoms.push(l.geometry); l.position.set(s * 0.05, 0.035, -0.02); stack.add(l); legs.push(l); const f = new THREE.Mesh(new THREE.SphereGeometry(0.022, 6, 5), leg); geoms.push(f.geometry); f.scale.set(1, 0.5, 1.4); f.position.y = -0.035; l.add(f); }
  let phase = 0;
  function update(x: number, y: number, z: number, heading: number, stage: 'growing' | 'free' | 'resting', grown: number, speed: number, dt: number): void {
    group.position.set(x, y, z); group.rotation.y = heading;
    const attached = stage !== 'free', k = stage === 'growing' ? 0.25 + 0.75 * grown : 1;
    // Attached: the shelves hug the trunk, legs tucked away, the stack on its side; free: upright on its legs.
    stack.scale.setScalar(SIZE * k); for (const l of legs) l.visible = !attached;
    stack.rotation.x = attached ? 0.5 : 0; stack.position.y = attached ? -0.02 : 0;
    if (speed > 0) { phase += dt * 9; stack.rotation.z = Math.sin(phase) * 0.12; stack.position.y = Math.abs(Math.sin(phase)) * 0.012; legs[0].rotation.x = Math.sin(phase) * 0.6; legs[1].rotation.x = -Math.sin(phase) * 0.6; }
    else { phase += dt * 1.5; stack.rotation.z = attached ? 0 : Math.sin(phase) * 0.03; legs[0].rotation.x = legs[1].rotation.x = 0; }
  }
  function dispose(): void { for (const g of geoms) g.dispose(); m1.dispose(); m2.dispose(); dark.dispose(); leg.dispose(); hull.dispose(); }
  return { group, update, dispose };
}
