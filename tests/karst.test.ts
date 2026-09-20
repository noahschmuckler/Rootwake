import { test } from 'node:test'; import assert from 'node:assert/strict';
import { PLANTS, ROOTS, ZONES, CAVERN, PILLAR_HEIGHT, pillarRadius, inZone, routes, rootsAt, stepRide, ridePoint, rideTarget, RIDE_MIN, RIDE_MAX, parseProgress, freshProgress, arrive } from '../src/karstModel';
test('the pillar narrows to its top and every plant stands on its own zone, clear of the rock', () => {
  assert.ok(pillarRadius(PILLAR_HEIGHT) < pillarRadius(0) * 0.45); for (let y = 0; y <= PILLAR_HEIGHT; y += 4) assert.ok(pillarRadius(y) > 3);
  for (const p of Object.values(PLANTS)) { const z = ZONES[p.zone]; assert.ok(z, p.id); assert.ok(inZone(z, p.stand.x, p.stand.z), `${p.id} stands in its zone`); assert.ok(Math.abs(p.at.y - z.y) < 0.6, `${p.id} at its zone's height`); }
  assert.ok(inZone(ZONES.summit, 0, 0)); assert.equal(inZone(ZONES.summit, 4, 0), false, 'the narrow top ends');
  assert.equal(inZone(ZONES.cavern, 0, 0), false, 'the pool is not floor'); assert.equal(inZone(ZONES.floor, 0, 0), false, 'the pillar’s foot is not floor');
  assert.ok(inZone(ZONES.floor, 20, 0));
  assert.ok(CAVERN.centre.y - CAVERN.radius < CAVERN.floorY && CAVERN.centre.y + CAVERN.radius < PILLAR_HEIGHT);
});
test('surface roots drape just outside the limestone; interior roots pass through it and one arrives in the cavern', () => {
  for (const r of ROOTS) {
    let inside = 0, samples = 0;
    for (let i = 1; i < 40; i++) { const p = r.curve.getPointAt(i / 40); if (p.y < 0.3 || p.y > PILLAR_HEIGHT - 0.3) continue; samples++; if (Math.hypot(p.x, p.z) < pillarRadius(p.y) - 0.05) inside++; }
    if (r.interior) assert.ok(inside > samples * 0.4, `${r.id} runs through the rock`); else assert.equal(inside, 0, `${r.id} stays on the face`);
  }
  const toCavern = ROOTS.filter(r => r.a === 'cavernFern' || r.b === 'cavernFern'); assert.ok(toCavern.length >= 2, 'the cavern has more than one way in');
  assert.ok(toCavern.every(r => r.interior));
});
test('the demo reaches the floor from the summit, and the way back up has at least three distinct routes', () => {
  const down = routes('pine', 'floorOak'); assert.ok(down.length >= 2);
  const up = [...routes('floorOak', 'pine'), ...routes('floorMaple', 'pine')];
  assert.ok(up.length >= 3, `${up.length} routes up`);
  const firsts = new Set(up.map(r => r[1])); assert.ok(firsts.size >= 2, 'routes up leave by different roots');
  assert.ok(up.some(r => r.includes('cavernFern')), 'one way up passes through the cavern');
  for (const p of Object.keys(PLANTS)) assert.ok(rootsAt(p).length >= 1, `${p} is connected`);
});
test('a ride pulls downhill, climbs slowly uphill, brakes before arriving, and ends exactly at the far plant', () => {
  assert.ok(rideTarget(-1, 20) > rideTarget(0, 20)); assert.equal(rideTarget(1, 20), RIDE_MIN); assert.ok(rideTarget(-1, 20) <= RIDE_MAX); assert.ok(rideTarget(-1, 1) < RIDE_MIN + 0.5, 'braked near the end');
  const r = ROOTS.find(r => r.id === 'pine-east')!;
  let s = 0, speed = 0, steps = 0, top = 0; while (true) { const n = stepRide(r, 'pine', s, speed, 1 / 60); s = n.s; speed = n.speed; top = Math.max(top, speed); steps++; if (n.done || steps > 20000) break; }
  assert.ok(steps < 20000); assert.ok(top > RIDE_MIN + 2, `downhill ride reached ${top}`); assert.ok(speed < RIDE_MIN + 0.5, 'arrived slowly');
  const end = ridePoint(r, 'pine', s).point; assert.ok(end.distanceTo(PLANTS.eastShrub.mouth) < 0.01);
  const start = ridePoint(r, 'eastShrub', 0).point; assert.ok(start.distanceTo(PLANTS.eastShrub.mouth) < 0.01, 'a root is ridden from either end');
  let up = 0, us = 0, uspeed = 0; while (up++ < 20000) { const n = stepRide(r, 'eastShrub', us, uspeed, 1 / 60); us = n.s; uspeed = n.speed; if (n.done) break; } assert.ok(up < 20000);
});
test('progress validates saves and records the floor and the return to the summit', () => {
  assert.deepEqual(parseProgress('junk'), freshProgress()); assert.equal(parseProgress('{"at":"nowhere","visited":["x"]}').at, 'pine');
  assert.equal(parseProgress('{"returned":true,"reachedFloor":true,"visited":["pine"]}').returned, false, 'cannot have returned without the floor');
  const p = freshProgress(); assert.equal(arrive(p, 'eastShrub'), null); assert.equal(arrive(p, 'pine'), null); assert.equal(arrive(p, 'floorOak'), 'floor'); assert.equal(arrive(p, 'pine'), 'returned'); assert.equal(arrive(p, 'pine'), null);
  const back = parseProgress(JSON.stringify(p)); assert.equal(back.returned, true); assert.deepEqual(back.visited, ['pine', 'eastShrub', 'floorOak']);
});
