// The karst as a feature of the land (M1a.3): the free-flow study's pillar, its sisters, its forest floor,
// ledges, cavern and roots, built at KARST_AT inside the village's world, with the free flow's modes
// (trunk, crown, leap, sink, mouth, ride, rise) owned here. The entry hands her over whenever she is
// inside the karst's region: its zone worlds become her ground, its trees take her in, and its roots
// carry her. The karst's own progress (visited, summits, trail) keeps its own save.
import * as THREE from 'three';
import { buildKarstFlow } from './karstFlowWorld';
import { NODES, ZONES, CAVERN, stepRide, ridePoint, otherEnd, vec, makeZoneWorld, groundAt, inZone, nearestNode, chooseRoot, rootsAt, tread, parseProgress, serializeProgress, freshProgress, arrive, insideRock, trunkPoint, crownPoint, hopTargets, standNear, pillarById, PRESS_S, PRESS_RANGE, ENTER_RANGE, ARM_S, SETTLE_S, TRUNK_CLIMB, CROWN_SLIDE, HOP_S, FOREST_RADIUS as KARST_FLOOR, type Root, type Node, type Zone, type Screen } from './karstFlowModel';
import type { Player, Collider } from './player';
import type { TraversalWorld } from './mobility';
import type { HuldaForm } from './huldaPresentation';

