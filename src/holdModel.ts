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
export const HEARTH = { u: 0, v: 105.3, r: 1.9, seatR: 4.2 };
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
/** The Long Hall's pillars (square, PILLAR_HALF to a side). */
export const HALL_PILLARS: readonly { u: number; v: number }[] = [-6, 6].flatMap(u => [FACADE_V + 11, FACADE_V + 15, FACADE_V + 19].map(v => ({ u, v }))), PILLAR_HALF = 0.75;
export const SOLIDS: readonly Rect[] = [...HALL_PILLARS.map(p => ({ u0: p.u - PILLAR_HALF, v0: p.v - PILLAR_HALF, u1: p.u + PILLAR_HALF, v1: p.v + PILLAR_HALF })), ...GATE_PLINTHS, ...PYLONS.map(p => ({ u0: p.u - PYLON_HALF, v0: p.v - PYLON_HALF, u1: p.u + PYLON_HALF, v1: p.v + PYLON_HALF })), { u0: HEARTH.u - 2.4, v0: HEARTH.v - 2.4, u1: HEARTH.u + 2.4, v1: HEARTH.v + 2.4 }];
/** The halls behind the facade (H4): rooms with their floor (the hearth terrace's level) and ceiling over it; the facade's doors. */
export interface Room extends Rect { id: string; ceiling: number }
export const ROOMS: readonly Room[] = [
  { id: 'passage', u0: -2.2, v0: FACADE_V, u1: 2.2, v1: FACADE_V + 8, ceiling: 4.5 }, { id: 'hall', u0: -12, v0: FACADE_V + 8, u1: 12, v1: FACADE_V + 24, ceiling: 7 },
  { id: 'gallery', u0: -21, v0: FACADE_V, u1: -17, v1: FACADE_V + 28, ceiling: 4 }, { id: 'gallery-way', u0: -17, v0: FACADE_V + 13, u1: -12, v1: FACADE_V + 16.5, ceiling: 4 },
  { id: 'store-door', u0: 12.5, v0: FACADE_V, u1: 16, v1: FACADE_V + FACADE_D, ceiling: 4 }, { id: 'store', u0: 12.5, v0: FACADE_V + FACADE_D, u1: 21.5, v1: FACADE_V + 11, ceiling: 4.2 }, { id: 'store-way', u0: 12, v0: FACADE_V + 8.5, u1: 12.5, v1: FACADE_V + 10.5, ceiling: 4 },
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
/** Is (u, v) on a side stair (Hulda climbs them; the band keeps to the processional stair, so none of its places lie on them)? */
export function onSideStair(u: number, v: number): boolean { return FLIGHTS.some(f => f.side !== 'centre' && inRect(f, u, v, 0.3)) || FLIGHTS.some(f => f.side === 'centre' && v >= f.v0 && v <= f.v1 && Math.abs(u) > STAIR_HW - 0.2 && Math.abs(u) < STAIR_HW + 0.75); }
/** Does the hold decide a body here (on its ground or about a tower stump, which stands half on the land)? */
export function holdDecides(u: number, v: number, pad = 0): boolean { return onHold(u, v, pad) || TOWERS.some(t => Math.hypot(u - t.u, v - t.v) < t.r + pad); }
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
    if (d >= best.d) continue;
    // In front of a terrace (past its front edge) the land eases from the level below it, so its retaining wall stands clear of the
    // fill (a body on the land cannot step up onto the terrace there); beside its wings, from a wing wall's foot.
    const i = TERRACES.findIndex(t => t.v0 === r.v0 && t.hw === Math.max(Math.abs(r.u0), Math.abs(r.u1)));
    const level = levelAt(cu, cv) ?? 0, below = i < 0 ? level : v < r.v0 ? (i ? TERRACES[i - 1].z : APRON.z) : TERRACES[i].z - WING_DROP;
    best = { d, level: i < 0 ? level : Math.min(level, below) };
  }
  return best;
}
/** How far the land beside a terrace's wing lies under it (its wing wall shows that much). */
export const WING_DROP = 1.2;
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
  const solid = (su: number, sv: number): boolean => SOLIDS.some(r => inRect(r, su, sv)) || TOWERS.some(t => Math.hypot(su - t.u, sv - t.v) < t.r);
  if (solid(u, v) || Array.from({ length: 8 }, (_, k) => solid(u + Math.cos(k / 8 * Math.PI * 2) * radius, v + Math.sin(k / 8 * Math.PI * 2) * radius)).some(Boolean)) return false;
  const g = levelAt(u, v); if (g === null) return behindFace(u, v) && v < FACADE_V + 40 && y < FACADE_TOP ? false : null;
  if (y < g - 0.03) return false;
  const here = roomAt(u, v); if (here && y + height > g + here.ceiling) return false;
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * Math.PI * 2, su = u + Math.cos(a) * radius, sv = v + Math.sin(a) * radius;
    if (behindFace(su, sv) && !roomAt(su, sv)) return false;
    const s = levelAt(su, sv); if (s !== null && s > y + STEP_TOL) return false;
  }
  return true;
}
/** Is the camera clear at (u, v) at `y` over the datum? Not under the built ground, not inside a retaining wall's top edge; behind
 * the facade only inside a room, under its ceiling. */
