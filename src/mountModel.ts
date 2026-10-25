// Her mount (STAGS.md, Noah, 2026-10-22): a stag of soil, grass and branches summoned from healthy soil, that
// carries her at a gallop and fades in the mother's miasma. The pure model: whether the ground under her will
// give one up, its rise, its health draining by the growth's depth and healing on healthy soil, its collapse;
// pass 2 (Noah): called to her from anywhere (it runs when she is near and the ground between is its to cross,
// else it sinks into the soil and travels as a root ride does, surfacing beside her), dismissed from anywhere
// (it sinks where it stands), its gallop at root travel's pace, its drain tuned so that called in from the
// edge to the nursery's rim and ridden straight out it collapses just short of the edge (tests/mount.test.ts);
// pass 4 (Noah): it wades every river, slowed by the depth, and the lake still refuses it (STAG_WADE_DEPTH, wadeFactor).
// Nothing here is saved: a reload finds her on foot. The figure is mountFigure.ts, the riding village.ts.
import { NORMAL_MOBILITY } from './mobility';
import { SNATCH_PACE } from './villageModel';

// Tuning (flagged in STAGS.md, Noah's to change).
/** The sap a summon spends (her thorn burst is 25, her root bind 15): not free, not rare. */
export const SUMMON_SAP = 20;
/** Its gallop (m/s): root travel's pace (Noah, pass 2: as fast as root travel; SNATCH_PACE and village.ts's CARRY_SPEED are both 9), about three times her walk. */
export const MOUNT_SPEED = SNATCH_PACE;
/** Her walk, for the record (and the CI's comparison). */
export const WALK_SPEED = NORMAL_MOBILITY.runSpeed;
/** Its walk when it follows her (m/s), and how far she may go before it does, and how near it stops. */
export const FOLLOW_SPEED = 2.2, FOLLOW_M = 12, FOLLOW_STOP_M = 4;
/** A call (pass 2): within CALL_RUN_M with ground it can cross it runs to her and stops CALL_STOP_M off; farther, or with water between, it sinks into the
 * soil (SINK_S), travels at CALL_SPEED (root travel's pace) and surfaces beside her (SURFACE_S). A run that stalls for CALL_STALL_S sinks and travels instead. */
export const CALL_RUN_M = 60, CALL_STOP_M = 2, CALL_SPEED = SNATCH_PACE, SINK_S = 0.8, SURFACE_S = 0.9, CALL_STALL_S = 1;
/** How fast it turns to the stick (rad/s), and how it gathers speed (1/s). */
export const TURN_RATE = 3.2, ACCEL = 4;
/** The highest lip it steps up (m): more than her 0.24, no parkour. */
export const RIDE_STEP = 0.45;
/** Its health: full on healthy soil; DRAIN a second at depth 1, HEAL a second on healthy soil (outside the growth). DRAIN is set by the ride-out test
 * (tests/mount.test.ts): called in from the breach's edge (TAINT.edge) to the nursery's rim (TAINT.nursery) at CALL_SPEED, surfaced, mounted and ridden
 * straight out at MOUNT_SPEED, it collapses between 80% and 100% of the way out (the nursery alone, depth 1, kills a standing stag in HEALTH / DRAIN s). */
export const HEALTH = 100, DRAIN = 2.49, HEAL = 4;
/** The rise out of the ground (s), the collapse into a mound (s), and the mound's fade after it (s). */
export const RISE_S = 1.5, COLLAPSE_S = 0.8, FADE_S = 1.6;
/** How far ahead of her it rises (m), how near she must stand to mount it (m), and the mounting beat (s). */
export const RISE_AHEAD = 2, MOUNT_REACH = 2.6, MOUNT_S = 1.1;
/** The stag's body: its shoulder height (a red stag's), its footprint radius for the land's refusals, and where she sits (m above its feet, forward of its centre). */
export const SHOULDER = 1.3, STAG_R = 0.55, SADDLE = { y: 1.32, z: 0.05 };
/** Pass 4 (Noah, 2026-10-25: "I want the stag to be able to cross rivers"): it wades any water up to STAG_WADE_DEPTH m deep (set over the deepest river bed,
 * plateauModel's RIVER_DEPTH 1.6 plus the channel's 0.15, so no river refuses it; the lake, LAKE_DEPTH 9, still does: it does not swim), its body down on
 * the bed, slowed by the depth: its speed is MOUNT_SPEED × wadeFactor(depth), 1 on dry ground falling to STAG_WADE_SLOW at STAG_WADE_DEPTH. Tuning. */
