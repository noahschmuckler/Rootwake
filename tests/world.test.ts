import test from 'node:test';
import assert from 'node:assert/strict';
import { createTerrain, TERRAIN_STEP } from '../src/worldTerrain';
import { createRootNetwork, soilAt } from '../src/worldRoots';
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
