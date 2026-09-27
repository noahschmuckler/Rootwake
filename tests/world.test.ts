import test from 'node:test';
import assert from 'node:assert/strict';
import { createTerrain, TERRAIN_STEP } from '../src/worldTerrain';
import { createRootNetwork, soilAt, siteTreeId, ENTRY_REACH } from '../src/worldRoots';
import { TREES } from '../src/villageModel';
import { chunkTrees } from '../src/chunkModel';
import { KARST_AT } from '../src/overworldModel';
import { PILLARS } from '../src/karstFlowModel';

test('terrain is seeded, repeatable, and collision is the actual mesh triangle at negative and positive coordinates', () => {
  const a = createTerrain(1), b = createTerrain(9), again = createTerrain(1);
  assert.notEqual(a.height(500,500), b.height(500,500));
  for (const [x,z] of [[500.3,510.2],[-400.6,201.7],[63.99,160.1],[-64.01,-200.8]]) {
    assert.equal(a.height(x,z),again.height(x,z));
    const ax=Math.floor(x/2)*2,az=Math.floor(z/2)*2,u=(x-ax)/2,v=(z-az)/2;
    const expected=u+v<=1?a.vertex(ax,az)*(1-u-v)+a.vertex(ax+2,az)*u+a.vertex(ax,az+2)*v:a.vertex(ax+2,az+2)*(u+v-1)+a.vertex(ax,az+2)*(1-u)+a.vertex(ax+2,az)*(1-v);
    assert.ok(Math.abs(a.height(x,z)-expected)<1e-12);
  }
  assert.equal(TERRAIN_STEP,2);
  for(const edge of [64,128,-64]) for(let z=-400;z<400;z+=13) assert.ok(Math.abs(a.height(edge-1e-6,z)-a.height(edge+1e-6,z))<1e-5);
});
test('grass excludes rock at every pillar, including outside the old ownership disc',()=>{
  for(const p of PILLARS) assert.equal(soilAt(KARST_AT.x+p.x,KARST_AT.z+p.z),false);
  assert.ok(soilAt(0,-100));
});
test('procedural roots are stable across load order and reload, join neighboring chunks and authored roots at identical sockets',()=>{
  const g=createRootNetwork(createTerrain(7));
  const snapshot=(cx:number,cz:number)=>g.generated(cx,cz).map(r=>[r.id,r.a,r.b,r.samples.map(p=>p.toArray())]);
  const before=snapshot(3,3);g.update(-500,-500);g.update(210,210);assert.deepEqual(snapshot(3,3),before);
  const a=g.generated(3,3),b=g.generated(4,3),east=a.find(r=>r.id.endsWith(':east'))!;
  assert.ok(east);
  const neighbor=b.find(r=>r.a===east.b)!;assert.ok(neighbor);
  assert.ok(east.curve.getPointAt(1).distanceTo(neighbor.curve.getPointAt(0))<1e-9);
  g.update(0,-100);assert.ok(g.dynamic.some(r=>r.id.includes('village:')));
  g.update(KARST_AT.x,KARST_AT.z);assert.ok(g.dynamic.some(r=>r.id.includes('karst:')));
  for(const r of g.dynamic.filter(r=>r.id.includes('karst:'))) {
    const node=g.node(r.b)!;assert.ok(node);
    assert.ok(r.curve.getPointAt(1).distanceTo(node.mouth.clone().add({x:KARST_AT.x,y:0,z:KARST_AT.z} as any))<1e-8);
  }
});
test('tree IDs do not wrap every 1024 chunks',()=>{
 const a=new Set(chunkTrees(3,3).map(t=>t.id));assert.ok(chunkTrees(1027,3).every(t=>!a.has(t.id)));
});

import {worldDescriptor,karstAnchors,cubeDirection,faceOf,arc,planetHeight,initialPose,travel,turn,dot,selectTiles,unit} from '../src/planetModel';
test('sphere addresses round-trip at faces, corners and poles without a height seam',()=>{
 const world=worldDescriptor(73,800);
 for(let f=0;f<6;f++)for(const u of [-1,-.37,0,.43,1])for(const v of [-1,-.22,0,.8,1]){
  const p=cubeDirection(f,u,v),q=faceOf(p),r=cubeDirection(q.face,q.u,q.v);
  assert.ok(arc(p,r,800)<.00003);assert.ok(Math.abs(planetHeight(world,p)-planetHeight(world,r))<1e-9);
 }
 assert.notEqual(planetHeight(world,cubeDirection(0,.2,.4)),planetHeight(worldDescriptor(74),cubeDirection(0,.2,.4)));
});
test('eight fixed authored sites have three equal nearest neighbors and preserve their cores',()=>{
 const anchors=karstAnchors(),world=worldDescriptor();assert.equal(anchors.length,8);
 for(const a of anchors){const ds=anchors.filter(b=>b!==a).map(b=>arc(a.direction,b.direction,800)).sort((a,b)=>a-b);assert.ok(Math.abs(ds[0]-ds[2])<1e-8);assert.equal(planetHeight(world,a.direction),0);}
});
test('great circle returns to start with heading intact; north-pole traversal has no singularity',()=>{
 const w=worldDescriptor(),start=initialPose();let p=start;const n=10000;
 for(let i=0;i<n;i++)p=travel(p,2*Math.PI*w.radius/n,w.radius);
 assert.ok(arc(p.up,start.up,w.radius)<.00003);assert.ok(dot(p.forward,start.forward)>1-1e-10);
 let pole={up:unit({x:0,y:1,z:0}),forward:unit({x:1,y:0,z:0})};pole=turn(travel(pole,20,800),.5);assert.ok(Math.abs(dot(pole.up,pole.forward))<1e-12);
});
test('sphere streaming selection covers faces with disjoint tiles and grows by LOD, not planet surface area',()=>{
 for(const radius of [800,1600,6400]){const ts=selectTiles(worldDescriptor(1,radius),initialPose().up);assert.ok(ts.length<900,`${radius}: ${ts.length} tiles`);
 const keys=new Set(ts.map(t=>t.key));assert.equal(keys.size,ts.length);
 for(let f=0;f<6;f++){const area=ts.filter(t=>t.face===f).reduce((s,t)=>s+1/4**t.level,0);assert.ok(Math.abs(area-1)<1e-12);}
 }
});

