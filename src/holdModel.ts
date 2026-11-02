// The Hearth-Hold (Noah, 2026-11-02; HOLD.md, the schematic he approved): the band's home as the ruin of an old masonwork stepped up the
// mountain's foot behind the cave. Six terraces of dry stone beds climb a processional stair to a facade cut into a raised bluff, the
// halls behind it; the Ever-Hearth burns before the door. This is the layout as numbers and the ground as rules, nothing drawn. Pure:
// no Three.js, node-tested.
//
// The hold's frame: origin at the cave's mouth, `v` metres into the mountain (the cave's own facing, reversed), `u` metres across, +
// to the right of one facing the mountain; heights are metres over the natural ground at the mouth (`h0`, the frame's datum).
const smooth = (a: number, b: number, x: number): number => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export interface HoldFrame { x: number; z: number; /** The cave's facing (out of the mountain; figures face -z at heading 0). */ dir: number; ix: number; iz: number; rx: number; rz: number }
export function holdFrame(cave: { x: number; z: number; dir: number }): HoldFrame {
  const ix = Math.sin(cave.dir), iz = Math.cos(cave.dir);
  return { x: cave.x, z: cave.z, dir: cave.dir, ix, iz, rx: -iz, rz: ix };
}
export function toLocal(f: HoldFrame, x: number, z: number): { u: number; v: number } { const dx = x - f.x, dz = z - f.z; return { u: dx * f.rx + dz * f.rz, v: dx * f.ix + dz * f.iz }; }
export function toWorld(f: HoldFrame, u: number, v: number): { x: number; z: number } { return { x: f.x + f.ix * v + f.rx * u, z: f.z + f.iz * v + f.rz * u }; }
/** The world heading of a local direction (du, dv), for figures (which face -z at heading 0). */
export function headingOf(f: HoldFrame, du: number, dv: number): number { const dx = f.ix * dv + f.rx * du, dz = f.iz * dv + f.rz * du; return Math.atan2(-dx, -dz); }

// ---- Tuning: the layout (m), as the schematic drew it -----------------------------------------------------------------------------
export interface Terrace { name: string; v0: number; v1: number; /** Its level over the datum. */ z: number; /** Half its width. */ hw: number; /** Beds a side. */ beds: number }
/** The terraces, foot to top; the last is the hearth terrace before the facade (wider than the schematic's 26: the facade's side doors open onto it). */
export const TERRACES: readonly Terrace[] = [
  { name: 'T1', v0: 8, v1: 30, z: 1.2, hw: 46, beds: 3 }, { name: 'T2', v0: 30, v1: 48, z: 3.2, hw: 44, beds: 3 }, { name: 'T3', v0: 48, v1: 64, z: 5.6, hw: 40, beds: 2 },
  { name: 'T4', v0: 64, v1: 80, z: 8.6, hw: 36, beds: 2 }, { name: 'T5', v0: 80, v1: 94, z: 12.2, hw: 30, beds: 1 }, { name: 'H', v0: 94, v1: 110, z: 15.8, hw: 30, beds: 0 }];
/** The paved apron before the stair's foot (where the cave mouth was), level with the datum. */
export const APRON = { u0: -10, u1: 10, v0: -8, v1: 8, z: 0 };
/** The processional stair's half width; a step's rise and tread (a hobbit's step); the side stairs' width. */
export const STAIR_HW = 2.4, RISER = 0.18, TREAD = 0.32, SIDE_STAIR_W = 1.6;
/** The facade: its line, its top over the datum, its half width; the bluff of rock raised behind it: its half width before it fades over BLUFF_SIDE_FADE, its climb behind the facade (rise per metre), how far back it holds before fading over BLUFF_BACK_FADE. */
/** The facade's masonry thickness (m) behind its face. */
export const FACADE_D = 2.6;
export const FACADE_V = 110, FACADE_TOP = 27, FACADE_HW = 36, BLUFF_HW = 40, BLUFF_SIDE_FADE = 24, BLUFF_CLIMB = 0.12, BLUFF_BACK = 150, BLUFF_BACK_FADE = 60;
/** Outside the hold the land eases back to its own shape over this many metres (the terraces' fills and cuts). */
export const GROUND_FADE = 9;
/** The beds: their margin from a terrace's front and back, the walk down its back (the runnel's), the gap between beds, the band either side of the stair kept clear; the soil sits under the curb. */
export const BED_FRONT = 2.4, BED_BACK = 3.2, BED_GAP = 1.8, BED_INNER = 6.5, BED_OUTER = 4.2, BED_SINK = 0.06, CURB_H = 0.16;
/** The Ever-Hearth: where it stands on the hearth terrace, its plinth's radius; the ring of seats. */
export const HEARTH = { u: 0, v: 104.5, r: 1.9, seatR: 4.2 };
/** Hulda's clearance indoors, everywhere she may walk (her third-person camera's room). */
export const CLEAR_H = 4;
/** A walk surface may rise this much under a body's edge (a stair's ramp, a curb) before it is a wall. */
export const STEP_TOL = 0.32;

