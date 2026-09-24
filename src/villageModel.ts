// The village, V1: hunger and the land. Eight named hobbits in six houses round a green, on a day's
// rhythm: out at dawn to the place each keeps to, together on the green at noon, back to their doors
// at dusk, asleep inside at night. Now they gather what the land gives each day (berries that regrow,
// branches that drop, milk the goats have, grain from strips that ripen over days, water from the
// stream), carry it in view to stores on the green's edge, and eat from those stores twice a day; the
// fire burns the wood Odo fetches. The stores' caps bound the take, so left alone the village holds a
// steady state: no births, no deaths, the daily rhythm. The question this pass asks is whether the
// village is legible as a system, and whether what it takes from the land can be read off the land.
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
/** How far out she can walk: the meadow and the wood round it (the wood's trees stand out to MEADOW_RADIUS + 36). */
export const WALK_RADIUS = MEADOW_RADIUS + 40;
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

// The stores and the land (V1). What a place yields goes to one store on the green's edge, in the open,
// on the side of the green that faces the place it comes from; the stores are what the village eats and
// burns, and their caps are what bounds the take: a full basket rack sends the gatherer home empty-handed.
export type Store = 'berries' | 'milk' | 'grain' | 'wood' | 'water';
export const STORE_LIST: Store[] = ['berries', 'water', 'wood', 'grain', 'milk'];
/** The three that are food; a meal is one unit from whichever is fullest by share of its cap. */
export const FOODS: Store[] = ['berries', 'milk', 'grain'];
export interface StoreSpot { id: Store; x: number; z: number; name: string; cap: number; unit: string }
/** Stores stand on the green's edge at STORE_RING m from the fire, each at the gap that leads to its place. Caps: tuning. */
export const STORE_RING = 3.7;
export const STORES: Record<Store, StoreSpot> = {
  berries: { id: 'berries', ...gap(0, STORE_RING), name: 'the baskets', cap: 8, unit: 'berries' },
  water: { id: 'water', ...gap(1, STORE_RING), name: 'the trough', cap: 10, unit: 'water' },
  wood: { id: 'wood', ...gap(2, STORE_RING), name: 'the woodpile', cap: 12, unit: 'wood' },
  grain: { id: 'grain', ...gap(3, STORE_RING), name: 'the bin', cap: 12, unit: 'grain' },
  milk: { id: 'milk', ...gap(4, STORE_RING), name: 'the pails', cap: 8, unit: 'milk' },
};
/** What each place yields, and where it goes. The fire and the stone yield nothing. */
export const YIELD_OF: Partial<Record<SiteKind, Store>> = { thicket: 'berries', stream: 'water', copse: 'wood', field: 'grain', pen: 'milk' };
/** The land's rates, per day unless said. Berries regrow steadily on the bushes up to BERRY_CAP; branches drop under the copse at dawn (up to BRANCH_CAP lying); the goats have MILK_PER_DAY at dawn and no more; each of CROP_STRIPS strips ripens over CROP_DAYS days and gives GRAIN_PER_STRIP, then is sown again; the stream is endless. Tuning. */
export const BERRY_CAP = 35, BERRY_REGROW = 16, BRANCHES_PER_DAY = 6, BRANCH_CAP = 12, MILK_PER_DAY = 6, CROP_STRIPS = 5, CROP_DAYS = 4, GRAIN_PER_STRIP = 6;
/** Gathering is paced to the next meal: one unit every GATHER_TICKS at the place (a session between meals yields about a meal's share of one gatherer's kind); an armful is CARRY units, carried in view to the store; the job (gather or pray) is looked at again every JOB_EVERY. Tuning. */
export const GATHER_TICKS = 40, JOB_EVERY = 20, CARRY: Record<Store, number> = { berries: 4, milk: 3, grain: 6, wood: 3, water: 2 };
/** Eating: three meals a day at the fire (breakfast on the way out at dawn, noon, supper on the way home at dusk), each one unit of the fullest food and, at noon, one of water; a meal takes EAT_TICKS. Hunger climbs from 0 to 1 in HUNGER_DAYS of a day. Tuning. */
export const EAT_TICKS = 12, HUNGER_DAYS = 0.5, HUNGER_PER_TICK = 1 / (DAY_TICKS * HUNGER_DAYS);
/** The fire: Odo fetches WOOD_PER_NIGHT from the woodpile at FIRE_WOOD_TICK (a little before dusk) and the fire burns it through the night. Tuning. */
export const WOOD_PER_NIGHT = 5, FIRE_WOOD_TICK = 690;
export interface Land { berries: number; branches: number; milk: number; crops: number[] }
export interface Carry { kind: Store; n: number }
/** What the village takes from the land in a day, against what the land regrows: the balance Hulda will protect. Kept for the day so far and the last whole day. */
export interface Take { berries: number; wood: number; milk: number; grain: number; water: number }
export const freshTake = (): Take => ({ berries: 0, wood: 0, milk: 0, grain: 0, water: 0 });

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
export type Activity = 'sleeping' | 'walking' | 'working' | 'talking' | 'returning' | 'carrying' | 'eating' | 'praying';
export type Want = 'home' | 'place' | 'green';
/** An errand breaks the rhythm's walk: to a store with an armful ('deliver'), to the fire for a meal on the way out at dawn and on the way home at dusk ('meal'), to the woodpile and back to the fire ('firewood'). */
export type Errand = 'deliver' | 'meal' | 'firewood' | null;
/** What a gatherer is doing with the working day: gathering at their place, or praying at the stone because the stores already hold enough for the next meal. */
export type Job = 'gather' | 'pray';
export interface HobbitState { id: string; x: number; z: number; heading: number; activity: Activity; want: Want; job: Job; path: Vec2[]; speed: number; inside: boolean; bubble: string; bubbleUntil: number; wanderAt: number; faceAt: number; hunger: number; carry: Carry | null; errand: Errand; gatherAt: number; eatUntil: number; jobAt: number; meals: number; ate: number }
/** A forest spirit: summoned for one place's job, it gathers and carries there tirelessly by day, and stands at its place by night. No needs, no home. */
export interface Spirit { id: number; keeps: SiteKind; x: number; z: number; heading: number; path: Vec2[]; speed: number; carry: Carry | null; errand: 'deliver' | null; gatherAt: number; wanderAt: number }
// The Dark Young (the first enemy): oversized goats with writhing tentacle horns and six legs, the get of the
// mother of goats. They shamble in from the wood after nightfall while the villagers sleep, go to the fullest
// store and eat, and slink back to the wood before dawn. The player outpaces them by gathering more than they
// can eat, or fights them. Their walking and eating run in real seconds (stepRaiders), like her fighting, and
// nothing happens while the page is closed; the night's arrival is set by the tick (advance).
export type RaiderState = 'coming' | 'eating' | 'hunting' | 'leaving' | 'dead';
export interface Raider { id: number; x: number; z: number; heading: number; hp: number; state: RaiderState; target: Store | null; ate: number; eatClock: number; aggro: number; rooted: number; biteClock: number; hurt: number; gone: number }
/** Her fighting stat (vigor: bitten down, never to death; at nothing she fades and wakes at the stone, weakened) and her sap (spent by the specials, refilling slowly for now; match-3 is reserved for building it later). */
export interface Hero { vigor: number; sap: number; faint: number; calm: number; xp: number; level: number; choices: number; perks: { vigor: number; strike: number; sap: number } }
/** The lair's manifestation: a local mother of goats at the dark forest's centre, awake while she is near, with its own hp; slain, it is gone for LAIR_PEACE_DAYS and the raids with it, then grows again. */
export interface Lair { hp: number; alive: boolean; slainDay: number; spawnClock: number; sweepClock: number; hurt: number; woke: boolean }
export interface Village { seed: number; tick: number; hobbits: HobbitState[]; stores: Record<Store, number>; land: Land; fireWood: number; take: Take; lastTake: Take; prayer: number; prayed: number; spirits: Spirit[]; stack: Carry | null; raiders: Raider[]; hero: Hero; raidDay: number; slain: number; eaten: number; lair: Lair }
export const hobbitById = (id: string): Hobbit => HOBBITS.find(h => h.id === id)!;
export const houseOf = (h: Hobbit): House => HOUSES[h.home];
/** The first morning: the stores hold some food and a night's wood already (the village has lived here a while), the bushes are full, a few branches lie, the strips are at different stages so that one ripens every day or so. */
export function freshVillage(seed = 1): Village {
  return {
    seed, tick: 0, stores: { berries: 3, milk: 2, grain: 6, wood: 8, water: 5 }, land: { berries: BERRY_CAP, branches: 6, milk: MILK_PER_DAY, crops: Array.from({ length: CROP_STRIPS }, (_, i) => (i + 0.5) / CROP_STRIPS) }, fireWood: 0, take: freshTake(), lastTake: freshTake(), prayer: 0, prayed: 0, spirits: [], stack: null, raiders: [], hero: { vigor: VIGOR_MAX, sap: SAP_MAX, faint: 0, calm: 0, xp: 0, level: 1, choices: 0, perks: { vigor: 0, strike: 0, sap: 0 } }, raidDay: -1, slain: 0, eaten: 0, lair: { hp: LAIR_HP, alive: true, slainDay: -99, spawnClock: 0, sweepClock: 0, hurt: 0, woke: false },
    hobbits: HOBBITS.map(h => { const d = houseOf(h).door; return { id: h.id, x: d.x, z: d.z, heading: houseOf(h).facing, activity: 'sleeping', want: 'home', job: 'gather', path: [], speed: 0, inside: true, bubble: '', bubbleUntil: 0, wanderAt: 0, faceAt: 0, hunger: 0.3, carry: null, errand: null, gatherAt: 0, eatUntil: 0, jobAt: 0, meals: 0, ate: -1 }; }),
  };
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
/** Where one stands to hand over at a store: a step in from it, toward the fire. */
export const storeSpot = (st: StoreSpot): Vec2 => { const a = Math.atan2(st.z, st.x); return { x: st.x - Math.cos(a) * 0.7, z: st.z - Math.sin(a) * 0.7 }; };
/** Her stations (W1): a ring at each yielding place where standing collects into her stack, a ring at each store where standing delivers, and the ring before the stone where a miracle is asked. Radii: tuning. */
export interface Station { id: string; kind: 'gather' | 'deliver' | 'shrine'; x: number; z: number; r: number; keeps?: SiteKind; store?: Store }
export const STATION_R = 1.4, STORE_RING_R = 1.1, SHRINE_RING_R = 1.5;
export const STATIONS: Station[] = (() => {
  const out: Station[] = [];
  const inward = (x: number, z: number, by: number): Vec2 => { const a = Math.atan2(z, x); return { x: x - Math.cos(a) * by, z: z - Math.sin(a) * by }; };
  // Each gather ring sits on the green side of its place, clear of the bushes, the trees, the strips and the fence, so she stands in the open beside the work.
  const clear: Record<string, number> = { thicket: 3.6, stream: 1.4, copse: 5.2, field: 3.6, pen: 3.8 };
  for (const k of ['thicket', 'stream', 'copse', 'field', 'pen'] as SiteKind[]) { const st = SITES[k], p = inward(st.x, st.z, clear[k]); out.push({ id: `gather-${k}`, kind: 'gather', ...p, r: STATION_R, keeps: k }); }
  for (const k of STORE_LIST) { const p = storeSpot(STORES[k]); out.push({ id: `deliver-${k}`, kind: 'deliver', ...p, r: STORE_RING_R, store: k }); }
  { const st = SITES.shrine, p = inward(st.x, st.z, 1.6); out.push({ id: 'shrine', kind: 'shrine', ...p, r: SHRINE_RING_R }); }
  return out;
})();
export const stationAt = (x: number, z: number): Station | null => STATIONS.find(st => Math.hypot(x - st.x, z - st.z) <= st.r) ?? null;
/** Her rate: one unit into the stack every COLLECT_S seconds in a place's ring (a meal's worth for the village in a few seconds), one out every DELIVER_S in a store's ring. Tuning. */
export const COLLECT_S = 0.4, DELIVER_S = 0.12;
/** Walking is shown at real pace: a hobbit at 1 m/s covers a metre per real second, which is TICKS_PER_SECOND ticks; so a tick moves 1/TICKS_PER_SECOND of the pace. */
export const PACE_TICK = 1 / TICKS_PER_SECOND;
/** At a place they take a step to a new spot every WANDER_EVERY to twice that ticks, and turn to face something else every FACE_EVERY to twice that. Tuning. */
export const BUBBLE_TICKS = 8, WANDER_EVERY = 14, FACE_EVERY = 5;
const CHATTER = ['…', 'the berries are early', 'the stream is low', 'Odo says rain', 'Pip fell in', 'a fox by the pen', 'the stone was warm'];
export const dayOf = (tick: number): number => Math.floor(tick / DAY_TICKS);
/** What is already on its way to a store in someone's arms (hobbits, spirits, hers), so two gatherers do not both fill the last of the room. */
export const inFlight = (v: Village, kind: Store): number => v.hobbits.reduce((n, s) => n + (s.carry && s.carry.kind === kind ? s.carry.n : 0), 0) + v.spirits.reduce((n, s) => n + (s.carry && s.carry.kind === kind ? s.carry.n : 0), 0) + (v.stack && v.stack.kind === kind ? v.stack.n : 0);
/** The fullest food store, by its share of its cap, with a unit in it; null when the village has nothing to eat. By share, so the diet spreads over the three foods and no one store is eaten down and re-picked while another waits full. */
export function fullestFood(v: Village): Store | null { let best: Store | null = null; for (const f of FOODS) if (v.stores[f] >= 1 && (best === null || v.stores[f] / STORES[f].cap > v.stores[best] / STORES[best].cap)) best = f; return best; }
/** What the land has to give at a place right now, in whole units. */
export function landStock(v: Village, kind: Store): number {
  if (kind === 'berries') return Math.floor(v.land.berries); if (kind === 'wood') return v.land.branches; if (kind === 'milk') return v.land.milk;
  if (kind === 'grain') return v.land.crops.filter(c => c >= 1).length * GRAIN_PER_STRIP; return Infinity;
}
/** The take against the regrowth, for the last whole day: under 1 the land is gaining, over 1 it is being stripped. Berries, wood and milk are what regrows; grain and water are not counted (the field is the village's own, the stream endless). */
export function balance(v: Village): number { const take = v.lastTake.berries + v.lastTake.wood + v.lastTake.milk, regrow = BERRY_REGROW + BRANCHES_PER_DAY + MILK_PER_DAY; return take / regrow; }
/** Food in the stores and on its way, against the next meal: the village eats one unit each per meal. */
export const population = (v: Village): number => v.hobbits.length;
export const foodInHand = (v: Village): number => FOODS.reduce((n, f) => n + v.stores[f] + inFlight(v, f), 0);
/** Enough for the next meal? Food for everyone for the next NEXT_MEAL_MARGIN meals (two: nothing is gathered in the night, so supper must leave breakfast); water for everyone (drunk at noon); wood for two nights. A gatherer whose store is supplied prays instead of gathering. Tuning. */
export const NEXT_MEAL_MARGIN = 2.0;
/** The day's three meals as slots: breakfast (dawn), noon, supper (dusk); a slot's id counts up over days so each is eaten once. */
export const mealSlot = (tick: number): number => { const p = phaseAt(tick), slot = p === 'dawn' || p === 'morning' ? 0 : p === 'noon' || p === 'afternoon' ? 1 : 2; return dayOf(tick) * 3 + slot; };
export function supplied(v: Village, kind: Store): boolean {
  if (kind === 'water') return v.stores.water + inFlight(v, 'water') >= population(v);
  if (kind === 'wood') return v.stores.wood + inFlight(v, 'wood') >= WOOD_PER_NIGHT * 2;
  return foodInHand(v) >= population(v) * NEXT_MEAL_MARGIN;
}
/** Prayer: each hobbit praying at the stone gives PRAYER_PER_TICK, twice that while Nell is there; it pools up to PRAYER_CAP. A spirit costs SPIRIT_COST, and each next one SPIRIT_COST_RISE more. Tuning. */
export const PRAYER_PER_TICK = 0.012, PRAYER_CAP = 60, SPIRIT_COST = 20, SPIRIT_COST_RISE = 1.5, SPIRIT_PACE = 1.2;
export const spiritCost = (v: Village): number => Math.round(SPIRIT_COST * Math.pow(SPIRIT_COST_RISE, v.spirits.length));
/** Summon a spirit for a place's job, if the prayer is there. Deterministic: the spirit starts at its place. */
export function summonSpirit(v: Village, keeps: SiteKind): Spirit | null {
  const kind = YIELD_OF[keeps]; if (!kind || v.prayer < spiritCost(v)) return null;
  v.prayer -= spiritCost(v); const site = SITES[keeps], sp: Spirit = { id: v.spirits.length, keeps, x: site.x, z: site.z, heading: 0, path: [], speed: 0, carry: null, errand: null, gatherAt: v.tick, wanderAt: v.tick };
  v.spirits.push(sp); return sp;
}
/** Take one unit of a kind from the land into an armful, if the land has it and the store has room for it (what others carry counts). Returns what was taken. */
function takeOne(v: Village, kind: Store, carry: Carry | null, room: number): Carry | null {
  const carried = carry?.n ?? 0, stock = landStock(v, kind); if (stock < 1 || room < 1 || carried >= CARRY[kind]) return carry;
  if (kind === 'berries') v.land.berries -= 1; else if (kind === 'wood') v.land.branches -= 1; else if (kind === 'milk') v.land.milk -= 1;
  else if (kind === 'grain') { const i = v.land.crops.findIndex(c => c >= 1); v.land.crops[i] = 0; }
  const n = kind === 'grain' ? GRAIN_PER_STRIP : 1; v.take[kind] += n; return { kind, n: carried + n };
}
/** Her hands: standing in a place's ring she collects one unit into her stack (one kind at a time, up to STACK_CAP), from the same land, counted in the same take; standing in a store's ring she puts one unit in. No sap, only time. */
export const STACK_CAP = 8;
/** A store can overfill by OVERFILL units, as a heap beside it, for what she brings; the villagers keep to the cap. Her collecting is limited to what the store can still take (counting what is on its way), so she is never left holding what has nowhere to go. Tuning. */
export const OVERFILL = 4;
export const roomFor = (v: Village, kind: Store): number => STORES[kind].cap + OVERFILL - v.stores[kind] - inFlight(v, kind);
export const storeFull = (v: Village, kind: Store): boolean => roomFor(v, kind) < 1;
export function collect(v: Village, keeps: SiteKind): boolean {
  const kind = YIELD_OF[keeps]; if (!kind || (v.stack && v.stack.kind !== kind) || (v.stack?.n ?? 0) >= STACK_CAP || landStock(v, kind) < 1) return false;
  if (roomFor(v, kind) < (kind === 'grain' ? GRAIN_PER_STRIP : 1)) return false;
  if (kind === 'grain') { const i = v.land.crops.findIndex(c => c >= 1); v.land.crops[i] = 0; v.stack = { kind, n: Math.min(STACK_CAP, (v.stack?.n ?? 0) + GRAIN_PER_STRIP) }; v.take.grain += GRAIN_PER_STRIP; return true; }
  if (kind === 'berries') v.land.berries -= 1; else if (kind === 'wood') v.land.branches -= 1; else if (kind === 'milk') v.land.milk -= 1;
  v.take[kind] += 1; v.stack = { kind, n: (v.stack?.n ?? 0) + 1 }; return true;
}
export function deliver(v: Village, store: Store): boolean {
  if (!v.stack || v.stack.kind !== store || v.stores[store] >= STORES[store].cap + OVERFILL) return false;
  v.stores[store] += 1; v.stack.n -= 1; if (v.stack.n <= 0) v.stack = null; return true;
}
/** One meal: a unit of the fullest food, and at noon a drink; hunger falls; nothing to eat leaves them hungry. */
function eat(v: Village, s: HobbitState, drink: boolean, say: (t: string) => void): void {
  s.ate = mealSlot(v.tick); const f = fullestFood(v); if (f) { v.stores[f] -= 1; if (drink && v.stores.water >= 1) v.stores.water -= 1; s.hunger = 0; s.meals++; s.eatUntil = v.tick + EAT_TICKS; s.activity = 'eating'; say(`eating ${STORES[f].unit}`); } else say('nothing to eat');
}
/** The raid: at RAID_TICK (a while after night falls) raidSize(day) Dark Young appear at the wood's edge (RAID_FROM m out), each walks at DY_PACE to the fullest store but the trough, eats one unit every DY_EAT_S seconds until it has had DY_FILL, then leaves; at RAID_END (before dawn) all leave, and one at the wood's edge is gone. Tuning. */
export const RAID_TICK = 870, RAID_END = 1380, RAID_FROM = WALK_RADIUS - 12, DY_PACE = 0.9, DY_EAT_S = 6, DY_FILL = 6, DY_HP = 30;
export const raidSize = (day: number): number => Math.min(3, 1 + Math.floor(day / 2));
/** Fighting. Hers: a strike (STRIKE_DMG within STRIKE_RANGE ahead, every STRIKE_CD s, no sap), a thorn burst (THORN_DMG to all within THORN_RANGE, THORN_CD s to recharge, THORN_SAP), a root bind (holds one within ROOT_RANGE for ROOT_S, ROOT_CD, ROOT_SAP). Theirs: struck, a Dark Young hunts her for DY_AGGRO_S at DY_CHARGE m/s and bites DY_BITE every DY_BITE_S within DY_REACH. Vigor refills VIGOR_REGEN a second after VIGOR_CALM_S unbitten; sap SAP_REGEN a second. At no vigor she faints for FAINT_S and wakes at the stone with FAINT_VIGOR. Tuning. */
export const STRIKE_DMG = 5, STRIKE_RANGE = 1.9, STRIKE_CD = 0.45, THORN_DMG = 14, THORN_RANGE = 3.2, THORN_CD = 10, THORN_SAP = 25, ROOT_S = 4, ROOT_RANGE = 5, ROOT_CD = 14, ROOT_SAP = 15;
export const DY_AGGRO_S = 8, DY_CHARGE = 1.7, DY_BITE = 12, DY_BITE_S = 1.4, DY_REACH = 1.5, VIGOR_MAX = 100, VIGOR_REGEN = 3, VIGOR_CALM_S = 4, SAP_MAX = 100, SAP_REGEN = 2, FAINT_S = 3, FAINT_VIGOR = 40, DY_CORPSE_S = 12;
/** Levelling (Noah: kills count, a choice each level). A Dark Young is XP_DY, the manifestation XP_LAIR; the levels come at LEVEL_XP, capped at LEVEL_CAP. Each level grants one choice: vigor (+PERK_VIGOR to the cap), strike (+PERK_STRIKE to the strike), sap (+PERK_SAP to the cap). Tuning. */
export const XP_DY = 1, XP_LAIR = 10, LEVEL_XP = [0, 2, 5, 9, 14], LEVEL_CAP = 5, PERK_VIGOR = 15, PERK_STRIKE = 2, PERK_SAP = 20;
export const vigorMax = (h: Hero): number => VIGOR_MAX + PERK_VIGOR * h.perks.vigor;
export const sapMax = (h: Hero): number => SAP_MAX + PERK_SAP * h.perks.sap;
export const strikeDamage = (h: Hero): number => STRIKE_DMG + PERK_STRIKE * h.perks.strike;
export const levelFor = (xp: number): number => { let l = 1; for (let i = 1; i < LEVEL_XP.length && i < LEVEL_CAP; i++) if (xp >= LEVEL_XP[i]) l = i + 1; return l; };
export function gainXp(v: Village, n: number): void { const h = v.hero; h.xp += n; const l = levelFor(h.xp); if (l > h.level) { h.choices += l - h.level; h.level = l; } }
/** Spend a level's choice. Returns false when none is owed. */
export function choosePerk(v: Village, perk: 'vigor' | 'strike' | 'sap'): boolean { const h = v.hero; if (h.choices < 1) return false; h.choices -= 1; h.perks[perk] += 1; if (perk === 'vigor') h.vigor = Math.min(vigorMax(h), h.vigor + PERK_VIGOR); if (perk === 'sap') h.sap = Math.min(sapMax(h), h.sap + PERK_SAP); return true; }
/** The dark forest and the lair. Inside the forest her vigor drains by depth, up to FOREST_DRAIN a second at the centre. The manifestation wakes within LAIR_WAKE m: a Dark Young born every LAIR_SPAWN_S while fewer than LAIR_BROOD are about it, hunting her at once; a sweep of its horns every LAIR_SWEEP_S for LAIR_SWEEP within LAIR_REACH. LAIR_HP to slay; slain, the raids stop for LAIR_PEACE_DAYS, then it grows again. Tuning. */
export const FOREST_DRAIN = 2, LAIR_WAKE = 26, LAIR_SPAWN_S = 18, LAIR_BROOD = 3, LAIR_SWEEP_S = 3, LAIR_SWEEP = 20, LAIR_REACH = 4.5, LAIR_HP = 300, LAIR_PEACE_DAYS = 5, LAIR_HURT_RANGE = 5;
/** Where the lair is, for the seed (the overworld's placing). Set by the entry from overworldModel so the model stays free of it in tests; a village whose lair is unplaced has no forest. */
export let lairAt: { x: number; z: number; radius: number } | null = null;
export const setLair = (at: { x: number; z: number; radius: number } | null): void => { lairAt = at; };
export const forestDepth = (x: number, z: number): number => { if (!lairAt) return 0; const d = Math.hypot(x - lairAt.x, z - lairAt.z); return d >= lairAt.radius ? 0 : 1 - d / lairAt.radius; };
export const raidsPaused = (v: Village): boolean => !v.lair.alive && dayOf(v.tick) < v.lair.slainDay + LAIR_PEACE_DAYS;
function hurtLair(v: Village, dmg: number): void { const l = v.lair; if (!l.alive) return; l.hp = Math.max(0, l.hp - dmg); l.hurt = 0.3; if (l.hp === 0) { l.alive = false; l.slainDay = dayOf(v.tick); l.woke = false; gainXp(v, XP_LAIR); for (const r of v.raiders) if (r.state !== 'dead') { r.state = 'leaving'; r.aggro = 0; } } }
/** The lair by real seconds while she is near: waking, brooding Dark Young, sweeping. Regrows once the peace is over. */
function stepLair(v: Village, dt: number, her: Vec2 | null): void {
  const l = v.lair; l.hurt = Math.max(0, l.hurt - dt); if (!lairAt) return;
  if (!l.alive) { if (dayOf(v.tick) >= l.slainDay + LAIR_PEACE_DAYS) { l.alive = true; l.hp = LAIR_HP; } return; }
  if (!her) { l.woke = false; return; } const d = Math.hypot(her.x - lairAt.x, her.z - lairAt.z); l.woke = d <= LAIR_WAKE; if (!l.woke) return;
  l.spawnClock += dt; const brood = v.raiders.filter(r => r.state !== 'dead' && Math.hypot(r.x - lairAt!.x, r.z - lairAt!.z) < LAIR_WAKE + 10).length;
  if (l.spawnClock >= LAIR_SPAWN_S && brood < LAIR_BROOD) { l.spawnClock = 0; const a = Math.atan2(her.z - lairAt.z, her.x - lairAt.x) + (brood - 1) * 0.9, id = v.raiders.reduce((m, r) => Math.max(m, r.id), -1) + 1; v.raiders.push({ id, x: lairAt.x + Math.cos(a) * 5, z: lairAt.z + Math.sin(a) * 5, heading: a, hp: DY_HP, state: 'hunting', target: null, ate: 0, eatClock: 0, aggro: DY_AGGRO_S * 4, rooted: 0, biteClock: 0, hurt: 0, gone: 0 }); }
  l.sweepClock += dt; if (l.sweepClock >= LAIR_SWEEP_S) { l.sweepClock = 0; if (d <= LAIR_REACH && v.hero.faint === 0) { v.hero.vigor = Math.max(0, v.hero.vigor - LAIR_SWEEP); v.hero.calm = 0; if (v.hero.vigor === 0) v.hero.faint = FAINT_S; } }
}
/** The fullest store but the trough, by share of cap, with a unit in it: what a Dark Young goes for. */
export function fullestStore(v: Village): Store | null { let best: Store | null = null; for (const k of STORE_LIST) if (k !== 'water' && v.stores[k] >= 1 && (best === null || v.stores[k] / STORES[k].cap > v.stores[best] / STORES[best].cap)) best = k; return best; }
export function spawnRaid(v: Village, rand: () => number): void {
  const n = raidSize(dayOf(v.tick)), a0 = rand() * Math.PI * 2;
  for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * 0.35 + (rand() - 0.5) * 0.2, id = v.raiders.reduce((m, r) => Math.max(m, r.id), -1) + 1; let x = Math.cos(a) * RAID_FROM, z = Math.sin(a) * RAID_FROM; if (inWater(x, z)) { x = Math.cos(a + 1.2) * RAID_FROM; z = Math.sin(a + 1.2) * RAID_FROM; } v.raiders.push({ id, x, z, heading: Math.atan2(-z, -x), hp: DY_HP, state: 'coming', target: null, ate: 0, eatClock: 0, aggro: 0, rooted: 0, biteClock: 0, hurt: 0, gone: 0 }); }
  v.raidDay = dayOf(v.tick);
}
const towards = (r: { x: number; z: number; heading: number }, to: Vec2, m: number): number => { const d = Math.hypot(to.x - r.x, to.z - r.z); if (d < 1e-6) return 0; const step = Math.min(d, m); r.heading = Math.atan2(to.z - r.z, to.x - r.x); r.x += (to.x - r.x) / d * step; r.z += (to.z - r.z) / d * step; return d - step; };
/** The Dark Young by real seconds: walking, eating, hunting her, biting, leaving, and the dead fading; her vigor and sap refilling. `her` is where she stands (null while she is not on her feet). */
export function stepRaiders(v: Village, dt: number, her: Vec2 | null): void {
  const h = v.hero; h.calm += dt; h.sap = Math.min(sapMax(h), h.sap + SAP_REGEN * dt); if (h.faint > 0) { h.faint = Math.max(0, h.faint - dt); if (h.faint === 0) h.vigor = Math.max(h.vigor, FAINT_VIGOR); } else if (h.calm > VIGOR_CALM_S) h.vigor = Math.min(vigorMax(h), h.vigor + VIGOR_REGEN * dt);
  // The dark forest drains her by depth while she stands in it; at the bottom she faints as from a bite.
  if (her && h.faint === 0) { const depth = forestDepth(her.x, her.z); if (depth > 0) { h.vigor = Math.max(0, h.vigor - FOREST_DRAIN * depth * dt); h.calm = 0; if (h.vigor === 0) h.faint = FAINT_S; } }
  stepLair(v, dt, her);
  const t = v.tick % DAY_TICKS, night = phaseAt(v.tick) === 'night', leaveAll = !night || t >= RAID_END;
  for (const r of v.raiders) {
    r.hurt = Math.max(0, r.hurt - dt); if (r.state === 'dead') { r.gone += dt; continue; }
    if (r.rooted > 0) { r.rooted = Math.max(0, r.rooted - dt); r.aggro = Math.max(0, r.aggro - dt); continue; }
    if (r.aggro > 0 && her && h.faint === 0) {
      // Hunting her: to her at a charge, a bite within reach.
      r.state = 'hunting'; r.aggro -= dt; const d = Math.hypot(her.x - r.x, her.z - r.z);
      if (d > DY_REACH) towards(r, her, DY_CHARGE * dt); else { r.heading = Math.atan2(her.z - r.z, her.x - r.x); r.biteClock += dt; if (r.biteClock >= DY_BITE_S) { r.biteClock = 0; h.vigor = Math.max(0, h.vigor - DY_BITE); h.calm = 0; if (h.vigor === 0) { h.faint = FAINT_S; r.aggro = 0; } } }
      if (r.aggro <= 0) { r.aggro = 0; r.state = 'coming'; r.target = null; }
      continue;
    }
    if (leaveAll || r.ate >= DY_FILL) r.state = 'leaving';
    if (r.state === 'leaving') { const a = Math.atan2(r.z, r.x), out = { x: Math.cos(a) * (RAID_FROM + 2), z: Math.sin(a) * (RAID_FROM + 2) }; if (towards(r, out, DY_PACE * dt) < 0.5) r.gone = DY_CORPSE_S; continue; }
    if (r.state === 'coming' || r.state === 'hunting') { if (!r.target || v.stores[r.target] < 1) r.target = fullestStore(v); if (!r.target) { r.state = 'leaving'; continue; } const spot = storeSpot(STORES[r.target]); if (towards(r, spot, DY_PACE * dt) < 0.3) { r.state = 'eating'; r.eatClock = 0; r.heading = Math.atan2(STORES[r.target].z - r.z, STORES[r.target].x - r.x); } continue; }
    if (r.state === 'eating') { if (!r.target || v.stores[r.target] < 1) { r.target = null; r.state = 'coming'; continue; } r.eatClock += dt; if (r.eatClock >= DY_EAT_S) { r.eatClock = 0; v.stores[r.target] -= 1; r.ate += 1; v.eaten += 1; } }
  }
  v.raiders = v.raiders.filter(r => !(r.state === 'dead' && r.gone >= DY_CORPSE_S) && !(r.state === 'leaving' && r.gone >= DY_CORPSE_S));
}
/** Hurt a Dark Young: it turns on her; at no hp it is dead. */
function hurt(v: Village, r: Raider, dmg: number): void { r.hp = Math.max(0, r.hp - dmg); r.hurt = 0.3; r.aggro = Math.max(r.aggro, DY_AGGRO_S); if (r.hp === 0) { r.state = 'dead'; r.gone = 0; r.aggro = 0; v.slain += 1; gainXp(v, XP_DY); } }
const alive = (v: Village): Raider[] => v.raiders.filter(r => r.state !== 'dead');
/** Her strike: the nearest Dark Young within reach and ahead of her (facing (fx, fz)). Returns it, or null when nothing was there. */
export function strike(v: Village, her: Vec2, fx: number, fz: number): Raider | null {
  let best: Raider | null = null, bd = Infinity; for (const r of alive(v)) { const dx = r.x - her.x, dz = r.z - her.z, d = Math.hypot(dx, dz); if (d <= STRIKE_RANGE + 0.6 && (dx * fx + dz * fz) / (d || 1) > -0.2 && d < bd) { best = r; bd = d; } }
  if (best) hurt(v, best, strikeDamage(v.hero)); else if (lairAt && v.lair.alive && Math.hypot(her.x - lairAt.x, her.z - lairAt.z) <= LAIR_HURT_RANGE) hurtLair(v, strikeDamage(v.hero));
  return best;
}
/** Her thorn burst: everything within THORN_RANGE, for THORN_SAP. Returns how many were hurt, or -1 without the sap. */
export function thornBurst(v: Village, her: Vec2): number { if (v.hero.sap < THORN_SAP) return -1; v.hero.sap -= THORN_SAP; let n = 0; for (const r of alive(v)) if (Math.hypot(r.x - her.x, r.z - her.z) <= THORN_RANGE + 0.6) { hurt(v, r, THORN_DMG); n++; } if (lairAt && v.lair.alive && Math.hypot(her.x - lairAt.x, her.z - lairAt.z) <= LAIR_HURT_RANGE) { hurtLair(v, THORN_DMG); n++; } return n; }
/** Her root bind: the nearest within ROOT_RANGE held for ROOT_S, for ROOT_SAP. Returns it, null when none, or undefined without the sap. */
export function rootBind(v: Village, her: Vec2): Raider | null | undefined { if (v.hero.sap < ROOT_SAP) return undefined; let best: Raider | null = null, bd = Infinity; for (const r of alive(v)) { const d = Math.hypot(r.x - her.x, r.z - her.z); if (d <= ROOT_RANGE + 0.6 && d < bd) { best = r; bd = d; } } if (!best) return null; v.hero.sap -= ROOT_SAP; best.rooted = ROOT_S; best.aggro = Math.max(best.aggro, DY_AGGRO_S); return best; }
/** Advance the village by whole ticks. Deterministic: the only randomness is the seeded stream, drawn in a fixed order. */
export function advance(v: Village, ticks: number): void {
  for (let n = 0; n < ticks; n++) {
    const rand = mulberry32((v.seed * 7919 + v.tick * 131) >>> 0), t = v.tick % DAY_TICKS, phase = phaseAt(v.tick);
    // The land by the day: at dawn the branches drop and the goats have their milk; the bushes and the strips grow every minute; the fire burns down through the night.
    if (t === 0) { v.land.branches = Math.min(BRANCH_CAP, v.land.branches + BRANCHES_PER_DAY); v.land.milk = MILK_PER_DAY; v.lastTake = v.take; v.take = freshTake(); v.raiders = []; }
    v.land.berries = Math.min(BERRY_CAP, v.land.berries + BERRY_REGROW / DAY_TICKS);
    for (let i = 0; i < v.land.crops.length; i++) v.land.crops[i] = Math.min(1, v.land.crops[i] + 1 / (CROP_DAYS * DAY_TICKS));
    if (phase === 'night' && v.fireWood > 0) v.fireWood = Math.max(0, v.fireWood - WOOD_PER_NIGHT / (DAY_TICKS - PHASES[5][1]));
    // Nightfall's raid: the Dark Young come once a night, while everyone sleeps.
    if (t === RAID_TICK && v.raidDay < dayOf(v.tick) && !raidsPaused(v)) spawnRaid(v, rand);
    let praying = 0, nell = false;
    for (const s of v.hobbits) {
      const h = hobbitById(s.id), house = houseOf(h), want = wants(h, v.tick), kind = YIELD_OF[h.keeps] ?? null;
      const say = (text: string): void => { s.bubble = text; s.bubbleUntil = v.tick + BUBBLE_TICKS; };
      const site = want === 'home' ? null : want === 'green' ? SITES.fire : s.job === 'pray' && kind ? SITES.shrine : SITES[h.keeps];
      const goal = (): Vec2 => (site ? spotAt(site, rand) : house.door);
      const mealSpot = (): Vec2 => spotAt(SITES.fire, rand, 0.4);
      s.hunger = Math.min(1, s.hunger + HUNGER_PER_TICK * (s.inside ? 0.5 : 1));
      if (want !== s.want) {
        // The rhythm has moved on: a new place to be. Out of the door first if inside. An armful goes to its store on the way; leaving at dawn and going home at dusk, a meal at the fire comes first.
        s.want = want; s.eatUntil = 0; if (want === 'place') { s.job = 'gather'; s.gatherAt = v.tick + GATHER_TICKS; s.jobAt = v.tick + JOB_EVERY; }
        if (s.inside) { s.inside = false; s.x = house.door.x; s.z = house.door.z; s.heading = house.facing; }
        if (s.carry && s.errand !== 'firewood') { s.errand = 'deliver'; s.path = route(s, storeSpot(STORES[s.carry.kind])); s.activity = 'carrying'; }
        else if ((want === 'home' || (want === 'place' && phase === 'dawn')) && s.ate < mealSlot(v.tick)) { s.errand = 'meal'; s.path = route(s, mealSpot()); s.activity = want === 'home' ? 'returning' : 'walking'; }
        else { s.errand = null; s.path = route(s, goal()); s.activity = 'walking'; }
        say('');
      }
      // Odo keeps the fire: a little before dusk he fetches the night's wood from the pile and lays it.
      if (h.keeps === 'fire' && t === FIRE_WOOD_TICK && !s.inside && !s.errand && v.stores.wood >= 1) { s.errand = 'firewood'; s.path = route(s, storeSpot(STORES.wood)); s.activity = 'walking'; }
      if (s.inside) { s.activity = 'sleeping'; s.speed = 0; continue; }
      if (s.eatUntil > v.tick) { s.activity = 'eating'; s.speed = 0; s.heading = Math.atan2(SITES.fire.z - s.z, SITES.fire.x - s.x); continue; }
      if (s.eatUntil === v.tick && s.errand === 'meal') { s.errand = null; s.path = route(s, goal()); s.activity = want === 'home' ? 'returning' : 'walking'; }
      if (s.path.length) {
        const step = s.path[0], d = dist(s, step), move = Math.min(d, h.pace * PACE_TICK);
        if (d > 1e-6) { s.heading = Math.atan2(step.z - s.z, step.x - s.x); s.x += (step.x - s.x) / d * move; s.z += (step.z - s.z) / d * move; }
        s.speed = h.pace;
        if (d <= move + 1e-6) {
          s.path.shift();
          if (s.path.length === 0) {
            if (s.errand === 'deliver' && s.carry) {
              // Handing over: the armful goes into its store, and the rhythm's walk resumes from here (by way of the meal when one is due).
              const st = STORES[s.carry.kind]; v.stores[st.id] = Math.min(st.cap, v.stores[st.id] + s.carry.n); s.carry = null; s.errand = null; s.heading = Math.atan2(st.z - s.z, st.x - s.x);
              if ((want === 'home' || (want === 'place' && phase === 'dawn')) && s.ate < mealSlot(v.tick)) { s.errand = 'meal'; s.path = route(s, mealSpot()); s.activity = want === 'home' ? 'returning' : 'walking'; }
              else { s.path = route(s, goal()); s.activity = 'walking'; }
            } else if (s.errand === 'meal') {
              // A meal at the fire, then on: out to the place, or home to bed.
              s.speed = 0; eat(v, s, false, say); if (s.eatUntil <= v.tick) { s.errand = null; s.path = route(s, goal()); s.activity = want === 'home' ? 'returning' : 'walking'; }
            } else if (s.errand === 'firewood') {
              if (!s.carry) { const n = Math.min(WOOD_PER_NIGHT, Math.floor(v.stores.wood)); v.stores.wood -= n; s.carry = { kind: 'wood', n }; s.path = [{ x: SITES.fire.x + 1.0, z: SITES.fire.z + 0.4 }]; s.activity = 'carrying'; say('wood for the night'); }
              else { v.fireWood = Math.min(WOOD_PER_NIGHT * 2, v.fireWood + s.carry.n); s.carry = null; s.errand = null; s.speed = 0; s.wanderAt = v.tick + WANDER_EVERY; say('feeding the fire'); }
            } else if (!site) { s.inside = true; s.activity = 'sleeping'; s.speed = 0; s.x = house.door.x; s.z = house.door.z; say(''); }
            else { s.speed = 0; s.wanderAt = v.tick + WANDER_EVERY + Math.floor(rand() * WANDER_EVERY); }
          }
        }
        continue;
      }
      // At their place: stand, turn to face one thing then another, and now and then take a step to a new spot; on the green, face the fire, eat the noon meal and talk; at the stone, pray.
      s.speed = 0;
      if (want === 'green' || h.keeps === 'fire') {
        s.activity = 'talking'; s.heading = Math.atan2(SITES.fire.z - s.z, SITES.fire.x - s.x);
        if (want === 'green' && s.ate < mealSlot(v.tick)) { eat(v, s, true, say); continue; }
        if (v.tick % 40 === 0 && rand() < 0.5) say(CHATTER[Math.floor(rand() * CHATTER.length)]);
      } else if (s.job === 'pray' && kind || h.keeps === 'shrine') {
        // Praying at the stone: faced to it, still; the stone's keeper always; a gatherer while the stores hold enough for the next meal.
        s.activity = 'praying'; s.heading = Math.atan2(SITES.shrine.z - s.z, SITES.shrine.x - s.x); praying++; if (h.keeps === 'shrine') nell = true;
        if (kind && v.tick >= s.jobAt) { s.jobAt = v.tick + JOB_EVERY; if (!supplied(v, kind) && landStock(v, kind) >= 1) { s.job = 'gather'; s.gatherAt = v.tick + GATHER_TICKS; s.path = route(s, spotAt(SITES[h.keeps], rand)); s.activity = 'walking'; say(''); continue; } }
      } else {
        s.activity = 'working'; if (site && v.tick >= s.faceAt) { s.heading = Math.atan2(site.z - s.z, site.x - s.x) + (rand() - 0.5) * 2.4; s.faceAt = v.tick + FACE_EVERY + Math.floor(rand() * FACE_EVERY); }
        // Gathering: a unit every GATHER_TICKS while the land has one and the store has room for it; an armful, or the last of what there is, goes to the store. Enough for the next meal already, and they go to the stone instead.
        if (kind && want === 'place' && v.tick >= s.jobAt) { s.jobAt = v.tick + JOB_EVERY; if (supplied(v, kind) && !s.carry) { s.job = 'pray'; s.path = route(s, spotAt(SITES.shrine, rand, 0.7)); s.activity = 'walking'; say('to the stone'); continue; } }
        if (kind && want === 'place' && v.tick >= s.gatherAt) {
          s.gatherAt = v.tick + GATHER_TICKS; const room = STORES[kind].cap - v.stores[kind] - inFlight(v, kind), stock = landStock(v, kind);
          if (!supplied(v, kind) || s.carry) s.carry = takeOne(v, kind, s.carry, room);
          if (s.carry && (s.carry.n >= CARRY[kind] || stock < 1 || room < 1 || supplied(v, kind))) { s.errand = 'deliver'; s.path = route(s, storeSpot(STORES[kind])); s.activity = 'carrying'; continue; }
        }
      }
      if (site && v.tick >= s.wanderAt && s.activity !== 'praying') { s.path = [spotAt(site, rand, 0.65)]; s.activity = 'walking'; s.wanderAt = v.tick + WANDER_EVERY + Math.floor(rand() * WANDER_EVERY); }
    }
    v.prayer = Math.min(PRAYER_CAP, v.prayer + PRAYER_PER_TICK * praying * (nell ? 2 : 1)); v.prayed += PRAYER_PER_TICK * praying * (nell ? 2 : 1);
    // The spirits: by day the gather-and-carry loop at their place, without meals, prayer or rest; by night they stand at their place.
    for (const sp of v.spirits) {
      const kind = YIELD_OF[sp.keeps]!, site = SITES[sp.keeps], night = phase === 'night';
      if (sp.path.length) {
        const step = sp.path[0], d = dist(sp, step), move = Math.min(d, SPIRIT_PACE * PACE_TICK);
        if (d > 1e-6) { sp.heading = Math.atan2(step.z - sp.z, step.x - sp.x); sp.x += (step.x - sp.x) / d * move; sp.z += (step.z - sp.z) / d * move; }
        sp.speed = SPIRIT_PACE;
        if (d <= move + 1e-6) { sp.path.shift(); if (sp.path.length === 0) { sp.speed = 0; if (sp.errand === 'deliver' && sp.carry) { const st = STORES[sp.carry.kind]; v.stores[st.id] = Math.min(st.cap, v.stores[st.id] + sp.carry.n); sp.carry = null; sp.errand = null; sp.gatherAt = v.tick + GATHER_TICKS; sp.path = route(sp, spotAt(site, rand)); } else sp.wanderAt = v.tick + WANDER_EVERY * 2; } }
        continue;
      }
      sp.speed = 0; if (night) continue;
      if (v.tick >= sp.gatherAt) {
        sp.gatherAt = v.tick + GATHER_TICKS; const room = STORES[kind].cap - v.stores[kind] - inFlight(v, kind), stock = landStock(v, kind);
        sp.carry = takeOne(v, kind, sp.carry, room);
        if (sp.carry && (sp.carry.n >= CARRY[kind] || stock < 1 || room < 1)) { sp.errand = 'deliver'; sp.path = route(sp, storeSpot(STORES[kind])); continue; }
      }
      if (v.tick >= sp.wanderAt) { sp.path = [spotAt(site, rand, 0.65)]; sp.wanderAt = v.tick + WANDER_EVERY * 2 + Math.floor(rand() * WANDER_EVERY); }
    }
    v.tick++;
  }
}
/** What a hobbit is thinking, always: the chatter while it lasts, else what they carry, where they are going or what they are doing; hunger when it is bad. */
export function thought(s: HobbitState, tick: number): string {
  if (s.inside) return '';
  if (s.bubble && tick < s.bubbleUntil) return s.bubble;
  const h = hobbitById(s.id);
  if (s.activity === 'eating') return 'eating';
  if (s.hunger > 0.85) return 'hungry';
  if (s.errand === 'deliver' && s.carry) return `carrying ${STORES[s.carry.kind].unit} to ${STORES[s.carry.kind].name}`;
  if (s.errand === 'meal') return s.want === 'home' ? 'supper first' : 'breakfast first';
  if (s.errand === 'firewood') return s.carry ? 'wood for the fire' : 'to the woodpile';
  if (s.activity === 'praying') return 'praying';
  if (s.activity === 'returning') return 'going home';
  if (s.activity === 'walking' && s.path.length && s.want !== 'place') return s.want === 'green' ? 'walking to the fire' : 'going home';
  if (s.activity === 'walking' && s.path.length > 1) return s.job === 'pray' ? 'to the stone' : `walking to ${SITES[h.keeps].name}`;
  if (s.want === 'green' || (s.activity === 'talking' && h.keeps === 'fire')) return h.keeps === 'fire' && s.want !== 'green' ? SITES.fire.verb : 'talking by the fire';
  if (h.keeps === 'field' && s.activity === 'working') return s.carry ? 'harvesting' : SITES.field.verb;
  return SITES[h.keeps].verb;
}
export const everyone = (v: Village, where: 'inside' | 'green' | 'out' | 'praying'): number => v.hobbits.filter(s => where === 'inside' ? s.inside : where === 'green' ? !s.inside && dist(s, SITES.fire) <= SITES.fire.radius + 0.3 : where === 'praying' ? s.activity === 'praying' : !s.inside).length;
export const inHouse = (p: Vec2): House | null => HOUSES.find(h => dist(p, h) < HOUSE_RADIUS - 0.05) ?? null;
const ACTIVITIES: Activity[] = ['sleeping', 'walking', 'working', 'talking', 'returning', 'carrying', 'eating', 'praying'];
export function parseVillage(raw: string | null): Village {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object' || !Array.isArray(p.hobbits) || p.hobbits.length !== HOBBITS.length) return freshVillage();
    const v = freshVillage(Number.isFinite(p.seed) ? p.seed : 1); v.tick = Number.isInteger(p.tick) && p.tick >= 0 ? p.tick : 0;
    const num = (x: unknown, lo: number, hi: number, d: number): number => (typeof x === 'number' && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d);
    if (p.stores && typeof p.stores === 'object') for (const k of STORE_LIST) v.stores[k] = num(p.stores[k], 0, STORES[k].cap + OVERFILL, v.stores[k]);
    if (p.land && typeof p.land === 'object') { v.land.berries = num(p.land.berries, 0, BERRY_CAP, v.land.berries); v.land.branches = Math.floor(num(p.land.branches, 0, BRANCH_CAP, v.land.branches)); v.land.milk = Math.floor(num(p.land.milk, 0, MILK_PER_DAY, v.land.milk)); if (Array.isArray(p.land.crops) && p.land.crops.length === CROP_STRIPS) v.land.crops = p.land.crops.map((c: unknown, i: number) => num(c, 0, 1, v.land.crops[i])); }
    v.fireWood = num(p.fireWood, 0, WOOD_PER_NIGHT * 2, 0); v.prayer = num(p.prayer, 0, PRAYER_CAP, 0); v.prayed = num(p.prayed, 0, 1e6, 0);
    for (const which of ['take', 'lastTake'] as const) if (p[which] && typeof p[which] === 'object') for (const k of STORE_LIST) v[which][k] = num(p[which][k], 0, 1e4, 0);
    const carryOf = (c: unknown): Carry | null => { const k = c as Carry; return k && STORE_LIST.includes(k.kind) && Number.isFinite(k.n) && k.n > 0 ? { kind: k.kind, n: Math.min(STACK_CAP, Math.floor(k.n)) } : null; };
    v.stack = carryOf(p.stack);
    if (p.hero && typeof p.hero === 'object') { const pk = p.hero.perks && typeof p.hero.perks === 'object' ? p.hero.perks : {}; v.hero.perks = { vigor: Math.floor(num(pk.vigor, 0, LEVEL_CAP, 0)), strike: Math.floor(num(pk.strike, 0, LEVEL_CAP, 0)), sap: Math.floor(num(pk.sap, 0, LEVEL_CAP, 0)) }; v.hero.xp = num(p.hero.xp, 0, 1e6, 0); v.hero.level = Math.min(LEVEL_CAP, Math.max(1, Math.floor(num(p.hero.level, 1, LEVEL_CAP, 1)))); v.hero.choices = Math.floor(num(p.hero.choices, 0, LEVEL_CAP, 0)); v.hero.vigor = num(p.hero.vigor, 0, vigorMax(v.hero), vigorMax(v.hero)); v.hero.sap = num(p.hero.sap, 0, sapMax(v.hero), sapMax(v.hero)); v.hero.faint = num(p.hero.faint, 0, FAINT_S, 0); v.hero.calm = num(p.hero.calm, 0, 1e6, 0); }
    if (p.lair && typeof p.lair === 'object') { v.lair.hp = num(p.lair.hp, 0, LAIR_HP, LAIR_HP); v.lair.alive = p.lair.alive !== false; v.lair.slainDay = num(p.lair.slainDay, -99, 1e6, -99); }
    v.raidDay = num(p.raidDay, -1, 1e6, -1); v.slain = num(p.slain, 0, 1e6, 0); v.eaten = num(p.eaten, 0, 1e6, 0);
    if (Array.isArray(p.raiders)) for (const q of p.raiders.slice(0, 12)) { if (!q || typeof q !== 'object') continue; const st: RaiderState = ['coming', 'eating', 'hunting', 'leaving', 'dead'].includes(q.state) ? q.state : 'coming'; v.raiders.push({ id: num(q.id, 0, 1e6, v.raiders.length), x: num(q.x, -200, 200, 0), z: num(q.z, -200, 200, 0), heading: num(q.heading, -10, 10, 0), hp: num(q.hp, 0, DY_HP, DY_HP), state: st, target: STORE_LIST.includes(q.target) ? q.target : null, ate: num(q.ate, 0, 99, 0), eatClock: 0, aggro: num(q.aggro, 0, DY_AGGRO_S, 0), rooted: num(q.rooted, 0, ROOT_S, 0), biteClock: 0, hurt: 0, gone: num(q.gone, 0, DY_CORPSE_S, 0) }); }
    const pathOf = (x: unknown): Vec2[] => (Array.isArray(x) ? x.filter((q: unknown) => q && Number.isFinite((q as Vec2).x) && Number.isFinite((q as Vec2).z)).map((q: Vec2) => ({ x: q.x, z: q.z })).slice(0, 4) : []);
    if (Array.isArray(p.spirits)) for (const q of p.spirits.slice(0, 12)) { if (!q || !(q.keeps in YIELD_OF)) continue; const site = SITES[q.keeps as SiteKind]; v.spirits.push({ id: v.spirits.length, keeps: q.keeps, x: num(q.x, -200, 200, site.x), z: num(q.z, -200, 200, site.z), heading: num(q.heading, -10, 10, 0), path: pathOf(q.path), speed: 0, carry: carryOf(q.carry), errand: q.errand === 'deliver' && carryOf(q.carry) ? 'deliver' : null, gatherAt: num(q.gatherAt, 0, 1e9, v.tick), wanderAt: num(q.wanderAt, 0, 1e9, v.tick) }); }
    for (let i = 0; i < HOBBITS.length; i++) {
      const s = p.hobbits[i], t = v.hobbits[i]; if (!s || s.id !== t.id) return freshVillage();
      for (const k of ['x', 'z', 'heading', 'speed', 'bubbleUntil', 'wanderAt', 'faceAt', 'gatherAt', 'eatUntil', 'jobAt', 'meals'] as const) if (Number.isFinite(s[k])) (t as unknown as Record<string, number>)[k] = s[k];
      if (Number.isFinite(s.ate)) t.ate = s.ate;
      t.hunger = num(s.hunger, 0, 1, t.hunger);
      t.inside = s.inside === true; t.activity = ACTIVITIES.includes(s.activity) ? s.activity : 'sleeping'; t.want = ['home', 'place', 'green'].includes(s.want) ? s.want : 'home'; t.job = s.job === 'pray' ? 'pray' : 'gather';
      t.errand = ['deliver', 'meal', 'firewood'].includes(s.errand) ? s.errand : null;
      t.carry = carryOf(s.carry); if (t.errand === 'deliver' && !t.carry) t.errand = null;
      t.path = pathOf(s.path); t.bubble = typeof s.bubble === 'string' ? s.bubble.slice(0, 40) : '';
    }
    return v;
  } catch { return freshVillage(); }
}
export const serializeVillage = (v: Village): string => JSON.stringify({ seed: v.seed, tick: v.tick, stores: v.stores, land: { ...v.land, berries: Math.round(v.land.berries * 100) / 100, crops: v.land.crops.map(c => Math.round(c * 1000) / 1000) }, fireWood: Math.round(v.fireWood * 100) / 100, take: v.take, lastTake: v.lastTake, prayer: Math.round(v.prayer * 1000) / 1000, prayed: Math.round(v.prayed * 1000) / 1000, stack: v.stack, hero: { vigor: Math.round(v.hero.vigor * 10) / 10, sap: Math.round(v.hero.sap * 10) / 10, faint: Math.round(v.hero.faint * 100) / 100, calm: Math.round(v.hero.calm * 100) / 100, xp: v.hero.xp, level: v.hero.level, choices: v.hero.choices, perks: v.hero.perks }, lair: { hp: Math.round(v.lair.hp * 10) / 10, alive: v.lair.alive, slainDay: v.lair.slainDay }, raidDay: v.raidDay, slain: v.slain, eaten: v.eaten, raiders: v.raiders.map(r => ({ ...r, x: Math.round(r.x * 100) / 100, z: Math.round(r.z * 100) / 100, heading: Math.round(r.heading * 1000) / 1000, hp: Math.round(r.hp * 10) / 10, aggro: Math.round(r.aggro * 100) / 100, rooted: Math.round(r.rooted * 100) / 100, gone: Math.round(r.gone * 100) / 100 })), spirits: v.spirits.map(s => ({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, heading: Math.round(s.heading * 1000) / 1000 })), hobbits: v.hobbits.map(s => ({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, heading: Math.round(s.heading * 1000) / 1000, hunger: Math.round(s.hunger * 1000) / 1000 })) });