export const STAG_WADE_DEPTH = 2.2, STAG_WADE_SLOW = 0.45;
/** How deep its body goes (m of water over its feet): to its belly. In deeper water its feet still follow the bed (the slow reads the bed's depth) but the
 * body rides lifted to this depth, as if wading hard with the legs reaching down, so it is seen in to the belly and her seat (SADDLE.y over its feet)
 * stays over the water; a river's middle (RIVER_DEPTH 1.6 and the channel's 0.15) is deeper than the saddle is high. A decision beyond the brief, flagged. */
export const STAG_BELLY = 1.0;
/** The lift of its body over its feet in water `depth` m deep (pass 4): nothing to the belly, the rest beyond it. */
export const bodyLift = (depth: number): number => Math.max(0, depth - STAG_BELLY);
/** Whether water `depth` m deep is the stag's to wade (pass 4). */
export const canWade = (depth: number): boolean => depth <= STAG_WADE_DEPTH;
/** The share of its pace left to it in water `depth` m deep (pass 4): 1 dry, falling linearly to STAG_WADE_SLOW at STAG_WADE_DEPTH (and held there deeper, though it refuses to go on). */
export const wadeFactor = (depth: number): number => 1 - (1 - STAG_WADE_SLOW) * Math.min(1, Math.max(0, depth) / STAG_WADE_DEPTH);

/** What the ground under (x, z) is, by the land's own reading: grass (the meadow) and wood give a stag; the rest refuse. */
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

/** Rising out of the ground; up; sinking into it (a call from afar, or dismissed); travelling through the soil; surfacing beside her; collapsing; gone. */
export type MountPhase = 'rising' | 'up' | 'sinking' | 'travelling' | 'surfacing' | 'collapsing' | 'gone';
export interface Travel { from: { x: number; z: number }; /** Seconds the travel takes (the distance at CALL_SPEED when it set out). */ seconds: number }
export interface Mount { phase: MountPhase; /** Seconds into the phase. */ t: number; health: number; x: number; z: number; heading: number; speed: number; /** Seconds it has stood still (grazing starts after a while). */ still: number;
  /** Called: it runs to her until CALL_STOP_M off. */ called: boolean; /** Sinking to be gone (dismissed), not to travel. */ dismissed: boolean; /** The soil travel under way (sinking → travelling → surfacing). */ travel: Travel | null; /** Seconds a called run has made no way. */ stalled: number }
/** A stag rising at (x, z) facing `heading`. */
export const summon = (x: number, z: number, heading: number): Mount => ({ phase: 'rising', t: 0, health: HEALTH, x, z, heading, speed: 0, still: 0, called: false, dismissed: false, travel: null, stalled: 0 });
export type MountEvent = 'up' | 'collapsed' | 'gone' | 'travelling' | 'surfacing';
/** Whether its health is live: standing, sinking, travelling or surfacing it drains in the growth (`depth` > 0) and heals on healthy soil; the rise, the collapse and the fade do not count. */
export const drains = (p: MountPhase): boolean => p === 'up' || p === 'sinking' || p === 'travelling' || p === 'surfacing';
/** A step: the phases run their seconds; its health drains by the growth's depth (0..1) where it is and heals on healthy soil; at nothing it collapses (travelling, it collapses where it surfaces: the drain goes on, the collapse waits for the surface). */
export function stepMount(m: Mount, dt: number, depth: number, healthy: boolean): MountEvent | null {
  m.t += dt;
  if (drains(m.phase)) { if (depth > 0) m.health -= DRAIN * depth * dt; else if (healthy) m.health = Math.min(HEALTH, m.health + HEAL * dt); }
  if (m.phase === 'rising') { if (m.t >= RISE_S) { m.phase = 'up'; m.t = 0; return 'up'; } return null; }
  if (m.phase === 'collapsing') { if (m.t >= COLLAPSE_S + FADE_S) { m.phase = 'gone'; m.t = 0; return 'gone'; } return null; }
  if (m.phase === 'sinking') { if (m.t >= SINK_S) { if (m.dismissed || !m.travel) { m.phase = 'gone'; m.t = 0; return 'gone'; } m.phase = 'travelling'; m.t = 0; return 'travelling'; } return null; }
  if (m.phase === 'travelling') { if (m.travel && m.t >= m.travel.seconds) { m.phase = 'surfacing'; m.t = 0; return 'surfacing'; } return null; }
  if (m.phase === 'surfacing') { if (m.t >= SURFACE_S) { m.phase = 'up'; m.t = 0; m.travel = null; if (m.health <= 0) return collapse(m); return 'up'; } return null; }
  if (m.phase !== 'up') return null;
  m.still = m.speed > 0.05 ? 0 : m.still + dt;
  if (m.health <= 0) return collapse(m);
  return null;
}
const phaseOf = (m: Mount): MountPhase => m.phase;
function collapse(m: Mount): MountEvent { m.health = 0; m.phase = 'collapsing'; m.t = 0; m.speed = 0; m.called = false; m.travel = null; return 'collapsed'; }
/** Seconds a stag standing at a depth lasts from full health. */
export const lastsFor = (depth: number): number => (depth <= 0 ? Infinity : HEALTH / (DRAIN * depth));
/** A call (pass 2): from where it stands to her, `runnable` when the ground between is its to cross (the caller's line check). Near and runnable it runs; else it sinks and travels. False when it cannot answer (not up, or already on its way). */
export function callMount(m: Mount, her: { x: number; z: number }, runnable: boolean): 'run' | 'travel' | false {
  if (m.phase !== 'up') return false;
  const d = Math.hypot(her.x - m.x, her.z - m.z);
  if (d <= CALL_RUN_M && runnable) { m.called = true; m.stalled = 0; return 'run'; }
  return sinkToTravel(m, her);
}
/** It sinks where it stands and travels through the soil to her: the time the distance takes at CALL_SPEED. */
export function sinkToTravel(m: Mount, her: { x: number; z: number }): 'travel' | false {
  if (m.phase !== 'up') return false;
  m.called = false; m.speed = 0; m.phase = 'sinking'; m.t = 0; m.travel = { from: { x: m.x, z: m.z }, seconds: Math.max(0.2, Math.hypot(her.x - m.x, her.z - m.z) / CALL_SPEED) }; return 'travel';
}
/** Where a travelling stag is under the soil: along the line from where it sank toward where she is now, by the time (so it surfaces beside her however she has moved). */
export function travelPoint(m: Mount, her: { x: number; z: number }): { x: number; z: number } {
  if (!m.travel) return { x: m.x, z: m.z }; const k = m.phase === 'travelling' ? Math.min(1, m.t / m.travel.seconds) : m.phase === 'surfacing' ? 1 : 0;
  return { x: m.travel.from.x + (her.x - m.travel.from.x) * k, z: m.travel.from.z + (her.z - m.travel.from.z) * k };
}
/** Dismissed (pass 2): it sinks into the soil where it stands and is gone; no sap back. False when it is not up. */
export function dismissMount(m: Mount): boolean { if (m.phase !== 'up') return false; m.called = false; m.speed = 0; m.dismissed = true; m.phase = 'sinking'; m.t = 0; m.travel = null; return true; }
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

