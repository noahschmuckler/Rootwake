// The village, V0: presence. Eight named hobbits in six houses round a green, on a day's rhythm:
// out at dawn to the place each keeps to, together on the green at noon, back to their doors at
// dusk, asleep inside at night. No needs, no stores yet: the question this pass asks is whether
// figures going in and out of houses on a day's rhythm already read as people living there.
// A pure model: deterministic from its seed, stepped in ticks, saved as state. No Three.js here.
import { CatmullRomCurve3, Vector3 } from 'three';
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
/** A site: where it is, how wide, its name in a thought ('the thicket'), and what one does there ('gathering berries'). */
export interface Site { id: SiteKind; x: number; z: number; radius: number; name: string; verb: string }
const gap = (i: number, r: number): Vec2 => { const a = (i + 0.5) / 6 * Math.PI * 2 + 0.3; return { x: Math.cos(a) * r, z: Math.sin(a) * r }; };
export const SITES: Record<SiteKind, Site> = {
  fire: { id: 'fire', ...GREEN, radius: 2.4, name: 'the fire', verb: 'keeping the fire' },
  thicket: { id: 'thicket', ...gap(0, 21), radius: 3, name: 'the thicket', verb: 'gathering berries' },
  stream: { id: 'stream', ...gap(1, 24), radius: 3, name: 'the stream', verb: 'fetching water' },
  copse: { id: 'copse', ...gap(2, 23), radius: 3.5, name: 'the copse', verb: 'gathering wood' },
  field: { id: 'field', ...gap(3, 20), radius: 3, name: 'the field', verb: 'tending the field' },
  pen: { id: 'pen', ...gap(4, 19), radius: 2.5, name: 'the pen', verb: 'milking the goats' },
  shrine: { id: 'shrine', ...gap(5, 22), radius: 2, name: 'the stone', verb: 'tending the stone' },
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
export interface HobbitState { id: string; x: number; z: number; heading: number; activity: Activity; want: Want; path: Vec2[]; speed: number; inside: boolean; bubble: string; bubbleUntil: number; wanderAt: number; faceAt: number }
export interface Village { seed: number; tick: number; hobbits: HobbitState[] }
export const hobbitById = (id: string): Hobbit => HOBBITS.find(h => h.id === id)!;
export const houseOf = (h: Hobbit): House => HOUSES[h.home];
export function freshVillage(seed = 1): Village {
  return { seed, tick: 0, hobbits: HOBBITS.map(h => { const d = houseOf(h).door; return { id: h.id, x: d.x, z: d.z, heading: houseOf(h).facing, activity: 'sleeping', want: 'home', path: [], speed: 0, inside: true, bubble: '', bubbleUntil: 0, wanderAt: 0, faceAt: 0 }; }) };
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
/** At a place they take a step to a new spot every WANDER_EVERY to twice that ticks, and turn to face something else every FACE_EVERY to twice that. Tuning. */
export const BUBBLE_TICKS = 8, WANDER_EVERY = 14, FACE_EVERY = 5;
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
        say('');
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
      // At their place: stand, turn to face one thing then another, and now and then take a step to a new spot; on the green, face the fire and talk.
      s.speed = 0;
      if (want === 'green' || h.keeps === 'fire') { s.activity = 'talking'; s.heading = Math.atan2(SITES.fire.z - s.z, SITES.fire.x - s.x); if (v.tick % 40 === 0 && rand() < 0.5) say(CHATTER[Math.floor(rand() * CHATTER.length)]); }
      else { s.activity = 'working'; if (site && v.tick >= s.faceAt) { s.heading = Math.atan2(site.z - s.z, site.x - s.x) + (rand() - 0.5) * 2.4; s.faceAt = v.tick + FACE_EVERY + Math.floor(rand() * FACE_EVERY); } }
      if (site && v.tick >= s.wanderAt) { s.path = [spotAt(site, rand, 0.65)]; s.activity = 'walking'; s.wanderAt = v.tick + WANDER_EVERY + Math.floor(rand() * WANDER_EVERY); }
    }
    v.tick++;
  }
}
/** What a hobbit is thinking, always: the chatter while it lasts, else where they are going or what they are doing. */
export function thought(s: HobbitState, tick: number): string {
  if (s.inside) return '';
  if (s.bubble && tick < s.bubbleUntil) return s.bubble;
  const h = hobbitById(s.id);
  if (s.activity === 'returning') return 'going home';
  if (s.activity === 'walking' && s.path.length && s.want !== 'place') return s.want === 'green' ? 'walking to the fire' : 'going home';
  if (s.activity === 'walking' && s.path.length > 1) return `walking to ${SITES[h.keeps].name}`;
  if (s.want === 'green' || (s.activity === 'talking' && h.keeps === 'fire')) return h.keeps === 'fire' && s.want !== 'green' ? SITES.fire.verb : 'talking by the fire';
  return SITES[h.keeps].verb;
}
export const everyone = (v: Village, where: 'inside' | 'green' | 'out'): number => v.hobbits.filter(s => where === 'inside' ? s.inside : where === 'green' ? !s.inside && dist(s, SITES.fire) <= SITES.fire.radius + 0.3 : !s.inside).length;
export const inHouse = (p: Vec2): House | null => HOUSES.find(h => dist(p, h) < HOUSE_RADIUS - 0.05) ?? null;
export function parseVillage(raw: string | null): Village {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object' || !Array.isArray(p.hobbits) || p.hobbits.length !== HOBBITS.length) return freshVillage();
    const v = freshVillage(Number.isFinite(p.seed) ? p.seed : 1); v.tick = Number.isInteger(p.tick) && p.tick >= 0 ? p.tick : 0;
    for (let i = 0; i < HOBBITS.length; i++) {
      const s = p.hobbits[i], t = v.hobbits[i]; if (!s || s.id !== t.id) return freshVillage();
      for (const k of ['x', 'z', 'heading', 'speed', 'bubbleUntil', 'wanderAt', 'faceAt'] as const) if (Number.isFinite(s[k])) (t as unknown as Record<string, number>)[k] = s[k];
      t.inside = s.inside === true; t.activity = ['sleeping', 'walking', 'working', 'talking', 'returning'].includes(s.activity) ? s.activity : 'sleeping'; t.want = ['home', 'place', 'green'].includes(s.want) ? s.want : 'home';
      t.path = Array.isArray(s.path) ? s.path.filter((q: unknown) => q && Number.isFinite((q as Vec2).x) && Number.isFinite((q as Vec2).z)).map((q: Vec2) => ({ x: q.x, z: q.z })).slice(0, 4) : []; t.bubble = typeof s.bubble === 'string' ? s.bubble.slice(0, 40) : '';
    }
    return v;
  } catch { return freshVillage(); }
}
export const serializeVillage = (v: Village): string => JSON.stringify({ seed: v.seed, tick: v.tick, hobbits: v.hobbits.map(s => ({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, heading: Math.round(s.heading * 1000) / 1000 })) });