// Hulda's ways through the meadow. Grass roots are everywhere she can walk: a free medium, faster than
// running, shown as a bulge under the grass. Tree roots join the trees of the copse and the wood: fixed
// lanes, faster still. Every tree can be entered, climbed to its crown and leapt from.
export const GRASS_SPEED = 3.8, ROOT_SPEED = 6.5, TRUNK_CLIMB = 2.4, CROWN_SLIDE = 1.7, HOP_S = 0.9, HOP_REACH = 9, HOP_RISE = 7, PRESS_S = 0.35, PRESS_RANGE = 0.6, ENTER_RANGE = 3.2;
export interface Tree { id: number; x: number; z: number; size: number }
export const crownHeight = (t: Tree): number => 3.4 * t.size;
export const trunkRadius = (t: Tree): number => 0.32 * t.size;
/** The stream's course, for what is water: a bank either side of this line. */
export const STREAM_Z = (x: number): number => 27 + 2.5 * Math.sin(x * 0.11 + 0.4), STREAM_HALF = 1.9;
/** The stream runs past the village for STREAM_REACH either way and no farther (the land beyond is the chunks'). */
export const STREAM_REACH = 90;
export const inWater = (x: number, z: number): boolean => Math.abs(x) <= STREAM_REACH && Math.abs(z - STREAM_Z(x)) < STREAM_HALF;
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
/** The land beyond the meadow offers its trees through this hook (the loaded chunks); the village's own are always here. */
export let treeProvider: (x: number, z: number, r: number) => Tree[] = () => [];
export const setTreeProvider = (f: (x: number, z: number, r: number) => Tree[]): void => { treeProvider = f; };
export const treesNear = (x: number, z: number, r: number): Tree[] => [...TREES.filter(t => Math.hypot(t.x - x, t.z - z) <= r), ...treeProvider(x, z, r)];
export function nearestTree(x: number, z: number): { tree: Tree; distance: number } {
  let best = { tree: TREES[0], distance: Infinity };
  for (const t of treesNear(x, z, 40)) { const d = Math.hypot(x - t.x, z - t.z) - trunkRadius(t); if (d < best.distance) best = { tree: t, distance: d }; }
  if (best.distance === Infinity) for (const t of TREES) { const d = Math.hypot(x - t.x, z - t.z) - trunkRadius(t); if (d < best.distance) best = { tree: t, distance: d }; }
  return best;
}
export const hopTargets = (t: Tree): Tree[] => treesNear(t.x, t.z, HOP_REACH).filter(o => o !== t && o.id !== t.id && Math.hypot(o.x - t.x, o.z - t.z) <= HOP_REACH && Math.abs(crownHeight(o) - crownHeight(t)) <= HOP_RISE);
/** Where the grass takes her: the meadow, not the houses, not the water. */
/** Where the grass takes her: anywhere on the land (the chunks are unbounded), not the water, not the houses. */
export const grassCan = (x: number, z: number): boolean => !inWater(x, z) && !HOUSES.some(h => Math.hypot(x - h.x, z - h.z) < HOUSE_RADIUS + 0.2);
