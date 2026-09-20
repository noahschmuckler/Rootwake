// The Clearing: third person, one stick, no menus. Pressing into things is the verb; the next step
// is automatic. Trees are entered, climbed inside, left at the crown; the ground is sunk through
// into roots and left by a double tap; stone is climbed by its handholds or by the ivy she grows.
import './flow.css';
import * as THREE from 'three';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE, type HuldaForm } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { buildClearing } from './flowWorld';
import { TREES, WALL_Z, WALL_H, HANDHOLDS, crownHeight, trunkRadius, nearestTree, nearestRoot, nextRoot, rootPoint, rootTangent, endTree, hopTargets, wallSite, ivySiteX, groundAt, onGround, makeGroundWorld, tread, parseGrowth, serializeGrowth, freshGrowth, vec, type Tree, type RootEdge } from './flowModel';
import type { TraversalWorld } from './mobility';
const KEY = 'rootwake-clearing-v1';
let growth = freshGrowth(); try { growth = parseGrowth(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
function save() { try { localStorage.setItem(KEY, serializeGrowth(growth)); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 200); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; document.body.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight('#eef4e2', '#4d5f48', 2.3)); const sun = new THREE.DirectionalLight('#fff0c8', 2.3); sun.position.set(-20, 40, 15); scene.add(sun);
const lantern = new THREE.PointLight('#e8d9a8', 0, 7, 1.5); camera.add(lantern);
const world = buildClearing(scene);
const groundWorld = makeGroundWorld();
/** While she is a bulge, a figure of leaves or a root-rider, the shared motor must stay put but the stick must still speak. */
const lockedWorld: TraversalWorld = { surfacesAt: () => [], canOccupy: () => false };
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.traversalWorld = groundWorld; player.view = 'third';
// Flow-only visual replacement; keep the shared controller and its visibility parent.
const presentation = createHuldaPresentation(scene, world.figure, world.mass);
const hulda = presentation.hulda;
for (const child of [...player.avatar.children]) player.avatar.remove(child);
// player.avatar remains an empty camera/controller proxy. Presentation owns visible geometry.
player.teleport(0.5, 15, 0); player.pitch = 0.08; installMobilityControls(player);
type Mode = 'ground' | 'trunk' | 'crown' | 'hop' | 'root' | 'climb' | 'ivy' | 'sink' | 'rise';
let mode: Mode = 'ground', time = 0, last = performance.now();
let trunk: { tree: Tree; h: number; az: number; downHeld: number } | null = null;
let crown: { tree: Tree; az: number } | null = null;
let hop: { from: THREE.Vector3; to: THREE.Vector3; t: number; tree: Tree; az: number } | null = null;
let root: { root: RootEdge; s: number; forward: boolean; stopped: number } | null = null;
let climb: { x: number; y: number } | null = null;
let ivy: { site: number; k: number; grown: boolean; down: boolean } | null = null;
let move: { from: THREE.Vector3; to: THREE.Vector3; t: number; seconds: number; then: () => void } | null = null;
let press = 0, under = 0, trailDirty = false, trailClock = 0, saveClock = 0, lastStickTap = -Infinity, lastGroundTap = -Infinity, stickDown = 0, stickDownAt = { x: 0, y: 0 };
const focus = new THREE.Vector3(), seen = new Set<string>();
let hintUntil = 0;
const hintEl = el('hint');
function hint(text: string, key = text): void { if (seen.has(key)) return; seen.add(key); if (!text) return; hintEl.textContent = text; hintEl.hidden = false; hintUntil = time + 2400; }
/** The stick as a world direction, relative to where the camera looks. */
function want(): THREE.Vector3 {
  const g = player.gesture; if (!g.held || Math.hypot(g.x, g.y) < 0.25) return new THREE.Vector3();
  const yaw = player.yaw, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  return new THREE.Vector3(rx * g.x + fx * -g.y, 0, rz * g.x + fz * -g.y).normalize();
}
const stickY = (): number => (player.gesture.held ? player.gesture.y : 0), stickX = (): number => (player.gesture.held ? player.gesture.x : 0);
/** Her camera when she is not walking: over the shoulder of whatever she is now, orbited by the same drag. */
function orbitCamera(target: THREE.Vector3, back = 3.4, up = 1.5): void {
  focus.copy(target); const yaw = player.yaw, lift = up + player.pitch * 2.2;
  camera.position.set(target.x + Math.sin(yaw) * back, target.y + lift, target.z + Math.cos(yaw) * back); camera.lookAt(target.x, target.y + 0.5, target.z);
}
/** Take the shared motor off the ground without dropping the stick: she keeps pushing, and the next form answers. */
function lock(): void { player.traversalWorld = lockedWorld; player.motor.velocity.set(0, 0, 0); player.avatar.visible = false; }
/** Move her while the shared motor is locked: feet and the legacy datum together, or the player reads a teleport and drops the stick. */
function place(p: THREE.Vector3): void { player.motor.feet.copy(p); player.position.x = p.x; player.position.z = p.z; }
function standOn(x: number, z: number, yaw = player.yaw): void {
  // Never stand inside a trunk: nudge out of the nearest one if the landing is too close.
  const n = nearestTree(x, z); if (n.distance < 0.35) { const a = Math.atan2(z - n.tree.z, x - n.tree.x); x = n.tree.x + Math.cos(a) * (trunkRadius(n.tree) + 0.4); z = n.tree.z + Math.sin(a) * (trunkRadius(n.tree) + 0.4); }
  player.traversalWorld = groundWorld; player.motor.reset(vec(x, groundAt(x, z), z)); place(vec(x, groundAt(x, z), z)); player.yaw = yaw; player.canMove = true; mode = 'ground';
}
function enterTrunk(tree: Tree): void { lock(); trunk = { tree, h: 0.2, az: Math.atan2(Math.cos(player.yaw),Math.sin(player.yaw)), downHeld: 0 }; mode = 'trunk'; hint('Push up. At the ground, push down.', 'trunk'); }
function enterRoots(r: RootEdge, s: number, forward: boolean): void { root = { root: r, s, forward, stopped: 0 }; mode = 'root'; hint('Double tap the stick to come out.', 'root'); }
function emerge(): void {
  const p = mode === 'root' && root ? rootPoint(root.root, root.s) : mode === 'trunk' && trunk ? world.trunkPoint(trunk.tree, trunk.h, trunk.az) : mode === 'crown' && crown ? world.crownPoint(crown.tree, crown.az) : null;
  if (!p) return;
  const gx = p.x, gz = p.z, target = vec(gx, groundAt(gx, gz), gz);
  if (!onGround(gx, gz)) return;
  const from = p.clone(); mode = 'rise';
  move = { from, to: target, t: 0, seconds: 0.8, then: () => { standOn(gx, gz); } };
}
function sinkHere(): void {
  if (mode !== 'ground') return; const feet = player.feet(), n = nearestRoot(feet); if (n.distance > 5) return;
  lock(); mode = 'sink';
  move = { from: feet.clone(), to: rootPoint(n.root, n.s), t: 0, seconds: 0.7, then: () => enterRoots(n.root, n.s, true) };
}
function pressInto(dt: number): void {
  const w = want(), feet = player.feet(); if (w.lengthSq() === 0 || player.motor.speed > 0.35) { press = 0; return; }
  const n = nearestTree(feet.x, feet.z), toTree = vec(n.tree.x - feet.x, 0, n.tree.z - feet.z).normalize();
  const onLedge = feet.z < WALL_Z;
  if (n.distance < 0.6 && toTree.dot(w) > 0.6) { press += dt; if (press > 0.35) { press = 0; enterTrunk(n.tree); } return; }
  if (!onLedge && feet.z - WALL_Z < 1.05 && w.z < -0.6) { press += dt; if (press > 0.35) { press = 0; enterWall(feet.x, false); } return; }
  if (onLedge && WALL_Z - feet.z < 1.05 && w.z > 0.6) { press += dt; if (press > 0.35) { press = 0; enterWall(feet.x, true); } return; }
  press = 0;
}
function enterWall(x: number, down: boolean): void {
  const site = wallSite(x);
  if (site.kind === 'handholds') { lock(); climb = { x: Math.min(HANDHOLDS.x1 - 0.3, Math.max(HANDHOLDS.x0 + 0.3, x)), y: down ? WALL_H - 0.15 : 0.15 }; mode = 'climb'; player.avatar.visible = true; hint('Push up to climb.', 'climb'); return; }
  const grown = growth.ivy.includes(site.site);
  if (down && !grown) { hint('Nothing to climb here.', 'nodown'); return; }
  lock(); ivy = { site: site.site, k: down ? 1 : 0, grown, down }; mode = 'ivy'; world.growIvy(site.site, grown ? 1 : 0);
  hint(grown ? '' : 'No holds. She grows ivy; it stays.', grown ? 'ivyagain' : 'ivy');
}
// Double taps: on the stick, come out of tree or root; on the ground, go into the roots.
const walk = el('walk');
walk.addEventListener('pointerdown', e => { stickDown = performance.now(); stickDownAt = { x: e.clientX, y: e.clientY }; }, true);
walk.addEventListener('pointerup', e => { const now = performance.now(); if (now - stickDown < 230 && Math.hypot(e.clientX - stickDownAt.x, e.clientY - stickDownAt.y) < 10) { if (now - lastStickTap < 330) { lastStickTap = -Infinity; if (mode === 'trunk' || mode === 'crown' || mode === 'root') emerge(); } else lastStickTap = now; } }, true);
player.onTap = () => { const now = performance.now(); if (now - lastGroundTap < 350) { lastGroundTap = -Infinity; sinkHere(); } else lastGroundTap = now; };
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro'); el('help').onclick = () => { player.cancelInput(); intro.showModal(); }; el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); if (document.hidden) save(); });
window.addEventListener('pagehide', save); window.addEventListener('beforeunload', save);
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
const sky = new THREE.Color('#a9bcae'), soil = new THREE.Color('#102726'), colour = new THREE.Color();
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion();
const visualForward = new THREE.Vector3(0,0,-1), visualUp = new THREE.Vector3(0,1,0);
function present(dt: number): void {
  let form: HuldaForm = 'human';
  visualPosition.copy(player.feet());
  let heading = mode === 'climb' ? 0 : player.yaw;
  if (mode === 'ground' && player.motor.speed > .08) heading = Math.atan2(-player.motor.velocity.x,-player.motor.velocity.z);
  visualRotation.setFromAxisAngle(visualUp,heading);
  if (mode === 'trunk' && trunk) {
    form='burl'; visualPosition.copy(world.trunkPoint(trunk.tree,trunk.h,trunk.az));
    // Grain faces outward (+Z); the back of the burl lies inside the trunk.
    visualRotation.setFromAxisAngle(visualUp,Math.PI/2-trunk.az);
  } else if (mode === 'root' && root) {
    form='knot'; visualPosition.copy(rootPoint(root.root,root.s));
    const tangent=rootTangent(root.root,root.s); if(!root.forward) tangent.negate();
    visualRotation.setFromUnitVectors(visualForward,tangent.normalize());
  } else if (mode === 'sink') form='knot';
  else if (mode === 'crown' && crown) { form='leaf'; visualPosition.copy(world.crownPoint(crown.tree,crown.az)); }
  else if (mode === 'hop') form='leaf';
  else if (mode === 'ivy' && ivy) { form='ivy'; visualPosition.set(ivySiteX(ivy.site),ivy.k*WALL_H+.2,WALL_Z+.45); }
  if(form==='human' || form==='leaf' || form==='ivy') visualPosition.y+=HUMAN_CENTRE;
  const visible=mode!=='ground' || player.view==='third';
  presentation.update(dt,form,visualPosition,visualRotation,player.motor.speed,heading,mode==='ground',visible,mode);
  player.avatar.visible=false;
}
function frame(now: number) {
  requestAnimationFrame(frame); const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; if (document.hidden || intro.open) return; time += dt * 1000;
  player.update(now, [], undefined);
  let wantUnder = 0;
  if (mode === 'ground') {
    player.applyCamera(camera); pressInto(dt);
    if (player.motor.speed > 0.3) { const f = player.feet(); tread(growth, f.x, f.z, dt); trailDirty = true; }
  } else if (mode === 'trunk' && trunk) {
    const t = trunk, top = crownHeight(t.tree); t.az = Math.atan2(Math.cos(player.yaw), Math.sin(player.yaw));
    const y = stickY(); if (Math.abs(y) > 0.25) t.h += -y * 2.4 * dt; t.h = Math.min(top, Math.max(0, t.h));
    if (t.h >= top - 1e-6 && y < -0.25) { crown = { tree: t.tree, az: t.az }; mode = 'crown'; hint('Sideways slides. Toward a tree leaps.', 'crown'); }
    else if (t.h <= 0 && y > 0.5) { t.downHeld += dt; if (t.downHeld > 0.35) { const w = want(); const next = nextRoot(t.tree.id, w.lengthSq() ? w : vec(0, 0, 1)) ?? (nextRoot(t.tree.id, vec(1, 0, 0)) || nextRoot(t.tree.id, vec(-1, 0, 0)) || nextRoot(t.tree.id, vec(0, 0, -1))); if (next) { enterRoots(next.root, next.forward ? 0 : next.root.length, next.forward); } } }
    else t.downHeld = 0;
    if (mode === 'trunk') { const p = world.trunkPoint(t.tree, t.h, t.az); place(vec(t.tree.x, t.tree.y + t.h, t.tree.z)); orbitCamera(p, 3.6, 1.2); }
  } else if (mode === 'crown' && crown) {
    const c = crown, x = stickX(), y = stickY();
    if (Math.abs(x) > 0.25) c.az += x * 1.7 * dt;
    if (y > 0.5) { trunk = { tree: c.tree, h: crownHeight(c.tree) - 0.05, az: c.az, downHeld: 0 }; mode = 'trunk'; }
    else if (y < -0.5) {
      const w = want(); let best: Tree | null = null, bestDot = 0.72;
      for (const o of hopTargets(c.tree)) { const d = vec(o.x - c.tree.x, 0, o.z - c.tree.z).normalize().dot(w); if (d > bestDot) { bestDot = d; best = o; } }
      if (best) { const az = Math.atan2(c.tree.z - best.z, c.tree.x - best.x); hop = { from: world.crownPoint(c.tree, c.az), to: world.crownPoint(best, az), t: 0, tree: best, az }; mode = 'hop'; hint('', 'hop'); }
    }
    if (mode === 'crown') { const p = world.crownPoint(c.tree, c.az); place(p); orbitCamera(p, 5.2, 2.1); }
  } else if (mode === 'hop' && hop) {
    hop.t = Math.min(1, hop.t + dt / 0.9); const k = hop.t * hop.t * (3 - 2 * hop.t); const p = hop.from.clone().lerp(hop.to, k); p.y += Math.sin(hop.t * Math.PI) * 1.4;
    place(p); orbitCamera(p, 5.2, 2.1);
    if (hop.t === 1) { crown = { tree: hop.tree, az: hop.az }; mode = 'crown'; hop = null; }
  } else if (mode === 'root' && root) {
    wantUnder = 1; const r = root, w = want(), speed = 3.4;
    if (w.lengthSq() > 0) {
      const tan = rootTangent(r.root, r.s); if (!r.forward) tan.negate(); const flat = vec(tan.x, 0, tan.z).normalize(), dot = flat.dot(w);
      if (dot < -0.4) r.forward = !r.forward;
      else if (dot > -0.4) {
        r.s += (r.forward ? 1 : -1) * speed * dt;
        if (r.s >= r.root.length || r.s <= 0) {
          const atEnd = r.s >= r.root.length; r.s = Math.min(r.root.length, Math.max(0, r.s));
          const tree = endTree(r.root, atEnd);
          if (tree !== null) { const next = nextRoot(tree, w, r.root); if (next) { r.root = next.root; r.forward = next.forward; r.s = next.forward ? 0 : next.root.length; } }
          else hint('The root ends. Push back.', 'taper');
        }
      }
    }
    const p = rootPoint(r.root, r.s); place(p); orbitCamera(p, 3.2, 1.3);
  } else if ((mode === 'sink' || mode === 'rise') && move) {
    move.t = Math.min(1, move.t + dt / move.seconds); const k = move.t * move.t * (3 - 2 * move.t); const p = move.from.clone().lerp(move.to, k);
    wantUnder = mode === 'sink' ? k : 1 - k; place(p); orbitCamera(p, 3.2, 1.3);
    if (move.t === 1) { const then = move.then; move = null; then(); }
  } else if (mode === 'climb' && climb) {
    const c = climb, x = stickX(), y = stickY();
    if (Math.abs(x) > 0.25) c.x = Math.min(HANDHOLDS.x1 - 0.3, Math.max(HANDHOLDS.x0 + 0.3, c.x + x * 1.3 * dt));
    if (Math.abs(y) > 0.25) c.y += -y * 1.4 * dt;
    if (c.y >= WALL_H - 0.05) { standOn(c.x, WALL_Z - 0.9, Math.PI); climb = null; }
    else if (c.y <= 0.02) { standOn(c.x, WALL_Z + 0.95, 0); climb = null; }
    else { const p = vec(c.x, c.y, WALL_Z + 0.32); player.avatar.position.copy(p); player.avatar.rotation.y = 0; player.avatar.visible = true; place(p); orbitCamera(p, 3.2, 1.2); }
  } else if (mode === 'ivy' && ivy) {
    const v = ivy, rate = v.grown ? 1 / 1.3 : 1 / 3.2; v.k = v.down ? Math.max(0, v.k - dt / 1.3) : Math.min(1, v.k + dt * rate);
    if (!v.grown && !v.down) world.growIvy(v.site, v.k);
    const x = ivySiteX(v.site), p = vec(x, v.k * WALL_H + 0.2, WALL_Z + 0.45); place(p); orbitCamera(p, 3.4, 1.3);
    if (!v.down && v.k >= 1) { if (!v.grown) { growth.ivy.push(v.site); save(); } standOn(x, WALL_Z - 0.95, Math.PI); ivy = null; }
    else if (v.down && v.k <= 0) { standOn(x, WALL_Z + 0.95, 0); ivy = null; }
  }
  present(dt);
  under += (wantUnder - under) * Math.min(1, dt * 4);
  world.update(under); lantern.intensity = under * 7;
  colour.copy(sky).lerp(soil, under); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.012 + under * 0.03);
  trailClock += dt; if (trailDirty && trailClock > 0.5) { world.setTrail(growth); trailClock = 0; trailDirty = false; saveClock += 0.5; if (saveClock >= 3) { saveClock = 0; save(); } }
  if (mode === 'ground' && !seen.has('walk')) hint('Walk into a tree. Keep pushing.', 'walk');
  if (!hintEl.hidden && time > hintUntil) hintEl.hidden = true;
  renderer.render(scene, camera);
}
world.setTrail(growth); for (const site of growth.ivy) world.growIvy(site, 1);
player.applyCamera(camera); present(0); scene.background = sky; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __clearing: { hulda, presentation, scene, camera, renderer, player, trees: TREES, get mode() { return mode; }, get growth() { return JSON.parse(serializeGrowth(growth)); }, get trunk() { return trunk ? { tree: trunk.tree.id, h: trunk.h } : null; }, get crown() { return crown ? { tree: crown.tree.id, az: crown.az } : null; }, get root() { return root ? { root: root.root.id, s: root.s, forward: root.forward } : null; }, get climb() { return climb; }, get ivy() { return ivy ? { site: ivy.site, k: ivy.k, grown: ivy.grown } : null; }, get under() { return under; }, get transitioning() { return mode === 'hop' || mode === 'sink' || mode === 'rise'; } } });