// Hulda's ways through the meadow. Grass roots are everywhere she can walk: a free medium, faster than
// running, shown as a bulge under the grass. Tree roots join the trees of the copse and the wood: fixed
// lanes, faster still. Every tree can be entered, climbed to its crown and leapt from.
export const GRASS_SPEED = 3.8, ROOT_SPEED = 6.5, TRUNK_CLIMB = 2.4, CROWN_SLIDE = 1.7, HOP_S = 0.9, HOP_REACH = 9, HOP_RISE = 7, PRESS_S = 0.35, PRESS_RANGE = 0.6, ENTER_RANGE = 3.2;
export interface Tree { id: number; x: number; z: number; size: number }
export const crownHeight = (t: Tree): number => 3.4 * t.size;
export const trunkRadius = (t: Tree): number => 0.32 * t.size;
/** The stream's course, for what is water: a bank either side of this line. */
export const STREAM_Z = (x: number): number => 27 + 2.5 * Math.sin(x * 0.11 + 0.4), STREAM_HALF = 1.9;
export const inWater = (x: number, z: number): boolean => Math.abs(z - STREAM_Z(x)) < STREAM_HALF;
export const TREES: Tree[] = (() => {
  const rand = mulberry32(220926 + 7), out: Tree[] = [];
  for (let i = 0; i < 60 && out.length < 6; i++) { const a = rand() * 6.28, r = 1 + rand() * 3.2, x = SITES.copse.x + Math.cos(a) * r, z = SITES.copse.z + Math.sin(a) * r; if (out.some(t => Math.hypot(t.x - x, t.z - z) < 2.6)) continue; out.push({ id: out.length, x, z, size: 0.9 + rand() * 0.5 }); }
  for (let i = 0; i < 140; i++) { const a = rand() * 6.28, r = MEADOW_RADIUS - 4 + rand() * 40, x = Math.cos(a) * r, z = Math.sin(a) * r; if (inWater(x, z) || Math.abs(z - STREAM_Z(x)) < 4) continue; if (out.some(t => Math.hypot(t.x - x, t.z - z) < 3.2)) continue; out.push({ id: out.length, x, z, size: 0.9 + rand() * 0.7 }); }
  return out;
})();
export interface RootEdge { id: string; a: number; b: number; curve: CatmullRomCurve3; length: number; samples: Vector3[] }
export const ROOT_LINK = 11;
/** Every tree joins its nearest three within reach; the network runs under the soil between the trunks. */
export const TREE_ROOTS: RootEdge[] = (() => {
  const out: RootEdge[] = [], seen = new Set<string>();
  for (const t of TREES) {
    const near = TREES.filter(o => o !== t && Math.hypot(o.x - t.x, o.z - t.z) <= ROOT_LINK).sort((p, q) => Math.hypot(p.x - t.x, p.z - t.z) - Math.hypot(q.x - t.x, q.z - t.z)).slice(0, 3);
    for (const o of near) { const key = [Math.min(t.id, o.id), Math.max(t.id, o.id)].join('-'); if (seen.has(key)) continue; seen.add(key); const A = new Vector3(t.x, -0.3, t.z), B = new Vector3(o.x, -0.3, o.z), mid = A.clone().lerp(B, 0.5); mid.y = -1.0 - A.distanceTo(B) * 0.04; const q1 = A.clone().lerp(B, 0.25); q1.y = -0.75; const q3 = A.clone().lerp(B, 0.75); q3.y = -0.75; const curve = new CatmullRomCurve3([A, q1, mid, q3, B], false, 'centripetal', 0.5); out.push({ id: key, a: t.id, b: o.id, curve, length: curve.getLength(), samples: curve.getSpacedPoints(Math.max(8, Math.ceil(curve.getLength() * 2))) }); }
  }
  return out;
})();
export const rootsAt = (treeId: number): RootEdge[] => TREE_ROOTS.filter(r => r.a === treeId || r.b === treeId);
export function nearestRoot(p: { x: number; z: number }): { root: RootEdge; s: number; distance: number } {
  let best = { root: TREE_ROOTS[0], s: 0, distance: Infinity };
  for (const r of TREE_ROOTS) for (let i = 0; i < r.samples.length; i++) { const d = Math.hypot(p.x - r.samples[i].x, p.z - r.samples[i].z); if (d < best.distance) best = { root: r, s: i / (r.samples.length - 1) * r.length, distance: d }; }
  return best;
}
/** The root she takes when running through the grass: any root within reach whose run agrees with hers (|cos| ≥ minDot), the best aligned first. Every root near her is a candidate, not only the nearest, so a crossing is not missed for a neighbour. */
export function alignedRoot(p: { x: number; z: number }, dir: { x: number; z: number }, within: number, minDot: number): { root: RootEdge; s: number; forward: boolean } | null {
  let best: { root: RootEdge; s: number; forward: boolean; dot: number } | null = null;
  for (const r of TREE_ROOTS) {
    let near = { i: -1, d: Infinity }; for (let i = 0; i < r.samples.length; i++) { const d = Math.hypot(p.x - r.samples[i].x, p.z - r.samples[i].z); if (d < near.d) near = { i, d }; }
    if (near.d > within) continue;
    const s = near.i / (r.samples.length - 1) * r.length, t = rootTangent(r, s), len = Math.hypot(t.x, t.z) || 1, dot = (t.x * dir.x + t.z * dir.z) / len;
    if (Math.abs(dot) >= minDot && (!best || Math.abs(dot) > Math.abs(best.dot))) best = { root: r, s, forward: dot > 0, dot };
  }
  return best && { root: best.root, s: best.s, forward: best.forward };
}
export const rootPoint = (r: RootEdge, s: number): Vector3 => r.curve.getPointAt(Math.min(1, Math.max(0, s / r.length)));
export const rootTangent = (r: RootEdge, s: number): Vector3 => r.curve.getTangentAt(Math.min(1, Math.max(0, s / r.length)));
export const endTree = (r: RootEdge, atEnd: boolean): number => (atEnd ? r.b : r.a);
/** Which root to take on leaving a tree along a wanted direction: the best-aligned one, if any is aligned at all. */
export function nextRoot(treeId: number, want: { x: number; z: number }, exclude?: RootEdge): { root: RootEdge; forward: boolean } | null {
  let best: { root: RootEdge; forward: boolean; dot: number } | null = null;
  for (const r of rootsAt(treeId)) {
    if (r === exclude) continue;
    const forward = r.a === treeId, tangent = rootTangent(r, forward ? 0.3 : r.length - 0.3); if (!forward) tangent.negate();
    const l = Math.hypot(tangent.x, tangent.z) || 1, dot = (tangent.x * want.x + tangent.z * want.z) / l;
    if (dot > 0.2 && (!best || dot > best.dot)) best = { root: r, forward, dot };
  }
  return best;
}
export function nearestTree(x: number, z: number): { tree: Tree; distance: number } {
  let best = { tree: TREES[0], distance: Infinity };
  for (const t of TREES) { const d = Math.hypot(x - t.x, z - t.z) - trunkRadius(t); if (d < best.distance) best = { tree: t, distance: d }; }
  return best;
}
export const hopTargets = (t: Tree): Tree[] => TREES.filter(o => o !== t && Math.hypot(o.x - t.x, o.z - t.z) <= HOP_REACH && Math.abs(crownHeight(o) - crownHeight(t)) <= HOP_RISE);
/** Where the grass takes her: the meadow, not the houses, not the water. */
export const grassCan = (x: number, z: number): boolean => Math.hypot(x, z) <= MEADOW_RADIUS + 30 && !inWater(x, z) && !HOUSES.some(h => Math.hypot(x - h.x, z - h.z) < HOUSE_RADIUS + 0.2);
