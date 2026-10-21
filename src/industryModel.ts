// The industrial ruins (Noah, 2026-10-21, CONTAGION.md; RUINS.md "The industrial ruins"): what the Pine Barrens
// were before the forest took them back. Bog-iron furnaces and their slag, a glassworks, charcoal pits, cranberry
// dikes and their sluice, a paper mill's race, a sand pit, a railbed with its platform and water tower, a town the
// lake drowned, a corduroy road through the cedar swamp. Each is a place by the seed, a landmark on the map, and a
// yard of stone to clamber over: built, like the wards, only of the parkour's canonical heights (parkour.ts CANON)
// on a level earthwork, so every face she meets is a step, a mount or a wall (or too high to climb), with slag and
// spoil heaps as smooth mounds and the rest (stacks, wheels, ties, glass, tanks) drawn about them. Each has a stone
// or two of lore: some teach, some are only lost. Pure: the plans, the placement, and the ground they make.
import { CANON } from './parkour';
import { mulberry32 } from './colors';
import { toWorld, rectToWorld } from './ruinsModel';
import { plateau, walkable, PLATEAU_R } from './plateauModel';
import { places } from './overworldModel';
import { beyond } from './chunkModel';

export type IndustryKind = 'furnace' | 'glassworks' | 'charcoal' | 'bogDikes' | 'paperMill' | 'sandPit' | 'railbed' | 'drownedTown' | 'corduroy';
/** What a block is made of (how it is drawn). */
export type Stuff = 'ironstone' | 'brick' | 'fieldstone' | 'sand' | 'peat' | 'timber' | 'gravel';
export interface YardBlock { x0: number; x1: number; z0: number; z1: number; top: number; stuff: Stuff }
/** A smooth mound on the yard's ground (slag, cullet, spoil): its centre, radius and height. */
export interface Bump { x: number; z: number; r: number; h: number; stuff: 'slag' | 'cullet' | 'spoil' }
/** Something drawn and not stood on (its own frame: at x, z, on the ground or a block's top y, turned yaw). */
export interface Decor { kind: 'arch' | 'wheel' | 'shards' | 'ties' | 'rails' | 'tank' | 'logs' | 'cart' | 'sunk' | 'charred' | 'bog' | 'gear' | 'stump'; x: number; z: number; y: number; yaw: number; size: number; len?: number }
export interface Stone { id: string; x: number; y: number; z: number; lore: string }
export interface Yard {
  id: string; kind: IndustryKind; name: string; x: number; z: number;
  /** The yard's level, its quarter-turn (u → +x, +z, −x, −z), its half-size along u and v, and its earthwork's skirt. */
  y0: number; q: number; hu: number; hv: number; skirt: number;
  blocks: YardBlock[]; bumps: Bump[]; decor: Decor[]; stones: Stone[];
}

const S = CANON.step, C = CANON.clamber, W = CANON.wall, G = CANON.gap, HIGH = 2.3;
/** A plan in the yard's own frame: blocks (u0..u1, v0..v1, top over the yard), bumps, decor, stones (u, v, the top they lie on). */
interface Plan { hu: number; hv: number; blocks: { u0: number; u1: number; v0: number; v1: number; top: number; stuff: Stuff }[]; bumps: { u: number; v: number; r: number; h: number; stuff: Bump['stuff'] }[]; decor: { kind: Decor['kind']; u: number; v: number; top: number; yaw: number; size: number; len?: number }[]; stones: { u: number; v: number; top: number }[] }
const B = (u0: number, u1: number, v0: number, v1: number, top: number, stuff: Stuff) => ({ u0, u1, v0, v1, top, stuff });

