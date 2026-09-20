// The Karst, ridden the Clearing's way: third person, one stick, no menus. The pillar, its plants
// and the roots draped over and through the limestone are the karst study's; what changes is how
// they are used. Pressing into a plant takes her into its roots; the stick, pushed the way a root
// visibly sets off, chooses it; the root carries her like water to the next plant. No springs, no
// sap, no soil: the traversal alone. Pure data and geometry; no Three.js scene here.
import { Vector3 } from 'three';
import type { TraversalWorld } from './mobility';
import { PLANTS, ROOTS, ZONES, inZone, relief, pillarRadius, ridePoint, type Root, type Plant, type Zone } from './karstModel';
export { PLANTS, ZONES, inZone, relief, vec, otherEnd, stepRide, ridePoint, pillarRadius, CAVERN, PILLAR_HEIGHT } from './karstModel';
export type { Root, Plant, Zone } from './karstModel';

/** The roots she can ride here: every root but the dormant taproot, which belonged to the sap economy. */
export const FLOW_ROOTS: Root[] = ROOTS.filter(r => !r.dormant);
export const rootsAt = (plantId: string): Root[] => FLOW_ROOTS.filter(r => r.a === plantId || r.b === plantId);
const other = (r: Root, plantId: string): string => (r.a === plantId ? r.b : r.a);
/** Every simple route between two plants over the roots ridden here. */
export function routes(from: string, to: string, seen: string[] = []): string[][] {
  if (from === to) return [[to]];
  const out: string[][] = [];
  for (const r of rootsAt(from)) { const next = other(r, from); if (seen.includes(next) || next === from) continue; for (const rest of routes(next, to, [...seen, from])) out.push([from, ...rest]); }
  return out;
}
/** The ground of a zone: its height with the karst's gentle relief. */
export const groundAt = (zone: Zone, x: number, z: number): number => zone.y + relief(x, z);
/** Trunk footprints by kind: what she walks round and what she presses into. Tuning. */
export const TRUNK: Record<Plant['kind'], number> = { pine: 0.385, shrub: 0.3, fig: 0.3, fern: 0.3, oak: 0.55, maple: 0.55 };
export const trunkRadius = (p: Plant): number => TRUNK[p.kind];
export const plantsOf = (zoneId: string): Plant[] => Object.values(PLANTS).filter(p => p.zone === zoneId);
/** The nearest plant of a zone and the distance to the edge of its trunk. */
export function nearestPlant(zoneId: string, x: number, z: number): { plant: Plant; distance: number } {
  let best: { plant: Plant; distance: number } | null = null;
  for (const p of plantsOf(zoneId)) { const d = Math.hypot(x - p.at.x, z - p.at.z) - trunkRadius(p); if (!best || d < best.distance) best = { plant: p, distance: d }; }
  return best!;
}
const FACE_ZONES = new Set(['east', 'west', 'south']);
/** Walking, for the shared player: one small world per zone. The zone's edge holds her (no falling
 * here, as in the clearing), trunks block, and on a ledge the pillar's face is a wall. */
export function makeZoneWorld(zone: Zone): TraversalWorld {
  return {
    surfacesAt: (x, z) => (inZone(zone, x, z) ? [groundAt(zone, x, z)] : []),
    canOccupy: (p, radius) => {
      if (!inZone(zone, p.x, p.z)) return false;
      if (p.y < groundAt(zone, p.x, p.z) - 0.03) return false;
      if (FACE_ZONES.has(zone.id) && Math.hypot(p.x, p.z) < pillarRadius(zone.y) + radius - 0.05) return false;
      for (const t of plantsOf(zone.id)) if (Math.hypot(p.x - t.at.x, p.z - t.at.z) < trunkRadius(t) + radius) return false;
      return true;
    },
  };
}
/** Pressing into a plant: within this of its trunk, pushing toward it, for PRESS_S. A double tap on
 * the ground within ENTER_RANGE does the same. Tuning. */
export const PRESS_S = 0.35, PRESS_RANGE = 0.6, ENTER_RANGE = 3.2;
/** At a mouth the stick chooses; the chosen root brightens and, held for ARM_S, is taken. SETTLE_S
 * is the beat after arriving before the stick speaks again, so a held stick does not skip a plant. */
