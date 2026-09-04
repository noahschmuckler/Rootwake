// Pass 0.3a: which target does a run feed? Kept as a swappable strategy
// (DESIGN.md): the plant voxel maps gem colour → flower 1:1 today; combat
// later will need column buckets because an enemy arc won't reliably have
// exactly five members. Nothing else in the code should know which is in use.

import type { Run } from './match3';

export interface TargetContext {
  /** How many targets exist (flowers now, enemies later). */
  targetCount: number;
  /** Board width, for column-bucket strategies. */
  boardCols: number;
  /** Colour (gem type) identity of target i, for colour strategies. */
  colorOfTarget: (index: number) => number;
}

export interface TargetingStrategy {
  readonly name: string;
  /** Target index a run feeds, or null if it feeds nothing. */
  target(run: Run, ctx: TargetContext): number | null;
}

/** Gem colour = target identity. The plant voxel: 5 gem types, 5 flowers. */
export const byColor: TargetingStrategy = {
  name: 'byColor',
  target(run, ctx) {
    for (let i = 0; i < ctx.targetCount; i++) {
      if (ctx.colorOfTarget(i) === run.type) return i;
    }
    return null;
  },
};

/**
 * Column buckets: the run's mean column, split evenly across the targets.
 * Sketched for combat (an enemy arc of N members); not used by the plant
 * voxel and not yet exercised in play.
 */
export const byColumn: TargetingStrategy = {
  name: 'byColumn',
  target(run, ctx) {
    if (ctx.targetCount === 0) return null;
    const meanCol = run.cells.reduce((s, c) => s + c.col, 0) / run.cells.length;
    return Math.min(ctx.targetCount - 1, Math.floor((meanCol / ctx.boardCols) * ctx.targetCount));
  },
};

/**
 * One shared pool: every run feeds target 0 regardless of colour or column.
 * Ground patches (Pass 0.4b) — the opposite of the flowers' five per-colour
 * pools.
 */
export const single: TargetingStrategy = {
  name: 'single',
  target(_run, ctx) {
    return ctx.targetCount > 0 ? 0 : null;
  },
};
