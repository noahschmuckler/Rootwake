// The village as a scene, V0: a meadow by a stream, six round houses on a ring with their doors to the
// green, the fire at its centre, the places they keep to (a berry thicket, the stream's bank, a copse,
// a field, a goat pen, a standing stone), a wood round the edge, and the eight hobbits themselves on
// Hulda's skeleton at half her height.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HOUSES, HOBBITS, SITES, HOUSE_RADIUS, MEADOW_RADIUS, GREEN, type Hobbit } from './villageModel';
import { mulberry32 } from './colors';
import type { Collider } from './player';
import { spriteMaterial, standees, crownStandees, type Standee } from './sprites';
import { treeParts } from './flora';
import { createHulda } from './huldaCharacter';

export const relief = (x: number, z: number): number => 0.05 * Math.sin(x * 0.5) * Math.cos(z * 0.45);
export const HOBBIT_HEIGHT = 0.46;
export function buildVillage(scene: THREE.Scene) {
  const rand = mulberry32(220926);
  const earth = new THREE.MeshStandardMaterial({ color: '#57734a', roughness: 1 });
  const ground = new THREE.CircleGeometry(MEADOW_RADIUS + 40, 72); ground.rotateX(-Math.PI / 2);
  { const pos = ground.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i))); ground.computeVertexNormals(); }
  scene.add(new THREE.Mesh(ground, earth));
  // The green: a worn circle, and paths trodden from it to each door and out through each gap.
  const worn = new THREE.MeshStandardMaterial({ color: '#8a7a56', roughness: 1, transparent: true, opacity: 0.85, depthWrite: false });
  const green = new THREE.Mesh(new THREE.CircleGeometry(5.2, 40), worn); green.rotation.x = -Math.PI / 2; green.position.set(GREEN.x, 0.04, GREEN.z); scene.add(green);
  const pathGeos: THREE.BufferGeometry[] = [];
  const path = (a: { x: number; z: number }, b: { x: number; z: number }, w: number): void => { const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz); const g = new THREE.PlaneGeometry(w, L); g.rotateX(-Math.PI / 2); g.rotateY(-Math.atan2(dz, dx) - Math.PI / 2); g.translate((a.x + b.x) / 2, 0.035, (a.z + b.z) / 2); pathGeos.push(g); };
  for (const h of HOUSES) path(GREEN, h.door, 1.0);
  for (const s of Object.values(SITES)) if (s.id !== 'fire') path(GREEN, s, 1.1);
  scene.add(new THREE.Mesh(mergeGeometries(pathGeos)!, worn));
  // The stream: a ribbon of water along the north edge, banks of dark earth, past the stream site.
  const water = new THREE.MeshStandardMaterial({ color: '#4f93a8', emissive: '#1a4a58', emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.2, transparent: true, opacity: 0.85 });
  const stream = new THREE.CatmullRomCurve3([new THREE.Vector3(-60, 0.02, 20), new THREE.Vector3(-30, 0.02, 27), new THREE.Vector3(-7, 0.02, 27.5), new THREE.Vector3(15, 0.02, 31), new THREE.Vector3(45, 0.02, 26), new THREE.Vector3(70, 0.02, 30)]);
  const ribbon = (curve: THREE.Curve<THREE.Vector3>, width: number, y: number): THREE.BufferGeometry => { const n = 60, pos: number[] = [], idx: number[] = []; for (let i = 0; i <= n; i++) { const t = i / n, p = curve.getPointAt(t), tan = curve.getTangentAt(t); const nx = -tan.z, nz = tan.x; pos.push(p.x + nx * width / 2, y, p.z + nz * width / 2, p.x - nx * width / 2, y, p.z - nz * width / 2); if (i < n) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g; };
  scene.add(new THREE.Mesh(ribbon(stream, 5, 0.06), new THREE.MeshStandardMaterial({ color: '#3d4a33', roughness: 1 })), new THREE.Mesh(ribbon(stream, 3.4, 0.08), water));
  // Houses: a round wall, a cone of thatch, a round door to the green, a window that glows at night.
  const wall = new THREE.MeshStandardMaterial({ color: '#c9b79a', roughness: 1, flatShading: true }), thatch = new THREE.MeshStandardMaterial({ color: '#8a7a3e', roughness: 1, flatShading: true }), doorMat = new THREE.MeshStandardMaterial({ color: '#3a2a1a', roughness: 0.9 });
  const windowMat = new THREE.MeshStandardMaterial({ color: '#f0d890', emissive: '#f0b050', emissiveIntensity: 0, roughness: 0.6 });
  const colliders: Collider[] = [];
  for (const h of HOUSES) {
    const g = new THREE.Group(); g.position.set(h.x, relief(h.x, h.z), h.z); g.rotation.y = -h.facing; scene.add(g);
    const w = new THREE.Mesh(new THREE.CylinderGeometry(HOUSE_RADIUS, HOUSE_RADIUS + 0.1, 0.95, 14), wall); w.position.y = 0.475; g.add(w);
    const r = new THREE.Mesh(new THREE.ConeGeometry(HOUSE_RADIUS + 0.5, 1.0, 14), thatch); r.position.y = 1.4; g.add(r);
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.3, 18), doorMat); d.position.set(HOUSE_RADIUS + 0.02, 0.36, 0); d.rotation.y = Math.PI / 2; g.add(d);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.2), windowMat); win.position.set(HOUSE_RADIUS * Math.cos(1.1) + 0.02, 0.55, HOUSE_RADIUS * Math.sin(1.1)); win.rotation.y = Math.PI / 2 - 1.1; g.add(win);
    colliders.push({ x: h.x, z: h.z, radius: HOUSE_RADIUS + 0.05, minY: -0.2, maxY: 2 });
  }
  // The fire on the green: a ring of stones, embers, flames that show at night.
  const stone = new THREE.MeshStandardMaterial({ color: '#6f6a5f', roughness: 1, flatShading: true });
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), stone); m.position.set(GREEN.x + Math.cos(a) * 0.7, 0.12, GREEN.z + Math.sin(a) * 0.7); scene.add(m); }
  const flameMat = new THREE.MeshBasicMaterial({ color: '#ffb347', transparent: true, opacity: 0.85 });
  const flames = new THREE.Group(); scene.add(flames); for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.18 - i * 0.04, 0.6 - i * 0.12, 6), flameMat); f.position.set(GREEN.x + (i - 1) * 0.12, 0.3 + i * 0.1, GREEN.z + (i % 2) * 0.1); flames.add(f); }
  const fireLight = new THREE.PointLight('#ffa040', 0, 12, 1.6); fireLight.position.set(GREEN.x, 1.0, GREEN.z); scene.add(fireLight);
  // The places: a thicket of berry bushes, a field of tilled strips, a pen with a fence, a standing stone, the copse.
  const bushMat = spriteMaterial('leaf', '#4f7a3e'), berryMat = new THREE.MeshStandardMaterial({ color: '#8a2a4a', emissive: '#4a1020', emissiveIntensity: 0.3, roughness: 0.6 });
  const bushCards: Standee[] = [];
  for (let i = 0; i < 7; i++) { const a = rand() * 6.28, r = rand() * 2.6, c = new THREE.Vector3(SITES.thicket.x + Math.cos(a) * r, 0, SITES.thicket.z + Math.sin(a) * r); bushCards.push(...crownStandees(rand, c.clone().setY(0.55), 0.9, 0.5, 0.9, 6, 0.7)); for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 5, 4), berryMat); b.position.set(c.x + (rand() - 0.5) * 1.2, 0.4 + rand() * 0.5, c.z + (rand() - 0.5) * 1.2); scene.add(b); } }
  scene.add(new THREE.Mesh(standees(bushCards), bushMat));
  const tilled = new THREE.MeshStandardMaterial({ color: '#5a4630', roughness: 1 });
  for (let i = -2; i <= 2; i++) { const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 5), tilled); strip.rotation.x = -Math.PI / 2; strip.rotation.z = 0.3; strip.position.set(SITES.field.x + i * 1.0, 0.05, SITES.field.z + i * 0.3); scene.add(strip); }
  const post = new THREE.MeshStandardMaterial({ color: '#7a6448', roughness: 1 }), posts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, p = new THREE.CylinderGeometry(0.06, 0.07, 0.9, 5); p.translate(SITES.pen.x + Math.cos(a) * 2.4, 0.45, SITES.pen.z + Math.sin(a) * 2.4); posts.push(p); const b = (i + 1) / 10 * Math.PI * 2, rail = new THREE.BoxGeometry(Math.hypot(Math.cos(b) - Math.cos(a), Math.sin(b) - Math.sin(a)) * 2.4, 0.06, 0.06); rail.rotateY(-Math.atan2(Math.sin(b) - Math.sin(a), Math.cos(b) - Math.cos(a))); rail.translate(SITES.pen.x + Math.cos((a + b) / 2) * 2.4 * Math.cos(Math.PI / 10), 0.7, SITES.pen.z + Math.sin((a + b) / 2) * 2.4 * Math.cos(Math.PI / 10)); posts.push(rail); }
  scene.add(new THREE.Mesh(mergeGeometries(posts)!, post));
  const goat = new THREE.MeshStandardMaterial({ color: '#d9d2c4', roughness: 1 });
  for (let i = 0; i < 3; i++) { const g = new THREE.Group(); g.position.set(SITES.pen.x + (rand() - 0.5) * 2.5, 0, SITES.pen.z + (rand() - 0.5) * 2.5); g.rotation.y = rand() * 6.28; const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), goat); body.scale.set(1.5, 1, 1); body.position.y = 0.42; g.add(body); const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 5), goat); head.position.set(0.5, 0.58, 0); g.add(head); for (const [x, z] of [[-0.25, -0.12], [-0.25, 0.12], [0.25, -0.12], [0.25, 0.12]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 5), goat); leg.position.set(x, 0.2, z); g.add(leg); } scene.add(g); }
  const menhir = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.45), stone); menhir.position.set(SITES.shrine.x, 1.1, SITES.shrine.z); menhir.rotation.set(0.05, 0.6, 0.06); scene.add(menhir);
  // Trees: the copse, and the wood round the meadow's edge; all colliders.
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 }), leafMat = spriteMaterial('leaf', '#5f8657'), rootBark = new THREE.MeshStandardMaterial({ color: '#8a6f4e', roughness: 0.95 });
  const wood: THREE.BufferGeometry[] = [], cards: Standee[] = [], collars: THREE.BufferGeometry[] = [];
  const plant = (x: number, z: number, size: number): void => { const t = treeParts(rand, x, relief(x, z), z, size); wood.push(...t.wood); cards.push(...t.cards); collars.push(...t.roots); colliders.push({ x, z, radius: 0.32 * size, minY: -0.2, maxY: 3.5 * size }); };
  for (let i = 0; i < 6; i++) { const a = rand() * 6.28, r = 1 + rand() * 3; plant(SITES.copse.x + Math.cos(a) * r, SITES.copse.z + Math.sin(a) * r, 0.9 + rand() * 0.5); }
  for (let i = 0; i < 140; i++) { const a = rand() * 6.28, r = MEADOW_RADIUS - 4 + rand() * 40, x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.abs(z - 28) < 4 && x > -60 && x < 70) continue; plant(x, z, 0.9 + rand() * 0.7); }
  scene.add(new THREE.Mesh(mergeGeometries(wood)!, bark), new THREE.Mesh(standees(cards), leafMat), new THREE.Mesh(mergeGeometries(collars)!, rootBark));
  const grassMat = spriteMaterial('grass', '#9fc06a'), grass: Standee[] = [];
  for (let i = 0; i < 900; i++) { const a = rand() * 6.28, r = Math.sqrt(rand()) * (MEADOW_RADIUS + 2), x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x, z) < 5.5 || HOUSES.some(h => Math.hypot(x - h.x, z - h.z) < HOUSE_RADIUS + 0.4)) continue; const k = 0.22 + rand() * 0.3; grass.push({ position: new THREE.Vector3(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(grass), grassMat));
  // The hobbits: Hulda's skeleton at half her height, in cloth, each with their own colours.
  const figures = HOBBITS.map((h: Hobbit) => { const f = createHulda({ name: h.name, height: HOBBIT_HEIGHT, skin: '#e0c4a0', cloth: h.colour, clothLight: h.colour, hair: h.hair, feet: '#5a4a3a', locks: false, leaves: false, skirt: true }); scene.add(f.group); return f; });
  // Her shapes for later passes: none yet; empty groups keep the presentation's contract.
  const figure = new THREE.Group(), mass = new THREE.Group();
  /** daylight 0..1 sets the fire and the windows: lit as the sun goes. */
  function update(daylight: number, t: number): void {
    const night = 1 - Math.min(1, daylight * 2.5);
    fireLight.intensity = 14 * night; flames.visible = night > 0.05; flames.scale.setScalar(0.8 + night * (0.2 + Math.sin(t * 0.012) * 0.08)); windowMat.emissiveIntensity = 1.4 * night;
  }
  return { colliders, figures, figure, mass, update, stream };
}
export type VillageWorld = ReturnType<typeof buildVillage>;
