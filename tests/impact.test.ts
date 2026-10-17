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

import { MoveQueue, MOVES, type MoveEvent } from '../src/huldaMoves';
const run = (q: MoveQueue, seconds: number, presses: Record<number, Parameters<MoveQueue['press']>[0]> = {}): MoveEvent[] => {
  const out: MoveEvent[] = []; const dt = 1 / 60; for (let i = 0; i * dt < seconds; i++) { const p = presses[i]; if (p) q.press(p); out.push(...q.step(dt)); } return out;
};
test('a tap is one blow: it starts, lands once at its contact, and ends', () => {
  const q = new MoveQueue(); q.press('light'); const ev = run(q, 2);
  assert.deepEqual(ev.map(e => `${e.kind}:${e.move}`), ['start:attack-1', 'contact:attack-1', 'end:attack-1']);
  const s = MOVES['attack-1']; assert.ok((s.contact - s.from) / s.scale < 0.3, 'it lands quickly');
  assert.equal(q.busy, false); run(q, 0.5); assert.equal(q.weight, 0);
});
test('taps in a row chain the combo, the third the finisher, and a mash does not run on', () => {
  const q = new MoveQueue(), presses: Record<number, 'light'> = {}; for (let i = 0; i < 40; i += 4) presses[i] = 'light';
  const ev = run(q, 4, presses).filter(e => e.kind === 'contact').map(e => e.move);
  assert.deepEqual(ev.slice(0, 3), ['attack-1', 'attack-2', 'attack-3']);
  assert.ok(ev.length <= 5, `ten taps in two thirds of a second are not ten blows (${ev.length})`);
});
test('the combo resets when the taps stop', () => {
  const q = new MoveQueue(); q.press('light'); run(q, 2); q.press('light'); const ev = run(q, 2);
  assert.equal(ev.find(e => e.kind === 'contact')?.move, 'attack-1');
});
test('the casts land once; a bite does not break a blow, but she flinches when idle', () => {
  const q = new MoveQueue(); q.press('burst'); assert.equal(q.flinch(), false); const ev = run(q, 2);
  assert.deepEqual(ev.filter(e => e.kind === 'contact').map(e => e.move), ['cast-burst']);
  assert.equal(q.flinch(), true); assert.equal(q.current?.move, 'hit');
  q.press('light'); assert.equal(q.current?.move, 'attack-1', 'a blow cuts a flinch short');
});

import { ROOT_SCALE, ROOT_S } from '../src/impact';
import { dodgeProgress, EVADE_TO } from '../src/huldaMoves';
import { defense, tellOf, TELL_S, LUNGE_REACH, GUARD_TAKE, DY_BITE_S, WOLF_BITE } from '../src/villageModel';
test('root time slows the world and not her, then lets go', () => {
  const k = new Impact(); k.rootTime(); const scales: number[] = [], hers: number[] = [];
  for (let t = 0; t < ROOT_S + 0.5; t += 1 / 60) { scales.push(k.step(1 / 60)); hers.push(k.herScale); }
  assert.ok(Math.min(...scales) <= ROOT_SCALE + 0.01, 'the world slows'); assert.ok(Math.min(...hers) > 0.99, 'she does not');
  assert.equal(scales[scales.length - 1], 1); assert.equal(k.held, false);
});
test('a dodge cuts a blow short, rolls once, and is untouchable only in its middle', () => {
  const q = new MoveQueue(); q.press('light'); q.step(0.05); assert.equal(q.press('dodge'), true); assert.equal(q.current?.move, 'dodge'); assert.equal(q.press('dodge'), false, 'one roll at a time');
  let seen = false, first = -1, last = -1, t = 0; while (q.current?.move === 'dodge') { q.step(1 / 60); t += 1 / 60; if (q.evading) { seen = true; if (first < 0) first = t; last = t; } }
  assert.ok(seen && first < 0.1 && last - first > 0.3 && last - first < 0.5, `evading ${first.toFixed(2)}..${last.toFixed(2)}`);
  assert.equal(dodgeProgress(MOVES.dodge.from), 0); assert.equal(dodgeProgress(MOVES.dodge.to), 1); assert.ok(dodgeProgress(EVADE_TO) > 0.6);
});
test('a foe tells before it bites; rolled clear it misses, on her guard it bites less', () => {
  const v = freshVillage(1), w = spawnFoe(v, 'wolf', 0, -1, 99), her = { x: 0, z: 0 }; v.hero.vigor = 100;
  let told = -1; for (let t = 0; t < DY_BITE_S; t += 0.02) { stepRaiders(v, 0.02, her); if (tellOf(w) > 0 && told < 0) told = t; }
  assert.ok(told >= 0 && Math.abs(DY_BITE_S - told - TELL_S) < 0.06, `told ${told}`); 
  stepRaiders(v, 0.05, her); assert.equal(v.hero.vigor, 100 - WOLF_BITE, 'unguarded, the whole bite');
  defense.guarding = true; for (let t = 0; t < DY_BITE_S + 0.05; t += 0.02) stepRaiders(v, 0.02, her); defense.guarding = false;
  assert.ok(Math.abs(v.hero.vigor - (100 - WOLF_BITE * (1 + GUARD_TAKE))) < 1e-6, 'guarded, a share'); assert.equal(defense.blocked, 1);
  const before = v.hero.vigor; defense.evading = true; for (let t = 0; t < DY_BITE_S + 0.05; t += 0.02) stepRaiders(v, 0.02, her); defense.evading = false;
  assert.equal(v.hero.vigor, before, 'rolling, none'); assert.ok(defense.dodged >= 1); assert.ok(defense.lunges.length >= 3);
  defense.lunges.length = 0; defense.dodged = 0; defense.blocked = 0;
  void LUNGE_REACH;
});
