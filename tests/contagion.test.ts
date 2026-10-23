import { test } from 'node:test'; import assert from 'node:assert/strict';
import { removeGerms, GERM_REACH, freshGrowth, stepGrowth, addGerm, serializeGrowth, parseGrowth, indexGrowth, ringOf, depthOf, veinOf, inGrowth, hyphaSegments, germAt, nearestFront, hubsWithin, hubNeighbours, hubKey, germHubs, germRing, fieldStamp, TIPS, STEP, STARVE_DAYS, MAT, VEIN_W, MILD_W, MAT_DEPTH, MILD_DEPTH, PULL_SOFTEN, FOOD_DY, FOOD_PER_TIP, type Growth, type GrowthInputs, type HubRef } from '../src/contagionModel';
import { TAINT, ringAt, depthAt, veinAt, inTaint } from '../src/taintModel';
import { hubAt } from '../src/chunkModel';
import { lairPlace, LAIR_DISTANCE } from '../src/overworldModel';

const SEED = 1, lair = lairPlace(SEED), village = { x: 0, z: 0 };
const fed = (over: Partial<GrowthInputs> = {}): GrowthInputs => ({ nourish: [{ x: village.x, z: village.z, w: 8 }], irritants: [], infantsTaken: 1, darkYoungBred: 0, meals: 0, ...over });
const hub = (k: string): { x: number; z: number } => { const [a, b] = k.split(',').map(Number); return hubAt(a, b, SEED); };
const nearestTo = (g: Growth, x: number, z: number): number => nearestFront(indexGrowth(g, SEED), x, z)!.d;
const grow = (days: number, inputs = fed(), from = freshGrowth(SEED)): Growth => { let g = from; for (let i = 0; i < days; i++) g = stepGrowth(g, SEED, inputs); return g; };

test('fresh growth: the breach alone, with M1\'s reach, and exactly the hubs within its edge claimed', () => {
  const g = freshGrowth(SEED); assert.equal(g.day, 0); assert.equal(g.germs.length, 1); assert.equal(g.germs[0].kind, 'breach'); assert.equal(g.germs[0].reach, TAINT.edge); assert.deepEqual({ x: g.germs[0].x, z: g.germs[0].z }, { x: lair.x, z: lair.z });
  assert.equal(g.hyphae.length, 0); assert.equal(g.food, 0); assert.equal(g.starved, 0); assert.equal(g.fed, false, 'seeking: it has not fed');
  const inside = new Set<string>(); for (let cx = -40; cx <= 40; cx++) for (let cz = -40; cz <= 40; cz++) { const h = hubAt(cx, cz, SEED); if (Math.hypot(h.x - lair.x, h.z - lair.z) < TAINT.edge) inside.add(hubKey(cx, cz)); }
  assert.deepEqual(new Set(g.claimed), inside, 'every hub within the edge and no other'); assert.ok(g.claimed.length > 250 && g.claimed.length < 400, `${g.claimed.length} hubs in the breach`);
  assert.deepEqual(g.claimed, [...g.claimed].sort(), 'claimed is sorted'); assert.deepEqual(freshGrowth(SEED), freshGrowth(SEED), 'deterministic');
  assert.equal(hubNeighbours([2, 3]).length, 8); assert.deepEqual(hubsWithin(lair.x, lair.z, TAINT.edge, SEED).map(h => hubKey(h[0], h[1])).sort(), g.claimed);
});

test('a step with nourishment grows the TIPS hungriest open edges and only them; with nothing to seek she sits', () => {
  const g0 = freshGrowth(SEED), claimed = new Set(g0.claimed);
  // Appetite is the far hub's: the TIPS unclaimed neighbours of the claimed set nearest the village.
  const open = new Map<string, number>(); for (const k of claimed) for (const n of hubNeighbours(k.split(',').map(Number) as HubRef)) { const nk = hubKey(n[0], n[1]); if (claimed.has(nk) || open.has(nk)) continue; const p = hubAt(n[0], n[1], SEED); open.set(nk, 8 / (Math.hypot(p.x - village.x, p.z - village.z) + PULL_SOFTEN)); }
  const want = [...open.entries()].sort((a, b) => b[1] - a[1]).slice(0, TIPS).map(e => e[0]).sort();
  const g1 = stepGrowth(g0, SEED, fed()); assert.equal(g1.day, 1); assert.equal(g1.hyphae.length, TIPS);
  assert.deepEqual(g1.hyphae.map(h => hubKey(h.to[0], h.to[1])).sort(), want, 'the three hungriest far hubs'); for (const h of g1.hyphae) { assert.ok(claimed.has(hubKey(h.from[0], h.from[1])), 'grown from a claimed hub'); assert.ok(h.t > 0 && h.t < 1); const a = hub(hubKey(h.from[0], h.from[1])), b = hub(hubKey(h.to[0], h.to[1])); assert.ok(Math.abs(h.t * Math.hypot(b.x - a.x, b.z - a.z) - STEP) < 1e-6, 'STEP metres along the edge'); }
  assert.deepEqual(g1.claimed, g0.claimed, 'no hub claimed on the first day'); assert.deepEqual(stepGrowth(g0, SEED, fed()), g1, 'deterministic');
  const sit = stepGrowth(g0, SEED, fed({ nourish: [] })); assert.equal(sit.hyphae.length, 0, 'no appetite, no growth');
  // Food buys a tip: a Dark Young bred of an infant.
  const more = stepGrowth(g0, SEED, fed({ darkYoungBred: 1 })); assert.equal(more.hyphae.length, TIPS + Math.floor((FOOD_DY - 1) / FOOD_PER_TIP)); assert.ok(more.food > 0);
  assert.ok(g0.hyphae.length === 0 && g0.claimed.length === claimed.size, 'the step never mutates its input');
});

