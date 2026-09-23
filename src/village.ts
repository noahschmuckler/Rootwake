// The village, V0: presence. Hulda walks a meadow among eight hobbits who live by a day's rhythm:
// out of their doors at dawn to the places they keep to, together at the fire at noon, home at
// dusk, asleep at night. They do not see her yet. Twenty real minutes to their day, which passes
// only while the page is open. The question: do figures going in and out of houses on a rhythm
// already read as people living there?
import './village.css';
import * as THREE from 'three';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE, type HuldaForm } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { buildVillage, relief, HOBBIT_HEIGHT } from './villageWorld';
import { HOBBITS, HOUSES, STORES, STATIONS, SITES, YIELD_OF, balance, stationAt, storeFull, collect, deliver, stepRaiders, strike, thornBurst, rootBind, STRIKE_CD, THORN_CD, ROOT_CD, THORN_SAP, ROOT_SAP, VIGOR_MAX, SAP_MAX, DY_HP, summonSpirit, spiritCost, COLLECT_S, DELIVER_S, PRAYER_CAP, HOUSE_RADIUS, WALK_RADIUS, PHASES, type SiteKind, type Store, TICKS_PER_SECOND, DAY_TICKS, TREES, TREE_ROOTS, GRASS_SPEED, alignedRoot, ROOT_SPEED, TRUNK_CLIMB, CROWN_SLIDE, HOP_S, PRESS_S, PRESS_RANGE, ENTER_RANGE, freshVillage, parseVillage, serializeVillage, advance, clockOf, phaseAt, daylightAt, everyone, hobbitById, thought, crownHeight, trunkRadius, nearestTree, nextRoot, rootPoint, rootTangent, endTree, hopTargets, grassCan, inWater, type Village, type Tree, type RootEdge } from './villageModel';
/** Grass → root: a root within ROOT_CATCH m whose run agrees with hers by |cos| ≥ ROOT_CATCH_DOT takes her; the step is sampled every ROOT_CATCH_STEP m. Tuning. */
const ROOT_CATCH = 0.7, ROOT_CATCH_DOT = 0.6, ROOT_CATCH_STEP = 0.25;
/** The longest gap between frames the village clock counts as watched time. Tuning. */
const WALL_CAP = 2;
import { MODEL_HEIGHT } from './huldaRig';
import type { TraversalWorld } from './mobility';
const KEY = 'rootwake-village-v1';
let village: Village = freshVillage(1); try { village = parseVillage(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, serializeVillage(village)); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 220); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#eef4e2', '#4d5f48', 2.3); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.3); sun.position.set(-20, 40, 15); scene.add(sun);
const world = buildVillage(scene);
const groundWorld: TraversalWorld = {
  surfacesAt: (x, z) => (Math.hypot(x, z) <= WALK_RADIUS ? [relief(x, z)] : []),
  canOccupy: (p, radius) => Math.hypot(p.x, p.z) <= WALK_RADIUS && p.y >= relief(p.x, p.z) - 0.03 && !HOUSES.some(h => Math.hypot(p.x - h.x, p.z - h.z) < HOUSE_RADIUS + radius) && !TREES.some(t => Math.hypot(p.x - t.x, p.z - t.z) < trunkRadius(t) + radius),
};
/** While she is a bulge, a figure of leaves or a knot in a root, the shared motor stays put but the stick still speaks. */
const lockedWorld: TraversalWorld = { surfacesAt: () => [], canOccupy: () => false };
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third'; player.traversalWorld = groundWorld;
const presentation = createHuldaPresentation(scene, world.figure, world.mass);
const hulda = presentation.hulda;
// Hulda and the hobbits share the skeleton, so the Mixamo clips drive all nine (public/models/README.md).
const query = new URLSearchParams(location.search), clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
let clipStatus: 'none' | 'loading' | 'ready' | 'failed' = clipUrls.length ? 'loading' : 'none', clipError = '';
if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => { presentation.setClips(clips); for (const f of world.figures) f.setClips(clips); clipStatus = 'ready'; }, e => { clipStatus = 'failed'; clipError = String(e); console.warn('clips', e); });
for (const child of [...player.avatar.children]) player.avatar.remove(child);
player.teleport(0, -16, Math.PI); player.pitch = 0.08; installMobilityControls(player);
let time = 0, last = performance.now(), tickBank = 0, saveClock = 0, simSeconds = 0;
// Dev control of the clock (tap the clock): the day runs at `speed` times real time, and jumps forward advance the model; a jump back replays the village from its seed to that tick, which is the same state, since the village is deterministic and she does not touch it yet.
let speed = 1;
function syncShown(): void { for (let i = 0; i < HOBBITS.length; i++) { const s = village.hobbits[i]; shown[i].x = s.x; shown[i].z = s.z; shown[i].heading = s.heading; } }
function setTick(t: number): void { t = Math.max(0, Math.floor(t)); if (t >= village.tick) advance(village, t - village.tick); else { village = freshVillage(village.seed); advance(village, t); } tickBank = 0; syncShown(); save(); }
/** The next dawn / noon / dusk / night from now (the same phase today if it is still ahead). */
function jumpTo(phase: 'dawn' | 'noon' | 'dusk' | 'night'): void { const at = PHASES.find(p => p[0] === phase)![1], day = Math.floor(village.tick / DAY_TICKS), today = day * DAY_TICKS + at; setTick(today > village.tick ? today : today + DAY_TICKS); }
const timectl = el('timectl'); el('clock').addEventListener('click', () => { timectl.hidden = !timectl.hidden; });
timectl.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('button'); if (!b) return; if (b.dataset.jump) setTick(village.tick + Number(b.dataset.jump)); else if (b.dataset.to) jumpTo(b.dataset.to as 'dawn'); else if (b.dataset.speed) { speed = Number(b.dataset.speed); for (const o of timectl.querySelectorAll('button[data-speed]')) o.classList.toggle('on', o === b); } });