export const riseOf = (i: number): number => TERRACES[i].z - (i ? TERRACES[i - 1].z : APRON.z);
export const stepsOf = (i: number): number => Math.round(riseOf(i) / RISER);
export const runOf = (i: number): number => stepsOf(i) * TREAD;

// ---- The pieces, derived ---------------------------------------------------------------------------------------------------------
export interface Rect { u0: number; v0: number; u1: number; v1: number }
const inRect = (r: Rect, u: number, v: number, pad = 0): boolean => u >= Math.min(r.u0, r.u1) - pad && u <= Math.max(r.u0, r.u1) + pad && v >= Math.min(r.v0, r.v1) - pad && v <= Math.max(r.v0, r.v1) + pad;
/** A flight: its rect, the height at its foot and head, the way it climbs (+v, or toward +u or -u), its steps. */
export interface Flight extends Rect { from: number; to: number; climb: 'v' | 'u+' | 'u-'; steps: number; terrace: number; side: 'centre' | 'left' | 'right' }
/** The central flights (one up each terrace's front wall, cut into the terrace above) and the side stairs (along the walls at the wings' ends, alternating sides; never on the collapsed right of T4 and T5). */
export const FLIGHTS: readonly Flight[] = (() => {
  const out: Flight[] = [];
  TERRACES.forEach((t, i) => {
    const from = i ? TERRACES[i - 1].z : APRON.z;
    out.push({ u0: -STAIR_HW, u1: STAIR_HW, v0: t.v0, v1: t.v0 + runOf(i), from, to: t.z, climb: 'v', steps: stepsOf(i), terrace: i, side: 'centre' });
    if (i === 0) return;
    let s = i % 2 ? -1 : 1; if (s === 1 && (t.name === 'T4' || t.name === 'T5')) s = -1;
    const head = s * (t.hw - 1.0), foot = head - s * runOf(i);
    out.push({ u0: Math.min(head, foot), u1: Math.max(head, foot), v0: t.v0 - SIDE_STAIR_W, v1: t.v0, from, to: t.z, climb: s > 0 ? 'u+' : 'u-', steps: stepsOf(i), terrace: i, side: s > 0 ? 'right' : 'left' });
  });
  return out;
})();
/** The beds, each on its terrace (dry: the irrigation quest's), and the bed lost under the collapse. */
export interface Bed extends Rect { terrace: number; side: -1 | 1; index: number }
export const BEDS: readonly Bed[] = (() => {
  const out: Bed[] = [];
  TERRACES.forEach((t, i) => {
    if (!t.beds) return;
    const w = (t.hw - BED_OUTER - BED_INNER - (t.beds - 1) * BED_GAP) / t.beds;
    for (const s of [-1, 1] as const) for (let k = 0; k < t.beds; k++) {
      if (s === 1 && (t.name === 'T4' || t.name === 'T5') && k === t.beds - 1) continue;
      const a = BED_INNER + k * (w + BED_GAP), b = a + w;
      out.push({ u0: s * a, u1: s * b, v0: t.v0 + BED_FRONT + (i === 0 ? 0 : 0), v1: t.v1 - BED_BACK, terrace: i, side: s, index: k });
    }
  });
  return out;
})();
/** The collapse: the right wing of T4 and T5 slid into a scree fan (a polygon in the frame). */
export const COLLAPSE: readonly { u: number; v: number }[] = [{ u: 19, v: 94.5 }, { u: 31, v: 94 }, { u: 38, v: 86 }, { u: 41, v: 72 }, { u: 37, v: 62 }, { u: 31, v: 57 }, { u: 24, v: 63 }, { u: 21, v: 73 }, { u: 18.5, v: 84 }];
/** A retaining wall: the front of a terrace, from the stair's edge out to the wider of it and the terrace below, at `v`, from `low` up to `high`. */
export interface Wall { u0: number; u1: number; v: number; low: number; high: number; terrace: number }
export const WALLS: readonly Wall[] = (() => {
  const out: Wall[] = [];
  TERRACES.forEach((t, i) => {
    const low = i ? TERRACES[i - 1].z : APRON.z, out1 = Math.max(t.hw, i ? TERRACES[i - 1].hw : t.hw);
    for (const s of [-1, 1]) out.push({ u0: s * STAIR_HW, u1: s * Math.min(t.hw, out1), v: t.v0, low, high: t.z, terrace: i });
  });
  return out;
})();
/** The lantern pylons (pairs at three landings), the watchtower stumps at the foot's corners. */
export const PYLONS: readonly { u: number; v: number }[] = [31.8, 66, 96].flatMap(v => [{ u: -4, v }, { u: 4, v }]);
export const TOWERS: readonly { u: number; v: number; r: number }[] = [{ u: -46, v: 9, r: 3.2 }, { u: 46, v: 9, r: 3.2 }];
/** The apron's gate: two plinths flanking the stair's foot (where the cave mouth was) and the lintel fallen beside them. */
export const GATE_PLINTHS: readonly Rect[] = [{ u0: -5.2, v0: 5.2, u1: -2.8, v1: 7.9 }, { u0: 2.8, v0: 5.2, u1: 5.2, v1: 7.9 }];
export const PYLON_HALF = 0.4;
/** What stands on the built ground and stops a body (rects, and circles for the towers): the gate's plinths, the pylons, the Ever-Hearth's plinth. */
export const SOLIDS: readonly Rect[] = [...GATE_PLINTHS, ...PYLONS.map(p => ({ u0: p.u - PYLON_HALF, v0: p.v - PYLON_HALF, u1: p.u + PYLON_HALF, v1: p.v + PYLON_HALF })), { u0: HEARTH.u - 2.4, v0: HEARTH.v - 2.4, u1: HEARTH.u + 2.4, v1: HEARTH.v + 2.4 }];
/** The halls behind the facade (H4): rooms with their floor (the hearth terrace's level) and ceiling over it; the facade's doors. */
export interface Room extends Rect { id: string; ceiling: number }
export const ROOMS: readonly Room[] = [
  { id: 'passage', u0: -2.2, v0: FACADE_V, u1: 2.2, v1: FACADE_V + 8, ceiling: 4.5 }, { id: 'hall', u0: -12, v0: FACADE_V + 8, u1: 12, v1: FACADE_V + 24, ceiling: 7 },
  { id: 'gallery', u0: -21, v0: FACADE_V, u1: -17, v1: FACADE_V + 28, ceiling: 4 }, { id: 'gallery-way', u0: -17, v0: FACADE_V + 13, u1: -12, v1: FACADE_V + 16.5, ceiling: 4 },
  { id: 'store-door', u0: 12.5, v0: FACADE_V, u1: 16, v1: FACADE_V + FACADE_D, ceiling: 4 }, { id: 'store', u0: 12.5, v0: FACADE_V + FACADE_D, u1: 21.5, v1: FACADE_V + 11, ceiling: 4.2 }, { id: 'store-way', u0: 12, v0: FACADE_V + 3, u1: 12.5, v1: FACADE_V + 6.5, ceiling: 4 },
  { id: 'scriptorium', u0: 13.5, v0: FACADE_V + 13, u1: 21.5, v1: FACADE_V + 23, ceiling: 4.4 }, { id: 'scriptorium-way', u0: 12, v0: FACADE_V + 16, u1: 13.5, v1: FACADE_V + 20, ceiling: 4 },
  { id: 'watch', u0: -27, v0: FACADE_V, u1: -23, v1: FACADE_V + 4, ceiling: 4 }];
