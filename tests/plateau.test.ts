import { test } from 'node:test'; import assert from 'node:assert/strict';
import { plateau, walkable, standsLevel, footprint, PLATEAU_R, ISLAND_R, WATER_Y, WADE_DEPTH, TERRACE_R, TERRACE_FADE, PASS_N, MOUNTAIN_RISE, CLOUD_Y, BRINK_PAST, BRINK_LEVEL_R, VILLAGE_HALF, LEVEL_SLOPE } from '../src/plateauModel';
import { places, villageSites, KARST_AT, onLand, standsAt, FOOT, dens, warrens, ownWarrens, wallows, ruins, moot } from '../src/overworldModel';
import { convergences, hubAt, RING_FOOT, RING_FAR, RING_SLOPE } from '../src/chunkModel';
import { STREAM_Z, housePlace, SITES, STORES, CROP_STRIPS, HOUSE_RADIUS, TREES } from '../src/villageModel';

/** T7: why a footprint of `r` is not clear: water under it, or the ground (padded: as drawn) rising more than `rise` across it. */
const level = (p: ReturnType<typeof plateau>, x: number, z: number, r: number, rise: number): string | null => { let lo = Infinity, hi = -Infinity; for (const q of footprint(x, z, r)) { if (p.water(q.x, q.z)) return `water under it at (${q.x.toFixed(1)}, ${q.z.toFixed(1)})`; const g = p.ground(q.x, q.z); lo = Math.min(lo, g); hi = Math.max(hi, g); } return hi - lo > rise ? `the ground rises ${(hi - lo).toFixed(2)} across it` : null; };
const p = plateau(1);
test('T6: the belt is a belt: past the crest the land falls to a lowland far below the cloud; three passes climb to brinks she can stand at, and nowhere else is the belt walkable', () => {
  const p = plateau(1);
  assert.equal(p.brinks.length, PASS_N);
  for (const b of p.brinks) {
    // T7: the brink is the last level ground before the lip (where the fall begins, BRINK_PAST past the crest), a few strides back from it.
    assert.ok(walkable(p, b.x, b.z), `${b.name} is stood at`); assert.ok(p.into(b.x, b.z) >= MOUNTAIN_RISE - 30, `${b.name} at the crest`); assert.ok(standsLevel(p, b.x, b.z, BRINK_LEVEL_R, LEVEL_SLOPE * 3), `${b.name}'s ring is on gentle ground`); assert.equal(level(p, b.x, b.z, BRINK_LEVEL_R, 0.3), null, `${b.name}'s ring stands level on its pad`);
    { const r0 = Math.hypot(b.x - p.centre.x, b.z - p.centre.z); let lip = -1; for (let d = 0; d <= 40; d += 1) { const x = p.centre.x + Math.cos(b.angle) * (r0 + d), z = p.centre.z + Math.sin(b.angle) * (r0 + d); if (p.into(x, z) >= MOUNTAIN_RISE + BRINK_PAST) { lip = d; break; } } assert.ok(lip >= 0 && lip <= 40, `the lip lies a few strides on from ${b.name} (${lip} m)`); }
    // Up the pass from the rim: walkable all the way, never a step down, and the saddle well under the ridge beside it.
    let last = -1e9, saddle = 0; for (let r = PLATEAU_R - 30; r <= Math.hypot(b.x - p.centre.x, b.z - p.centre.z) - 4; r += 6) { const x = p.centre.x + Math.cos(b.angle) * r, z = p.centre.z + Math.sin(b.angle) * r, h = p.base(x, z); assert.ok(walkable(p, x, z), `${b.name}'s pass is walkable at ${r - PLATEAU_R}`); assert.ok(h >= last - 3, `${b.name}'s pass climbs (${r - PLATEAU_R})`); last = h; saddle = Math.max(saddle, h); }
    const beside = Math.max(...[-0.22, -0.15, -0.09, 0.09, 0.15, 0.22].map(da => p.base(p.centre.x + Math.cos(b.angle + da) * (PLATEAU_R + 560), p.centre.z + Math.sin(b.angle + da) * (PLATEAU_R + 560)))); assert.ok(beside > saddle + 30, `the ridge beside ${b.name} stands over its saddle (${beside.toFixed(0)} vs ${saddle.toFixed(0)})`);
    // Past the brink: the fall, into the cloud and far below it.
    const q = (d: number) => { const r = Math.hypot(b.x - p.centre.x, b.z - p.centre.z) + d; return p.base(p.centre.x + Math.cos(b.angle) * r, p.centre.z + Math.sin(b.angle) * r); };
    assert.ok(!walkable(p, p.centre.x + Math.cos(b.angle) * (Math.hypot(b.x - p.centre.x, b.z - p.centre.z) + 40), p.centre.z + Math.sin(b.angle) * (Math.hypot(b.x - p.centre.x, b.z - p.centre.z) + 40)), 'no step past the brink');
    assert.ok(q(400) < CLOUD_Y, 'the fall goes under the cloud'); assert.ok(q(1400) < CLOUD_Y - 1500, 'and far below it');
  }
  // Off the passes the belt refuses her; the lowland has peaks through the cloud.
  let refused = 0, n = 0; for (let a = 0; a < 6.28; a += 0.05) { const x = p.centre.x + Math.cos(a) * (PLATEAU_R + 300), z = p.centre.z + Math.sin(a) * (PLATEAU_R + 300); n++; if (!walkable(p, x, z)) refused++; }
  assert.ok(refused > n * 0.9, `the belt is closed but at the passes (${refused}/${n})`);
  let above = 0; for (let x = -6000; x <= 6000; x += 150) for (let z = -6000; z <= 6000; z += 150) if (Math.hypot(x - p.centre.x, z - p.centre.z) > PLATEAU_R + MOUNTAIN_RISE + 950 && p.base(x, z) > CLOUD_Y) above++;
  assert.ok(above > 40, `peaks stand through the cloud (${above})`);
});
test('one karst at the centre of the plateau, on an island in a lake (Noah, 2026-10-19)', () => {
  assert.deepEqual(p.centre, { x: KARST_AT.x, z: KARST_AT.z });
  assert.ok(Math.abs(p.ground(KARST_AT.x + 30, KARST_AT.z)) < 0.2, 'the island is the karst’s floor, at 0');
  for (let a = 0; a < 6.28; a += 0.5) { const r = (p.lakeR(a) + ISLAND_R) / 2, w = p.water(KARST_AT.x + Math.cos(a) * r, KARST_AT.z + Math.sin(a) * r); assert.ok(w && w.kind === 'lake' && w.depth > 1, `the lake round the island at ${a.toFixed(1)}`); }
  assert.ok(p.into(KARST_AT.x + PLATEAU_R + 400, KARST_AT.z) > 0 && p.ground(KARST_AT.x + PLATEAU_R + 600, KARST_AT.z) > 120, 'mountains past the rim');
});
test('an old stone bridge crosses from the island to the shore, toward the first village, and is walkable over deep water', () => {
  const b = p.bridge, mid = { x: (b.from.x + b.to.x) / 2, z: (b.from.z + b.to.z) / 2 };
  assert.ok(p.water(mid.x, mid.z)?.kind === 'lake', 'water under its middle'); assert.ok(p.deckAt(mid.x, mid.z)! > WATER_Y + 2, 'its deck well above it'); assert.ok(walkable(p, mid.x, mid.z));
  assert.ok(Math.hypot(b.to.x, b.to.z) < Math.hypot(b.from.x, b.from.z), 'it leads toward the first village');
  assert.ok(!walkable(p, mid.x + 8, mid.z + 8) || p.deckAt(mid.x + 8, mid.z + 8) !== null, 'off its side is the lake');
});
test('rivers rise in the mountains and run down to the lake, never climbing; each village stands on one (following a river finds them)', () => {
  assert.ok(p.rivers.length >= 4, `${p.rivers.length} rivers`);
  for (const r of p.rivers) {
    const a = r.points[0], z = r.points[r.points.length - 1];
    assert.ok(Math.hypot(a.x - KARST_AT.x, a.z - KARST_AT.z) > PLATEAU_R, `${r.id} rises past the rim`);
    assert.ok(p.water(z.x, z.z)?.kind === 'lake' || Math.hypot(z.x - KARST_AT.x, z.z - KARST_AT.z) < p.lakeR(Math.atan2(z.z - KARST_AT.z, z.x - KARST_AT.x)), `${r.id} ends in the lake`);
    for (let i = 1; i < r.surface.length; i++) assert.ok(r.surface[i] <= r.surface[i - 1] + 1e-9, `${r.id} never climbs (${i})`);
    assert.equal(r.surface[r.surface.length - 1], WATER_Y);
  }
  for (const v of [{ id: 'village', x: 0, z: 0 }, ...villageSites(1)]) {
    const r = p.rivers.find(q => q.village === v.id); assert.ok(r, `${v.id} has its river`);
    const w = p.water(v.x, v.z + STREAM_Z(0)); assert.ok(w && w.kind === 'river' && w.river === r!.id, `${v.id}'s stream is its river`);
    const t = p.terraces.find(q => q.id === v.id)!; assert.ok(Math.abs(p.ground(v.x, v.z - 20) - t.y) < 0.2, `${v.id}'s green is flat at its terrace (${t.y.toFixed(1)})`);
  }
});
test('rivers are barriers but at their crossings: the village at the ford fords; every river can be crossed more than once', () => {
  const ford = villageSites(1).find(s => s.short === 'the ford')!; const fc = p.crossings.find(c => c.river === `river:${ford.id}` && c.kind === 'ford')!;
  assert.ok(fc, 'the ford'); assert.ok(walkable(p, fc.x, fc.z), 'the ford is waded'); assert.ok(p.water(fc.x, fc.z)!.depth < WADE_DEPTH);
  for (const r of p.rivers) {
    assert.ok(p.crossings.filter(c => c.river === r.id).length >= 2, `${r.id} is crossed at least twice`);
    // Away from its crossings, the middle of the river is too deep to wade.
    for (let i = 20; i < r.points.length - 30; i += 25) { const q = r.points[i]; if (p.crossings.some(c => Math.hypot(c.x - q.x, c.z - q.z) < 14)) continue; assert.ok(!walkable(p, q.x, q.z), `${r.id} is a barrier at ${i}`); }
  }
});
test('every place stands on dry land on the plateau, off the water', () => {
  for (const pl of places(1)) {
    if (pl.kind === 'karst') continue;
    assert.ok(Math.hypot(pl.x - KARST_AT.x, pl.z - KARST_AT.z) < PLATEAU_R - 20, `${pl.id} on the plateau`);
    if (pl.kind !== 'village' && pl.kind !== 'lair') assert.ok(onLand(1, pl.x, pl.z, 4), `${pl.id} on dry land`);
  }
  for (const v of [{ x: 0, z: 0 }, ...villageSites(1)]) for (let a = 0; a < 6.28; a += 0.7) { const x = v.x + Math.cos(a) * (TERRACE_R - 10), z = v.z + Math.sin(a) * (TERRACE_R - 10); if (Math.abs(z - v.z - STREAM_Z(x - v.x)) < 14 || (p.nearRiver(x, z, 30)?.d ?? 99) < 24) continue; assert.ok(!p.water(x, z), 'the green is dry off its river'); }
});
test('the baked land round-trips: heights to 1.6 cm, the maps to a 255th, its fingerprint checked', async () => {
  const { encodeLand, decodeLand, VILLAGE_LAND_N } = await import('../src/plateauLand');
  const n = VILLAGE_LAND_N, N = n * n, h = new Float32Array(N), m = new Float32Array(N);
  for (let k = 0; k < N; k++) { h[k] = -12 + ((k * 7919) % 97000) / 100; m[k] = (k % 256) / 255; }
  const e = { n, half: 0, h, flow: m, sediment: m, ao: m }, back = decodeLand(1, encodeLand(1, e))!;
  assert.ok(back); for (let k = 0; k < N; k += 997) { assert.ok(Math.abs(back.h[k] - h[k]) < 0.01, `height ${k}`); assert.ok(Math.abs(back.ao[k] - m[k]) < 0.003); }
  assert.equal(decodeLand(2, encodeLand(1, e)), null, 'another seed’s bake is not this one');
});

