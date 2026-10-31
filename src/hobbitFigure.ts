// E1 (EDEN.md, BEGINNING.md "The hobbit redesign"): the hobbit after DiggyDwarves' dwarf (design/hobbit/dwarf-*.png), in 3D and in code:
// a near-spherical mass of shaggy brown hair with no neck, a darker outline, a big pink nose, thick dark brows over wide round eyes,
// pale tan ears, stubby arms ending in mitten hands, wide bare feet with the toes showing. 0.46 m tall. The walk is a waddle made
// here (the body rocks, the arms swing wide, the feet alternate), not a Mixamo clip: the body has no neck or waist to retarget.
// Variety by hair colour, skin tint, nose size and height. Cel look: flat shading and a black back-face hull, as the vista's figures.
import * as THREE from 'three';
import { mulberry32 } from './colors';

export const HOBBIT_HEIGHT = 0.46;
/** Hair colours the band comes in (the dwarf's brown first), and skin tints. Tuning. */
export const HAIRS = ['#6b3f1f', '#4a2b14', '#8a5a2a', '#3a2314', '#a0703a', '#5c3a22', '#7a4a28', '#2e1d10'];
export const SKINS = ['#e8b98f', '#dba878', '#f0c7a0', '#d49c6c'];
export interface HobbitLook { hair: string; skin: string; nose: number; height: number }
export interface HobbitState { speed: number; carry: 'chicken' | 'berries' | null; eating: boolean; taking: boolean; inside: boolean }
export interface HobbitFigure { group: THREE.Group; look: HobbitLook; update(x: number, y: number, z: number, heading: number, s: HobbitState, dt: number): void; dispose(): void }

export function hobbitLook(seed: number, i: number): HobbitLook { const r = mulberry32((seed * 613 + i * 97 + 5) >>> 0); return { hair: HAIRS[Math.floor(r() * HAIRS.length)], skin: SKINS[Math.floor(r() * SKINS.length)], nose: 0.85 + r() * 0.4, height: HOBBIT_HEIGHT * (0.92 + r() * 0.16) }; }

