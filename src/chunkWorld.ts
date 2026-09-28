// The chunks as scene: a ground tile per chunk displaced by the land's height and coloured by biome, its
// trees merged (the same standee trees as the village's), trunks as colliders. Loaded in a ring round her,
// disposed behind her; the loaded chunks' trees are offered to the model's tree lookups (treeProvider).
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CHUNK, chunkKey, chunksAround, chunkTrees, biomeAt } from './chunkModel';
import { denLayout } from './denModel';
import { createTerrain, TERRAIN_STEP, type Terrain } from './worldTerrain';
import { groundVision } from './groundVision';
import { mulberry32 } from './colors';
import { spriteMaterial, standees, type Standee } from './sprites';
import { treeParts } from './flora';
import { crownHeight, trunkRadius, type Tree } from './villageModel';
import type { Collider } from './player';

interface Chunk { key: string; group: THREE.Group; trees: Tree[]; colliders: Collider[]; geometries: THREE.BufferGeometry[] }
/** G3b: a ruin: RUIN_STONES old stones leaning round a dry basin RUIN_STONE_R out; sanctified, the basin holds crystal water, lit, and the stones carry a pale glow. Tuning. */
export const RUIN_STONES = 7, RUIN_STONE_R = 2.8;
/** S2: the moot's stone seats and their ring. Tuning. */
export const MOOT_SEATS = 7, MOOT_SEAT_R = 4.2;
export function createChunks(scene: THREE.Scene, seed: number, terrain: Terrain = createTerrain(seed), dens: { id?: string; x: number; z: number; tier?: number }[] = [], rings: { x: number; z: number }[] = [], ruinList: { id: string; x: number; z: number }[] = [], warrenList: { id: string; x: number; z: number }[] = [], mootAt: { x: number; z: number } | null = null, wallowList: { id: string; x: number; z: number }[] = []) {
  let sanctified = new Set<string>();
  // S1: a warren: burrows in the grass and rabbits among them, as many as the pool holds (setRabbits gives the count by id; refreshRabbits applies it to the warrens built). Tuning.
  const WARREN_BURROWS = 5, WARREN_RABBITS = 12, burrowMat = new THREE.MeshStandardMaterial({ color: '#2e2418', roughness: 1 }), moundMat = new THREE.MeshStandardMaterial({ color: '#6a5a44', roughness: 1, flatShading: true }), rabbitMat = new THREE.MeshStandardMaterial({ color: '#a89478', roughness: 0.95 }), rabbitEar = new THREE.MeshStandardMaterial({ color: '#c8b09a', roughness: 0.95 });
  let rabbitStock: (id: string) => number = () => WARREN_RABBITS;
  const applyRabbits = (g: THREE.Group): void => { const n = rabbitStock(g.userData.id as string); g.children.forEach(o => { if (o.name.startsWith('rabbit:')) o.visible = Number(o.name.slice(7)) < n; }); };
  // S4b: a boar wallow: a muddy hollow and boars about it, as many as the wallow holds (setBoars). Tuning.
  const WALLOW_BOARS = 2, mudMat = new THREE.MeshStandardMaterial({ color: '#3e3226', roughness: 0.6 }), boarMat = new THREE.MeshStandardMaterial({ color: '#3a2c22', roughness: 1, flatShading: true }), tuskMat = new THREE.MeshStandardMaterial({ color: '#e8e0c8', roughness: 0.6 });
  let boarStock: (id: string) => number = () => WALLOW_BOARS;
  const applyBoars = (g: THREE.Group): void => { const n = boarStock(g.userData.id as string); g.children.forEach(o => { if (o.name.startsWith('boar:')) o.visible = Number(o.name.slice(5)) < n; }); };
  function makeBoar(): THREE.Group {
    const b = new THREE.Group(); const body = new THREE.Mesh(new THREE.SphereGeometry(0.4, 9, 7), boarMat); body.scale.set(1.7, 1, 0.9); body.position.y = 0.55; b.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 6), boarMat); head.scale.set(1.2, 1, 0.9); head.position.set(0.72, 0.52, 0); b.add(head);
    const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.2, 7), boarMat); snout.rotation.z = Math.PI / 2; snout.position.set(0.98, 0.46, 0); b.add(snout);
    for (const zz of [-0.09, 0.09]) { const t = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.17, 5), tuskMat); t.position.set(0.95, 0.4, zz); t.rotation.z = -0.5; b.add(t); const ear = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.14, 4), boarMat); ear.position.set(0.62, 0.78, zz * 1.6); b.add(ear); }
    for (let i = 0; i < 4; i++) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.36, 5), boarMat); leg.position.set(-0.38 + Math.floor(i / 2) * 0.76, 0.18, (i % 2 ? 1 : -1) * 0.2); b.add(leg); }
    return b;
  }
  const oldStone = new THREE.MeshStandardMaterial({ color: '#6e6a60', roughness: 1, flatShading: true }), holyStone = new THREE.MeshStandardMaterial({ color: '#8a8a80', emissive: '#6a8a70', emissiveIntensity: 0.35, roughness: 0.9, flatShading: true }), dryBasin = new THREE.MeshStandardMaterial({ color: '#4a4438', roughness: 1 });
  const applySanctity = (g: THREE.Group): void => { const on = sanctified.has(g.userData.id as string); (g.getObjectByName('living') as THREE.Group).visible = on; (g.getObjectByName('dry') as THREE.Group).visible = !on; (g.getObjectByName('stones') as THREE.Mesh).material = on ? holyStone : oldStone; };
  const relief = terrain.height;
  const loaded = new Map<string, Chunk>();
  const bark = new THREE.MeshStandardMaterial({ color: '#6d5f48', roughness: 1 }), leaf = spriteMaterial('leaf', '#5f8657'), darkBark = new THREE.MeshStandardMaterial({ color: '#2a2230', roughness: 1 }), darkLeaf = spriteMaterial('leaf', '#2e2a3a', { emissive: '#1a0a20', emissiveIntensity: 0.25 }), collar = new THREE.MeshStandardMaterial({ color: '#8a6f4e', roughness: 0.95 });
  // D4: trees in the blight are black and withered, and the ground under them stained; rebuilt when the blight moves.
  const blightBark = new THREE.MeshStandardMaterial({ color: '#151018', roughness: 0.8 }), blightLeaf = spriteMaterial('leaf', '#2a1424', { emissive: '#3a0a30', emissiveIntensity: 0.35 });
  let blighted: (x: number, z: number) => boolean = () => false;
  const denRock = new THREE.MeshStandardMaterial({ color: '#3b3630', roughness: 1, flatShading: true }), bone = new THREE.MeshStandardMaterial({ color: '#d9d2bf', roughness: 0.9 });
  // G4 (Noah): a fairy ring at each root convergence, a marker on the land for where the deep roots come out: RING_N mushrooms round a circle of RING_R, red caps spotted white, and inside it a small pool of crystal water ringed by crystals, lit. Tuning.
  const RING_R = 2.3, RING_N = 13, capMat = new THREE.MeshStandardMaterial({ color: '#b83a2a', roughness: 0.6, flatShading: true }), stemMat = new THREE.MeshStandardMaterial({ color: '#efe6cc', roughness: 0.9 }), spotMat = new THREE.MeshStandardMaterial({ color: '#f7f2dc', roughness: 0.8 });
  const ringWater = new THREE.MeshStandardMaterial({ color: '#9fd8ee', emissive: '#4fa0c8', emissiveIntensity: 0.5, roughness: 0.15, metalness: 0.2, transparent: true, opacity: 0.9 }), ringCrystal = new THREE.MeshStandardMaterial({ color: '#cfeeff', emissive: '#6fc0e8', emissiveIntensity: 0.35, roughness: 0.2, flatShading: true, transparent: true, opacity: 0.85 });
  const vision = groundVision(), ground = vision.material;
  const setUnder = (under: number, x = 0, z = 0) => vision.update(under, x, z);
  const colourOf = terrain.colour;
  function build(cx: number, cz: number): Chunk {
    const group = new THREE.Group(), geometries: THREE.BufferGeometry[] = [], n = CHUNK / TERRAIN_STEP;
    const geo = new THREE.PlaneGeometry(CHUNK, CHUNK, n, n); geo.rotateX(-Math.PI / 2); geo.translate((cx + 0.5) * CHUNK, 0, (cz + 0.5) * CHUNK);
    { const pos = geo.attributes.position as THREE.BufferAttribute, col: number[] = []; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i); pos.setY(i, terrain.vertex(x, z)); const c = colourOf(x, z); col.push(...(blighted(x, z) ? [c[0] * 0.35 + 0.05, c[1] * 0.2, c[2] * 0.35 + 0.06] as [number, number, number] : c)); } geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); const normals = geo.attributes.normal as THREE.BufferAttribute; for (let i = 0; i < pos.count; i++) normals.setXYZ(i, ...terrain.normal(pos.getX(i), pos.getZ(i))); }
    const surface = new THREE.Mesh(geo, ground); surface.name = "world-ground"; group.add(surface); geometries.push(geo);
    const here = dens.filter(d => Math.floor(d.x / CHUNK) === cx && Math.floor(d.z / CHUNK) === cz);
    const trees = chunkTrees(cx, cz, seed).filter(t => !dens.some(d => Math.hypot(t.x - d.x, t.z - d.z) < 14) && !rings.some(r => Math.hypot(t.x - r.x, t.z - r.z) < 5) && !ruinList.some(r => Math.hypot(t.x - r.x, t.z - r.z) < 7) && !warrenList.some(w => Math.hypot(t.x - w.x, t.z - w.z) < 9) && !(mootAt && Math.hypot(t.x - mootAt.x, t.z - mootAt.z) < 9)), rand = mulberry32((cx * 31 + cz * 17 + seed) >>> 0), colliders: Collider[] = [];
    // G3: a den: a mound of dark rocks round a low mouth, bones about it. The rocks are colliders.
    for (const d of here) { const y = relief(d.x, d.z), rocks: THREE.BufferGeometry[] = [], bones: THREE.BufferGeometry[] = [], mouthDir = d.id ? denLayout({ id: d.id, x: d.x, z: d.z, tier: d.tier }, seed, relief).dir : null;
      // The ring of rocks leaves a gap where the hall's mouth is (denModel: the den is walked into there); the cap rock sits back from it.
      for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + 0.4; if (mouthDir !== null && Math.abs(Math.atan2(Math.sin(a - mouthDir), Math.cos(a - mouthDir))) < 0.62) continue; const r = 1.6 + (i % 2) * 0.5, g = new THREE.DodecahedronGeometry(0.55 + (i % 3) * 0.2, 0); g.translate(d.x + Math.cos(a) * r, y + 0.3, d.z + Math.sin(a) * r); rocks.push(g); colliders.push({ x: d.x + Math.cos(a) * r, z: d.z + Math.sin(a) * r, radius: 0.7, minY: y - 0.2, maxY: y + 1.2 }); }
      { const back = mouthDir === null ? 0 : mouthDir + Math.PI, g = new THREE.BoxGeometry(2.2, 0.5, 1.6).toNonIndexed(); g.rotateY(-back); g.translate(d.x + Math.cos(back) * 0.6, y + 0.95, d.z + Math.sin(back) * 0.6); rocks.push(g); colliders.push({ x: d.x + Math.cos(back) * 0.6, z: d.z + Math.sin(back) * 0.6, radius: 1.0, minY: y - 0.2, maxY: y + 1.3 }); }
      for (let i = 0; i < 8; i++) { const g = new THREE.CylinderGeometry(0.03, 0.04, 0.5 + (i % 3) * 0.2, 4); g.rotateZ(Math.PI / 2); g.rotateY(i * 1.3); g.translate(d.x + Math.cos(i * 2.1) * (2.4 + (i % 2)), y + 0.05, d.z + Math.sin(i * 2.1) * (2.4 + (i % 2))); bones.push(g); }
      const rm = new THREE.Mesh(mergeGeometries(rocks)!, denRock), bm = new THREE.Mesh(mergeGeometries(bones)!, bone); group.add(rm, bm); geometries.push(rm.geometry, bm.geometry); }
    // G3b: the ruins of this chunk: leaning stones round a basin, dry until sanctified.
    for (const ru of ruinList.filter(r => Math.floor(r.x / CHUNK) === cx && Math.floor(r.z / CHUNK) === cz)) {
      const y = relief(ru.x, ru.z), g = new THREE.Group(); g.name = `ruin:${ru.id}`; g.userData.id = ru.id; g.position.set(ru.x, y, ru.z); group.add(g); const stones: THREE.BufferGeometry[] = [], rr = mulberry32((ru.x * 131 + ru.z * 17 + seed) >>> 0);
      for (let i = 0; i < RUIN_STONES; i++) { const a = i / RUIN_STONES * Math.PI * 2 + rr() * 0.3, r = RUIN_STONE_R + (rr() - 0.5) * 0.5, h = 1.3 + rr() * 1.1, x = Math.cos(a) * r, z = Math.sin(a) * r, dy = relief(ru.x + x, ru.z + z) - y; const st = new THREE.BoxGeometry(0.5 + rr() * 0.25, h, 0.35 + rr() * 0.2).toNonIndexed(); st.rotateZ((rr() - 0.5) * 0.5); st.rotateX((rr() - 0.5) * 0.3); st.rotateY(a); st.translate(x, dy + h * 0.42, z); stones.push(st); colliders.push({ x: ru.x + x, z: ru.z + z, radius: 0.45, minY: y - 0.2, maxY: y + h }); }
      const sm = new THREE.Mesh(mergeGeometries(stones)!, oldStone); sm.name = 'stones'; g.add(sm); geometries.push(sm.geometry);
      const bowl = new THREE.Mesh(new THREE.RingGeometry(0.75, 1.15, 20), new THREE.MeshStandardMaterial({ color: '#5a5a52', roughness: 1, flatShading: true })); bowl.rotation.x = -Math.PI / 2; bowl.position.y = 0.06; g.add(bowl);
      const dry = new THREE.Group(); dry.name = 'dry'; { const d = new THREE.Mesh(new THREE.CircleGeometry(0.78, 20), dryBasin); d.rotation.x = -Math.PI / 2; d.position.y = 0.03; dry.add(d); } g.add(dry);
      const living = new THREE.Group(); living.name = 'living'; { const pool = new THREE.Mesh(new THREE.CircleGeometry(0.78, 20), ringWater); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.07; pool.renderOrder = 2; living.add(pool); const light = new THREE.PointLight('#cfeeb0', 1.1, 9, 1.8); light.position.y = 0.9; living.add(light); } g.add(living);
      applySanctity(g);
    }
    // S1: the warrens of this chunk: burrows, mounds and rabbits, the rabbits as many as the pool holds.
    for (const w of warrenList.filter(r => Math.floor(r.x / CHUNK) === cx && Math.floor(r.z / CHUNK) === cz)) {
      const y = relief(w.x, w.z), g = new THREE.Group(); g.name = w.id; g.userData.id = w.id; g.position.set(w.x, y, w.z); group.add(g); const wr = mulberry32((w.x * 97 + w.z * 13 + seed) >>> 0), holes: THREE.BufferGeometry[] = [], mounds: THREE.BufferGeometry[] = [];
      for (let i = 0; i < WARREN_BURROWS; i++) { const a = i / WARREN_BURROWS * Math.PI * 2 + wr() * 0.8, r = 1.5 + wr() * 4, x = Math.cos(a) * r, z = Math.sin(a) * r, dy = relief(w.x + x, w.z + z) - y; const h = new THREE.CircleGeometry(0.32, 10); h.rotateX(-Math.PI / 2); h.translate(x, dy + 0.03, z); holes.push(h); const m = new THREE.SphereGeometry(0.5, 7, 5); m.scale(1.2, 0.35, 1); m.translate(x + Math.cos(a) * 0.55, dy - 0.05, z + Math.sin(a) * 0.55); mounds.push(m); }
      const hm = new THREE.Mesh(mergeGeometries(holes)!, burrowMat), mm = new THREE.Mesh(mergeGeometries(mounds)!, moundMat); g.add(hm, mm); geometries.push(hm.geometry, mm.geometry);
      for (let i = 0; i < WARREN_RABBITS; i++) { const a = wr() * Math.PI * 2, r = 0.8 + wr() * 6.5, x = Math.cos(a) * r, z = Math.sin(a) * r, dy = relief(w.x + x, w.z + z) - y, rb = new THREE.Group(); rb.name = `rabbit:${i}`; rb.position.set(x, dy, z); rb.rotation.y = wr() * Math.PI * 2;
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.11, 7, 5), rabbitMat); body.scale.set(1.5, 0.9, 0.9); body.position.y = 0.11; rb.add(body); const head = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), rabbitMat); head.position.set(0.15, 0.19, 0); rb.add(head);
        for (const zz of [-0.03, 0.03]) { const ear = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.12, 0.04), rabbitEar); ear.position.set(0.13, 0.3, zz); ear.rotation.z = 0.25; rb.add(ear); }
        g.add(rb); }
      applyRabbits(g);
    }
    // S4b: the boar wallows of this chunk.
    for (const w of wallowList.filter(r => Math.floor(r.x / CHUNK) === cx && Math.floor(r.z / CHUNK) === cz)) {
      const y = relief(w.x, w.z), g = new THREE.Group(); g.name = w.id; g.userData.id = w.id; g.position.set(w.x, y, w.z); group.add(g); const wr = mulberry32((w.x * 31 + w.z * 57 + seed) >>> 0);
      const mud = new THREE.Mesh(new THREE.CircleGeometry(4.2, 18), mudMat); mud.rotation.x = -Math.PI / 2; mud.position.y = 0.05; mud.scale.set(1, 0.7, 1); g.add(mud); geometries.push(mud.geometry);
      for (let i = 0; i < WALLOW_BOARS; i++) { const a = wr() * Math.PI * 2, r = 2 + wr() * 3, x = Math.cos(a) * r, z = Math.sin(a) * r, bo = makeBoar(); bo.name = `boar:${i}`; bo.position.set(x, relief(w.x + x, w.z + z) - y, z); bo.rotation.y = wr() * Math.PI * 2; g.add(bo); }
      applyBoars(g);
    }
    // S2: the old moot: MOOT_SEATS stone seats in a ring round a leaning chair, at whose foot the steward sleeps.
    if (mootAt && Math.floor(mootAt.x / CHUNK) === cx && Math.floor(mootAt.z / CHUNK) === cz) {
      const y = relief(mootAt.x, mootAt.z), g = new THREE.Group(); g.name = 'moot'; g.position.set(mootAt.x, y, mootAt.z); group.add(g); const seats: THREE.BufferGeometry[] = [];
      for (let i = 0; i < MOOT_SEATS; i++) { const a = i / MOOT_SEATS * Math.PI * 2, x = Math.cos(a) * MOOT_SEAT_R, z = Math.sin(a) * MOOT_SEAT_R, dy = relief(mootAt.x + x, mootAt.z + z) - y, st = new THREE.BoxGeometry(0.7, 0.5, 0.6).toNonIndexed(); st.rotateY(-a); st.translate(x, dy + 0.2, z); seats.push(st); const back = new THREE.BoxGeometry(0.16, 0.9, 0.6).toNonIndexed(); back.rotateY(-a); back.translate(x + Math.cos(a) * 0.35, dy + 0.5, z + Math.sin(a) * 0.35); seats.push(back); colliders.push({ x: mootAt.x + x, z: mootAt.z + z, radius: 0.4, minY: y - 0.2, maxY: y + 1 }); }
      const chair: THREE.BufferGeometry[] = []; { const seat = new THREE.BoxGeometry(0.8, 0.5, 0.7).toNonIndexed(); seat.translate(0, 0.25, 0); chair.push(seat); const back = new THREE.BoxGeometry(0.8, 1.2, 0.16).toNonIndexed(); back.translate(0, 0.85, 0.36); chair.push(back); }
      const sm = new THREE.Mesh(mergeGeometries(seats)!, oldStone), cm = new THREE.Mesh(mergeGeometries(chair)!, oldStone); cm.rotation.z = 0.08; g.add(sm, cm); geometries.push(sm.geometry, cm.geometry);
    }
    for (const rg of rings.filter(r => Math.floor(r.x / CHUNK) === cx && Math.floor(r.z / CHUNK) === cz)) {
      const y = relief(rg.x, rg.z), g = new THREE.Group(); g.name = 'fairy-ring'; g.position.set(rg.x, y, rg.z); group.add(g); const caps: THREE.BufferGeometry[] = [], stems: THREE.BufferGeometry[] = [], spots: THREE.BufferGeometry[] = [], crystals: THREE.BufferGeometry[] = [];
      for (let i = 0; i < RING_N; i++) { const a = i / RING_N * Math.PI * 2 + rand() * 0.25, r = RING_R + (rand() - 0.5) * 0.4, h = 0.16 + rand() * 0.14, cr = 0.1 + rand() * 0.07, x = Math.cos(a) * r, z = Math.sin(a) * r, dy = relief(rg.x + x, rg.z + z) - y; const st = new THREE.CylinderGeometry(0.035, 0.045, h, 5); st.translate(x, dy + h / 2, z); stems.push(st); const cap = new THREE.SphereGeometry(cr, 7, 5, 0, Math.PI * 2, 0, Math.PI / 2); cap.translate(x, dy + h, z); caps.push(cap); for (let k = 0; k < 3; k++) { const sp = new THREE.SphereGeometry(0.02, 4, 3); const sa = rand() * Math.PI * 2, sr = rand() * cr * 0.7; sp.translate(x + Math.cos(sa) * sr, dy + h + Math.sqrt(Math.max(0, cr * cr - sr * sr)) * 0.9, z + Math.sin(sa) * sr); spots.push(sp); } }
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.3, c = new THREE.ConeGeometry(0.06 + (i % 2) * 0.03, 0.18 + (i % 3) * 0.08, 5); c.rotateZ((i % 2) * 0.25); c.rotateY(a); c.translate(Math.cos(a) * 0.72, 0.08, Math.sin(a) * 0.72); crystals.push(c); }
      const pool = new THREE.Mesh(new THREE.CircleGeometry(0.62, 20), ringWater); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.06; pool.renderOrder = 2; g.add(pool);
      const bowl = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.85, 20), new THREE.MeshStandardMaterial({ color: '#5a5a52', roughness: 1, flatShading: true })); bowl.rotation.x = -Math.PI / 2; bowl.position.y = 0.05; g.add(bowl);
      for (const [gs, mat] of [[caps, capMat], [stems, stemMat], [spots, spotMat], [crystals, ringCrystal]] as [THREE.BufferGeometry[], THREE.Material][]) { const mg = mergeGeometries(gs.map(x => x.toNonIndexed()))!; g.add(new THREE.Mesh(mg, mat)); geometries.push(mg); }
      const light = new THREE.PointLight('#bfe8ff', 0.9, 6, 1.8); light.position.y = 0.6; g.add(light);
    }
    const wood: THREE.BufferGeometry[] = [], cards: Standee[] = [], collars: THREE.BufferGeometry[] = [], dwood: THREE.BufferGeometry[] = [], dcards: Standee[] = [], bwood: THREE.BufferGeometry[] = [], bcards: Standee[] = [];
    for (const t of trees) { const dark = biomeAt(t.x, t.z, seed) === 'dark', blight = blighted(t.x, t.z), parts = treeParts(rand, t.x, relief(t.x, t.z), t.z, t.size); (blight ? bwood : dark ? dwood : wood).push(...parts.wood); (blight ? bcards : dark ? dcards : cards).push(...parts.cards.filter((_, i) => !blight || i % 3 === 0)); collars.push(...parts.roots); colliders.push({ x: t.x, z: t.z, radius: trunkRadius(t), minY: relief(t.x, t.z) - 0.2, maxY: relief(t.x, t.z) + crownHeight(t) }); }
    const add = (gs: THREE.BufferGeometry[], st: Standee[], b: THREE.Material, l: THREE.Material): void => { if (gs.length) { const g = mergeGeometries(gs)!; group.add(new THREE.Mesh(g, b)); geometries.push(g); } if (st.length) { const g = standees(st); group.add(new THREE.Mesh(g, l)); geometries.push(g); } };
    add(wood, cards, bark, leaf); add(dwood, dcards, darkBark, darkLeaf); add(bwood, bcards, blightBark, blightLeaf); if (collars.length) { const g = mergeGeometries(collars)!; group.add(new THREE.Mesh(g, collar)); geometries.push(g); }
    scene.add(group); return { key: chunkKey(cx, cz), group, trees, colliders, geometries };
  }
  /** The far land: past the loaded ring, ground alone out to FAR_RING chunks at FAR_STEP m, one merged mesh rebuilt when she crosses into another chunk, so that from a height the land goes on to the horizon instead of ending at the loaded ring (the summit had no view: Noah's playtest). No trees, no blight out there. Tuning. */
  const FAR_RING = 7, FAR_STEP = 16;
  let far: THREE.Mesh | null = null, farKey = '';
  function buildFar(x: number, z: number): void {
    const near = new Set(chunksAround(x, z).map(c => chunkKey(c.cx, c.cz))), parts: THREE.BufferGeometry[] = [], n = CHUNK / FAR_STEP;
    for (const c of chunksAround(x, z, FAR_RING)) { if (near.has(chunkKey(c.cx, c.cz))) continue;
      const geo = new THREE.PlaneGeometry(CHUNK, CHUNK, n, n); geo.rotateX(-Math.PI / 2); geo.translate((c.cx + 0.5) * CHUNK, 0, (c.cz + 0.5) * CHUNK);
      const pos = geo.attributes.position as THREE.BufferAttribute, col: number[] = []; for (let i = 0; i < pos.count; i++) { const px = pos.getX(i), pz = pos.getZ(i); pos.setY(i, terrain.vertex(px, pz)); col.push(...colourOf(px, pz)); } geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); geo.computeVertexNormals(); parts.push(geo); }
    if (far) { scene.remove(far); far.geometry.dispose(); far = null; }
    if (parts.length) { const g = mergeGeometries(parts)!; for (const p of parts) p.dispose(); far = new THREE.Mesh(g, ground); far.name = 'far-ground'; scene.add(far); }
  }
  /** Keep the ring round (x, z) loaded and nothing else. Returns how many chunks were built. */
  function update(x: number, z: number): number {
    const want = new Set<string>(); let built = 0;
    for (const c of chunksAround(x, z)) { const key = chunkKey(c.cx, c.cz); want.add(key); if (!loaded.has(key)) { loaded.set(key, build(c.cx, c.cz)); built++; } }
    for (const [key, ch] of loaded) if (!want.has(key)) { scene.remove(ch.group); for (const g of ch.geometries) g.dispose(); loaded.delete(key); }
    { const c = chunksAround(x, z, 0)[0], key = chunkKey(c.cx, c.cz); if (key !== farKey) { farKey = key; buildFar(x, z); } }
    return built;
  }
  const treesNear = (x: number, z: number, r: number): Tree[] => { const out: Tree[] = []; for (const ch of loaded.values()) for (const t of ch.trees) if (Math.hypot(t.x - x, t.z - z) <= r) out.push(t); return out; };
  const colliders = (): Collider[] => { const out: Collider[] = []; for (const ch of loaded.values()) out.push(...ch.colliders); return out; };
  /** The blight moved: the loaded chunks are built again under it. */
  function setBlight(f: (x: number, z: number) => boolean): void { blighted = f; for (const [key, ch] of loaded) { scene.remove(ch.group); for (const g of ch.geometries) g.dispose(); const [cx, cz] = key.split(',').map(Number); loaded.set(key, build(cx, cz)); } }
  /** The sanctified ruins (the entry, from the overworld's save and on each sanctifying): the living look on those, the dry on the rest. */
  /** S1: how many rabbits a warren shows, by its id; applied to the warrens built now and as chunks come in. */
  function setRabbits(stock: (id: string) => number): void { rabbitStock = stock; refreshRabbits(); }
  function refreshRabbits(): void { for (const ch of loaded.values()) for (const o of ch.group.children) if (o.name.startsWith('warren:')) applyRabbits(o as THREE.Group); }
  function setSanctified(ids: Set<string>): void { sanctified = new Set(ids); for (const ch of loaded.values()) ch.group.traverse(o => { if (o.name.startsWith('ruin:')) applySanctity(o as THREE.Group); }); }
  /** S4b: how many boars a wallow shows, by its id. */
  function setBoars(stock: (id: string) => number): void { boarStock = stock; refreshBoars(); }
  function refreshBoars(): void { for (const ch of loaded.values()) for (const o of ch.group.children) if (o.name.startsWith('wallow:')) applyBoars(o as THREE.Group); }
  return { setBlight, update, treesNear, colliders, setUnder, setSanctified, setRabbits, refreshRabbits, setBoars, refreshBoars, get count() { return loaded.size; }, get trees() { let n = 0; for (const ch of loaded.values()) n += ch.trees.length; return n; } };
}
