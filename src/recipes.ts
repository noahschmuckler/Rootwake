// Pass 0.8/0.9: recipes (SYSTEMS.md §5). Long-press a material in the world and
// the recipes *for that thing* appear, filtered by what is in your hands.
// A recipe is a board session on the target: matches strike it with what you
// hold, its look steps down through authored stages, and at zero it becomes
// the result. Rows in a table, not code paths.

import type { ObjectTypeId } from './objects';

export interface Recipe {
  id: string;
  label: string;
  /** The world object you long-press. */
  target: ObjectTypeId;
  /** Must be lifted in a hand to be available (shown greyed with a reason otherwise). */
  requiresHeld?: ObjectTypeId;
  /** What the target becomes. */
  result: ObjectTypeId;
  /** How many of the result (a log cut into timber gives two). Default 1. */
  resultCount?: number;
  /** Wood chips (or other leavings) scattered around the target as the work proceeds. Default 0. */
  chips?: number;
  /** Gems the target absorbs before it is done. */
  hp: number;
  /** Authored intermediate looks between target and result (see objects.ts looks). */
  stages: string[];
  /** Vitality per landed strike (SYSTEMS §1.1: crafting is effort). */
  drain: number;
}

export const RECIPES: Recipe[] = [
  {
    id: 'hand-axe',
    label: 'Knap a hand axe',
    target: 'rock',
    requiresHeld: 'rock',
    result: 'hand_axe',
    hp: 12,
    stages: ['rock_chipped', 'rock_wedge'],
    drain: 0.012,
  },
  // ---- Pass 0.9/1.0b: shaping logs with the hand axe (SYSTEMS.md §5.4, Lincoln Logs). ----
  // HP and drain: a long log is more work than a short one; timber is the most. Tuning.
  {
    id: 'notch-long',
    label: 'Notch it (three notches)',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'log_long_notched',
    chips: 8,
    hp: 16,
    stages: ['log_scored'],
    drain: 0.014,
  },
  {
    id: 'halve',
    label: 'Cut in half',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'log_short',
    resultCount: 2,
    chips: 6,
    hp: 12,
    stages: ['log_halved'],
    drain: 0.014,
  },
  {
    id: 'timber-long',
    label: 'Cut into long timber',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'timber',
    resultCount: 4,
    chips: 10,
    hp: 22,
    stages: ['log_scored', 'log_split'],
    drain: 0.014,
  },
  {
    id: 'notch-short',
    label: 'Notch it (two notches)',
    target: 'log_short',
    requiresHeld: 'hand_axe',
    result: 'log_notched',
    chips: 5,
    hp: 10,
    stages: ['log_scored_short'],
    drain: 0.014,
  },
  {
    id: 'timber-short',
    label: 'Cut into short timber',
    target: 'log_short',
    requiresHeld: 'hand_axe',
    result: 'timber_short',
    resultCount: 2,
    chips: 6,
    hp: 14,
    stages: ['log_scored_short', 'log_split_short'],
    drain: 0.014,
  },
  {
    id: 'stubs',
    label: 'Cut into knuckles',
    target: 'log_notched',
    requiresHeld: 'hand_axe',
    result: 'log_stub',
    resultCount: 2,
    chips: 3,
    hp: 8,
    stages: ['log_stubbed'],
    drain: 0.014,
  },
];

/** Recipes for a long-pressed target, with whether the hands allow them right now. */
export function recipesFor(target: ObjectTypeId, heldTypes: ObjectTypeId[]): { recipe: Recipe; available: boolean; reason?: string }[] {
  return RECIPES.filter((r) => r.target === target).map((recipe) => {
    if (recipe.requiresHeld && !heldTypes.includes(recipe.requiresHeld)) {
      return { recipe, available: false, reason: `needs a ${recipe.requiresHeld.replace('_', ' ')} in hand` };
    }
    return { recipe, available: true };
  });
}
