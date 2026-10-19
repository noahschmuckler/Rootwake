import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3, Scene } from 'three';
import { MovementGesture, TARGET_HOLD_MS, IGNITION_HOLD_MS } from '../src/movementGesture';
import { MobilityMotor, NORMAL_MOBILITY, POWERED_MOBILITY, BODY_RADIUS, BODY_HEIGHT, HOVER_GRACE_S, stickResponse, planDrift, planTraversal, supportAt, traversalPoint, validateTraversal, type TraversalWorld, type MotionInput } from '../src/mobility';
import { CourseGeometry, NORMAL_PADS, POWERED_PADS, COURSE_SPAWNS, FLIGHT_GATES, crossedGate } from '../src/mobilityCourseLayout';
import { Arena } from '../src/arena';
import { courseWorld } from '../src/parkourCourse';
import { CANON, PARKOUR, HANG_BELOW } from '../src/parkour';
import { OBJECT_TYPES } from '../src/objects';
import { FORGE_PLANS } from '../src/forge';
const near = (a: number, b: number, tolerance = 1e-4) => assert.ok(Math.abs(a - b) <= tolerance, `${a} != ${b} (tol ${tolerance})`);
const idle: MotionInput = { right: 0, forward: 0, lift: 0, turn: 0, held: false };
const flat: TraversalWorld = { surfacesAt: () => [0], canOccupy: p => p.y >= -0.025 };
const course = new CourseGeometry();
const centre = (s: typeof NORMAL_PADS[number]) => new Vector3((s.x0 + s.x1) / 2, s.top, (s.z0 + s.z1) / 2);
function simulate(m: MobilityMotor, world: TraversalWorld, seconds: number, input: MotionInput = idle, fps = 60) { for (let i = 0; i < Math.round(seconds * fps); i++) m.update(1 / fps, world, input); }