/** Each kind's plan, seeded (which walls stand whole, where the heaps lie). Tuning: sizes in m, heights CANON's. */
const PLANS: Record<IndustryKind, (r: () => number) => Plan> = {
  // A bog-iron furnace built against its bank: the casting floor a step up; the bank a mount then a wall up; the stack
  // a wall over the bank, too high from the floor; the tuyere arch in its face; the casting house's broken walls; slag.
  furnace: r => {
    const T1 = S + C, T2 = T1 + W, T3 = T2 + W;
    // The floor under it all; the bank's first terrace in front of it (but for the stack) and round its sides and back, so
    // every face of the bank is one move; the stack at the bank's front, rising straight from the floor (too high there).
    const p: Plan = { hu: 9.6, hv: 12, blocks: [B(-8, 9.3, -8, 8, S, 'ironstone'), B(0.5, 2.5, -7, -1.5, T1, 'ironstone'), B(0.5, 2.5, 1.5, 7, T1, 'ironstone'),
      B(2.5, 8.5, -7, -5.5, T1, 'ironstone'), B(2.5, 8.5, 5.5, 7, T1, 'ironstone'), B(7, 8.5, -5.5, 5.5, T1, 'ironstone'), B(2.5, 7, -5.5, 5.5, T2, 'ironstone'), B(2.5, 5.5, -1.5, 1.5, T3, 'ironstone')], bumps: [], decor: [], stones: [] };
    // The casting house's walls, a mount high and thick enough to be climbed onto, broken into lengths with gaps between.
    for (let v = -6.5; v + 2.4 <= 6.8; v += 3.2) if (r() < 0.7) p.blocks.push(B(-7.6, -6.4, v, v + 2.4, S + C, 'ironstone'));
    // The slag heap, off the floor's side, wholly on the yard.
    p.bumps.push({ u: -3 - r() * 3, v: (r() < 0.5 ? -1 : 1) * 10.2, r: 1.8, h: 0.7, stuff: 'slag' });
    p.decor.push({ kind: 'arch', u: 2.5, v: 0, top: S, yaw: 0, size: 1 });
    p.stones.push({ u: 4, v: 0, top: T3 }, { u: -2, v: 0, top: S });
    return p;
  },
  // A glassworks: the melting house's walls (a wall high or a mount high, gaps between the two), the hearth within, the
  // annealing tunnel (the leer) to climb along, and cullet heaps glinting green.
  glassworks: r => {
    const p: Plan = { hu: 10, hv: 7.5, blocks: [B(-2, 1, -1.5, 1.5, C, 'brick'), B(3, 9.5, -1, 1, W, 'brick')], bumps: [], decor: [], stones: [] };
    const wall = (u0: number, u1: number, v0: number, v1: number) => { const tall = r() < 0.5; p.blocks.push(B(u0, u1, v0, v1, tall ? W : C, 'brick')); };
    for (const [a, b] of [[-7, -3.2], [-2.6, 1.6]] as const) { wall(a, b, -6.4, -5.2); wall(a, b, 5.2, 6.4); }
    wall(-7, -5.8, -4.6, -0.8); wall(-7, -5.8, 0.8, 4.6);
    for (const v of [-4, 4]) p.bumps.push({ u: 5 + r() * 3, v: v + (r() - 0.5) * 2, r: 2.2, h: 0.55, stuff: 'cullet' });
    p.decor.push({ kind: 'shards', u: 6, v: -4, top: 0, yaw: 0, size: 3 }, { kind: 'shards', u: 6.5, v: 4, top: 0, yaw: 0, size: 3 });
    p.stones.push({ u: 6, v: 0, top: W }, { u: -0.5, v: 0, top: C });
    return p;
  },
  // Charcoal pits: rings of earth a step high round blackened ground, and the collier's hut, its walls a mount high.
  charcoal: r => {
    const p: Plan = { hu: 9, hv: 9, blocks: [], bumps: [], decor: [], stones: [] };
    const ring = (cu: number, cv: number) => { const a = 2.2, t = 0.8; p.blocks.push(B(cu - a, cu + a, cv - a, cv - a + t, S, 'peat'), B(cu - a, cu + a, cv + a - t, cv + a, S, 'peat'), B(cu - a, cu - a + t, cv - a + t, cv + a - t, S, 'peat'), B(cu + a - t, cu + a, cv - a + t, cv + a - t, S, 'peat')); p.decor.push({ kind: 'charred', u: cu, v: cv, top: 0, yaw: r() * 6, size: 1.4 }); };
    ring(-4.5, -4.5); ring(-4.5, 4.5); if (r() < 0.7) ring(4.5, -4.5);
    // The hut: four walls 1.2 thick, its door toward the pits.
    p.blocks.push(B(2, 8, 2, 3.2, C, 'timber'), B(2, 8, 6.8, 8, C, 'timber'), B(6.8, 8, 3.2, 6.8, C, 'timber'), B(2, 3.2, 5.6, 6.8, C, 'timber'));
    p.decor.push({ kind: 'logs', u: 0, v: 6, top: 0, yaw: 0.4, size: 1 });
    p.stones.push({ u: 5, v: 5, top: 0 });
    return p;
  },
  // Cranberry bog dikes: three long dikes a mount high and the cross-dikes at their ends, the bog beds between, and a
  // sluice in the middle dike: a gap a leap wide between stone posts too high to climb.
  bogDikes: () => {
    const p: Plan = { hu: 14, hv: 8, blocks: [], bumps: [], decor: [], stones: [] };
    for (const v of [-6.6, 6.6]) p.blocks.push(B(-13, 13, v - 0.6, v + 0.6, C, 'peat'));
    p.blocks.push(B(-13, -0.4 - G / 2, -0.6, 0.6, C, 'peat'), B(0.4 + G / 2, 13, -0.6, 0.6, C, 'peat'));
    for (const u of [-13, 13]) p.blocks.push(B(u - 0.6, u + 0.6, -6, 6, C, 'peat'));
    for (const s of [-1, 1]) p.blocks.push(B(s > 0 ? G / 2 : -G / 2 - 0.4, s > 0 ? G / 2 + 0.4 : -G / 2, -0.6, 0.6, HIGH, 'fieldstone'));
    for (const v of [-3.3, 3.3]) p.decor.push({ kind: 'bog', u: 0, v, top: 0, yaw: 0, size: 12, len: 4.6 });
    p.stones.push({ u: -6, v: 0, top: C });
    return p;
  },
  // A paper mill: its walls a wall high, broken by doorways, and the race beside it: two walls a mount high a leap apart,
  // the wheel standing in its pit at the race's head.
  paperMill: r => {
    const p: Plan = { hu: 11, hv: 7.5, blocks: [], bumps: [], decor: [], stones: [] };
    p.blocks.push(B(-10, -1, -6.4, -5.2, W, 'fieldstone'), B(-10, -1, 5.2, 6.4, W, 'fieldstone'), B(-10, -8.8, -5.2, -1, W, 'fieldstone'), B(-10, -8.8, 1, 5.2, W, 'fieldstone'));
    p.blocks.push(B(-2.2, -1, -5.2, -1.2, W, 'fieldstone')); void r;
    for (const s of [-1, 1]) p.blocks.push(B(1, 10.5, s * (G / 2) + (s > 0 ? 0 : -1.2), s * (G / 2) + (s > 0 ? 1.2 : 0), C, 'fieldstone'));
    p.decor.push({ kind: 'wheel', u: 0.2, v: 0, top: 0, yaw: Math.PI / 2, size: 1.3 }, { kind: 'gear', u: -5, v: 2, top: 0, yaw: r() * 6, size: 0.8 });
    p.stones.push({ u: -5, v: -2, top: 0 }, { u: 6, v: G / 2 + 0.6, top: C });
    return p;
  },
  // A sand pit's spoil: a stepped bank of white sand, each terrace one move higher and narrower, a rusted cart on it.
  sandPit: () => {
    const p: Plan = { hu: 10, hv: 9, blocks: [B(-6, 9, -8, 8, S, 'sand'), B(-3, 8, -6, 6, S + C, 'sand'), B(0, 7, -4, 4, S + C + W, 'sand'), B(2.5, 6, -2.5, 2.5, S + C + 2 * W, 'sand')], bumps: [{ u: -8.2, v: 0, r: 1.7, h: 0.5, stuff: 'spoil' }], decor: [], stones: [] };
    p.decor.push({ kind: 'cart', u: 1, v: 2.5, top: S + C + W, yaw: 0.3, size: 1 });
    p.stones.push({ u: 4.2, v: 0, top: S + C + 2 * W });
    return p;
  },
  // A railbed: the embankment itself, its ties and rails; a platform a mount high at one end, the water tower's legs at
  // the other (too high to climb), its tank above.
  railbed: () => {
    const p: Plan = { hu: 30, hv: 3.6, blocks: [B(-24, -14, 1.7, 3.4, C, 'timber')], bumps: [], decor: [], stones: [] };
    for (const [u, v] of [[18, -3.2], [20.4, -3.2], [18, -0.8], [20.4, -0.8]] as const) p.blocks.push(B(u - 0.2, u + 0.2, v - 0.2, v + 0.2, HIGH + 1, 'timber'));
    p.decor.push({ kind: 'ties', u: 0, v: 0, top: 0, yaw: 0, size: 1, len: 58 }, { kind: 'rails', u: 0, v: 0, top: 0, yaw: 0, size: 1, len: 58 }, { kind: 'tank', u: 19.2, v: -2, top: HIGH + 1, yaw: 0, size: 1 });
    p.stones.push({ u: -19, v: 2.5, top: C });
    return p;
  },
  // A drowned town at the lake's edge (+u toward the water): foundations a step high, chimneys a wall high or whole, the
  // chapel's steps and floor; past the yard's edge the rest of it under the water.
  drownedTown: r => {
    const p: Plan = { hu: 13, hv: 11, blocks: [], bumps: [], decor: [], stones: [] };
    const house = (cu: number, cv: number, a: number, b: number) => {
      const t = 0.6; p.blocks.push(B(cu - a, cu + a, cv - b, cv - b + t, S, 'fieldstone'), B(cu - a, cu + a, cv + b - t, cv + b, S, 'fieldstone'), B(cu - a, cu - a + t, cv - b + t, cv + b - t, S, 'fieldstone'), B(cu + a - t, cu + a, cv - b + t, cv - 0.6, S, 'fieldstone'));
      // The chimney, at the house's back corner, inside the walls' line.
      const whole = r() < 0.4; p.blocks.push(B(cu - a + 0.8, cu - a + 1.8, cv + b - 1.8, cv + b - 0.8, whole ? HIGH : W, 'brick'));
    };
    house(-8, -6, 2.8, 2.4); house(-8, 5, 2.6, 2.8); house(2, -6.5, 3, 2.2);
    // The chapel: a step, a mount, its floor; its tower's stump a wall above the floor.
    p.blocks.push(B(-1, 7, 1, 9.5, S, 'fieldstone'), B(0.2, 6, 2.2, 8.3, S + C, 'fieldstone'), B(4, 5.6, 2.6, 4.2, S + C + W, 'fieldstone'));
    for (let i = 0; i < 5; i++) p.decor.push({ kind: 'sunk', u: 15 + i * 4 + r() * 2, v: (r() - 0.5) * 18, top: -1.6, yaw: r() * 6, size: 2 + r() * 1.5 });
    p.stones.push({ u: 4.8, v: 3.4, top: S + C + W }, { u: -8, v: 5, top: 0 });
    return p;
  },
  // A corduroy road through the cedar swamp: a causeway of logs laid crosswise, raised a little, cedar stumps beside it.
  corduroy: r => {
    const p: Plan = { hu: 18, hv: 2.4, blocks: [], bumps: [], decor: [{ kind: 'logs', u: 0, v: 0, top: 0, yaw: 0, size: 1, len: 34 }], stones: [] };
    for (let i = 0; i < 6; i++) p.decor.push({ kind: 'stump', u: -16 + i * 6.4 + r() * 2, v: (r() < 0.5 ? -1 : 1) * (3.4 + r() * 2), top: 0, yaw: r() * 6, size: 0.8 + r() * 0.6 });
    p.stones.push({ u: 0, v: 1.6, top: 0 });
    return p;
  },
};