export const ARM_S = 0.3, SETTLE_S = 0.45, CHOOSE_DOT = 0.55;
/** Where a root visibly sets off from a plant: a few metres in, which is what the stick is matched against. */
export const DEPART_M = 3;
export const departure = (r: Root, from: string): Vector3 => ridePoint(r, from, Math.min(DEPART_M, r.length * 0.4)).point;
/** A projection to the screen, in pixels with y up, or null for a point behind the camera. */
export type Screen = (p: Vector3) => { x: number; y: number } | null;
/** The stick chooses the root whose departure, seen from where the camera is, best matches its direction. */
export function chooseRoot(plantId: string, stick: { x: number; y: number }, screen: Screen, exclude: Root | null = null): Root | null {
  const m = Math.hypot(stick.x, stick.y); if (m < 0.35) return null;
  const sx = stick.x / m, sy = stick.y / m, origin = screen(PLANTS[plantId].mouth); if (!origin) return null;
  let best: Root | null = null, bestDot = CHOOSE_DOT;
  for (const r of rootsAt(plantId)) {
    if (r === exclude) continue;
    const d = screen(departure(r, plantId)); if (!d) continue;
    const dx = d.x - origin.x, dy = d.y - origin.y, l = Math.hypot(dx, dy); if (l < 1e-6) continue;
    const dot = (dx * sx + dy * sy) / l; if (dot > bestDot) { bestDot = dot; best = r; }
  }
  return best;
}
/** Where the stick would take her from a plant, for each root: unit screen directions. */
export function screenDirections(plantId: string, screen: Screen): { root: string; x: number; y: number }[] {
  const origin = screen(PLANTS[plantId].mouth); if (!origin) return [];
  const out: { root: string; x: number; y: number }[] = [];
  for (const r of rootsAt(plantId)) { const d = screen(departure(r, plantId)); if (!d) continue; const dx = d.x - origin.x, dy = d.y - origin.y, l = Math.hypot(dx, dy) || 1; out.push({ root: r.id, x: dx / l, y: dy / l }); }
  return out;
}
/** Her trail: cells she has walked, per zone (the summit and the cavern share x,z), deepening with every pass. */
export const TRAIL_CELL = 0.9, TRAIL_MAX = 3, TRAIL_PER_SECOND = 1.1;
export const cellKey = (zone: string, x: number, z: number): string => `${zone}:${Math.round(x / TRAIL_CELL)},${Math.round(z / TRAIL_CELL)}`;
export const cellCentre = (key: string): { zone: string; x: number; z: number } => { const [zone, rest] = key.split(':'); const [i, j] = rest.split(',').map(Number); return { zone, x: i * TRAIL_CELL, z: j * TRAIL_CELL }; };
export interface Progress { at: string; visited: string[]; reachedFloor: boolean; returned: boolean; trail: Record<string, number> }
export const freshProgress = (): Progress => ({ at: 'pine', visited: ['pine'], reachedFloor: false, returned: false, trail: {} });
export function tread(p: Progress, zone: string, x: number, z: number, dt: number): number {
  const k = cellKey(zone, x, z), v = Math.min(TRAIL_MAX, (p.trail[k] ?? 0) + TRAIL_PER_SECOND * dt); p.trail[k] = v; return v;
}
export function parseProgress(raw: string | null): Progress {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshProgress();
    const visited = Array.isArray(p.visited) ? p.visited.filter((v: unknown) => typeof v === 'string' && v in PLANTS) : [];
    const at = typeof p.at === 'string' && p.at in PLANTS ? p.at : 'pine';
    if (!visited.includes(at)) visited.push(at);
    const reachedFloor = p.reachedFloor === true && visited.some((v: string) => PLANTS[v].zone === 'floor');
    const trail: Record<string, number> = {};
    if (p.trail && typeof p.trail === 'object') for (const [k, v] of Object.entries(p.trail)) if (/^[a-z]+:-?\d+,-?\d+$/.test(k) && k.split(':')[0] in ZONES && typeof v === 'number' && Number.isFinite(v) && v > 0) trail[k] = Math.min(TRAIL_MAX, v);
    return { at, visited, reachedFloor, returned: p.returned === true && reachedFloor, trail };
  } catch { return freshProgress(); }
}
export const serializeProgress = (p: Progress): string => JSON.stringify({ ...p, trail: Object.fromEntries(Object.entries(p.trail).map(([k, v]) => [k, Math.round(v * 100) / 100])) });
/** Arriving in a plant: remember it, and note the two things the demo is about. */
export function arrive(p: Progress, plantId: string): 'floor' | 'returned' | null {
  p.at = plantId; if (!p.visited.includes(plantId)) p.visited.push(plantId);
  if (PLANTS[plantId].zone === 'floor' && !p.reachedFloor) { p.reachedFloor = true; return 'floor'; }
  if (plantId === 'pine' && p.reachedFloor && !p.returned) { p.returned = true; return 'returned'; }
  return null;
}
/** Is a point inside the limestone (and not in the cavern)? The third-person camera pulls in rather than enter it. */
export function insideRock(p: Vector3, cavernCentre: Vector3, cavernRadius: number, pillarHeight: number): boolean {
  if (p.y < 0 || p.y > pillarHeight) return false;
  if (p.distanceTo(cavernCentre) < cavernRadius - 0.3) return false;
  return Math.hypot(p.x, p.z) < pillarRadius(p.y) - 0.1;
}
