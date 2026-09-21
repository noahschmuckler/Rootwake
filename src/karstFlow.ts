// The Karst, free flow: third person, one stick, no menus and no screen text. Every tree is a
// tree: press into its trunk and she goes in as a bark bulge that climbs to the crown, where she
// is a figure of leaves that slides round the canopy and leaps to neighbouring crowns; at the
// trunk's foot, pushing down sinks her as a knot of wood to the root mouth, where the stick, pushed
// the way a root visibly sets off, chooses it, and the root carries her like water to the next tree.
// A double tap of the stick grows her back onto the ground. The sisters' summits are reached by
// leaf (the helix of clinging trees) or by root (the long roots up their faces).
import './karstFlow.css';
import * as THREE from 'three';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE, type HuldaForm } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { buildKarstFlow } from './karstFlowWorld';
import { NODES, ZONES, CAVERN, PILLAR_HEIGHT, stepRide, ridePoint, otherEnd, vec, makeZoneWorld, groundAt, nearestNode, chooseRoot, screenDirections, rootsAt, tread, parseProgress, serializeProgress, freshProgress, arrive, insideRock, trunkPoint, crownPoint, hopTargets, standNear, pillarById, PRESS_S, PRESS_RANGE, ENTER_RANGE, ARM_S, SETTLE_S, TRUNK_CLIMB, CROWN_SLIDE, HOP_S, type Root, type Node, type Zone, type Screen } from './karstFlowModel';
import type { TraversalWorld } from './mobility';
const KEY = 'rootwake-karst-flow-v2';
let progress = freshProgress(); try { progress = parseProgress(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, serializeProgress(progress)); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 320); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#f2f6ea', '#5a6a60', 2.4); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.4); sun.position.set(-30, 60, 20); scene.add(sun);
const lantern = new THREE.PointLight('#e8d9a8', 0, 7, 1.5); camera.add(lantern);
const world = buildKarstFlow(scene);
const zoneWorlds = Object.fromEntries(Object.values(ZONES).map(z => [z.id, makeZoneWorld(z)])) as Record<string, TraversalWorld>;
/** While she is a bulge, a figure of leaves or a knot in a root, the shared motor stays put but the stick still speaks. */
const lockedWorld: TraversalWorld = { surfacesAt: () => [], canOccupy: () => false };
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third';
player.cameraClear = p => !insideRock(p);
const presentation = createHuldaPresentation(scene, world.figure, world.mass);
const hulda = presentation.hulda;
// Hulda wears the X Bot's skeleton: the Mixamo clips in public/models/clips drive her (public/models/README.md); until they
// load, and if they fail, her procedural gait poses the same bones. ?body=xbot shows the X Bot body with the same clips.
const query = new URLSearchParams(location.search), clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
let clipStatus: 'none' | 'loading' | 'ready' | 'failed' = clipUrls.length ? 'loading' : 'none', clipError = '';
if (query.get('body') === 'xbot') import('./huldaModel').then(({ loadHuldaModel }) => loadHuldaModel(base('models/xbot.fbx'), undefined, clipUrls.map(base))).then(m => { presentation.setModel(m); clipStatus = 'ready'; }, e => { clipStatus = 'failed'; clipError = String(e); console.warn('Hulda body', e); });
else if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => { presentation.setClips(clips); clipStatus = 'ready'; }, e => { clipStatus = 'failed'; clipError = String(e); console.warn('Hulda clips', e); });
for (const child of [...player.avatar.children]) player.avatar.remove(child);
installMobilityControls(player);
type Mode = 'ground' | 'trunk' | 'crown' | 'hop' | 'sink' | 'mouth' | 'ride' | 'rise';
let mode: Mode = 'ground', time = 0, last = performance.now(), vision = 0;
let zone: Zone = ZONES[NODES[progress.at].zone], at: Node = NODES[progress.at];
let trunk: { h: number; az: number; downHeld: number } | null = null;
let crown: { az: number } | null = null;
let hop: { from: THREE.Vector3; to: THREE.Vector3; t: number; node: Node; az: number } | null = null;
let ride: { root: Root; from: string; s: number; speed: number } | null = null;
let move: { from: THREE.Vector3; to: THREE.Vector3; t: number; seconds: number; then: () => void } | null = null;
let choice: { root: Root; held: number } | null = null, lastRoot: Root | null = null, settle = 0, released = true;
let press = 0, trailDirty = false, trailClock = 0, saveClock = 0, lastStickTap = -Infinity, lastGroundTap = -Infinity, stickDown = 0, stickDownAt = { x: 0, y: 0 };
const rideTangent = new THREE.Vector3(0, 0, -1);
/** The stick as a world direction, relative to where the camera looks. */
function want(): THREE.Vector3 {
  const g = player.gesture; if (!g.held || Math.hypot(g.x, g.y) < 0.25) return new THREE.Vector3();
  const yaw = player.yaw, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  return new THREE.Vector3(rx * g.x + fx * -g.y, 0, rz * g.x + fz * -g.y).normalize();
}
const stickY = (): number => (player.gesture.held ? player.gesture.y : 0), stickX = (): number => (player.gesture.held ? player.gesture.x : 0);
/** A world point on the screen, in pixels with y up; null behind the camera. */
const screen: Screen = p => { const v = p.clone().applyMatrix4(camera.matrixWorldInverse); if (v.z > -0.05) return null; v.applyMatrix4(camera.projectionMatrix); return { x: v.x * innerWidth / 2, y: v.y * innerHeight / 2 }; };
/** Her camera when she is not walking: over the shoulder of whatever she is now, orbited by the same drag. */
function orbitCamera(target: THREE.Vector3, back = 3.2, up = 1.3): void {
  const yaw = player.yaw, lift = up + player.pitch * 2.2;
  camera.position.set(target.x + Math.sin(yaw) * back, target.y + lift, target.z + Math.cos(yaw) * back); camera.lookAt(target.x, target.y + 0.4, target.z);
}
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
/** The camera at a mouth looks at the tree's foot from outside its pillar (from the pool side in the cavern), where every root's departure can be seen. */
function mouthYaw(n: Node): number { const p = pillarById(ZONES[n.zone].pillar), dx = n.mouth.x - p.x, dz = n.mouth.z - p.z, r = Math.hypot(dx, dz) || 1, k = n.zone === 'cavern' ? -1 : 1; return Math.atan2(k * dx / r, k * dz / r); }
function turnToward(yaw: number, dt: number, rate: number): void { player.yaw += wrap(yaw - player.yaw) * Math.min(1, dt * rate); }
function lock(): void { player.traversalWorld = lockedWorld; player.motor.velocity.set(0, 0, 0); player.avatar.visible = false; }
/** Move her while the shared motor is locked: feet and the legacy datum together, or the player reads a teleport and drops the stick. */
function place(p: THREE.Vector3): void { player.motor.feet.copy(p); player.position.x = p.x; player.position.z = p.z; }
function standOn(zoneId: string, x: number, z: number, yaw = player.yaw): void {
  zone = ZONES[zoneId]; player.position.y = zone.y; player.traversalWorld = zoneWorlds[zoneId];
  const p = vec(x, groundAt(zone, x, z), z); player.motor.reset(p); place(p); player.yaw = yaw; player.canMove = true; mode = 'ground'; press = 0; trunk = null; crown = null; hop = null;
}
function visit(n: Node): void { at = n; zone = ZONES[n.zone]; if (!progress.visited.includes(n.id)) progress.visited.push(n.id); progress.at = n.id; }
/** Into a trunk as the bark bulge, on the side she pressed from. */
function enterTrunk(n: Node): void { if (mode !== 'ground') return; lock(); visit(n); save(); trunk = { h: 0.2, az: Math.atan2(player.feet().z - n.at.z, player.feet().x - n.at.x), downHeld: 0 }; mode = 'trunk'; }
/** Down to the roots: from the trunk's foot, or straight from the ground (a fern has no trunk to enter). */
function enterRoots(n: Node, from: THREE.Vector3): void {
  lock(); visit(n); save(); mode = 'sink'; lastRoot = null; released = false; trunk = null;
  move = { from: from.clone(), to: n.mouth.clone(), t: 0, seconds: 0.7, then: () => { mode = 'mouth'; settle = SETTLE_S; choice = null; } };
}
/** Out: from a mouth she grows back onto the ground beside the tree; from a trunk or a crown she comes down to it. */
function emerge(): void {
  if (mode !== 'mouth' && mode !== 'trunk' && mode !== 'crown') return;
  const n = at, stand = standNear(n), z = ZONES[n.zone], from = mode === 'mouth' ? n.mouth.clone() : mode === 'trunk' && trunk ? trunkPoint(n, trunk.h, trunk.az) : crownPoint(n, crown?.az ?? 0);
  mode = 'rise'; choice = null; trunk = null; crown = null;
  move = { from, to: vec(stand.x, groundAt(z, stand.x, stand.z), stand.z), t: 0, seconds: 0.8, then: () => { standOn(n.zone, stand.x, stand.z, stand.yaw); player.pitch = 0.08; save(); } };
}
function startRide(root: Root): void { ride = { root, from: at.id, s: 0, speed: 0 }; lastRoot = root; choice = null; mode = 'ride'; }
function finishRide(): void {
  if (!ride) return; const n = NODES[otherEnd(ride.root, ride.from)]; at = n; zone = ZONES[n.zone]; arrive(progress, n.id); save(); ride = null; mode = 'mouth'; settle = SETTLE_S; released = false; choice = null;
}
function pressInto(dt: number): void {
  const w = want(), feet = player.feet(); if (w.lengthSq() === 0 || player.motor.speed > 0.35) { press = 0; return; }
  const n = nearestNode(zone.id, feet.x, feet.z), toward = vec(n.node.at.x - feet.x, 0, n.node.at.z - feet.z).normalize();
  if (n.distance < PRESS_RANGE && toward.dot(w) > 0.6) { press += dt; if (press > PRESS_S) { press = 0; if (n.node.climb) enterTrunk(n.node); else enterRoots(n.node, feet); } return; }
  press = 0;
}
// Double taps: on the stick, come out; on the ground near a tree, straight into its roots.
const walk = el('walk');
walk.addEventListener('pointerdown', e => { stickDown = performance.now(); stickDownAt = { x: e.clientX, y: e.clientY }; }, true);
walk.addEventListener('pointerup', e => { const now = performance.now(); if (now - stickDown < 230 && Math.hypot(e.clientX - stickDownAt.x, e.clientY - stickDownAt.y) < 10) { if (now - lastStickTap < 330) { lastStickTap = -Infinity; emerge(); } else lastStickTap = now; } }, true);
player.onTap = () => { const now = performance.now(); if (now - lastGroundTap < 350) { lastGroundTap = -Infinity; if (mode === 'ground') { const f = player.feet(), n = nearestNode(zone.id, f.x, f.z); if (n.distance < ENTER_RANGE) enterRoots(n.node, f); } } else lastGroundTap = now; };
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro'); el('help').onclick = () => { player.cancelInput(); intro.showModal(); }; el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); if (document.hidden) save(); });
window.addEventListener('pagehide', save); window.addEventListener('beforeunload', save);
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
const skyColour = new THREE.Color('#aab8b3'), cavernColour = new THREE.Color('#061312'), rootColour = new THREE.Color('#2a1d0c'), colour = new THREE.Color();
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), visualForward = new THREE.Vector3(0, 0, -1), visualUp = new THREE.Vector3(0, 1, 0);
function present(dt: number): void {
  let form: HuldaForm = 'human';
  visualPosition.copy(player.feet());
  let heading = player.yaw;
  if (mode === 'ground' && player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  visualRotation.setFromAxisAngle(visualUp, heading);
  if (mode === 'trunk' && trunk) { form = 'burl'; visualPosition.copy(trunkPoint(at, trunk.h, trunk.az)); visualRotation.setFromAxisAngle(visualUp, Math.PI / 2 - trunk.az); }
  else if (mode === 'crown' && crown) { form = 'leaf'; visualPosition.copy(crownPoint(at, crown.az)); }
  else if (mode === 'hop') form = 'leaf';
  else if (mode === 'ride') { form = 'knot'; visualRotation.setFromUnitVectors(visualForward, rideTangent); }
  else if (mode !== 'ground') form = 'knot';
  if (form === 'human' || form === 'leaf') visualPosition.y += HUMAN_CENTRE;
  const visible = mode !== 'ground' || player.view === 'third';
  presentation.update(dt, form, visualPosition, visualRotation, player.motor.speed, heading, mode === 'ground', visible, mode === 'ride' ? 'ride' : form);
  player.avatar.visible = false;
}
function frame(now: number) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; if (document.hidden || intro.open) return; time += dt * 1000;
  player.update(now, mode === 'ground' ? world.colliders : [], undefined);
  const g = player.gesture, stickHeld = g.held && Math.hypot(g.x, g.y) >= 0.25; if (!stickHeld) released = true;
  if (mode === 'ground') {
    player.applyCamera(camera); pressInto(dt);
    if (player.motor.speed > 0.3) { const f = player.feet(); tread(progress, zone.id, f.x, f.z, dt); trailDirty = true; }
  } else if (mode === 'trunk' && trunk) {
    const t = trunk, top = at.crownH, y = stickY();
    if (Math.abs(y) > 0.25) t.h += -y * TRUNK_CLIMB * dt; t.h = Math.min(top, Math.max(0, t.h));
    if (t.h >= top - 1e-6 && y < -0.25) { crown = { az: t.az }; mode = 'crown'; trunk = null; }
    else if (t.h <= 0 && y > 0.5) { t.downHeld += dt; if (t.downHeld > PRESS_S) enterRoots(at, trunkPoint(at, 0, t.az)); }
    else t.downHeld = 0;
    if (mode === 'trunk') { const p = trunkPoint(at, t.h, t.az); place(vec(at.at.x, at.at.y + t.h, at.at.z)); orbitCamera(p, 3.6, 1.2); }
  } else if (mode === 'crown' && crown) {
    const c = crown, x = stickX(), y = stickY();
    if (Math.abs(x) > 0.25) c.az += x * CROWN_SLIDE * dt;
    if (y > 0.5) { trunk = { h: at.crownH - 0.05, az: c.az, downHeld: 0 }; mode = 'trunk'; crown = null; }
    else if (y < -0.5) {
      const w = want(); let best: Node | null = null, bestDot = 0.72;
      for (const o of hopTargets(at)) { const d = vec(o.at.x - at.at.x, 0, o.at.z - at.at.z).normalize().dot(w); if (d > bestDot) { bestDot = d; best = o; } }
      if (best) { const az = Math.atan2(at.at.z - best.at.z, at.at.x - best.at.x); hop = { from: crownPoint(at, c.az), to: crownPoint(best, az), t: 0, node: best, az }; mode = 'hop'; crown = null; }
    }
    if (mode === 'crown') { const p = crownPoint(at, c.az); place(p); orbitCamera(p, 5.2, 2.1); }
  } else if (mode === 'hop' && hop) {
    hop.t = Math.min(1, hop.t + dt / HOP_S); const k = hop.t * hop.t * (3 - 2 * hop.t); const p = hop.from.clone().lerp(hop.to, k); p.y += Math.sin(hop.t * Math.PI) * 1.4;
    place(p); orbitCamera(p, 5.2, 2.1);
    if (hop.t === 1) { visit(hop.node); arrive(progress, hop.node.id); save(); crown = { az: hop.az }; mode = 'crown'; hop = null; }
  } else if ((mode === 'sink' || mode === 'rise') && move) {
    move.t = Math.min(1, move.t + dt / move.seconds); const k = move.t * move.t * (3 - 2 * move.t); const p = move.from.clone().lerp(move.to, k);
    if (mode === 'sink') turnToward(mouthYaw(at), dt, 6); place(p); orbitCamera(p, 3.2, 1.3);
    if (move.t === 1) { const then = move.then; move = null; then(); }
  } else if (mode === 'mouth') {
    if (settle > 0) turnToward(mouthYaw(at), dt, 5);
    place(at.mouth); orbitCamera(at.mouth, 3.2, 1.3); camera.updateMatrixWorld();
    settle = Math.max(0, settle - dt);
    const root = settle > 0 || !stickHeld ? null : chooseRoot(at.id, { x: g.x, y: -g.y }, screen, released || rootsAt(at.id).length === 1 ? null : lastRoot);
    if (!root) choice = null;
    else if (choice && choice.root === root) { choice.held += dt; if (choice.held >= ARM_S) startRide(root); }
    else choice = { root, held: 0 };
  } else if (mode === 'ride' && ride) {
    const step = stepRide(ride.root, ride.from, ride.s, ride.speed, dt); ride.s = step.s; ride.speed = step.speed;
    const { point, tangent } = ridePoint(ride.root, ride.from, ride.s); rideTangent.copy(tangent).normalize();
    // The camera follows the root's own heading, gently, and a drag still offsets it.
    const heading = Math.atan2(-tangent.x, -tangent.z); player.yaw += wrap(heading - player.yaw) * Math.min(1, dt * 3.5);
    place(point); orbitCamera(point, 3.0, 1.2);
    if (step.done) finishRide();
  }
  present(dt);
  const wantVision = mode === 'sink' || mode === 'mouth' || mode === 'ride' || mode === 'rise' ? 1 : 0; vision += (wantVision - vision) * Math.min(1, dt * 3);
  world.update(vision, time, ride?.root ?? null, choice?.root ?? null);
  camera.updateMatrixWorld();
  const inCavern = camera.position.distanceTo(CAVERN.centre) < CAVERN.radius + 0.5;
  colour.copy(inCavern ? cavernColour : skyColour); if (!inCavern) colour.lerp(rootColour, vision * 0.4);
  scene.background = colour; scene.fog = new THREE.FogExp2(colour, inCavern ? 0.05 : 0.009 + vision * 0.012);
  lantern.intensity = inCavern ? 1.2 : vision * 2.5; hemi.intensity = inCavern ? 0.6 : 2.4; sun.intensity = inCavern ? 0.2 : 2.4;
  trailClock += dt; if (trailDirty && trailClock > 0.5) { world.setTrail(progress); trailClock = 0; trailDirty = false; saveClock += 0.5; if (saveClock >= 3) { saveClock = 0; save(); } }
  renderer.render(scene, camera);
}
{ const stand = standNear(at); standOn(at.zone, stand.x, stand.z, stand.yaw); player.pitch = 0.08; }
world.setTrail(progress); player.applyCamera(camera); present(0); world.update(0, 0, null, null); scene.background = skyColour; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __karstFlow: { hulda, presentation, scene, camera, renderer, player, nodes: NODES, zones: ZONES, pillarHeight: PILLAR_HEIGHT, get character() { const g = presentation.model ?? hulda.gait; return { status: clipStatus, error: clipError, clips: clipUrls, bones: hulda.bones.size, body: presentation.model ? 'xbot' : 'hulda', roles: g?.roles ?? null, weights: g ? Object.fromEntries(Object.entries(g.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null }; }, get mode() { return mode; }, get at() { return at.id; }, get zone() { return zone.id; }, get vision() { return vision; }, get progress() { return JSON.parse(serializeProgress(progress)); }, get trunk() { return trunk ? { h: trunk.h, az: trunk.az } : null; }, get crown() { return crown ? { az: crown.az } : null; }, get ride() { return ride ? { root: ride.root.id, from: ride.from, s: ride.s, speed: ride.speed } : null; }, get choice() { return choice ? { root: choice.root.id, held: choice.held } : null; }, get transitioning() { return mode === 'sink' || mode === 'rise' || mode === 'ride' || mode === 'hop'; }, screenDirections: () => { camera.updateMatrixWorld(); return mode === 'mouth' ? screenDirections(at.id, screen) : []; }, standNear: (id: string) => standNear(NODES[id]), standAt: (id: string, facing = false) => { const n = NODES[id], s = standNear(n); standOn(n.zone, s.x, s.z, facing ? Math.atan2(-(n.at.x - s.x), -(n.at.z - s.z)) : s.yaw); at = n; zone = ZONES[n.zone]; player.pitch = 0.08; } } });
