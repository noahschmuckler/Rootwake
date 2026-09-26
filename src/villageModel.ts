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
import { KARST_AT } from './overworldModel';

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
/** G1: the village can grow to HOUSE_CAP houses. The founders' six stand on the ring; huts built after them stand on a second ring HUT_RING out, HUT_SPREAD either side of a founder's house (clear of the paths through the gaps), doors to the green. Tuning. */
export const HOUSE_CAP = 18, HUT_RING = 14, HUT_SPREAD = Math.PI / 9;
const houseAt = (id: number, a: number, r: number): House => { const x = Math.cos(a) * r, z = Math.sin(a) * r, facing = a + Math.PI; return { id, x, z, facing, door: { x: x + Math.cos(facing) * (HOUSE_RADIUS + 0.4), z: z + Math.sin(facing) * (HOUSE_RADIUS + 0.4) } }; };
/** Where house `id` stands (the founders' by id, a hut's by its order on the second ring). */
export const housePlace = (id: number): House => { if (id < 6) return houseAt(id, id / 6 * Math.PI * 2 + 0.3, HOUSE_RING); const k = id - 6; return houseAt(id, (k % 6) / 6 * Math.PI * 2 + 0.3 + (k < 6 ? HUT_SPREAD : -HUT_SPREAD), HUT_RING); };
export const HOUSES: House[] = Array.from({ length: 6 }, (_, i) => housePlace(i));
/** The village's houses now: the founders' and the huts built since (`huts`). */
export const housesOf = (v: { huts: number }): House[] => Array.from({ length: 6 + v.huts }, (_, i) => housePlace(i));
let hutsPlaced = 0;
/** The entry tells the model how many huts stand, for the lookups that have no village in hand (the grass, the wood's paths). */
export const setHuts = (n: number): void => { hutsPlaced = n; };
export type SiteKind = 'thicket' | 'stream' | 'copse' | 'field' | 'pen' | 'shrine' | 'fire';
/** A site: where it is, how wide, its name in a thought ('the thicket'), and what one does there ('gathering berries'). */
export interface Site { id: SiteKind | 'hut'; x: number; z: number; radius: number; name: string; verb: string }
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
export type Store = 'berries' | 'milk' | 'grain' | 'wood' | 'water' | 'dark';
/** The five the village keeps, and (D2) the Dark Young's leavings: a heap on the green's edge by the stone's gap, left where they ate, eaten by the villagers only when nothing else is left. */
export const STORE_LIST: Store[] = ['berries', 'water', 'wood', 'grain', 'milk', 'dark'];
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
  dark: { id: 'dark', ...gap(5, STORE_RING), name: 'their leavings', cap: 12, unit: 'their leavings' },
};
/** What each place yields, and where it goes. The fire and the stone yield nothing. */
export const YIELD_OF: Partial<Record<SiteKind, Store>> = { thicket: 'berries', stream: 'water', copse: 'wood', field: 'grain', pen: 'milk' };
/** The land's rates, per day unless said. Berries regrow steadily on the bushes up to BERRY_CAP; branches drop under the copse at dawn (up to BRANCH_CAP lying); the goats have MILK_PER_DAY at dawn and no more; each of CROP_STRIPS strips ripens over CROP_DAYS days and gives GRAIN_PER_STRIP, then is sown again; the stream is endless. Tuning. */
export const BERRY_CAP = 35, BERRY_REGROW = 16, BRANCHES_PER_DAY = 6, BRANCH_CAP = 12, MILK_PER_DAY = 6, CROP_STRIPS = 5, CROP_DAYS = 4, GRAIN_PER_STRIP = 6;
/** Gathering is paced to the next meal: one unit every GATHER_TICKS at the place (a session between meals yields about a meal's share of one gatherer's kind); an armful is CARRY units, carried in view to the store; the job (gather or pray) is looked at again every JOB_EVERY. Tuning. */
export const GATHER_TICKS = 40, JOB_EVERY = 20, CARRY: Record<Store, number> = { berries: 4, milk: 3, grain: 6, wood: 3, water: 2, dark: 0 };
/** Eating: three meals a day at the fire (breakfast on the way out at dawn, noon, supper on the way home at dusk), each one unit of the fullest food and, at noon, one of water; a meal takes EAT_TICKS. Hunger climbs from 0 to 1 in HUNGER_DAYS of a day. Tuning. */
export const EAT_TICKS = 12, HUNGER_DAYS = 0.5, HUNGER_PER_TICK = 1 / (DAY_TICKS * HUNGER_DAYS);
/** The fire: Odo fetches WOOD_PER_NIGHT from the woodpile at FIRE_WOOD_TICK (a little before dusk) and the fire burns it through the night. Tuning. */
export const WOOD_PER_NIGHT = 5, FIRE_WOOD_TICK = 690;
export type YieldSite = 'thicket' | 'copse' | 'field' | 'pen';
export const YIELD_SITES: YieldSite[] = ['thicket', 'copse', 'field', 'pen'];
/** The land, and (D2) which of its places the Dark Young have spoiled: the tick until which each is spoiled (0 for clean). A spoiled place looks corrupted, gives nothing, and grows nothing until it is clean again. */
export interface Land { berries: number; branches: number; milk: number; crops: number[]; spoiled: Record<YieldSite, number> }
export const SITE_OF: Partial<Record<Store, YieldSite>> = { berries: 'thicket', wood: 'copse', grain: 'field', milk: 'pen' };
export const isSpoiled = (v: { land: Land; tick: number }, site: YieldSite): boolean => v.land.spoiled[site] > v.tick;
export interface Carry { kind: Store; n: number }
/** What the village takes from the land in a day, against what the land regrows: the balance Hulda will protect. Kept for the day so far and the last whole day. */
export type Take = Record<Store, number>;
export const freshTake = (): Take => ({ berries: 0, wood: 0, milk: 0, grain: 0, water: 0, dark: 0 });

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
// D1 (the dark loop's first pass): the village lives and dies. Newcomers are born into houses with room from this pool, in order; a hobbit is an infant indoors for INFANT_DAYS, then a child out with the others (smaller, slower) for CHILD_DAYS, then grown. Meals missed in a row weaken (WEAK_PACE off the pace per missed meal, never below WEAK_FLOOR), send them to the stone instead of their place at REST_MEALS, and kill at DEATH_MEALS; the village mourns a death for MOURN_TICKS. A village in which nobody went without for BIRTH_DAYS whole days, with a house that has room (ROOM_PER_HOUSE), has a birth. Tuning.
export const INFANT_DAYS = 2, CHILD_DAYS = 3, CHILD_PACE = 0.85, ROOM_PER_HOUSE = 4, BIRTH_DAYS = 3, WEAK_PACE = 0.15, WEAK_FLOOR = 0.4, REST_MEALS = 4, DEATH_MEALS = 6, MOURN_TICKS = DAY_TICKS, EVENTS_KEPT = 8;
export const NEWCOMERS: Hobbit[] = [
  { id: 'fen', name: 'Fen', home: -1, keeps: 'thicket', rises: 12, pace: 1.05, colour: '#6a7a4a', hair: '#4a2a1c' },
  { id: 'rue', name: 'Rue', home: -1, keeps: 'stream', rises: 6, pace: 1.2, colour: '#8a6a6a', hair: '#2a1a1a' },
  { id: 'dill', name: 'Dill', home: -1, keeps: 'copse', rises: 18, pace: 1.1, colour: '#5a6a5a', hair: '#8a5a2a' },
  { id: 'poppy', name: 'Poppy', home: -1, keeps: 'field', rises: 10, pace: 1.0, colour: '#a06a5a', hair: '#c8a03a' },
  { id: 'tam', name: 'Tam', home: -1, keeps: 'pen', rises: 24, pace: 0.95, colour: '#7a6a4a', hair: '#3a2a2a' },
  { id: 'ivy', name: 'Ivy', home: -1, keeps: 'thicket', rises: 16, pace: 1.05, colour: '#5a7a6a', hair: '#1c1c1c' },
  { id: 'cob', name: 'Cob', home: -1, keeps: 'copse', rises: 4, pace: 1.15, colour: '#8a7a5a', hair: '#6a4a2a' },
  { id: 'mab', name: 'Mab', home: -1, keeps: 'field', rises: 22, pace: 1.0, colour: '#6a5a7a', hair: '#4a3a3a' },
  { id: 'rook', name: 'Rook', home: -1, keeps: 'stream', rises: 8, pace: 1.25, colour: '#4a5a6a', hair: '#1a1a2a' },
  { id: 'sorrel', name: 'Sorrel', home: -1, keeps: 'pen', rises: 28, pace: 0.9, colour: '#9a7a4a', hair: '#8a4a2a' },
  { id: 'lark', name: 'Lark', home: -1, keeps: 'thicket', rises: 2, pace: 1.3, colour: '#7a8a5a', hair: '#d8c080' },
  { id: 'moss', name: 'Moss', home: -1, keeps: 'copse', rises: 20, pace: 1.0, colour: '#4a6a4a', hair: '#3a2a1c' },
  { id: 'tilly', name: 'Tilly', home: -1, keeps: 'field', rises: 14, pace: 1.05, colour: '#a08a6a', hair: '#7a3a2a' },
  { id: 'brock', name: 'Brock', home: -1, keeps: 'stream', rises: 26, pace: 0.95, colour: '#6a6a6a', hair: '#2a2a2a' },
  { id: 'wisp', name: 'Wisp', home: -1, keeps: 'pen', rises: 6, pace: 1.1, colour: '#8a8a9a', hair: '#e0d8c0' },
  { id: 'nettle', name: 'Nettle', home: -1, keeps: 'thicket', rises: 30, pace: 1.0, colour: '#5a6a3a', hair: '#4a3a2a' },
];
export const ALL_HOBBITS: Hobbit[] = [...HOBBITS, ...NEWCOMERS];
export type Stage = 'infant' | 'child' | 'grown';
export type Activity = 'sleeping' | 'walking' | 'working' | 'talking' | 'returning' | 'carrying' | 'eating' | 'praying';
export type Want = 'home' | 'place' | 'green';
/** An errand breaks the rhythm's walk: to a store with an armful ('deliver'), to the fire for a meal on the way out at dawn and on the way home at dusk ('meal'), to the woodpile and back to the fire ('firewood'). */
export type Errand = 'deliver' | 'meal' | 'firewood' | 'fetch' | 'hut' | 'flee' | null;
/** What a gatherer is doing with the working day: gathering at their place, or praying at the stone because the stores already hold enough for the next meal. */
export type Job = 'gather' | 'pray' | 'build';
export interface HobbitState { id: string; x: number; z: number; heading: number; activity: Activity; want: Want; job: Job; path: Vec2[]; speed: number; inside: boolean; bubble: string; bubbleUntil: number; wanderAt: number; faceAt: number; hunger: number; carry: Carry | null; errand: Errand; gatherAt: number; eatUntil: number; jobAt: number; meals: number; ate: number; home: number; stage: Stage; born: number; missed: number }
/** What happened in the village, for the entry to tell: a birth, a death, a child going out. */
export interface VillageEvent { tick: number; text: string; banner?: boolean }
/** A forest spirit: summoned for one place's job, it gathers and carries there tirelessly by day, and stands at its place by night. No needs, no home. */
export interface Spirit { id: number; keeps: SiteKind; x: number; z: number; heading: number; path: Vec2[]; speed: number; carry: Carry | null; errand: 'deliver' | null; gatherAt: number; wanderAt: number }
// The Dark Young (the first enemy): oversized goats with writhing tentacle horns and six legs, the get of the
// mother of goats. They shamble in from the wood after nightfall while the villagers sleep, go to the fullest
// store and eat, and slink back to the wood before dawn. The player outpaces them by gathering more than they
// can eat, or fights them. Their walking and eating run in real seconds (stepRaiders), like her fighting, and
// nothing happens while the page is closed; the night's arrival is set by the tick (advance).
export type RaiderState = 'coming' | 'eating' | 'hunting' | 'leaving' | 'dead' | 'devouring' | 'retreating' | 'melting';
export type RaiderKind = 'dy' | 'wolf';
export interface Raider { id: number; x: number; z: number; heading: number; hp: number; state: RaiderState; target: Store | null; ate: number; eatClock: number; aggro: number; rooted: number; biteClock: number; hurt: number; gone: number; site: YieldSite | null; devourClock: number; held: number; infant: InfantRef | null; kind: RaiderKind; den: string | null; prey: string | null }
/** D3: an infant as it is carried off, kept at the lair, bred into a Dark Young, dropped, or carried home: who it is, its house, when it was born. */
export interface InfantRef { id: string; home: number; born: number }
/** D3: the snatcher, a small octopoid out of the lair at night: to the house with an infant (or an infant lying out), in, and back to the lair with it; struck or bound it drops what it carries and runs. */
export type SnatcherState = 'coming' | 'taking' | 'fleeing';
export interface Snatcher { id: number; x: number; z: number; heading: number; state: SnatcherState; targetId: string | null; clock: number; infant: InfantRef | null; told: boolean }
/** Her fighting stat (vigor: bitten down, never to death; at nothing she fades and wakes at the stone, weakened) and her sap (spent by the specials, refilling slowly for now; match-3 is reserved for building it later). */
export interface Hero { vigor: number; sap: number; faint: number; calm: number; xp: number; level: number; choices: number; perks: { vigor: number; strike: number; sap: number }; holding: number }
/** The lair's manifestation: a local mother of goats at the dark forest's centre, awake while she is near, with its own hp; slain, it is gone for LAIR_PEACE_DAYS and the raids with it, then grows again. */
export interface Lair { hp: number; alive: boolean; slainDay: number; spawnClock: number; sweepClock: number; hurt: number; woke: boolean }
export interface Village { seed: number; tick: number; hobbits: HobbitState[]; stores: Record<Store, number>; land: Land; fireWood: number; take: Take; lastTake: Take; prayer: number; prayed: number; spirits: Spirit[]; stack: Carry | null; raiders: Raider[]; hero: Hero; raidDay: number; slain: number; eaten: number; lair: Lair; dead: { id: string; tick: number }[]; wellFedDays: number; dayMissed: boolean; mourningUntil: number; events: VillageEvent[]; darkMealsToday: number; melted: number; blight: number; snatchers: Snatcher[]; snatchDay: number; brood: { infant: InfantRef; due: number }[]; bred: InfantRef[]; dropped: { infant: InfantRef; x: number; z: number }[]; carried: InfantRef | null; taken: number; returned: number; huts: number; site: HutSite | null; fedStreak: number; raidEaten: number; lastRaidEaten: number; voiced: Voiced[]; told: StateKind; dens: Record<string, DenState>; wolfDay: number; bitten: number; lastBitten: number }
/** G3: a den's pack as the village knows it: how many wolves are at it, and the day its peace ends after the pack is slain. */
export interface DenState { alive: number; quietDay: number }
/** G1: a hut going up. Its house id (the next on the second ring), the wood and water brought to it so far, the work done on it in ticks, and whether she asked for it. */
export interface HutSite { id: number; wood: number; water: number; work: number; asked: boolean }
/** G1, the village grows. A house has BEDS beds; more people than beds and the village is crowded: at dawn it sets the stakes for a hut by itself. A hut takes HUT_WOOD wood (only what the woodpile holds beyond the night's fire) and HUT_WATER water from the stores, fetched an armful at a time by the freed gatherers, and HUT_WORK_TICKS of building at the stakes; she can ask one of the stone for HUT_PRAYER at any time, and her stack of wood or water goes straight into it. At dawn a grown newcomer in a house past its beds moves out to a house with a bed free. A quickening at the stone (QUICKEN_COST) fills a place at once: the bushes, the branches, the milk, or ripens every strip. Tuning. */
export const HUT_WOOD = 6, HUT_WATER = 4, HUT_WORK_TICKS = 240, BEDS = 2, HUT_PRAYER = 15, QUICKEN_COST = 10;
export const hobbitById = (id: string): Hobbit => ALL_HOBBITS.find(h => h.id === id)!;
export const houseOf = (h: Hobbit): House => housePlace(h.home);
/** The house a hobbit lives in now (a newcomer's is the one it was born into, until it is grown and moves out to a hut). */
export const homeOf = (s: HobbitState): House => housePlace(s.home);
/** How fast a hobbit walks now: a child slower, and each meal missed in a row slower still, down to WEAK_FLOOR. */
export const paceOf = (s: HobbitState): number => hobbitById(s.id).pace * (s.stage === 'child' ? CHILD_PACE : 1) * Math.max(WEAK_FLOOR, 1 - WEAK_PACE * s.missed);
export const living = (v: Village, home: number): HobbitState[] => v.hobbits.filter(s => s.home === home);
/** The first morning: the stores hold some food and a night's wood already (the village has lived here a while), the bushes are full, a few branches lie, the strips are at different stages so that one ripens every day or so. */
export function freshVillage(seed = 1): Village {
  return {
    seed, tick: 0, stores: { berries: 3, milk: 2, grain: 6, wood: 8, water: 5, dark: 0 }, land: { berries: BERRY_CAP, branches: 6, milk: MILK_PER_DAY, crops: Array.from({ length: CROP_STRIPS }, (_, i) => (i + 0.5) / CROP_STRIPS), spoiled: { thicket: 0, copse: 0, field: 0, pen: 0 } }, fireWood: 0, take: freshTake(), lastTake: freshTake(), prayer: 0, prayed: 0, spirits: [], stack: null, raiders: [], hero: { vigor: VIGOR_MAX, sap: SAP_MAX, faint: 0, calm: 0, xp: 0, level: 1, choices: 0, perks: { vigor: 0, strike: 0, sap: 0 }, holding: -1 }, raidDay: -1, slain: 0, eaten: 0, lair: { hp: LAIR_HP, alive: true, slainDay: -99, spawnClock: 0, sweepClock: 0, hurt: 0, woke: false }, dead: [], wellFedDays: 0, dayMissed: false, mourningUntil: 0, events: [], darkMealsToday: 0, melted: 0, blight: 0, snatchers: [], snatchDay: -1, brood: [], bred: [], dropped: [], carried: null, taken: 0, returned: 0, huts: 0, site: null, fedStreak: 0, raidEaten: 0, lastRaidEaten: 0, voiced: [], told: 'steady', dens: {}, wolfDay: -1, bitten: 0, lastBitten: 0,
    hobbits: HOBBITS.map(h => { const d = houseOf(h).door; return { id: h.id, x: d.x, z: d.z, heading: houseOf(h).facing, activity: 'sleeping', want: 'home', job: 'gather', path: [], speed: 0, inside: true, bubble: '', bubbleUntil: 0, wanderAt: 0, faceAt: 0, hunger: 0.3, carry: null, errand: null, gatherAt: 0, eatUntil: 0, jobAt: 0, meals: 0, ate: -1, home: h.home, stage: 'grown', born: -(INFANT_DAYS + CHILD_DAYS) * DAY_TICKS, missed: 0 }; }),
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
/** Her stations (W1): a ring at each yielding place where standing collects into her stack, a ring at each store where standing delivers (the ring before the stone is gone: the miracles are asked from anywhere, Noah's call). Radii: tuning. */
export interface Station { id: string; kind: 'gather' | 'deliver' | 'shrine' | 'site'; x: number; z: number; r: number; keeps?: SiteKind; store?: Store }
export const STATION_R = 1.4, STORE_RING_R = 1.1, SITE_RING_R = 1.4;
/** G1: the ring before the stakes, where her stack of wood or water goes into the hut. */
export const siteStation = (v: Village, x: number, z: number): Station | null => { const h = siteHouse(v); return h && v.site && Math.hypot(x - h.door.x, z - h.door.z) <= SITE_RING_R ? { id: 'site', kind: 'site', x: h.door.x, z: h.door.z, r: SITE_RING_R } : null; };
export const STATIONS: Station[] = (() => {
  const out: Station[] = [];
  const inward = (x: number, z: number, by: number): Vec2 => { const a = Math.atan2(z, x); return { x: x - Math.cos(a) * by, z: z - Math.sin(a) * by }; };
  // Each gather ring sits on the green side of its place, clear of the bushes, the trees, the strips and the fence, so she stands in the open beside the work.
  const clear: Record<string, number> = { thicket: 3.6, stream: 1.4, copse: 5.2, field: 3.6, pen: 3.8 };
  for (const k of ['thicket', 'stream', 'copse', 'field', 'pen'] as SiteKind[]) { const st = SITES[k], p = inward(st.x, st.z, clear[k]); out.push({ id: `gather-${k}`, kind: 'gather', ...p, r: STATION_R, keeps: k }); }
  for (const k of STORE_LIST) if (k !== 'dark') { const p = storeSpot(STORES[k]); out.push({ id: `deliver-${k}`, kind: 'deliver', ...p, r: STORE_RING_R, store: k }); }
  return out;
})();
export const stationAt = (x: number, z: number): Station | null => STATIONS.find(st => Math.hypot(x - st.x, z - st.z) <= st.r) ?? null;
/** Her rate: one unit into the stack every COLLECT_S seconds in a place's ring (a meal's worth for the village in a few seconds), one out every DELIVER_S in a store's ring. Tuning. */
export const COLLECT_S = 0.4, DELIVER_S = 0.12;
/** Walking is shown at real pace: a hobbit at 1 m/s covers a metre per real second, which is TICKS_PER_SECOND ticks; so a tick moves 1/TICKS_PER_SECOND of the pace. */
export const PACE_TICK = 1 / TICKS_PER_SECOND;
/** At a place they take a step to a new spot every WANDER_EVERY to twice that ticks, and turn to face something else every FACE_EVERY to twice that. Tuning. */
export const BUBBLE_TICKS = 8, WANDER_EVERY = 14, FACE_EVERY = 5;
export const dayOf = (tick: number): number => Math.floor(tick / DAY_TICKS);
/** What is already on its way to a store in someone's arms (hobbits, spirits, hers), so two gatherers do not both fill the last of the room. */
export const inFlight = (v: Village, kind: Store): number => v.hobbits.reduce((n, s) => n + (s.carry && s.carry.kind === kind ? s.carry.n : 0), 0) + v.spirits.reduce((n, s) => n + (s.carry && s.carry.kind === kind ? s.carry.n : 0), 0) + (v.stack && v.stack.kind === kind ? v.stack.n : 0);
/** The fullest food store, by its share of its cap, with a unit in it; null when the village has nothing to eat. By share, so the diet spreads over the three foods and no one store is eaten down and re-picked while another waits full. */
export function fullestFood(v: Village): Store | null { let best: Store | null = null; for (const f of FOODS) if (v.stores[f] >= 1 && (best === null || v.stores[f] / STORES[f].cap > v.stores[best] / STORES[best].cap)) best = f; return best; }
/** What a meal is made of: the fullest proper food; the Dark Young's leavings only when there is none (D2), and those breed. */
export const mealFood = (v: Village): Store | null => fullestFood(v) ?? (v.stores.dark >= 1 ? 'dark' : null);
/** What the land has to give at a place right now, in whole units. */
export function landStock(v: Village, kind: Store): number {
  const site = SITE_OF[kind]; if (site && isSpoiled(v, site)) return 0;
  if (kind === 'berries') return Math.floor(v.land.berries); if (kind === 'wood') return v.land.branches; if (kind === 'milk') return v.land.milk;
  if (kind === 'grain') return v.land.crops.filter(c => c >= 1).length * GRAIN_PER_STRIP; if (kind === 'dark') return 0; return Infinity;
}
/** The take against the regrowth, for the last whole day: under 1 the land is gaining, over 1 it is being stripped. Berries, wood and milk are what regrows; grain and water are not counted (the field is the village's own, the stream endless). */
export function balance(v: Village): number { const take = v.lastTake.berries + v.lastTake.wood + v.lastTake.milk, regrow = BERRY_REGROW + BRANCHES_PER_DAY + MILK_PER_DAY; return take / regrow; }
/** Food in the stores and on its way, against the next meal: the village eats one unit each per meal. */
export const population = (v: Village): number => v.hobbits.filter(s => s.stage !== 'infant').length;
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
// G1: quickening and the huts.
/** A quickening at the stone fills a place at once, for QUICKEN_COST prayer: refused while the place is spoiled, already full, or the prayer is short. */
export const quickenable = (v: Village, site: YieldSite): boolean => !isSpoiled(v, site) && (site === 'thicket' ? v.land.berries < BERRY_CAP - 0.5 : site === 'copse' ? v.land.branches < BRANCH_CAP : site === 'pen' ? v.land.milk < MILK_PER_DAY : v.land.crops.some(c => c < 1));
export function quicken(v: Village, site: YieldSite): boolean {
  if (v.prayer < QUICKEN_COST || !quickenable(v, site)) return false; v.prayer -= QUICKEN_COST;
  if (site === 'thicket') { v.land.berries = BERRY_CAP; event(v, 'The thicket is quickened: the bushes hang full'); } else if (site === 'copse') { v.land.branches = BRANCH_CAP; event(v, 'The copse is quickened: branches lie thick under it'); } else if (site === 'pen') { v.land.milk = MILK_PER_DAY; event(v, 'The pen is quickened: the goats give again'); } else { v.land.crops = v.land.crops.map(() => 1); event(v, 'The field is quickened: every strip stands ripe'); }
  return true;
}
/** The house a hut going up will be, and where the work stands (its door). */
export const siteHouse = (v: Village): House | null => (v.site ? housePlace(v.site.id) : null);
/** Stakes set for a hut, by the village or by her. Refused with a hut already going up or the village at HOUSE_CAP. */
function startSite(v: Village, asked: boolean): boolean { if (v.site || 6 + v.huts >= HOUSE_CAP) return false; v.site = { id: 6 + v.huts, wood: 0, water: 0, work: 0, asked }; event(v, asked ? 'A hut is asked of the stone: the stakes are set' : `The village is crowded (${v.hobbits.length} to ${housesOf(v).length * BEDS} beds): the stakes are set for a new hut`, true); return true; }
/** She asks a hut of the stone, for HUT_PRAYER. */
export function askHut(v: Village): boolean { if (v.prayer < HUT_PRAYER || v.site || 6 + v.huts >= HOUSE_CAP) return false; if (!startSite(v, true)) return false; v.prayer -= HUT_PRAYER; return true; }
/** More people than beds? */
export const crowded = (v: Village): boolean => v.hobbits.length > housesOf(v).length * BEDS;
/** The house with the most past its beds, or null. */
export const crowdedHouse = (v: Village): House | null => housesOf(v).filter(h => living(v, h.id).length > BEDS).sort((a, b) => living(v, b.id).length - living(v, a.id).length || a.id - b.id)[0] ?? null;
/** What the hut still needs of a kind. */
export const siteNeeds = (v: Village, kind: 'wood' | 'water'): number => (v.site ? (kind === 'wood' ? HUT_WOOD - v.site.wood : HUT_WATER - v.site.water) : 0);
/** What the hut wants of a freed hobbit now: a material to fetch that the store has (and nobody is already bringing), or work once the materials are in. Null when there is nothing for them to do. */
/** What a store can spare for the hut: the woodpile keeps the night's fire back. */
export const storeSpare = (v: Village, k: 'wood' | 'water'): number => Math.floor(v.stores[k] - (k === 'wood' ? WOOD_PER_NIGHT : 0));
/** What is on its way to the hut in the builders' arms. */
export const siteBringing = (v: Village, k: 'wood' | 'water'): number => v.hobbits.reduce((n, s) => n + (s.job === 'build' && s.carry?.kind === k ? s.carry.n : 0), 0);
export function siteWants(v: Village): 'wood' | 'water' | 'work' | null {
  if (!v.site) return null;
  for (const k of ['wood', 'water'] as const) if (siteNeeds(v, k) - siteBringing(v, k) > 0 && storeSpare(v, k) >= 1) return k;
  if (siteNeeds(v, 'wood') <= 0 && siteNeeds(v, 'water') <= 0 && v.site.work < HUT_WORK_TICKS) return 'work'; return null;
}
/** Her stack goes into the hut: one unit of wood or water the hut still needs. */
export function deliverToSite(v: Village): boolean { if (!v.site || !v.stack || (v.stack.kind !== 'wood' && v.stack.kind !== 'water') || siteNeeds(v, v.stack.kind) < 1) return false; v.site[v.stack.kind] += 1; v.stack.n -= 1; if (v.stack.n <= 0) v.stack = null; return true; }
/** The hut stands: a house more, the builders freed, told. */
function finishHut(v: Village): void { if (!v.site) return; const id = v.site.id; v.huts++; v.site = null; event(v, `A new hut stands: house ${id + 1}`, true); for (const s of v.hobbits) if (s.job === 'build') { s.job = 'gather'; s.jobAt = v.tick; s.gatherAt = v.tick + GATHER_TICKS; } }
/** Dawn: one grown newcomer in a crowded house moves out to the emptiest house, if it has room to spare. */
function moveOut(v: Village): void {
  const from = crowdedHouse(v); if (!from) return; const to = housesOf(v).filter(h => h.id !== from.id).sort((a, b) => living(v, a.id).length - living(v, b.id).length || a.id - b.id)[0]; if (!to || living(v, to.id).length >= BEDS) return;
  const mover = living(v, from.id).filter(s => s.stage === 'grown' && NEWCOMERS.some(n => n.id === s.id)).sort((a, b) => b.born - a.born)[0]; if (!mover) return;
  mover.home = to.id; event(v, `${hobbitById(mover.id).name} moves out to house ${to.id + 1}`);
}
// G2 (EXPANSION.md): the village as a hub. Its state is a read-off of what the model already tracks, and its talk at the fire is rumor made of that state and of the wider world, so that the village tells her where to look.
export type StateKind = 'thriving' | 'steady' | 'pressured' | 'besieged' | 'lost';
export interface VillageState { kind: StateKind; needs: string[] }
/** Thriving: THRIVE_DAYS whole days nobody went without and the take under the regrowth, with nothing wanting. Pressured: anything wanting. Besieged: infants out of their houses, a raid that ate a meal's worth (one unit each) or more, or the blight within BLIGHT_NEAR m of the green. Tuning. */
export const THRIVE_DAYS = 2, BLIGHT_NEAR = 150;
export function villageState(v: Village): VillageState {
  if (!v.hobbits.length) return { kind: 'lost', needs: ['nobody left'] };
  const needs: string[] = [];
  if (v.dayMissed || v.hobbits.some(s => s.missed > 0)) needs.push('meals missed');
  if (v.stores.wood < WOOD_PER_NIGHT) needs.push('wood for the fire');
  for (const k of YIELD_SITES) if (isSpoiled(v, k)) needs.push(`${SITES[k].name} spoiled`);
  if (crowded(v)) needs.push('beds');
  if (v.site) for (const k of ['wood', 'water'] as const) if (siteNeeds(v, k) > 0 && storeSpare(v, k) < 1) needs.push(`${k} for the hut`);
  const out = v.brood.length + v.bred.length; if (out) needs.push(`${out} infant${out > 1 ? 's' : ''} at the lair`); if (v.dropped.length) needs.push('an infant lying out');
  const raided = v.lastRaidEaten >= Math.max(1, population(v)); if (raided) needs.push('the Dark Young ate a meal');
  if (densInReach().some(d => denAwake(v, d))) needs.push('wolves at dusk');
  if (v.lastBitten > 0) needs.push(`${v.lastBitten} bitten by wolves`);
  const blightNear = !!lairAt && v.blight > 0 && Math.hypot(lairAt.x, lairAt.z) - v.blight <= BLIGHT_NEAR; if (blightNear) needs.push('the blight near');
  if (out > 0 || v.dropped.length > 0 || raided || blightNear || v.lastBitten > 0) return { kind: 'besieged', needs };
  if (needs.length) return { kind: 'pressured', needs };
  if (v.fedStreak >= THRIVE_DAYS && balance(v) < 1) return { kind: 'thriving', needs };
  return { kind: 'steady', needs };
}
export const stateText = (s: VillageState): string => (s.kind === 'lost' ? 'The village is lost' : `The village is ${s.kind}${s.needs.length ? `: ${s.needs.join(', ')}` : ''}`);
/** A rumor: something said at the fire, and where it points (a bearing from the green, as the villagers give directions) and what it is about, so the map can carry it as a hint. The elder tells the village's condition, the stone's keeper the omens; the rest is anyone's. */
export interface Rumor { text: string; bearing?: number; about?: string; who?: 'elder' | 'keeper' }
export interface Voiced extends Rumor { tick: number; by: string }
export const RUMORS_KEPT = 8;
export const bearingWords = (deg: number): string => ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'][Math.round((((deg % 360) + 360) % 360) / 45) % 8];
/** A bearing in degrees from the green: 0 north (negative z), 90 east. */
export const bearingFromGreen = (x: number, z: number): number => ((Math.atan2(x, -z) * 180 / Math.PI) + 360) % 360;
export function rumors(v: Village): Rumor[] {
  const st = villageState(v), out: Rumor[] = [];
  const elder = (text: string): void => { out.push({ text, who: 'elder' }); };
  if (st.kind === 'lost') return out;
  if (st.kind === 'thriving') { elder('the stores are full'); elder('the stone is warm'); }
  for (const n of st.needs) elder(n === 'meals missed' ? 'we went hungry' : n === 'wood for the fire' ? 'no wood for the fire tonight' : n === 'beds' ? `we are ${v.hobbits.length} to ${housesOf(v).length * BEDS} beds` : n === 'an infant lying out' ? `${v.dropped.length ? infantName(v.dropped[0].infant) : 'a child'} lies out in the dark` : n === 'the Dark Young ate a meal' ? 'the Dark Young came in the night' : n.endsWith('at the lair') ? `${infantName((v.brood[0]?.infant ?? v.bred[0])!)} is with the mother of goats` : n === 'wolves at dusk' ? 'the wolves come at dusk' : n.endsWith('bitten by wolves') ? `${n.split(' ')[0]} of us bitten last night` : n.endsWith('spoiled') ? `${n.replace(' spoiled', '')} has gone bad` : n.endsWith('for the hut') ? `the new hut wants ${n.replace(' for the hut', '')}` : n);
  if (lairAt) { const b = bearingFromGreen(lairAt.x, lairAt.z); out.push({ text: `something walks in the wood to the ${bearingWords(b)}`, bearing: b, about: 'lair', who: 'keeper' }); if (v.blight > 0) out.push({ text: `the trees to the ${bearingWords(b)} have gone black`, bearing: b, about: 'blight', who: 'keeper' }); }
  { const near = densInReach(), nearest = densAt.slice().sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z))[0];
    for (const d of near) { const b = bearingFromGreen(d.x, d.z); out.push({ text: `wolves howl to the ${bearingWords(b)}`, bearing: b, about: d.id, who: 'keeper' }); }
    // No den in reach, and the keeper still names the nearest: the first village is calm ground, and the wolves are something to go and find.
    if (!near.length && nearest) { const b = bearingFromGreen(nearest.x, nearest.z); out.push({ text: `wolves howl far to the ${bearingWords(b)}`, bearing: b, about: nearest.id, who: 'keeper' }); } }
  { const b = bearingFromGreen(KARST_AT.x, KARST_AT.z); out.push({ text: `the pillar stands to the ${bearingWords(b)}`, bearing: b, about: 'karst', who: 'keeper' }); }
  for (const text of ['the berries are early', 'Pip fell in', 'a fox by the pen', 'Odo says rain']) out.push({ text });
  return out;
}
/** Said at the fire: kept to the last RUMORS_KEPT, for the entry to carry to the map. */
function voice(v: Village, r: Rumor, by: string): void { const o: Voiced = { text: r.text, tick: v.tick, by }; if (r.bearing !== undefined) o.bearing = Math.round(r.bearing * 10) / 10; if (r.about) o.about = r.about; if (r.who) o.who = r.who; v.voiced.push(o); if (v.voiced.length > RUMORS_KEPT) v.voiced.shift(); }
/** The state told when it changes: a banner. */
function tellState(v: Village): void { const st = villageState(v); if (st.kind !== v.told) { v.told = st.kind; event(v, stateText(st), true); } }
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
  if (v.carried) return false;
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
  s.ate = mealSlot(v.tick); const f = mealFood(v); if (f) { v.stores[f] -= 1; if (drink && v.stores.water >= 1) v.stores.water -= 1; s.hunger = 0; s.meals++; s.missed = 0; s.eatUntil = v.tick + EAT_TICKS; s.activity = 'eating'; if (f === 'dark') { v.darkMealsToday++; say('eating their leavings'); } else say(`eating ${STORES[f].unit}`); } else { s.missed++; v.dayMissed = true; say('nothing to eat'); }
}
/** The raid: at RAID_TICK (a while after night falls) raidSize(day) Dark Young appear at the wood's edge (RAID_FROM m out), each walks at DY_PACE to the fullest store but the trough, eats one unit every DY_EAT_S seconds until it has had DY_FILL, then leaves; at RAID_END (before dawn) all leave, and one at the wood's edge is gone. Tuning. */
export const RAID_TICK = 870, RAID_END = 1380, RAID_FROM = WALK_RADIUS - 12, DY_PACE = 0.9, DY_EAT_S = 6, DY_FILL = 6, DY_HP = 30;
/** D2, the spoiled land and the retreat. Fed at a store, a Dark Young goes on to a yielding place and devours it for DY_DEVOUR_S: the place is spoiled for SPOIL_TICKS (a day, again with each devouring), its stock gone, and it grows nothing while spoiled; every unit eaten and every place devoured leaves DARK_PER_UNIT / DARK_PER_SITE of their leavings on the heap. A meal of leavings counts as DARK_FED_DAYS days toward a birth. At no hp a Dark Young does not die: it retreats overland, flat and fast (DY_FLEE, root-travel pace), to the lair, home within LAIR_HOME of it, and is gone; at RAID_END the rest leave the same way. Rooted, it is held while she stands within HOLD_RANGE, for HOLD_SAP a second (the bind does not run down); held for HOLD_MELT_S it withers and melts (the roots draw it down), and any held at daybreak melts in the sun; a melted one counts as slain (the level). Tuning. */
/** D3, the snatchers. At SNATCH_TICK (after the raid sets out) SNATCHERS_PER_NIGHT come out of the lair while the village has an infant in a house or lying out; they run at SNATCH_PACE (root-travel pace), a house door takes SNATCH_ENTER_S, an infant lying out a moment; within TELL_RANGE of the green the goats bleat (told). Back at the lair an infant becomes a Dark Young after GESTATION_TICKS; the night's raid is Shub's own (raidSize by day) and every Dark Young bred of an infant, up to DY_MAX. Struck, burst or bound, a snatcher drops what it carries and runs. She picks up an infant within PICK_RANGE and it is home at its door within HOME_RANGE; a melted Dark Young leaves its infant where it melted. Tuning. */
/** D4, the blight. Round the lair the Dark Young, in their hunger, spoil the trees: the blight's reach is BLIGHT_BASE m and BLIGHT_PER_DY more for every Dark Young bred of an infant (none bred, none), up to BLIGHT_MAX; each dawn the blight moves toward that reach by at most BLIGHT_STEP m, spreading or drawing back (a tree heals a day behind it). Inside it a tree is black and its roots refuse root travel. Tuning. */
export const BLIGHT_BASE = 50, BLIGHT_PER_DY = 30, BLIGHT_MAX = 360, BLIGHT_STEP = 30;
export const blightTarget = (v: Village): number => (v.bred.length ? Math.min(BLIGHT_MAX, BLIGHT_BASE + BLIGHT_PER_DY * v.bred.length) : 0);
/** Is this point in the blight? */
export const isBlighted = (v: { blight: number }, x: number, z: number): boolean => !!lairAt && v.blight > 0 && Math.hypot(x - lairAt.x, z - lairAt.z) <= v.blight;
/** Dawn: the blight moves toward its reach, told when it spreads or draws back. */
function stepBlight(v: Village): void {
  const target = blightTarget(v), before = v.blight; if (!lairAt || target === before) return;
  v.blight = target > before ? Math.min(target, before + BLIGHT_STEP) : Math.max(target, before - BLIGHT_STEP);
  event(v, v.blight > before ? `The blight spreads: ${Math.round(v.blight)} m round the mother, her roots closed to Hulda` : v.blight > 0 ? `The blight draws back to ${Math.round(v.blight)} m round the mother` : 'The blight is gone from the forest', true);
}
/** Infants kept at the lair lie BROOD_RING m from its heart, inside the mother's reach: taking one back is a delve. Tuning. */
export const BROOD_RING = 3.2;
export const SNATCH_TICK = 900, SNATCHERS_PER_NIGHT = 1, SNATCH_PACE = 9, SNATCH_ENTER_S = 4, TELL_RANGE = 25, GESTATION_TICKS = DAY_TICKS, DY_MAX = 8, PICK_RANGE = 1.4, HOME_RANGE = 2.4;
export const DY_DEVOUR_S = 10, SPOIL_TICKS = DAY_TICKS, DARK_PER_UNIT = 1, DARK_PER_SITE = 3, DARK_FED_DAYS = 3, DY_FLEE = 9, LAIR_HOME = 10, HOLD_RANGE = 3.5, HOLD_SAP = 3, HOLD_MELT_S = 60, MELT_S = 6;
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
function hurtLair(v: Village, dmg: number): void { const l = v.lair; if (!l.alive) return; l.hp = Math.max(0, l.hp - dmg); l.hurt = 0.3; if (l.hp === 0) { l.alive = false; l.slainDay = dayOf(v.tick); l.woke = false; gainXp(v, XP_LAIR); v.brood.forEach((b, i) => { const p = broodSpot(i)!; v.dropped.push({ infant: b.infant, x: p.x, z: p.z }); }); if (v.brood.length) event(v, 'The mother of goats is gone: the infants she held lie free', true); v.brood = []; for (const r of v.raiders) if (r.state !== 'dead') { r.state = 'leaving'; r.aggro = 0; } } }
/** The lair by real seconds while she is near: waking, brooding Dark Young, sweeping. Regrows once the peace is over. */
function stepLair(v: Village, dt: number, her: Vec2 | null): void {
  const l = v.lair; l.hurt = Math.max(0, l.hurt - dt); if (!lairAt) return;
  if (!l.alive) { if (dayOf(v.tick) >= l.slainDay + LAIR_PEACE_DAYS) { l.alive = true; l.hp = LAIR_HP; } return; }
  if (!her) { l.woke = false; return; } const d = Math.hypot(her.x - lairAt.x, her.z - lairAt.z); l.woke = d <= LAIR_WAKE; if (!l.woke) return;
  l.spawnClock += dt; const brood = v.raiders.filter(r => r.state !== 'dead' && Math.hypot(r.x - lairAt!.x, r.z - lairAt!.z) < LAIR_WAKE + 10).length;
  const free = atHome(v)[0]; if (l.spawnClock >= LAIR_SPAWN_S && brood < LAIR_BROOD && free) { l.spawnClock = 0; const a = Math.atan2(her.z - lairAt.z, her.x - lairAt.x) + (brood - 1) * 0.9, id = v.raiders.reduce((m, r) => Math.max(m, r.id), -1) + 1; v.raiders.push({ id, x: lairAt.x + Math.cos(a) * 5, z: lairAt.z + Math.sin(a) * 5, heading: a, hp: DY_HP, state: 'hunting', target: null, ate: 0, eatClock: 0, aggro: DY_AGGRO_S * 4, rooted: 0, biteClock: 0, hurt: 0, gone: 0, site: null, devourClock: 0, held: 0, infant: free, kind: 'dy', den: null, prey: null }); }
  l.sweepClock += dt; if (l.sweepClock >= LAIR_SWEEP_S) { l.sweepClock = 0; if (d <= LAIR_REACH && v.hero.faint === 0) { v.hero.vigor = Math.max(0, v.hero.vigor - LAIR_SWEEP); v.hero.calm = 0; if (v.hero.vigor === 0) v.hero.faint = FAINT_S; } }
}
// G3a (EXPANSION.md): the dens and their wolves. A den within DEN_REACH of the green (set by the entry from the overworld's dens) sends its pack down at WOLF_TICK (dusk) while it has wolves and its peace is over; they come from the wood's edge on the den's side and hunt whoever is still out of doors: a villager within WOLF_SCARE runs home at FLEE_PACE ("wolves!"), one caught within WOLF_REACH is bitten (WOLF_BITE_MEALS off their strength, as meals missed; never killed by the bite). A wolf hunts her too when struck, and bites WOLF_BITE. Wolves die (WOLF_HP): the den's count falls, and with the pack slain the den lies quiet for DEN_PEACE_DAYS, then a wolf a day comes back. They leave at WOLF_END. Tuning. */
export const WOLF_TICK = 735, WOLF_END = 840, WOLF_HP = 18, WOLF_PACE = 2.6, WOLF_BITE_MEALS = 2, WOLF_REACH = 1.2, WOLF_BITE_S = 2.5, WOLF_SCARE = 14, FLEE_PACE = 1.5, WOLF_BITE = 8, DEN_PEACE_DAYS = 3, XP_WOLF = 1, DEN_REACH_M = 500;
export interface DenPlace { id: string; x: number; z: number; pack: number }
export let densAt: DenPlace[] = [];
export const setDens = (list: DenPlace[]): void => { densAt = list; };
/** The dens whose packs come down on this village. */
export const densInReach = (): DenPlace[] => densAt.filter(d => Math.hypot(d.x, d.z) <= DEN_REACH_M);
export const denState = (v: Village, d: DenPlace): DenState => (v.dens[d.id] ??= { alive: d.pack, quietDay: -1 });
/** A den with wolves at it whose peace is over: a threat at dusk. */
export const denAwake = (v: Village, d: DenPlace): boolean => { const st = denState(v, d); return st.alive > 0 && dayOf(v.tick) >= st.quietDay; };
function spawnWolves(v: Village, rand: () => number): void {
  v.wolfDay = dayOf(v.tick);
  for (const d of densInReach()) { if (!denAwake(v, d)) continue; const st = denState(v, d), a0 = Math.atan2(d.z, d.x);
    for (let i = 0; i < st.alive; i++) { const a = a0 + (i - (st.alive - 1) / 2) * 0.12 + (rand() - 0.5) * 0.1, id = v.raiders.reduce((m, r) => Math.max(m, r.id), -1) + 1, x = Math.cos(a) * RAID_FROM, z = Math.sin(a) * RAID_FROM; v.raiders.push({ id, x, z, heading: Math.atan2(-z, -x), hp: WOLF_HP, state: 'coming', target: null, ate: 0, eatClock: 0, aggro: 0, rooted: 0, biteClock: 0, hurt: 0, gone: 0, site: null, devourClock: 0, held: 0, infant: null, kind: 'wolf', den: d.id, prey: null }); }
    event(v, `Wolves come down from the ${bearingWords(bearingFromGreen(d.x, d.z))} at dusk`, true); }
}
export const wolves = (v: Village): Raider[] => v.raiders.filter(r => r.kind === 'wolf' && r.state !== 'dead');
/** A wolf's hunting by real seconds: the nearest villager out of doors, else the green to prowl; a bite when it reaches one. */
function stepWolf(v: Village, r: Raider, dt: number, t: number): void {
  if (t >= WOLF_END || t < WOLF_TICK) r.state = 'leaving';
  if (r.state === 'leaving') { const a = Math.atan2(r.z, r.x), out = { x: Math.cos(a) * (RAID_FROM + 2), z: Math.sin(a) * (RAID_FROM + 2) }; if (towards(r, out, WOLF_PACE * 1.3 * dt) < 0.5) r.gone = DY_CORPSE_S; return; }
  r.biteClock = Math.max(0, r.biteClock - dt);
  let prey = r.prey ? v.hobbits.find(s => s.id === r.prey && !s.inside && s.stage !== 'infant') ?? null : null;
  if (!prey) { let bd = Infinity; for (const s of v.hobbits) { if (s.inside || s.stage === 'infant') continue; const d = Math.hypot(s.x - r.x, s.z - r.z); if (d < bd) { bd = d; prey = s; } } r.prey = prey?.id ?? null; }
  if (!prey) { r.state = 'eating'; if (towards(r, { x: GREEN.x + Math.cos(r.id) * 2.5, z: GREEN.z + Math.sin(r.id) * 2.5 }, WOLF_PACE * dt) < 0.3) r.heading += dt * 0.6; return; }
  r.state = 'hunting'; const d = Math.hypot(prey.x - r.x, prey.z - r.z);
  if (d > WOLF_REACH) { towards(r, prey, WOLF_PACE * dt); return; }
  r.heading = Math.atan2(prey.z - r.z, prey.x - r.x);
  if (r.biteClock <= 0) { r.biteClock = WOLF_BITE_S; prey.missed = Math.min(DEATH_MEALS - 1, prey.missed + WOLF_BITE_MEALS); prey.bubble = 'bitten!'; prey.bubbleUntil = v.tick + BUBBLE_TICKS * 2; v.bitten += 1; event(v, `${hobbitById(prey.id).name} is bitten by a wolf`, v.bitten === 1); r.prey = null; }
}
/** The fullest store but the trough, by share of cap, with a unit in it: what a Dark Young goes for. */
export function fullestStore(v: Village): Store | null { let best: Store | null = null; for (const k of STORE_LIST) if (k !== 'water' && k !== 'dark' && v.stores[k] >= 1 && (best === null || v.stores[k] / STORES[k].cap > v.stores[best] / STORES[best].cap)) best = k; return best; }
export function spawnRaid(v: Village, rand: () => number): void {
  // Noah: a Dark Young cannot exist without an infant inside it, so the raid is every Dark Young bred of a stolen infant and at the lair tonight, and nothing else.
  const bred = atHome(v).slice(0, DY_MAX), n = bred.length, a0 = rand() * Math.PI * 2; if (!n) { v.raidDay = dayOf(v.tick); return; }
  for (let i = 0; i < n; i++) { const a = a0 + (i - (n - 1) / 2) * 0.35 + (rand() - 0.5) * 0.2, id = v.raiders.reduce((m, r) => Math.max(m, r.id), -1) + 1; let x = Math.cos(a) * RAID_FROM, z = Math.sin(a) * RAID_FROM; if (inWater(x, z)) { x = Math.cos(a + 1.2) * RAID_FROM; z = Math.sin(a + 1.2) * RAID_FROM; } v.raiders.push({ id, x, z, heading: Math.atan2(-z, -x), hp: DY_HP, state: 'coming', target: null, ate: 0, eatClock: 0, aggro: 0, rooted: 0, biteClock: 0, hurt: 0, gone: 0, site: null, devourClock: 0, held: 0, infant: bred[i] ?? null, kind: 'dy', den: null, prey: null }); }
  v.raidDay = dayOf(v.tick);
}
const towards = (r: { x: number; z: number; heading: number }, to: Vec2, m: number): number => { const d = Math.hypot(to.x - r.x, to.z - r.z); if (d < 1e-6) return 0; const step = Math.min(d, m); r.heading = Math.atan2(to.z - r.z, to.x - r.x); r.x += (to.x - r.x) / d * step; r.z += (to.z - r.z) / d * step; return d - step; };
/** The Dark Young by real seconds: walking, eating, hunting her, biting, leaving, and the dead fading; her vigor and sap refilling. `her` is where she stands (null while she is not on her feet). */
export function stepRaiders(v: Village, dt: number, her: Vec2 | null): void {
  const h = v.hero; h.calm += dt; h.sap = Math.min(sapMax(h), h.sap + SAP_REGEN * dt); if (h.faint > 0) { h.faint = Math.max(0, h.faint - dt); if (h.faint === 0) h.vigor = Math.max(h.vigor, FAINT_VIGOR); } else if (h.calm > VIGOR_CALM_S) h.vigor = Math.min(vigorMax(h), h.vigor + VIGOR_REGEN * dt);
  // The dark forest drains her by depth while she stands in it; at the bottom she faints as from a bite.
  if (her && h.faint === 0) { const depth = forestDepth(her.x, her.z); if (depth > 0) { h.vigor = Math.max(0, h.vigor - FOREST_DRAIN * depth * dt); h.calm = 0; if (h.vigor === 0) h.faint = FAINT_S; } }
  stepLair(v, dt, her); stepSnatchers(v, dt);
  const t = v.tick % DAY_TICKS, night = phaseAt(v.tick) === 'night', leaveAll = !night || t >= RAID_END;
  for (const r of v.raiders) {
    r.hurt = Math.max(0, r.hurt - dt); if (r.state === 'dead' || r.state === 'melting') { r.gone += dt; continue; }
    if (r.rooted > 0) {
      // The hold (D2): while she stands by a rooted one the bind does not run down, for sap; held long enough, a retreating one withers and melts.
      // One hold at a time (Noah asked what limits it): only the one she bound last, while she stands by it and has sap; the others' binds run down.
      const held = r.id === h.holding && her && h.faint === 0 && h.sap > 0 && Math.hypot(her.x - r.x, her.z - r.z) <= HOLD_RANGE;
      if (r.id === h.holding && !held) { h.holding = -1; event(v, h.sap <= 0 ? 'Her sap is spent: the Dark Young tears free of the roots' : 'She has stepped away: the roots let go', true); }
      if (held) { h.sap = Math.max(0, h.sap - HOLD_SAP * dt); if (h.sap <= 0) { h.holding = -1; event(v, 'Her sap is spent: the Dark Young tears free of the roots', true); r.rooted = Math.min(r.rooted, 0.5); continue; } r.rooted = Math.max(r.rooted, ROOT_S / 2); r.held += dt; if (r.state === 'retreating' && r.held >= HOLD_MELT_S) { melt(v, r); continue; } }
      else r.rooted = Math.max(0, r.rooted - dt);
      r.aggro = Math.max(0, r.aggro - dt); continue;
    }
    if (r.kind === 'wolf' && !(r.aggro > 0 && her && h.faint === 0)) { stepWolf(v, r, dt, t); continue; }
    if (r.state === 'retreating') {
      // Beaten, it runs for the lair flat and fast, ignoring her; home, it is gone (to regenerate).
      const home = lairAt ? { x: lairAt.x, z: lairAt.z } : (() => { const a = Math.atan2(r.z, r.x); return { x: Math.cos(a) * RAID_FROM * 3, z: Math.sin(a) * RAID_FROM * 3 }; })();
      if (towards(r, home, DY_FLEE * dt) < LAIR_HOME) r.gone = DY_CORPSE_S; continue;
    }
    if (r.aggro > 0 && her && h.faint === 0) {
      // Hunting her: to her at a charge, a bite within reach.
      r.state = 'hunting'; r.aggro -= dt; const d = Math.hypot(her.x - r.x, her.z - r.z);
      if (d > DY_REACH) towards(r, her, DY_CHARGE * dt); else { r.heading = Math.atan2(her.z - r.z, her.x - r.x); r.biteClock += dt; if (r.biteClock >= DY_BITE_S) { r.biteClock = 0; h.vigor = Math.max(0, h.vigor - (r.kind === 'wolf' ? WOLF_BITE : DY_BITE)); h.calm = 0; if (h.vigor === 0) { h.faint = FAINT_S; r.aggro = 0; } } }
      if (r.aggro <= 0) { r.aggro = 0; r.state = 'coming'; r.target = null; }
      continue;
    }
    if (leaveAll) r.state = 'leaving';
    if (r.state === 'leaving') { const a = Math.atan2(r.z, r.x), out = { x: Math.cos(a) * (RAID_FROM + 2), z: Math.sin(a) * (RAID_FROM + 2) }; if (towards(r, out, DY_FLEE * dt) < 0.5) r.gone = DY_CORPSE_S; continue; }
    // Fed at the stores (or finding none), it goes on to a yielding place and devours it (D2).
    if (r.ate >= DY_FILL || ((r.state === 'coming' || r.state === 'hunting') && !fullestStore(v))) { if (r.state !== 'devouring') { r.site = nextSiteToSpoil(v, r); if (!r.site) { r.state = 'leaving'; continue; } r.state = 'devouring'; r.devourClock = 0; } }
    if (r.state === 'devouring') {
      const site = r.site ? SITES[r.site] : null; if (!site || !r.site || isSpoiled(v, r.site)) { r.site = nextSiteToSpoil(v, r); if (!r.site) { r.state = 'leaving'; continue; } r.devourClock = 0; continue; }
      if (towards(r, site, DY_PACE * dt) > site.radius * 0.6) continue;
      r.devourClock += dt; if (r.devourClock >= DY_DEVOUR_S) { spoil(v, r.site); r.ate = 0; r.state = 'leaving'; }
      continue;
    }
    if (r.state === 'coming' || r.state === 'hunting') { if (!r.target || v.stores[r.target] < 1) r.target = fullestStore(v); if (!r.target) { r.state = 'leaving'; continue; } const spot = storeSpot(STORES[r.target]); if (towards(r, spot, DY_PACE * dt) < 0.3) { r.state = 'eating'; r.eatClock = 0; r.heading = Math.atan2(STORES[r.target].z - r.z, STORES[r.target].x - r.x); } continue; }
    if (r.state === 'eating') { if (!r.target || v.stores[r.target] < 1) { r.target = null; r.state = 'coming'; continue; } r.eatClock += dt; if (r.eatClock >= DY_EAT_S) { r.eatClock = 0; v.stores[r.target] -= 1; r.ate += 1; v.eaten += 1; v.raidEaten += 1; v.stores.dark = Math.min(STORES.dark.cap, v.stores.dark + DARK_PER_UNIT); } }
  }
  v.raiders = v.raiders.filter(r => !((r.state === 'dead' || r.state === 'melting') && r.gone >= (r.kind === 'wolf' ? DY_CORPSE_S : MELT_S)) && !((r.state === 'leaving' || r.state === 'retreating') && r.gone >= DY_CORPSE_S));
}
/** The yielding place a Dark Young goes to spoil: the nearest still clean, with stock first. */
function nextSiteToSpoil(v: Village, r: Vec2): YieldSite | null {
  const clean = YIELD_SITES.filter(k => !isSpoiled(v, k)); if (!clean.length) return null;
  const stocked = clean.filter(k => landStock(v, YIELD_OF[k]!) >= 1), from = stocked.length ? stocked : clean;
  return from.sort((a, b) => Math.hypot(SITES[a].x - r.x, SITES[a].z - r.z) - Math.hypot(SITES[b].x - r.x, SITES[b].z - r.z))[0];
}
/** A place devoured: spoiled for SPOIL_TICKS, its stock gone, their leavings on the heap. */
export function spoil(v: Village, site: YieldSite): void {
  const fresh = !isSpoiled(v, site); v.land.spoiled[site] = v.tick + SPOIL_TICKS;
  if (site === 'thicket') v.land.berries = 0; else if (site === 'copse') v.land.branches = 0; else if (site === 'pen') v.land.milk = 0; else v.land.crops = v.land.crops.map(() => 0);
  v.stores.dark = Math.min(STORES.dark.cap, v.stores.dark + DARK_PER_SITE); if (fresh) event(v, `${SITES[site].name} is spoiled`);
}
/** A held Dark Young withers and melts: it is gone for good, and counts as slain. */
function melt(v: Village, r: Raider): void {
  if (v.hero.holding === r.id) v.hero.holding = -1;
  r.state = 'melting'; r.gone = 0; r.rooted = 0; r.aggro = 0; v.slain += 1; v.melted += 1; gainXp(v, XP_DY);
  // D3: one bred of an infant leaves the infant where it melted.
  if (r.infant) { const ref = r.infant; v.bred = v.bred.filter(b => b.id !== ref.id); v.dropped.push({ infant: ref, x: r.x, z: r.z }); r.infant = null; event(v, `A Dark Young melts, and ${hobbitById(ref.id).name} lies where it was`, true); }
  else event(v, 'a Dark Young melts away');
}
// D3, the snatchers and the infants.
const infantName = (ref: InfantRef): string => hobbitById(ref.id).name;
/** Every infant out of its house: carried off, at the lair, bred, lying out, in her arms. */
export const takenIds = (v: Village): string[] => [...v.snatchers.filter(n => n.infant).map(n => n.infant!.id), ...v.brood.map(b => b.infant.id), ...v.bred.map(b => b.id), ...v.dropped.map(d => d.infant.id), ...(v.carried ? [v.carried.id] : [])];
/** A hobbit's state for an infant in its house (born, or brought home). */
function infantState(v: Village, ref: InfantRef): HobbitState { const house = housePlace(ref.home), d = house.door; return { id: ref.id, x: d.x, z: d.z, heading: house.facing, activity: 'sleeping', want: 'home', job: 'gather', path: [], speed: 0, inside: true, bubble: '', bubbleUntil: 0, wanderAt: 0, faceAt: 0, hunger: 0, carry: null, errand: null, gatherAt: 0, eatUntil: 0, jobAt: 0, meals: 0, ate: mealSlot(v.tick), home: ref.home, stage: 'infant', born: ref.born, missed: 0 }; }
const tellParents = (v: Village, home: number, text: string): void => { for (const o of living(v, home)) if (o.stage !== 'infant') { o.bubble = text; o.bubbleUntil = v.tick + BUBBLE_TICKS * 4; } };
/** The bred Dark Young not abroad: at the lair. */
export const atHome = (v: Village): InfantRef[] => v.bred.filter(b => !v.raiders.some(r => r.infant?.id === b.id && r.state !== 'melting'));
const lairPoint = (from: Vec2): Vec2 => (lairAt ? { x: lairAt.x, z: lairAt.z } : (() => { const a = Math.atan2(from.z, from.x) || 0; return { x: Math.cos(a) * RAID_FROM * 3, z: Math.sin(a) * RAID_FROM * 3 }; })());
/** Nightfall: the snatchers set out, if there is an infant to take. */
function spawnSnatchers(v: Village): void {
  v.snatchDay = dayOf(v.tick); if (!v.hobbits.some(s => s.stage === 'infant') && !v.dropped.length) return;
  for (let i = 0; i < SNATCHERS_PER_NIGHT; i++) { const o = lairPoint({ x: 1, z: 1 }), id = v.snatchers.reduce((m, n) => Math.max(m, n.id), -1) + 1; v.snatchers.push({ id, x: o.x + i * 2, z: o.z, heading: Math.atan2(-o.z, -o.x), state: 'coming', targetId: null, clock: 0, infant: null, told: false }); }
}
/** Where a snatcher's infant is: in a house (at its door) or lying out. */
function snatchTarget(v: Village, n: Snatcher): { at: Vec2; lying: boolean } | null {
  const lie = v.dropped.find(d => d.infant.id === n.targetId); if (lie) return { at: lie, lying: true };
  const s = v.hobbits.find(h => h.id === n.targetId && h.stage === 'infant'); return s ? { at: housePlace(s.home).door, lying: false } : null;
}
function pickTarget(v: Village, n: Snatcher): string | null {
  const lying = [...v.dropped].sort((a, b) => Math.hypot(a.x - n.x, a.z - n.z) - Math.hypot(b.x - n.x, b.z - n.z))[0]; if (lying) return lying.infant.id;
  const inf = v.hobbits.filter(s => s.stage === 'infant').sort((a, b) => Math.hypot(housePlace(a.home).door.x - n.x, housePlace(a.home).door.z - n.z) - Math.hypot(housePlace(b.home).door.x - n.x, housePlace(b.home).door.z - n.z))[0];
  return inf ? inf.id : null;
}
/** The snatchers by real seconds: to the infant, in, and back to the lair; at the lair the infant is kept. */
function stepSnatchers(v: Village, dt: number): void {
  for (const n of v.snatchers) {
    if (n.state === 'fleeing') { const home = lairPoint(n); if (towards(n, home, SNATCH_PACE * dt) < LAIR_HOME) { if (n.infant) v.brood.push({ infant: n.infant, due: v.tick + GESTATION_TICKS }); n.infant = null; n.clock = -1; } continue; }
    let t = snatchTarget(v, n); if (!t) { n.targetId = pickTarget(v, n); n.state = 'coming'; t = snatchTarget(v, n); if (!t) { n.state = 'fleeing'; continue; } }
    if (!n.told && Math.hypot(n.x - GREEN.x, n.z - GREEN.z) < TELL_RANGE) { n.told = true; event(v, 'The goats are bleating: something small is coming for the infants', true); }
    if (n.state === 'coming') { if (towards(n, t.at, SNATCH_PACE * dt) < 0.4) { n.state = 'taking'; n.clock = 0; } continue; }
    n.clock += dt; if (n.clock < (t.lying ? 0.5 : SNATCH_ENTER_S)) continue;
    let ref: InfantRef;
    if (t.lying) { const i = v.dropped.findIndex(d => d.infant.id === n.targetId); ref = v.dropped.splice(i, 1)[0].infant; event(v, `${infantName(ref)} is taken again`, true); }
    else { const s = v.hobbits.find(h => h.id === n.targetId)!; v.hobbits.splice(v.hobbits.indexOf(s), 1); ref = { id: s.id, home: s.home, born: s.born }; v.taken += 1; event(v, `${infantName(ref)} is taken in the night`, true); tellParents(v, ref.home, `${infantName(ref)} is gone`); v.mourningUntil = v.tick + MOURN_TICKS; }
    n.infant = ref; n.state = 'fleeing';
  }
  v.snatchers = v.snatchers.filter(n => n.clock >= 0);
}
/** Her blows reach the snatchers too: any within `range` drops what it carries and runs. Returns how many. */
function scare(v: Village, her: Vec2, range: number): number {
  let k = 0; for (const n of v.snatchers) { if (n.clock < 0 || Math.hypot(n.x - her.x, n.z - her.z) > range) continue; k++; if (n.infant) { v.dropped.push({ infant: n.infant, x: n.x, z: n.z }); event(v, `it drops ${infantName(n.infant)}`); n.infant = null; } n.state = 'fleeing'; n.targetId = null; }
  return k;
}
/** Her arms: an infant lying within PICK_RANGE is taken up (her hands empty); carried to within HOME_RANGE of its door, it is home. */
/** Where the infants kept at the lair lie, held in the mother's roots round her heart. */
export const broodSpot = (i: number): Vec2 | null => (lairAt ? { x: lairAt.x + Math.cos(i * 2.4 + 0.5) * BROOD_RING, z: lairAt.z + Math.sin(i * 2.4 + 0.5) * BROOD_RING } : null);
export function carryInfant(v: Village, her: Vec2): 'picked' | 'home' | null {
  if (!v.carried && !v.stack) { const i = v.brood.findIndex((_, k) => { const p = broodSpot(k); return !!p && Math.hypot(p.x - her.x, p.z - her.z) <= PICK_RANGE; }); if (i >= 0) { v.carried = v.brood.splice(i, 1)[0].infant; event(v, `She takes ${infantName(v.carried)} back from the mother`, true); return 'picked'; } }
  if (!v.carried) { if (v.stack) return null; const i = v.dropped.findIndex(d => Math.hypot(d.x - her.x, d.z - her.z) <= PICK_RANGE); if (i < 0) return null; v.carried = v.dropped.splice(i, 1)[0].infant; return 'picked'; }
  const ref = v.carried, door = housePlace(ref.home).door; if (Math.hypot(door.x - her.x, door.z - her.z) > HOME_RANGE) return null;
  const home = living(v, ref.home).length < ROOM_PER_HOUSE ? ref.home : houseWithRoom(v)?.id ?? ref.home;
  v.hobbits.push(infantState(v, { ...ref, home })); v.carried = null; v.returned += 1; event(v, `${infantName(ref)} is home`, true); tellParents(v, home, `${infantName(ref)} is home`); return 'home';
}
/** She falls with an infant in her arms: it lies where she fell. */
export function dropCarried(v: Village, x: number, z: number): void { if (v.carried) { v.dropped.push({ infant: v.carried, x, z }); v.carried = null; } }
/** Hurt a Dark Young: it turns on her; at no hp it is dead. */
function hurt(v: Village, r: Raider, dmg: number): void {
  if (r.state === 'retreating' || r.state === 'dead') return; r.hp = Math.max(0, r.hp - dmg); r.hurt = 0.3; r.aggro = Math.max(r.aggro, DY_AGGRO_S);
  if (r.hp > 0) return;
  if (r.kind === 'wolf') { r.state = 'dead'; r.gone = 0; r.aggro = 0; r.rooted = 0; v.slain += 1; gainXp(v, XP_WOLF); const d = densAt.find(x => x.id === r.den); if (d) { const st = denState(v, d); st.alive = Math.max(0, st.alive - 1); if (st.alive === 0) { st.quietDay = dayOf(v.tick) + DEN_PEACE_DAYS; event(v, 'The pack is slain: the den lies quiet', true); } } return; }
  r.state = 'retreating'; r.aggro = 0; r.ate = 0; r.held = 0;
}
/** The ones her strikes can reach: not the melting, not the beaten (those only the roots can hold). */
const alive = (v: Village): Raider[] => v.raiders.filter(r => r.state !== 'dead' && r.state !== 'melting' && r.state !== 'retreating');
/** The ones her root bind can hold: everything still on the land, the beaten first of all. */
const bindable = (v: Village): Raider[] => v.raiders.filter(r => r.state !== 'dead' && r.state !== 'melting');
/** Her strike: the nearest Dark Young within reach and ahead of her (facing (fx, fz)). Returns it, or null when nothing was there. */
export function strike(v: Village, her: Vec2, fx: number, fz: number): Raider | null {
  scare(v, her, STRIKE_RANGE + 0.6);
  let best: Raider | null = null, bd = Infinity; for (const r of alive(v)) { const dx = r.x - her.x, dz = r.z - her.z, d = Math.hypot(dx, dz); if (d <= STRIKE_RANGE + 0.6 && (dx * fx + dz * fz) / (d || 1) > -0.2 && d < bd) { best = r; bd = d; } }
  if (best) hurt(v, best, strikeDamage(v.hero)); else if (lairAt && v.lair.alive && Math.hypot(her.x - lairAt.x, her.z - lairAt.z) <= LAIR_HURT_RANGE) hurtLair(v, strikeDamage(v.hero));
  return best;
}
/** Her thorn burst: everything within THORN_RANGE, for THORN_SAP. Returns how many were hurt, or -1 without the sap. */
export function thornBurst(v: Village, her: Vec2): number { if (v.hero.sap < THORN_SAP) return -1; v.hero.sap -= THORN_SAP; let n = scare(v, her, THORN_RANGE + 0.6); for (const r of alive(v)) if (Math.hypot(r.x - her.x, r.z - her.z) <= THORN_RANGE + 0.6) { hurt(v, r, THORN_DMG); n++; } if (lairAt && v.lair.alive && Math.hypot(her.x - lairAt.x, her.z - lairAt.z) <= LAIR_HURT_RANGE) { hurtLair(v, THORN_DMG); n++; } return n; }
/** Her root bind: the nearest within ROOT_RANGE held for ROOT_S, for ROOT_SAP. Returns it, null when none, or undefined without the sap. */
export function rootBind(v: Village, her: Vec2): Raider | null | undefined { if (v.hero.sap < ROOT_SAP) return undefined; if (scare(v, her, ROOT_RANGE + 0.6)) v.hero.sap -= ROOT_SAP; let best: Raider | null = null, bd = Infinity; for (const r of bindable(v)) { const d = Math.hypot(r.x - her.x, r.z - her.z); if (d <= ROOT_RANGE + 0.6 && d < bd) { best = r; bd = d; } } if (!best) return null; v.hero.sap -= ROOT_SAP; v.hero.holding = best.id; best.rooted = ROOT_S; best.aggro = Math.max(best.aggro, DY_AGGRO_S); return best; }
/** Advance the village by whole ticks. Deterministic: the only randomness is the seeded stream, drawn in a fixed order. */
export function advance(v: Village, ticks: number): void {
  for (let n = 0; n < ticks; n++) {
    const rand = mulberry32((v.seed * 7919 + v.tick * 131) >>> 0), t = v.tick % DAY_TICKS, phase = phaseAt(v.tick);
    // The land by the day: at dawn the branches drop and the goats have their milk; the bushes and the strips grow every minute; the fire burns down through the night.
    if (t === 0) { if (!isSpoiled(v, 'copse')) v.land.branches = Math.min(BRANCH_CAP, v.land.branches + BRANCHES_PER_DAY); if (!isSpoiled(v, 'pen')) v.land.milk = MILK_PER_DAY; v.lastTake = v.take; v.take = freshTake(); v.fedStreak = v.dayMissed ? 0 : v.fedStreak + 1; v.lastRaidEaten = v.raidEaten; v.raidEaten = 0; v.lastBitten = v.bitten; v.bitten = 0; for (const d of densAt) { const st = v.dens[d.id]; if (st && st.alive < d.pack && dayOf(v.tick) >= st.quietDay) st.alive++; } daybreak(v); newDay(v); stepBlight(v); }
    for (const k of YIELD_SITES) if (v.land.spoiled[k] > 0 && v.land.spoiled[k] <= v.tick) { v.land.spoiled[k] = 0; event(v, `${SITES[k].name} is clean again`); }
    if (!isSpoiled(v, 'thicket')) v.land.berries = Math.min(BERRY_CAP, v.land.berries + BERRY_REGROW / DAY_TICKS);
    if (!isSpoiled(v, 'field')) for (let i = 0; i < v.land.crops.length; i++) v.land.crops[i] = Math.min(1, v.land.crops[i] + 1 / (CROP_DAYS * DAY_TICKS));
    if (phase === 'night' && v.fireWood > 0) v.fireWood = Math.max(0, v.fireWood - WOOD_PER_NIGHT / (DAY_TICKS - PHASES[5][1]));
    // Nightfall's raid: the Dark Young come once a night, while everyone sleeps.
    if (t === RAID_TICK && v.raidDay < dayOf(v.tick) && !raidsPaused(v)) spawnRaid(v, rand);
    if (t === SNATCH_TICK && v.snatchDay < dayOf(v.tick) && !raidsPaused(v)) spawnSnatchers(v);
    if (t === WOLF_TICK && v.wolfDay < dayOf(v.tick)) spawnWolves(v, rand);
    // At the lair an infant becomes a Dark Young.
    for (let i = v.brood.length - 1; i >= 0; i--) if (v.brood[i].due <= v.tick) { const ref = v.brood.splice(i, 1)[0].infant; v.bred.push(ref); event(v, `A Dark Young is born of ${hobbitById(ref.id).name}`, true); }
    let praying = 0, nell = false;
    const wolfPack = wolves(v).filter(r => r.state !== 'leaving');
    const hut = siteHouse(v), hutSite: Site | null = hut ? { id: 'hut', x: hut.door.x, z: hut.door.z, radius: 0.9, name: 'the new hut', verb: 'building the new hut' } : null;
    for (const s of v.hobbits) {
      const h = hobbitById(s.id), house = homeOf(s), kind = YIELD_OF[h.keeps] ?? null;
      if (s.job === 'build' && !hutSite) { s.job = 'gather'; s.gatherAt = v.tick + GATHER_TICKS; s.jobAt = v.tick; if (s.errand === 'fetch' || s.errand === 'hut') { s.errand = null; s.path = []; } }
      // An infant stays in the house and eats from its parents' share, unseen; it costs nothing yet and gathers nothing.
      if (s.stage === 'infant') { s.inside = true; s.activity = 'sleeping'; s.speed = 0; s.hunger = 0; continue; }
      // Starving, they keep to the stone instead of their place (and still come to the fire for meals).
      const want = wants(h, v.tick);
      const say = (text: string): void => { s.bubble = text; s.bubbleUntil = v.tick + BUBBLE_TICKS; };
      // G3: wolves near, and a villager out of doors drops everything and runs for the door.
      if (!s.inside && s.errand !== 'flee' && wolfPack.some(w => Math.hypot(w.x - s.x, w.z - s.z) < WOLF_SCARE)) { s.errand = 'flee'; s.path = [{ ...house.door }]; s.activity = 'returning'; s.eatUntil = 0; say('wolves!'); }
      const site = want === 'home' ? null : want === 'green' ? SITES.fire : s.job === 'build' && kind && hutSite ? hutSite : s.job === 'pray' && kind ? SITES.shrine : SITES[h.keeps];
      const goal = (): Vec2 => (site ? spotAt(site, rand) : house.door);
      const mealSpot = (): Vec2 => spotAt(SITES.fire, rand, 0.4);
      s.hunger = Math.min(1, s.hunger + HUNGER_PER_TICK * (s.inside ? 0.5 : 1));
      if (want !== s.want && want === 'home' && s.inside) { s.want = want; s.eatUntil = 0; }
      if (want !== s.want && s.errand === 'flee') s.want = want;
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
      if (s.missed >= REST_MEALS && want === 'place' && s.job === 'gather' && !s.carry && !s.errand) { s.job = 'pray'; s.path = route(s, spotAt(SITES.shrine, rand, 0.7)); s.activity = 'walking'; say('too weak to work'); }
      if (s.eatUntil > v.tick) { s.activity = 'eating'; s.speed = 0; s.heading = Math.atan2(SITES.fire.z - s.z, SITES.fire.x - s.x); continue; }
      if (s.eatUntil === v.tick && s.errand === 'meal') { s.errand = null; s.path = route(s, goal()); s.activity = want === 'home' ? 'returning' : 'walking'; }
      if (s.path.length) {
        const pace = paceOf(s) * (s.errand === 'flee' ? FLEE_PACE : 1), step = s.path[0], d = dist(s, step), move = Math.min(d, pace * PACE_TICK);
        if (d > 1e-6) { s.heading = Math.atan2(step.z - s.z, step.x - s.x); s.x += (step.x - s.x) / d * move; s.z += (step.z - s.z) / d * move; }
        s.speed = pace;
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
            } else if (s.errand === 'fetch') {
              // G1: at the store for the hut: an armful of what it still needs (less what others bring), then to the hut with it.
              const k: 'wood' | 'water' = dist(s, storeSpot(STORES.wood)) <= dist(s, storeSpot(STORES.water)) ? 'wood' : 'water', n = Math.min(CARRY[k], siteNeeds(v, k) - siteBringing(v, k), storeSpare(v, k));
              if (n >= 1 && hut) { v.stores[k] -= n; s.carry = { kind: k, n }; s.errand = 'hut'; s.path = route(s, hut.door); s.activity = 'carrying'; say(`${STORES[k].unit} for the hut`); }
              else { s.errand = null; s.path = route(s, goal()); s.activity = 'walking'; }
            } else if (s.errand === 'hut') {
              if (s.carry && v.site && (s.carry.kind === 'wood' || s.carry.kind === 'water')) { const k = s.carry.kind; v.site[k] = Math.min(k === 'wood' ? HUT_WOOD : HUT_WATER, v.site[k] + s.carry.n); s.carry = null; }
              else if (s.carry) { s.errand = 'deliver'; s.path = route(s, storeSpot(STORES[s.carry.kind])); s.activity = 'carrying'; continue; }
              s.errand = null; s.speed = 0; s.wanderAt = v.tick + WANDER_EVERY;
            } else if (s.errand === 'flee') { s.errand = null; s.inside = true; s.activity = 'sleeping'; s.speed = 0; s.x = house.door.x; s.z = house.door.z; say(''); }
            else if (!site) { s.inside = true; s.activity = 'sleeping'; s.speed = 0; s.x = house.door.x; s.z = house.door.z; say(''); }
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
        if (v.tick % 40 === 0 && rand() < 0.5) { const pool = rumors(v), mine = h.keeps === 'fire' ? pool.filter(r => r.who === 'elder') : h.keeps === 'shrine' ? pool.filter(r => r.who === 'keeper') : pool, from = mine.length ? mine : pool.filter(r => !r.who); if (from.length) { const r = from[Math.floor(rand() * from.length)]; say(r.text); voice(v, r, s.id); } }
      } else if (s.job === 'pray' && kind || h.keeps === 'shrine') {
        // Praying at the stone: faced to it, still; the stone's keeper always; a gatherer while the stores hold enough for the next meal.
        s.activity = 'praying'; s.heading = Math.atan2(SITES.shrine.z - s.z, SITES.shrine.x - s.x); praying++; if (h.keeps === 'shrine') nell = true;
        if (kind && v.tick >= s.jobAt) { s.jobAt = v.tick + JOB_EVERY; if (!supplied(v, kind) && landStock(v, kind) >= 1 && s.missed < REST_MEALS) { s.job = 'gather'; s.gatherAt = v.tick + GATHER_TICKS; s.path = route(s, spotAt(SITES[h.keeps], rand)); s.activity = 'walking'; say(''); continue; } if (hutSite && siteWants(v) && s.missed < REST_MEALS) { s.job = 'build'; s.path = route(s, spotAt(hutSite, rand, 0.4)); s.activity = 'walking'; say('to the new hut'); continue; } }
      } else if (s.job === 'build' && kind && hutSite && hut) {
        // G1: at the hut: fetch what it still needs from the stores, or build while the materials are in; nothing to do there, and they pray. Short again at their store, and they go back to gathering.
        s.activity = 'working'; s.heading = Math.atan2(hut.z - s.z, hut.x - s.x);
        if (v.tick >= s.jobAt) { s.jobAt = v.tick + JOB_EVERY; if (!supplied(v, kind) && landStock(v, kind) >= 1 && s.missed < REST_MEALS) { s.job = 'gather'; s.gatherAt = v.tick + GATHER_TICKS; s.path = route(s, spotAt(SITES[h.keeps], rand)); s.activity = 'walking'; say(''); continue; } }
        const w = siteWants(v);
        if (w === 'wood' || w === 'water') { s.errand = 'fetch'; s.path = route(s, storeSpot(STORES[w])); s.activity = 'walking'; say(`to ${STORES[w].name} for the hut`); continue; }
        if (w === 'work') { v.site!.work++; if (v.site!.work >= HUT_WORK_TICKS) finishHut(v); continue; }
        s.job = 'pray'; s.path = route(s, spotAt(SITES.shrine, rand, 0.7)); s.activity = 'walking'; say('to the stone'); continue;
      } else {
        s.activity = 'working'; if (site && v.tick >= s.faceAt) { s.heading = Math.atan2(site.z - s.z, site.x - s.x) + (rand() - 0.5) * 2.4; s.faceAt = v.tick + FACE_EVERY + Math.floor(rand() * FACE_EVERY); }
        // Gathering: a unit every GATHER_TICKS while the land has one and the store has room for it; an armful, or the last of what there is, goes to the store. Enough for the next meal already, and they go to the stone instead.
        if (kind && want === 'place' && v.tick >= s.jobAt) { s.jobAt = v.tick + JOB_EVERY; if (supplied(v, kind) && !s.carry) { if (hutSite && siteWants(v)) { s.job = 'build'; s.path = route(s, spotAt(hutSite, rand, 0.4)); s.activity = 'walking'; say('to the new hut'); continue; } s.job = 'pray'; s.path = route(s, spotAt(SITES.shrine, rand, 0.7)); s.activity = 'walking'; say('to the stone'); continue; } }
        if (kind && want === 'place' && v.tick >= s.gatherAt) {
          s.gatherAt = v.tick + GATHER_TICKS; const room = STORES[kind].cap - v.stores[kind] - inFlight(v, kind), stock = landStock(v, kind);
          if (!supplied(v, kind) || s.carry) s.carry = takeOne(v, kind, s.carry, room);
          if (s.carry && (s.carry.n >= CARRY[kind] || stock < 1 || room < 1 || supplied(v, kind))) { s.errand = 'deliver'; s.path = route(s, storeSpot(STORES[kind])); s.activity = 'carrying'; continue; }
        }
      }
      if (site && v.tick >= s.wanderAt && s.activity !== 'praying') { s.path = [spotAt(site, rand, 0.65)]; s.activity = 'walking'; s.wanderAt = v.tick + WANDER_EVERY + Math.floor(rand() * WANDER_EVERY); }
    }
    if (v.tick % JOB_EVERY === 0) tellState(v);
    v.prayer = Math.min(PRAYER_CAP, v.prayer + PRAYER_PER_TICK * praying * (nell ? 2 : 1)); v.prayed += PRAYER_PER_TICK * praying * (nell ? 2 : 1);
    for (const s of v.hobbits) if (s.missed >= DEATH_MEALS) { die(v, s); break; }
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
/** Something to tell: kept to the last EVENTS_KEPT. */
function event(v: Village, text: string, banner = false): void { v.events.push({ tick: v.tick, text, ...(banner ? { banner } : {}) }); if (v.events.length > EVENTS_KEPT) v.events.shift(); }
/** A death: the house empties of them, the name is gone from the living, what they carried is lost, the others mourn a day. */
function die(v: Village, s: HobbitState): void {
  v.hobbits.splice(v.hobbits.indexOf(s), 1); v.dead.push({ id: s.id, tick: v.tick }); v.mourningUntil = v.tick + MOURN_TICKS; const name = hobbitById(s.id).name;
  event(v, `${name} has died of hunger`); for (const o of v.hobbits) if (o.stage !== 'infant') { o.bubble = `mourning ${name}`; o.bubbleUntil = v.tick + BUBBLE_TICKS * 4; }
}
/** The house a child would be born into: one with room, the fullest first (parents), then by id. */
export const houseWithRoom = (v: Village): House | null => housesOf(v).filter(h => living(v, h.id).length < ROOM_PER_HOUSE).sort((a, b) => living(v, b.id).length - living(v, a.id).length || a.id - b.id)[0] ?? null;
/** The next newcomer to be born: the pool in order, the dead not born again. */
export const nextNewcomer = (v: Village): Hobbit | null => { const out = takenIds(v); return NEWCOMERS.find(n => !v.hobbits.some(s => s.id === n.id) && !v.dead.some(d => d.id === n.id) && !out.includes(n.id)) ?? null; };
/** Dawn: a whole day without anyone going without counts toward a birth; the stages move on; a birth when it is due and there is room. */
/** Daybreak: a Dark Young still held in the roots melts in the sun; the rest are gone from the land. */
function daybreak(v: Village): void { for (const r of v.raiders) if (r.state === 'retreating' && r.rooted > 0) { melt(v, r); } v.raiders = v.raiders.filter(r => r.state === 'melting'); for (const n of v.snatchers) if (n.infant) v.brood.push({ infant: n.infant, due: v.tick + GESTATION_TICKS }); v.snatchers = []; }
function newDay(v: Village): void {
  // A day nobody went without counts; a day of their leavings counts DARK_FED_DAYS (D2: the leavings breed).
  v.wellFedDays = v.dayMissed ? 0 : v.wellFedDays + (v.darkMealsToday > 0 ? DARK_FED_DAYS : 1); v.dayMissed = false; v.darkMealsToday = 0;
  for (const s of v.hobbits) {
    const age = (v.tick - s.born) / DAY_TICKS, name = hobbitById(s.id).name;
    if (s.stage === 'infant' && age >= INFANT_DAYS) { s.stage = 'child'; event(v, `${name} goes out with the others`); }
    else if (s.stage === 'child' && age >= INFANT_DAYS + CHILD_DAYS) { s.stage = 'grown'; event(v, `${name} is grown`); }
  }
  if (v.wellFedDays >= BIRTH_DAYS && bear(v)) v.wellFedDays = 0;
  // G1: a grown newcomer leaves a crowded house for an emptier one; still crowded, the village sets the stakes for a hut.
  moveOut(v); if (!v.site && crowded(v)) startSite(v, false);
}
/** A birth into the fullest house with room, from the pool in order. Returns whether there was one. */
export function bear(v: Village): boolean {
  const house = houseWithRoom(v), tpl = nextNewcomer(v); if (!house || !tpl) return false;
  v.hobbits.push(infantState(v, { id: tpl.id, home: house.id, born: v.tick })); event(v, `${tpl.name} is born in house ${house.id + 1}`); tellParents(v, house.id, `a child, ${tpl.name}`); return true;
}
/** What a hobbit is thinking, always: the chatter while it lasts, else what they carry, where they are going or what they are doing; hunger when it is bad. */
export function thought(s: HobbitState, tick: number): string {
  if (s.inside) return '';
  if (s.bubble && tick < s.bubbleUntil) return s.bubble;
  const h = hobbitById(s.id);
  if (s.activity === 'eating') return 'eating';
  if (s.missed >= REST_MEALS) return 'starving';
  if (s.hunger > 0.85) return 'hungry';
  if (s.errand === 'deliver' && s.carry) return `carrying ${STORES[s.carry.kind].unit} to ${STORES[s.carry.kind].name}`;
  if (s.errand === 'meal') return s.want === 'home' ? 'supper first' : 'breakfast first';
  if (s.errand === 'firewood') return s.carry ? 'wood for the fire' : 'to the woodpile';
  if (s.errand === 'flee') return 'wolves!';
  if (s.errand === 'fetch') return 'to the stores for the hut';
  if (s.errand === 'hut' && s.carry) return `carrying ${STORES[s.carry.kind].unit} to the new hut`;
  if (s.job === 'build' && s.activity === 'walking' && s.path.length && s.want === 'place') return 'to the new hut';
  if (s.job === 'build' && s.activity === 'working') return 'building the new hut';
  if (s.activity === 'praying') return 'praying';
  if (s.activity === 'returning') return 'going home';
  if (s.activity === 'walking' && s.path.length && s.want !== 'place') return s.want === 'green' ? 'walking to the fire' : 'going home';
  if (s.activity === 'walking' && s.path.length > 1) return s.job === 'pray' ? 'to the stone' : `walking to ${SITES[h.keeps].name}`;
  if (s.want === 'green' || (s.activity === 'talking' && h.keeps === 'fire')) return h.keeps === 'fire' && s.want !== 'green' ? SITES.fire.verb : 'talking by the fire';
  if (h.keeps === 'field' && s.activity === 'working') return s.carry ? 'harvesting' : SITES.field.verb;
  return SITES[h.keeps].verb;
}
export const everyone = (v: Village, where: 'inside' | 'green' | 'out' | 'praying'): number => v.hobbits.filter(s => where === 'inside' ? s.inside : where === 'green' ? !s.inside && dist(s, SITES.fire) <= SITES.fire.radius + 0.3 : where === 'praying' ? s.activity === 'praying' : !s.inside).length;
export const inHouse = (p: Vec2, v?: { huts: number }): House | null => (v ? housesOf(v) : housesOf({ huts: hutsPlaced })).find(h => dist(p, h) < HOUSE_RADIUS - 0.05) ?? null;
const ACTIVITIES: Activity[] = ['sleeping', 'walking', 'working', 'talking', 'returning', 'carrying', 'eating', 'praying'];
export function parseVillage(raw: string | null): Village {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object' || !Array.isArray(p.hobbits) || p.hobbits.length < 1 || p.hobbits.length > ALL_HOBBITS.length) return freshVillage();
    const v = freshVillage(Number.isFinite(p.seed) ? p.seed : 1); v.tick = Number.isInteger(p.tick) && p.tick >= 0 ? p.tick : 0;
    const num = (x: unknown, lo: number, hi: number, d: number): number => (typeof x === 'number' && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d);
    if (p.stores && typeof p.stores === 'object') for (const k of STORE_LIST) v.stores[k] = num(p.stores[k], 0, STORES[k].cap + OVERFILL, v.stores[k]);
    if (p.land && typeof p.land === 'object') { v.land.berries = num(p.land.berries, 0, BERRY_CAP, v.land.berries); v.land.branches = Math.floor(num(p.land.branches, 0, BRANCH_CAP, v.land.branches)); v.land.milk = Math.floor(num(p.land.milk, 0, MILK_PER_DAY, v.land.milk)); if (Array.isArray(p.land.crops) && p.land.crops.length === CROP_STRIPS) v.land.crops = p.land.crops.map((c: unknown, i: number) => num(c, 0, 1, v.land.crops[i])); if (p.land.spoiled && typeof p.land.spoiled === 'object') for (const k of YIELD_SITES) v.land.spoiled[k] = Math.floor(num(p.land.spoiled[k], 0, 1e9, 0)); }
    v.fireWood = num(p.fireWood, 0, WOOD_PER_NIGHT * 2, 0); v.prayer = num(p.prayer, 0, PRAYER_CAP, 0); v.prayed = num(p.prayed, 0, 1e6, 0);
    for (const which of ['take', 'lastTake'] as const) if (p[which] && typeof p[which] === 'object') for (const k of STORE_LIST) v[which][k] = num(p[which][k], 0, 1e4, 0);
    const carryOf = (c: unknown): Carry | null => { const k = c as Carry; return k && STORE_LIST.includes(k.kind) && Number.isFinite(k.n) && k.n > 0 ? { kind: k.kind, n: Math.min(STACK_CAP, Math.floor(k.n)) } : null; };
    v.stack = carryOf(p.stack);
    if (p.hero && typeof p.hero === 'object') { const pk = p.hero.perks && typeof p.hero.perks === 'object' ? p.hero.perks : {}; v.hero.perks = { vigor: Math.floor(num(pk.vigor, 0, LEVEL_CAP, 0)), strike: Math.floor(num(pk.strike, 0, LEVEL_CAP, 0)), sap: Math.floor(num(pk.sap, 0, LEVEL_CAP, 0)) }; v.hero.xp = num(p.hero.xp, 0, 1e6, 0); v.hero.level = Math.min(LEVEL_CAP, Math.max(1, Math.floor(num(p.hero.level, 1, LEVEL_CAP, 1)))); v.hero.choices = Math.floor(num(p.hero.choices, 0, LEVEL_CAP, 0)); v.hero.vigor = num(p.hero.vigor, 0, vigorMax(v.hero), vigorMax(v.hero)); v.hero.sap = num(p.hero.sap, 0, sapMax(v.hero), sapMax(v.hero)); v.hero.faint = num(p.hero.faint, 0, FAINT_S, 0); v.hero.holding = Math.floor(num(p.hero.holding, -1, 1e6, -1)); v.hero.calm = num(p.hero.calm, 0, 1e6, 0); }
    if (p.lair && typeof p.lair === 'object') { v.lair.hp = num(p.lair.hp, 0, LAIR_HP, LAIR_HP); v.lair.alive = p.lair.alive !== false; v.lair.slainDay = num(p.lair.slainDay, -99, 1e6, -99); }
    // G3: the dens' packs, the wolves' day, the bitten.
    if (p.dens && typeof p.dens === 'object') for (const k of Object.keys(p.dens)) if (/^den--?\d+,-?\d+$/.test(k) && p.dens[k] && typeof p.dens[k] === 'object') v.dens[k] = { alive: Math.floor(num(p.dens[k].alive, 0, 99, 0)), quietDay: Math.floor(num(p.dens[k].quietDay, -1, 1e6, -1)) };
    v.wolfDay = Math.floor(num(p.wolfDay, -1, 1e6, -1)); v.bitten = Math.floor(num(p.bitten, 0, 1e4, 0)); v.lastBitten = Math.floor(num(p.lastBitten, 0, 1e4, 0));
    // G2: the streak, the night's eating, what was said, the state last told.
    v.fedStreak = Math.floor(num(p.fedStreak, 0, 1e6, 0)); v.raidEaten = Math.floor(num(p.raidEaten, 0, 1e6, 0)); v.lastRaidEaten = Math.floor(num(p.lastRaidEaten, 0, 1e6, 0)); v.told = ['thriving', 'steady', 'pressured', 'besieged', 'lost'].includes(p.told) ? p.told : 'steady';
    if (Array.isArray(p.voiced)) v.voiced = p.voiced.filter((r: unknown) => r && typeof (r as Voiced).text === 'string').slice(-RUMORS_KEPT).map((r: Voiced) => ({ text: r.text, tick: num(r.tick, 0, 1e9, 0), by: typeof r.by === 'string' ? r.by : '', ...(typeof r.bearing === 'number' ? { bearing: num(r.bearing, 0, 360, 0) } : {}), ...(['lair', 'karst', 'blight'].includes(r.about as string) ? { about: r.about } : {}), ...(['elder', 'keeper'].includes(r.who as string) ? { who: r.who } : {}) }));
    // G1: the huts built and the one going up.
    v.huts = Math.floor(num(p.huts, 0, HOUSE_CAP - 6, 0)); if (p.site && typeof p.site === 'object' && 6 + v.huts < HOUSE_CAP) v.site = { id: 6 + v.huts, wood: Math.floor(num(p.site.wood, 0, HUT_WOOD, 0)), water: Math.floor(num(p.site.water, 0, HUT_WATER, 0)), work: Math.floor(num(p.site.work, 0, HUT_WORK_TICKS, 0)), asked: p.site.asked === true };
    // D3: the infants out of their houses and the snatchers abroad.
    function refOf(x: unknown): InfantRef | null { const r = x as InfantRef; return r && typeof r.id === 'string' && NEWCOMERS.some(n => n.id === r.id) ? { id: r.id, home: Math.floor(num(r.home, 0, HOUSE_CAP - 1, 0)), born: num(r.born, -1e9, 1e9, 0) } : null; }
    v.taken = Math.floor(num(p.taken, 0, 1e6, 0)); v.returned = Math.floor(num(p.returned, 0, 1e6, 0)); v.snatchDay = num(p.snatchDay, -1, 1e6, -1); v.carried = refOf(p.carried);
    if (Array.isArray(p.bred)) for (const b of p.bred.slice(0, 40)) { const r = refOf(b); if (r) v.bred.push(r); }
    if (Array.isArray(p.brood)) for (const b of p.brood.slice(0, 40)) { const r = refOf(b?.infant); if (r) v.brood.push({ infant: r, due: num(b.due, 0, 1e9, 0) }); }
    if (Array.isArray(p.dropped)) for (const d of p.dropped.slice(0, 40)) { const r = refOf(d?.infant); if (r) v.dropped.push({ infant: r, x: num(d.x, -1e4, 1e4, 0), z: num(d.z, -1e4, 1e4, 0) }); }
    if (Array.isArray(p.snatchers)) for (const n of p.snatchers.slice(0, 8)) { if (!n || typeof n !== 'object') continue; v.snatchers.push({ id: num(n.id, 0, 1e6, v.snatchers.length), x: num(n.x, -1e4, 1e4, 0), z: num(n.z, -1e4, 1e4, 0), heading: num(n.heading, -10, 10, 0), state: ['coming', 'taking', 'fleeing'].includes(n.state) ? n.state : 'coming', targetId: typeof n.targetId === 'string' ? n.targetId : null, clock: num(n.clock, 0, 1e3, 0), infant: refOf(n.infant), told: n.told === true }); }
    v.raidDay = num(p.raidDay, -1, 1e6, -1); v.slain = num(p.slain, 0, 1e6, 0); v.eaten = num(p.eaten, 0, 1e6, 0); v.melted = num(p.melted, 0, 1e6, 0); v.blight = num(p.blight, 0, BLIGHT_MAX, 0); v.darkMealsToday = Math.floor(num(p.darkMealsToday, 0, 1e4, 0));
    if (Array.isArray(p.raiders)) for (const q of p.raiders.slice(0, 12)) { if (!q || typeof q !== 'object') continue; const st: RaiderState = ['coming', 'eating', 'hunting', 'leaving', 'dead', 'devouring', 'retreating', 'melting'].includes(q.state) ? q.state : 'coming'; v.raiders.push({ id: num(q.id, 0, 1e6, v.raiders.length), x: num(q.x, -200, 200, 0), z: num(q.z, -200, 200, 0), heading: num(q.heading, -10, 10, 0), hp: num(q.hp, 0, DY_HP, q.kind === 'wolf' ? WOLF_HP : DY_HP), state: st, target: STORE_LIST.includes(q.target) ? q.target : null, ate: num(q.ate, 0, 99, 0), eatClock: 0, aggro: num(q.aggro, 0, DY_AGGRO_S, 0), rooted: num(q.rooted, 0, ROOT_S, 0), biteClock: 0, hurt: 0, gone: num(q.gone, 0, DY_CORPSE_S, 0), site: YIELD_SITES.includes(q.site) ? q.site : null, devourClock: 0, held: num(q.held, 0, HOLD_MELT_S, 0), infant: refOf(q.infant), kind: q.kind === 'wolf' ? 'wolf' : 'dy', den: typeof q.den === 'string' ? q.den : null, prey: typeof q.prey === 'string' ? q.prey : null }); }
    const pathOf = (x: unknown): Vec2[] => (Array.isArray(x) ? x.filter((q: unknown) => q && Number.isFinite((q as Vec2).x) && Number.isFinite((q as Vec2).z)).map((q: Vec2) => ({ x: q.x, z: q.z })).slice(0, 4) : []);
    if (Array.isArray(p.spirits)) for (const q of p.spirits.slice(0, 12)) { if (!q || !(q.keeps in YIELD_OF)) continue; const site = SITES[q.keeps as SiteKind]; v.spirits.push({ id: v.spirits.length, keeps: q.keeps, x: num(q.x, -200, 200, site.x), z: num(q.z, -200, 200, site.z), heading: num(q.heading, -10, 10, 0), path: pathOf(q.path), speed: 0, carry: carryOf(q.carry), errand: q.errand === 'deliver' && carryOf(q.carry) ? 'deliver' : null, gatherAt: num(q.gatherAt, 0, 1e9, v.tick), wanderAt: num(q.wanderAt, 0, 1e9, v.tick) }); }
    // The living, by id: founders and newcomers alike (an old save's eight are founders in their houses, grown).
    const fresh = v.hobbits; v.hobbits = []; const seen = new Set<string>();
    if (Array.isArray(p.dead)) for (const d of p.dead.slice(0, ALL_HOBBITS.length)) if (d && typeof d.id === 'string' && ALL_HOBBITS.some(h => h.id === d.id) && !seen.has(d.id)) { seen.add(d.id); v.dead.push({ id: d.id, tick: num(d.tick, 0, 1e9, 0) }); }
    for (const s of p.hobbits) {
      if (!s || typeof s.id !== 'string' || seen.has(s.id)) continue; const h = ALL_HOBBITS.find(h => h.id === s.id); if (!h) continue; seen.add(s.id);
      const base = fresh.find(f => f.id === s.id), home = Math.floor(num(s.home, 0, HOUSE_CAP - 1, h.home >= 0 ? h.home : 0)), d = housePlace(home).door;
      const t: HobbitState = base ?? { id: h.id, x: d.x, z: d.z, heading: housePlace(home).facing, activity: 'sleeping', want: 'home', job: 'gather', path: [], speed: 0, inside: true, bubble: '', bubbleUntil: 0, wanderAt: 0, faceAt: 0, hunger: 0, carry: null, errand: null, gatherAt: 0, eatUntil: 0, jobAt: 0, meals: 0, ate: -1, home, stage: 'grown', born: 0, missed: 0 };
      t.home = home; t.stage = ['infant', 'child', 'grown'].includes(s.stage) ? s.stage : 'grown'; t.born = num(s.born, -1e9, 1e9, t.born); t.missed = Math.floor(num(s.missed, 0, DEATH_MEALS, 0));
      v.hobbits.push(t);
      for (const k of ['x', 'z', 'heading', 'speed', 'bubbleUntil', 'wanderAt', 'faceAt', 'gatherAt', 'eatUntil', 'jobAt', 'meals'] as const) if (Number.isFinite(s[k])) (t as unknown as Record<string, number>)[k] = s[k];
      if (Number.isFinite(s.ate)) t.ate = s.ate;
      t.hunger = num(s.hunger, 0, 1, t.hunger);
      t.inside = s.inside === true; t.activity = ACTIVITIES.includes(s.activity) ? s.activity : 'sleeping'; t.want = ['home', 'place', 'green'].includes(s.want) ? s.want : 'home'; t.job = s.job === 'pray' ? 'pray' : s.job === 'build' ? 'build' : 'gather';
      t.errand = ['deliver', 'meal', 'firewood', 'fetch', 'hut', 'flee'].includes(s.errand) ? s.errand : null;
      t.carry = carryOf(s.carry); if (t.errand === 'deliver' && !t.carry) t.errand = null;
      t.path = pathOf(s.path); t.bubble = typeof s.bubble === 'string' ? s.bubble.slice(0, 40) : '';
    }
    if (!v.hobbits.length) return freshVillage();
    v.wellFedDays = Math.floor(num(p.wellFedDays, 0, 1e6, 0)); v.dayMissed = p.dayMissed === true; v.mourningUntil = num(p.mourningUntil, 0, 1e9, 0);
    if (Array.isArray(p.events)) v.events = p.events.slice(-EVENTS_KEPT).filter((e: unknown) => e && typeof (e as VillageEvent).text === 'string').map((e: VillageEvent) => ({ tick: num(e.tick, 0, 1e9, 0), text: e.text.slice(0, 90), ...(e.banner === true ? { banner: true } : {}) }));
    return v;
  } catch { return freshVillage(); }
}
export const serializeVillage = (v: Village): string => JSON.stringify({ seed: v.seed, tick: v.tick, huts: v.huts, site: v.site, dens: v.dens, wolfDay: v.wolfDay, bitten: v.bitten, lastBitten: v.lastBitten, fedStreak: v.fedStreak, raidEaten: v.raidEaten, lastRaidEaten: v.lastRaidEaten, voiced: v.voiced, told: v.told, blight: v.blight, taken: v.taken, returned: v.returned, snatchDay: v.snatchDay, carried: v.carried, bred: v.bred, brood: v.brood, dropped: v.dropped, snatchers: v.snatchers, melted: v.melted, darkMealsToday: v.darkMealsToday, dead: v.dead, wellFedDays: v.wellFedDays, dayMissed: v.dayMissed, mourningUntil: v.mourningUntil, events: v.events, stores: v.stores, land: { ...v.land, berries: Math.round(v.land.berries * 100) / 100, crops: v.land.crops.map(c => Math.round(c * 1000) / 1000) }, fireWood: Math.round(v.fireWood * 100) / 100, take: v.take, lastTake: v.lastTake, prayer: Math.round(v.prayer * 1000) / 1000, prayed: Math.round(v.prayed * 1000) / 1000, stack: v.stack, hero: { vigor: Math.round(v.hero.vigor * 10) / 10, sap: Math.round(v.hero.sap * 10) / 10, faint: Math.round(v.hero.faint * 100) / 100, calm: Math.round(v.hero.calm * 100) / 100, xp: v.hero.xp, level: v.hero.level, choices: v.hero.choices, perks: v.hero.perks, holding: v.hero.holding }, lair: { hp: Math.round(v.lair.hp * 10) / 10, alive: v.lair.alive, slainDay: v.lair.slainDay }, raidDay: v.raidDay, slain: v.slain, eaten: v.eaten, raiders: v.raiders.map(r => ({ ...r, x: Math.round(r.x * 100) / 100, z: Math.round(r.z * 100) / 100, heading: Math.round(r.heading * 1000) / 1000, hp: Math.round(r.hp * 10) / 10, aggro: Math.round(r.aggro * 100) / 100, rooted: Math.round(r.rooted * 100) / 100, gone: Math.round(r.gone * 100) / 100, eatClock: 0, biteClock: 0, hurt: 0, devourClock: 0 })), spirits: v.spirits.map(s => ({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, heading: Math.round(s.heading * 1000) / 1000 })), hobbits: v.hobbits.map(s => ({ ...s, x: Math.round(s.x * 100) / 100, z: Math.round(s.z * 100) / 100, heading: Math.round(s.heading * 1000) / 1000, hunger: Math.round(s.hunger * 1000) / 1000 })) });

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
/** Where the grass (and a root) can run: anywhere under the land (the chunks are unbounded), the stream's bed included (she wades it on foot, and under the soil the water is not in her way: Noah found the old refusal an invisible wall), not under the houses. */
export const grassCan = (x: number, z: number): boolean => !housesOf({ huts: hutsPlaced }).some(h => Math.hypot(x - h.x, z - h.z) < HOUSE_RADIUS + 0.2);