/** The ride-out (pass 2, Noah's fourth ask), pure: a stag called from `fromD` m out of the breach (through the growth, whose depth is depthAt) to her at `toD`
 * m, surfacing there, the mount beat, then ridden straight out; `depthAt(d)` the growth's depth at d m from the breach. Returns the times and the health at
 * each ring on the way in and out, and how far out (0..1 from `toD` to `edge`) it collapsed, or 1 if it made it. Stepped at `dt`. */
export function rideOut(fromD: number, toD: number, edge: number, depthAt: (d: number) => number, rings: Record<string, number>, dt = 0.02): { timeIn: number; timeOut: number; collapsedAt: number | null; healthIn: Record<string, number>; healthOut: Record<string, number>; healthMounted: number } {
  const m = summon(0, 0, 0); stepMount(m, RISE_S, 0, true);
  const healthIn: Record<string, number> = {}, healthOut: Record<string, number> = {};
  // In: the sink outside (depth 0), the travel along the line, the surfacing at her.
  sinkToTravel(m, { x: 0, z: fromD - toD }); let timeIn = 0; const passed = (hs: Record<string, number>, d: number, prev: number): void => { for (const [k, r] of Object.entries(rings)) if ((prev - r) * (d - r) <= 0 && !(k in hs)) hs[k] = m.health; };
  let prevD = fromD;
  while (m.phase !== 'up' && m.phase !== 'collapsing') { const p = travelPoint(m, { x: 0, z: fromD - toD }), d = fromD - p.z; stepMount(m, dt, depthAt(d), false); timeIn += dt; passed(healthIn, d, prevD); prevD = d; }
  // Her mounting beat at the rim.
  for (let t = 0; t < MOUNT_S; t += dt) stepMount(m, dt, depthAt(toD), false);
  const healthMounted = m.health; if (m.phase !== 'up') return { timeIn, timeOut: 0, collapsedAt: 0, healthIn, healthOut, healthMounted };
  // Out at the gallop, straight for the edge.
  let d = toD, timeOut = 0, collapsedAt: number | null = null; prevD = d;
  while (d < edge) { d = Math.min(edge, d + MOUNT_SPEED * dt); const ev = stepMount(m, dt, depthAt(d), false); timeOut += dt; passed(healthOut, d, prevD); prevD = d; if (ev === 'collapsed' || phaseOf(m) === 'collapsing') { collapsedAt = (d - toD) / (edge - toD); break; } }
  return { timeIn, timeOut, collapsedAt, healthIn, healthOut, healthMounted };
}
