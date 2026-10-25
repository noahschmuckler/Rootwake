import { test } from 'node:test'; import assert from 'node:assert/strict';
import { refuseSummon, canSummon, summon, stepMount, lastsFor, drive, saddleAt, forwardOf, callMount, sinkToTravel, travelPoint, dismissMount, rideOut, drains, canWade, wadeFactor, SUMMON_SAP, MOUNT_SPEED, WALK_SPEED, CALL_SPEED, CALL_RUN_M, SINK_S, SURFACE_S, HEALTH, DRAIN, HEAL, RISE_S, COLLAPSE_S, FADE_S, TURN_RATE, STAG_WADE_DEPTH, STAG_WADE_SLOW, type SummonCtx } from '../src/mountModel';
import { RIVER_DEPTH, LAKE_DEPTH, WADE_DEPTH, FORD_DEPTH, plateau, walkable } from '../src/plateauModel';
import { NORMAL_MOBILITY } from '../src/mobility';
import { SNATCH_PACE } from '../src/villageModel';
import { MILD_DEPTH } from '../src/contagionModel';
import { TAINT, depthAt } from '../src/taintModel';

const healthy: SummonCtx = { growth: false, spoiled: false, soil: 'grass', sap: 100, up: false };
test('the summon: healthy soil only (grass or wood, outside her growth, not spoiled, not water, rock or a yard), enough sap, no stag up', () => {
  assert.equal(refuseSummon(healthy), null); assert.ok(canSummon({ ...healthy, soil: 'wood' }));
  assert.ok(!canSummon({ ...healthy, growth: true })); assert.ok(!canSummon({ ...healthy, spoiled: true }));
  for (const soil of ['water', 'rock', 'yard', 'dark'] as const) assert.ok(!canSummon({ ...healthy, soil }), `${soil} refuses`);
  assert.ok(!canSummon({ ...healthy, sap: SUMMON_SAP - 1 })); assert.ok(canSummon({ ...healthy, sap: SUMMON_SAP }));
  assert.ok(!canSummon({ ...healthy, up: true }));
  assert.match(refuseSummon({ ...healthy, growth: true })!, /hers/);
});
test('the speed (pass 2): root travel\'s pace, the snatchers\' SNATCH_PACE, about three times her walk; the saddle rides over the body facing its heading', () => {
  assert.equal(MOUNT_SPEED, SNATCH_PACE); assert.equal(CALL_SPEED, SNATCH_PACE); assert.equal(MOUNT_SPEED, 9); assert.equal(WALK_SPEED, NORMAL_MOBILITY.runSpeed); assert.ok(MOUNT_SPEED / WALK_SPEED > 2.5 && MOUNT_SPEED / WALK_SPEED < 3.5);
  const f = forwardOf(0); assert.ok(Math.abs(f.x) < 1e-9 && f.z === -1, 'heading 0 faces −z as her figure does');
  const s = saddleAt(10, 2, 5, Math.PI / 2); assert.ok(s.y > 2 + 1 && s.y < 2 + 1.6, 'she sits a red stag\'s height up'); assert.ok(Math.abs(s.z - 5) < 1e-9 && s.x < 10, 'forward of its centre');
});
test('the rise, then up; health drains by depth, heals on healthy soil, and at nothing it collapses and is gone', () => {
  const m = summon(0, 0, 0); assert.equal(m.phase, 'rising'); assert.equal(m.health, HEALTH);
  let ev = stepMount(m, RISE_S / 2, 1, false); assert.equal(ev, null); assert.equal(m.phase, 'rising');
  ev = stepMount(m, RISE_S / 2, 1, false); assert.equal(ev, 'up'); assert.equal(m.phase, 'up'); assert.equal(m.health, HEALTH, 'the rise does not drain');
  assert.ok(Math.abs(lastsFor(1) - HEALTH / DRAIN) < 1e-9); assert.equal(lastsFor(0), Infinity); assert.ok(lastsFor(MILD_DEPTH) > lastsFor(1) * 4);
  let t = 0, collapsedAt = -1; while (t < 200 && collapsedAt < 0) { if (stepMount(m, 0.05, 1, false) === 'collapsed') collapsedAt = t; t += 0.05; }
  assert.ok(Math.abs(collapsedAt - HEALTH / DRAIN) < 0.2, `collapsed at ${collapsedAt} s at depth 1`); assert.equal(m.phase, 'collapsing'); assert.equal(m.health, 0);
  assert.equal(stepMount(m, COLLAPSE_S + FADE_S - 0.01, 0, true), null); assert.equal(stepMount(m, 0.02, 0, true), 'gone'); assert.equal(m.phase, 'gone');
  const h = summon(0, 0, 0); stepMount(h, RISE_S, 0, true); h.health = 50; stepMount(h, 10, 0, true); assert.ok(Math.abs(h.health - (50 + HEAL * 10)) < 1e-9); stepMount(h, 100, 0, true); assert.equal(h.health, HEALTH);
  h.health = 50; stepMount(h, 10, 0, false); assert.equal(h.health, 50, 'water, rock or a yard neither drains nor heals');
  const a = summon(0, 0, 0), b = summon(0, 0, 0); stepMount(a, RISE_S, 0, true); stepMount(b, RISE_S, 0, true); stepMount(a, 5, 1, false); stepMount(b, 5, MILD_DEPTH, false);
  assert.ok(Math.abs((HEALTH - a.health) - DRAIN * 5) < 1e-9); assert.ok(HEALTH - b.health < (HEALTH - a.health) / 3, 'the mild ring drains slower by its depth');
});
test('the drive: the heading turns to the stick at TURN_RATE, the speed gathers toward the gallop and falls away released', () => {
  const m = summon(0, 0, 0); stepMount(m, RISE_S, 0, true);
  const step = drive(m, 0.1, { x: 1, z: 0 }, 1); assert.ok(Math.abs(m.heading - (-TURN_RATE * 0.1)) < 1e-9, 'turns toward +x (heading −π/2) at the rate'); assert.ok(step > 0 && step < MOUNT_SPEED * 0.1, 'gathers speed, not at the gallop yet');
  for (let i = 0; i < 40; i++) drive(m, 0.1, { x: 1, z: 0 }, 1); assert.ok(Math.abs(m.heading + Math.PI / 2) < 1e-6, 'faces +x'); assert.ok(m.speed > MOUNT_SPEED * 0.98, `at the gallop (${m.speed})`);
  for (let i = 0; i < 40; i++) drive(m, 0.1, null, 0); assert.equal(m.speed, 0, 'stops released');
  drive(m, 0.1, { x: 0, z: 1 }, 0.5); for (let i = 0; i < 40; i++) drive(m, 0.1, { x: 0, z: 1 }, 0.5); assert.ok(Math.abs(m.speed - MOUNT_SPEED * 0.5) < 0.05, 'half a stick is half the gallop');
});
test('the call (pass 2): near over ground it can cross it runs; far, or with water between, it sinks, travels at root travel\'s pace and surfaces beside her; its health drains in the growth on the way and never outside it', () => {
  const m = summon(0, 0, 0); assert.equal(callMount(m, { x: 10, z: 0 }, true), false, 'not while rising'); stepMount(m, RISE_S, 0, true);
  assert.equal(callMount(m, { x: 30, z: 0 }, true), 'run'); assert.ok(m.called && m.phase === 'up'); m.called = false;
  assert.equal(callMount(m, { x: 30, z: 0 }, false), 'travel', 'water between: it travels'); assert.equal(m.phase, 'sinking'); assert.ok(m.travel && Math.abs(m.travel.seconds - 30 / CALL_SPEED) < 1e-9);
  assert.equal(callMount(m, { x: 30, z: 0 }, true), false, 'not on its way already');
  assert.equal(stepMount(m, SINK_S, 0, true), 'travelling'); const mid = travelPoint(m, { x: 30, z: 0 }); assert.ok(Math.abs(mid.x) < 1e-9, 'just set out');
  stepMount(m, m.travel!.seconds / 2, 0, true); const half = travelPoint(m, { x: 30, z: 0 }); assert.ok(Math.abs(half.x - 15) < 1e-6, 'half way after half the time'); const moved = travelPoint(m, { x: 40, z: 0 }); assert.ok(Math.abs(moved.x - 20) < 1e-6, 'toward where she is now');
  assert.equal(stepMount(m, m.travel!.seconds / 2 + 1e-6, 0, true), 'surfacing'); assert.equal(m.phase, 'surfacing'); assert.equal(stepMount(m, SURFACE_S, 0, true), 'up'); assert.equal(m.phase, 'up'); assert.equal(m.travel, null); assert.equal(m.health, HEALTH, 'no drain outside the growth');
  // Far: a call from beyond CALL_RUN_M travels even over crossable ground.
  const far = summon(0, 0, 0); stepMount(far, RISE_S, 0, true); assert.equal(callMount(far, { x: CALL_RUN_M + 1, z: 0 }, true), 'travel');
  // Draining under the soil in the growth; collapsing on the surface if it was spent on the way.
  const g = summon(0, 0, 0); stepMount(g, RISE_S, 0, true); assert.ok(drains('travelling') && drains('surfacing') && !drains('rising'));
  sinkToTravel(g, { x: 90, z: 0 }); stepMount(g, SINK_S, 1, false); assert.ok(Math.abs(g.health - (HEALTH - DRAIN * SINK_S)) < 1e-9, 'sinking in the growth drains');
  g.health = 0.1; stepMount(g, g.travel!.seconds, 1, false); assert.equal(g.phase, 'surfacing'); assert.equal(stepMount(g, SURFACE_S, 1, false), 'collapsed', 'spent on the way: it collapses where it surfaces');
});
test('the rivers (pass 4, Noah: "I want the stag to be able to cross rivers"): it wades water to STAG_WADE_DEPTH, over the deepest river bed and under the lake, slowed by the depth to STAG_WADE_SLOW; the land\'s rule lets it through where it refuses her', () => {
  assert.ok(STAG_WADE_DEPTH > RIVER_DEPTH + 0.15, 'deeper than any river bed (the channel carves RIVER_DEPTH and 0.15 more)'); assert.ok(STAG_WADE_DEPTH < LAKE_DEPTH, 'the lake still refuses it'); assert.ok(STAG_WADE_DEPTH > WADE_DEPTH, 'more than she wades');
  assert.ok(canWade(0) && canWade(RIVER_DEPTH + 0.15) && canWade(STAG_WADE_DEPTH) && !canWade(STAG_WADE_DEPTH + 0.01) && !canWade(LAKE_DEPTH));
  assert.equal(wadeFactor(0), 1, 'dry: its whole pace'); assert.equal(wadeFactor(-1), 1); assert.ok(Math.abs(wadeFactor(STAG_WADE_DEPTH) - STAG_WADE_SLOW) < 1e-9, 'at the deepest: STAG_WADE_SLOW of it'); assert.ok(Math.abs(wadeFactor(STAG_WADE_DEPTH * 10) - STAG_WADE_SLOW) < 1e-9, 'held there deeper');
  const half = wadeFactor(STAG_WADE_DEPTH / 2); assert.ok(half < 1 && half > STAG_WADE_SLOW && Math.abs(half - (1 + STAG_WADE_SLOW) / 2) < 1e-9, 'falls linearly between'); assert.ok(wadeFactor(FORD_DEPTH) > 0.9, 'a ford hardly slows it');
  assert.ok(STAG_WADE_SLOW > 0 && STAG_WADE_SLOW < 1); assert.ok(MOUNT_SPEED * STAG_WADE_SLOW > WALK_SPEED, 'even belly-deep it outpaces her walk');
  // The land's rule with the stag's depth: a river's middle refuses her and not it; the lake refuses both.
  const p = plateau(1); let river: { x: number; z: number } | null = null, lake: { x: number; z: number } | null = null;
  for (const r of p.rivers) { const i = Math.floor(r.points.length / 2); const q = r.points[i], w = p.water(q.x, q.z); if (w && w.kind === 'river' && w.depth >= WADE_DEPTH && w.depth <= STAG_WADE_DEPTH) { river = q; break; } }
  for (let a = 0; a < Math.PI * 2 && !lake; a += 0.3) { const r = (p.islandR + p.lakeR(a)) / 2, q = { x: p.centre.x + Math.cos(a) * r, z: p.centre.z + Math.sin(a) * r }, w = p.water(q.x, q.z); if (w && w.kind === 'lake' && w.depth > STAG_WADE_DEPTH) lake = q; }
  assert.ok(river, 'a river\'s middle deeper than her wading and within the stag\'s'); assert.ok(lake, 'open lake deeper than the stag wades');
  assert.ok(!walkable(p, river!.x, river!.z) && walkable(p, river!.x, river!.z, STAG_WADE_DEPTH), 'the river refuses her and lets the stag wade');
  assert.ok(!walkable(p, lake!.x, lake!.z) && !walkable(p, lake!.x, lake!.z, STAG_WADE_DEPTH), 'the lake refuses both');
  // Slowed in the drive: at the deepest the gallop eases to STAG_WADE_SLOW of MOUNT_SPEED.
  const m = summon(0, 0, 0); stepMount(m, RISE_S, 0, true); for (let i = 0; i < 60; i++) drive(m, 0.1, { x: 0, z: 1 }, 1, MOUNT_SPEED * wadeFactor(STAG_WADE_DEPTH)); assert.ok(Math.abs(m.speed - MOUNT_SPEED * STAG_WADE_SLOW) < 0.05, `the wade's pace (${m.speed})`);
});
test('dismissed (pass 2): it sinks where it stands and is gone, no sap back; not while on its way', () => {
  const m = summon(3, 4, 1); stepMount(m, RISE_S, 0, true); assert.ok(dismissMount(m)); assert.equal(m.phase, 'sinking'); assert.ok(m.dismissed);
  assert.equal(stepMount(m, SINK_S, 0, true), 'gone'); assert.equal(m.phase, 'gone'); assert.ok(!dismissMount(m));
  const t = summon(0, 0, 0); stepMount(t, RISE_S, 0, true); sinkToTravel(t, { x: 50, z: 0 }); assert.ok(!dismissMount(t), 'not while travelling');
});
test('the ride out (pass 2, Noah\'s fourth ask): called in from the breach\'s edge to the nursery\'s rim through the growth, surfaced and mounted, ridden straight out it still stands at the mild ring and collapses between 80% and 100% of the way out; from the grey ring it makes it out', () => {
  const rings = { grey: TAINT.grey, nursery: TAINT.nursery, edge: TAINT.edge };
  const r = rideOut(TAINT.edge, TAINT.nursery, TAINT.edge, depthAt, rings);
  console.log(`ride-out from the nursery's rim: in ${r.timeIn.toFixed(1)} s (health at the grey ring ${r.healthIn.grey?.toFixed(1)}, at the rim ${r.healthIn.nursery?.toFixed(1)}), mounted ${r.healthMounted.toFixed(1)}, out ${r.timeOut.toFixed(1)} s (grey ring ${r.healthOut.grey?.toFixed(1)}), collapsed at ${r.collapsedAt === null ? 'never' : (r.collapsedAt * 100).toFixed(0) + '% of the way out'}`);
  assert.ok(r.healthMounted > 30, `it lives to be mounted at the rim (${r.healthMounted})`); assert.ok((r.healthOut.grey ?? 0) > 0, 'still standing at the grey ring on the way out');
  assert.ok(r.collapsedAt !== null && r.collapsedAt >= 0.8 && r.collapsedAt <= 1.0, `collapses between 80% and 100% of the way out (${r.collapsedAt})`);
  const g = rideOut(TAINT.edge, TAINT.grey, TAINT.edge, depthAt, rings);
  console.log(`ride-out from the grey ring's rim: in ${g.timeIn.toFixed(1)} s, mounted ${g.healthMounted.toFixed(1)}, out ${g.timeOut.toFixed(1)} s, health left ${g.healthMounted - 0 > 0 ? '' : ''}${g.collapsedAt === null ? 'made it' : g.collapsedAt}`);
  assert.equal(g.collapsedAt, null, 'from the grey ring it makes it out');
  const mid = rideOut(TAINT.edge, (TAINT.grey + TAINT.nursery) / 2, TAINT.edge, depthAt, rings); assert.equal(mid.collapsedAt, null, 'from the middle of the grey ring too');
});