// R1: roots as a way. A course is planned through the surface roots between a tree near her and a node near the place, across chunks she has never loaded; the karst's own roots have shortest paths and portal destinations.
import { GOAL_REACH } from '../src/worldRoots';
import { shortestPath, destinationsFrom, nodeName, NODES, PILLARS } from '../src/karstFlowModel';
import { places as overworldPlaces, villageSites } from '../src/overworldModel';
test('a course runs from a tree by the village to the karst and back, joined root to root, surface roots only, the same twice', () => {
  const g = createRootNetwork(createTerrain(1));
  for (const [from, to] of [[{ x: 0, z: -16 }, KARST_AT], [{ x: KARST_AT.x + 20, z: KARST_AT.z + 30 }, { x: 0, z: 0 }], [{ x: 0, z: -16 }, overworldPlaces(1)[2]]] as const) {
    const c = g.plan(from, to)!; assert.ok(c, `a course from ${from.x},${from.z}`);
    assert.equal(c.roots.length, c.nodes.length - 1); assert.equal(c.entry, c.nodes[0]); assert.equal(c.goal, c.nodes[c.nodes.length - 1]);
    for (let i = 0; i < c.roots.length; i++) { const r = c.roots[i]; assert.ok(r.surface); assert.ok((r.a === c.nodes[i] && r.b === c.nodes[i + 1]) || (r.b === c.nodes[i] && r.a === c.nodes[i + 1]), `root ${i} joins its nodes`); }
    const e = g.nodeAt(c.entry)!, gl = g.nodeAt(c.goal)!; assert.notEqual(e.kind, 'hub', 'the way in is a tree'); assert.ok(Math.hypot(gl.x - to.x, gl.z - to.z) <= GOAL_REACH, 'it ends near the place');
    assert.deepEqual(g.plan(from, to)!.roots.map(r => r.id), c.roots.map(r => r.id), 'the same course again');
    assert.ok(c.length < Math.hypot(to.x - e.x, to.z - e.z) * 1.6 + 120, `not the long way round (${c.length.toFixed(0)} m)`);
  }
});
test('the karst roots: no way up from the foot (Noah: the trees near the karst have flat roots); a ledge tree offers the places its pillar’s roots reach', () => {
  assert.equal(shortestPath('floorOak', 'pine'), null, 'no root route from the foot to the summit'); assert.equal(shortestPath('Bfoot', 'pineB'), null, 'nor up sister B from its foot tree');
  const up = shortestPath('B0', 'pineB')!; assert.ok(up && up.length >= 2, 'up sister B from its first ledge');
  let at = 'B0'; for (const r of up) { assert.ok(r.a === at || r.b === at); at = r.a === at ? r.b : r.a; } assert.equal(at, 'pineB');
  assert.ok(shortestPath('southShrub', 'pine') && shortestPath('eastShrub', 'cavernFern'), 'the karst’s own plants reach each other');
  const places = destinationsFrom('B6'); const ids = places.map(p => p.id);
  assert.deepEqual(ids, ['pineB'], `sister B's halfway tree offers its summit and nothing of the other pillars (${ids.join(',')})`);
  const south = destinationsFrom('southShrub').map(p => p.id); assert.ok(south.includes('pine') && south.includes('cavernFern') && !south.some(id => NODES[id].zone === 'floor'), `the south ledge offers the summit and the cavern, no floor places (${south.join(',')})`);
  assert.ok(places.every((p, i) => i === 0 || p.length >= places[i - 1].length), 'nearest first');
  for (const n of Object.values(NODES)) if (n.zone === 'floor') assert.equal(destinationsFrom(n.id).length, 0, `${n.id}: a floor tree is no portal`);
  assert.equal(nodeName('pine'), 'the summit pine'); assert.equal(nodeName('pineB'), "the Heron's summit"); assert.equal(nodeName('B3'), 'the Heron, ledge 4'); assert.equal(nodeName('Cfoot'), 'the foot of the Anvil'); assert.equal(destinationsFrom('B0')[0].name, 'the Heron, halfway up');
  // The karsts' names (Noah, 2026-09-27): every pillar has one, all different, the one with the pool the Wellspire, the place on the map named after it.
  assert.equal(PILLARS.find(p => p.id === 'main')!.name, 'the Wellspire'); assert.equal(new Set(PILLARS.map(p => p.name)).size, PILLARS.length); assert.equal(overworldPlaces(1).find(p => p.kind === 'karst')!.name, 'the Wellspire');
});
test('the other villages have roots too (Noah: root travel did not work at the pines): a course from each far green home and back, an entry tree in reach, a root under the copse', () => {
  const g = createRootNetwork(createTerrain(1));
  for (const site of villageSites(1)) {
    const out = g.plan({ x: site.x, z: site.z }, { x: 0, z: 0 }), back = g.plan({ x: 0, z: -16 }, { x: site.x, z: site.z });
    assert.ok(out && out.roots.length >= 3, `${site.short}: a course home from its green`); assert.ok(back, `${site.short}: and a course to it`);
    const entry = g.nodeAt(out!.entry)!; assert.equal(entry.kind, 'village'); assert.equal(entry.id, siteTreeId(site.folk, entry.id - siteTreeId(site.folk, 0)), 'the way in is one of its own trees');
    assert.ok(g.nodesNear(site.x, site.z, ENTRY_REACH, false).length >= 6, 'its trees are in reach of its green');
    const copse = TREES[0]; assert.ok(g.nearest({ x: copse.x + site.x + 1, z: copse.z + site.z }, 6), 'a root under its copse for a tap');
  }
});
test('D4: blighted roots refuse root travel: no course ends in the blight, none crosses it, and a tap finds no root there', () => {
  const g = createRootNetwork(createTerrain(1)), lair = overworldPlaces(1)[2], R = 150;
  const free = g.plan({ x: 0, z: -16 }, lair); assert.ok(free, 'a way to the lair before the blight');
  g.setBlocked((x, z) => Math.hypot(x - lair.x, z - lair.z) <= R);
  assert.equal(g.plan({ x: 0, z: -16 }, lair), null, 'no course ends in the blight');
  const edge = { x: lair.x - (lair.x / Math.hypot(lair.x, lair.z)) * (R + 60), z: lair.z - (lair.z / Math.hypot(lair.x, lair.z)) * (R + 60) }, c = g.plan({ x: 0, z: -16 }, edge);
  assert.ok(c, 'a way to its edge'); for (const r of c!.roots) for (const p of [r.samples[0], r.samples[r.samples.length >> 1], r.samples[r.samples.length - 1]]) assert.ok(Math.hypot(p.x - lair.x, p.z - lair.z) > R, 'none crosses it');
  g.update(lair.x, lair.z); assert.equal(g.nearest({ x: lair.x + 20, z: lair.z }, 6), null, 'a tap in the blight finds no root');
});

