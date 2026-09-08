import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { RustMonster, BODY_HEIGHT, TICKLE_S, SCRAPE_S, GROOM_S, type MonsterStudyFrame } from '../src/rustmonster';
import { SquareSurfaceRoute, HeadingTrail, frameQuaternion } from '../src/creatureMotion';
import { Arena } from '../src/arena';
import { OreVein } from '../src/orevein';
import { STUDY_BAYS, ANNEX, STUDY_WIDTH, STUDY_DEPTH, STUDY_CENTRE_Z } from '../src/labLayout';
import { GROUND_Y } from '../src/cave';

const far = new THREE.Vector3(100, 4, 100);
const monster = () => new RustMonster(0, new THREE.Vector3(), [], () => true, 123);
const frame = (heading = 0, speed = 0): MonsterStudyFrame => ({ mode: speed > 0 ? 'skitter' : 'freeze', surface: 'floor', position: new THREE.Vector3(0, BODY_HEIGHT, 0), heading, speed });
const named = (m: RustMonster, name: string) => { const node = m.group.getObjectByName(name); assert.ok(node, name); return node!; };
const position = (o: THREE.Object3D) => o.getWorldPosition(new THREE.Vector3());
const forward = (o: THREE.Object3D) => new THREE.Vector3(0, 0, -1).applyQuaternion(o.getWorldQuaternion(new THREE.Quaternion()));
const near = (a: number, b: number, tolerance = 1e-5) => assert.ok(Math.abs(a - b) < tolerance, `${a} != ${b}`);

test('all hips are thorax children; hind anchors are forward of the abdominal chain', () => {
  const m = monster(), thorax = named(m, 'thorax-joint');
  for (const side of [-1, 1]) {
    for (const kind of ['arm', 'mid', 'hind']) assert.equal(named(m, `${kind}-hip-${side}`).parent, thorax);
    const hip = named(m, `hind-hip-${side}`);
    near(hip.position.z, 0.14);
    const before = position(hip);
    named(m, 'abdomen-joint-0').rotation.y = 1;
    near(position(hip).distanceTo(before), 0);
  }
});

test('middle and hind stance strokes move backward relative to the body on both sides', () => {
  const m = monster();
  m.updateStudy(1, frame(0, 1), far);
  const previous = new Map<string, THREE.Vector3>();
  const counts: Record<string, number> = {};
  const dt = 1 / 240;
  for (let i = 1; i < 350; i++) {
    m.updateStudy(1 + i * dt * 1000, frame(0, 1), far);
    for (const kind of ['mid', 'hind']) for (const side of [-1, 1]) {
      const key = `${kind}-${side}`;
      const phase = (kind === 'mid' ? side > 0 : side < 0) ? 0 : Math.PI;
      const ph = -i * dt * (kind === 'hind' ? 6 : 9) + phase;
      // Interior of stance only: no lift/recovery boundary contamination.
      const foot = named(m, `${kind}-foot-${side}`);
      const current = named(m, 'thorax-joint').worldToLocal(position(foot));
      const old = previous.get(key);
      if (old && Math.sin(ph) < -0.2 && Math.sin(ph + dt * (kind === 'hind' ? 6 : 9)) < -0.2) {
        assert.ok(current.z > old.z, `backward stance failed: ${key}`);
        counts[key] = (counts[key] ?? 0) + 1;
      }
      previous.set(key, current);
    }
  }
  for (const count of Object.values(counts)) assert.ok(count > 50);
  assert.equal(Object.keys(counts).length, 4);
});

test('surface route is continuous, forward-facing, and inward-facing at every corner and loop seam', () => {
  const route = new SquareSurfaceRoute();
  for (let s = 0; s <= route.length; s += 0.019) {
    const f = route.sample(s), next = route.sample(s + 1e-5);
    const velocity = next.position.clone().sub(f.position).normalize();
    assert.ok(velocity.dot(f.forward) > 0.9999);
    near(f.forward.dot(f.up), 0);
    near(new THREE.Vector3(0, 0, -1).applyQuaternion(frameQuaternion(f)).dot(f.forward), 1);
    assert.ok(f.position.x >= -route.width / 2 + route.clearance - 1e-6);
    assert.ok(f.position.y >= route.clearance - 1e-6 && f.position.y <= route.height - route.clearance + 1e-6);
  }
  near(route.sample(0).position.distanceTo(route.sample(route.length).position), 0);
  assert.ok(route.sample(route.length - 1e-6).position.distanceTo(route.sample(0).position) < 2e-6);
});

test('head takes the first corner before thorax; abdomen stays on the floor until it reaches the corner', () => {
  const route = new SquareSurfaceRoute(), m = monster();
  const firstCorner = route.width - 2 * (route.clearance + route.radius);
  const s = firstCorner - 0.48;
  const f = route.sample(s);
  m.updateStudy(1, { ...frame(), surface: 'corner', route: { path: route, distance: s }, position: f.position, forward: f.forward, up: f.up }, far);
  assert.ok(forward(named(m, 'head-joint')).y > 0.2);
  assert.ok(Math.abs(forward(named(m, 'thorax-joint')).y) < 1e-6);
  assert.ok(Math.abs(forward(named(m, 'abdomen-joint-5')).y) < 1e-6);
});

