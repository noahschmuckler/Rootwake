// E1 (EDEN.md): the Eden drawn: the cave in the mountain's foot with its hearth, the band's figures (hobbitFigure.ts), the fungus
// (chickenFigure.ts) at its hosts and on its legs, and the pack (the village's wolf body). The model (edenModel.ts) steps in ticks;
// the figures are eased between ticks at their own paces, so a tick's step reads as walking.
import * as THREE from 'three';
import { createHobbit, hobbitLook } from './hobbitFigure';
import { createChicken, type ChickenFigure } from './chickenFigure';
import { makeWolf, type WolfBody } from './wolfFigure';
import { createBurl, createBird, createBobcat, type BurlFigure, type BirdFigure } from './nightFigures';
import { HOBBIT_WALK, WOLF_WALK, CHICKEN_WALK, TUMBLE_PACE, CAT_WALK, type Eden } from './edenModel';
import { mulberry32 } from './colors';

export interface EdenWorld { root: THREE.Group; cave: THREE.Group; /** `night` 0..1: the glows (eggs, birds, the fungus, the bobcat's eyes). */ update(e: Eden, dt: number, time: number, fire: boolean, night?: number): void; /** Dev: every figure put where the model has it now (a check's jump, a slow renderer). */ snap(e: Eden): void; dispose(): void; readonly counts: { hobbits: number; chickens: number; wolves: number; burls: number; birds: number } }
/** The hearth's fire: its light's reach (m) and the mouth's dark. Tuning. */
const FIRE_REACH = 9, SIT_ROCK_H = 0.24;
/** E2a: how far out from a host's centre a burl sits (the vista's trunks are wide). Tuning. */
const BURL_OUT = 0.95;
interface Shown { x: number; z: number; heading: number; speed: number }
const ease = (s: Shown, x: number, z: number, heading: number, pace: number, dt: number): void => {
  const dx = x - s.x, dz = z - s.z, d = Math.hypot(dx, dz);
  // Far behind (a jump), it is put there; a little behind, it catches up at half again its pace.
  if (d > 12) { s.x = x; s.z = z; s.speed = 0; } else if (d > 0.02) { const m = Math.min(d, pace * (d > 2 ? 1.5 : 1) * dt); s.x += dx / d * m; s.z += dz / d * m; s.speed = pace; } else s.speed = 0;
  const want = s.speed > 0 ? Math.atan2(-dx, -dz) : heading, a = Math.atan2(Math.sin(want - s.heading), Math.cos(want - s.heading)); s.heading += a * Math.min(1, dt * 6);
};
/** A shaggy rock: an icosahedron pushed about by a hash. */
function rock(r: number, seed: number): THREE.BufferGeometry { const g = new THREE.IcosahedronGeometry(r, 1), p = g.attributes.position as THREE.BufferAttribute, rand = mulberry32(seed); const j = new Map<string, number>(); for (let i = 0; i < p.count; i++) { const k = `${p.getX(i).toFixed(2)},${p.getY(i).toFixed(2)},${p.getZ(i).toFixed(2)}`; let f = j.get(k); if (f === undefined) { f = 0.75 + rand() * 0.5; j.set(k, f); } p.setXYZ(i, p.getX(i) * f, p.getY(i) * f, p.getZ(i) * f); } g.computeVertexNormals(); return g; }

