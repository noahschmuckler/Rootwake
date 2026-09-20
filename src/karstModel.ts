// The Karst: a pillar like Zhangjiajie's, its plants joined by roots draped over and through the
// limestone. No soil to sink into: the way between plants is to shrink into a root and ride it.
// Pure geometry, graph and progress; no Three.js scene here, so it is testable in node.
import { CatmullRomCurve3, Vector3 } from 'three';
import type { TraversalWorld } from './mobility';
import { parseWatershed, freshWatershed, type Watershed } from './watershedModel';

export const PILLAR_HEIGHT = 64;
/** Limestone radius by height: broad foot, a bulge, a narrow top. Tuning: the silhouette. */
export function pillarRadius(y: number): number {
  const t = Math.min(1, Math.max(0, y / PILLAR_HEIGHT));
  return 11 - 7 * Math.pow(t, 1.15) + 1.3 * Math.sin(t * 9.5) * (1 - t * 0.5);
}
/** A point on the pillar's surface, pushed out by `out`, at height y and angle a (radians about +y). */
export const onFace = (y: number, a: number, out = 0): Vector3 => new Vector3(Math.cos(a) * (pillarRadius(y) + out), y, Math.sin(a) * (pillarRadius(y) + out));
export const CAVERN = { centre: new Vector3(0, 29, 0), radius: 6.5, floorY: 25.2, poolRadius: 2.1 };
export const FLOOR_RADIUS = 40;
export const vec = (x: number, y: number, z: number) => new Vector3(x, y, z);

/** Where a body can stand: one small world per plant. `inner` is a hole (the pool, the pillar's foot). */
export interface Zone { id: string; x: number; z: number; y: number; radius: number; inner?: number }
export const ZONES: Record<string, Zone> = {
  summit: { id: 'summit', x: 0, z: 0, y: PILLAR_HEIGHT, radius: 3.2 },
  east: { id: 'east', x: pillarRadius(48) + 1.2, z: 0, y: 48.3, radius: 1.55 },
  west: { id: 'west', x: -(pillarRadius(34) + 1.2), z: 0, y: 34.3, radius: 1.55 },
  south: { id: 'south', x: 0, z: pillarRadius(18) + 1.2, y: 18.3, radius: 1.55 },
  cavern: { id: 'cavern', x: 0, z: 0, y: CAVERN.floorY, radius: 5.6, inner: CAVERN.poolRadius + 0.3 },
  floor: { id: 'floor', x: 0, z: 0, y: 0, radius: FLOOR_RADIUS, inner: pillarRadius(0) + 0.9 },
};
export function inZone(zone: Zone, x: number, z: number): boolean {
  const d = Math.hypot(x - zone.x, z - zone.z);
  return d <= zone.radius && (zone.inner === undefined || d >= zone.inner);
}
/** Gentle relief so ledges and the floor are not billiard tables. */
export const relief = (x: number, z: number): number => 0.05 * Math.sin(x * 0.9) * Math.cos(z * 0.8);

