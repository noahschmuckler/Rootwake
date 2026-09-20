import { test } from 'node:test'; import assert from 'node:assert/strict';
import { TREES, ROOTS, connected, nearestRoot, nextRoot, rootPoint, rootTangent, endTree, nearestTree, hopTargets, wallSite, HANDHOLDS, groundAt, onGround, WALL_Z, WALL_H, makeGroundWorld, tread, parseGrowth, serializeGrowth, freshGrowth, TRAIL_MAX, cellKey, cellCentre, vec, trunkRadius } from '../src/flowModel';
test('the root network joins every tree in one piece and its outer roots taper to dead ends', () => {
  assert.ok(connected(), 'every tree reachable along roots');
  const tapers = ROOTS.filter(r => r.taper); assert.ok(tapers.length >= 5, `${tapers.length} tapering roots`);
  for (const r of tapers) { assert.equal(r.b, null); assert.ok(rootPoint(r, r.length).z >= WALL_Z + 1.2, 'no root runs into the wall'); }
  for (const r of ROOTS) { assert.ok(r.length > 3); for (const s of r.samples) assert.ok(s.y < -0.2 && s.y > -3.5, 'roots stay in the soil'); }
  for (const t of TREES) assert.ok(ROOTS.some(r => r.a === t.id || r.b === t.id), `tree ${t.id} has a root`);
});
test('the network is a rail: nearest point, ends at trees, and the next root chosen by the stick', () => {
  const t = TREES[0], n = nearestRoot(vec(t.x + 1.5, 0, t.z + 0.2)); assert.ok(n.distance < 1.6); assert.ok(n.root.a === t.id || n.root.b === t.id);
  const r = ROOTS.find(r => !r.taper)!; assert.equal(endTree(r, false), r.a); assert.equal(endTree(r, true), r.b);
  const from = TREES[r.a], to = TREES[r.b!], want = vec(to.x - from.x, 0, to.z - from.z).normalize();
  const next = nextRoot(r.a, want); assert.ok(next); assert.equal(next!.root.id, r.id); assert.equal(next!.forward, true);
  assert.equal(nextRoot(r.a, want.clone().negate(), r) === null || nextRoot(r.a, want.clone().negate(), r)!.root !== r, true);
  const tan = rootTangent(r, 0.2); assert.ok(Math.abs(tan.length() - 1) < 1e-6);
});
test('trees, crowns and the wall: what pressing into things meets', () => {
  const n = nearestTree(TREES[2].x + 0.6, TREES[2].z); assert.equal(n.tree.id, 2); assert.ok(n.distance < 0.6 - trunkRadius(TREES[2]) + 1e-9);
  assert.ok(hopTargets(TREES[0]).length >= 2, 'the canopy has neighbours to slide to');
  assert.equal(wallSite(HANDHOLDS.x0 + 1).kind, 'handholds'); assert.equal(wallSite(-6).kind, 'ivy'); assert.equal(wallSite(-6.4).kind === 'ivy' && (wallSite(-6.4) as { site: number }).site, (wallSite(-6) as { site: number }).site, 'nearby x share an ivy site');
  assert.equal(groundAt(0, WALL_Z - 3) > WALL_H - 0.1, true, 'the ledge stands above the wall'); assert.equal(onGround(0, WALL_Z), false, 'the wall itself is not ground'); assert.ok(onGround(0, 0)); assert.ok(onGround(0, WALL_Z - 2));
  const world = makeGroundWorld(); assert.deepEqual(world.surfacesAt(0, WALL_Z), []); assert.equal(world.canOccupy(vec(TREES[0].x, 0, TREES[0].z), 0.25, 0.72), false, 'trunks block'); assert.ok(world.canOccupy(vec(2, 0.05, 6), 0.25, 0.72));
});
test('the trail deepens with every pass and saves compactly; growth survives a bad save', () => {
  const g = freshGrowth(); tread(g, 1, 1, 0.5); tread(g, 1.1, 0.9, 0.5); assert.equal(Object.keys(g.trail).length, 1, 'one cell'); const v = g.trail[cellKey(1, 1)]; assert.ok(v > 1 && v < 1.2);
  for (let i = 0; i < 50; i++) tread(g, 1, 1, 0.5); assert.equal(g.trail[cellKey(1, 1)], TRAIL_MAX);
  const c = cellCentre(cellKey(4.3, -2.2)); assert.ok(Math.abs(c.x - 4.3) < 0.5 && Math.abs(c.z + 2.2) < 0.5);
  g.ivy.push(2); const back = parseGrowth(serializeGrowth(g)); assert.equal(back.trail[cellKey(1, 1)], TRAIL_MAX); assert.deepEqual(back.ivy, [2]);
  assert.deepEqual(parseGrowth('junk'), freshGrowth()); assert.deepEqual(parseGrowth('{"trail":{"bad":1,"1,1":99},"ivy":[1.5,"x",200,3]}'), { trail: { '1,1': TRAIL_MAX }, ivy: [3] });
});