test('the pace (Noah: about twelve days to the first village if she does nothing): with no infant taken on any day the front\'s nearest hub reaches the village\'s own hub on day 10 to 14', () => {
  // Hubs sit near chunk centres: the hub nearest the village's origin stands 46 m off at this seed, so "reached" is within 50 m. C1.1: a fresh world has no infant to snatch; unfed, the growth seeks and never starves.
  const g0 = freshGrowth(SEED), start = nearestTo(g0, village.x, village.z), nothing = fed({ infantsTaken: 0 }); assert.ok(Math.abs(Math.hypot(lair.x, lair.z) - LAIR_DISTANCE) < 40, `the breach ${Math.hypot(lair.x, lair.z).toFixed(0)} m from the village`); assert.ok(start > 450 && start < 560, `the edge's nearest hub ${start.toFixed(0)} m from the village`);
  let g = g0, reached = 0, last = start; for (let day = 1; day <= 20 && !reached; day++) { g = stepGrowth(g, SEED, nothing); assert.equal(g.fed, false, 'still seeking'); assert.equal(g.starved, 0, 'no starvation before it has fed'); const d = nearestTo(g, village.x, village.z); assert.ok(d <= last + 1e-9, 'the front never recedes while seeking'); last = d; if (d < 50) reached = day; }
  assert.ok(reached >= 10 && reached <= 14, `reached on day ${reached}`); console.log(`  pace: the edge's nearest hub ${start.toFixed(0)} m from the village, reached on day ${reached} with no infant taken (STEP ${STEP}, TIPS ${TIPS})`);
  // Fed every night it is the same pace (feeding does not hurry it; food does).
  let f = g0, fr = 0; for (let day = 1; day <= 20 && !fr; day++) { f = stepGrowth(f, SEED, fed()); assert.equal(f.fed, true); if (nearestTo(f, village.x, village.z) < 50) fr = day; } assert.equal(fr, reached, 'fed nightly, the same day');
});

test('an irritant: its hubs are never claimed, and a hypha into one withers until the hub is unclaimed; the breach\'s hubs never', () => {
  const shield = { x: village.x, z: village.z, r: 300 }, shut = grow(20, fed({ irritants: [shield] }));
  for (const k of shut.claimed) { const p = hub(k); assert.ok(Math.hypot(p.x - shield.x, p.z - shield.z) >= shield.r, `${k} claimed inside the irritant`); } for (const h of shut.hyphae) { const p = hub(hubKey(h.to[0], h.to[1])); assert.ok(Math.hypot(p.x - shield.x, p.z - shield.z) >= shield.r, 'no hypha into the irritant'); }
  assert.ok(nearestTo(shut, village.x, village.z) >= shield.r, 'the front stops at the irritant'); assert.ok(shut.claimed.length > freshGrowth(SEED).claimed.length, 'but grew round it');
  // A ward woken on the front: the hub it stands over loses its hyphae and its claim.
  const g6 = grow(6), idx6 = indexGrowth(g6, SEED), tip = nearestFront(idx6, village.x, village.z)!, ward = { x: tip.x, z: tip.z, r: 100 };
  const tipKey = idx6.claimed.find(h => h.x === tip.x && h.z === tip.z)!.key; assert.ok(!germHubs(g6.germs, SEED).has(tipKey), 'the front\'s nearest hub is a grown one');
  const before = g6.hyphae.filter(h => hubKey(h.to[0], h.to[1]) === tipKey); assert.ok(before.length > 0 && before.every(h => h.t === 1));
  const g7 = stepGrowth(g6, SEED, fed({ irritants: [ward] })), after = g7.hyphae.filter(h => hubKey(h.to[0], h.to[1]) === tipKey); assert.ok(after.every(h => h.t < 1), 'withering although fed');
  let g = g7; for (let i = 0; i < 4; i++) g = stepGrowth(g, SEED, fed({ irritants: [ward] }));
  assert.ok(!g.claimed.includes(tipKey), 'the hub is unclaimed'); assert.ok(g.hyphae.every(h => hubKey(h.to[0], h.to[1]) !== tipKey), 'its hyphae are gone');
  for (const k of freshGrowth(SEED).claimed) assert.ok(g.claimed.includes(k), 'the breach keeps its hubs');
  const inBreach = grow(3, fed({ irritants: [{ x: lair.x, z: lair.z, r: TAINT.edge + 50 }] })); assert.deepEqual(new Set(freshGrowth(SEED).claimed).size, new Set(inBreach.claimed.filter(k => freshGrowth(SEED).claimed.includes(k))).size, 'an irritant over the breach unclaims nothing of it');
});

