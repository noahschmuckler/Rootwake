// The parkour practice course (MOBILITY.md, Parkour): one lane of each move, laid out ahead of her (−z), so the
// stick alone can be judged against every height the planner tells apart. Pure: boxes and the traversal
// world they make; parkourStudy.ts draws them. The lanes run side by side, 4 m apart.
import { Vector3 } from 'three';
import type { TraversalWorld } from './mobility';
import { CANON } from './parkour';

/** A solid block: its footprint (x0..x1, z0..z1), its top, and its floor (a pit's floor is below 0). */
export interface Block { x0: number; x1: number; z0: number; z1: number; top: number; label?: string; kind: 'stone' | 'rail' | 'pit' | 'ramp' }
const B = (x: number, w: number, zNear: number, zFar: number, top: number, kind: Block['kind'] = 'stone', label?: string): Block => ({ x0: x - w / 2, x1: x + w / 2, z0: zFar, z1: zNear, top, kind, label });
const f = (m: number) => m.toFixed(2);
/** The lanes, built only of CANON's obstacles (parkour.ts), so every move plays its clip at its own size. */
export const COURSE: Block[] = [
  // Up: a step, a clamber onto a mount's top, a wall climbed by the braced hang; at the far end a ledge, lowered from by
  // the braced hang onto a low platform (a walk down from it).
  B(0, 3, -4, -16, CANON.step, 'stone', `step ${f(CANON.step)}`), B(0, 3, -7, -16, CANON.step + CANON.clamber, 'stone', `clamber ${f(CANON.clamber)}`),
  B(0, 3, -10, -16, CANON.step + CANON.clamber + CANON.wall, 'stone', `wall ${f(CANON.wall)} · ledge ${f(CANON.ledge)} at its end`),
  B(0, 3, -16, -24, CANON.step + CANON.clamber + CANON.wall - CANON.ledge),
  // Over: two rails to vault at a run, a mount's block to clamber onto and hop off, a wall to climb and drop from, a gap to leap.
  B(4, 3, -4, -4 - CANON.vaultDepth, CANON.vault, 'rail', `vault ${f(CANON.vault)}`), B(4, 3, -7, -7 - CANON.vaultDepth, CANON.vault, 'rail'),
  B(4, 3, -10, -12, CANON.clamber, 'stone', 'clamber, hop'), B(4, 3, -14.5, -17, CANON.wall, 'stone', 'climb, hang, drop'),
  B(4, 3, -20, -20 - CANON.gap, -6, 'pit', `leap ${f(CANON.gap)}`),
  // Too high and too far: a wall past her climb and a pit past her leap stop her.
  B(8, 3, -6, -8, 2.3, 'stone', 'too high'), B(8, 3, -12, -15.5, -6, 'pit', 'too far'),
];
/** The old bridge's foot: a deck steeper at its start than the walk's step (the reason for all this). */
/** The old bridge's foot, as plateauModel shapes its deck (BRIDGE_CROWN over its 125 m `span`), the first `length` m of it. */
export const RAMP = { x: 12, z0: -4, length: 25, span: 125, crown: 4.2, halfW: 1.5 };
const rampAt = (x: number, z: number): number | null => { const d = RAMP.z0 - z, t = d / RAMP.span; if (d < 0 || d > RAMP.length || Math.abs(x - RAMP.x) > RAMP.halfW) return null; return 0.05 + RAMP.crown * Math.sin(Math.PI * t) ** 0.6; };
/** The course's ground: 30 × 40 m of floor, x −6..18, z 6..−30. */
export const BOUNDS = { x0: -6, x1: 18, z0: -30, z1: 6 };
const inside = (b: Block, x: number, z: number, m = 0): boolean => x > b.x0 - m && x < b.x1 + m && z > b.z0 - m && z < b.z1 + m;
/** The height of the ground at x, z (the highest block there, a pit's floor, the ramp, or the floor). */
export function groundAt(x: number, z: number): number | null {
  if (x < BOUNDS.x0 || x > BOUNDS.x1 || z < BOUNDS.z0 || z > BOUNDS.z1) return null;
  let y = 0, pit = false;
  for (const b of COURSE) if (inside(b, x, z)) { if (b.kind === 'pit') { pit = true; y = Math.min(y, b.top); } else if (!pit) y = Math.max(y, b.top); }
  const r = rampAt(x, z); if (r !== null && r > y) y = r;
  return y;
}
/** Every walkable top at x, z: the ground there. */
export const courseWorld: TraversalWorld = {
  surfacesAt: (x, z) => { const y = groundAt(x, z); return y === null ? [] : [y]; },
  // Her body may not sink into a block nor stand in one's side: a block's walls are as sheer as they are drawn.
  canOccupy: (p: Vector3, radius: number) => {
    const g = groundAt(p.x, p.z); if (g === null || p.y < g - 0.03) return false;
    for (const b of COURSE) if (b.kind !== 'pit' && p.y < b.top - 0.001 && inside(b, p.x, p.z, radius)) return false;
    // A pit's walls likewise, below the floor.
    for (const b of COURSE) if (b.kind === 'pit' && p.y < -0.001 && !inside(b, p.x, p.z, -radius)) return false;
    return p.x > BOUNDS.x0 + radius && p.x < BOUNDS.x1 - radius && p.z > BOUNDS.z0 + radius && p.z < BOUNDS.z1 - radius;
  },
};
/** Where she starts: before the lanes, facing them. */
export const START = { x: 4, z: 3, yaw: 0 };