test('stick has a real deadzone, monotonic fine speed, and no diagonal speed boost', () => {
  near(stickResponse(.1, 0).amount, 0);
  let previous = 0;
  for (let x = .15; x <= 1; x += .025) { const v = stickResponse(x, 0); assert.ok(v.amount > previous); previous = v.amount; }
  near(stickResponse(1, 1).amount, 1); near(Math.hypot(stickResponse(1, 1).x, stickResponse(1, 1).y), 1);
  assert.ok(stickResponse(.3, 0).amount < .1);
});
test('neutral long hold enters targeting; leaving neutral immediately remains analog for the whole gesture', () => {
  const g = new MovementGesture(); g.begin(1, 100, 100, 0, false, false);
  g.tick(TARGET_HOLD_MS - 1); assert.equal(g.mode, 'pending'); g.tick(TARGET_HOLD_MS); assert.equal(g.mode, 'target');
  assert.equal(g.end(1, 600), 'cancel');
  g.begin(1, 100, 100, 1000, false, false); g.move(1, 120, 90); g.tick(2000); assert.equal(g.mode, 'drive');
  g.move(1, 100, 100); g.tick(5000); assert.equal(g.mode, 'drive');
});
test('target direction/radius, neutral cancel, pointer cancellation and single-pointer ownership', () => {
  const g = new MovementGesture(); assert.ok(g.begin(7, 100, 100, 0, false, false)); assert.equal(g.begin(8, 0, 0, 0, false, false), false);
  g.tick(500); g.move(8, 200, 200); near(g.x, 0); g.move(7, 124, 100); near(g.x, .5); near(g.y, 0);
  assert.equal(g.end(8, 600), null); assert.equal(g.end(7, 600, true), 'cancel');
  g.begin(1, 0, 0, 1000, false, false); g.tick(1500); g.move(1, 0, -48); assert.equal(g.end(1, 1600), 'commit');
});
test('double tap AND hold is required for ignition, and only powered legs enable it', () => {
  for (const powered of [false, true]) {
    const g = new MovementGesture(); g.begin(1, 0, 0, 0, powered, false); g.end(1, 70);
    g.begin(2, 0, 0, 150, powered, false);
    assert.equal(g.tick(150 + IGNITION_HOLD_MS - 1), null);
    assert.equal(g.tick(150 + IGNITION_HOLD_MS), powered ? 'ignite' : null);
    assert.equal(g.tick(1000), null);
  }
});
test('double tap in flight cuts immediately, and cancellation cannot ignite or commit', () => {
  const g = new MovementGesture(); g.begin(1, 0, 0, 0, true, true); g.end(1, 70); g.begin(2, 0, 0, 150, true, true);
  assert.equal(g.tick(150, true), 'cut'); assert.equal(g.tick(1000, true), null);
  g.cancel(); g.begin(3, 0, 0, 1200, true, false); assert.equal(g.mode, 'pending'); g.cancel(); assert.equal(g.tick(9000), null);
});
test('analog speeds are proportional, powered running is faster, and rates agree at 30/60/120 Hz', () => {
  const results = [];
  for (const fps of [30, 60, 120]) {
    const m = new MobilityMotor(); m.reset(new Vector3()); simulate(m, flat, 3, { ...idle, forward: 1, held: true }, fps); results.push(m.feet.z);
  }
  near(results[0], results[1], .02); near(results[1], results[2], .02);
  const slow = new MobilityMotor(), fast = new MobilityMotor(), powered = new MobilityMotor(); powered.powered = true;
  simulate(slow, flat, 2, { ...idle, right: .4, held: true }); simulate(fast, flat, 2, { ...idle, right: 1, held: true }); simulate(powered, flat, 2, { ...idle, right: 1, held: true });
  assert.ok(fast.feet.x > slow.feet.x * 3); assert.ok(powered.feet.x > fast.feet.x * 1.9);
});
test('powered movement cannot tunnel through thin obstacles and can slide along them', () => {
  const m = new MobilityMotor(); m.powered = true; m.reset(new Vector3(83.5, 1.2, 6.3));
  simulate(m, course, 3, { ...idle, right: 1, held: true }, 30); assert.ok(m.feet.x < 85.32, `${m.feet.x}`);
  const before = m.feet.z; simulate(m, course, .3, { ...idle, right: 1, forward: .7, held: true }); assert.ok(m.feet.z < before - .2);
  assert.ok(course.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT));
});
test('every course spawn has full footprint support and body clearance', () => {
  for (const [id, s] of Object.entries(COURSE_SPAWNS)) { const y = supportAt(course, s.x, s.z); assert.notEqual(y, null, id); assert.ok(course.canOccupy(new Vector3(s.x, y!, s.z), BODY_RADIUS, BODY_HEIGHT), id); }
});
test('continuous doorway connects the existing lab aisle to the speed track', () => {
  const arena = new Arena(new Scene(), 1);
  for (let x = 53; x <= 63; x += .025) assert.notEqual(supportAt(arena.traversal, x, 7.2), null, `blocked full footprint at ${x}`);
  const m = new MobilityMotor(); m.reset(new Vector3(53, 1.2, 7.2)); simulate(m, arena.traversal, 4.2, { ...idle, right: 1, held: true }); assert.ok(m.feet.x > 63, `${m.feet.x}`);
});
test('irregular track height follows the collision surface without sinking into it', () => {
  const m = new MobilityMotor(); m.reset(new Vector3(72, 1.2, 7.5));
  for (let i = 0; i < 200; i++) { m.update(1 / 60, course, { ...idle, right: 1, held: true }); assert.ok(course.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT), `${m.feet.toArray()}`); }
  assert.ok(m.feet.x > 79);
});
test('all consecutive normal parkour pads are reachable by normal jump/drop trajectories', () => {
  for (let i = 1; i < NORMAL_PADS.length; i++) {
    const plan = planTraversal(course, centre(NORMAL_PADS[i - 1]), centre(NORMAL_PADS[i]), NORMAL_MOBILITY);
    assert.ok(plan, `${NORMAL_PADS[i - 1].id} -> ${NORMAL_PADS[i].id}`); assert.ok(validateTraversal(course, plan!));
  }
});
test('powered parkour uses genuinely higher, longer jumps, rejected without the legs', () => {
  for (let i = 1; i < POWERED_PADS.length; i++) {
    const from = centre(POWERED_PADS[i - 1]), to = centre(POWERED_PADS[i]);
    assert.ok(planTraversal(course, from, to, POWERED_MOBILITY), `${POWERED_PADS[i - 1].id} -> ${POWERED_PADS[i].id}`);
    assert.equal(planTraversal(course, from, to, NORMAL_MOBILITY), null);
  }
});
test('hurdles require a jump and same-height short/long landings are supported', () => {
  const from = new Vector3(64.5, 1.2, -4.3), to = new Vector3(68, 1.2, -4.3);
  const p = planTraversal(course, from, to, NORMAL_MOBILITY); assert.ok(p); assert.equal(p!.kind, 'jump');
  assert.ok(traversalPoint(p!, p!.duration / 2).y > 1.88);
  assert.equal(planTraversal(flat, new Vector3(), new Vector3(3, 0, 0), NORMAL_MOBILITY)?.kind, 'walk');
});
test('platform edges without full footprint support and out-of-world targets are rejected', () => {
  const pad = NORMAL_PADS[2], from = centre(NORMAL_PADS[1]);
  assert.equal(planTraversal(course, from, new Vector3(pad.x0 + .05, pad.top, .2), NORMAL_MOBILITY), null);
  assert.equal(supportAt(course, 200, 0), null);
});
test('surface query distinguishes ground below an overhead platform from its top', () => {
  assert.deepEqual(course.surfacesAt(71, -10), [-1, 8.1]);
  near(supportAt(course, 71, -10, 2)!, -1); near(supportAt(course, 71, -10)!, 8.1);
  assert.ok(course.canOccupy(new Vector3(71, 2, -10), BODY_RADIUS, BODY_HEIGHT));
  assert.equal(course.canOccupy(new Vector3(71, 7.5, -10), BODY_RADIUS, BODY_HEIGHT), false);
});
test('committed jump and drop follow the exact preview and land on the intended level', () => {
  for (const [a, b] of [[1, 2], [5, 6]]) {
    const from = centre(NORMAL_PADS[a]), to = centre(NORMAL_PADS[b]); const plan = planTraversal(course, from, to, NORMAL_MOBILITY)!;
    assert.ok(plan); const m = new MobilityMotor(); m.reset(from); assert.ok(m.commit(plan, course));
    for (let i = 0; i < Math.ceil(plan.duration * 60); i++) { m.update(1 / 60, course); assert.ok(course.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT)); }
    assert.equal(m.mode, 'grounded'); near(m.feet.distanceTo(to), 0, .05);
  }
});
test('last-moment dynamic blockers reject a previously valid target', () => {
  const p = planTraversal(flat, new Vector3(), new Vector3(3, 0, 0), NORMAL_MOBILITY)!;
  const blocked: TraversalWorld = { surfacesAt: flat.surfacesAt, canOccupy: p => p.x < 1 };
  const m = new MobilityMotor(); m.reset(new Vector3()); assert.equal(m.commit(p, blocked), false); near(m.feet.x, 0);
});
test('ordinary walking preserves the unmodelled plateau edge boundary', () => {
  const world: TraversalWorld = { surfacesAt: x => x < 2 ? [0] : [], canOccupy: p => p.x < 2 && p.y >= 0 };
  const m = new MobilityMotor(); simulate(m, world, 4, { ...idle, right: 1, held: true }); assert.ok(m.feet.x <= 1.76); assert.equal(m.mode, 'grounded');
});
test('thrusters are equipment-gated; one neutral held stick sustains hover', () => {
  const m = new MobilityMotor(); assert.equal(m.ignite(), false); m.powered = true; assert.ok(m.ignite());
  simulate(m, flat, 12, { ...idle, held: true }); assert.equal(m.mode, 'hover'); assert.ok(m.feet.y > 1 && m.feet.y < 1.6, `${m.feet.y}`);
});
test('releasing both sticks hovers for the grace interval, then descends and lands gently', () => {
  const m = new MobilityMotor(); m.powered = true; m.ignite(); simulate(m, flat, 2, { ...idle, held: true, lift: 1 });
  const start = m.feet.y; simulate(m, flat, HOVER_GRACE_S - .1); assert.equal(m.mode, 'hover'); assert.ok(m.feet.y >= start - .1);
  simulate(m, flat, .3); assert.equal(m.mode, 'descending');
  simulate(m, flat, 1); assert.ok(m.velocity.y >= -1.16); simulate(m, flat, 10); assert.equal(m.mode, 'grounded'); near(m.feet.y, 0);
});
test('left altitude/rotation and right translation operate simultaneously and independently', () => {
  const m = new MobilityMotor(); m.powered = true; m.ignite();
  simulate(m, flat, 1, { ...idle, held: true, lift: .7, turn: .5, right: .5 });
  assert.ok(m.yaw < -.7); assert.ok(m.feet.y > 1.3); assert.ok(Math.hypot(m.feet.x, m.feet.z) > 1);
});
test('regripping either stick arrests automatic descent', () => {
  const m = new MobilityMotor(); m.powered = true; m.ignite(); simulate(m, flat, 2, { ...idle, lift: 1, held: true }); simulate(m, flat, 3);
  assert.equal(m.mode, 'descending'); simulate(m, flat, .4, { ...idle, held: true }); assert.equal(m.mode, 'hover'); assert.ok(m.velocity.y > -.05);
});
test('double-tap cutoff produces a gravity-driven drop, not a ground teleport', () => {
  const m = new MobilityMotor(); m.powered = true; m.reset(new Vector3(0, 8, 0)); m.ignite(); m.cutThrusters();
  assert.equal(m.mode, 'falling'); m.update(1 / 60, flat); assert.ok(m.feet.y > 7.9 && m.feet.y < 8); simulate(m, flat, 2); near(m.feet.y, 0); assert.equal(m.mode, 'grounded');
});
test('flight cannot rise through a platform underside or the flight ceiling', () => {
  const m = new MobilityMotor(); m.powered = true; m.reset(new Vector3(71, -1, -10)); m.ignite(); simulate(m, course, 10, { ...idle, lift: 1, held: true });
  assert.ok(m.feet.y + BODY_HEIGHT <= 7.81, `${m.feet.y}`); assert.ok(course.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT));
  const open = new MobilityMotor(); open.powered = true; open.ignite(); simulate(open, flat, 30, { ...idle, lift: 1, held: true }); assert.ok(open.feet.y <= 14);
});
test('removing powered legs in flight cuts thrust and returns the normal movement profile', () => {
  const m = new MobilityMotor(); m.powered = true; m.ignite(); simulate(m, flat, 2, { ...idle, held: true }); m.powered = false; m.update(1 / 60, flat);
  assert.equal(m.mode, 'falling'); assert.equal(m.profile, NORMAL_MOBILITY); simulate(m, flat, 3); assert.equal(m.mode, 'grounded');
});
test('ring completion needs a forward plane crossing inside the aperture, not proximity', () => {
  const g = FLIGHT_GATES[0], a = g.centre.clone().addScaledVector(g.normal, -2), b = g.centre.clone().addScaledVector(g.normal, 2);
  assert.ok(crossedGate(a, b, g)); assert.equal(crossedGate(b, a, g), false);
  assert.equal(crossedGate(a, g.centre.clone().addScaledVector(g.normal, -.1), g), false);
  assert.equal(crossedGate(a.clone().add(new Vector3(0, 2, 0)), b.clone().add(new Vector3(0, 2, 0)), g), false);
});
test('powered legs are a real four-ingot forge product and wearable object', () => {
  const recipe = FORGE_PLANS.find(p => p.result === 'leg_armor'); assert.ok(recipe); assert.equal(recipe!.ingots, 4);
  assert.equal(OBJECT_TYPES.leg_armor.wear, 'legs'); assert.equal(OBJECT_TYPES.leg_armor.build().children.length, 6);
});

