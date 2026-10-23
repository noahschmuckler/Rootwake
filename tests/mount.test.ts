import { test } from 'node:test'; import assert from 'node:assert/strict';
import { refuseSummon, canSummon, summon, stepMount, lastsFor, drive, saddleAt, forwardOf, SUMMON_SAP, MOUNT_SPEED, HEALTH, DRAIN, HEAL, RISE_S, COLLAPSE_S, FADE_S, TURN_RATE, type SummonCtx } from '../src/mountModel';
import { NORMAL_MOBILITY } from '../src/mobility';
import { MILD_DEPTH } from '../src/contagionModel';

const healthy: SummonCtx = { growth: false, spoiled: false, soil: 'grass', sap: 100, up: false };
test('the summon: healthy soil only (grass or wood, outside her growth, not spoiled, not water, rock or a yard), enough sap, no stag up', () => {
  assert.equal(refuseSummon(healthy), null); assert.ok(canSummon({ ...healthy, soil: 'wood' }));
  assert.ok(!canSummon({ ...healthy, growth: true })); assert.ok(!canSummon({ ...healthy, spoiled: true }));
  for (const soil of ['water', 'rock', 'yard', 'dark'] as const) assert.ok(!canSummon({ ...healthy, soil }), `${soil} refuses`);
  assert.ok(!canSummon({ ...healthy, sap: SUMMON_SAP - 1 })); assert.ok(canSummon({ ...healthy, sap: SUMMON_SAP }));
  assert.ok(!canSummon({ ...healthy, up: true }));
  assert.match(refuseSummon({ ...healthy, growth: true })!, /hers/);
});
test('the speed: about two and a half times her walk, and the saddle rides over the body facing its heading', () => {
  assert.ok(Math.abs(MOUNT_SPEED - NORMAL_MOBILITY.runSpeed * 2.5) < 0.06, `${MOUNT_SPEED} m/s`); assert.ok(MOUNT_SPEED > 5 && MOUNT_SPEED < 10);
  const f = forwardOf(0); assert.ok(Math.abs(f.x) < 1e-9 && f.z === -1, 'heading 0 faces −z as her figure does');
  const s = saddleAt(10, 2, 5, Math.PI / 2); assert.ok(s.y > 2 + 1 && s.y < 2 + 1.6, 'she sits a red stag\'s height up'); assert.ok(Math.abs(s.z - 5) < 1e-9 && s.x < 10, 'forward of its centre');
});
test('the rise, then up; health drains by depth (the nursery in about 20 s, the mild ring in a minute or two), heals on healthy soil, and at nothing it collapses and is gone', () => {
  const m = summon(0, 0, 0); assert.equal(m.phase, 'rising'); assert.equal(m.health, HEALTH);
  let ev = stepMount(m, RISE_S / 2, 1, false); assert.equal(ev, null); assert.equal(m.phase, 'rising');
  ev = stepMount(m, RISE_S / 2, 1, false); assert.equal(ev, 'up'); assert.equal(m.phase, 'up'); assert.equal(m.health, HEALTH, 'the rise does not drain');
  assert.ok(Math.abs(lastsFor(1) - 20) < 1e-9, 'the nursery kills it in 20 s'); const mild = lastsFor(MILD_DEPTH); assert.ok(mild >= 60 && mild <= 120, `the mild ring in a minute or two (${mild} s)`); assert.equal(lastsFor(0), Infinity);
  // The nursery: twenty seconds at depth 1, stepped finely.
  let t = 0, collapsedAt = -1; while (t < 30 && collapsedAt < 0) { if (stepMount(m, 0.05, 1, false) === 'collapsed') collapsedAt = t; t += 0.05; }
  assert.ok(collapsedAt > 19 && collapsedAt < 21, `collapsed at ${collapsedAt} s`); assert.equal(m.phase, 'collapsing'); assert.equal(m.health, 0);
  assert.equal(stepMount(m, COLLAPSE_S + FADE_S - 0.01, 0, true), null); assert.equal(stepMount(m, 0.02, 0, true), 'gone'); assert.equal(m.phase, 'gone');
  // Healing: half its health back on healthy soil at HEAL a second, never past full; the growth's depth 0 but unhealthy soil (water, rock) neither drains nor heals.
  const h = summon(0, 0, 0); stepMount(h, RISE_S, 0, true); h.health = 50; stepMount(h, 10, 0, true); assert.ok(Math.abs(h.health - (50 + HEAL * 10)) < 1e-9); stepMount(h, 100, 0, true); assert.equal(h.health, HEALTH);
  h.health = 50; stepMount(h, 10, 0, false); assert.equal(h.health, 50);
  // The mild ring drains slower than the nursery by its depth.
  const a = summon(0, 0, 0), b = summon(0, 0, 0); stepMount(a, RISE_S, 0, true); stepMount(b, RISE_S, 0, true); stepMount(a, 5, 1, false); stepMount(b, 5, MILD_DEPTH, false);
  assert.ok(Math.abs((HEALTH - a.health) - DRAIN * 5) < 1e-9); assert.ok(HEALTH - b.health < (HEALTH - a.health) / 3);
});
test('the drive: the heading turns to the stick at TURN_RATE, the speed gathers toward the gallop and falls away released', () => {
  const m = summon(0, 0, 0); stepMount(m, RISE_S, 0, true);
  const step = drive(m, 0.1, { x: 1, z: 0 }, 1); assert.ok(Math.abs(m.heading - (-TURN_RATE * 0.1)) < 1e-9, 'turns toward +x (heading −π/2) at the rate'); assert.ok(step > 0 && step < MOUNT_SPEED * 0.1, 'gathers speed, not at the gallop yet');
  for (let i = 0; i < 40; i++) drive(m, 0.1, { x: 1, z: 0 }, 1); assert.ok(Math.abs(m.heading + Math.PI / 2) < 1e-6, 'faces +x'); assert.ok(m.speed > MOUNT_SPEED * 0.98, `at the gallop (${m.speed})`);
  for (let i = 0; i < 40; i++) drive(m, 0.1, null, 0); assert.equal(m.speed, 0, 'stops released');
  drive(m, 0.1, { x: 0, z: 1 }, 0.5); for (let i = 0; i < 40; i++) drive(m, 0.1, { x: 0, z: 1 }, 0.5); assert.ok(Math.abs(m.speed - MOUNT_SPEED * 0.5) < 0.05, 'half a stick is half the gallop');
});
