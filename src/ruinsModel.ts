// The wards (RUINS.md, Noah 2026-10-19): the ruins of the old containment that ring the dark forest, just inside the
// taint's edge. Their lingering order holds the mother in; she can only send. Each is a stepped stone ward rising out
// of the soil on a level earthwork, built only of the parkour's canonical heights (parkour.ts CANON), so every face
// she meets plays its clip at its own size: an apron a step up, a terrace a mount up, a keep a wall up (the braced
// hang), a tower on the keep another wall, a crack across the keep a leap wide, fallen lintels on the terrace to vault,
// and ward-posts round the apron. Glyph-plates set into the stone at the hard places tell the ward's lore; the door
// into the tower is clogged with her growth (R2 opens it). Pure: sites, layout, the ground and solids they make.
import { CANON } from './parkour';
import { mulberry32 } from './colors';

/** A solid block in the ward's own frame (u toward the breach, v to its right), its top over the court, with any cuts. */
export interface WardBlock { u0: number; u1: number; v0: number; v1: number; top: number; kind: 'apron' | 'terrace' | 'keep' | 'tower' | 'post' | 'lintel'; cuts?: { u0: number; u1: number; v0: number; v1: number }[] }
/** A block in the world: its axis-aligned footprint, its absolute top, and cuts. */
export interface WorldBlock { x0: number; x1: number; z0: number; z1: number; top: number; kind: WardBlock['kind']; cuts: { x0: number; x1: number; z0: number; z1: number }[] }
export interface Plate { id: string; x: number; y: number; z: number; where: 'post' | 'tower' | 'strip' | 'door'; lore: string }
export interface Ward {
  id: string; name: string; x: number; z: number;
  /** The court's level (absolute), the quarter-turn of its frame (u → +x, +z, −x, −z) and its earthwork's skirt (m). */
  y0: number; q: number; skirt: number;
  blocks: WorldBlock[]; plates: Plate[];
  /** The sealed door: where it stands on the keep, and the way it faces (radians, the yaw that looks at it). */
  door: { x: number; y: number; z: number; yaw: number };
}

/** The ward's plan (m, its own frame): the court's half-size, the apron's, the terrace's, the keep's and the tower's; the
 * terrace's collapsed corner from CORNER out; the crack across the keep from CRACK[0] to CRACK[1] (CANON.gap wide); the
 * posts' half-size and the ground between them and the apron. Tuning. */
export const WARD = { court: 9.8, apron: 7, terrace: 5.2, keep: 3.4, tower: 1.2, corner: 4, crack: [1.9, 1.9 + CANON.gap] as [number, number], post: 0.45, postGap: 1.2, lintel: { long: 1, at: 1.4 } } as const;
/** The heights, each one canonical face over the last. */
export const LEVEL = { apron: CANON.step, terrace: CANON.step + CANON.clamber, keep: CANON.step + CANON.clamber + CANON.wall, tower: CANON.step + CANON.clamber + 2 * CANON.wall } as const;
/** How many wards, how far from the breach (m, just inside TAINT.edge 650), how far apart at least (radians), and what
 * they keep clear of. The earthwork's skirt is at least SKIRT_MIN, and SKIRT_PER m wide for each metre it stands over the
 * land. Tuning. */
export const WARD_N = 5, WARD_RING: [number, number] = [575, 625], WARD_APART = 0.85, WARD_CLEAR = 70, SKIRT_MIN = 2.5, SKIRT_PER = 3, WARD_MAX_RISE = 2.2;

