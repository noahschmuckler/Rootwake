import { test } from 'node:test'; import assert from 'node:assert/strict';
import { Impact, BLOWS, STOP_SCALE, SLOW_SCALE } from '../src/impact';
import { spawnFoe, freshVillage, strike, stepRaiders, WOLF_HP, DY_HP, STRIKE_DMG } from '../src/villageModel';

const cam = () => { const q = { x: 0, y: 0, z: 0, w: 1, set(x: number, y: number, z: number, w: number) { q.x = x; q.y = y; q.z = z; q.w = w; } }; const c = { fov: 60, position: { x: 1, y: 2, z: 3 }, quaternion: q, updates: 0, rotateX(a: number) { q.x += a; }, rotateY(a: number) { q.y += a; }, rotateZ(a: number) { q.z += a; }, updateProjectionMatrix() { c.updates++; } }; return c; };

test('a blow freezes the world for its stop, then time runs again', () => {
  const k = new Impact(); k.hit('light');
  assert.equal(k.step(0.016), STOP_SCALE); assert.equal(k.step(0.016), STOP_SCALE);
  let t = 0.032; while (k.stop > 0) { k.step(0.016); t += 0.016; }
  assert.ok(Math.abs(t - BLOWS.light.stop) < 0.02, `stood still ${t}`);
  assert.equal(k.step(0.016), 1);
});
test('blows do not stack into a long freeze: the stronger wins', () => {
  const k = new Impact(); for (let i = 0; i < 10; i++) k.hit('light'); assert.equal(k.stop, BLOWS.light.stop);
  k.hit('kill'); assert.equal(k.stop, BLOWS.kill.stop); k.hit('light'); assert.equal(k.stop, BLOWS.kill.stop);
  assert.ok(k.trauma <= 1);
});
test('a finale slows time after its stop and eases back to full speed', () => {
  const k = new Impact(); k.hit('finale'); while (k.stop > 0) k.step(0.016);
  const first = k.step(0.016); assert.ok(first < 0.4 && first >= SLOW_SCALE, `slow ${first}`);
  let last = first; for (let i = 0; i < 100; i++) { const s = k.step(0.016); assert.ok(s >= last - 1e-9, 'never slower again'); last = s; }
  assert.equal(last, 1); assert.equal(k.held, false);
});
test('the shake and punch touch the camera only between push and pop', () => {
  const k = new Impact(), c = cam(); k.hit('heavy'); k.step(0.01);
  k.push(c); assert.notEqual(c.fov, 60); assert.ok(c.quaternion.x !== 0 || c.quaternion.y !== 0 || c.quaternion.z !== 0);
  k.pop(c); assert.equal(c.fov, 60); assert.deepEqual([c.position.x, c.position.y, c.position.z], [1, 2, 3]); assert.deepEqual([c.quaternion.x, c.quaternion.y, c.quaternion.z, c.quaternion.w], [0, 0, 0, 1]);
  k.shake = false; k.push(c); assert.deepEqual([c.quaternion.x, c.quaternion.y, c.quaternion.z], [0, 0, 0]); k.pop(c);
});
test('trauma and the punch die away', () => {
  const k = new Impact(); k.hit('finale'); for (let i = 0; i < 120; i++) k.step(0.016); assert.equal(k.trauma, 0); assert.equal(k.kick, 0);
});
test('a practice foe is set down hunting her, and is struck like any other', () => {
  const v = freshVillage(1), w = spawnFoe(v, 'wolf', 0, -1.2, 30), d = spawnFoe(v, 'dy', 6, 0, 30);
  assert.equal(w.hp, WOLF_HP); assert.equal(d.hp, DY_HP); assert.equal(w.state, 'hunting'); assert.notEqual(w.id, d.id);
  const hit = strike(v, { x: 0, z: 0 }, 0, -1); assert.equal(hit?.id, w.id); assert.equal(w.hp, WOLF_HP - STRIKE_DMG);
  stepRaiders(v, 0.5, { x: 0, z: 0 }); assert.equal(d.state, 'hunting'); assert.ok(Math.hypot(d.x, d.z) < 6, 'it comes for her');
});
