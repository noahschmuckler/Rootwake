// The Breathing Watershed: a pure, deterministic ecology ledger. No Three.js, testable in node.
// Two groves share one spring. Rain comes in phases; storage feeds the groves by an allocation
// Hulda can redirect; moisture drives canopy with a lag; litter decomposes where it is damp.
// A fine-root shortcut between the groves withdraws under sustained stress and regrows after
// sustained recovery; the deep route through the spring is always passable. Stylized values, not
// biology: the point is a small ecology that changes a route legibly and recovers on its own.
import { CatmullRomCurve3, Vector3 } from 'three';
import type { TraversalWorld } from './mobility';

export const SAP_CAP = 120, REDIRECT_COST = 8, BASIN_COST = 24;
export const CORRIDOR_RADIUS = 1.5;
/** Game-days per real second at 1x; the observer's 6x makes a season pass in under a minute. */
export const DAYS_PER_SECOND = 1 / 12;
export const SPEEDS = [0, 1, 6] as const;
// Season: a wet phase then a longer dry one (tuning: the dry must outlast the spring without the basin).
export const CYCLE_DAYS = 26, WET_DAYS = 10;
export const RAIN_WET = 9, RAIN_DRY = 0.25;
export const STORAGE_CAP = 40, BASIN_STORAGE_CAP = 70, BASIN_CATCH = 1.5;
export const DRAW_PER_DAY = 5, SEEPAGE = 0.03;
export const INFLOW_EFFECT = 0.04, RAIN_EFFECT = 0.015, EVAP_WET = 0.03, EVAP_DRY = 0.11;
export const CANOPY_LAG = 0.15;
export const LITTER_DECAY = 0.25;
/** Fine-root hysteresis: stress is the drier grove's moisture. */
export const CLOSE_BELOW = 0.3, CLOSE_AFTER_DAYS = 1.5, CLOSING_DAYS = 1.5;
export const REGROW_ABOVE = 0.55, REGROW_AFTER_DAYS = 2, REGROWING_DAYS = 2;
export const LOG_LIMIT = 8;

