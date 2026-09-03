// Deterministic flower-color assignment for one voxel face.
//
// DESIGN.md open question #2: with 5 tips and a 3-same-color match rule, a
// naive per-tip random draw can produce a dead board (e.g. a 2/2/1 split over
// three colors). So the assignment is seeded and *constructed* to contain a
// clearable triple, rather than sampled and hoped for.

export interface FlowerColor {
  name: string;
  hex: number;
}

// Three colors for now. Tuning: with only 5 tips, more colors than three
// makes the two non-triple tips read as noise; fewer makes 4/5-of-a-kind
// boards very common. Revisit when regrowth/economy exist.
export const PALETTE: readonly FlowerColor[] = [
  { name: 'rose', hex: 0xe8527f },
  { name: 'gold', hex: 0xf2b53a },
  { name: 'sky', hex: 0x5cb8f0 },
];

export const MATCH_SIZE = 3;

/** Small seeded PRNG (mulberry32) so a given seed always yields the same board. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns one palette index per tip. Guaranteed: exactly MATCH_SIZE tips
 * share one color (the clearable triple); the remaining tips are drawn from
 * the *other* colors.
 *
 * Design choice flagged, not settled: the leftovers are deliberately kept
 * off the triple's color so a Pass 0 board always has exactly one triple
 * (cleaner for a feel-test). Allowing 4- or 5-of-a-kind boards is a one-line
 * change here once there's a reason to want them (regrowth, bigger boards).
 */
export function assignColors(tipCount: number, seed: number): number[] {
  if (tipCount < MATCH_SIZE) {
    throw new Error(`assignColors: need at least ${MATCH_SIZE} tips, got ${tipCount}`);
  }
  const rand = mulberry32(seed);
  const tripleColor = Math.floor(rand() * PALETTE.length);

  // Pick MATCH_SIZE distinct tips for the triple (partial Fisher–Yates).
  const order = Array.from({ length: tipCount }, (_, i) => i);
  for (let i = 0; i < MATCH_SIZE; i++) {
    const j = i + Math.floor(rand() * (tipCount - i));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const tripleTips = new Set(order.slice(0, MATCH_SIZE));

  const otherColors = PALETTE.map((_, i) => i).filter((i) => i !== tripleColor);
  return Array.from({ length: tipCount }, (_, tip) =>
    tripleTips.has(tip) ? tripleColor : otherColors[Math.floor(rand() * otherColors.length)]
  );
}
