// Flower / gem colours for the plant voxel.
//
// Pass 0.3 pivot (DESIGN.md): the board's five gem types ARE the five flower
// identities, 1:1. So every voxel carries all five colours, one per flower,
// in a seeded order. The Pass 0 "construct a guaranteed triple" assignment is
// retired with the tap-a-flower interaction it served.

export interface FlowerColor {
  name: string;
  hex: number;
}

/** Five colours = five gem types = five flowers. Order is the gem type index. */
export const PALETTE: readonly FlowerColor[] = [
  { name: 'rose', hex: 0xe8527f },
  { name: 'gold', hex: 0xf2b53a },
  { name: 'sky', hex: 0x5cb8f0 },
  { name: 'leaf', hex: 0x7ed957 },
  { name: 'violet', hex: 0xb387f5 },
];

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
 * One palette index per tip, every colour used exactly once, in a seeded
 * order. Requires tipCount === PALETTE.length — the 1:1 mapping is the point.
 */
export function assignDistinctColors(tipCount: number, seed: number): number[] {
  if (tipCount !== PALETTE.length) {
    throw new Error(`assignDistinctColors: need exactly ${PALETTE.length} tips for a 1:1 colour map, got ${tipCount}`);
  }
  const rand = mulberry32(seed);
  const order = PALETTE.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
