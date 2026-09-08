// Geometry, navigation and camera clearance share these measurements.
// The studies are in an EAST ANNEX, not on the original observation platform.
export const ANNEX = { x0: 14.2, x1: 56.8, z0: -3.5, z1: 10.5, roof: 7.8 } as const;
export const CONNECTOR = { x0: 8.0, x1: 15.0, z0: 5.1, z1: 8.6, height: 3.8 } as const;
export const STUDY_FRONT = 4.5;
export const STUDY_BACK = -3.0;
export const STUDY_RISE = 1.4;
export const AISLE_RISE = 2.2;
export const STUDY_CENTRE_Z = (STUDY_FRONT + STUDY_BACK) / 2;
export const STUDY_DEPTH = STUDY_FRONT - STUDY_BACK;
export const STUDY_WIDTH = 6.8;
export const STUDY_HEIGHT = 5.8;
export const STUDY_BAYS = [
  { id: 'gait', x: 18, title: '01  GAIT / TREADMILL', note: 'Forward stance, lifted return' },
  { id: 'surface', x: 25, title: '02  SURFACE CIRCUIT', note: 'Head - thorax - abdomen' },
  { id: 'feeding', x: 32, title: '03  FEED / SCRAPE / GROOM', note: 'The same wall-feeding sequence' },
  { id: 'turn', x: 39, title: '04  SWERVE / BODY WAVE', note: 'Follow the travelled path' },
  { id: 'regard', x: 46, title: '05  REGARD / REACH', note: 'Tracks the observer' },
  { id: 'idle', x: 53, title: '06  TURN / SETTLE', note: 'Turn, straighten, idle' },
] as const;
export type StudyId = typeof STUDY_BAYS[number]['id'];

export function inside(x: number, z: number, r: { x0: number; x1: number; z0: number; z1: number }, margin = 0): boolean {
  return x > r.x0 + margin && x < r.x1 - margin && z > r.z0 + margin && z < r.z1 - margin;
}
export function annexWalkable(x: number, z: number): boolean {
  return inside(x, z, CONNECTOR, 0.35) || inside(x, z, { ...ANNEX, z0: STUDY_FRONT }, 0.35);
}
/** Full-height partitions occupy only the rear of the studies; the front 3 m stays open for oblique views. */
export function inStudyPartition(x: number, z: number): boolean {
  return z < 1.5 && z > STUDY_BACK - 0.15 && STUDY_BAYS.some(b => Math.abs(Math.abs(x - b.x) - STUDY_WIDTH / 2) < 0.18);
}
