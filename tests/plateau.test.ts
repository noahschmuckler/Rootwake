import { test } from 'node:test'; import assert from 'node:assert/strict';
import { plateau, walkable, PLATEAU_R, ISLAND_R, WATER_Y, WADE_DEPTH, TERRACE_R } from '../src/plateauModel';
import { places, villageSites, KARST_AT, onLand } from '../src/overworldModel';
import { STREAM_Z } from '../src/villageModel';

const p = plateau(1);
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
  for (const v of [{ x: 0, z: 0 }, ...villageSites(1)]) for (let a = 0; a < 6.28; a += 0.7) { const x = v.x + Math.cos(a) * (TERRACE_R - 10), z = v.z + Math.sin(a) * (TERRACE_R - 10); if (Math.abs(z - v.z - STREAM_Z(x - v.x)) < 8) continue; assert.ok(!p.water(x, z), 'the green is dry off the stream'); }
});
