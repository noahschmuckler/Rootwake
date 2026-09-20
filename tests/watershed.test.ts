import { test } from 'node:test'; import assert from 'node:assert/strict';
import { freshWatershed, advance, redirect, cultivateBasin, parseWatershed, makeSoil, insideFine, isPassable, guide, stressOf, storageCap, shares, CYCLE_DAYS, WET_DAYS, DRAW_PER_DAY, NODES, EDGES, FINE, vec, CLOSE_AFTER_DAYS, CLOSING_DAYS, REDIRECT_COST, BASIN_COST, SAP_CAP } from '../src/watershedModel';
const near = (a: number, b: number, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`);
function cycleMinima(setup: (w: ReturnType<typeof freshWatershed>) => void, cycles = 4) {
  const w = freshWatershed(); w.sap = SAP_CAP; setup(w); const minima: { west: number; east: number; meanWest: number; meanEast: number; closed: number; opened: number }[] = [];
  for (let c = 0; c < cycles; c++) {
    const m = { west: 1, east: 1, meanWest: 0, meanEast: 0, closed: 0, opened: 0 }; let was = w.shortcut;
    for (let d = 0; d < CYCLE_DAYS * 4; d++) { advance(w, .25); m.west = Math.min(m.west, w.west.moisture); m.east = Math.min(m.east, w.east.moisture); m.meanWest += w.west.moisture / (CYCLE_DAYS * 4); m.meanEast += w.east.moisture / (CYCLE_DAYS * 4); if (w.shortcut === 'closed') m.closed += .25; if (w.shortcut === 'open' && was !== 'open') m.opened++; was = w.shortcut; }
    minima.push(m);
  }
  return { w, minima };
}
test('the ledger stays bounded over many seasons and its recovery repeats rather than drifting', () => {
  const { w, minima } = cycleMinima(() => {}, 5);
  for (const side of ['west', 'east'] as const) { assert.ok(w[side].moisture >= 0 && w[side].moisture <= 1); assert.ok(w[side].canopy >= 0 && w[side].canopy <= 1); assert.ok(w[side].litter >= 0 && w[side].litter < 5); }
  assert.ok(w.storage >= 0 && w.storage <= storageCap(w));
  // Each dry season stresses the groves and closes the fine root for a while; each wet season reopens it.
  const later = minima.slice(1), closed = later.reduce((a, m) => a + m.closed, 0), opened = later.reduce((a, m) => a + m.opened, 0);
  for (const m of later) assert.ok(m.west < 0.3, `stress each cycle ${m.west}`);
  assert.ok(closed >= later.length * 1 && closed <= later.length * 8, `closed ${closed} days over ${later.length} cycles`); assert.ok(opened >= later.length - 1, `reopened ${opened} times`);
  near(minima[2].west, minima[4].west, 0.05); near(minima[2].meanWest, minima[4].meanWest, 0.03);
  assert.equal(w.shortcut === 'open' || w.shortcut === 'regrowing' || w.shortcut === 'closed' || w.shortcut === 'closing', true);
  const wet = freshWatershed(); advance(wet, WET_DAYS - 0.5); assert.ok(wet.storage > 30, 'the wet season refills the spring');
});
test('the water balance is exact: storage change equals rain caught minus overflow, draw and seepage', () => {
  const w = freshWatershed(); const start = w.storage; const b = advance(w, 17.3);
  near(w.storage, start + b.caught - b.overflow - b.drawn - b.seeped, 1e-6);
  assert.ok(b.drawn <= DRAW_PER_DAY * 17.3 + 1e-9); assert.ok(b.rain > 0);
  const basin = freshWatershed(); cultivateBasin({ ...basin, sap: 50 }) ; basin.basin = true; const bb = advance(basin, 5); assert.ok(bb.caught > bb.rain * 1.4, 'the basin catches more of the same rain');
});
test('leaning the spring is a tradeoff: one grove gains what the other loses, and the shares always sum to one', () => {
  for (const a of ['balanced', 'west', 'east'] as const) near(shares(a).west + shares(a).east, 1);
  const balanced = cycleMinima(() => {}, 2).minima[1], west = cycleMinima(w => { assert.ok(redirect(w, 'west')); }, 2).minima[1];
  assert.ok(west.meanWest > balanced.meanWest + 0.03, `west grove better ${west.meanWest} vs ${balanced.meanWest}`);
  assert.ok(west.meanEast < balanced.meanEast - 0.03, `east grove worse ${west.meanEast} vs ${balanced.meanEast}`);
  const w = freshWatershed(); w.sap = 7; assert.equal(redirect(w, 'west'), false); w.sap = 8; assert.equal(redirect(w, 'west'), true); assert.equal(w.sap, 0); assert.equal(redirect(w, 'west'), false);
});
test('the moss basin keeps the spring through the dry so the fine root never closes; it is bought once', () => {
  const { minima, w } = cycleMinima(w => { assert.ok(cultivateBasin(w)); }, 3);
  for (const m of minima.slice(1)) { assert.equal(m.closed, 0); assert.ok(m.west > 0.4, `no stress with the basin ${m.west}`); }
  assert.equal(w.basin, true); w.sap = SAP_CAP; assert.equal(cultivateBasin(w), false);
  const poor = freshWatershed(); poor.sap = BASIN_COST - 1; assert.equal(cultivateBasin(poor), false); poor.sap = BASIN_COST; assert.equal(cultivateBasin(poor), true); assert.equal(poor.sap, 0);
  assert.equal(REDIRECT_COST, 8);
});
test('the fine root closes with hysteresis, is held open while an awareness is inside, and regrows after recovery', () => {
  const w = freshWatershed(); const soil = makeSoil(() => w, () => false);
  const mid = FINE.curve.getPointAt(0.5); assert.ok(insideFine(mid)); assert.ok(!insideFine(NODES.west)); assert.ok(!insideFine(NODES.spring));
  assert.ok(soil.canOccupy(mid, .25, .72)); assert.ok(soil.canOccupy(EDGES[0].curve.getPointAt(.5), .25, .72));
  // Drive it into stress and watch it withdraw.
  let guard = 0; while (w.shortcut === 'open' && guard++ < 4000) advance(w, .05); assert.equal(w.shortcut, 'closing'); assert.ok(stressOf(w) < 0.3);
  // Hold: with an awareness inside, closing never completes; the passage stays occupiable.
  advance(w, CLOSING_DAYS + 3, true); assert.equal(w.shortcut, 'closing'); assert.ok(makeSoil(() => w, () => true).canOccupy(mid, .25, .72));
  assert.equal(soil.canOccupy(mid, .25, .72), false, 'someone outside cannot enter a withdrawing root');
  advance(w, .1, false); assert.equal(w.shortcut, 'closed'); assert.equal(soil.canOccupy(mid, .25, .72), false);
  assert.ok(isPassable(EDGES[0], w, false) && isPassable(EDGES[1], w, false), 'the deep route is always usable');
  const g = guide(NODES.west.clone().add(vec(0.3, 0, -0.2)), 'east', w, false); assert.ok(g.z < NODES.west.z, 'the guide now points down the deep root, not across');
  guard = 0; while (w.shortcut !== 'open' && guard++ < 6000) advance(w, .05); assert.equal(w.shortcut, 'open'); assert.ok(soil.canOccupy(mid, .25, .72));
  assert.ok(CLOSE_AFTER_DAYS > 0);
});
test('saves are validated and a save cannot keep a withdrawing root open', () => {
  assert.deepEqual(parseWatershed('nonsense').allocation, 'balanced'); assert.equal(parseWatershed('{"sap":999,"basin":"yes"}').sap, 120); assert.equal(parseWatershed('{"sap":999,"basin":"yes"}').basin, false);
  const p = parseWatershed('{"shortcut":"closing","storage":500,"west":{"moisture":7},"log":[{"day":1,"text":"ok"},{"text":"bad"}]}');
  assert.equal(p.shortcut, 'closed'); assert.equal(p.storage, 40); assert.equal(p.west.moisture, 1); assert.equal(p.log.length, 1);
  const w = freshWatershed(); w.sap = 30; redirect(w, 'east'); const back = parseWatershed(JSON.stringify(w)); assert.equal(back.allocation, 'east'); assert.equal(back.sap, 22);
});