test('starvation, once fed: no infant for STARVE_DAYS and the tips retreat, hubs unclaim, the breach\'s never; an infant taken ends it; withered to nothing it seeks again', () => {
  const g8 = grow(8), d8 = nearestTo(g8, village.x, village.z), starve = fed({ infantsTaken: 0 }); assert.equal(g8.fed, true, 'fed by the infants taken');
  let g = g8; for (let i = 1; i < STARVE_DAYS; i++) { g = stepGrowth(g, SEED, starve); assert.equal(g.starved, i); assert.ok(nearestTo(g, village.x, village.z) <= d8, 'still growing before STARVE_DAYS'); }
  const length = (x: Growth): number => x.hyphae.reduce((s, h) => s + h.t, 0), full = g.hyphae.filter(h => h.t === 1).length, before = length(g), hubs = g.claimed.length, dPre = nearestTo(g, village.x, village.z);
  g = stepGrowth(g, SEED, starve); assert.equal(g.starved, STARVE_DAYS); assert.ok(length(g) < before, 'the tips retreat (the growing hyphae first)'); assert.ok(g.hyphae.every(h => h.t > 0)); assert.ok(g.claimed.length <= hubs, 'no hub claimed while starving');
  g = stepGrowth(g, SEED, starve); assert.ok(g.hyphae.filter(h => h.t === 1).length < full, 'then the full hyphae into the leaves'); assert.ok(g.claimed.length < hubs, 'and hubs unclaim');
  const nearer = nearestTo(g, village.x, village.z); assert.ok(nearer > dPre, 'the front recedes');
  // Starved on, it withers back to the breach alone; that day it forgets it ever fed, and the next it seeks again, unstarvable until it feeds.
  let bareDay = 0; for (let i = 0; i < 30 && !bareDay; i++) { g = stepGrowth(g, SEED, starve); if (g.hyphae.length === 0) bareDay = g.day; else { assert.equal(g.fed, true, 'starving while anything is left'); assert.ok(g.starved >= STARVE_DAYS); } }
  assert.ok(bareDay > 0, 'withered to nothing within 30 days'); assert.deepEqual(g.claimed, freshGrowth(SEED).claimed, 'back to the breach\'s own hubs, all of them'); assert.equal(g.germs.length, 1); assert.equal(g.fed, false, 'bare: it has not fed'); assert.equal(g.starved, 0);
  const seeks = stepGrowth(g, SEED, starve); assert.equal(seeks.hyphae.length, TIPS, 'seeks again on nothing'); assert.equal(seeks.fed, false); assert.equal(seeks.starved, 0); const on = grow(10, starve, seeks); assert.equal(on.starved, 0, 'never starves until it feeds'); assert.ok(on.hyphae.length > TIPS);
  // Fed again, it grows again from where it stands.
  const again = stepGrowth(g, SEED, fed()); assert.equal(again.starved, 0); assert.equal(again.fed, true); assert.equal(again.hyphae.length, TIPS);
  // Mid-collapse an infant taken halts the retreat.
  const pre = stepGrowth(stepGrowth(stepGrowth(g8, SEED, starve), SEED, starve), SEED, starve); assert.equal(pre.starved, STARVE_DAYS); const kept = stepGrowth(pre, SEED, starve), halted = stepGrowth(pre, SEED, fed()); assert.equal(halted.starved, 0); assert.ok(nearestTo(halted, village.x, village.z) < nearestTo(kept, village.x, village.z), 'the infant taken, the front grows where the starving one receded');
  // A Dark Young bred feeds it too (an infant was taken for it); it can starve from then.
  const bred = stepGrowth(freshGrowth(SEED), SEED, fed({ infantsTaken: 0, darkYoungBred: 1 })); assert.equal(bred.fed, true); assert.equal(grow(STARVE_DAYS, starve, bred).starved, STARVE_DAYS + 1);
});

