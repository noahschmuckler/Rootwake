// The village, V0: presence. Hulda walks a meadow among eight hobbits who live by a day's rhythm:
// out of their doors at dawn to the places they keep to, together at the fire at noon, home at
// dusk, asleep at night. They do not see her yet. Twenty real minutes to their day, which passes
// only while the page is open. The question: do figures going in and out of houses on a rhythm
// already read as people living there?
import './village.css';
import * as THREE from 'three';
import { Player, PITCH_LIMIT, PITCH_FULL } from './player';
import { freshSteward, parseSteward, serializeSteward, wake as wakeUp, send as sendSteward, stepSteward, bite as biteSteward, lyingUp, leftToWalk, WAKE_GEMS, PACE as STEWARD_PACE, type Steward, type Circle } from './stewardModel';
import { setMoot, setHeroes, assignDuty, guards, traitsOf, traitWords, GUARDS_MAX } from './villageModel';
import { createHulda } from './huldaCharacter';
import { createHuldaPresentation, HUMAN_CENTRE, type HuldaForm } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { buildVillage, type VillageWorld } from './villageWorld';
import { hedgeNear, dispelHedge, newsFor, commune, RUMOR_TICKS, packAsleep, slayAsleep, setWarrens, quickenWarren, rabbitsAt, WARREN_CAP, type WarrenPlace, strikeDamage, hedgeAllowed, growHedge, HEDGE_PRAYER, setRuins, purify, purifiable, PURIFY_COST, regenRate, storeSpot, STORE_RING_R, carryInfant, dropCarried, bear, broodSpot, isBlighted, incidents, HOBBITS, housesOf, setLayouts, setVillageSites, folkOf, newcomersOf, isHome, villageState, stateText, rumors, spoil, setDens, wolves, denState, densInReach, WOLF_HP, WOLF_TICK, type StateKind, type Voiced, type DenPlace, housePlace, siteStation, deliverToSite, askHut, quicken, quickenable, QUICKEN_COST, HUT_PRAYER, HUT_WOOD, HUT_WATER, HUT_WORK_TICKS, BEDS, HOUSE_CAP, siteNeeds, STORES, STATIONS, SITES, YIELD_OF, YIELD_SITES, isSpoiled, HOLD_RANGE, HOLD_MELT_S, GREEN, REST_MEALS, BIRTH_DAYS, BERRY_CAP, BRANCH_CAP, MILK_PER_DAY, CROP_STRIPS, type YieldSite, balance, stationAt, storeFull, collect, deliver, setTreeProvider, treesNear, stepRaiders, strike, thornBurst, rootBind, STRIKE_CD, THORN_CD, ROOT_CD, THORN_SAP, ROOT_SAP, DY_HP, vigorMax, sapMax, setLair, forestDepth, choosePerk, LAIR_HP, LAIR_HURT_RANGE, XP_DY, XP_LAIR, LEVEL_XP, LEVEL_CAP, raidsPaused, summonSpirit, spiritCost, COLLECT_S, DELIVER_S, PRAYER_CAP, HOUSE_RADIUS, PHASES, type SiteKind, type Store, TICKS_PER_SECOND, DAY_TICKS, TREES, TREE_ROOTS, GRASS_SPEED, ROOT_SPEED, TRUNK_CLIMB, CROWN_SLIDE, HOP_S, PRESS_S, PRESS_RANGE, ENTER_RANGE, freshVillage, parseVillage, serializeVillage, advance, clockOf, phaseAt, daylightAt, everyone, hobbitById, thought, crownHeight, trunkRadius, nearestTree, rootPoint, rootTangent, endTree, hopTargets, inWater, type Village, type Tree, type RootEdge } from './villageModel';
// R1 (Noah): roots as a way, not a trap. No root takes her from the grass by itself: one stick tap takes the nearest root within ROOT_REACH m, one tap leaves it. A place tapped on the map plots a course through the roots; the entry tree glows, pressing into it (or a tap beside it) sinks her in, and the roots carry her at CARRY_SPEED until a tap or the end, where she rises out. Tuning.
const ROOT_REACH = 2.6, CARRY_SPEED = 9;
/** The longest gap between frames the village clock counts as watched time. Tuning. */
const WALL_CAP = 2;
import { MODEL_HEIGHT } from './huldaRig';
import type { HobbitState, VillageEvent, PurifyTarget } from './villageModel';
import { createRootNetwork, siteTreeId, soilAt as grassCan, type WorldRoot, type Course } from './worldRoots';
import { rootNetworkWorld } from './rootNetworkWorld';
import { NODES as ROOT_NODES, PILLARS, standNear, groundAt, nodeName, ZONES as ROOT_ZONES, type Node as RootNode } from './karstFlowModel';
import { createTerrain } from './worldTerrain';
import { createDenField } from './denWorld';
import { freshCultivation, parseCultivation, serializeCultivation, worldTier, power, lacking, grow, grownEnough, canRaise, raise, reachBonus, viewScale, TIER_POINTS, TIER_CLARITY, TIER_CAP, type Cultivation, type WorldState } from './cultivationModel';
import { CHAMBER_FLOOR } from './denModel';
import { createChunks } from './chunkWorld';
import { createKarstFeature } from './karstFeature';
import { KARST_AT } from './overworldModel';
import { NODES as NODES_HANDLE } from './karstFlowModel';
import { biomeAt } from './chunkModel';
import { moot, warrens, WARREN_RADIUS, ruins, sanctify, groves, type Ruin, EXPLORE_RADIUS, freshOverworld, parseOverworld, serializeOverworld, explore, isRevealed, knownPlaces, places, dens, danger, addHint, hintFrom, villageSites, HINT_REACH, HINT_SPREAD, CELL, ZOOM_MIN, ZOOM_MAX, zoomElevation, bearingOf, wrapDeg, type Overworld, type VillageSite } from './overworldModel';
import { islands, convergences } from './chunkModel';
import type { TraversalWorld } from './mobility';
import { Board } from './match3';
import { BoardView } from './board3d';
import { freshDeep, parseDeep, serializeDeep, gather, channel, canChannel, MIRACLE_GEMS, MIRACLE_CLARITY, SANCTIFY_GEMS, canDive, dive, canReturn, returnDeep, launch as launchDeep, isShrined, canDeepen, deepen, reachable, launchSeconds, deepDirection, reachAngle, nodeDepth, deepReach, CLARITY_CAP, DIVE_COST, RETURN_COST, DEEPEN_COST, DEEPEN_POINTS, SHRINE_PRAYER, type DeepPlace, type Deep } from './deepModel';
import { createDeepWorld } from './deepWorld';
const KEY = 'rootwake-village-v1';
// G4 (EXPANSION.md): every village on the land is a whole village of the model with a scene of its own at its origin. The first, at the origin, is the home village: the mother of goats knows it alone, and its save is the old key. The others (the overworld's villageSites) are saved under the key and their folk number. `village` and `world` are always the active village's: the nearest to her feet, so her rings, her panel, her prayer and her fight are the village she is in.
let home: Village = freshVillage(1); try { home = parseVillage(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
if (!isHome(home)) home = freshVillage(home.seed);
const OVER_KEY = 'rootwake-overworld-v1';
let overworld: Overworld = freshOverworld(1); try { overworld = parseOverworld(localStorage.getItem(OVER_KEY)); } catch { /* Storage is optional. */ }
function save() { try { for (const c of ctxs) localStorage.setItem(c.key, serializeVillage(c.v)); localStorage.setItem(OVER_KEY, serializeOverworld(overworld)); localStorage.setItem(DEEP_KEY, serializeDeep(deep)); karst?.save(); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const labels = el('labels');
const FAR_GROUND = 220, FAR_VISTA = 1100, VISTA_ALT = [8, 40], VISTA_FOG = 0.22;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, FAR_GROUND); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#eef4e2', '#4d5f48', 2.3); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.3); sun.position.set(-20, 40, 15); scene.add(sun);
if (overworld.seed !== home.seed) overworld = freshOverworld(home.seed);
const terrain = createTerrain(home.seed), relief = terrain.height;
/** A village on the land: its model, its scene, its origin, and what the entry keeps per village (the shown figures' eased places, the labels, what it has told her). */
interface Ctx { i: number; id: string; name: string; short: string; folk: number; v: Village; world: VillageWorld; ox: number; oz: number; key: string; shownMap: Map<string, Shown>; shownSpirits: { x: number; z: number; heading: number }[]; raiderLabels: Map<number, { label: HTMLElement; hp: HTMLElement }>; smallLabels: HTMLElement[]; houseLabels: Map<number, HTMLElement>; toldEvent: VillageEvent | null; heardRumor: Voiced | null; near: boolean }
/** Another village's save, or a fresh one brought up to the home village's day (the last SITE_CATCH_UP days lived through, so it has a history; the rest skipped whole days). Tuning. */
const SITE_CATCH_UP = 5;
function loadSite(s: VillageSite): Village {
  let v: Village | null = null; try { v = parseVillage(localStorage.getItem(`${KEY}-${s.folk}`)); } catch { /* Storage is optional. */ }
  if (!v || v.folk !== s.folk || v.seed !== home.seed) { v = freshVillage(home.seed, s.folk, s); v.tick = Math.floor(Math.max(0, home.tick - SITE_CATCH_UP * DAY_TICKS) / DAY_TICKS) * DAY_TICKS; advance(v, home.tick - v.tick); }
  v.origin = { x: s.x, z: s.z }; return v;
}
const makeCtx = (i: number, s: { id: string; name: string; short: string; folk: number; x: number; z: number }, v: Village): Ctx => ({ i, id: s.id, name: s.name, short: s.short, folk: s.folk, v, world: buildVillage(scene, terrain, s), ox: s.x, oz: s.z, key: s.folk ? `${KEY}-${s.folk}` : KEY, shownMap: new Map(), shownSpirits: [], raiderLabels: new Map(), smallLabels: [], houseLabels: new Map(), toldEvent: null, heardRumor: null, near: i === 0 });
const sites = villageSites(home.seed);
const ctxs: Ctx[] = [makeCtx(0, { id: 'village', name: 'the village', short: 'the village', folk: 0, x: 0, z: 0 }, home), ...sites.map((s, k) => makeCtx(k + 1, s, loadSite(s)))];
/** Her level, vigor and sap are hers, not a village's: one hero, held by every village's model. */
function shareHero(): void { for (const c of ctxs) if (c.i > 0) c.v.hero = ctxs[0].v.hero; }
shareHero();
let ctx: Ctx = ctxs[0], village: Village = ctx.v, world: VillageWorld = ctx.world;
const home_ = (): Ctx => ctxs[0];
setLayouts(ctxs.map(c => ({ x: c.ox, z: c.oz, huts: c.v.huts }))); setVillageSites(sites.map(s => ({ id: s.id, x: s.x, z: s.z, short: s.short })));
const network = createRootNetwork(terrain), networkScene = rootNetworkWorld(scene);
const nextRoot = network.next;
// The other villages' meadow trees are the first's, placed at their origins (ids past every chunk's), so they can be stood by and climbed there too.
const siteTrees: Tree[] = ctxs.slice(1).flatMap(c => TREES.map(t => ({ id: siteTreeId(c.folk, t.id), x: t.x + c.ox, z: t.z + c.oz, size: t.size })));
// S1 (SETTLEMENTS.md): the warrens, a pool of rabbits for every den, told to the model and built in the chunks; the rabbits shown are the pool as the village whose den it is knows it.
let warrenPlaces: WarrenPlace[] = warrens(home.seed).slice(); setWarrens(warrenPlaces);
// S2 (SETTLEMENTS.md): the old moot, where the steward sleeps.
const mootPlace = moot(home.seed);
const chunks = createChunks(scene, home.seed, terrain, dens(home.seed), convergences(home.seed), ruins(home.seed), warrenPlaces, mootPlace);
const rabbitStock = (id: string): number => { const w = warrenPlaces.find(x => x.id === id); if (!w) return 0; const k = denKnownBy(w.den); return k ? rabbitsAt(k.c.v, k.d) : WARREN_CAP; }; chunks.setRabbits(rabbitStock);
// S2: the steward. Asleep in the moot's chair until she wakes him there with a channelling of clarity; then he walks where she sends him, on foot (only she rides the roots), and the village he stands in has his board. A wolf may bite him on the way (he lies up a day, never killed). STEWARD_NAME is a working name. MOOT_R: how near the chair she stands to wake him. Tuning.
const STEWARD_KEY = 'rootwake-steward-v1', STEWARD_NAME = 'Oswin', MOOT_R = 4;
let steward: Steward = (() => { try { return parseSteward(localStorage.getItem(STEWARD_KEY), mootPlace); } catch { return freshSteward(mootPlace); } })(), stewardSaveClock = 0;
function saveSteward(): void { try { localStorage.setItem(STEWARD_KEY, serializeSteward(steward)); } catch { /* Storage is optional. */ } }
setMoot(mootPlace, !steward.woken);
const stewardAvoid = (): Circle[] => { const l = places(home.seed).find(p => p.id === 'lair')!; return [{ x: l.x, z: l.z, r: l.radius + 12 }, { x: KARST_AT.x, z: KARST_AT.z, r: 110 }]; };
setHeroes(() => (steward.woken && !lyingUp(steward, home_().v.tick) ? [{ id: 'steward', x: steward.x, z: steward.z }] : []), () => { biteSteward(steward, home_().v.tick); saveSteward(); tellBanner(`${STEWARD_NAME} the steward is bitten by a wolf: he lies up a day where he is`); });
/** A village's green on the land, where the steward stands. */
const greenOf = (c: Ctx): { x: number; z: number } => ({ x: c.ox + 3, z: c.oz + 3 });
const ctxName = (c: Ctx): string => (c.i ? c.name : 'the village');
function sendTo(id: string): boolean { const c = ctxs.find(x => x.id === id); if (!c || !sendSteward(steward, id, greenOf(c), stewardAvoid())) return false; saveSteward(); tellBanner(`${STEWARD_NAME} sets out for ${ctxName(c)}`); return true; }
function wakeSteward(): boolean {
  if (!wakeUp(steward)) return false; setMoot(mootPlace, false); overworld.known.add('moot'); const near = ctxs.slice().sort((a, b) => Math.hypot(a.ox - mootPlace.x, a.oz - mootPlace.z) - Math.hypot(b.ox - mootPlace.x, b.oz - mootPlace.z))[0];
  sendSteward(steward, near.id, greenOf(near), stewardAvoid()); saveSteward(); save(); tellBanner(`${STEWARD_NAME} wakes at the foot of the old moot's chair: the steward, keeper of the villages' duties. He walks to ${ctxName(near)}`); return true;
}
function tellBanner(text: string): void { bannerEl.textContent = text; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1600; }
// The dens as delves (Noah): their halls and chambers are her ground where they lie, built as she comes near.
const denField = createDenField(scene, terrain, dens(home.seed), home.seed); chunks.setSanctified(overworld.sanctified); setRuins(ruins(home.seed).map(r => ({ id: r.id, x: r.x, z: r.z }))); setTreeProvider((x, z, r) => [...chunks.treesNear(x, z, r), ...siteTrees.filter(t => Math.hypot(t.x - x, t.z - z) <= r)]);
// The lair (M1b): placed by the seed (overworldModel), told to the model and set in the scene.
const lairPlace = places(home.seed).find(p => p.id === 'lair')!; setDens(dens(home.seed).map(d => ({ id: d.id, x: d.x, z: d.z, pack: d.pack }))); setLair({ x: lairPlace.x, z: lairPlace.z, radius: lairPlace.radius }); home_().world.setLairAt(lairPlace.x, lairPlace.z);
/** Where she stands in the active village's frame. */
const herLocal = (): { x: number; z: number } => { const f = player.feet(); return { x: f.x - ctx.ox, z: f.z - ctx.oz }; };
/** A house of any village within `r` of a point on the land. */
const houseNear = (x: number, z: number, r: number): boolean => ctxs.some(c => Math.hypot(x - c.ox, z - c.oz) < 40 && housesOf(c.v).some(h => Math.hypot(x - c.ox - h.x, z - c.oz - h.z) < HOUSE_RADIUS + r));
/** The active village is the nearest to her feet; crossing over, her hands (the stack, an infant) go with her. Villages within NEAR_M are presented in full (the first within HOME_NEAR_M: its Dark Young, its snatchers and the mother's label reach out to the lair); farther, only their houses stand. Tuning. */
const NEAR_M = 300, HOME_NEAR_M = 520, SHOW_M = 700;
function pickActive(): void {
  const f = player.feet(); let best = ctxs[0], bd = Infinity; for (const c of ctxs) { const d = Math.hypot(f.x - c.ox, f.z - c.oz); if (d < bd) { bd = d; best = c; } }
  if (best === ctx) return; const prev = ctx; ctx = best; village = best.v; world = best.world;
  best.v.stack = prev.v.stack; prev.v.stack = null; best.v.carried = prev.v.carried; prev.v.carried = null; prev.world.setStation(null, time); prev.world.setStack(null, 0); lastStation = null; say(best.name, 3);
}
// eslint-disable-next-line @typescript-eslint/no-use-before-define
let karst: ReturnType<typeof createKarstFeature>;
const groundWorld: TraversalWorld = {
  // The land is unbounded: the meadow, and past it the chunks (chunkWorld), whose trees the model's lookups see through setTreeProvider.
  // The land is unbounded: the meadow, and past it the chunks (chunkWorld), whose trees the model's lookups see through setTreeProvider; where the karst stands, its own zone worlds are her ground (karstFeature).
  surfacesAt: (x, z) => (karst.owns(x, z) ? karst.traversal().surfacesAt(x, z) : denField.surfacesAt(x, z) ?? [relief(x, z)]),
  canOccupy: (p, radius, height) => { if (karst.owns(p.x, p.z)) return karst.traversal().canOccupy(p, radius, height); const den = denField.canOccupy(p, radius, height); if (den !== null) return den; return p.y >= relief(p.x, p.z) - 0.03 && !houseNear(p.x, p.z, radius) && !treesNear(p.x, p.z, 6).some(t => Math.hypot(p.x - t.x, p.z - t.z) < trunkRadius(t) + radius); },
};
/** While she is a bulge, a figure of leaves or a knot in a root, the shared motor stays put but the stick still speaks. */
const lockedWorld: TraversalWorld = { surfacesAt: () => [], canOccupy: () => false };
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third'; player.traversalWorld = groundWorld;
const presentation = createHuldaPresentation(scene, home_().world.figure, home_().world.mass);
karst = createKarstFeature(scene, player, camera, KARST_AT, { orbit: (t, back, up, ease) => orbitCamera(t, back, up, ease), want: () => want(), ground: () => groundWorld, locked: lockedWorld, height: relief, portal: openPortal });
{ const karstClear = player.cameraClear; player.cameraClear = p => (!karstClear || karstClear(p)) && denField.cameraClear(p); }
const hulda = presentation.hulda;
// Hulda and the hobbits share the skeleton, so the Mixamo clips drive all nine (public/models/README.md).
const query = new URLSearchParams(location.search), clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
let clipStatus: 'none' | 'loading' | 'ready' | 'failed' = clipUrls.length ? 'loading' : 'none', clipError = '';
if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => { presentation.setClips(clips); stewardFig.setClips(clips); for (const c of ctxs) c.world.setFigureClips(clips); clipStatus = 'ready'; }, e => { clipStatus = 'failed'; clipError = String(e); console.warn('clips', e); });
for (const child of [...player.avatar.children]) player.avatar.remove(child);
player.teleport(0, -16, Math.PI); player.pitch = 0.08; installMobilityControls(player);
let time = 0, last = performance.now(), tickBank = 0, saveClock = 0, simSeconds = 0;
// Dev control of the clock (tap the clock): the day runs at `speed` times real time, and jumps forward advance the model; a jump back replays the village from its seed to that tick, which is the same state, since the village is deterministic and she does not touch it yet.
let speed = 1;
function syncShown(c: Ctx = ctx): void { if (!c.near) { hideShown(c); return; } for (const s of c.v.hobbits) { const v = shownFor(c, s); v.x = s.x; v.z = s.z; v.heading = s.heading; } }
/** A village begun again, from its first dawn, in its place. */
function freshCtx(c: Ctx): void { c.v = freshVillage(home.seed, c.folk, { x: c.ox, z: c.oz }); if (c === ctx) village = c.v; }
function setTick(t: number): void { t = Math.max(0, Math.floor(t)); for (const c of ctxs) { if (t >= c.v.tick) advance(c.v, t - c.v.tick); else { freshCtx(c); advance(c.v, t); } } shareHero(); tickBank = 0; for (const c of ctxs) syncShown(c); save(); }
/** The next dawn / noon / dusk / night from now (the same phase today if it is still ahead). */
function jumpTo(phase: 'dawn' | 'noon' | 'dusk' | 'night'): void { const at = PHASES.find(p => p[0] === phase)![1], day = Math.floor(village.tick / DAY_TICKS), today = day * DAY_TICKS + at; setTick(today > village.tick ? today : today + DAY_TICKS); }
const timectl = el('timectl'); el('clock').addEventListener('click', () => { timectl.hidden = !timectl.hidden; });
timectl.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('button'); if (!b) return; if (b.dataset.jump) setTick(village.tick + Number(b.dataset.jump)); else if (b.dataset.to) jumpTo(b.dataset.to as 'dawn'); else if (b.dataset.speed) { speed = Number(b.dataset.speed); for (const o of timectl.querySelectorAll('button[data-speed]')) o.classList.toggle('on', o === b); }
  // Dev: the village from its first dawn again (its people, stores, land, spirits, raids and her level); the karst's progress and the map she has seen stay. Noah: to watch the Dark Young's work with no hand of hers in it.
  else if (b.dataset.reset !== undefined) { if (confirm('Start the village over? Its day, people, stores, land, spirits and her level go back to the first dawn. The map and the karst keep what she has seen.')) { resetVillage(); timectl.hidden = true; } } });