test('removing powered legs or losing reach invalidates a previously offered powered jump', () => {
  const m = new MobilityMotor(); m.powered = true; m.reset(centre(POWERED_PADS[0]));
  const plan = planTraversal(course, m.feet, centre(POWERED_PADS[1]), m.profile)!; assert.ok(plan);
  m.powered = false; assert.equal(m.commit(plan, course), false);
  m.powered = true; m.reachScale = .25; assert.equal(m.commit(plan, course), false);
});
test('locked interactions stop grounded horizontal inertia immediately', () => {
  const m = new MobilityMotor(); simulate(m, flat, 1, {...idle, right:1, held:true});
  const x=m.feet.x; m.enabled=false; simulate(m, flat, 1, {...idle, right:1, held:true}); near(m.feet.x,x);
});
test('teleport clears the previous hover ceiling', () => {
  const m=new MobilityMotor();m.powered=true;m.reset(new Vector3());m.ignite();m.reset(new Vector3(0,30,0));
  m.mode='falling';m.update(1/60,flat);assert.ok(m.feet.y>29.9);
});

test('descent grazing a platform edge settles onto safe full support rather than hovering forever', () => {
  const pad = NORMAL_PADS[2], m = new MobilityMotor(); m.powered=true;
  m.reset(new Vector3(pad.x0+.08,pad.top+3,.2)); m.ignite(); m.cutThrusters();
  simulate(m,course,5);
  assert.equal(m.mode,'grounded',`${m.mode} at ${m.feet.toArray()}`);
  assert.notEqual(supportAt(course,m.feet.x,m.feet.z,m.feet.y+.03),null);
});


