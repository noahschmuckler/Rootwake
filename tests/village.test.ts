import { test } from 'node:test'; import assert from 'node:assert/strict';
import { HOBBITS, HOUSES, SITES, DAY_TICKS, PHASES, TICKS_PER_SECOND, phaseAt, clockOf, daylightAt, freshVillage, advance, wants, everyone, inHouse, route, parseVillage, serializeVillage, hobbitById, houseOf, HOUSE_RADIUS, HOUSE_RING } from '../src/villageModel';
test('eight hobbits in six houses on a ring round the green, each keeping to a place at a gap between the houses', () => {
  assert.equal(HOBBITS.length, 8); assert.equal(HOUSES.length, 6); assert.equal(new Set(HOBBITS.map(h => h.name)).size, 8, 'names are distinct');
  assert.ok(HOBBITS.every(h => h.home >= 0 && h.home < 6)); assert.equal(new Set(HOBBITS.map(h => h.home)).size, 6, 'every house is lived in');
  for (const h of HOUSES) { assert.ok(Math.abs(Math.hypot(h.x, h.z) - HOUSE_RING) < 1e-9); assert.ok(Math.hypot(h.door.x, h.door.z) < Math.hypot(h.x, h.z), 'doors face the green'); }
  for (const s of Object.values(SITES)) if (s.id !== 'fire') { assert.ok(Math.hypot(s.x, s.z) > HOUSE_RING + HOUSE_RADIUS + 3, `${s.id} lies beyond the houses`); for (const h of HOUSES) assert.ok(Math.hypot(s.x - h.x, s.z - h.z) > HOUSE_RADIUS + s.radius, `${s.id} is clear of the houses`); }
  assert.ok(HOBBITS.some(h => h.keeps === 'fire'), 'someone keeps the fire (the elder to be)');
});
test('the day: 1440 ticks in twenty real minutes, dawn at six, phases in order, the sun up by day and down by night', () => {
  assert.equal(DAY_TICKS, 1440); assert.ok(Math.abs(TICKS_PER_SECOND * 20 * 60 - DAY_TICKS) < 1e-9);
  assert.deepEqual(clockOf(0), { day: 1, hour: 6, minute: 0 }); assert.deepEqual(clockOf(DAY_TICKS + 90), { day: 2, hour: 7, minute: 30 });
  assert.equal(phaseAt(0), 'dawn'); assert.equal(phaseAt(360), 'noon'); assert.equal(phaseAt(900), 'night'); assert.equal(phaseAt(DAY_TICKS - 1), 'night'); assert.equal(phaseAt(DAY_TICKS), 'dawn');
  for (let i = 1; i < PHASES.length; i++) assert.ok(PHASES[i][1] > PHASES[i - 1][1]);
  assert.ok(daylightAt(360) > 0.9); assert.equal(daylightAt(900), 0); assert.ok(daylightAt(0) > 0 && daylightAt(0) < 0.2, 'a little light at six'); assert.ok(daylightAt(780) < 0.2 && daylightAt(780) > 0, 'dusk at seven');
});
test('the rhythm: out at dawn to their places, together on the green at noon, home by night, and never through a house', () => {
  const v = freshVillage(1); assert.equal(everyone(v, 'inside'), 8, 'they wake indoors');
  advance(v, 200); assert.equal(everyone(v, 'inside'), 0, 'all out by morning'); assert.ok(v.hobbits.every(s => s.activity === 'working' || s.activity === 'walking' || s.activity === 'talking'));
  for (const s of v.hobbits) { const h = hobbitById(s.id), site = SITES[h.keeps]; assert.ok(Math.hypot(s.x - site.x, s.z - site.z) <= site.radius + 0.3, `${h.name} is ${h.keeps === 'fire' ? 'at the fire' : site.verb}`); }
  advance(v, 420 - 200); assert.ok(everyone(v, 'green') >= 7, `${everyone(v, 'green')} on the green at one o'clock`); assert.ok(v.hobbits.filter(s => s.activity === 'talking').length >= 6);
  advance(v, 600 - 420); assert.equal(everyone(v, 'green'), 1, 'only the fire-keeper stays by the fire in the afternoon');
  advance(v, 900 - 600); assert.equal(everyone(v, 'inside'), 8, 'all home by night'); assert.ok(v.hobbits.every(s => s.activity === 'sleeping'));
  const w = freshVillage(1); let crossed = 0, moved = 0;
  for (let t = 0; t < DAY_TICKS * 2; t++) { const before = w.hobbits.map(s => [s.x, s.z]); advance(w, 1); for (let i = 0; i < 8; i++) { const s = w.hobbits[i]; if (!s.inside && inHouse(s)) crossed++; if (Math.hypot(s.x - before[i][0], s.z - before[i][1]) > 1.5) moved++; } }
  assert.equal(crossed, 0, 'nobody walks through a house'); assert.equal(moved, 0, 'nobody teleports');
  assert.equal(wants(HOBBITS[0], 0), 'home'); assert.equal(wants(HOBBITS[0], 60), 'place'); assert.equal(wants(HOBBITS[0], 360), 'green'); assert.equal(wants(HOBBITS[0], 1000), 'home');
  assert.ok(HOBBITS.map(h => wants(h, 12)).includes('home') && HOBBITS.map(h => wants(h, 12)).includes('place'), 'they rise at different times');
});
test('routes go by the green, not through the ring of houses', () => {
  const far = SITES.thicket, door = houseOf(HOBBITS[4]).door, path = route(far, door); assert.ok(path.length >= 2, 'in by the green first');
  const pts = [far, ...path]; for (let i = 1; i < pts.length; i++) for (let k = 0; k <= 40; k++) { const t = k / 40, p = { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, z: pts[i - 1].z + (pts[i].z - pts[i - 1].z) * t }; assert.equal(inHouse(p), null, `leg ${i} misses the houses`); }
  assert.equal(route(SITES.fire, { x: 1, z: 1 }).length, 1, 'across the green, straight');
});
test('the village is deterministic from its seed, pauses when not advanced, and survives a bad save', () => {
  const a = freshVillage(5), b = freshVillage(5); advance(a, 777); advance(b, 777); assert.equal(serializeVillage(a), serializeVillage(b));
  const c = freshVillage(6); advance(c, 777); assert.notEqual(serializeVillage(a), serializeVillage(c), 'a different seed, a different day');
  const before = serializeVillage(a); advance(a, 0); assert.equal(serializeVillage(a), before, 'no ticks, no change');
  const back = parseVillage(serializeVillage(a)); assert.equal(back.tick, a.tick); assert.equal(back.hobbits[3].activity, a.hobbits[3].activity); assert.ok(Math.abs(back.hobbits[3].x - a.hobbits[3].x) < 0.01);
  advance(back, 100); advance(a, 100); assert.equal(everyone(back, 'inside'), everyone(a, 'inside'));
  assert.deepEqual(parseVillage('junk'), freshVillage()); assert.deepEqual(parseVillage('{"hobbits":[]}'), freshVillage()); assert.equal(parseVillage('{"tick":-5,"hobbits":' + JSON.stringify(freshVillage().hobbits) + '}').tick, 0);
});
