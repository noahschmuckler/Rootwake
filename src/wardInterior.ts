// R2, the first way in (RUINS.md): the interior of the ward nearest her village, entered by the tower's door once her
// blows have cut its thinned growth away. A vestibule where a snerk sits out of the draught; a wall's drop to the
// gallery, where a greblin crew stands round a dead junction box, their line choked by a knot of her growth in the
// passage beyond; and the crystal chamber, where the ward's light must be turned by three mirrors (one up on a ledge)
// from the crystal to the ward's core, on its dais. Cut the knot and the crew fixes the box (badly, twice); route the
// light and the ward wakes. Pure: the rooms, the ground and room they make, the beam, and the quest's steps.
import { CANON } from './parkour';

/** How far below the ward's court the interior lies (m): an instance of its own, under the land. Tuning. */
export const INTERIOR_DEPTH = 40;
/** The rooms (interior frame: x across, z along; −z is deeper), each a floor over the vestibule's and a ceiling. */
export interface Room { id: 'vestibule' | 'gallery' | 'passage' | 'chamber'; x0: number; x1: number; z0: number; z1: number; floor: number; ceiling: number }
const W = CANON.wall;
export const ROOMS: Room[] = [
  { id: 'vestibule', x0: -2.5, x1: 2.5, z0: -3, z1: 3, floor: 0, ceiling: 3 },
  { id: 'gallery', x0: -4, x1: 4, z0: -12, z1: -3, floor: -W, ceiling: 3.2 },
  { id: 'passage', x0: -1, x1: 1, z0: -15, z1: -12, floor: -W, ceiling: 2.2 },
  { id: 'chamber', x0: -5, x1: 5, z0: -25, z1: -15, floor: -W, ceiling: 4.5 },
];
/** A solid block in the rooms: its footprint and top (interior frame). The knot stands until it is cut. */
export interface Solid { id: string; x0: number; x1: number; z0: number; z1: number; top: number; kind: 'stone' | 'cabinet' | 'knot' }
export const SOLIDS: Solid[] = [
  // A fallen block in the gallery to mount, and the junction box against its wall (too tall to climb).
  { id: 'block', x0: 1.6, x1: 4, z0: -8, z1: -6, top: -W + CANON.clamber, kind: 'stone' },
  { id: 'cabinet', x0: -4, x1: -3.3, z0: -11.6, z1: -10.2, top: 2.6, kind: 'cabinet' },
  { id: 'knot', x0: -1, x1: 1, z0: -13.7, z1: -12.5, top: 2.2, kind: 'knot' },
  // In the chamber: the ledge one mirror stands on, and the dais of the ward's core, a wall up each.
  { id: 'ledge', x0: 1.5, x1: 4.5, z0: -18.5, z1: -15.5, top: 0, kind: 'stone' },
  { id: 'dais', x0: -4.5, x1: -1.2, z0: -18.5, z1: -15.5, top: 0, kind: 'stone' },
];
/** Where she comes in (and the door she leaves by, in the vestibule's end wall), and where the figures stand. */
export const ENTRY = { x: 0, z: 2.2, yaw: 0 }, EXIT = { x: 0, z: 3 };
export const SNERK_AT = { x: 1.7, z: -1.6, yaw: -2.2 };
export const CREW_AT = [{ x: -1.2, z: -10.4 }, { x: 0.3, z: -10.9 }, { x: -2.4, z: -9.6 }];
export const CABINET_FRONT = { x: -2.9, z: -10.9 };
/** The light: the crystal, the mirrors (each turns a quarter of a half-turn a blow), the core, the beam's height over the chamber floor. */
export const BEAM_Y = 1.3;
export const EMITTER = { x: -4.6, z: -23, dx: 1, dz: 0 };
export const MIRRORS = [{ x: 2.5, z: -23 }, { x: 2.5, z: -20.5 }, { x: 2.5, z: -17 }];
/** Where each mirror stands (its foot: the ledge's top for the third). */
export const MIRROR_FOOT = [-W, -W, 0];
export const CORE = { x: -2.5, z: -17 };
/** The mirrors' turns at the start (each k of 4: its face along k × 45°), and the one setting that brings the light to the core. */
export const MIRROR_START = [0, 1, 0], MIRROR_SOLVED = [1, 2, 3];
/** Blows: the thinned growth on the door, and the knot. How far (m) and how square to her facing a blow reaches. Tuning. */
export const DOOR_CUTS = 3, KNOT_CUTS = 5, BLOW_REACH = 1.5, BLOW_COS = 0.3;
/** The crew's tries at the box (seconds each), the last of which takes. */
export const FIX_TRIES = 3, FIX_TRY_S = 2.6;

