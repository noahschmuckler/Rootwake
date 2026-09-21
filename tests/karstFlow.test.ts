import { test } from 'node:test'; import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { NODES, FOREST, ZONES, PILLARS, HELIX, KARST_ROOTS, NETWORK_ROOTS, SISTER_ROOTS, FLOW_ROOTS, rootsAt, routes, reachable, hopTargets, nodesOf, nearestNode, makeZoneWorld, trunkPoint, crownPoint, standNear, chooseRoot, screenDirections, departure, tread, cellKey, cellCentre, parseProgress, serializeProgress, freshProgress, arrive, insideRock, groundAt, onFloor, dense, TRAIL_MAX, HOP_REACH, HOP_RISE, CAVERN, PILLAR_HEIGHT, pillarRadius, vec, type Screen } from '../src/karstFlowModel';
test('every tree is a node: the karst’s plants, a dense forest at the foot, the sisters’ pines and their helices', () => {
  assert.ok(FOREST.length >= 350, `${FOREST.length} forest trees`); assert.ok(FOREST.filter(t => dense(t.at.x, t.at.z)).length > FOREST.length * 0.5, 'most of the forest is in the dense reach');
  for (const t of FOREST) { assert.ok(onFloor(t.at.x, t.at.z), 'on the floor'); assert.ok(t.climb); assert.equal(t.zone, 'floor'); }
  for (const a of FOREST) for (const b of FOREST) if (a !== b) assert.ok(Math.hypot(a.at.x - b.at.x, a.at.z - b.at.z) >= 4.4, 'trees keep their spacing');
  assert.equal(NODES.pine.kind, 'pine'); assert.equal(NODES.cavernFern.climb, false, 'a fern has no trunk to enter'); assert.ok(NODES.floorOak.climb && NODES.eastShrub.climb);
  for (const [pid, h] of Object.entries(HELIX)) { assert.ok(NODES[`pine${pid}`]); assert.ok(NODES[`${pid}foot`].zone === 'floor'); for (let i = 0; i < h.count; i++) { const n = NODES[`${pid}${i}`], z = ZONES[n.zone]; assert.ok(z && z.pillar === pid, `${pid}${i} has its ledge`); assert.ok(Math.abs(n.at.y - z.y) < 0.6); } }
  assert.equal(Object.keys(ZONES).filter(z => z.startsWith('summit')).length, 3, 'three summits');
});
test('the roots: the karst’s own (no taproot), a network joining every floor tree in one piece, and the sisters’ long roots', () => {
  assert.equal(KARST_ROOTS.length, 9); assert.ok(!KARST_ROOTS.some(r => r.dormant));
  assert.ok(NETWORK_ROOTS.length >= FOREST.length, `${NETWORK_ROOTS.length} network roots`); for (const r of NETWORK_ROOTS) { assert.ok(r.length < 22, `${r.id} is short`); for (let i = 1; i < 8; i++) assert.ok(r.curve.getPointAt(i / 8).y < -0.2, 'the network runs under the soil'); }
  for (const n of nodesOf('floor')) assert.ok(reachable('floorOak', n.id), `${n.id} joined to the oak by root`);
  assert.equal(SISTER_ROOTS.length, 4 + HELIX.B.count + HELIX.C.count, 'the long roots and a root up every ledge'); for (const r of SISTER_ROOTS) { assert.ok(r.length < 60, `${r.id} ${r.length.toFixed(0)} m`); for (let i = 1; i < 12; i++) { const p = r.curve.getPointAt(i / 12), pillar = PILLARS.find(q => q.id === r.id[0])!; assert.ok(Math.hypot(p.x - pillar.x, p.z - pillar.z) >= pillar.radius(p.y) - 0.05 || p.y > pillar.height - 0.5, `${r.id} stays on the face`); } }
  assert.equal(FLOW_ROOTS.length, KARST_ROOTS.length + SISTER_ROOTS.length + NETWORK_ROOTS.length);
  assert.ok(routes('pine', 'floorOak').length >= 2); assert.ok([...routes('floorOak', 'pine'), ...routes('floorMaple', 'pine')].length >= 3, 'the karst’s own ways up');
  for (const n of Object.values(NODES)) assert.ok(rootsAt(n.id).length >= 1, `${n.id} has a root`);
});
test('each sister summit has a root route and a leaf route from the karst’s foot, and the helix hops are within reach', () => {
  for (const pid of Object.keys(HELIX)) {
    assert.ok(reachable('pine', `pine${pid}`, 'root'), `root route from the summit to ${pid}`); assert.ok(reachable(`pine${pid}`, 'floorOak', 'root'), 'and back');
    assert.ok(reachable('floorOak', `pine${pid}`, 'hop'), `leaf route from the oak to ${pid}`); assert.ok(reachable(`pine${pid}`, 'floorOak', 'hop'), 'and back by leaf');
    const h = HELIX[pid as keyof typeof HELIX]; for (let i = 0; i + 1 < h.count; i++) assert.ok(hopTargets(NODES[`${pid}${i}`]).some(o => o.id === `${pid}${i + 1}`), `${pid}${i} leaps to ${pid}${i + 1}`);
    assert.ok(hopTargets(NODES[`${pid}${h.count - 1}`]).some(o => o.id === `pine${pid}`), 'the last ledge leaps to the summit pine'); assert.ok(hopTargets(NODES[`${pid}foot`]).some(o => o.id === `${pid}0`), 'the foot tree leaps to the first ledge');
  }
  for (const o of hopTargets(NODES.floorOak)) assert.ok(Math.hypot(o.at.x - NODES.floorOak.at.x, o.at.z - NODES.floorOak.at.z) <= HOP_REACH && Math.abs(o.at.y + o.crownH - NODES.floorOak.at.y - NODES.floorOak.crownH) <= HOP_RISE);
  assert.ok(!reachable('pine', 'pineB', 'hop'), 'no leaf route straight from the karst’s top: the way is down and round');
});
test('each zone is a small world for the shared player: edges hold, trunks block, the face and the pool and the pillars’ feet are not floor', () => {
  const summit = makeZoneWorld(ZONES.summit); assert.ok(summit.canOccupy(vec(1, PILLAR_HEIGHT + 0.02, 1), 0.25, 0.72)); assert.equal(summit.canOccupy(vec(3.5, PILLAR_HEIGHT, 0), 0.25, 0.72), false);
  assert.equal(summit.canOccupy(vec(NODES.pine.at.x, PILLAR_HEIGHT, NODES.pine.at.z), 0.25, 0.72), false, 'the pine’s trunk blocks');
  const floor = makeZoneWorld(ZONES.floor); assert.equal(floor.canOccupy(vec(0, 0, 0), 0.25, 0.72), false, 'the karst’s foot'); assert.equal(floor.canOccupy(vec(60, 0, -30), 0.25, 0.72), false, 'a sister’s foot'); assert.ok(floor.canOccupy(vec(20, 0.05, 0), 0.25, 0.72)); assert.ok(floor.canOccupy(vec(40, 0.05, -20), 0.25, 0.72), 'the floor runs on to the sisters');
  const t = FOREST[0]; assert.equal(floor.canOccupy(vec(t.at.x, t.at.y, t.at.z), 0.25, 0.72), false, 'a forest trunk blocks'); assert.equal(nearestNode('floor', t.at.x + 1, t.at.z).node.id, t.id);
  const ledge = makeZoneWorld(ZONES.ledgeB3), b = PILLARS.find(p => p.id === 'B')!; assert.equal(ledge.canOccupy(vec(b.x + (b.radius(ZONES.ledgeB3.y) - 0.3) * Math.cos(1), ZONES.ledgeB3.y, b.z + (b.radius(ZONES.ledgeB3.y) - 0.3) * Math.sin(1)), 0.25, 0.72), false, 'not into a sister’s rock');
  const cavern = makeZoneWorld(ZONES.cavern); assert.equal(cavern.canOccupy(vec(0, CAVERN.floorY, 0), 0.25, 0.72), false, 'the pool');
  for (const n of [NODES.pine, FOREST[3], NODES.B2, NODES.pineC, NODES.eastShrub]) { const s = standNear(n), z = ZONES[n.zone]; assert.ok(makeZoneWorld(z).canOccupy(vec(s.x, groundAt(z, s.x, s.z), s.z), 0.25, 0.72), `${n.id} has somewhere to emerge`); }
});
test('trunks and crowns: the bulge rides the trunk, the leaf figure stands at the crown’s edge, a leaning tree leans', () => {
  const t = FOREST[0], p0 = trunkPoint(t, 0, 0), p1 = trunkPoint(t, t.crownH, 0); assert.ok(Math.abs(p1.y - p0.y - t.crownH) < 1e-6); assert.ok(Math.abs(Math.hypot(p0.x - t.at.x, p0.z - t.at.z) - (t.trunk + 0.12)) < 1e-6);
  const c = crownPoint(t, 1); assert.ok(c.y > t.at.y + t.crownH); assert.ok(Math.hypot(c.x - t.at.x, c.z - t.at.z) < t.crownR);
  const s = NODES.eastShrub, top = trunkPoint(s, s.crownH, 0), foot = trunkPoint(s, 0, 0); assert.ok(Math.hypot(top.x - foot.x, top.z - foot.z) > 0.5, 'the shrub leans out from the rock');
  assert.ok(Math.hypot(top.x, top.z) > Math.hypot(foot.x, foot.z), 'and leans away from the pillar');
});
test('the stick chooses a root by where it visibly sets off; the trail is per zone; progress records the sisters’ summits', () => {
  const side: Screen = p => ({ x: p.x * 100, y: p.y * 100 });
  assert.equal(chooseRoot('pine', { x: 1, y: 0 }, side)?.id, 'pine-east'); assert.equal(chooseRoot('pine', { x: -1, y: -0.2 }, side)?.id, 'pine-west'); assert.equal(chooseRoot('pine', { x: 0.1, y: 0.1 }, side), null);
  assert.ok(departure(SISTER_ROOTS.find(r => r.id === 'B-mid-top')!, 'B6').y > NODES.B6.mouth.y, 'the top root sets off upward'); assert.ok(screenDirections('B6', side).length >= 3, 'a helix tree has its ledge neighbours and the long roots');
  const p = freshProgress(); tread(p, 'summit', 1, 1, 0.5); tread(p, 'cavern', 1, 1, 0.5); assert.equal(Object.keys(p.trail).length, 2); for (let i = 0; i < 50; i++) tread(p, 'summit', 1, 1, 0.5); assert.equal(p.trail[cellKey('summit', 1, 1)], TRAIL_MAX);
  assert.deepEqual(cellCentre(cellKey('ledgeB3', 40, -30)).zone, 'ledgeB3');
  assert.equal(arrive(p, 'floorOak'), 'floor'); assert.equal(arrive(p, 'B4'), null); assert.equal(arrive(p, 'pineB'), 'summit'); assert.equal(arrive(p, 'pineB'), null); assert.equal(arrive(p, 'pine'), 'returned');
  const back = parseProgress(serializeProgress(p)); assert.deepEqual(back.summits, ['summitB']); assert.equal(back.at, 'pine'); assert.equal(back.trail[cellKey('summit', 1, 1)], TRAIL_MAX);
  assert.deepEqual(parseProgress('junk'), freshProgress()); assert.deepEqual(parseProgress('{"summits":["summit","moon","summitC"],"trail":{"ledgeB2:1,1":9}}').summits, ['summitC']); assert.equal(parseProgress('{"trail":{"ledgeB2:1,1":9}}').trail['ledgeB2:1,1'], TRAIL_MAX);
});
test('the third-person camera knows every pillar’s rock: inside is not clear, the cavern and the air are', () => {
  assert.ok(insideRock(vec(0, 40, 0))); assert.ok(insideRock(vec(60, 40, -30)), 'a sister'); assert.equal(insideRock(vec(0, CAVERN.centre.y, 0)), false); assert.equal(insideRock(vec(pillarRadius(40) + 1, 40, 0)), false); assert.equal(insideRock(new Vector3(60, 79, -30)), false, 'above a sister’s top');
});
