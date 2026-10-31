// O2 (OPENING_SEQUENCE.md §5, ECOLOGY.md): the spirit deer, the earth stretching its legs: soil, grass and branches that rise from
// healthy ground like her stag, wander at random with pauses to graze on nothing, and sink back. It eats nothing, nothing hunts it,
// and she can only watch through it. Pure: no Three.js. The figure is the stag's (mountFigure.ts), whose phases these share.
export const RISE_S = 1.5, SINK_S = 1.2, WALK = 1.1, TURN_RATE = 0.7;
/** How long a deer walks the world before it sinks (s); a wander leg's length (s); grazing: a chance a leg, and its length (s). Tuning. */
export const LIFE_S = 90, LEG_S: [number, number] = [2.5, 6], GRAZE_CHANCE = 0.35, GRAZE_S: [number, number] = [2, 5];
export type DeerPhase = 'rising' | 'up' | 'sinking' | 'gone';
export interface Deer { phase: DeerPhase; /** Seconds into the phase. */ t: number; /** Seconds up. */ life: number; x: number; z: number; heading: number; speed: number; /** Seconds standing (the figure grazes after a while). */ still: number; /** The leg: its turn (rad/s) and the seconds left in it. */ turn: number; leg: number; /** Seconds of grazing left. */ graze: number }
export const riseDeer = (x: number, z: number, heading: number): Deer => ({ phase: 'rising', t: 0, life: 0, x, z, heading, speed: 0, still: 0, turn: 0, leg: 0, graze: 0 });
const between = (r: () => number, [a, b]: [number, number]): number => a + r() * (b - a);
/**
 * A frame of the deer's life. `rand` in [0, 1); `canStand` says whether a spot is ground it may walk (it turns away from water, rock
 * and the edge). Returns 'up' as it finishes rising, 'sunk' as it is gone.
 */
export function stepDeer(d: Deer, dt: number, rand: () => number, canStand: (x: number, z: number) => boolean): 'up' | 'sunk' | null {
  d.t += dt;
  if (d.phase === 'rising') { if (d.t >= RISE_S) { d.phase = 'up'; d.t = 0; d.leg = 0; return 'up'; } return null; }
  if (d.phase === 'sinking') { d.speed = 0; if (d.t >= SINK_S) { d.phase = 'gone'; d.t = 0; return 'sunk'; } return null; }
  if (d.phase !== 'up') return null;
  d.life += dt; if (d.life >= LIFE_S) { d.phase = 'sinking'; d.t = 0; d.speed = 0; return null; }
  if (d.graze > 0) { d.graze -= dt; d.speed = 0; d.still += dt; return null; }
  d.leg -= dt;
  if (d.leg <= 0) { d.leg = between(rand, LEG_S); d.turn = (rand() * 2 - 1) * TURN_RATE; if (rand() < GRAZE_CHANCE) { d.graze = between(rand, GRAZE_S); d.speed = 0; return null; } }
  d.heading += d.turn * dt; d.speed = WALK; d.still = 0;
  const nx = d.x - Math.sin(d.heading) * WALK * dt, nz = d.z - Math.cos(d.heading) * WALK * dt;
  // Ahead a step: ground it may walk, or it turns away and tries again next frame.
  if (canStand(nx - Math.sin(d.heading) * 0.6, nz - Math.cos(d.heading) * 0.6) && canStand(nx, nz)) { d.x = nx; d.z = nz; } else { d.heading += Math.PI * 0.55 + rand() * 0.5; d.leg = between(rand, LEG_S); d.turn = 0; d.speed = 0; }
  return null;
}
/** The figure's state (mountFigure.StagState) for a deer. */
export const deerFigureState = (d: Deer): { phase: 'rising' | 'up' | 'sinking' | 'gone'; t: number; speed: number; still: number; health: number } => ({ phase: d.phase, t: d.t, speed: d.speed, still: d.still, health: 100 });