export type KarstMode = 'ground' | 'trunk' | 'crown' | 'hop' | 'sink' | 'mouth' | 'ride' | 'rise';
export interface KarstVisual { form: HuldaForm; position: THREE.Vector3; rotation: THREE.Quaternion; present: HuldaForm | 'ride' }
export interface KarstAtmosphere { colour: THREE.Color; fog: number; lantern: number; inCavern: boolean; vision: number }
const KEY = 'rootwake-karst-flow-v2';
export function createKarstFeature(scene: THREE.Scene, player: Player, camera: THREE.PerspectiveCamera, origin: { x: number; z: number }, hooks: { orbit: (target: THREE.Vector3, back?: number, up?: number) => void; want: () => THREE.Vector3; ground: () => TraversalWorld; locked: TraversalWorld }) {
  const offset = new THREE.Vector3(origin.x, 0, origin.z), group = new THREE.Group(); group.position.copy(offset); scene.add(group);
  const world = buildKarstFlow(group as unknown as THREE.Scene);
  const W = (p: THREE.Vector3): THREE.Vector3 => p.clone().add(offset), L = (p: THREE.Vector3): THREE.Vector3 => p.clone().sub(offset);
  const zoneWorlds = Object.fromEntries(Object.values(ZONES).map(z => { const zw = makeZoneWorld(z); return [z.id, { surfacesAt: (x: number, z2: number) => zw.surfacesAt(x - origin.x, z2 - origin.z), canOccupy: (p: THREE.Vector3, r: number, h: number) => zw.canOccupy(L(p), r, h) } as TraversalWorld]; })) as Record<string, TraversalWorld>;
  const colliders: Collider[] = world.colliders.map(c => ('x1' in c ? { ...c, x1: c.x1 + origin.x, z1: c.z1 + origin.z, x2: c.x2 + origin.x, z2: c.z2 + origin.z } : { ...c, x: c.x + origin.x, z: c.z + origin.z }));
  let progress = freshProgress(); try { progress = parseProgress(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
  function save(): void { try { localStorage.setItem(KEY, serializeProgress(progress)); } catch { /* Play remains available. */ } }
  let mode: KarstMode = 'ground', zone: Zone = ZONES.floor, at: Node = NODES[progress.at], vision = 0;
  let trunk: { h: number; az: number; downHeld: number } | null = null, crown: { az: number; armed: boolean } | null = null;
  let hop: { from: THREE.Vector3; to: THREE.Vector3; t: number; node: Node; az: number } | null = null, ride: { root: Root; from: string; s: number; speed: number } | null = null;
  let move: { from: THREE.Vector3; to: THREE.Vector3; t: number; seconds: number; then: () => void } | null = null;
  let choice: { root: Root; held: number } | null = null, lastRoot: Root | null = null, settle = 0, released = true, press = 0, trailDirty = false, trailClock = 0;
  const rideTangent = new THREE.Vector3(0, 0, -1), lantern = new THREE.PointLight('#e8d9a8', 0, 7, 1.5); camera.add(lantern);
  const skyColour = new THREE.Color('#aab8b3'), cavernColour = new THREE.Color('#061312'), rootColour = new THREE.Color('#2a1d0c'), colour = new THREE.Color();
  const screen: Screen = p => { const v = W(p).applyMatrix4(camera.matrixWorldInverse); if (v.z > -0.05) return null; v.applyMatrix4(camera.projectionMatrix); return { x: v.x * innerWidth / 2, y: v.y * innerHeight / 2 }; };
  const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
  const local = (x: number, z: number): { x: number; z: number } => ({ x: x - origin.x, z: z - origin.z });
  /** Inside the karst's region (its forest floor and everything above it). */
  const inside = (x: number, z: number): boolean => { const l = local(x, z); return Math.hypot(l.x, l.z) <= KARST_FLOOR + 4; };
  /** Whether the karst is her ground here: on its floor, or up on one of its zones. */
  const owns = (x: number, z: number): boolean => zone.id !== 'floor' || (() => { const l = local(x, z); return inZone(ZONES.floor, l.x, l.z); })();
  const traversal = (): TraversalWorld => zoneWorlds[zone.id];
  function mouthYaw(n: Node): number { const p = pillarById(ZONES[n.zone].pillar), dx = n.mouth.x - p.x, dz = n.mouth.z - p.z, r = Math.hypot(dx, dz) || 1, k = n.zone === 'cavern' ? -1 : 1; return Math.atan2(k * dx / r, k * dz / r); }
  function turnToward(yaw: number, dt: number, rate: number): void { player.yaw += wrap(yaw - player.yaw) * Math.min(1, dt * rate); }
  function lock(): void { player.traversalWorld = hooks.locked; player.motor.velocity.set(0, 0, 0); player.avatar.visible = false; }
  function place(pLocal: THREE.Vector3): void { const p = W(pLocal); player.motor.feet.copy(p); player.position.x = p.x; player.position.z = p.z; }
  function standOn(zoneId: string, x: number, z: number, yaw = player.yaw): void {
    zone = ZONES[zoneId]; player.position.y = zone.y; player.traversalWorld = hooks.ground();
    const p = W(vec(x, groundAt(zone, x, z), z)); player.motor.reset(p); player.motor.feet.copy(p); player.position.x = p.x; player.position.z = p.z; player.yaw = yaw; player.canMove = true; mode = 'ground'; press = 0; trunk = null; crown = null; hop = null;
  }
  function visit(n: Node): void { at = n; zone = ZONES[n.zone]; if (!progress.visited.includes(n.id)) progress.visited.push(n.id); progress.at = n.id; }
  function enterTrunk(n: Node): void { if (mode !== 'ground') return; lock(); visit(n); save(); const f = L(player.feet()); trunk = { h: 0.2, az: Math.atan2(f.z - n.at.z, f.x - n.at.x), downHeld: 0 }; mode = 'trunk'; }
  function enterRoots(n: Node, fromLocal: THREE.Vector3): void { lock(); visit(n); save(); mode = 'sink'; lastRoot = null; released = false; trunk = null; move = { from: fromLocal.clone(), to: n.mouth.clone(), t: 0, seconds: 0.7, then: () => { mode = 'mouth'; settle = SETTLE_S; choice = null; } }; }
  /** Out: from a mouth she grows back onto the ground beside the tree; from a trunk or a crown she comes down to it. */
  function emerge(): boolean {
    if (mode !== 'mouth' && mode !== 'trunk' && mode !== 'crown') return false;
    const n = at, stand = standNear(n), z = ZONES[n.zone], from = mode === 'mouth' ? n.mouth.clone() : mode === 'trunk' && trunk ? trunkPoint(n, trunk.h, trunk.az) : crownPoint(n, crown?.az ?? 0);
    mode = 'rise'; choice = null; trunk = null; crown = null;
    move = { from, to: vec(stand.x, groundAt(z, stand.x, stand.z), stand.z), t: 0, seconds: 0.8, then: () => { standOn(n.zone, stand.x, stand.z, stand.yaw); player.pitch = 0.08; save(); } };
    return true;
  }
  /** A stick double tap on the ground near one of the karst's plants: straight into its roots. */
  function enterRootsNear(feet: THREE.Vector3): boolean { if (mode !== 'ground') return false; const f = L(feet), n = nearestNode(zone.id, f.x, f.z); if (n.distance < ENTER_RANGE) { enterRoots(n.node, f); return true; } return false; }
  function startRide(root: Root): void { ride = { root, from: at.id, s: 0, speed: 0 }; lastRoot = root; choice = null; mode = 'ride'; }
  function finishRide(): void { if (!ride) return; const n = NODES[otherEnd(ride.root, ride.from)]; at = n; zone = ZONES[n.zone]; arrive(progress, n.id); save(); ride = null; mode = 'mouth'; settle = SETTLE_S; released = false; choice = null; }
  /** On her feet inside the karst: pressing into a plant takes her in; walking leaves a trail. Returns true once she is no longer on the ground. */
  function groundFrame(dt: number): boolean {
    const w = hooks.want(), f = L(player.feet());
    if (player.motor.speed > 0.3) { tread(progress, zone.id, f.x, f.z, dt); trailDirty = true; }
    if (w.lengthSq() === 0 || player.motor.speed > 0.35) { press = 0; return false; }
    const n = nearestNode(zone.id, f.x, f.z), toward = vec(n.node.at.x - f.x, 0, n.node.at.z - f.z).normalize();
    if (n.distance < PRESS_RANGE && toward.dot(w) > 0.6) { press += dt; if (press > PRESS_S) { press = 0; if (n.node.climb) enterTrunk(n.node); else enterRoots(n.node, f); return true; } return false; }
    press = 0; return false;
  }
  /** The karst is drawn only while she is within KARST_DRAW_M of it: past that it is fog anyway, and its four hundred trees cost a phone frames. */
  const KARST_DRAW_M = 260;
  /** The modes above the ground, each frame. */
  function update(dt: number, time: number, stick: { held: boolean; x: number; y: number }): void {
    const stickHeld = stick.held; if (!stickHeld) released = true;
    { const f = player.feet(); group.visible = Math.hypot(f.x - origin.x, f.z - origin.z) < KARST_DRAW_M; }
    if (mode === 'trunk' && trunk) {
      const t = trunk, top = at.crownH, y = stick.y;
      if (Math.abs(y) > 0.25) t.h += -y * TRUNK_CLIMB * dt; t.h = Math.min(top, Math.max(0, t.h));
      if (t.h >= top - 1e-6 && y < -0.25) { crown = { az: t.az, armed: false }; mode = 'crown'; trunk = null; }
      else if (t.h <= 0 && y > 0.5) { t.downHeld += dt; if (t.downHeld > PRESS_S) enterRoots(at, trunkPoint(at, 0, t.az)); }
      else t.downHeld = 0;
      if (mode === 'trunk') { const p = trunkPoint(at, t.h, t.az); place(vec(at.at.x, at.at.y + t.h, at.at.z)); hooks.orbit(W(p), 3.6, 1.2); }
    } else if (mode === 'crown' && crown) {
      const c = crown, x = stick.x, y = stick.y; if (!stickHeld) c.armed = true;
      if (Math.abs(x) > 0.25) c.az += x * CROWN_SLIDE * dt;
      if (y > 0.5) { trunk = { h: at.crownH - 0.05, az: c.az, downHeld: 0 }; mode = 'trunk'; crown = null; }
      else if (y < -0.5 && c.armed) { const w = hooks.want(); let best: Node | null = null, bestDot = 0.72; for (const o of hopTargets(at)) { const d = vec(o.at.x - at.at.x, 0, o.at.z - at.at.z).normalize().dot(w); if (d > bestDot) { bestDot = d; best = o; } } if (best) { const az = Math.atan2(at.at.z - best.at.z, at.at.x - best.at.x); hop = { from: crownPoint(at, c.az), to: crownPoint(best, az), t: 0, node: best, az }; mode = 'hop'; crown = null; } }
      if (mode === 'crown') { const p = crownPoint(at, c.az); place(p); hooks.orbit(W(p), 5.2, 2.1); }
    } else if (mode === 'hop' && hop) {
      hop.t = Math.min(1, hop.t + dt / HOP_S); const k = hop.t * hop.t * (3 - 2 * hop.t); const p = hop.from.clone().lerp(hop.to, k); p.y += Math.sin(hop.t * Math.PI) * 1.4; place(p); hooks.orbit(W(p), 5.2, 2.1);
      if (hop.t === 1) { visit(hop.node); arrive(progress, hop.node.id); save(); crown = { az: hop.az, armed: true }; mode = 'crown'; hop = null; }
    } else if ((mode === 'sink' || mode === 'rise') && move) {
      move.t = Math.min(1, move.t + dt / move.seconds); const k = move.t * move.t * (3 - 2 * move.t); const p = move.from.clone().lerp(move.to, k);
      if (mode === 'sink') turnToward(mouthYaw(at), dt, 6); place(p); hooks.orbit(W(p), 3.2, 1.3);
      if (move.t === 1) { const then = move.then; move = null; then(); }
    } else if (mode === 'mouth') {
      if (settle > 0) turnToward(mouthYaw(at), dt, 5); place(at.mouth); hooks.orbit(W(at.mouth), 3.2, 1.3); camera.updateMatrixWorld(); settle = Math.max(0, settle - dt);
      const root = settle > 0 || !stickHeld ? null : chooseRoot(at.id, { x: stick.x, y: -stick.y }, screen, released || rootsAt(at.id).length === 1 ? null : lastRoot);
      if (!root) choice = null; else if (choice && choice.root === root) { choice.held += dt; if (choice.held >= ARM_S) startRide(root); } else choice = { root, held: 0 };
    } else if (mode === 'ride' && ride) {
      const step = stepRide(ride.root, ride.from, ride.s, ride.speed, dt); ride.s = step.s; ride.speed = step.speed; const { point, tangent } = ridePoint(ride.root, ride.from, ride.s); rideTangent.copy(tangent).normalize();
      const heading = Math.atan2(-tangent.x, -tangent.z); player.yaw += wrap(heading - player.yaw) * Math.min(1, dt * 3.5); place(point); hooks.orbit(W(point), 3.0, 1.2); if (step.done) finishRide();
    }
    const wantVision = mode === 'sink' || mode === 'mouth' || mode === 'ride' || mode === 'rise' ? 1 : 0; vision += (wantVision - vision) * Math.min(1, dt * 3);
    world.update(vision, time, ride?.root ?? null, choice?.root ?? null);
    trailClock += dt; if (trailDirty && trailClock > 0.5) { world.setTrail(progress); trailClock = 0; trailDirty = false; }
  }
  /** Where and what she is while the karst has her, in world coordinates; null on the ground. */
  function visual(): KarstVisual | null {
    if (mode === 'ground') return null; const rotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
    if (mode === 'trunk' && trunk) { rotation.setFromAxisAngle(up, Math.PI / 2 - trunk.az); return { form: 'burl', position: W(trunkPoint(at, trunk.h, trunk.az)), rotation, present: 'burl' }; }
    if (mode === 'crown' && crown) { rotation.setFromAxisAngle(up, player.yaw); return { form: 'leaf', position: W(crownPoint(at, crown.az)), rotation, present: 'leaf' }; }
    if (mode === 'hop') { rotation.setFromAxisAngle(up, player.yaw); return { form: 'leaf', position: player.feet().clone(), rotation, present: 'leaf' }; }
    if (mode === 'ride') { rotation.setFromUnitVectors(new THREE.Vector3(0, 0, -1), rideTangent); return { form: 'knot', position: player.feet().clone(), rotation, present: 'ride' }; }
    rotation.setFromAxisAngle(up, player.yaw); return { form: 'knot', position: player.feet().clone(), rotation, present: 'knot' };
  }
  /** The karst's air where she is: the cavern's dark, the roots' brown while she is in them; null when the karst has no say. */
  function atmosphere(): KarstAtmosphere | null {
    camera.updateMatrixWorld(); const inCavern = L(camera.position).distanceTo(CAVERN.centre) < CAVERN.radius + 0.5;
    if (!inCavern && vision < 0.01) { lantern.intensity = 0; return null; }
    colour.copy(inCavern ? cavernColour : skyColour); if (!inCavern) colour.lerp(rootColour, vision * 0.4); lantern.intensity = inCavern ? 1.2 : vision * 2.5;
    return { colour, fog: inCavern ? 0.05 : 0.009 + vision * 0.012, lantern: lantern.intensity, inCavern, vision };
  }
  player.cameraClear = p => !insideRock(L(p));
  world.setTrail(progress);
  return { world, colliders, inside, owns, traversal, groundFrame, update, visual, atmosphere, emerge, enterRootsNear, standOn, save, get mode() { return mode; }, get zone() { return zone.id; }, get at() { return at.id; }, get progress() { return progress; }, get vision() { return vision; }, origin, local, toWorld: W };
}
export type KarstFeature = ReturnType<typeof createKarstFeature>;
