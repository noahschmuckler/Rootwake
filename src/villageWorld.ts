// The village as a scene, V1: a meadow by a stream, six round houses on a ring with their doors to the
// green, the fire at its centre, the places they keep to (a berry thicket, the stream's bank, a copse,
// a field, a goat pen, a standing stone), a wood round the edge, and the eight hobbits themselves on
// Hulda's skeleton at half her height. V1 shows the land's stock and the stores by count: berries on the
// bushes, branches under the copse, the strips' stalks by growth, the goats' pails, the baskets, the
// trough, the woodpile, the bin and the pails on the green's edge, an armful in a hobbit's hand, and the
// fire by the wood laid on it (updateLand).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HOUSES, HOBBITS, SITES, STORES, STORE_LIST, HOUSE_RADIUS, MEADOW_RADIUS, GREEN, TREES, TREE_ROOTS, STREAM_Z, BERRY_CAP, BRANCH_CAP, MILK_PER_DAY, CROP_STRIPS, WOOD_PER_NIGHT, crownHeight, trunkRadius, type Hobbit, type Tree, type Village, type Store } from './villageModel';
import { mulberry32 } from './colors';
import type { Collider } from './player';
import { spriteMaterial, standees, crownStandees, type Standee } from './sprites';
import { treeParts, taperedTube } from './flora';
import { createHulda } from './huldaCharacter';

