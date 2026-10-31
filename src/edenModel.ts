// The Eden, E1 (EDEN.md, BEGINNING.md, ECOLOGY.md): the world before the fall, held in balance. One band of hobbits in a cave at the
// mountain's foot, out by day to take chicken-of-the-woods and berries and home to the hearth by dusk; the fungus growing at host
// trees, breaking free, waddling, resting at another tree; one wolf pack eating the same fungus, coequal with the band. Pure: no
// Three.js. Stepped in whole ticks of the village's day (villageModel: DAY_TICKS a day of DAY_REAL_SECONDS), so a tick is
// SECONDS_PER_TICK real seconds; the entry eases the figures between ticks.
import { DAY_TICKS, DAY_REAL_SECONDS, phaseAt, type Phase } from './villageModel';
import { mulberry32 } from './colors';

export const SECONDS_PER_TICK = DAY_REAL_SECONDS / DAY_TICKS;
// ---- Tuning ----------------------------------------------------------------------------------------------------------------------
/** The fungus: days to grow at a host's base; ticks free (waddling), ticks resting at a tree; its waddle (m/s), how far it strays from its host (m), how far it looks for a tree to rest at (m). */
export const GROW_DAYS = 5, FREE_TICKS = DAY_TICKS, REST_TICKS = DAY_TICKS * 2, CHICKEN_WALK = 0.35, CHICKEN_STRAY = 14, REST_LOOK = 30;
/** The balance (ECOLOGY.md: the fungus multiplies without end and only its eaters hold it): a host yields a chicken every GROW_DAYS, so 46 hosts in reach give about 11 a day, and the band's need plus the pack's meals take about 12 when they can find them; when the free ones run short the takers find fewer, and the count settles low rather than running away. Tuning, all of it.
/** The band: its pace (m/s), the hearth's need in chickens a day (a chicken feeds one, the berry pickers eat berries), how long a take is (ticks), how near to take (m), how far a hobbit forages (m), how many of the band gather berries, a berry trip's take (ticks). */
export const HOSTS_MAX = 48, HOBBIT_WALK = 0.9, BAND = 8, NEED_PER_DAY = 6, TAKE_TICKS = 30, TAKE_M = 1.0, FORAGE_R = 140, BERRY_PICKERS = 2, BERRY_TICKS = 50;
/** The pack: its number, pace, how far it hunts from its rest (m), chickens a day, an eating's ticks, the distance it keeps from a hobbit (m), the followers' spread (m). */
export const PACK = 5, WOLF_WALK = 1.4, HUNT_R = 220, PACK_MEALS = 8, EAT_TICKS = 24, KEEP_OFF_M = 8, FOLLOW_M = 3;
/** Each hobbit's hour out after dawn (ticks), spread over the band; the meal at dusk lasts this long. */
export const RISE_SPREAD = 80, MEAL_TICKS = 60;
/** E1b, the band's antics (Noah, 2026-10-31, after DiggyDwarves' dwarf: wandering when idle, sniffing flowers, humming on rocks, dozing under trees; and the Minions and A Bug's Life's pill bugs: pratfalls, tumbles, little scuffles ending in a hug). An idle hobbit at the hearth with the day's need met starts one at ANTIC_CHANCE a tick: a wander (ANTIC_R m from the hearth) ending at what is there, a scuffle with an idle neighbour within SCUFFLE_M, or a tumble. Walking, a trip at TRIP_CHANCE a tick. Durations in ticks. Tuning. */
export const ANTIC_CHANCE = 1 / 40, ANTIC_R = 9, SCUFFLE_M = 3, TRIP_CHANCE = 1 / 350, TRIP_TICKS = 28, DIZZY_TICKS = 24, HUG_TICKS = 32, TUMBLE_PACE = 2.4, NAP_M = 30;
export const SMELL_TICKS: [number, number] = [40, 70], SIT_TICKS: [number, number] = [80, 160], NAP_TICKS: [number, number] = [120, 260], SCUFFLE_TICKS: [number, number] = [40, 70], TUMBLE_M: [number, number] = [3, 5];
export const FLOWER_SPOTS = 6, ROCK_SPOTS = 3;
// ------------------------------------------------------------------------------------------------------------------------------------
export interface Vec2 { x: number; z: number }
export interface Host { id: number; x: number; z: number }
export type ChickenStage = 'growing' | 'free' | 'resting';
export interface Chicken { id: number; host: number; x: number; z: number; heading: number; stage: ChickenStage; /** 0..1 while growing. */ grown: number; /** Ticks left in the stage. */ left: number; speed: number; leg: number; turn: number }
export type HobbitAct = 'sleeping' | 'out' | 'taking' | 'home' | 'idle' | 'eating';
export type Target = { kind: 'chicken'; id: number } | { kind: 'berries'; x: number; z: number };
/** The antics: a wander to a spot (`then` what it does there), sniffing a flower, humming on a rock, dozing under a tree, a scuffle with a partner and the hug it ends in, a pratfall (any walk), a tumble (rolling as a ball along `heading`) and the dizzy stand after it. */
export type AnticKind = 'wander' | 'smell' | 'sit' | 'nap' | 'scuffle' | 'hug' | 'trip' | 'tumble' | 'dizzy';
export interface Antic { kind: AnticKind; /** Ticks left (a wander: ticks allowed). */ left: number; at?: Vec2; then?: AnticKind; partner?: string; heading?: number }
export interface EdenHobbit { id: string; name: string; rises: number; picksBerries: boolean; x: number; z: number; heading: number; act: HobbitAct; target: Target | null; carry: 'chicken' | 'berries' | null; taking: number; inside: boolean; speed: number; hunger: number; trips: number; stuck?: number; antic?: Antic | null }
export type WolfAct = 'resting' | 'roaming' | 'hunting' | 'eating';
export interface Wolf { id: number; x: number; z: number; heading: number; act: WolfAct; target: number | null; eating: number; speed: number; stuck?: number; /** Ticks left turning away from a hobbit. */ shy?: number }
export type EventKind = 'hobbit-takes' | 'hobbit-picks' | 'band-eats' | 'wolf-eats' | 'chicken-frees' | 'chicken-rests' | 'pack-roams' | 'pack-rests' | 'hobbit-smells' | 'hobbit-sits' | 'hobbit-naps' | 'hobbit-scuffles' | 'hobbit-hugs' | 'hobbit-trips' | 'hobbit-tumbles';
export interface EdenEvent { kind: EventKind; tick: number; x: number; z: number; who?: string }
export interface Eden {
  seed: number; tick: number; cave: Vec2 & { dir: number }; hearth: Vec2; hosts: Host[]; berries: Vec2[]; /** E1b: flowers to sniff and rocks to sit on, near the hearth. */ flowers: Vec2[]; rocks: Vec2[]; chickens: Chicken[]; nextChicken: number;
  hobbits: EdenHobbit[]; pack: Wolf[]; packHome: Vec2; packMeals: number; packDay: number; /** Chickens and berries at the hearth today. */ store: number; berriesStore: number; eatenToday: number;
  events: EdenEvent[]; /** A day's counts (dev). */ days: { chickens: number; free: number; taken: number; wolfEaten: number }[];
}
export interface EdenCtx { canStand: (x: number, z: number) => boolean }
export const EVENTS_KEPT = 200;
const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
const toward = (from: Vec2, to: Vec2): number => Math.atan2(-(to.x - from.x), -(to.z - from.z));
/** A step of `m` metres along `heading` (the figures face -z at heading 0, as the village's do). */
const stepTo = (p: Vec2, heading: number, m: number): Vec2 => ({ x: p.x - Math.sin(heading) * m, z: p.z - Math.cos(heading) * m });