// T7 (PLATEAU.md, every place stands clear; Noah, 2026-10-22: structures below ground and under water in some villages, and some fairy rings).
test('T7: every village structure stands on dry ground that is level under it, in every village, for seeds 1 to 6: the houses and the hut sites, the sites, the strips, the stores, and the trees on the bank', () => {
  for (let seed = 1; seed <= 6; seed++) {
    const p = plateau(seed);
    for (const v of [{ id: 'village', x: 0, z: 0 }, ...villageSites(seed)]) {
      const at = (x: number, z: number) => ({ x: v.x + x, z: v.z + z });
      for (let i = 0; i < 18; i++) { const h = housePlace(i), w = at(h.x, h.z), why = level(p, w.x, w.z, HOUSE_RADIUS + 0.5, 0.15); assert.equal(why, null, `seed ${seed}, ${v.id}'s house ${i}: ${why}`); }
      // The stream site stands at the water's edge (the water is fetched there): its middle is dry, and the bank it stands on gentle.
      for (const [k, s] of Object.entries(SITES)) { const w = at(s.x, s.z); if (k === 'stream') { assert.ok(!p.water(w.x, w.z), `seed ${seed}, ${v.id}'s stream site stands dry`); const nr = p.nearRiver(w.x, w.z, 10); assert.ok(nr && nr.d - nr.half < 2.5, `seed ${seed}, ${v.id}'s stream site stands at the water's edge`); continue; } const why = level(p, w.x, w.z, s.radius, k === 'thicket' ? 0.6 : 0.3); assert.equal(why, null, `seed ${seed}, ${v.id}'s ${k}: ${why}`); }
      for (let n = 0; n < CROP_STRIPS; n++) { const w = at(SITES.field.x + (n - 2), SITES.field.z + (n - 2) * 0.3), why = level(p, w.x, w.z, 2.6, 0.3); assert.equal(why, null, `seed ${seed}, ${v.id}'s strip ${n}: ${why}`); }
      for (const [k, s] of Object.entries(STORES)) { const w = at(s.x, s.z), why = level(p, w.x, w.z, 0.8, 0.15); assert.equal(why, null, `seed ${seed}, ${v.id}'s ${k}: ${why}`); }
      for (const t of TREES) { const w = at(t.x, t.z); assert.ok(!p.water(w.x, w.z), `seed ${seed}, ${v.id}'s tree ${t.id} stands out of the water`); }
      // The river through the village is its stream: VILLAGE_HALF across, level across the terrace at BANK_H under the green, falling before and after.
      const r = p.rivers.find(q => q.village === v.id)!, t = p.terraces.find(q => q.id === v.id)!; let inside = 0;
      for (let i = 0; i < r.points.length; i++) { const d = Math.hypot(r.points[i].x - v.x, r.points[i].z - v.z); if (d < TERRACE_R) { inside++; assert.ok(Math.abs(r.half[i] - VILLAGE_HALF) < 1e-6, `${r.id} is the stream through ${v.id} (${r.half[i]})`); assert.ok(Math.abs(t.y - r.surface[i]) > 1 && Math.abs(t.y - r.surface[i]) < 2, `${r.id} runs level under ${v.id}'s green (${(t.y - r.surface[i]).toFixed(2)} under it at ${i})`); } }
      assert.ok(inside > 20, `${r.id} runs through ${v.id}'s terrace (${inside} points)`);
      const far = r.surface[0] - r.surface[r.surface.length - 1]; assert.ok(far > 10, `${r.id} still falls from the mountains to the lake (${far.toFixed(0)} m)`);
    }
  }
});
test('T7: every place stands on dry level ground on its footprint (dens, warrens, wallows, ruins, the moot), and every fairy ring, at its hub or within RING_REACH of it, for seeds 1 to 6', () => {
  for (let seed = 1; seed <= 6; seed++) {
    const p = plateau(seed);
    for (const pl of places(seed)) {
      if (pl.kind === 'karst' || pl.kind === 'village' || pl.kind === 'lair') continue;
      const r = FOOT[pl.kind], why = level(p, pl.x, pl.z, r, 0.05); assert.equal(why, null, `seed ${seed}, ${pl.id} at (${pl.x}, ${pl.z}): ${why} (its pad is level)`);
      assert.ok(standsAt(seed, pl.x, pl.z, r, 6), `seed ${seed}, ${pl.id} stands on the land clear of the water`);
    }
    assert.ok(dens(seed).length >= 8, `seed ${seed} keeps its dens (${dens(seed).length})`); assert.equal(warrens(seed).length, dens(seed).length); assert.equal(wallows(seed).length, 1 + villageSites(seed).length); assert.equal(ruins(seed).length, 3); assert.ok(ownWarrens(seed).length >= 1); void moot(seed);
    for (const c of convergences(seed)) {
      const h = hubAt(c.cx, c.cz, seed), why = level(p, c.x, c.z, RING_FOOT, 0.05); assert.equal(why, null, `seed ${seed}, ${c.id} at (${c.x}, ${c.z}): ${why} (its pad is level)`); assert.ok(standsLevel(p, c.x, c.z, RING_FOOT, RING_SLOPE), `seed ${seed}, ${c.id} on gentle natural ground`);
      assert.ok(Math.hypot(c.x - h.x, c.z - h.z) <= RING_FAR + 0.5, `${c.id} within reach of its hub`); assert.ok(onLand(seed, c.x, c.z, RING_FOOT + 4), `${c.id} on the land`);
    }
    for (const b of p.brinks) assert.equal(level(p, b.x, b.z, BRINK_LEVEL_R, 0.3), null, `seed ${seed}, ${b.name}'s ring stands level on its pad`);
  }
  void TERRACE_FADE;
});