import { warrens, dens as densOf, villageSites as sitesOf, places as placesOf, WARREN_FRAC, WARREN_SIDE, WARREN_RADIUS, freshOverworld as freshO, explore as exploreO, knownPlaces as knownOf } from '../src/overworldModel';
test('S1: a warren for every den, between the den and the village it comes down on, off the line by the seed; a place of its own, known when seen', () => {
  const ws = warrens(1), ds = densOf(1); assert.equal(ws.length, ds.length); assert.deepEqual(warrens(1), ws, 'deterministic');
  const villages = [{ x: 0, z: 0 }, ...sitesOf(1)];
  for (const w of ws) { const d = ds.find(x => x.id === w.den)!; assert.ok(d, 'its den exists'); const v = villages.slice().sort((a, b) => Math.hypot(a.x - d.x, a.z - d.z) - Math.hypot(b.x - d.x, b.z - d.z))[0], len = Math.hypot(v.x - d.x, v.z - d.z);
    const along = ((w.x - d.x) * (v.x - d.x) + (w.z - d.z) * (v.z - d.z)) / len, off = Math.abs((w.x - d.x) * (v.z - d.z) - (w.z - d.z) * (v.x - d.x)) / len;
    assert.ok(Math.abs(along - len * WARREN_FRAC) < 1.5, `a third of the way (${along.toFixed(0)} of ${len.toFixed(0)})`); assert.ok(off <= WARREN_SIDE + 1.5, `off the line by at most ${WARREN_SIDE} (${off.toFixed(0)})`); }
  assert.ok(placesOf(1).some(p => p.kind === 'warren' && p.id === ws[0].id && p.radius === WARREN_RADIUS)); const o = freshO(1); exploreO(o, ws[0].x, ws[0].z); assert.ok(knownOf(o).some(p => p.id === ws[0].id), 'a warren seen is known');
});
