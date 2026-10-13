import { test } from 'node:test'; import assert from 'node:assert/strict';
import { generate, heightAt, bakeSun, placeTrees, placeRocks, postcards, N, HALF, CELL, WATER_Y, SNOW_Y, EROSION_EDGE } from '../src/vistaTerrain';
import { supportAt, type TraversalWorld } from '../src/mobility';
const land = generate(1), trees = placeTrees(land), rocks = placeRocks(land), cards = postcards(land);
const ground: TraversalWorld = { surfacesAt: (x, z) => [heightAt(land, x, z)], canOccupy: (p) => p.y >= heightAt(land, p.x, p.z) - 0.05 && heightAt(land, p.x, p.z) > WATER_Y - 0.3 };

test('the land is a valley: a lake, a floor above it, mountains past the snow line', () => {
  let water = 0, snow = 0, min = Infinity, max = -Infinity;
  for (const h of land.h) { if (h < WATER_Y) water++; if (h > SNOW_Y) snow++; min = Math.min(min, h); max = Math.max(max, h); }
  assert.ok(water / land.h.length > 0.02 && water / land.h.length < 0.15, `lake ${(water / land.h.length).toFixed(3)}`);
  assert.ok(snow / land.h.length > 0.03, `snow ${(snow / land.h.length).toFixed(3)}`);
  assert.ok(max - min > 350, `relief ${max - min}`);
  for (const a of [land.h, land.flow, land.sediment, land.ao]) assert.ok(a.every(Number.isFinite));
});
test('it is the same land for the same seed, and another for another', () => {
  const again = generate(1, { droplets: 0 }), other = generate(2, { droplets: 0 }), plain = generate(1, { droplets: 0 });
  assert.deepEqual(again.h, plain.h); assert.notDeepEqual(other.h.slice(0, 2000), plain.h.slice(0, 2000));
});
test('erosion leaves the map edge alone, so the far ring meets it without a seam', () => {
  // The ring is sunk 6 m where it overlaps the map: the last cells must stay well within that of the shape.
  for (let j = 0; j < N; j += 3) for (const i of [0, 1, N - 2, N - 1]) for (const [a, b] of [[i, j], [j, i]]) {
    const x = a * CELL - HALF, z = b * CELL - HALF;
    assert.ok(Math.abs(land.h[b * N + a] - land.shape.base(x, z)) < 0.5, `edge at ${x},${z}`);
  }
  // And the band erodes progressively less toward the edge.
  const mid = Math.floor(EROSION_EDGE / CELL / 8); let inner = 0, outer = 0;
  for (let j = 60; j < N - 60; j++) { inner += Math.abs(land.h[j * N + 60] - land.shape.base(60 * CELL - HALF, j * CELL - HALF)); outer += Math.abs(land.h[j * N + mid] - land.shape.base(mid * CELL - HALF, j * CELL - HALF)); }
  assert.ok(outer < inner * 0.2, `outer ${outer.toFixed(0)} vs inner ${inner.toFixed(0)}`);
  // Past the map the height is the shape's, continuous with the map's last sample.
  assert.ok(Math.abs(heightAt(land, HALF + 0.01, 0) - heightAt(land, HALF - 0.01, 0)) < 1);
});
test('erosion cuts: water gathers into a few channels, not a sheet', () => {
  const sorted = Float32Array.from(land.flow).sort();
  const median = sorted[Math.floor(sorted.length * 0.5)], top = sorted[Math.floor(sorted.length * 0.995)];
  assert.ok(median < 0.6 && top > median + 0.25, `median ${median.toFixed(2)}, top ${top.toFixed(2)}`);
});
test('the sun bakes: high noon lights almost everything, a low sun leaves long shadows, a set sun none', () => {
  const lit = (s: Uint8Array) => s.reduce((a, v) => a + v, 0) / s.length / 255;
  const noon = lit(bakeSun(land, [0, 1, 0])), low = lit(bakeSun(land, [0.97, 0.12, 0.2].map(v => v / Math.hypot(0.97, 0.12, 0.2)) as [number, number, number])), night = lit(bakeSun(land, [0, -1, 0]));
  assert.ok(noon > 0.97, `noon ${noon}`); assert.ok(low < noon - 0.1, `low ${low}`); assert.equal(night, 0);
});
test('trees stand on dry, gentle ground below the snow; rocks are on land', () => {
  assert.ok(trees.length > 2000, `${trees.length} trees`); assert.ok(rocks.length > 300, `${rocks.length} rocks`);
  for (const t of trees) { assert.ok(t.y > WATER_Y + 2 && t.y < SNOW_Y); assert.ok(Math.abs(t.y - heightAt(land, t.x, t.z)) < 1e-3); }
  assert.ok(trees.some(t => t.kind >= 3) && trees.some(t => t.kind < 3), 'conifers and broadleaves');
  for (const r of rocks) assert.ok(r.y >= WATER_Y - 1.5);
});
test('every postcard is somewhere she can stand, looking at something', () => {
  assert.equal(cards.length, 4);
  for (const c of cards) {
    let ok = false; for (let k = 0; k < 400 && !ok; k++) { const a = k * 2.4, r = Math.sqrt(k) * 0.8; ok = supportAt(ground, c.x + Math.cos(a) * r, c.z + Math.sin(a) * r) !== null; }
    assert.ok(ok, `${c.name} has standing room`); assert.ok(Number.isFinite(c.yaw));
  }
  const [shore, , ridge, summit] = cards;
  assert.ok(heightAt(land, shore.x, shore.z) < WATER_Y + 3); assert.ok(heightAt(land, ridge.x, ridge.z) > WATER_Y + 130); assert.ok(heightAt(land, summit.x, summit.z) > heightAt(land, ridge.x, ridge.z));
});