test('surface articulation preserves rigid link lengths, including ceiling, descent and nested bays', () => {
  const m = monster(), route = new SquareSurfaceRoute();
  const parent = new THREE.Group(); parent.position.set(25, 1.4, 0.75); parent.rotation.y = 0.37; parent.add(m.group);
  for (let i = 0; i < 160; i++) {
    const s = i / 160 * route.length, f = route.sample(s);
    m.updateStudy(i * 16 + 1, { ...frame(), surface: 'corner', position: f.position, forward: f.forward, up: f.up, route: { path: route, distance: s } }, far);
    const thorax = named(m, 'thorax-joint');
    near(position(named(m, 'head-joint')).distanceTo(position(thorax)), 0.4, 2e-5);
    let prev = thorax;
    for (let n = 0; n < 6; n++) {
      const part = named(m, `abdomen-joint-${n}`);
      near(position(part).distanceTo(position(prev)), n === 0 ? 0.34 : 0.17, 2e-5);
      prev = part;
    }
  }
});

test('turn targets are bounded, frame-rate independent, and relax instead of accumulating offsets', () => {
  const run = (hz: number) => {
    const m = monster();
    m.updateStudy(1, frame(), far);
    for (let i = 1; i <= hz * 12; i++) {
      const t = i / hz, heading = t < 6 ? 1.1 * Math.sin(t * 1.5) : 1.1 * Math.sin(9);
      m.updateStudy(1 + t * 1000, frame(heading), far);
      assert.ok(Math.abs(named(m, 'head-joint').rotation.y) <= 0.90001);
      assert.ok(Math.abs(named(m, 'thorax-joint').rotation.y) <= 0.30001);
      near(named(m, 'body-root').rotation.y, 0);
      for (let j = 0; j < 6; j++) assert.ok(Math.abs(named(m, `abdomen-joint-${j}`).rotation.y) < 0.68);
    }
    assert.ok(Math.abs(named(m, 'thorax-joint').rotation.y) < 0.002);
    for (let j = 0; j < 6; j++) assert.ok(Math.abs(named(m, `abdomen-joint-${j}`).rotation.y) < 0.01);
    return named(m, 'head-joint').rotation.y;
  };
  near(run(30), run(120), 0.005);
});

test('heading history retains turns across -pi/pi and gives progressively older trailing headings', () => {
  const trail = new HeadingTrail();
  for (let i = 0; i <= 100; i++) trail.record(i / 60, i / 60, 3 + i / 100);
  assert.ok(trail.behind(0.2, 0, true) > trail.behind(0.5, 0, true));
  near(trail.behind(0, 0, true), 4);
});

test('studies are outside the original chamber; spawn and continuous connecting aisle are walkable', () => {
  const arena = new Arena(new THREE.Scene(), 1);
  for (const bay of STUDY_BAYS) assert.ok(bay.x - STUDY_WIDTH / 2 > 9);
  assert.ok(STUDY_DEPTH >= 7);
  for (let x = 0; x < 56; x += 0.1) assert.ok(arena.isWalkable(new THREE.Vector3(x, GROUND_Y, 7.2)), `blocked corridor at x=${x}`);
  for (const bay of STUDY_BAYS) {
    assert.equal(arena.isWalkable(new THREE.Vector3(bay.x, GROUND_Y, STUDY_CENTRE_Z)), false);
    assert.ok(arena.cameraClear(new THREE.Vector3(bay.x, GROUND_Y + 3.2, 7.2)));
  }
  assert.equal(arena.isWalkable(new THREE.Vector3(0, GROUND_Y, 0)), false);
  assert.equal(arena.cameraClear(new THREE.Vector3(ANNEX.x1 + 1, GROUND_Y + 3.2, 7.2)), true);
  assert.equal(arena.cameraClear(new THREE.Vector3(STUDY_BAYS[0].x + STUDY_WIDTH / 2, GROUND_Y + 3.2, -1)), false);
});

test('live AI still completes feeding, grooming, and a head-first return to the floor', () => {
  const vein = new OreVein(new THREE.Vector3(0, 3.1, -9), new THREE.Vector3(0, 0, 1), 3);
  const m = new RustMonster(0, new THREE.Vector3(1, 0, -5.5), [vein], p => Math.abs(p.x) < 8.4 && p.z > -8.4 && p.z < 3.9, 2);
  const modes = new Set<string>();
  let cameDown = false, returned = false;
  for (let i = 1; i <= 7000; i++) {
    m.update(i * 50, far);
    modes.add(m.mode);
    if (m.mode === 'dismount') cameDown = true;
    if (cameDown && m.surface === 'floor') { returned = true; break; }
    assert.ok(Number.isFinite(m.group.position.x + m.group.position.y + m.group.position.z));
  }
  for (const mode of ['mount', 'wallmove', 'tickle', 'scrape', 'groom', 'dismount']) assert.ok(modes.has(mode), `missing live mode ${mode}`);
  assert.ok(returned, 'live creature did not return to floor');
});

test('explicit feeding studies rust, scrape, groom, and reset through the shared renderer', () => {
  const m = monster();
  const vein = new OreVein(new THREE.Vector3(0, 3, -2), new THREE.Vector3(0, 0, 1), 1);
  let now = 1;
  const play = (mode: MonsterStudyFrame['mode'], duration: number, side: 0 | 1 = 0) => {
    const n = Math.ceil(duration * 60);
    for (let i = 0; i <= n; i++) {
      m.updateStudy(now, { ...frame(), mode, surface: 'wall', position: new THREE.Vector3(0, 2, -1.64), forward: new THREE.Vector3(0, 1, 0), up: new THREE.Vector3(0, 0, 1), vein, progress: i / n, groomSide: side }, far);
      now += 1000 / 60;
    }
  };
  play('tickle', TICKLE_S); near(vein.rust, 1, 0.005);
  play('scrape', SCRAPE_S); near(vein.rust, 0, 0.005);
  play('groom', GROOM_S, 0); play('groom', GROOM_S, 1);
  m.resetStudy(); near(vein.rust, 0);
});