/** How many of each, and what each wants of its ground: near a river (the dikes, the mill, the road), at the lake's edge (the drowned town), or dry. The most the land may rise under each (m). Tuning. */
export const WANT: Record<IndustryKind, { n: number; near: 'river' | 'lake' | 'dry'; rise: number }> = {
  furnace: { n: 2, near: 'dry', rise: 2.4 }, glassworks: { n: 1, near: 'dry', rise: 2.2 }, charcoal: { n: 2, near: 'dry', rise: 2.2 },
  bogDikes: { n: 1, near: 'river', rise: 1.8 }, paperMill: { n: 1, near: 'river', rise: 2.2 }, sandPit: { n: 1, near: 'dry', rise: 2.4 },
  railbed: { n: 1, near: 'dry', rise: 3.0 }, drownedTown: { n: 1, near: 'lake', rise: 2.6 }, corduroy: { n: 1, near: 'river', rise: 1.8 },
};
export const INDUSTRY_CLEAR = 60, SKIRT_MIN = 2.5, SKIRT_PER = 3;
/** Ghost-town names of the Barrens, for the yards (each kind's own word after). */
const TOWNS = ['Atsion', 'Hanover', 'Speedwell', 'Mount Misery', "Ong's Hat", 'Friendship', 'Harrisville', 'Weymouth', 'Martha', 'Hog Wallow', 'Calico', 'Bamber', 'Ferrago', 'Mary Ann', 'Retreat', 'Union'];
const TITLE: Record<IndustryKind, string> = { furnace: 'furnace', glassworks: 'glassworks', charcoal: 'charcoal pits', bogDikes: 'bog', paperMill: 'paper mill', sandPit: 'sand pit', railbed: 'railbed', drownedTown: '', corduroy: 'corduroy road' };