test('automatic hover landing also resolves partial support along a platform edge', () => {
  const pad = NORMAL_PADS[2], m = new MobilityMotor(); m.powered=true;
  m.reset(new Vector3(pad.x0-.08,pad.top+2,.2)); m.ignite();
  simulate(m,course,10); assert.equal(m.mode,'grounded');
  assert.notEqual(supportAt(course,m.feet.x,m.feet.z,m.feet.y+.03),null);
});
test('cutting thrust over a narrow non-walkable slalom obstacle sheds to safe ground', () => {
  const m=new MobilityMotor();m.powered=true;m.reset(new Vector3(86,4,6.3));m.ignite();m.cutThrusters();
  simulate(m,course,6);assert.equal(m.mode,'grounded');near(m.feet.y,1.2);
});

// The free volume (the root study's soil): no surfaces; a roof at y = -0.1, a floor at -4, a clay
// disc of radius 8 around (2, -2) below y = -2 that cannot be entered.
const soil: TraversalWorld = { surfacesAt: () => [], canOccupy: (p, _r, h) => p.y + h <= -0.1 && p.y >= -4 && !(p.y < -2 && Math.hypot(p.x - 2, p.z + 2) < 8) };
test('free volume: forward drive follows the pitch, the floor and roof stop it, and it slides along both', () => {
  const m = new MobilityMotor(); m.free = true; m.reset(new Vector3(0, -2, 20)); assert.equal(m.mode, 'free'); assert.equal(m.airborne, false);
  m.pitch = -0.6; simulate(m, soil, 3, { ...idle, forward: 1, held: true });
  assert.ok(m.feet.y >= -4 && m.feet.y < -3.95, `floor ${m.feet.y}`); assert.ok(m.feet.z < 14, `slid along the floor ${m.feet.z}`);
  m.pitch = 0.8; simulate(m, soil, 4, { ...idle, forward: 1, held: true });
  assert.ok(m.feet.y + BODY_HEIGHT <= -0.1 && m.feet.y + BODY_HEIGHT > -0.15, `roof ${m.feet.y}`); assert.ok(m.feet.z < 8, `slid along the roof ${m.feet.z}`);
  assert.ok(soil.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT));
  m.feet.set(0, 0.3, 0); m.free = false; assert.equal(m.mode, 'falling'); simulate(m, flat, 2); assert.equal(m.mode, 'grounded'); near(m.feet.y, 0);
});
test('free volume: a drift is bound by reach in three dimensions and by the soil, then rests in place', () => {
  const m = new MobilityMotor(); m.free = true; m.reset(new Vector3(2, -3, 9));
  assert.equal(planDrift(soil, m.feet, new Vector3(2, -3, 5.5), NORMAL_MOBILITY), null, 'the clay is a wall');
  assert.equal(planDrift(soil, m.feet, new Vector3(2, -3, 4), NORMAL_MOBILITY), null, 'beyond reach');
  assert.equal(planDrift(soil, m.feet, new Vector3(2, 0.5, 9), NORMAL_MOBILITY), null, 'through the roof');
  const plan = planDrift(soil, m.feet, new Vector3(2, -1.5, 5.5), NORMAL_MOBILITY); assert.ok(plan); assert.equal(plan!.kind, 'drift');
  assert.ok(m.commit(plan!, soil)); assert.equal(m.mode, 'traverse'); assert.equal(m.airborne, true);
  simulate(m, soil, 3); assert.equal(m.mode, 'free'); near(m.feet.distanceTo(new Vector3(2, -1.5, 5.5)), 0, 1e-3); near(m.velocity.length(), 0);
  assert.equal(m.ignite(), false, 'no thrusters in the soil');
});