test('serialize and parse round-trip; parse tolerates junk and always keeps the breach', () => {
  const g = grow(9, fed({ darkYoungBred: 1, meals: 2 })); const back = parseGrowth(serializeGrowth(g), SEED);
  assert.equal(back.day, g.day); assert.equal(back.starved, g.starved); assert.equal(back.fed, true); assert.ok(Math.abs(back.food - g.food) < 1e-3); assert.deepEqual(back.claimed, g.claimed); assert.equal(back.hyphae.length, g.hyphae.length); for (let i = 0; i < g.hyphae.length; i++) assert.ok(Math.abs(back.hyphae[i].t - g.hyphae[i].t) < 1e-3);
  assert.equal(serializeGrowth(parseGrowth(serializeGrowth(back), SEED)), serializeGrowth(back), 'stable');
  const next = stepGrowth(back, SEED, fed()), nextG = stepGrowth(g, SEED, fed()); assert.deepEqual(next.claimed, nextG.claimed, 'a parsed growth steps as the live one');
  for (const junk of [null, '', 'garbage', '[]', '5', '{"germs":5,"hyphae":"x"}', '{"day":-3,"germs":[{"id":"breach","kind":"breach","x":0,"z":0,"reach":10}],"claimed":["a,b"],"hyphae":[{"from":[1,1],"to":[9,9],"t":0.5},{"from":[1,1],"to":[2,1],"t":"no"},{"from":[0,0],"to":[1,0],"t":7}]}']) {
    const p = parseGrowth(junk, SEED); assert.equal(p.germs.length, 1); assert.equal(p.germs[0].kind, 'breach'); assert.equal(p.germs[0].reach, TAINT.edge); assert.deepEqual(p.claimed, freshGrowth(SEED).claimed, `junk ${JSON.stringify(junk)}: the breach's hubs`); assert.equal(p.hyphae.length, 0); assert.ok(p.day >= 0 && p.starved >= 0 && p.food >= 0); assert.equal(p.fed, false);
  }
  // `fed` round-trips; a save from before it (C1) is unfed and unstarved; junk in it is false.
  const starvedFed = grow(2, fed({ infantsTaken: 0 }), g), fedBack = parseGrowth(serializeGrowth(starvedFed), SEED); assert.equal(fedBack.fed, true); assert.equal(fedBack.starved, 2);
  const unfed = parseGrowth(serializeGrowth(grow(3, fed({ infantsTaken: 0 }))), SEED); assert.equal(unfed.fed, false); assert.equal(unfed.starved, 0);
  const old = parseGrowth(JSON.stringify({ ...JSON.parse(serializeGrowth(starvedFed)), fed: undefined }), SEED); assert.equal(old.fed, false); assert.equal(old.starved, 0, 'an old save\'s starved count is dropped with its fed'); assert.deepEqual(old.claimed, starvedFed.claimed);
  assert.equal(parseGrowth(JSON.stringify({ ...JSON.parse(serializeGrowth(starvedFed)), fed: 'yes' }), SEED).fed, false);
  // A lesser germ survives the round trip; a hypha from a hub nobody claims does not.
  const withGerm = addGerm(g, { id: 'village-2', kind: 'village', x: -693, z: -262, reach: 150 }, SEED), p = parseGrowth(serializeGrowth(withGerm), SEED); assert.equal(p.germs.length, 2); assert.deepEqual(p.claimed, withGerm.claimed);
  const orphan = parseGrowth(JSON.stringify({ day: 1, germs: [], claimed: [], hyphae: [{ from: [-30, -30], to: [-29, -30], t: 1 }], food: 0, starved: 0 }), SEED); assert.equal(orphan.hyphae.length, 0); assert.ok(!orphan.claimed.includes('-29,-30'));
});

test('day one reads as M1: within the breach\'s edge and its veins\' reach, ringOf, depthOf, veinOf and inGrowth agree with taintModel', () => {
  const idx = indexGrowth(freshGrowth(SEED), SEED); let n = 0;
  for (let x = lair.x - 900; x <= lair.x + 900; x += 15) for (let z = lair.z - 900; z <= lair.z + 900; z += 15) {
    const d = Math.hypot(x - lair.x, z - lair.z); assert.equal(ringOf(idx, x, z), ringAt(d)); assert.ok(Math.abs(depthOf(idx, x, z) - depthAt(d)) < 1e-9); assert.ok(Math.abs(veinOf(idx, x, z) - veinAt(d)) < 1e-9); assert.equal(inGrowth(idx, x, z), inTaint(lair, x, z)); n++;
  }
  assert.ok(n > 10000); assert.equal(germAt(idx, lair.x + 100, lair.z), idx.germs[0]); assert.equal(germAt(idx, lair.x + 700, lair.z), null);
  const f = nearestFront(idx, village.x, village.z)!; const toLair = ((Math.atan2(lair.x, -lair.z) * 180 / Math.PI) + 360) % 360; assert.ok(Math.abs(((f.bearing - toLair + 540) % 360) - 180) < 30, `the front lies toward the breach (${f.bearing.toFixed(0)} vs ${toLair.toFixed(0)})`);
});

