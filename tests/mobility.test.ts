import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3, Scene } from 'three';
import { MovementGesture, TARGET_HOLD_MS, IGNITION_HOLD_MS } from '../src/movementGesture';
import { MobilityMotor, NORMAL_MOBILITY, POWERED_MOBILITY, BODY_RADIUS, BODY_HEIGHT, HOVER_GRACE_S, stickResponse, planTraversal, supportAt, traversalPoint, validateTraversal, type TraversalWorld, type MotionInput } from '../src/mobility';
import { CourseGeometry, NORMAL_PADS, POWERED_PADS, COURSE_SPAWNS, FLIGHT_GATES, crossedGate } from '../src/mobilityCourseLayout';
import { Arena } from '../src/arena';
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