export function cameraClear(u: number, v: number, y: number): boolean {
  if (v >= FACADE_V - 0.3 && Math.abs(u) <= BLUFF_HW + 4 && v <= BLUFF_BACK + BLUFF_BACK_FADE && y < FACADE_TOP + Math.max(0, v - FACADE_V) * BLUFF_CLIMB + 0.5) {
    const r = roomAt(u, v, 0.25), floor = TERRACES[TERRACES.length - 1].z;
    return !!r && v >= FACADE_V + 0.25 && y > floor + 0.2 && y < floor + r.ceiling - 0.25;
  }
  const l = levelAt(u, v); if (l === null) return true;
  if (y < l + 0.15) return false;
  for (const [du, dv] of [[0.4, 0], [-0.4, 0], [0, 0.4], [0, -0.4]]) { const s = levelAt(u + du, v + dv); if (s !== null && y < s + 0.15) return false; }
  return true;
}

// ---- H5: the band's ways about the hold ------------------------------------------------------------------------------------------
type P2 = { u: number; v: number };
const headOf = (i: number): number => TERRACES[i].v0 + runOf(i);
/** Where the band comes onto the hold from the land (before the gate), where the hearth terrace's flight tops out, the band's "cave"
 * (before the Great Door, behind the hearth: it goes in there at night and sleeps in the gallery's niches), a step inside the door,
 * and the ring the band eats round the Ever-Hearth at (inside its seats, clear of its plinth's corners). */
export const APRON_ENTRY: P2 = { u: 0, v: -5 }, HEARTH_TOP: P2 = { u: 0, v: headOf(TERRACES.length - 1) + 0.6 }, DOOR_SPOT: P2 = { u: 0, v: FACADE_V - 0.9 }, DOOR_IN: P2 = { u: 0, v: FACADE_V + 2 }, MEAL_RING = 4.0;
/** A walker's clearance from what stands in its way. */
const CLEAR = 0.32;
/** Which level (u, v) is on: -2 off the hold, -1 the apron, 0..5 the terraces (a central flight belongs to the terrace it climbs to), 6 the halls. */
export function levelOf(u: number, v: number): number {
  if (roomAt(u, v)) return 6;
  for (let i = TERRACES.length - 1; i >= 0; i--) { const t = TERRACES[i]; if (Math.abs(u) <= t.hw && v >= t.v0 && v <= t.v1) return i; }
  return inRect(APRON, u, v) ? -1 : -2;
}
/** What stands in a walker's way on a level, each grown by its clearance: the level's own central flight with its cheeks (a sunken
 * stairwell), its pylons, the gate's plinths, the hearth's plinth, the tower stumps. */