/** The lore of each kind's stones: some teach, some are only lost. Placeholder for Noah. */
export const INDUSTRY_LORE: Record<IndustryKind, string[]> = {
  furnace: ['The stack is warm to the hand, though no fire has burned here in an age. The bog ore they fed it was red with something more than iron.',
    'A founder\'s mark on the casting floor: three strokes and a circle. The greblins use it still, for "made, not grown".'],
  glassworks: ['The leer\'s bricks are glazed green from within. The sand here is white as bone, and it melts clear; they made lenses here, not bottles.',
    'Shards of a lens as wide as her arms, ground true. Whoever made it meant to throw light a long way.'],
  charcoal: ['The rings are black to a hand\'s depth. Twenty cords of pine a burn, ten days smouldering under turf, and a collier watching it day and night.',
    'Scratched on the hut\'s lintel: "the pines grow back. Nothing else here does."'],
  bogDikes: ['The sluice is jammed with roots. Opened, the water would run where the dikes tell it; shut, the bog drowns. Someone farmed this water once.'],
  paperMill: ['The race still carries a trickle. The wheel turned the beaters that pulped the rags; the paper they made took ink that does not fade.',
    'A sheet of that paper, pressed under a stone: a map of the plateau before the lake, with a town where the water is now.'],
  sandPit: ['The cart\'s wheels are rusted to the rail. From the top of the spoil the plateau lies open, and the karst stands in the middle of it like a nail.'],
  railbed: ['Ties without rails, then rails without ties. The line ran toward the mountains and stops at nothing at all.'],
  drownedTown: ['The chapel\'s floor slopes toward the water. The lake rose in a single season, the stone says; it does not say why.',
    'The chimney is cold. Through the water, the rest of the street, the doors still shut.'],
  corduroy: ['Cedar logs laid side by side across the swamp, sunk and laid again. The road goes nowhere now; the far end is under the moss.'],
};

