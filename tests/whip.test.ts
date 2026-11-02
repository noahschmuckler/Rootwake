// F5a (WHIP.md): the whip's figures as plans, and the model's side of them (a figure drives a raider; she flows clear of bites).
import { test } from 'node:test'; import assert from 'node:assert/strict';
import { planFigure, sampleKeys, ropeAt, Flow, figuresFor, trackEnd, PRONE_S, type Arrangement } from '../src/whipModel';
import { spawnFoe, freshVillage, stepRaiders, defense, lash, strikeDamage } from '../src/villageModel';

// She stands at the origin facing -z (yaw 0); foes are set down ahead of her.
const arr = (...foes: [number, number][]): Arrangement => ({ x: 0, z: 0, yaw: 0, foes: foes.map(([x, z], i) => ({ id: i + 1, x, z, heading: Math.atan2(-z, -x) })) });
const end = (k: { x: number; z: number }[]) => k[k.length - 1];

test('a foe 6 m off is a matador: hauled in, clotheslined at her shoulder, prone behind her', () => {
  const p = planFigure(arr([0, -6]))!; assert.equal(p.figure, 'matador');
  const foe = p.foes.get(1)!, down = sampleKeys(foe, p.duration);
  assert.ok(down.z > 1.5, `lies behind her: ${down.z}`); assert.ok(Math.abs(down.roll) > 1.2, 'on its side');
  const cl = p.beats.find(b => b.kind === 'clothesline')!; assert.ok(cl.dmg > 1);
  // As it passes her shoulder it is beside her, not through her.
  const her = sampleKeys(p.her, cl.t), it = sampleKeys(foe, cl.t); const gap = Math.hypot(her.x - it.x, her.z - it.z); assert.ok(gap > 0.6 && gap < 1.4, `passes at ${gap.toFixed(2)} m`);
  // Up again after it has lain a while.
  assert.ok(trackEnd(foe) > p.duration + PRONE_S); assert.equal(end(foe).roll, 0);
});
test('a foe in reach is a swap: they trade places', () => {
  const p = planFigure(arr([0, -2.2]))!; assert.equal(p.figure, 'swap');
  const her = end(p.her), foe = end(p.foes.get(1)!);
  assert.ok(her.z < -1.5, `she ends where it stood: ${her.z}`); assert.ok(foe.z > -0.8, `it ends by her old spot: ${foe.z}`);
  assert.ok(p.beats.some(b => b.kind === 'skid'));
});
test('the swap whirls the foe into a neighbour by her old spot', () => {
  const p = planFigure(arr([0, -2.2], [1.2, 0.8]))!; assert.equal(p.figure, 'swap');
  const crash = p.beats.find(b => b.kind === 'crash')!; assert.equal(crash.other, 2);
  const it = sampleKeys(p.foes.get(1)!, crash.t), n = sampleKeys(p.foes.get(2)!, crash.t); assert.ok(Math.hypot(it.x - n.x, it.z - n.z) < 1, 'they meet');
  assert.ok(Math.abs(sampleKeys(p.foes.get(2)!, crash.t + 0.6).roll) > 1, 'the neighbour is knocked down too');
});
test('where both fit, the figure she did not do last', () => {
  assert.deepEqual(figuresFor(4), ['matador', 'swap']);
  assert.equal(planFigure(arr([0, -4]), { last: 'matador' })!.figure, 'swap');
  assert.equal(planFigure(arr([0, -4]), { last: 'swap' })!.figure, 'matador');
});
test('the stick picks the target; nothing in reach, no figure', () => {
  const a = arr([0, -5], [5, 0]); assert.equal(planFigure(a, { aim: { x: 1, z: 0 } })!.target, 2); assert.equal(planFigure(a, { aim: { x: 0, z: -1 } })!.target, 1);
  assert.equal(planFigure(arr([0, -14])), null);
});
test('she flows to the free side, and not where she cannot stand', () => {
  const right = planFigure(arr([0, -6]), { side: 1 })!, left = planFigure(arr([0, -6]), { side: -1 })!;
  assert.ok(sampleKeys(right.her, right.duration).x > 0.5 && sampleKeys(left.her, left.duration).x < -0.5);
  const noRight = planFigure(arr([0, -6]), { side: 1, canStand: x => x < 0.2 })!; assert.equal(noRight.side, -1);
  assert.equal(planFigure(arr([0, -6]), { canStand: () => false }), null);
  // Away from the crowd: foes on her right send her left.
  assert.equal(planFigure(arr([0, -6], [3, -2], [4, 0]), { figure: 'matador' })!.side, -1);
});
test('the rope reaches the foe at the lash and is coiled again after', () => {
  const p = planFigure(arr([0, -6]))!, lashAt = p.beats.find(b => b.kind === 'lash')!.t;
  assert.equal(ropeAt(p.rope, 0), 0); assert.equal(ropeAt(p.rope, lashAt), 1); assert.equal(ropeAt(p.rope, p.duration + 0.5), 0);
});
test('a flow gives each beat once, in order', () => {
  const p = planFigure(arr([0, -2.2], [1.2, 0.8]))!, f = new Flow(p), seen: string[] = [];
  for (let i = 0; i < 200; i++) for (const b of f.step(1 / 60)) seen.push(b.kind);
  assert.deepEqual(seen, p.beats.map(b => b.kind)); assert.ok(f.done); assert.ok(f.end > p.duration);
});
test('a raider in a figure is moved by it alone, and comes out needing a whole wind up', () => {
  const v = freshVillage(7), r = spawnFoe(v, 'wolf', 1, 0, 30); r.choreo = 1; r.biteClock = 1;
  stepRaiders(v, 0.5, { x: 0, z: 0 }); assert.deepEqual([r.x, r.z, r.biteClock], [1, 0, 0]); assert.ok(r.choreo! > 0);
  stepRaiders(v, 0.6, { x: 0, z: 0 }); assert.equal(r.choreo, 0);
});
test('flowing, a bite misses without root time; a beat hurts by her strike', () => {
  const v = freshVillage(7), r = spawnFoe(v, 'wolf', 1, 0, 30), vig = v.hero.vigor; defense.flowing = true;
  for (let i = 0; i < 200; i++) stepRaiders(v, 0.05, { x: 0, z: 0 });
  defense.flowing = false; assert.equal(v.hero.vigor, vig); assert.equal(defense.dodged, 0); defense.lunges.length = 0;
  const hp = r.hp; assert.ok(lash(v, r.id, 1)); assert.equal(r.hp, Math.max(0, hp - strikeDamage(v.hero)));
});
