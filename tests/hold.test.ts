import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TERRACES, APRON, FLIGHTS, BEDS, WALLS, levelAt, carve, occupy, onHold, holdFrame, toLocal, toWorld, runOf, RISER, STEP_TOL, FACADE_V, FACADE_TOP, HEARTH, ROOMS, DOORS, CLEAR_H } from '../src/holdModel';
import { plateau, walkable } from '../src/plateauModel';

test('H1: the terraces climb in order, each flight reaching the level above in hobbit steps', () => {
  let z = APRON.z, v = APRON.v1;
  for (const [i, t] of TERRACES.entries()) { assert.ok(t.z > z, `${t.name} above the one below`); assert.equal(t.v0, v, `${t.name} meets the one below`); z = t.z; v = t.v1; const run = runOf(i); assert.ok(run < t.v1 - t.v0, 'its flight fits on it'); }
  assert.equal(v, FACADE_V);
  for (const f of FLIGHTS) { const rise = (f.to - f.from) / f.steps; assert.ok(Math.abs(rise - RISER) < 0.03, `riser ${rise}`); }
});
test('H1: the ground is level on a terrace, ramps up a flight, and is nothing off the hold', () => {
  assert.equal(levelAt(-30, 20), TERRACES[0].z); assert.equal(levelAt(-20, 100), TERRACES[5].z); assert.equal(levelAt(0, 0), APRON.z);
  const c = FLIGHTS.find(f => f.side === 'centre' && f.terrace === 3)!, mid = levelAt(0, (c.v0 + c.v1) / 2)!;
  assert.ok(mid > c.from && mid < c.to); assert.ok(Math.abs(levelAt(0, c.v0 + 0.001)! - c.from) < 0.05); assert.ok(Math.abs(levelAt(0, c.v1 - 0.001)! - c.to) < 0.05);
  for (const s of FLIGHTS.filter(f => f.side !== 'centre')) { const foot = s.climb === 'u+' ? s.u0 + 0.01 : s.u1 - 0.01, head = s.climb === 'u+' ? s.u1 - 0.01 : s.u0 + 0.01, mv = (s.v0 + s.v1) / 2; assert.ok(Math.abs(levelAt(foot, mv)! - s.from) < 0.05 && Math.abs(levelAt(head, mv)! - s.to) < 0.05, `side stair of ${TERRACES[s.terrace].name}`); }
  assert.equal(levelAt(80, 40), null); assert.equal(levelAt(0, 120), null); assert.ok(!onHold(0, 120));
});
test('H1: the land is carved level on the hold, eases back outside, and the bluff stands behind the facade', () => {
  assert.equal(carve(-30, 20, 5), TERRACES[0].z);
  assert.equal(carve(46 + 40, 20, 3.3), 3.3, 'far off it the land is its own');
  const near = carve(46 + 2, 20, 6); assert.ok(near > TERRACES[0].z && near < 6, 'a fill eases back');
  assert.ok(carve(0, FACADE_V + 3, 15) >= FACADE_TOP - 0.01, 'the bluff behind the facade');
  const w = WALLS.find(x => x.terrace === 3)!; assert.equal(carve((w.u0 + w.u1) / 2, w.v + 1, 0), w.low, 'drawn low just inside a wall (the masonry covers it)'); assert.equal(levelAt((w.u0 + w.u1) / 2, w.v + 1), w.high, 'her feet on the upper level'); assert.equal(carve(0, FACADE_V - 1, 15), TERRACES[5].z, 'the hearth terrace before it');
});
test('H1: a retaining wall stops a body at its foot, a flight lets it climb, the facade is solid', () => {
  const w = WALLS.find(x => x.terrace === 2 && x.u1 < 0)!, u = (w.u0 + w.u1) / 2;
  assert.equal(occupy(u, w.v - 0.5, w.low, 0.26), true, 'just short of the wall');
  assert.equal(occupy(u, w.v - 0.1, w.low, 0.26), false, 'against it');
  const c = FLIGHTS.find(f => f.side === 'centre' && f.terrace === 2)!;
  for (let v = c.v0 - 1; v <= c.v1 + 1; v += 0.1) { const g = levelAt(0, v)!; assert.equal(occupy(0, v, g, 0.26), true, `the stair at ${v.toFixed(1)}`); }
  assert.equal(occupy(0, FACADE_V - 0.1, TERRACES[5].z, 0.26), false, 'the facade');
  assert.ok(STEP_TOL < Math.min(...TERRACES.map((t, i) => t.z - (i ? TERRACES[i - 1].z : 0))), 'no terrace is a step');
});
test('H1: beds lie on their terraces off the stair; the halls give her room; the hearth is on the hearth terrace', () => {
  for (const b of BEDS) { const t = TERRACES[b.terrace]; assert.ok(Math.min(Math.abs(b.u0), Math.abs(b.u1)) > 2.4 + 1 && Math.max(Math.abs(b.u0), Math.abs(b.u1)) < t.hw && b.v0 > t.v0 && b.v1 < t.v1); }
  for (const r of ROOMS) assert.ok(r.ceiling >= CLEAR_H && r.v0 >= FACADE_V); for (const d of DOORS) assert.ok(d.height >= CLEAR_H && Math.abs(d.u1) <= TERRACES[5].hw && Math.abs(d.u0) <= TERRACES[5].hw, d.id);
  assert.equal(levelAt(HEARTH.u, HEARTH.v), TERRACES[5].z);
});
test('H1: on the plateau: the frame round-trips, the hold is carved into the ground and walkable up into the belt', () => {
  const p = plateau(1), f = p.hold.frame, w = toWorld(f, 12, 40), q = toLocal(f, w.x, w.z); assert.ok(Math.abs(q.u - 12) < 1e-9 && Math.abs(q.v - 40) < 1e-9);
  assert.equal(holdFrame(p.hold.cave).ix, f.ix);
  for (const [u, v] of [[0, -4], [-30, 20], [20, 70], [0, 104]]) { const at = toWorld(f, u, v); assert.ok(walkable(p, at.x, at.z), `walkable at ${u},${v}`); assert.ok(Math.abs(p.ground(at.x, at.z) - (p.hold.datum + levelAt(u, v)!)) < 1e-6, 'drawn level with her feet in a terrace\'s middle'); assert.equal(p.hold.levelAt(at.x, at.z), p.hold.datum + levelAt(u, v)!); }
  const off = toWorld(f, 70, 100); assert.ok(!walkable(p, off.x, off.z), 'the belt beside it is still too steep');
  assert.ok(p.into(toWorld(f, 0, 104).x, toWorld(f, 0, 104).z) > 40, 'the top is past where the walk stopped before');
});