/** A shaggy ball: an icosphere with its vertices pushed in and out by a hash, so the silhouette is lumpy and the flat shading breaks into tufts. */
function shaggy(radius: number, seed: number, lump = 0.12, detail = 3): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(radius, detail), p = g.attributes.position as THREE.BufferAttribute, r = mulberry32(seed);
  const jitter = new Map<string, number>();
  for (let i = 0; i < p.count; i++) { const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`; let j = jitter.get(k); if (j === undefined) { j = 1 + (r() - 0.5) * 2 * lump; jitter.set(k, j); } p.setXYZ(i, p.getX(i) * j, p.getY(i) * j, p.getZ(i) * j); }
  g.computeVertexNormals(); return g;
}

export function createHobbit(look: HobbitLook, seed = 1): HobbitFigure {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
  const k = look.height / HOBBIT_HEIGHT; body.scale.setScalar(k);
  const hairMat = new THREE.MeshStandardMaterial({ color: look.hair, roughness: 1, flatShading: true });
  const skinMat = new THREE.MeshStandardMaterial({ color: look.skin, roughness: 0.9, flatShading: true });
  const noseMat = new THREE.MeshStandardMaterial({ color: '#e8907a', roughness: 0.8, flatShading: true });
  const dark = new THREE.MeshStandardMaterial({ color: '#2a1a10', roughness: 1 }), white = new THREE.MeshStandardMaterial({ color: '#f4f0e8', roughness: 0.6 });
  const hull = new THREE.MeshBasicMaterial({ color: '#15100a', side: THREE.BackSide });
  const geoms: THREE.BufferGeometry[] = [];
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D = body): THREE.Mesh => { geoms.push(g); const o = new THREE.Mesh(g, m); parent.add(o); return o; };
  const outline = (g: THREE.BufferGeometry, parent: THREE.Object3D, scale = 1.06): void => { const o = new THREE.Mesh(g, hull); o.scale.setScalar(scale); o.renderOrder = -1; parent.add(o); };
  // The mass: hair from the crown to the feet, wider than tall, a little flattened at the front where the face is.
  const mass = shaggy(0.205, seed * 7 + 1); mass.scale(1, 1.05, 0.95); const massMesh = mesh(mass, hairMat); massMesh.position.y = 0.245; outline(mass, massMesh, 1.05);
  // The face: a tan patch set into the front, the brows, the eyes, the nose; the ears at the sides.
  const face = mesh(new THREE.SphereGeometry(0.1, 12, 10), skinMat); face.scale.set(1.15, 1.0, 0.55); face.position.set(0, 0.29, -0.165);
  for (const s of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.03, 10, 8), white); eye.position.set(s * 0.048, 0.315, -0.205);
    const pupil = mesh(new THREE.SphereGeometry(0.015, 8, 6), dark); pupil.position.set(s * 0.052, 0.313, -0.232);
    const brow = mesh(new THREE.BoxGeometry(0.075, 0.022, 0.03), dark); brow.position.set(s * 0.05, 0.352, -0.205); brow.rotation.z = s * -0.25; brow.rotation.x = 0.3;
    const ear = mesh(new THREE.SphereGeometry(0.032, 8, 6), skinMat); ear.scale.set(0.5, 1, 1); ear.position.set(s * 0.205, 0.3, -0.02);
  }
  const nose = mesh(new THREE.SphereGeometry(0.046 * look.nose, 12, 10), noseMat); nose.scale.set(1, 0.9, 1.1); nose.position.set(0, 0.278, -0.235);
  // The arms: stubby, hanging from the sides, a mitten at the end; they swing from the shoulder.
  const arms: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(s * 0.16, 0.24, 0); body.add(arm); arms.push(arm);
    const upper = mesh(new THREE.CapsuleGeometry(0.03, 0.09, 4, 8), skinMat, arm); upper.position.set(s * 0.03, -0.06, 0); upper.rotation.z = s * -0.35;
    const mitten = mesh(new THREE.SphereGeometry(0.042, 10, 8), skinMat, arm); mitten.scale.set(1, 0.9, 1.1); mitten.position.set(s * 0.065, -0.125, 0);
  }
  // The feet: wide and bare, the toes showing, set well apart.
  const feet: THREE.Group[] = [];
  for (const s of [-1, 1]) {
    const foot = new THREE.Group(); foot.position.set(s * 0.075, 0.02, -0.02); body.add(foot); feet.push(foot);
    const sole = mesh(new THREE.SphereGeometry(0.05, 10, 8), skinMat, foot); sole.scale.set(1.1, 0.45, 1.5);
    for (let t = 0; t < 3; t++) { const toe = mesh(new THREE.SphereGeometry(0.016, 6, 5), skinMat, foot); toe.position.set(s * (t - 1) * 0.028, 0.0, -0.075); }
  }
  // Carried things: a chicken-of-the-woods under the left arm, or a bundle of berries.
  const carried = new THREE.Group(); carried.position.set(-0.19, 0.17, -0.06); body.add(carried);
  const chick = new THREE.Group(); const fan = new THREE.MeshStandardMaterial({ color: '#f08a2a', roughness: 0.9, flatShading: true }), fan2 = new THREE.MeshStandardMaterial({ color: '#f6c24a', roughness: 0.9, flatShading: true });
  for (let i = 0; i < 3; i++) { const sh = mesh(new THREE.CircleGeometry(0.06 - i * 0.012, 10, 0, Math.PI), i % 2 ? fan2 : fan, chick); sh.rotation.x = -Math.PI / 2 + 0.3; sh.position.y = i * 0.022; }
  const berries = new THREE.Group(); const blue = new THREE.MeshStandardMaterial({ color: '#3a4a9a', roughness: 0.7 }); for (let i = 0; i < 6; i++) { const b = mesh(new THREE.SphereGeometry(0.014, 6, 5), blue, berries); b.position.set((i % 3 - 1) * 0.025, Math.floor(i / 3) * 0.025, (i % 2) * 0.015); }
  carried.add(chick, berries); chick.visible = berries.visible = false;
  let phase = 0, bob = 0;
  function update(x: number, y: number, z: number, heading: number, s: HobbitState, dt: number): void {
    group.visible = !s.inside; group.position.set(x, y, z); group.rotation.y = heading;
    if (s.speed > 0) { phase += dt * (6 + s.speed * 5); bob = 1; } else { phase += dt * 1.6; bob = Math.max(0, bob - dt * 3); }
    const sw = Math.sin(phase), cw = Math.cos(phase);
    // The waddle: the body rocks side to side and bobs; the feet alternate; the arms swing wide. Still, a slow breath and a sway.
    body.rotation.z = sw * 0.14 * bob + Math.sin(phase * 0.5) * 0.02 * (1 - bob); body.rotation.x = Math.abs(cw) * 0.05 * bob;
    body.position.y = Math.abs(sw) * 0.02 * bob + (s.eating ? -0.04 : 0);
    feet[0].position.y = 0.02 + Math.max(0, sw) * 0.035 * bob; feet[1].position.y = 0.02 + Math.max(0, -sw) * 0.035 * bob;
    feet[0].position.z = -0.02 - cw * 0.03 * bob; feet[1].position.z = -0.02 + cw * 0.03 * bob;
    arms[0].rotation.x = sw * 0.7 * bob; arms[1].rotation.x = -sw * 0.7 * bob; arms[0].rotation.z = 0.25 * bob + (s.taking ? 0.9 : 0); arms[1].rotation.z = -0.25 * bob - (s.taking ? 0.9 : 0);
    if (s.taking) { arms[0].rotation.x = Math.sin(phase * 3) * 0.5; arms[1].rotation.x = -Math.sin(phase * 3) * 0.5; }
    if (s.eating) { arms[0].rotation.x = -0.9 + Math.sin(phase * 2) * 0.3; }
    chick.visible = s.carry === 'chicken'; berries.visible = s.carry === 'berries';
  }
  function dispose(): void { for (const g of geoms) g.dispose(); hairMat.dispose(); skinMat.dispose(); noseMat.dispose(); dark.dispose(); white.dispose(); hull.dispose(); fan.dispose(); fan2.dispose(); blue.dispose(); }
  return { group, look, update, dispose };
}