/** A plant Hulda can commune with: where it stands, which zone it opens onto, where its root mouth is. */
export interface Plant { id: string; name: string; kind: 'pine' | 'shrub' | 'fig' | 'fern' | 'oak' | 'maple'; zone: string; at: Vector3; mouth: Vector3; stand: { x: number; z: number; yaw: number } }
const plant = (id: string, name: string, kind: Plant['kind'], zone: string, at: Vector3, mouth: Vector3, stand: { x: number; z: number; yaw: number }): Plant => ({ id, name, kind, zone, at, mouth, stand });
export const PLANTS: Record<string, Plant> = {
  pine: plant('pine', 'the summit pine', 'pine', 'summit', vec(-1.1, PILLAR_HEIGHT, -1.4), vec(-0.5, PILLAR_HEIGHT + 0.1, -0.6), { x: 0.9, z: 0.7, yaw: 2.2 }),
  eastShrub: plant('eastShrub', 'the east ledge shrub', 'shrub', 'east', onFace(48.3, 0, 0.35), onFace(48.3, 0, 1.0).setY(48.4), { x: ZONES.east.x + 0.7, z: 0.4, yaw: -Math.PI / 2 }),
  westFig: plant('westFig', 'the west face fig', 'fig', 'west', onFace(34.3, Math.PI, 0.35), onFace(34.3, Math.PI, 1.0).setY(34.4), { x: ZONES.west.x - 0.7, z: 0.4, yaw: Math.PI / 2 }),
  southShrub: plant('southShrub', 'the south ledge shrub', 'shrub', 'south', onFace(18.3, Math.PI / 2, 0.35), onFace(18.3, Math.PI / 2, 1.0).setY(18.4), { x: 0.4, z: ZONES.south.z + 0.7, yaw: Math.PI }),
  cavernFern: plant('cavernFern', 'the cavern fern', 'fern', 'cavern', vec(3.6, CAVERN.floorY, 2.2), vec(3.1, CAVERN.floorY + 0.1, 1.7), { x: 2.2, z: 3.6, yaw: 0.3 }),
  floorOak: plant('floorOak', 'the foot oak', 'oak', 'floor', vec(15.5, 0, 3.5), vec(14.6, 0.1, 3.0), { x: 13.8, z: 4.8, yaw: -1.3 }),
  floorMaple: plant('floorMaple', 'the west maple', 'maple', 'floor', vec(-16, 0, -2.5), vec(-15.1, 0.1, -2.2), { x: -14.2, z: -3.6, yaw: 1.3 }),
};
/** A root between two plants: a curve to ride. `interior` roots pass through the limestone. `fine`
 * roots are thin and withdraw when the foot's groves are stressed (the watershed's rule); a `dormant`
 * root must first be tended with sap. */