test('a grown hub reads grey within its mat, a hypha\'s claimed length grey within VEIN_W, a mild band past either, and the vein fades past the tip', () => {
  const g = grow(8), idx = indexGrowth(g, SEED), segs = hyphaSegments(idx); assert.equal(segs.length, g.hyphae.length);
  const mats = idx.mats; assert.ok(mats.length > 0, 'hubs claimed outside the edge'); assert.ok(idx.claimed.length === g.claimed.length);
  const lone = mats.map(m => ({ m, apart: Math.min(...mats.filter(o => o !== m).map(o => Math.hypot(o.x - m.x, o.z - m.z)), Infinity) })).sort((a, b) => b.apart - a.apart)[0].m;
  assert.equal(ringOf(idx, lone.x, lone.z), 'grey'); assert.equal(depthOf(idx, lone.x, lone.z), MAT_DEPTH); assert.ok(inGrowth(idx, lone.x, lone.z)); assert.ok(Math.hypot(lone.x - lair.x, lone.z - lair.z) > TAINT.edge, 'outside the breach');
  // Straight away from the breach and from every hypha: the mat's grey to MAT, mild for MILD_W past it, then nothing.
  const away = (r: number): { x: number; z: number } => { const ux = (lone.x - lair.x) / Math.hypot(lone.x - lair.x, lone.z - lair.z), uz = (lone.z - lair.z) / Math.hypot(lone.x - lair.x, lone.z - lair.z); return { x: lone.x + ux * r, z: lone.z + uz * r }; };
  const clear = (p: { x: number; z: number }): boolean => segs.every(s => { const px = p.x - s.a.x, pz = p.z - s.a.z, ux = (s.b.x - s.a.x) / Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), uz = (s.b.z - s.a.z) / Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), along = Math.max(0, Math.min(Math.hypot(s.tip.x - s.a.x, s.tip.z - s.a.z), px * ux + pz * uz)); return Math.hypot(px - ux * along, pz - uz * along) > VEIN_W + MILD_W; });
  for (const r of [MAT - 1, MAT + 1, MAT + MILD_W - 1, MAT + MILD_W + 1]) { const p = away(r); if (!clear(p) || Math.hypot(p.x - lair.x, p.z - lair.z) < TAINT.edge) continue; const want = r < MAT ? 'grey' : r < MAT + MILD_W ? 'mild' : null; assert.equal(ringOf(idx, p.x, p.z), want, `${r} m from a lone mat`); if (want === 'mild') { const dd = depthOf(idx, p.x, p.z); assert.ok(dd > 0 && dd <= MILD_DEPTH); } if (want === null) assert.equal(depthOf(idx, p.x, p.z), 0); }
  // A hypha still growing: grey on its claimed length, the vein full there and fading past the tip, none far past.
  const s = segs.find(x => x.t < 1 && x.t > 0.3)!; assert.ok(s, 'a partial hypha'); const mid = { x: s.a.x + (s.tip.x - s.a.x) * 0.6, z: s.a.z + (s.tip.z - s.a.z) * 0.6 };
  if (Math.hypot(mid.x - lair.x, mid.z - lair.z) >= TAINT.edge) { assert.equal(ringOf(idx, mid.x, mid.z), 'grey'); assert.ok(depthOf(idx, mid.x, mid.z) >= MAT_DEPTH); }
  assert.equal(veinOf(idx, mid.x, mid.z), 1); const len = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z), ux = (s.b.x - s.a.x) / len, uz = (s.b.z - s.a.z) / len, past = { x: s.tip.x + ux * 30, z: s.tip.z + uz * 30 };
  if (Math.hypot(past.x - lair.x, past.z - lair.z) > TAINT.edge + TAINT.veins) { const v = veinOf(idx, past.x, past.z); assert.ok(v > 0 && v < 1, `fading past the tip: ${v}`); assert.ok(v < veinOf(idx, s.tip.x + ux * 10, s.tip.z + uz * 10)); }
  const side = { x: mid.x - uz * (VEIN_W + 2), z: mid.z + ux * (VEIN_W + 2) }; assert.equal(veinOf(idx, side.x, side.z) >= 1, false, 'the vein is the line, not a field, beyond VEIN_W');
  const full = segs.filter(x => x.t === 1); assert.ok(full.length > 0); for (const f of full) assert.deepEqual(f.tip, f.b);
});