/** A yard set at (x, z) on its level y0, frame q, from its kind's plan. */
export function buildYard(id: string, kind: IndustryKind, name: string, x: number, z: number, y0: number, q: number, skirt: number, rand: () => number): Yard {
  const p = PLANS[kind](rand), lore = INDUSTRY_LORE[kind];
  const at = (u: number, v: number): [number, number] => { const [dx, dz] = toWorld(q, u, v); return [x + dx, z + dz]; };
  const yaw0 = Math.atan2(toWorld(q, 1, 0)[0], toWorld(q, 1, 0)[1]);
  return {
    id, kind, name, x, z, y0, q, hu: p.hu, hv: p.hv, skirt,
    blocks: p.blocks.map(b => ({ ...rectToWorld(q, x, z, b), top: y0 + b.top, stuff: b.stuff })),
    bumps: p.bumps.map(b => { const [bx, bz] = at(b.u, b.v); return { x: bx, z: bz, r: b.r, h: b.h, stuff: b.stuff }; }),
    decor: p.decor.map(d => { const [dx, dz] = at(d.u, d.v); return { kind: d.kind, x: dx, z: dz, y: y0 + d.top, yaw: yaw0 + d.yaw, size: d.size, len: d.len }; }),
    stones: p.stones.map((s, i) => { const [sx, sz] = at(s.u, s.v); return { id: `${id}:${i}`, x: sx, y: y0 + s.top, z: sz, lore: lore[i % lore.length] }; }),
  };
}