// Parkour (parkour.ts): the stick alone takes her over what the walk can't, through the same swept body test.
const box = (x0: number, x1: number, top: number, base = 0): TraversalWorld => ({
  surfacesAt: x => (x >= x0 && x <= x1 ? [top] : [base]),
  canOccupy: (p, r) => p.y >= base - 0.025 && !(p.x + r > x0 && p.x - r < x1 && p.y < top - 0.001),
});
/** Drive the stick into `world` from x=0; at a braced hang she pauses, so the stick is let go for RELEASE_S and pushed again the same way (toward the wall climbs on, away drops). */
function run(world: TraversalWorld, seconds: number, right = 1, fps = 60, release = 0.3): { m: MobilityMotor; kinds: string[]; hung: number } {
  const m = new MobilityMotor(); m.parkour = true; m.reset(new Vector3(0, supportAt(world, 0, 0) ?? 0, 0)); const kinds: string[] = [];
  m.onCommit = p => kinds.push(p.kind); let hung = 0, letGo = 0, was = false;
  for (let i = 0; i < Math.round(seconds * fps); i++) {
    if (m.hanging) { hung += 1 / fps; if (!was) letGo = release; } was = !!m.hanging;
    const input = letGo > 0 ? idle : { ...idle, right, held: true }; letGo = Math.max(0, letGo - 1 / fps);
    m.update(1 / fps, world, input); assert.ok(world.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT), `${m.mode} ${m.feet.toArray()}`);
  }
  return { m, kinds, hung };
}
test('parkour: each canonical rise plays its own move, landing on top; a wall by the braced hang, paused in', () => {
  for (const [top, want] of [[CANON.step, ['step']], [CANON.clamber, ['clamber']], [CANON.wall, ['climb', 'climb']], [1.6, ['climb', 'climb']]] as const) {
    const { m, kinds, hung } = run(box(1, 30, top), 5);
    assert.deepEqual(kinds, want, `${top}`); near(m.feet.y, top, 1e-3); assert.equal(m.mode, 'grounded'); assert.ok(m.feet.x > 1.5, `${m.feet.x}`);
    if (want.length === 2) assert.ok(hung > 0.25, `she paused in the hang (${hung})`);
  }
  // Higher than she climbs: the wall stops her as before.
  const { m, kinds } = run(box(1, 30, 2.2), 3); assert.deepEqual(kinds, []); assert.ok(m.feet.x < 1); near(m.feet.y, 0);
});
test('parkour: the canonical heights are each its move\'s own, and the bands part them midway', () => {
  assert.ok(CANON.step > 0.12 && CANON.step < CANON.clamber && CANON.clamber < CANON.wall && CANON.wall < CANON.ledge, JSON.stringify(CANON));
  assert.ok(PARKOUR.stepUp > CANON.step && PARKOUR.stepUp < CANON.clamber && PARKOUR.clamber > CANON.clamber && PARKOUR.clamber < CANON.wall);
  assert.ok(CANON.wall < NORMAL_MOBILITY.climbRise && CANON.ledge < NORMAL_MOBILITY.maxDrop && CANON.gap < NORMAL_MOBILITY.leapReach);
});
test('parkour: off by default (the lab courses keep their measured rules)', () => {
  const m = new MobilityMotor(); m.reset(new Vector3()); simulate(m, box(1, 9, 0.35), 3, { ...idle, right: 1, held: true }); assert.ok(m.feet.x < 1); near(m.feet.y, 0);
});
test('parkour: a canonical rail is vaulted, a broad top of its height climbed onto', () => {
  const thin = run(box(1, 1 + CANON.vaultDepth, CANON.vault), 3); assert.equal(thin.kinds[0], 'vault'); near(thin.m.feet.y, 0); assert.ok(thin.m.feet.x > 1.6);
  const broad = run(box(1, 30, CANON.clamber), 2.5); assert.equal(broad.kinds[0], 'clamber');
});
const ledge = (h: number): TraversalWorld => ({ surfacesAt: x => [x < 1 ? h : 0], canOccupy: p => p.y >= (p.x < 1 ? h : 0) - 0.025 });
test('parkour: a low edge is hopped; a canonical wall or ledge lowered from by the braced hang, paused in; the drop bound kept', () => {
  const low = run(ledge(CANON.clamber), 3); assert.equal(low.kinds[0], 'hop'); near(low.m.feet.y, 0);
  for (const h of [CANON.wall, CANON.ledge]) { const r = run(ledge(h), 5); assert.deepEqual(r.kinds, ['hangDrop', 'hangDrop'], `${h}`); near(r.m.feet.y, 0); assert.equal(r.m.mode, 'grounded'); assert.ok(r.hung > 0.25); }
  const cliff = run(ledge(6), 3); assert.deepEqual(cliff.kinds, []); near(cliff.m.feet.y, 6);
});
test('parkour: in the braced hang she waits for the stick: away from the wall drops, toward it climbs back', () => {
  // Off the ledge, the stick held on: she hangs and waits (a held stick doesn't carry her on).
  const hold = run(ledge(CANON.ledge), 4, 1, 60, 1e9); assert.deepEqual(hold.kinds, ['hangDrop']); assert.ok(hold.m.hanging); near(hold.m.feet.y, CANON.ledge - HANG_BELOW, 1e-3);
  // Let go and pushed back toward the wall (the way she came): she climbs back onto the ledge.
  const m = hold.m; const kinds: string[] = []; m.onCommit = p => kinds.push(p.kind);
  for (let i = 0; i < 20; i++) m.update(1 / 60, ledge(CANON.ledge), idle);
  for (let i = 0; i < 180; i++) m.update(1 / 60, ledge(CANON.ledge), { ...idle, right: -1, held: true });
  assert.deepEqual(kinds, ['climb']); near(m.feet.y, CANON.ledge, 1e-3); assert.equal(m.mode, 'grounded');
});
test('parkour: a canonical gap is leapt only at a run, and only to ground she can land on', () => {
  const gap = (w: number): TraversalWorld => { const g = (x: number) => (x > 1 && x < 1 + w ? -8 : 0); return { surfacesAt: x => [g(x)], canOccupy: p => p.y >= g(p.x) - 0.025 }; };
  const leap = run(gap(CANON.gap), 3); assert.equal(leap.kinds[0], 'leap'); assert.ok(leap.m.feet.x > 1 + CANON.gap);
  const creep = run(gap(CANON.gap), 3, 0.3); assert.deepEqual(creep.kinds, []); assert.ok(creep.m.feet.x < 1);
  const wide = run(gap(4), 3); assert.deepEqual(wide.kinds, []); assert.ok(wide.m.feet.x < 1);
});
test('parkour: a ramp steeper at its foot than the step allows (the old bridge) is stepped onto and walked', () => {
  const deck = (x: number) => (x < 0.5 ? 0 : 0.05 + 4.2 * Math.sin(Math.PI * Math.min(1, (x - 0.5) / 125)) ** 0.6);
  const world: TraversalWorld = { surfacesAt: x => [deck(x)], canOccupy: p => p.y >= deck(p.x) - 0.03 };
  const { m, kinds } = run(world, 6); assert.ok(kinds.length >= 1 && kinds.length <= 3 && kinds.every(k => k === 'step'), `kinds ${kinds.join()}`); assert.ok(m.feet.x > 8, `${m.feet.x}`); near(m.feet.y, deck(m.feet.x), 0.05);
});
test('parkour: the practice course\'s lanes, from the stick alone, each canonical obstacle its own move', () => {
  const lane = (x: number, z: number, seconds: number) => { const m = new MobilityMotor(); m.parkour = true; m.reset(new Vector3(x, 0, z)); const kinds: string[] = []; m.onCommit = p => kinds.push(p.kind); let letGo = 0, was = false;
    for (let i = 0; i < seconds * 60; i++) { if (m.hanging && !was) letGo = 0.3; was = !!m.hanging; const input = letGo > 0 ? idle : { ...idle, forward: 1, held: true }; letGo = Math.max(0, letGo - 1 / 60);
      m.update(1 / 60, courseWorld, input); assert.ok(courseWorld.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT), `${m.mode} ${m.feet.toArray()}`); }
    return { m, kinds }; };
  const up = lane(0, -2.5, 20); assert.deepEqual(up.kinds, ['step', 'clamber', 'climb', 'climb', 'hangDrop', 'hangDrop']); assert.ok(up.m.feet.z < -25); near(up.m.feet.y, 0);
  const over = lane(4, -2, 22); assert.deepEqual(over.kinds, ['vault', 'vault', 'clamber', 'hop', 'climb', 'climb', 'hangDrop', 'hangDrop', 'leap']); assert.ok(over.m.feet.z < -21);
  const too = lane(8, -3, 6); assert.deepEqual(too.kinds, []); assert.ok(too.m.feet.z > -6);
});
test('parkour: a sloped foot is stepped up even past a step\'s height; a sheer face that high is clambered', () => {
  const slope = (h: number, w: number): TraversalWorld => { const g = (x: number) => h * Math.min(1, Math.max(0, (x - 1) / w)); return { surfacesAt: x => [g(x)], canOccupy: p => p.y >= g(p.x) - 0.03 }; };
  assert.equal(run(slope(0.42, 0.25), 3).kinds[0], 'step');
  assert.equal(run(box(1, 30, 0.42), 3).kinds[0], 'clamber');
});