test('a lesser germ: its rings scaled by its reach, its hubs claimed at once, starved to nothing while the breach stands', () => {
  const germ = { id: 'village-2', kind: 'village' as const, x: -693, z: -262, reach: 150 }, g = addGerm(freshGrowth(SEED), germ, SEED), idx = indexGrowth(g, SEED);
  assert.equal(g.germs.length, 2); for (const h of hubsWithin(germ.x, germ.z, germ.reach, SEED)) assert.ok(g.claimed.includes(hubKey(h[0], h[1])));
  assert.equal(germRing(germ, 10), 'nursery'); assert.equal(germRing(germ, 100), 'grey'); assert.equal(germRing(germ, 140), 'mild'); assert.equal(germRing(germ, 151), null); assert.equal(ringOf(idx, germ.x + 100, germ.z), 'grey'); assert.equal(germAt(idx, germ.x + 100, germ.z)!.id, 'village-2'); assert.ok(depthOf(idx, germ.x + 15, germ.z) > 0.85 && depthOf(idx, germ.x + 149, germ.z) < 0.02); assert.equal(veinOf(idx, germ.x + 149, germ.z), 1); assert.ok(veinOf(idx, germ.x + 150 + TAINT.veins / 2, germ.z) > 0.4);
  // Unfed it stands (the growth seeks); fed once and then starved, it shrinks STEP a day to nothing while the breach stands, and only then does the growth seek again.
  const stood = grow(12, fed({ nourish: [], infantsTaken: 0 }), g); assert.equal(stood.germs.length, 2, 'unfed, nothing starves'); assert.equal(stood.germs[1].reach, 150);
  let s = stepGrowth(g, SEED, fed({ nourish: [] })); assert.equal(s.fed, true); let gone = 0;
  for (let i = 0; i < 12; i++) { s = stepGrowth(s, SEED, fed({ nourish: [], infantsTaken: 0 })); if (s.germs.length === 2) { assert.equal(s.fed, true, 'starving on while the germ lasts'); assert.ok(s.germs[1].reach <= 150 - Math.max(0, s.starved - STARVE_DAYS + 1) * STEP + 1e-9); } else if (!gone) { gone = s.day; assert.equal(s.fed, false, 'the germ gone and no hypha left: it seeks again'); } }
  assert.ok(gone > 0, 'the lesser germ withered away'); assert.equal(s.germs.length, 1); assert.equal(s.germs[0].kind, 'breach'); assert.equal(s.germs[0].reach, TAINT.edge); assert.deepEqual(s.claimed, freshGrowth(SEED).claimed);
});

test('fieldStamp: where a rectangle\'s stamp is unchanged by a step, every read in it is unchanged; where the front moved, it differs', () => {
  const TILE = 64, half = 1280; let g = freshGrowth(SEED), prev = indexGrowth(g, SEED), same = 0, moved = 0, movedReads = 0;
  for (let day = 1; day <= 14; day++) {
    g = stepGrowth(g, SEED, day % 5 === 0 ? fed({ darkYoungBred: 1 }) : fed()); const idx = indexGrowth(g, SEED);
    for (let x0 = -half; x0 < half; x0 += TILE) for (let z0 = -half; z0 < half; z0 += TILE) {
      const x1 = x0 + TILE - 1e-3, z1 = z0 + TILE - 1e-3, a = fieldStamp(prev, x0, z0, x1, z1), b = fieldStamp(idx, x0, z0, x1, z1); let differs = false;
      for (let x = x0; x <= x1; x += 4) for (let z = z0; z <= z1; z += 4) { if (ringOf(prev, x, z) !== ringOf(idx, x, z) || depthOf(prev, x, z) !== depthOf(idx, x, z) || veinOf(prev, x, z) !== veinOf(idx, x, z)) { differs = true; break; } }
      if (a === b) { same++; assert.ok(!differs, `day ${day}: the stamp of (${x0}, ${z0}) is unchanged but a read in it moved`); } else { moved++; if (differs) movedReads++; }
    }
    prev = idx;
  }
  assert.ok(same > moved * 20, `most tiles keep their stamp (${same} kept, ${moved} moved)`); assert.ok(moved > 14 && movedReads > 14, `the front moved somewhere each day (${moved}, ${movedReads} with reads moved)`);
  // A stamp spans the cells a rectangle covers; the breach's germ is in every stamp its reach and veins touch, and in no stamp far away.
  const idx = indexGrowth(g, SEED); assert.ok(fieldStamp(idx, lair.x - 10, lair.z - 10, lair.x + 10, lair.z + 10).startsWith('breach:')); assert.equal(fieldStamp(idx, lair.x + 2000, lair.z + 2000, lair.x + 2010, lair.z + 2010), '');
  const wide = fieldStamp(idx, -half, -half, half, half); for (const h of g.hyphae) assert.ok(wide.includes(`s${h.from[0]},${h.from[1]}>${h.to[0]},${h.to[1]}:`), 'every hypha is in the wide stamp');
});