// Noah: a reset takes the summoned spirits from the land and the villagers' rumors from the map.
function resetVillage(): void { steward = freshSteward(mootPlace); setMoot(mootPlace, true); saveSteward(); for (const c of ctxs) freshCtx(c); shareHero(); tickBank = 0; course = null; courseTarget = null; carried = false; overworld.hints = []; for (const c of ctxs) { syncShown(c); pruneShown(c); c.shownSpirits.length = 0; for (const f of c.world.spiritFigures) f.visible = false; c.heardRumor = null; c.toldEvent = null; } save(); if (mapOpen) drawMap(); say('the villages begin again', 4); }

// Her ways through the meadow (the clearing's moves): into a trunk, up to the crown, across the crowns; under the
// grass as a bulge, free and fast; onto a tree root, faster still but held to its path; out by a double tap.
type Mode = 'ground' | 'trunk' | 'crown' | 'hop' | 'sink' | 'grass' | 'root' | 'rise' | 'faint' | 'karst' | 'meditate' | 'dive' | 'deep' | 'launch';
/** The deep's modes (G4): on the board, down the taproot, at the node, along a deep root. */
const inDeep = (m: Mode): boolean => m === 'meditate' || m === 'dive' || m === 'deep' || m === 'launch';
let mode: Mode = 'ground', under = 0, press = 0, lastStickTap = -Infinity, stickDown = 0, stickDownAt = { x: 0, y: 0 };
let trunk: { tree: Tree; h: number; az: number; downHeld: number } | null = null;
let crown: { tree: Tree; az: number; armed: boolean } | null = null;
let hop: { from: THREE.Vector3; to: THREE.Vector3; t: number; tree: Tree; az: number } | null = null;
let grass: { x: number; z: number; heading: number } | null = null;
let root: { root: RootEdge; s: number; forward: boolean; off: number; exit?: boolean } | null = null;
let move: { from: THREE.Vector3; to: THREE.Vector3; t: number; seconds: number; then: () => void } | null = null;
// The course (R1): the place she chose, the way there, which of its roots she rides, and whether the roots are carrying her now. A tap's single meaning waits out the double tap's window (pendingTap).
let course: Course | null = null, courseTarget: { x: number; z: number } | null = null, courseAt = 0, carried = false, pendingTap = 0;
let blightDrawn = 0;
let notice = { text: '', until: 0 }, bannerUntil = 0;
/** A banner stays BANNER_S seconds. Tuning. */
const BANNER_S = 6, bannerEl = el('banner');
const say = (text: string, seconds = 2.5): void => { notice = { text, until: time + seconds * 1000 }; };
function want(): THREE.Vector3 {
  const g = player.gesture; if (!g.held || Math.hypot(g.x, g.y) < 0.25) return new THREE.Vector3();
  const yaw = player.yaw, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
  return new THREE.Vector3(rx * g.x + fx * -g.y, 0, rz * g.x + fz * -g.y).normalize();
}
const stickY = (): number => (player.gesture.held ? player.gesture.y : 0), stickX = (): number => (player.gesture.held ? player.gesture.x : 0);
/** Her camera when she is not walking: the same rule as the shared third person (behind her by yaw, a fixed lift, the look tilted by pitch), so a drag reads the same whatever she is. */
function orbitCamera(target: THREE.Vector3, back = 3.2, up = 1.3, ease = 1): void {
  const yaw = player.yaw, f = player.forward();
  camWant.set(target.x + Math.sin(yaw) * back, target.y + up, target.z + Math.cos(yaw) * back); lookWant.set(target.x + f.x * 2, target.y + 0.4 + f.y * 2, target.z + f.z * 2);
  if (ease >= 1) { camera.position.copy(camWant); camera.lookAt(lookWant); camEased = false; return; }
  if (!camEased) { camAt.copy(camera.position); lookAt.copy(lookWant); camEased = true; }
  camAt.lerp(camWant, ease); lookAt.lerp(lookWant, ease); camera.position.copy(camAt); camera.lookAt(lookAt);
}
const camWant = new THREE.Vector3(), lookWant = new THREE.Vector3(), camAt = new THREE.Vector3(), lookAt = new THREE.Vector3(); let camEased = false;
/** Carried along a root the camera never turns of itself (Noah, 2026-09-27: riding the roots should not rotate the camera; the eased follow of the root's heading before it was still nauseating). Her yaw and pitch are the player's, by the look drag as in every other form, and the camera rides rigidly behind her at that yaw, as when she walks; her figure alone turns with the root. */
const camTurn = { max: 0, yaw: 0, carried: false, reset() { camTurn.max = 0; } };
function lock(): void { player.traversalWorld = lockedWorld; player.motor.velocity.set(0, 0, 0); player.avatar.visible = false; }
function place(p: THREE.Vector3): void { player.motor.feet.copy(p); player.position.x = p.x; player.position.z = p.z; }
function standOn(x: number, z: number, yaw = player.yaw): void {
  const n = nearestTree(x, z); if (n.distance < 0.35) { const a = Math.atan2(z - n.tree.z, x - n.tree.x); x = n.tree.x + Math.cos(a) * (trunkRadius(n.tree) + 0.4); z = n.tree.z + Math.sin(a) * (trunkRadius(n.tree) + 0.4); }
  if (!karst.inside(x, z)) karst.leave();
  player.traversalWorld = groundWorld; player.motor.reset(new THREE.Vector3(x, relief(x, z), z)); place(new THREE.Vector3(x, relief(x, z), z)); player.yaw = yaw; player.canMove = true; mode = 'ground'; trunk = null; crown = null; hop = null; grass = null; root = null;
}
/** A course to a place: from where she is (a tree near her is the way in), or, in a root already, from either of its ends, and then she is off at once. */
function plotCourse(target: { x: number; z: number }): boolean {
  courseTarget = target; carried = false;
  if (mode === 'root' && root) { if (resumeCourse()) { drawMap(); return true; } }
  const f = mode === 'grass' && grass ? grass : player.feet();
  course = network.plan(f, target); courseAt = 0;
  if (!course) { courseTarget = null; say('no way there through the roots'); drawMap(); return false; }
  say(mode === 'grass' ? 'a way is plotted: tap by a root to take it' : 'a way is plotted: the tree to enter glows'); drawMap(); return true;
}
function clearCourse(): void { course = null; courseTarget = null; carried = false; drawMap(); }
/** In a root with a place chosen: the course is plotted anew from the nearer end that has one, and the roots carry her toward it. */
function resumeCourse(): boolean {
  if (!root || !courseTarget) return false;
  const r = root.root, ends = [{ id: r.a, along: root.s }, { id: r.b, along: r.length - root.s }].sort((p, q) => p.along - q.along);
  for (const e of ends) { const c = network.planFrom(e.id, courseTarget); if (c) { course = c; courseAt = -1; root.forward = e.id === r.b; carried = true; return true; } }
  return false;
}
/** From the ground at the entry tree: down into its first root, and away. */
function startCourse(from: THREE.Vector3): void {
  if (!course) return; const r = course.roots[0], forward = r.a === course.nodes[0], s = forward ? 0 : r.length;
  lock(); mode = 'sink'; grass = null; trunk = null; courseAt = 0; carried = true;
  move = { from: from.clone(), to: rootPoint(r, s), t: 0, seconds: 0.5, then: () => { root = { root: r, s, forward, off: 0 }; mode = 'root'; } };
}
/** The course's end: she rises out where it ends. */
function arriveCourse(): void { course = null; courseTarget = null; carried = false; say('she is there'); emerge(); }
// The portal (R1, Noah's C): a tree at the foot of the karst offers the places its roots reach; picked, the roots carry her there. If it is the entry of a plotted course, that comes first.
const portalEl = el('portal'); let portalNode: RootNode | null = null, portalAt = { x: 0, z: 0 };
function openPortal(n: RootNode): boolean {
  if (course && course.entry === network.nodeId(n.id)) { startCourse(player.feet()); return true; }
  if (!portalEl.hidden) return true;
  const places = karst.destinations(n.id); if (!places.length) return false;
  portalNode = n; const f = player.feet(); portalAt = { x: f.x, z: f.z };
  portalEl.querySelector('.title')!.textContent = `${nodeName(n.id)}: its roots reach`;
  portalEl.querySelector('.list')!.replaceChildren(...places.map(d => { const b = document.createElement('button'); b.dataset.to = d.id; b.textContent = d.name; const i = document.createElement('i'); i.textContent = `${Math.round(d.length)} m`; b.append(i); return b; }));
  portalEl.hidden = false; player.cancelInput(); return true;
}
function closePortal(): void { portalEl.hidden = true; portalNode = null; }
portalEl.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('button'); if (!b) return; if (b.dataset.to && portalNode && mode === 'ground' && karst.travel(portalNode.id, b.dataset.to)) mode = 'karst'; closePortal(); });
function enterTrunk(tree: Tree): void { lock(); trunk = { tree, h: 0.2, az: Math.atan2(player.feet().z - tree.z, player.feet().x - tree.x), downHeld: 0 }; mode = 'trunk'; }
/** Into the grass: a bulge under the meadow from wherever she stands (or from a trunk's foot). */
function enterGrass(from: THREE.Vector3): void { lock(); mode = 'sink'; trunk = null; move = { from: from.clone(), to: new THREE.Vector3(from.x, relief(from.x, from.z) - 0.1, from.z), t: 0, seconds: 0.5, then: () => { grass = { x: from.x, z: from.z, heading: player.yaw }; mode = 'grass'; } }; }
/** Where she can stand on the ground: within the walkable world, not in water, a house or a trunk. */
const standable = (x: number, z: number): boolean => grassCan(x, z) && !inWater(x, z) && groundWorld.canOccupy(new THREE.Vector3(x, relief(x, z), z), 0.26, 0.8);
function emerge(): void {
  if (mode === 'root' && root && !(root.root as WorldRoot).surface) {
    // A deep conduit cannot emerge through stone: carry to the nearer safe mouth.
    root.exit = true; root.forward = root.s >= root.root.length / 2; return;
  }
  if (mode !== 'grass' && mode !== 'root' && mode !== 'trunk' && mode !== 'crown') return;
  const p = mode === 'grass' && grass ? new THREE.Vector3(grass.x, relief(grass.x, grass.z), grass.z) : mode === 'root' && root ? rootPoint(root.root, root.s) : mode === 'trunk' && trunk ? world.trunkPoint(trunk.tree, trunk.h, trunk.az) : crown ? world.crownPoint(crown.tree, crown.az) : null;
  if (!p) return; let gx = p.x, gz = p.z; const n = nearestTree(gx, gz); if (n.distance < trunkRadius(n.tree) + 0.45) { const a = Math.atan2(gz - n.tree.z, gx - n.tree.x); gx = n.tree.x + Math.cos(a) * (trunkRadius(n.tree) + 0.5); gz = n.tree.z + Math.sin(a) * (trunkRadius(n.tree) + 0.5); }
  // Out must always be possible: where she is cannot be stood on (water, a house, the edge of the world), the nearest spot round it that can is taken instead.
  if (!standable(gx, gz)) { let found: { x: number; z: number } | null = null; for (let r = 0.6; r <= 3.0 && !found; r += 0.6) for (let k = 0; k < 12 && !found; k++) { const a = k / 12 * Math.PI * 2, x = gx + Math.cos(a) * r, z = gz + Math.sin(a) * r; if (standable(x, z)) found = { x, z }; } if (!found) return; gx = found.x; gz = found.z; }
  const from = p.clone(); mode = 'rise'; grass = null; root = null; trunk = null; crown = null;
  move = { from, to: new THREE.Vector3(gx, relief(gx, gz), gz), t: 0, seconds: 0.7, then: () => standOn(gx, gz) };
}
function pressInto(dt: number): void {
  const w = want(), feet = player.feet(); if (w.lengthSq() === 0 || player.motor.speed > 0.35 || loaded()) { press = 0; return; }
  const n = nearestTree(feet.x, feet.z), toTree = new THREE.Vector3(n.tree.x - feet.x, 0, n.tree.z - feet.z).normalize();
  if (n.distance < PRESS_RANGE && toTree.dot(w) > 0.6) { press += dt; if (press > PRESS_S) { press = 0; if (course && course.entry === n.tree.id) startCourse(feet); else enterTrunk(n.tree); } return; }
  press = 0;
}
const walk = el('walk');
walk.addEventListener('pointerdown', e => { stickDown = performance.now(); stickDownAt = { x: e.clientX, y: e.clientY }; }, true);
walk.addEventListener('pointerup', e => { const now = performance.now(); if (now - stickDown < 230 && Math.hypot(e.clientX - stickDownAt.x, e.clientY - stickDownAt.y) < 10) { if (now - lastStickTap < 330) { lastStickTap = -Infinity; pendingTap = 0; doubleTap(); } else { lastStickTap = now; pendingTap = now; } } }, true);
/** Two taps: in under the ground, or out of any form. */
/** Her hands full (a stack, or an infant in her arms): no other form. */
const loaded = (): boolean => !!village.stack || !!village.carried;
function doubleTap(): void { if (mode === 'ground') { const f = player.feet(); if (loaded()) wobble = 0.6; else if (karst.zone !== 'floor' && karst.inside(f.x, f.z)) { if (karst.enterRootsNear(f) && mode === 'ground') mode = 'karst'; } else if (grassCan(f.x, f.z)) enterGrass(f); } else if (mode === 'karst') karst.emerge(); else emerge(); }
/** One tap: in the grass the nearest root takes her (and the course, if one is plotted); in a root she is off it into the grass (a deep conduit carries her to a mouth first); at the entry tree, into the course; on a portal ride, off at the next mouth. */
function singleTap(): void {
  if (mode === 'grass' && grass) {
    const hit = network.nearest(grass, ROOT_REACH); if (!hit) { say(isBlighted(village, grass.x, grass.z) ? 'the roots here are blighted' : 'no root within reach'); return; }
    const t = rootTangent(hit.root, hit.s), forward = t.x * -Math.sin(grass.heading) + t.z * -Math.cos(grass.heading) >= 0;
    root = { root: hit.root, s: hit.s, forward, off: 0 }; grass = null; mode = 'root'; if (courseTarget) resumeCourse();
  } else if (mode === 'root' && root) {
    carried = false; if (!(root.root as WorldRoot).surface) { emerge(); return; }
    const p = rootPoint(root.root, root.s); if (grassCan(p.x, p.z)) { grass = { x: p.x, z: p.z, heading: player.yaw }; root = null; mode = 'grass'; }
  } else if (mode === 'ground' && course) { const f = player.feet(), e = network.nodeAt(course.entry); if (e && Math.hypot(e.x - f.x, e.z - f.z) < ENTER_RANGE + 1) startCourse(f); }
  else if (mode === 'karst') karst.stop();
}
// Each hobbit's shown position eases after the model's tick, so a tick's step reads as walking, not a jump.
// D1: the shown hobbits are by id, made when first seen (a birth) and taken away with the dead.
interface Shown { x: number; z: number; heading: number; speed: number; label: HTMLElement; bubble: HTMLElement; hunger: HTMLElement; name: string }
function shownFor(c: Ctx, s: HobbitState): Shown {
  let v = c.shownMap.get(s.id); if (v) return v; const h = hobbitById(s.id);
  v = { x: s.x, z: s.z, heading: s.heading, speed: 0, label: document.createElement('div'), bubble: document.createElement('div'), hunger: null as unknown as HTMLElement, name: h.name };
  v.label.className = 'name'; v.label.textContent = v.name; v.bubble.className = 'bubble'; const meter = document.createElement('i'); meter.className = 'hunger'; v.hunger = document.createElement('b'); meter.append(v.hunger); v.label.append(meter); const news = document.createElement('em'); news.className = 'news'; news.textContent = '!'; news.hidden = true; v.label.insertBefore(news, meter); labels.append(v.label, v.bubble); c.shownMap.set(s.id, v); return v;
}
function pruneShown(c: Ctx): void { const alive = new Set(c.v.hobbits.map(s => s.id)); for (const [id, v] of c.shownMap) if (!alive.has(id)) { v.label.remove(); v.bubble.remove(); c.shownMap.delete(id); } }
/** A village out of presentation (far): its labels leave the page (a far village has none; they are made again, at the model's places, when she comes near). */
function hideShown(c: Ctx): void { for (const v of c.shownMap.values()) { v.label.remove(); v.bubble.remove(); } c.shownMap.clear(); for (const [id, l] of c.raiderLabels) { l.label.remove(); c.raiderLabels.delete(id); c.world.hideRaider(id); } for (const e of c.smallLabels) e.remove(); c.smallLabels.length = 0; for (const e of c.houseLabels.values()) e.remove(); c.houseLabels.clear(); }
const shown = { get list(): Shown[] { return ctx.v.hobbits.map(s => shownFor(ctx, s)); } };
{ const t = Number(new URLSearchParams(location.search).get('tick')); if (Number.isFinite(t) && t > 0) setTick(t); }
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro'); el('help').onclick = () => { player.cancelInput(); intro.showModal(); }; el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault()); document.addEventListener('visibilitychange', () => { last = performance.now(); player.cancelInput(); if (document.hidden) save(); });
window.addEventListener('pagehide', save); window.addEventListener('beforeunload', save);
window.addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); boardView.layout(); });
const forestSky = new THREE.Color('#1a0e22');
const daySky = new THREE.Color('#a9bcae'), duskSky = new THREE.Color('#c9946a'), nightSky = new THREE.Color('#1d2836'), colour = new THREE.Color();
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
const visualForward = new THREE.Vector3(0, 0, -1);
function presentHulda(dt: number): void {
  let form: HuldaForm = 'human';
  visualPosition.copy(player.feet());
  let heading = player.yaw; if (mode === 'ground' && player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  visualRotation.setFromAxisAngle(up, heading);
  if (mode === 'trunk' && trunk) { form = 'burl'; visualPosition.copy(world.trunkPoint(trunk.tree, trunk.h, trunk.az)); visualRotation.setFromAxisAngle(up, Math.PI / 2 - trunk.az); }
  else if (mode === 'crown' && crown) { form = 'leaf'; visualPosition.copy(world.crownPoint(crown.tree, crown.az)); }
  else if (mode === 'hop') form = 'leaf';
  else if (mode === 'grass' && grass) { form = 'ivy'; visualPosition.set(grass.x, relief(grass.x, grass.z) - 0.05, grass.z); visualRotation.setFromAxisAngle(up, grass.heading); }
  else if (mode === 'root' && root) { form = 'knot'; visualPosition.copy(rootPoint(root.root, root.s)); const t = rootTangent(root.root, root.s); if (!root.forward) t.negate(); visualRotation.setFromUnitVectors(visualForward, t.normalize()); }
  else if (mode === 'sink' || mode === 'rise' || mode === 'faint') form = 'ivy';
  const kv = mode === 'karst' ? karst.visual() : null; if (kv) { form = kv.form; visualPosition.copy(kv.position); visualRotation.copy(kv.rotation); }
  if (form === 'human' || form === 'leaf') visualPosition.y += HUMAN_CENTRE;
  if (mode === 'dive' || mode === 'launch') form = 'knot';
  // In the deep she is the camera: her figure, which only fades when hidden, is put far below it, or its leaves fill the view (Noah).
  if (inDeep(mode) && mode !== 'meditate') visualPosition.set(camera.position.x, camera.position.y - 40, camera.position.z);
  presentation.update(dt, form, visualPosition, visualRotation, player.motor.speed, heading, mode === 'ground' || mode === 'meditate', (mode !== 'ground' && mode !== 'dive' && mode !== 'launch' && mode !== 'deep') || player.view === 'third', kv ? kv.present : form);
  player.avatar.visible = false;
}
// Her stations (W1): in a place's ring on her feet she collects into her stack, a unit every COLLECT_S; in a store's ring she delivers, one every DELIVER_S; before the stone the miracles are offered. A loaded stack refuses her other forms (a wobble says so).
let collectClock = 0, deliverClock = 0, wobble = 0, lastStation: string | null = null;
const miracles = el('miracles'), prayerEl = el('prayer'), tip = el('tip');
/** `dt` here is real time (capped at a quarter second), like the village's ticks: her collecting keeps its pace however slow the frames. */
function stations(dt: number): void {
  const f = player.feet(), l = herLocal(), st = mode === 'ground' ? stationAt(l.x, l.z) ?? siteStation(village, l.x, l.z) : null, id = st?.id ?? null;
  if (id !== lastStation) { collectClock = 0; deliverClock = 0; lastStation = id; }
  world.setStation(id, time);
  let say = '';
  if (st?.kind === 'gather' && st.keeps && YIELD_SITES.includes(st.keeps as YieldSite) && isSpoiled(village, st.keeps as YieldSite)) say = `${SITES[st.keeps].name} is spoiled`;
  else if (st?.kind === 'gather' && st.keeps) { const kind = YIELD_OF[st.keeps]!; collectClock += dt; while (collectClock >= COLLECT_S) { collectClock -= COLLECT_S; if (!collect(village, st.keeps)) { collectClock = 0; break; } } if (storeFull(village, kind)) say = `${STORES[kind].name} are full`; else if (village.stack && village.stack.kind !== kind) say = `her hands are full of ${STORES[village.stack.kind].unit}`; }
  else if (st?.kind === 'deliver' && st.store) { deliverClock += dt; while (deliverClock >= DELIVER_S) { deliverClock -= DELIVER_S; if (!deliver(village, st.store)) { deliverClock = 0; break; } } if (village.stack && village.stack.kind !== st.store) say = `${STORES[st.store].name} take ${STORES[st.store].unit}, not ${STORES[village.stack.kind].unit}`; else if (village.stack && storeFull(village, st.store)) say = `${STORES[st.store].name} are full`; }
  else if (st?.kind === 'site' && village.site) { deliverClock += dt; while (deliverClock >= DELIVER_S) { deliverClock -= DELIVER_S; if (!deliverToSite(village)) { deliverClock = 0; break; } } const need = `the hut needs wood ${siteNeeds(village, 'wood')} · water ${siteNeeds(village, 'water')}`; say = village.stack && village.stack.kind !== 'wood' && village.stack.kind !== 'water' ? `the hut takes wood and water, not ${STORES[village.stack.kind].unit}` : village.stack && siteNeeds(village, village.stack.kind as 'wood' | 'water') < 1 ? `the hut has its ${village.stack.kind}` : village.site.work < HUT_WORK_TICKS && siteNeeds(village, 'wood') < 1 && siteNeeds(village, 'water') < 1 ? `the hut is being built · ${Math.round(village.site.work / HUT_WORK_TICKS * 100)}%` : need; }
  if (mode === 'ground') { const held = village.raiders.find(r => r.rooted > 0 && r.held > 0 && r.state !== 'melting' && Math.hypot(r.x - l.x, r.z - l.z) <= HOLD_RANGE); if (held && held.id === village.hero.holding) say = `${held.state === 'retreating' ? `holding it · ${Math.ceil(HOLD_MELT_S - held.held)} s to melt` : 'holding it'} · sap ${Math.floor(village.hero.sap)}`; }
  // D3: an infant lying within reach is taken up; carried to its door it is home.
  if (mode === 'ground') { const r = carryInfant(village, l); if (r) save(); }
  if (!say && village.carried) say = `carrying ${hobbitById(village.carried.id).name} home to house ${village.carried.home + 1}`;
  if (!say && notice.until > time) say = notice.text;
  // On the board the tip stays off: it sat over the gems (Noah); what the board earns is said on the meditation panel.
  tip.hidden = !say || mode === 'meditate'; if (say) tip.textContent = say;
  if (!miracles.hidden) presentMiracles(st?.keeps ?? null, l);
  prayerEl.textContent = `prayer ${Math.floor(village.prayer)} / ${PRAYER_CAP}`; world.updatePrayer(village.prayer / PRAYER_CAP);
  wobble = Math.max(0, wobble - dt);
  world.setStack(village.stack?.kind ?? null, village.stack?.n ?? 0);
  if (village.stack && mode === 'ground') { const yaw = player.yaw; world.stack.position.set(f.x + Math.sin(yaw) * 0.16, f.y + 0.78, f.z + Math.cos(yaw) * 0.16); world.stack.rotation.set(Math.sin(wobble * 20) * wobble * 0.5, yaw, 0); } else world.stack.visible = false;
}
// Noah: the miracles from anywhere, behind a button, and the fight buttons behind a toggle: fewer buttons on the screen.
const prayBtn = el<HTMLButtonElement>('pray'), fightBox = el('fight'), fightToggle = el<HTMLButtonElement>('fightToggle');
prayBtn.addEventListener('click', () => { miracles.hidden = !miracles.hidden; prayBtn.setAttribute('aria-expanded', String(!miracles.hidden)); });
fightToggle.addEventListener('pointerdown', e => { e.preventDefault(); const open = fightBox.classList.toggle('closed'); fightToggle.setAttribute('aria-expanded', String(!open)); });
// The miracles are actions where she stands (Noah, 2026-09-27: like the strike, not a list of places): at a yielding place, quicken it (or purify it while it is spoiled) and a spirit for it; at the stream, a spirit; at the Dark Young's leavings, banish them; the hut anywhere. Each costs its prayer and a channelling on the board (MIRACLE_CLARITY clarity, MIRACLE_GEMS gems). The panel is rebuilt as the place under her changes.
const miracleList = miracles.querySelector('.list') as HTMLElement; let miracleKey = '?';
function miraclesHere(keeps: SiteKind | null, l: { x: number; z: number }): Miracle[] {
  const out: Miracle[] = [];
  if (keeps && YIELD_SITES.includes(keeps as YieldSite)) { const site = keeps as YieldSite; out.push(isSpoiled(village, site) ? { kind: 'purify', target: site } : { kind: 'quicken', site }); }
  if (keeps && YIELD_OF[keeps]) out.push({ kind: 'spirit', keeps });
  { const heap = storeSpot(STORES.dark); if (Math.hypot(l.x - heap.x, l.z - heap.z) <= STORE_RING_R + 0.6) out.push({ kind: 'purify', target: 'dark' }); }
  // G3b: a thorn hedge across the run, where she stands on the village's ground beyond the green.
  if (hedgeNear(village, l.x, l.z)) out.push({ kind: 'dispel', x: l.x, z: l.z });
  else if (hedgeAllowed(village, l.x, l.z) && grassCan(l.x + village.origin.x, l.z + village.origin.z)) out.push({ kind: 'hedge', x: l.x, z: l.z });
  { const gx = l.x + village.origin.x, gz = l.z + village.origin.z, w = warrenPlaces.find(w => Math.hypot(w.x - gx, w.z - gz) <= WARREN_RADIUS); if (w) out.push({ kind: 'warren', id: w.id, den: w.den }); }
  return out;
}
function presentMiracles(keeps: SiteKind | null, l: { x: number; z: number }): void {
  const here = miraclesHere(keeps, l), key = here.map(miracleName).join('|');
  if (key !== miracleKey) { miracleKey = key; miracleList.replaceChildren(...here.map((m, i) => { const b = document.createElement('button'); b.dataset.miracle = String(i); b.append(document.createTextNode(miracleName(m) + ' '), document.createElement('i')); return b; })); (miracles.querySelector('.where') as HTMLElement).textContent = here.length ? '' : 'Stand at a yielding place, the stream, the leavings or a warren to work a miracle there'; }
  here.forEach((m, i) => { const b = miracleList.children[i] as HTMLButtonElement; b.disabled = !miracleReady(m) || (!instant(m) && !canChannel(deep)); b.querySelector('i')!.textContent = instant(m) ? 'nothing' : m.kind === 'warren' ? `no prayer · ${MIRACLE_CLARITY} clarity` : `${miracleCost(m)} prayer · ${MIRACLE_CLARITY} clarity`; });
  const near = villagerNear(), com = miracles.querySelector('[data-commune]') as HTMLButtonElement; com.disabled = !near; com.childNodes[0].textContent = near ? `Commune with ${hobbitById(near.id).name} ` : 'Commune: stand by a villager '; com.querySelector('i')!.textContent = near && hasNews(near) ? 'news' : '';
  const hut = miracles.querySelector('[data-hut]') as HTMLButtonElement; hut.disabled = village.prayer < HUT_PRAYER || !!village.site || 6 + village.huts >= HOUSE_CAP; hut.querySelector('i')!.textContent = String(HUT_PRAYER); hut.childNodes[0].textContent = village.site ? 'A hut is going up ' : 6 + village.huts >= HOUSE_CAP ? 'No room for more huts ' : 'A new hut ';
}
miracles.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('button'); if (!b) return; if (b.dataset.commune !== undefined) { communeNear(); return; } if (b.dataset.hut) { if (askHut(village)) save(); return; } if (b.dataset.miracle === undefined) return; const l = herLocal(), st = stationAt(l.x, l.z), m = miraclesHere(st?.keeps ?? null, l)[Number(b.dataset.miracle)]; if (!m || !miracleReady(m)) return; if (instant(m)) { workMiracle(m); return; } startSession('channel', m); });
// The spirits: shown like the hobbits, eased after the model, as figures of leaves that bob a little.
function presentSpirits(c: Ctx, dt: number, wall = dt): void {
  const shownSpirits = c.shownSpirits; shownSpirits.length = Math.min(shownSpirits.length, c.v.spirits.length); for (let i = 0; i < c.world.spiritFigures.length; i++) c.world.spiritFigures[i].visible = i < c.v.spirits.length;
  for (let i = 0; i < c.v.spirits.length; i++) {
    const s = c.v.spirits[i]; if (!shownSpirits[i]) shownSpirits[i] = { x: s.x, z: s.z, heading: s.heading };
    const v = shownSpirits[i], f = c.world.spiritFigure(i), dx = s.x - v.x, dz = s.z - v.z, d = Math.hypot(dx, dz), step = d < 0.03 ? d : Math.min(d, (d > 2.5 ? 3 : 1.3) * speed * wall);
    if (d > 1e-4) { v.x += dx / d * step; v.z += dz / d * step; }
    const th = d > 0.05 ? Math.atan2(dz, dx) : s.heading; v.heading += wrap(th - v.heading) * Math.min(1, dt * 8);
    f.position.set(v.x, c.world.relief(v.x, v.z) + Math.sin(time * 0.004 + i) * 0.04, v.z); f.rotation.y = -Math.PI / 2 - v.heading;
  }
}
// Fighting (Diablo-shaped): a cheap strike on a short cooldown, two rechargeable specials that also spend sap. The Dark Young are stepped in real seconds (at the clock's speed); bitten to nothing she faints into the grass and wakes at the stone, weakened, never dead.
const cooldown = { strike: 0, thorn: 0, root: 0 };
const fightEl = { strike: el<HTMLButtonElement>('strike'), thorn: el<HTMLButtonElement>('thorn'), root: el<HTMLButtonElement>('root'), vigor: el('vigor').firstElementChild as HTMLElement, sap: el('sap').firstElementChild as HTMLElement };
const levelEl = el('level'), perksEl = el('perks');
perksEl.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('button'); if (!b || !b.dataset.perk) return; if (choosePerk(village, b.dataset.perk as 'vigor')) save(); });
function herFacing(): { fx: number; fz: number } { return { fx: -Math.sin(player.yaw), fz: -Math.cos(player.yaw) }; }
/** `simDt` is real time at the clock's speed (the Dark Young), `dt` real time (her cooldowns and the strokes' fade): both keep their pace however slow the frames. */
function fight(simDt: number, dt: number): void {
  const her = mode === 'ground' && village.hero.faint === 0 ? herLocal() : null;
  // Every village's raiders walk, hers with her in it; the others' without her (they are hunting its folk all the same).
  const regen = regenRate(village.hero, deep.clarity / CLARITY_CAP); for (const c of ctxs) stepRaiders(c.v, simDt, c === ctx ? her : null, c === ctx, regen);
  for (const k of ['strike', 'thorn', 'root'] as const) { cooldown[k] = Math.max(0, cooldown[k] - dt * regen); const total = k === 'strike' ? STRIKE_CD : k === 'thorn' ? THORN_CD : ROOT_CD; fightEl[k].style.setProperty('--cd', String(cooldown[k] / total)); fightEl[k].classList.toggle('short', k !== 'strike' && village.hero.sap < (k === 'thorn' ? THORN_SAP : ROOT_SAP)); }
  fightEl.vigor.style.width = `${village.hero.vigor / vigorMax(village.hero) * 100}%`; fightEl.sap.style.width = `${village.hero.sap / sapMax(village.hero) * 100}%`;
  levelEl.textContent = `level ${village.hero.level}${village.hero.level < LEVEL_CAP ? ` · ${village.hero.xp}/${LEVEL_XP[village.hero.level]}` : ''}`; perksEl.hidden = village.hero.choices < 1; if (!perksEl.hidden) perksEl.querySelector('.title')!.textContent = `Level ${village.hero.level}: what grows in her? (${village.hero.choices} to choose)`;
  // The lair: shown, its hp over it while near; the forest's air darkens with the depth.
  { const h = home_(); h.world.setLair(h.v.lair.alive, h.v.lair.hurt, time, h.v.lair.hp / LAIR_HP); }
  if (village.hero.faint > 0 && mode !== 'faint') { const l = herLocal(); dropCarried(village, l.x, l.z); lock(); mode = 'faint'; grass = null; root = null; trunk = null; crown = null; }
  if (mode === 'faint') { const p = player.feet(); place(p); orbitCamera(p, 3.2, 1.3); if (village.hero.faint === 0) { const st = SITES.shrine, a = Math.atan2(st.z, st.x), x = st.x - Math.cos(a) * 1.6, z = st.z - Math.sin(a) * 1.6; standOn(x + ctx.ox, z + ctx.oz, Math.atan2(-(st.x - x), -(st.z - z))); } }
  for (const c of ctxs) c.world.updateStrokes(dt);
}
/** The pack asleep in a den (Noah): as the village whose reach the den is in knows it (hers first), else the den's whole pack. */
function denKnownBy(id: string): { c: Ctx; d: DenPlace } | null { for (const c of [ctx, ...ctxs.filter(c => c !== ctx)]) { const d = densInReach(c.v).find(x => x.id === id); if (d) return { c, d }; } const far = dens(home.seed).find(d => d.id === id); return far ? { c: home_(), d: { id: far.id, x: far.x, z: far.z, pack: far.pack } } : null; }
function packAsleepAt(id: string): number { const k = denKnownBy(id); return k ? packAsleep(k.c.v, k.d) : 0; }
// Communing (Noah, 2026-09-27): a villager with news for her wears a mark; standing by them, the pray panel's commune says it (the hint goes to her map), or, from any other villager, a word about themselves. COMMUNE_R: how near. Tuning.
const COMMUNE_R = 2.6;
const placeKnown = (about: string): boolean => overworld.known.has(about === 'blight' ? 'lair' : about) || overworld.hints.some(h => h.about === (about === 'blight' ? 'lair' : about));
const hasNews = (s: HobbitState): boolean => !!newsFor(village, s, placeKnown);
function villagerNear(): HobbitState | null { const l = herLocal(); let best: HobbitState | null = null, bd = COMMUNE_R; for (const s of village.hobbits) { if (s.inside) continue; const d = Math.hypot(s.x - l.x, s.z - l.z); if (d < bd) { bd = d; best = s; } } return best; }
let lastCommune = '';
function communeNear(): boolean {
  const s = villagerNear(); if (!s) return false; const r = commune(village, s, placeKnown), name = hobbitById(s.id).name;
  s.bubble = r.text; s.bubbleUntil = village.tick + RUMOR_TICKS * 3; lastCommune = `${name}: ${r.text}`; say(lastCommune, 6);
  if (r.hint && r.hint.bearing !== undefined && r.hint.about) { addHint(overworld, { about: r.hint.about === 'blight' ? 'lair' : r.hint.about, bearing: r.hint.bearing, text: r.hint.text, ...(ctx.i ? { from: { x: ctx.ox, z: ctx.oz } } : {}) }); if (mapOpen) drawMap(); }
  save(); return true;
}
function attack(k: 'strike' | 'thorn' | 'root'): void {
  if (mode !== 'ground' || village.hero.faint > 0 || cooldown[k] > 0) return; const f = player.feet(), her = herLocal(), { fx, fz } = herFacing();
  // In a den by day the strike falls on the pack asleep (the delve's payoff): a wolf slain there is the den's loss and her level's gain.
  if (k === 'strike' && denField.inside && denField.current) { const r = denField.strikeAsleep(f, fx, fz, strikeDamage(village.hero)); cooldown.strike = STRIKE_CD; world.flashSlash(f.x, f.y, f.z, player.yaw); if (r.killed) { const known = denKnownBy(denField.current.id); if (known && slayAsleep(known.c.v, known.d)) { say('a wolf slain asleep in its den', 4); save(); } } return; }
  if (k === 'strike') { const hit = strike(village, her, fx, fz); cooldown.strike = STRIKE_CD; world.flashSlash(f.x, f.y, f.z, player.yaw); if (hit) { const yaw = Math.atan2(-(hit.x - her.x), -(hit.z - her.z)); player.yaw += Math.atan2(Math.sin(yaw - player.yaw), Math.cos(yaw - player.yaw)) * 0.6; } }
  else if (k === 'thorn') { const n = thornBurst(village, her); if (n < 0) return; cooldown.thorn = THORN_CD; world.flashBurst(f.x, f.y, f.z); }
  else { const r = rootBind(village, her); if (r === undefined) return; cooldown.root = ROOT_CD; }
  save();
}
for (const k of ['strike', 'thorn', 'root'] as const) fightEl[k].addEventListener('pointerdown', e => { e.preventDefault(); attack(k); });
// The Dark Young shown from the model, with a name and an hp bar over each while near.
function presentRaiders(c: Ctx, dt: number): void {
  const seen = new Set<number>(), village = c.v, world = c.world, raiderLabels = c.raiderLabels, smallLabels = c.smallLabels, relief = c.world.relief, ox = c.ox, oz = c.oz;
  for (const r of village.raiders) {
    seen.add(r.id); const moving = r.state === 'coming' || r.state === 'hunting' || r.state === 'leaving' || r.state === 'retreating', dead = r.state === 'dead' || r.state === 'melting' ? r.gone : 0;
    if (r.kind === 'wolf') world.setWolf(r.id, r.x, r.z, r.heading, time, moving, r.hurt, r.rooted, dead); else world.setRaider(r.id, r.x, r.z, r.heading, time, moving, r.hurt, r.rooted, dead, r.state === 'retreating' || r.state === 'leaving');
    let l = raiderLabels.get(r.id); if (!l) { const label = document.createElement('div'); label.className = 'name foe'; label.append(document.createTextNode('dark young')); const meter = document.createElement('i'); meter.className = 'hunger'; const hp = document.createElement('b'); meter.append(hp); label.append(meter); labels.append(label); l = { label, hp }; raiderLabels.set(r.id, l); }
    tmp.set(r.x + ox, relief(r.x, r.z) + 1.9, r.z + oz); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = r.state !== 'dead' && r.state !== 'melting' && tmp.z < 1 && dist < 22 && Math.abs(tmp.x) < 1.1;
    l.label.hidden = !show; if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; l.label.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; l.label.style.opacity = '1'; l.hp.style.width = `${r.hp / (r.kind === 'wolf' ? WOLF_HP : DY_HP) * 100}%`; l.hp.style.background = '#e0603a'; l.label.firstChild!.textContent = r.kind === 'wolf' ? (r.state === 'hunting' ? 'wolf · hunting' : r.state === 'leaving' ? 'wolf · leaving' : 'wolf') : r.state === 'retreating' ? (r.rooted > 0 ? 'dark young · held' : 'dark young · fleeing') : r.state === 'devouring' ? 'dark young · devouring' : 'dark young'; }
  }
  for (const [id, l] of raiderLabels) if (!seen.has(id)) { l.label.remove(); raiderLabels.delete(id); world.hideRaider(id); }
  // D3: the snatchers, named only within a few metres; the infants lying out, named from farther; the one in her arms.
  const ids = new Set<number>(); for (const n of village.snatchers) { ids.add(n.id); world.setSnatcher(n.id, n.x, n.z, n.heading, time, !!n.infant); } world.hideSnatchersBut(ids);
  const f = player.feet(), fl = { x: f.x - ox, z: f.z - oz }; const kept = village.brood.map((b, i) => ({ ...broodSpot(i)!, infant: b.infant })).filter(k => k.x !== undefined); world.setInfants([...village.dropped, ...kept], c === ctx && village.carried && mode !== 'faint' ? new THREE.Vector3(f.x + Math.sin(player.yaw) * -0.25, f.y + 0.85, f.z + Math.cos(player.yaw) * -0.25) : null);
  const near = [...village.snatchers.filter(n => Math.hypot(n.x - fl.x, n.z - fl.z) < 6).map(n => ({ x: n.x, z: n.z, h: 0.6, text: n.infant ? `something small, with ${hobbitById(n.infant.id).name}` : 'something small' })), ...village.dropped.map(d => ({ x: d.x, z: d.z, h: 0.5, text: hobbitById(d.infant.id).name })), ...kept.map(k => ({ x: k.x, z: k.z, h: 0.5, text: `${hobbitById(k.infant.id).name}, held by the mother` }))];
  while (smallLabels.length < near.length) { const e = document.createElement('div'); e.className = 'name way'; labels.append(e); smallLabels.push(e); }
  smallLabels.forEach((e, i) => { const m = near[i]; if (!m) { e.hidden = true; return; } tmp.set(m.x + ox, relief(m.x, m.z) + m.h, m.z + oz); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = tmp.z < 1 && dist < 40 && Math.abs(tmp.x) < 1.1; e.hidden = !show; if (show) { e.textContent = m.text; e.style.transform = `translate(${(tmp.x + 1) * innerWidth / 2}px,${(1 - tmp.y) * innerHeight / 2}px) translate(-50%,-100%)`; } });
  if (c.i === 0) { const L = village.lair; tmp.set(lairPlace.x, terrain.height(lairPlace.x, lairPlace.z) + 7, lairPlace.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = L.alive && tmp.z < 1 && dist < 60 && Math.abs(tmp.x) < 1.1; lairLabel.hidden = !show; if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; lairLabel.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; lairLabel.style.opacity = '1'; lairHp.style.width = `${L.hp / LAIR_HP * 100}%`; lairHp.style.background = '#c060d0'; } }
  void dt;
}
// The way in (R1): while a course is plotted and she is not yet in its roots, a ring and a shaft of light stand at the entry tree, named.
const wayIn = new THREE.Group(); const wayRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 8, 40), new THREE.MeshBasicMaterial({ color: '#f0d060' })); wayRing.rotation.x = Math.PI / 2; wayRing.position.y = 0.08; const wayShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.14, 7, 8, 1, true), new THREE.MeshBasicMaterial({ color: '#f0d060', transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide })); wayShaft.position.y = 3.5; wayIn.add(wayRing, wayShaft); wayIn.visible = false; scene.add(wayIn);
const wayLabel = document.createElement('div'); wayLabel.className = 'name way'; wayLabel.textContent = 'the way in'; wayLabel.hidden = true; labels.append(wayLabel);
function presentCourse(): void {
  const e = course && mode !== 'root' && mode !== 'karst' ? network.nodeAt(course.entry) : null; wayIn.visible = !!e; wayLabel.hidden = !e; if (!e) return;
  const y = relief(e.x, e.z); wayIn.position.set(e.x, y, e.z); const k = 1 + 0.12 * Math.sin(time * 0.004); wayRing.scale.set(k, k, 1);
  tmp.set(e.x, y + 2.2, e.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = tmp.z < 1 && dist < 80 && Math.abs(tmp.x) < 1.1; wayLabel.hidden = !show;
  if (show) { const x = (tmp.x + 1) * innerWidth / 2, py = (1 - tmp.y) * innerHeight / 2; wayLabel.style.transform = `translate(${x}px,${py}px) translate(-50%,-100%)`; wayLabel.textContent = `the way in · ${Math.round(dist)} m`; }
}
// Houses are numbered in what is told ("a hut stands: house 7") and (Noah) the player had no way to tell which was which: a label floats over each house while near. HOUSE_LABEL_M: tuning.
const HOUSE_LABEL_M = 32;
// The karsts have names (Noah, 2026-09-27: the one with the pool needed its own, and the others were hard to tell apart): a label floats over each pillar's summit while she is within KARST_LABEL_M, fading at the edge of that. Tuning.
const KARST_LABEL_M = 420;
const karstLabels = PILLARS.map(p => { const e = document.createElement('div'); e.className = 'name karst'; e.textContent = p.name; e.hidden = true; labels.append(e); return { p, e }; });
function presentKarsts(): void {
  for (const { p, e } of karstLabels) {
    tmp.set(KARST_AT.x + p.x, p.height + 3, KARST_AT.z + p.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = !inDeep(mode) && tmp.z < 1 && dist < KARST_LABEL_M && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
    e.hidden = !show; if (show) { e.style.transform = `translate(${(tmp.x + 1) * innerWidth / 2}px,${(1 - tmp.y) * innerHeight / 2}px) translate(-50%,-100%)`; e.style.opacity = String(Math.min(1, (KARST_LABEL_M - dist) / 60)); }
  }
}
function presentHouses(c: Ctx): void {
  for (const h of housesOf(c.v)) {
    let e = c.houseLabels.get(h.id); if (!e) { e = document.createElement('div'); e.className = 'name house'; e.textContent = `house ${h.id + 1}`; labels.append(e); c.houseLabels.set(h.id, e); }
    tmp.set(h.x + c.ox, c.world.relief(h.x, h.z) + 2.3, h.z + c.oz); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = tmp.z < 1 && dist < HOUSE_LABEL_M && Math.abs(tmp.x) < 1.1;
    e.hidden = !show; if (show) { e.style.transform = `translate(${(tmp.x + 1) * innerWidth / 2}px,${(1 - tmp.y) * innerHeight / 2}px) translate(-50%,-100%)`; e.style.opacity = String(Math.min(1, (HOUSE_LABEL_M - dist) / 8)); }
  }
}
// Incidents (Noah: a bite's banner said nothing of where): while one lasts, a beacon stands on the victim (on the spot, once they are indoors or gone) and a ring follows the wolf; the map and the compass carry it too.
const INCIDENT_VICTIM = '#f0b0a0', INCIDENT_FOE = '#e0603a';
function presentIncidents(c: Ctx): void {
  const list: { x: number; z: number; colour: string; shaft: boolean; r?: number }[] = [];
  for (const inc of incidents(c.v)) {
    const who = inc.who ? c.v.hobbits.find(s => s.id === inc.who) : null, at = who && !who.inside ? who : inc; list.push({ x: at.x, z: at.z, colour: INCIDENT_VICTIM, shaft: true, r: 1.1 });
    if (inc.foe !== undefined) { const r = c.v.raiders.find(r => r.id === inc.foe && r.state !== 'dead' && r.state !== 'melting'); if (r) list.push({ x: r.x, z: r.z, colour: INCIDENT_FOE, shaft: false, r: 0.9 }); }
  }
  c.world.setMarks(list, time);
}
/** Every fresh incident on the land she would know of (the village she is in, and the villages she has been to), in the scene's frame. */
const allIncidents = (): { x: number; z: number; text: string; village: string }[] => ctxs.filter(c => c === ctx || overworld.known.has(c.id)).flatMap(c => incidents(c.v).map(i => ({ x: i.x + c.ox, z: i.z + c.oz, text: i.text, village: c.id })));
const lairLabel = document.createElement('div'); lairLabel.className = 'name foe lair'; lairLabel.textContent = 'the mother of goats'; const lairMeter = document.createElement('i'); lairMeter.className = 'hunger'; const lairHp = document.createElement('b'); lairMeter.append(lairHp); lairLabel.append(lairMeter); lairLabel.hidden = true; labels.append(lairLabel);
/** `dt` is the capped animation step; `wall` the real seconds the village's ticks came from. The figure's walk toward the model's place uses the real seconds (Noah: they ran, stopped and ran again on the phone: on slow frames the capped step covered less ground than the ticks did, the lag grew past a hitch and they sprinted to close it), the mixer the capped step. */
function presentHobbits(c: Ctx, dt: number, wall = dt): void {
  camera.updateMatrixWorld();
  pruneShown(c); const village = c.v, world = c.world, relief = c.world.relief, ox = c.ox, oz = c.oz;
  for (const s of village.hobbits) {
    const v = shownFor(c, s), f = world.figureFor(s), h = hobbitById(s.id); if (s.stage === 'infant') { v.label.hidden = true; v.bubble.hidden = true; f.group.visible = false; continue; }
    // The model moves in ticks; the shown figure walks toward its place at the hobbit's own pace (a touch faster, so the lag never grows), so a tick's step is a stride, not a sprint and a wait. Only a hitch catches up quickly.
    const dx = s.x - v.x, dz = s.z - v.z, d = Math.hypot(dx, dz), step = d < 0.03 ? d : Math.min(d, (d > 2.5 ? h.pace * 2.5 : h.pace * 1.08) * speed * wall);
    if (d > 1e-4) { v.x += dx / d * step; v.z += dz / d * step; }
    const moving = step / Math.max(1e-6, wall); v.speed += (moving - v.speed) * Math.min(1, dt * 10);
    const targetHeading = d > 0.05 ? Math.atan2(dz, dx) : s.heading; v.heading += wrap(targetHeading - v.heading) * Math.min(1, dt * 8);
    f.group.visible = !s.inside; f.group.position.set(v.x, relief(v.x, v.z), v.z);
    // The rig faces -Z at yaw 0 and the model's heading is an angle in x,z: forward (-sin yaw, -cos yaw) = (cos h, sin h) gives yaw = -pi/2 - h.
    f.group.rotation.y = -Math.PI / 2 - v.heading;
    // A hobbit is shorter: its stride is scaled, so the gait is fed the speed it would be at Hulda's size.
    f.update(dt, v.speed * (MODEL_HEIGHT / f.height), f.group.rotation.y, true, 0);
    // Name and thought bubble over the head, while near and in front of the camera.
    tmp.set(v.x + ox, relief(v.x, v.z) + f.height + 0.12, v.z + oz); const dist = tmp.distanceTo(camera.position); tmp.project(camera);
    // A villager in an incident is named from farther, and says so.
    const news = c === ctx && newsFor(c.v, s, placeKnown) !== null, marked = incidents(village).some(i => i.who === s.id) || news, show = !s.inside && tmp.z < 1 && dist < (marked ? 60 : 16) && Math.abs(tmp.x) < 1.1; (v.label.querySelector('.news') as HTMLElement).hidden = !news;
    const text = thought(s, village.tick) || (marked ? 'bitten' : '');
    v.label.hidden = !show; v.bubble.hidden = !show || !text;
    if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; v.label.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; v.label.style.opacity = String(marked ? 1 : Math.min(1, (16 - dist) / 5)); v.bubble.style.transform = `translate(${x}px,${y - 26}px) translate(-50%,-100%)`; v.bubble.textContent = text; v.hunger.style.width = `${Math.round(s.hunger * 100)}%`; v.hunger.style.background = s.hunger > 0.85 ? '#e0603a' : s.hunger > 0.6 ? '#e0b040' : '#8fc45a'; }
  }
}
// The deep (G4, EXPANSION.md, Noah's second brief): the crystal pool on the summit, meditation on the board for clarity, the dive down the taproot to the node, the world seen from beneath, the launch along a deep root; shrines and convergences as the roots' ends and the way back. deepModel holds the rules, deepWorld the bores and the hollow; here the modes.
// G5: cultivation at the pool raises her tier; the land caps it; her power is the lesser (cultivationModel). Saved under its own key.
const CULT_KEY = 'rootwake-cultivation-v1'; let cultivation: Cultivation = freshCultivation(); try { cultivation = parseCultivation(localStorage.getItem(CULT_KEY)); } catch { /* Storage is optional. */ }
function saveCultivation(): void { try { localStorage.setItem(CULT_KEY, serializeCultivation(cultivation)); } catch { /* Storage is optional. */ } }
let worldOverride: WorldState | null = null;
/** The world as the tiers read it: the villages thriving (all three stand near the karst), the groves sanctified, the companions with her (none yet: their chapter is not built). */
const worldNow = (): WorldState => worldOverride ?? { thriving: ctxs.filter(c => villageState(c.v).kind === 'thriving').length, groves: groves(overworld).length, companions: steward.woken ? 1 : 0 };
const powerNow = (): number => power(cultivation, worldNow());
const DEEP_KEY = 'rootwake-deep-v1'; let deep: Deep = freshDeep(); try { deep = parseDeep(localStorage.getItem(DEEP_KEY)); } catch { /* Storage is optional. */ }
const deepWorld = createDeepWorld(scene, camera), board = new Board(6, 6, 260926), boardView = new BoardView(camera), ray = new THREE.Raycaster();
const deepBtn = el<HTMLButtonElement>('deepBtn'), diveBtn = el<HTMLButtonElement>('diveBtn'), cultivateBtn = el<HTMLButtonElement>('cultivateBtn'), clarityEl = el('clarity'), meditateEl = el('meditate'), meditateTitle = meditateEl.querySelector('.title') as HTMLElement, meditateSub = meditateEl.querySelector('.sub') as HTMLElement, deepEl = el('deep'), deepGo = el<HTMLButtonElement>('deepGo');
/** Where she can meditate: in the pool's ring on the summit, before a shrined village's stone (within SHRINE_R), or at a root convergence (within CONV_R). Tuning. */
const SHRINE_R = 2.8, CONV_R = 3.5, DIVE_S = 5;
/** The board on the phone: scaled to BOARD_FIT of its fit and lifted to BOARD_LIFT (camera space) so its bottom rows clear the stick and the fight button and its top the meditation panel. Tuning. */
const BOARD_FIT = 0.82, BOARD_LIFT = 0.05;
type Still = { kind: 'pool' } | { kind: 'shrine'; c: Ctx } | { kind: 'convergence'; place: DeepPlace } | { kind: 'grove'; place: DeepPlace } | { kind: 'ruin'; ruin: Ruin } | { kind: 'moot' };
/** G3b: how near a ruin's basin she stands to sanctify it, or to meditate at the grove. Tuning. */
const RUIN_R = 3.5;
type Miracle = { kind: 'quicken'; site: YieldSite } | { kind: 'purify'; target: PurifyTarget } | { kind: 'spirit'; keeps: SiteKind } | { kind: 'hedge'; x: number; z: number } | { kind: 'dispel'; x: number; z: number } | /** S1: the warren she stands at, quickened for clarity alone (Noah: no prayer). */ { kind: 'warren'; id: string; den: string };
let session: { kind: 'meditate' | 'deepen' | 'channel' | 'sanctify' | 'cultivate' | 'wake'; points: number; at: THREE.Vector3; gained?: number; miracle?: Miracle; ruin?: Ruin } | null = null, deepMove: { curve: THREE.Curve<THREE.Vector3>; t: number; seconds: number; then: () => void } | null = null, deepTo: DeepPlace | null = null;
const shrinedCount = (): number => ctxs.filter(c => isShrined(c.v)).length;
/** The deep roots' ends on the surface: the pool; every shrined village's stone; and a root convergence (the root network's hub nearest it) for every place she knows. */
function deepPlaces(): DeepPlace[] {
  const out: DeepPlace[] = [{ id: 'pool', kind: 'pool', name: 'the crystal pool', x: karst.poolAt.x, z: karst.poolAt.z }];
  for (const c of ctxs) if (isShrined(c.v)) out.push({ id: `shrine:${c.id}`, kind: 'shrine', name: `the stone of ${c.i ? c.short : 'the village'}`, x: c.ox + SITES.shrine.x, z: c.oz + SITES.shrine.z });
  // The convergences (chunkModel): a fairy ring at the hub of every place's chunk; hers to use once she knows the place it serves.
  for (const c of convergences(home.seed)) if (overworld.known.has(c.about)) out.push({ id: c.id, kind: 'convergence', name: c.name, x: c.x, z: c.z });
  // G3b: the groves: every ruin she has sanctified.
  for (const r of groves(overworld)) out.push({ id: `grove:${r.id}`, kind: 'grove', name: `the grove at ${r.name}`, x: r.x, z: r.z });
  return out;
}
const nodeAt = (): THREE.Vector3 => new THREE.Vector3(KARST_AT.x, terrain.height(KARST_AT.x, KARST_AT.z) - nodeDepth(deep), KARST_AT.z);
function stillPlace(): Still | null {
  if (mode !== 'ground') return null; const f = player.feet(); if (karst.atPool(f)) return { kind: 'pool' };
  for (const c of ctxs) if (isShrined(c.v) && Math.hypot(f.x - c.ox - SITES.shrine.x, f.z - c.oz - SITES.shrine.z) <= SHRINE_R) return { kind: 'shrine', c };
  const conv = deepPlaces().find(p => p.kind === 'convergence' && Math.hypot(p.x - f.x, p.z - f.z) <= CONV_R); if (conv) return { kind: 'convergence', place: conv };
  if (!steward.woken && Math.hypot(f.x - mootPlace.x, f.z - mootPlace.z) <= MOOT_R) return { kind: 'moot' };
  const ru = ruins(home.seed).find(r => Math.hypot(r.x - f.x, r.z - f.z) <= RUIN_R); if (!ru) return null; const grove = deepPlaces().find(p => p.id === `grove:${ru.id}`); return grove ? { kind: 'grove', place: grove } : { kind: 'ruin', ruin: ru };
}
function saveDeep(): void { try { localStorage.setItem(DEEP_KEY, serializeDeep(deep)); } catch { /* Storage is optional. */ } }
/** The board: meditation gathers clarity a gem at a time; the deepening puzzle counts gems toward DEEPEN_POINTS. Her camera stays where it was; the board hangs before it. */
function startSession(kind: 'meditate' | 'deepen' | 'channel' | 'sanctify' | 'cultivate' | 'wake', miracle?: Miracle, ruin?: Ruin): boolean {
  if (mode !== 'ground' || boardView.isBusy) return false;
  let at: THREE.Vector3;
  if (kind === 'channel') { if (!miracle || !canChannel(deep)) return false; at = player.feet().clone(); }
  else if (kind === 'sanctify') { if (!ruin || !canChannel(deep) || overworld.sanctified.has(ruin.id)) return false; at = new THREE.Vector3(ruin.x, relief(ruin.x, ruin.z), ruin.z); }
  else if (kind === 'wake') { if (steward.woken || !canChannel(deep) || stillPlace()?.kind !== 'moot') return false; at = new THREE.Vector3(mootPlace.x, relief(mootPlace.x, mootPlace.z), mootPlace.z); }
  else { const st = stillPlace(); if (!st || st.kind === 'ruin' || st.kind === 'moot') return false; if (kind === 'deepen' && !canDeepen(deep, territory())) return false; if (kind === 'cultivate' && (st.kind !== 'pool' || cultivation.tier >= TIER_CAP)) return false; at = st.kind === 'pool' ? karst.poolAt.clone() : st.kind === 'shrine' ? new THREE.Vector3(st.c.ox + SITES.shrine.x, relief(st.c.ox + SITES.shrine.x, st.c.oz + SITES.shrine.z), st.c.oz + SITES.shrine.z) : new THREE.Vector3(st.place.x, relief(st.place.x, st.place.z), st.place.z); }
  session = { kind, points: 0, at, miracle, ruin }; mode = 'meditate'; player.cancelInput(); player.enabled = false; boardView.bind(board); boardView.show(time); meditateEl.hidden = false; meditateTitle.textContent = kind === 'wake' ? 'Waking the one asleep by the chair' : kind === 'channel' ? `Channelling: ${miracleName(miracle!)}` : kind === 'sanctify' ? `Sanctifying ${ruin!.name}` : kind === 'cultivate' ? `Cultivation: toward tier ${cultivation.tier + 1}` : 'Meditation at the still water'; miracles.hidden = true; refreshMeditate(); return true;
}
/** A miracle's name for the panel and the banner. */
function miracleName(m: Miracle): string { if (m.kind === 'warren') return 'quicken the warren'; if (m.kind === 'hedge') return 'grow a thorn hedge'; if (m.kind === 'dispel') return 'dispel the thorn hedge'; return m.kind === 'quicken' ? `quicken ${SITES[m.site].name}` : m.kind === 'spirit' ? `a spirit for ${SITES[m.keeps].name}` : m.target === 'dark' ? 'banish the leavings' : `purify ${SITES[m.target as YieldSite].name}`; }
/** A miracle's prayer. */
const miracleCost = (m: Miracle): number => (m.kind === 'warren' ? 0 : m.kind === 'quicken' ? QUICKEN_COST : m.kind === 'purify' ? PURIFY_COST : m.kind === 'hedge' ? HEDGE_PRAYER : m.kind === 'dispel' ? 0 : spiritCost(village));
/** Dispelling a hedge is hers for nothing and at once: no prayer, no channelling. */
const instant = (m: Miracle): boolean => m.kind === 'dispel';
/** Whether a miracle can be worked now, prayer and place allowing (clarity is the board's business). */
function miracleReady(m: Miracle): boolean { return village.prayer >= miracleCost(m) && (m.kind === 'warren' ? rabbitStock(m.id) < WARREN_CAP : m.kind === 'quicken' ? quickenable(village, m.site) : m.kind === 'purify' ? purifiable(village, m.target) : m.kind === 'hedge' ? hedgeAllowed(village, m.x, m.z) : m.kind === 'dispel' ? !!hedgeNear(village, m.x, m.z) : !!YIELD_OF[m.keeps]); }
/** The channelling done (MIRACLE_GEMS gems of clarity carried into the place): the miracle is worked, and said. */
function workMiracle(m: Miracle): void {
  const ok = m.kind === 'warren' ? (() => { const k = denKnownBy(m.den); return !!k && quickenWarren(k.c.v, m.den); })() : m.kind === 'quicken' ? quicken(village, m.site) : m.kind === 'purify' ? purify(village, m.target) : m.kind === 'hedge' ? growHedge(village, m.x, m.z) : m.kind === 'dispel' ? dispelHedge(village, m.x, m.z) : !!summonSpirit(village, m.keeps);
  bannerEl.textContent = ok ? (m.kind === 'warren' ? 'The warren is quickened: rabbits run everywhere' : `${miracleName(m)[0].toUpperCase()}${miracleName(m).slice(1)}: the prayer is spent and it is done`) : `${miracleName(m)}: it could not be worked`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; if (ok) { chunks.refreshRabbits(); save(); }
}
function endSession(): void { if (mode !== 'meditate' || boardView.isBusy) return; boardView.hide(); boardView.unbind(); player.enabled = true; player.cancelInput(); mode = 'ground'; session = null; meditateEl.hidden = true; saveDeep(); }
function refreshMeditate(): void { if (!session) return; meditateSub.textContent = session.kind === 'wake' ? `${session.points} / ${WAKE_GEMS} gems of clarity into the sleeper · clarity ${Math.floor(deep.clarity)}` : session.kind === 'cultivate' ? `growth ${Math.floor(cultivation.grown)} / ${TIER_POINTS[cultivation.tier + 1]} · tier ${cultivation.tier}, the land allows ${worldTier(worldNow())} · ${TIER_CLARITY} clarity to rise` : session.kind === 'sanctify' ? `${session.points} / ${SANCTIFY_GEMS} gems of clarity into the basin · clarity ${Math.floor(deep.clarity)}` : session.kind === 'channel' ? `${session.points} / ${MIRACLE_GEMS} gems channelled · clarity ${Math.floor(deep.clarity)} · ${miracleCost(session.miracle!)} prayer when it is done` : session.kind === 'deepen' ? `the puzzle: ${session.points} / ${DEEPEN_POINTS} gems, then the node deepens for ${DEEPEN_COST} clarity` : deep.clarity >= CLARITY_CAP ? 'clarity is full' : `${session.gained ? `+${session.gained} clarity · ` : ''}tap neighbouring gems: each run is clarity · ${DIVE_COST} to dive, ${RETURN_COST} to return`; }
player.onTap = (x, y) => { if (mode !== 'meditate' && mode !== 'deep') return; ray.setFromCamera(new THREE.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), camera); if (mode === 'meditate') boardView.tap(ray); else { const id = deepWorld.pointAt(ray); if (id && deepLabels.get(id)?.reach) launchTo(id); } };
boardView.onRun = run => { if (!session) return; if (session.kind === 'meditate') { const g = gather(deep, run.cells.length); session.gained = (session.gained ?? 0) + g; } else if (session.kind === 'cultivate') { grow(cultivation, run.cells.length); saveCultivation(); if (grownEnough(cultivation)) { const w = worldNow(); refreshMeditate(); endSession();
      if (raise(cultivation, w, deep)) { saveCultivation(); saveDeep(); deep.bonus = reachBonus(powerNow()); bannerEl.textContent = `She is raised to tier ${cultivation.tier}: the deep roots reach ${deepReach({ ...deep, bonus: reachBonus(powerNow()) })} m, her sight ${Math.round(viewScale(powerNow()) * 100)}%`; }
      else bannerEl.textContent = `The karst will not raise her yet: ${lacking(w, cultivation.tier + 1)}`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 2000; return; } } else if (session.kind === 'wake') { session.points += channel(deep, run.cells.length); if (session.points >= WAKE_GEMS) { refreshMeditate(); endSession(); saveDeep(); wakeSteward(); return; } if (deep.clarity < 1) { refreshMeditate(); saveDeep(); endSession(); say('her clarity is spent before he wakes', 4); return; } } else if (session.kind === 'sanctify') { session.points += channel(deep, run.cells.length); if (session.points >= SANCTIFY_GEMS) { const r = session.ruin!; refreshMeditate(); endSession(); if (sanctify(overworld, r.id)) { chunks.setSanctified(overworld.sanctified); deep.clarity = CLARITY_CAP; save(); saveDeep(); bannerEl.textContent = `${r.name[0].toUpperCase()}${r.name.slice(1)} is a grove now: ${r.lore}`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 2000; } return; } if (deep.clarity < 1) { refreshMeditate(); saveDeep(); endSession(); say('her clarity is spent before the basin fills', 4); return; } } else if (session.kind === 'channel') { session.points += channel(deep, run.cells.length); if (session.points >= MIRACLE_GEMS) { const m = session.miracle!; refreshMeditate(); saveDeep(); endSession(); workMiracle(m); return; } if (deep.clarity < 1 && session.points < MIRACLE_GEMS) { refreshMeditate(); saveDeep(); endSession(); say('her clarity is spent before the channelling is done', 4); return; } } else { session.points += run.cells.length; if (session.points >= DEEPEN_POINTS && deepen(deep, territory())) { bannerEl.textContent = `The node deepens: the deep roots reach ${deepReach(deep)} m`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; session.points = 0; } } refreshMeditate(); saveDeep(); };