/** The sleeping gallery's bed niches, cut into its outer (left) wall: nine, one a hobbit and a spare; their depth and height. */
export const NICHES: readonly Rect[] = Array.from({ length: 9 }, (_, k) => ({ u0: -23.6, u1: -21, v0: FACADE_V + 2 + k * 2.9, v1: FACADE_V + 2 + k * 2.9 + 2.2 }));
export const NICHE_H = 1.7;
/** The room at (u, v) (a body's centre inside it, `pad` in from its walls), if any. */
export function roomAt(u: number, v: number, pad = 0): Room | null { for (const r of ROOMS) if (u >= r.u0 + pad && u <= r.u1 - pad && v >= r.v0 + pad && v <= r.v1 - pad) return r; return null; }
export interface Door { id: string; u0: number; u1: number; height: number; kind: 'great' | 'arch' | 'sealed' }
export const DOORS: readonly Door[] = [
  { id: 'great', u0: -2.2, u1: 2.2, height: 4.5, kind: 'great' }, { id: 'gallery', u0: -21, u1: -17, height: 4, kind: 'arch' }, { id: 'store', u0: 12.5, u1: 16, height: 4, kind: 'arch' },
  { id: 'watch', u0: -27, u1: -23, height: 4, kind: 'arch' }, { id: 'waterworks', u0: 22.5, u1: 26, height: 4, kind: 'sealed' }];

