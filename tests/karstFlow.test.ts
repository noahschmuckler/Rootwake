import { test } from 'node:test'; import assert from 'node:assert/strict';
import { FLOW_ROOTS, rootsAt, routes, makeZoneWorld, nearestPlant, chooseRoot, screenDirections, departure, tread, cellKey, cellCentre, parseProgress, serializeProgress, freshProgress, arrive, insideRock, trunkRadius, groundAt, TRAIL_MAX, PLANTS, ZONES, CAVERN, PILLAR_HEIGHT, pillarRadius, vec, type Screen } from '../src/karstFlowModel';
test('the roots ridden here are the karst’s without the dormant taproot, and the way up is still not one path', () => {
  assert.equal(FLOW_ROOTS.length, 9); assert.ok(!FLOW_ROOTS.some(r => r.dormant)); assert.ok(FLOW_ROOTS.some(r => r.id === 'foot-root'), 'the foot root joins the two floor trees');
  for (const p of Object.keys(PLANTS)) assert.ok(rootsAt(p).length >= 1, `${p} is connected`);
  assert.ok(routes('pine', 'floorOak').length >= 2, 'more than one way down');
  const up = [...routes('floorOak', 'pine'), ...routes('floorMaple', 'pine')]; assert.ok(up.length >= 3, `${up.length} routes up`);
  assert.ok(new Set(up.map(r => r[1])).size >= 2, 'routes up leave by different roots'); assert.ok(up.some(r => r.includes('cavernFern')), 'one way up passes through the cavern');
  assert.ok(!up.some(r => r.length === 2), 'no taproot shortcut');
});
test('each zone is a small world for the shared player: its edge holds, trunks block, the face and the pool are not floor', () => {
  const summit = makeZoneWorld(ZONES.summit); assert.deepEqual(summit.surfacesAt(0, 0), [groundAt(ZONES.summit, 0, 0)]); assert.deepEqual(summit.surfacesAt(4, 0), []);
  assert.ok(summit.canOccupy(vec(1, PILLAR_HEIGHT + 0.02, 1), 0.25, 0.72)); assert.equal(summit.canOccupy(vec(3.5, PILLAR_HEIGHT, 0), 0.25, 0.72), false, 'the narrow top ends');
  const pine = PLANTS.pine; assert.equal(summit.canOccupy(vec(pine.at.x, PILLAR_HEIGHT, pine.at.z), 0.25, 0.72), false, 'the pine’s trunk blocks'); assert.ok(summit.canOccupy(vec(pine.at.x + trunkRadius(pine) + 0.3, PILLAR_HEIGHT, pine.at.z), 0.25, 0.72));
  const east = makeZoneWorld(ZONES.east); assert.ok(east.canOccupy(vec(PLANTS.eastShrub.stand.x, groundAt(ZONES.east, PLANTS.eastShrub.stand.x, PLANTS.eastShrub.stand.z), PLANTS.eastShrub.stand.z), 0.25, 0.72), 'the shrub’s stand is walkable');
  assert.equal(east.canOccupy(vec(pillarRadius(ZONES.east.y) - 0.2, ZONES.east.y, 0), 0.25, 0.72), false, 'not into the limestone');
  const cavern = makeZoneWorld(ZONES.cavern); assert.equal(cavern.canOccupy(vec(0, CAVERN.floorY, 0), 0.25, 0.72), false, 'the pool is not floor'); assert.ok(cavern.canOccupy(vec(-3.5, CAVERN.floorY, 0.5), 0.25, 0.72));
  const floor = makeZoneWorld(ZONES.floor); assert.equal(floor.canOccupy(vec(0, 0, 0), 0.25, 0.72), false, 'the pillar’s foot is not floor'); assert.ok(floor.canOccupy(vec(20, 0.05, 0), 0.25, 0.72));
  const n = nearestPlant('floor', 14, 3.5); assert.equal(n.plant.id, 'floorOak'); assert.ok(n.distance > 0.8 && n.distance < 1.2);
});
test('the stick chooses a root by where it visibly sets off on the screen; the root just ridden is excluded until the stick is released', () => {
  // A side view from +z: screen x is world x, screen y is world y; nothing is behind the camera.
  const side: Screen = p => ({ x: p.x * 100, y: p.y * 100 });
  const east = FLOW_ROOTS.find(r => r.id === 'pine-east')!, west = FLOW_ROOTS.find(r => r.id === 'pine-west')!;
  assert.ok(departure(east, 'pine').x > PLANTS.pine.mouth.x && departure(west, 'pine').x < PLANTS.pine.mouth.x, 'the pine’s roots set off east and west');
  assert.equal(chooseRoot('pine', { x: 1, y: 0 }, side)?.id, 'pine-east'); assert.equal(chooseRoot('pine', { x: -1, y: -0.2 }, side)?.id, 'pine-west');
  assert.equal(chooseRoot('pine', { x: 0.1, y: 0.1 }, side), null, 'a slack stick chooses nothing'); assert.equal(chooseRoot('pine', { x: 0, y: 1 }, side), null, 'no root goes up from the summit');
  assert.equal(chooseRoot('pine', { x: 1, y: 0 }, side, east), null, 'the excluded root is not taken');
  assert.equal(chooseRoot('pine', { x: 1, y: 0 }, () => null), null, 'nothing behind the camera is chosen');
  const dirs = screenDirections('pine', side); assert.equal(dirs.length, 2); for (const d of dirs) assert.ok(Math.abs(Math.hypot(d.x, d.y) - 1) < 1e-6);
  // From the east shrub, seen from outside the pillar: up the face is up, the cavern is inward and down, the south root down and sideways.
  const fromEast: Screen = p => ({ x: -p.z * 100, y: p.y * 100 });
  assert.equal(chooseRoot('eastShrub', { x: 0, y: 1 }, fromEast)?.id, 'pine-east');
  const down = chooseRoot('eastShrub', { x: 0, y: -1 }, fromEast); assert.ok(down && down.id !== 'pine-east', 'down takes a root that descends');
});
test('the trail is kept per zone, deepens with every pass, saves compactly and survives a bad save', () => {
  const p = freshProgress(); tread(p, 'summit', 1, 1, 0.5); tread(p, 'summit', 1.1, 0.9, 0.5); tread(p, 'cavern', 1, 1, 0.5);
  assert.equal(Object.keys(p.trail).length, 2, 'the summit and the cavern share x,z but not cells'); assert.ok(p.trail[cellKey('summit', 1, 1)] > 1);
  for (let i = 0; i < 50; i++) tread(p, 'summit', 1, 1, 0.5); assert.equal(p.trail[cellKey('summit', 1, 1)], TRAIL_MAX);
  const c = cellCentre(cellKey('floor', 14.3, -2.2)); assert.equal(c.zone, 'floor'); assert.ok(Math.abs(c.x - 14.3) < 0.5 && Math.abs(c.z + 2.2) < 0.5);
  assert.equal(arrive(p, 'eastShrub'), null); assert.equal(arrive(p, 'floorOak'), 'floor'); assert.equal(arrive(p, 'pine'), 'returned'); assert.equal(arrive(p, 'pine'), null);
  const back = parseProgress(serializeProgress(p)); assert.equal(back.at, 'pine'); assert.equal(back.returned, true); assert.deepEqual(back.visited, ['pine', 'eastShrub', 'floorOak']); assert.equal(back.trail[cellKey('summit', 1, 1)], TRAIL_MAX);
  assert.deepEqual(parseProgress('junk'), freshProgress()); assert.equal(parseProgress('{"at":"nowhere"}').at, 'pine');
  assert.equal(parseProgress('{"returned":true,"visited":["pine"]}').returned, false, 'cannot have returned without the floor');
  assert.deepEqual(parseProgress('{"trail":{"bad":1,"moon:1,1":2,"floor:1,1":99}}').trail, { 'floor:1,1': TRAIL_MAX });
});
test('the third-person camera knows the rock: inside the pillar is not clear, the cavern and the air are', () => {
  const rock = (p: ReturnType<typeof vec>) => insideRock(p, CAVERN.centre, CAVERN.radius, PILLAR_HEIGHT);
  assert.ok(rock(vec(0, 40, 0))); assert.equal(rock(vec(0, CAVERN.centre.y, 0)), false, 'the cavern is air'); assert.equal(rock(vec(pillarRadius(40) + 1, 40, 0)), false); assert.equal(rock(vec(0, PILLAR_HEIGHT + 1, 0)), false, 'above the top');
});