el('meditateDone').addEventListener('click', endSession);
/** Down the taproot from the pool (DIVE_S seconds), or back down a deep root from a shrine or a convergence, to the node. */
function startDive(): boolean {
  const st = stillPlace(); if (!st || loaded()) return false;
  if (st.kind === 'pool') { if (!dive(deep)) return false; } else if (!returnDeep(deep)) return false;
  saveDeep(); const n = nodeAt(), f = player.feet().clone(); lock(); mode = 'dive'; grass = null; root = null; trunk = null; crown = null; closePortal();
  const curve: THREE.Curve<THREE.Vector3> = st.kind === 'pool' ? new THREE.LineCurve3(f.clone().setY(f.y - 0.3), n) : new THREE.QuadraticBezierCurve3(f.clone().setY(f.y - 0.3), new THREE.Vector3((f.x + n.x) / 2, n.y + (f.y - n.y) * 0.25, (f.z + n.z) / 2), n);
  deepWorld.show(true); deepWorld.showDrop(false); deepWorld.setBore(curve); deepWorld.setNode(n); deepWorld.rush(true); deepMove = { curve, t: 0, seconds: st.kind === 'pool' ? DIVE_S : launchSeconds(deep, KARST_AT, f), then: arriveNode }; say(st.kind === 'pool' ? 'she dives' : 'the roots take her down', 3); return true;
}
function arriveNode(): void { deepMove = null; mode = 'deep'; deepWorld.rush(false); const n = nodeAt(); place(n); player.pitch = 1.1; player.cancelInput(); openDeep(); }
/** At the node (Noah): the inside of a spherical waterdrop, every place a point of light on its skin where the deep root to it would break the surface (the zenith above her, the horizon round her, east and west swapped as seen from below); the places she knows but cannot reach faint. Turn to look; a light near the middle of the view gets its name, the one under the aim gets the button. */
const deepLabels = new Map<string, { el: HTMLElement; place: DeepPlace | null; reach: boolean }>();
let deepAimed: string | null = null;
function openDeep(): void {
  deepEl.hidden = false; deepGo.hidden = true; deepAimed = null; closeDeepLabels();
  const places = deepPlaces(), reach = new Set(reachable(deep, KARST_AT, places).map(p => p.id)), list: { id: string; dir: THREE.Vector3; colour: string; size: number; reachable: boolean; faint?: boolean }[] = [];
  const dirOf = (p: { x: number; z: number }): THREE.Vector3 => { const d = deepDirection(deep, KARST_AT, p); return new THREE.Vector3(d.x, d.y, d.z); };
  for (const p of places) { const ok = reach.has(p.id); list.push({ id: p.id, dir: dirOf(p), colour: p.kind === 'pool' ? '#d8f07a' : p.kind === 'shrine' ? '#e8dcff' : p.kind === 'grove' ? '#c8f0a0' : '#cfeeff', size: p.kind === 'pool' ? 0.9 : 0.7, reachable: ok }); const e = document.createElement('div'); e.className = 'name deep'; e.hidden = true; labels.append(e); deepLabels.set(p.id, { el: e, place: p, reach: ok }); }
  for (const p of knownPlaces(overworld)) { if (p.kind === 'karst' || places.some(q => q.id === `conv:${p.id}`)) continue; list.push({ id: `faint:${p.id}`, dir: dirOf(p), colour: p.kind === 'village' ? villageColour(p.id) : p.id === 'lair' ? '#c070c0' : p.kind === 'warren' ? '#d8b890' : '#c8b8a0', size: 0.4, reachable: false, faint: true }); }
  deepWorld.clearBore(); deepWorld.setPoints(list); deepWorld.setReach(reachAngle(deep)); deepWorld.showDrop(true); deepKey = places.map(p => p.id).join('|') + '#' + deepReach(deep);
}
function closeDeepLabels(): void { for (const l of deepLabels.values()) l.el.remove(); deepLabels.clear(); }
function closeDeep(): void { deepEl.hidden = true; deepGo.hidden = true; deepAimed = null; deepKey = ''; closeDeepLabels(); }
/** The lights' names, each frame at the node: a name within TAG_ANGLE of the view's middle, the nearest first, none over another (TAG_GAP px); the one within AIM_ANGLE of the aim is the aimed. Tuning. */
const TAG_ANGLE = 0.55, AIM_ANGLE = 0.16, TAG_GAP = 64;
let deepKey = '';
function presentDeep(): void {
  // The lights follow the world: a village shrined or a place found while she is at the node lights up (the set of ends is compared each frame; it is short).
  { const key = deepPlaces().map(p => p.id).join('|') + '#' + deepReach(deep); if (key !== deepKey) { deepKey = key; openDeep(); } }
  camera.updateMatrixWorld(); const fwd = player.forward(), shown: { x: number; y: number }[] = []; let best: { id: string; angle: number } | null = null;
  const order = [...deepLabels.entries()].map(([id, l]) => { if (!deepWorld.spritePosition(id, tmp)) return { id, l, angle: Infinity, x: 0, y: 0 }; const to = tmp.clone().sub(camera.position).normalize(), angle = Math.acos(Math.max(-1, Math.min(1, to.dot(fwd)))); tmp.project(camera); return { id, l, angle, x: (tmp.x + 1) * innerWidth / 2, y: (1 - tmp.y) * innerHeight / 2 }; }).sort((a, b) => a.angle - b.angle);
  for (const o of order) { const ok = o.angle < TAG_ANGLE && !shown.some(q => Math.hypot(q.x - o.x, q.y - o.y) < TAG_GAP); o.l.el.hidden = !ok; if (!ok) continue; shown.push({ x: o.x, y: o.y }); const aimed = o.l.reach && o.angle < AIM_ANGLE && (!best || o.angle < best.angle); if (aimed) best = { id: o.id, angle: o.angle }; o.l.el.classList.toggle('aimed', aimed); o.l.el.innerHTML = `${o.l.place!.name}<i>${o.l.reach ? (o.l.place!.kind === 'pool' ? 'up' : `${Math.round(Math.hypot(o.l.place!.x - KARST_AT.x, o.l.place!.z - KARST_AT.z))} m`) : 'beyond reach'}</i>`; o.l.el.style.transform = `translate(${o.x}px,${o.y - 14}px) translate(-50%,-100%)`; }
  deepAimed = best?.id ?? null; deepGo.hidden = !deepAimed; if (deepAimed) deepGo.textContent = `take the root to ${deepLabels.get(deepAimed)!.place!.name}`;
}
deepGo.addEventListener('click', () => { if (deepAimed) launchTo(deepAimed); });
/** Along a deep root to a chosen end: up and out of the ground there. */
function launchTo(id: string): boolean {
  if (mode !== 'deep') return false; const p = reachable(deep, KARST_AT, deepPlaces()).find(q => q.id === id); if (!p) return false;
  launchDeep(deep); saveDeep(); closeDeep(); const n = nodeAt(), end = new THREE.Vector3(p.x, (p.kind === 'pool' ? karst.poolAt.y : relief(p.x, p.z)) - 0.3, p.z), curve = p.kind === 'pool' ? new THREE.LineCurve3(n.clone(), end) : new THREE.QuadraticBezierCurve3(n.clone(), new THREE.Vector3((n.x + p.x) / 2, n.y + (end.y - n.y) * 0.25, (n.z + p.z) / 2), end);
  deepWorld.showDrop(false); deepWorld.setBore(curve, 1.2); deepWorld.rush(true); deepTo = p; mode = 'launch'; deepMove = { curve, t: 0, seconds: p.kind === 'pool' ? DIVE_S : launchSeconds(deep, KARST_AT, p), then: () => arriveAt(p) }; return true;
}
function arriveAt(p: DeepPlace): void {
  deepMove = null; deepTo = null; deepWorld.show(false); deepWorld.rush(false);
  if (p.kind === 'pool') { karst.standOn('summit', -1.3, 0.5, Math.atan2(1.3, -0.5)); mode = 'ground'; } else { const a = Math.atan2(p.z - KARST_AT.z, p.x - KARST_AT.x); let gx = p.x, gz = p.z; if (!standable(gx, gz)) { for (let r = 0.8; r <= 4 && !standable(gx, gz); r += 0.8) for (let k = 0; k < 12; k++) { const b = k / 12 * Math.PI * 2, x = p.x + Math.cos(b) * r, z = p.z + Math.sin(b) * r; if (standable(x, z)) { gx = x; gz = z; break; } } } standOn(gx, gz, Math.atan2(-Math.cos(a), -Math.sin(a))); }
  player.pitch = 0.08; say(`she rises at ${p.name}`, 4); chunks.update(player.feet().x, player.feet().z); explore(overworld, player.feet().x, player.feet().z);
}
cultivateBtn.addEventListener('click', () => { startSession('cultivate'); });
deepBtn.addEventListener('click', () => { const st = stillPlace(); if (st?.kind === 'moot') { startSession('wake'); return; } if (st?.kind === 'ruin') { startSession('sanctify', undefined, st.ruin); return; } startSession(canDeepen(deep, territory()) && st?.kind === 'pool' && deep.clarity >= CLARITY_CAP - 1 ? 'deepen' : 'meditate'); });
diveBtn.addEventListener('click', () => { startDive(); });
/** Told once when a village's lifetime prayer reaches the shrine's threshold. */
const shrinedTold = new Set<string>(ctxs.filter(c => isShrined(c.v)).map(c => c.id));
/** The deepening's territory: the shrined villages and the sanctified groves (Noah's second brief: purified villages, and downstream the sanctified groves). */
const territory = (): number => shrinedCount() + groves(overworld).length;
function tellShrines(): void { for (const c of ctxs) { const now = isShrined(c.v); if (now && !shrinedTold.has(c.id)) { shrinedTold.add(c.id); if (c === ctx || overworld.known.has(c.id)) { bannerEl.textContent = `${c.i ? c.name : 'The village'} is shrined to her: the deep roots reach its stone`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; } } else if (!now) shrinedTold.delete(c.id); } }
/** The buttons and the readout, each frame: what a still place offers. */
function deepButtons(): void {
  const st = stillPlace();
  deepBtn.hidden = !st; diveBtn.hidden = !st || st.kind === 'ruin' || st.kind === 'moot' || (st.kind === 'pool' ? !canDive(deep) : !canReturn(deep)) || loaded(); cultivateBtn.hidden = !st || st.kind !== 'pool' || cultivation.tier >= TIER_CAP; cultivateBtn.textContent = grownEnough(cultivation) ? (canRaise(cultivation, worldNow(), deep.clarity) ? 'rise' : 'cultivate') : 'cultivate';
  if (st) { deepBtn.textContent = st.kind === 'moot' ? 'wake' : st.kind === 'ruin' ? 'sanctify' : st.kind === 'pool' && canDeepen(deep, territory()) ? 'deepen' : 'meditate'; deepBtn.disabled = (st.kind === 'ruin' || st.kind === 'moot') && !canChannel(deep); diveBtn.textContent = st.kind === 'pool' ? 'dive' : 'return'; }
  // Noah: clarity is a stat she always sees; it speeds her abilities' return.
  clarityEl.hidden = mode === 'deep' || mode === 'launch' || mode === 'dive'; deep.bonus = reachBonus(powerNow()); clarityEl.textContent = `clarity ${Math.floor(deep.clarity)} / ${CLARITY_CAP} · regen ×${regenRate(village.hero, deep.clarity / CLARITY_CAP).toFixed(2)} · tier ${powerNow()}${cultivation.tier !== worldTier(worldNow()) ? ` (grown ${cultivation.tier}, the land ${worldTier(worldNow())})` : ''}${deep.depth ? ` · node ${deep.depth} deep` : ''}`;
}
/** The dive and the launch: along the bore at an even pace, eased at both ends, first person along the tangent. */
function deepFrame(sim: number): void {
  if (!deepMove) return; const m = deepMove; m.t = Math.min(1, m.t + sim / m.seconds); const k = m.t < 0.12 ? m.t * m.t / 0.12 * (1 / 0.12) * 0.12 : m.t > 0.88 ? 1 - (1 - m.t) * (1 - m.t) / 0.12 : m.t;
  const p = m.curve.getPointAt(Math.min(1, Math.max(0, k))), tan = m.curve.getTangentAt(Math.min(1, Math.max(0, k))); place(p); camera.position.copy(p); camera.lookAt(p.clone().add(tan)); player.yaw = Math.atan2(-tan.x, -tan.z);
  if (m.t >= 1) { const then = m.then; deepMove = null; then(); }
}
// The pinch (M1): two fingers on the screen pull the camera from her shoulder to overhead, continuously (ZOOM_MIN to ZOOM_MAX m, the elevation rising with the distance); pinching on past the end opens the explored overworld; a spread, or its button, closes it. While two fingers are down the look drag is held off.
let zoom = ZOOM_MIN, pinchFrom = 0, pinchZoom = ZOOM_MIN, exploreClock = 0; const pinchPointers = new Map<number, { x: number; y: number }>();
const mapEl = el<HTMLCanvasElement>('map'), mapWrap = el('mapwrap'), mapCtx = mapEl.getContext('2d')!;
let mapOpen = false, mapPan = { x: 0, z: 0 }, mapDrag: { id: number; x: number; y: number } | null = null;
const MAP_SCALE = 0.6; // px per m
function openMap(open: boolean): void { mapOpen = open; mapWrap.hidden = !open; if (open) { const f = player.feet(); mapPan = { x: f.x, z: f.z }; drawMap(); } }
function pinchDistance(): number { const [a, b] = [...pinchPointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); }
const canvasEl = renderer.domElement;
// Every finger on the canvas is captured, so its release reaches the canvas wherever it lifts (over a button, off the screen); a finger whose release never came would otherwise haunt the count and make one finger a pinch.
canvasEl.addEventListener('pointerdown', e => { pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { canvasEl.setPointerCapture(e.pointerId); } catch { /* Synthetic tests. */ } if (pinchPointers.size === 2) { pinchFrom = pinchDistance(); pinchZoom = zoom; } else if (pinchPointers.size > 2) { pinchPointers.clear(); pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); pinchFrom = 0; } }, true);
for (const ev of ['lostpointercapture', 'pointerleave'] as const) canvasEl.addEventListener(ev, e => { pinchPointers.delete(e.pointerId); if (pinchPointers.size < 2) pinchFrom = 0; }, true);
document.addEventListener('visibilitychange', () => { pinchPointers.clear(); pinchFrom = 0; });
canvasEl.addEventListener('pointermove', e => { const p = pinchPointers.get(e.pointerId); if (!p) return; p.x = e.clientX; p.y = e.clientY; if (pinchPointers.size === 2 && pinchFrom > 0) { e.stopImmediatePropagation(); const ratio = pinchFrom / Math.max(1, pinchDistance()); zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, pinchZoom * ratio)); if (pinchZoom >= ZOOM_MAX - 0.01 && ratio > 1.15 && !mapOpen) { openMap(true); pinchFrom = 0; } } }, true);
for (const ev of ['pointerup', 'pointercancel'] as const) canvasEl.addEventListener(ev, e => { pinchPointers.delete(e.pointerId); if (pinchPointers.size < 2) pinchFrom = 0; }, true);
let mapTap: { id: number; x: number; y: number; t: number } | null = null;
mapWrap.addEventListener('pointerdown', e => { pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pinchPointers.size === 2) { pinchFrom = pinchDistance(); mapTap = null; } else { mapDrag = { id: e.pointerId, x: e.clientX, y: e.clientY }; mapTap = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() }; } });
mapWrap.addEventListener('pointermove', e => { const p = pinchPointers.get(e.pointerId); if (p) { p.x = e.clientX; p.y = e.clientY; } if (pinchPointers.size === 2 && pinchFrom > 0) { if (pinchDistance() / pinchFrom > 1.2) { openMap(false); pinchFrom = 0; } return; } if (mapDrag && mapDrag.id === e.pointerId) { mapPan.x -= (e.clientX - mapDrag.x) / MAP_SCALE; mapPan.z -= (e.clientY - mapDrag.y) / MAP_SCALE; mapDrag = { id: e.pointerId, x: e.clientX, y: e.clientY }; drawMap(); } });
for (const ev of ['pointerup', 'pointercancel'] as const) mapWrap.addEventListener(ev, e => { pinchPointers.delete(e.pointerId); if (pinchPointers.size < 2) pinchFrom = 0; if (mapDrag?.id === e.pointerId) mapDrag = null; if (ev === 'pointerup' && mapTap?.id === e.pointerId && Math.hypot(e.clientX - mapTap.x, e.clientY - mapTap.y) < 8 && performance.now() - mapTap.t < 400 && (e.target as HTMLElement).tagName !== 'BUTTON') mapTapAt(e.clientX, e.clientY); mapTap = null; });
/** A tap on the map: on the course's mark it is forgotten, anywhere else a course is plotted there. */
function mapTapAt(clientX: number, clientY: number): void {
  const x = mapPan.x + (clientX - innerWidth / 2) / MAP_SCALE, z = mapPan.z + (clientY - innerHeight / 2) / MAP_SCALE;
  if (courseTarget && Math.hypot(courseTarget.x - x, courseTarget.z - z) * MAP_SCALE < 16) { clearCourse(); return; }
  plotCourse({ x, z });
}
el('mapclose').addEventListener('click', () => openMap(false));
/** The map: what she has explored (cells), the places she knows, her own mark, north up. */
function drawMap(): void { const w = mapEl.width = innerWidth * devicePixelRatio, h = mapEl.height = innerHeight * devicePixelRatio; renderMap(mapCtx, w, h, MAP_SCALE * devicePixelRatio, mapPan, true); }
/** The map drawn on a canvas: the full map (north mark, scale bar) or (Noah) the live minimap under the compass, centred on her at MINI_SCALE, with the same marks. */
function renderMap(c: CanvasRenderingContext2D, w: number, h: number, s: number, pan: { x: number; z: number }, full: boolean): void {
  const sx = (x: number) => w / 2 + (x - pan.x) * s, sz = (z: number) => h / 2 + (z - pan.z) * s;
  c.fillStyle = full ? '#101a16' : '#101a16cc'; c.fillRect(0, 0, w, h);
  const cs = CELL * s; c.fillStyle = '#3e5a3a';
  for (const key of overworld.revealed) { const [cx, cz] = key.split(',').map(Number); const x = sx(cx * CELL), y = sz(cz * CELL); if (x > -cs && x < w + cs && y > -cs && y < h + cs) { const mx = (cx + 0.5) * CELL, mz = (cz + 0.5) * CELL; const b = islands(overworld.seed).some(o => Math.hypot(mx - o.x, mz - o.z) < 46) ? 'meadow' : biomeAt(mx, mz, overworld.seed); c.fillStyle = b === 'meadow' ? '#5b7a48' : b === 'wood' ? '#3e5a3a' : '#3a2a44'; c.fillRect(x, y, cs + 1, cs + 1); } }
  c.font = `${(full ? 12 : 10) * devicePixelRatio}px system-ui`; c.textAlign = 'center';
  // G2: what the villagers said of places she has not found, as fans from the green along the bearing they gave.
  for (const hnt of overworld.hints) { const a = (hnt.bearing - 90) * Math.PI / 180, r = HINT_REACH * s, sp = HINT_SPREAD * Math.PI / 180, o = hintFrom(hnt), fx = sx(o.x), fz = sz(o.z); c.fillStyle = '#e0a0f02a'; c.strokeStyle = '#e0a0f0'; c.lineWidth = 1 * devicePixelRatio; c.setLineDash([4 * devicePixelRatio, 4 * devicePixelRatio]); c.beginPath(); c.moveTo(fx, fz); c.arc(fx, fz, r, a - sp, a + sp); c.closePath(); c.fill(); c.stroke(); c.setLineDash([]); c.fillStyle = '#e0a0f0'; c.textAlign = 'center'; const [what, way] = hnt.text.split(/ to the (?=[a-z-]+$)/), tx = fx + Math.cos(a) * r * 0.4, ty = fz + Math.sin(a) * r * 0.4; c.fillText(what, tx, ty); if (way) c.fillText(`to the ${way}`, tx, ty + 14 * devicePixelRatio); }
  for (const p of knownPlaces(overworld)) { const x = sx(p.x), y = sz(p.z); c.strokeStyle = p.id === 'lair' ? '#c070c0' : p.kind === 'village' ? villageColour(p.id) : p.kind === 'den' ? '#c8b8a0' : p.kind === 'ruin' ? (overworld.sanctified.has(p.id) ? '#d8f07a' : '#b8c0a8') : p.kind === 'warren' ? '#d8b890' : p.kind === 'moot' ? '#e8d088' : '#f1edcf'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); if (p.kind === 'village') c.arc(x, y, 7 * devicePixelRatio, 0, Math.PI * 2); else if (p.kind === 'ruin') { const r = 6 * devicePixelRatio; c.moveTo(x, y - r); c.lineTo(x + r, y); c.lineTo(x, y + r); c.lineTo(x - r, y); c.closePath(); } else if (p.kind === 'den') { c.fillStyle = '#c8b8a0'; c.arc(x, y, 5 * devicePixelRatio, 0, Math.PI * 2); c.fill(); } else if (p.kind === 'warren') { c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); } else if (p.kind === 'moot') { const r = 5 * devicePixelRatio; c.rect(x - r, y - r, r * 2, r * 2); } else if (p.id === 'karst') { c.moveTo(x, y - 9 * devicePixelRatio); c.lineTo(x + 8 * devicePixelRatio, y + 7 * devicePixelRatio); c.lineTo(x - 8 * devicePixelRatio, y + 7 * devicePixelRatio); c.closePath(); } else { c.moveTo(x - 7 * devicePixelRatio, y - 7 * devicePixelRatio); c.lineTo(x + 7 * devicePixelRatio, y + 7 * devicePixelRatio); c.moveTo(x + 7 * devicePixelRatio, y - 7 * devicePixelRatio); c.lineTo(x - 7 * devicePixelRatio, y + 7 * devicePixelRatio); } c.stroke(); c.fillStyle = c.strokeStyle; c.fillText(p.name, x, y + 24 * devicePixelRatio); }
  // G4: the fairy rings she can use, as small pale rings.
  for (const p of deepPlaces()) if (p.kind === 'convergence') { const x = sx(p.x), y = sz(p.z); c.strokeStyle = '#cfeeff'; c.lineWidth = 1.5 * devicePixelRatio; c.beginPath(); c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); }
  // Incidents: a red mark where it happened, with what it was.
  for (const inc of allIncidents()) { const x = sx(inc.x), y = sz(inc.z); c.fillStyle = INCIDENT_FOE; c.strokeStyle = INCIDENT_FOE; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(x, y, 9 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); c.fillStyle = INCIDENT_VICTIM; c.textAlign = 'center'; c.fillText(inc.text, x, y - 14 * devicePixelRatio); }
  if (course) { c.strokeStyle = '#f0d060'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); for (const r of course.roots) for (let i = 0; i < r.samples.length; i++) { const p = r.samples[i]; if (i === 0) c.moveTo(sx(p.x), sz(p.z)); else c.lineTo(sx(p.x), sz(p.z)); } c.stroke(); const e = network.nodeAt(course.entry); if (e) { c.beginPath(); c.arc(sx(e.x), sz(e.z), 5 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); } }
  if (courseTarget) { const x = sx(courseTarget.x), y = sz(courseTarget.z), d = 7 * devicePixelRatio; c.strokeStyle = '#f0d060'; c.fillStyle = '#f0d060'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); c.moveTo(x, y - d); c.lineTo(x + d, y); c.lineTo(x, y + d); c.lineTo(x - d, y); c.closePath(); c.stroke(); c.textAlign = 'center'; c.fillText(course ? `the way · ${Math.round(course.length)} m` : 'no way', x, y + 22 * devicePixelRatio); }
  const f = player.feet(), x = sx(f.x), y = sz(f.z); c.fillStyle = '#d8f07a'; c.beginPath(); c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#d8f07a'; c.beginPath(); c.moveTo(x, y); c.lineTo(x - Math.sin(player.yaw) * 14 * devicePixelRatio, y - Math.cos(player.yaw) * 14 * devicePixelRatio); c.stroke();
  // D4: the blight on the map, once the lair is known.
  { const blight = home_().v.blight; if (blight > 0 && knownPlaces(overworld).some(p => p.id === 'lair')) { c.fillStyle = '#3a104060'; c.strokeStyle = '#a050b0'; c.lineWidth = 1.5 * devicePixelRatio; c.beginPath(); c.arc(sx(lairPlace.x), sz(lairPlace.z), blight * s, 0, Math.PI * 2); c.fill(); c.stroke(); } }
  if (!full) { c.fillStyle = '#f1edcf'; c.textAlign = 'left'; c.fillText('N', 8 * devicePixelRatio, 14 * devicePixelRatio); c.fillRect(8 * devicePixelRatio, h - 10 * devicePixelRatio, 50 * s, 2 * devicePixelRatio); c.fillText('50 m', 8 * devicePixelRatio, h - 14 * devicePixelRatio); return; }
  c.fillStyle = '#f1edcf'; c.textAlign = 'left'; c.fillText('N', 14 * devicePixelRatio, 26 * devicePixelRatio + (window.visualViewport?.offsetTop ?? 0)); c.fillRect(14 * devicePixelRatio, h - 30 * devicePixelRatio, 100 * s, 2 * devicePixelRatio); c.fillText('100 m', 14 * devicePixelRatio, h - 36 * devicePixelRatio);
}
// The compass (Noah: a Skyrim-style strip): a band across the top that slides with her heading, the cardinal points and ticks, and the known places as marks with their distance, within COMPASS_FOV either side of where she faces. Bearings are the overworld's (north is the karst's way, negative z).
const compassEl = el<HTMLCanvasElement>('compass'), compassCtx = compassEl.getContext('2d')!, COMPASS_FOV = 100;
/** G2: the village's state as a colour, on its mark and its compass tick. */
const STATE_COLOUR: Record<StateKind, string> = { thriving: '#8fc45a', steady: '#f1edcf', pressured: '#f0c060', besieged: '#e06060', lost: '#888888' };
/** A village's mark by its state (G4: each village its own). */
const villageColour = (id: string): string => { const c = ctxs.find(c => c.id === id); return c ? STATE_COLOUR[villageState(c.v).kind] : '#f1edcf'; };
function drawCompass(): void {
  const dpr = devicePixelRatio, w = compassEl.width = compassEl.clientWidth * dpr, h = compassEl.height = compassEl.clientHeight * dpr, c = compassCtx, f = player.feet();
  const heading = bearingOf(-Math.sin(player.yaw), -Math.cos(player.yaw)), xOf = (b: number): number => w / 2 + wrapDeg(b - heading) / COMPASS_FOV * (w / 2);
  c.clearRect(0, 0, w, h); c.fillStyle = '#0b191866'; c.fillRect(0, 0, w, h);
  c.font = `${11 * dpr}px system-ui`; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let b = 0; b < 360; b += 15) { const x = xOf(b); if (x < 0 || x > w) continue; const major = b % 90 === 0; c.fillStyle = major ? '#f1edcf' : '#f1edcf88'; if (major) c.fillText(['N', 'E', 'S', 'W'][b / 90], x, h * 0.42); else c.fillRect(x - dpr / 2, h * 0.3, dpr, h * 0.25); }
  const marks: { x: number; z: number; colour: string; faint?: boolean }[] = knownPlaces(overworld).map(p => ({ x: p.x, z: p.z, colour: p.id === 'lair' ? '#e0a0f0' : p.kind === 'village' ? villageColour(p.id) : p.kind === 'den' ? '#c8b8a0' : p.kind === 'ruin' ? (overworld.sanctified.has(p.id) ? '#d8f07a' : '#b8c0a8') : p.kind === 'warren' ? '#d8b890' : p.kind === 'moot' ? '#e8d088' : '#d8f07a' })); if (courseTarget) marks.push({ ...courseTarget, colour: '#f0d060' });
  // G2: a hint's mark stands where the fan's middle would be, faint, with no distance: they said which way, not how far.
  for (const hnt of overworld.hints) { const a = hnt.bearing * Math.PI / 180, o = hintFrom(hnt); marks.push({ x: o.x + Math.sin(a) * HINT_REACH * 0.6, z: o.z - Math.cos(a) * HINT_REACH * 0.6, colour: '#e0a0f088', faint: true }); }
  for (const inc of allIncidents()) marks.push({ x: inc.x, z: inc.z, colour: INCIDENT_FOE });
  for (const p of marks) { const b = bearingOf(p.x - f.x, p.z - f.z), x = xOf(b); if (x < 4 * dpr || x > w - 4 * dpr) continue; const d = Math.hypot(p.x - f.x, p.z - f.z); c.fillStyle = p.colour; c.beginPath(); c.moveTo(x, h * 0.62); c.lineTo(x - 4 * dpr, h * 0.78); c.lineTo(x + 4 * dpr, h * 0.78); c.closePath(); c.fill(); c.font = `${9 * dpr}px system-ui`; c.fillText(p.faint ? '?' : d < 1000 ? `${Math.round(d)} m` : `${(d / 1000).toFixed(1)} km`, x, h * 0.9); c.font = `${11 * dpr}px system-ui`; }
  c.fillStyle = '#f1edcf'; c.fillRect(w / 2 - dpr, 0, 2 * dpr, h * 0.22);
}
// The minimap (Noah: the compass muddles as destinations accumulate, and reaching the map by zooming out loses the camera): a tap on the compass widens it and opens a live map under it, centred on her, north up, the game's controls untouched (it takes no touches); "close" folds it back, "detail" opens the full map. MINI_SCALE px/m, MINI_HZ redraws a second: tuning.
const MINI_SCALE = 1.5, MINI_HZ = 8, miniEl = el<HTMLCanvasElement>('minimapCanvas'), miniWrap = el('minimap'), miniCtx = miniEl.getContext('2d')!; let miniOpen = false, miniClock = 0;
function openMini(open: boolean): void { miniOpen = open; miniWrap.hidden = !open; compassEl.classList.toggle('wide', open); if (open) drawMini(); }
function drawMini(): void { const w = miniEl.width = miniEl.clientWidth * devicePixelRatio, h = miniEl.height = miniEl.clientHeight * devicePixelRatio, f = player.feet(); renderMap(miniCtx, w, h, MINI_SCALE * devicePixelRatio, { x: f.x, z: f.z }, false); }
compassEl.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); openMini(!miniOpen); });
el('minimapClose').addEventListener('click', () => openMini(false));
el('minimapDetail').addEventListener('click', () => { openMini(false); openMap(true); });
// The village's state at a glance (Noah: too hard to read off the villagers): a panel under the bars while she is within VILLAGE_INFO_M of the green, refreshed twice a second. Tuning.
// G4 (Noah): the panel collapses to its first row (the village's name and state) for screen space; the choice is kept.
const VILLAGE_INFO_M = 75, infoEl = el('village'), infoRows = el('villageRows'), infoToggle = el<HTMLButtonElement>('villageToggle'), PANEL_KEY = 'rootwake-village-panel'; let infoClock = 0;
function setPanelOpen(open: boolean): void { infoEl.classList.toggle('closed', !open); infoToggle.setAttribute('aria-expanded', String(open)); infoToggle.textContent = open ? '−' : '+'; try { localStorage.setItem(PANEL_KEY, open ? 'open' : 'closed'); } catch { /* Storage is optional. */ } }
try { setPanelOpen(localStorage.getItem(PANEL_KEY) !== 'closed'); } catch { setPanelOpen(true); }
infoToggle.addEventListener('click', () => setPanelOpen(infoEl.classList.contains('closed')));
// S2: a tap on a villager's duty on the board gives or takes the watch (only where the steward stands).
infoRows.addEventListener('pointerdown', e => { const b = (e.target as HTMLElement).closest('[data-duty]') as HTMLElement | null; if (!b || steward.at !== ctx.id) return; e.preventDefault(); const s = village.hobbits.find(x => x.id === b.dataset.duty); if (!s) return; if (!assignDuty(village, s.id, s.duty === 'guard' ? null : 'guard')) say(`the watch is full: ${GUARDS_MAX} at most`, 3); save(); infoClock = 1; });
function villageInfo(dt: number): void {
  const f = player.feet(), near = Math.hypot(f.x - ctx.ox - GREEN.x, f.z - ctx.oz - GREEN.z) <= VILLAGE_INFO_M && !mapOpen && !miniOpen && !inDeep(mode); infoEl.hidden = !near; if (!near) return;
  infoClock += dt; if (infoClock < 0.5 && infoRows.textContent) return; infoClock = 0;
  const h = village.hobbits, grown = h.filter(s => s.stage === 'grown').length, children = h.filter(s => s.stage === 'child').length, infants = h.filter(s => s.stage === 'infant').length;
  const hungry = h.filter(s => s.stage !== 'infant' && s.hunger > 0.85 && s.missed < REST_MEALS).length, starving = h.filter(s => s.missed >= REST_MEALS).length;
  const st = village.stores, food = Math.floor(st.berries + st.milk + st.grain), foodCap = STORES.berries.cap + STORES.milk.cap + STORES.grain.cap;
  const spoiled = YIELD_SITES.filter(k => isSpoiled(village, k)).map(k => SITES[k].name.replace('the ', ''));
  const l = village.land, ripe = l.crops.filter(x => x >= 1).length;
  const vs = villageState(village);
  const rows = [
    `${ctx.i ? `${ctx.short} · ` : ''}<b style="color:${STATE_COLOUR[vs.kind]}">${vs.kind}</b>${vs.needs.length ? ` · needs: ${vs.needs.join(', ')}` : ''}`,
    `<b>${h.length}</b> in the village · ${grown} grown${children ? ` · ${children} child${children > 1 ? 'ren' : ''}` : ''}${infants ? ` · ${infants} infant${infants > 1 ? 's' : ''}` : ''}${village.dead.length ? ` · ${village.dead.length} dead` : ''}`,
    `food <b>${food}</b>/${foodCap} · water ${Math.floor(st.water)} · wood ${Math.floor(st.wood)}${st.dark >= 1 ? ` · <i>leavings ${Math.floor(st.dark)}</i>` : ''}`,
    `land: berries ${Math.floor(l.berries)}/${BERRY_CAP} · branches ${l.branches}/${BRANCH_CAP} · milk ${l.milk}/${MILK_PER_DAY} · ripe strips ${ripe}/${CROP_STRIPS}${spoiled.length ? ` · <i>spoiled: ${spoiled.join(', ')}</i>` : ''}`,
    `${hungry ? `<i>${hungry} hungry</i> · ` : ''}${starving ? `<i>${starving} starving</i> · ` : ''}fed ${village.wellFedDays}/${BIRTH_DAYS} days to a birth · spirits ${village.spirits.length}`,
    // G4 (Noah): the lifetime prayer given at the stone, which shrines the village at SHRINE_PRAYER, beside the pool she spends.
    `prayer given <b>${Math.floor(village.prayed)}</b>${isShrined(village) ? ' · <b style="color:#e8dcff">shrined</b>' : ` / ${SHRINE_PRAYER} to a shrine`}`,
    `houses ${housesOf(village).length} · beds ${housesOf(village).length * BEDS}${village.site ? ` · <i>a hut rising: wood ${village.site.wood}/${HUT_WOOD} · water ${village.site.water}/${HUT_WATER} · built ${Math.round(village.site.work / HUT_WORK_TICKS * 100)}%</i>` : h.length > housesOf(village).length * BEDS ? ' · <i>crowded</i>' : ''}`,
    `last night the Dark Young ate ${village.lastRaidEaten} · melted ${village.melted}`,
    ...(village.blight > 0 ? [`<i>the blight: ${Math.round(village.blight)} m round the mother</i>`] : []),
    `infants taken ${village.taken} · home again ${village.returned}${village.dropped.length ? ` · <i>${village.dropped.length} lying out</i>` : ''}${village.brood.length + village.bred.length ? ` · <i>at the lair ${village.brood.length}, bred ${village.bred.length}</i>` : ''}`,
  ];
  // S2: the steward's board where he stands: every grown villager, their traits, and the watch to give or take.
  if (steward.woken) { if (steward.at === ctx.id) { rows.push(`<div class="board"><b>${STEWARD_NAME}'s board</b> · the watch ${guards(village).length}/${GUARDS_MAX}</div>`); for (const s of h.filter(s => s.stage === 'grown')) rows.push(`<div class="duty">${hobbitById(s.id).name} <span>${traitWords(traitsOf(s.id))}</span><button data-duty="${s.id}" class="${s.duty === 'guard' ? 'on' : ''}">${s.duty === 'guard' ? 'on the watch' : 'day work'}</button></div>`); }
    else rows.push(`<i>the steward is not here: its people keep to their own work${guards(village).length ? ` · the watch ${guards(village).length}` : ''}</i>`); }
  infoRows.innerHTML = rows.map(r => `<div>${r}</div>`).join('');
}
// S2: the steward on the land: his figure (a working look), asleep in the moot's chair, walking his route, lying up when bitten; his label; his panel.
const stewardFig = createHulda({ name: STEWARD_NAME, height: MODEL_HEIGHT * 1.04, skin: '#d8b894', cloth: '#6a5a2a', clothLight: '#b09a4a', hair: '#5a5048', feet: '#3a3028', locks: false, leaves: false, skirt: false }); scene.add(stewardFig.group);
const stewardLabel = document.createElement('div'); stewardLabel.className = 'name steward'; stewardLabel.textContent = `${STEWARD_NAME} · the steward`; el('labels').append(stewardLabel);
const stewardBtn = el<HTMLButtonElement>('stewardBtn'), stewardPanel = el('stewardPanel'); let stewardPanelClock = 0;
function walkSteward(dt: number, anim: number): void {
  const arrived = stepSteward(steward, dt, home_().v.tick);
  if (arrived) { const c = ctxs.find(x => x.id === arrived); tellBanner(`${STEWARD_NAME} the steward has come to ${c ? ctxName(c) : arrived}: its people's duties are his to give here`); saveSteward(); }
  stewardSaveClock += dt; if (steward.to && stewardSaveClock > 5) { stewardSaveClock = 0; saveSteward(); }
  const lying = !steward.woken || lyingUp(steward, home_().v.tick), next = steward.route[0], y = terrain.height(steward.x, steward.z), walking = !lying && !!steward.to && !!next;
  const heading = walking ? Math.atan2(next!.z - steward.z, next!.x - steward.x) : steward.woken ? stewardFig.group.userData.heading ?? 0 : 0; stewardFig.group.userData.heading = heading;
  const asleep = !steward.woken; stewardFig.group.position.set(steward.x, y + (lying ? 0.35 : 0), steward.z + (asleep ? -1.4 : 0)); stewardFig.group.rotation.set(0, -Math.PI / 2 - heading, lying ? 1.3 : 0);
  stewardFig.update(anim, walking ? STEWARD_PACE * (MODEL_HEIGHT / (MODEL_HEIGHT * 1.04)) : 0, stewardFig.group.rotation.y, true, 0);
  const d = camera.position.distanceTo(stewardFig.group.position); tmp.set(steward.x, y + MODEL_HEIGHT * 1.1, steward.z); tmp.project(camera); const show = d < 45 && tmp.z < 1 && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1 && !mapOpen && !inDeep(mode);
  stewardLabel.hidden = !show; if (show) stewardLabel.style.transform = `translate(${(tmp.x + 1) * innerWidth / 2}px,${(1 - tmp.y) * innerHeight / 2}px) translate(-50%,-100%)`;
  stewardBtn.hidden = !steward.woken; if (!stewardPanel.hidden) { stewardPanelClock += dt; if (stewardPanelClock > 0.5) { stewardPanelClock = 0; renderStewardPanel(); } }
}
function renderStewardPanel(): void {
  const here = steward.at ? ctxs.find(c => c.id === steward.at) : null, going = steward.to ? ctxs.find(c => c.id === steward.to) : null;
  (stewardPanel.querySelector('.title') as HTMLElement).textContent = `${STEWARD_NAME} · the steward`;
  (stewardPanel.querySelector('.status') as HTMLElement).textContent = lyingUp(steward, home_().v.tick) ? `bitten: he lies up where he is${going ? `, on his way to ${ctxName(going)}` : ''}` : going ? `walks to ${ctxName(going)} · ${Math.round(leftToWalk(steward))} m to go` : here ? `stands at ${ctxName(here)}: his board is in its panel` : 'stands at the old moot';
  const list = stewardPanel.querySelector('.list') as HTMLElement, known = ctxs.filter(c => c.i === 0 || overworld.known.has(c.id));
  list.replaceChildren(...known.map(c => { const b = document.createElement('button'); b.dataset.send = c.id; b.textContent = `send him to ${ctxName(c)}`; b.disabled = steward.at === c.id || steward.to === c.id; return b; }));
}
stewardBtn.addEventListener('click', () => { stewardPanel.hidden = !stewardPanel.hidden; stewardBtn.setAttribute('aria-expanded', String(!stewardPanel.hidden)); if (!stewardPanel.hidden) renderStewardPanel(); });
stewardPanel.addEventListener('click', e => { const b = (e.target as HTMLElement).closest('[data-send]') as HTMLElement | null; if (b && sendTo(b.dataset.send!)) renderStewardPanel(); });
/** Overhead: past the shoulder the camera sits `zoom` m from her on the yaw, raised by the elevation, looking at her. */
function overheadCamera(): void { player.pitchLimit = zoom <= ZOOM_MIN + 0.05 ? PITCH_FULL : PITCH_LIMIT; if (zoom <= ZOOM_MIN + 0.05) return; const f = player.feet(), e = zoomElevation(zoom), t = new THREE.Vector3(f.x, f.y + 0.6, f.z); camera.position.set(t.x + Math.sin(player.yaw) * Math.cos(e) * zoom, t.y + Math.sin(e) * zoom, t.z + Math.cos(player.yaw) * Math.cos(e) * zoom); camera.lookAt(t); }
function frame(now: number) {
  // Two clocks: the animation step is capped (a hitch must not throw her), but the village's ticks come from the real seconds that passed while the page was watched, however slow the frames (only a stall of over WALL_CAP s is dropped). Carried travel (roots, the karst's rides, sinking and rising) runs on `sim`, real seconds capped at a quarter second like the raiders' stepping, so a slow renderer does not stretch a ride.
  requestAnimationFrame(frame); const wall = Math.min(WALL_CAP, Math.max(0, (now - last) / 1000)), dt = Math.min(0.05, wall), sim = Math.min(0.25, wall); last = now; if (document.hidden || intro.open) return; time += dt * 1000; simSeconds += dt;
  // The village lives only while watched: whole ticks from the real seconds that passed, none while hidden.
  tickBank += wall * TICKS_PER_SECOND * speed; const ticks = Math.floor(tickBank); if (ticks > 0) { for (const c of ctxs) advance(c.v, ticks); tickBank -= ticks; }
  if (pendingTap && now - pendingTap > 330) { pendingTap = 0; singleTap(); }
  if (!portalEl.hidden && (mode !== 'ground' || Math.hypot(player.feet().x - portalAt.x, player.feet().z - portalAt.z) > 1.5)) closePortal();
  if (!inDeep(mode)) { chunks.update(player.feet().x, player.feet().z); denField.update(player.feet(), time, packAsleepAt); }
  // G4: the village she is in is the one her hands and her panel belong to; the ones near enough are presented in full.
  pickActive(); { const f = player.feet(); for (const c of ctxs) { const d = Math.hypot(f.x - c.ox, f.z - c.oz), near = d <= (c.i === 0 ? HOME_NEAR_M : NEAR_M); if (near && !c.near) syncShown(c); if (!near && c.near) hideShown(c); c.near = near; c.world.root.visible = d <= SHOW_M; } }
  // D4: the blight moved (at dawn): the land's trees and the roots drawn again under it.
  if (home_().v.blight !== blightDrawn) { blightDrawn = home_().v.blight; const b = { blight: blightDrawn }; chunks.setBlight((x, z) => isBlighted(b, x, z)); network.setBlocked((x, z) => isBlighted(b, x, z)); networkScene.reset(); networkScene.update(network.dynamic, network.closed); if (mapOpen) drawMap(); }
  if (!inDeep(mode) && network.update(player.feet().x, player.feet().z)) networkScene.update(network.dynamic, network.closed);
  player.update(now, mode === 'ground' ? [...ctxs.filter(c => c.near).flatMap(c => c.world.colliders), ...chunks.colliders(), ...karst.colliders] : [], undefined);
  const g = player.gesture, stickHeld = g.held && Math.hypot(g.x, g.y) >= 0.25;
  let wantUnder = 0;
  if (mode === 'ground') { player.applyCamera(camera); const f = player.feet(); if (karst.inside(f.x, f.z)) { if (!loaded() && karst.groundFrame(dt) && mode === 'ground') mode = 'karst'; } else pressInto(dt); }
  else if (mode === 'karst') { wantUnder = karst.underground ? 1 : 0; karst.update(sim, time, { held: stickHeld, x: stickX(), y: stickY() }); if (mode === 'karst' && karst.mode === 'ground') mode = 'ground'; }
  else if (mode === 'trunk' && trunk) {
    const t = trunk, top = crownHeight(t.tree), y = stickY();
    if (Math.abs(y) > 0.25) t.h += -y * TRUNK_CLIMB * dt; t.h = Math.min(top, Math.max(0, t.h));
    if (t.h >= top - 1e-6 && y < -0.25) { crown = { tree: t.tree, az: t.az, armed: false }; mode = 'crown'; trunk = null; }
    else if (t.h <= 0 && y > 0.5) { t.downHeld += dt; if (t.downHeld > PRESS_S) enterGrass(world.trunkPoint(t.tree, 0, t.az)); }
    else t.downHeld = 0;
    if (mode === 'trunk') { const p = world.trunkPoint(t.tree, t.h, t.az); place(new THREE.Vector3(t.tree.x, relief(t.tree.x, t.tree.z) + t.h, t.tree.z)); orbitCamera(p, 3.6, 1.2); }
  } else if (mode === 'crown' && crown) {
    const c = crown, x = stickX(), y = stickY(); if (!stickHeld) c.armed = true;
    if (Math.abs(x) > 0.25) c.az += x * CROWN_SLIDE * dt;
    if (y > 0.5) { trunk = { tree: c.tree, h: crownHeight(c.tree) - 0.05, az: c.az, downHeld: 0 }; mode = 'trunk'; crown = null; }
    else if (y < -0.5 && c.armed) {
      const w = want(); let best: Tree | null = null, bestDot = 0.72;
      for (const o of hopTargets(c.tree)) { const d = new THREE.Vector3(o.x - c.tree.x, 0, o.z - c.tree.z).normalize().dot(w); if (d > bestDot) { bestDot = d; best = o; } }
      if (best) { const az = Math.atan2(c.tree.z - best.z, c.tree.x - best.x); hop = { from: world.crownPoint(c.tree, c.az), to: world.crownPoint(best, az), t: 0, tree: best, az }; mode = 'hop'; crown = null; }
    }
    if (mode === 'crown') { const p = world.crownPoint(c.tree, c.az); place(p); orbitCamera(p, 5.2, 2.1); }
  } else if (mode === 'hop' && hop) {
    hop.t = Math.min(1, hop.t + dt / HOP_S); const k = hop.t * hop.t * (3 - 2 * hop.t); const p = hop.from.clone().lerp(hop.to, k); p.y += Math.sin(hop.t * Math.PI) * 1.4;
    place(p); orbitCamera(p, 5.2, 2.1);
    if (hop.t === 1) { crown = { tree: hop.tree, az: hop.az, armed: true }; mode = 'crown'; hop = null; }
  } else if (mode === 'grass' && grass) {
    // Free under the grass, faster than running; onto a tree root when she runs along one.
    wantUnder = 1; const w = want(), gr = grass;
    if (w.lengthSq() > 0) {
      const nx = gr.x + w.x * GRASS_SPEED * dt, nz = gr.z + w.z * GRASS_SPEED * dt;
      if (grassCan(nx, nz)) { gr.x = nx; gr.z = nz; } else if (grassCan(nx, gr.z)) gr.x = nx; else if (grassCan(gr.x, nz)) gr.z = nz;
      gr.heading = Math.atan2(-w.x, -w.z);
    }
    const p = new THREE.Vector3(gr.x, relief(gr.x, gr.z), gr.z); place(p); orbitCamera(p, 3.2, 1.3);
  } else if (mode === 'root' && root) {
    // Held to the root's path, faster still; back reverses; sideways for a moment drops her into the grass; at a tree the aligned root, or a stop.
    wantUnder = 1; const r = root, w = want();
    if (carried && course) {
      // The course drives: on along this root, at its end the next of the course's roots, at the last one's end she is there.
      r.s += (r.forward ? 1 : -1) * CARRY_SPEED * dt;
      if (r.s >= r.root.length || r.s <= 0) { r.s = Math.min(r.root.length, Math.max(0, r.s)); courseAt++; const nr = course.roots[courseAt]; if (nr) { r.root = nr; r.forward = nr.a === course.nodes[courseAt]; r.s = r.forward ? 0 : nr.length; } else arriveCourse(); }
    } else if (r.exit) { const t = rootTangent(r.root, r.s); w.set(t.x, 0, t.z).multiplyScalar(r.forward ? 1 : -1).normalize(); if (w.lengthSq() < 0.01) w.set(0, 0, -1); }
    if (!carried && w.lengthSq() > 0) {
      const tan = rootTangent(r.root, r.s); if (!r.forward) tan.negate(); const flat = new THREE.Vector3(tan.x, 0, tan.z).normalize(), dot = r.exit ? 1 : flat.lengthSq() < 0.01 ? -stickY() : flat.dot(w);
      if (Math.abs(dot) < 0.35) { r.off += dt; if (r.off > 0.25) { const p = rootPoint(r.root, r.s); if ((r.root as WorldRoot).surface && grassCan(p.x, p.z)) { grass = { x: p.x, z: p.z, heading: player.yaw }; root = null; mode = 'grass'; } } }
      else { r.off = 0; if (dot < 0) r.forward = !r.forward; else {
        r.s += (r.forward ? 1 : -1) * ROOT_SPEED * sim;
        if (r.s >= r.root.length || r.s <= 0) { const atEnd = r.s >= r.root.length; r.s = Math.min(r.root.length, Math.max(0, r.s)); const endpoint = endTree(r.root, atEnd);
          if (r.exit) { const n = network.node(endpoint); if (n) { const stand = standNear(n); root = null; mode = 'rise'; move = { from: rootPoint(r.root, r.s), to: new THREE.Vector3(stand.x + KARST_AT.x, groundAt(ROOT_ZONES[n.zone], stand.x, stand.z), stand.z + KARST_AT.z), t: 0, seconds: 0.7, then: () => { karst.standOn(n.zone, stand.x, stand.z, stand.yaw); mode = 'ground'; } }; } }
          else { const next = nextRoot(endpoint, w, r.root); if (next) { r.root = next.root; r.forward = next.forward; r.s = next.forward ? 0 : next.root.length; } }
 }
      } }
    } else r.off = 0;
    if (mode === 'root') { const p = rootPoint(r.root, r.s); place(p); orbitCamera(p, 3.2, 1.3); }
  } else if (mode === 'meditate' && session) { const a = session.at, yaw = player.yaw; camera.position.set(a.x + Math.sin(yaw) * 2.6, a.y + 3.4, a.z + Math.cos(yaw) * 2.6); camera.lookAt(a.x, a.y + 0.3, a.z); }
  else if (mode === 'dive' || mode === 'launch') { deepFrame(sim); }
  else if (mode === 'deep') { const n = nodeAt(); place(n); player.pitch = Math.min(1.45, Math.max(0.12, player.pitch)); camera.position.set(n.x, n.y + 0.3, n.z); camera.lookAt(camera.position.clone().add(player.forward())); presentDeep(); }
  else if ((mode === 'sink' || mode === 'rise') && move) {
    move.t = Math.min(1, move.t + sim / move.seconds); const k = move.t * move.t * (3 - 2 * move.t); const p = move.from.clone().lerp(move.to, k);
    wantUnder = mode === 'sink' ? k : 1 - k; place(p); orbitCamera(p, 3.2, 1.3);
    if (move.t === 1) { const then = move.then; move = null; then(); }
  }
  // The ease settles exactly: the ground's alpha hash would stipple forever on a residual 0.01.
  under += (wantUnder - under) * Math.min(1, dt * 4); if (Math.abs(under - wantUnder) < 0.01) under = wantUnder;
  // The overhead camera is placed before the names, bubbles and marks are projected (Noah: zoomed out they drifted from their figures: they were cast through the shoulder camera, then the camera moved).
  // Dev: the camera's turn rate about her while she is carried, per second of the carried clock (`sim`): with no drag it stays at zero (the journey holds it there).
  { const f = player.feet(), yaw = Math.atan2(camera.position.x - f.x, camera.position.z - f.z), carried = mode === 'root' || (mode === 'karst' && karst.mode === 'ride'); if (carried && camTurn.carried) camTurn.max = Math.max(camTurn.max, Math.abs(Math.atan2(Math.sin(yaw - camTurn.yaw), Math.cos(yaw - camTurn.yaw))) / Math.max(sim, 1e-3)); camTurn.yaw = yaw; camTurn.carried = carried; }
  if (!inDeep(mode)) overheadCamera();
  fight(Math.min(0.25, wall) * speed, Math.min(0.25, wall)); walkSteward(Math.min(0.25, wall) * speed, dt); stations(Math.min(0.25, wall)); presentHulda(dt); presentKarsts(); for (const c of ctxs) if (c.near) { presentHobbits(c, dt, wall); presentSpirits(c, dt, wall); presentRaiders(c, dt); presentIncidents(c); presentHouses(c); } presentCourse(); villageInfo(dt); deepButtons(); tellShrines(); boardView.update(time); if (mode === 'meditate') { boardView.group.scale.multiplyScalar(BOARD_FIT); boardView.group.position.y = BOARD_LIFT; } deepWorld.update(time);
  const light = daylightAt(village.tick), dusk = Math.max(0, 1 - Math.abs(light - 0.12) / 0.12);
  // From a height the view opens: the fog thins to VISTA_FOG of the ground's and the far plane reaches out, over VISTA_ALT m above the ground beneath her (the summit had the meadow's fog and a 220 m far plane, and no view: Noah's playtest). Tuning.
  const vista = (() => { const f = player.feet(), t = Math.max(0, Math.min(1, (f.y - relief(f.x, f.z) - VISTA_ALT[0]) / (VISTA_ALT[1] - VISTA_ALT[0]))); return t * t * (3 - 2 * t); })(), fogScale = 1 - vista * (1 - VISTA_FOG), far = FAR_GROUND + vista * (FAR_VISTA - FAR_GROUND);
  if (Math.abs(camera.far - far) > 0.5) { camera.far = far; camera.updateProjectionMatrix(); }
  colour.copy(nightSky).lerp(daySky, Math.min(1, light * 1.6)).lerp(duskSky, dusk * 0.6); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.011 * fogScale);
  if (mode !== 'karst') karst.update(sim, time, { held: false, x: 0, y: 0 }, under); const atm = karst.atmosphere(); if (atm) { colour.copy(atm.colour); scene.background = colour; scene.fog = new THREE.FogExp2(colour, atm.inCavern ? atm.fog : atm.fog * fogScale); }
  if (inDeep(mode) && mode !== 'meditate') { colour.set(mode === 'deep' ? '#070a10' : '#14100a'); scene.background = colour; scene.fog = new THREE.FogExp2(colour, mode === 'deep' ? 0.05 : 0.22); }
  { const f = player.feet(), depth = forestDepth(f.x, f.z); if (depth > 0) { colour.lerp(forestSky, 0.35 + depth * 0.6); scene.background = colour; scene.fog = new THREE.FogExp2(colour, (0.011 + depth * 0.03) * fogScale); hemi.intensity *= 1 - depth * 0.6; sun.intensity *= 1 - depth * 0.7; } }
  if (denField.inside && !inDeep(mode)) { colour.set('#120c06'); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.14); }
  hemi.intensity = 0.5 + 1.9 * light; sun.intensity = 2.3 * light; if (denField.inside) { hemi.intensity *= 0.3; sun.intensity *= 0.08; } for (const c of ctxs) { if (c.near) c.world.updateLand(c.v); c.world.setHouses(c.v); c.world.setSite(c.v); c.world.setHedges(c.v.hedges); c.world.update(light, time, under); } setLayouts(ctxs.map(c => ({ x: c.ox, z: c.oz, huts: c.v.huts }))); chunks.setUnder(under, player.feet().x, player.feet().z); networkScene.vision(under);
  // What happened is told: the latest as a tip, and (Noah: the bleat was not warning enough) the ones that matter as a banner across the top.
  // G2: what the villagers say of places she has not found goes to the map as a hint.
  // G4 (Noah: marks came from villages she had never been to): only the village she is in is heard. Its talk goes to the map, the fan from its green; talk elsewhere is not heard. Another village's banners reach her only once she has been there (it is known), named.
  for (const c of ctxs) { const vs = c.v.voiced, from = c.heardRumor ? vs.indexOf(c.heardRumor) + 1 : 0; let added = false; if (c === ctx) for (let i = from; i < vs.length; i++) { const r = vs[i]; if (r.bearing !== undefined && r.about && addHint(overworld, { about: r.about === 'blight' ? 'lair' : r.about, bearing: r.bearing, text: r.text, ...(c.i ? { from: { x: c.ox, z: c.oz } } : {}) })) added = true; } if (vs.length) c.heardRumor = vs[vs.length - 1]; if (added) { save(); if (mapOpen) drawMap(); } }
  for (const c of ctxs) { const evs = c.v.events, from = c.toldEvent ? evs.indexOf(c.toldEvent) + 1 : 0, heard = c === ctx || overworld.known.has(c.id); for (let i = from; i < evs.length; i++) { const e = evs[i]; if (e.banner && heard) { bannerEl.textContent = c === ctx ? e.text : `${c.short}: ${e.text}`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; } else if (c === ctx) say(e.text, 5); } if (evs.length) c.toldEvent = evs[evs.length - 1]; }
  if (!bannerEl.hidden && time > bannerUntil) bannerEl.hidden = true;
  const c = clockOf(village.tick); el('clock').textContent = `Day ${c.day} · ${String(c.hour).padStart(2, '0')}:${String(c.minute).padStart(2, '0')}`;
  exploreClock += dt; if (exploreClock > 0.5) { exploreClock = 0; chunks.refreshRabbits(); const f = player.feet(); if (explore(overworld, f.x, f.z, EXPLORE_RADIUS * viewScale(powerNow())) > 0 && mapOpen) drawMap(); }
  saveClock += dt; if (saveClock > 5) { saveClock = 0; save(); }
  drawCompass(); if (miniOpen && !mapOpen) { miniClock += dt; if (miniClock >= 1 / MINI_HZ) { miniClock = 0; drawMini(); } } renderer.render(scene, camera);
}
player.applyCamera(camera); presentHulda(0); presentHobbits(ctx, 0); world.updateLand(village); world.update(daylightAt(village.tick), 0); scene.background = daySky; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __village: { steward: { get state() { return JSON.parse(serializeSteward(steward)); }, moot: mootPlace, name: STEWARD_NAME, wake: wakeSteward, send: sendTo, place: (x: number, z: number) => { steward.x = x; steward.z = z; steward.route = []; steward.to = null; steward.at = null; }, arriveAt: (id: string) => { const c = ctxs.find(x => x.id === id)!; const g = greenOf(c); steward.x = g.x; steward.z = g.z; steward.route = []; steward.to = null; steward.at = id; steward.hurtUntil = 0; saveSteward(); } }, assign: (id: string, duty: 'guard' | null) => assignDuty(village, id, duty), guards: () => guards(village).map(s => ({ ...s })), traits: (id: string) => traitsOf(id), hulda, presentation, scene, camera, renderer, player, network, terrain, camTurn, rootTrees: TREES, heap: storeSpot(STORES.dark), cult: { get state() { return { ...cultivation }; }, world: worldNow, get power() { return powerNow(); }, override: (w: WorldState | null) => { worldOverride = w; }, cultivate: () => startSession('cultivate'), reset: () => { cultivation = freshCultivation(); saveCultivation(); } }, villagerAt: (id: string) => { const s = village.hobbits.find(h => h.id === id); return s ? { id, x: s.x + ctx.ox, z: s.z + ctx.oz, inside: s.inside } : null; }, get lastCommune() { return lastCommune; }, news: () => village.hobbits.filter(s => hasNews(s)).map(s => ({ id: s.id, x: s.x + ctx.ox, z: s.z + ctx.oz, inside: s.inside, text: newsFor(village, s, placeKnown)!.text, about: newsFor(village, s, placeKnown)!.about })), commune: communeNear, ruins: () => ruins(home.seed), sanctified: () => [...overworld.sanctified], den: { layout: (id: string) => denField.layout(id), get inside() { return denField.inside; }, get built() { return denField.builtCount; }, pack: (id: string) => denField.packAt(id), asleep: packAsleepAt, enter: (id: string) => { const l = denField.layout(id); if (!l) return false; const c = l.chambers.find(ch => ch.deepest)!; place(new THREE.Vector3(c.c.x - c.r * 0.6, c.c.y - c.h * CHAMBER_FLOOR, c.c.z)); return true; } }, get hedges() { return village.hedges.map(h => ({ ...h })); }, territory, miraclesHere: () => { const l = herLocal(); return miraclesHere(stationAt(l.x, l.z)?.keeps ?? null, l).map(miracleName); }, get vista() { const f = player.feet(); return { alt: f.y - relief(f.x, f.z), far: camera.far, fog: (scene.fog as THREE.FogExp2).density }; }, canGrass: grassCan, rootNodes: ROOT_NODES, emerge, plotCourse, clearCourse, tapStick: () => singleTap(), get figures() { return world.figures; }, get course() { return course ? { entry: course.entry, goal: course.goal, nodes: [...course.nodes], roots: course.roots.map(r => r.id), length: course.length, at: courseAt, target: courseTarget } : null; }, get carried() { return carried; }, wayIn: () => (wayIn.visible ? { x: wayIn.position.x, z: wayIn.position.z } : null), portal: { open: (id: string) => openPortal(ROOT_NODES[id]), get isOpen() { return !portalEl.hidden; }, places: () => [...portalEl.querySelectorAll<HTMLButtonElement>('button[data-to]')].map(b => b.dataset.to!), pick: (to: string) => { (portalEl.querySelector(`button[data-to="${to}"]`) as HTMLButtonElement | null)?.click(); } }, hobbits: HOBBITS, folk: () => folkOf(village.folk).all.map(h => ({ id: h.id, name: h.name })), villages: () => ctxs.map(c => ({ id: c.id, name: c.name, short: c.short, folk: c.folk, x: c.ox, z: c.oz, tick: c.v.tick, population: c.v.hobbits.length, dead: c.v.dead.length, state: villageState(c.v).kind, near: c.near, active: c === ctx, stack: c.v.stack ? { ...c.v.stack } : null })), get active() { return ctx.id; }, villageSites: () => sites.map(s => ({ ...s })), goTo: (id: string) => { const c = ctxs.find(c => c.id === id); if (!c) return false; standOn(c.ox, c.oz - 16, Math.PI); pickActive(); return ctx === c; }, herLocal, get houses() { return housesOf(village); }, get huts() { return village.huts; }, get site() { return village.site ? { ...village.site } : null; }, askHut: () => askHut(village), quicken: (k: YieldSite) => quicken(village, k), trees: TREES, roots: TREE_ROOTS.length, get mode() { return mode; }, get simSeconds() { return simSeconds; }, get under() { return under; }, get grass() { return grass ? { ...grass } : null; }, get root() { return root ? { root: root.root.id, s: root.s, length: root.root.length, forward: root.forward } : null; }, get trunk() { return trunk ? { tree: trunk.tree.id, h: trunk.h } : null; }, get crown() { return crown ? { tree: crown.tree.id, az: crown.az, armed: crown.armed } : null; }, get transitioning() { return mode === 'hop' || mode === 'sink' || mode === 'rise'; }, sinkAt: (x: number, z: number) => { standOn(x, z); enterGrass(new THREE.Vector3(x, relief(x, z), z)); }, standAt: (x: number, z: number, yaw: number) => standOn(x, z, yaw), thoughts: () => village.hobbits.map(s => thought(s, village.tick)), get population() { return village.hobbits.length; }, breed: (n = 1) => { for (let i = 0; i < n; i++) { const id = newcomersOf(village).slice().reverse().find(c => !village.bred.some(b => b.id === c.id) && !village.hobbits.some(h => h.id === c.id))?.id; if (id) village.bred.push({ id, home: 0, born: village.tick }); } return village.bred.length; }, get holding() { return village.hero.holding; }, get blight() { return village.blight; }, set blight(m: number) { village.blight = m; }, isBlighted: (x: number, z: number) => isBlighted(village, x, z), get bannerText() { return bannerEl.hidden ? '' : bannerEl.textContent; }, bear: () => { const ok = bear(village); syncShown(); return ok; }, snatchers: () => village.snatchers.map(n => ({ ...n })), get dropped() { return village.dropped.map(d => ({ ...d })); }, get inArms() { return village.carried ? { ...village.carried } : null; }, get bred() { return village.bred.length; }, get brood() { return village.brood.length; }, get taken() { return village.taken; }, get returned() { return village.returned; }, infants: () => village.hobbits.filter(s => s.stage === 'infant').map(s => ({ id: s.id, home: s.home })), houseDoor: (i: number) => ({ x: housePlace(i).door.x + ctx.ox, z: housePlace(i).door.z + ctx.oz }), get events() { return village.events.map(e => ({ ...e })); }, get state() { return villageState(village); }, stateText: () => stateText(villageState(village)), rumors: () => rumors(village), get voiced() { return village.voiced.map(r => ({ ...r })); }, get hints() { return overworld.hints.map(h => ({ ...h })); }, isSpoiled: (k: YieldSite) => isSpoiled(village, k), spoil: (k: YieldSite) => spoil(village, k), dens: () => dens(village.seed).map(d => ({ ...d, ...(village.dens[d.id] ?? {}), inReach: Math.hypot(d.x - ctx.ox, d.z - ctx.oz) <= 500 })), setDens: (list: DenPlace[]) => { setDens(list); setWarrens([]); }, setWarrens: (list: WarrenPlace[]) => { setWarrens(list); }, warrens: () => warrenPlaces.map(w => ({ ...w, rabbits: rabbitStock(w.id) })), setRabbits: (den: string, n: number) => { const k = denKnownBy(den); if (k) denState(k.c.v, k.d).rabbits = n; chunks.refreshRabbits(); }, restoreDens: () => { setWarrens(warrenPlaces); setDens(dens(village.seed).map(d => ({ id: d.id, x: d.x, z: d.z, pack: d.pack }))); }, densInReach: () => densInReach(village).map(d => ({ ...d, ...denState(village, d) })), wolves: () => wolves(village).map(r => ({ ...r })), danger: (x: number, z: number) => danger(x, z), wolfTick: WOLF_TICK, get dead() { return village.dead.map(d => ({ ...d })); }, facing: () => world.figures.map((f, i) => { const s = village.hobbits[i], fwd = { x: -Math.sin(f.group.rotation.y), z: -Math.cos(f.group.rotation.y) }; return { moving: s.speed > 0 && s.path.length > 0, dot: s.path.length ? (fwd.x * (s.path[0].x - s.x) + fwd.z * (s.path[0].z - s.z)) / (Math.hypot(s.path[0].x - s.x, s.path[0].z - s.z) || 1) : 0 }; }), inWater, get village() { return JSON.parse(serializeVillage(village)); }, get tick() { return village.tick; }, get phase() { return phaseAt(village.tick); }, get clock() { return clockOf(village.tick); }, dayTicks: DAY_TICKS, count: (where: 'inside' | 'green' | 'out') => everyone(village, where), advance: (n: number) => { advance(village, n); syncShown(); save(); }, hobbit: (id: string) => ({ ...village.hobbits.find(s => s.id === id)!, keeps: hobbitById(id).keeps }), get stores() { return { ...village.stores }; }, get land() { return JSON.parse(JSON.stringify(village.land)); }, get fireWood() { return village.fireWood; }, get take() { return { ...village.lastTake }; }, get balance() { return balance(village); }, storeSpots: STORES, carrying: () => village.hobbits.map(s => s.carry), hungers: () => village.hobbits.map(s => s.hunger), armfuls: () => world.armfuls(), karstFeature: () => karst, karst: { get mode() { return karst.mode; }, get zone() { return karst.zone; }, get at() { return karst.at; }, get travelling() { return karst.travelling; }, get queued() { return karst.queued; }, origin: KARST_AT, inside: (x: number, z: number) => karst.inside(x, z), standOn: (zone: string, x: number, z: number, yaw: number) => { karst.standOn(zone, x, z, yaw); mode = 'ground'; }, nodes: NODES_HANDLE }, chunks: () => ({ loaded: chunks.count, trees: chunks.trees }), treesNear: (x: number, z: number, r: number) => treesNear(x, z, r).map(t => ({ ...t })), relief, compass: () => { const f = player.feet(); return { heading: bearingOf(-Math.sin(player.yaw), -Math.cos(player.yaw)), marks: [...knownPlaces(overworld).map(p => ({ id: p.id, x: p.x, z: p.z })), ...allIncidents().map(i => ({ id: 'incident', x: i.x, z: i.z }))].map(p => ({ id: p.id, bearing: bearingOf(p.x - f.x, p.z - f.z), distance: Math.hypot(p.x - f.x, p.z - f.z) })) }; }, placeRaider: (id: number, x: number, z: number) => { const r = village.raiders.find(r => r.id === id); if (r) { r.x = x; r.z = z; } return !!r; }, mini: { get open() { return miniOpen; }, set: (o: boolean) => openMini(o) }, deep: { get state() { return { ...deep }; }, feed: (n: number) => { boardView.onRun({ type: 0, cells: new Array(n).fill(null) } as unknown as Parameters<typeof boardView.onRun>[0], new THREE.Vector3()); }, get rushing() { return deepWorld.rushing; }, direction: (x: number, z: number) => deepDirection(deep, KARST_AT, { x, z }), set clarity(x: number) { deep.clarity = Math.min(CLARITY_CAP, Math.max(0, x)); }, places: deepPlaces, reachable: () => reachable(deep, KARST_AT, deepPlaces()).map(p => p.id), still: () => stillPlace()?.kind ?? null, meditate: () => startSession('meditate'), deepenPuzzle: () => startSession('deepen'), done: endSession, dive: startDive, launch: launchTo, get session() { return session ? { ...session } : null; }, get boardShown() { return boardView.group.visible; }, get to() { return deepTo?.id ?? null; }, get aimed() { return deepAimed; }, points: () => deepWorld.pointCount, aim: (id: string) => { if (!deepWorld.spritePosition(id, tmp)) return false; const d = tmp.sub(camera.position).normalize(); player.yaw = Math.atan2(-d.x, -d.z); player.pitch = Math.asin(Math.max(-1, Math.min(1, d.y))); return true; }, shrined: () => ctxs.filter(c => isShrined(c.v)).map(c => c.id), node: () => { const n = nodeAt(); return { x: n.x, y: n.y, z: n.z }; }, reach: () => deepReach(deep), shrinePrayer: SHRINE_PRAYER, pool: () => ({ x: karst.poolAt.x, y: karst.poolAt.y, z: karst.poolAt.z }), costs: { dive: DIVE_COST, back: RETURN_COST, deepen: DEEPEN_COST } }, set prayed(x: number) { village.prayed = x; }, houseLabels: () => ctxs.reduce((n, c) => n + [...c.houseLabels.values()].filter(e => !e.hidden).length, 0), incidents: allIncidents, marks: () => ctx.world.root.children.filter(o => o.name === 'incident-mark' && o.visible).map(o => ({ x: o.position.x + ctx.ox, z: o.position.z + ctx.oz })), pinchPointers: () => pinchPointers.size, get zoom() { return zoom; }, set zoom(x: number) { zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, x)); }, get mapOpen() { return mapOpen; }, openMap, get explored() { return overworld.revealed.size; }, isRevealed: (x: number, z: number) => isRevealed(overworld, x, z), places: () => places(overworld.seed), known: () => [...overworld.known], lair: () => ({ ...village.lair, at: lairPlace, paused: raidsPaused(village) }), forestDepth: (x: number, z: number) => forestDepth(x, z), choosePerk: (p: 'vigor' | 'strike' | 'sap') => choosePerk(village, p), set xp(n: number) { village.hero.xp = n; }, xpDy: XP_DY, xpLair: XP_LAIR, lairReach: LAIR_HURT_RANGE, raiders: () => village.raiders.map(r => ({ ...r })), get hero() { return { ...village.hero }; }, set vigor(x: number) { village.hero.vigor = x; }, attack, cooldowns: cooldown, get slain() { return village.slain; }, get slainAll() { return ctxs.reduce((n, c) => n + c.v.slain, 0); }, get eaten() { return village.eaten; }, stations: STATIONS, sites: SITES, setStore: (k: Store, n: number) => { village.stores[k] = n; }, setLand: (k: 'berries' | 'branches' | 'milk' | 'goats', n: number) => { village.land[k] = n; village.land.crops = village.land.crops.map(c => (n > 0 ? c : 0)); }, get prayer() { return village.prayer; }, set prayer(x: number) { village.prayer = x; }, dropStack: () => { village.stack = null; }, get stack() { return village.stack ? { ...village.stack } : null; }, get spirits() { return village.spirits.map(s => ({ ...s })); }, summon: (k: SiteKind) => summonSpirit(village, k), spiritCost: () => spiritCost(village), praying: () => village.hobbits.filter(s => s.activity === 'praying').map(s => s.id), setTick, jumpTo, get speed() { return speed; }, set speed(x: number) { speed = x; }, reset: () => resetVillage(), get shown() { return shown.list.map(s => ({ x: s.x, z: s.z, speed: s.speed, label: !s.label.hidden, bubble: !s.bubble.hidden })); }, get character() { const g = hulda.gait; return { status: clipStatus, error: clipError, clips: clipUrls, bones: hulda.bones.size, body: 'hulda', roles: g?.roles ?? null, weights: g ? Object.fromEntries(Object.entries(g.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null, hobbitWeights: home_().world.figures.map(f => f.gait ? Object.fromEntries(Object.entries(f.gait.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null) }; } } });