export type Stage = 'sealed' | 'open' | 'cut' | 'fixing' | 'powered' | 'woken';
export interface Quest { ward: string; stage: Stage; door: number; knot: number; mirrors: number[]; fix: number; met: { snerk: boolean; crew: boolean } }
export const freshQuest = (ward: string): Quest => ({ ward, stage: 'sealed', door: 0, knot: 0, mirrors: MIRROR_START.slice(), fix: 0, met: { snerk: false, crew: false } });
export function parseQuest(s: string | null, ward: string): Quest {
  try { const q = JSON.parse(s ?? '') as Quest; if (q && q.ward === ward && Array.isArray(q.mirrors) && q.mirrors.length === MIRRORS.length) return { ...freshQuest(ward), ...q, met: { ...freshQuest(ward).met, ...q.met } }; } catch { /* A fresh quest. */ }
  return freshQuest(ward);
}

// ── the ground ──
const inRect = (r: { x0: number; x1: number; z0: number; z1: number }, x: number, z: number, m = 0): boolean => x > r.x0 - m && x < r.x1 + m && z > r.z0 - m && z < r.z1 + m;
export const roomAt = (x: number, z: number): Room | null => ROOMS.find(r => inRect(r, x, z)) ?? null;
/** The solids standing now (the knot until it's cut). */
export const solidsNow = (q: Quest): Solid[] => SOLIDS.filter(s => s.kind !== 'knot' || q.stage === 'sealed' || q.stage === 'open');
/** The ground at x, z in the interior frame (relative to the vestibule's floor), or null in the rock. */
export function groundIn(q: Quest, x: number, z: number): number | null {
  const r = roomAt(x, z); if (!r) return null; let y = r.floor; for (const s of solidsNow(q)) if (inRect(s, x, z) && s.top > y) y = s.top; return y;
}
/** Whether her body (feet p, relative, radius, height) fits: within the rooms all round, over the floor, under the ceiling, in no solid's or higher floor's side. */
export function occupyIn(q: Quest, p: { x: number; y: number; z: number }, radius: number, height: number): boolean {
  const here = roomAt(p.x, p.z); if (!here || p.y < groundIn(q, p.x, p.z)! - 0.03 || p.y + height > here.ceiling) return false;
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4, x = p.x + Math.cos(a) * radius, z = p.z + Math.sin(a) * radius, r = roomAt(x, z); if (!r || p.y + height > r.ceiling) return false; }
  for (const r of ROOMS) if (r.floor > p.y + 0.001 && inRect(r, p.x, p.z, radius)) return false;
  for (const s of solidsNow(q)) if (s.top > p.y + 0.001 && inRect(s, p.x, p.z, radius)) return false;
  return true;
}
/** Whether a camera point (relative) is inside the rooms, clear of their ceilings and the solids. */
export function clearIn(q: Quest, p: { x: number; y: number; z: number }): boolean {
  const r = roomAt(p.x, p.z); if (!r || p.y > r.ceiling - 0.1) return false;
  const g = groundIn(q, p.x, p.z); return g !== null && p.y > g + 0.1;
}

// ── the light ──
export interface Beam { points: { x: number; z: number }[]; hitsCore: boolean }
/** The light from the crystal, turned by each mirror it meets (a face edge-on lets it by), to a wall or the core. */
export function traceBeam(mirrors: number[]): Beam {
  const ch = ROOMS.find(r => r.id === 'chamber')!, pts = [{ x: EMITTER.x, z: EMITTER.z }];
  let x = EMITTER.x, z = EMITTER.z, dx = EMITTER.dx, dz = EMITTER.dz, last = -1;
  for (let bounce = 0; bounce < 8; bounce++) {
    // The next mirror, or the core, on the line ahead; else the wall.
    let best = Infinity, hit = -1;
    MIRRORS.forEach((m, i) => { if (i === last) return; const t = (m.x - x) * dx + (m.z - z) * dz, off = Math.abs((m.x - x) * dz - (m.z - z) * dx); if (t > 0.05 && off < 0.15 && t < best) { best = t; hit = i; } });
    const tc = (CORE.x - x) * dx + (CORE.z - z) * dz, offc = Math.abs((CORE.x - x) * dz - (CORE.z - z) * dx);
    if (tc > 0.05 && offc < 0.3 && tc < best) { pts.push({ x: CORE.x, z: CORE.z }); return { points: pts, hitsCore: true }; }
    if (hit < 0) {
      let t = Infinity; if (dx > 0) t = Math.min(t, (ch.x1 - x) / dx); if (dx < 0) t = Math.min(t, (ch.x0 - x) / dx); if (dz > 0) t = Math.min(t, (ch.z1 - z) / dz); if (dz < 0) t = Math.min(t, (ch.z0 - z) / dz);
      pts.push({ x: x + dx * t, z: z + dz * t }); return { points: pts, hitsCore: false };
    }
    const m = MIRRORS[hit]; x = m.x; z = m.z; pts.push({ x, z }); last = hit;
    const a = (mirrors[hit] * Math.PI) / 4, lx = Math.cos(a), lz = Math.sin(a), d = dx * lx + dz * lz;
    if (Math.abs(Math.abs(d) - 1) < 1e-6) continue; // edge-on: by
    const nx = 2 * d * lx - dx, nz = 2 * d * lz - dz, len = Math.hypot(nx, nz); dx = Math.round((nx / len) * 1e6) / 1e6; dz = Math.round((nz / len) * 1e6) / 1e6;
  }
  return { points: pts, hitsCore: false };
}

