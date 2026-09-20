import { test } from 'node:test'; import assert from 'node:assert/strict';
import { PLANTS, ROOTS, ZONES, CAVERN, PILLAR_HEIGHT, BEDROCK, pillarRadius, inZone, routes, rootsAt, stepRide, ridePoint, rideTarget, RIDE_MIN, RIDE_MAX, parseProgress, freshProgress, arrive, isRideable, tend, TEND_COST, makeFloorSoil, vec } from '../src/karstModel';
import { advance } from '../src/watershedModel';
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
  assert.ok(routes('floorMaple', 'pine').some(r => r.length === 2), 'the tended taproot is a direct way up');
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

test('the fine roots and the dormant taproot are gated by the foot’s watershed and by tending', () => {
  const p = freshProgress(); const foot = ROOTS.find(r => r.id === 'foot-root')!, tap = ROOTS.find(r => r.id === 'taproot')!, deep = ROOTS.find(r => r.id === 'cavern-floor')!;
  assert.ok(isRideable(foot, p)); assert.equal(isRideable(tap, p), false, 'dormant until tended'); assert.ok(isRideable(deep, p));
  p.sap = TEND_COST - 1; assert.equal(tend(p), false); p.sap = TEND_COST; assert.ok(tend(p)); assert.equal(p.sap, 0); assert.ok(isRideable(tap, p)); assert.equal(tend(p), false);
  let guard = 0; while (p.w.shortcut === 'open' && guard++ < 4000) advance(p.w, 0.05);
  assert.equal(p.w.shortcut, 'closing'); assert.equal(isRideable(foot, p), false, 'a withdrawing fine root cannot be entered'); assert.equal(isRideable(tap, p), false); assert.ok(isRideable(deep, p), 'the deep roots always serve');
  guard = 0; while (p.w.shortcut !== 'open' && guard++ < 8000) advance(p.w, 0.05); assert.ok(isRideable(foot, p) && isRideable(tap, p), 'they regrow with recovery');
  const back = parseProgress(JSON.stringify(p)); assert.equal(back.tended, true); assert.equal(back.w.allocation, 'balanced'); assert.equal(back.sap, 0); assert.equal(back.w.sap, 0);
  assert.equal(parseProgress('{"sap":999,"tended":"yes"}').sap, 120); assert.equal(parseProgress('{"sap":999,"tended":"yes"}').tended, false);
});
test('the soil at the foot is roofed by the forest floor, floored by bedrock, and the pillar goes on down through it', () => {
  const soil = makeFloorSoil();
  assert.ok(soil.canOccupy(vec(20, -2, 5), 0.25, 0.72)); assert.equal(soil.canOccupy(vec(20, 0.2, 5), 0.25, 0.72), false, 'not up through the roof');
  assert.equal(soil.canOccupy(vec(20, BEDROCK - 0.1, 5), 0.25, 0.72), false, 'not below bedrock'); assert.equal(soil.canOccupy(vec(pillarRadius(0) - 1, -2, 0), 0.25, 0.72), false, 'the foot is solid rock');
  assert.equal(soil.canOccupy(vec(45, -2, 0), 0.25, 0.72), false, 'the soil ends with the forest'); assert.deepEqual(soil.surfacesAt(20, 5), [], 'nothing to stand on in the soil');
});
