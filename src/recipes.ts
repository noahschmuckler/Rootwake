// Pass 0.8: recipes (SYSTEMS.md §5). Long-press a material in the world and
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