// ── the quest ──
export type Hit = { kind: 'door' | 'knot' | 'mirror'; i?: number; done: boolean } | null;
/** A blow lands on the door's growth (outside), the knot, or a mirror (inside); what it struck. */
export function blowOutside(q: Quest, cuts = 1): Hit {
  if (q.stage !== 'sealed') return null; q.door = Math.min(DOOR_CUTS, q.door + cuts); if (q.door >= DOOR_CUTS) q.stage = 'open'; return { kind: 'door', done: q.stage === 'open' };
}
export function blowInside(q: Quest, at: { x: number; y: number; z: number }, fx: number, fz: number, cuts = 1): Hit {
  const reach = (x: number, z: number, y: number) => { const dx = x - at.x, dz = z - at.z, d = Math.hypot(dx, dz); return d < BLOW_REACH && Math.abs(y - at.y) < 1.1 && (d < 0.35 || (dx * fx + dz * fz) / d > BLOW_COS); };
  const k = SOLIDS.find(s => s.kind === 'knot')!;
  if (q.stage === 'open' && reach(Math.max(k.x0, Math.min(k.x1, at.x)), k.z1, -W + 0.5)) { q.knot = Math.min(KNOT_CUTS, q.knot + cuts); if (q.knot >= KNOT_CUTS) { q.stage = 'cut'; q.fix = 0; } return { kind: 'knot', done: q.stage === 'cut' }; }
  let best = -1, bd = Infinity; MIRRORS.forEach((m, i) => { if (!reach(m.x, m.z, MIRROR_FOOT[i] + 0.3)) return; const d = Math.hypot(m.x - at.x, m.z - at.z); if (d < bd) { bd = d; best = i; } });
  if (best >= 0 && q.stage !== 'woken') { q.mirrors[best] = (q.mirrors[best] + 1) % 4; const lit = q.stage === 'powered' && traceBeam(q.mirrors).hitsCore; if (lit) q.stage = 'woken'; return { kind: 'mirror', i: best, done: lit }; }
  return null;
}
/** The crew at the box: each FIX_TRY_S a try; the last takes, and the crystal is powered (and, the mirrors set already, the ward wakes). Returns the try just made (1..FIX_TRIES), or 0. */
export function stepFix(q: Quest, dt: number, clock: { t: number }): number {
  if (q.stage === 'cut') { q.stage = 'fixing'; clock.t = 0; }
  if (q.stage !== 'fixing') return 0;
  clock.t += dt; if (clock.t < FIX_TRY_S) return 0; clock.t = 0; q.fix += 1;
  if (q.fix >= FIX_TRIES) q.stage = traceBeam(q.mirrors).hitsCore ? 'woken' : 'powered';
  return q.fix;
}

/** What the snerk and the crew say, by the stage. Placeholder for Noah. */
export const SNERK_LINES: Partial<Record<Stage, string>> & { first: string } = {
  first: 'A snerk sits out of the draught, pack and lantern beside it. "The forest\'s keeper, in by the front door. The crew is below at the junction: her stuff has eaten their line. The light runs from the crystal to the core, and someone has knocked the mirrors about. I trade, when you have anything worth trading. Mostly I know things."',
  woken: 'The snerk listens to the hum. "One ward awake. There are four more round her, and a door in each, and I know where they go. Later."',
};
export const CREW_LINES = {
  first: 'Three greblins round a dead junction box, one hitting it with a wrench. "Line\'s eaten! Her black stuff\'s in the passage, thick as your arm. Cut it and we\'ll have this humming by... well. Soon."',
  cut: '"Ha! Line\'s clear. Right, lads."',
  tries: ['Sparks, and nothing. "That was the warm-up."', 'A bang and a smell of hot limescale. "Nearly."', 'The junction hums. Down the passage the crystal wakes and throws its light. "Told you. Now get the light to the core; the mirrors are your end of it."'],
  waiting: '"Mirrors!" a greblin calls, pointing down the passage. "Give them a knock till the light finds the core."',
  woken: 'The greblins are dancing round the junction box.',
} as const;
export const WAKE_LINE = 'The core takes the light. The ward wakes: a deep hum rises through the stone, and outside, the Colour falls back from it.';
export const DOOR_LINES = { cut: 'The growth in the door shrivels where the blow lands.', open: 'The growth falls away from the door. The way in is open.', thick: 'The growth in this door is too thick to cut. Another ward first.' } as const;
