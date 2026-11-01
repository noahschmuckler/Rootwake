// E1 (ECOLOGY.md): the chicken-of-the-woods, the meat-fruit: stacked fan shelves, orange to yellow (some in turkey-tail bands), that
// grow at a tree's base, break free on stubby legs to waddle and graze, and attach to another trunk to rest. Comical: a bracket
// fungus with feet and two small dark eyes on the top shelf. Cel look: flat shading and a black back-face hull.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from './colors';

export const SIZE = 2.3;
export interface ChickenFigure { group: THREE.Group; update(x: number, y: number, z: number, heading: number, stage: 'growing' | 'free' | 'resting', grown: number, speed: number, dt: number, /** E2a: by night (0..1) the shelves glow (Noah: the chicken-of-the-woods luminescent, so the night is alive). */ night?: number): void; dispose(): void }
/** The shelves' glow by full night. Tuning. */
const GLOW_NIGHT = 1.4;
/** The colourings: orange-and-yellow, or a turkey tail's bands. Tuning. */
const COLOURS: [string, string][] = [['#f08a2a', '#f6c24a'], ['#e8742a', '#f4b03a'], ['#c07a3a', '#e8c070'], ['#b06a40', '#d8a060']];

export function createChicken(seed = 1): ChickenFigure {
  const r = mulberry32((seed * 331 + 7) >>> 0), group = new THREE.Group(), stack = new THREE.Group(); group.add(stack);
  /** The bracket's size: about half a metre across free (the vista's trunks are wide, and a hobbit is 0.46 m). Tuning. */
  stack.scale.setScalar(SIZE);
  const [c1, c2] = COLOURS[Math.floor(r() * COLOURS.length)], m1 = new THREE.MeshStandardMaterial({ color: c1, emissive: c1, emissiveIntensity: 0, roughness: 0.95, flatShading: true }), m2 = new THREE.MeshStandardMaterial({ color: c2, emissive: c2, emissiveIntensity: 0, roughness: 0.95, flatShading: true });
  const dark = new THREE.MeshStandardMaterial({ color: '#2a1a10', roughness: 1 }), leg = new THREE.MeshStandardMaterial({ color: '#8a6a3a', roughness: 1, flatShading: true }), hull = new THREE.MeshBasicMaterial({ color: '#2a1408', side: THREE.BackSide });
  const geoms: THREE.BufferGeometry[] = [];
  // The shelves (the fans, one geometry in its two materials; their black hull another), the eyes, and each leg with its foot: six draws a fungus,
  // where every shelf and its hull were meshes of their own (2026-11-01, the judder: the Eden's 66 made ~900 of the draws in view from the summit).
  const n = 4 + Math.floor(r() * 3), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), one = new THREE.Vector3(1, 1, 1), parts: THREE.BufferGeometry[][] = [[], []], hulls: THREE.BufferGeometry[] = [];
  for (let i = 0; i < n; i++) {
    const rad = 0.2 - i * 0.028, g = new THREE.CylinderGeometry(rad * 0.4, rad, 0.035, 9, 1, false, 0, Math.PI * 1.1);
    m4.compose(new THREE.Vector3(0, 0.05 + i * 0.045, 0), q.setFromEuler(new THREE.Euler(0, (r() - 0.5) * 0.5 - Math.PI * 0.55, 0.12)), one);
    parts[i % 2].push(g.clone().applyMatrix4(m4)); hulls.push(g.applyMatrix4(m4.clone().multiply(new THREE.Matrix4().makeScale(1.06, 1.06, 1.06))));
  }
  const count = (g: THREE.BufferGeometry): number => (g.index ? g.index.count : g.attributes.position.count);
  const merged = (list: THREE.BufferGeometry[]): THREE.BufferGeometry => { const g = mergeGeometries(list)!; for (const part of list) part.dispose(); geoms.push(g); return g; };
  const shelfGeo = merged([...parts[0], ...parts[1]]), c0 = parts[0].reduce((t, g) => t + count(g), 0); shelfGeo.clearGroups(); shelfGeo.addGroup(0, c0, 0); shelfGeo.addGroup(c0, count(shelfGeo) - c0, 1);
  stack.add(new THREE.Mesh(shelfGeo, [m1, m2])); const hullMesh = new THREE.Mesh(merged(hulls), hull); hullMesh.renderOrder = -1; stack.add(hullMesh);
  // The eyes on the top shelf's lip, looking the way it waddles (-z).
  stack.add(new THREE.Mesh(merged([-1, 1].map(s => new THREE.SphereGeometry(0.014, 6, 5).translate(s * 0.04, 0.05 + (n - 1) * 0.045 + 0.02, -0.14))), dark));
  const legs: THREE.Mesh[] = [];
  for (const s of [-1, 1]) { const l = new THREE.Mesh(merged([new THREE.CylinderGeometry(0.014, 0.018, 0.07, 6), new THREE.SphereGeometry(0.022, 6, 5).scale(1, 0.5, 1.4).translate(0, -0.035, 0)]), leg); l.position.set(s * 0.05, 0.035, -0.02); stack.add(l); legs.push(l); }
  let phase = 0;
  function update(x: number, y: number, z: number, heading: number, stage: 'growing' | 'free' | 'resting', grown: number, speed: number, dt: number, night = 0): void {
    group.position.set(x, y, z); group.rotation.y = heading; m1.emissiveIntensity = m2.emissiveIntensity = GLOW_NIGHT * night;
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