const OBSTACLES: Map<number, Rect[]> = new Map();
function obstaclesOn(level: number): Rect[] {
  let out = OBSTACLES.get(level); if (out) return out;
  out = []; const grow = (r: Rect, c = CLEAR): Rect => ({ u0: Math.min(r.u0, r.u1) - c, u1: Math.max(r.u0, r.u1) + c, v0: Math.min(r.v0, r.v1) - c, v1: Math.max(r.v0, r.v1) + c });
  if (level >= 0 && level < TERRACES.length) { const w = STAIR_HW + 0.45 + CLEAR; out.push({ u0: -w, u1: w, v0: TERRACES[level].v0 - 0.01, v1: headOf(level) + 0.2 }); }
  for (const f of FLIGHTS) if (f.side !== 'centre' && f.terrace - 1 === level) out.push(grow(f));
  // The wall at the level's back (the next terrace's front, open only at the stair; the facade, open only at its doors): keep off its foot.
  if (level >= -1 && level < TERRACES.length - 1) { const back = TERRACES[level + 1].v0, hw = level < 0 ? APRON.u1 : TERRACES[level].hw; for (const sg of [-1, 1]) out.push(grow({ u0: sg * STAIR_HW, u1: sg * (hw + 1), v0: back - 0.01, v1: back + 0.5 })); }
  if (level === TERRACES.length - 1) { const gaps = DOORS.map(d => [d.u0, d.u1] as [number, number]).sort((x, y) => x[0] - y[0]); let u = -FACADE_HW - 1; for (const [g0, g1] of [...gaps, [FACADE_HW + 1, FACADE_HW + 1] as [number, number]]) { if (g0 > u) out.push(grow({ u0: u, u1: g0, v0: FACADE_V - 0.01, v1: FACADE_V + 0.5 })); u = g1; } }
  for (const p of PYLONS) if (levelOf(p.u, p.v) === level) out.push(grow({ u0: p.u - PYLON_HALF, u1: p.u + PYLON_HALF, v0: p.v - PYLON_HALF, v1: p.v + PYLON_HALF }));
  if (level === -1) for (const g of GATE_PLINTHS) out.push(grow(g));
  if (level === TERRACES.length - 1) out.push(grow({ u0: HEARTH.u - 2.4, u1: HEARTH.u + 2.4, v0: HEARTH.v - 2.4, v1: HEARTH.v + 2.4 }, 0.35));
  if (level === 0) for (const t of TOWERS) out.push(grow({ u0: t.u - t.r, u1: t.u + t.r, v0: t.v - t.r, v1: t.v + t.r }));
  if (level === 6) for (const q of HALL_PILLARS) out.push(grow({ u0: q.u - PILLAR_HALF, u1: q.u + PILLAR_HALF, v0: q.v - PILLAR_HALF, v1: q.v + PILLAR_HALF }));
  OBSTACLES.set(level, out); return out;
}
const inside = (r: Rect, q: P2): boolean => q.u > r.u0 && q.u < r.u1 && q.v > r.v0 && q.v < r.v1;
/** Is the straight way from p to t on a level clear (ignoring anything p or t itself stands in)? */
function clearWay(obs: Rect[], p: P2, t: P2): boolean {
  const use = obs.filter(r => !inside(r, p) && !inside(r, t)), n = Math.max(1, Math.ceil(Math.hypot(t.u - p.u, t.v - p.v) / 0.2));
  for (let k = 1; k < n; k++) { const q = { u: p.u + (t.u - p.u) * k / n, v: p.v + (t.v - p.v) * k / n }; if (use.some(r => inside(r, q))) return false; }
  return true;
}
/** The nearest point just outside an obstacle's clearance from a point inside it (on the same level, in no other). */
function edgeOut(obs: Rect[], box: Rect, q: P2, level: number): P2 | null {
  const e = [{ u: box.u0 - 0.05, v: q.v, d: q.u - box.u0 }, { u: box.u1 + 0.05, v: q.v, d: box.u1 - q.u }, { u: q.u, v: box.v0 - 0.05, d: q.v - box.v0 }, { u: q.u, v: box.v1 + 0.05, d: box.v1 - q.v }]
    .filter(c => levelOf(c.u, c.v) === level && !obs.some(o => inside(o, c))).sort((x, y) => x.d - y.d)[0];
  return e ? { u: e.u, v: e.v } : null;
}
/** Across a level round what stands on it: the first corner of the shortest way by the obstacles' corners (null: straight on, or no way). */
function levelPath(level: number, p: P2, t0: P2): P2 | null {
  const obs = obstaclesOn(level);
  // A target inside an obstacle's clearance (standing right by a stairwell's cheek or the hearth's plinth): make for the obstacle's
  // edge nearest it first, then the last short step in.
  let t = t0; const box = obs.find(r => inside(r, t0));
  if (box && inside(box, p)) return null; // both in it (on the same stair): straight on
  // A walker inside an obstacle's clearance steps out of it first, by the nearest edge.
  const own = obs.find(r => inside(r, p));
  if (own) { const e = edgeOut(obs, own, p, level); if (e && Math.hypot(e.u - p.u, e.v - p.v) > 0.05) return e; }
  if (box) { const e = edgeOut(obs, box, t0, level); if (e) t = e; }
  if (t !== t0 && Math.hypot(t.u - p.u, t.v - p.v) < 0.1) return null;
  if (clearWay(obs, p, t)) return t === t0 ? null : t;
  const nodes: P2[] = [p, t];
  for (const r of obs) for (const c of [{ u: r.u0 - 0.05, v: r.v0 - 0.05 }, { u: r.u1 + 0.05, v: r.v0 - 0.05 }, { u: r.u0 - 0.05, v: r.v1 + 0.05 }, { u: r.u1 + 0.05, v: r.v1 + 0.05 }])
    if (levelOf(c.u, c.v) === level && !obs.some(o => inside(o, c))) nodes.push(c);
  const dist = nodes.map(() => Infinity), prev = nodes.map(() => -1), done = nodes.map(() => false); dist[0] = 0;
  for (;;) {
    let i = -1; for (let k = 0; k < nodes.length; k++) if (!done[k] && dist[k] < Infinity && (i < 0 || dist[k] < dist[i])) i = k;
    if (i < 0 || i === 1) break; done[i] = true;
    for (let k = 0; k < nodes.length; k++) if (!done[k] && k !== i) { const d = dist[i] + Math.hypot(nodes[k].u - nodes[i].u, nodes[k].v - nodes[i].v); if (d < dist[k] && clearWay(obs, nodes[i], nodes[k])) { dist[k] = d; prev[k] = i; } }
  }
  if (prev[1] < 0) return null;
  const path: number[] = []; for (let k = 1; k !== 0; k = prev[k]) path.unshift(k);
  // The first corner not already reached (a walker standing at one goes on to the next).
  for (const k of path) { if (k === 1) return null; if (Math.hypot(nodes[k].u - p.u, nodes[k].v - p.v) > 0.05) return nodes[k]; }
  return null;
}
/** Between the halls: by the rooms' shared openings (the midpoint of the next one, a little into the next room). */
function roomRoute(p: P2, t: P2): P2 | null {
  const a = roomAt(p.u, p.v), b = roomAt(t.u, t.v); if (!a || !b || a === b) return null;
  const eq = (x: number, y: number): boolean => Math.abs(x - y) < 1e-6;
  const link = (r: Room, o: Room): P2 | null => {
    if (eq(r.v1, o.v0) || eq(r.v0, o.v1)) { const lo = Math.max(r.u0, o.u0), hi = Math.min(r.u1, o.u1); if (hi - lo < 0.8) return null; return { u: (lo + hi) / 2, v: eq(r.v1, o.v0) ? o.v0 + 0.6 : o.v1 - 0.6 }; }
    if (eq(r.u1, o.u0) || eq(r.u0, o.u1)) { const lo = Math.max(r.v0, o.v0), hi = Math.min(r.v1, o.v1); if (hi - lo < 0.8) return null; return { u: eq(r.u1, o.u0) ? o.u0 + 0.6 : o.u1 - 0.6, v: (lo + hi) / 2 }; }
    return null;
  };
  const from = new Map<Room, Room>(), q: Room[] = [a]; from.set(a, a);
  while (q.length) { const r = q.shift()!; if (r === b) break; for (const o of ROOMS) if (!from.has(o) && link(r, o)) { from.set(o, r); q.push(o); } }
  if (!from.has(b)) return null;
  let r = b; while (from.get(r) !== a) r = from.get(r)!;
  // Square on to the opening first (a step back from it in this room), then through it.
  const through = link(a, r)!;
  if (eq(a.v1, r.v0) || eq(a.v0, r.v1)) { const lo = Math.max(a.u0, r.u0), hi = Math.min(a.u1, r.u1); if (p.u < lo + 0.35 || p.u > hi - 0.35) return { u: through.u, v: eq(a.v1, r.v0) ? a.v1 - 0.6 : a.v0 + 0.6 }; }
  else { const lo = Math.max(a.v0, r.v0), hi = Math.min(a.v1, r.v1); if (p.v < lo + 0.35 || p.v > hi - 0.35) return { u: eq(a.u1, r.u0) ? a.u1 - 0.6 : a.u0 + 0.6, v: through.v }; }
  return through;
}
/** Which facade room a room is reached by (its own if it opens on the facade; else the first such room joined to it, the passage first),
 * and where that room's door is across (u). */