export function createEdenWorld(scene: THREE.Scene, relief: (x: number, z: number) => number, e: Eden, seed = 1): EdenWorld {
  const root = new THREE.Group(); root.name = 'eden'; scene.add(root);
  const geoms: THREE.BufferGeometry[] = [], mats: THREE.Material[] = [];
  const keep = <T extends THREE.BufferGeometry>(g: T): T => { geoms.push(g); return g; }, mat = <T extends THREE.Material>(m: T): T => { mats.push(m); return m; };
  // ── the cave: two shoulders of rock and a lintel over a dark mouth in the slope, facing `dir`; the hearth before it ──
  const cave = new THREE.Group(); cave.name = 'cave'; cave.position.set(e.cave.x, relief(e.cave.x, e.cave.z), e.cave.z); cave.rotation.y = e.cave.dir; root.add(cave);
  const stone = mat(new THREE.MeshStandardMaterial({ color: '#5a5650', roughness: 1, flatShading: true })), dark = mat(new THREE.MeshBasicMaterial({ color: '#070604', side: THREE.DoubleSide }));
  for (const [sx, sy, sz, r, s] of [[-2.1, 0.6, 0.4, 1.5, 1], [2.2, 0.5, 0.3, 1.4, 2], [-1.4, 2.1, -0.2, 1.1, 3], [1.5, 2.2, -0.3, 1.05, 4], [0, 2.9, -0.6, 1.3, 5], [-2.8, 1.6, -1.2, 1.2, 6], [2.9, 1.5, -1.3, 1.15, 7]] as const) { const m = new THREE.Mesh(keep(rock(r, seed * 11 + s)), stone); m.position.set(sx, sy, sz); cave.add(m); }
  // The mouth: a black hollow set into the slope, deep enough that the figures walk into it and are gone.
  const mouth = new THREE.Mesh(keep(new THREE.CircleGeometry(1.25, 14)), dark); mouth.position.set(0, 1.1, 0.9); cave.add(mouth);
  const tube = new THREE.Mesh(keep(new THREE.CylinderGeometry(1.25, 1.1, 4, 14, 1, true)), mat(new THREE.MeshBasicMaterial({ color: '#0b0906', side: THREE.BackSide }))); tube.rotation.x = Math.PI / 2; tube.position.set(0, 1.1, 2.9); cave.add(tube);
  const back = new THREE.Mesh(keep(new THREE.CircleGeometry(1.1, 14)), dark); back.position.set(0, 1.1, 4.9); cave.add(back);
  const floor = new THREE.Mesh(keep(new THREE.PlaneGeometry(3.2, 5.4)), mat(new THREE.MeshStandardMaterial({ color: '#4a4238', roughness: 1 }))); floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0.02, 2.4); cave.add(floor);
  // The hearth: a ring of stones and a fire, lit at dusk.
  const hearth = new THREE.Group(); hearth.position.set(e.hearth.x, relief(e.hearth.x, e.hearth.z), e.hearth.z); root.add(hearth);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(keep(rock(0.14, seed * 13 + i)), stone); m.position.set(Math.cos(a) * 0.55, 0.08, Math.sin(a) * 0.55); hearth.add(m); }
  const flameMat = mat(new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff9a30').multiplyScalar(1.6), transparent: true, opacity: 0.9 })), flames: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(keep(new THREE.ConeGeometry(0.12 - i * 0.03, 0.35 + i * 0.12, 6)), flameMat); f.position.set((i - 1) * 0.08, 0.2 + i * 0.05, (i % 2) * 0.06); hearth.add(f); flames.push(f); }
  const ember = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 10)), mat(new THREE.MeshStandardMaterial({ color: '#2a1a10', emissive: '#c04010', emissiveIntensity: 0.6, roughness: 1 }))); ember.position.y = 0.04; hearth.add(ember);
  const fireLight = new THREE.PointLight('#ffa040', 0, FIRE_REACH, 1.8); fireLight.position.y = 0.8; hearth.add(fireLight);
  // E1b: the flowers the band sniffs (a stem and three pastel heads) and the rocks it sits on (SIT_ROCK_H tall, flat-topped), at the model's spots.
  const petalMats = ['#ff8fb0', '#ffd65a', '#c8a2ff', '#ff9a5a'].map(c => mat(new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, flatShading: true }))), stemMat = mat(new THREE.MeshStandardMaterial({ color: '#3f7a2a', roughness: 1 }));
  const petalGeo = keep(new THREE.SphereGeometry(0.045, 7, 6)), stemGeo = keep(new THREE.CylinderGeometry(0.008, 0.012, 0.22, 5));
  e.flowers.forEach((f, i) => { const g = new THREE.Group(); g.position.set(f.x, relief(f.x, f.z), f.z); root.add(g); for (let k = 0; k < 3; k++) { const a = (i * 1.7 + k * 2.1), st = new THREE.Mesh(stemGeo, stemMat); st.position.set(Math.cos(a) * 0.09, 0.11, Math.sin(a) * 0.09); st.rotation.z = Math.cos(a) * 0.25; st.rotation.x = Math.sin(a) * 0.25; g.add(st); const h = new THREE.Mesh(petalGeo, petalMats[(i + k) % petalMats.length]); h.position.set(Math.cos(a) * 0.13, 0.23, Math.sin(a) * 0.13); h.scale.set(1, 0.6, 1); g.add(h); } });
  e.rocks.forEach((r, i) => { const m = new THREE.Mesh(keep(rock(0.3, seed * 17 + i)), stone); m.scale.set(1, 0.7, 1); m.position.set(r.x, relief(r.x, r.z) + 0.1, r.z); root.add(m); });
  // ── the band ──
  const hobbits = e.hobbits.map((h, i) => { const f = createHobbit(hobbitLook(seed, i), seed * 3 + i); root.add(f.group); return { id: h.id, f, s: { x: h.x, z: h.z, heading: h.heading, speed: 0 } as Shown }; });
  // ── the fungus, by id, made as it appears and taken away as it is eaten ──
  const chickens = new Map<number, { f: ChickenFigure; s: Shown }>();
  // ── the pack ──
  const wolves = e.pack.map(w => { const b: WolfBody = makeWolf(); b.group.scale.setScalar(0.95); root.add(b.group); return { b, s: { x: w.x, z: w.z, heading: w.heading, speed: 0 } as Shown, phase: 0 }; });
  // ── E2a: the burls on their hosts, the birds in the air, the bobcat ──
  const burls = new Map<number, BurlFigure>(), birds = new Map<number, { f: BirdFigure; s: Shown & { y: number } }>();
  const cat = createBobcat(); root.add(cat.group); const catS: Shown = { x: e.cat?.x ?? 0, z: e.cat?.z ?? 0, heading: 0, speed: 0 }; let catUp = 0;
  function update(ed: Eden, dt: number, time: number, fire: boolean, night = 0): void {
    const t = time / 1000;
    const seenBurls = new Set<number>();
    for (const b of ed.burls) {
      seenBurls.add(b.id); let f = burls.get(b.id); const host = ed.hosts.find(h => h.id === b.host); if (!host) continue;
      if (!f) { f = createBurl(seed * 7 + b.id); f.group.position.set(host.x + Math.cos(b.side) * BURL_OUT, relief(host.x, host.z) + b.h, host.z + Math.sin(b.side) * BURL_OUT); f.group.rotation.y = -b.side; root.add(f.group); burls.set(b.id, f); }
      f.update(night, b.eggs > 0, time);
    }
    for (const [id, f] of burls) if (!seenBurls.has(id)) { root.remove(f.group); f.dispose(); burls.delete(id); }
    const seenBirds = new Set<number>();
    for (const b of ed.birds) {
      seenBirds.add(b.id); let v = birds.get(b.id); if (!v) { v = { f: createBird(seed * 3 + b.id), s: { x: b.x, y: b.y, z: b.z, heading: b.heading, speed: 0 } }; root.add(v.f.group); birds.set(b.id, v); }
      ease(v.s, b.x, b.z, b.heading, 2.2, dt); v.s.y += (b.y - v.s.y) * Math.min(1, dt * 3);
      v.f.update(v.s.x, relief(v.s.x, v.s.z) + v.s.y, v.s.z, v.s.heading, night, dt);
    }
    for (const [id, v] of birds) if (!seenBirds.has(id)) { root.remove(v.f.group); v.f.dispose(); birds.delete(id); }
    if (ed.cat) {
      const c = ed.cat, climbing = c.act === 'climbing' || c.act === 'eating' || c.act === 'descending'; ease(catS, c.x, c.z, c.heading, CAT_WALK * 1.15, dt); catUp += (c.up - catUp) * Math.min(1, dt * 4);
      const burl = climbing && c.burl !== null ? ed.burls.find(b => b.id === c.burl) : null, lift = burl ? catUp * (burl.h - 0.3) : 0;
      cat.group.visible = true; cat.update(catS.x, relief(catS.x, catS.z) + lift, catS.z, climbing && burl ? -burl.side + Math.PI / 2 : catS.heading, { act: c.act, speed: catS.speed, up: catUp }, night, dt);
    } else cat.group.visible = false;
    for (const h of hobbits) {
      const m = ed.hobbits.find(x => x.id === h.id); if (!m) { h.f.group.visible = false; continue; }
      const an = m.antic?.kind ?? null; ease(h.s, m.x, m.z, m.heading, an === 'tumble' ? TUMBLE_PACE * 1.2 : HOBBIT_WALK * 1.15, dt);
      // Sitting, it is up on the rock; the rest stand on the ground.
      h.f.update(h.s.x, relief(h.s.x, h.s.z) + (an === 'sit' ? SIT_ROCK_H : 0), h.s.z, h.s.heading, { speed: h.s.speed, carry: m.carry, eating: m.act === 'eating', taking: m.act === 'taking', inside: m.inside, antic: an }, dt);
    }
    const seen = new Set<number>();
    for (const c of ed.chickens) {
      seen.add(c.id); let v = chickens.get(c.id); if (!v) { v = { f: createChicken(seed * 5 + c.id), s: { x: c.x, z: c.z, heading: c.heading, speed: 0 } }; root.add(v.f.group); chickens.set(c.id, v); }
      // Attached, it sits against its host's trunk, a little out from the centre on its own side, its back to the tree.
      const attached = c.stage !== 'free', host = attached ? ed.hosts.find(h => h.id === c.host) : null, a = c.id * 2.4;
      const x = host ? host.x + Math.cos(a) * 0.42 : c.x, z = host ? host.z + Math.sin(a) * 0.42 : c.z, heading = host ? Math.atan2(-Math.cos(a), -Math.sin(a)) + Math.PI : c.heading;
      if (attached) { v.s.x = x; v.s.z = z; v.s.heading = heading; v.s.speed = 0; } else ease(v.s, x, z, heading, CHICKEN_WALK * 1.2, dt);
      v.f.update(v.s.x, relief(v.s.x, v.s.z), v.s.z, v.s.heading, c.stage, c.grown, v.s.speed, dt, night);
    }
    for (const [id, v] of chickens) if (!seen.has(id)) { root.remove(v.f.group); v.f.dispose(); chickens.delete(id); }
    for (let i = 0; i < wolves.length; i++) {
      const w = wolves[i], m = ed.pack[i]; if (!m) { w.b.group.visible = false; continue; }
      ease(w.s, m.x, m.z, m.heading, WOLF_WALK * 1.15, dt);
      const g = w.b.group, fx = -Math.sin(w.s.heading), fz = -Math.cos(w.s.heading); g.position.set(w.s.x, relief(w.s.x, w.s.z), w.s.z); g.rotation.y = -Math.atan2(fz, fx);
      const lying = m.act === 'resting' || m.act === 'eating'; g.position.y += lying ? -0.22 : 0; g.rotation.z = lying ? 0.08 : 0;
      if (w.s.speed > 0) { w.phase += dt * 9; for (let k = 0; k < 4; k++) w.b.legs[k].rotation.z = Math.sin(w.phase + (k % 3) * Math.PI * 0.5) * 0.5; w.b.tail.rotation.x = Math.sin(w.phase * 0.5) * 0.3; } else { for (const l of w.b.legs) l.rotation.z = lying ? 1.2 : 0; w.b.tail.rotation.x = Math.sin(t * 2 + i) * 0.15; }
    }
    // The fire: lit at dusk and through the night, flickering.
    for (let i = 0; i < flames.length; i++) { flames[i].visible = fire; flames[i].scale.set(1, fire ? 0.85 + Math.sin(t * 13 + i * 2.1) * 0.2 : 0.001, 1); flames[i].rotation.z = Math.sin(t * 9 + i) * 0.12; }
    fireLight.intensity = fire ? 4 + Math.sin(t * 11) * 0.8 : 0;
  }
  function snap(ed: Eden): void { if (ed.cat) { catS.x = ed.cat.x; catS.z = ed.cat.z; catS.heading = ed.cat.heading; catUp = ed.cat.up; } for (const [id, v] of birds) { const b = ed.birds.find(x => x.id === id); if (b) { v.s.x = b.x; v.s.z = b.z; v.s.y = b.y; } } for (const h of hobbits) { const m = ed.hobbits.find(x => x.id === h.id); if (m) { h.s.x = m.x; h.s.z = m.z; h.s.heading = m.heading; h.s.speed = 0; } } for (const c of ed.chickens) { const v = chickens.get(c.id); if (v) { v.s.x = c.x; v.s.z = c.z; v.s.heading = c.heading; } } for (let i = 0; i < wolves.length; i++) { const m = ed.pack[i]; if (m) { wolves[i].s.x = m.x; wolves[i].s.z = m.z; wolves[i].s.heading = m.heading; } } }
  function dispose(): void { scene.remove(root); for (const h of hobbits) h.f.dispose(); for (const v of chickens.values()) v.f.dispose(); for (const f of burls.values()) f.dispose(); for (const v of birds.values()) v.f.dispose(); cat.dispose(); for (const g of geoms) g.dispose(); for (const m of mats) m.dispose(); }
  return { root, cave, update, snap, dispose, get counts() { return { hobbits: hobbits.length, chickens: chickens.size, wolves: wolves.length, burls: burls.size, birds: birds.size }; } };
}