export const relief = (x: number, z: number): number => 0.05 * Math.sin(x * 0.5) * Math.cos(z * 0.45);
export const HOBBIT_HEIGHT = 0.46;
export function buildVillage(scene: THREE.Scene) {
  const rand = mulberry32(220926);
  // The meadow thins to glass while she is in the roots beneath it, so the tree roots' fast lanes show.
  const earth = new THREE.MeshStandardMaterial({ color: '#57734a', roughness: 1, transparent: true, opacity: 1, side: THREE.DoubleSide });
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
  const stream = new THREE.CatmullRomCurve3(Array.from({ length: 14 }, (_, i) => { const x = -70 + i * 10.8; return new THREE.Vector3(x, 0.02, STREAM_Z(x)); }));
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
  const bushCards: Standee[] = [], berries: THREE.Mesh[] = [];
  // Seven bushes with BERRY_CAP berries between them; the model's count says how many show, so picking thins the thicket in view.
  for (let i = 0; i < 7; i++) { const a = rand() * 6.28, r = rand() * 2.6, c = new THREE.Vector3(SITES.thicket.x + Math.cos(a) * r, 0, SITES.thicket.z + Math.sin(a) * r); bushCards.push(...crownStandees(rand, c.clone().setY(0.55), 0.9, 0.5, 0.9, 6, 0.7)); for (let k = 0; k < BERRY_CAP / 7; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.055, 5, 4), berryMat); b.position.set(c.x + (rand() - 0.5) * 1.2, 0.4 + rand() * 0.5, c.z + (rand() - 0.5) * 1.2); scene.add(b); berries.push(b); } }
  for (let i = berries.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [berries[i], berries[j]] = [berries[j], berries[i]]; }
  scene.add(new THREE.Mesh(standees(bushCards), bushMat));
  const tilled = new THREE.MeshStandardMaterial({ color: '#5a4630', roughness: 1 });
  // Five strips, each a row of stalks that rise with the strip's growth and turn gold when ripe; harvested, the strip is bare and sown again.
  const stalkMats: THREE.MeshStandardMaterial[] = [], strips: THREE.Group[] = [];
  for (let n = 0; n < CROP_STRIPS; n++) { const i = n - 2, strip = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 5), tilled); strip.rotation.x = -Math.PI / 2; strip.rotation.z = 0.3; strip.position.set(SITES.field.x + i * 1.0, 0.05, SITES.field.z + i * 0.3); scene.add(strip);
    const mat = new THREE.MeshStandardMaterial({ color: '#7fa64a', roughness: 0.9 }), g = new THREE.Group(); g.position.copy(strip.position); g.rotation.y = -0.3; scene.add(g); stalkMats.push(mat); strips.push(g);
    const stalks: THREE.BufferGeometry[] = []; for (let k = 0; k < 14; k++) { const st = new THREE.CylinderGeometry(0.012, 0.02, 1, 4); st.translate((rand() - 0.5) * 0.45, 0.5, -2.2 + k * 0.33 + (rand() - 0.5) * 0.15); const head = new THREE.ConeGeometry(0.05, 0.16, 5); head.translate(0, 1.05, 0); head.translate((rand() - 0.5) * 0.45, 0, -2.2 + k * 0.33 + (rand() - 0.5) * 0.15); stalks.push(st, head); }
    g.add(new THREE.Mesh(mergeGeometries(stalks)!, mat)); }
  const post = new THREE.MeshStandardMaterial({ color: '#7a6448', roughness: 1 }), posts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, p = new THREE.CylinderGeometry(0.06, 0.07, 0.9, 5); p.translate(SITES.pen.x + Math.cos(a) * 2.4, 0.45, SITES.pen.z + Math.sin(a) * 2.4); posts.push(p); const b = (i + 1) / 10 * Math.PI * 2, rail = new THREE.BoxGeometry(Math.hypot(Math.cos(b) - Math.cos(a), Math.sin(b) - Math.sin(a)) * 2.4, 0.06, 0.06); rail.rotateY(-Math.atan2(Math.sin(b) - Math.sin(a), Math.cos(b) - Math.cos(a))); rail.translate(SITES.pen.x + Math.cos((a + b) / 2) * 2.4 * Math.cos(Math.PI / 10), 0.7, SITES.pen.z + Math.sin((a + b) / 2) * 2.4 * Math.cos(Math.PI / 10)); posts.push(rail); }
  scene.add(new THREE.Mesh(mergeGeometries(posts)!, post));
  const goat = new THREE.MeshStandardMaterial({ color: '#d9d2c4', roughness: 1 });
  for (let i = 0; i < 3; i++) { const g = new THREE.Group(); g.position.set(SITES.pen.x + (rand() - 0.5) * 2.5, 0, SITES.pen.z + (rand() - 0.5) * 2.5); g.rotation.y = rand() * 6.28; const body = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), goat); body.scale.set(1.5, 1, 1); body.position.y = 0.42; g.add(body); const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 7, 5), goat); head.position.set(0.5, 0.58, 0); g.add(head); for (const [x, z] of [[-0.25, -0.12], [-0.25, 0.12], [0.25, -0.12], [0.25, 0.12]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 5), goat); leg.position.set(x, 0.2, z); g.add(leg); } scene.add(g); }
  // The goats' milk for the day stands by the gate as pails until Bram carries them; the branches lie under the copse until Marlo gathers them.
  const pailMat = new THREE.MeshStandardMaterial({ color: '#c9c2b0', roughness: 0.5, metalness: 0.3 }), milkMat = new THREE.MeshStandardMaterial({ color: '#f4f1e6', roughness: 0.8 });
  const pail = (): THREE.Group => { const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.16, 8, 1, true), pailMat); body.position.y = 0.08; body.material.side = THREE.DoubleSide; g.add(body); const top = new THREE.Mesh(new THREE.CircleGeometry(0.095, 8), milkMat); top.rotation.x = -Math.PI / 2; top.position.y = 0.15; g.add(top); return g; };
  const penPails: THREE.Group[] = []; for (let i = 0; i < MILK_PER_DAY; i++) { const g = pail(); const a = 2.9 + i * 0.22; g.position.set(SITES.pen.x + Math.cos(a) * 2.9, relief(SITES.pen.x, SITES.pen.z), SITES.pen.z + Math.sin(a) * 2.9); scene.add(g); penPails.push(g); }
  const stickMat = new THREE.MeshStandardMaterial({ color: '#6b5238', roughness: 1 }), sticks: THREE.Mesh[] = [];
  for (let i = 0; i < BRANCH_CAP; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.045, 0.7 + rand() * 0.4, 5), stickMat); const a = rand() * 6.28, r = 0.6 + rand() * 3.0; m.position.set(SITES.copse.x + Math.cos(a) * r, 0.05, SITES.copse.z + Math.sin(a) * r); m.rotation.set(Math.PI / 2, 0, rand() * 6.28); m.rotation.order = 'ZXY'; scene.add(m); sticks.push(m); }
  // The stores on the green's edge, each on the side of its place: a rack of baskets, a trough, a woodpile, a bin of sacks, a shelf of pails. Each shows its count.
  const basketMat = new THREE.MeshStandardMaterial({ color: '#a8894f', roughness: 1 }), sackMat = new THREE.MeshStandardMaterial({ color: '#d2b98a', roughness: 1 }), troughMat = new THREE.MeshStandardMaterial({ color: '#6f5a3e', roughness: 1 });
  const storeItems: Record<Store, THREE.Object3D[]> = { berries: [], water: [], wood: [], grain: [], milk: [] };
  const storeFrame = (id: Store, w: number, d: number, h: number): THREE.Group => { const st = STORES[id], g = new THREE.Group(); g.position.set(st.x, relief(st.x, st.z), st.z); g.rotation.y = -Math.atan2(st.z, st.x); scene.add(g); const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), troughMat); base.position.y = h / 2; g.add(base); return g; };
  { const g = storeFrame('berries', 1.4, 0.5, 0.08); for (let i = 0; i < STORES.berries.cap; i++) { const b = new THREE.Group(); const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.12, 8, 1, true), basketMat); cup.material.side = THREE.DoubleSide; cup.position.y = 0.06; b.add(cup); const fill = new THREE.Mesh(new THREE.CircleGeometry(0.1, 8), berryMat); fill.rotation.x = -Math.PI / 2; fill.position.y = 0.11; b.add(fill); b.position.set(-0.55 + (i % 4) * 0.36, 0.08 + Math.floor(i / 4) * 0.13, -0.12 + Math.floor(i / 4) * 0.12); g.add(b); storeItems.berries.push(b); } }
  { const st = STORES.water, g = new THREE.Group(); g.position.set(st.x, relief(st.x, st.z), st.z); g.rotation.y = -Math.atan2(st.z, st.x); scene.add(g); const box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.6), troughMat); box.position.y = 0.2; g.add(box); for (let i = 0; i < st.cap; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.5), water); w.position.y = 0.08 + i * 0.034; g.add(w); storeItems.water.push(w); } }
  { const g = storeFrame('wood', 1.5, 0.6, 0.05); for (let i = 0; i < STORES.wood.cap; i++) { const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.3, 7), stickMat); log.rotation.z = Math.PI / 2; const row = Math.floor(i / 4); log.position.set(0, 0.12 + row * 0.13, -0.2 + (i % 4) * 0.15 - row * 0.07); g.add(log); storeItems.wood.push(log); } }
  { const g = storeFrame('grain', 1.2, 0.7, 0.06); for (let i = 0; i < STORES.grain.cap; i++) { const sack = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 6), sackMat); sack.scale.set(1, 0.8, 1); const row = Math.floor(i / 6); sack.position.set(-0.5 + (i % 6) * 0.2 + row * 0.1, 0.16 + row * 0.2, -0.12 + row * 0.02); g.add(sack); storeItems.grain.push(sack); } }
  { const g = storeFrame('milk', 1.5, 0.45, 0.35); for (let i = 0; i < STORES.milk.cap; i++) { const p = pail(); p.position.set(-0.6 + (i % 4) * 0.4, i < 4 ? 0.35 : 0.02, i < 4 ? 0 : 0.32); g.add(p); storeItems.milk.push(p); } }
  const menhir = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.45), stone); menhir.position.set(SITES.shrine.x, 1.1, SITES.shrine.z); menhir.rotation.set(0.05, 0.6, 0.06); scene.add(menhir);
  // Trees: the copse, and the wood round the meadow's edge; all colliders.
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 }), leafMat = spriteMaterial('leaf', '#5f8657'), rootBark = new THREE.MeshStandardMaterial({ color: '#8a6f4e', roughness: 0.95 });
  const wood: THREE.BufferGeometry[] = [], cards: Standee[] = [], collars: THREE.BufferGeometry[] = [];
  for (const t of TREES) { const parts = treeParts(rand, t.x, relief(t.x, t.z), t.z, t.size); wood.push(...parts.wood); cards.push(...parts.cards); collars.push(...parts.roots); colliders.push({ x: t.x, z: t.z, radius: trunkRadius(t), minY: -0.2, maxY: crownHeight(t) }); }
  scene.add(new THREE.Mesh(mergeGeometries(wood)!, bark), new THREE.Mesh(standees(cards), leafMat), new THREE.Mesh(mergeGeometries(collars)!, rootBark));
  // The tree roots under the soil: her fast lanes, seen when the meadow goes glassy.
  const laneMat = new THREE.MeshStandardMaterial({ color: '#8a6f4e', emissive: '#c9a24a', emissiveIntensity: 0.05, roughness: 0.95 });
  const lanes: THREE.BufferGeometry[] = [];
  for (const r of TREE_ROOTS) lanes.push(taperedTube(r.curve, Math.ceil(r.length * 2), 6, t => 0.15 * (0.55 + 0.45 * Math.abs(2 * t - 1)), 0.22));
  scene.add(new THREE.Mesh(mergeGeometries(lanes)!, laneMat));
  const grassMat = spriteMaterial('grass', '#9fc06a'), grass: Standee[] = [];
  for (let i = 0; i < 900; i++) { const a = rand() * 6.28, r = Math.sqrt(rand()) * (MEADOW_RADIUS + 2), x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x, z) < 5.5 || HOUSES.some(h => Math.hypot(x - h.x, z - h.z) < HOUSE_RADIUS + 0.4)) continue; const k = 0.22 + rand() * 0.3; grass.push({ position: new THREE.Vector3(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(grass), grassMat));
  // The hobbits: Hulda's skeleton at half her height, in cloth, each with their own colours.
  const figures = HOBBITS.map((h: Hobbit) => { const f = createHulda({ name: h.name, height: HOBBIT_HEIGHT, skin: '#e0c4a0', cloth: h.colour, clothLight: h.colour, hair: h.hair, feet: '#5a4a3a', locks: false, leaves: false, skirt: true }); scene.add(f.group); return f; });
  // An armful in the right hand: a basket, a bucket, a bundle of sticks, a sack or a pail, one of them shown while the model says the hobbit carries. The skeleton is in centimetres, so the things are sized in centimetres in the hand's space.
  const carried = figures.map(f => { const hand = f.bones.get('mixamorigRightHand')!, anchor = new THREE.Group(); anchor.position.set(0, 9, 2); hand.add(anchor); const items: Record<Store, THREE.Object3D> = {
    berries: (() => { const g = new THREE.Group(); const cup = new THREE.Mesh(new THREE.CylinderGeometry(8, 6, 8, 8, 1, true), basketMat); cup.material = basketMat.clone(); (cup.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; g.add(cup); const fill = new THREE.Mesh(new THREE.CircleGeometry(7.5, 8), berryMat); fill.rotation.x = -Math.PI / 2; fill.position.y = 3.6; g.add(fill); return g; })(),
    water: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(6, 5, 10, 8, 1, true), pailMat); b.material = pailMat.clone(); (b.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; g.add(b); const w = new THREE.Mesh(new THREE.CircleGeometry(5.5, 8), water); w.rotation.x = -Math.PI / 2; w.position.y = 4; g.add(w); return g; })(),
    wood: (() => { const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2, 40, 5), stickMat); st.rotation.z = Math.PI / 2 + 0.25; st.position.set(0, i * 3.2, (i - 1) * 3); g.add(st); } return g; })(),
    grain: (() => { const sack = new THREE.Mesh(new THREE.SphereGeometry(9, 7, 6), sackMat); sack.scale.set(1, 1.2, 1); return sack; })(),
    milk: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(6, 5, 10, 8, 1, true), pailMat); b.material = pailMat.clone(); (b.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; g.add(b); const m = new THREE.Mesh(new THREE.CircleGeometry(5.5, 8), milkMat); m.rotation.x = -Math.PI / 2; m.position.y = 4; g.add(m); return g; })(),
  }; for (const k of STORE_LIST) { items[k].visible = false; anchor.add(items[k]); } return items; });
  // Her other shapes: the figure of leaves at a crown, and the bulge of grass she is under the meadow.
  const figureMat = spriteMaterial('leaf', '#b9e58a', { emissive: '#4a7a2a', emissiveIntensity: 0.35 });
  const figure = new THREE.Group(); figure.visible = false; scene.add(figure);
  { const fr = mulberry32(77); const body = crownStandees(fr, new THREE.Vector3(0, 0.95, 0), 0.42, 0.55, 0.3, 9, 0.5); body.push({ position: new THREE.Vector3(0, 1.35, 0), yaw: 0.4, width: 0.42, height: 0.42, flat: true }); figure.add(new THREE.Mesh(standees(body), figureMat)); }
  const mass = new THREE.Group(); mass.visible = false; scene.add(mass);
  { const mr = mulberry32(78); const tufts: Standee[] = []; for (let i = 0; i < 14; i++) { const a = mr() * 6.28, r = mr() * 0.42, k = 0.28 + mr() * 0.22; tufts.push({ position: new THREE.Vector3(Math.cos(a) * r, 0.3 - r * 0.35, Math.sin(a) * r), yaw: mr() * Math.PI, width: k, height: k * 1.2 }); } mass.add(new THREE.Mesh(standees(tufts), spriteMaterial('grass', '#b6d47a', { emissive: '#3a5a20', emissiveIntensity: 0.25 }))); }
  const crownPoint = (t: Tree, az: number): THREE.Vector3 => new THREE.Vector3(t.x + Math.cos(az) * 1.1 * t.size, relief(t.x, t.z) + crownHeight(t) + 0.15, t.z + Math.sin(az) * 1.1 * t.size);
  const trunkPoint = (t: Tree, h: number, az: number): THREE.Vector3 => new THREE.Vector3(t.x + Math.cos(az) * (trunkRadius(t) + 0.12), relief(t.x, t.z) + h, t.z + Math.sin(az) * (trunkRadius(t) + 0.12));
  /** daylight 0..1 sets the fire and the windows: lit as the sun goes; under 0..1 thins the meadow for the roots beneath. */
  function update(daylight: number, t: number, under = 0): void {
    earth.opacity = 1 - under * 0.6; earth.depthWrite = under < 0.5; laneMat.emissiveIntensity = 0.05 + under * 0.5;
    const night = 1 - Math.min(1, daylight * 2.5);
    // The fire is as big as the wood on it: full from Odo's armful at dusk, dying by dawn; nothing laid, embers only.
    const fuel = Math.min(1, fireWood / WOOD_PER_NIGHT), size = 0.25 + 0.75 * fuel;
    fireLight.intensity = 14 * night * (0.15 + 0.85 * fuel); flames.visible = night > 0.05 && fuel > 0.02; flames.scale.setScalar(size * (0.8 + night * (0.2 + Math.sin(t * 0.012) * 0.08))); windowMat.emissiveIntensity = 1.4 * night;
  }
  /** The land and the stores by the model's counts, the armfuls in hand, and the fire by the wood laid on it. */
  function updateLand(v: Village): void {
    const nb = Math.floor(v.land.berries); for (let i = 0; i < berries.length; i++) berries[i].visible = i < nb;
    for (let i = 0; i < sticks.length; i++) sticks[i].visible = i < v.land.branches;
    for (let i = 0; i < penPails.length; i++) penPails[i].visible = i < v.land.milk;
    for (let i = 0; i < strips.length; i++) { const c = v.land.crops[i]; strips[i].scale.y = 0.08 + 0.92 * c; strips[i].visible = c > 0.02; stalkMats[i].color.set(c >= 1 ? '#d9b44a' : c > 0.7 ? '#b9a852' : '#7fa64a'); }
    for (const k of STORE_LIST) { const n = Math.floor(v.stores[k]); storeItems[k].forEach((o, i) => { o.visible = i < n; }); }
    for (let i = 0; i < HOBBITS.length; i++) { const c = v.hobbits[i].carry; for (const k of STORE_LIST) carried[i][k].visible = !!c && c.kind === k; }
    fireWood = v.fireWood;
  }
  let fireWood = 0;
  /** Which armful each figure shows, for checks. */
  const armfuls = (): (Store | null)[] => carried.map(c => STORE_LIST.find(k => c[k].visible) ?? null);
  return { colliders, figures, figure, mass, update, updateLand, armfuls, stream, crownPoint, trunkPoint };
}
export type VillageWorld = ReturnType<typeof buildVillage>;
