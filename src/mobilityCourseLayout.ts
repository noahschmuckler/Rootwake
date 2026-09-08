/** Authored course geometry shared by rendering, collision, landing queries and tests. */
import { Vector3, MathUtils } from 'three';
import type { TraversalWorld } from './mobility';
export const COURSE = { x0: 60, x1: 116, z0: -22, z1: 11, floor: -1, roof: 16 } as const;
export const COURSE_PASSAGE = { x0: 56.15, x1: 61, z0: 5.1, z1: 8.6, floor: 1.2, roof: 5 } as const;
export interface CourseSolid { id: string; x0: number; x1: number; z0: number; z1: number; bottom: number; top: number; walkable: boolean; color: number; rough?: boolean; }
const platform = (id: string, x: number, z: number, width: number, depth: number, top: number, color = 0x467a78): CourseSolid => ({ id, x0: x - width / 2, x1: x + width / 2, z0: z - depth / 2, z1: z + depth / 2, bottom: COURSE.floor - 0.2, top, walkable: true, color });
export const NORMAL_PADS = [
  platform('start', 63, 2.0, 3, 3, 1.2),
  platform('short', 66, 1.3, 1.6, 1.6, 1.2),
  platform('rise-1', 69, 0.2, 1.8, 1.8, 1.7),
  platform('rise-2', 72, -0.8, 1.8, 1.8, 2.35),
  platform('turn', 75, 0.7, 1.8, 1.8, 2.9),
  platform('summit', 77.8, -0.8, 1.8, 1.8, 3.65),
  platform('drop', 81.2, -0.8, 2.5, 2.5, 1.2),
];
export const POWERED_PADS = [
  platform('powered-start', 88, 2, 3, 3, 1.2, 0x7a6550),
  platform('powered-rise-1', 94.5, 0.5, 3, 3, 3.3, 0x997947),
  platform('powered-rise-2', 100.8, -1, 3, 3, 5.5, 0xa7834b),
  platform('powered-summit', 107, 1, 3.4, 3.4, 7.5, 0xbd9359),
  platform('powered-drop', 113, 1, 3.4, 3.4, 1.2, 0x8b7452),
];
export const COURSE_SOLIDS: CourseSolid[] = [
  { ...platform('speed-track', 71.5, 7.5, 23, 6, 1.2, 0x3c555e), rough: true },
  platform('slalom-track', 99, 7.5, 32, 6, 1.2, 0x4c525a),
  platform('normal-bridge', 63, 3.8, 3, 2.8, 1.2),
  platform('powered-bridge', 88, 3.8, 3, 2.8, 1.2, 0x7a6550),
  ...NORMAL_PADS, ...POWERED_PADS,
  platform('hurdle-track', 72, -4.3, 21, 3, 1.2, 0x4b6466),
  ...[66, 73].map((x, i) => ({ ...platform(`hurdle-${i}`, x, -4.3, 0.28, 2.6, 1.88, 0xc29856), bottom: 1.2 })),
  ...[86, 91, 96, 101, 107].map((x, i) => ({ ...platform(`slalom-${i}`, x, i % 2 ? 8.7 : 6.3, 0.9, 2.6, 2.75, 0xc59056), walkable: false })),
  // A low ceiling in the flight zone makes clearance and controlled altitude observable.
  { id: 'ceiling-test', x0: 69, x1: 73, z0: -15, z1: -8, bottom: 7.8, top: 8.1, walkable: true, color: 0x526876 },
];
export const RECOVERY_RAMP = { x0: 61.5, x1: 64.5, z0: -2.2, z1: 0.7, bottom: COURSE.floor, top: 1.2 } as const;
export function rampHeight(z: number): number { return MathUtils.lerp(RECOVERY_RAMP.bottom, RECOVERY_RAMP.top, MathUtils.clamp((z - RECOVERY_RAMP.z0) / (RECOVERY_RAMP.z1 - RECOVERY_RAMP.z0), 0, 1)); }
export function solidHeight(s: CourseSolid, x: number, z: number): number {
  if (!s.rough || x < 73 || x > 79) return s.top;
  const window = Math.sin((x - 73) / 6 * Math.PI) ** 2;
  return s.top + window * (0.06 + 0.045 * Math.sin(x * 7) * Math.cos(z * 6));
}
export function within(x: number, z: number, rect: { x0: number; x1: number; z0: number; z1: number }, margin = 0): boolean { return x >= rect.x0 + margin && x <= rect.x1 - margin && z >= rect.z0 + margin && z <= rect.z1 - margin; }
export function overlapsCircle(x: number, z: number, radius: number, r: { x0: number; x1: number; z0: number; z1: number }): boolean {
  return Math.hypot(x - MathUtils.clamp(x, r.x0, r.x1), z - MathUtils.clamp(z, r.z0, r.z1)) < radius - 1e-6;
}
export const COURSE_SPAWNS = {
  track: { label: 'Mobility: speed track', x: 62, z: 7.5, yaw: -Math.PI / 2 },
  slalom: { label: 'Mobility: slalom', x: 83.7, z: 7.5, yaw: -Math.PI / 2 },
  jumps: { label: 'Mobility: hurdles / jumps', x: 63, z: -4.3, yaw: -Math.PI / 2 },
  parkour: { label: 'Mobility: parkour', x: 63, z: 2, yaw: -Math.PI / 2 },
  powered: { label: 'Mobility: powered legs', x: 87, z: 7.5, yaw: 0 },
  flight: { label: 'Mobility: flight rings', x: 64.5, z: -9, yaw: -Math.PI / 2 },
} as const;
export type CourseSection = keyof typeof COURSE_SPAWNS;
export interface FlightGate { centre: Vector3; normal: Vector3; radius: number; }
const ringLocations = [[67, 2.7, -9], [74, 4.2, -12], [81, 6.2, -16], [89, 9, -13], [98, 7, -18], [106, 4.8, -14], [112, 2.5, -8]];
export const FLIGHT_GATES: FlightGate[] = ringLocations.map((p, i) => {
  const centre = new Vector3(...p as [number, number, number]);
  const previous = i ? new Vector3(...ringLocations[i - 1] as [number, number, number]) : new Vector3(63, 2.7, -9);
  return { centre, normal: centre.clone().sub(previous).normalize(), radius: 1.3 };
});
/** Swept plane crossing: approaching or touching the outside of a ring does not score. */
export function crossedGate(previous: Vector3, next: Vector3, gate: FlightGate, bodyRadius = 0.25): boolean {
  const a = previous.clone().sub(gate.centre).dot(gate.normal), b = next.clone().sub(gate.centre).dot(gate.normal);
  if (a >= 0 || b < 0 || Math.abs(a - b) < 1e-8) return false;
  const crossing = previous.clone().lerp(next, a / (a - b)).sub(gate.centre);
  return crossing.length() <= gate.radius - bodyRadius;
}
export class CourseGeometry implements TraversalWorld {
  contains(x: number, z: number): boolean { return within(x, z, COURSE) || within(x, z, COURSE_PASSAGE); }
  surfacesAt(x: number, z: number): readonly number[] {
    const values: number[] = [];
    if (within(x, z, COURSE)) values.push(COURSE.floor);
    if (within(x, z, COURSE_PASSAGE)) values.push(COURSE_PASSAGE.floor);
    for (const s of COURSE_SOLIDS) if (s.walkable && within(x, z, s)) values.push(solidHeight(s, x, z));
    if (within(x, z, RECOVERY_RAMP)) values.push(rampHeight(z));
    return [...new Set(values)].sort((a, b) => a - b);
  }
  canOccupy(feet: Vector3, radius: number, height: number): boolean {
    if (!within(feet.x, feet.z, COURSE, radius) && !within(feet.x, feet.z, COURSE_PASSAGE, radius)) return false;
    const passageOnly = feet.x < COURSE.x0 + radius;
    const floor = passageOnly ? COURSE_PASSAGE.floor : COURSE.floor;
    const roof = passageOnly ? COURSE_PASSAGE.roof : COURSE.roof;
    if (feet.y < floor - 0.025 || feet.y + height > roof - 0.05) return false;
    for (const s of COURSE_SOLIDS) {
      if (!overlapsCircle(feet.x, feet.z, radius, s)) continue;
      const top = solidHeight(s, MathUtils.clamp(feet.x, s.x0, s.x1), MathUtils.clamp(feet.z, s.z0, s.z1));
      if (feet.y < top - 0.025 && feet.y + height > s.bottom + 0.001) return false;
    }
    if (overlapsCircle(feet.x, feet.z, radius, RECOVERY_RAMP) && feet.y < rampHeight(MathUtils.clamp(feet.z, RECOVERY_RAMP.z0, RECOVERY_RAMP.z1)) - 0.025) return false;
    return true;
  }
  anchors(): readonly Vector3[] {
    return [...NORMAL_PADS, ...POWERED_PADS].map(s => new Vector3((s.x0 + s.x1) / 2, s.top, (s.z0 + s.z1) / 2));
  }
  groundHeight(x: number, z: number): number { const ys = this.surfacesAt(x, z); return ys.length ? Math.max(...ys) : COURSE.floor; }
}