export interface Root { id: string; a: string; b: string; interior: boolean; fine?: boolean; dormant?: boolean; curve: CatmullRomCurve3; length: number }
function faceCurve(a: string, b: string, angleA: number, angleB: number, out: number, extra: Vector3[] = [], pre: Vector3[] = []): Vector3[] {
  // Drape over the surface: interpolate height and angle, keep just outside the rock. `pre` carries a
  // root from a mouth on top of the pillar across the summit and over its rim first.
  const A = PLANTS[a].mouth, B = PLANTS[b].mouth, points: Vector3[] = [A.clone(), ...pre], top = pre.length ? pre[pre.length - 1].y : A.y;
  for (let i = 1; i < 6; i++) { const t = i / 6, y = top + (B.y - top) * t, ang = angleA + (angleB - angleA) * t; points.push(onFace(y, ang, out + 0.15 * Math.sin(t * Math.PI * 3))); }
  return [...points, ...extra, B.clone()];
}
/** Over the summit's rim at angle a: along the top, then just past the edge, before the face descent. */
const overRim = (a: number): Vector3[] => [onFace(PILLAR_HEIGHT, a, -1.2).setY(PILLAR_HEIGHT + 0.15), onFace(PILLAR_HEIGHT, a, 0.35).setY(PILLAR_HEIGHT + 0.1), onFace(PILLAR_HEIGHT - 1.2, a, 0.45)];
function root(id: string, a: string, b: string, interior: boolean, points: Vector3[], flags: { fine?: boolean; dormant?: boolean } = {}): Root {
  const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.6);
  return { id, a, b, interior, ...flags, curve, length: curve.getLength() };
}
export const ROOTS: Root[] = [
  root('pine-east', 'pine', 'eastShrub', false, faceCurve('pine', 'eastShrub', 0.35, 0, 0.3, [], overRim(0.35))),
  root('pine-west', 'pine', 'westFig', false, faceCurve('pine', 'westFig', Math.PI - 0.5, Math.PI, 0.3, [], overRim(Math.PI - 0.5))),
  root('east-south', 'eastShrub', 'southShrub', false, faceCurve('eastShrub', 'southShrub', 0.05, Math.PI / 2, 0.3)),
  root('east-cavern', 'eastShrub', 'cavernFern', true, [PLANTS.eastShrub.mouth.clone(), onFace(46, 0.15, -1.2), vec(5.5, 40, 1.5), vec(4.5, 33, 2.5), vec(3.8, 28, 2.2), PLANTS.cavernFern.mouth.clone()]),
  root('west-cavern', 'westFig', 'cavernFern', true, [PLANTS.westFig.mouth.clone(), onFace(33, Math.PI - 0.1, -1.4), vec(-5.5, 31, -1.5), vec(-2, 28.5, 0.5), vec(1.5, 26.5, 1.5), PLANTS.cavernFern.mouth.clone()]),
  root('cavern-floor', 'cavernFern', 'floorOak', true, [PLANTS.cavernFern.mouth.clone(), vec(5.5, 22, 3), vec(8, 14, 3.5), vec(10.5, 6, 3.5), vec(12.5, 1.2, 3.2), PLANTS.floorOak.mouth.clone()]),
  root('south-floor', 'southShrub', 'floorOak', false, faceCurve('southShrub', 'floorOak', Math.PI / 2, 0.25, 0.3, [vec(12.8, 0.6, 5.5)])),
  root('west-floor', 'westFig', 'floorMaple', false, faceCurve('westFig', 'floorMaple', Math.PI, Math.PI + 0.15, 0.3, [vec(-13.5, 0.6, -2.4)])),
  // The foot root: a fine root round the south of the foot joining the two groves. It withdraws under stress.
  root('foot-root', 'floorOak', 'floorMaple', false, [PLANTS.floorOak.mouth.clone(), vec(11, 0.35, 8), vec(3, 0.4, 13.5), vec(-7, 0.4, 12.5), vec(-13.5, 0.35, 5.5), vec(-15.5, 0.3, 0.5), PLANTS.floorMaple.mouth.clone()], { fine: true }),
  // The taproot: dormant, the pine's old root straight down the north face to the maple. Tended for sap,
  // it is the fastest way up, and, being fine, the first to withdraw when the maple's grove wilts.
  root('taproot', 'pine', 'floorMaple', false, faceCurve('pine', 'floorMaple', Math.PI * 1.5 - 0.3, Math.PI + 0.35, 0.3, [vec(-14.2, 0.6, -4.5)], overRim(Math.PI * 1.5 - 0.3)), { fine: true, dormant: true }),
];
/** Can this root be ridden now? Deep roots always; the dormant one once tended; fine ones while the
 * foot's groves are not withdrawing them. A ride already begun always completes. */
