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

import { Group, Mesh, MeshStandardMaterial, SphereGeometry, Scene, Vector3, Quaternion } from 'three';
import { FormBlend, FORMS, createHuldaPresentation } from '../src/huldaPresentation';
import { createWoodForms } from '../src/huldaForms';

test('interrupted form changes preserve the exact displayed pose and total weight', () => {
  const b=new FormBlend(), p=new Vector3(), q=new Quaternion(); b.update(0,'human',p,q);
  for(const form of ['burl','knot','human','burl','human'] as const) {
    const before=b.position.clone(), rotation=b.rotation.clone(), w={...b.weights};
    p.add(new Vector3(.4,.3,.1)); q.setFromAxisAngle(new Vector3(0,1,0),p.x);
    b.update(.016,form,p,q);
    assert.ok(b.position.distanceTo(before)<1e-10); assert.ok(b.rotation.angleTo(rotation)<1e-7); assert.deepEqual(b.weights,w);
    for(let i=0;i<9;i++) {
      b.update(1/60,form,p,q);
      assert.ok(Math.abs(Object.values(b.weights).reduce((a,v)=>a+v,0)-1)<1e-10);
      assert.ok(Object.values(b.weights).every(v=>v>=0 && v<=1));
    }
  }
  for(let i=0;i<60;i++) b.update(1/60,'human',p,q);
  assert.equal(b.weights.human,1); assert.ok(b.position.distanceTo(p)<1e-10); assert.equal(b.active,false);
});
test('same-form landing preserves continuity and settles at 30/60/120 Hz', () => {
  for(const hz of [30,60,120]) {
    const b=new FormBlend(), q=new Quaternion(), p=new Vector3(0,1,0);
    b.update(0,'human',p,q,'rise'); p.x=1; b.update(1/hz,'human',p,q,'ground');
    assert.equal(b.position.x,0);
    for(let i=0;i<hz;i++) b.update(1/hz,'human',p,q,'ground');
    assert.equal(b.position.x,1); assert.equal(b.weights.human,1);
  }
});
test('root junction and reversal preserve position and rotate without a snap', () => {
  const b=new FormBlend(), p=new Vector3(), q=new Quaternion(); b.update(0,'knot',p,q);
  q.setFromAxisAngle(new Vector3(0,1,0),Math.PI); b.update(1/60,'knot',p,q);
  assert.ok(b.rotation.angleTo(new Quaternion())<1); assert.equal(b.position.length(),0);
});
test('wood forms have separate silhouettes with a bounded geometry/render budget', () => {
  const w=createWoodForms(), a=new Box3().setFromObject(w.burl), b=new Box3().setFromObject(w.knot);
  assert.ok(a.max.y-a.min.y>2*(b.max.y-b.min.y));
  let meshes=0,vertices=0;
  for(const form of [w.burl,w.knot]) form.traverse(o=>{ if(o instanceof Mesh) { meshes++;vertices+=o.geometry.attributes.position.count; } });
  assert.ok(meshes<=6); assert.ok(vertices<4000); w.dispose();
});
test('presentation has no blank frames, isolates materials and restores the unfolded pose', () => {
  const scene=new Scene(), material=new MeshStandardMaterial(), geometry=new SphereGeometry(.1);
  const leaf=new Group(), ivy=new Group(); leaf.add(new Mesh(geometry,material)); ivy.add(new Mesh(geometry,material));
  const p=createHuldaPresentation(scene,leaf,ivy), position=new Vector3(), rotation=new Quaternion();
  p.update(0,'human',position,rotation,0,0,true);
  const neutral=p.hulda.joints.spine.rotation.x;
  for(const form of [...FORMS,'human'] as const) for(let i=0;i<40;i++) {
    p.update(1/60,form,position,rotation,0,0,form==='human');
    assert.equal(p.root.children.filter(c=>c.visible).length>0,true);
    assert.ok(p.root.children.filter(c=>c.visible).every(c=>c.parent===p.root));
    assert.equal(material.opacity,1,'world material is untouched');
  }
  assert.equal(p.hulda.joints.spine.rotation.x,neutral);
  assert.equal(p.forms.human.visible,true); assert.equal(p.forms.knot.visible,false);
  p.update(1/60,'human',position,rotation,0,0,true,false); assert.equal(p.root.visible,false);
  p.dispose(); assert.equal(scene.children.length,0); geometry.dispose(); material.dispose();
});