// Her ways through the meadow (the clearing's moves): into a trunk, up to the crown, across the crowns; under the
// grass as a bulge, free and fast; onto a tree root, faster still but held to its path; out by a double tap.
type Mode = 'ground' | 'trunk' | 'crown' | 'hop' | 'sink' | 'grass' | 'root' | 'rise' | 'faint';
let mode: Mode = 'ground', under = 0, press = 0, lastStickTap = -Infinity, stickDown = 0, stickDownAt = { x: 0, y: 0 };
let trunk: { tree: Tree; h: number; az: number; downHeld: number } | null = null;
let crown: { tree: Tree; az: number; armed: boolean } | null = null;
let hop: { from: THREE.Vector3; to: THREE.Vector3; t: number; tree: Tree; az: number } | null = null;
let grass: { x: number; z: number; heading: number } | null = null;
let root: { root: RootEdge; s: number; forward: boolean; off: number } | null = null;
let move: { from: THREE.Vector3; to: THREE.Vector3; t: number; seconds: number; then: () => void } | null = null;
function want(): THREE.Vector3 {
  const g = player.gesture; if (!g.held || Math.hypot(g.x, g.y) < 0.25) return new THREE.Vector3();
  const yaw = player.yaw, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  return new THREE.Vector3(rx * g.x + fx * -g.y, 0, rz * g.x + fz * -g.y).normalize();
}
const stickY = (): number => (player.gesture.held ? player.gesture.y : 0), stickX = (): number => (player.gesture.held ? player.gesture.x : 0);
/** Her camera when she is not walking: the same rule as the shared third person (behind her by yaw, a fixed lift, the look tilted by pitch), so a drag reads the same whatever she is. */
function orbitCamera(target: THREE.Vector3, back = 3.2, up = 1.3): void { const yaw = player.yaw, f = player.forward(); camera.position.set(target.x + Math.sin(yaw) * back, target.y + up, target.z + Math.cos(yaw) * back); camera.lookAt(target.x + f.x * 2, target.y + 0.4 + f.y * 2, target.z + f.z * 2); }
function lock(): void { player.traversalWorld = lockedWorld; player.motor.velocity.set(0, 0, 0); player.avatar.visible = false; }
function place(p: THREE.Vector3): void { player.motor.feet.copy(p); player.position.x = p.x; player.position.z = p.z; }
function standOn(x: number, z: number, yaw = player.yaw): void {
  const n = nearestTree(x, z); if (n.distance < 0.35) { const a = Math.atan2(z - n.tree.z, x - n.tree.x); x = n.tree.x + Math.cos(a) * (trunkRadius(n.tree) + 0.4); z = n.tree.z + Math.sin(a) * (trunkRadius(n.tree) + 0.4); }
  player.traversalWorld = groundWorld; player.motor.reset(new THREE.Vector3(x, relief(x, z), z)); place(new THREE.Vector3(x, relief(x, z), z)); player.yaw = yaw; player.canMove = true; mode = 'ground'; trunk = null; crown = null; hop = null; grass = null; root = null;
}
function enterTrunk(tree: Tree): void { lock(); trunk = { tree, h: 0.2, az: Math.atan2(player.feet().z - tree.z, player.feet().x - tree.x), downHeld: 0 }; mode = 'trunk'; }
/** Into the grass: a bulge under the meadow from wherever she stands (or from a trunk's foot). */
function enterGrass(from: THREE.Vector3): void { lock(); mode = 'sink'; trunk = null; move = { from: from.clone(), to: new THREE.Vector3(from.x, relief(from.x, from.z) - 0.1, from.z), t: 0, seconds: 0.5, then: () => { grass = { x: from.x, z: from.z, heading: player.yaw }; mode = 'grass'; } }; }
/** Where she can stand on the ground: within the walkable world, not in water, a house or a trunk. */
const standable = (x: number, z: number): boolean => grassCan(x, z) && Math.hypot(x, z) <= WALK_RADIUS && nearestTree(x, z).distance >= trunkRadius(nearestTree(x, z).tree) + 0.3;
function emerge(): void {
  if (mode !== 'grass' && mode !== 'root' && mode !== 'trunk' && mode !== 'crown') return;
  const p = mode === 'grass' && grass ? new THREE.Vector3(grass.x, relief(grass.x, grass.z), grass.z) : mode === 'root' && root ? rootPoint(root.root, root.s) : mode === 'trunk' && trunk ? world.trunkPoint(trunk.tree, trunk.h, trunk.az) : crown ? world.crownPoint(crown.tree, crown.az) : null;
  if (!p) return; let gx = p.x, gz = p.z; const n = nearestTree(gx, gz); if (n.distance < trunkRadius(n.tree) + 0.45) { const a = Math.atan2(gz - n.tree.z, gx - n.tree.x); gx = n.tree.x + Math.cos(a) * (trunkRadius(n.tree) + 0.5); gz = n.tree.z + Math.sin(a) * (trunkRadius(n.tree) + 0.5); }
  // Out must always be possible: where she is cannot be stood on (water, a house, the edge of the world), the nearest spot round it that can is taken instead.
  if (!standable(gx, gz)) { let found: { x: number; z: number } | null = null; for (let r = 0.6; r <= 3.0 && !found; r += 0.6) for (let k = 0; k < 12 && !found; k++) { const a = k / 12 * Math.PI * 2, x = gx + Math.cos(a) * r, z = gz + Math.sin(a) * r; if (standable(x, z)) found = { x, z }; } if (!found) return; gx = found.x; gz = found.z; }
  const from = p.clone(); mode = 'rise'; grass = null; root = null; trunk = null; crown = null;
  move = { from, to: new THREE.Vector3(gx, relief(gx, gz), gz), t: 0, seconds: 0.7, then: () => standOn(gx, gz) };
}
function pressInto(dt: number): void {
  const w = want(), feet = player.feet(); if (w.lengthSq() === 0 || player.motor.speed > 0.35 || village.stack) { press = 0; return; }
  const n = nearestTree(feet.x, feet.z), toTree = new THREE.Vector3(n.tree.x - feet.x, 0, n.tree.z - feet.z).normalize();
  if (n.distance < PRESS_RANGE && toTree.dot(w) > 0.6) { press += dt; if (press > PRESS_S) { press = 0; enterTrunk(n.tree); } return; }
  press = 0;
}
const walk = el('walk');
walk.addEventListener('pointerdown', e => { stickDown = performance.now(); stickDownAt = { x: e.clientX, y: e.clientY }; }, true);
walk.addEventListener('pointerup', e => { const now = performance.now(); if (now - stickDown < 230 && Math.hypot(e.clientX - stickDownAt.x, e.clientY - stickDownAt.y) < 10) { if (now - lastStickTap < 330) { lastStickTap = -Infinity; if (mode === 'ground') { const f = player.feet(); if (village.stack) wobble = 0.6; else if (grassCan(f.x, f.z)) enterGrass(f); } else emerge(); } else lastStickTap = now; } }, true);
void ENTER_RANGE;
// Each hobbit's shown position eases after the model's tick, so a tick's step reads as walking, not a jump.
const shown = HOBBITS.map((h, i) => { const s = village.hobbits[i]; return { x: s.x, z: s.z, heading: s.heading, speed: 0, label: document.createElement('div'), bubble: document.createElement('div'), hunger: null as unknown as HTMLElement, name: h.name }; });
{ const t = Number(new URLSearchParams(location.search).get('tick')); if (Number.isFinite(t) && t > 0) setTick(t); }
const labels = el('labels'); for (const s of shown) { s.label.className = 'name'; s.label.textContent = s.name; s.bubble.className = 'bubble'; const meter = document.createElement('i'); meter.className = 'hunger'; s.hunger = document.createElement('b'); meter.append(s.hunger); s.label.append(meter); labels.append(s.label, s.bubble); }
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro'); el('help').onclick = () => { player.cancelInput(); intro.showModal(); }; el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); if (document.hidden) save(); });
window.addEventListener('pagehide', save); window.addEventListener('beforeunload', save);
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
const daySky = new THREE.Color('#a9bcae'), duskSky = new THREE.Color('#c9946a'), nightSky = new THREE.Color('#1d2836'), colour = new THREE.Color();
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
const visualForward = new THREE.Vector3(0, 0, -1);
function presentHulda(dt: number): void {
  let form: HuldaForm = 'human';
  visualPosition.copy(player.feet());
  let heading = player.yaw; if (mode === 'ground' && player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  visualRotation.setFromAxisAngle(up, heading);
  if (mode === 'trunk' && trunk) { form = 'burl'; visualPosition.copy(world.trunkPoint(trunk.tree, trunk.h, trunk.az)); visualRotation.setFromAxisAngle(up, Math.PI / 2 - trunk.az); }
  else if (mode === 'crown' && crown) { form = 'leaf'; visualPosition.copy(world.crownPoint(crown.tree, crown.az)); }
  else if (mode === 'hop') form = 'leaf';
  else if (mode === 'grass' && grass) { form = 'ivy'; visualPosition.set(grass.x, relief(grass.x, grass.z) - 0.05, grass.z); visualRotation.setFromAxisAngle(up, grass.heading); }
  else if (mode === 'root' && root) { form = 'knot'; visualPosition.copy(rootPoint(root.root, root.s)); const t = rootTangent(root.root, root.s); if (!root.forward) t.negate(); visualRotation.setFromUnitVectors(visualForward, t.normalize()); }
  else if (mode === 'sink' || mode === 'rise' || mode === 'faint') form = 'ivy';
  if (form === 'human' || form === 'leaf') visualPosition.y += HUMAN_CENTRE;
  presentation.update(dt, form, visualPosition, visualRotation, player.motor.speed, heading, mode === 'ground', mode !== 'ground' || player.view === 'third', form);
  player.avatar.visible = false;
}
// Her stations (W1): in a place's ring on her feet she collects into her stack, a unit every COLLECT_S; in a store's ring she delivers, one every DELIVER_S; before the stone the miracles are offered. A loaded stack refuses her other forms (a wobble says so).
let collectClock = 0, deliverClock = 0, wobble = 0, lastStation: string | null = null;
const miracles = el('miracles'), prayerEl = el('prayer'), tip = el('tip');
/** `dt` here is real time (capped at a quarter second), like the village's ticks: her collecting keeps its pace however slow the frames. */
function stations(dt: number): void {
  const f = player.feet(), st = mode === 'ground' ? stationAt(f.x, f.z) : null, id = st?.id ?? null;
  if (id !== lastStation) { collectClock = 0; deliverClock = 0; lastStation = id; }
  world.setStation(id, time);
  let say = '';
  if (st?.kind === 'gather' && st.keeps) { const kind = YIELD_OF[st.keeps]!; collectClock += dt; while (collectClock >= COLLECT_S) { collectClock -= COLLECT_S; if (!collect(village, st.keeps)) { collectClock = 0; break; } } if (storeFull(village, kind)) say = `${STORES[kind].name} are full`; else if (village.stack && village.stack.kind !== kind) say = `her hands are full of ${STORES[village.stack.kind].unit}`; }
  else if (st?.kind === 'deliver' && st.store) { deliverClock += dt; while (deliverClock >= DELIVER_S) { deliverClock -= DELIVER_S; if (!deliver(village, st.store)) { deliverClock = 0; break; } } if (village.stack && village.stack.kind !== st.store) say = `${STORES[st.store].name} take ${STORES[st.store].unit}, not ${STORES[village.stack.kind].unit}`; else if (village.stack && storeFull(village, st.store)) say = `${STORES[st.store].name} are full`; }
  tip.hidden = !say; if (say) tip.textContent = say;
  miracles.hidden = st?.kind !== 'shrine'; if (!miracles.hidden) { const cost = spiritCost(village); for (const b of miracles.querySelectorAll('button')) { b.disabled = village.prayer < cost; b.querySelector('i')!.textContent = String(cost); } }
  prayerEl.textContent = `prayer ${Math.floor(village.prayer)} / ${PRAYER_CAP}`; world.updatePrayer(village.prayer / PRAYER_CAP);
  wobble = Math.max(0, wobble - dt);
  world.setStack(village.stack?.kind ?? null, village.stack?.n ?? 0);
  if (village.stack && mode === 'ground') { const yaw = player.yaw; world.stack.position.set(f.x + Math.sin(yaw) * 0.16, f.y + 0.78, f.z + Math.cos(yaw) * 0.16); world.stack.rotation.set(Math.sin(wobble * 20) * wobble * 0.5, yaw, 0); } else world.stack.visible = false;
}
miracles.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('button'); if (!b || !b.dataset.keeps) return; if (summonSpirit(village, b.dataset.keeps as SiteKind)) save(); });
// The spirits: shown like the hobbits, eased after the model, as figures of leaves that bob a little.
const shownSpirits: { x: number; z: number; heading: number }[] = [];
function presentSpirits(dt: number): void {
  for (let i = 0; i < village.spirits.length; i++) {
    const s = village.spirits[i]; if (!shownSpirits[i]) shownSpirits[i] = { x: s.x, z: s.z, heading: s.heading };
    const v = shownSpirits[i], f = world.spiritFigure(i), dx = s.x - v.x, dz = s.z - v.z, d = Math.hypot(dx, dz), step = d < 0.03 ? d : Math.min(d, (d > 2.5 ? 3 : 1.3) * speed * dt);
    if (d > 1e-4) { v.x += dx / d * step; v.z += dz / d * step; }
    const th = d > 0.05 ? Math.atan2(dz, dx) : s.heading; v.heading += wrap(th - v.heading) * Math.min(1, dt * 8);
    f.position.set(v.x, relief(v.x, v.z) + Math.sin(time * 0.004 + i) * 0.04, v.z); f.rotation.y = -Math.PI / 2 - v.heading;
  }
}
// Fighting (Diablo-shaped): a cheap strike on a short cooldown, two rechargeable specials that also spend sap. The Dark Young are stepped in real seconds (at the clock's speed); bitten to nothing she faints into the grass and wakes at the stone, weakened, never dead.
const cooldown = { strike: 0, thorn: 0, root: 0 };
const fightEl = { strike: el<HTMLButtonElement>('strike'), thorn: el<HTMLButtonElement>('thorn'), root: el<HTMLButtonElement>('root'), vigor: el('vigor').firstElementChild as HTMLElement, sap: el('sap').firstElementChild as HTMLElement };
function herFacing(): { fx: number; fz: number } { return { fx: -Math.sin(player.yaw), fz: -Math.cos(player.yaw) }; }
function fight(simDt: number, dt: number): void {
  const her = mode === 'ground' && village.hero.faint === 0 ? { x: player.feet().x, z: player.feet().z } : null;
  stepRaiders(village, simDt, her);
  for (const k of ['strike', 'thorn', 'root'] as const) { cooldown[k] = Math.max(0, cooldown[k] - dt); const total = k === 'strike' ? STRIKE_CD : k === 'thorn' ? THORN_CD : ROOT_CD; fightEl[k].style.setProperty('--cd', String(cooldown[k] / total)); fightEl[k].classList.toggle('short', k !== 'strike' && village.hero.sap < (k === 'thorn' ? THORN_SAP : ROOT_SAP)); }
  fightEl.vigor.style.width = `${village.hero.vigor / VIGOR_MAX * 100}%`; fightEl.sap.style.width = `${village.hero.sap / SAP_MAX * 100}%`;
  if (village.hero.faint > 0 && mode !== 'faint') { lock(); mode = 'faint'; grass = null; root = null; trunk = null; crown = null; }
  if (mode === 'faint') { const p = player.feet(); place(p); orbitCamera(p, 3.2, 1.3); if (village.hero.faint === 0) { const st = STATIONS.find(s => s.kind === 'shrine')!; standOn(st.x, st.z, Math.atan2(-(SITES.shrine.x - st.x), -(SITES.shrine.z - st.z))); } }
  world.updateStrokes(dt);
}
function attack(k: 'strike' | 'thorn' | 'root'): void {
  if (mode !== 'ground' || village.hero.faint > 0 || cooldown[k] > 0) return; const f = player.feet(), her = { x: f.x, z: f.z }, { fx, fz } = herFacing();
  if (k === 'strike') { const hit = strike(village, her, fx, fz); cooldown.strike = STRIKE_CD; world.flashSlash(f.x, f.y, f.z, player.yaw); if (hit) { const yaw = Math.atan2(-(hit.x - f.x), -(hit.z - f.z)); player.yaw += Math.atan2(Math.sin(yaw - player.yaw), Math.cos(yaw - player.yaw)) * 0.6; } }
  else if (k === 'thorn') { const n = thornBurst(village, her); if (n < 0) return; cooldown.thorn = THORN_CD; world.flashBurst(f.x, f.y, f.z); }
  else { const r = rootBind(village, her); if (r === undefined) return; cooldown.root = ROOT_CD; }
  save();
}
for (const k of ['strike', 'thorn', 'root'] as const) fightEl[k].addEventListener('pointerdown', e => { e.preventDefault(); attack(k); });
// The Dark Young shown from the model, with a name and an hp bar over each while near.
const raiderLabels = new Map<number, { label: HTMLElement; hp: HTMLElement }>();
function presentRaiders(dt: number): void {
  const seen = new Set<number>();
  for (const r of village.raiders) {
    seen.add(r.id); world.setRaider(r.id, r.x, r.z, r.heading, time, r.state === 'coming' || r.state === 'hunting' || r.state === 'leaving', r.hurt, r.rooted, r.state === 'dead' ? r.gone : 0);
    let l = raiderLabels.get(r.id); if (!l) { const label = document.createElement('div'); label.className = 'name foe'; label.textContent = 'dark young'; const meter = document.createElement('i'); meter.className = 'hunger'; const hp = document.createElement('b'); meter.append(hp); label.append(meter); labels.append(label); l = { label, hp }; raiderLabels.set(r.id, l); }
    tmp.set(r.x, relief(r.x, r.z) + 2.4, r.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = r.state !== 'dead' && tmp.z < 1 && dist < 22 && Math.abs(tmp.x) < 1.1;
    l.label.hidden = !show; if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; l.label.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; l.label.style.opacity = '1'; l.hp.style.width = `${r.hp / DY_HP * 100}%`; l.hp.style.background = '#e0603a'; }
  }
  for (const [id, l] of raiderLabels) if (!seen.has(id)) { l.label.remove(); raiderLabels.delete(id); world.hideRaider(id); }
  void dt;
}
function presentHobbits(dt: number): void {
  camera.updateMatrixWorld();
  for (let i = 0; i < HOBBITS.length; i++) {
    const s = village.hobbits[i], v = shown[i], f = world.figures[i], h = HOBBITS[i];
    // The model moves in ticks; the shown figure walks toward its place at the hobbit's own pace (a touch faster, so the lag never grows), so a tick's step is a stride, not a sprint and a wait. Only a hitch catches up quickly.
    const dx = s.x - v.x, dz = s.z - v.z, d = Math.hypot(dx, dz), step = d < 0.03 ? d : Math.min(d, (d > 2.5 ? h.pace * 2.5 : h.pace * 1.08) * speed * dt);
    if (d > 1e-4) { v.x += dx / d * step; v.z += dz / d * step; }
    const moving = step / Math.max(1e-6, dt); v.speed += (moving - v.speed) * Math.min(1, dt * 10);
    const targetHeading = d > 0.05 ? Math.atan2(dz, dx) : s.heading; v.heading += wrap(targetHeading - v.heading) * Math.min(1, dt * 8);
    f.group.visible = !s.inside; f.group.position.set(v.x, relief(v.x, v.z), v.z);
    // The rig faces -Z at yaw 0 and the model's heading is an angle in x,z: forward (-sin yaw, -cos yaw) = (cos h, sin h) gives yaw = -pi/2 - h.
    f.group.rotation.y = -Math.PI / 2 - v.heading;
    // A hobbit is shorter: its stride is scaled, so the gait is fed the speed it would be at Hulda's size.
    f.update(dt, v.speed * (MODEL_HEIGHT / HOBBIT_HEIGHT), f.group.rotation.y, true, 0);
    // Name and thought bubble over the head, while near and in front of the camera.
    tmp.set(v.x, relief(v.x, v.z) + HOBBIT_HEIGHT + 0.12, v.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera);
    const show = !s.inside && tmp.z < 1 && dist < 16 && Math.abs(tmp.x) < 1.1;
    const text = thought(s, village.tick);
    v.label.hidden = !show; v.bubble.hidden = !show || !text;
    if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; v.label.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; v.label.style.opacity = String(Math.min(1, (16 - dist) / 5)); v.bubble.style.transform = `translate(${x}px,${y - 26}px) translate(-50%,-100%)`; v.bubble.textContent = text; v.hunger.style.width = `${Math.round(s.hunger * 100)}%`; v.hunger.style.background = s.hunger > 0.85 ? '#e0603a' : s.hunger > 0.6 ? '#e0b040' : '#8fc45a'; }
  }
}
function frame(now: number) {
  // Two clocks: the animation step is capped (a hitch must not throw her), but the village's ticks come from the real seconds that passed while the page was watched, however slow the frames (only a stall of over WALL_CAP s is dropped).
  requestAnimationFrame(frame); const wall = Math.min(WALL_CAP, Math.max(0, (now - last) / 1000)), dt = Math.min(0.05, wall); last = now; if (document.hidden || intro.open) return; time += dt * 1000; simSeconds += dt;
  // The village lives only while watched: whole ticks from the real seconds that passed, none while hidden.
  tickBank += wall * TICKS_PER_SECOND * speed; const ticks = Math.floor(tickBank); if (ticks > 0) { advance(village, ticks); tickBank -= ticks; }
  player.update(now, mode === 'ground' ? world.colliders : [], undefined);
  const g = player.gesture, stickHeld = g.held && Math.hypot(g.x, g.y) >= 0.25;
  let wantUnder = 0;
  if (mode === 'ground') { player.applyCamera(camera); pressInto(dt); }
  else if (mode === 'trunk' && trunk) {
    const t = trunk, top = crownHeight(t.tree), y = stickY();
    if (Math.abs(y) > 0.25) t.h += -y * TRUNK_CLIMB * dt; t.h = Math.min(top, Math.max(0, t.h));
    if (t.h >= top - 1e-6 && y < -0.25) { crown = { tree: t.tree, az: t.az, armed: false }; mode = 'crown'; trunk = null; }
    else if (t.h <= 0 && y > 0.5) { t.downHeld += dt; if (t.downHeld > PRESS_S) enterGrass(world.trunkPoint(t.tree, 0, t.az)); }
    else t.downHeld = 0;
    if (mode === 'trunk') { const p = world.trunkPoint(t.tree, t.h, t.az); place(new THREE.Vector3(t.tree.x, relief(t.tree.x, t.tree.z) + t.h, t.tree.z)); orbitCamera(p, 3.6, 1.2); }
  } else if (mode === 'crown' && crown) {
    const c = crown, x = stickX(), y = stickY(); if (!stickHeld) c.armed = true;
    if (Math.abs(x) > 0.25) c.az += x * CROWN_SLIDE * dt;
    if (y > 0.5) { trunk = { tree: c.tree, h: crownHeight(c.tree) - 0.05, az: c.az, downHeld: 0 }; mode = 'trunk'; crown = null; }
    else if (y < -0.5 && c.armed) {
      const w = want(); let best: Tree | null = null, bestDot = 0.72;
      for (const o of hopTargets(c.tree)) { const d = new THREE.Vector3(o.x - c.tree.x, 0, o.z - c.tree.z).normalize().dot(w); if (d > bestDot) { bestDot = d; best = o; } }
      if (best) { const az = Math.atan2(c.tree.z - best.z, c.tree.x - best.x); hop = { from: world.crownPoint(c.tree, c.az), to: world.crownPoint(best, az), t: 0, tree: best, az }; mode = 'hop'; crown = null; }
    }
    if (mode === 'crown') { const p = world.crownPoint(c.tree, c.az); place(p); orbitCamera(p, 5.2, 2.1); }
  } else if (mode === 'hop' && hop) {
    hop.t = Math.min(1, hop.t + dt / HOP_S); const k = hop.t * hop.t * (3 - 2 * hop.t); const p = hop.from.clone().lerp(hop.to, k); p.y += Math.sin(hop.t * Math.PI) * 1.4;
    place(p); orbitCamera(p, 5.2, 2.1);
    if (hop.t === 1) { crown = { tree: hop.tree, az: hop.az, armed: true }; mode = 'crown'; hop = null; }
  } else if (mode === 'grass' && grass) {
    // Free under the grass, faster than running; onto a tree root when she runs along one.
    wantUnder = 1; const w = want(), gr = grass;
    if (w.lengthSq() > 0) {
      const ox = gr.x, oz = gr.z, nx = gr.x + w.x * GRASS_SPEED * dt, nz = gr.z + w.z * GRASS_SPEED * dt;
      if (grassCan(nx, nz)) { gr.x = nx; gr.z = nz; } else if (grassCan(nx, gr.z)) gr.x = nx; else if (grassCan(gr.x, nz)) gr.z = nz;
      gr.heading = Math.atan2(-w.x, -w.z);
      // A root she runs along takes her: checked along the whole step (a slow frame must not carry her over one), any root within reach that agrees with her run.
      const steps = Math.max(1, Math.ceil(Math.hypot(gr.x - ox, gr.z - oz) / ROOT_CATCH_STEP));
      for (let i = 1; i <= steps && mode === 'grass'; i++) { const k = i / steps, hit = alignedRoot({ x: ox + (gr.x - ox) * k, z: oz + (gr.z - oz) * k }, w, ROOT_CATCH, ROOT_CATCH_DOT); if (hit) { root = { root: hit.root, s: hit.s, forward: hit.forward, off: 0 }; grass = null; mode = 'root'; } }
    }
    const p = new THREE.Vector3(gr.x, relief(gr.x, gr.z), gr.z); place(p); orbitCamera(p, 3.2, 1.3);
  } else if (mode === 'root' && root) {
    // Held to the root's path, faster still; back reverses; sideways for a moment drops her into the grass; at a tree the aligned root, or a stop.
    wantUnder = 1; const r = root, w = want();
    if (w.lengthSq() > 0) {
      const tan = rootTangent(r.root, r.s); if (!r.forward) tan.negate(); const flat = new THREE.Vector3(tan.x, 0, tan.z).normalize(), dot = flat.dot(w);
      if (Math.abs(dot) < 0.35) { r.off += dt; if (r.off > 0.25) { const p = rootPoint(r.root, r.s); if (grassCan(p.x, p.z)) { grass = { x: p.x, z: p.z, heading: player.yaw }; root = null; mode = 'grass'; } } }
      else { r.off = 0; if (dot < 0) r.forward = !r.forward; else {
        r.s += (r.forward ? 1 : -1) * ROOT_SPEED * dt;
        if (r.s >= r.root.length || r.s <= 0) { const atEnd = r.s >= r.root.length; r.s = Math.min(r.root.length, Math.max(0, r.s)); const next = nextRoot(endTree(r.root, atEnd), w, r.root); if (next) { r.root = next.root; r.forward = next.forward; r.s = next.forward ? 0 : next.root.length; } }
      } }
    } else r.off = 0;
    if (mode === 'root') { const p = rootPoint(r.root, r.s); place(p); const t = rootTangent(r.root, r.s); if (!r.forward) t.negate(); const heading = Math.atan2(-t.x, -t.z); player.yaw += Math.atan2(Math.sin(heading - player.yaw), Math.cos(heading - player.yaw)) * Math.min(1, dt * 2.5); orbitCamera(p, 3.2, 1.3); }
  } else if ((mode === 'sink' || mode === 'rise') && move) {
    move.t = Math.min(1, move.t + dt / move.seconds); const k = move.t * move.t * (3 - 2 * move.t); const p = move.from.clone().lerp(move.to, k);
    wantUnder = mode === 'sink' ? k : 1 - k; place(p); orbitCamera(p, 3.2, 1.3);
    if (move.t === 1) { const then = move.then; move = null; then(); }
  }
  under += (wantUnder - under) * Math.min(1, dt * 4);
  fight(Math.min(0.25, wall) * speed, dt); stations(Math.min(0.25, wall)); presentHulda(dt); presentHobbits(dt); presentSpirits(dt); presentRaiders(dt);
  const light = daylightAt(village.tick), dusk = Math.max(0, 1 - Math.abs(light - 0.12) / 0.12);
  colour.copy(nightSky).lerp(daySky, Math.min(1, light * 1.6)).lerp(duskSky, dusk * 0.6); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.011);
  hemi.intensity = 0.5 + 1.9 * light; sun.intensity = 2.3 * light; world.updateLand(village); world.update(light, time, under);
  const c = clockOf(village.tick); el('clock').textContent = `Day ${c.day} · ${String(c.hour).padStart(2, '0')}:${String(c.minute).padStart(2, '0')}`;
  saveClock += dt; if (saveClock > 5) { saveClock = 0; save(); }
  renderer.render(scene, camera);
}
player.applyCamera(camera); presentHulda(0); presentHobbits(0); world.updateLand(village); world.update(daylightAt(village.tick), 0); scene.background = daySky; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __village: { hulda, presentation, scene, camera, renderer, player, figures: world.figures, hobbits: HOBBITS, houses: HOUSES, trees: TREES, roots: TREE_ROOTS.length, get mode() { return mode; }, get simSeconds() { return simSeconds; }, get under() { return under; }, get grass() { return grass ? { ...grass } : null; }, get root() { return root ? { root: root.root.id, s: root.s, length: root.root.length, forward: root.forward } : null; }, get trunk() { return trunk ? { tree: trunk.tree.id, h: trunk.h } : null; }, get crown() { return crown ? { tree: crown.tree.id, az: crown.az, armed: crown.armed } : null; }, get transitioning() { return mode === 'hop' || mode === 'sink' || mode === 'rise'; }, sinkAt: (x: number, z: number) => { standOn(x, z); enterGrass(new THREE.Vector3(x, relief(x, z), z)); }, standAt: (x: number, z: number, yaw: number) => standOn(x, z, yaw), thoughts: () => village.hobbits.map(s => thought(s, village.tick)), facing: () => world.figures.map((f, i) => { const s = village.hobbits[i], fwd = { x: -Math.sin(f.group.rotation.y), z: -Math.cos(f.group.rotation.y) }; return { moving: s.speed > 0 && s.path.length > 0, dot: s.path.length ? (fwd.x * (s.path[0].x - s.x) + fwd.z * (s.path[0].z - s.z)) / (Math.hypot(s.path[0].x - s.x, s.path[0].z - s.z) || 1) : 0 }; }), inWater, get village() { return JSON.parse(serializeVillage(village)); }, get tick() { return village.tick; }, get phase() { return phaseAt(village.tick); }, get clock() { return clockOf(village.tick); }, dayTicks: DAY_TICKS, count: (where: 'inside' | 'green' | 'out') => everyone(village, where), advance: (n: number) => { advance(village, n); for (let i = 0; i < HOBBITS.length; i++) { const s = village.hobbits[i]; shown[i].x = s.x; shown[i].z = s.z; shown[i].heading = s.heading; } save(); }, hobbit: (id: string) => ({ ...village.hobbits.find(s => s.id === id)!, keeps: hobbitById(id).keeps }), get stores() { return { ...village.stores }; }, get land() { return JSON.parse(JSON.stringify(village.land)); }, get fireWood() { return village.fireWood; }, get take() { return { ...village.lastTake }; }, get balance() { return balance(village); }, storeSpots: STORES, carrying: () => village.hobbits.map(s => s.carry), hungers: () => village.hobbits.map(s => s.hunger), armfuls: () => world.armfuls(), raiders: () => village.raiders.map(r => ({ ...r })), get hero() { return { ...village.hero }; }, set vigor(x: number) { village.hero.vigor = x; }, attack, cooldowns: cooldown, get slain() { return village.slain; }, get eaten() { return village.eaten; }, stations: STATIONS, sites: SITES, setStore: (k: Store, n: number) => { village.stores[k] = n; }, get prayer() { return village.prayer; }, set prayer(x: number) { village.prayer = x; }, get stack() { return village.stack ? { ...village.stack } : null; }, get spirits() { return village.spirits.map(s => ({ ...s })); }, summon: (k: SiteKind) => summonSpirit(village, k), spiritCost: () => spiritCost(village), praying: () => village.hobbits.filter(s => s.activity === 'praying').map(s => s.id), setTick, jumpTo, get speed() { return speed; }, set speed(x: number) { speed = x; }, reset: () => { village = freshVillage(village.seed); for (let i = 0; i < HOBBITS.length; i++) { const s = village.hobbits[i]; shown[i].x = s.x; shown[i].z = s.z; shown[i].heading = s.heading; } save(); }, get shown() { return shown.map(s => ({ x: s.x, z: s.z, speed: s.speed, label: !s.label.hidden, bubble: !s.bubble.hidden })); }, get character() { const g = hulda.gait; return { status: clipStatus, error: clipError, clips: clipUrls, bones: hulda.bones.size, body: 'hulda', roles: g?.roles ?? null, weights: g ? Object.fromEntries(Object.entries(g.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null, hobbitWeights: world.figures.map(f => f.gait ? Object.fromEntries(Object.entries(f.gait.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null) }; } } });
