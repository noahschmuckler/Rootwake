// The parkour practice course (MOBILITY.md, Parkour): one lane of each move, laid out ahead of her (−z), so the
// stick alone can be judged against every height the planner tells apart. Pure: boxes and the traversal
// world they make; parkourStudy.ts draws them. The lanes run side by side, 4 m apart.
import { Vector3 } from 'three';
import type { TraversalWorld } from './mobility';

/** A solid block: its footprint (x0..x1, z0..z1), its top, and its floor (a pit's floor is below 0). */
export interface Block { x0: number; x1: number; z0: number; z1: number; top: number; label?: string; kind: 'stone' | 'rail' | 'pit' | 'ramp' }
const B = (x: number, w: number, zNear: number, zFar: number, top: number, kind: Block['kind'] = 'stone', label?: string): Block => ({ x0: x - w / 2, x1: x + w / 2, z0: zFar, z1: zNear, top, kind, label });
/** The lanes. Tuning: heights straddle PARKOUR's limits, so each lane shows its moves and where they change. */
export const COURSE: Block[] = [
  // Up: a stair of rises, each one move: step 0.25, clamber +0.45, mantle +1.1, climb +1.6; the far end a sheer drop (a hang drop) to the ground.
  B(0, 3, -4, -24, 0.25, 'stone', 'step 0.25'), B(0, 3, -7, -24, 0.7, 'stone', 'clamber 0.45'), B(0, 3, -10, -24, 1.8, 'stone', 'mantle 1.1'), B(0, 3, -13, -24, 3.4, 'stone', 'climb 1.6 · hang drop at its end'),
  // Over: three rails to vault at a run, a low block to clamber onto and hop off, and a pit to leap.
  B(4, 3, -4, -4.3, 0.55, 'rail', 'vault'), B(4, 3, -7, -7.3, 0.4, 'rail'), B(4, 3, -10, -10.4, 0.5, 'rail'),
  B(4, 3, -13, -15, 0.45, 'stone', 'clamber, hop'), B(4, 3, -18, -19.6, -6, 'pit', 'leap the pit'),
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
