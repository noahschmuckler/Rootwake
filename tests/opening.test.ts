import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshOpening, allShown, nextStep, advance, complete, chaosOf, serializeOpening, parseOpening, STEPS, PETAL_LINES, endingAt, endingSeconds, ENDING } from '../src/openingModel';
import { swipeTarget, Board } from '../src/match3';
import { CLARITY_CAP } from '../src/deepModel';
import { riseDeer, stepDeer, takeDeer, RISE_S, SINK_S, LIFE_S, WALK, TROT, deerFigureState } from '../src/deerModel';

test('O1: the opening stage: a missing save is a new player, steps come in order, the dev override shows everything, saved and read back', () => {
  const o = parseOpening(null); assert.deepEqual(o, freshOpening()); assert.equal(nextStep(o), 'opened'); assert.ok(!complete(o));
  assert.equal(advance(o), 'opened'); assert.equal(nextStep(o), 'woke'); assert.equal(advance(o), 'woke'); assert.equal(advance(o), 'looked'); assert.equal(advance(o), 'compass'); assert.equal(advance(o), 'stick'); assert.equal(advance(o), 'dive');
  assert.ok(complete(o)); assert.equal(advance(o), null);
  assert.deepEqual(parseOpening(serializeOpening(o)), allShown()); assert.ok(complete(allShown()));
  const half = freshOpening(); half.opened = true; half.woke = true; assert.deepEqual(parseOpening(serializeOpening(half)), half);
  assert.deepEqual(parseOpening('junk'), freshOpening()); assert.deepEqual(parseOpening('42'), freshOpening());
  // A hole in an old save closes: a later flag without the earlier is not trusted.
  assert.deepEqual(parseOpening(JSON.stringify({ opened: true, stick: true })), { ...freshOpening(), opened: true });
  for (const s of STEPS) if (s !== 'opened') assert.ok(PETAL_LINES[s].length >= 1 && PETAL_LINES[s].every(l => l.length < 60), `Petal's ${s} lines are short`);
});

test('O1: the water follows her clarity alone: chaos 1 at none, 0 at the cap, linear between', () => {
  assert.equal(chaosOf(0), 1); assert.equal(chaosOf(CLARITY_CAP), 0); assert.equal(chaosOf(CLARITY_CAP / 2), 0.5); assert.equal(chaosOf(-5), 1); assert.equal(chaosOf(CLARITY_CAP * 3), 0);
});

test('O1: the ending: the board gone before the drop falls, the ripples after it lands, the world shown from nothing to all', () => {
  const start = endingAt(0); assert.equal(start.board, 1); assert.equal(start.drop, 0); assert.equal(start.rippleAge, 0); assert.equal(start.reveal, 0);
  const landed = endingAt(ENDING.boardFade + ENDING.drop); assert.equal(landed.board, 0); assert.equal(landed.drop, 1); assert.equal(landed.rippleAge, 0); assert.equal(landed.reveal, 0);
  const mid = endingAt(ENDING.boardFade + ENDING.drop + ENDING.revealDelay + ENDING.reveal / 2); assert.ok(mid.reveal > 0.4 && mid.reveal < 0.6); assert.ok(mid.rippleAge > 0);
  const end = endingAt(endingSeconds()); assert.equal(end.reveal, 1); assert.ok(end.rippleAge >= ENDING.ripple - 1e-9);
});

test('O1: a swipe resolves to the neighbour in the larger direction, needs enough travel, and stops at the edge', () => {
  assert.equal(swipeTarget({ row: 2, col: 2 }, 5, 3, 6, 6, 18), null, 'too short');
  assert.deepEqual(swipeTarget({ row: 2, col: 2 }, 30, 10, 6, 6, 18), { row: 2, col: 3 });
  assert.deepEqual(swipeTarget({ row: 2, col: 2 }, -30, 10, 6, 6, 18), { row: 2, col: 1 });
  assert.deepEqual(swipeTarget({ row: 2, col: 2 }, 4, 25, 6, 6, 18), { row: 3, col: 2 }, 'down the screen is the next row');
  assert.deepEqual(swipeTarget({ row: 2, col: 2 }, -4, -25, 6, 6, 18), { row: 1, col: 2 });
  assert.equal(swipeTarget({ row: 0, col: 5 }, 30, 0, 6, 6, 18), null, 'off the right edge'); assert.equal(swipeTarget({ row: 0, col: 5 }, 0, -30, 6, 6, 18), null, 'off the top');
  // On a real board a resolved swipe is an adjacent pair the core accepts or refuses like a tap pair.
  const b = new Board(6, 6, 7); const a = { row: 3, col: 3 }, t = swipeTarget(a, 40, 0, b.rows, b.cols, 18)!; assert.ok(Board.adjacent(a, t)); const r = b.swap(a, t); assert.ok(typeof r.valid === 'boolean');
});

