// The village, V0: presence. Eight named hobbits in six houses round a green, on a day's rhythm:
// out at dawn to the place each keeps to, together on the green at noon, back to their doors at
// dusk, asleep inside at night. No needs, no stores yet: the question this pass asks is whether
// figures going in and out of houses on a day's rhythm already read as people living there.
// A pure model: deterministic from its seed, stepped in ticks, saved as state. No Three.js here.
import { mulberry32 } from './colors';

/** One tick is one sim minute; a day is 1440 of them and takes DAY_REAL_SECONDS of real time. Tuning. */
export const DAY_TICKS = 1440, DAY_REAL_SECONDS = 20 * 60, TICKS_PER_SECOND = DAY_TICKS / DAY_REAL_SECONDS;
/** The day starts at dawn: tick 0 is 06:00. */
export const DAY_START_HOUR = 6;
export type Phase = 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night';
/** Phase boundaries in ticks from 06:00: dawn to 07:30, morning to 11:30, noon to 13:00, afternoon to 18:00, dusk to 19:30, then night. Tuning. */
export const PHASES: [Phase, number][] = [['dawn', 0], ['morning', 90], ['noon', 330], ['afternoon', 420], ['dusk', 720], ['night', 810]];
export const phaseAt = (tick: number): Phase => { const t = ((tick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS; let p: Phase = 'night'; for (const [name, from] of PHASES) if (t >= from) p = name; return p; };
export const clockOf = (tick: number): { day: number; hour: number; minute: number } => { const t = ((tick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS, minutes = (DAY_START_HOUR * 60 + t) % 1440; return { day: Math.floor(tick / DAY_TICKS) + 1, hour: Math.floor(minutes / 60), minute: minutes % 60 }; };
/** Sun height 0..1 over the day (0 at night), for the light: up at half past five, down at half past seven. */
export const daylightAt = (tick: number): number => { const t = ((tick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS; const h = (DAY_START_HOUR * 60 + t) / 60; return Math.max(0, Math.sin(((h - 5.5) / 14) * Math.PI)); };

export interface Vec2 { x: number; z: number }
/** The layout: houses on a ring round the green, the fire at its centre, the places they go at the gaps. */
/** Houses are hobbit-sized: a round wall 1.35 m across the radius, under a thatch that peaks at about a metre and three quarters. */
export const GREEN = { x: 0, z: 0 }, HOUSE_RING = 9, HOUSE_RADIUS = 1.35, MEADOW_RADIUS = 44;
export interface House { id: number; x: number; z: number; facing: number; door: Vec2 }
export const HOUSES: House[] = Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2 + 0.3, x = Math.cos(a) * HOUSE_RING, z = Math.sin(a) * HOUSE_RING, facing = a + Math.PI; return { id: i, x, z, facing, door: { x: x + Math.cos(facing) * (HOUSE_RADIUS + 0.4), z: z + Math.sin(facing) * (HOUSE_RADIUS + 0.4) } }; });
export type SiteKind = 'thicket' | 'stream' | 'copse' | 'field' | 'pen' | 'shrine' | 'fire';
export interface Site { id: SiteKind; x: number; z: number; radius: number; verb: string }
const gap = (i: number, r: number): Vec2 => { const a = (i + 0.5) / 6 * Math.PI * 2 + 0.3; return { x: Math.cos(a) * r, z: Math.sin(a) * r }; };
export const SITES: Record<SiteKind, Site> = {
  fire: { id: 'fire', ...GREEN, radius: 2.4, verb: 'at the fire' },
  thicket: { id: 'thicket', ...gap(0, 21), radius: 3, verb: 'picking berries' },
  stream: { id: 'stream', ...gap(1, 24), radius: 3, verb: 'at the stream' },
  copse: { id: 'copse', ...gap(2, 23), radius: 3.5, verb: 'in the copse' },
  field: { id: 'field', ...gap(3, 20), radius: 3, verb: 'at the field' },
  pen: { id: 'pen', ...gap(4, 19), radius: 2.5, verb: 'with the goats' },
  shrine: { id: 'shrine', ...gap(5, 22), radius: 2, verb: 'at the stone' },
};
/** A hobbit: a name, a home, the place they keep to, and the small differences that show before there are roles. */
export interface Hobbit { id: string; name: string; home: number; keeps: SiteKind; rises: number; pace: number; colour: string; hair: string }
/** Eight hobbits, two to a house in two of the six. `rises` is minutes after dawn they leave; `pace` their walking speed in m/s. Tuning. */
export const HOBBITS: Hobbit[] = [
  { id: 'marlo', name: 'Marlo', home: 0, keeps: 'copse', rises: 8, pace: 1.15, colour: '#7a5a3a', hair: '#3a2a1c' },
  { id: 'tansy', name: 'Tansy', home: 0, keeps: 'thicket', rises: 20, pace: 1.0, colour: '#9a6c4a', hair: '#8a4a2a' },
  { id: 'pip', name: 'Pip', home: 1, keeps: 'stream', rises: 2, pace: 1.3, colour: '#5c7a4a', hair: '#c8903a' },
  { id: 'wren', name: 'Wren', home: 2, keeps: 'field', rises: 14, pace: 1.05, colour: '#6b6a8a', hair: '#2a2a2a' },
  { id: 'bram', name: 'Bram', home: 3, keeps: 'pen', rises: 30, pace: 0.9, colour: '#8a5a5a', hair: '#5a3a2a' },
  { id: 'hazel', name: 'Hazel', home: 3, keeps: 'thicket', rises: 26, pace: 1.1, colour: '#a07a4a', hair: '#7a4a2a' },
  { id: 'odo', name: 'Odo', home: 4, keeps: 'fire', rises: 45, pace: 0.75, colour: '#7a7a6a', hair: '#d8d0c0' },
  { id: 'nell', name: 'Nell', home: 5, keeps: 'shrine', rises: 10, pace: 0.95, colour: '#5a6a7a', hair: '#3a2a2a' },
];
export type Activity = 'sleeping' | 'walking' | 'working' | 'talking' | 'returning';
export type Want = 'home' | 'place' | 'green';
export interface HobbitState { id: string; x: number; z: number; heading: number; activity: Activity; want: Want; path: Vec2[]; speed: number; inside: boolean; bubble: string; bubbleUntil: number; wanderAt: number }
export interface Village { seed: number; tick: number; hobbits: HobbitState[] }
export const hobbitById = (id: string): Hobbit => HOBBITS.find(h => h.id === id)!;
export const houseOf = (h: Hobbit): House => HOUSES[h.home];
export function freshVillage(seed = 1): Village {
  return { seed, tick: 0, hobbits: HOBBITS.map(h => { const d = houseOf(h).door; return { id: h.id, x: d.x, z: d.z, heading: houseOf(h).facing, activity: 'sleeping', want: 'home', path: [], speed: 0, inside: true, bubble: '', bubbleUntil: 0, wanderAt: 0 }; }) };
}
/** Where the day's rhythm wants a hobbit to be: home, their place, or the green. */
export function wants(h: Hobbit, tick: number): Want {
  const t = ((tick % DAY_TICKS) + DAY_TICKS) % DAY_TICKS, phase = phaseAt(tick);
  if (phase === 'night') return 'home';
  if (phase === 'dawn') return t >= h.rises ? 'place' : 'home';
  if (phase === 'noon') return 'green';
  if (phase === 'dusk') return t >= PHASES[4][1] + h.rises / 2 ? 'home' : 'place';
  return 'place';
}
const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
const wrapAngle = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
/** Paths cross the green rather than the houses: from outside the ring, in along its own gap to the green first; out along the way's gap. */
export const GREEN_RADIUS = 4.5, RING_INNER = HOUSE_RING - 2.0;
export function route(from: Vec2, to: Vec2): Vec2[] {
  const rf = Math.hypot(from.x, from.z), rt = Math.hypot(to.x, to.z), path: Vec2[] = [];
  const onGreen = (p: Vec2): Vec2 => { const a = Math.atan2(p.z, p.x); return { x: Math.cos(a) * GREEN_RADIUS, z: Math.sin(a) * GREEN_RADIUS }; };
  if (rf >= RING_INNER && rt >= RING_INNER && Math.abs(wrapAngle(Math.atan2(to.z, to.x) - Math.atan2(from.z, from.x))) < 0.3) return [{ ...to }];
  if (rf >= RING_INNER) path.push(onGreen(from));
  if (rt >= RING_INNER) path.push(onGreen(to));
  path.push({ ...to }); return path;
}
/** A spot near a site to stand at, off its centre, so a group does not stand in one point. */
function spotAt(site: Site, rand: () => number, ring = 0.55): Vec2 { const a = rand() * Math.PI * 2, r = site.radius * (0.35 + rand() * ring); return { x: site.x + Math.cos(a) * r, z: site.z + Math.sin(a) * r }; }
/** Walking is shown at real pace: a hobbit at 1 m/s covers a metre per real second, which is TICKS_PER_SECOND ticks; so a tick moves 1/TICKS_PER_SECOND of the pace. */
export const PACE_TICK = 1 / TICKS_PER_SECOND;
export const BUBBLE_TICKS = 8, WANDER_EVERY = 25;
const CHATTER = ['…', 'the berries are early', 'the stream is low', 'Odo says rain', 'Pip fell in', 'a fox by the pen', 'the stone was warm'];
/** Advance the village by whole ticks. Deterministic: the only randomness is the seeded stream, drawn in a fixed order. */
export function advance(v: Village, ticks: number): void {
  for (let n = 0; n < ticks; n++) {
    const rand = mulberry32((v.seed * 7919 + v.tick * 131) >>> 0);
    for (const s of v.hobbits) {
      const h = hobbitById(s.id), house = houseOf(h), want = wants(h, v.tick);
      const say = (text: string): void => { s.bubble = text; s.bubbleUntil = v.tick + BUBBLE_TICKS; };
      const site = want === 'home' ? null : want === 'green' ? SITES.fire : SITES[h.keeps];
      if (want !== s.want) {
        // The rhythm has moved on: a new place to be. Out of the door first if inside.
        s.want = want;
        if (s.inside) { s.inside = false; s.x = house.door.x; s.z = house.door.z; s.heading = house.facing; }
        s.path = route(s, site ? spotAt(site, rand) : house.door); s.activity = want === 'home' ? 'returning' : 'walking';
        say(want === 'home' ? 'home' : want === 'green' ? 'to the fire' : SITES[h.keeps].verb);
      }
      if (s.inside) { s.activity = 'sleeping'; s.speed = 0; continue; }
      if (s.path.length) {
        const step = s.path[0], d = dist(s, step), move = Math.min(d, h.pace * PACE_TICK);
        if (d > 1e-6) { s.heading = Math.atan2(step.z - s.z, step.x - s.x); s.x += (step.x - s.x) / d * move; s.z += (step.z - s.z) / d * move; }
        s.speed = h.pace;
        if (d <= move + 1e-6) {
          s.path.shift();
          if (s.path.length === 0) {
            if (!site) { s.inside = true; s.activity = 'sleeping'; s.speed = 0; s.x = house.door.x; s.z = house.door.z; say(''); }
            else { s.speed = 0; s.wanderAt = v.tick + WANDER_EVERY + Math.floor(rand() * WANDER_EVERY); }
          }
        }
        continue;
      }
      // At their place: stand, and now and then move a step within it; on the green, face the fire and talk.
      s.speed = 0;
      if (want === 'green' || h.keeps === 'fire') { s.activity = 'talking'; s.heading = Math.atan2(SITES.fire.z - s.z, SITES.fire.x - s.x); if (v.tick % 40 === 0 && rand() < 0.5) say(CHATTER[Math.floor(rand() * CHATTER.length)]); }
      else s.activity = 'working';
      if (site && v.tick >= s.wanderAt) { s.path = [spotAt(site, rand, 0.65)]; s.activity = 'walking'; s.wanderAt = v.tick + WANDER_EVERY + Math.floor(rand() * WANDER_EVERY); }
    }
    v.tick++;
  }
}
export const everyone = (v: Village, where: 'inside' | 'green' | 'out'): number => v.hobbits.filter(s => where === 'inside' ? s.inside : where === 'green' ? !s.inside && dist(s, SITES.fire) <= SITES.fire.radius + 0.3 : !s.inside).length;
export const inHouse = (p: Vec2): House | null => HOUSES.find(h => dist(p, h) < HOUSE_RADIUS - 0.05) ?? null;
export function parseVillage(raw: string | null): Village {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object' || !Array.isArray(p.hobbits) || p.hobbits.length !== HOBBITS.length) return freshVillage();
    const v = freshVillage(Number.isFinite(p.seed) ? p.seed : 1); v.tick = Number.isInteger(p.tick) && p.tick >= 0 ? p.tick : 0;
    for (let i = 0; i < HOBBITS.length; i++) {
      const s = p.hobbits[i], t = v.hobbits[i]; if (!s || s.id !== t.id) return freshVillage();
      for (const k of ['x', 'z', 'heading', 'speed', 'bubbleUntil', 'wanderAt'] as const) if (Number.isFinite(s[k])) (t as unknown as Record<string, number>)[k] = s[k];
      t.inside = s.inside === true; t.activity = ['sleeping', 'walking', 'working', 'talking', 'returning'].includes(s.activity) ? s.activity : 'sleeping'; t.want = ['home', 'place', 'green'].includes(s.want) ? s.want : 'home';
      t.path = Array.isArray(s.path) ? s.path.filter((q: unknown) => q && Number.isFinite((q as Vec2).x) && Number.isFinite((q as Vec2).z)).map((q: Vec2) => ({ x: q.x, z: q.z })).slice(0, 4) : []; t.bubble = typeof s.bubble === 'string' ? s.bubble.slice(0, 40) : '';
    }
    return v;
  } catch { return freshVillage(); }
}
export const serializeVillage = (v: Village): string => JSON.stringify({ seed: v.seed, tick: v.tick, hobbits: v.hobbits.map(s => ({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, heading: Math.round(s.heading * 1000) / 1000 })) });