/** The lore of each ward's four plates (post, tower, strip, door), in the order she is likely to find the wards. Placeholder for Noah. */
export const WARD_LORE: string[][] = [
  ['WARD OF THE RING. Duty: hold the line of order about the wound. Draw from the mountain\'s beam. Do not let the hum fall silent.',
    'The last work order: the beam from the mountain thins. Something grows in the shaft. Send a crew with cutting light.',
    'The crystal grows where the chaos seeps up and dries. Cut it, feed it to the ward. Untended, it chokes the works.',
    'SHAFT ACCESS. The door is sealed from within. Black growth fills the frame; it is warm, and it breathes.'],
  ['The mountains are not mountains. They are the works: raised where the crust is thinnest, to drink the chaos and set it as stone.',
    'Shift log: the greblins say the deep conduits are choked with something that moves. They will not go below the third gallery.',
    'Whoever reads this: while the ring hums she cannot spread past it. She can only send her young.',
    'The door\'s runes light faintly as you pass, and go dark where the growth touches them.'],
  ['She came up through the old containment at the forest\'s heart, and from it she reaches still: a body like roots, a worm of many heads, in a shaft deeper than the mountain is tall.',
    'Force takes objects, never knowledge. Learn the works, and they open.',
    'A snerk\'s mark, scratched beside the glyphs: they traded here once, and they know where every door goes.',
    'The growth in the door has pushed the stone apart a finger\'s width. Below, far down, something turns over.'],
  ['The ward is a lock of seven colours. One keeper may light her own; the rest wait for those who carry theirs.',
    'From the mountain\'s drop a hand may reach the shaft; from the wards, a foot. Both ways are hers now.',
    'She is fed nothing by us. She farms the folk of the meadow through her young, and grows slowly, as a forest grows.',
    'A greblin\'s chalk on the lintel: an arrow down, and a mark that means "soon".'],
  ['Wake the wards, and the ring tightens. Wake the mountain, and the beam cuts her down to the root.',
    'The maintenance shift: ten thousand years after the last work order.',
    'Limescale on the pipes. Black on the conduits. The hum is very faint.',
    'The growth stirs when you stand close, and is still again when you step back.'],
];

const BEARINGS = ['east', 'south-east', 'south', 'south-west', 'west', 'north-west', 'north', 'north-east'];
/** The bearing of a point from the breach, as a ward's name (−z is north). */
const bearingName = (dx: number, dz: number): string => BEARINGS[((Math.round(Math.atan2(dz, dx) / (Math.PI / 4)) % 8) + 8) % 8];

/** The ward's frame: u and v (its own) to world x, z offsets, by quarter-turns. */
export function toWorld(q: number, u: number, v: number): [number, number] { switch (q & 3) { case 0: return [u, v]; case 1: return [-v, u]; case 2: return [-u, -v]; default: return [v, -u]; } }
function rectToWorld(q: number, cx: number, cz: number, r: { u0: number; u1: number; v0: number; v1: number }): { x0: number; x1: number; z0: number; z1: number } {
  const [ax, az] = toWorld(q, r.u0, r.v0), [bx, bz] = toWorld(q, r.u1, r.v1);
  return { x0: cx + Math.min(ax, bx), x1: cx + Math.max(ax, bx), z0: cz + Math.min(az, bz), z1: cz + Math.max(az, bz) };
}