function entryOf(r: Room): Room {
  const front = ROOMS.filter(o => Math.abs(o.v0 - FACADE_V) < 1e-6 && DOORS.some(d => d.kind !== 'sealed' && d.u1 > o.u0 && d.u0 < o.u1)).sort((x, y) => (x.id === 'passage' ? -1 : 0) - (y.id === 'passage' ? -1 : 0));
  if (front.includes(r)) return r;
  for (const f of front) if (roomRoute({ u: (f.u0 + f.u1) / 2, v: (f.v0 + f.v1) / 2 }, { u: (r.u0 + r.u1) / 2, v: (r.v0 + r.v1) / 2 }) !== null) return f;
  return front[0];
}
function doorU(r: Room): number { const d = DOORS.find(x => x.kind !== 'sealed' && x.u1 > r.u0 && x.u0 < r.u1); return d ? (Math.max(d.u0, r.u0) + Math.min(d.u1, r.u1)) / 2 : (r.u0 + r.u1) / 2; }
const near = (p: P2, q: P2, r = 0.6): boolean => Math.hypot(p.u - q.u, p.v - q.v) < r;
const crossesTerraces = (p: P2, t: P2): boolean => { const n = Math.ceil(Math.hypot(t.u - p.u, t.v - p.v) / 0.75); for (let k = 1; k < n; k++) { const u = p.u + (t.u - p.u) * k / n, v = p.v + (t.v - p.v) * k / n; for (const [du, dv] of [[0, 0], [0.8, 0], [-0.8, 0], [0, 0.8], [0, -0.8]]) if (levelOf(u + du, v + dv) >= 0) return true; } return false; };
/** On the land, a way that would cross the terraces goes round the foot instead: to the corner on its own side (clear of the tower
 * stumps), along the front to the far corner if it must, then on (null: straight on). */