export type Allocation = 'balanced' | 'west' | 'east';
export type ShortcutState = 'open' | 'closing' | 'closed' | 'regrowing';
export interface Grove { moisture: number; canopy: number; litter: number }
export interface Watershed {
  sap: number; day: number; storage: number; allocation: Allocation; basin: boolean;
  west: Grove; east: Grove;
  shortcut: ShortcutState; stressDays: number; recoveryDays: number; phaseDays: number;
  log: { day: number; text: string }[];
}
export const freshWatershed = (): Watershed => ({
  sap: 0, day: 0, storage: STORAGE_CAP * 0.85, allocation: 'balanced', basin: false,
  west: { moisture: 0.85, canopy: 0.85, litter: 0 }, east: { moisture: 0.85, canopy: 0.85, litter: 0 },
  shortcut: 'open', stressDays: 0, recoveryDays: 0, phaseDays: 0, log: [],
});
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const num = (v: unknown, lo: number, hi: number, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : fallback);
export function parseWatershed(raw: string | null): Watershed {
  const fresh = freshWatershed();
  try {
    const p = JSON.parse(raw ?? 'null');
    if (!p || typeof p !== 'object') return fresh;
    const grove = (g: Partial<Grove> | undefined, base: Grove): Grove => ({ moisture: num(g?.moisture, 0, 1, base.moisture), canopy: num(g?.canopy, 0, 1, base.canopy), litter: num(g?.litter, 0, 3, base.litter) });
    const basin = p.basin === true;
    const shortcut: ShortcutState = ['open', 'closing', 'closed', 'regrowing'].includes(p.shortcut) ? p.shortcut : 'open';
    return {
      sap: Math.floor(num(p.sap, 0, SAP_CAP, 0)), day: num(p.day, 0, 1e6, 0), storage: num(p.storage, 0, basin ? BASIN_STORAGE_CAP : STORAGE_CAP, fresh.storage),
      allocation: ['balanced', 'west', 'east'].includes(p.allocation) ? p.allocation : 'balanced', basin,
      west: grove(p.west, fresh.west), east: grove(p.east, fresh.east),
      // A save cannot hold the passage open: closure resumes and completes on load.
      shortcut: shortcut === 'closing' ? 'closed' : shortcut, stressDays: num(p.stressDays, 0, 100, 0), recoveryDays: num(p.recoveryDays, 0, 100, 0), phaseDays: num(p.phaseDays, 0, 100, 0),
      log: Array.isArray(p.log) ? p.log.filter((e: { day?: unknown; text?: unknown }) => typeof e?.text === 'string' && typeof e?.day === 'number').slice(-LOG_LIMIT) : [],
    };
  } catch { return fresh; }
}
export const isWet = (day: number): boolean => ((day % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS < WET_DAYS;
export const rainOn = (day: number): number => isWet(day) ? RAIN_WET * (0.85 + 0.15 * Math.sin(day * 2.1)) : RAIN_DRY;
export const shares = (a: Allocation): { west: number; east: number } => a === 'balanced' ? { west: 0.5, east: 0.5 } : a === 'west' ? { west: 0.75, east: 0.25 } : { west: 0.25, east: 0.75 };
export const storageCap = (w: Watershed): number => w.basin ? BASIN_STORAGE_CAP : STORAGE_CAP;
export const stressOf = (w: Watershed): number => Math.min(w.west.moisture, w.east.moisture);
/** Health for readouts and visuals: canopy is what the eye sees, moisture is what it will become. */
export const conditionOf = (g: Grove): 'thriving' | 'steady' | 'stressed' | 'wilting' => g.moisture > 0.6 ? 'thriving' : g.moisture > 0.4 ? 'steady' : g.moisture > 0.22 ? 'stressed' : 'wilting';
export const decomposition = (g: Grove): number => clamp01(g.litter * g.moisture * 2.5);

function note(w: Watershed, text: string): void { w.log.push({ day: Math.floor(w.day), text }); if (w.log.length > LOG_LIMIT) w.log.splice(0, w.log.length - LOG_LIMIT); }

/** One ledger step of at most a twentieth of a day. Returns the water balance for tests. */
function stepOnce(w: Watershed, dt: number, held: boolean): { rain: number; caught: number; drawn: number; seeped: number; overflow: number } {
  const wet = isWet(w.day), rain = rainOn(w.day) * dt;
  const caught = rain * (w.basin ? BASIN_CATCH : 1);
  w.storage += caught;
  const overflow = Math.max(0, w.storage - storageCap(w)); w.storage -= overflow;
  const drawn = Math.min(w.storage, DRAW_PER_DAY * dt); w.storage -= drawn;
  const seeped = w.storage * (w.basin ? SEEPAGE * 0.5 : SEEPAGE) * dt; w.storage -= seeped;
  const share = shares(w.allocation), evap = (wet ? EVAP_WET : EVAP_DRY) * dt;
  for (const side of ['west', 'east'] as const) {
    const g = w[side], inflow = drawn * share[side];
    g.moisture = clamp01(g.moisture + inflow * INFLOW_EFFECT + rain * RAIN_EFFECT - evap);
    const target = clamp01((g.moisture - 0.2) / 0.5);
    const canopy = g.canopy + (target - g.canopy) * CANOPY_LAG * dt;
    if (canopy < g.canopy) g.litter += (g.canopy - canopy) * 3;
    g.canopy = canopy;
    g.litter = Math.max(0, g.litter - g.litter * LITTER_DECAY * g.moisture * dt);
  }
  const stress = stressOf(w);
  w.stressDays = stress < CLOSE_BELOW ? w.stressDays + dt : 0;
  w.recoveryDays = stress > REGROW_ABOVE ? w.recoveryDays + dt : 0;
  if (w.shortcut === 'open' && w.stressDays >= CLOSE_AFTER_DAYS) { w.shortcut = 'closing'; w.phaseDays = 0; note(w, `The ${w.west.moisture < w.east.moisture ? 'west' : 'east'} grove wilts. The fine root between the groves withdraws.`); }
  else if (w.shortcut === 'closing') {
    w.phaseDays += dt;
    // Never trap an awareness inside: the closure completes only once the passage is empty.
    if (w.phaseDays >= CLOSING_DAYS && !held) { w.shortcut = 'closed'; w.phaseDays = 0; note(w, 'The fine root has closed. Only the deep route through the spring remains.'); }
  } else if (w.shortcut === 'closed' && w.recoveryDays >= REGROW_AFTER_DAYS) { w.shortcut = 'regrowing'; w.phaseDays = 0; note(w, 'Both groves drink again. The fine root begins to regrow.'); }
  else if (w.shortcut === 'regrowing') { w.phaseDays += dt; if (w.phaseDays >= REGROWING_DAYS) { w.shortcut = 'open'; w.phaseDays = 0; note(w, 'The fine root has regrown. The short passage is open.'); } }
  const dayBefore = w.day; w.day += dt;
  if (isWet(w.day) !== isWet(dayBefore)) note(w, isWet(w.day) ? 'Rain returns. The spring rises.' : 'The rains end. The spring must last the dry days.');
  for (const side of ['west', 'east'] as const) {
    const was = conditionOf({ ...w[side], moisture: w[side].moisture + evap - (drawn * share[side] * INFLOW_EFFECT + rain * RAIN_EFFECT) });
    const now = conditionOf(w[side]);
    if (was !== now && (now === 'wilting' || now === 'thriving' || (now === 'stressed' && was === 'steady'))) note(w, `The ${side} grove is ${now}${now === 'stressed' ? ': litter gathers beneath it' : now === 'wilting' ? ': its canopy thins' : ''}.`);
  }
  return { rain, caught, drawn, seeped, overflow };
}
/** Advance by game-days. `held` says an awareness is inside the fine root right now. */
export function advance(w: Watershed, days: number, held = false): { rain: number; caught: number; drawn: number; seeped: number; overflow: number } {
  const total = { rain: 0, caught: 0, drawn: 0, seeped: 0, overflow: 0 };
  let remaining = Math.max(0, days);
  while (remaining > 1e-9) {
    const dt = Math.min(0.05, remaining); remaining -= dt;
    const b = stepOnce(w, dt, held);
    total.rain += b.rain; total.caught += b.caught; total.drawn += b.drawn; total.seeped += b.seeped; total.overflow += b.overflow;
  }
  return total;
}
export function redirect(w: Watershed, to: Allocation): boolean {
  if (w.allocation === to || w.sap < REDIRECT_COST) return false;
  w.sap -= REDIRECT_COST; w.allocation = to;
  note(w, to === 'balanced' ? 'You let the spring flow evenly to both groves.' : `You lean the spring toward the ${to} grove. The other will have less.`);
  return true;
}
export function cultivateBasin(w: Watershed): boolean {
  if (w.basin || w.sap < BASIN_COST) return false;
  w.sap -= BASIN_COST; w.basin = true;
  note(w, 'A moss basin holds the rain above the spring. Dry days will drain it more slowly.');
  return true;
}

// The root network: two groves, one spring beneath them, a fine shortcut across the top.
export const vec = (x: number, y: number, z: number) => new Vector3(x, y, z);
export const NODES = { west: vec(-9, -1.8, 4), spring: vec(0, -4.6, -6), east: vec(9, -1.8, 4), basin: vec(0, -1.6, -2.5) };
export type NodeId = keyof typeof NODES;
export interface RootEdge { id: string; a: NodeId; b: NodeId; fine: boolean; curve: CatmullRomCurve3; samples: Vector3[]; length: number }
function edge(id: string, a: NodeId, b: NodeId, fine: boolean, via: Vector3[]): RootEdge {
  const curve = new CatmullRomCurve3([NODES[a], ...via, NODES[b]], false, 'centripetal');
  return { id, a, b, fine, curve, samples: curve.getSpacedPoints(100), length: curve.getLength() };
}
export const EDGES: RootEdge[] = [
  edge('west-spring', 'west', 'spring', false, [vec(-8, -2.6, 0), vec(-4.5, -4.2, -4.5)]),
  edge('spring-east', 'spring', 'east', false, [vec(4.5, -4.2, -4.5), vec(8, -2.6, 0)]),
  edge('spring-basin', 'spring', 'basin', false, [vec(0, -3.4, -4.6)]),
  edge('fine-root', 'west', 'east', true, [vec(-4.5, -1.4, 5.2), vec(0, -1.2, 5.6), vec(4.5, -1.4, 5.2)]),
];
export const FINE = EDGES.find(e => e.fine)!;
/** Passable now: the fine root while open, or while closing with an awareness already inside. */
export const isPassable = (e: RootEdge, w: Watershed, inside: boolean): boolean => !e.fine || w.shortcut === 'open' || (w.shortcut === 'closing' && inside);
export function nearestRoot(position: Vector3, w: Watershed, inside: boolean): { edge: RootEdge; index: number; distance: number } {
  let best = { edge: EDGES[0], index: 0, distance: Infinity };
  for (const e of EDGES) if (isPassable(e, w, inside)) for (let i = 0; i < e.samples.length; i++) { const d = position.distanceTo(e.samples[i]); if (d < best.distance) best = { edge: e, index: i, distance: d }; }
  return best;
}
/** Inside the fine root: within its corridor and nearer to it than to any deep root. At a grove
 * node both are equally near, so the node itself (and the deep corridor) count as outside; the
 * hold therefore lasts exactly until the awareness is somewhere else it can be. */
export function insideFine(position: Vector3): boolean {
  let fine = Infinity, deep = Infinity;
  for (const e of EDGES) for (const s of e.samples) { const d = position.distanceTo(s); if (e.fine) fine = Math.min(fine, d); else deep = Math.min(deep, d); }
  return fine <= CORRIDOR_RADIUS && fine < deep;
}
export function groundHeight(x: number, z: number): number { return 0.14 * Math.sin(x * 0.3) * Math.cos(z * 0.25) + 0.08 * Math.sin(z * 0.6); }
export const onValley = (x: number, z: number): boolean => x >= -19 && x <= 19 && z >= -15 && z <= 14;
export function makeSoil(state: () => Watershed, inside: () => boolean): TraversalWorld {
  return { surfacesAt: () => [], canOccupy: (p, radius, height) => p.y + height <= groundHeight(p.x, p.z) - 0.12 && nearestRoot(p, state(), inside()).distance <= CORRIDOR_RADIUS - radius };
}
/** Guide the gaze along the passable graph toward a node; never moves the body. */
export function guide(position: Vector3, target: NodeId, w: Watershed, inside: boolean): Vector3 {
  const distances = Object.fromEntries(Object.keys(NODES).map(k => [k, Infinity])) as Record<NodeId, number>;
  distances[target] = 0;
  for (let pass = 0; pass < 6; pass++) for (const e of EDGES) if (isPassable(e, w, inside)) { distances[e.a] = Math.min(distances[e.a], distances[e.b] + e.length); distances[e.b] = Math.min(distances[e.b], distances[e.a] + e.length); }
  const n = nearestRoot(position, w, inside), along = n.index / 100 * n.edge.length;
  const forward = n.edge.length - along + distances[n.edge.b] < along + distances[n.edge.a];
  const endpoint = forward ? n.edge.b : n.edge.a;
  if (position.distanceTo(NODES[endpoint]) < 1.5 && endpoint !== target) {
    const next = EDGES.filter(e => isPassable(e, w, inside) && (e.a === endpoint || e.b === endpoint)).sort((a, b) => a.length + distances[a.a === endpoint ? a.b : a.a] - b.length - distances[b.a === endpoint ? b.b : b.a])[0];
    if (next) return next.curve.getPointAt(next.a === endpoint ? Math.min(0.7, 3 / next.length) : Math.max(0.3, 1 - 3 / next.length));
  }
  return n.edge.samples[Math.max(0, Math.min(100, n.index + (forward ? 1 : -1) * Math.ceil(270 / n.edge.length)))].clone();
}