// ---- The ground ------------------------------------------------------------------------------------------------------------------
const FOOT: readonly Rect[] = [APRON, ...TERRACES.map(t => ({ u0: -t.hw, u1: t.hw, v0: t.v0, v1: t.v1 })), ...ROOMS];
/** Is (u, v) on the hold's built ground (the apron or a terrace)? */
export function onHold(u: number, v: number, pad = 0): boolean { return FOOT.some(r => inRect(r, u, v, pad)); }
/** The built ground's level at (u, v) over the datum (a flight's ramp where it climbs; a bed's soil a little under), null off it. */
export function levelAt(u: number, v: number): number | null {
  for (const f of FLIGHTS) if (inRect(f, u, v)) {
    const t = f.climb === 'v' ? (v - f.v0) / (f.v1 - f.v0) : f.climb === 'u+' ? (u - f.u0) / (f.u1 - f.u0) : (f.u1 - u) / (f.u1 - f.u0);
    return lerp(f.from, f.to, Math.min(1, Math.max(0, t)));
  }
  for (let i = TERRACES.length - 1; i >= 0; i--) { const t = TERRACES[i]; if (Math.abs(u) <= t.hw && v >= t.v0 && v <= t.v1) return t.z; }
  if (inRect(APRON, u, v)) return APRON.z;
  if (roomAt(u, v)) return TERRACES[TERRACES.length - 1].z;
  return null;
}
/** The nearest point of the built ground and its level (for the land's ease back to itself outside). */
function nearest(u: number, v: number): { d: number; level: number } {
  let best = { d: Infinity, level: 0 };
  for (const r of FOOT) {
    const cu = Math.min(Math.max(u, r.u0), r.u1), cv = Math.min(Math.max(v, r.v0), r.v1), d = Math.hypot(u - cu, v - cv);
    if (d < best.d) best = { d, level: levelAt(cu, cv) ?? 0 };
  }
  return best;
}
/** The bluff's top at (u, v) over the datum given the natural ground there, or null off it: the rock raised behind the facade. */
export function bluffAt(u: number, v: number, natural: number): number | null {
  if (v < FACADE_V) return null;
  const w = (1 - smooth(BLUFF_HW, BLUFF_HW + BLUFF_SIDE_FADE, Math.abs(u))) * (1 - smooth(BLUFF_BACK, BLUFF_BACK + BLUFF_BACK_FADE, v));
  if (w <= 0) return null;
  const top = FACADE_TOP + (v - FACADE_V) * BLUFF_CLIMB;
  return lerp(natural, Math.max(natural, top), w);
}
/** The hold's reach about its frame: past it the land is its own. */
export const HOLD_REACH = { u: BLUFF_HW + BLUFF_SIDE_FADE + 2, v0: APRON.v0 - GROUND_FADE - 2, v1: BLUFF_BACK + BLUFF_BACK_FADE + 2 };
export function inReach(u: number, v: number): boolean { return Math.abs(u) <= HOLD_REACH.u && v >= HOLD_REACH.v0 && v <= HOLD_REACH.v1; }
/** The land is drawn in 2 m triangles: by a wall or a flight its mesh would ramp up out of the lower level in front of the stone. So the
 * drawn ground on the hold is the lowest level within a cell of it (under the paving, the steps and the upper terrace's edge, which
 * the masonry draws); her feet read `levelAt` itself. */
