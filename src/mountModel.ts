// Her mount (STAGS.md, Noah, 2026-10-22): a stag of soil, grass and branches summoned from healthy soil, that
// carries her at a gallop and fades in the mother's miasma. The pure model: whether the ground under her will
// give one up, its rise, its health draining by the growth's depth and healing on healthy soil, its collapse.
// Nothing here is saved: a reload finds her on foot. The figure is mountFigure.ts, the riding village.ts.
import { NORMAL_MOBILITY } from './mobility';

// Tuning (flagged in STAGS.md, Noah's to change).
/** The sap a summon spends (her thorn burst is 25, her root bind 15): not free, not rare. */
export const SUMMON_SAP = 20;
/** Its gallop (m/s): about two and a half times her walk (NORMAL_MOBILITY.runSpeed, 2.8). */
export const MOUNT_SPEED = Math.round(NORMAL_MOBILITY.runSpeed * 2.5 * 10) / 10;
/** Its walk when it follows her (m/s), and how far she may go before it does, and how near it stops. */
export const FOLLOW_SPEED = 2.2, FOLLOW_M = 12, FOLLOW_STOP_M = 4;
/** How fast it turns to the stick (rad/s), and how it gathers speed (1/s). */
export const TURN_RATE = 3.2, ACCEL = 4;
/** The highest lip it steps up (m): more than her 0.24, no parkour. */
export const RIDE_STEP = 0.45;
/** Its health: full on healthy soil; DRAIN a second at depth 1 (the nursery, depthOf ≈ 1, kills it in HEALTH / DRAIN = 20 s; the mild ring,
 * depth 0.2, in 100 s); HEAL a second on healthy soil (outside the growth). */
export const HEALTH = 100, DRAIN = 5, HEAL = 4;
/** The rise out of the ground (s), the collapse into a mound (s), and the mound's fade after it (s). */
export const RISE_S = 1.5, COLLAPSE_S = 0.8, FADE_S = 1.6;
/** How far ahead of her it rises (m), how near she must stand to mount it (m), and the mounting beat (s). */
export const RISE_AHEAD = 2, MOUNT_REACH = 2.6, MOUNT_S = 1.1;
/** The stag's body: its shoulder height (a red stag's), its footprint radius for the land's refusals, and where she sits (m above its feet, forward of its centre). */
export const SHOULDER = 1.3, STAG_R = 0.55, SADDLE = { y: 1.32, z: 0.05 };

/** What the ground under her is, by the land's own reading: grass (the meadow) and wood give a stag; the rest refuse. */
export type Soil = 'grass' | 'wood' | 'dark' | 'rock' | 'yard' | 'water';
export interface SummonCtx { /** Inside her growth (contagionModel.inGrowth). */ growth: boolean; /** Within a spoiled place's radius. */ spoiled: boolean; soil: Soil; sap: number; /** A stag already up. */ up: boolean }
/** Why she cannot summon here, or null when she can. */
export function refuseSummon(c: SummonCtx): string | null {
  if (c.up) return 'her stag is up already';
  if (c.growth) return 'the soil here is hers: it gives nothing up';
  if (c.spoiled) return 'the ground here is spoiled';
  if (c.soil === 'water') return 'not from water';
  if (c.soil === 'rock') return 'not from bare rock';
  if (c.soil === 'yard') return "not from a yard's floor";
  if (c.soil === 'dark') return 'the soil here is hers: it gives nothing up';
  if (c.sap < SUMMON_SAP) return `it takes ${SUMMON_SAP} sap`;
  return null;
}
export const canSummon = (c: SummonCtx): boolean => refuseSummon(c) === null;

export type MountPhase = 'rising' | 'up' | 'collapsing' | 'gone';
export interface Mount { phase: MountPhase; /** Seconds into the phase. */ t: number; health: number; x: number; z: number; heading: number; speed: number; /** Seconds it has stood still (grazing starts after a while). */ still: number }
/** A stag rising at (x, z) facing `heading`. */
export const summon = (x: number, z: number, heading: number): Mount => ({ phase: 'rising', t: 0, health: HEALTH, x, z, heading, speed: 0, still: 0 });
export type MountEvent = 'up' | 'collapsed' | 'gone';
/** A step: the phases run their seconds; up, its health drains by the growth's depth (0..1) where it stands and heals on healthy soil; at nothing it collapses. */
export function stepMount(m: Mount, dt: number, depth: number, healthy: boolean): MountEvent | null {
  m.t += dt;
  if (m.phase === 'rising') { if (m.t >= RISE_S) { m.phase = 'up'; m.t = 0; return 'up'; } return null; }
  if (m.phase === 'collapsing') { if (m.t >= COLLAPSE_S + FADE_S) { m.phase = 'gone'; m.t = 0; return 'gone'; } return null; }
  if (m.phase !== 'up') return null;
  if (depth > 0) m.health -= DRAIN * depth * dt; else if (healthy) m.health = Math.min(HEALTH, m.health + HEAL * dt);
  m.still = m.speed > 0.05 ? 0 : m.still + dt;
  if (m.health <= 0) { m.health = 0; m.phase = 'collapsing'; m.t = 0; m.speed = 0; return 'collapsed'; }
  return null;
}
/** Seconds a stag standing at a depth lasts from full health (the nursery about 20 s, the mild ring a minute or two). */
export const lastsFor = (depth: number): number => (depth <= 0 ? Infinity : HEALTH / (DRAIN * depth));
/** The stick's drive: the heading turns toward the wanted direction at TURN_RATE, the speed eases toward `amount` of MOUNT_SPEED (ACCEL); returns the step (m) along the new heading. */
export function drive(m: Mount, dt: number, want: { x: number; z: number } | null, amount: number, speed = MOUNT_SPEED): number {
  if (want && amount > 0) { const to = Math.atan2(-want.x, -want.z), d = Math.atan2(Math.sin(to - m.heading), Math.cos(to - m.heading)); m.heading += Math.sign(d) * Math.min(Math.abs(d), TURN_RATE * dt); }
  const target = want && amount > 0 ? speed * Math.min(1, amount) : 0;
  m.speed += (target - m.speed) * (1 - Math.exp(-dt * ACCEL)); if (m.speed < 0.02) m.speed = 0;
  return m.speed * dt;
}
/** Where a heading points (the game's forward is −z at heading 0, as her figure's). */
export const forwardOf = (heading: number): { x: number; z: number } => ({ x: -Math.sin(heading), z: -Math.cos(heading) });
/** The saddle: where she sits in the world for a stag at (x, y, z) facing `heading`. */
export function saddleAt(x: number, y: number, z: number, heading: number): { x: number; y: number; z: number } { const f = forwardOf(heading); return { x: x + f.x * SADDLE.z, y: y + SADDLE.y, z: z + f.z * SADDLE.z }; }