// The wards (RUINS.md, ruinsModel.ts): stone ruins built only of the canonical heights, on a level earthwork.
import { buildWard, wardGround, wardOccupy, wards, toWorld, WARD, WARD_LORE, WARD_N, WARD_RING, WARD_APART } from '../src/ruinsModel';
import { mulberry32 } from '../src/colors';
const wardWorld = (w: ReturnType<typeof buildWard>, land = (_x: number, _z: number) => 0): TraversalWorld => ({ surfacesAt: (x, z) => [wardGround(w, x, z, land(x, z)) ?? land(x, z)], canOccupy: (p, r) => wardOccupy(w, p, r, land(p.x, p.z)) ?? p.y >= land(p.x, p.z) - 0.03 });
/** Drive the stick along the ward's own +u from (u, v), letting go at each braced hang. */
function across(w: ReturnType<typeof buildWard>, u: number, v: number, seconds: number) {
  const world = wardWorld(w), [x, z] = toWorld(w.q, u, v), [fx, fz] = toWorld(w.q, 1, 0);
  const m = new MobilityMotor(); m.parkour = true; m.reset(new Vector3(w.x + x, world.surfacesAt(w.x + x, w.z + z)[0], w.z + z)); const kinds: string[] = []; m.onCommit = p => kinds.push(p.kind);
  let letGo = 0, was = false, top = 0;
  for (let i = 0; i < seconds * 60; i++) {
    if (m.hanging && !was) letGo = 0.3; was = !!m.hanging; const input = letGo > 0 ? idle : { ...idle, right: fx, forward: -fz, held: true }; letGo = Math.max(0, letGo - 1 / 60);
    m.update(1 / 60, world, input); top = Math.max(top, m.feet.y); assert.ok(world.canOccupy(m.feet, BODY_RADIUS, BODY_HEIGHT), `${m.mode} ${m.feet.toArray()}`);
  }
  return { m, kinds, top, u: (m.feet.x - w.x) * fx + (m.feet.z - w.z) * fz };
}
test('wards: every sheer face is one canonical height (no grey between the clips), in every turn and seed', () => {
  const canon = [CANON.step, CANON.clamber, CANON.wall];
  for (let q = 0; q < 4; q++) for (let seed = 1; seed <= 4; seed++) {
    const w = buildWard('w', 't', 0, 0, 0, q, 3, WARD_LORE[0], mulberry32(seed)), world = wardWorld(w); const at = (x: number, z: number) => world.surfacesAt(x, z)[0];
    for (let x = -WARD.court; x < WARD.court; x += 0.05) for (let z = -WARD.court; z < WARD.court; z += 0.05) for (const [dx, dz] of [[0.05, 0], [0, 0.05]]) {
      const d = Math.abs(at(x + dx, z + dz) - at(x, z)); if (d > 0.12) assert.ok(canon.some(c => Math.abs(c - d) < 0.005), `q${q} s${seed} ${x.toFixed(2)},${z.toFixed(2)}: ${d.toFixed(3)}`);
    }
  }
});
test('wards: the stick alone takes her up a ward (step, mount, the braced hang) over its keep and its tower, and down the far side', () => {
  for (let q = 0; q < 4; q++) {
    const w = buildWard('w', 't', 5, -7, 0.4, q, 3, WARD_LORE[0], mulberry32(2 + q));
    const flank = across(w, -WARD.court - 1, 1.5, 30);
    assert.deepEqual(flank.kinds.slice(0, 4), ['step', 'clamber', 'climb', 'climb'], flank.kinds.join()); assert.ok(flank.kinds.includes('hangDrop')); assert.ok(flank.u > WARD.court, `${flank.u}`);
    const tower = across(w, -6, 0, 30);
    assert.deepEqual(tower.kinds.slice(0, 5), ['clamber', 'climb', 'climb', 'climb', 'climb'], tower.kinds.join()); assert.ok(tower.top >= w.y0 + CANON.step + CANON.clamber + 2 * CANON.wall - 0.01, 'she stood on the tower');
  }
});
test('wards: each glyph-plate stands on a top she can stand on, and the door faces the breach', () => {
  const w = buildWard('w', 't', 0, 0, 1, 1, 3, WARD_LORE[1], mulberry32(5)), world = wardWorld(w);
  assert.equal(w.plates.length, 4);
  for (const p of w.plates) { near(world.surfacesAt(p.x, p.z)[0], p.y, 1e-6); assert.ok(world.canOccupy(new Vector3(p.x, p.y, p.z), BODY_RADIUS, BODY_HEIGHT), p.where); assert.ok(p.lore.length > 20); }
  const [fx, fz] = toWorld(w.q, 1, 0); assert.ok((w.door.x - w.x) * fx + (w.door.z - w.z) * fz > 0);
});
test('wards: placed about the breach on its ring, apart, on walkable ground, clear of other places, their earthwork level', async () => {
  const { createTerrain } = await import('../src/worldTerrain'); const { places } = await import('../src/overworldModel'); const { plateau, walkable } = await import('../src/plateauModel');
  const t = createTerrain(1), breach = places(1).find(p => p.id === 'lair')!, avoid = places(1).filter(p => p.id !== 'lair').map(p => ({ x: p.x, z: p.z, r: p.radius }));
  const list = wards(1, breach, t.height, (x, z) => walkable(plateau(1), x, z), avoid);
  assert.equal(list.length, WARD_N);
  for (const w of list) {
    const r = Math.hypot(w.x - breach.x, w.z - breach.z); assert.ok(r >= WARD_RING[0] - 1 && r <= WARD_RING[1] + 1, `${r}`);
    assert.ok(avoid.every(p => Math.hypot(p.x - w.x, p.z - w.z) >= p.r), w.id);
    for (let u = -WARD.court; u <= WARD.court; u += 2) for (let v = -WARD.court; v <= WARD.court; v += 2) assert.ok(t.height(w.x + u, w.z + v) <= w.y0 + 1e-6, 'the court stands on the land, never under it');
  }
  for (const a of list) for (const b of list) if (a !== b) { const d = Math.abs(Math.atan2(a.z - breach.z, a.x - breach.x) - Math.atan2(b.z - breach.z, b.x - breach.x)) % (Math.PI * 2); assert.ok(Math.min(d, Math.PI * 2 - d) >= WARD_APART - 1e-6); }
  assert.deepEqual(new Set(list.map(w => w.name)).size, list.length, list.map(w => w.name).join());
});