test('the field reads are cheap: a 12-day growth indexed, 200k reads under a second', () => {
  const g = grow(12), t0 = performance.now(), idx = indexGrowth(g, SEED), t1 = performance.now(); let n = 0, d = 0;
  for (let i = 0; i < 100000; i++) { const x = (i % 500) * 4 - 400, z = Math.floor(i / 500) * 5 - 1000; if (ringOf(idx, x, z)) n++; d += depthOf(idx, x, z); }
  const ms = performance.now() - t0; assert.ok(ms < 1000, `${ms.toFixed(0)} ms`); assert.ok(n > 1000 && d > 0); console.log(`  index ${(t1 - t0).toFixed(1)} ms, 200k reads ${(ms - (t1 - t0)).toFixed(0)} ms`);
});

test('C2: removeGerms takes a lesser germ away and rebuilds the closure (the hubs only it claimed let go, the hyphae from them with them); the breach is never removed; GERM_REACH as set', () => {
  const g0 = freshGrowth(SEED), germ = { id: 'germ:village', kind: 'village' as const, x: 0, z: 0, reach: GERM_REACH.village }, g1 = addGerm(g0, germ, SEED);
  assert.ok(g1.claimed.length > g0.claimed.length, 'the village germ claims the hubs within its reach'); assert.equal(GERM_REACH.village, 110); assert.equal(GERM_REACH.warren, 40);
  const back = removeGerms(g1, x => x.kind === 'village', SEED); assert.deepEqual(back.germs, g0.germs); assert.deepEqual(back.claimed, g0.claimed, 'the closure is the breach\'s again'); assert.equal(removeGerms(g0, () => true, SEED), g0, 'nothing to remove: the same growth');
  assert.equal(removeGerms(g1, x => x.kind === 'breach', SEED), g1, 'the breach is never removed');
  // A hypha grown from a hub the germ claimed dies with the germ.
  let g = g1; for (let i = 0; i < 2; i++) g = stepGrowth(g, SEED, fed({ nourish: [{ x: 0, z: 400, w: 8 }] }));
  const fromGerm = g.hyphae.filter(h => !g0.claimed.includes(hubKey(h.from[0], h.from[1]))); assert.ok(fromGerm.length > 0, 'hyphae grew out of the germ\'s hubs');
  const gone = removeGerms(g, x => x.id === 'germ:village', SEED); assert.ok(gone.hyphae.every(h => g0.claimed.includes(hubKey(h.from[0], h.from[1])) || gone.claimed.includes(hubKey(h.from[0], h.from[1]))), 'no hypha left without a claimed source'); assert.ok(gone.hyphae.length < g.hyphae.length);
});

