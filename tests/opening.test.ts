import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshOpening, allShown, nextStep, advance, complete, chaosOf, serializeOpening, parseOpening, STEPS, PETAL_LINES, endingAt, endingSeconds, ENDING } from '../src/openingModel';
import { swipeTarget, Board } from '../src/match3';
import { CLARITY_CAP } from '../src/deepModel';

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