export const DRAWN_REACH = 2.2;
function drawnLevel(u: number, v: number, at: number): number {
  let h = at;
  for (const [du, dv] of [[DRAWN_REACH, 0], [-DRAWN_REACH, 0], [0, DRAWN_REACH], [0, -DRAWN_REACH], [DRAWN_REACH, DRAWN_REACH], [-DRAWN_REACH, -DRAWN_REACH], [DRAWN_REACH, -DRAWN_REACH], [-DRAWN_REACH, DRAWN_REACH]]) { const l = levelAt(u + du, v + dv); if (l !== null && l < h) h = l; }
  return h;
}
/** The halls' block: the land is drawn under the floors here (a heightfield cannot be both the halls' floor and the bluff's top), and
 * holdWorld draws the bluff's top over it as a rock cap at `capTop`, reaching CAP_SKIRT past it where the land climbs back. */
export const HALLS_RECT: Rect = { u0: -FACADE_HW, u1: FACADE_HW, v0: FACADE_V, v1: FACADE_V + 31 }, CAP_SKIRT = 2.6;
export const capTop = (v: number): number => FACADE_TOP + Math.max(0, v - FACADE_V) * BLUFF_CLIMB;
/** The land as carved: the built ground level, easing back to the natural over GROUND_FADE outside, and the bluff raised behind the facade. All over the datum. */
export function carve(u: number, v: number, natural: number): number {
  if (!inReach(u, v)) return natural;
  if (inRect(HALLS_RECT, u, v)) return TERRACES[TERRACES.length - 1].z - 0.6;
  const at = levelAt(u, v); let h: number;
  if (at !== null) h = drawnLevel(u, v, at);
  else { const n = nearest(u, v); h = n.d < GROUND_FADE ? lerp(n.level, natural, smooth(0, GROUND_FADE, n.d)) : natural; }
  // The bluff's drawn ground starts behind the facade's thickness (FACADE_D), so the land's 2 m triangles climb to it behind the face, not in front of it.
  const b = v >= FACADE_V + FACADE_D ? bluffAt(u, v, natural) : null; if (b !== null) h = Math.max(h, b);
  return h;
}
/** Is (u, v) behind the facade's face, in the masonry or the bluff (solid but where a room opens)? */
const behindFace = (u: number, v: number): boolean => v >= FACADE_V && Math.abs(u) <= BLUFF_HW + 4;
/** Can a body of `radius` and `height` stand with its feet `y` over the datum at (u, v)? null off the built ground (the land decides
 * there). A wall is where the ground under the body's edge stands more than STEP_TOL over its feet; behind the facade only the rooms
 * are open, and a body must stand under their ceilings. */
export function occupy(u: number, v: number, y: number, radius: number, height = 1.7): boolean | null {
  const g = levelAt(u, v); if (g === null) return behindFace(u, v) && v < FACADE_V + 40 && y < FACADE_TOP ? false : null;
  if (y < g - 0.03) return false;
  const here = roomAt(u, v); if (here && y + height > g + here.ceiling) return false;
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2, su = u + Math.cos(a) * radius, sv = v + Math.sin(a) * radius;
    if (behindFace(su, sv) && !roomAt(su, sv)) return false;
    if (SOLIDS.some(r => inRect(r, su, sv)) || TOWERS.some(t => Math.hypot(su - t.u, sv - t.v) < t.r)) return false;
    const s = levelAt(su, sv); if (s !== null && s > y + STEP_TOL) return false;
  }
  return true;
}
/** Is the camera clear at (u, v) at `y` over the datum? Not under the built ground, not inside a retaining wall's top edge; behind
 * the facade only inside a room, under its ceiling. */
export function cameraClear(u: number, v: number, y: number): boolean {
  if (v >= FACADE_V - 0.3 && Math.abs(u) <= BLUFF_HW + 4 && v <= BLUFF_BACK + 10 && y < FACADE_TOP + Math.max(0, v - FACADE_V) * BLUFF_CLIMB + 0.5) {
    const r = roomAt(u, v, 0.25), floor = TERRACES[TERRACES.length - 1].z;
    return !!r && v >= FACADE_V + 0.25 && y > floor + 0.2 && y < floor + r.ceiling - 0.25;
  }
  const l = levelAt(u, v); if (l === null) return true;
  if (y < l + 0.15) return false;
  for (const [du, dv] of [[0.4, 0], [-0.4, 0], [0, 0.4], [0, -0.4]]) { const s = levelAt(u + du, v + dv); if (s !== null && y < s + 0.15) return false; }
  return true;
}
