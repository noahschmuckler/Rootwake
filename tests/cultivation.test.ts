import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshCultivation, worldTier, power, lacking, grow, grownEnough, canRaise, raise, reachBonus, viewScale, serializeCultivation, parseCultivation, TIER_CAP, TIER_POINTS, TIER_CLARITY, TIER_REACH, TIER_VIEW, NEED } from '../src/cultivationModel';
test('G5: the tiers: growth on the board to a threshold, a rise for clarity while the land allows it; the land\'s tier from villages thriving, groves and companions; her power the lesser of the two; saved', () => {
  const c = freshCultivation(); assert.equal(c.tier, 1); assert.equal(NEED.length, TIER_CAP + 1);
  const bare = { thriving: 0, groves: 0, companions: 0 }; assert.equal(worldTier(bare), 1); assert.equal(worldTier({ thriving: 1, groves: 0, companions: 0 }), 2); assert.equal(worldTier({ thriving: 2, groves: 1, companions: 0 }), 3); assert.equal(worldTier({ thriving: 3, groves: 1, companions: 0 }), 4); assert.equal(worldTier({ thriving: 3, groves: 2, companions: 0 }), 4, 'the top tier waits on a companion'); assert.equal(worldTier({ thriving: 3, groves: 2, companions: 1 }), 5);
  assert.equal(worldTier({ thriving: 3, groves: 0, companions: 6 }), 2, 'each tier needs the ones below: no grove, no third tier');
  assert.equal(lacking(bare, 2), 'one more village must thrive'); assert.equal(lacking(bare, 3), '2 more villages must thrive, a grove must be sanctified'); assert.equal(lacking({ thriving: 3, groves: 2, companions: 0 }, 5), 'a companion must stand with her'); assert.equal(lacking({ thriving: 3, groves: 2, companions: 1 }, 5), ''); assert.ok(lacking(bare, TIER_CAP + 1).length);
  // Growth: gems to the threshold, no further; not grown enough, no rise; grown enough but the land at 1, no rise; the land at 2 and the clarity there, a rise that spends it and starts the growth over.
  assert.equal(grow(c, 25), 25); assert.equal(grow(c, 25), TIER_POINTS[2] - 25); assert.equal(c.grown, TIER_POINTS[2]); assert.ok(grownEnough(c)); assert.ok(!canRaise(c, bare, 60), 'the land at one'); const d = { clarity: 60 };
  assert.equal(raise(c, bare, d), false); assert.equal(c.tier, 1); assert.equal(d.clarity, 60); const two = { thriving: 1, groves: 0, companions: 0 }; assert.ok(!canRaise(c, two, TIER_CLARITY - 1), 'short of clarity');
  assert.equal(raise(c, two, d), true); assert.equal(c.tier, 2); assert.equal(c.grown, 0); assert.equal(d.clarity, 60 - TIER_CLARITY);
  assert.equal(power(c, bare), 1, 'the land fallen back, her power with it'); assert.equal(power(c, two), 2); assert.equal(power(c, { thriving: 3, groves: 2, companions: 1 }), 2, 'never more than she has cultivated');
  assert.equal(reachBonus(1), 0); assert.equal(reachBonus(3), 2 * TIER_REACH); assert.equal(viewScale(1), 1); assert.ok(Math.abs(viewScale(3) - (1 + 2 * TIER_VIEW)) < 1e-9);
  c.tier = TIER_CAP; c.grown = 0; assert.equal(grow(c, 10), 0, 'nothing past the cap'); assert.ok(!grownEnough(c));
  const back = parseCultivation(serializeCultivation({ grown: 12.5, tier: 3 })); assert.deepEqual(back, { grown: 12.5, tier: 3 }); assert.deepEqual(parseCultivation('junk'), freshCultivation()); assert.deepEqual(parseCultivation(JSON.stringify({ grown: 999, tier: 99 })), { grown: 0, tier: TIER_CAP }, 'clamped');
  assert.deepEqual(parseCultivation(JSON.stringify({ grown: 999, tier: 2 })), { grown: TIER_POINTS[3], tier: 2 }, 'growth clamped to its threshold');
});
