// The taint (MOTHER.md, M1): the land round a mother of goats, graded from mild at its edge to pure
// insanity at its heart, and her attention on Hulda. Pure: no Three.js; every function takes the
// breach's centre so the model and the look can share it without importing each other.
//
// The rings, out from the heart: the heart itself (she reaches into the clouds); the nursery, where the
// trees are gone and black vascular, alveolar growths stand hung with the birth sacs; the grey, where
// natural trees stand dead, brittle and twitching and the soil is poisoned; the mild ring, where the
// grey thins out among living wood. Past the edge, her infection runs out along the root lines as grey
// veins for VEIN_REACH m. Inside the edge, neither the grass nor the roots will carry Hulda.
//
// Attention: what replaces the old drain (Noah, 2026-10-19: no vigor lost for standing in her). It
// rises with depth and with violence inside her, toward a ceiling the depth sets, and falls away once
// Hulda leaves. In M1 it drives the Colour (the breath); in M2 it drives what the forest does.

/** The rings' outer radii from the breach (m), and how far the veins run out past the edge. Tuning (set against the first village 400 m off, the dens and ruins kept 195 m and more from the breach). */
export const TAINT = { heart: 40, nursery: 85, grey: 135, edge: 190, veins: 70 } as const;
export type Ring = 'heart' | 'nursery' | 'grey' | 'mild' | null;
export interface At { x: number; z: number }

/** Which ring a point at distance d from the breach lies in. */
export function ringAt(d: number): Ring { return d < TAINT.heart ? 'heart' : d < TAINT.nursery ? 'nursery' : d < TAINT.grey ? 'grey' : d < TAINT.edge ? 'mild' : null; }
/** How deep in the taint a point is: 0 at the edge and beyond, 1 at the heart's rim and inside it. */
export function depthAt(d: number): number { return d >= TAINT.edge ? 0 : d <= TAINT.heart ? 1 : 1 - (d - TAINT.heart) / (TAINT.edge - TAINT.heart); }
export const distTo = (at: At | null, x: number, z: number): number => (at ? Math.hypot(x - at.x, z - at.z) : Infinity);
/** Inside the edge: no grass, no roots. */
export const inTaint = (at: At | null, x: number, z: number): boolean => distTo(at, x, z) < TAINT.edge;
/** The veins' strength at distance d: full inside the edge, fading to nothing VEIN_REACH past it. */
export function veinAt(d: number): number { return d <= TAINT.edge ? 1 : Math.max(0, 1 - (d - TAINT.edge) / TAINT.veins); }

/** Attention. Tuning: the rise a second at full depth; the fall a second outside; a blow of hers inside the taint; a blow on the mother herself; the ceiling the depth allows (FLOOR at the edge, FLOOR + SPAN at the heart). */
export const ATTENTION = { rise: 0.05, fall: 0.08, blow: 0.08, heart: 0.3, floor: 0.2, span: 0.65 } as const;
/** Step attention: up toward the depth's ceiling while she is in the taint (faster deeper), easing down to it if a fight carried it over, and away once she is out. */
export function stepAttention(a: number, depth: number, dt: number): number {
  if (depth <= 0) return Math.max(0, a - ATTENTION.fall * dt);
  const ceiling = ATTENTION.floor + ATTENTION.span * depth;
  return a < ceiling ? Math.min(ceiling, a + ATTENTION.rise * (0.4 + depth) * dt) : Math.max(ceiling, a - ATTENTION.fall * 0.4 * dt);
}
/** A blow of hers raises it (a blow on the mother more); never past 1. */
export const provoke = (a: number, heart = false): number => Math.min(1, a + (heart ? ATTENTION.heart : ATTENTION.blow));

/** The breath. Tuning: its period (s) settled and fully roused. */
export const BREATH_S = { settled: 7, roused: 3 } as const;
/** Advance the breath's phase (0..1, wrapping) by dt at the attention's pace. */
export const stepBreath = (phase: number, attention: number, dt: number): number => (phase + dt / (BREATH_S.settled + (BREATH_S.roused - BREATH_S.settled) * attention)) % 1;
/** How far into the out-breath she is: 0 through the in-breath (the tolerable magenta), rising to 1 as she breathes out (the colour fractured), and back. */
export function exhaleAt(phase: number): number { const s = Math.sin(phase * Math.PI * 2); return s < 0 ? 0 : Math.pow(s, 0.7); }
/** How strongly the Colour shows: a little at the edge, more with depth, most with attention. */
export const colourAt = (depth: number, attention: number): number => Math.min(1, depth * 0.35 + attention * 0.85);