function aroundFoot(p: P2, t: P2): P2 | null {
  if (!crossesTerraces(p, t)) return null;
  const corner = (s: number): P2 => ({ u: s * (TERRACES[0].hw + 5.5), v: TERRACES[0].v0 - 5.5 }), ct = corner(t.u >= 0 ? 1 : -1);
  if (crossesTerraces(p, ct)) { const cp = corner(p.u >= 0 ? 1 : -1); return near(p, cp, 0.8) ? ct : cp; }
  return near(p, ct, 0.8) ? null : ct;
}
/** The point on the stair's axis a walker on a level makes for (the terrace's own part above its flight's head; the apron below the gate). */
const axisOn = (level: number, p: P2): P2 => ({ u: 0, v: level === -1 ? Math.min(Math.max(p.v, APRON.v0 + 1), GATE_PLINTHS[0].v0 - 1) : Math.min(Math.max(p.v, headOf(level) + 0.6), TERRACES[level].v1 - 0.4) });
/** The next waypoint from `p` toward `t` about the hold (null: straight on). The terraces are walled but at the processional stair, so a
 * walker between levels goes by the stair's axis (u 0): onto it from the land at the apron, up or down it to the level it wants, then
 * across; across a level round what stands on it (the stairwells, pylons, plinths, the hearth); into and out of the halls by the
 * Great Door and the rooms' openings; on the land round the foot's corners when the way would cross the terraces. */