import { Bone, Object3D, BoxGeometry, SkinnedMesh, Skeleton, AnimationClip, QuaternionKeyframeTrack, VectorKeyframeTrack, Float32BufferAttribute, Uint16BufferAttribute, Matrix4 } from 'three';
import { clipRoles, gaitWeights, timeScaleFor, pinRoot, fitModel, installRiggedModel, MODEL_HEIGHT, NOMINAL_SPEED, TIME_SCALE_MAX } from '../src/huldaRig';

test('prefab clips are told apart by name, Mixamo names included, and missing roles fold into the nearest', () => {
  assert.deepEqual(clipRoles(['Idle', 'Walking', 'Running']), { idle: 'Idle', walk: 'Walking', run: 'Running' });
  assert.deepEqual(clipRoles(['mixamo.com']), { walk: 'mixamo.com' }, 'a lone unnamed clip is the walk');
  assert.deepEqual(clipRoles(['Jog Forward', 'Breathing Idle']), { run: 'Jog Forward', idle: 'Breathing Idle' });
  const all = { idle: 1, walk: 1, run: 1 };
  for (const [moving, run] of [[0, 0], [1, 0], [1, 1], [0.5, 0.5], [1, 0.3]]) { const w = gaitWeights(moving, run, all); assert.ok(Math.abs(w.idle + w.walk + w.run - 1) < 1e-9); assert.ok(Object.values(w).every(v => v >= 0)); }
  assert.deepEqual(gaitWeights(1, 1, { idle: 1, walk: 1 }), { idle: 0, walk: 1, run: 0 }, 'no run clip: the walk runs');
  assert.deepEqual(gaitWeights(0.5, 0, { walk: 1 }), { idle: 0, walk: 1, run: 0 }, 'only a walk: it also idles');
  assert.equal(timeScaleFor('idle', 2.8), 1); assert.equal(timeScaleFor('walk', NOMINAL_SPEED.walk), 1); assert.equal(timeScaleFor('walk', 99), TIME_SCALE_MAX); assert.ok(timeScaleFor('run', 1.4) < 1);
});
/** A two-bone skinned box, the shape of a Mixamo export in miniature: 180 units tall, facing +Z. */
function rig(): { root: Object3D; hips: Bone; spine: Bone } {
  const root = new Object3D(), hips = new Bone(), spine = new Bone(); hips.name = 'Hips'; spine.name = 'Spine'; spine.position.y = 90; hips.add(spine);
  const geo = new BoxGeometry(30, 180, 20); geo.translate(0, 90, 0); const n = geo.attributes.position.count;
  geo.setAttribute('skinIndex', new Uint16BufferAttribute(new Array(n * 4).fill(0).map((_, i) => (i % 4 === 0 && geo.attributes.position.getY(i / 4) > 90 ? 1 : 0)), 4));
  geo.setAttribute('skinWeight', new Float32BufferAttribute(new Array(n * 4).fill(0).map((_, i) => (i % 4 === 0 ? 1 : 0)), 4));
  const mesh = new SkinnedMesh(geo); mesh.add(hips); mesh.bind(new Skeleton([hips, spine], [new Matrix4(), new Matrix4().makeTranslation(0, -90, 0)])); root.add(mesh);
  return { root, hips, spine };
}
test('a rigged file is fitted to the capsule, turned to face -Z, pinned in place and driven by speed', () => {
  const r = rig(); const fit = fitModel(r.root, '+z'); assert.ok(Math.abs(fit.sourceHeight - 180) < 1e-3); r.root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(r.root); assert.ok(Math.abs(box.max.y - box.min.y - MODEL_HEIGHT) < 1e-3, 'capsule height'); assert.ok(Math.abs(box.min.y) < 1e-3, 'feet on the ground'); assert.ok(Math.abs(box.max.x + box.min.x) < 1e-3, 'centred');
  assert.ok(Math.abs(Math.abs(r.root.rotation.y) - Math.PI) < 1e-9, 'turned to face -Z');
  const travel = new AnimationClip('Walking', 1, [new VectorKeyframeTrack('Hips.position', [0, 1], [0, 0, 0, 2, 0.1, 3])]); pinRoot(travel, 'Hips');
  { const v = Array.from((travel.tracks[0] as VectorKeyframeTrack).values); assert.deepEqual(v.map(x => Math.round(x * 1000) / 1000), [0, 0, 0, 0, 0.1, 0], 'x and z travel pinned, the bob kept'); }
  const q = (a: number) => [Math.sin(a / 2), 0, 0, Math.cos(a / 2)];
  const swing = (name: string, amp: number, seconds: number) => new AnimationClip(name, seconds, [new QuaternionKeyframeTrack('Spine.quaternion', [0, seconds / 4, seconds / 2, seconds * 3 / 4, seconds], [...q(0), ...q(amp), ...q(0), ...q(-amp), ...q(0)])]);
  const m = installRiggedModel(rig().root, [swing('Idle', 0.05, 2), swing('Walking', 0.4, 1), swing('Running', 0.7, 0.6)], '+z');
  assert.deepEqual(m.roles, { idle: 'Idle', walk: 'Walking', run: 'Running' });
  for (let i = 0; i < 30; i++) m.update(1 / 60, 0, 0, true); assert.ok(m.actions.idle!.getEffectiveWeight() > 0.99 && m.actions.run!.getEffectiveWeight() < 0.01, 'idle at rest');
  const spine = m.root.getObjectByName('Spine') as Bone; let maxSwing = 0;
  for (let i = 0; i < 120; i++) { m.update(1 / 60, 2.8, 0, true); maxSwing = Math.max(maxSwing, Math.abs(spine.rotation.x)); }
  assert.ok(m.actions.run!.getEffectiveWeight() > 0.99, 'running at 2.8 m/s'); assert.ok(maxSwing > 0.3, `the run clip moves the bone (${maxSwing.toFixed(2)})`);
  assert.ok(Math.abs(m.actions.run!.getEffectiveTimeScale() - 1) < 1e-6, 'the run cycle keeps pace at its nominal speed');
  for (let i = 0; i < 60; i++) m.update(1 / 60, 2.8, 0, true, 1); assert.ok(m.actions.idle!.getEffectiveWeight() > 0.99, 'folding into wood settles to the idle');
  m.update(NaN, Infinity, NaN, true); m.root.traverse(o => assert.ok(o.position.toArray().every(Number.isFinite)));
  m.dispose();
});
test('the presentation swaps a rigged model in for the procedural figure and out again', () => {
  const scene = new Scene(), p = createHuldaPresentation(scene, new Group(), new Group());
  const m = installRiggedModel(rig().root, [new AnimationClip('Idle', 1, [])], '+z'); p.setModel(m);
  assert.equal(p.model, m); assert.equal(p.hulda.group.visible, false); assert.ok(p.forms.human.children.includes(m.root));
  p.update(1 / 60, 'human', new Vector3(), new Quaternion(), 1, 0, true); p.update(1 / 60, 'burl', new Vector3(), new Quaternion(), 0, 0, true);
  p.setModel(null); assert.equal(p.model, null); assert.equal(p.hulda.group.visible, true); assert.ok(!p.forms.human.children.includes(m.root));
  p.dispose();
});