/** The ward's blocks in its own frame, its plates' places, and its door's: seeded (which terrace corner fell, which side the crack runs, how high each post stands). */
export function wardPlan(rand: () => number): { blocks: WardBlock[]; plates: { u: number; v: number; top: number; where: Plate['where'] }[]; door: { u: number; v: number; top: number } } {
  const W = WARD, su = rand() < 0.5 ? -1 : 1, sv = rand() < 0.5 ? -1 : 1, sc = rand() < 0.5 ? -1 : 1;
  const sq = (h: number) => ({ u0: -h, u1: h, v0: -h, v1: h });
  const span = (a: number, b: number, s: number) => (s > 0 ? [a, b] : [-b, -a]) as [number, number];
  const [cu0, cu1] = span(W.corner, W.terrace + 0.01, su), [cv0, cv1] = span(W.corner, W.terrace + 0.01, sv), [kv0, kv1] = span(W.crack[0], W.crack[1], sc);
  const blocks: WardBlock[] = [
    { ...sq(W.apron), top: LEVEL.apron, kind: 'apron' },
    { ...sq(W.terrace), top: LEVEL.terrace, kind: 'terrace', cuts: [{ u0: cu0, u1: cu1, v0: cv0, v1: cv1 }] },
    { ...sq(W.keep), top: LEVEL.keep, kind: 'keep', cuts: [{ u0: -W.keep - 0.01, u1: W.keep + 0.01, v0: kv0, v1: kv1 }] },
    { ...sq(W.tower), top: LEVEL.tower, kind: 'tower' },
  ];
  // Fallen lintels across the terrace's two flanks (not the crack's side's end): a vault each, at a run along the ring.
  const mid = (W.keep + W.terrace) / 2, half = W.lintel.long / 2, depth = CANON.vaultDepth;
  for (const s of [-1, 1]) blocks.push({ u0: -W.lintel.at * s - depth / 2, u1: -W.lintel.at * s + depth / 2, v0: s * mid - half, v1: s * mid + half, top: LEVEL.terrace + CANON.vault, kind: 'lintel' });
  // The ward-posts on the court beyond the apron, one each side; the one behind (−u, where she comes from) always whole.
  const at = W.apron + W.postGap + W.post, posts: [number, number][] = [[-at, 0], [0, at], [0, -at], [at, 0]];
  const plates: { u: number; v: number; top: number; where: Plate['where'] }[] = [];
  posts.forEach(([u, v], i) => {
    // A broken post is a stump a step high: a mount-high one as deep as a post would be vaulted, which is the lintels' (0.3 m) alone.
    const top = i === 0 || rand() < 0.55 ? CANON.wall : CANON.step;
    blocks.push({ u0: u - W.post, u1: u + W.post, v0: v - W.post, v1: v + W.post, top, kind: 'post' });
    if (i === 0) plates.push({ u, v, top, where: 'post' });
  });
  plates.push({ u: 0, v: 0, top: LEVEL.tower, where: 'tower' });
  plates.push({ u: -1.6, v: sc * (W.crack[1] + W.keep) / 2, top: LEVEL.keep, where: 'strip' });
  const door = { u: W.tower, v: 0, top: LEVEL.keep };
  plates.push({ u: (W.tower + W.keep) / 2 + 0.2, v: 0, top: LEVEL.keep, where: 'door' });
  return { blocks, plates, door };
}

/** A ward set at (x, z) on its court y0, frame q. */
export function buildWard(id: string, name: string, x: number, z: number, y0: number, q: number, skirt: number, lore: string[], rand: () => number): Ward {
  const plan = wardPlan(rand);
  const blocks: WorldBlock[] = plan.blocks.map(b => ({ ...rectToWorld(q, x, z, b), top: y0 + b.top, kind: b.kind, cuts: (b.cuts ?? []).map(c => rectToWorld(q, x, z, c)) }));
  const order: Plate['where'][] = ['post', 'tower', 'strip', 'door'];
  const plates: Plate[] = plan.plates.map(p => { const [dx, dz] = toWorld(q, p.u, p.v); return { id: `${id}:${p.where}`, x: x + dx, y: y0 + p.top, z: z + dz, where: p.where, lore: lore[order.indexOf(p.where)] ?? '' }; });
  const [ddx, ddz] = toWorld(q, plan.door.u, plan.door.v), [fx, fz] = toWorld(q, 1, 0);
  return { id, name, x, z, y0, q, skirt, blocks, plates, door: { x: x + ddx, y: y0 + plan.door.top, z: z + ddz, yaw: Math.atan2(fx, fz) } };
}

/** The wards about the breach: WARD_N on the ring, each where the land is levellest (the earthwork rises least), on
 * walkable ground, clear of every other place, facing (by quarter-turns) the breach. */
