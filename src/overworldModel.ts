// The overworld (M1): the wider world's coordinates and what she has seen of it. Pure: no Three.js.
// The village is the origin; the karst lies north (negative z, as the stream lies south); the lair
// of the mother of goats is placed by the seed LAIR_DISTANCE from the village, as an outpost is
// placed from a village. The map shows only what she has explored: a coarse grid of cells revealed
// within EXPLORE_RADIUS of her, saved; and the places she knows.
import { mulberry32 } from './colors';

export interface Place { id: 'village' | 'karst' | 'lair'; name: string; x: number; z: number; radius: number }
/** The lair's distance and the dark forest's breadth (Noah: 400 m, 150 m across). The karst 330 m north. Tuning. */
export const LAIR_DISTANCE = 400, FOREST_RADIUS = 75, KARST_AT = { x: -60, z: -330 };
export function places(seed: number): Place[] {
  const rand = mulberry32((seed * 3251 + 17) >>> 0); const a = 0.55 + rand() * 1.4; // south-east to south-west: away from the karst
  return [
    { id: 'village', name: 'the village', x: 0, z: 0, radius: 44 },
    { id: 'karst', name: 'the karst', x: KARST_AT.x, z: KARST_AT.z, radius: 60 },
    { id: 'lair', name: 'the dark forest', x: Math.round(Math.cos(a) * LAIR_DISTANCE), z: Math.round(Math.sin(a) * LAIR_DISTANCE), radius: FOREST_RADIUS },
  ];
}
/** Exploration: cells of CELL m, revealed within EXPLORE_RADIUS of where she stands. Tuning. */
export const CELL = 24, EXPLORE_RADIUS = 70;
export interface Overworld { seed: number; revealed: Set<string>; known: Set<string> }
export const freshOverworld = (seed = 1): Overworld => ({ seed, revealed: new Set(), known: new Set(['village', 'karst']) });
export const cellKey = (cx: number, cz: number): string => `${cx},${cz}`;
export const cellOf = (x: number, z: number): { cx: number; cz: number } => ({ cx: Math.floor(x / CELL), cz: Math.floor(z / CELL) });
/** Reveal the cells round a point. Returns how many were new. */
export function explore(o: Overworld, x: number, z: number, radius = EXPLORE_RADIUS): number {
  let n = 0; const r = Math.ceil(radius / CELL), c = cellOf(x, z);
  for (let i = -r; i <= r; i++) for (let k = -r; k <= r; k++) { const cx = c.cx + i, cz = c.cz + k, mx = (cx + 0.5) * CELL, mz = (cz + 0.5) * CELL; if (Math.hypot(mx - x, mz - z) <= radius) { const key = cellKey(cx, cz); if (!o.revealed.has(key)) { o.revealed.add(key); n++; } } }
  for (const p of places(o.seed)) if (Math.hypot(p.x - x, p.z - z) <= p.radius + radius) o.known.add(p.id);
  return n;
}
export const isRevealed = (o: Overworld, x: number, z: number): boolean => { const c = cellOf(x, z); return o.revealed.has(cellKey(c.cx, c.cz)); };
export const knownPlaces = (o: Overworld): Place[] => places(o.seed).filter(p => o.known.has(p.id));
export const serializeOverworld = (o: Overworld): string => JSON.stringify({ seed: o.seed, revealed: [...o.revealed], known: [...o.known] });
export function parseOverworld(raw: string | null): Overworld {
  try { const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshOverworld(); const o = freshOverworld(Number.isFinite(p.seed) ? p.seed : 1); if (Array.isArray(p.revealed)) for (const k of p.revealed) if (typeof k === 'string' && /^-?\d+,-?\d+$/.test(k)) o.revealed.add(k); if (Array.isArray(p.known)) for (const k of p.known) if (['village', 'karst', 'lair'].includes(k)) o.known.add(k); return o; } catch { return freshOverworld(); }
}
/** The pinch: the camera pulls from ZOOM_MIN m at her shoulder to ZOOM_MAX m overhead, its elevation rising from ELEV_LOW to ELEV_HIGH with the distance; past the end, the map. Tuning. */
export const ZOOM_MIN = 3, ZOOM_MAX = 40, ELEV_LOW = 0.38, ELEV_HIGH = 1.36;
export const zoomElevation = (zoom: number): number => ELEV_LOW + (ELEV_HIGH - ELEV_LOW) * Math.min(1, Math.max(0, (zoom - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)));
/** A bearing in degrees for a direction on the land: 0 north (negative z, the karst's way), 90 east (positive x), 180 south, 270 west. */
export const bearingOf = (dx: number, dz: number): number => ((Math.atan2(dx, -dz) * 180 / Math.PI) + 360) % 360;
/** A difference of bearings wrapped to -180..180. */
export const wrapDeg = (d: number): number => ((d + 540) % 360) - 180;