/** The yard's half-extents in the world (x, z), its frame's quarter-turn swapping them. */
export const extentOf = (y: { q: number; hu: number; hv: number }): [number, number] => (y.q & 1 ? [y.hv, y.hu] : [y.hu, y.hv]);
/** How far a point lies outside the yard's level ground (0 on it). */
export function outsideYard(y: Yard, x: number, z: number): number { const [ex, ez] = extentOf(y); return Math.max(0, Math.abs(x - y.x) - ex, Math.abs(z - y.z) - ez); }
/** The earthwork's ground (the level yard and its mounds, its skirt falling to the land), or null past the skirt. */
export function yardEarth(y: Yard, x: number, z: number, land: number): number | null {
  const e = outsideYard(y, x, z); if (e >= y.skirt) return null;
  let g: number; if (e <= 0) g = y.y0; else { const t = e / y.skirt, s = t * t * (3 - 2 * t); g = Math.max(land, y.y0 + (land - y.y0) * s); }
  for (const b of y.bumps) { const d = Math.hypot(x - b.x, z - b.z); if (d < b.r) { const t = 1 - d / b.r; g += b.h * t * t * (3 - 2 * t); } }
  return g;
}
const inRect = (r: { x0: number; x1: number; z0: number; z1: number }, x: number, z: number, m = 0): boolean => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
export function yardGround(y: Yard, x: number, z: number, land: number): number | null {
  const g = yardEarth(y, x, z, land); if (g === null) return null; let top = g; for (const b of y.blocks) if (inRect(b, x, z) && b.top > top) top = b.top; return top;
}
export function yardOccupy(y: Yard, p: { x: number; y: number; z: number }, radius: number, land: number): boolean | null {
  const g = yardEarth(y, p.x, p.z, land); if (g === null) return null; if (p.y < g - 0.03) return false;
  for (const b of y.blocks) if (p.y < b.top - 0.001 && inRect(b, p.x, p.z, radius)) return false;
  return true;
}

export interface IndustryLand {
  height(x: number, z: number): number;
  ok(x: number, z: number): boolean;
  /** How far (m) from a river's edge, Infinity if none near; how far from the lake's edge (negative inside it). */
  river(x: number, z: number): { d: number; along: number } | null;
  lake(x: number, z: number): { d: number; toward: number };
  avoid: { x: number; z: number; r: number }[];
  /** The plateau's centre and the reach the yards may lie within. */
  centre: { x: number; z: number }; reach: [number, number];
}
/** The yards by the seed: each kind's count, each where its ground suits it (a river's bank, the lake's edge, or dry), on
 * walkable ground, clear of every place and of each other, the land rising least under it. */
