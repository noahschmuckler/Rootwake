import { test } from 'node:test'; import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { NODES, FOREST, ZONES, PILLARS, KARST_ROOTS, NETWORK_ROOTS, FLOW_ROOTS, rootsAt, routes, reachable, hopTargets, nodesOf, nearestNode, makeZoneWorld, trunkPoint, crownPoint, standNear, chooseRoot, screenDirections, departure, tread, cellKey, cellCentre, parseProgress, serializeProgress, freshProgress, arrive, insideRock, groundAt, onFloor, dense, TRAIL_MAX, HOP_REACH, HOP_RISE, CAVERN, PILLAR_HEIGHT, pillarRadius, vec, type Screen } from '../src/karstFlowModel';
test('every tree is a node: the karst’s plants and a dense forest at the foot; one karst, no sisters (Noah, 2026-10-19)', () => {
  assert.ok(FOREST.length >= 350, `${FOREST.length} forest trees`); assert.ok(FOREST.some(t => dense(t.at.x, t.at.z)), 'the dense reach round the karst');
  for (const t of FOREST) { assert.ok(onFloor(t.at.x, t.at.z), 'on the floor'); assert.ok(t.climb); assert.equal(t.zone, 'floor'); }
  for (const a of FOREST) for (const b of FOREST) if (a !== b) assert.ok(Math.hypot(a.at.x - b.at.x, a.at.z - b.at.z) >= 4.4, 'trees keep their spacing');
  assert.equal(NODES.pine.kind, 'pine'); assert.equal(NODES.cavernFern.climb, false, 'a fern has no trunk to enter'); assert.ok(NODES.floorOak.climb && NODES.eastShrub.climb);
  assert.deepEqual(PILLARS.map(p => p.id), ['main'], 'one karst'); assert.equal(Object.keys(ZONES).filter(z => z.startsWith('summit')).length, 1, 'one summit');
  for (const n of Object.values(NODES)) assert.equal(ZONES[n.zone].pillar, 'main');
});
test('the roots: none on the karst’s faces (Noah, 2026-10-19: no root ascends or descends it); a network joining every floor tree in one piece', () => {
  for (const r of KARST_ROOTS) assert.ok(NODES[r.a].zone === 'floor' && NODES[r.b].zone === 'floor', `${r.id} stays on the floor`); assert.ok(!KARST_ROOTS.some(r => r.dormant));
  for (const n of nodesOf('floor')) for (const r of rootsAt(n.id)) { assert.ok(NODES[r.a].zone === 'floor' && NODES[r.b].zone === 'floor', `${r.id} stays on the floor`); for (let i = 0; i <= 10; i++) { const y = r.curve.getPointAt(i / 10).y; assert.ok(y > -2.5 && y < 1, `${r.id} is flat (${y.toFixed(1)})`); } }
  assert.ok(NETWORK_ROOTS.length >= FOREST.length, `${NETWORK_ROOTS.length} network roots`); for (const r of NETWORK_ROOTS) { assert.ok(r.length < 22, `${r.id} is short`); for (let i = 1; i < 8; i++) assert.ok(r.curve.getPointAt(i / 8).y < -0.2, 'the network runs under the soil'); }
  for (const n of nodesOf('floor')) assert.ok(reachable('floorOak', n.id), `${n.id} joined to the oak by root`);
  assert.equal(FLOW_ROOTS.length, KARST_ROOTS.length + NETWORK_ROOTS.length);
  assert.equal(routes('pine', 'floorOak').length, 0, 'no root route from the summit to the floor'); assert.equal(rootsAt('pine').length, 0, 'nor any root at the summit pine'); assert.equal(rootsAt('eastShrub').length, 0, 'nor on the ledges');
  for (const o of hopTargets(NODES.floorOak)) assert.ok(Math.hypot(o.at.x - NODES.floorOak.at.x, o.at.z - NODES.floorOak.at.z) <= HOP_REACH && Math.abs(o.at.y + o.crownH - NODES.floorOak.at.y - NODES.floorOak.crownH) <= HOP_RISE);
  assert.ok(!reachable('pine', 'floorOak', 'hop'), 'no leaf route down from the summit: the way down is the drop');
});
test('each zone is a small world for the shared player: edges hold, trunks block, the face and the pool and the pillars’ feet are not floor', () => {
  const summit = makeZoneWorld(ZONES.summit); assert.ok(summit.canOccupy(vec(1, PILLAR_HEIGHT + 0.02, 1), 0.25, 0.72)); assert.ok(summit.canOccupy(vec(3.6, PILLAR_HEIGHT, 0), 0.25, 0.72), 'to the rim (Noah)'); assert.equal(summit.canOccupy(vec(4.2, PILLAR_HEIGHT, 0), 0.25, 0.72), false, 'not over it');
  assert.equal(summit.canOccupy(vec(NODES.pine.at.x, PILLAR_HEIGHT, NODES.pine.at.z), 0.25, 0.72), false, 'the pine’s trunk blocks');
  const floor = makeZoneWorld(ZONES.floor); assert.equal(floor.canOccupy(vec(0, 0, 0), 0.25, 0.72), false, 'the karst’s foot'); assert.ok(floor.canOccupy(vec(20, 0.05, 0), 0.25, 0.72)); assert.ok(floor.canOccupy(vec(60, 0.05, -30), 0.25, 0.72), 'where a sister stood is floor');
  const t = FOREST[0]; assert.equal(floor.canOccupy(vec(t.at.x, t.at.y, t.at.z), 0.25, 0.72), false, 'a forest trunk blocks'); assert.equal(nearestNode('floor', t.at.x + 1, t.at.z).node.id, t.id);
  const cavern = makeZoneWorld(ZONES.cavern); assert.equal(cavern.canOccupy(vec(0, CAVERN.floorY, 0), 0.25, 0.72), false, 'the pool');
  for (const n of [NODES.pine, FOREST[3], NODES.eastShrub]) { const s = standNear(n), z = ZONES[n.zone]; assert.ok(makeZoneWorld(z).canOccupy(vec(s.x, groundAt(z, s.x, s.z), s.z), 0.25, 0.72), `${n.id} has somewhere to emerge`); }
});
test('trunks and crowns: the bulge rides the trunk, the leaf figure stands at the crown’s edge, a leaning tree leans', () => {
  const t = FOREST[0], p0 = trunkPoint(t, 0, 0), p1 = trunkPoint(t, t.crownH, 0); assert.ok(Math.abs(p1.y - p0.y - t.crownH) < 1e-6); assert.ok(Math.abs(Math.hypot(p0.x - t.at.x, p0.z - t.at.z) - (t.trunk + 0.12)) < 1e-6);
  const c = crownPoint(t, 1); assert.ok(c.y > t.at.y + t.crownH); assert.ok(Math.hypot(c.x - t.at.x, c.z - t.at.z) < t.crownR);
  const s = NODES.eastShrub, top = trunkPoint(s, s.crownH, 0), foot = trunkPoint(s, 0, 0); assert.ok(Math.hypot(top.x - foot.x, top.z - foot.z) > 0.5, 'the shrub leans out from the rock');
  assert.ok(Math.hypot(top.x, top.z) > Math.hypot(foot.x, foot.z), 'and leans away from the pillar');
});
test('the trail is per zone; progress records the summits', () => {
  const side: Screen = p => ({ x: p.x * 100, y: p.y * 100 });
  assert.equal(chooseRoot('pine', { x: 1, y: 0 }, side), null, 'the summit pine has no root to choose'); const r0 = rootsAt('floorOak')[0]; assert.ok(departure(r0, 'floorOak')); assert.ok(screenDirections('floorOak', side).length >= 1);
  const p = freshProgress(); tread(p, 'summit', 1, 1, 0.5); tread(p, 'cavern', 1, 1, 0.5); assert.equal(Object.keys(p.trail).length, 2); for (let i = 0; i < 50; i++) tread(p, 'summit', 1, 1, 0.5); assert.equal(p.trail[cellKey('summit', 1, 1)], TRAIL_MAX);
  assert.deepEqual(cellCentre(cellKey('east', 4, 1)).zone, 'east');
  assert.equal(arrive(p, 'floorOak'), 'floor');
  const back = parseProgress(serializeProgress(p)); assert.equal(back.trail[cellKey('summit', 1, 1)], TRAIL_MAX);
  assert.deepEqual(parseProgress('junk'), freshProgress()); assert.deepEqual(parseProgress('{"summits":["summit","moon","summitC"]}').summits, [], 'a sister’s summit from an old save is dropped');
});
test('the third-person camera knows every pillar’s rock: inside is not clear, the cavern and the air are', () => {
  assert.ok(insideRock(vec(0, 40, 0))); assert.equal(insideRock(vec(60, 40, -30)), false, 'no sister'); assert.equal(insideRock(vec(0, CAVERN.centre.y, 0)), false); assert.equal(insideRock(vec(pillarRadius(40) + 1, 40, 0)), false); void Vector3;
});
