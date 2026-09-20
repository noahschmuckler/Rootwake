import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Box3 } from 'three';
import { HuldaMotion } from '../src/huldaMotion';
import { createHulda } from '../src/huldaCharacter';

test('speed blend is continuous and stops after blocking, with no phase reset', () => {
  const m = new HuldaMotion(); let previousRun=0;
  for(let i=0;i<240;i++) { const phase=m.phase; m.update(1/60,i/240*2.8,0); assert.ok(Math.abs(m.run-previousRun)<.05); assert.ok((m.phase-phase+Math.PI*2)%(Math.PI*2)<.3); previousRun=m.run; }
  assert.ok(m.run>.99);
  for(let i=0;i<90;i++) m.update(1/60,0,0);
  assert.equal(m.moving,0);
  const phase=m.phase; m.update(1/60,0,0); assert.equal(m.phase,phase);
});
test('heading crosses the angle wrap by the short path', () => {
  const m=new HuldaMotion(); m.update(.016,1,Math.PI-.02); m.update(.016,1,-Math.PI+.02);
  assert.ok(Math.abs(m.heading-Math.PI)<.03);
});
test('non-grounded animation does not run in place; invalid timing stays finite', () => {
  const m=new HuldaMotion(); for(let i=0;i<120;i++) m.update(1/60,2.8,0,false);
  assert.equal(m.moving,0); m.update(NaN,Infinity,NaN); assert.ok(Number.isFinite(m.phase));
});
test('figure fits existing capsule at rest and has distinct articulated limbs', () => {
  const h=createHulda(); h.update(0,0,0,true); h.group.updateMatrixWorld(true);
  const box=new Box3().setFromObject(h.group);
  assert.ok(box.min.y>=-.015, 'feet on ground'); assert.ok(box.max.y<=.76, 'height stays near .72m capsule');
  assert.notEqual(h.joints.limbs[0].knee,h.joints.limbs[1].knee);
  for(let i=0;i<120;i++) h.update(1/60,2.8,0,true);
  assert.ok(h.joints.limbs.some(l=>Math.abs(l.hip.rotation.x)>.1));
  assert.equal(h.group.position.length(),0,'animation never changes world root');
  h.group.traverse(o=>assert.ok(o.position.toArray().every(Number.isFinite)));
  h.dispose();
});