/** The Eden at a cave: hosts are the tree bases within FORAGE_R the band can walk to (the entry supplies the trees, the model keeps those it can reach), berries a few spots; a chicken on every host at a random growth; the band asleep inside; the pack at its rest. */
export function freshEden(seed: number, cave: Vec2 & { dir: number }, trees: Host[], berries: Vec2[], packHome: Vec2, names: { id: string; name: string; rises: number }[], ctx: EdenCtx): Eden {
  const rand = mulberry32((seed * 7331 + 11) >>> 0);
  const hearth = stepTo(cave, cave.dir, 3.2);
  const reachable = (p: Vec2): boolean => { const d = dist(hearth, p), n = Math.max(1, Math.ceil(d / 4)); for (let i = 1; i <= n; i++) { const t = i / n; if (!ctx.canStand(hearth.x + (p.x - hearth.x) * t, hearth.z + (p.z - hearth.z) * t)) return false; } return true; };
  // The nearest HOSTS_MAX the band can walk to: the balance is tuned to that many (a wood holds far more trees than the eaters could keep in check).
  const hosts = trees.filter(t => dist(t, hearth) <= FORAGE_R && dist(t, hearth) > 6 && reachable(t)).sort((a, b) => dist(a, hearth) - dist(b, hearth)).slice(0, HOSTS_MAX);
  const e: Eden = { seed, tick: 0, cave, hearth, hosts, berries: berries.filter(reachable), flowers: [], rocks: [], chickens: [], nextChicken: 1, hobbits: [], pack: [], packHome, packMeals: 0, packDay: -1, store: 0, berriesStore: 0, eatenToday: 0, events: [], days: [] };
  // E1b: flowers 3–9 m from the hearth, rocks 2.5–6 m, on ground the band can stand on, off the cave's own line.
  for (let i = 0; i < 60 && e.flowers.length < FLOWER_SPOTS; i++) { const a = rand() * Math.PI * 2, d = 3 + rand() * 6, p = { x: hearth.x + Math.cos(a) * d, z: hearth.z + Math.sin(a) * d }; if (ctx.canStand(p.x, p.z) && dist(p, cave) > 3 && !e.flowers.some(f => dist(f, p) < 1.5)) e.flowers.push(p); }
  for (let i = 0; i < 60 && e.rocks.length < ROCK_SPOTS; i++) { const a = rand() * Math.PI * 2, d = 2.5 + rand() * 3.5, p = { x: hearth.x + Math.cos(a) * d, z: hearth.z + Math.sin(a) * d }; if (ctx.canStand(p.x, p.z) && dist(p, cave) > 3 && !e.flowers.some(f => dist(f, p) < 1.2) && !e.rocks.some(r => dist(r, p) < 2)) e.rocks.push(p); }
  for (const h of hosts) e.chickens.push(newChicken(e, h, rand() * 0.9));
  // A few already free, so the first dawn has something to take.
  for (const c of e.chickens) if (rand() < 0.3) { c.stage = 'free'; c.grown = 1; c.left = Math.floor(FREE_TICKS * rand()); const a = rand() * Math.PI * 2, r = 2 + rand() * 6; c.x += Math.cos(a) * r; c.z += Math.sin(a) * r; const host = hosts.find(h => h.id === c.host)!; e.chickens.push(newChicken(e, host, 0)); }
  names.slice(0, BAND).forEach((n, i) => { e.hobbits.push({ id: n.id, name: n.name, rises: Math.floor((i / BAND) * RISE_SPREAD), picksBerries: i >= BAND - BERRY_PICKERS, x: cave.x, z: cave.z, heading: cave.dir + Math.PI, act: 'sleeping', target: null, carry: null, taking: 0, inside: true, speed: 0, hunger: 0.4, trips: 0 }); });
  for (let i = 0; i < PACK; i++) { const a = i * 1.3, r = i ? 1.5 + i * 0.4 : 0; e.pack.push({ id: i, x: packHome.x + Math.cos(a) * r, z: packHome.z + Math.sin(a) * r, heading: 0, act: 'resting', target: null, eating: 0, speed: 0 }); }
  return e;
}
function newChicken(e: Eden, host: Host, grown: number): Chicken { return { id: e.nextChicken++, host: host.id, x: host.x, z: host.z, heading: 0, stage: 'growing', grown, left: 0, speed: 0, leg: 0, turn: 0 }; }
const hostOf = (e: Eden, c: Chicken): Host => e.hosts.find(h => h.id === c.host) ?? { id: -1, x: c.x, z: c.z };
function event(e: Eden, kind: EventKind, at: Vec2, who?: string): void { e.events.push({ kind, tick: e.tick, x: at.x, z: at.z, who }); if (e.events.length > EVENTS_KEPT) e.events.splice(0, e.events.length - EVENTS_KEPT); }
const dayOf = (tick: number): number => Math.floor(tick / DAY_TICKS);
/** The free and resting fungus a hobbit or a wolf may take: not growing, not already someone's target. */
const takeable = (e: Eden, taken: Set<number>): Chicken[] => e.chickens.filter(c => c.stage !== 'growing' && !taken.has(c.id));
const nearest = <T extends Vec2>(from: Vec2, list: T[]): T | null => { let best: T | null = null, bd = Infinity; for (const p of list) { const d = dist(from, p); if (d < bd) { bd = d; best = p; } } return best; };
/** A step toward `to` at `pace`: straight when the ground allows, else round the obstacle by the nearest open heading (water, rock). Returns true at arrival. `stuck` counts ticks without progress, for the callers to give a target up. */
function walk(p: { x: number; z: number; heading: number; speed: number; stuck?: number }, to: Vec2, pace: number, ctx: EdenCtx): boolean {
  const d = dist(p, to); if (d < 1e-6) { p.speed = 0; return true; }
  const want = toward(p, to), m = Math.min(d, pace * SECONDS_PER_TICK);
  for (const off of [0, 0.5, -0.5, 1.0, -1.0, 1.6, -1.6, 2.2, -2.2]) {
    const h = want + off, n = stepTo(p, h, m); if (!ctx.canStand(n.x, n.z)) continue;
    p.x = n.x; p.z = n.z; p.heading = h; p.speed = off === 0 ? pace : pace * 0.7; p.stuck = off === 0 ? 0 : (p.stuck ?? 0) + 1; return dist(p, to) <= 0.3;
  }
  p.speed = 0; p.stuck = (p.stuck ?? 0) + 1; return false;
}
/** Ticks of going round an obstacle before a target is given up. Tuning. */
const GIVE_UP = 40;
// ── E1b: the antics ──
const between = (rand: () => number, [a, b]: [number, number]): number => Math.floor(a + rand() * (b - a));
/** Walking, a pratfall now and then: flat on its face for TRIP_TICKS, then up and on (the load kept). */
function maybeTrip(e: Eden, h: EdenHobbit, rand: () => number): void { if (h.speed > 0 && !h.antic && rand() < TRIP_CHANCE) { h.antic = { kind: 'trip', left: TRIP_TICKS }; h.speed = 0; event(e, 'hobbit-trips', h, h.id); } }
/** An idle hobbit with the day's need met starts something: a scuffle with an idle neighbour, a tumble, or a wander to a flower, a rock, a tree or nowhere. */
function startAntic(e: Eden, h: EdenHobbit, rand: () => number, ctx: EdenCtx): void {
  const r = rand();
  if (r < 0.22) { const p = e.hobbits.find(o => o !== h && o.act === 'idle' && !o.antic && !o.inside && dist(o, h) <= SCUFFLE_M); if (p) { const t = between(rand, SCUFFLE_TICKS), near = stepTo(p, toward(p, h), 0.9); if (ctx.canStand(near.x, near.z)) { h.x = near.x; h.z = near.z; } h.heading = toward(h, p); p.heading = toward(p, h); h.antic = { kind: 'scuffle', left: t, partner: p.id }; p.antic = { kind: 'scuffle', left: t, partner: h.id }; event(e, 'hobbit-scuffles', { x: (h.x + p.x) / 2, z: (h.z + p.z) / 2 }, h.id); return; } }
  if (r < 0.36) { const heading = rand() * Math.PI * 2, m = TUMBLE_M[0] + rand() * (TUMBLE_M[1] - TUMBLE_M[0]); h.antic = { kind: 'tumble', left: Math.ceil(m / (TUMBLE_PACE * SECONDS_PER_TICK)), heading }; h.heading = heading; event(e, 'hobbit-tumbles', h, h.id); return; }
  // A wander: to a flower, a rock or a tree near the hearth when there is one, else a spot at random.
  const k = rand(), pick = <T extends Vec2>(list: T[]): T | null => (list.length ? list[Math.floor(rand() * list.length)] : null);
  let at: Vec2 | null = null, then: AnticKind | undefined;
  if (k < 0.3) { at = pick(e.flowers); then = 'smell'; } else if (k < 0.5) { at = pick(e.rocks); then = 'sit'; } else if (k < 0.65) { const t = pick(e.hosts.filter(t => dist(t, e.hearth) <= NAP_M)); if (t) { at = stepTo(t, toward(t, e.hearth), 0.7); then = 'nap'; } }
  if (!at) { const a = rand() * Math.PI * 2, d = 2 + rand() * (ANTIC_R - 2); at = { x: e.hearth.x + Math.cos(a) * d, z: e.hearth.z + Math.sin(a) * d }; then = undefined; if (!ctx.canStand(at.x, at.z)) return; }
  h.antic = { kind: 'wander', left: 200, at, then };
}
/** A tick of an antic. True when it took the tick (the act waits); false when it ended or was dropped (dusk, night, a call elsewhere). */
function runAntic(e: Eden, h: EdenHobbit, phase: Phase, rand: () => number, ctx: EdenCtx): boolean {
  const a = h.antic!; const end = (): false => { h.antic = null; h.speed = 0; return false; };
  switch (a.kind) {
    case 'trip': case 'dizzy': h.speed = 0; if (--a.left <= 0) return end(); return true;
    case 'smell': case 'sit': case 'nap': h.speed = 0; if (h.act !== 'idle' || phase === 'dusk' || phase === 'night' || --a.left <= 0) return end(); return true;
    case 'hug': h.speed = 0; if (--a.left <= 0) return end(); return true;
    case 'scuffle': {
      const p = e.hobbits.find(o => o.id === a.partner); if (!p || !p.antic || (p.antic.kind !== 'scuffle' && p.antic.kind !== 'hug') || p.antic.partner !== h.id || h.act !== 'idle' || phase === 'dusk' || phase === 'night') return end();
      h.speed = 0; h.heading = toward(h, p); if (--a.left <= 0) { h.antic = { kind: 'hug', left: HUG_TICKS, partner: p.id }; if (p.antic.kind === 'scuffle') { p.antic = { kind: 'hug', left: HUG_TICKS, partner: h.id }; event(e, 'hobbit-hugs', { x: (h.x + p.x) / 2, z: (h.z + p.z) / 2 }, h.id); } }
      return true;
    }
    case 'tumble': { const n = stepTo(h, a.heading ?? h.heading, TUMBLE_PACE * SECONDS_PER_TICK); if (!ctx.canStand(n.x, n.z) || --a.left <= 0) { h.antic = { kind: 'dizzy', left: DIZZY_TICKS }; h.speed = 0; return true; } h.x = n.x; h.z = n.z; h.speed = TUMBLE_PACE; return true; }
    case 'wander': {
      if (h.act !== 'idle' || phase === 'dusk' || phase === 'night' || !a.at) return end();
      const arrived = walk(h, a.at, HOBBIT_WALK * 0.8, ctx); if (!arrived && --a.left > 0 && (h.stuck ?? 0) <= GIVE_UP) { maybeTrip(e, h, rand); return true; }
      h.stuck = 0; h.speed = 0;
      if (arrived && a.then === 'smell') { h.antic = { kind: 'smell', left: between(rand, SMELL_TICKS) }; event(e, 'hobbit-smells', h, h.id); return true; }
      if (arrived && a.then === 'sit') { h.antic = { kind: 'sit', left: between(rand, SIT_TICKS) }; event(e, 'hobbit-sits', h, h.id); return true; }
      if (arrived && a.then === 'nap') { h.antic = { kind: 'nap', left: between(rand, NAP_TICKS) }; event(e, 'hobbit-naps', h, h.id); return true; }
      return end();
    }
  }
}
function eat(e: Eden, c: Chicken, by: 'hobbit' | 'wolf'): void { e.chickens.splice(e.chickens.indexOf(c), 1); if (by === 'wolf') e.days[e.days.length - 1].wolfEaten++; else e.days[e.days.length - 1].taken++; }

