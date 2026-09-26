// The village as a scene, V1: a meadow by a stream, six round houses on a ring with their doors to the
// green, the fire at its centre, the places they keep to (a berry thicket, the stream's bank, a copse,
// a field, a goat pen, a standing stone), a wood round the edge, and the eight hobbits themselves on
// Hulda's skeleton at half her height. V1 shows the land's stock and the stores by count: berries on the
// bushes, branches under the copse, the strips' stalks by growth, the goats' pails, the baskets, the
// trough, the woodpile, the bin and the pails on the green's edge, an armful in a hobbit's hand, and the
// fire by the wood laid on it (updateLand).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { HOUSES, HOUSE_CAP, housePlace, siteHouse, SITE_RING_R, HUT_WOOD, HUT_WATER, HUT_WORK_TICKS, SITES, STORES, STORE_LIST, STATIONS, STACK_CAP, OVERFILL, HOUSE_RADIUS, MEADOW_RADIUS, GREEN, TREES, TREE_ROOTS, STREAM_Z, BERRY_CAP, BRANCH_CAP, MILK_PER_DAY, CROP_STRIPS, WOOD_PER_NIGHT, crownHeight, trunkRadius, hobbitById, isSpoiled, YIELD_SITES, type YieldSite, type HobbitState, type Tree, type Village, type Store, type House } from './villageModel';
import { mulberry32 } from './colors';
import { createTerrain, type Terrain } from './worldTerrain';
import type { Collider } from './player';
import { spriteMaterial, standees, crownStandees, type Standee } from './sprites';
import { treeParts, taperedTube } from './flora';
import { createHulda } from './huldaCharacter';

