import { test } from 'node:test'; import assert from 'node:assert/strict';
import { freshGrowth, stepGrowth, addGerm, serializeGrowth, parseGrowth, indexGrowth, ringOf, depthOf, veinOf, inGrowth, hyphaSegments, germAt, nearestFront, hubsWithin, hubNeighbours, hubKey, germHubs, germRing, TIPS, STEP, STARVE_DAYS, MAT, VEIN_W, MILD_W, MAT_DEPTH, MILD_DEPTH, PULL_SOFTEN, FOOD_DY, FOOD_PER_TIP, type Growth, type GrowthInputs, type HubRef } from '../src/contagionModel';
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
  assert.equal(g.hyphae.length, 0); assert.equal(g.food, 0); assert.equal(g.starved, 0);
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

test('the pace (Noah: about twelve days to the first village): the front\'s nearest hub reaches the village\'s own hub on day 10 to 14', () => {
  // Hubs sit near chunk centres: the hub nearest the village's origin stands 46 m off at this seed, so "reached" is within 50 m. The snatchers come nightly while the village has infants, so doing nothing feeds the front an infant a day.
  const g0 = freshGrowth(SEED), start = nearestTo(g0, village.x, village.z); assert.ok(Math.abs(Math.hypot(lair.x, lair.z) - LAIR_DISTANCE) < 40, `the breach ${Math.hypot(lair.x, lair.z).toFixed(0)} m from the village`); assert.ok(start > 450 && start < 560, `the edge's nearest hub ${start.toFixed(0)} m from the village`);
  let g = g0, reached = 0, last = start; for (let day = 1; day <= 20 && !reached; day++) { g = stepGrowth(g, SEED, fed()); const d = nearestTo(g, village.x, village.z); assert.ok(d <= last + 1e-9, 'the front never recedes while fed'); last = d; if (d < 50) reached = day; }
  assert.ok(reached >= 10 && reached <= 14, `reached on day ${reached}`); console.log(`  pace: the edge's nearest hub ${start.toFixed(0)} m from the village, reached on day ${reached} (STEP ${STEP}, TIPS ${TIPS})`);
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

test('starvation: no infant for STARVE_DAYS and the tips retreat, hubs unclaim, the breach\'s never; an infant taken ends it', () => {
  const g8 = grow(8), d8 = nearestTo(g8, village.x, village.z), starve = fed({ infantsTaken: 0 });
  let g = g8; for (let i = 1; i < STARVE_DAYS; i++) { g = stepGrowth(g, SEED, starve); assert.equal(g.starved, i); assert.ok(nearestTo(g, village.x, village.z) <= d8, 'still growing before STARVE_DAYS'); }
  const length = (x: Growth): number => x.hyphae.reduce((s, h) => s + h.t, 0), full = g.hyphae.filter(h => h.t === 1).length, before = length(g), hubs = g.claimed.length, dPre = nearestTo(g, village.x, village.z);
  g = stepGrowth(g, SEED, starve); assert.equal(g.starved, STARVE_DAYS); assert.ok(length(g) < before, 'the tips retreat (the growing hyphae first)'); assert.ok(g.hyphae.every(h => h.t > 0)); assert.ok(g.claimed.length <= hubs, 'no hub claimed while starving');
  g = stepGrowth(g, SEED, starve); assert.ok(g.hyphae.filter(h => h.t === 1).length < full, 'then the full hyphae into the leaves'); assert.ok(g.claimed.length < hubs, 'and hubs unclaim');
  const nearer = nearestTo(g, village.x, village.z); assert.ok(nearer > dPre, 'the front recedes');
  for (let i = 0; i < 30; i++) g = stepGrowth(g, SEED, starve);
  assert.equal(g.hyphae.length, 0, 'every hypha gone'); assert.deepEqual(g.claimed, freshGrowth(SEED).claimed, 'back to the breach\'s own hubs, all of them'); assert.equal(g.germs.length, 1);
  // Fed again, it grows again from where it stands.
  const again = stepGrowth(g, SEED, fed()); assert.equal(again.starved, 0); assert.equal(again.hyphae.length, TIPS);
  // Mid-collapse an infant taken halts the retreat.
  const pre = stepGrowth(stepGrowth(stepGrowth(g8, SEED, starve), SEED, starve), SEED, starve); assert.equal(pre.starved, STARVE_DAYS); const kept = stepGrowth(pre, SEED, starve), halted = stepGrowth(pre, SEED, fed()); assert.equal(halted.starved, 0); assert.ok(nearestTo(halted, village.x, village.z) < nearestTo(kept, village.x, village.z), 'the infant taken, the front grows where the starving one receded');
});

test('serialize and parse round-trip; parse tolerates junk and always keeps the breach', () => {
  const g = grow(9, fed({ darkYoungBred: 1, meals: 2 })); const back = parseGrowth(serializeGrowth(g), SEED);
  assert.equal(back.day, g.day); assert.equal(back.starved, g.starved); assert.ok(Math.abs(back.food - g.food) < 1e-3); assert.deepEqual(back.claimed, g.claimed); assert.equal(back.hyphae.length, g.hyphae.length); for (let i = 0; i < g.hyphae.length; i++) assert.ok(Math.abs(back.hyphae[i].t - g.hyphae[i].t) < 1e-3);
  assert.equal(serializeGrowth(parseGrowth(serializeGrowth(back), SEED)), serializeGrowth(back), 'stable');
  const next = stepGrowth(back, SEED, fed()), nextG = stepGrowth(g, SEED, fed()); assert.deepEqual(next.claimed, nextG.claimed, 'a parsed growth steps as the live one');
  for (const junk of [null, '', 'garbage', '[]', '5', '{"germs":5,"hyphae":"x"}', '{"day":-3,"germs":[{"id":"breach","kind":"breach","x":0,"z":0,"reach":10}],"claimed":["a,b"],"hyphae":[{"from":[1,1],"to":[9,9],"t":0.5},{"from":[1,1],"to":[2,1],"t":"no"},{"from":[0,0],"to":[1,0],"t":7}]}']) {
    const p = parseGrowth(junk, SEED); assert.equal(p.germs.length, 1); assert.equal(p.germs[0].kind, 'breach'); assert.equal(p.germs[0].reach, TAINT.edge); assert.deepEqual(p.claimed, freshGrowth(SEED).claimed, `junk ${JSON.stringify(junk)}: the breach's hubs`); assert.equal(p.hyphae.length, 0); assert.ok(p.day >= 0 && p.starved >= 0 && p.food >= 0);
  }
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
  let s = g; for (let i = 0; i < 12; i++) s = stepGrowth(s, SEED, fed({ nourish: [], infantsTaken: 0 }));
  assert.equal(s.germs.length, 1, 'the lesser germ withered away'); assert.equal(s.germs[0].kind, 'breach'); assert.equal(s.germs[0].reach, TAINT.edge); assert.deepEqual(s.claimed, freshGrowth(SEED).claimed);
});

test('the field reads are cheap: a 12-day growth indexed, 200k reads under a second', () => {
  const g = grow(12), t0 = performance.now(), idx = indexGrowth(g, SEED), t1 = performance.now(); let n = 0, d = 0;
  for (let i = 0; i < 100000; i++) { const x = (i % 500) * 4 - 400, z = Math.floor(i / 500) * 5 - 1000; if (ringOf(idx, x, z)) n++; d += depthOf(idx, x, z); }
  const ms = performance.now() - t0; assert.ok(ms < 1000, `${ms.toFixed(0)} ms`); assert.ok(n > 1000 && d > 0); console.log(`  index ${(t1 - t0).toFixed(1)} ms, 200k reads ${(ms - (t1 - t0)).toFixed(0)} ms`);
});