/** The world a tick on: the fungus, the band, the pack. */
export function stepEden(e: Eden, ticks: number, ctx: EdenCtx): void {
  for (let i = 0; i < ticks; i++) { stepOne(e, ctx); e.tick++; }
}
function stepOne(e: Eden, ctx: EdenCtx): void {
  const rand = mulberry32((e.seed * 7919 + e.tick * 131) >>> 0), t = e.tick % DAY_TICKS, phase: Phase = phaseAt(e.tick), day = dayOf(e.tick);
  if (!e.days.length || t === 0) { e.days.push({ chickens: e.chickens.length, free: e.chickens.filter(c => c.stage !== 'growing').length, taken: 0, wolfEaten: 0 }); if (e.days.length > 60) e.days.shift(); if (t === 0) { e.store = 0; e.berriesStore = 0; e.eatenToday = 0; } }
  // ── the fungus ──
  for (const c of e.chickens) {
    const host = hostOf(e, c);
    if (c.stage === 'growing') { c.grown = Math.min(1, c.grown + 1 / (GROW_DAYS * DAY_TICKS)); if (c.grown >= 1) { c.stage = 'free'; c.left = FREE_TICKS; c.heading = rand() * Math.PI * 2; e.chickens.push(newChicken(e, host, 0)); event(e, 'chicken-frees', c); } continue; }
    if (c.stage === 'resting') { c.speed = 0; if (--c.left <= 0) { c.stage = 'free'; c.left = FREE_TICKS; } continue; }
    // Free: a waddle in legs about its host, grazing; its day up, it goes to the nearest other tree to rest.
    if (--c.left <= 0) { const other = nearest(c, e.hosts.filter(h => h.id !== c.host && dist(h, c) <= REST_LOOK)) ?? host; if (walk(c, other, CHICKEN_WALK, ctx)) { c.stage = 'resting'; c.left = REST_TICKS; c.host = other.id; c.speed = 0; event(e, 'chicken-rests', c); } continue; }
    if (--c.leg <= 0) { c.leg = 6 + Math.floor(rand() * 14); c.turn = (rand() - 0.5) * 0.5; if (rand() < 0.4) { c.speed = 0; continue; } }
    if (c.speed === 0 && rand() < 0.08) c.speed = CHICKEN_WALK; if (c.speed === 0) continue;
    c.heading += c.turn; if (dist(c, host) > CHICKEN_STRAY) c.heading = toward(c, host) + (rand() - 0.5) * 0.4;
    const n = stepTo(c, c.heading, CHICKEN_WALK * SECONDS_PER_TICK); if (ctx.canStand(n.x, n.z)) { c.x = n.x; c.z = n.z; } else { c.heading += Math.PI * 0.7; c.speed = 0; }
  }
  // ── the band ──
  const taken = new Set<number>(e.hobbits.map(h => (h.target?.kind === 'chicken' ? h.target.id : -1)));
  const need = e.store + e.hobbits.filter(h => h.carry === 'chicken').length < NEED_PER_DAY, dayOver = phase === 'dusk' || phase === 'night', atHearth = (h: EdenHobbit): boolean => dist(h, e.hearth) < 1.2;
  for (const h of e.hobbits) {
    h.hunger = Math.min(1, h.hunger + 1 / (DAY_TICKS * 2));
    if (h.antic && runAntic(e, h, phase, rand, ctx)) continue;
    switch (h.act) {
      case 'sleeping': if (phase !== 'night' && t >= h.rises && t < 700) { h.act = 'idle'; h.inside = false; h.x = e.cave.x; h.z = e.cave.z; h.heading = e.cave.dir + Math.PI; } break;
      case 'idle': {
        if (phase === 'night') { if (walk(h, e.cave, HOBBIT_WALK, ctx)) { h.act = 'sleeping'; h.inside = true; } break; }
        if (phase === 'dusk') { if (walk(h, stepTo(e.hearth, (e.hobbits.indexOf(h) / BAND) * Math.PI * 2, 1.6), HOBBIT_WALK, ctx)) { h.act = 'eating'; h.taking = MEAL_TICKS; h.heading = toward(h, e.hearth); if (e.eatenToday === 0) { e.eatenToday = 1; event(e, 'band-eats', e.hearth); } } break; }
        if (dayOver || !need && !(h.picksBerries && e.berriesStore < BERRY_PICKERS)) { if (!dayOver && rand() < ANTIC_CHANCE) startAntic(e, h, rand, ctx); else walk(h, stepTo(e.hearth, (e.hobbits.indexOf(h) / BAND) * Math.PI * 2 + 0.5, 2.2), HOBBIT_WALK, ctx); break; }
        if (h.picksBerries && e.berries.length) { h.target = { kind: 'berries', ...e.berries[(h.trips + e.hobbits.indexOf(h)) % e.berries.length] }; h.act = 'out'; break; }
        const c = nearest(h, takeable(e, taken).filter(c => dist(c, e.hearth) <= FORAGE_R)); if (c) { h.target = { kind: 'chicken', id: c.id }; taken.add(c.id); h.act = 'out'; } else h.speed = 0;
        break;
      }
      case 'out': {
        if (!h.target) { h.act = 'idle'; break; }
        if (h.target.kind === 'chicken') { const tid = h.target.id, c = e.chickens.find(c => c.id === tid); if (!c) { h.target = null; h.act = 'idle'; break; } if (dist(h, c) <= TAKE_M) { h.act = 'taking'; h.taking = TAKE_TICKS; h.speed = 0; } else walk(h, c, HOBBIT_WALK, ctx); }
        else if (walk(h, h.target, HOBBIT_WALK, ctx)) { h.act = 'taking'; h.taking = BERRY_TICKS; }
        if ((h.stuck ?? 0) > GIVE_UP) { h.target = null; h.act = 'idle'; h.stuck = 0; }
        maybeTrip(e, h, rand);
        break;
      }
      case 'taking': {
        if (h.target?.kind === 'chicken') { const tid = h.target.id, c = e.chickens.find(c => c.id === tid); if (!c) { h.target = null; h.act = 'idle'; break; } h.heading = toward(h, c); if (--h.taking <= 0) { eat(e, c, 'hobbit'); h.carry = 'chicken'; h.target = null; h.act = 'home'; event(e, 'hobbit-takes', c, h.id); } }
        else if (--h.taking <= 0) { h.carry = 'berries'; h.target = null; h.act = 'home'; event(e, 'hobbit-picks', h, h.id); }
        break;
      }
      case 'home': if (walk(h, e.hearth, HOBBIT_WALK, ctx)) { if (h.carry === 'chicken') e.store++; else if (h.carry === 'berries') e.berriesStore++; h.carry = null; h.trips++; h.act = 'idle'; } else maybeTrip(e, h, rand); break;
      case 'eating': h.hunger = Math.max(0, h.hunger - 0.6 / MEAL_TICKS); if (--h.taking <= 0) h.act = 'idle'; break;
    }
    if (h.act !== 'out' && h.act !== 'home' && !(h.act === 'idle' && !atHearth(h))) h.speed = 0;
  }
  // ── the pack ── (the band's targets of this tick are its own: the pack leaves them)
  for (const h of e.hobbits) if (h.target?.kind === 'chicken') taken.add(h.target.id);
  if (e.packDay !== day) { e.packDay = day; e.packMeals = 0; }
  // The pack hunts from dawn through the afternoon and at dusk while it is short of its meals, and rests through noon and the night.
  const leader = e.pack[0], hunts = phase !== 'night' && phase !== 'noon' && e.packMeals < PACK_MEALS;
  if (leader) {
    const hobbitNear = (p: Vec2): boolean => e.hobbits.some(h => !h.inside && dist(h, p) < KEEP_OFF_M);
    // Coequal tribes: a hobbit within KEEP_OFF_M and the leader turns the pack away from it (and from whatever it was after).
    const tooNear = leader.act === 'resting' ? null : e.hobbits.find(h => !h.inside && e.pack.some(w => dist(h, w) < KEEP_OFF_M)) ?? null;
    if (tooNear) { leader.target = null; leader.act = 'roaming'; leader.shy = 12; }
    if ((leader.shy ?? 0) > 0) { leader.shy!--; const h = tooNear ?? nearest(leader, e.hobbits.filter(h => !h.inside)); if (h) walk(leader, stepTo(leader, toward(h, leader), 8), WOLF_WALK, ctx); }
    else if (leader.act === 'resting') { if (hunts) { leader.act = 'roaming'; event(e, 'pack-roams', leader); } }
    else if ((leader.shy ?? 0) > 0) { /* turning away this tick */ }
    else if (leader.act === 'eating') { if (--leader.eating <= 0) { const c = e.chickens.find(c => c.id === leader.target); if (c) { eat(e, c, 'wolf'); e.packMeals++; event(e, 'wolf-eats', c); } leader.target = null; leader.act = 'roaming'; } }
    else {
      const c = leader.target !== null ? e.chickens.find(c => c.id === leader.target) : null;
      if (!hunts && !c) { if (walk(leader, e.packHome, WOLF_WALK, ctx)) { leader.act = 'resting'; event(e, 'pack-rests', leader); } }
      else if (!c) { const pick = nearest(leader, takeable(e, taken).filter(c => dist(c, e.packHome) <= HUNT_R && !hobbitNear(c))); if (pick) { leader.target = pick.id; leader.act = 'hunting'; } else { leader.act = 'roaming'; const wander = stepTo(e.packHome, rand() * Math.PI * 2, 10 + rand() * 30); walk(leader, wander, WOLF_WALK * 0.5, ctx); } }
      else if (hobbitNear(c) || (leader.stuck ?? 0) > GIVE_UP) { leader.target = null; leader.act = 'roaming'; leader.stuck = 0; }
      else if (walk(leader, c, WOLF_WALK, ctx)) { leader.act = 'eating'; leader.eating = EAT_TICKS; }
    }
    // The rest follow the leader in a loose file, and lie down where it lies.
    for (let i = 1; i < e.pack.length; i++) { const w = e.pack[i], back = stepTo(leader, leader.heading + Math.PI, FOLLOW_M * i * 0.7); back.x += Math.cos(i * 2.1) * 1.2; back.z += Math.sin(i * 2.1) * 1.2; if (leader.act === 'resting' || leader.act === 'eating') { w.act = leader.act; w.speed = 0; } else { w.act = leader.act; if (dist(w, back) > 0.6) walk(w, back, WOLF_WALK * 1.1, ctx); else w.speed = 0; } }
  }
}
/** What the fungus and the band are doing, for the panel and the checks. */
export function summary(e: Eden): { chickens: number; free: number; growing: number; out: number; inside: number; carrying: number; store: number; packAct: WolfAct; packMeals: number; hunger: number } {
  return { chickens: e.chickens.length, free: e.chickens.filter(c => c.stage !== 'growing').length, growing: e.chickens.filter(c => c.stage === 'growing').length, out: e.hobbits.filter(h => h.act === 'out' || h.act === 'taking' || h.act === 'home').length, inside: e.hobbits.filter(h => h.inside).length, carrying: e.hobbits.filter(h => h.carry).length, store: e.store, packAct: e.pack[0]?.act ?? 'resting', packMeals: e.packMeals, hunger: e.hobbits.reduce((s, h) => s + h.hunger, 0) / Math.max(1, e.hobbits.length) };
}
export const serializeEden = (e: Eden): string => JSON.stringify({ v: 1, ...e });
export function parseEden(raw: string | null, fresh: () => Eden): Eden {
  try { const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object' || p.v !== 1 || !Array.isArray(p.hobbits) || !Array.isArray(p.chickens) || !Array.isArray(p.pack) || !Array.isArray(p.hosts)) return fresh(); const { v: _v, ...rest } = p; const e = rest as Eden; e.flowers ??= []; e.rocks ??= []; return e; } catch { return fresh(); }
}