/** The ground's height: the meadow's gentle relief, and beyond the island the chunks' hills (zero within the village). */
export const relief = createTerrain(1).height;
export const HOBBIT_HEIGHT = 0.46;
export function buildVillage(scene: THREE.Scene, terrain: Terrain = createTerrain(1)) {
  const relief = terrain.height;
  const rand = mulberry32(220926);
  // The chunk surface owns the meadow ground; no second translucent disc.
  // The green: a worn circle, and paths trodden from it to each door and out through each gap.
  const worn = new THREE.MeshStandardMaterial({ color: '#8a7a56', roughness: 1, transparent: true, opacity: 0.85, depthWrite: false });
  // The decals on the ground (the green, the paths, the stream) follow the meadow's relief vertex by vertex (it undulates five centimetres, so a flat decal sank under it in places) and draw after the ground tiles (renderOrder 1: the tiles are transparent for the view through the soil, and a transparent tile drawn after a decal that writes no depth covered it, from some angles and not others).
  const onGround = (geo: THREE.BufferGeometry, lift: number): THREE.BufferGeometry => { const pos = geo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(pos.getX(i), pos.getZ(i)) + lift); geo.computeVertexNormals(); return geo; };
  const DECAL_ORDER = 1;
  { const geo = new THREE.CircleGeometry(5.2, 40, 0, Math.PI * 2); geo.rotateX(-Math.PI / 2); geo.translate(GREEN.x, 0, GREEN.z); const green = new THREE.Mesh(onGround(geo, 0.04), worn); green.renderOrder = DECAL_ORDER; scene.add(green); }
  const pathGeos: THREE.BufferGeometry[] = [];
  const path = (a: { x: number; z: number }, b: { x: number; z: number }, w: number): void => { const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz); const g = new THREE.PlaneGeometry(w, L, 1, Math.max(2, Math.ceil(L / 1.2))); g.rotateX(-Math.PI / 2); g.rotateY(-Math.atan2(dz, dx) - Math.PI / 2); g.translate((a.x + b.x) / 2, 0, (a.z + b.z) / 2); pathGeos.push(onGround(g, 0.035)); };
  for (const h of HOUSES) path(GREEN, h.door, 1.0);
  for (const s of Object.values(SITES)) if (s.id !== 'fire') path(GREEN, s, 1.1);
  { const paths = new THREE.Mesh(mergeGeometries(pathGeos)!, worn); paths.renderOrder = DECAL_ORDER; scene.add(paths); }
  // The stream: a ribbon of water along the north edge, banks of dark earth, past the stream site.
  const water = new THREE.MeshStandardMaterial({ color: '#4f93a8', emissive: '#1a4a58', emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.2, transparent: true, opacity: 0.85 });
  const stream = new THREE.CatmullRomCurve3(Array.from({ length: 14 }, (_, i) => { const x = -70 + i * 10.8; return new THREE.Vector3(x, 0.02, STREAM_Z(x)); }));
  // The ribbon's triangles face up (they were wound facing down, and a single-sided bank and water were culled from above: no visible stream), and it lies on the relief.
  const ribbon = (curve: THREE.Curve<THREE.Vector3>, width: number, lift: number): THREE.BufferGeometry => { const n = 120, pos: number[] = [], idx: number[] = []; for (let i = 0; i <= n; i++) { const t = i / n, p = curve.getPointAt(t), tan = curve.getTangentAt(t); const nx = -tan.z, nz = tan.x; pos.push(p.x + nx * width / 2, 0, p.z + nz * width / 2, p.x - nx * width / 2, 0, p.z - nz * width / 2); if (i < n) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return onGround(g, lift); };
  { const bank = new THREE.Mesh(ribbon(stream, 5, 0.06), new THREE.MeshStandardMaterial({ color: '#3d4a33', roughness: 1 })), flow = new THREE.Mesh(ribbon(stream, 3.4, 0.08), water); bank.name = 'stream-bank'; flow.name = 'stream-water'; flow.renderOrder = DECAL_ORDER; scene.add(bank, flow); }
  // Houses: a round wall, a cone of thatch, a round door to the green, a window that glows at night.
  const wall = new THREE.MeshStandardMaterial({ color: '#c9b79a', roughness: 1, flatShading: true }), thatch = new THREE.MeshStandardMaterial({ color: '#8a7a3e', roughness: 1, flatShading: true }), doorMat = new THREE.MeshStandardMaterial({ color: '#3a2a1a', roughness: 0.9 });
  const windowMat = new THREE.MeshStandardMaterial({ color: '#f0d890', emissive: '#f0b050', emissiveIntensity: 0, roughness: 0.6 });
  const colliders: Collider[] = [];
  const houseGroup = (h: House): THREE.Group => {
    const g = new THREE.Group(); g.position.set(h.x, relief(h.x, h.z), h.z); g.rotation.y = -h.facing; g.name = `house-${h.id}`; scene.add(g);
    const w = new THREE.Mesh(new THREE.CylinderGeometry(HOUSE_RADIUS, HOUSE_RADIUS + 0.1, 0.95, 14), wall); w.position.y = 0.475; g.add(w);
    const r = new THREE.Mesh(new THREE.ConeGeometry(HOUSE_RADIUS + 0.5, 1.0, 14), thatch); r.position.y = 1.4; g.add(r);
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.3, 18), doorMat); d.position.set(HOUSE_RADIUS + 0.02, 0.36, 0); d.rotation.y = Math.PI / 2; g.add(d);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.2), windowMat); win.position.set(HOUSE_RADIUS * Math.cos(1.1) + 0.02, 0.55, HOUSE_RADIUS * Math.sin(1.1)); win.rotation.y = Math.PI / 2 - 1.1; g.add(win);
    return g;
  };
  for (const h of HOUSES) { houseGroup(h); colliders.push({ x: h.x, z: h.z, radius: HOUSE_RADIUS + 0.05, minY: -0.2, maxY: 2 }); }
  const baseColliders = colliders.length;
  // G1: the huts built since, on the second ring, each with a worn path to the green; shown as the model says how many stand (setHouses), hidden again when the village starts over.
  const huts = new Map<number, THREE.Group>(), hutPaths = new Map<number, THREE.Mesh>();
  function setHouses(v: Village): void {
    for (let id = 6; id < 6 + v.huts; id++) if (!huts.has(id)) { const h = housePlace(id), g = houseGroup(h); const pg = new THREE.PlaneGeometry(1.0, Math.hypot(h.door.x - GREEN.x, h.door.z - GREEN.z), 1, 12); pg.rotateX(-Math.PI / 2); pg.rotateY(-Math.atan2(h.door.z - GREEN.z, h.door.x - GREEN.x) - Math.PI / 2); pg.translate((GREEN.x + h.door.x) / 2, 0, (GREEN.z + h.door.z) / 2); const path = new THREE.Mesh(onGround(pg, 0.035), worn); path.renderOrder = DECAL_ORDER; scene.add(path); hutPaths.set(id, path); huts.set(id, g); }
    colliders.length = baseColliders;
    for (const [id, g] of huts) { g.visible = id < 6 + v.huts; hutPaths.get(id)!.visible = g.visible; if (g.visible) { const h = housePlace(id); colliders.push({ x: h.x, z: h.z, radius: HOUSE_RADIUS + 0.05, minY: -0.2, maxY: 2 }); } }
  }
  // G1: the stakes for a hut going up: four stakes, a wall that rises with the wood and water brought, the thatch with the work (setSite).
  const stakeMat = new THREE.MeshStandardMaterial({ color: '#7a6448', roughness: 1 }), siteGroup = new THREE.Group(); siteGroup.visible = false; siteGroup.name = 'hut-site'; scene.add(siteGroup);
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4, st = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.8, 5), stakeMat); st.position.set(Math.cos(a) * HOUSE_RADIUS, 0.4, Math.sin(a) * HOUSE_RADIUS); siteGroup.add(st); }
  const siteWall = new THREE.Mesh(new THREE.CylinderGeometry(HOUSE_RADIUS, HOUSE_RADIUS + 0.1, 0.95, 14), wall); siteGroup.add(siteWall); const siteThatch = new THREE.Mesh(new THREE.ConeGeometry(HOUSE_RADIUS + 0.5, 1.0, 14), thatch); siteGroup.add(siteThatch);
  function setSite(v: Village): void {
    const h = siteHouse(v); siteGroup.visible = !!h && !!v.site; rings.site.visible = siteGroup.visible; if (!h || !v.site) return;
    rings.site.position.set(h.door.x, relief(h.door.x, h.door.z) + 0.04, h.door.z);
    siteGroup.position.set(h.x, relief(h.x, h.z), h.z); siteGroup.rotation.y = -h.facing;
    const materials = (v.site.wood + v.site.water) / (HUT_WOOD + HUT_WATER), work = v.site.work / HUT_WORK_TICKS;
    siteWall.visible = materials > 0.02; siteWall.scale.y = Math.max(0.02, materials); siteWall.position.y = 0.475 * siteWall.scale.y;
    siteThatch.visible = work > 0.02; siteThatch.scale.setScalar(Math.max(0.02, work)); siteThatch.position.y = 0.95 + 0.45 * siteThatch.scale.y;
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
  const storeItems: Record<Store, THREE.Object3D[]> = { berries: [], water: [], wood: [], grain: [], milk: [], dark: [] };
  const storeFrame = (id: Store, w: number, d: number, h: number): THREE.Group => { const st = STORES[id], g = new THREE.Group(); g.position.set(st.x, relief(st.x, st.z), st.z); g.rotation.y = -Math.atan2(st.z, st.x); scene.add(g); const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), troughMat); base.position.y = h / 2; g.add(base); return g; };
  // Past its cap a store overfills by OVERFILL as a heap on the ground beside it (what she brings when the villagers have already filled it).
  const heapAt = (i: number, w: number): [number, number, number] => [w / 2 + 0.3 + (i % 2) * 0.32, 0, -0.25 + Math.floor(i / 2) * 0.34];
  const basket = (): THREE.Group => { const b = new THREE.Group(); const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.12, 8, 1, true), basketMat); cup.material.side = THREE.DoubleSide; cup.position.y = 0.06; b.add(cup); const fill = new THREE.Mesh(new THREE.CircleGeometry(0.1, 8), berryMat); fill.rotation.x = -Math.PI / 2; fill.position.y = 0.11; b.add(fill); return b; };
  const bucket = (): THREE.Group => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.085, 0.18, 8, 1, true), pailMat); b.material = pailMat.clone(); (b.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; b.position.y = 0.09; g.add(b); const w = new THREE.Mesh(new THREE.CircleGeometry(0.095, 8), water); w.rotation.x = -Math.PI / 2; w.position.y = 0.16; g.add(w); return g; };
  { const g = storeFrame('berries', 1.4, 0.5, 0.08); for (let i = 0; i < STORES.berries.cap; i++) { const b = basket(); b.position.set(-0.55 + (i % 4) * 0.36, 0.08 + Math.floor(i / 4) * 0.13, -0.12 + Math.floor(i / 4) * 0.12); g.add(b); storeItems.berries.push(b); } for (let i = 0; i < OVERFILL; i++) { const b = basket(); b.position.set(...heapAt(i, 1.4)); g.add(b); storeItems.berries.push(b); } }
  { const st = STORES.water, g = new THREE.Group(); g.position.set(st.x, relief(st.x, st.z), st.z); g.rotation.y = -Math.atan2(st.z, st.x); scene.add(g); const box = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.4, 0.6), troughMat); box.position.y = 0.2; g.add(box); for (let i = 0; i < st.cap; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.5), water); w.position.y = 0.08 + i * 0.034; g.add(w); storeItems.water.push(w); } for (let i = 0; i < OVERFILL; i++) { const b = bucket(); b.position.set(...heapAt(i, 1.3)); g.add(b); storeItems.water.push(b); } }
  { const g = storeFrame('wood', 1.5, 0.6, 0.05); for (let i = 0; i < STORES.wood.cap; i++) { const log = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.3, 7), stickMat); log.rotation.z = Math.PI / 2; const row = Math.floor(i / 4); log.position.set(0, 0.12 + row * 0.13, -0.2 + (i % 4) * 0.15 - row * 0.07); g.add(log); storeItems.wood.push(log); } for (let i = 0; i < OVERFILL; i++) { const log = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 7), stickMat); log.rotation.z = Math.PI / 2; log.rotation.y = 0.3 * (i % 2); log.position.set(1.0 + (i % 2) * 0.1, 0.07, -0.3 + i * 0.16); g.add(log); storeItems.wood.push(log); } }
  { const g = storeFrame('grain', 1.2, 0.7, 0.06); for (let i = 0; i < STORES.grain.cap; i++) { const sack = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 6), sackMat); sack.scale.set(1, 0.8, 1); const row = Math.floor(i / 6); sack.position.set(-0.5 + (i % 6) * 0.2 + row * 0.1, 0.16 + row * 0.2, -0.12 + row * 0.02); g.add(sack); storeItems.grain.push(sack); } for (let i = 0; i < OVERFILL; i++) { const sack = new THREE.Mesh(new THREE.SphereGeometry(0.13, 7, 6), sackMat); sack.scale.set(1, 0.8, 1); const [x, , z] = heapAt(i, 1.2); sack.position.set(x, 0.1, z); g.add(sack); storeItems.grain.push(sack); } }
  { const g = storeFrame('milk', 1.5, 0.45, 0.35); for (let i = 0; i < STORES.milk.cap; i++) { const p = pail(); p.position.set(-0.6 + (i % 4) * 0.4, i < 4 ? 0.35 : 0.02, i < 4 ? 0 : 0.32); g.add(p); storeItems.milk.push(p); } for (let i = 0; i < OVERFILL; i++) { const p = pail(); p.position.set(...heapAt(i, 1.5)); g.add(p); storeItems.milk.push(p); } }
  // D2: the Dark Young's leavings, a heap of dark lumps on the green's edge by the stone's gap, one a unit; and the blight on a spoiled place, a dark stain that spreads over it while it is spoiled (updateLand).
  const darkMat = new THREE.MeshStandardMaterial({ color: '#241a2e', emissive: '#4a1a5a', emissiveIntensity: 0.35, roughness: 0.4 });
  { const st = STORES.dark, g = new THREE.Group(); g.position.set(st.x, relief(st.x, st.z), st.z); scene.add(g); for (let i = 0; i < st.cap; i++) { const lump = new THREE.Mesh(new THREE.SphereGeometry(0.11 + rand() * 0.05, 6, 5), darkMat); lump.scale.set(1, 0.6, 1); const a = i * 2.4, r = 0.15 + Math.sqrt(i) * 0.22; lump.position.set(Math.cos(a) * r, 0.06 + (i % 3) * 0.02, Math.sin(a) * r); g.add(lump); storeItems.dark.push(lump); } }
  const blightMat = new THREE.MeshBasicMaterial({ color: '#2a1030', transparent: true, opacity: 0.75, depthWrite: false }), blights: Record<YieldSite, THREE.Mesh> = {} as Record<YieldSite, THREE.Mesh>, blightAmt: Record<YieldSite, number> = { thicket: 0, copse: 0, field: 0, pen: 0 };
  for (const k of YIELD_SITES) { const st = SITES[k], geo = new THREE.CircleGeometry(st.radius + 0.6, 28); geo.rotateX(-Math.PI / 2); { const pos = geo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(st.x + pos.getX(i), st.z + pos.getZ(i)) + 0.03); } const m = new THREE.Mesh(geo, blightMat); m.position.set(st.x, 0, st.z); m.renderOrder = 3; m.visible = false; scene.add(m); blights[k] = m; }
  // The stone glows with the prayer it holds (updatePrayer), a cool light of its own at night.
  const stoneMat = new THREE.MeshStandardMaterial({ color: '#6f6a5f', emissive: '#b8a0ff', emissiveIntensity: 0, roughness: 0.9, flatShading: true });
  const menhir = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.2, 0.45), stoneMat); menhir.position.set(SITES.shrine.x, 1.1, SITES.shrine.z); menhir.rotation.set(0.05, 0.6, 0.06); scene.add(menhir);
  const stoneLight = new THREE.PointLight('#b8a0ff', 0, 9, 1.8); stoneLight.position.set(SITES.shrine.x, 1.6, SITES.shrine.z); scene.add(stoneLight);
  // Her stations: rings on the ground at each yielding place, each store and the stone; a ring brightens while she stands in it (setStation).
  const ringMats: Record<string, THREE.MeshBasicMaterial> = {}, rings: Record<string, THREE.Mesh> = {};
  // Each ring follows the meadow's relief vertex by vertex and is drawn last over the paths, so it neither sinks under the ground nor fights the road.
  for (const st of STATIONS) { const mat = new THREE.MeshBasicMaterial({ color: st.kind === 'gather' ? '#d8f07a' : st.kind === 'deliver' ? '#f0c060' : '#c8a8ff', transparent: true, opacity: 0.35, depthWrite: false, depthTest: false }); const geo = new THREE.RingGeometry(st.r - 0.1, st.r, 40); geo.rotateX(-Math.PI / 2); { const pos = geo.attributes.position as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) pos.setY(i, relief(st.x + pos.getX(i), st.z + pos.getZ(i)) + 0.04); } const ring = new THREE.Mesh(geo, mat); ring.renderOrder = 3; ring.position.set(st.x, 0, st.z); scene.add(ring); ringMats[st.id] = mat; rings[st.id] = ring; }
  { const mat = new THREE.MeshBasicMaterial({ color: '#f0c060', transparent: true, opacity: 0.35, depthWrite: false, depthTest: false }); const geo = new THREE.RingGeometry(SITE_RING_R - 0.1, SITE_RING_R, 40); geo.rotateX(-Math.PI / 2); const ring = new THREE.Mesh(geo, mat); ring.renderOrder = 3; ring.visible = false; scene.add(ring); ringMats.site = mat; rings.site = ring; }
  let activeStation: string | null = null;
  function setStation(id: string | null, t: number): void { activeStation = id; for (const k in ringMats) { const on = k === id; ringMats[k].opacity = on ? 0.75 + Math.sin(t * 0.01) * 0.2 : 0.35; rings[k].scale.setScalar(on ? 1 + Math.sin(t * 0.008) * 0.03 : 1); } }
  // Her stack: what she carries from a place to a store, on her back, one slab a unit, coloured by kind (setStack).
  const stackMats: Record<Store, THREE.MeshStandardMaterial> = { berries: new THREE.MeshStandardMaterial({ color: '#8a2a4a', roughness: 0.7 }), water: new THREE.MeshStandardMaterial({ color: '#4f93a8', roughness: 0.3 }), wood: new THREE.MeshStandardMaterial({ color: '#6b5238', roughness: 1 }), grain: new THREE.MeshStandardMaterial({ color: '#d2b98a', roughness: 1 }), milk: new THREE.MeshStandardMaterial({ color: '#f4f1e6', roughness: 0.8 }), dark: new THREE.MeshStandardMaterial({ color: '#241a2e', roughness: 0.5 }) };
  const stack = new THREE.Group(); stack.visible = false; scene.add(stack); const slabs: THREE.Mesh[] = [];
  for (let i = 0; i < STACK_CAP; i++) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.2), stackMats.berries); m.position.y = i * 0.1; m.rotation.y = (i % 2) * 0.12; stack.add(m); slabs.push(m); }
  function setStack(kind: Store | null, n: number): void { stack.visible = !!kind && n > 0; for (let i = 0; i < slabs.length; i++) { slabs[i].visible = i < n; if (kind) slabs[i].material = stackMats[kind]; } }
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
  const grassMat = spriteMaterial('grass', '#9fc06a'), grass: Standee[] = [], housePlaces = Array.from({ length: HOUSE_CAP }, (_, i) => housePlace(i));
  for (let i = 0; i < 900; i++) { const a = rand() * 6.28, r = Math.sqrt(rand()) * (MEADOW_RADIUS + 2), x = Math.cos(a) * r, z = Math.sin(a) * r; if (Math.hypot(x, z) < 5.5 || housePlaces.some(h => Math.hypot(x - h.x, z - h.z) < HOUSE_RADIUS + 0.4)) continue; const k = 0.22 + rand() * 0.3; grass.push({ position: new THREE.Vector3(x, relief(x, z), z), yaw: rand() * Math.PI, width: k, height: k * (0.8 + rand() * 0.5) }); }
  scene.add(new THREE.Mesh(standees(grass), grassMat));
  // The hobbits (D1: a population, not eight): Hulda's skeleton at half her height, in cloth, each with their own colours, made when first seen (a birth) and by stage (a child is CHILD_SCALE of grown); a dead one's figure is taken away. The clips are kept for the figures made later.
  type Figure = ReturnType<typeof createHulda> & { height: number };
  const CHILD_SCALE = 0.7;
  const figureMap = new Map<string, Figure>(); let figureClips: Parameters<Figure['setClips']>[0] | null = null, livingNow: HobbitState[] = [];
  const figureKey = (s: HobbitState): string => `${s.id}:${s.stage === 'child' ? 'child' : 'grown'}`;
  const makeFigure = (s: HobbitState): Figure => {
    const h = hobbitById(s.id), height = HOBBIT_HEIGHT * (s.stage === 'child' ? CHILD_SCALE : 1);
    const f = Object.assign(createHulda({ name: h.name, height, skin: '#e0c4a0', cloth: h.colour, clothLight: h.colour, hair: h.hair, feet: '#5a4a3a', locks: false, leaves: false, skirt: true }), { height }); scene.add(f.group); if (figureClips) f.setClips(figureClips);
    carriedMap.set(f, makeCarried(f)); return f;
  };
  /** The figure for a hobbit as they are now; figures of other stages or of the dead are hidden. */
  function figureFor(s: HobbitState): Figure { const key = figureKey(s); let f = figureMap.get(key); if (!f) { f = makeFigure(s); figureMap.set(key, f); } return f; }
  function setFigureClips(clips: Parameters<Figure['setClips']>[0]): void { figureClips = clips; for (const f of figureMap.values()) f.setClips(clips); }
  function pruneFigures(v: Village): void { const keep = new Set(v.hobbits.map(figureKey)); for (const [key, f] of figureMap) if (!keep.has(key)) f.group.visible = false; livingNow = v.hobbits; }
  // An armful in the right hand: a basket, a bucket, a bundle of sticks, a sack or a pail, one of them shown while the model says the hobbit carries. The skeleton is in centimetres, so the things are sized in centimetres in the hand's space.
  const carriedMap = new Map<Figure, Record<Store, THREE.Object3D>>();
  const makeCarried = (f: Figure): Record<Store, THREE.Object3D> => { const hand = f.bones.get('mixamorigRightHand')!, anchor = new THREE.Group(); anchor.position.set(0, 9, 2); hand.add(anchor); const items: Record<Store, THREE.Object3D> = {
    berries: (() => { const g = new THREE.Group(); const cup = new THREE.Mesh(new THREE.CylinderGeometry(8, 6, 8, 8, 1, true), basketMat); cup.material = basketMat.clone(); (cup.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; g.add(cup); const fill = new THREE.Mesh(new THREE.CircleGeometry(7.5, 8), berryMat); fill.rotation.x = -Math.PI / 2; fill.position.y = 3.6; g.add(fill); return g; })(),
    water: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(6, 5, 10, 8, 1, true), pailMat); b.material = pailMat.clone(); (b.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; g.add(b); const w = new THREE.Mesh(new THREE.CircleGeometry(5.5, 8), water); w.rotation.x = -Math.PI / 2; w.position.y = 4; g.add(w); return g; })(),
    wood: (() => { const g = new THREE.Group(); for (let i = 0; i < 3; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2, 40, 5), stickMat); st.rotation.z = Math.PI / 2 + 0.25; st.position.set(0, i * 3.2, (i - 1) * 3); g.add(st); } return g; })(),
    grain: (() => { const sack = new THREE.Mesh(new THREE.SphereGeometry(9, 7, 6), sackMat); sack.scale.set(1, 1.2, 1); return sack; })(),
    milk: (() => { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(6, 5, 10, 8, 1, true), pailMat); b.material = pailMat.clone(); (b.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide; g.add(b); const m = new THREE.Mesh(new THREE.CircleGeometry(5.5, 8), milkMat); m.rotation.x = -Math.PI / 2; m.position.y = 4; g.add(m); return g; })(),
    dark: new THREE.Group(),
  }; for (const k of STORE_LIST) { items[k].visible = false; anchor.add(items[k]); } return items; };
  // Her other shapes: the figure of leaves at a crown, and the bulge of grass she is under the meadow.
  const figureMat = spriteMaterial('leaf', '#b9e58a', { emissive: '#4a7a2a', emissiveIntensity: 0.35 });
  const figure = new THREE.Group(); figure.visible = false; scene.add(figure);
  { const fr = mulberry32(77); const body = crownStandees(fr, new THREE.Vector3(0, 0.95, 0), 0.42, 0.55, 0.3, 9, 0.5); body.push({ position: new THREE.Vector3(0, 1.35, 0), yaw: 0.4, width: 0.42, height: 0.42, flat: true }); figure.add(new THREE.Mesh(standees(body), figureMat)); }
  // The forest spirits she summons: small figures of leaves in her own pale green, one made as each is summoned (spiritFigure).
  const spiritMat = spriteMaterial('leaf', '#cfeea0', { emissive: '#6aa040', emissiveIntensity: 0.5 }), spiritFigures: THREE.Group[] = [];
  function spiritFigure(i: number): THREE.Group {
    while (spiritFigures.length <= i) { const fr = mulberry32(900 + spiritFigures.length), g = new THREE.Group(); const body = crownStandees(fr, new THREE.Vector3(0, 0.42, 0), 0.24, 0.32, 0.18, 7, 0.5); body.push({ position: new THREE.Vector3(0, 0.66, 0), yaw: 0.4, width: 0.24, height: 0.24, flat: true }); g.add(new THREE.Mesh(standees(body), spiritMat)); const load = new THREE.Mesh(new THREE.SphereGeometry(0.11, 6, 5), sackMat); load.name = 'load'; load.position.set(0, 0.2, -0.16); load.visible = false; g.add(load); scene.add(g); spiritFigures.push(g); }
    return spiritFigures[i];
  }
  // The Dark Young: an oversized goat, dark as a wet stone, six legs, a head with four tentacle horns that writhe (setRaider), eyes with their own light; struck, it flashes; rooted, a coil of root holds its feet; dead, it lies on its side and sinks.
  const hideMat = new THREE.MeshStandardMaterial({ color: '#2b2130', emissive: '#000000', roughness: 0.95, flatShading: true }), hornMat = new THREE.MeshStandardMaterial({ color: '#4a2a3a', emissive: '#3a1020', emissiveIntensity: 0.3, roughness: 0.8 }), eyeMat = new THREE.MeshBasicMaterial({ color: '#d8ff60' }), coilMat = new THREE.MeshStandardMaterial({ color: '#8a6f4e', emissive: '#c9a24a', emissiveIntensity: 0.4, roughness: 0.9 });
  const raiderFigures = new Map<number, { group: THREE.Group; horns: THREE.Group[]; legs: THREE.Mesh[]; coil: THREE.Mesh; hide: THREE.MeshStandardMaterial }>();
  function raiderFigure(id: number) {
    let f = raiderFigures.get(id); if (f) return f;
    const group = new THREE.Group(), hide = hideMat.clone(), horns: THREE.Group[] = [], legs: THREE.Mesh[] = [];
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 10, 8), hide); body.scale.set(1.7, 0.95, 0.85); body.position.y = 1.05; group.add(body);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.7, 7), hide); neck.position.set(1.0, 1.35, 0); neck.rotation.z = -0.9; group.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), hide); head.scale.set(1.5, 0.9, 0.8); head.position.set(1.35, 1.6, 0); group.add(head);
    for (const zz of [-0.12, 0.12]) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 5), eyeMat); eye.position.set(1.6, 1.68, zz); group.add(eye); }
    for (let i = 0; i < 4; i++) { const g = new THREE.Group(); g.position.set(1.1 + (i % 2) * 0.15, 1.85, (i - 1.5) * 0.14); const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.15, 0.35, (i - 1.5) * 0.12), new THREE.Vector3(-0.45, 0.55, (i - 1.5) * 0.3), new THREE.Vector3(-0.55, 0.9, (i - 1.5) * 0.45)]); g.add(new THREE.Mesh(taperedTube(curve, 12, 5, t => 0.07 * (1 - t * 0.85), 0), hornMat)); group.add(g); horns.push(g); }
    for (let i = 0; i < 6; i++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.95, 5), hide); leg.position.set(-0.75 + Math.floor(i / 2) * 0.75, 0.48, (i % 2 ? 1 : -1) * 0.38); group.add(leg); legs.push(leg); }
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 6, 20), coilMat); coil.rotation.x = -Math.PI / 2; coil.position.y = 0.12; coil.visible = false; group.add(coil);
    group.scale.setScalar(0.82); scene.add(group); f = { group, horns, legs, coil, hide }; raiderFigures.set(id, f); return f;
  }
  /** Place and animate a Dark Young: walking legs, writhing horns, the hurt flash, the root coil, the fall of the dead. */
  function setRaider(id: number, x: number, z: number, heading: number, t: number, moving: boolean, hurt: number, rooted: number, dead: number, flat = false): void {
    const f = raiderFigure(id); f.group.visible = true; f.group.position.set(x, relief(x, z), z); f.group.rotation.y = -heading;
    // Beaten (or leaving at the end of the night) it runs flat, an octopus overland: pressed to the ground, the legs splayed, the horns trailing.
    f.group.scale.set(0.82 * (flat ? 1.35 : 1), 0.82 * (flat ? 0.35 : 1), 0.82 * (flat ? 1.35 : 1)); for (let i = 0; i < f.legs.length; i++) f.legs[i].rotation.x = flat ? (i % 2 ? 1.1 : -1.1) : 0;
    for (let i = 0; i < f.horns.length; i++) { const h = f.horns[i]; h.rotation.z = (flat ? 1.3 : 0) + Math.sin(t * (flat ? 0.006 : 0.0021) + i * 1.7) * 0.5; h.rotation.x = Math.cos(t * 0.0017 + i * 2.3) * 0.5; }
    for (let i = 0; i < f.legs.length; i++) f.legs[i].rotation.z = moving ? Math.sin(t * (flat ? 0.02 : 0.008) + i * 1.05) * 0.35 : 0;
    f.hide.emissive.set(hurt > 0 ? '#b03030' : '#000000'); f.coil.visible = rooted > 0; f.coil.scale.setScalar(1 + Math.sin(t * 0.01) * 0.05);
    if (dead > 0) { f.group.rotation.z = Math.min(1.4, dead * 3); f.group.position.y = relief(x, z) - Math.max(0, dead - 4) * 0.25; }
    else f.group.rotation.z = 0;
  }
  // G3: a wolf, low and grey, four legs, a tail and ears, eyes that catch the light; struck it flashes; dead it lies on its side.
  const wolfMat = new THREE.MeshStandardMaterial({ color: '#6a655c', emissive: '#000000', roughness: 0.95, flatShading: true }), wolfEye = new THREE.MeshBasicMaterial({ color: '#ffe070' });
  const wolfFigures = new Map<number, { group: THREE.Group; legs: THREE.Mesh[]; tail: THREE.Mesh; coil: THREE.Mesh; hide: THREE.MeshStandardMaterial }>();
  function wolfFigure(id: number) {
    let f = wolfFigures.get(id); if (f) return f;
    const group = new THREE.Group(), hide = wolfMat.clone(), legs: THREE.Mesh[] = [];
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 9, 7), hide); body.scale.set(1.9, 0.8, 0.7); body.position.y = 0.58; group.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 6), hide); head.scale.set(1.3, 0.9, 0.85); head.position.set(0.72, 0.72, 0); group.add(head);
    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.13, 0.15), hide); snout.position.set(0.98, 0.66, 0); group.add(snout);
    for (const zz of [-0.09, 0.09]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 5), hide); ear.position.set(0.62, 0.92, zz); group.add(ear); const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 5, 4), wolfEye); eye.position.set(0.88, 0.76, zz); group.add(eye); }
    for (let i = 0; i < 4; i++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.5, 5), hide); leg.position.set(-0.4 + Math.floor(i / 2) * 0.8, 0.26, (i % 2 ? 1 : -1) * 0.17); group.add(leg); legs.push(leg); }
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.5, 5), hide); tail.position.set(-0.75, 0.62, 0); tail.rotation.z = 1.2; group.add(tail);
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.05, 6, 20), coilMat); coil.rotation.x = -Math.PI / 2; coil.position.y = 0.08; coil.visible = false; group.add(coil);
    scene.add(group); f = { group, legs, tail, coil, hide }; wolfFigures.set(id, f); return f;
  }
  function setWolf(id: number, x: number, z: number, heading: number, t: number, moving: boolean, hurt: number, rooted: number, dead: number): void {
    const f = wolfFigure(id); f.group.visible = true; f.group.position.set(x, relief(x, z), z); f.group.rotation.y = -heading;
    for (let i = 0; i < f.legs.length; i++) f.legs[i].rotation.z = moving ? Math.sin(t * 0.014 + i * 1.6) * 0.5 : 0;
    f.tail.rotation.x = Math.sin(t * 0.005 + id) * 0.25; f.hide.emissive.set(hurt > 0 ? '#b03030' : '#000000'); f.coil.visible = rooted > 0;
    if (dead > 0) { f.group.rotation.z = Math.min(1.5, dead * 3); f.group.position.y = relief(x, z) - Math.max(0, dead - 4) * 0.2; } else f.group.rotation.z = 0;
  }
  function hideRaider(id: number): void { const f = raiderFigures.get(id); if (f) f.group.visible = false; const w = wolfFigures.get(id); if (w) w.group.visible = false; }
  // D3: the snatcher, a small octopoid, low and dark with two dim eyes and six arms that ripple as it runs; an infant is a pale bundle in its arms, lying on the land, or in hers.
  const snatchMat = new THREE.MeshStandardMaterial({ color: '#1a1420', emissive: '#2a0a30', emissiveIntensity: 0.4, roughness: 0.35 }), snatchEye = new THREE.MeshBasicMaterial({ color: '#c08aff' }), bundleMat = new THREE.MeshStandardMaterial({ color: '#efe6cc', emissive: '#3a3020', emissiveIntensity: 0.25, roughness: 0.9 });
  const makeBundle = (): THREE.Mesh => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), bundleMat); b.scale.set(1.5, 0.8, 0.9); return b; };
  const snatchFigures = new Map<number, { group: THREE.Group; arms: THREE.Group[]; bundle: THREE.Mesh }>();
  function snatchFigure(id: number) {
    let f = snatchFigures.get(id); if (f) return f;
    const group = new THREE.Group(), body = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), snatchMat); body.scale.set(1.3, 0.65, 1.1); body.position.y = 0.16; group.add(body);
    for (const zz of [-0.07, 0.07]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 5), snatchEye); e.position.set(0.22, 0.22, zz); group.add(e); }
    const arms: THREE.Group[] = []; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.5, g = new THREE.Group(); g.position.set(Math.cos(a) * 0.12, 0.08, Math.sin(a) * 0.12); g.rotation.y = -a; const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.18, -0.05, 0.03), new THREE.Vector3(0.36, -0.07, -0.03), new THREE.Vector3(0.5, -0.06, 0.02)]); g.add(new THREE.Mesh(taperedTube(curve, 10, 5, t => 0.035 * (1 - t * 0.85), 0), snatchMat)); group.add(g); arms.push(g); }
    const bundle = makeBundle(); bundle.position.set(-0.05, 0.3, 0); bundle.visible = false; group.add(bundle);
    scene.add(group); f = { group, arms, bundle }; snatchFigures.set(id, f); return f;
  }
  function setSnatcher(id: number, x: number, z: number, heading: number, t: number, carrying: boolean): void {
    const f = snatchFigure(id); f.group.visible = true; f.group.position.set(x, relief(x, z), z); f.group.rotation.y = -heading; f.bundle.visible = carrying;
    for (let i = 0; i < f.arms.length; i++) f.arms[i].rotation.z = Math.sin(t * 0.03 + i * 1.3) * 0.35;
  }
  function hideSnatchersBut(ids: Set<number>): void { for (const [id, f] of snatchFigures) if (!ids.has(id)) f.group.visible = false; }
  const lying: THREE.Mesh[] = [], inArms = makeBundle(); inArms.visible = false; scene.add(inArms);
  /** The infants lying on the land, and the one in her arms (null when none). */
  function setInfants(out: { x: number; z: number }[], arms: THREE.Vector3 | null): void {
    while (lying.length < out.length) { const b = makeBundle(); scene.add(b); lying.push(b); }
    lying.forEach((b, i) => { const d = out[i]; b.visible = !!d; if (d) b.position.set(d.x, relief(d.x, d.z) + 0.1, d.z); });
    inArms.visible = !!arms; if (arms) inArms.position.copy(arms);
  }
  // Her strokes: a slash of thorns before her, a burst ring round her, both short-lived (flashSlash, flashBurst).
  const slashMat = new THREE.MeshBasicMaterial({ color: '#d8f07a', transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }), burstMat = new THREE.MeshBasicMaterial({ color: '#b9e58a', transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false });
  const slash = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.9, 24, 1, -0.9, 1.8), slashMat); slash.rotation.x = -Math.PI / 2; slash.visible = false; scene.add(slash);
  const burst = new THREE.Mesh(new THREE.RingGeometry(0.7, 1.0, 40), burstMat); burst.rotation.x = -Math.PI / 2; burst.visible = false; scene.add(burst);
  let slashT = 0, burstT = 0;
  function flashSlash(x: number, y: number, z: number, yaw: number): void { slash.position.set(x, y + 0.5, z); slash.rotation.z = -yaw - Math.PI / 2; slashT = 0.18; slash.visible = true; }
  function flashBurst(x: number, y: number, z: number): void { burst.position.set(x, y + 0.15, z); burstT = 0.4; burst.visible = true; }
  function updateStrokes(dt: number): void { if (slashT > 0) { slashT -= dt; slashMat.opacity = Math.max(0, slashT / 0.18); slash.visible = slashT > 0; } if (burstT > 0) { burstT -= dt; const k = 1 - burstT / 0.4; burst.scale.setScalar(0.5 + k * 3.0); burstMat.opacity = 0.8 * (1 - k); burst.visible = burstT > 0; } }
  // The lair's manifestation (M1b): a local mother of goats at the dark forest's centre, a great dark mass with many horns that writhe, eyes with their own light; it does not walk. Placed by setLairAt; animated and shown alive or gone by setLair.
  const lairGroup = new THREE.Group(); lairGroup.visible = false; scene.add(lairGroup); const lairHide = hideMat.clone(), lairHorns: THREE.Group[] = [];
  { const body = new THREE.Mesh(new THREE.SphereGeometry(2.6, 12, 10), lairHide); body.scale.set(1.4, 1.0, 1.2); body.position.y = 2.4; lairGroup.add(body);
    const fr = mulberry32(666); for (let i = 0; i < 14; i++) { const g = new THREE.Group(); const a = fr() * Math.PI * 2, r = 1.2 + fr() * 1.6; g.position.set(Math.cos(a) * r, 3.4 + fr() * 1.2, Math.sin(a) * r); const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * 0.6, 1.2, Math.sin(a) * 0.6), new THREE.Vector3(Math.cos(a) * 1.6, 2.2, Math.sin(a) * 1.6), new THREE.Vector3(Math.cos(a) * 2.0, 3.4, Math.sin(a) * 2.0)]); g.add(new THREE.Mesh(taperedTube(curve, 14, 6, t => 0.22 * (1 - t * 0.85), 0), hornMat)); lairGroup.add(g); lairHorns.push(g); }
    for (let i = 0; i < 6; i++) { const eye = new THREE.Mesh(new THREE.SphereGeometry(0.16, 6, 5), eyeMat); const a = -0.6 + i * 0.25; eye.position.set(Math.cos(a) * 3.5, 2.2 + (i % 2) * 0.5, Math.sin(a) * 3.5); lairGroup.add(eye); }
    for (let i = 0; i < 8; i++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 2.4, 6), lairHide); const a = i / 8 * Math.PI * 2; leg.position.set(Math.cos(a) * 2.6, 1.2, Math.sin(a) * 2.6); leg.rotation.z = Math.cos(a) * 0.35; leg.rotation.x = -Math.sin(a) * 0.35; lairGroup.add(leg); } }
  const lairLight = new THREE.PointLight('#b040c0', 0, 30, 1.4); lairLight.position.y = 4; lairGroup.add(lairLight);
  function setLairAt(x: number, z: number): void { lairGroup.position.set(x, relief(x, z), z); }
  function setLair(alive: boolean, hurt: number, t: number, hpShare: number): void { lairGroup.visible = alive; if (!alive) return; for (let i = 0; i < lairHorns.length; i++) { const h = lairHorns[i]; h.rotation.z = Math.sin(t * 0.0013 + i * 1.3) * 0.35; h.rotation.x = Math.cos(t * 0.0011 + i * 2.1) * 0.35; } lairHide.emissive.set(hurt > 0 ? '#b03030' : '#000000'); lairLight.intensity = 3 + Math.sin(t * 0.003) * 1.5 + (1 - hpShare) * 4; }
  const mass = new THREE.Group(); mass.visible = false; scene.add(mass);
  { const mr = mulberry32(78); const tufts: Standee[] = []; for (let i = 0; i < 14; i++) { const a = mr() * 6.28, r = mr() * 0.42, k = 0.28 + mr() * 0.22; tufts.push({ position: new THREE.Vector3(Math.cos(a) * r, 0.3 - r * 0.35, Math.sin(a) * r), yaw: mr() * Math.PI, width: k, height: k * 1.2 }); } mass.add(new THREE.Mesh(standees(tufts), spriteMaterial('grass', '#b6d47a', { emissive: '#3a5a20', emissiveIntensity: 0.25 }))); }
  const crownPoint = (t: Tree, az: number): THREE.Vector3 => new THREE.Vector3(t.x + Math.cos(az) * 1.1 * t.size, relief(t.x, t.z) + crownHeight(t) + 0.15, t.z + Math.sin(az) * 1.1 * t.size);
  const trunkPoint = (t: Tree, h: number, az: number): THREE.Vector3 => new THREE.Vector3(t.x + Math.cos(az) * (trunkRadius(t) + 0.12), relief(t.x, t.z) + h, t.z + Math.sin(az) * (trunkRadius(t) + 0.12));
  /** daylight 0..1 sets the fire and the windows: lit as the sun goes; under 0..1 thins the meadow for the roots beneath. */
  function update(daylight: number, t: number, under = 0): void {
    laneMat.emissiveIntensity = 0.05 + under * 0.5;
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
    // The blight spreads over a spoiled place and draws back when it is clean; the bushes and the stalks go dark with it.
    let anySpoiled = false; for (const k of YIELD_SITES) { const want = isSpoiled(v, k) ? 1 : 0; blightAmt[k] += (want - blightAmt[k]) * 0.03; if (Math.abs(blightAmt[k] - want) < 0.01) blightAmt[k] = want; const m = blights[k]; m.visible = blightAmt[k] > 0.01; m.scale.setScalar(Math.max(0.01, blightAmt[k])); if (blightAmt[k] > 0.01) anySpoiled = true; }
    bushMat.color.set(blightAmt.thicket > 0.5 ? '#3a2438' : '#4f7a3e'); for (const m of stalkMats) if (blightAmt.field > 0.5) m.color.set('#3a2438');
    void anySpoiled;
    pruneFigures(v); for (const s of v.hobbits) { const c = s.carry, items = carriedMap.get(figureFor(s))!; for (const k of STORE_LIST) items[k].visible = !!c && c.kind === k; }
    fireWood = v.fireWood;
    for (let i = 0; i < v.spirits.length; i++) { const f = spiritFigure(i), load = f.getObjectByName('load'); if (load) load.visible = !!v.spirits[i].carry; }
  }
  /** The stone by the prayer it holds, 0..1 of the cap. */
  function updatePrayer(share: number): void { stoneMat.emissiveIntensity = share * 0.9; stoneLight.intensity = share * 6; }
  let fireWood = 0;
  /** Which armful each figure shows, for checks. */
  const armfuls = (): (Store | null)[] => livingNow.map(s => { const c = carriedMap.get(figureFor(s))!; return STORE_LIST.find(k => c[k].visible) ?? null; });
  return { setWolf, setHouses, setSite, setSnatcher, hideSnatchersBut, setInfants, colliders, get figures() { return livingNow.map(figureFor); }, figureFor, setFigureClips, figure, mass, update, updateLand, updatePrayer, armfuls, setRaider, hideRaider, flashSlash, flashBurst, updateStrokes, setLairAt, setLair, setStation, get activeStation() { return activeStation; }, setStack, stack, spiritFigure, spiritFigures, stream, crownPoint, trunkPoint };
}
export type VillageWorld = ReturnType<typeof buildVillage>;