export function wards(seed: number, breach: { x: number; z: number }, height: (x: number, z: number) => number, ok: (x: number, z: number) => boolean, avoid: { x: number; z: number; r: number }[]): Ward[] {
  const rand = mulberry32((seed * 7919 + 4243) >>> 0), cands: { a: number; x: number; z: number; y0: number; skirt: number; rise: number }[] = [];
  const reach = WARD.court + 1.5;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 90) for (let r = WARD_RING[0]; r <= WARD_RING[1]; r += 25) {
    const x = Math.round(breach.x + Math.cos(a) * r), z = Math.round(breach.z + Math.sin(a) * r);
    if (avoid.some(p => Math.hypot(p.x - x, p.z - z) < p.r + WARD_CLEAR)) continue;
    let hi = -Infinity, lo = Infinity, good = true;
    for (let u = -reach; u <= reach && good; u += 1.5) for (let v = -reach; v <= reach; v += 1.5) { const y = height(x + u, z + v); hi = Math.max(hi, y); lo = Math.min(lo, y); if (!ok(x + u, z + v)) { good = false; break; } }
    if (!good || hi - lo > WARD_MAX_RISE) continue;
    const y0 = hi + 0.05, skirt = Math.max(SKIRT_MIN, SKIRT_PER * (y0 - lo));
    // The skirt's own ground must be walkable too.
    let edge = true; for (let k = 0; k < 16 && edge; k++) { const t = (k / 16) * Math.PI * 2, d = WARD.court + skirt; if (!ok(x + Math.cos(t) * d, z + Math.sin(t) * d)) edge = false; }
    if (edge) cands.push({ a, x, z, y0, skirt, rise: hi - lo + rand() * 0.15 });
  }
  cands.sort((p, q) => p.rise - q.rise);
  const out: Ward[] = [], taken: number[] = [];
  const apart = (a: number, b: number) => { const d = Math.abs(a - b) % (Math.PI * 2); return Math.min(d, Math.PI * 2 - d); };
  for (const c of cands) {
    if (out.length >= WARD_N) break; if (taken.some(t => apart(t, c.a) < WARD_APART)) continue;
    taken.push(c.a);
    const dx = breach.x - c.x, dz = breach.z - c.z, q = Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 0 : 2) : (dz > 0 ? 1 : 3);
    const k = out.length;
    out.push(buildWard(`ward-${k + 1}`, `the ${bearingName(c.x - breach.x, c.z - breach.z)} ward`, c.x, c.z, c.y0, q, c.skirt, WARD_LORE[k % WARD_LORE.length], mulberry32((seed * 31 + k * 977 + 5) >>> 0)));
  }
  return out;
}

const inRect = (r: { x0: number; x1: number; z0: number; z1: number }, x: number, z: number, m = 0): boolean => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
/** Whether a block stands at x, z (inflated by m: a body's radius), less its cuts (shrunk by m). */
export const blockAt = (b: WorldBlock, x: number, z: number, m = 0): boolean => inRect(b, x, z, m) && !b.cuts.some(c => inRect(c, x, z, -m));
/** The ward's frame distance of a point from its court: 0 on the court, else how far out (the square's). */
export function outside(w: Ward, x: number, z: number): number { return Math.max(0, Math.max(Math.abs(x - w.x), Math.abs(z - w.z)) - WARD.court); }
/** The earthwork's ground at x, z (null past its skirt): the court's level, falling smoothly over the skirt to the land. */
export function earthAt(w: Ward, x: number, z: number, land: number): number | null {
  const e = outside(w, x, z); if (e >= w.skirt) return null; if (e <= 0) return w.y0;
  const t = e / w.skirt, s = t * t * (3 - 2 * t); return Math.max(land, w.y0 + (land - w.y0) * s);
}
/** The ward's ground at x, z: the highest block standing there, or its earthwork. Null outside its skirt. */
export function wardGround(w: Ward, x: number, z: number, land: number): number | null {
  const g = earthAt(w, x, z, land); if (g === null) return null;
  let y = g; for (const b of w.blocks) if (blockAt(b, x, z) && b.top > y) y = b.top; return y;
}
/** Whether her capsule (feet p, radius) can stand at p within the ward: above its ground and in no block's side. Null outside it. */
export function wardOccupy(w: Ward, p: { x: number; y: number; z: number }, radius: number, land: number): boolean | null {
  const g = earthAt(w, p.x, p.z, land); if (g === null) return null;
  if (p.y < g - 0.03) return false;
  for (const b of w.blocks) if (p.y < b.top - 0.001 && blockAt(b, p.x, p.z, radius)) return false;
  return true;
}
