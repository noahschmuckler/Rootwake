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
  // ---- Pass 0.9: shaping logs with the hand axe (SYSTEMS.md §5.4). ----
  // HP and drain: a log is more work than a rock; timber is the most. Tuning.
  {
    id: 'notch-both',
    label: 'Notch both ends',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'log_notched',
    chips: 6,
    hp: 14,
    stages: ['log_scored'],
    drain: 0.014,
  },
  {
    id: 'notch-end',
    label: 'Notch one end',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'log_notched_end',
    chips: 4,
    hp: 10,
    stages: ['log_scored'],
    drain: 0.014,
  },
  {
    id: 'offset-cut',
    label: 'Cut an offset end',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'log_offset',
    chips: 5,
    hp: 12,
    stages: ['log_scored'],
    drain: 0.014,
  },
  {
    id: 'timber',
    label: 'Cut into timber',
    target: 'log',
    requiresHeld: 'hand_axe',
    result: 'timber',
    resultCount: 2,
    chips: 8,
    hp: 18,
    stages: ['log_scored', 'log_split'],
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
