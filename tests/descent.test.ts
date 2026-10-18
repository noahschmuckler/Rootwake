import { test } from 'node:test'; import assert from 'node:assert/strict';
import { catwalk, walkable, stepOut, stationSpot, LAYERS, LETTERS, BANDS, DROP_VIS_R, KEEPER_LINES } from '../src/descentModel';

test('seven catwalks spell the word going down, each a little larger, each a band of the rainbow', () => {
  assert.equal(LETTERS.join(''), 'REVILED'); assert.equal(LAYERS, 7); assert.equal(BANDS.length, 7);
  for (let d = 1; d < LAYERS; d++) { assert.ok(catwalk(d).wallR > catwalk(d - 1).wallR); assert.ok(catwalk(d).alcoves.length > catwalk(d - 1).alcoves.length); }
  assert.equal(catwalk(0).spokes.length, 0, 'the first is a plain ring'); assert.ok(catwalk(1).spokes.length > 0, 'the deeper are built out');
});
test('she steps out of the drop onto the gangway, and it carries her to the ring', () => {
  for (let d = 0; d < LAYERS; d++) {
    const c = catwalk(d), s = stepOut(c); assert.ok(walkable(c, s.x, s.z), `step out ${d}`);
    // Walk out along the gangway: every step stands, all the way onto the ring.
    for (let r = DROP_VIS_R; r <= c.ringIn + 0.5; r += 0.1) assert.ok(walkable(c, Math.cos(c.gangway) * r, Math.sin(c.gangway) * r), `gangway ${d} at ${r.toFixed(1)}`);
    // Off the gangway's side over the shaft is the drop: not walkable.
    assert.equal(walkable(c, (c.ringIn - 1) * Math.cos(c.gangway) + Math.cos(c.gangway + Math.PI / 2) * 1.2, (c.ringIn - 1) * Math.sin(c.gangway) + Math.sin(c.gangway + Math.PI / 2) * 1.2), false);
  }
});
test('the ring runs all the way round, and every station and alcove is reachable from it', () => {
  for (let d = 0; d < LAYERS; d++) {
    const c = catwalk(d), r = (c.ringIn + c.wallR) / 2;
    for (let a = 0; a < Math.PI * 2; a += 0.02) assert.ok(walkable(c, Math.cos(a) * r, Math.sin(a) * r), `ring ${d} at ${a.toFixed(2)}`);
    for (const s of c.stations) { const p = stationSpot(c, s); assert.ok(walkable(c, p.x, p.z), `station ${s.kind} at ${d}`); }
    for (const a of c.alcoves) assert.ok(walkable(c, Math.cos(a) * (c.wallR + 0.6), Math.sin(a) * (c.wallR + 0.6)), `alcove ${d}`);
    assert.equal(walkable(c, Math.cos(c.alcoves[0] + Math.PI / c.alcoves.length) * (c.wallR + 0.6), Math.sin(c.alcoves[0] + Math.PI / c.alcoves.length) * (c.wallR + 0.6)), false, 'between alcoves is wall');
  }
});
test('a snerk keeps the archive on every catwalk; the hollowed and the greeblins join deeper', () => {
  assert.deepEqual(catwalk(0).stations.map(s => s.keeper), ['snerk']);
  assert.ok(catwalk(1).stations.some(s => s.keeper === 'hollowed'));
  assert.ok(catwalk(3).stations.some(s => s.keeper === 'greeblin'));
  for (const k of ['snerk', 'hollowed', 'greeblin'] as const) assert.ok(KEEPER_LINES[k].length >= 3);
});
