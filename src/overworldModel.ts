// The overworld (M1): the wider world's coordinates and what she has seen of it. Pure: no Three.js.
// The village is the origin; the karst lies north (negative z, as the stream lies south); the lair
// of the mother of goats is placed by the seed LAIR_DISTANCE from the village, as an outpost is
// placed from a village. The map shows only what she has explored: a coarse grid of cells revealed
// within EXPLORE_RADIUS of her, saved; and the places she knows.
import { mulberry32 } from './colors';

export type PlaceKind = 'village' | 'karst' | 'lair' | 'den';
export interface Place { id: string; kind: PlaceKind; name: string; x: number; z: number; radius: number; tier?: number }
/** The lair's distance and the dark forest's breadth (Noah: 400 m, 150 m across). The karst 330 m north. Tuning. */
export const LAIR_DISTANCE = 400, FOREST_RADIUS = 75, KARST_AT = { x: -60, z: -330 };
/** The karsts, for the danger field (G5 adds more). */
export const KARSTS: { x: number; z: number }[] = [KARST_AT];
/** G3 (EXPANSION.md): danger is placement, keyed to distance from the nearest karst: none within DANGER_SAFE m of one, full by DANGER_FAR. Tuning. */
export const DANGER_SAFE = 250, DANGER_FAR = 1200;
export function danger(x: number, z: number, karsts = KARSTS): number { let d = Infinity; for (const k of karsts) d = Math.min(d, Math.hypot(x - k.x, z - k.z)); const t = Math.max(0, Math.min(1, (d - DANGER_SAFE) / (DANGER_FAR - DANGER_SAFE))); return t * t * (3 - 2 * t); }
/** Dens: the land in cells of DEN_CELL m, DEN_RANGE cells out from the village each way; a cell holds a den with DEN_CHANCE times its danger, of a tier by the danger (1 to 3; PACK_BASE + tier wolves), never within DEN_CLEAR of the village, the karst's clearing or the dark forest. A den's pack comes down on a village within DEN_REACH. Tuning. */
export const DEN_CELL = 300, DEN_RANGE = 6, DEN_CHANCE = 0.35, DEN_CLEAR = 150, DEN_REACH = 500, DEN_RADIUS = 40, PACK_BASE = 2;
export interface Den { id: string; x: number; z: number; tier: number; pack: number }
const denCache = new Map<number, Den[]>();
export function dens(seed: number): Den[] {
  const cached = denCache.get(seed); if (cached) return cached;
  const lair = basePlaces(seed).find(p => p.id === 'lair')!, out: Den[] = [];
  for (let cx = -DEN_RANGE; cx <= DEN_RANGE; cx++) for (let cz = -DEN_RANGE; cz <= DEN_RANGE; cz++) {
    const rand = mulberry32((seed * 9173 + (cx + 50) * 613 + (cz + 50) * 7919 + 100003) >>> 0);
    const x = Math.round((cx + 0.5) * DEN_CELL + (rand() - 0.5) * 0.6 * DEN_CELL), z = Math.round((cz + 0.5) * DEN_CELL + (rand() - 0.5) * 0.6 * DEN_CELL), dg = danger(x, z), roll = rand();
    if (roll >= dg * DEN_CHANCE) continue;
    if (Math.hypot(x, z) < VILLAGE_RADIUS + DEN_CLEAR || Math.hypot(x - KARST_AT.x, z - KARST_AT.z) < 100 + DEN_CLEAR || Math.hypot(x - lair.x, z - lair.z) < FOREST_RADIUS + DEN_CLEAR || villageSites(seed).some(v => Math.hypot(x - v.x, z - v.z) < VILLAGE_RADIUS + DEN_CLEAR)) continue;
    const tier = 1 + Math.min(2, Math.floor(dg * 3)); out.push({ id: `den-${cx},${cz}`, x, z, tier, pack: PACK_BASE + tier });
  }
  denCache.set(seed, out); return out;
}
function basePlaces(seed: number): Place[] {
  const rand = mulberry32((seed * 3251 + 17) >>> 0); const a = 0.55 + rand() * 1.4; // south-east to south-west: away from the karst
  return [
    { id: 'village', kind: 'village', name: 'the village', x: 0, z: 0, radius: VILLAGE_RADIUS },
    { id: 'karst', kind: 'karst', name: 'the karst', x: KARST_AT.x, z: KARST_AT.z, radius: 60 },
    { id: 'lair', kind: 'lair', name: 'the dark forest', x: Math.round(Math.cos(a) * LAIR_DISTANCE), z: Math.round(Math.sin(a) * LAIR_DISTANCE), radius: FOREST_RADIUS },
  ];
}
/** G4 (EXPANSION.md): the other villages. Same folk, other names (villageModel's FOLK), each a whole village of its own on calmer ground: within SITE_KARST of the karst (the danger field's safe side, where the dens are few), SITE_NEAR to SITE_FAR from the first village, past the dark forest by SITE_LAIR (so the first village is always the nearest to the lair), and SITE_APART from one another. Placed by the seed. Their names and folk pools are authored (SITE_NAMES), in order. Tuning. */
export const VILLAGE_RADIUS = 44, SITE_KARST: [number, number] = [560, 700], SITE_NEAR = 650, SITE_FAR = 1400, SITE_LAIR = 500, SITE_APART = 450;
export const SITE_NAMES: { short: string; name: string }[] = [{ short: 'the ford', name: 'the village at the ford' }, { short: 'the pines', name: 'the village under the pines' }];
export interface VillageSite { id: string; folk: number; short: string; name: string; x: number; z: number }
const siteCache = new Map<number, VillageSite[]>();
export function villageSites(seed: number): VillageSite[] {
  const cached = siteCache.get(seed); if (cached) return cached;
  const rand = mulberry32((seed * 5417 + 91) >>> 0), lair = basePlaces(seed)[2], out: VillageSite[] = [];
  for (let i = 0; i < 60 && out.length < SITE_NAMES.length; i++) {
    const a = rand() * Math.PI * 2, r = SITE_KARST[0] + rand() * (SITE_KARST[1] - SITE_KARST[0]), x = Math.round(KARST_AT.x + Math.cos(a) * r), z = Math.round(KARST_AT.z + Math.sin(a) * r), d = Math.hypot(x, z);
    if (d < SITE_NEAR || d > SITE_FAR || Math.hypot(x - lair.x, z - lair.z) < SITE_LAIR || out.some(o => Math.hypot(o.x - x, o.z - z) < SITE_APART)) continue;
    const k = out.length + 1; out.push({ id: `village-${k}`, folk: k, ...SITE_NAMES[k - 1], x, z });
  }
  siteCache.set(seed, out); return out;
}
/** Every place: the village, the karst, the lair, the other villages, and the dens. */
export function places(seed: number): Place[] { return [...basePlaces(seed), ...villageSites(seed).map(s => ({ id: s.id, kind: 'village' as const, name: s.name, x: s.x, z: s.z, radius: VILLAGE_RADIUS })), ...dens(seed).map(d => ({ id: d.id, kind: 'den' as const, name: "a wolves' den", x: d.x, z: d.z, radius: DEN_RADIUS, tier: d.tier }))]; }
/** Exploration: cells of CELL m, revealed within EXPLORE_RADIUS of where she stands. Tuning. */
export const CELL = 24, EXPLORE_RADIUS = 70;
/** G2: a hint is what the villagers said of a place she has not found: a bearing from the green and the words, drawn on the map as a fan HINT_REACH m long, HINT_SPREAD either side, until she finds the place. Tuning. */
export interface Hint { about: string; bearing: number; text: string; from?: { x: number; z: number } }
export const HINT_REACH = 320, HINT_SPREAD = 22;
/** Where a hint's fan starts: the green of the village that said it (G4), the first village's when none is given. */
export const hintFrom = (h: Hint): { x: number; z: number } => h.from ?? { x: 0, z: 0 };
export interface Overworld { seed: number; revealed: Set<string>; known: Set<string>; hints: Hint[] }
export const freshOverworld = (seed = 1): Overworld => ({ seed, revealed: new Set(), known: new Set(['village', 'karst']), hints: [] });
/** A hint from talk: one per subject, nothing for a place already known. Returns whether it is new. */
export function addHint(o: Overworld, h: Hint): boolean { if (o.known.has(h.about)) return false; const i = o.hints.findIndex(x => x.about === h.about); if (i >= 0) { o.hints[i] = h; return false; } o.hints.push(h); return true; }
export const cellKey = (cx: number, cz: number): string => `${cx},${cz}`;
export const cellOf = (x: number, z: number): { cx: number; cz: number } => ({ cx: Math.floor(x / CELL), cz: Math.floor(z / CELL) });
/** Reveal the cells round a point. Returns how many were new. */
export function explore(o: Overworld, x: number, z: number, radius = EXPLORE_RADIUS): number {
  let n = 0; const r = Math.ceil(radius / CELL), c = cellOf(x, z);
  for (let i = -r; i <= r; i++) for (let k = -r; k <= r; k++) { const cx = c.cx + i, cz = c.cz + k, mx = (cx + 0.5) * CELL, mz = (cz + 0.5) * CELL; if (Math.hypot(mx - x, mz - z) <= radius) { const key = cellKey(cx, cz); if (!o.revealed.has(key)) { o.revealed.add(key); n++; } } }
  for (const p of places(o.seed)) if (Math.hypot(p.x - x, p.z - z) <= p.radius + radius) o.known.add(p.id);
  o.hints = o.hints.filter(h => !o.known.has(h.about));
  return n;
}
export const isRevealed = (o: Overworld, x: number, z: number): boolean => { const c = cellOf(x, z); return o.revealed.has(cellKey(c.cx, c.cz)); };
export const knownPlaces = (o: Overworld): Place[] => places(o.seed).filter(p => o.known.has(p.id));
export const serializeOverworld = (o: Overworld): string => JSON.stringify({ seed: o.seed, revealed: [...o.revealed], known: [...o.known], hints: o.hints });
export function parseOverworld(raw: string | null): Overworld {
  try { const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshOverworld(); const o = freshOverworld(Number.isFinite(p.seed) ? p.seed : 1); if (Array.isArray(p.revealed)) for (const k of p.revealed) if (typeof k === 'string' && /^-?\d+,-?\d+$/.test(k)) o.revealed.add(k); if (Array.isArray(p.known)) for (const k of p.known) if (typeof k === 'string' && (['village', 'karst', 'lair'].includes(k) || /^den--?\d+,-?\d+$/.test(k) || /^village-\d$/.test(k))) o.known.add(k); if (Array.isArray(p.hints)) for (const h of p.hints) if (h && typeof h.about === 'string' && typeof h.text === 'string' && Number.isFinite(h.bearing) && !o.known.has(h.about)) o.hints.push({ about: h.about, bearing: ((h.bearing % 360) + 360) % 360, text: h.text, ...(h.from && Number.isFinite(h.from.x) && Number.isFinite(h.from.z) ? { from: { x: h.from.x, z: h.from.z } } : {}) }); return o; } catch { return freshOverworld(); }
}
/** The pinch: the camera pulls from ZOOM_MIN m at her shoulder to ZOOM_MAX m overhead, its elevation rising from ELEV_LOW to ELEV_HIGH with the distance; past the end, the map. Tuning. */
export const ZOOM_MIN = 3, ZOOM_MAX = 40, ELEV_LOW = 0.38, ELEV_HIGH = 1.36;
export const zoomElevation = (zoom: number): number => ELEV_LOW + (ELEV_HIGH - ELEV_LOW) * Math.min(1, Math.max(0, (zoom - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)));
/** A bearing in degrees for a direction on the land: 0 north (negative z, the karst's way), 90 east (positive x), 180 south, 270 west. */
export const bearingOf = (dx: number, dz: number): number => ((Math.atan2(dx, -dz) * 180 / Math.PI) + 360) % 360;
/** A difference of bearings wrapped to -180..180. */
export const wrapDeg = (d: number): number => ((d + 540) % 360) - 180;