export function holdRoute(p: P2, t: P2): P2 | null {
  const a = levelOf(p.u, p.v), b = levelOf(t.u, t.v), H = TERRACES.length - 1, onAxis = Math.abs(p.u) < 0.9;
  // The halls.
  // A target on a central flight is reached down that flight from its head (its cheeks are walls): to its head, onto the stair, along it.
  const tf = FLIGHTS.find(f => f.side === 'centre' && Math.abs(t.u) < STAIR_HW && t.v >= f.v0 && t.v < f.v1);
  if (tf && !(Math.abs(p.u) < STAIR_HW && p.v >= tf.v0 && p.v < tf.v1)) { const top = { u: 0, v: tf.v1 + 0.6 }; return near(p, top, 0.5) ? { u: 0, v: tf.v1 - 0.3 } : holdRoute(p, top) ?? top; }
  // On a central flight (a terrace's own, climbing to it) bound for that terrace or higher: up to its head before turning off it (its cheeks are walls).
  if (a >= 0 && a < 6 && b >= a && Math.abs(p.u) < STAIR_HW + 0.3 && p.v < headOf(a) - 0.05) { const head = { u: 0, v: headOf(a) + 0.6 }; if (!(b === a && Math.abs(t.u) < STAIR_HW && t.v < headOf(a) - 0.05)) return onAxis ? head : { u: 0, v: p.v }; }
  // On a central flight going down: onto its axis where it stands, then down it.
  if (a >= 0 && a < 6 && b < a && !onAxis && Math.abs(p.u) < STAIR_HW + 0.3 && p.v < headOf(a) - 0.05) return { u: 0, v: p.v };
  // The halls: within them by the rooms' openings, round the pillars; in and out by the facade's doors (each room by the door its own
  // rooms open on: the passage's Great Door, the gallery's, the store's, the watch stair's).
  const inRooms = (q: P2): P2 | null => { const w = roomRoute(p, q); if (!w) return levelPath(6, p, q); return levelPath(6, p, w) ?? w; };
  const pr = a === 6 ? roomAt(p.u, p.v) : null, tr = b === 6 ? roomAt(t.u, t.v) : null;
  if (pr && tr && entryOf(pr) === entryOf(tr)) return inRooms(t);
  if (pr) { // out
    const f = entryOf(pr), d = doorU(f);
    if (pr !== f) return inRooms({ u: d, v: FACADE_V + 1.2 }) ?? { u: d, v: FACADE_V + 1.2 };
    if (p.v > FACADE_V + 0.8 && Math.abs(p.u - d) > 0.5) { const q = { u: d, v: FACADE_V + 0.6 }; return levelPath(6, p, q) ?? q; }
    return { u: d, v: FACADE_V - 0.9 };
  }
  if (tr) { // in
    const f = entryOf(tr), d = doorU(f), outside = { u: d, v: FACADE_V - 0.9 };
    if (a !== H) return holdRoute(p, outside) ?? outside;
    if (Math.abs(p.u - d) < 1.2 && p.v > FACADE_V - 1.7) return { u: d, v: FACADE_V + 0.6 };
    return levelPath(H, p, outside) ?? outside;
  }
  // On the land or the apron for the land: below the gate's plinths, then round the foot's corners if the way would cross the terraces.
  if (a <= -1 && b === -2) {
    if (a === -1 && p.v > GATE_PLINTHS[0].v0 - 0.5) { const out = { u: 0, v: GATE_PLINTHS[0].v0 - 1 }; return levelPath(-1, p, out) ?? out; }
    return aroundFoot(p, t);
  }
  if (a === b) return levelPath(a, p, t);
  if (a < b) { // up
    if (a === -2) return near(p, APRON_ENTRY, 1) ? { u: 0, v: headOf(b) + 0.6 } : aroundFoot(p, APRON_ENTRY) ?? APRON_ENTRY;
    if (!onAxis) { const q = axisOn(a, p); return levelPath(a, p, q) ?? q; }
    return { u: 0, v: headOf(b) + 0.6 };
  }
  // down
  if (a === H && !(onAxis && p.v <= HEARTH_TOP.v + 0.1)) return near(p, HEARTH_TOP, 0.4) ? { u: 0, v: HEARTH_TOP.v - 1 } : levelPath(H, p, HEARTH_TOP) ?? HEARTH_TOP;
  if (!onAxis) { const q = axisOn(a, p); return levelPath(a, p, q) ?? q; }
  if (b === -2) return near(p, APRON_ENTRY, 1) ? null : APRON_ENTRY;
  return { u: 0, v: (b === -1 ? TERRACES[0].v0 : TERRACES[b + 1].v0) - 0.8 };
}