export const isRideable = (r: Root, p: { tended: boolean; w: Watershed }): boolean => (!r.dormant || p.tended) && (!r.fine || p.w.shortcut === 'open');
export const TEND_COST = 12;
export function tend(p: { sap: number; tended: boolean }): boolean { if (p.tended || p.sap < TEND_COST) return false; p.sap -= TEND_COST; p.tended = true; return true; }
export const rootsAt = (plantId: string): Root[] => ROOTS.filter(r => r.a === plantId || r.b === plantId);
export const otherEnd = (r: Root, plantId: string): string => (r.a === plantId ? r.b : r.a);
/** Every simple route between two plants (the graph is small); used to prove the way back up is not one path. */
export function routes(from: string, to: string, seen: string[] = []): string[][] {
  if (from === to) return [[to]];
  const out: string[][] = [];
  for (const r of rootsAt(from)) { const next = otherEnd(r, from); if (seen.includes(next) || next === from) continue; for (const rest of routes(next, to, [...seen, from])) out.push([from, ...rest]); }
  return out;
}
/** Water-slide kinematics: a downhill tangent pulls, uphill is a slow capillary climb. Tuning. */
export const RIDE_MIN = 3, RIDE_MAX = 13, RIDE_PULL = 11, RIDE_ACCEL = 2.6, RIDE_BRAKE = 7, ARRIVE_BRAKE_M = 9;
export function rideTarget(tangentY: number, remaining: number): number {
  const want = Math.min(RIDE_MAX, RIDE_MIN + RIDE_PULL * Math.max(0, -tangentY));
  const k = Math.min(1, Math.max(0, remaining / ARRIVE_BRAKE_M));
  return Math.min(want, RIDE_MIN + (RIDE_MAX - RIDE_MIN) * k * k);
}
/** Advance a ride by dt seconds along a root travelled from `from`; returns the new distance and speed. */
export function stepRide(r: Root, from: string, s: number, speed: number, dt: number): { s: number; speed: number; done: boolean } {
  const forward = r.a === from, u = Math.min(1, Math.max(0, s / r.length));
  const tangent = r.curve.getTangentAt(forward ? u : 1 - u); if (!forward) tangent.negate();
  const target = rideTarget(tangent.y, r.length - s);
  speed += (target - speed) * Math.min(1, dt * (target < speed ? RIDE_BRAKE : RIDE_ACCEL));
  s = Math.min(r.length, s + speed * dt);
  return { s, speed, done: s >= r.length - 1e-6 };
}
export function ridePoint(r: Root, from: string, s: number): { point: Vector3; tangent: Vector3 } {
  const forward = r.a === from, u = Math.min(1, Math.max(0, s / r.length)), t = forward ? u : 1 - u;
  const point = r.curve.getPointAt(t), tangent = r.curve.getTangentAt(t); if (!forward) tangent.negate();
  return { point, tangent };
}
/** The soil at the foot, for sinking and drifting: the ground is the roof, bedrock the floor, and the
 * pillar continues down through it as solid rock. */
export const BEDROCK = -6.5, ROOF_MARGIN = 0.12;
export function makeFloorSoil(): TraversalWorld {
  return { surfacesAt: () => [], canOccupy: (p, radius, height) => Math.hypot(p.x, p.z) <= FLOOR_RADIUS && p.y + height <= relief(p.x, p.z) - ROOF_MARGIN && p.y >= BEDROCK && Math.hypot(p.x, p.z) >= pillarRadius(0) + 0.3 + radius };
}
export interface Progress { at: string; visited: string[]; reachedFloor: boolean; returned: boolean; vision: boolean; sap: number; tended: boolean; w: Watershed }
export const freshProgress = (): Progress => ({ at: 'pine', visited: ['pine'], reachedFloor: false, returned: false, vision: false, sap: 0, tended: false, w: freshWatershed() });
export function parseProgress(raw: string | null): Progress {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshProgress();
    const visited = Array.isArray(p.visited) ? p.visited.filter((v: unknown) => typeof v === 'string' && v in PLANTS) : [];
    const at = typeof p.at === 'string' && p.at in PLANTS ? p.at : 'pine';
    if (!visited.includes(at)) visited.push(at);
    const reachedFloor = p.reachedFloor === true && visited.some((v: string) => PLANTS[v].zone === 'floor');
    const w = parseWatershed(p.w ? JSON.stringify(p.w) : null); w.sap = 0;
    return { at, visited, reachedFloor, returned: p.returned === true && reachedFloor, vision: p.vision === true, sap: Math.floor(Math.min(120, Math.max(0, Number.isFinite(p.sap) ? p.sap : 0))), tended: p.tended === true, w };
  } catch { return freshProgress(); }
}
/** Arriving somewhere: remember it, and note the two things the demo is about. */
export function arrive(p: Progress, plantId: string): string | null {
  p.at = plantId; if (!p.visited.includes(plantId)) p.visited.push(plantId);
  if (PLANTS[plantId].zone === 'floor' && !p.reachedFloor) { p.reachedFloor = true; return 'floor'; }
  if (plantId === 'pine' && p.reachedFloor && !p.returned) { p.returned = true; return 'returned'; }
  return null;
}