// C3 (CONTAGION.md, the bulwark): the thriving village's push, and what the map needs: the withered record and the tips' direction.
import { witheredSegments, WITHERED_DAYS, WITHERED_MAX, type Withered } from '../src/contagionModel';
import { VILLAGE_HOLD_R } from '../src/villageModel';
test('C3: a thriving, shrined village is an irritant of VILLAGE_HOLD_R: its hubs are never claimed and the front stops at the ring; the push dropped (pressured), the front claims a hub inside within a few dawns', () => {
  const push = { x: village.x, z: village.z, r: VILLAGE_HOLD_R }, held = grow(24, fed({ irritants: [push] }));
  for (const k of held.claimed) { const p = hub(k); assert.ok(Math.hypot(p.x - village.x, p.z - village.z) >= VILLAGE_HOLD_R, `${k} claimed within the village's push`); }
  assert.ok(nearestTo(held, village.x, village.z) >= VILLAGE_HOLD_R && nearestTo(held, village.x, village.z) < VILLAGE_HOLD_R + 120, `the front waits at the ring (${nearestTo(held, village.x, village.z).toFixed(0)} m)`);
  let g = held, inside = 0; for (let day = 1; day <= 4 && !inside; day++) { g = stepGrowth(g, SEED, fed()); if (nearestTo(g, village.x, village.z) < VILLAGE_HOLD_R) inside = day; }
  assert.ok(inside >= 1 && inside <= 4, `the push gone, a hub inside is claimed on day ${inside}`);
  const back = stepGrowth(g, SEED, fed({ irritants: [push] })); assert.ok(nearestTo(back, village.x, village.z) >= VILLAGE_HOLD_R, 'thriving again, the hub inside is let go at the next dawn'); assert.ok(back.withered.length > 0, 'and the loss is on record');
});
test('C3: what withered is kept for the map, with its day, WITHERED_DAYS days and WITHERED_MAX records at most: a tip drawn back by an irritant, a front starved, a germ taken away; hyphaSegments gives each tip its direction; saved and parsed tolerantly', () => {
  assert.equal(WITHERED_DAYS, 1);
  const g6 = grow(6); assert.equal(g6.withered.length, 0, 'nothing lost while it only grows'); const idx6 = indexGrowth(g6, SEED), tip = nearestFront(idx6, village.x, village.z)!, ward = { x: tip.x, z: tip.z, r: 100 };
  const g7 = stepGrowth(g6, SEED, fed({ irritants: [ward] })); assert.ok(g7.withered.length > 0, 'the hyphae into the ward lost length');
  for (const w of g7.withered) { assert.equal(w.day, 7); assert.ok(w.t0 >= 0 && w.t1 <= 1 && w.t0 < w.t1); const before = g6.hyphae.find(h => hubKey(h.from[0], h.from[1]) === hubKey(w.from[0], w.from[1]) && hubKey(h.to[0], h.to[1]) === hubKey(w.to[0], w.to[1]))!; assert.ok(before, 'an edge that had a hypha'); assert.ok(Math.abs(w.t1 - Math.min(1, before.t)) < 1e-9, 'from where its tip stood'); const after = g7.hyphae.find(h => hubKey(h.from[0], h.from[1]) === hubKey(w.from[0], w.from[1]) && hubKey(h.to[0], h.to[1]) === hubKey(w.to[0], w.to[1])); assert.ok(Math.abs(w.t0 - (after ? after.t : 0)) < 1e-9, 'to where it stands now'); }
  const segs = witheredSegments(g7, SEED); assert.equal(segs.length, g7.withered.length); for (let i = 0; i < segs.length; i++) { const w = g7.withered[i], a = hub(hubKey(w.from[0], w.from[1])), b = hub(hubKey(w.to[0], w.to[1])); assert.ok(Math.abs(segs[i].a.x - (a.x + (b.x - a.x) * w.t0)) < 1e-9 && Math.abs(segs[i].b.z - (a.z + (b.z - a.z) * w.t1)) < 1e-9, 'on the edge'); assert.equal(segs[i].day, 7); }
  const g8 = stepGrowth(g7, SEED, fed()); assert.equal(g8.withered.length, 0, 'the next day, with nothing lost, the record is cleared (WITHERED_DAYS)');
  // Starved: the tips that drew back are on record.
  let g = g8; for (let i = 0; i < STARVE_DAYS; i++) g = stepGrowth(g, SEED, fed({ infantsTaken: 0 })); assert.ok(g.withered.length > 0 && g.withered.every(w => w.day === g.day), 'the starving front\'s losses, dated today');
  // A germ taken away: the hyphae that grew from its hubs are on record at once.
  const withGerm = grow(2, fed(), addGerm(g8, { id: 'germ:village', kind: 'village', x: village.x, z: village.z, reach: GERM_REACH.village }, SEED)); assert.ok(withGerm.hyphae.some(h => germHubs(withGerm.germs, SEED).has(hubKey(h.from[0], h.from[1]))), 'hyphae out of the germ\'s hubs');
  const gone = removeGerms(withGerm, x => x.id === 'germ:village', SEED); assert.ok(gone.withered.length > 0 && gone.withered.every(w => w.day === withGerm.day && w.t0 === 0), 'dropped whole, today');
  // The tips' direction.
  for (const h of hyphaSegments(indexGrowth(g7, SEED))) { const len = Math.hypot(h.b.x - h.a.x, h.b.z - h.a.z); assert.ok(Math.abs(Math.hypot(h.dir.x, h.dir.z) - 1) < 1e-9); assert.ok(Math.abs(h.dir.x - (h.b.x - h.a.x) / len) < 1e-9 && Math.abs(h.dir.z - (h.b.z - h.a.z) / len) < 1e-9); }
  // Saved, bounded, tolerant.
  const back = parseGrowth(serializeGrowth(g7), SEED); assert.equal(back.withered.length, g7.withered.length); assert.deepEqual(back.withered.map(w => [w.from, w.to, w.day]), g7.withered.map(w => [w.from, w.to, w.day])); for (let i = 0; i < back.withered.length; i++) assert.ok(Math.abs(back.withered[i].t0 - g7.withered[i].t0) < 1e-4 && Math.abs(back.withered[i].t1 - g7.withered[i].t1) < 1e-4);
  const w0 = g7.withered[0], many: Withered[] = Array.from({ length: WITHERED_MAX + 50 }, () => ({ ...w0 })), flood = parseGrowth(JSON.stringify({ ...JSON.parse(serializeGrowth(g7)), withered: [...many, { from: w0.from, to: [w0.from[0] + 5, w0.from[1]], t0: 0, t1: 1, day: 7 }, { from: w0.from, to: w0.to, t0: 0.8, t1: 0.2, day: 7 }, { from: w0.from, to: w0.to, t0: 0, t1: 1, day: 2 }, 'junk', null] }), SEED);
  assert.equal(flood.withered.length, WITHERED_MAX, 'bounded; a far pair, an empty span, a stale day and junk are dropped'); assert.equal(parseGrowth(JSON.stringify({ ...JSON.parse(serializeGrowth(g7)), withered: undefined }), SEED).withered.length, 0, 'an old save loads with none');
});
