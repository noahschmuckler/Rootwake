// The lab entry (lab.html, lab branch): the metallurgist in the suit, in an
// empty arena, to look at the creature being designed. No crafting to get
// through first.

import { Arena } from './arena';
import { bootUnder } from './underworld';

bootUnder({
  world: (scene, seed) => new Arena(scene, seed),
  suit: true,
  freeHint: 'The lab. Hold walk to move, drag to look. He wears the suit; the creature comes next.',
});