export function industries(seed: number, land: IndustryLand): Yard[] {
  const rand = mulberry32((seed * 6007 + 1777) >>> 0), out: Yard[] = [], names = TOWNS.slice();
  for (let i = names.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [names[i], names[j]] = [names[j], names[i]]; }
  const kinds = Object.keys(WANT) as IndustryKind[];
  // Candidates on a polar lattice over the plateau, each visited once in a shuffled order.
  const cands: { x: number; z: number }[] = [];
  for (let r = land.reach[0]; r <= land.reach[1]; r += 30) for (let a = 0; a < Math.PI * 2; a += 30 / r) cands.push({ x: land.centre.x + Math.cos(a) * r, z: land.centre.z + Math.sin(a) * r });
  for (let i = cands.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [cands[i], cands[j]] = [cands[j], cands[i]]; }
  for (const kind of kinds) {
    const want = WANT[kind], plan = PLANS[kind](() => 0.5);
    for (let k = 0; k < want.n; k++) {
      let best: { x: number; z: number; q: number; y0: number; skirt: number; score: number } | null = null, tried = 0;
      for (const c of cands) {
        if (tried > 260) break;
        const rv = land.river(c.x, c.z), lk = land.lake(c.x, c.z);
        if (want.near === 'river' && (!rv || rv.d < 10 || rv.d > 34)) continue;
        if (want.near === 'lake' && (lk.d < 26 || lk.d > 60)) continue;
        if (want.near === 'dry' && ((rv && rv.d < 26) || lk.d < 50)) continue;
        // Along the river, or u toward the lake, or as the seed has it.
        const q = want.near === 'river' && rv ? (Math.abs(Math.cos(rv.along)) > Math.abs(Math.sin(rv.along)) ? 0 : 1) + (rand() < 0.5 ? 2 : 0) : want.near === 'lake' ? (Math.abs(Math.cos(lk.toward)) > Math.abs(Math.sin(lk.toward)) ? (Math.cos(lk.toward) > 0 ? 0 : 2) : (Math.sin(lk.toward) > 0 ? 1 : 3)) : Math.floor(rand() * 4);
        const [ex, ez] = extentOf({ q, hu: plan.hu, hv: plan.hv }), reach = Math.max(ex, ez) + 14;
        if (land.avoid.some(p => Math.hypot(p.x - c.x, p.z - c.z) < p.r + INDUSTRY_CLEAR + reach * 0.5)) continue;
        if (out.some(y => Math.hypot(y.x - c.x, y.z - c.z) < INDUSTRY_CLEAR + reach + Math.max(...extentOf(y)))) continue;
        tried++;
        let hi = -Infinity, lo = Infinity, good = true;
        for (let u = -ex - 1.5; u <= ex + 1.5 && good; u += 2) for (let v = -ez - 1.5; v <= ez + 1.5; v += 2) { const x = c.x + u, z = c.z + v, h = land.height(x, z); hi = Math.max(hi, h); lo = Math.min(lo, h); if (!land.ok(x, z)) { good = false; break; } }
        if (!good || hi - lo > want.rise) continue;
        const y0 = hi + 0.05, skirt = Math.max(SKIRT_MIN, SKIRT_PER * (y0 - lo));
        let edge = true; for (let t = 0; t < 20 && edge; t++) { const a = (t / 20) * Math.PI * 2; if (!land.ok(c.x + Math.cos(a) * (ex + skirt), c.z + Math.sin(a) * (ez + skirt))) edge = false; }
        if (!edge) continue;
        const score = hi - lo + rand() * 0.3;
        if (!best || score < best.score) best = { x: c.x, z: c.z, q, y0, skirt, score };
        if (score < 0.6) break;
      }
      if (!best) continue;
      const n = out.length, town = names[n % names.length];
      const name = kind === 'drownedTown' ? `drowned ${town}` : `the ${town} ${TITLE[kind]}`;
      out.push(buildYard(`industry-${n + 1}`, kind, name, Math.round(best.x), Math.round(best.z), best.y0, best.q, best.skirt, mulberry32((seed * 131 + n * 7919 + 3) >>> 0)));
    }
  }
  return out;
}
/** The plateau as the yards want it: out in the wilds (past the villages' meadows), on walkable ground, by its rivers and
 * its lake, clear of every place (her taint among them, as the lair's radius) and of `also` (the wards). */
export function industryLand(seed: number, height: (x: number, z: number) => number, also: { x: number; z: number; r: number }[] = []): IndustryLand {
  const P = plateau(seed);
  return {
    height, ok: (x, z) => beyond(x, z, seed) > 0.8 && walkable(P, x, z),
    river: (x, z) => { const n = P.nearRiver(x, z, 60); if (!n) return null; const pts = n.river.points, a = pts[Math.max(0, n.i - 1)], b = pts[Math.min(pts.length - 1, n.i + 1)]; return { d: n.d - n.half, along: Math.atan2(b.z - a.z, b.x - a.x) }; },
    lake: (x, z) => { const a = Math.atan2(z - P.centre.z, x - P.centre.x); return { d: Math.hypot(x - P.centre.x, z - P.centre.z) - P.lakeR(a), toward: Math.atan2(P.centre.z - z, P.centre.x - x) }; },
    avoid: [...places(seed).map(p => ({ x: p.x, z: p.z, r: p.radius })), ...also], centre: P.centre, reach: [260, PLATEAU_R - 160],
  };
}