test('O2: the spirit deer rises, wanders on ground it may walk with grazes, turns from what it may not, and sinks after its life', () => {
  let x = 1; const rand = (): number => { x = (x * 48271) % 2147483647; return (x - 1) / 2147483646; };
  const d = riseDeer(0, 0, 0); assert.equal(d.phase, 'rising'); assert.equal(stepDeer(d, RISE_S + 0.01, rand, () => true), 'up'); assert.equal(d.phase, 'up');
  let moved = 0, grazed = 0, t = 0; const start = { x: d.x, z: d.z };
  while (t < 40) { const bx = d.x, bz = d.z; stepDeer(d, 0.05, rand, () => true); t += 0.05; if (d.x !== bx || d.z !== bz) moved += Math.hypot(d.x - bx, d.z - bz); if (d.speed === 0 && d.graze > 0) grazed += 0.05; }
  assert.ok(moved > 10 && moved <= WALK * 40 + 1e-9, `it walks (${moved.toFixed(1)} m in 40 s)`); assert.ok(grazed > 1, `and grazes (${grazed.toFixed(1)} s)`); assert.ok(Math.hypot(d.x - start.x, d.z - start.z) > 3, 'and gets somewhere');
  // A wall at x = 2: it never crosses it.
  const w = riseDeer(0, 0, -Math.PI / 2); stepDeer(w, RISE_S + 0.01, rand, () => true); for (let i = 0; i < 1200; i++) stepDeer(w, 0.05, rand, (px) => px < 2); assert.ok(w.x < 2, `turned from the wall (x ${w.x.toFixed(2)})`);
  // Its life ends in a sink, then it is gone.
  const e = riseDeer(0, 0, 0); stepDeer(e, RISE_S + 0.01, rand, () => true); let ev: string | null = null; for (let i = 0; i < (LIFE_S + SINK_S + 2) / 0.1 && ev !== 'sunk'; i++) ev = stepDeer(e, 0.1, rand, () => true); assert.equal(ev, 'sunk'); assert.equal(e.phase, 'gone');
  assert.deepEqual(deerFigureState(riseDeer(0, 0, 0)), { phase: 'rising', t: 0, speed: 0, still: 0, health: 100 });
});
test('O2, taken: a taken deer waits on the stick, turns toward the push and trots its way, stops short of ground it may not walk, and never sinks until let go', () => {
  let seed = 5; const rand = (): number => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; }; const d = riseDeer(0, 0, 0); assert.equal(takeDeer(d), false, 'not while rising'); stepDeer(d, RISE_S + 0.01, rand, () => true); assert.ok(takeDeer(d)); assert.ok(d.driven);
  for (let i = 0; i < 40; i++) stepDeer(d, 0.05, rand, () => true); assert.deepEqual([d.x, d.z, d.speed], [0, 0, 0], 'unpushed it stands'); assert.ok(d.still > 1.9, 'and after a while grazes');
  // Pushed east (+x): the heading comes round to face +x (forward is (-sin h, -cos h), so h = -pi/2) and it moves east at the trot.
  for (let i = 0; i < 100; i++) stepDeer(d, 0.05, rand, () => true, { x: 1, z: 0, amount: 1 });
  assert.ok(Math.abs(Math.atan2(Math.sin(d.heading + Math.PI / 2), Math.cos(d.heading + Math.PI / 2))) < 0.02, `faces east (heading ${d.heading.toFixed(2)})`); assert.ok(d.x > 8 && Math.abs(d.z) < 2, `went east (${d.x.toFixed(1)}, ${d.z.toFixed(1)})`); assert.equal(d.speed, TROT);
  const half = riseDeer(0, 0, -Math.PI / 2); stepDeer(half, RISE_S + 0.01, rand, () => true); takeDeer(half); stepDeer(half, 1, rand, () => true, { x: 1, z: 0, amount: 0.5 }); assert.ok(Math.abs(half.x - TROT * 0.5) < 1e-9, 'half a push, half the trot'); assert.ok(TROT * 0.5 > WALK, 'a half push outpaces its own walk');
  const w = riseDeer(0, 0, -Math.PI / 2); stepDeer(w, RISE_S + 0.01, rand, () => true); takeDeer(w); for (let i = 0; i < 100; i++) stepDeer(w, 0.05, rand, px => px < 2, { x: 1, z: 0, amount: 1 }); assert.ok(w.x < 2 && w.x > 1, `stopped at the wall (x ${w.x.toFixed(2)})`); assert.equal(w.speed, 0); assert.ok(Math.abs(w.heading + Math.PI / 2) < 1e-9, 'still facing it, not turned away');
  const e = riseDeer(0, 0, 0); stepDeer(e, RISE_S + 0.01, rand, () => true); takeDeer(e); let ev: string | null = null; for (let i = 0; i < (LIFE_S * 2) / 0.5; i++) { const r = stepDeer(e, 0.5, rand, () => true, i % 2 ? { x: 0, z: 1, amount: 1 } : null); if (r) ev = r; } assert.equal(ev, null); assert.equal(e.phase, 'up'); assert.equal(e.life, 0, 'its life does not run');
  assert.equal(riseDeer(0, 0, 0).driven, false);
});
