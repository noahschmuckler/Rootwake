// The opening (OPENING_SEQUENCE.md, OPENING_HANDOFF.md, slice O1): what the first minutes keep between loads, and the order the
// UI arrives in. Pure: no Three.js, no DOM. Saved under its own key; a missing key is a new player (Noah, 2026-10-30: the opening
// study starts a phone fresh whatever older village saves it holds, since every study on GitHub Pages shares one origin).
import { CLARITY_CAP } from './deepModel';

export const OPENING_KEY = 'rootwake-opening-v1';

/** What has been shown so far, in the order it is shown: the dark opening played (`opened`), she woke on the summit (`woke`),
 * she dragged the view as Petal asked (`looked`), the compass, the stick and the dive option were given. */
export interface Opening { opened: boolean; woke: boolean; looked: boolean; compass: boolean; stick: boolean; dive: boolean }
export const STEPS = ['opened', 'woke', 'looked', 'compass', 'stick', 'dive'] as const;
export type Step = (typeof STEPS)[number];

export const freshOpening = (): Opening => ({ opened: false, woke: false, looked: false, compass: false, stick: false, dive: false });
/** An old save, or the dev override (`?opening=0`): everything already shown. */
export const allShown = (): Opening => ({ opened: true, woke: true, looked: true, compass: true, stick: true, dive: true });
/** The next thing to show, or null when the staged UI is complete. Steps come in order: a later flag without the earlier ones is read as the earlier ones too. */
export function nextStep(o: Opening): Step | null { for (const s of STEPS) if (!o[s]) return s; return null; }
/** Show the next step. Returns it, or null when nothing was left. */
export function advance(o: Opening): Step | null { const s = nextStep(o); if (s) o[s] = true; return s; }
export const complete = (o: Opening): boolean => nextStep(o) === null;

/** Her mind's chaos as the water shows it: a function of her current clarity alone (Noah): 1 at none, 0 at the cap. */
export const chaosOf = (clarity: number, cap = CLARITY_CAP): number => 1 - Math.min(1, Math.max(0, clarity / cap));

export const serializeOpening = (o: Opening): string => JSON.stringify(STEPS.reduce((acc, s) => ({ ...acc, [s]: o[s] === true }), {}));
/** A missing save is a new player; junk likewise. Saved flags are read in order: the first false stops the rest (a hole is closed). */
export function parseOpening(raw: string | null): Opening {
  const o = freshOpening();
  try { const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return o; for (const s of STEPS) { if ((p as Record<string, unknown>)[s] !== true) break; o[s] = true; } return o; } catch { return o; }
}

/** Petal's lines (ADVERSARIES.md: the infant Delvira, pleased she is awake; short sentences; Hulda never answers). Each step's lines are
 * said one at a time, a tap for the next; the last line of a step is what she waits on. */
export const PETAL_LINES: Record<Exclude<Step, 'opened'>, string[]> = {
  woke: ['You opened your eyes!', 'I was waiting.', 'Look around. Drag your finger across the world.'],
  looked: ['Isn\'t it beautiful?', 'All of it is yours to see.'],
  compass: ['That is the compass. It keeps north for you.'],
  stick: ['The stick walks you. Try the water\'s edge.'],
  dive: ['The pool goes down.', 'Dive, and I will meet you below.'],
};

/** The dark opening's timing (seconds): the solids drift, ever faster, then land in the grid. Tuning. */
export const DRIFT_S = 7, LAND_S = 1.6;
/** The ending's timing (seconds): the board fades, the drop falls, the ripples spread and the world shows from the middle outward. Tuning. */
export const ENDING = { boardFade: 0.45, drop: 0.6, ripple: 3.2, revealDelay: 0.35, reveal: 2.2 } as const;
export const endingSeconds = (): number => ENDING.boardFade + ENDING.drop + Math.max(ENDING.ripple, ENDING.revealDelay + ENDING.reveal);
/** The ending's state at `t` seconds in: the board's opacity, the drop's fall (0..1, 1 = landed), the ripples' age (s) and the reveal's radius (a fraction of the screen's half-diagonal, 0 = nothing shown). */
export function endingAt(t: number): { board: number; drop: number; rippleAge: number; reveal: number } {
  // Snapped to the phase bounds: the view reads these as opacities and radii, and a phase's end must be exact (1e-16 left of a fade is still a visible board to a test).
  const snap = (x: number): number => (Math.abs(x) < 1e-9 ? 0 : x);
  const board = t >= ENDING.boardFade ? 0 : Math.max(0, 1 - t / ENDING.boardFade), t1 = snap(t - ENDING.boardFade), drop = Math.min(1, Math.max(0, t1 / ENDING.drop)), t2 = snap(t1 - ENDING.drop);
  const rippleAge = Math.max(0, t2), r = snap(t2 - ENDING.revealDelay) / ENDING.reveal, reveal = r <= 0 ? 0 : r >= 1 ? 1 : r * r * (3 - 2 * r);
  return { board, drop, rippleAge, reveal };
}
