// The village, V0: presence. Hulda walks a meadow among eight hobbits who live by a day's rhythm:
// out of their doors at dawn to the places they keep to, together at the fire at noon, home at
// dusk, asleep at night. They do not see her yet. Twenty real minutes to their day, which passes
// only while the page is open. The question: do figures going in and out of houses on a rhythm
// already read as people living there?
import './village.css';
import * as THREE from 'three';
import { Player, PITCH_LIMIT, PITCH_FULL } from './player';
import { createDescentVisit } from './descentVisit';
import { catwalk as catwalkAt } from './descentModel';
import { makePortal } from './portalFigure';
import { plateau, walkable, FOOTBRIDGE_OVER, WADE_DEPTH } from './plateauModel';
import { buildWaterworks } from './plateauWorld';
import { chooseDire, freshSteward, parseSteward, serializeSteward, wake as wakeUp, send as sendSteward, stepSteward, bite as biteSteward, lyingUp, leftToWalk, WAKE_GEMS, PACE as STEWARD_PACE, type Steward, type Circle } from './stewardModel';
import { setMoot, setHeroes, assignDuty, guards, hunters, traitsOf, traitWords, GUARDS_MAX, HUNTERS_MAX, setOwnWarrens, huntingGround, groundRabbits, buildRack, RACK_WOOD, searchers, setSearch, setSearchFound, searchParty, SEARCHERS_MAX, setDire, isDire, direDen, DIRE_HP, DEN_REACH_M, bearingWords, bearingFromGreen, setWallows, setQuarry, wallowOf, type Duty } from './villageModel';
import { createHulda } from './huldaCharacter';
import { createHuldaPresentation, HUMAN_CENTRE, type HuldaForm } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { buildVillage, type VillageWorld } from './villageWorld';
import { hedgeNear, dispelHedge, newsFor, commune, RUMOR_TICKS, packAsleep, slayAsleep, setWarrens, quickenWarren, rabbitsAt, WARREN_CAP, type WarrenPlace, strikeDamage, hedgeAllowed, growHedge, HEDGE_PRAYER, setRuins, purify, purifiable, PURIFY_COST, regenRate, storeSpot, STORE_RING_R, carryInfant, dropCarried, bear, isBlighted, incidents, HOBBITS, housesOf, setLayouts, setVillageSites, folkOf, newcomersOf, isHome, villageState, stateText, rumors, spoil, setDens, wolves, denState, densInReach, WOLF_HP, WOLF_TICK, type StateKind, type Voiced, type DenPlace, housePlace, siteStation, deliverToSite, askHut, quicken, quickenable, QUICKEN_COST, HUT_PRAYER, HUT_WOOD, HUT_WATER, HUT_WORK_TICKS, BEDS, HOUSE_CAP, siteNeeds, STORES, STATIONS, SITES, YIELD_OF, YIELD_SITES, isSpoiled, HOLD_RANGE, HOLD_MELT_S, GREEN, REST_MEALS, BIRTH_DAYS, BERRY_CAP, BRANCH_CAP, MILK_PER_DAY, CROP_STRIPS, type YieldSite, balance, stationAt, storeFull, collect, deliver, setTreeProvider, treesNear, stepRaiders, strike, thornBurst, rootBind, STRIKE_CD, THORN_CD, ROOT_CD, THORN_SAP, ROOT_SAP, DY_HP, vigorMax, sapMax, setLair, forestDepth, choosePerk, LAIR_HP, LAIR_HURT_RANGE, XP_DY, XP_LAIR, LEVEL_XP, LEVEL_CAP, raidsPaused, summonSpirit, spiritCost, COLLECT_S, DELIVER_S, PRAYER_CAP, HOUSE_RADIUS, PHASES, type SiteKind, type Store, TICKS_PER_SECOND, DAY_TICKS, TREES, TREE_ROOTS, GRASS_SPEED, ROOT_SPEED, TRUNK_CLIMB, CROWN_SLIDE, HOP_S, PRESS_S, PRESS_RANGE, ENTER_RANGE, freshVillage, parseVillage, serializeVillage, advance, clockOf, phaseAt, daylightAt, everyone, hobbitById, thought, crownHeight, trunkRadius, nearestTree, rootPoint, rootTangent, endTree, hopTargets, inWater, dayOf, setFront, type Village, type Tree, type RootEdge } from './villageModel';
// R1 (Noah): roots as a way, not a trap. No root takes her from the grass by itself: one stick tap takes the nearest root within ROOT_REACH m, one tap leaves it. A place tapped on the map plots a course through the roots; the entry tree glows, pressing into it (or a tap beside it) sinks her in, and the roots carry her at CARRY_SPEED until a tap or the end, where she rises out. Tuning.
const ROOT_REACH = 2.6, CARRY_SPEED = 9;
/** The longest gap between frames the village clock counts as watched time. Tuning. */
const WALL_CAP = 2;
import { MODEL_HEIGHT } from './huldaRig';
import type { HobbitState, VillageEvent, PurifyTarget, Raider } from './villageModel';
import { THORN_RANGE, spawnFoe, TRAIL_TICKS, setTwitchingTrees, inTree, STAG_HP, STAG_CHARGE, cutSac, sacsOf, hidden, HATCH_AGGRO, DY_AGGRO_S, FINISHER_MULT, HEAVY_MULT, defense, tellOf } from './villageModel';
import { createRootNetwork, siteTreeId, soilAt as grassCan, type WorldRoot, type Course } from './worldRoots';
import { TAINT, stepBreath, exhaleAt, colourAt, flareAt } from './taintModel';
import { freshGrowth, parseGrowth, serializeGrowth, indexGrowth, stepGrowth, inGrowth, depthOf, ringOf, veinOf, hyphaSegments, witheredSegments, WITHERED_DAYS, nearestFront, fieldStamp, WEIGHTS, IRRITANT_R, addGerm, removeGerms, GERM_REACH, type Growth, type GrowthIndex, type Nourish, type Irritant } from './contagionModel';
import { setGerms, setPoisonedWarrens, setTurned, setHeld, broodSpotOf, germSource, keeperSpot, atHome, HELD_M, TURN_DAYS, type RaiderState, type RaiderKind } from './villageModel';
import { villageIrritant, unturn, homeBrood, FRONT_TELL_M, THRIVE_DAYS, FOODS, STACK_CAP } from './villageModel';
import { createBasket } from './basketFigure';
import { createTaintMist } from './taintMist';
import { rootNetworkWorld } from './rootNetworkWorld';
import { NODES as ROOT_NODES, PILLARS, standNear, groundAt, nodeName, ZONES as ROOT_ZONES, type Node as RootNode } from './karstFlowModel';
import { createTerrain } from './worldTerrain';
import { createDenField } from './denWorld';
import { createWardField } from './ruinWorld';
import { wards, WARD } from './ruinsModel';
import { createWardInterior } from './wardInteriorWorld';
import { industries, industryLand, extentOf } from './industryModel';
import { createIndustryField } from './industryWorld';
import { parseQuest, blowInside, blowOutside, stepFix, SNERK_AT, CREW_AT, SNERK_LINES, CREW_LINES, WAKE_LINE, DOOR_LINES, DOOR_CUTS, type Quest } from './wardInterior';
import { createVillageLook, type VillageLook } from './villageVista';
import { loadVillageLand } from './plateauLand';
import { freshCultivation, parseCultivation, serializeCultivation, worldTier, power, lacking, grow, grownEnough, mayFirstDive, canRaise, raise, reachBonus, viewScale, TIER_POINTS, TIER_CLARITY, TIER_CAP, type Cultivation, type WorldState } from './cultivationModel';
import { CHAMBER_FLOOR } from './denModel';
import { createChunks } from './chunkWorld';
import { createKarstFeature } from './karstFeature';
import { KARST_AT, LAIR_DISTANCE } from './overworldModel';
import { NODES as NODES_HANDLE } from './karstFlowModel';
import { biomeAt, CHUNK, hubAt } from './chunkModel';
import { wallows, moot, ownWarrens, warrens, WARREN_RADIUS, ruins, sanctify, groves, type Ruin, EXPLORE_RADIUS, freshOverworld, parseOverworld, serializeOverworld, explore, isRevealed, knownPlaces, places, dens, danger, addHint, hintFrom, villageSites, HINT_REACH, HINT_SPREAD, ZOOM_MIN, ZOOM_MAX, zoomElevation, bearingOf, wrapDeg, type Overworld, type VillageSite } from './overworldModel';
import { convergences } from './chunkModel';
import { createOverworldMap, zoomBounds, clampZoom, MAP_MAX } from './overworldMap';
import type { TraversalWorld } from './mobility';
import { Board } from './match3';
import { BoardView } from './board3d';
import { freshDeep, parseDeep, serializeDeep, gather, channel, canChannel, MIRACLE_GEMS, MIRACLE_CLARITY, SANCTIFY_GEMS, canDive, dive, canReturn, returnDeep, launch as launchDeep, isShrined, canDeepen, deepen, reachable, launchSeconds, deepDirection, reachAngle, nodeDepth, deepReach, CLARITY_CAP, DIVE_COST, RETURN_COST, DEEPEN_COST, DEEPEN_POINTS, SHRINE_PRAYER, type DeepPlace, type Deep } from './deepModel';
import { createDeepWorld } from './deepWorld';
import { Impact, type Blow } from './impact';
import { FightSound } from './fightSound';
import { createHitFx, type Flecks } from './hitFx';
import { createTraverseLayer, type TraverseLayer } from './huldaTraverse';
import { leanAt } from './parkour';
import { createMoveLayer, MOVES, dodgeProgress, type MoveLayer, type MoveEvent } from './huldaMoves';
import { createStaff, createTrail } from './huldaStaff';
import { HULDA_PALETTE } from './huldaDress';
import { mulberry32 } from './colors';
const KEY = 'rootwake-village-v1';
// G4 (EXPANSION.md): every village on the land is a whole village of the model with a scene of its own at its origin. The first, at the origin, is the home village: the mother of goats knows it alone, and its save is the old key. The others (the overworld's villageSites) are saved under the key and their folk number. `village` and `world` are always the active village's: the nearest to her feet, so her rings, her panel, her prayer and her fight are the village she is in.
let home: Village = freshVillage(1); try { home = parseVillage(localStorage.getItem(KEY)); } catch { /* Storage is optional. */ }
if (!isHome(home)) home = freshVillage(home.seed);
const OVER_KEY = 'rootwake-overworld-v1';
let overworld: Overworld = freshOverworld(1); try { overworld = parseOverworld(localStorage.getItem(OVER_KEY)); } catch { /* Storage is optional. */ }
function save() { try { for (const c of ctxs) localStorage.setItem(c.key, serializeVillage(c.v)); localStorage.setItem(OVER_KEY, serializeOverworld(overworld)); localStorage.setItem(DEEP_KEY, serializeDeep(deep)); karst?.save(); saveGrowth(); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const labels = el('labels');
const FAR_GROUND = 220, FAR_VISTA = 1100, VISTA_ALT = [8, 40], VISTA_FOG = 0.22;
const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, FAR_GROUND); scene.add(camera);
// F1: the feel of a blow (hit-stop, shake, punch in, slow motion, buzz), its sound, and what it looks like in the world. `?shake=0` keeps the camera still; `?mute=1` silences the fight.
const impact = new Impact(), sound = new FightSound(), fightParams = new URLSearchParams(location.search);
impact.shake = fightParams.get('shake') !== '0'; sound.muted = fightParams.get('mute') === '1';
addEventListener('pointerdown', () => sound.wake(), { capture: true });
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(innerWidth, innerHeight); renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; document.body.prepend(renderer.domElement);
const hemi = new THREE.HemisphereLight('#eef4e2', '#4d5f48', 2.3); scene.add(hemi); const sun = new THREE.DirectionalLight('#fff0c8', 2.3); sun.position.set(-20, 40, 15); scene.add(sun);
if (overworld.seed !== home.seed) overworld = freshOverworld(home.seed);
// The look (VISTA_HANDOFF.md, village): ?look=vista, or the /vista/village/ entry, draws the same village with the vista's land, light and grade, its world ringed by mountains past the farthest den.
const LOOK = new URLSearchParams(location.search).get('look') ?? (window as unknown as { __ROOTWAKE_LOOK?: string }).__ROOTWAKE_LOOK ?? '';
// PLATEAU.md: the land baked at build (the erosion), fetched; eroded here when it is missing or stale.
const vistaLand = LOOK === 'vista' ? await loadVillageLand(home.seed, createTerrain(home.seed), `${import.meta.env.BASE_URL}land/plateau-${home.seed}.bin.gz`) : null;
const terrain = vistaLand ? vistaLand.terrain : createTerrain(home.seed), relief = terrain.height;
const fx = createHitFx(scene, relief);
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
// S3: the villages' own warrens (the first village's, with no den in reach): a pool its hunters draw on.
const ownWarrenPlaces = ownWarrens(home.seed); setOwnWarrens(ownWarrenPlaces.map(w => ({ id: w.id, x: w.x, z: w.z })));
// S2 (SETTLEMENTS.md): the old moot, where the steward sleeps.
const mootPlace = moot(home.seed);
const wallowPlaces = wallows(home.seed); setWallows(wallowPlaces.map(w => ({ id: w.id, x: w.x, z: w.z })));
// RUINS.md (Noah, 2026-10-19): the wards, the old containment's ruins ringing the breach just inside the taint's edge, each on a level earthwork cleared of trees.
const wardList = wards(home.seed, places(home.seed).find(p => p.id === 'lair')!, relief, (x, z) => walkable(plateau(home.seed), x, z), places(home.seed).filter(p => p.id !== 'lair').map(p => ({ x: p.x, z: p.z, r: p.radius })));
// RUINS.md, the industrial ruins: the yards of the Barrens' old industry, out in the wilds, clear of the wards.
const yardList = industries(home.seed, industryLand(home.seed, relief, wardList.map(w => ({ x: w.x, z: w.z, r: WARD.court + w.skirt }))));
const yardClear = yardList.map(y => ({ x: y.x, z: y.z, r: Math.max(...extentOf(y)) + y.skirt + 1 }));
const chunks = createChunks(scene, home.seed, terrain, dens(home.seed), [...convergences(home.seed), ...plateau(home.seed).brinks], ruins(home.seed), [...warrenPlaces, ...ownWarrenPlaces], mootPlace, wallowPlaces, [...wardList.map(w => ({ x: w.x, z: w.z, r: WARD.court + w.skirt + 1 })), ...yardClear]);
const ownerOf = (w: { x: number; z: number }): Ctx => ctxs.slice().sort((a, b) => Math.hypot(a.ox - w.x, a.oz - w.z) - Math.hypot(b.ox - w.x, b.oz - w.z))[0];
const rabbitStock = (id: string): number => { const own = ownWarrenPlaces.find(x => x.id === id); if (own) return ownerOf(own).v.ownRabbits; const w = warrenPlaces.find(x => x.id === id); if (!w) return 0; const k = denKnownBy(w.den); return k ? rabbitsAt(k.c.v, k.d) : WARREN_CAP; }; chunks.setRabbits(rabbitStock);
chunks.setBoars(id => { const w = wallowPlaces.find(x => x.id === id); return w ? ctxs.find(c => c.id === w.village)?.v.boars ?? 0 : 0; });
// S2: the steward. Asleep in the moot's chair until she wakes him there with a channelling of clarity; then he walks where she sends him, on foot (only she rides the roots), and the village he stands in has his board. A wolf may bite him on the way (he lies up a day, never killed). STEWARD_NAME is a working name. MOOT_R: how near the chair she stands to wake him. Tuning.
const STEWARD_KEY = 'rootwake-steward-v1', STEWARD_NAME = 'Oswin', MOOT_R = 4;
let steward: Steward = (() => { try { return parseSteward(localStorage.getItem(STEWARD_KEY), mootPlace); } catch { return freshSteward(mootPlace); } })(), stewardSaveClock = 0;
function saveSteward(): void { try { localStorage.setItem(STEWARD_KEY, serializeSteward(steward)); } catch { /* Storage is optional. */ } }
setMoot(mootPlace, !steward.woken);
const stewardAvoid = (): Circle[] => { const l = places(home.seed).find(p => p.id === 'lair')!; return [{ x: l.x, z: l.z, r: l.radius + 12 }, { x: KARST_AT.x, z: KARST_AT.z, r: 110 }]; };
setHeroes(() => (steward.woken && !lyingUp(steward, home_().v.tick) ? [{ id: 'steward', x: steward.x, z: steward.z }] : []), () => { biteSteward(steward, home_().v.tick); saveSteward(); tellBanner(`${STEWARD_NAME} the steward is bitten by a wolf: he lies up a day where he is`); });
// S4: a search party home with a find: the place goes on her map as if she had walked there.
setSearchFound((v, about) => { const p = places(home.seed).find(x => x.id === about); if (!p) return; explore(overworld, p.x, p.z); save(); if (mapOpen) drawMap(); const c = ctxs.find(x => x.v === v); if (c === ctx || (c && overworld.known.has(c.id))) tellBanner(`The searchers of ${c ? ctxName(c) : 'the village'} are home: ${p.name} is on her map`); });
/** The places she has heard of and not found, that a search party can go to: the hints on her map (not the dark wood). */
const searchable = (): { about: string; name: string; text: string }[] => overworld.hints.filter(h => h.about !== 'lair').map(h => ({ h, p: places(home.seed).find(x => x.id === h.about) })).filter(x => !!x.p).map(x => ({ about: x.h.about, name: x.p!.name, text: x.h.text }));
/** A village's green on the land, where the steward stands. */
const greenOf = (c: Ctx): { x: number; z: number } => ({ x: c.ox + 3, z: c.oz + 3 });
const ctxName = (c: Ctx): string => (c.i ? c.name : 'the village');
function sendTo(id: string): boolean { const c = ctxs.find(x => x.id === id); if (!c || !sendSteward(steward, id, greenOf(c), stewardAvoid())) return false; saveSteward(); tellBanner(`${STEWARD_NAME} sets out for ${ctxName(c)}`); return true; }
function wakeSteward(): boolean {
  if (!wakeUp(steward)) return false; setMoot(mootPlace, false); overworld.known.add('moot'); const near = ctxs.slice().sort((a, b) => Math.hypot(a.ox - mootPlace.x, a.oz - mootPlace.z) - Math.hypot(b.ox - mootPlace.x, b.oz - mootPlace.z))[0];
  sendSteward(steward, near.id, greenOf(near), stewardAvoid()); pickDire(); saveSteward(); save(); const dd = steward.dire ? dens(home.seed).find(d => d.id === steward.dire) : null, by = dd ? ctxs.slice().sort((a, b) => Math.hypot(a.ox - dd.x, a.oz - dd.z) - Math.hypot(b.ox - dd.x, b.oz - dd.z))[0] : null; tellBanner(`${STEWARD_NAME} wakes at the foot of the old moot's chair: the steward, keeper of the villages' duties. He walks to ${ctxName(near)}${dd && by ? `. Far off, a den's wolves turn black, to the ${bearingWords(bearingFromGreen(dd.x - by.ox, dd.z - by.oz))} of ${ctxName(by)}` : ''}`); return true;
}
function tellBanner(text: string): void { bannerEl.textContent = text; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1600; }
// The dens as delves (Noah): their halls and chambers are her ground where they lie, built as she comes near.
const denField = createDenField(scene, terrain, dens(home.seed), home.seed); chunks.setSanctified(overworld.sanctified); setRuins(ruins(home.seed).map(r => ({ id: r.id, x: r.x, z: r.z }))); setTreeProvider((x, z, r) => [...chunks.treesNear(x, z, r), ...siteTrees.filter(t => Math.hypot(t.x - x, t.z - z) <= r)]);
// M1 (MOTHER.md): the breach, and the root lines her infection runs along out to TAINT.veins past its edge: the chunks' main lines, hub to hub (a tree's own short root is left out, or the stain covers everything and no line reads).
const breach = places(home.seed).find(p => p.id === 'lair')!;
function taintVeins(): { x: number; z: number }[][] {
  // The main lines run straight from a chunk's hub to its neighbours' (worldRoots.generated joins them so), so they are laid from the hubs alone: generating every chunk's roots over the whole taint took seconds.
  const R = TAINT.edge + TAINT.veins, out: { x: number; z: number }[][] = [], c0 = Math.floor((breach.x - R) / CHUNK), c1 = Math.floor((breach.x + R) / CHUNK), d0 = Math.floor((breach.z - R) / CHUNK), d1 = Math.floor((breach.z + R) / CHUNK);
  for (let cx = c0; cx <= c1; cx++) for (let cz = d0; cz <= d1; cz++) {
    const a = hubAt(cx, cz, home.seed);
    for (const [dx, dz] of [[1, 0], [0, 1], [1, 1], [-1, 1]]) {
      const b = hubAt(cx + dx, cz + dz, home.seed), len = Math.hypot(b.x - a.x, b.z - a.z), n = Math.max(2, Math.ceil(len / 2)), line: { x: number; z: number }[] = [];
      for (let k = 0; k <= n; k++) line.push({ x: a.x + (b.x - a.x) * k / n, z: a.z + (b.z - a.z) * k / n });
      if (line.some(p => Math.hypot(p.x - breach.x, p.z - breach.z) < R)) out.push(line);
    }
  }
  return out;
}
// C1 (CONTAGION.md): her growth as mycelium along the root hubs (contagionModel), stepped once at each dawn of the home village and read everywhere the taint's rings were: the grass and the roots she may use, the look's rings, veins and trees, the map, the keeper's rumor. Its own save, carrying the counters the dawn step's inputs are deltas of (infants taken, Dark Young bred, stores eaten).
const GROWTH_KEY = 'rootwake-growth-v1';
interface GrowthSeen { day: number; taken: number; bred: number; eaten: number }
/** C2: the counters summed over every village (a captured village's snatchers and raids feed the front as the home village's do). */
const seenNow = (): GrowthSeen => ({ day: dayOf(home_().v.tick), taken: ctxs.reduce((n, c) => n + c.v.taken, 0), bred: ctxs.reduce((n, c) => n + c.v.bred.length, 0), eaten: ctxs.reduce((n, c) => n + c.v.eaten, 0) });
let growth: Growth, growthSeen: GrowthSeen;
{ let raw: string | null = null; try { raw = localStorage.getItem(GROWTH_KEY); } catch { /* Storage is optional. */ }
  growth = parseGrowth(raw, home.seed);
  const p = ((): Partial<GrowthSeen> => { try { const o = JSON.parse(raw ?? 'null'); return o && typeof o === 'object' && o.seen && typeof o.seen === 'object' ? o.seen as Partial<GrowthSeen> : {}; } catch { return {}; } })(), now = seenNow(), num = (x: unknown, d: number): number => (typeof x === 'number' && Number.isFinite(x) ? Math.max(0, Math.floor(x)) : d);
  // A fresh record begins today: the front starts the day it arrives, not with every day the village has lived; a saved one is brought up to today on the first frame.
  growthSeen = p.day !== undefined ? { day: Math.min(now.day, num(p.day, now.day)), taken: num(p.taken, now.taken), bred: num(p.bred, now.bred), eaten: num(p.eaten, now.eaten) } : now; }
let growthIdx: GrowthIndex = indexGrowth(growth, home.seed), growthStamp = serializeGrowth(growth);
/** C3: what each village's keeper knows of the front day over day: how far its nearest claimed hub stood at the last dawn's step, how much farther than at the one before (positive: receding), and whether the first push-back has been told. Kept beside `seen` in the growth's save. */
type FrontSeen = { d: number; change: number; pushed: boolean };
let fronts: Record<string, FrontSeen> = {};
{ try { const o = JSON.parse(localStorage.getItem(GROWTH_KEY) ?? 'null'); if (o && typeof o === 'object' && o.fronts && typeof o.fronts === 'object') for (const [k, f] of Object.entries(o.fronts as Record<string, Partial<FrontSeen>>)) if (ctxs.some(c => c.id === k) && f && typeof f === 'object' && typeof f.d === 'number' && Number.isFinite(f.d)) fronts[k] = { d: f.d, change: typeof f.change === 'number' && Number.isFinite(f.change) ? f.change : 0, pushed: f.pushed === true }; } catch { /* Storage is optional. */ } }
function saveGrowth(): void { try { localStorage.setItem(GROWTH_KEY, JSON.stringify({ ...JSON.parse(serializeGrowth(growth)) as object, seen: growthSeen, fronts })); } catch { /* Storage is optional. */ } }
/** The growth changed (a dawn's step, the dev handle): the index the land reads from is built again, once; the look and the roots are drawn again on the frame (growthDrawn), never per frame. */
/** C2: what the village model reads of the growth: its germs (each village's raid and snatcher source), and the warrens its warren germs stand at (poisoned). */
function tellGerms(g: Growth): void { setGerms(g.germs.map(x => ({ id: x.id, kind: x.kind, x: x.x, z: x.z }))); setPoisonedWarrens(g.germs.filter(x => x.kind === 'warren').map(x => x.id.slice('germ:'.length))); }
function setGrowth(g: Growth): void { growth = g; growthIdx = indexGrowth(g, home.seed); growthStamp = serializeGrowth(g); tellGerms(g); saveGrowth(); }
tellGerms(growth); setTurned(id => ctxs.find(c => c.id === id)?.v.turned ?? false);
/** C2 (CONTAGION.md, capture and germination), after each dawn's step: a village is held while the front's nearest claimed hub stands within HELD_M of its green (villageModel.setHeld fouls it); a village turned (TURN_DAYS held on her leavings) gets a lesser germ at its green, once (`v.germ`; a germ starved out is not added again, and the village stays turned: C3 un-turns); a warren the growth reaches, other than by its own germ, gets a warren germ (poisoned: villageModel.isPoisoned), healed when the growth withdraws. */
function holdStep(): void {
  let g = growth, changed = false;
  const sourceWas = new Map(ctxs.map(c => [c.id, germSource(c.v)?.id ?? null]));
  // C3: a poisoned warren's germ (reach 40 round a warren that may stand 60 m from the green) is a consequence of the front, not the front: held reads the growth with the warren germs taken out, else a warren's germ alone held and fouled a village the push had just freed (the germ is removed below on the same dawn, too late for the hold).
  const heldOn = removeGerms(growth, x => x.kind === 'warren', home.seed), heldIdx = heldOn === growth ? growthIdx : indexGrowth(heldOn, home.seed);
  for (const c of ctxs) { const f = nearestFront(heldIdx, c.ox, c.oz); setHeld(c.v, !!f && f.d < HELD_M); if (c.v.turned && !c.v.germ) { const id = `germ:${c.id}`; g = addGerm(g, { id, kind: 'village', x: c.ox, z: c.oz, reach: GERM_REACH.village }, home.seed); c.v.germ = id; changed = true; }
    // C3: un-turned (villageModel.unturn, at its dawn), its germ is taken away (the hubs only it claimed let go, their hyphae withered today), and the infants another village kept at its grove come home with its own.
    else if (!c.v.turned && c.v.germ) { const id = c.v.germ, was = removeGerms(g, x => x.id === id, home.seed); if (was !== g) { g = was; changed = true; } c.v.germ = null; for (const o of ctxs) if (o !== c && sourceWas.get(o.id) === id) homeBrood(o.v); } }
  const bare = removeGerms(g, x => x.kind === 'warren', home.seed), idx = bare === growth ? growthIdx : indexGrowth(bare, home.seed);
  for (const w of [...warrens(home.seed), ...ownWarrens(home.seed)]) { const id = `germ:${w.id}`, have = g.germs.some(x => x.id === id), reached = inGrowth(idx, w.x, w.z); if (reached && !have) { g = addGerm(g, { id, kind: 'warren', x: w.x, z: w.z, reach: GERM_REACH.warren }, home.seed); changed = true; } else if (!reached && have) { g = removeGerms(g, x => x.id === id, home.seed); changed = true; } }
  if (changed) setGrowth(g);
}
/** The dawn step's inputs from the live land: every village weighs its folk and its infants (WEIGHTS), each warren and each wallow 1; the woken ward, the sanctified groves and the karst's foot irritate (IRRITANT_R). */
/** `pushes` false (dev only: the CI's pace check) leaves the villages' pushes out. */
function growthInputs(pushes = true): { nourish: Nourish[]; irritants: Irritant[] } {
  const nourish: Nourish[] = [...ctxs.map(c => ({ x: c.ox, z: c.oz, w: c.v.hobbits.length * WEIGHTS.folk + c.v.hobbits.filter(h => h.stage === 'infant').length * WEIGHTS.infant })), ...[...warrens(home.seed), ...ownWarrens(home.seed)].map(w => ({ x: w.x, z: w.z, w: WEIGHTS.warren })), ...wallows(home.seed).map(w => ({ x: w.x, z: w.z, w: WEIGHTS.wallow }))];
  // C3: a thriving, shrined village is an irritant of VILLAGE_HOLD_R (villageModel.villageIrritant); 'steady' or 'pressured', none.
  const irritants: Irritant[] = [...(wardQuest.stage === 'woken' ? [{ x: firstWard.x, z: firstWard.z, r: IRRITANT_R.ward }] : []), ...ruins(home.seed).filter(r => overworld.sanctified.has(r.id)).map(r => ({ x: r.x, z: r.z, r: IRRITANT_R.grove })), { x: KARST_AT.x, z: KARST_AT.z, r: IRRITANT_R.karst }, ...(pushes ? ctxs.flatMap(c => { const i = villageIrritant(c.v); return i ? [i] : []; }) : [])];
  return { nourish, irritants };
}
/** One dawn: the step with what the raids brought since the last (the rise in the home village's infants taken, Dark Young bred and stores eaten). The dev handle's `starve` steps a growth made fed with nothing brought at all, so it withers (C1.1: unfed, it seeks and never starves). */
function dawnStep(starve = false, pushes = true): void {
  const now = seenNow(), d = starve ? { infantsTaken: 0, darkYoungBred: 0, meals: 0 } : { infantsTaken: Math.max(0, now.taken - growthSeen.taken), darkYoungBred: Math.max(0, now.bred - growthSeen.bred), meals: Math.max(0, now.eaten - growthSeen.eaten) };
  growthSeen = { ...now, day: growthSeen.day + 1 }; setGrowth(stepGrowth(starve ? { ...growth, fed: true } : growth, home.seed, { ...growthInputs(pushes), ...d })); holdStep();
  // C3: how the front moved for each village since the last dawn's step (its nearest claimed hub, farther or nearer), for the keeper's rumor, the panel's line and the first push-back's banner.
  for (const c of ctxs) { const f = nearestFront(growthIdx, c.ox, c.oz); if (!f) continue; const was = fronts[c.id], change = was ? f.d - was.d : 0, pushed = was?.pushed ?? false; fronts[c.id] = { d: f.d, change, pushed }; if (change > 0.5 && !pushed && was && was.d < FRONT_TELL_M) { fronts[c.id].pushed = true; if (c === ctx || overworld.known.has(c.id)) tellBanner(`Her growth draws back from ${c.i ? c.short : 'the village'}: the trees to the ${bearingWords(f.bearing)} are greening again`); } }
  saveGrowth();
}
/** Every village day that passed since the last step (several at once after a jump; the first carries the deltas, the rest none) steps the growth once. */
function stepGrowthToDay(): void { const day = dayOf(home_().v.tick); for (let n = 0; growthSeen.day < day && n < 400; n++) dawnStep(); }
setFront((x, z) => { const f = nearestFront(growthIdx, x, z); if (!f) return null; const c = ctxs.find(o => Math.abs(o.ox - x) < 1 && Math.abs(o.oz - z) < 1), fr = c ? fronts[c.id] : undefined; return { x: f.x, z: f.z, ...(fr ? { change: fr.change } : {}) }; });
/** In her growth the soil is poisoned: the grass will not take her (the roots are closed with the blight, below). */
const grassOpen = (x: number, z: number): boolean => grassCan(x, z) && !inGrowth(growthIdx, x, z) && walkable(plateau(home.seed), x, z);
const look: VillageLook | null = vistaLand ? createVillageLook({ taint: { at: { x: breach.x, z: breach.z }, ring: (x, z) => ringOf(growthIdx, x, z), depth: (x, z) => depthOf(growthIdx, x, z), vein: (x, z) => veinOf(growthIdx, x, z), veins: taintVeins(), hyphae: () => hyphaSegments(growthIdx), stamp: (x0, z0, x1, z1) => fieldStamp(growthIdx, x0, z0, x1, z1) }, landStamp: () => String(home_().v.blight), renderer, scene, camera, sun, hemi, vl: vistaLand, seed: home.seed, treesOf: chunks.treesOf, villages: () => ctxs.map(c => ({ root: c.world.root, x: c.ox, z: c.oz })), dark: (x, z) => biomeAt(x, z, home.seed) === 'dark', blighted: (x, z) => isBlighted(home_().v, x, z), clearings: yardClear }) : null;
if (look) { Object.assign(window, { __look: look }); chunks.setLook({ ground: false, trees: false }); for (const c of ctxs) c.world.root.traverse(o => { if (o.name === 'tree-wood' || o.name === 'tree-leaves' || o.name === 'tree-collar') o.visible = false; }); look.refreshClearing(); }
// PLATEAU.md: the rivers' water, the crossings and the island's old bridge.
const waterworks = buildWaterworks(look ? look.world.root : scene, plateau(home.seed), look ? look.world.uniforms : null);
const WARDS_KEY = 'rootwake-wards-read';
const wardRead = ((): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(WARDS_KEY) ?? '[]') as string[]); } catch { return new Set(); } })();
const wardField = createWardField(look ? look.world.root : scene, wardList, relief, wardRead, ids => { try { localStorage.setItem(WARDS_KEY, JSON.stringify([...ids])); } catch { /* Storage is optional. */ } });
let wardHere: string | null = null; const tmpWard = new THREE.Vector3();
const YARDS_KEY = 'rootwake-yards-read';
const yardRead = ((): Set<string> => { try { return new Set(JSON.parse(localStorage.getItem(YARDS_KEY) ?? '[]') as string[]); } catch { return new Set(); } })();
const industryField = createIndustryField(look ? look.world.root : scene, yardList, relief, yardRead, ids => { try { localStorage.setItem(YARDS_KEY, JSON.stringify([...ids])); } catch { /* Storage is optional. */ } });
let yardHere: string | null = null;
Object.assign(window, { __industry: { list: yardList, field: industryField } });
// R2 (RUINS.md): the first way in, the ward nearest her village; its quest kept in its own save, its interior an instance under it.
const firstWard = wardList.slice().sort((a, b) => Math.hypot(a.x, a.z) - Math.hypot(b.x, b.z))[0];
const QUEST_KEY = 'rootwake-ward-r2';
let wardQuest: Quest = ((): Quest => { try { return parseQuest(localStorage.getItem(QUEST_KEY), firstWard.id); } catch { return parseQuest(null, firstWard.id); } })();
const saveQuest = (): void => { try { localStorage.setItem(QUEST_KEY, JSON.stringify(wardQuest)); } catch { /* Storage is optional. */ } };
// On the scene, not the look's world: the look hides its world (the land) in an interior.
const wardInterior = createWardInterior(scene, firstWard);
let inWard = false, wardTalk = { snerk: false, crew: false, waiting: false, snerkWoken: false }; const fixClock = { t: 0 };
const syncWard = (): void => wardField.setState(firstWard.id, { cut: wardQuest.door / DOOR_CUTS, open: wardQuest.stage !== 'sealed', woken: wardQuest.stage === 'woken' });
syncWard();
/** Within this many metres of a woken ward the Colour falls back (its share at the ward). Tuning. */
const WARD_CALM_R = 170, WARD_CALM = 0.7;
const wardCalm = (x: number, z: number): number => { if (wardQuest.stage !== 'woken') return 0; const d = Math.hypot(x - firstWard.x, z - firstWard.z), k = Math.min(1, Math.max(0, (WARD_CALM_R - d) / (WARD_CALM_R - 50))); return WARD_CALM * k * k * (3 - 2 * k); };
Object.assign(window, { __wards: { list: wardList, field: wardField, get first() { return firstWard; }, get quest() { return wardQuest; }, get inside() { return inWard; }, interior: () => wardInterior, /** Dev: stand before the first ward's door. */ toDoor: () => { const d = firstWard.door, ox = -Math.sin(d.yaw), oz = -Math.cos(d.yaw); player.teleport(d.x - ox * 1.0, d.z - oz * 1.0, d.yaw, d.y); }, resetQuest: () => { wardQuest = parseQuest(null, firstWard.id); saveQuest(); syncWard(); } } });
Object.assign(window, { __plateau: { model: plateau(home.seed), waterworks, land: vistaLand ? { baked: vistaLand.baked, ms: Math.round(vistaLand.ms) } : null } });
let lookHuts = ctxs.reduce((n, c) => n + c.v.huts, 0);
// S4c (SETTLEMENTS.md §6): the steward's waking is answered: one den's pack turns dire, black and red-eyed, until it is slain asleep in its den.
function pickDire(): void { const first = ctxs.find(c => c.id === (steward.to ?? steward.at)) ?? home_(); steward.dire = chooseDire(dens(home.seed), greenOf(first), ctxs.map(greenOf), DEN_REACH_M); steward.direChosen = true; applyDire(); saveSteward(); }
function applyDire(): void { setDire(steward.dire, () => { steward.dire = null; saveSteward(); applyDire(); tellBanner('The black pack is slain in its den: the wolves that come to it now will be ordinary'); }); denField.setDire(steward.dire); }
if (steward.woken && !steward.direChosen) pickDire(); else applyDire();
// The lair (M1b): placed by the seed (overworldModel), told to the model and set in the scene.
const lairPlace = places(home.seed).find(p => p.id === 'lair')!; setDens(dens(home.seed).map(d => ({ id: d.id, x: d.x, z: d.z, pack: d.pack }))); setLair({ x: lairPlace.x, z: lairPlace.z, radius: lairPlace.radius }); home_().world.setLairAt(lairPlace.x, lairPlace.z);
/** Where she stands in the active village's frame. */
const herLocal = (): { x: number; z: number } => { const f = player.feet(); return { x: f.x - ctx.ox, z: f.z - ctx.oz }; };
/** A house of any village within `r` of a point on the land. */
const houseNear = (x: number, z: number, r: number): boolean => ctxs.some(c => Math.hypot(x - c.ox, z - c.oz) < 40 && housesOf(c.v).some(h => Math.hypot(x - c.ox - h.x, z - c.oz - h.z) < HOUSE_RADIUS + r));
/** The active village is the nearest to her feet; crossing over, her hands (the stack, an infant) go with her. Villages within NEAR_M are presented in full (the first within HOME_NEAR_M: its Dark Young, its snatchers and the mother's label reach out to the lair); farther, only their houses stand. Tuning. */
const NEAR_M = 300, HOME_NEAR_M = LAIR_DISTANCE + 250, SHOW_M = 700;
function pickActive(): void {
  const f = player.feet(); let best = ctxs[0], bd = Infinity; for (const c of ctxs) { const d = Math.hypot(f.x - c.ox, f.z - c.oz); if (d < bd) { bd = d; best = c; } }
  if (best === ctx) return; const prev = ctx; ctx = best; village = best.v; world = best.world;
  best.v.stack = prev.v.stack; prev.v.stack = null; best.v.carried = prev.v.carried; prev.v.carried = null; prev.world.setStation(null, time); prev.world.setStack(null, 0); lastStation = null; say(best.name, 3);
}
// eslint-disable-next-line @typescript-eslint/no-use-before-define
let karst: ReturnType<typeof createKarstFeature>;
/** The water depth the land refuses a body at: hers (WADE_DEPTH, a ford's shallows) unless a check sets another for its own call (her stag's wading, STAGS.md pass 4: `stagCanStand` in the mount block). */
let wadeLimit = WADE_DEPTH;
const walkableAt = (x: number, z: number): boolean => walkable(plateau(home.seed), x, z, wadeLimit);
const groundWorld: TraversalWorld = {
  // The land is unbounded: the meadow, and past it the chunks (chunkWorld), whose trees the model's lookups see through setTreeProvider.
  // The land is unbounded: the meadow, and past it the chunks (chunkWorld), whose trees the model's lookups see through setTreeProvider; where the karst stands, its own zone worlds are her ground (karstFeature).
  surfacesAt: (x, z) => (inWard ? wardInterior.surfacesAt(x, z) : karst.owns(x, z) ? karst.traversal().surfacesAt(x, z) : wardField.surfacesAt(x, z) ?? industryField.surfacesAt(x, z) ?? denField.surfacesAt(x, z) ?? [relief(x, z)]),
  canOccupy: (p, radius, height) => { if (inWard) return wardInterior.canOccupy(p, radius, height); if (karst.owns(p.x, p.z)) return karst.traversal().canOccupy(p, radius, height); const ward = wardField.canOccupy(p, radius, height); if (ward !== null) return ward && walkableAt(p.x, p.z); const yard = industryField.canOccupy(p, radius); if (yard !== null) return yard && walkableAt(p.x, p.z); const den = denField.canOccupy(p, radius, height); if (den !== null) return den; return p.y >= relief(p.x, p.z) - 0.03 && !houseNear(p.x, p.z, radius) && !treesNear(p.x, p.z, 6).some(t => Math.hypot(p.x - t.x, p.z - t.z) < trunkRadius(t) + radius) && walkableAt(p.x, p.z); },
};
// PLATEAU.md (Noah): the rivers are barriers, crossed at their fords, stepping stones and bridges; the lake rings the island, crossed by its old bridge. Underground (the roots) she passes beneath them.
/** While she is a bulge, a figure of leaves or a knot in a root, the shared motor stays put but the stick still speaks. */
const lockedWorld: TraversalWorld = { surfacesAt: () => [], canOccupy: () => false };
const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third'; player.traversalWorld = groundWorld;
// MOBILITY.md, parkour: the stick alone takes her up, over and down whatever the walk cannot (Noah, 2026-10-19).
player.motor.parkour = true;
const presentation = createHuldaPresentation(scene, home_().world.figure, home_().world.mass);
karst = createKarstFeature(scene, player, camera, KARST_AT, { orbit: (t, back, up, ease) => orbitCamera(t, back, up, ease), want: () => want(), ground: () => groundWorld, locked: lockedWorld, height: relief, portal: openPortal });
// The vista look draws the karst's trees itself (villageVista.villageTrees); the karst keeps their climbing and colliders.
if (look) scene.traverse(o => { if (o.name === 'karst-wood' || o.name.startsWith('karst-leaves-')) o.visible = false; });
{ const karstClear = player.cameraClear; player.cameraClear = p => (inWard ? wardInterior.cameraClear(p) : (!karstClear || karstClear(p)) && denField.cameraClear(p)); }
const hulda = presentation.hulda;
// STAGS.md: the tree stags step out of the twitching trees: the chunks' trees in her growth's grey ring (kind 9 in the look).
setTwitchingTrees((x, z, r) => chunks.treesNear(x, z, r).filter(t => ringOf(growthIdx, t.x, t.z) === 'grey'));
// STAGS.md (Noah): the rescued infant rides in a papoose on her back, small, so her own clips are kept: a bundle in a leaf-cloth pouch on the chest bone, slung by a strap over her shoulder, its face peeping over.
const papoose = (() => {
  const g = new THREE.Group(); g.name = 'papoose'; const k = 1 / (hulda.height / hulda.skeletonHeight), m = (v: number): number => v * k, ball = new THREE.SphereGeometry(1, 12, 9);
  const cloth = new THREE.MeshStandardMaterial({ color: '#7a6a3e', roughness: 0.95 }), strap = new THREE.MeshStandardMaterial({ color: '#5a4426', roughness: 0.9 }), face = new THREE.MeshStandardMaterial({ color: '#e8c8a8', roughness: 0.8 }), wrap = new THREE.MeshStandardMaterial({ color: '#efe6cc', roughness: 0.9 });
  const pouch = new THREE.Mesh(ball, cloth); pouch.scale.set(m(0.06), m(0.08), m(0.05)); pouch.position.set(0, m(0.0), m(-0.1)); g.add(pouch);
  const bundle = new THREE.Mesh(ball, wrap); bundle.scale.set(m(0.048), m(0.04), m(0.04)); bundle.position.set(0, m(0.07), m(-0.1)); g.add(bundle);
  const head = new THREE.Mesh(ball, face); head.scale.setScalar(m(0.025)); head.position.set(m(0.012), m(0.095), m(-0.095)); g.add(head);
  const band = new THREE.Mesh(new THREE.TorusGeometry(m(0.1), m(0.008), 5, 18), strap); band.rotation.set(Math.PI / 2, 0.5, 0); band.position.set(0, m(0.02), m(-0.02)); g.add(band);
  hulda.bones.get('mixamorigSpine2')?.add(g); g.visible = false; return g;
})();
// Her basket (basketFigure.ts, Noah, 2026-10-24): the stack in a woven basket on her back, small things of its kind, on the same bone.
const basket = (() => { const b = createBasket(1 / (hulda.height / hulda.skeletonHeight), STACK_CAP); hulda.bones.get('mixamorigSpine2')?.add(b.group); return b; })();
let knock = 0, knockWas = false; const knockTilt = new THREE.Quaternion(), xAxis = new THREE.Vector3(1, 0, 0);
// Hulda and the hobbits share the skeleton, so the Mixamo clips drive all nine (public/models/README.md).
const query = new URLSearchParams(location.search), clipUrls = query.get('clips')?.split(',').filter(Boolean) ?? __HULDA_CLIPS__, base = (c: string) => import.meta.env.BASE_URL + c;
let clipStatus: 'none' | 'loading' | 'ready' | 'failed' = clipUrls.length ? 'loading' : 'none', clipError = '';
if (clipUrls.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(clipUrls.map(base))).then(clips => { presentation.setClips(clips); stewardFig.setClips(clips); for (const c of ctxs) c.world.setFigureClips(clips); clipStatus = 'ready'; loadFightClips(); loadTraverseClips(); }, e => { clipStatus = 'failed'; clipError = String(e); console.warn('clips', e); });
// F2: her fight clips, after the gait's (they are only hers; `?fightclips=0` leaves her to F1's instant blows).
let fightClipStatus: 'none' | 'loading' | 'ready' | 'failed' = 'none';
// Her parkour's clips (huldaTraverse.ts): whichever of them are downloaded, and the jump; `?parkourclips=0` leaves her climbs to the gait.
let traverse: TraverseLayer | null = null;
function loadTraverseClips(): void {
  const urls = query.get('parkourclips') === '0' ? [] : __TRAVERSE_CLIPS__; if (!urls.length || !hulda.gait) return;
  import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(urls.map(base))).then(clips => { if (hulda.gait) traverse = createTraverseLayer(hulda.gait, hulda.rig, clips); }, e => console.warn('parkour clips', e));
}
function loadFightClips(): void {
  const urls = query.get('fightclips') === '0' ? [] : __FIGHT_CLIPS__; if (!urls.length || !hulda.gait) return; fightClipStatus = 'loading';
  import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(urls.map(base))).then(clips => { if (!hulda.gait) return; moves = createMoveLayer(hulda.gait, hulda.rig, clips); fightClipStatus = 'ready'; }, e => { fightClipStatus = 'failed'; console.warn('fight clips', e); });
}
for (const child of [...player.avatar.children]) player.avatar.remove(child);
player.teleport(0, -16, Math.PI); player.pitch = 0.08; installMobilityControls(player);
// PLATEAU.md (Noah, 2026-10-19): she wakes on the karst's summit, by the pool, looking out over the lake toward the first village (the fight's practice clearing places her itself).
if ((window as { __ROOTWAKE_PRACTICE?: boolean }).__ROOTWAKE_PRACTICE !== true) { karst.standOn('summit', -1.3, 0.5, Math.atan2(KARST_AT.x, KARST_AT.z)); player.pitch = 0.12; }
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
function resetVillage(): void { steward = freshSteward(mootPlace); setMoot(mootPlace, true); saveSteward(); applyDire(); for (const c of ctxs) freshCtx(c); shareHero(); setGrowth(removeGerms(growth, x => x.kind === 'village', home.seed)); tickBank = 0; course = null; courseTarget = null; carried = false; overworld.hints = []; for (const c of ctxs) { syncShown(c); pruneShown(c); c.shownSpirits.length = 0; for (const f of c.world.spiritFigures) f.visible = false; c.heardRumor = null; c.toldEvent = null; } save(); if (mapOpen) drawMap(); say('the villages begin again', 4); }

// Her ways through the meadow (the clearing's moves): into a trunk, up to the crown, across the crowns; under the
// grass as a bulge, free and fast; onto a tree root, faster still but held to its path; out by a double tap.
type Mode = 'ground' | 'trunk' | 'crown' | 'hop' | 'sink' | 'grass' | 'root' | 'rise' | 'faint' | 'karst' | 'meditate' | 'dive' | 'deep' | 'launch' | 'catwalk' | 'ride';
/** The deep's modes (G4): on the board, down the taproot, at the node, along a deep root. */
const inDeep = (m: Mode): boolean => m === 'meditate' || m === 'dive' || m === 'deep' || m === 'launch';
/** D1 (DESCENT.md): out of the drop, on the catwalk of the node's depth; she walks, but the land above is not hers. */
const underCap = (m: Mode): boolean => (inDeep(m) && m !== 'meditate') || inCatwalk(m);
/** On a catwalk: walking it, or at its portal's board. */
const inCatwalk = (m: Mode = mode): boolean => m === 'catwalk' || (m === 'meditate' && session?.from === 'catwalk');
/** T8: a shallow ride, under the soil along the grass or a surface root (and the sink into it and the rise out): the stratum is drawn under her, not in the deep, the dens, the catwalk or the karst's conduits. CAM_SOIL: how far under the surface the ride's camera may sink (m): within the soil, over the roots (0.5–1.5 m down) and the rock (SOIL_DEPTH, 2.6 m). Tuning. */
const shallow = (m: Mode): boolean => m === 'grass' || m === 'root' || m === 'sink' || m === 'rise', CAM_SOIL = 1.4;
let mode: Mode = 'ground', under = 0, press = 0, lastStickTap = -Infinity, stickDown = 0, stickDownAt = { x: 0, y: 0 };
let trunk: { tree: Tree; h: number; az: number; downHeld: number } | null = null;
let crown: { tree: Tree; az: number; armed: boolean } | null = null;
let hop: { from: THREE.Vector3; to: THREE.Vector3; t: number; tree: Tree; az: number } | null = null;
let grass: { x: number; z: number; heading: number } | null = null;
let root: { root: RootEdge; s: number; forward: boolean; off: number; exit?: boolean } | null = null;
let move: { from: THREE.Vector3; to: THREE.Vector3; t: number; seconds: number; then: () => void } | null = null;
// The course (R1): the place she chose, the way there, which of its roots she rides, and whether the roots are carrying her now. A tap's single meaning waits out the double tap's window (pendingTap).
let course: Course | null = null, courseTarget: { x: number; z: number } | null = null, courseAt = 0, carried = false, pendingTap = 0;
let blightDrawn = -1, growthDrawn = '', refreshMs = 0;
/** The last refresh's parts (ms) and what each drew again (`__village.growth.parts`). */
let refreshParts = { trees: 0, ground: 0, chunks: 0, roots: 0, total: 0, treeChunks: 0, groundTiles: 0, chunksRebuilt: 0, rootChunks: 0 };
/** D4/C1: the blight or her growth moved (at dawn): the land's trees and ground drawn again under it, the chunks' and the roots closed where it lies. Returns the time it took (the dawn hitch; `__village.growth.refreshMs`).
 * C1.1: each part redraws only what the field's stamp (contagionModel.fieldStamp, with the blight's reach) says moved: the look's trees by chunk and its ground by tile, the chunks by their square (its ground vertices reach the far edges, so inclusive), the roots by the chunks whose open roots changed; `full` redraws everything (dev: the check that the parts agree). */
function refreshLand(full = false): number {
  const t0 = performance.now(); blightDrawn = home_().v.blight; growthDrawn = growthStamp; const b = { blight: blightDrawn }, idx = growthIdx, hers = (x: number, z: number): boolean => isBlighted(b, x, z) || inGrowth(idx, x, z);
  const stamp = (cx: number, cz: number): string => `${blightDrawn}|${fieldStamp(idx, cx * CHUNK, cz * CHUNK, (cx + 1) * CHUNK, (cz + 1) * CHUNK)}`, p = { trees: 0, ground: 0, chunks: 0, roots: 0, total: 0, treeChunks: 0, groundTiles: 0, chunksRebuilt: 0, rootChunks: 0 };
  let t = performance.now(); if (look) { p.treeChunks = look.refreshTrees(full); p.trees = performance.now() - t; t = performance.now(); p.groundTiles = look.refreshGround(full); p.ground = performance.now() - t; }
  t = performance.now(); p.chunksRebuilt = chunks.setBlight(hers, stamp, full); p.chunks = performance.now() - t;
  t = performance.now(); network.setBlocked(hers); if (full) networkScene.reset(); p.rootChunks = networkScene.update(network.dynamic, network.closed); p.roots = performance.now() - t;
  if (mapOpen) drawMap();
  refreshParts = p; return (refreshMs = p.total = performance.now() - t0);
}
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
  // T8 (PLATEAU.md, the stratum): on a shallow ride the camera stays in the soil: behind her up a hillside it would sink into the hill, under the rock that now lies SOIL_DEPTH down; it is held no deeper than CAM_SOIL under the surface at its own spot.
  if (shallow(mode)) camWant.y = Math.max(camWant.y, relief(camWant.x, camWant.z) - CAM_SOIL);
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
function doubleTap(): void { if (mode === 'ground') { const f = player.feet(); if (loaded()) wobble = 0.6; else if (karst.zone !== 'floor' && karst.inside(f.x, f.z)) { if (karst.enterRootsNear(f) && mode === 'ground') mode = 'karst'; } else if (grassOpen(f.x, f.z)) enterGrass(f); else if (grassCan(f.x, f.z)) say('the soil here is poisoned: the grass will not take her'); } else if (mode === 'karst') karst.emerge(); else emerge(); }
/** One tap: in the grass the nearest root takes her (and the course, if one is plotted); in a root she is off it into the grass (a deep conduit carries her to a mouth first); at the entry tree, into the course; on a portal ride, off at the next mouth. */
function singleTap(): void {
  if (mode === 'grass' && grass) {
    const hit = network.nearest(grass, ROOT_REACH); if (!hit) { say(isBlighted(village, grass.x, grass.z) || inGrowth(growthIdx, grass.x, grass.z) ? 'the roots here are hers: they will not carry her' : 'no root within reach'); return; }
    const t = rootTangent(hit.root, hit.s), forward = t.x * -Math.sin(grass.heading) + t.z * -Math.cos(grass.heading) >= 0;
    root = { root: hit.root, s: hit.s, forward, off: 0 }; grass = null; mode = 'root'; if (courseTarget) resumeCourse();
  } else if (mode === 'root' && root) {
    carried = false; if (!(root.root as WorldRoot).surface) { emerge(); return; }
    const p = rootPoint(root.root, root.s); if (grassOpen(p.x, p.z)) { grass = { x: p.x, z: p.z, heading: player.yaw }; root = null; mode = 'grass'; }
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
const forestSky = new THREE.Color('#1a0e22'), taintSky = new THREE.Color('#5a0e4c');
/** M1: her breath's phase (0..1) and the taint where Hulda stands: its depth, how strongly the Colour shows, how far into the out-breath, how much her colours flare (in the mist, about the trees). */
let breath = 0, taintNow = { depth: 0, colour: 0, exhale: 0, flare: 0 };
/** Noah (2026-10-19): the mist that drifts in the taint and flushes with her colours; a tree now and then flaring on screen (its place, how long, its colour); the grey fog thinning now and then for a few seconds, when her arms can be glimpsed from afar. Tuning: SPOT_*, LIFT_*. */
const mist = createTaintMist(scene), SPOT_RATE = 0.35, SPOT_S = [0.6, 1.6], LIFT_EVERY = [45, 110], LIFT_S = 6;
let forceSpot = false, liftClear = 0, spot: { x: number; y: number; z: number; t: number; dur: number; hue: number } | null = null, liftIn = LIFT_EVERY[0] + Math.random() * (LIFT_EVERY[1] - LIFT_EVERY[0]), liftT = -1;
const spotV = new THREE.Vector3();
/** The flare about a tree and the fog's thinning, stepped each frame: returns what the look draws. */
function stepTaintFx(dt: number): { spot?: [number, number, number, number]; spotHue?: number; clear: number } {
  const { depth, flare } = taintNow; let clear = 0;
  if (depth > 0.05 && liftT < 0) { liftIn -= dt; if (liftIn <= 0) { liftT = 0; liftIn = LIFT_EVERY[0] + Math.random() * (LIFT_EVERY[1] - LIFT_EVERY[0]); } }
  if (liftT >= 0) { liftT += dt; clear = Math.sin(Math.min(1, liftT / LIFT_S) * Math.PI); if (liftT >= LIFT_S || depth <= 0) liftT = -1; }
  liftClear = clear;
  if (!spot && flare > 0 && (forceSpot || Math.random() < flare * SPOT_RATE * dt)) { const forcedDur = forceSpot ? 8 : 0; forceSpot = false;
    const c = camera.position, near = chunks.treesNear(c.x, c.z, 80).filter(t => { const d = Math.hypot(t.x - c.x, t.z - c.z); if (d < 8) return false; spotV.set(t.x, terrain.height(t.x, t.z) + 3, t.z).project(camera); return spotV.z < 1 && Math.abs(spotV.x) < 0.95 && Math.abs(spotV.y) < 0.9; });
    const t = near[Math.floor(Math.random() * near.length)]; if (t) spot = { x: t.x, y: terrain.height(t.x, t.z) + 3, z: t.z, t: 0, dur: forcedDur || SPOT_S[0] + Math.random() * (SPOT_S[1] - SPOT_S[0]), hue: Math.random() };
  }
  if (!spot) return { clear };
  spot.t += dt; if (spot.t >= spot.dur) { spot = null; return { clear }; }
  spotV.set(spot.x, spot.y, spot.z); const dist = spotV.distanceTo(camera.position); spotV.project(camera); if (spotV.z >= 1) return { clear };
  const k = Math.sin((spot.t / spot.dur) * Math.PI) ** 0.6 * (0.55 + 0.45 * flare);
  return { spot: [(spotV.x + 1) / 2, (spotV.y + 1) / 2, Math.min(0.35, 0.09 * 25 / Math.max(6, dist)), k], spotHue: spot.hue, clear };
}
const daySky = new THREE.Color('#a9bcae'), duskSky = new THREE.Color('#c9946a'), nightSky = new THREE.Color('#1d2836'), colour = new THREE.Color();
/** The way she last faced on screen (her stag rises facing it). */
let herYaw = 0;
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
const visualForward = new THREE.Vector3(0, 0, -1);
function presentHulda(dt: number): void {
  let form: HuldaForm = 'human';
  visualPosition.copy(player.feet());
  let heading = player.yaw; if ((mode === 'ground' || mode === 'catwalk') && player.motor.speed > 0.08) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  // F3: she faces the way she rolls, and in her guard, the foe she guards against.
  if (mode === 'ground' && dodge) heading = dodge.heading; else if (mode === 'ground' && guarding && locked) heading = Math.atan2(-(locked.x + ctx.ox - player.feet().x), -(locked.z + ctx.oz - player.feet().z));
  // Parkour: she faces the way the move goes (a hang drop turns her to the wall), and its clips pose her.
  // The mount (STAGS.md): mounting, the mount clip; after a collapse, the landing; riding, she faces the stag's way.
  const rp = ridePlan(), move = rp ? rp.plan : mode === 'ground' || mode === 'catwalk' ? player.motor.traversal : null; if (mode === 'ride') heading = rideHeading(); if (move?.face !== undefined) { heading = move.face; const l = leanAt(move, player.motor.traversalTime); visualPosition.x -= Math.sin(move.face) * l; visualPosition.z -= Math.cos(move.face) * l; }
  traverse?.update(dt, move, rp ? rp.t : player.motor.traversalTime); ridePose(dt);
  visualRotation.setFromAxisAngle(up, heading); herYaw = heading;
  if (mode === 'trunk' && trunk) { form = 'burl'; visualPosition.copy(world.trunkPoint(trunk.tree, trunk.h, trunk.az)); visualRotation.setFromAxisAngle(up, Math.PI / 2 - trunk.az); }
  else if (mode === 'crown' && crown) { form = 'leaf'; visualPosition.copy(world.crownPoint(crown.tree, crown.az)); }
  else if (mode === 'hop') form = 'leaf';
  else if (mode === 'grass' && grass) { form = 'ivy'; visualPosition.set(grass.x, relief(grass.x, grass.z) - 0.05, grass.z); visualRotation.setFromAxisAngle(up, grass.heading); }
  else if (mode === 'root' && root) { form = 'knot'; visualPosition.copy(rootPoint(root.root, root.s)); const t = rootTangent(root.root, root.s); if (!root.forward) t.negate(); visualRotation.setFromUnitVectors(visualForward, t.normalize()); }
  else if (mode === 'sink' || mode === 'rise' || mode === 'faint') form = 'ivy';
  const kv = mode === 'karst' ? karst.visual() : null; if (kv) { form = kv.form; visualPosition.copy(kv.position); visualRotation.copy(kv.rotation); }
  if (form === 'human' || form === 'leaf') visualPosition.y += HUMAN_CENTRE;
  // STAGS.md: knocked down, she falls on her back and lies there, then is up again.
  knock += (((village.hero.down ?? 0) > 0 && mode === 'ground' ? 1 : 0) - knock) * (1 - Math.exp(-dt * ((village.hero.down ?? 0) > 0 ? 12 : 5)));
  if (knock > 0.01 && form === 'human') { visualRotation.multiply(knockTilt.setFromAxisAngle(xAxis, knock * Math.PI * 0.48)); visualPosition.y -= HUMAN_CENTRE * 0.8 * knock; }
  if (mode === 'dive' || mode === 'launch') form = 'knot';
  // In the deep she is the camera: her figure, which only fades when hidden, is put far below it, or its leaves fill the view (Noah).
  if (inDeep(mode) && mode !== 'meditate') visualPosition.set(camera.position.x, camera.position.y - 40, camera.position.z);
  presentation.update(dt, form, visualPosition, visualRotation, player.motor.speed, heading, mode === 'ground' || mode === 'meditate' || mode === 'catwalk', (mode !== 'ground' && mode !== 'catwalk' && mode !== 'dive' && mode !== 'launch' && mode !== 'deep') || player.view === 'third', kv ? kv.present : form);
  player.avatar.visible = false;
}
// Her stations (W1): in a place's ring on her feet she collects into her stack, a unit every COLLECT_S; in a store's ring she delivers, one every DELIVER_S; before the stone the miracles are offered. A loaded stack refuses her other forms (a wobble says so).
let collectClock = 0, deliverClock = 0, wobble = 0, lastStation: string | null = null;
const miracles = el('miracles'), prayerEl = el('prayer'), tip = el('tip');
/** `dt` here is real time (capped at a quarter second), like the village's ticks: her collecting keeps its pace however slow the frames. */
function stations(dt: number): void {
  const l = herLocal(), st = mode === 'ground' ? stationAt(l.x, l.z) ?? siteStation(village, l.x, l.z) : null, id = st?.id ?? null;
  if (id !== lastStation) { collectClock = 0; deliverClock = 0; lastStation = id; }
  world.setStation(id, time);
  let say = '';
  if (st?.kind === 'gather' && st.keeps && YIELD_SITES.includes(st.keeps as YieldSite) && isSpoiled(village, st.keeps as YieldSite)) say = `${SITES[st.keeps].name} is spoiled`;
  else if (st?.kind === 'gather' && st.keeps) { const kind = YIELD_OF[st.keeps]!; collectClock += dt; while (collectClock >= COLLECT_S) { collectClock -= COLLECT_S; if (!collect(village, st.keeps)) { collectClock = 0; break; } } if (storeFull(village, kind)) say = `${STORES[kind].name} are full`; else if (village.stack && village.stack.kind !== kind) say = `her hands are full of ${STORES[village.stack.kind].unit}`; }
  else if (st?.kind === 'deliver' && st.store) { deliverClock += dt; while (deliverClock >= DELIVER_S) { deliverClock -= DELIVER_S; if (!deliver(village, st.store)) { deliverClock = 0; break; } } if (village.stack && village.stack.kind !== st.store) say = `${STORES[st.store].name} take ${STORES[st.store].unit}, not ${STORES[village.stack.kind].unit}`; else if (village.stack && storeFull(village, st.store)) say = `${STORES[st.store].name} are full`; }
  else if (st?.kind === 'site' && village.site) { deliverClock += dt; while (deliverClock >= DELIVER_S) { deliverClock -= DELIVER_S; if (!deliverToSite(village)) { deliverClock = 0; break; } } const need = `the hut needs wood ${siteNeeds(village, 'wood')} · water ${siteNeeds(village, 'water')}`; say = village.stack && village.stack.kind !== 'wood' && village.stack.kind !== 'water' ? `the hut takes wood and water, not ${STORES[village.stack.kind].unit}` : village.stack && siteNeeds(village, village.stack.kind as 'wood' | 'water') < 1 ? `the hut has its ${village.stack.kind}` : village.site.work < HUT_WORK_TICKS && siteNeeds(village, 'wood') < 1 && siteNeeds(village, 'water') < 1 ? `the hut is being built · ${Math.round(village.site.work / HUT_WORK_TICKS * 100)}%` : need; }
  if (mode === 'ground') { const held = village.raiders.find(r => r.rooted > 0 && r.held > 0 && r.state !== 'melting' && Math.hypot(r.x - l.x, r.z - l.z) <= HOLD_RANGE); if (held && held.id === village.hero.holding) say = `${held.state === 'retreating' ? `holding it · ${Math.ceil(HOLD_MELT_S - held.held)} s to melt` : 'holding it'} · sap ${Math.floor(village.hero.sap)}`; }
  // D3: an infant lying within reach is taken up; carried to its door it is home.
  // The sacs (MOTHER.md): standing at one with her hands empty she cuts it open, at a risk; then the infant is in her arms.
  if (mode === 'ground') { const cut = cutSac(village, l, dt); if (cut) { if (cut.p >= 1) { save(); sound.thud(true); } else say = `cutting ${cut.name} free · ${Math.round(cut.p * 100)}%${cut.marked ? ' · late: the child will be marked' : ''}`; } }
  if (mode === 'ground') { const r = carryInfant(village, l); if (r) save(); }
  if (!say && village.carried) say = `carrying ${hobbitById(village.carried.id).name} home to house ${village.carried.home + 1}`;
  if (!say && notice.until > time) say = notice.text;
  // On the board the tip stays off: it sat over the gems (Noah); what the board earns is said on the meditation panel.
  tip.hidden = !say || mode === 'meditate'; if (say) tip.textContent = say;
  if (!miracles.hidden) presentMiracles(st?.keeps ?? null, l);
  prayerEl.textContent = `prayer ${Math.floor(village.prayer)} / ${PRAYER_CAP}`; world.updatePrayer(village.prayer / PRAYER_CAP);
  wobble = Math.max(0, wobble - dt);
  // Her basket (Noah, 2026-10-24) on her back carries the stack, on foot and mounted; the village's old slabs stay hidden.
  world.setStack(null, 0); basket.set(mode === 'ground' || mode === 'ride' || mode === 'catwalk' ? village.stack?.kind ?? null : null, village.stack?.n ?? 0); basket.group.rotation.z = Math.sin(wobble * 20) * wobble * 0.5;
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
  { const gx = l.x + village.origin.x, gz = l.z + village.origin.z, w = [...warrenPlaces, ...ownWarrenPlaces].find(w => Math.hypot(w.x - gx, w.z - gz) <= WARREN_RADIUS); if (w) out.push({ kind: 'warren', id: w.id, den: w.den }); }
  return out;
}
function presentMiracles(keeps: SiteKind | null, l: { x: number; z: number }): void {
  const here = miraclesHere(keeps, l), key = here.map(miracleName).join('|');
  if (key !== miracleKey) { miracleKey = key; miracleList.replaceChildren(...here.map((m, i) => { const b = document.createElement('button'); b.dataset.miracle = String(i); b.append(document.createTextNode(miracleName(m) + ' '), document.createElement('i')); return b; })); (miracles.querySelector('.where') as HTMLElement).textContent = here.length ? '' : 'Stand at a yielding place, the stream, the leavings or a warren to work a miracle there'; }
  here.forEach((m, i) => { const b = miracleList.children[i] as HTMLButtonElement; b.disabled = !miracleReady(m) || (!instant(m) && !canChannel(deep)); b.querySelector('i')!.textContent = instant(m) ? 'nothing' : m.kind === 'warren' ? `no prayer · ${MIRACLE_CLARITY} clarity` : `${miracleCost(m)} prayer · ${MIRACLE_CLARITY} clarity`; });
  const near = villagerNear(), hero = stewardNear(), com = miracles.querySelector('[data-commune]') as HTMLButtonElement; com.disabled = !near && !hero; com.childNodes[0].textContent = hero ? `Commune with ${STEWARD_NAME} the steward ` : near ? `Commune with ${hobbitById(near.id).name} ` : 'Commune: stand by a villager or a hero '; com.querySelector('i')!.textContent = hero ? 'his panel' : near && hasNews(near) ? 'news' : '';
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
  const her = (mode === 'ground' || mode === 'ride') && village.hero.faint === 0 ? herLocal() : null;
  // Every village's raiders walk, hers with her in it; the others' without her (they are hunting its folk all the same).
  const vigorWas = village.hero.vigor, faintWas = village.hero.faint;
  const regen = regenRate(village.hero, deep.clarity / CLARITY_CAP); for (const c of ctxs) stepRaiders(c.v, simDt, c === ctx ? her : null, c === ctx, regen);
  // F1: a bite (a drop the forest's slow drain never makes in one step): the biter lunges, the camera jolts, her leaves fly, the screen's edge reddens.
  if (her && vigorWas - village.hero.vigor >= BITE_FELT && !defense.blocked) bitten(her, village.hero.faint > 0 && faintWas === 0);
  defended(her);
  for (const k of ['strike', 'thorn', 'root'] as const) { cooldown[k] = Math.max(0, cooldown[k] - dt * regen); const total = k === 'strike' ? STRIKE_CD : k === 'thorn' ? THORN_CD : ROOT_CD; fightEl[k].style.setProperty('--cd', String(cooldown[k] / total)); fightEl[k].classList.toggle('short', k !== 'strike' && village.hero.sap < (k === 'thorn' ? THORN_SAP : ROOT_SAP)); }
  fightEl.vigor.style.width = `${village.hero.vigor / vigorMax(village.hero) * 100}%`; fightEl.sap.style.width = `${village.hero.sap / sapMax(village.hero) * 100}%`;
  levelEl.textContent = `level ${village.hero.level}${village.hero.level < LEVEL_CAP ? ` · ${village.hero.xp}/${LEVEL_XP[village.hero.level]}` : ''}`; perksEl.hidden = village.hero.choices < 1; if (!perksEl.hidden) perksEl.querySelector('.title')!.textContent = `Level ${village.hero.level}: what grows in her? (${village.hero.choices} to choose)`;
  // The lair: shown, its hp over it while near; the forest's air darkens with the depth.
  { const h = home_(), f = player.feet(), d = Math.hypot(f.x - breach.x, f.z - breach.z); h.world.setLair(h.v.lair.alive, h.v.lair.hurt, time, h.v.lair.hp / LAIR_HP, Math.max(1 - Math.min(1, Math.max(0, (d - 150) / 100)), liftClear)); }
  // STAGS.md: knocked down by a tree stag she lies a moment and cannot move; up again, she can.
  { const down = (village.hero.down ?? 0) > 0 && mode === 'ground'; if (down) { player.canMove = false; player.motor.velocity.set(0, 0, 0); knockWas = true; } else if (knockWas) { knockWas = false; player.canMove = true; } }
  if (village.hero.faint > 0 && mode !== 'faint') { const l = herLocal(); dropCarried(village, l.x, l.z); lock(); mode = 'faint'; grass = null; root = null; trunk = null; crown = null; }
  if (mode === 'faint') { const p = player.feet(); place(p); orbitCamera(p, 3.2, 1.3); if (village.hero.faint === 0) { const st = SITES.shrine, a = Math.atan2(st.z, st.x), x = st.x - Math.cos(a) * 1.6, z = st.z - Math.sin(a) * 1.6; standOn(x + ctx.ox, z + ctx.oz, Math.atan2(-(st.x - x), -(st.z - z))); } }
  for (const c of ctxs) c.world.updateStrokes(dt);
}
/** F1: the least vigor lost in one step that is felt as a bite (the forest drains far less a step). Tuning. */
const BITE_FELT = 3;
const hurtEl = document.createElement('div'); hurtEl.id = 'hurt'; hurtEl.style.cssText = 'position:fixed;inset:0;z-index:3;pointer-events:none;opacity:0;background:radial-gradient(ellipse at 50% 50%,transparent 45%,#a01808cc 100%);'; document.body.append(hurtEl);
let hurtFlash = 0;
function bitten(her: { x: number; z: number }, fainted: boolean): void {
  let biter: Raider | null = null, bd = Infinity; for (const r of village.raiders) { if (r.state !== 'hunting') continue; const d = Math.hypot(r.x - her.x, r.z - her.z); if (d < bd) { bd = d; biter = r; } }
  const f = player.feet(), at = new THREE.Vector3(f.x, f.y + 0.45, f.z);
  moves?.flinch();
  if (biter && bd < 3) { const d = bd || 1, dx = (her.x - biter.x) / d, dz = (her.z - biter.z) / d; fx.spray(at, new THREE.Vector3(dx, 0, dz), 'leaf', 12, 2.4); }
  impact.hit(fainted ? 'faint' : 'hurt'); sound.hurt(); hurtFlash = fainted ? 1.6 : 1;
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
/** S2 (Noah, 2026-09-28): the heroes are met in commune: standing by the steward, commune opens his panel. */
const stewardNear = (): boolean => { if (!steward.woken) return false; const f = player.feet(); return Math.hypot(f.x - steward.x, f.z - steward.z) <= COMMUNE_R + 0.8; };
function communeNear(): boolean {
  if (stewardNear()) { stewardPanel.hidden = false; renderStewardPanel(); miracles.hidden = true; return true; }
  const s = villagerNear(); if (!s) return false; const r = commune(village, s, placeKnown), name = hobbitById(s.id).name;
  s.bubble = r.text; s.bubbleUntil = village.tick + RUMOR_TICKS * 3; lastCommune = `${name}: ${r.text}`; say(lastCommune, 6);
  if (r.hint && r.hint.bearing !== undefined && r.hint.about) { addHint(overworld, { about: r.hint.about === 'blight' ? 'lair' : r.hint.about, bearing: r.hint.bearing, text: r.hint.text, ...(ctx.i ? { from: { x: ctx.ox, z: ctx.oz } } : {}) }); if (mapOpen) drawMap(); }
  save(); return true;
}
// F1: the slash swings from alternate sides; a strike's arc sits at her waist.
let swingSide = 1; const SLASH_LIFT = 0.45;
/** Where a blow lands on a raider (its chest), in the scene's frame. */
function chestOf(r: { x: number; z: number; kind: string }): THREE.Vector3 { const x = r.x + ctx.ox, z = r.z + ctx.oz; return new THREE.Vector3(x, relief(x, z) + (r.kind === 'wolf' ? 0.5 : 0.95), z); }
const flecksOf = (r: Raider): Flecks => (r.kind === 'wolf' ? (isDire(r) ? 'dire' : 'fur') : 'ichor');
/** Any foe of hers still standing within `m` of her, in the village she is in. */
const foesNear = (m: number): number => { const l = herLocal(); return village.raiders.filter(r => r.state !== 'dead' && r.state !== 'melting' && r.state !== 'retreating' && r.state !== 'leaving' && Math.hypot(r.x - l.x, r.z - l.z) < m).length; };
/** What her blow did, read off the raiders' hp before and after it: each one hurt is driven back, flashes, sprays; the strongest decides the feel. */
function landBlows(before: Map<number, number>, heavy: boolean): Blow | null {
  const l = herLocal(); let worst: Blow | null = null; const rank: Blow[] = ['light', 'heavy', 'kill', 'finale'];
  for (const r of village.raiders) {
    const was = before.get(r.id); if (was === undefined || r.hp >= was) continue;
    const killed = r.hp <= 0, dx = r.x - l.x, dz = r.z - l.z, d = Math.hypot(dx, dz) || 1, dir = new THREE.Vector3(dx / d, 0, dz / d);
    world.react(r.id, dir.x, dir.z, (heavy ? 1.5 : 1) * (killed ? 1.6 : 1), killed && r.kind === 'wolf');
    fx.blow(chestOf(r), dir, flecksOf(r), heavy || killed, killed ? 34 : undefined);
    const b: Blow = killed ? (foesNear(25) === 0 ? 'finale' : 'kill') : heavy ? 'heavy' : 'light'; if (!worst || rank.indexOf(b) > rank.indexOf(worst)) worst = b;
  }
  if (worst) { impact.hit(worst); if (worst === 'kill' || worst === 'finale') sound.kill(); else sound.thud(heavy); }
  return worst;
}
type Act = 'strike' | 'heavy' | 'thorn' | 'root';
// F2: with her fight clips loaded, a press starts a move (huldaMoves.ts) and the blow lands at the move's contact; without them, at the press, as in F1.
let moves: MoveLayer | null = null, staffAt = -1e9;
const staff = createStaff(hulda.bones.get('mixamorigRightHand')!, { bark: '#e4dcb0', vine: HULDA_PALETTE.hair, leaf: HULDA_PALETTE.leaf, thorn: HULDA_PALETTE.hairDark, seed: '#c8ff7a' });
const trail = createTrail(scene);
/** F2: seconds the staff stays out after her last blow while nothing hunts her near; how near is near; the turn toward a foe at a press (a share of the angle, within FACE_REACH m and FACE_COS of her facing). Tuning. */
const STAFF_KEEP_S = 6, STAFF_NEAR_M = 12, FACE_REACH = 4, FACE_COS = 0.2, FACE_TURN = 0.8, HOLD_MS = 260;
/** Turn her toward the nearest foe ahead before a blow (a soft lock). */
function faceFoe(): void {
  const l = herLocal(), { fx: hx, fz: hz } = herFacing(); let best: Raider | null = locked && Math.hypot(locked.x - l.x, locked.z - l.z) < FACE_REACH ? locked : null, bd = best ? -1 : FACE_REACH;
  for (const r of village.raiders) { if (r.state === 'dead' || r.state === 'melting') continue; const dx = r.x - l.x, dz = r.z - l.z, d = Math.hypot(dx, dz); if (d < bd && (d < 0.6 || (dx * hx + dz * hz) / d > FACE_COS)) { bd = d; best = r; } }
  if (!best) return; const yaw = Math.atan2(-(best.x - l.x), -(best.z - l.z)); player.yaw += Math.atan2(Math.sin(yaw - player.yaw), Math.cos(yaw - player.yaw)) * FACE_TURN;
}
/** R2: a blow at the ward's door or within it; whether it struck something there. */
function wardBlow(f: THREE.Vector3, hx: number, hz: number, cuts: number): boolean {
  const at = new THREE.Vector3(f.x + hx * 0.9, f.y + 0.4, f.z + hz * 0.9), dir = new THREE.Vector3(hx, 0, hz);
  if (inWard) {
    const o = wardInterior.origin, r = blowInside(wardQuest, { x: f.x - o.x, y: f.y - o.y, z: f.z - o.z }, hx, hz, cuts); if (!r) return false;
    fx.blow(at, dir, r.kind === 'knot' ? 'ichor' : 'soil', !!r.done || cuts > 1); impact.hit(r.done ? 'heavy' : 'light'); sound.thud(cuts > 1);
    if (r.kind === 'knot' && r.done) tellBanner(CREW_LINES.cut); if (r.kind === 'mirror' && r.done) { tellBanner(WAKE_LINE); impact.hit('kill'); }
    saveQuest(); syncWard(); return true;
  }
  const w = wardField.atDoor(f, 1.4); if (!w || (f.x - w.door.x) * hx + (f.z - w.door.z) * hz > 0.3) return false;
  if (w.id !== firstWard.id) { say(DOOR_LINES.thick, 3); impact.hit('light', 0.5); return true; }
  const r = blowOutside(wardQuest, cuts); if (!r) return false;
  fx.blow(at, dir, 'ichor', cuts > 1); impact.hit(r.done ? 'heavy' : 'light'); sound.thud(cuts > 1);
  if (r.done) tellBanner(DOOR_LINES.open); else say(DOOR_LINES.cut, 2.5); saveQuest(); syncWard(); return true;
}
/** R2: in by the ward's door once its growth is cut; out by the vestibule's. */
function enterWard(): void { inWard = true; wardInterior.setVisible(true); wardInterior.update(wardQuest, player.feet(), time, 0); const e = wardInterior.entry(); player.teleport(e.x, e.z, e.yaw, e.y); say(`inside ${firstWard.name}`, 3); }
function leaveWard(): void { inWard = false; wardInterior.setVisible(false); const d = firstWard.door, ox = -Math.sin(d.yaw), oz = -Math.cos(d.yaw); player.teleport(d.x - ox * 0.85, d.z - oz * 0.85, d.yaw + Math.PI, d.y); say(firstWard.name, 3); }
function stepWard(dt: number): void {
  const f = player.feet();
  if (!inWard && wardQuest.stage !== 'sealed' && wardField.atDoor(f)?.id === firstWard.id) { enterWard(); return; }
  if (inWard && wardInterior.atExit(f)) { leaveWard(); return; }
  const before = wardQuest.stage, tr = stepFix(wardQuest, dt, fixClock);
  if (tr) { tellBanner(CREW_LINES.tries[tr - 1]); if (wardQuest.stage === 'woken') setTimeout(() => tellBanner(WAKE_LINE), 4000); saveQuest(); syncWard(); }
  if (before !== wardQuest.stage) { saveQuest(); syncWard(); }
  if (!inWard) return;
  wardInterior.update(wardQuest, f, time, dt);
  const o = wardInterior.origin, lx = f.x - o.x, lz = f.z - o.z, nearSnerk = Math.hypot(lx - SNERK_AT.x, lz - SNERK_AT.z) < 1.8, nearCrew = CREW_AT.some(c => Math.hypot(lx - c.x, lz - c.z) < 2.4);
  if (nearSnerk && !wardTalk.snerk) { wardTalk.snerk = true; tellBanner(wardQuest.stage === 'woken' ? SNERK_LINES.woken! : SNERK_LINES.first); wardQuest.met.snerk = true; saveQuest(); }
  if (!nearSnerk && wardTalk.snerk && wardQuest.stage === 'woken' && !wardTalk.snerkWoken) { wardTalk.snerkWoken = true; wardTalk.snerk = false; }
  if (nearCrew && !wardTalk.crew && (wardQuest.stage === 'open' || wardQuest.stage === 'woken')) { wardTalk.crew = true; tellBanner(wardQuest.stage === 'woken' ? CREW_LINES.woken : CREW_LINES.first); wardQuest.met.crew = true; saveQuest(); }
  if (nearCrew && !wardTalk.waiting && wardQuest.stage === 'powered') { wardTalk.waiting = true; tellBanner(CREW_LINES.waiting); }
  if (!nearCrew) { wardTalk.waiting = false; if (wardQuest.stage !== 'open') wardTalk.crew = false; }
}
/** The blow itself, at the moment it lands. */
function land(k: Act, mult = 1, heavy = false): void {
  if (mode !== 'ground' || village.hero.faint > 0) return; const f = player.feet(), her = herLocal(), { fx: hx, fz: hz } = herFacing();
  const before = new Map(village.raiders.map(r => [r.id, r.hp]));
  if ((k === 'strike' || k === 'heavy') && !moves) { swingSide = -swingSide; fx.slash(f, player.yaw, swingSide, SLASH_LIFT); sound.whoosh(swingSide); }
  // R2 (RUINS.md): a blow at a ward's door cuts its growth (the first ward's; the others' is too thick), and inside, the knot or a mirror.
  if ((k === 'strike' || k === 'heavy') && wardBlow(f, hx, hz, heavy ? 2 : 1)) return;
  // In a den by day the strike falls on the pack asleep (the delve's payoff): a wolf slain there is the den's loss and her level's gain.
  if ((k === 'strike' || k === 'heavy') && denField.inside && denField.current) { const r = denField.strikeAsleep(f, hx, hz, strikeDamage(village.hero) * mult); if (r.hit) { const at = new THREE.Vector3(f.x + hx * 1.1, f.y + 0.35, f.z + hz * 1.1), dir = new THREE.Vector3(hx, 0, hz); fx.blow(at, dir, 'fur', r.killed || heavy); impact.hit(r.killed ? 'kill' : heavy ? 'heavy' : 'light'); if (r.killed) sound.kill(); else sound.thud(heavy); } if (r.killed) { const known = denKnownBy(denField.current.id); if (known && slayAsleep(known.c.v, known.d)) { say('a wolf slain asleep in its den', 4); save(); } } return; }
  if (k === 'strike' || k === 'heavy') { strike(village, her, hx, hz, mult); landBlows(before, heavy); }
  else if (k === 'thorn') { const n = thornBurst(village, her); if (n < 0) return; cooldown.thorn = THORN_CD; fx.thorns(f, THORN_RANGE); sound.thorns(); if (!landBlows(before, true)) impact.hit('light', 0.8); }
  else { const r = rootBind(village, her); if (r === undefined) return; cooldown.root = ROOT_CD; sound.roots(); if (r) { const at = chestOf(r); at.y = relief(at.x, at.z) + 0.1; fx.spray(at, new THREE.Vector3(0, 0, 0), 'soil', 22, 3); fx.ring(at, 1.4, '#c9a24a'); world.react(r.id, 0, 0, 0); impact.hit('light', 0.7); } }
  save();
}
function attack(k: Act): void {
  if (mode !== 'ground' || village.hero.faint > 0) return;
  if (k === 'thorn' && (cooldown.thorn > 0 || village.hero.sap < THORN_SAP)) return;
  if (k === 'root' && (cooldown.root > 0 || village.hero.sap < ROOT_SAP)) return;
  if (moves) {
    faceFoe(); staff.show(true); staffAt = simSeconds;
    if (k === 'strike' || k === 'heavy') moves.press(k === 'heavy' ? 'heavy' : 'light');
    // A cast's cooldown starts at the press, so a second press cannot cast it twice; the sap is spent when it lands.
    else { cooldown[k] = k === 'thorn' ? THORN_CD : ROOT_CD; moves.press(k === 'thorn' ? 'burst' : 'bind'); }
    return;
  }
  if (k === 'strike' || k === 'heavy') { if (cooldown.strike > 0) return; cooldown.strike = STRIKE_CD * (k === 'heavy' ? HEAVY_MULT : 1); land(k, k === 'heavy' ? HEAVY_MULT : 1, k === 'heavy'); }
  else land(k);
}
/** A move's moments: the swing's sound as it starts, the blow at its contact. */
function moveEvent(e: MoveEvent): void {
  if (e.kind === 'start' && (e.move.startsWith('attack') || e.move === 'heavy')) { swingSide = -swingSide; sound.whoosh(swingSide); }
  if (e.kind !== 'contact') return;
  if (e.move === 'attack-1' || e.move === 'attack-2') land('strike');
  else if (e.move === 'attack-3') land('strike', FINISHER_MULT, true);
  else if (e.move === 'heavy') land('heavy', HEAVY_MULT, true);
  else if (e.move === 'cast-burst') land('thorn');
  else if (e.move === 'cast-bind') land('root');
}
// F3 (Noah, 2026-10-17): the guard. Held, she stands in her fighting stance facing the foe she is locked on, a bite takes GUARD_TAKE of itself, and the stick no longer walks: pushed past DODGE_PUSH it rolls her that way (relative to the camera), once per push. The button is meant to be her "down" for what comes later too: a crouch, diving, going under the soil.
/** The stick's push that rolls her; how far a roll carries her (m); her moves' pace in root time. Tuning. */
const DODGE_PUSH = 0.55, DODGE_DIST = 2.8, ROOT_FLURRY = 1.4;
const guardEl = el<HTMLButtonElement>('guard'); let guardHeld = false, guarding = false, guardTapped = false, stanceUntil = 0, dodgeArmed = true, dodge: { dx: number; dz: number; heading: number; p: number } | null = null;
guardEl.addEventListener('pointerdown', e => { e.preventDefault(); guardEl.setPointerCapture(e.pointerId); guardHeld = true; if (mode === 'ride') guardTapped = true; guardEl.classList.add('on'); sound.wake(); });
for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) guardEl.addEventListener(ev, () => { guardHeld = false; guardEl.classList.remove('on'); });
function guardFrame(): void {
  guarding = guardHeld && mode === 'ground' && village.hero.faint === 0;
  player.moveSlowdown = guarding || dodge ? 1e6 : 1;
  if (stanceUntil > simSeconds && mode === 'ground' && !dodge && player.gesture.held && Math.hypot(player.gesture.x, player.gesture.y) > 0.3) stanceUntil = 0;
  if (moves) moves.guard = guarding || (stanceUntil > simSeconds && mode === 'ground');
  defense.guarding = guarding && (!moves?.queue.current || moves.queue.current.move === 'hit');
  defense.evading = !!moves?.queue.evading;
  if (guarding) { staff.show(!!moves); staffAt = simSeconds; }
  const g = player.gesture, sx = g.held ? g.x : 0, sy = g.held ? g.y : 0, push = Math.hypot(sx, sy);
  if (push < 0.3) dodgeArmed = true;
  if (!guarding || !moves || !dodgeArmed || push < DODGE_PUSH || dodge) return;
  dodgeArmed = false; const yaw = player.yaw, right = sx / push, fwd = -sy / push;
  const dx = Math.cos(yaw) * right - Math.sin(yaw) * fwd, dz = -Math.sin(yaw) * right - Math.cos(yaw) * fwd;
  if (moves.press('dodge')) { dodge = { dx, dz, heading: Math.atan2(-dx, -dz), p: 0 }; sound.roll(); }
}
/** The roll carries her along the dive's own travel; it ends with the move. */
function rollFrame(): void {
  if (!dodge) return; const c = moves?.queue.current;
  if (!c || c.move !== 'dodge' || mode !== 'ground') { dodge = null; return; }
  const p = dodgeProgress(c.t), step = (p - dodge.p) * DODGE_DIST; dodge.p = p;
  if (step > 0) player.slide(dodge.dx * step, dodge.dz * step);
  // A puff of soil where she lands and rolls.
  if (c.t > 1.15 && c.t < 1.3 && Math.random() < 0.5) { const f = player.feet(); fx.spray(new THREE.Vector3(f.x, f.y + 0.05, f.z), new THREE.Vector3(-dodge.dx, 0, -dodge.dz), 'soil', 3, 1.4); }
}
// The lock: the foe hunting her that is nearest (within LOCK_M), ringed on the ground; her blows and her guard turn to it.
const LOCK_M = 9; let locked: Raider | null = null;
const lockRing = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.74, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#d8f07a', transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
lockRing.renderOrder = 4; lockRing.visible = false; scene.add(lockRing);
const tellWas = new Map<number, number>();
function lockFrame(dt: number): void {
  const l = herLocal(); let best: Raider | null = null, bd = LOCK_M;
  if (mode === 'ground') for (const r of village.raiders) { if (r.state !== 'hunting') continue; const d = Math.hypot(r.x - l.x, r.z - l.z); if (d < bd) { bd = d; best = r; } }
  locked = best; lockRing.visible = !!best;
  if (best) { const x = best.x + ctx.ox, z = best.z + ctx.oz, t = tellOf(best), sc = best.kind === 'wolf' ? 1 : 1.6; lockRing.position.set(x, relief(x, z) + 0.06, z); lockRing.scale.setScalar(sc * (1 + Math.sin(time * 0.008) * 0.05 + t * 0.25)); (lockRing.material as THREE.MeshBasicMaterial).color.set(t > 0 ? '#ff7a3a' : '#d8f07a'); }
  // The tells: as one begins, its eyes flare and it snarls.
  for (const r of village.raiders) { const t = tellOf(r), was = tellWas.get(r.id) ?? 0; if (t > 0 && was === 0 && Math.hypot(r.x - l.x, r.z - l.z) < 12) { const x = r.x + ctx.ox, z = r.z + ctx.oz, k = r.kind === 'wolf' ? 0.85 : 1.3, y = relief(x, z) + (r.kind === 'wolf' ? 0.72 : 1.35); fx.glint(new THREE.Vector3(x + Math.cos(r.heading) * k, y, z + Math.sin(r.heading) * k), r.kind === 'wolf' ? (isDire(r) ? '#c8ff40' : '#ffd040') : '#d8ff60', r.kind === 'wolf' ? 0.4 : 0.6); sound.growl(); } tellWas.set(r.id, t); }
  void dt;
}
// Root time: the screen's edge greens over and roots creep in from it.
const rootEl = document.createElement('div'); rootEl.id = 'rootTime';
{ const svg = ['<svg viewBox="0 0 100 100" preserveAspectRatio="none">']; const rnd = mulberry32(31);
  // Roots that curl in from the edges, thick where they enter and forking as they reach in.
  const root = (x: number, y: number, a: number, len: number, w: number, depth: number): void => {
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`; const seg = 4;
    for (let k = 0; k < seg; k++) { a += (rnd() - 0.5) * 0.9; const l = len / seg, cx = x + Math.cos(a) * l * 0.6 + (rnd() - 0.5) * 3, cy = y + Math.sin(a) * l * 0.6 + (rnd() - 0.5) * 3; x += Math.cos(a) * l; y += Math.sin(a) * l; d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
      if (depth > 0 && rnd() < 0.35) root(x, y, a + (rnd() < 0.5 ? -1 : 1) * (0.5 + rnd() * 0.6), len * 0.5, w * 0.6, depth - 1); }
    svg.push(`<path d="${d}" stroke="#c8d878" stroke-opacity=".45" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:${w.toFixed(1)}px"/>`);
  };
  for (let i = 0; i < 12; i++) { const side = i % 4, t = 0.08 + rnd() * 0.84, x = side === 0 ? 0 : side === 1 ? 100 : t * 100, y = side === 2 ? 0 : side === 3 ? 100 : t * 100, a = side === 0 ? 0 : side === 1 ? Math.PI : side === 2 ? Math.PI / 2 : -Math.PI / 2; root(x, y, a + (rnd() - 0.5) * 0.6, 9 + rnd() * 8, 5 + rnd() * 4, 1); }
  svg.push('</svg>'); rootEl.innerHTML = svg.join(''); document.body.append(rootEl); }
/** What her defence met this step: the lunges (shown), a bite taken on her guard, a bite rolled clear of as it landed (root time). */
function defended(her: { x: number; z: number } | null): void {
  for (const id of defense.lunges) { const r = village.raiders.find(x => x.id === id); if (!r || !her) continue; const d = Math.hypot(her.x - r.x, her.z - r.z) || 1; world.lunge(r.id, (her.x - r.x) / d, (her.z - r.z) / d); }
  const f = player.feet();
  if (defense.blocked && her) { const r = locked ?? village.raiders.find(x => defense.lunges.includes(x.id)); const dir = r ? new THREE.Vector3(r.x - her.x, 0, r.z - her.z).normalize() : new THREE.Vector3(0, 0, -1); fx.blow(new THREE.Vector3(f.x + dir.x * 0.45, f.y + 0.5, f.z + dir.z * 0.45), dir, 'leaf', false, 8); impact.hit('light'); sound.block(); }
  if (defense.dodged && her) { impact.rootTime(); impact.kick = -4; sound.rootTime(); fx.ring(f, 3.2, '#d8f07a'); say('root time', 1.5); }
  defense.lunges.length = 0; defense.blocked = 0; defense.dodged = 0;
}
/** Before her figure is posed: the moves advance (their contacts land), the staff withdraws when the fight is over. */
function stepMoves(dt: number): void {
  guardFrame();
  if (moves) { const moving = THREE.MathUtils.clamp((player.motor.speed - 0.3) / 1.2, 0, 1); for (const e of moves.update(dt * (impact.root > 0 ? ROOT_FLURRY : 1), mode === 'ground' ? moving : 0)) moveEvent(e); }
  defense.evading = !!moves?.queue.evading;
  rollFrame();
  if (staff.shown && (mode !== 'ground' || (simSeconds - staffAt > STAFF_KEEP_S && !moves?.queue.busy && foesNear(STAFF_NEAR_M) === 0))) staff.show(false);
  staff.update(dt);
}
const trailHead = new THREE.Vector3(), trailInner = new THREE.Vector3();
/** After her figure is posed: the trail follows the staff's head through a swing. */
function trailMoves(dt: number): void {
  const c = moves?.queue.current, spec = c ? MOVES[c.move] : null;
  const on = !!c && !!spec && staff.grown > 0.6 && (c.move.startsWith('attack') || c.move === 'heavy') && c.t >= spec.from + (spec.contact - spec.from) * 0.35 && c.t <= spec.chain;
  if (on || trail.mesh.visible) { staff.head(trailHead); staff.inner(trailInner); trail.sample(trailHead, trailInner, on); }
  trail.update(dt);
}
// The strike: a tap is a light blow (on the press, without waiting), held past HOLD_MS it is the heavy blow too.
{ let hold = 0; const b = fightEl.strike; const up = () => { clearTimeout(hold); hold = 0; };
  b.addEventListener('pointerdown', e => { e.preventDefault(); attack('strike'); clearTimeout(hold); hold = window.setTimeout(() => { hold = 0; if (moves) attack('heavy'); }, HOLD_MS); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) b.addEventListener(ev, up); }
for (const k of ['thorn', 'root'] as const) fightEl[k].addEventListener('pointerdown', e => { e.preventDefault(); attack(k); });
// The Dark Young shown from the model, with a name and an hp bar over each while near.
/** C2: the keepers' ids, past any raider's. */
const KEEPER_ID = 100000;
/** The sacs (MOTHER.md): a sac that splits while she stands within HATCH_AGGRO, its Dark Young comes for her. */
const hatchSeen = new Set<string>();
function hatchAt(v: Village, her: { x: number; z: number }): void {
  for (const h of v.hatched) { if (hatchSeen.has(h.id + h.tick)) continue; hatchSeen.add(h.id + h.tick); if (Math.hypot(h.x - her.x, h.z - her.z) > HATCH_AGGRO || v.raiders.some(r => r.infant?.id === h.id)) continue; const r = spawnFoe(v, 'dy', h.x + 1, h.z + 1, DY_AGGRO_S * 4), ref = v.bred.find(b => b.id === h.id); if (ref) r.infant = ref; sound.growl(); }
}
/** The snatchers' voices (Noah, 2026-10-22): running, now and then a kid's bleat; at a door, an infant's cry (its mimicry); hidden, nothing. By distance and side. */
const voiceClock = new Map<number, number>();
function snatcherVoices(v: Village, dt: number): void {
  const f = player.feet(), ox = ctx.ox, oz = ctx.oz;
  for (const n of v.snatchers) {
    const t = (voiceClock.get(n.id) ?? 1 + Math.random() * 3) - dt; if (t > 0) { voiceClock.set(n.id, t); continue; }
    const dx = n.x + ox - f.x, dz = n.z + oz - f.z, d = Math.hypot(dx, dz), near = Math.max(0, 1 - d / VOICE_M), pan = Math.max(-1, Math.min(1, (dx * Math.cos(player.yaw) - dz * Math.sin(player.yaw)) / (d || 1)));
    if (!hidden(n) && near > 0) { if (n.state === 'taking') sound.cry(near, pan); else sound.bleat(near, pan); }
    voiceClock.set(n.id, n.state === 'taking' ? 1.6 + Math.random() : 3 + Math.random() * 4);
  }
}
/** How far a snatcher's voice carries (m). Tuning. */
const VOICE_M = 70;
const stagWas = new Map<number, { x: number; z: number }>();
function presentRaiders(c: Ctx, dt: number): void {
  const seen = new Set<number>(), village = c.v, world = c.world, raiderLabels = c.raiderLabels, smallLabels = c.smallLabels, relief = c.world.relief, ox = c.ox, oz = c.oz;
  // C2: by day the Dark Young bred of a village whose germ is a turned village's stand about that green (keepers, not raiders; shown, not fought: C3), in the village's own frame at its source's grove.
  const src = germSource(village), keepers: Raider[] = src && src.kind === 'village' && daylightAt(village.tick) > 0.05 ? atHome(village).map((inf, i) => { const p = keeperSpot(i * 3 + (village.folk % 3)); return { id: KEEPER_ID + i, x: src.x - ox + p.x, z: src.z - oz + p.z, heading: Math.atan2(-p.z, -p.x), hp: DY_HP, state: 'coming' as RaiderState, target: null, ate: 0, eatClock: 0, aggro: 0, rooted: 0, biteClock: 0, hurt: 0, gone: 0, site: null, devourClock: 0, held: 0, infant: inf, kind: 'dy' as RaiderKind, den: null, prey: null }; }) : [];
  for (const r of [...village.raiders, ...keepers]) {
    seen.add(r.id); const moving = r.state === 'coming' || r.state === 'hunting' || r.state === 'leaving' || r.state === 'retreating', dead = r.state === 'dead' || r.state === 'melting' ? r.gone : 0;
    const tell = tellOf(r);
    if (r.kind === 'stag') { const was = stagWas.get(r.id) ?? { x: r.x, z: r.z }, sp = dt > 0 ? Math.hypot(r.x - was.x, r.z - was.z) / dt : 0; stagWas.set(r.id, { x: r.x, z: r.z }); world.setStag(r.id, r.x, r.z, { moving: sp > 0.05, speed: Math.min(sp, STAG_CHARGE * 1.2), heading: r.heading, hurt: r.hurt, rooted: r.rooted, inTree: inTree(r), emerging: r.stag?.phase === 'emerge', tell, pulse: exhaleAt(breath), attention: home_().v.lair.attention }, time); }
    else if (r.kind === 'wolf') world.setWolf(r.id, r.x, r.z, r.heading, time, moving, r.hurt, r.rooted, dead, isDire(r), tell); else world.setRaider(r.id, r.x, r.z, r.heading, time, moving, r.hurt, r.rooted, dead, r.state === 'retreating' || r.state === 'leaving', tell, r.state === 'eating' || r.state === 'devouring');
    let l = raiderLabels.get(r.id); if (!l) { const label = document.createElement('div'); label.className = 'name foe'; label.append(document.createTextNode('dark young')); const meter = document.createElement('i'); meter.className = 'hunger'; const hp = document.createElement('b'); meter.append(hp); label.append(meter); labels.append(label); l = { label, hp }; raiderLabels.set(r.id, l); }
    tmp.set(r.x + ox, relief(r.x, r.z) + 1.9, r.z + oz); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = r.state !== 'dead' && r.state !== 'melting' && !(r.kind === 'stag' && (inTree(r) || r.stag?.omen && r.state !== 'hunting')) && tmp.z < 1 && dist < 22 && Math.abs(tmp.x) < 1.1;
    l.label.hidden = !show; if (show) { const x = (tmp.x + 1) * innerWidth / 2, y = (1 - tmp.y) * innerHeight / 2; l.label.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; l.label.style.opacity = '1'; l.hp.style.width = `${r.hp / (r.kind === 'wolf' ? (isDire(r) ? DIRE_HP : WOLF_HP) : r.kind === 'stag' ? STAG_HP : DY_HP) * 100}%`; l.hp.style.background = '#e0603a'; l.label.firstChild!.textContent = r.kind === 'stag' ? `tree stag${r.state === 'hunting' ? ' · hunting' : r.state === 'retreating' ? ' · going back into the trees' : ''}` : r.kind === 'wolf' ? `${isDire(r) ? 'black wolf' : 'wolf'}${r.state === 'hunting' ? ' · hunting' : r.state === 'leaving' ? ' · leaving' : ''}` : r.state === 'retreating' ? (r.rooted > 0 ? 'dark young · held' : 'dark young · fleeing') : r.state === 'devouring' ? 'dark young · devouring' : r.id >= KEEPER_ID ? 'dark young · keeping' : 'dark young'; }
  }
  for (const [id, l] of raiderLabels) if (!seen.has(id)) { l.label.remove(); raiderLabels.delete(id); world.hideRaider(id); }
  // D3: the snatchers, named only within a few metres; the infants lying out, named from farther; the one in her arms.
  const ids = new Set<number>(); for (const n of village.snatchers) { ids.add(n.id); const hid = hidden(n); world.setSnatcher(n.id, { x: hid ? n.cx : n.x, z: hid ? n.cz : n.z, heading: n.heading, moving: !hid && n.state !== 'taking', taking: n.state === 'taking', carrying: !!n.infant, cover: n.cover, hidden: hid, size: n.cs, rooted: !!n.rooted }, time); } world.hideSnatchersBut(ids);
  if (c === ctx) snatcherVoices(village, dt);
  world.setTrail(village.trail.map(m => ({ x: m.x, z: m.z, a: m.a, age: (village.tick - m.tick) / TRAIL_TICKS, key: `${m.tick}:${m.x}:${m.z}` })));
  const f = player.feet(), fl = { x: f.x - ox, z: f.z - oz }; const kept = sacsOf(village); world.setSacs(kept, time, village.hatched.map(h => ({ x: h.x, z: h.z, age: (village.tick - h.tick) / TICKS_PER_SECOND }))); if (c === ctx) hatchAt(village, fl); world.setInfants([...village.dropped], null); if (c === ctx) papoose.visible = !!village.carried && mode !== 'faint';
  const near = [...village.snatchers.filter(n => !hidden(n) && Math.hypot(n.x - fl.x, n.z - fl.z) < 6).map(n => ({ x: n.x, z: n.z, h: 0.6, text: n.rooted ? 'something small · held' : n.infant ? `something small, with ${hobbitById(n.infant.id).name}` : 'something small' })), ...village.dropped.map(d => ({ x: d.x, z: d.z, h: 0.5, text: hobbitById(d.infant.id).name })), ...kept.map(k => ({ x: k.x, z: k.z, h: 2.7 + 0.5 * k.stage, text: `${k.name}, in a sac${k.cut > 0 ? ` · cut ${Math.round(k.cut * 100)}%` : k.stage > 0.66 ? ' · near its time' : k.stage > 0.33 ? ' · darkening' : ''}` }))];
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
    tmp.set(KARST_AT.x + p.x, p.height + 3, KARST_AT.z + p.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = !underCap(mode) && tmp.z < 1 && dist < KARST_LABEL_M && Math.abs(tmp.x) < 1.1 && Math.abs(tmp.y) < 1.1;
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
const lairLabel = document.createElement('div'); lairLabel.className = 'name foe lair'; lairLabel.textContent = 'the mother of goats'; const lairMeter = document.createElement('i'); lairMeter.className = 'hunger'; const lairHp = document.createElement('b'); lairMeter.append(lairHp); lairLabel.append(lairMeter); lairMeter.hidden = true; /* M1: she cannot be hurt in this phase: no bar */ lairLabel.hidden = true; labels.append(lairLabel);
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
type Still = { kind: 'pool' } | { kind: 'shrine'; c: Ctx } | { kind: 'convergence'; place: DeepPlace } | { kind: 'grove'; place: DeepPlace } | { kind: 'brink'; place: DeepPlace } | { kind: 'ruin'; ruin: Ruin } | { kind: 'moot' };
/** T6: how near a brink's ring she must stand to take its deep root back down. Tuning. */
const BRINK_R = 7;
/** G3b: how near a ruin's basin she stands to sanctify it, or to meditate at the grove. Tuning. */
const RUIN_R = 3.5;
type Miracle = { kind: 'quicken'; site: YieldSite } | { kind: 'purify'; target: PurifyTarget } | { kind: 'spirit'; keeps: SiteKind } | { kind: 'hedge'; x: number; z: number } | { kind: 'dispel'; x: number; z: number } | /** S1: the warren she stands at, quickened for clarity alone (Noah: no prayer). */ { kind: 'warren'; id: string; den: string };
let session: { kind: 'meditate' | 'deepen' | 'channel' | 'sanctify' | 'cultivate' | 'wake' | 'portal'; points: number; at: THREE.Vector3; gained?: number; miracle?: Miracle; ruin?: Ruin; /** PLATEAU.md T5: where she sat down (a portal's board is played on a catwalk too), and which way the portal takes her. */ from?: Mode; dir?: 'in' | 'out' } | null = null, deepMove: { curve: THREE.Curve<THREE.Vector3>; t: number; seconds: number; then: () => void } | null = null, deepTo: DeepPlace | null = null;
const shrinedCount = (): number => ctxs.filter(c => isShrined(c.v)).length;
/** The deep roots' ends on the surface: the pool; every shrined village's stone; and a root convergence (the root network's hub nearest it) for every place she knows. */
function deepPlaces(): DeepPlace[] {
  const out: DeepPlace[] = [{ id: 'pool', kind: 'pool', name: 'the crystal pool', x: karst.poolAt.x, z: karst.poolAt.z }];
  for (const c of ctxs) if (isShrined(c.v)) out.push({ id: `shrine:${c.id}`, kind: 'shrine', name: `the stone of ${c.i ? c.short : 'the village'}`, x: c.ox + SITES.shrine.x, z: c.oz + SITES.shrine.z });
  // The convergences (chunkModel): a fairy ring at the hub of every place's chunk; hers to use once she knows the place it serves.
  for (const c of convergences(home.seed)) if (overworld.known.has(c.about)) out.push({ id: c.id, kind: 'convergence', name: c.name, x: c.x, z: c.z });
  // G3b: the groves: every ruin she has sanctified.
  for (const r of groves(overworld)) out.push({ id: `grove:${r.id}`, kind: 'grove', name: `the grove at ${r.name}`, x: r.x, z: r.z });
  // T6: the brinks, where the passes end at the belt's crest: hers from the first.
  for (const b of plateau(home.seed).brinks) out.push({ id: b.id, kind: 'brink', name: b.name, x: b.x, z: b.z });
  return out;
}
const nodeAt = (): THREE.Vector3 => new THREE.Vector3(KARST_AT.x, terrain.height(KARST_AT.x, KARST_AT.z) - nodeDepth(deep), KARST_AT.z);
function stillPlace(): Still | null {
  if (mode !== 'ground') return null; const f = player.feet(); if (karst.atPool(f)) return { kind: 'pool' };
  for (const c of ctxs) if (isShrined(c.v) && Math.hypot(f.x - c.ox - SITES.shrine.x, f.z - c.oz - SITES.shrine.z) <= SHRINE_R) return { kind: 'shrine', c };
  const conv = deepPlaces().find(p => p.kind === 'convergence' && Math.hypot(p.x - f.x, p.z - f.z) <= CONV_R); if (conv) return { kind: 'convergence', place: conv };
  const brink = deepPlaces().find(p => p.kind === 'brink' && Math.hypot(p.x - f.x, p.z - f.z) <= BRINK_R); if (brink) return { kind: 'brink', place: brink };
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
  const ok = m.kind === 'warren' ? (() => { if (m.den === '') { const w = ownWarrenPlaces.find(x => x.id === m.id); return !!w && quickenWarren(ownerOf(w).v, ''); } const k = denKnownBy(m.den); return !!k && quickenWarren(k.c.v, m.den); })() : m.kind === 'quicken' ? quicken(village, m.site) : m.kind === 'purify' ? purify(village, m.target) : m.kind === 'hedge' ? growHedge(village, m.x, m.z) : m.kind === 'dispel' ? dispelHedge(village, m.x, m.z) : !!summonSpirit(village, m.keeps);
  bannerEl.textContent = ok ? (m.kind === 'warren' ? 'The warren is quickened: rabbits run everywhere' : `${miracleName(m)[0].toUpperCase()}${miracleName(m).slice(1)}: the prayer is spent and it is done`) : `${miracleName(m)}: it could not be worked`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; if (ok) { chunks.refreshRabbits(); save(); }
}
/** Noah (2026-10-19): a session ended from inside a run (the last gems of a portal, a waking, a cultivation) ends while the board is still cascading; it closes as soon as the board is still (endWhenIdle, each frame), then `afterEnd` (the portal's passage) runs. */
let endWhenIdle = false, afterEnd: (() => void) | null = null;
function endSession(): void { if (mode !== 'meditate') return; if (boardView.isBusy) { endWhenIdle = true; return; } endWhenIdle = false; boardView.hide(); boardView.unbind(); player.enabled = true; player.cancelInput(); mode = session?.from ?? 'ground'; if (session?.kind === 'portal') { descentVisit.setPortalOpen(0); islandOpen = 0; } session = null; meditateEl.hidden = true; saveDeep(); const then = afterEnd; afterEnd = null; then?.(); }
function refreshMeditate(): void { if (!session) return; meditateSub.textContent = session.kind === 'portal' ? `${session.points} / ${PORTAL_GEMS} gems of clarity into the portal · clarity ${Math.floor(deep.clarity)}` : session.kind === 'wake' ? `${session.points} / ${WAKE_GEMS} gems of clarity into the sleeper · clarity ${Math.floor(deep.clarity)}` : session.kind === 'cultivate' ? `growth ${Math.floor(cultivation.grown)} / ${TIER_POINTS[cultivation.tier + 1]} · tier ${cultivation.tier}, the land allows ${worldTier(worldNow())} · ${TIER_CLARITY} clarity to rise` : session.kind === 'sanctify' ? `${session.points} / ${SANCTIFY_GEMS} gems of clarity into the basin · clarity ${Math.floor(deep.clarity)}` : session.kind === 'channel' ? `${session.points} / ${MIRACLE_GEMS} gems channelled · clarity ${Math.floor(deep.clarity)} · ${miracleCost(session.miracle!)} prayer when it is done` : session.kind === 'deepen' ? `the puzzle: ${session.points} / ${DEEPEN_POINTS} gems, then the node deepens for ${DEEPEN_COST} clarity` : deep.clarity >= CLARITY_CAP ? 'clarity is full' : `${session.gained ? `+${session.gained} clarity · ` : ''}tap neighbouring gems: each run is clarity · ${DIVE_COST} to dive, ${RETURN_COST} to return`; }
player.onTap = (x, y) => { if (mode !== 'meditate' && mode !== 'deep') return; ray.setFromCamera(new THREE.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), camera); if (mode === 'meditate') boardView.tap(ray); else { const id = deepWorld.pointAt(ray); if (id && deepLabels.get(id)?.reach) launchTo(id); } };
boardView.onRun = run => { if (!session) return; if (session.kind === 'portal') { portalRun(run.cells.length); return; } if (session.kind === 'meditate') { const g = gather(deep, run.cells.length); session.gained = (session.gained ?? 0) + g; } else if (session.kind === 'cultivate') { grow(cultivation, run.cells.length); saveCultivation(); if (grownEnough(cultivation)) { const w = worldNow(); refreshMeditate(); endSession();
      if (raise(cultivation, w, deep)) { saveCultivation(); saveDeep(); deep.bonus = reachBonus(powerNow()); bannerEl.textContent = `She is raised to tier ${cultivation.tier}: the deep roots reach ${deepReach({ ...deep, bonus: reachBonus(powerNow()) })} m, her sight ${Math.round(viewScale(powerNow()) * 100)}%`; }
      else bannerEl.textContent = `The karst will not raise her yet: ${lacking(w, cultivation.tier + 1)}`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 2000; return; } } else if (session.kind === 'wake') { session.points += channel(deep, run.cells.length); if (session.points >= WAKE_GEMS) { refreshMeditate(); endSession(); saveDeep(); wakeSteward(); return; } if (deep.clarity < 1) { refreshMeditate(); saveDeep(); endSession(); say('her clarity is spent before he wakes', 4); return; } } else if (session.kind === 'sanctify') { session.points += channel(deep, run.cells.length); if (session.points >= SANCTIFY_GEMS) { const r = session.ruin!; refreshMeditate(); endSession(); if (sanctify(overworld, r.id)) { chunks.setSanctified(overworld.sanctified); deep.clarity = CLARITY_CAP; save(); saveDeep(); bannerEl.textContent = `${r.name[0].toUpperCase()}${r.name.slice(1)} is a grove now: ${r.lore}`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 2000; } return; } if (deep.clarity < 1) { refreshMeditate(); saveDeep(); endSession(); say('her clarity is spent before the basin fills', 4); return; } } else if (session.kind === 'channel') { session.points += channel(deep, run.cells.length); if (session.points >= MIRACLE_GEMS) { const m = session.miracle!; refreshMeditate(); saveDeep(); endSession(); workMiracle(m); return; } if (deep.clarity < 1 && session.points < MIRACLE_GEMS) { refreshMeditate(); saveDeep(); endSession(); say('her clarity is spent before the channelling is done', 4); return; } } else { session.points += run.cells.length; if (session.points >= DEEPEN_POINTS && deepen(deep, territory())) { bannerEl.textContent = `The node deepens: the deep roots reach ${deepReach(deep)} m`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; session.points = 0; } } refreshMeditate(); saveDeep(); };
el('meditateDone').addEventListener('click', endSession);
/** Down the taproot from the pool (DIVE_S seconds), or back down a deep root from a shrine or a convergence, to the node. */
function startDive(): boolean {
  const st = stillPlace(); if (!st || loaded()) return false;
  if (st.kind === 'pool') { if (!firstDiveOpen() || !dive(deep)) return false; } else if (!returnDeep(deep)) return false;
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
  for (const p of places) { const ok = reach.has(p.id); list.push({ id: p.id, dir: dirOf(p), colour: p.kind === 'pool' ? '#d8f07a' : p.kind === 'shrine' ? '#e8dcff' : p.kind === 'grove' ? '#c8f0a0' : p.kind === 'brink' ? '#ffe2a8' : '#cfeeff', size: p.kind === 'pool' ? 0.9 : p.kind === 'brink' ? 0.8 : 0.7, reachable: ok }); const e = document.createElement('div'); e.className = 'name deep'; e.hidden = true; labels.append(e); deepLabels.set(p.id, { el: e, place: p, reach: ok }); }
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
// D1 (DESCENT.md): from the node she steps out onto the catwalk of its depth, built round the drop where the node is; the drop takes her back. Tuning: the chamber's dark.
const CATWALK_FOG = { colour: '#0c0e16', density: 0.04 };
const descentVisit = createDescentVisit(scene, camera, () => backIntoDrop(), () => { startPortal('out'); });
const deepOut = document.createElement('button'); deepOut.id = 'deepOut'; deepOut.textContent = 'step out onto the catwalk';
deepOut.style.cssText = 'position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 196px);transform:translateX(-50%);height:36px;padding:0 16px;border:0;border-radius:18px;font:13px/1 system-ui;color:#f1e8ff;background:#4a3a6acc;pointer-events:auto;white-space:nowrap';
deepEl.append(deepOut); deepOut.addEventListener('click', () => { stepOntoCatwalk(); });
let clearAbove: Player['cameraClear'] = null;
function stepOntoCatwalk(): boolean {
  if (mode !== 'deep') return false; closeDeep(); deepWorld.show(false);
  const { at, yaw } = descentVisit.enter(deep.depth, nodeAt());
  clearAbove = player.cameraClear; player.cameraClear = descentVisit.cameraClear; player.traversalWorld = descentVisit.traversal;
  player.motor.reset(at); place(at); player.yaw = yaw; player.pitch = 0.12; player.canMove = true; player.cancelInput(); mode = 'catwalk';
  say(`layer ${descentVisit.catwalk!.letter} · the catwalk beneath the Cap`, 4); return true;
}
function backIntoDrop(): boolean {
  if (mode !== 'catwalk') return false; descentVisit.exit(); player.cameraClear = clearAbove; lock(); deepWorld.show(true); arriveNode(); return true;
}
// T5 (PLATEAU.md, Noah 2026-10-19): the way down from the karst is the catwalk's portal to the outside world. Clarity channelled into it on the board (as a quickening is)
// opens it; then a short passage through the rock, and she steps out of the portal at the island's foot. That portal, opened the same way, takes her back to the catwalk.
/** Tuning: gems of clarity to open a portal (a quickening's), the passage's seconds, the island portal's height and its distance from the karst's axis toward the bridge. */
const PORTAL_GEMS = MIRACLE_GEMS, PASSAGE_S = 3.2, ISLAND_PORTAL_H = 2.4, ISLAND_PORTAL_R = 26;
const islandPortal = (() => {
  // Toward the bridge (the first village's bearing), turned a little either way until no tree of the karst's floor stands within reach.
  const a0 = Math.atan2(-KARST_AT.z, -KARST_AT.x), floor = Object.values(ROOT_NODES).filter(n => n.zone === 'floor');
  let a = a0; for (let k = 0; k < 24; k++) { const t = a0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 0.09, x = Math.cos(t) * ISLAND_PORTAL_R, z = Math.sin(t) * ISLAND_PORTAL_R; if (floor.every(n => Math.hypot(n.at.x - x, n.at.z - z) > 3.6)) { a = t; break; } }
  const local = { x: Math.cos(a) * ISLAND_PORTAL_R, z: Math.sin(a) * ISLAND_PORTAL_R }, world = new THREE.Vector3(KARST_AT.x + local.x, 0, KARST_AT.z + local.z); world.y = relief(world.x, world.z);
  // She stands before it on its outer side, facing away from the karst (toward the bridge).
  return { angle: a, world, stand: { x: local.x + Math.cos(a) * 4.2, z: local.z + Math.sin(a) * 4.2, yaw: Math.atan2(-Math.cos(a), -Math.sin(a)) } };
})();
const islandFigure = makePortal(ISLAND_PORTAL_H); islandFigure.group.position.copy(islandPortal.world); islandFigure.group.rotation.y = Math.atan2(Math.cos(islandPortal.angle), Math.sin(islandPortal.angle)); scene.add(islandFigure.group);
let islandOpen = 0;
const portalBtn = document.createElement('button'); portalBtn.id = 'portalAct'; portalBtn.hidden = true; portalBtn.textContent = 'open the portal';
portalBtn.style.cssText = 'position:fixed;z-index:24;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 150px);min-width:160px;min-height:44px;padding:8px 14px;border-radius:14px;font:15px Georgia,serif;background:#2a2238e6;border:1px solid #c8a8ff66;color:#f1e8ff';
document.body.append(portalBtn); portalBtn.addEventListener('pointerdown', e => { e.preventDefault(); startPortal('in'); });
/** Each frame: the island portal's film, and its button while she stands before it. */
function portalFrame(t: number): void { islandFigure.update(t, islandOpen); const f = player.feet(); portalBtn.hidden = !(mode === 'ground' && Math.hypot(f.x - islandPortal.world.x, f.z - islandPortal.world.z) < 4.8 && Math.abs(f.y - islandPortal.world.y) < 2); }
/** Sit down before a portal and open it with clarity: 'out' from a catwalk, 'in' at the island's foot. */
function startPortal(dir: 'in' | 'out'): boolean {
  if (boardView.isBusy || (dir === 'out' ? mode !== 'catwalk' : mode !== 'ground')) return false;
  if (!canChannel(deep)) { say(`the portal wants ${MIRACLE_CLARITY} clarity to begin; meditate at the pool`, 4); return false; }
  const at = dir === 'out' ? descentVisit.portalAt()! : islandFigure.group.position.clone().add(new THREE.Vector3(0, ISLAND_PORTAL_H * 0.45, 0));
  session = { kind: 'portal', points: 0, at, from: mode, dir }; mode = 'meditate'; player.cancelInput(); player.enabled = false; boardView.bind(board); boardView.show(time); meditateEl.hidden = false; meditateTitle.textContent = dir === 'out' ? 'Opening the portal to the outside world' : 'Opening the portal into the karst'; miracles.hidden = true; refreshMeditate(); return true;
}
function portalRun(gems: number): void {
  if (!session || session.kind !== 'portal' || afterEnd) return; session.points += channel(deep, gems); const k = Math.min(1, session.points / PORTAL_GEMS); if (session.dir === 'out') descentVisit.setPortalOpen(k); else islandOpen = k; refreshMeditate();
  if (session.points >= PORTAL_GEMS) { const dir = session.dir!; saveDeep(); afterEnd = () => passage(dir); endSession(); return; }
  if (deep.clarity < 1) { saveDeep(); endSession(); say('her clarity is spent before the portal opens', 4); }
}
/** The catwalk's portal in the world, for the passage's other end, before the catwalk is built (the node's depth, round the node). */
function catwalkPortalAt(): THREE.Vector3 { const c = catwalkAt(deep.depth), n = nodeAt(), a = c.portal.angle, r = c.wallR + 0.3; return new THREE.Vector3(n.x + Math.cos(a) * r, n.y - 0.95 + 0.75, n.z + Math.sin(a) * r); }
/** Through the rock between the two portals, on the bore the deep roots ride. */
function passage(dir: 'in' | 'out'): void {
  const isl = islandFigure.group.position.clone().add(new THREE.Vector3(0, ISLAND_PORTAL_H * 0.45, 0)), down = catwalkPortalAt(), from = dir === 'out' ? down : isl, to = dir === 'out' ? isl : down;
  if (dir === 'out') { descentVisit.exit(); player.cameraClear = clearAbove; }
  const mid = from.clone().lerp(to, 0.5); mid.y -= 8; const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
  lock(); mode = 'dive'; deepWorld.show(true); deepWorld.showDrop(false); deepWorld.setBore(curve); deepWorld.rush(true); islandOpen = dir === 'out' ? 1 : 0;
  deepMove = { curve, t: 0, seconds: PASSAGE_S, then: dir === 'out' ? arriveIsland : arriveByPortal }; say(dir === 'out' ? 'through the portal' : 'into the karst', 2);
}
function arriveIsland(): void {
  deepMove = null; deepWorld.rush(false); deepWorld.show(false); deepWorld.clearBore(); islandOpen = 0; const s = islandPortal.stand; karst.standOn('floor', s.x, s.z, s.yaw); mode = 'ground'; player.pitch = 0.1;
  bannerEl.textContent = 'She steps out of the portal at the foot of the Wellspire'; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000;
}
function arriveByPortal(): void {
  deepMove = null; deepWorld.rush(false); deepWorld.show(false); deepWorld.clearBore();
  const { at, yaw } = descentVisit.enter(deep.depth, nodeAt(), 'portal');
  clearAbove = player.cameraClear; player.cameraClear = descentVisit.cameraClear; player.traversalWorld = descentVisit.traversal;
  player.motor.reset(at); place(at); player.yaw = yaw; player.pitch = 0.12; player.canMove = true; player.cancelInput(); mode = 'catwalk';
  say(`layer ${descentVisit.catwalk!.letter} · the catwalk beneath the Cap`, 4);
}
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
/** PLATEAU.md: the first dive waits on her cultivation (she has meditated for its clarity); after it, the pool's dive is always open. */
const firstDiveOpen = (): boolean => deep.dives > 0 || mayFirstDive(cultivation);
/** The buttons and the readout, each frame: what a still place offers. */
function deepButtons(): void {
  const st = stillPlace();
  deepBtn.hidden = !st; diveBtn.hidden = !st || st.kind === 'ruin' || st.kind === 'moot' || (st.kind === 'pool' ? !canDive(deep) : !canReturn(deep)) || loaded(); diveBtn.disabled = st?.kind === 'pool' && !firstDiveOpen(); cultivateBtn.hidden = !st || st.kind !== 'pool' || cultivation.tier >= TIER_CAP; cultivateBtn.textContent = grownEnough(cultivation) ? (canRaise(cultivation, worldNow(), deep.clarity) ? 'rise' : 'cultivate') : 'cultivate';
  if (st) { deepBtn.textContent = st.kind === 'moot' ? 'wake' : st.kind === 'ruin' ? 'sanctify' : st.kind === 'pool' && canDeepen(deep, territory()) ? 'deepen' : 'meditate'; deepBtn.disabled = (st.kind === 'ruin' || st.kind === 'moot') && !canChannel(deep); diveBtn.textContent = st.kind === 'pool' ? (firstDiveOpen() ? 'dive' : 'cultivate first') : 'return'; }
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
// ===== The map (T9, PLATEAU.md; Noah, 2026-10-25: "make the overworld map better - a closer to true depiction of the land's topography, terrain, coloration, and also smoothly
// loading, with zoom out and zoom in and smooth laggless panning"). The base layer (the land drawn as a map from the baked grid, the water as vectors, the fog of what she
// has explored) is overworldMap.ts's cached atlas, built in slices from boot and while the map is open; here is the open map's state (its pan and zoom), its gestures (a drag
// pans; a pinch zooms about the fingers, a wheel about the pointer; spreading on past MAP_MAX closes it, as pinching past the overhead view opens it), one draw an animation
// frame however many moves come, the marks over the base (unchanged in look; the small labels hidden below LABEL_MIN), the minimap from the same atlas, and `__village.map`. =====
const mapEl = el<HTMLCanvasElement>('map'), mapWrap = el('mapwrap'), mapCtx = mapEl.getContext('2d')!;
let mapOpen = false, mapPan = { x: 0, z: 0 }, mapDrag: { id: number; x: number; y: number } | null = null, mapQueued = false;
const MAP_SCALE = 0.6; // px per m (css): the scale the map opens at, centred on her
/** Tuning: below this scale (css px/m) the small labels (the crossings', the yards', the hobbits' names, and the dens', warrens' and wallows' generic names) are not drawn, so the whole plateau is not a wall of text. */
const LABEL_MIN = 0.35;
/** Tuning: how long a frame may spend building the map's atlas while it is open (ms). */
const MAP_SLICE_MS = 5;
let mapScale = MAP_SCALE;
const overMap = createOverworldMap({ land: vistaLand?.land ?? null, seed: home.seed, onProgress: () => drawMap() }); overMap.startIdle();
const mapBounds = (): { min: number; max: number } => zoomBounds(innerWidth, innerHeight);
function openMap(open: boolean): void { mapOpen = open; mapWrap.hidden = !open; if (open) { const f = player.feet(); mapPan = { x: f.x, z: f.z }; mapScale = clampZoom(MAP_SCALE, mapBounds()); overMap.focus(f.x, f.z); drawMapNow(); } }
/** Zoom to `s` (css px/m, clamped to the bounds), the world point under the screen point (cx, cy) staying where it is. */
function zoomMapAt(s: number, cx: number, cy: number): void { const next = clampZoom(s, mapBounds()), wx = mapPan.x + (cx - innerWidth / 2) / mapScale, wz = mapPan.z + (cy - innerHeight / 2) / mapScale; mapScale = next; mapPan = { x: wx - (cx - innerWidth / 2) / next, z: wz - (cy - innerHeight / 2) / next }; drawMap(); }
function pinchDistance(): number { const [a, b] = [...pinchPointers.values()]; return Math.hypot(a.x - b.x, a.y - b.y); }
const canvasEl = renderer.domElement;
// Every finger on the canvas is captured, so its release reaches the canvas wherever it lifts (over a button, off the screen); a finger whose release never came would otherwise haunt the count and make one finger a pinch.
canvasEl.addEventListener('pointerdown', e => { pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { canvasEl.setPointerCapture(e.pointerId); } catch { /* Synthetic tests. */ } if (pinchPointers.size === 2) { pinchFrom = pinchDistance(); pinchZoom = zoom; } else if (pinchPointers.size > 2) { pinchPointers.clear(); pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); pinchFrom = 0; } }, true);
for (const ev of ['lostpointercapture', 'pointerleave'] as const) canvasEl.addEventListener(ev, e => { pinchPointers.delete(e.pointerId); if (pinchPointers.size < 2) pinchFrom = 0; }, true);
document.addEventListener('visibilitychange', () => { pinchPointers.clear(); pinchFrom = 0; });
canvasEl.addEventListener('pointermove', e => { const p = pinchPointers.get(e.pointerId); if (!p) return; p.x = e.clientX; p.y = e.clientY; if (pinchPointers.size === 2 && pinchFrom > 0) { e.stopImmediatePropagation(); const ratio = pinchFrom / Math.max(1, pinchDistance()); zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, pinchZoom * ratio)); if (pinchZoom >= ZOOM_MAX - 0.01 && ratio > 1.15 && !mapOpen) { openMap(true); pinchFrom = 0; } } }, true);
for (const ev of ['pointerup', 'pointercancel'] as const) canvasEl.addEventListener(ev, e => { pinchPointers.delete(e.pointerId); if (pinchPointers.size < 2) pinchFrom = 0; }, true);
let mapTap: { id: number; x: number; y: number; t: number } | null = null, mapPinch: { from: number; scale: number } | null = null;
mapWrap.addEventListener('pointerdown', e => { pinchPointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (pinchPointers.size === 2) { pinchFrom = pinchDistance(); mapPinch = { from: pinchFrom, scale: mapScale }; mapTap = null; mapDrag = null; } else { mapDrag = { id: e.pointerId, x: e.clientX, y: e.clientY }; mapTap = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() }; } });
mapWrap.addEventListener('pointermove', e => { const p = pinchPointers.get(e.pointerId); if (p) { p.x = e.clientX; p.y = e.clientY; } if (pinchPointers.size === 2 && mapPinch) { const [a, b] = [...pinchPointers.values()], ratio = pinchDistance() / Math.max(1, mapPinch.from); if (mapPinch.scale >= MAP_MAX - 1e-6 && ratio > 1.2) { openMap(false); mapPinch = null; pinchFrom = 0; return; } zoomMapAt(mapPinch.scale * ratio, (a.x + b.x) / 2, (a.y + b.y) / 2); return; } if (mapDrag && mapDrag.id === e.pointerId) { mapPan.x -= (e.clientX - mapDrag.x) / mapScale; mapPan.z -= (e.clientY - mapDrag.y) / mapScale; mapDrag = { id: e.pointerId, x: e.clientX, y: e.clientY }; drawMap(); } });
for (const ev of ['pointerup', 'pointercancel'] as const) mapWrap.addEventListener(ev, e => { pinchPointers.delete(e.pointerId); if (pinchPointers.size < 2) { pinchFrom = 0; mapPinch = null; } if (mapDrag?.id === e.pointerId) { mapDrag = null; overMap.focus(mapPan.x, mapPan.z); } if (ev === 'pointerup' && mapTap?.id === e.pointerId && Math.hypot(e.clientX - mapTap.x, e.clientY - mapTap.y) < 8 && performance.now() - mapTap.t < 400 && (e.target as HTMLElement).tagName !== 'BUTTON') mapTapAt(e.clientX, e.clientY); mapTap = null; });
mapWrap.addEventListener('wheel', e => { e.preventDefault(); zoomMapAt(mapScale * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
/** A tap on the map: on the course's mark it is forgotten, anywhere else a course is plotted there. */
function mapTapAt(clientX: number, clientY: number): void {
  const x = mapPan.x + (clientX - innerWidth / 2) / mapScale, z = mapPan.z + (clientY - innerHeight / 2) / mapScale;
  if (courseTarget && Math.hypot(courseTarget.x - x, courseTarget.z - z) * mapScale < 16) { clearCourse(); return; }
  plotCourse({ x, z });
}
el('mapclose').addEventListener('click', () => openMap(false));
/** The map is drawn once an animation frame however many calls come (a drag's moves are many a frame), and not at all while it is closed. */
function drawMap(): void { if (!mapOpen || mapQueued) return; mapQueued = true; requestAnimationFrame(() => { mapQueued = false; if (mapOpen) drawMapNow(); }); }
function drawMapNow(): void { const t0 = performance.now(), w = mapEl.width = innerWidth * devicePixelRatio, h = mapEl.height = innerHeight * devicePixelRatio; renderMap(mapCtx, w, h, mapScale * devicePixelRatio, mapPan, true); overMap.stats.drawMs = performance.now() - t0; }
/** The map drawn on a canvas: the full map (north mark, scale bar) or (Noah) the live minimap under the compass, centred on her at MINI_SCALE, with the same marks: the base (the land, the water, the fog) from the atlas, the marks over it. */
const FRONT_COLOUR = '#9a6a98';
function renderMap(c: CanvasRenderingContext2D, w: number, h: number, s: number, pan: { x: number; z: number }, full: boolean): void {
  const dpr = devicePixelRatio; overMap.drawBase(c, w, h, s, pan, full ? '#101a16' : '#101a16cc', (full ? 2.2 : 1.6) * dpr, overworld.revealed);
  drawMarks(c, w, h, s, pan, full, s / dpr >= LABEL_MIN);
}
/** Every mark over the base, in screen pixels at any zoom: the crossings and the old bridge where revealed, the hints, the known places, the yards, the deep places, the incidents, the snatchers' trail, the course, the search parties, the steward, her own mark, the blight, the front (C1, C3), the north mark and the scale bar. `labels` draws the small names. */
function drawMarks(c: CanvasRenderingContext2D, w: number, h: number, s: number, pan: { x: number; z: number }, full: boolean, labels: boolean): void {
  const sx = (x: number) => w / 2 + (x - pan.x) * s, sz = (z: number) => h / 2 + (z - pan.z) * s;
  // Noah (2026-10-24): where the rivers are crossed, where she has seen the land: a ford as two pale bars across the river, stepping stones as three dots, a footbridge as a plank, the island's old bridge as a stone band.
  { const pl = plateau(home.seed), dpr = devicePixelRatio;
    const across = (x: number, z: number, along: number, half: number, off: number): [number, number, number, number] => { const nx = -Math.sin(along), nz = Math.cos(along), ax = Math.cos(along) * off, az = Math.sin(along) * off, r = Math.max(half * s, 6 * dpr); return [sx(x) + ax * s - nx * r, sz(z) + az * s - nz * r, sx(x) + ax * s + nx * r, sz(z) + az * s + nz * r]; };
    for (const k of pl.crossings) { if (!isRevealed(overworld, k.x, k.z)) continue; const half = pl.nearRiver(k.x, k.z, 30)?.half ?? 5;
      if (k.kind === 'ford') { c.strokeStyle = '#e8d8a8'; c.lineWidth = 2.2 * dpr; for (const o of [-2.2 / s * dpr, 2.2 / s * dpr]) { const [x0, y0, x1, y1] = across(k.x, k.z, k.along, half + 1, o); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); } }
      else if (k.kind === 'stones') { c.fillStyle = '#d8d4c8'; const [x0, y0, x1, y1] = across(k.x, k.z, k.along, half + 1, 0); for (const t of [0.15, 0.5, 0.85]) { c.beginPath(); c.arc(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 2.2 * dpr, 0, Math.PI * 2); c.fill(); } }
      else { c.strokeStyle = '#c09858'; c.lineWidth = 3.5 * dpr; const [x0, y0, x1, y1] = across(k.x, k.z, k.along, half + FOOTBRIDGE_OVER, 0); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
      if (full && labels) { c.fillStyle = '#d8e8f0'; c.textAlign = 'left'; c.font = `${10 * dpr}px system-ui`; c.fillText(k.kind === 'ford' ? 'ford' : k.kind === 'stones' ? 'stepping stones' : 'footbridge', sx(k.x) + 9 * dpr, sz(k.z) + 3 * dpr); } }
    const br = pl.bridge; if (isRevealed(overworld, br.from.x, br.from.z) || isRevealed(overworld, br.to.x, br.to.z)) { c.strokeStyle = '#a8a294'; c.lineWidth = Math.max(4 * dpr, br.halfW * 2 * s); c.beginPath(); c.moveTo(sx(br.from.x), sz(br.from.z)); c.lineTo(sx(br.to.x), sz(br.to.z)); c.stroke(); c.strokeStyle = '#5e5a50'; c.lineWidth = 1 * dpr; c.stroke(); if (full && labels) { c.fillStyle = '#d8e8f0'; c.textAlign = 'left'; c.font = `${10 * dpr}px system-ui`; c.fillText('the old bridge', sx((br.from.x + br.to.x) / 2) + 9 * dpr, sz((br.from.z + br.to.z) / 2)); } } }
  c.font = `${(full ? 12 : 10) * devicePixelRatio}px system-ui`; c.textAlign = 'center';
  // G2: what the villagers said of places she has not found, as fans from the green along the bearing they gave.
  for (const hnt of overworld.hints) { const a = (hnt.bearing - 90) * Math.PI / 180, r = HINT_REACH * s, sp = HINT_SPREAD * Math.PI / 180, o = hintFrom(hnt), fx = sx(o.x), fz = sz(o.z); c.fillStyle = '#e0a0f02a'; c.strokeStyle = '#e0a0f0'; c.lineWidth = 1 * devicePixelRatio; c.setLineDash([4 * devicePixelRatio, 4 * devicePixelRatio]); c.beginPath(); c.moveTo(fx, fz); c.arc(fx, fz, r, a - sp, a + sp); c.closePath(); c.fill(); c.stroke(); c.setLineDash([]); c.fillStyle = '#e0a0f0'; c.textAlign = 'center'; const [what, way] = hnt.text.split(/ to the (?=[a-z-]+$)/), tx = fx + Math.cos(a) * r * 0.4, ty = fz + Math.sin(a) * r * 0.4; c.fillText(what, tx, ty); if (way) c.fillText(`to the ${way}`, tx, ty + 14 * devicePixelRatio); }
  for (const p of knownPlaces(overworld)) { const x = sx(p.x), y = sz(p.z); c.strokeStyle = p.id === 'lair' ? '#c070c0' : p.kind === 'village' ? villageColour(p.id) : p.kind === 'den' ? '#c8b8a0' : p.kind === 'ruin' ? (overworld.sanctified.has(p.id) ? '#d8f07a' : '#b8c0a8') : p.kind === 'warren' ? '#d8b890' : p.kind === 'moot' ? '#e8d088' : '#f1edcf'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); if (p.kind === 'village') c.arc(x, y, 7 * devicePixelRatio, 0, Math.PI * 2); else if (p.kind === 'ruin') { const r = 6 * devicePixelRatio; c.moveTo(x, y - r); c.lineTo(x + r, y); c.lineTo(x, y + r); c.lineTo(x - r, y); c.closePath(); } else if (p.kind === 'den') { c.fillStyle = '#c8b8a0'; c.arc(x, y, 5 * devicePixelRatio, 0, Math.PI * 2); c.fill(); } else if (p.kind === 'warren') { c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); } else if (p.kind === 'moot') { const r = 5 * devicePixelRatio; c.rect(x - r, y - r, r * 2, r * 2); } else if (p.id === 'karst') { c.moveTo(x, y - 9 * devicePixelRatio); c.lineTo(x + 8 * devicePixelRatio, y + 7 * devicePixelRatio); c.lineTo(x - 8 * devicePixelRatio, y + 7 * devicePixelRatio); c.closePath(); } else { c.moveTo(x - 7 * devicePixelRatio, y - 7 * devicePixelRatio); c.lineTo(x + 7 * devicePixelRatio, y + 7 * devicePixelRatio); c.moveTo(x + 7 * devicePixelRatio, y - 7 * devicePixelRatio); c.lineTo(x - 7 * devicePixelRatio, y + 7 * devicePixelRatio); } c.stroke(); c.fillStyle = c.strokeStyle; /* T9: far out, the generic kinds' names (a den, a warren, a wallow, many of each) are not drawn; the named places always. */ if (labels || !(p.kind === 'den' || p.kind === 'warren' || p.kind === 'wallow')) c.fillText(p.name, x, y + 24 * devicePixelRatio); }
  // G4: the fairy rings she can use, as small pale rings.
  // The industrial ruins she has seen the ground of: a chimney on a square.
  for (const yd of yardList) if (isRevealed(overworld, yd.x, yd.z)) { const x = sx(yd.x), y = sz(yd.z), r = 5 * devicePixelRatio; c.strokeStyle = '#e0b070'; c.fillStyle = '#e0b070'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); c.rect(x - r, y - r * 0.4, r * 2, r * 1.4); c.moveTo(x + r * 0.4, y - r * 0.4); c.lineTo(x + r * 0.4, y - r * 1.4); c.stroke(); if (full && labels) { c.textAlign = 'center'; c.fillText(yd.name, x, y + 22 * devicePixelRatio); } }
  for (const p of deepPlaces()) if (p.kind === 'convergence' || p.kind === 'brink') { const x = sx(p.x), y = sz(p.z); c.strokeStyle = p.kind === 'brink' ? '#ffe2a8' : '#cfeeff'; c.lineWidth = 1.5 * devicePixelRatio; c.beginPath(); c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); }
  // Incidents: a red mark where it happened, with what it was.
  for (const inc of allIncidents()) { const x = sx(inc.x), y = sz(inc.z); c.fillStyle = INCIDENT_FOE; c.strokeStyle = INCIDENT_FOE; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(x, y, 9 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); c.fillStyle = INCIDENT_VICTIM; c.textAlign = 'center'; c.fillText(inc.text, x, y - 14 * devicePixelRatio); }
  // The snatchers' trail (Noah, 2026-10-23), where she has walked: a dark dot and a tick the way it went.
  for (const cx of ctxs) for (const m of cx.v.trail) { const wx = m.x + cx.ox, wz = m.z + cx.oz; if (!isRevealed(overworld, wx, wz)) continue; const x = sx(wx), y = sz(wz); c.fillStyle = '#b060d0'; c.strokeStyle = '#b060d0'; c.lineWidth = 1.5 * devicePixelRatio; c.beginPath(); c.arc(x, y, 2 * devicePixelRatio, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(x, y); c.lineTo(sx(wx + Math.cos(m.a) * 30), sz(wz + Math.sin(m.a) * 30)); c.stroke(); }
  if (course) { c.strokeStyle = '#f0d060'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); for (const r of course.roots) for (let i = 0; i < r.samples.length; i++) { const p = r.samples[i]; if (i === 0) c.moveTo(sx(p.x), sz(p.z)); else c.lineTo(sx(p.x), sz(p.z)); } c.stroke(); const e = network.nodeAt(course.entry); if (e) { c.beginPath(); c.arc(sx(e.x), sz(e.z), 5 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); } }
  if (courseTarget) { const x = sx(courseTarget.x), y = sz(courseTarget.z), d = 7 * devicePixelRatio; c.strokeStyle = '#f0d060'; c.fillStyle = '#f0d060'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); c.moveTo(x, y - d); c.lineTo(x + d, y); c.lineTo(x, y + d); c.lineTo(x - d, y); c.closePath(); c.stroke(); c.textAlign = 'center'; c.fillText(course ? `the way · ${Math.round(course.length)} m` : 'no way', x, y + 22 * devicePixelRatio); }
  // S4: search parties out on the land, as small dots in the villagers' colour.
  for (const cx of ctxs) for (const m of searchParty(cx.v)) { const x = sx(m.x), y = sz(m.z); c.fillStyle = '#f0b070'; c.beginPath(); c.arc(x, y, 3 * devicePixelRatio, 0, Math.PI * 2); c.fill(); if (full && labels) { c.textAlign = 'center'; c.fillText(hobbitById(m.id).name, x, y + 13 * devicePixelRatio); } }
  // Noah (2026-09-28): every hero where they are: a gold ring with their name.
  if (steward.woken) { const hx = sx(steward.x), hy = sz(steward.z); c.strokeStyle = '#f0d070'; c.fillStyle = '#f0d070'; c.lineWidth = 2 * devicePixelRatio; c.beginPath(); c.arc(hx, hy, 5 * devicePixelRatio, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(hx, hy, 2 * devicePixelRatio, 0, Math.PI * 2); c.fill(); if (full) c.fillText(STEWARD_NAME, hx, hy - 9 * devicePixelRatio); }
  const f = player.feet(), x = sx(f.x), y = sz(f.z); c.fillStyle = '#d8f07a'; c.beginPath(); c.arc(x, y, 4 * devicePixelRatio, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#d8f07a'; c.beginPath(); c.moveTo(x, y); c.lineTo(x - Math.sin(player.yaw) * 14 * devicePixelRatio, y - Math.cos(player.yaw) * 14 * devicePixelRatio); c.stroke();
  // D4: the blight on the map, once the lair is known.
  { const blight = home_().v.blight; if (blight > 0 && knownPlaces(overworld).some(p => p.id === 'lair')) { c.fillStyle = '#3a104060'; c.strokeStyle = '#a050b0'; c.lineWidth = 1.5 * devicePixelRatio; c.beginPath(); c.arc(sx(lairPlace.x), sz(lairPlace.z), blight * s, 0, Math.PI * 2); c.fill(); c.stroke(); } }
  // C1: her front, in the taint's colour: each germ's edge as a ring and each hypha's claimed length as a line, where the land is revealed (or the lair known). Tuning: FRONT_COLOUR.
  { const known = knownPlaces(overworld).some(p => p.id === 'lair'), seen = (x: number, z: number): boolean => known || isRevealed(overworld, x, z); c.strokeStyle = FRONT_COLOUR; c.lineWidth = 1.5 * devicePixelRatio;
    for (const g of growthIdx.germs) if (seen(g.x, g.z)) { c.beginPath(); c.arc(sx(g.x), sz(g.z), g.reach * s, 0, Math.PI * 2); c.stroke(); }
    c.lineWidth = 2 * devicePixelRatio; c.beginPath(); for (const hy of hyphaSegments(growthIdx)) { if (!seen(hy.a.x, hy.a.z) && !seen(hy.tip.x, hy.tip.z)) continue; c.moveTo(sx(hy.a.x), sz(hy.a.z)); c.lineTo(sx(hy.tip.x), sz(hy.tip.z)); } c.stroke(); }
  // C3 (CONTAGION.md, the bulwark), the retreat made visible: each growing hypha's tip as a small arrowhead the way it grows; what withered lately (Growth.withered) as a dotted line in the front's colour, fading with its age; every irritant (the woken ward, the groves, the karst's foot, a thriving shrined village) as a faint pale ring of its push.
  { const known = knownPlaces(overworld).some(p => p.id === 'lair'), seen = (x: number, z: number): boolean => known || isRevealed(overworld, x, z), dpr = devicePixelRatio;
    c.fillStyle = FRONT_COLOUR; for (const hy of hyphaSegments(growthIdx)) { if (hy.t >= 1 || !seen(hy.tip.x, hy.tip.z)) continue; const x = sx(hy.tip.x), y = sz(hy.tip.z), ux = hy.dir.x, uz = hy.dir.z, l = 5 * dpr, w = 3 * dpr; c.beginPath(); c.moveTo(x + ux * l, y + uz * l); c.lineTo(x - uz * w, y + ux * w); c.lineTo(x + uz * w, y - ux * w); c.closePath(); c.fill(); }
    c.strokeStyle = FRONT_COLOUR; c.lineWidth = 1.5 * dpr; c.setLineDash([2 * dpr, 3 * dpr]); for (const w of witheredSegments(growth, home.seed)) { if (!seen(w.a.x, w.a.z) && !seen(w.b.x, w.b.z)) continue; c.globalAlpha = 0.7 * Math.max(0.15, 1 - (growth.day - w.day) / WITHERED_DAYS); c.beginPath(); c.moveTo(sx(w.a.x), sz(w.a.z)); c.lineTo(sx(w.b.x), sz(w.b.z)); c.stroke(); } c.setLineDash([]); c.globalAlpha = 1;
    c.strokeStyle = '#c8f0a8'; c.lineWidth = 1 * dpr; c.globalAlpha = 0.35; for (const ir of growthInputs().irritants) { if (!seen(ir.x, ir.z)) continue; c.beginPath(); c.arc(sx(ir.x), sz(ir.z), ir.r * s, 0, Math.PI * 2); c.stroke(); } c.globalAlpha = 1; }
  if (!full) { c.fillStyle = '#f1edcf'; c.textAlign = 'left'; c.fillText('N', 8 * devicePixelRatio, 14 * devicePixelRatio); c.fillRect(8 * devicePixelRatio, h - 10 * devicePixelRatio, 50 * s, 2 * devicePixelRatio); c.fillText('50 m', 8 * devicePixelRatio, h - 14 * devicePixelRatio); return; }
  c.fillStyle = '#f1edcf'; c.textAlign = 'left'; c.fillText('N', 14 * devicePixelRatio, 26 * devicePixelRatio + (window.visualViewport?.offsetTop ?? 0)); c.fillRect(14 * devicePixelRatio, h - 30 * devicePixelRatio, 100 * s, 2 * devicePixelRatio); c.fillText('100 m', 14 * devicePixelRatio, h - 36 * devicePixelRatio);
}
// The compass (Noah: a Skyrim-style strip): a band across the top that slides with her heading, the cardinal points and ticks, and the known places as marks with their distance, within COMPASS_FOV either side of where she faces. Bearings are the overworld's (north is the karst's way, negative z).
const compassEl = el<HTMLCanvasElement>('compass'), compassCtx = compassEl.getContext('2d')!, COMPASS_FOV = 100;
/** G2: the village's state as a colour, on its mark and its compass tick. */
const STATE_COLOUR: Record<StateKind, string> = { thriving: '#8fc45a', steady: '#f1edcf', pressured: '#f0c060', besieged: '#e06060', lost: '#888888', /** C2: a turned village in the front's colour. */ turned: FRONT_COLOUR };
/** A village's mark by its state (G4: each village its own). */
const villageColour = (id: string): string => { const c = ctxs.find(c => c.id === id); return c ? STATE_COLOUR[villageState(c.v).kind] : '#f1edcf'; };
function drawCompass(): void {
  const dpr = devicePixelRatio, w = compassEl.width = compassEl.clientWidth * dpr, h = compassEl.height = compassEl.clientHeight * dpr, c = compassCtx, f = player.feet();
  const heading = bearingOf(-Math.sin(player.yaw), -Math.cos(player.yaw)), xOf = (b: number): number => w / 2 + wrapDeg(b - heading) / COMPASS_FOV * (w / 2);
  c.clearRect(0, 0, w, h); c.fillStyle = '#0b191866'; c.fillRect(0, 0, w, h);
  c.font = `${11 * dpr}px system-ui`; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let b = 0; b < 360; b += 15) { const x = xOf(b); if (x < 0 || x > w) continue; const major = b % 90 === 0; c.fillStyle = major ? '#f1edcf' : '#f1edcf88'; if (major) c.fillText(['N', 'E', 'S', 'W'][b / 90], x, h * 0.42); else c.fillRect(x - dpr / 2, h * 0.3, dpr, h * 0.25); }
  const marks: { x: number; z: number; colour: string; faint?: boolean }[] = knownPlaces(overworld).map(p => ({ x: p.x, z: p.z, colour: p.id === 'lair' ? '#e0a0f0' : p.kind === 'village' ? villageColour(p.id) : p.kind === 'den' ? '#c8b8a0' : p.kind === 'ruin' ? (overworld.sanctified.has(p.id) ? '#d8f07a' : '#b8c0a8') : p.kind === 'warren' ? '#d8b890' : p.kind === 'moot' ? '#e8d088' : '#d8f07a' })); for (const yd of yardList) if (isRevealed(overworld, yd.x, yd.z)) marks.push({ x: yd.x, z: yd.z, colour: '#e0b070' }); if (courseTarget) marks.push({ ...courseTarget, colour: '#f0d060' });
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

function villageInfo(dt: number): void {
  const f = player.feet(), near = Math.hypot(f.x - ctx.ox - GREEN.x, f.z - ctx.oz - GREEN.z) <= VILLAGE_INFO_M && !mapOpen && !miniOpen && !underCap(mode); infoEl.hidden = !near; if (!near) return;
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
    // C3: the front's trend for this village since the last dawn's step (its nearest claimed hub), while it stands within the keeper's telling.
    ...((): string[] => { const fr = fronts[ctx.id]; if (!fr || fr.d >= FRONT_TELL_M) return []; return [`<i>the growth: ${fr.change > 0.5 ? 'receding' : fr.change < -0.5 ? 'advancing' : 'held'} · ${Math.round(fr.d)} m from the green</i>`]; })(),
    `infants taken ${village.taken} · home again ${village.returned}${village.dropped.length ? ` · <i>${village.dropped.length} lying out</i>` : ''}${village.brood.length + village.bred.length ? ` · <i>at the lair ${village.brood.length}, bred ${village.bred.length}</i>` : ''}`,
  ];
  // S2: the steward's board where he stands: every grown villager, their traits, and the watch to give or take.
  { const g = huntingGround(village); rows.push(`larder meat ${Math.floor(st.meat)}${village.rack ? ' · a drying rack' : ''}${g ? ` · the warren's rabbits ${Math.floor(groundRabbits(village, g))}` : ''}${guards(village).length ? ` · the watch ${guards(village).length}` : ''}${hunters(village).length ? ` · hunters ${hunters(village).length}` : ''}`); }
  if (steward.woken) rows.push(steward.at === ctx.id ? `<i>${STEWARD_NAME} the steward is here: commune with him for his board</i>` : `<i>the steward is not here: duties he gave still hold</i>`);
  infoRows.innerHTML = rows.map(r => `<div>${r}</div>`).join('');
}
// S2: the steward on the land: his figure (a working look), asleep in the moot's chair, walking his route, lying up when bitten; his label; his panel.
const stewardFig = createHulda({ name: STEWARD_NAME, height: MODEL_HEIGHT * 1.04, skin: '#d8b894', cloth: '#6a5a2a', clothLight: '#b09a4a', hair: '#5a5048', feet: '#3a3028', locks: false, leaves: false, skirt: false }); scene.add(stewardFig.group);
const stewardLabel = document.createElement('div'); stewardLabel.className = 'name steward'; stewardLabel.textContent = `${STEWARD_NAME} · the steward`; el('labels').append(stewardLabel);
const stewardPanel = el('stewardPanel'); let stewardPanelClock = 0;
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
  if (!stewardPanel.hidden) { const f = player.feet(); if (!steward.woken || Math.hypot(f.x - steward.x, f.z - steward.z) > COMMUNE_R + 6) stewardPanel.hidden = true; stewardPanelClock += dt; if (stewardPanelClock > 0.5) { stewardPanelClock = 0; renderStewardPanel(); } }
}
function renderStewardPanel(): void {
  const here = steward.at ? ctxs.find(c => c.id === steward.at) : null, going = steward.to ? ctxs.find(c => c.id === steward.to) : null;
  (stewardPanel.querySelector('.title') as HTMLElement).textContent = `${STEWARD_NAME} · the steward`;
  (stewardPanel.querySelector('.status') as HTMLElement).textContent = lyingUp(steward, home_().v.tick) ? `bitten: he lies up where he is${going ? `, on his way to ${ctxName(going)}` : ''}` : going ? `walks to ${ctxName(going)} · ${Math.round(leftToWalk(steward))} m to go` : here ? `stands at ${ctxName(here)}: his board is in its panel` : 'stands at the old moot';
  const list = stewardPanel.querySelector('.list') as HTMLElement, known = ctxs.filter(c => c.i === 0 || overworld.known.has(c.id));
  const sends = known.filter(c => steward.at !== c.id).map(c => { const b = document.createElement('button'); b.dataset.send = c.id; b.textContent = `send him to ${ctxName(c)}`; b.disabled = steward.at === c.id || steward.to === c.id; return b; });
  // S2/S3: his board, where he stands and she is: each grown villager's traits and duty (day work, the watch, the hunt); the drying rack at his word.
  const board: HTMLElement[] = [];
  if (here && here === ctx) { const head = document.createElement('div'); head.className = 'board'; const g = huntingGround(village); head.textContent = `his board · the watch ${guards(village).length}/${GUARDS_MAX} · hunters ${hunters(village).length}/${HUNTERS_MAX} · searchers ${searchers(village).length}/${SEARCHERS_MAX}${g ? ` · the warren's rabbits ${Math.floor(groundRabbits(village, g))}` : ' · no warren near to hunt'}`; board.push(head);
    for (const s of village.hobbits.filter(x => x.stage === 'grown')) { const row = document.createElement('div'); row.className = 'duty'; row.innerHTML = `${hobbitById(s.id).name} <span>${traitWords(traitsOf(s.id))}</span>`; const b = document.createElement('button'); b.dataset.duty = s.id; b.className = s.duty ? 'on' : ''; b.textContent = s.duty === 'guard' ? 'on the watch' : s.duty === 'hunt' ? 'hunting' : s.duty === 'search' ? 'searching' : 'day work'; row.append(b); board.push(row); }
    // S4: the search: where the party is, or the places heard of to send it to (a search not yet set out can be changed).
    { const se = village.search, line = document.createElement('div'); line.className = 'board';
      line.textContent = se ? (se.stage === 'muster' ? `the searchers will look for ${se.name}: they set out in the morning` : se.stage === 'home' ? `the searchers are on their way home${se.hurt ? ', bitten' : ` from ${se.name}`}` : `the searchers are out looking for ${se.name}`) : searchers(village).length ? 'the searchers wait: name a place heard of' : 'no searchers: give two the search';
      board.push(line);
      if (searchers(village).length && (!se || se.stage === 'muster')) for (const h of searchable()) { const b = document.createElement('button'); b.dataset.search = h.about; b.textContent = `search for ${h.name}${/to the ([a-z-]+)/.exec(h.text) ? ` to the ${/to the ([a-z-]+)/.exec(h.text)![1]}` : ''}`; b.disabled = se?.about === h.about; board.push(b); } }
    // S4b: what the hunters go for: rabbits alone, or boar together (a lone hunter is gored).
    if (wallowOf(village)) { const b = document.createElement('button'); b.dataset.quarry = village.quarry === 'boar' ? 'rabbit' : 'boar'; b.className = village.quarry === 'boar' ? 'on' : ''; b.textContent = village.quarry === 'boar' ? `the hunters go for boar together (the wallow's boars ${Math.floor(village.boars)}): set them on rabbits` : 'the hunters go for rabbits: set them on boar, as a party'; board.push(b); }
    if (!village.rack) { const b = document.createElement('button'); b.dataset.rack = '1'; b.textContent = `build a drying rack by the larder (${RACK_WOOD} wood)`; b.disabled = village.stores.wood < RACK_WOOD; board.push(b); } }
  list.replaceChildren(...board, ...sends);
}
/** The next duty on the board: day work, the watch, the hunt, and round again (a full duty is passed over). */
function nextDuty(s: HobbitState): boolean { const order: (Duty | null)[] = [null, 'guard', 'hunt', 'search'], i = order.indexOf(s.duty); for (let k = 1; k <= order.length; k++) { const d = order[(i + k) % order.length]; if (assignDuty(village, s.id, d)) return true; } return false; }
stewardPanel.addEventListener('click', e => {
  if ((e.target as HTMLElement).closest('[data-close]')) { stewardPanel.hidden = true; return; }
  const t = e.target as HTMLElement, send = t.closest('[data-send]') as HTMLElement | null, duty = t.closest('[data-duty]') as HTMLElement | null, rack = t.closest('[data-rack]');
  if (send && sendTo(send.dataset.send!)) renderStewardPanel();
  if (duty && steward.at === ctx.id) { const s = village.hobbits.find(x => x.id === duty.dataset.duty); if (s) { nextDuty(s); save(); renderStewardPanel(); } }
  if (rack && steward.at === ctx.id && buildRack(village)) { save(); renderStewardPanel(); }
  const quarry = t.closest('[data-quarry]') as HTMLElement | null;
  if (quarry && steward.at === ctx.id && setQuarry(village, quarry.dataset.quarry as 'rabbit' | 'boar')) { save(); renderStewardPanel(); }
  const search = t.closest('[data-search]') as HTMLElement | null;
  if (search && steward.at === ctx.id) { const about = search.dataset.search!, p = places(home.seed).find(x => x.id === about); if (p && setSearch(village, about, p.name, { x: p.x, z: p.z, r: p.radius })) { save(); renderStewardPanel(); } }
});
/** Overhead: past the shoulder the camera sits `zoom` m from her on the yaw, raised by the elevation, looking at her. */
function overheadCamera(): void { player.pitchLimit = zoom <= ZOOM_MIN + 0.05 ? PITCH_FULL : PITCH_LIMIT; if (zoom <= ZOOM_MIN + 0.05) return; const f = player.feet(), e = zoomElevation(zoom), t = new THREE.Vector3(f.x, f.y + 0.6, f.z); camera.position.set(t.x + Math.sin(player.yaw) * Math.cos(e) * zoom, t.y + Math.sin(e) * zoom, t.z + Math.cos(player.yaw) * Math.cos(e) * zoom); camera.lookAt(t); }
// F1, the practice clearing (fight.html, /vista/fight/): the village under the vista with nothing saved (the page lends it a storage that forgets), her on the meadow by mid morning with the fight open, and foes set down round her in waves, hunting her from the start; between waves her vigor and sap are made whole. Day never turns to night: past PRACTICE_LATE the clock goes on to the next morning. Tuning: the waves, their distance, the rest between them.
const PRACTICE = (window as { __ROOTWAKE_PRACTICE?: boolean }).__ROOTWAKE_PRACTICE === true;
/** The black wolves come as a pack of their own (practice only: their den is PRACTICE_DIRE, made the dire one while practising). */
const PRACTICE_WAVES: ('wolf' | 'dy' | 'dire')[][] = [['wolf'], ['wolf', 'wolf'], ['dire', 'dire', 'dire'], ['dy'], ['wolf', 'wolf', 'wolf'], ['dy', 'wolf', 'wolf'], ['dire', 'dire', 'dy'], ['dy', 'dy']], PRACTICE_DIRE = 'practice-dire';
const PRACTICE_FROM = 8, PRACTICE_REST_S = 2.5, PRACTICE_HOUR = 10, PRACTICE_LATE = 16;
const practice = { wave: 0, restUntil: 0, slainAt: 0, ids: new Set<number>(), el: null as HTMLElement | null };
function tickAtHour(hour: number, from: number): number { let t = from; while (clockOf(t).hour !== hour) t++; return t; }
function startPractice(): void {
  setTick(tickAtHour(PRACTICE_HOUR, village.tick)); const g = { x: GREEN.x + ctx.ox, z: GREEN.z + ctx.oz + 14 }; standOn(g.x, g.z, 0);
  fightBox.classList.remove('closed'); fightToggle.setAttribute('aria-expanded', 'true');
  setPanelOpen(false);
  const e = document.createElement('div'); e.id = 'practice'; e.style.cssText = 'position:fixed;z-index:6;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 40px);font:12px system-ui;letter-spacing:1.5px;color:#f4ecd0;background:#1a120ccc;padding:5px 12px;border-radius:12px;pointer-events:none;text-transform:uppercase'; document.body.append(e); practice.el = e;
  practice.restUntil = simSeconds + 1.5; practice.slainAt = village.slain; setDire(PRACTICE_DIRE);
}
function practiceFrame(): void {
  if (!PRACTICE) return;
  if (clockOf(village.tick).hour >= PRACTICE_LATE) setTick(tickAtHour(PRACTICE_HOUR, village.tick));
  const standing = village.raiders.filter(r => practice.ids.has(r.id) && r.state !== 'dead' && r.state !== 'melting' && r.state !== 'retreating' && r.state !== 'leaving');
  // Practice foes never lose interest in her.
  for (const r of standing) r.aggro = Math.max(r.aggro, DY_AGGRO_S);
  if (!standing.length && practice.restUntil === 0) practice.restUntil = simSeconds + PRACTICE_REST_S;
  if (practice.restUntil > 0 && simSeconds >= practice.restUntil && mode === 'ground' && village.hero.faint === 0) {
    practice.restUntil = 0; const kinds = PRACTICE_WAVES[practice.wave % PRACTICE_WAVES.length]; practice.wave++;
    village.hero.vigor = vigorMax(village.hero); village.hero.sap = sapMax(village.hero);
    const l = herLocal(), face = Math.atan2(-Math.cos(player.yaw), -Math.sin(player.yaw));
    kinds.forEach((k, i) => { for (let tries = 0; tries < 24; tries++) { const a = face + (i - (kinds.length - 1) / 2) * 0.6 + (tries ? (Math.random() - 0.5) * tries * 0.5 : 0), d = PRACTICE_FROM + (tries % 3), x = l.x + Math.cos(a) * d, z = l.z + Math.sin(a) * d; if (!standable(x + ctx.ox, z + ctx.oz) && tries < 23) continue; const r = spawnFoe(village, k === 'dire' ? 'wolf' : k, x, z, DY_AGGRO_S); if (k === 'dire') { r.den = PRACTICE_DIRE; r.hp = DIRE_HP; } practice.ids.add(r.id); break; } });
  }
  if (practice.el) practice.el.textContent = `practice · wave ${practice.wave} · slain ${village.slain - practice.slainAt}${practice.restUntil > 0 && practice.wave > 0 ? ' · next…' : ''}`;
}
function frame(now: number) {
  // Two clocks: the animation step is capped (a hitch must not throw her), but the village's ticks come from the real seconds that passed while the page was watched, however slow the frames (only a stall of over WALL_CAP s is dropped). Carried travel (roots, the karst's rides, sinking and rising) runs on `sim`, real seconds capped at a quarter second like the raiders' stepping, so a slow renderer does not stretch a ride.
  // F1: a blow's hit-stop and a finale's slow motion scale the world's time (the real seconds are kept for the effects' own fade and the camera's shake).
  requestAnimationFrame(frame); const real = Math.min(WALL_CAP, Math.max(0, (now - last) / 1000)); last = now; if (document.hidden || intro.open) return; const scale = impact.step(real), wall = real * scale, dt = Math.min(0.05, wall), sim = Math.min(0.25, wall), herDt = Math.min(0.05, real * impact.herScale); time += dt * 1000; simSeconds += dt;
  fx.update(Math.min(0.05, wall), camera); hurtFlash = Math.max(0, hurtFlash - Math.min(0.05, real) * 2.2); hurtEl.style.opacity = String(Math.min(1, hurtFlash)); rootEl.style.opacity = String(impact.rooted);
  // The village lives only while watched: whole ticks from the real seconds that passed, none while hidden.
  tickBank += wall * TICKS_PER_SECOND * speed; const ticks = Math.floor(tickBank); if (ticks > 0) { for (const c of ctxs) advance(c.v, ticks); tickBank -= ticks; }
  // C1: at each of the home village's dawns her growth takes its step.
  stepGrowthToDay();
  if (pendingTap && now - pendingTap > 330) { pendingTap = 0; singleTap(); }
  if (!portalEl.hidden && (mode !== 'ground' || Math.hypot(player.feet().x - portalAt.x, player.feet().z - portalAt.z) > 1.5)) closePortal();
  if (!underCap(mode)) { chunks.update(player.feet().x, player.feet().z); denField.update(player.feet(), time, packAsleepAt); }
  // RUINS.md: the ward she stands on is named; a glyph-plate she reaches is read.
  { const f = player.feet(), w = wardField.wardAt(f.x, f.z); if ((w?.id ?? null) !== wardHere) { wardHere = w?.id ?? null; if (w) say(w.name, 3); }
    camera.getWorldDirection(tmpWard); wardField.face(Math.atan2(-tmpWard.x, -tmpWard.z)); const plate = wardField.update(f, time); if (plate) tellBanner(plate.lore);
    // The industrial ruins likewise: a yard named as she comes onto it, a stone of lore read where she stands on it.
    const y = industryField.yardAt(f.x, f.z); if ((y?.id ?? null) !== yardHere) { yardHere = y?.id ?? null; if (y) say(y.name, 3); }
    industryField.face(Math.atan2(-tmpWard.x, -tmpWard.z)); const st = industryField.update(f, time); if (st) tellBanner(st.lore); }
  stepWard(dt);
  // G4: the village she is in is the one her hands and her panel belong to; the ones near enough are presented in full.
  pickActive(); { const f = player.feet(); for (const c of ctxs) { const d = Math.hypot(f.x - c.ox, f.z - c.oz), near = d <= (c.i === 0 ? HOME_NEAR_M : NEAR_M); if (near && !c.near) syncShown(c); if (!near && c.near) hideShown(c); c.near = near; c.world.root.visible = d <= SHOW_M; } }
  // D4/C1: the blight or her growth moved (at dawn): the land's trees and the roots drawn again under it.
  if (home_().v.blight !== blightDrawn || growthStamp !== growthDrawn) refreshLand();
  if (!underCap(mode) && network.update(player.feet().x, player.feet().z)) networkScene.update(network.dynamic, network.closed);
  player.update(now, mode === 'ground' ? [...ctxs.filter(c => c.near).flatMap(c => c.world.colliders), ...chunks.colliders(), ...karst.colliders] : [], undefined);
  const g = player.gesture, stickHeld = g.held && Math.hypot(g.x, g.y) >= 0.25;
  let wantUnder = 0;
  if (mode === 'ground') { player.applyCamera(camera); const f = player.feet(); if (karst.inside(f.x, f.z)) { if (!loaded() && karst.groundFrame(dt) && mode === 'ground') mode = 'karst'; } else pressInto(dt); }
  else if (mode === 'karst') { wantUnder = karst.underground ? 1 : 0; karst.update(sim, time, { held: stickHeld, x: stickX(), y: stickY() }); if (mode === 'karst' && karst.mode === 'ground') mode = 'ground'; }
  else if (mode === 'ride') rideFrame(sim);
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
      if (grassOpen(nx, nz)) { gr.x = nx; gr.z = nz; } else if (grassOpen(nx, gr.z)) gr.x = nx; else if (grassOpen(gr.x, nz)) gr.z = nz;
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
      if (Math.abs(dot) < 0.35) { r.off += dt; if (r.off > 0.25) { const p = rootPoint(r.root, r.s); if ((r.root as WorldRoot).surface && grassOpen(p.x, p.z)) { grass = { x: p.x, z: p.z, heading: player.yaw }; root = null; mode = 'grass'; } } }
      else { r.off = 0; if (dot < 0) r.forward = !r.forward; else {
        r.s += (r.forward ? 1 : -1) * ROOT_SPEED * sim;
        if (r.s >= r.root.length || r.s <= 0) { const atEnd = r.s >= r.root.length; r.s = Math.min(r.root.length, Math.max(0, r.s)); const endpoint = endTree(r.root, atEnd);
          if (r.exit) { const n = network.node(endpoint); if (n) { const stand = standNear(n); root = null; mode = 'rise'; move = { from: rootPoint(r.root, r.s), to: new THREE.Vector3(stand.x + KARST_AT.x, groundAt(ROOT_ZONES[n.zone], stand.x, stand.z), stand.z + KARST_AT.z), t: 0, seconds: 0.7, then: () => { karst.standOn(n.zone, stand.x, stand.z, stand.yaw); mode = 'ground'; } }; } }
          else { const next = nextRoot(endpoint, w, r.root); if (next) { r.root = next.root; r.forward = next.forward; r.s = next.forward ? 0 : next.root.length; } }
 }
      } }
    } else r.off = 0;
    if (mode === 'root') { const p = rootPoint(r.root, r.s); place(p); orbitCamera(p, 3.2, 1.3); }
  } else if (mode === 'meditate' && session) {
    const a = session.at, yaw = player.yaw;
    // Before a portal the camera stands on the open side, facing it (on a catwalk toward the shaft; at the island away from the karst).
    if (session.kind === 'portal') { const out = session.dir === 'out' ? new THREE.Vector3(KARST_AT.x - a.x, 0, KARST_AT.z - a.z).normalize() : new THREE.Vector3(Math.cos(islandPortal.angle), 0, Math.sin(islandPortal.angle)); camera.position.set(a.x + out.x * 2.6, a.y + 0.7, a.z + out.z * 2.6); camera.lookAt(a.x, a.y + 0.15, a.z); }
    else { camera.position.set(a.x + Math.sin(yaw) * 2.6, a.y + 3.4, a.z + Math.cos(yaw) * 2.6); camera.lookAt(a.x, a.y + 0.3, a.z); }
    if (session.from === 'catwalk') descentVisit.update(simSeconds, player.feet(), true); }
  else if (mode === 'dive' || mode === 'launch') { deepFrame(sim); }
  else if (mode === 'catwalk') { player.applyCamera(camera); descentVisit.update(simSeconds, player.feet()); }
  else if (mode === 'deep') { const n = nodeAt(); place(n); player.pitch = Math.min(1.45, Math.max(0.12, player.pitch)); camera.position.set(n.x, n.y + 0.3, n.z); camera.lookAt(camera.position.clone().add(player.forward())); presentDeep(); }
  else if ((mode === 'sink' || mode === 'rise') && move) {
    move.t = Math.min(1, move.t + sim / move.seconds); const k = move.t * move.t * (3 - 2 * move.t); const p = move.from.clone().lerp(move.to, k);
    wantUnder = mode === 'sink' ? k : 1 - k; place(p); orbitCamera(p, 3.2, 1.3);
    if (move.t === 1) { const then = move.then; move = null; then(); }
  }
  // The ease settles exactly: the ground's alpha hash would stipple forever on a residual 0.01.
  stagFrame(sim, dt);
  under += (wantUnder - under) * Math.min(1, dt * 4); if (Math.abs(under - wantUnder) < 0.01) under = wantUnder;
  // The overhead camera is placed before the names, bubbles and marks are projected (Noah: zoomed out they drifted from their figures: they were cast through the shoulder camera, then the camera moved).
  // Dev: the camera's turn rate about her while she is carried, per second of the carried clock (`sim`): with no drag it stays at zero (the journey holds it there).
  { const f = player.feet(), yaw = Math.atan2(camera.position.x - f.x, camera.position.z - f.z), carried = mode === 'root' || (mode === 'karst' && karst.mode === 'ride'); if (carried && camTurn.carried) camTurn.max = Math.max(camTurn.max, Math.abs(Math.atan2(Math.sin(yaw - camTurn.yaw), Math.cos(yaw - camTurn.yaw))) / Math.max(sim, 1e-3)); camTurn.yaw = yaw; camTurn.carried = carried; }
  if (!underCap(mode)) overheadCamera();
  fight(Math.min(0.25, wall) * speed, Math.min(0.25, real * impact.herScale)); practiceFrame(); portalFrame(simSeconds); if (endWhenIdle && !boardView.isBusy) endSession(); walkSteward(Math.min(0.25, wall) * speed, dt); stations(Math.min(0.25, wall)); stepMoves(herDt); presentHulda(herDt); trailMoves(herDt); lockFrame(dt); presentKarsts(); for (const c of ctxs) if (c.near) { presentHobbits(c, dt, wall); presentSpirits(c, dt, wall); presentRaiders(c, dt); presentIncidents(c); presentHouses(c); } presentCourse(); villageInfo(dt); deepButtons(); tellShrines(); boardView.update(time); if (mode === 'meditate') { boardView.group.scale.multiplyScalar(BOARD_FIT); boardView.group.position.y = BOARD_LIFT; } deepWorld.update(time);
  const light = daylightAt(village.tick), dusk = Math.max(0, 1 - Math.abs(light - 0.12) / 0.12);
  // From a height the view opens: the fog thins to VISTA_FOG of the ground's and the far plane reaches out, over VISTA_ALT m above the ground beneath her (the summit had the meadow's fog and a 220 m far plane, and no view: Noah's playtest). Tuning.
  const vista = (() => { const f = player.feet(), t = Math.max(0, Math.min(1, (f.y - relief(f.x, f.z) - VISTA_ALT[0]) / (VISTA_ALT[1] - VISTA_ALT[0]))); return t * t * (3 - 2 * t); })(), fogScale = 1 - vista * (1 - VISTA_FOG), far = FAR_GROUND + vista * (FAR_VISTA - FAR_GROUND);
  if (!look && Math.abs(camera.far - far) > 0.5) { camera.far = far; camera.updateProjectionMatrix(); }
  colour.copy(nightSky).lerp(daySky, Math.min(1, light * 1.6)).lerp(duskSky, dusk * 0.6); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.011 * fogScale);
  if (mode !== 'karst') karst.update(sim, time, { held: false, x: 0, y: 0 }, under); const atm = karst.atmosphere(); if (atm) { colour.copy(atm.colour); scene.background = colour; scene.fog = new THREE.FogExp2(colour, atm.inCavern ? atm.fog : atm.fog * fogScale); }
  if (inCatwalk()) { colour.set(CATWALK_FOG.colour); scene.background = colour; scene.fog = new THREE.FogExp2(colour, CATWALK_FOG.density); }
  if (inDeep(mode) && mode !== 'meditate') { colour.set(mode === 'deep' ? '#070a10' : '#14100a'); scene.background = colour; scene.fog = new THREE.FogExp2(colour, mode === 'deep' ? 0.05 : 0.22); }
  // M1 (MOTHER.md): her breath, quicker the more she attends to Hulda; the taint's sky by depth, magenta drawn in on the in-breath.
  { const att = home_().v.lair.attention; breath = stepBreath(breath, att, dt); const f = player.feet(), depth = depthOf(growthIdx, f.x, f.z) * (1 - wardCalm(f.x, f.z)); taintNow = { depth, colour: colourAt(depth, att), exhale: exhaleAt(breath), flare: flareAt(depth, att, exhaleAt(breath)) }; if (depth > 0) { colour.lerp(forestSky, 0.25 + depth * 0.6).lerp(taintSky, taintNow.colour * (1 - taintNow.exhale) * 0.4); scene.background = colour; scene.fog = new THREE.FogExp2(colour, (0.011 + depth * 0.03) * fogScale); hemi.intensity *= 1 - depth * 0.6; sun.intensity *= 1 - depth * 0.7; } }
  if (denField.inside && !inDeep(mode)) { colour.set('#120c06'); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.14); }
  if (inWard) { colour.set('#0d0b12'); scene.background = colour; scene.fog = new THREE.FogExp2(colour, 0.045); }
  hemi.intensity = 0.5 + 1.9 * light; sun.intensity = 2.3 * light; if (denField.inside) { hemi.intensity *= 0.3; sun.intensity *= 0.08; } if (inWard) { hemi.intensity = 0.35; sun.intensity = 0; } if (inCatwalk()) { hemi.intensity = 0.25; sun.intensity = 0; } for (const c of ctxs) { if (c.near) c.world.updateLand(c.v); c.world.setHouses(c.v); c.world.setSite(c.v); c.world.setHedges(c.v.hedges); c.world.update(light, time, under); } setLayouts(ctxs.map(c => ({ x: c.ox, z: c.oz, huts: c.v.huts }))); chunks.setUnder(under, player.feet().x, player.feet().z); networkScene.vision(under);
  // What happened is told: the latest as a tip, and (Noah: the bleat was not warning enough) the ones that matter as a banner across the top.
  // G2: what the villagers say of places she has not found goes to the map as a hint.
  // G4 (Noah: marks came from villages she had never been to): only the village she is in is heard. Its talk goes to the map, the fan from its green; talk elsewhere is not heard. Another village's banners reach her only once she has been there (it is known), named.
  for (const c of ctxs) { const vs = c.v.voiced, from = c.heardRumor ? vs.indexOf(c.heardRumor) + 1 : 0; let added = false; if (c === ctx) for (let i = from; i < vs.length; i++) { const r = vs[i]; if (r.bearing !== undefined && r.about && addHint(overworld, { about: r.about === 'blight' ? 'lair' : r.about, bearing: r.bearing, text: r.text, ...(c.i ? { from: { x: c.ox, z: c.oz } } : {}) })) added = true; } if (vs.length) c.heardRumor = vs[vs.length - 1]; if (added) { save(); if (mapOpen) drawMap(); } }
  for (const c of ctxs) { const evs = c.v.events, from = c.toldEvent ? evs.indexOf(c.toldEvent) + 1 : 0, heard = c === ctx || overworld.known.has(c.id); for (let i = from; i < evs.length; i++) { const e = evs[i]; if (e.banner && heard) { bannerEl.textContent = c === ctx ? e.text : `${c.short}: ${e.text}`; bannerEl.hidden = false; bannerUntil = time + BANNER_S * 1000; } else if (c === ctx) say(e.text, 5); } if (evs.length) c.toldEvent = evs[evs.length - 1]; }
  if (!bannerEl.hidden && time > bannerUntil) bannerEl.hidden = true;
  const c = clockOf(village.tick); el('clock').textContent = `Day ${c.day} · ${String(c.hour).padStart(2, '0')}:${String(c.minute).padStart(2, '0')}`;
  exploreClock += dt; if (exploreClock > 0.5) { exploreClock = 0; chunks.refreshRabbits(); chunks.refreshBoars(); const f = player.feet(); if (explore(overworld, f.x, f.z, EXPLORE_RADIUS * viewScale(powerNow())) > 0 && mapOpen) drawMap(); }
  saveClock += dt; if (saveClock > 5) { saveClock = 0; save(); }
  drawCompass(); if (miniOpen && !mapOpen) { miniClock += dt; if (miniClock >= 1 / MINI_HZ) { miniClock = 0; drawMini(); } }
  // T9: the map's atlas is built in slices of MAP_SLICE_MS a frame while the map or the minimap is open (and in idle time from boot).
  if (mapOpen || miniOpen) overMap.pump(MAP_SLICE_MS);
  const taintFx = stepTaintFx(dt); mist.update(camera, (x, z) => terrain.height(x, z), { depth: taintNow.depth, flare: taintNow.flare, on: !underCap(mode) && !denField.inside && !inWard && !atm?.inCavern }, dt);
  if (look) {
    const huts = ctxs.reduce((n, c) => n + c.v.huts, 0); if (huts !== lookHuts) { lookHuts = huts; look.refreshClearing(); }
    const f = player.feet(), ck = clockOf(village.tick);
    look.frame({ clockHour: ck.hour + ck.minute / 60, feet: f, under, stratum: mode === 'karst' ? 0 : under, interior: underCap(mode) || denField.inside || inWard || !!atm?.inCavern, gloom: taintNow.depth, colour: taintNow.colour, exhale: taintNow.exhale, ...taintFx });
    impact.push(camera); look.render(); impact.pop(camera);
  } else { impact.push(camera); renderer.render(scene, camera); impact.pop(camera); }
}
// ===== The mount (STAGS.md, Noah, 2026-10-22): her stag of soil, grass and branches. One block: the summon from healthy soil, the mounting, mode 'ride' =====
// (the stick drives the stag, she sits its back), the dismount, the stag waiting and following, its health draining in her growth and its collapse,
// the `stag` button, the health bar, and the `__village.mount` handle. The pure rules are mountModel.ts, the figure mountFigure.ts. Not saved.
import { createStag, seatClip, loadStagAsset, type StagFigure, type StagAsset } from './mountFigure';
import type { Traversal } from './mobility';
import { LONG_PRESS_MS } from './player';
import { refuseSummon, summon as summonMount, stepMount, drive as driveMount, forwardOf, lastsFor, callMount, sinkToTravel, travelPoint, dismissMount, canWade, wadeFactor, bodyLift, STAG_BELLY, SUMMON_SAP, MOUNT_SPEED, WALK_SPEED, FOLLOW_SPEED, FOLLOW_M, FOLLOW_STOP_M, CALL_RUN_M, CALL_STOP_M, CALL_SPEED, CALL_STALL_S, SINK_S, SURFACE_S, RIDE_STEP, STAG_R, MOUNT_REACH, MOUNT_S, RISE_AHEAD, STAG_WADE_DEPTH, STAG_WADE_SLOW, HEALTH as STAG_HEALTH, DRAIN as STAG_DRAIN, type Mount, type Soil, type SummonCtx } from './mountModel';
/** The ride's camera: back and up from the saddle (her walk's is 3.2 back, 1.3 up); the drop a stag refuses at a step (a ledge, not a hillside); the landing beat off a collapse (s); how far the health bar is read (m). Tuning. */
const RIDE_CAM = { back: 4.4, up: 1.9 }, RIDE_DROP = 0.9, LANDING_S = 0.6, STAG_LABEL_M = 40;
/** Pass 4 (Noah, 2026-10-25), the wake: water deeper than WAKE_FROM under a stag going faster than WAKE_SPEED throws spray every WAKE_EVERY m of its way (a few flecks at each flank at the surface) and a stride's splash sounds every SPLASH_EVERY s; the step into a river (from shallower than WAKE_FROM) is a bigger splash; the meadow's stream (villageModel.inWater), whose depth the land does not model, counts STREAM_DEEP. Where the stag stands in water deeper than her own WADE_DEPTH she is not set down (the dismount and the vault refused; a knock-off or a collapse there sets her on the nearest bank, BANK_SEARCH_M out at most). Tuning. */
const WAKE_FROM = 0.18, WAKE_SPEED = 1.2, WAKE_EVERY = 0.75, SPLASH_EVERY = 0.55, STREAM_DEEP = 0.25, BANK_SEARCH_M = 40;
/** Pass 2: the stag's body and gait from the file (STAG_CREDITS.md); until it is loaded, or if it fails, the procedural figure. `?stagasset=0` keeps the procedural one. */
let stagAsset: StagAsset | null = null;
if (query.get('stagasset') !== '0') loadStagAsset(base('models/stag.glb')).then(a => { stagAsset = a; }, e => console.warn('stag asset', e));
/** Pass 2: the button's long press (the project's LONG_PRESS_MS) dismisses the stag from anywhere. */
const STAG_HOLD_MS = LONG_PRESS_MS;
/** The stag up (or rising, or collapsing), its figure and the ground under its feet; pass 4: the water over its feet (m, 0 dry), the way made since the wake last sprayed (m) and the seconds since a stride's splash. */
let stag: { m: Mount; fig: StagFigure; y: number; wade: number; /** In water over WAKE_FROM last frame (the step in is the bigger splash). */ wet: boolean; wakeM: number; splashT: number } | null = null;
/** Her ride: the mounting beat (her feet carried from the ground to the saddle, the mount clip over it), then riding. */
let ride: { stage: 'mount' | 'ride' | 'vault'; t: number; from: THREE.Vector3; /** The vault's landing, on the ground ahead of the stag's head, and whether her dive has begun. */ to?: THREE.Vector3; dived?: boolean } | null = null;
/** The rapid dismount (Noah, 2026-10-24): riding at VAULT_SPEED or more (m/s), a tap of guard: the stag plants and puts its head down, she dives over its neck and head (VAULT_S, the dive of her dodge clip, arcing VAULT_LIFT m over the line) to land VAULT_AHEAD m ahead of its centre and roll on into her fighting stance, held STANCE_S unless the stick moves her. Slower, the tap is an ordinary dismount. Tuning. */
const VAULT_SPEED = 3, VAULT_S = 0.42, VDIVE_S = (1.02 - MOVES.dodge.from) / MOVES.dodge.scale, VAULT_LIFT = 0.7, VAULT_AHEAD = 2.3, STANCE_S = 1.4;
/** A landing beat after a collapse (the landing clip), seconds in; her seat pose on the gait's mixer and its weight; her vigor last frame mounted (a bite's drop knocks her off); a dev drive. */
let landing = -1, seat: { action: THREE.AnimationAction; w: number } | null = null, rideVigor = 0, rideDrive: { x: number; z: number; left: number } | null = null, stagFrozen = false;
const stagBtn = el<HTMLButtonElement>('stag'), stagLabel = document.createElement('div'), stagHp = document.createElement('b');
stagLabel.className = 'name'; stagLabel.hidden = true; stagLabel.append(document.createTextNode('stag')); { const meter = document.createElement('i'); meter.className = 'hunger'; meter.append(stagHp); stagLabel.append(meter); } labels.append(stagLabel);
/** What the ground under (x, z) is, by the land's own reading: water (the rivers, the lake, the meadow's stream), the karst's bare rock, a yard's floor, her dark wood, else the biome's meadow (grass) or wood. */
function soilAt(x: number, z: number): Soil {
  if (inWater(x, z) || !!plateau(home.seed).water(x, z)) return 'water';
  if (karst.inside(x, z)) return 'rock';
  if (industryField.yardAt(x, z)) return 'yard';
  const b = biomeAt(x, z, home.seed); return b === 'dark' ? 'dark' : b === 'meadow' ? 'grass' : 'wood';
}
const stagUp = (): boolean => !!stag && stag.m.phase !== 'gone';
function summonCtx(): SummonCtx {
  const f = player.feet(), l = herLocal();
  return { growth: inGrowth(growthIdx, f.x, f.z), spoiled: YIELD_SITES.some(k => isSpoiled(village, k) && Math.hypot(l.x - SITES[k].x, l.z - SITES[k].z) <= SITES[k].radius + 2), soil: soilAt(f.x, f.z), sap: village.hero.sap, up: stagUp() };
}
/** The ground a stag stands on at (x, z): the surface nearest the height it is at (a deck over water is the deck), or null where there is none. */
function stagGround(x: number, z: number, near = relief(x, z)): number | null { const s = groundWorld.surfacesAt(x, z); if (!s.length) return null; let best = s[0]; for (const y of s) if (Math.abs(y - near) < Math.abs(best - near)) best = y; return best; }
const stagV = new THREE.Vector3();
/** Pass 4: the water over a stag's feet at (x, z) with its feet at `y` (0 dry, or on a deck over the water): the plateau's rivers and lake by their surface, the meadow's stream STREAM_DEEP. */
function stagWade(x: number, z: number, y: number): number {
  const w = plateau(home.seed).water(x, z); if (w) return Math.max(0, w.surface - y);
  return inWater(x, z) ? STREAM_DEEP : 0;
}
/** Whether a stag's body can stand at (x, y, z): the land's refusals (the lake, the houses, the trunks, a yard's walls) at its own footprint, and the live colliders; pass 4: a river's water is its to wade (STAG_WADE_DEPTH takes the place of her WADE_DEPTH in the land's rule for this call). */
function stagCanStand(x: number, y: number, z: number): boolean {
  wadeLimit = STAG_WADE_DEPTH; const can = groundWorld.canOccupy(stagV.set(x, y, z), STAG_R, 1.3); wadeLimit = WADE_DEPTH; if (!can) return false;
  for (const c of [...ctxs.filter(c => c.near).flatMap(c => c.world.colliders), ...chunks.colliders(), ...karst.colliders]) { if (y >= (c.maxY ?? Infinity) || y + 1.3 <= (c.minY ?? -Infinity)) continue; const n = 'x1' in c ? (() => { const dx = c.x2 - c.x1, dz = c.z2 - c.z1, l2 = dx * dx + dz * dz, t = l2 < 1e-9 ? 0 : Math.min(1, Math.max(0, ((x - c.x1) * dx + (z - c.z1) * dz) / l2)); return { x: c.x1 + dx * t, z: c.z1 + dz * t }; })() : c; if (Math.hypot(x - n.x, z - n.z) < c.radius + STAG_R) return false; }
  return true;
}
/** A spot a stag can rise on near (x, z): there, else round it. */
function stagSpot(x: number, z: number): { x: number; z: number; y: number } | null {
  for (let r = 0; r <= 2.4; r += 0.8) for (let k = 0; k < (r === 0 ? 1 : 8); k++) { const a = (k / 8) * Math.PI * 2, sx = x + Math.cos(a) * r, sz = z + Math.sin(a) * r, y = stagGround(sx, sz); if (y !== null && stagCanStand(sx, y, sz) && soilAt(sx, sz) !== 'water') return { x: sx, z: sz, y }; }
  return null;
}
/** Noah (2026-10-24): the stag rises (and surfaces) at her side, RISE_AHEAD m off on her right (else her left, else ahead), facing the way she faces, so she mounts and rides on. */
const herHeading = (): number => herYaw;
function besideHer(f: THREE.Vector3): { x: number; z: number; y: number } | null {
  const fw = forwardOf(herHeading()), right = { x: -fw.z, z: fw.x };
  return stagSpot(f.x + right.x * RISE_AHEAD, f.z + right.z * RISE_AHEAD) ?? stagSpot(f.x - right.x * RISE_AHEAD, f.z - right.z * RISE_AHEAD) ?? stagSpot(f.x + fw.x * RISE_AHEAD, f.z + fw.z * RISE_AHEAD) ?? stagSpot(f.x, f.z);
}
/** The summon: on healthy soil with the sap, a stag rises beside her, facing her way (with her basket on or not). */
function summonStag(): boolean {
  if (mode !== 'ground' || village.hero.faint > 0) return false;
  const why = refuseSummon(summonCtx()); if (why) { say(why, 3); return false; }
  const f = player.feet(), spot = besideHer(f); if (!spot) { say('no room for a stag here'); return false; }
  village.hero.sap -= SUMMON_SAP;
  if (stag) { stag.fig.dispose(); stag = null; }
  stag = { m: summonMount(spot.x, spot.z, herHeading()), fig: createStag(home.seed, stagAsset), y: spot.y, wade: 0, wet: false, wakeM: 0, splashT: 0 }; scene.add(stag.fig.group);
  fx.spray(new THREE.Vector3(spot.x, spot.y + 0.1, spot.z), new THREE.Vector3(0, 1, 0), 'soil', 22, 2.8); fx.ring(new THREE.Vector3(spot.x, spot.y, spot.z), 2.2, '#9cff6e'); sound.thud(true); sound.roots();
  say('the soil heaves: a stag', 2.5); return true;
}
/** Her seat on its back (mountFigure.seatClip), made once the gait has its clips. */
function seatAction(): THREE.AnimationAction | null {
  if (seat) return seat.action; const g = hulda.gait; if (!g) return null;
  const a = g.mixer.clipAction(seatClip(hulda.bones, hulda.bindLocal), hulda.rig); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.paused = true; a.setEffectiveWeight(0); a.play(); seat = { action: a, w: 0 }; return a;
}
/** The mounting: within reach of a stag standing up, she goes onto its back over MOUNT_S (the mount clip, her feet carried to the saddle), then rides. */
function startMount(): boolean {
  if (mode !== 'ground' || !stag || stag.m.phase !== 'up' || village.hero.faint > 0) return false;
  const f = player.feet(); if (Math.hypot(f.x - stag.m.x, f.z - stag.m.z) > MOUNT_REACH) { say('the stag is out of reach'); return false; }
  // The camera comes round behind the stag (her yaw its heading): she was facing it.
  player.cancelInput(); lock(); mode = 'ride'; ride = { stage: 'mount', t: 0, from: f.clone() }; rideVigor = village.hero.vigor; stag.m.speed = 0; player.yaw = stag.m.heading; seatAction(); return true;
}
/** Pass 2: whether the ground between two points is the stag's to run over: sampled every RUN_SAMPLE_M, each sample ground it can stand on (the land's refusals, the colliders) within a drop of the last; pass 4: water it can wade (a river) passes, deeper water (the lake) refuses, and the samples are 0.5 m apart (they were 1.5), since a river's bank in the baked land falls about a metre a metre and a sample straddling it read as a ledge the ride's own 0.25 m substeps take in stride. */
const RUN_SAMPLE_M = 0.5;
function runnableBetween(a: { x: number; z: number }, b: { x: number; z: number }): boolean {
  const d = Math.hypot(b.x - a.x, b.z - a.z), n = Math.max(1, Math.ceil(d / RUN_SAMPLE_M)); let y = stagGround(a.x, a.z) ?? relief(a.x, a.z);
  for (let i = 1; i <= n; i++) { const x = a.x + (b.x - a.x) * i / n, z = a.z + (b.z - a.z) * i / n, g = stagGround(x, z, y); if (g === null || !canWade(stagWade(x, z, g)) || !stagCanStand(x, g, z) || Math.abs(g - y) > RIDE_DROP) return false; y = g; }
  return true;
}
const soilBurst = (x: number, y: number, z: number, n = 22): void => { fx.spray(new THREE.Vector3(x, y + 0.1, z), new THREE.Vector3(0, 1, 0), 'soil', n, 2.6); sound.thud(true); };
/** Pass 2 (Noah): the stag called to her from anywhere. Near (CALL_RUN_M) over ground it can cross it runs; farther, or with water between, it sinks into the soil where it stands and travels as a root ride does, surfacing beside her. */
function callStag(): 'run' | 'travel' | false {
  if (!stag || stag.m.phase !== 'up' || mode === 'ride') return false; const f = player.feet(), m = stag.m;
  const r = callMount(m, { x: f.x, z: f.z }, runnableBetween({ x: m.x, z: m.z }, { x: f.x, z: f.z }));
  if (r === 'travel') { soilBurst(m.x, stag.y, m.z, 16); say('the stag sinks into the soil, coming to her', 3); } else if (r === 'run') say('the stag comes', 2);
  return r;
}
/** Pass 2 (Noah): the stag dismissed from anywhere (the button held): it sinks into the soil where it stands; no sap back. Riding, she is set down first. */
function dismissStag(): boolean {
  if (!stag) return false; if (mode === 'ride') dismount('button');
  if (!dismissMount(stag.m)) return false; soilBurst(stag.m.x, stag.y, stag.m.z, 16); say('the stag sinks into the soil', 2.5); return true;
}
/** Her mount clip over the mounting beat (MOUNT_S; the clamber's window, parkour.ts), and the landing clip after a collapse: the plan and its time for the traverse layer (presentHulda); null when neither plays. */
function ridePlan(): { plan: Traversal; t: number } | null {
  if (mode === 'ride' && ride?.stage === 'mount' && stag) { const p = new THREE.Vector3(stag.m.x, stag.y, stag.m.z); return { plan: { kind: 'clamber', from: ride.from, to: p, duration: MOUNT_S, velocityY: 0, stages: [{ name: 'mount', at: 0, clip: 'mount', from: 0.25, to: 2.05 }] }, t: ride.t }; }
  if (mode === 'ground' && landing >= 0 && !player.motor.traversal) { const f = player.feet(); return { plan: { kind: 'drop', from: f, to: f, duration: LANDING_S, velocityY: 0, stages: [{ name: 'land', at: 0, clip: 'landing', from: 0.55, to: 1.65 }] }, t: landing }; }
  return null;
}
/** The way she faces mounted: the stag's heading. */
const rideHeading = (): number => (stag ? stag.m.heading : player.yaw);
/** Her seat's weight each frame (after the traverse layer has had its say on the gait's suppress): in over the mount beat's last third, out after a dismount. */
function ridePose(dt: number): void {
  if (!seat) return; const g = hulda.gait; if (!g) return;
  const want = mode === 'ride' && ride && ride.stage !== 'vault' ? (ride.stage === 'ride' ? 1 : Math.max(0, Math.min(1, (ride.t - MOUNT_S * 0.6) / (MOUNT_S * 0.4)))) : 0;
  seat.w = want > seat.w ? Math.min(want, seat.w + dt / 0.12) : Math.max(want, seat.w - dt / 0.16);
  seat.action.time = 0; seat.action.setEffectiveWeight(seat.w); if (seat.w > 0) g.suppress = Math.max(g.suppress, seat.w);
}
/** One substep of the stag's travel along its heading: the ground must be there within a step up (RIDE_STEP) or a drop (RIDE_DROP), and its body must be able to stand; refused ahead, it slides along x or z as her motor does, else it is stopped. Pass 4: into water it goes on down the bed (the drop rule holds), as long as the water is its to wade; the water over its feet is read at each substep, and takes its speed at once (its speed is clamped to `top` × wadeFactor, and the step left in this frame shrinks with it), so a long frame does not carry it through a river at the gallop. */
function moveStag(step: number, top = MOUNT_SPEED): void {
  if (!stag || step <= 0) return; const s = stag, m = s.m, f = forwardOf(m.heading);
  const tryTo = (x: number, z: number): boolean => { const y = stagGround(x, z, s.y); if (y === null || y - s.y > RIDE_STEP || s.y - y > RIDE_DROP || !canWade(stagWade(x, z, y)) || !stagCanStand(x, y, z)) return false; m.x = x; m.z = z; s.y = y; return true; };
  let left = step; while (left > 1e-6) {
    const d = Math.min(0.25, left); if (!tryTo(m.x + f.x * d, m.z + f.z * d) && !tryTo(m.x + f.x * d, m.z) && !tryTo(m.x, m.z + f.z * d)) { m.speed *= 0.2; break; }
    left -= d; s.wakeM += d; s.wade = m.phase === 'up' ? stagWade(m.x, m.z, s.y) : 0;
    const pace = top * wadeFactor(s.wade); if (m.speed > pace + 1e-6) { left *= pace / m.speed; m.speed = pace; }
  }
}
/** Pass 4: the stag's pace where it stands, its gallop slowed by the water over its feet (mountModel.wadeFactor). */
const stagPace = (top = MOUNT_SPEED): number => top * wadeFactor(stag?.wade ?? 0);
/** Pass 4: the drive at the wade's pace: the drive's target is the pace where it stands (the water takes its speed at once in `moveStag`, and it gathers it again as it comes out by the drive's ease). Returns the step (m). */
function driveWading(m: Mount, dt: number, want: { x: number; z: number } | null, amount: number, top = MOUNT_SPEED): number {
  const pace = stagPace(top); let step = driveMount(m, dt, want, amount, pace);
  if (m.speed > pace + 1e-6) { step *= pace / m.speed; m.speed = pace; }
  return step;
}
/** Pass 4: whether the stag stands in water deeper than she wades (WADE_DEPTH): she is not set down there. */
const stagInDeepWater = (): boolean => !!stag && stag.wade >= WADE_DEPTH;
/** Pass 4: the nearest spot she can stand on from the stag, searched outward along its heading and across it (BANK_SEARCH_M at most): the bank, when it stands in the river. */
function nearestBank(): [number, number] | null {
  if (!stag) return null; const m = stag.m, f = forwardOf(m.heading), dirs = [f, { x: -f.x, z: -f.z }, { x: f.z, z: -f.x }, { x: -f.z, z: f.x }];
  for (let r = 1; r <= BANK_SEARCH_M; r += 0.5) for (const d of dirs) { const x = m.x + d.x * r, z = m.z + d.z * r; if (standable(x, z)) return [x, z]; }
  return null;
}
/** The ride, each frame in mode 'ride' (before the stag's own step): a bite or a faint knocks her off; the mount beat runs; then the stick drives the stag. */
function rideFrame(sim: number): void {
  if (!stag || !ride || stag.m.phase !== 'up') { if (mode === 'ride') dismount('collapse'); return; }
  // A faint, a tree stag's knockdown (hero.down, the creature session's) or a bite's drop in her vigor knocks her off.
  if (village.hero.faint > 0 || (village.hero.down ?? 0) > 0 || village.hero.vigor < rideVigor - BITE_FELT) { knockOffMount(village.hero.faint > 0 ? 'faint' : 'bitten'); return; } rideVigor = village.hero.vigor;
  if (ride.stage === 'mount') { ride.t += sim; guardTapped = false; if (ride.t >= MOUNT_S) { ride.stage = 'ride'; ride.t = 0; } return; }
  if (ride.stage === 'vault') { ride.t += sim; moveStag(driveMount(stag.m, sim * 3, null, 0) / 3); if (!ride.dived && ride.t >= VAULT_S - VDIVE_S) ride.dived = !!moves?.press('dodge'); if (ride.t >= VAULT_S) landVault(); return; }
  // Pass 4: in a river deeper than she wades, neither the vault nor the dismount sets her down.
  if (guardTapped) { guardTapped = false; if (stagInDeepWater()) { say('not into the water', 2); return; } if (stag.m.speed >= VAULT_SPEED && startVault()) return; dismount('button'); return; }
  ride.t += sim; const g = player.gesture;
  let w: { x: number; z: number } | null = null, amount = 0;
  if (rideDrive && rideDrive.left > 0) { rideDrive.left -= sim; const l = Math.hypot(rideDrive.x, rideDrive.z) || 1; w = { x: rideDrive.x / l, z: rideDrive.z / l }; amount = 1; } else { if (rideDrive) rideDrive = null; const v = want(); if (v.lengthSq() > 0) { w = { x: v.x, z: v.z }; amount = Math.min(1, Math.hypot(g.x, g.y)); } }
  moveStag(driveWading(stag.m, sim, w, amount));
}
/** The rapid dismount's start: a landing spot ahead of the stag's head that she can stand on, her dive begun. False (and nothing done) when there is none. */
function startVault(): boolean {
  if (!stag || !ride || !moves) return false; const m = stag.m, f = forwardOf(m.heading), ahead = VAULT_AHEAD + m.speed * 0.12;
  let at: { x: number; z: number } | null = null; for (const d of [ahead, ahead - 0.6, ahead + 0.6, ahead - 1.1]) { const x = m.x + f.x * d, z = m.z + f.z * d; if (standable(x, z)) { at = { x, z }; break; } }
  if (!at || moves.queue.busy) return false;
  ride.stage = 'vault'; ride.t = 0; ride.from = stag.fig.saddle(new THREE.Vector3()); ride.to = new THREE.Vector3(at.x, relief(at.x, at.z), at.z);
  sound.roll(); say('the stag drops its head: over it she goes', 2); return true;
}
/** The vault's landing: on her feet ahead of it, rolling on the dodge's own travel, then her fighting stance. The stag stands waiting. */
function landVault(): void {
  if (!stag || !ride?.to) return; const m = stag.m, f = forwardOf(m.heading), to = ride.to;
  ride = null; seat?.action.setEffectiveWeight(0); standOn(to.x, to.z, m.heading); player.pitch = Math.min(player.pitch, 0.12);
  const c = moves?.queue.current; if (c && c.move === 'dodge') dodge = { dx: f.x, dz: f.z, heading: m.heading, p: dodgeProgress(c.t) };
  stanceUntil = simSeconds + STANCE_S; fx.spray(new THREE.Vector3(to.x, to.y + 0.05, to.z), new THREE.Vector3(f.x, 0.4, f.z), 'soil', 8, 1.6); sound.thud(false);
}
/** She comes off: beside it (the button, a hit), or on her feet where it fell (a collapse, with the landing beat); the stag stands waiting. Pass 4: in a river deeper than she wades the button refuses; a knock-off or a collapse there sets her on the nearest bank. */
function dismount(reason: 'button' | 'hit' | 'collapse' | 'faint'): boolean {
  if (mode !== 'ride' || !stag) return false; const m = stag.m, f = forwardOf(m.heading), left = { x: f.z, z: -f.x };
  if (reason === 'button' && stagInDeepWater()) { say('not into the water', 2); return false; }
  const spots = reason === 'collapse' ? [[m.x, m.z], [m.x + left.x * 1.1, m.z + left.z * 1.1], [m.x - left.x * 1.1, m.z - left.z * 1.1], [m.x + f.x * 1.6, m.z + f.z * 1.6]] : [[m.x + left.x * 1.1, m.z + left.z * 1.1], [m.x - left.x * 1.1, m.z - left.z * 1.1], [m.x - f.x * 1.6, m.z - f.z * 1.6], [m.x + f.x * 1.6, m.z + f.z * 1.6]];
  let at: number[] | null = null; for (const s of spots) if (standable(s[0], s[1])) { at = s; break; }
  if (!at) { for (let r = 1.5; r <= 4 && !at; r += 0.5) for (let k = 0; k < 12 && !at; k++) { const a = (k / 12) * Math.PI * 2, x = m.x + Math.cos(a) * r, z = m.z + Math.sin(a) * r; if (standable(x, z)) at = [x, z]; } }
  if (!at && stagInDeepWater()) at = nearestBank();
  if (!at) at = [m.x, m.z];
  ride = null; seat?.action.setEffectiveWeight(0); standOn(at[0], at[1], m.heading); player.pitch = Math.min(player.pitch, 0.12);
  if (reason === 'collapse') { landing = 0; sound.thud(false); } else if (reason === 'hit' || reason === 'faint') { landing = 0; moves?.flinch(); } else say('she slips down; the stag waits', 2.5);
  return true;
}
/** For the creature session's knockdown (the tree stag) and the hit path: true if she was mounted and is now on foot beside the stag, the stag standing. */
function knockOffMount(reason = 'hit'): boolean { if (mode !== 'ride') return false; return dismount(reason === 'faint' ? 'faint' : 'hit'); }
/** The stag's frame, every frame: its health by the growth's depth where it stands (it drains and collapses left standing in the growth too), its following when she walks off, its figure; mounted, her feet on the saddle and the ride's camera; the button and the health bar. */
function stagFrame(sim: number, dt: number): void {
  if (landing >= 0) { landing += dt; if (landing >= LANDING_S) landing = -1; }
  const f = player.feet();
  if (stag) {
    const s = stag, m = s.m, depth = depthOf(growthIdx, m.x, m.z) * (1 - wardCalm(m.x, m.z)), healthy = depth <= 0 && (soilAt(m.x, m.z) === 'grass' || soilAt(m.x, m.z) === 'wood');
    const ev = stagFrozen ? null : stepMount(m, sim, depth, healthy);
    if (ev === 'collapsed') { fx.spray(new THREE.Vector3(m.x, s.y + 0.6, m.z), new THREE.Vector3(0, 1, 0), 'soil', 26, 2.4); sound.thud(true); if (mode === 'ride') { dismount('collapse'); say('the stag crumbles under her: she lands on her feet', 3); } else say('her stag crumbles into soil', 3); }
    if (ev === 'gone') { s.fig.dispose(); stag = null; }
    else {
      // Pass 2: under the soil it travels toward where she is now; it surfaces beside her, facing her, with a spray of soil.
      if (m.phase === 'travelling') { const p = travelPoint(m, { x: f.x, z: f.z }); m.x = p.x; m.z = p.z; }
      if (ev === 'surfacing') { const spot = besideHer(f); if (spot) { m.x = spot.x; m.z = spot.z; s.y = spot.y; } else s.y = stagGround(m.x, m.z) ?? relief(m.x, m.z); m.heading = herHeading(); soilBurst(m.x, s.y, m.z); sound.roots(); }
      // Waiting, it follows her at a walk once she is FOLLOW_M off, and stops near; called, it runs to her and stops CALL_STOP_M off (a run that makes no way for CALL_STALL_S sinks and travels instead); the drive eases its speed either way.
      if (m.phase === 'up' && mode !== 'ride') {
        const d = Math.hypot(f.x - m.x, f.z - m.z), going = m.speed > 0.05;
        // (Pass 4: a called run's step never carries it past CALL_STOP_M of her, a slow renderer's long frame would otherwise put it on her; so it arrives a hair over CALL_STOP_M, and the stop allows the hair.)
        if (m.called) { if (d <= CALL_STOP_M + 0.02) { m.called = false; driveMount(m, sim, null, 0); } else { const was = m.speed; moveStag(Math.min(driveWading(m, sim, { x: (f.x - m.x) / d, z: (f.z - m.z) / d }, 1), Math.max(0, d - CALL_STOP_M))); m.stalled = m.speed < Math.min(0.3, was * 0.5) && m.t > 0.5 ? m.stalled + sim : 0; if (m.stalled >= CALL_STALL_S) { sinkToTravel(m, { x: f.x, z: f.z }); soilBurst(m.x, s.y, m.z, 16); } } }
        else if (d > FOLLOW_M || (going && d > FOLLOW_STOP_M)) moveStag(driveWading(m, sim, { x: (f.x - m.x) / d, z: (f.z - m.z) / d }, 1, FOLLOW_SPEED), FOLLOW_SPEED); else driveMount(m, sim, null, 0);
      }
      // Pass 4: the water over its feet; wading at speed, spray at each flank and a stride's splash; the step into a river a bigger one.
      { s.wade = m.phase === 'up' ? stagWade(m.x, m.z, s.y) : 0; const surface = s.y + s.wade, fw = forwardOf(m.heading), side = { x: -fw.z, z: fw.x }, wet = s.wade > WAKE_FROM;
        if (wet && m.speed > WAKE_SPEED) {
          if (!s.wet) { fx.spray(new THREE.Vector3(m.x + fw.x * 0.6, surface, m.z + fw.z * 0.6), new THREE.Vector3(fw.x * 0.5, 1, fw.z * 0.5), 'water', 18, 3); sound.splash(true); s.splashT = 0; s.wakeM = 0; }
          s.splashT += sim; if (s.splashT >= SPLASH_EVERY) { s.splashT = 0; sound.splash(false); }
          if (s.wakeM >= WAKE_EVERY) { s.wakeM = 0; for (const k of [1, -1]) fx.spray(new THREE.Vector3(m.x + side.x * k * 0.45 - fw.x * 0.3, surface, m.z + side.z * k * 0.45 - fw.z * 0.3), new THREE.Vector3(side.x * k * 0.7 - fw.x * 0.5, 1, side.z * k * 0.7 - fw.z * 0.5), 'water', 6, 1.8 + m.speed * 0.2); }
        } else { s.wakeM = Math.min(s.wakeM, WAKE_EVERY); s.splashT = SPLASH_EVERY; }
        s.wet = wet; }
      // (Pass 4: in water past its belly the body rides lifted, STAG_BELLY deep, its feet on the bed below: mountModel.bodyLift.)
      s.fig.update(m.x, s.y + bodyLift(s.wade), m.z, m.heading, { phase: m.phase, t: m.t, speed: m.speed, still: m.still, health: m.health, bow: mode === 'ride' && ride?.stage === 'vault' ? 1 : 0 }, dt);
      if (mode === 'ride' && ride) {
        const sp = s.fig.saddle(stagV);
        if (ride.stage === 'mount') { const k = Math.min(1, ride.t / MOUNT_S), e = k * k * (3 - 2 * k); stagV.lerpVectors(ride.from, sp, e); stagV.y += Math.sin(e * Math.PI) * 0.25; }
        // The vault: from the saddle over the neck and head to the ground ahead, on an arc; the dive's clip pitches her head first.
        else if (ride.stage === 'vault' && ride.to) { const k = Math.min(1, ride.t / VAULT_S); stagV.lerpVectors(ride.from, ride.to, k); stagV.y += Math.sin(k * Math.PI) * VAULT_LIFT * (1 - k * 0.3); }
        // (Dev: with the stag's clock frozen, for a still, the camera snaps to the saddle instead of easing, so a slow renderer's lag does not put the stag off-centre.)
        place(stagV.clone()); orbitCamera(stagV, RIDE_CAM.back, RIDE_CAM.up, stagFrozen ? 1 : 0.5);
      }
      // The health bar over it, read while near.
      tmp.set(m.x, s.y + 2.1, m.z); const dist = tmp.distanceTo(camera.position); tmp.project(camera); const show = m.phase !== 'collapsing' && m.phase !== 'travelling' && tmp.z < 1 && dist < STAG_LABEL_M && Math.abs(tmp.x) < 1.1;
      stagLabel.hidden = !show; if (show) { stagLabel.style.transform = `translate(${(tmp.x + 1) * innerWidth / 2}px,${(1 - tmp.y) * innerHeight / 2}px) translate(-50%,-100%)`; stagLabel.style.opacity = '1'; stagHp.style.width = `${m.health / STAG_HEALTH * 100}%`; stagHp.style.background = depth > 0 ? '#c060e0' : '#8fc45a'; stagLabel.firstChild!.textContent = `stag · ${Math.ceil(m.health)}${depth > 0 ? ` · fading, ${Math.ceil(m.health / (STAG_HEALTH / lastsFor(depth)))} s` : m.phase === 'rising' ? ' · rising' : m.phase === 'surfacing' ? ' · surfacing' : m.phase === 'sinking' ? ' · sinking' : m.called ? ' · coming' : ''}`; }
    }
  } else stagLabel.hidden = true;
  // The button (pass 2): `stag` on healthy soil with none up; one standing: `mount` within reach, `call` beyond it (from anywhere); on its way, `coming`; `dismount` riding; hidden elsewhere (and while she is anything but on her feet). Held, it dismisses the stag from anywhere.
  const label = mode === 'ride' ? (ride?.stage === 'ride' ? 'dismount' : null) : mode === 'ground' && village.hero.faint === 0 ? (stagUp() ? (stag!.m.phase === 'up' ? (Math.hypot(f.x - stag!.m.x, f.z - stag!.m.z) <= MOUNT_REACH ? 'mount' : 'call') : stag!.m.phase === 'collapsing' ? null : 'coming') : refuseSummon(summonCtx()) === null ? 'stag' : null) : null;
  stagBtn.hidden = !label; if (label) { stagBtn.firstElementChild!.textContent = label; stagBtn.classList.toggle('on', mode === 'ride'); }
}
{ let hold = 0, held = false; const act = (): void => { if (mode === 'ride') dismount('button'); else if (stagUp()) { if (stag!.m.phase !== 'up') return; const f = player.feet(); if (Math.hypot(f.x - stag!.m.x, f.z - stag!.m.z) <= MOUNT_REACH) startMount(); else callStag(); } else summonStag(); };
  stagBtn.addEventListener('pointerdown', e => { e.preventDefault(); sound.wake(); held = false; clearTimeout(hold); hold = window.setTimeout(() => { hold = 0; held = true; if (stagUp()) dismissStag(); }, STAG_HOLD_MS); });
  for (const ev of ['pointerup', 'pointercancel', 'pointerleave'] as const) stagBtn.addEventListener(ev, e => { if (ev === 'pointerup') e.preventDefault(); if (hold) { clearTimeout(hold); hold = 0; if (!held && ev === 'pointerup') act(); } held = false; }); }
const mountHandle = {
  summon: summonStag, mount: startMount, dismount: () => dismount('button'), /** Dev: a tap of guard while riding (the rapid dismount at a gallop). */ guardTap: () => { if (mode === 'ride') guardTapped = true; }, get stance() { return stanceUntil > simSeconds; }, call: callStag, dismiss: dismissStag, knockOffMount, canSummon: () => refuseSummon(summonCtx()), ctx: summonCtx, soil: soilAt, runnable: (x: number, z: number) => (stag ? runnableBetween({ x: stag.m.x, z: stag.m.z }, { x, z }) : false), get asset() { return !!stagAsset; },
  get state() { return { stag: stag ? { ...stag.m, y: stag.y, wade: stag.wade, triangles: stag.fig.triangles, meshes: stag.fig.meshes, kind: stag.fig.kind, lasts: lastsFor(depthOf(growthIdx, stag.m.x, stag.m.z)) } : null, ride: ride ? { ...ride, from: undefined } : null, mode, seat: seat?.w ?? 0, landing, riding: mode === 'ride' && ride?.stage === 'ride', vaulting: mode === 'ride' && ride?.stage === 'vault', her: herYaw, basket: basket.group.visible, driving: !!rideDrive && rideDrive.left > 0 }; },
  /** Dev: drive the stag along (dx, dz) for `seconds` of the ride's clock, as the stick would. */
  ride: (dx: number, dz: number, seconds: number) => { rideDrive = seconds > 0 ? { x: dx, z: dz, left: seconds } : null; },
  /** Dev: set the stag's state (health, phase, t, or where it stands: it is put on the ground there), freeze its clock (for a still of the rise), the constants. */
  set: (p: Partial<Mount>) => { if (stag) { Object.assign(stag.m, p); if (p.x !== undefined || p.z !== undefined) stag.y = stagGround(stag.m.x, stag.m.z) ?? relief(stag.m.x, stag.m.z); } }, set frozen(v: boolean) { stagFrozen = v; }, get frozen() { return stagFrozen; },
  /** Pass 4 (dev): the water over the stag's feet (m) and whether she may be set down where it stands. */
  get wade() { return stag?.wade ?? 0; }, get deepWater() { return stagInDeepWater(); }, water: (x: number, z: number) => plateau(home.seed).water(x, z),
  /** Dev: the line from (ax, az) to (bx, bz) as `runnableBetween` reads it, sample by sample (its ground, the water over it, whether the stag can stand, the drop from the last), for the checks' diagnostics. */
  probeLine: (ax: number, az: number, bx: number, bz: number, every = RUN_SAMPLE_M) => { const d = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(d / every)), out: { x: number; z: number; g: number | null; wade: number; stand: boolean; drop: number }[] = []; let y = stagGround(ax, az) ?? relief(ax, az); for (let i = 0; i <= n; i++) { const x = ax + (bx - ax) * i / n, z = az + (bz - az) * i / n, g = stagGround(x, z, y); out.push({ x: +x.toFixed(2), z: +z.toFixed(2), g: g === null ? null : +g.toFixed(2), wade: g === null ? 0 : +stagWade(x, z, g).toFixed(2), stand: g !== null && stagCanStand(x, g, z), drop: g === null ? 0 : +(g - y).toFixed(2) }); if (g !== null) y = g; } return out; },
  constants: { VAULT_SPEED, SUMMON_SAP, MOUNT_SPEED, FOLLOW_SPEED, FOLLOW_M, CALL_RUN_M, CALL_STOP_M, CALL_SPEED, SINK_S, SURFACE_S, RIDE_STEP, MOUNT_REACH, MOUNT_S, RISE_AHEAD, STAG_WADE_DEPTH, STAG_WADE_SLOW, STAG_BELLY, WADE_DEPTH, HEALTH: STAG_HEALTH, DRAIN: STAG_DRAIN, walk: WALK_SPEED },
};
// ===== end of the mount =====
if (PRACTICE) startPractice();
player.applyCamera(camera); presentHulda(0); presentHobbits(ctx, 0); world.updateLand(village); world.update(daylightAt(village.tick), 0); scene.background = daySky; renderer.render(scene, camera); intro.showModal(); requestAnimationFrame(frame);
Object.assign(window, { __village: { mount: mountHandle, steward: { get state() { return JSON.parse(serializeSteward(steward)); }, moot: mootPlace, name: STEWARD_NAME, wake: wakeSteward, send: sendTo, place: (x: number, z: number) => { steward.x = x; steward.z = z; steward.route = []; steward.to = null; steward.at = null; }, arriveAt: (id: string) => { const c = ctxs.find(x => x.id === id)!; const g = greenOf(c); steward.x = g.x; steward.z = g.z; steward.route = []; steward.to = null; steward.at = id; steward.hurtUntil = 0; saveSteward(); } }, assign: (id: string, duty: Duty | null) => assignDuty(village, id, duty), heroes: () => (steward.woken ? [{ id: 'steward', name: STEWARD_NAME, x: steward.x, z: steward.z }] : []), ownWarrens: () => ownWarrenPlaces.map(w => ({ ...w, rabbits: rabbitStock(w.id) })), hunters: () => hunters(village).map(s => ({ ...s })), ground: () => huntingGround(village), rack: () => village.rack, quarry: () => village.quarry, boars: () => village.boars, setQuarry: (q: 'rabbit' | 'boar') => setQuarry(village, q), wallow: () => wallowOf(village), boarHunt: () => (village.boarHunt ? { ...village.boarHunt } : null), dire: () => steward.dire, hearAll: () => { for (const r of rumors(village)) if (r.bearing !== undefined && r.about && r.about !== 'blight') addHint(overworld, { about: r.about, bearing: r.bearing, text: r.text, ...(ctx.i ? { from: { x: ctx.ox, z: ctx.oz } } : {}) }); return overworld.hints.length; }, search: () => (village.search ? { ...village.search } : null), searchParty: () => searchParty(village), searchable, setSearch: (about: string) => { const p = places(home.seed).find(x => x.id === about); return !!p && setSearch(village, about, p.name, { x: p.x, z: p.z, r: p.radius }); }, larder: () => village.stores.meat, openSteward: () => communeNear(), guards: () => guards(village).map(s => ({ ...s })), traits: (id: string) => traitsOf(id), hulda, presentation, scene, camera, renderer, player, network, terrain, camTurn, rootTrees: TREES, heap: storeSpot(STORES.dark), cult: { get state() { return { ...cultivation }; }, world: worldNow, get power() { return powerNow(); }, override: (w: WorldState | null) => { worldOverride = w; }, cultivate: () => startSession('cultivate'), reset: () => { cultivation = freshCultivation(); saveCultivation(); }, /** Dev: growth as if cultivated. */ grow: (n: number) => { grow(cultivation, n); saveCultivation(); } }, villagerAt: (id: string) => { const s = village.hobbits.find(h => h.id === id); return s ? { id, x: s.x + ctx.ox, z: s.z + ctx.oz, inside: s.inside } : null; }, get lastCommune() { return lastCommune; }, news: () => village.hobbits.filter(s => hasNews(s)).map(s => ({ id: s.id, x: s.x + ctx.ox, z: s.z + ctx.oz, inside: s.inside, text: newsFor(village, s, placeKnown)!.text, about: newsFor(village, s, placeKnown)!.about })), commune: communeNear, ruins: () => ruins(home.seed), sanctified: () => [...overworld.sanctified], den: { layout: (id: string) => denField.layout(id), get inside() { return denField.inside; }, get built() { return denField.builtCount; }, pack: (id: string) => denField.packAt(id), asleep: packAsleepAt, enter: (id: string) => { const l = denField.layout(id); if (!l) return false; const c = l.chambers.find(ch => ch.deepest)!; place(new THREE.Vector3(c.c.x - c.r * 0.6, c.c.y - c.h * CHAMBER_FLOOR, c.c.z)); return true; } }, get hedges() { return village.hedges.map(h => ({ ...h })); }, territory, miraclesHere: () => { const l = herLocal(); return miraclesHere(stationAt(l.x, l.z)?.keeps ?? null, l).map(miracleName); }, get vista() { const f = player.feet(); return { alt: f.y - relief(f.x, f.z), far: camera.far, fog: (scene.fog as THREE.FogExp2).density }; }, canGrass: grassCan, rootNodes: ROOT_NODES, emerge, plotCourse, clearCourse, tapStick: () => singleTap(), get figures() { return world.figures; }, get course() { return course ? { entry: course.entry, goal: course.goal, nodes: [...course.nodes], roots: course.roots.map(r => r.id), length: course.length, at: courseAt, target: courseTarget } : null; }, get carried() { return carried; }, wayIn: () => (wayIn.visible ? { x: wayIn.position.x, z: wayIn.position.z } : null), portal: { open: (id: string) => openPortal(ROOT_NODES[id]), get isOpen() { return !portalEl.hidden; }, places: () => [...portalEl.querySelectorAll<HTMLButtonElement>('button[data-to]')].map(b => b.dataset.to!), pick: (to: string) => { (portalEl.querySelector(`button[data-to="${to}"]`) as HTMLButtonElement | null)?.click(); } }, hobbits: HOBBITS, folk: () => folkOf(village.folk).all.map(h => ({ id: h.id, name: h.name })), villages: () => ctxs.map(c => ({ id: c.id, name: c.name, short: c.short, folk: c.folk, x: c.ox, z: c.oz, held: c.v.held, turned: c.v.turned, tick: c.v.tick, population: c.v.hobbits.length, dead: c.v.dead.length, state: villageState(c.v).kind, near: c.near, active: c === ctx, stack: c.v.stack ? { ...c.v.stack } : null })), get active() { return ctx.id; }, villageSites: () => sites.map(s => ({ ...s })), goTo: (id: string) => { const c = ctxs.find(c => c.id === id); if (!c) return false; standOn(c.ox, c.oz - 16, Math.PI); pickActive(); return ctx === c; }, herLocal, get houses() { return housesOf(village); }, get huts() { return village.huts; }, get site() { return village.site ? { ...village.site } : null; }, askHut: () => askHut(village), quicken: (k: YieldSite) => quicken(village, k), trees: TREES, roots: TREE_ROOTS.length, get mode() { return mode; }, get simSeconds() { return simSeconds; }, get under() { return under; }, get grass() { return grass ? { ...grass } : null; }, get root() { return root ? { root: root.root.id, s: root.s, length: root.root.length, forward: root.forward } : null; }, get trunk() { return trunk ? { tree: trunk.tree.id, h: trunk.h } : null; }, get crown() { return crown ? { tree: crown.tree.id, az: crown.az, armed: crown.armed } : null; }, get transitioning() { return mode === 'hop' || mode === 'sink' || mode === 'rise'; }, sinkAt: (x: number, z: number) => { standOn(x, z); enterGrass(new THREE.Vector3(x, relief(x, z), z)); }, standAt: (x: number, z: number, yaw: number) => standOn(x, z, yaw), thoughts: () => village.hobbits.map(s => thought(s, village.tick)), get population() { return village.hobbits.length; }, breed: (n = 1) => { for (let i = 0; i < n; i++) { const id = newcomersOf(village).slice().reverse().find(c => !village.bred.some(b => b.id === c.id) && !village.hobbits.some(h => h.id === c.id))?.id; if (id) village.bred.push({ id, home: 0, born: village.tick }); } return village.bred.length; }, get holding() { return village.hero.holding; }, get blight() { return village.blight; }, set blight(m: number) { village.blight = m; }, isBlighted: (x: number, z: number) => isBlighted(village, x, z), get bannerText() { return bannerEl.hidden ? '' : bannerEl.textContent; }, bear: () => { const ok = bear(village); syncShown(); return ok; }, snatchers: () => village.snatchers.map(n => ({ ...n })), /** Dev (the brood): the active village itself, to stage snatchers and sacs. */ get live() { return village; }, get dropped() { return village.dropped.map(d => ({ ...d })); }, get inArms() { return village.carried ? { ...village.carried } : null; }, get bred() { return village.bred.length; }, get brood() { return village.brood.length; }, get taken() { return village.taken; }, get returned() { return village.returned; }, infants: () => village.hobbits.filter(s => s.stage === 'infant').map(s => ({ id: s.id, home: s.home })), houseDoor: (i: number) => ({ x: housePlace(i).door.x + ctx.ox, z: housePlace(i).door.z + ctx.oz }), get events() { return village.events.map(e => ({ ...e })); }, get state() { return villageState(village); }, stateText: () => stateText(villageState(village)), rumors: () => rumors(village), get voiced() { return village.voiced.map(r => ({ ...r })); }, get hints() { return overworld.hints.map(h => ({ ...h })); }, clearHints: () => { overworld.hints = []; }, isSpoiled: (k: YieldSite) => isSpoiled(village, k), spoil: (k: YieldSite) => spoil(village, k), dens: () => dens(village.seed).map(d => ({ ...d, ...(village.dens[d.id] ?? {}), inReach: Math.hypot(d.x - ctx.ox, d.z - ctx.oz) <= 500 })), setDens: (list: DenPlace[]) => { setDens(list); setWarrens([]); }, setWarrens: (list: WarrenPlace[]) => { setWarrens(list); }, warrens: () => warrenPlaces.map(w => ({ ...w, rabbits: rabbitStock(w.id) })), setRabbits: (den: string, n: number) => { const k = denKnownBy(den); if (k) denState(k.c.v, k.d).rabbits = n; chunks.refreshRabbits(); }, restoreDens: () => { setWarrens(warrenPlaces); setDens(dens(village.seed).map(d => ({ id: d.id, x: d.x, z: d.z, pack: d.pack }))); }, densInReach: () => densInReach(village).map(d => ({ ...d, ...denState(village, d) })), wolves: () => wolves(village).map(r => ({ ...r })), danger: (x: number, z: number) => danger(x, z), wolfTick: WOLF_TICK, get dead() { return village.dead.map(d => ({ ...d })); }, facing: () => world.figures.map((f, i) => { const s = village.hobbits[i], fwd = { x: -Math.sin(f.group.rotation.y), z: -Math.cos(f.group.rotation.y) }; return { moving: s.speed > 0 && s.path.length > 0, dot: s.path.length ? (fwd.x * (s.path[0].x - s.x) + fwd.z * (s.path[0].z - s.z)) / (Math.hypot(s.path[0].x - s.x, s.path[0].z - s.z) || 1) : 0 }; }), inWater, get village() { return JSON.parse(serializeVillage(village)); }, get tick() { return village.tick; }, get phase() { return phaseAt(village.tick); }, get clock() { return clockOf(village.tick); }, dayTicks: DAY_TICKS, count: (where: 'inside' | 'green' | 'out') => everyone(village, where), advance: (n: number) => { advance(village, n); syncShown(); save(); }, hobbit: (id: string) => ({ ...village.hobbits.find(s => s.id === id)!, keeps: hobbitById(id).keeps }), get stores() { return { ...village.stores }; }, get land() { return JSON.parse(JSON.stringify(village.land)); }, get fireWood() { return village.fireWood; }, get take() { return { ...village.lastTake }; }, get balance() { return balance(village); }, storeSpots: STORES, carrying: () => village.hobbits.map(s => s.carry), hungers: () => village.hobbits.map(s => s.hunger), armfuls: () => world.armfuls(), karstFeature: () => karst, karst: { get mode() { return karst.mode; }, get zone() { return karst.zone; }, get at() { return karst.at; }, get travelling() { return karst.travelling; }, get queued() { return karst.queued; }, origin: KARST_AT, inside: (x: number, z: number) => karst.inside(x, z), standOn: (zone: string, x: number, z: number, yaw: number) => { karst.standOn(zone, x, z, yaw); mode = 'ground'; }, nodes: NODES_HANDLE }, chunks: () => ({ loaded: chunks.count, trees: chunks.trees }), treesNear: (x: number, z: number, r: number) => treesNear(x, z, r).map(t => ({ ...t })), relief, compass: () => { const f = player.feet(); return { heading: bearingOf(-Math.sin(player.yaw), -Math.cos(player.yaw)), marks: [...knownPlaces(overworld).map(p => ({ id: p.id, x: p.x, z: p.z })), ...allIncidents().map(i => ({ id: 'incident', x: i.x, z: i.z }))].map(p => ({ id: p.id, bearing: bearingOf(p.x - f.x, p.z - f.z), distance: Math.hypot(p.x - f.x, p.z - f.z) })) }; }, /** Dev (F3 checks): set a raider's wind up. */ setBite: (id: number, clock: number) => { const r = village.raiders.find(r => r.id === id); if (r) r.biteClock = clock; return !!r; }, placeRaider: (id: number, x: number, z: number) => { const r = village.raiders.find(r => r.id === id); if (r) { r.x = x; r.z = z; } return !!r; }, mini: { get open() { return miniOpen; }, set: (o: boolean) => openMini(o) }, deep: { get state() { return { ...deep }; }, feed: (n: number) => { boardView.onRun({ type: 0, cells: new Array(n).fill(null) } as unknown as Parameters<typeof boardView.onRun>[0], new THREE.Vector3()); }, /** Dev: feed gems as a real move does, while the board is still animating (its cascade). */ busyFeed: (n: number) => { (boardView as unknown as { queue: unknown[] }).queue.push({ kind: 'rebuild' }); boardView.onRun({ type: 0, cells: new Array(n).fill(null) } as unknown as Parameters<typeof boardView.onRun>[0], new THREE.Vector3()); return boardView.isBusy; }, get rushing() { return deepWorld.rushing; }, direction: (x: number, z: number) => deepDirection(deep, KARST_AT, { x, z }), set clarity(x: number) { deep.clarity = Math.min(CLARITY_CAP, Math.max(0, x)); }, places: deepPlaces, reachable: () => reachable(deep, KARST_AT, deepPlaces()).map(p => p.id), still: () => stillPlace()?.kind ?? null, meditate: () => startSession('meditate'), deepenPuzzle: () => startSession('deepen'), done: endSession, dive: startDive, launch: launchTo, get session() { return session ? { ...session } : null; }, get boardShown() { return boardView.group.visible; }, get to() { return deepTo?.id ?? null; }, get aimed() { return deepAimed; }, points: () => deepWorld.pointCount, aim: (id: string) => { if (!deepWorld.spritePosition(id, tmp)) return false; const d = tmp.sub(camera.position).normalize(); player.yaw = Math.atan2(-d.x, -d.z); player.pitch = Math.asin(Math.max(-1, Math.min(1, d.y))); return true; }, shrined: () => ctxs.filter(c => isShrined(c.v)).map(c => c.id), node: () => { const n = nodeAt(); return { x: n.x, y: n.y, z: n.z }; }, reach: () => deepReach(deep), shrinePrayer: SHRINE_PRAYER, pool: () => ({ x: karst.poolAt.x, y: karst.poolAt.y, z: karst.poolAt.z }), costs: { dive: DIVE_COST, back: RETURN_COST, deepen: DEEPEN_COST }, /** D1: out onto the catwalk and back into the drop. */ stepOut: stepOntoCatwalk, backIn: backIntoDrop, visit: descentVisit, /** T5: open a portal ('out' from a catwalk, 'in' at the island). */ openPortal: startPortal, islandPortal: () => islandPortal, portalGems: PORTAL_GEMS }, set prayed(x: number) { village.prayed = x; }, houseLabels: () => ctxs.reduce((n, c) => n + [...c.houseLabels.values()].filter(e => !e.hidden).length, 0), incidents: allIncidents, marks: () => ctx.world.root.children.filter(o => o.name === 'incident-mark' && o.visible).map(o => ({ x: o.position.x + ctx.ox, z: o.position.z + ctx.oz })), pinchPointers: () => pinchPointers.size, get zoom() { return zoom; }, set zoom(x: number) { zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, x)); }, get mapOpen() { return mapOpen; }, openMap, /** T9: the map's handle: open/close, zoom (css px/m, clamped), pan (world), the scale and its bounds, how much of the atlas is built, `build(ms)` builds now, and the costs. */ map: { open: () => openMap(true), close: () => openMap(false), zoom: (s: number) => { mapScale = clampZoom(s, mapBounds()); if (mapOpen) drawMapNow(); return mapScale; }, pan: (x: number, z: number) => { mapPan = { x, z }; if (mapOpen) drawMapNow(); }, scale: () => mapScale, bounds: mapBounds, ready: () => overMap.ready(), build: (ms: number) => { overMap.pump(ms); return overMap.ready(); }, get stats() { return { ...overMap.stats }; } }, get explored() { return overworld.revealed.size; }, /** Dev: reveal the land round a point (the map's checks). */ explore: (x: number, z: number, r: number) => explore(overworld, x, z, r), isRevealed: (x: number, z: number) => isRevealed(overworld, x, z), places: () => places(overworld.seed), known: () => [...overworld.known], lair: () => ({ ...village.lair, at: lairPlace, paused: raidsPaused(village) }), forestDepth: (x: number, z: number) => forestDepth(x, z), choosePerk: (p: 'vigor' | 'strike' | 'sap') => choosePerk(village, p), set xp(n: number) { village.hero.xp = n; }, xpDy: XP_DY, xpLair: XP_LAIR, lairReach: LAIR_HURT_RANGE, raiders: () => village.raiders.map(r => ({ ...r })), defense, guard: { set held(v: boolean) { guardHeld = v; }, get held() { return guardHeld; }, get dodge() { return dodge ? { ...dodge } : null; }, /** Dev: roll along world (dx, dz). */ dodgeTo: (dx: number, dz: number) => { if (!moves || dodge) return false; const len = Math.hypot(dx, dz) || 1; if (!moves.press('dodge')) return false; dodge = { dx: dx / len, dz: dz / len, heading: Math.atan2(-dx, -dz), p: 0 }; return true; }, get locked() { return locked?.id ?? null; } }, feel: { impact, fx, sound, staff, trail, get moves() { return moves; }, get fightClips() { return fightClipStatus; }, get practice() { return { wave: practice.wave, ids: [...practice.ids], resting: practice.restUntil > 0 }; }, spawn: (kind: 'wolf' | 'dy' | 'dire', x: number, z: number) => { const r = spawnFoe(village, kind === 'dire' ? 'wolf' : kind, x - ctx.ox, z - ctx.oz, DY_AGGRO_S); if (kind === 'dire') { if (!direDen) setDire(PRACTICE_DIRE); r.den = direDen; r.hp = DIRE_HP; } if (PRACTICE) practice.ids.add(r.id); return r.id; } }, get hero() { return { ...village.hero }; }, set vigor(x: number) { village.hero.vigor = x; }, attack, cooldowns: cooldown, get slain() { return village.slain; }, get slainAll() { return ctxs.reduce((n, c) => n + c.v.slain, 0); }, get eaten() { return village.eaten; }, stations: STATIONS, sites: SITES, setStore: (k: Store, n: number) => { village.stores[k] = n; }, setLand: (k: 'berries' | 'branches' | 'milk' | 'goats', n: number) => { village.land[k] = n; village.land.crops = village.land.crops.map(c => (n > 0 ? c : 0)); }, get prayer() { return village.prayer; }, set prayer(x: number) { village.prayer = x; }, dropStack: () => { village.stack = null; }, get stack() { return village.stack ? { ...village.stack } : null; }, get spirits() { return village.spirits.map(s => ({ ...s })); }, summon: (k: SiteKind) => summonSpirit(village, k), spiritCost: () => spiritCost(village), praying: () => village.hobbits.filter(s => s.activity === 'praying').map(s => s.id), setTick, jumpTo, get speed() { return speed; }, set speed(x: number) { speed = x; }, reset: () => resetVillage(), get shown() { return shown.list.map(s => ({ x: s.x, z: s.z, speed: s.speed, label: !s.label.hidden, bubble: !s.bubble.hidden })); }, get character() { const g = hulda.gait; return { status: clipStatus, error: clipError, clips: clipUrls, bones: hulda.bones.size, body: 'hulda', roles: g?.roles ?? null, weights: g ? Object.fromEntries(Object.entries(g.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null, hobbitWeights: home_().world.figures.map(f => f.gait ? Object.fromEntries(Object.entries(f.gait.actions).map(([r, a]) => [r, a.getEffectiveWeight()])) : null) }; } } });
// M1 (dev): the taint where she stands, and her attention (settable, for looking at the Colour at each level).
// C1 (dev): her growth, stepped without waiting for the dawns: `step(days, pushes = true)` as the dawns would (C3: `pushes` false leaves the villages' pushes out, for the pace check) (what the raids brought since the last, so a fresh world's front seeks on nothing: the pace Noah set), `starve(days)` a fed growth with nothing brought (it withers), both with the live nourishment and irritants; `reset()` to the breach alone; `refresh(full)` the land drawn again, everything when `full` (C1.1: the check that the incremental draw agrees); `parts` the last refresh's parts.
Object.assign((window as unknown as { __village: object }).__village, { growth: { key: GROWTH_KEY, get state() { return JSON.parse(serializeGrowth(growth)) as Growth; }, get idx() { return growthIdx; }, get seen() { return { ...growthSeen }; }, get refreshMs() { return refreshMs; }, get parts() { return { ...refreshParts }; }, inputs: growthInputs, inGrowth: (x: number, z: number) => inGrowth(growthIdx, x, z), depth: (x: number, z: number) => depthOf(growthIdx, x, z), nearest: (x: number, z: number) => nearestFront(growthIdx, x, z), step: (days = 1, pushes = true) => { for (let i = 0; i < days; i++) dawnStep(false, pushes); return refreshLand(); }, starve: (days = 1) => { for (let i = 0; i < days; i++) dawnStep(true); return refreshLand(); }, reset: () => { setGrowth(freshGrowth(home.seed)); growthSeen = seenNow(); saveGrowth(); return refreshLand(); }, refresh: (full = false) => refreshLand(full) } });
// C2 (dev): `hold(id)` / `release(id)` her front holding a village now (fouled at once; the next dawn's step sets it from the front again), `turn(id)` the village turned now with its germ added, `days(n)` the villages lived n days with the growth stepping at each dawn as the dawns do; `state(id)` what C2 keeps of a village. Each returns the refresh's milliseconds where the land was drawn again.
const ctxById = (id: string): Ctx => ctxs.find(c => c.id === id) ?? ctxs[0];
Object.assign((window as unknown as { __village: object }).__village, { c2: { hold: (id = 'village') => { setHeld(ctxById(id).v, true); }, release: (id = 'village') => { setHeld(ctxById(id).v, false); }, turn: (id = 'village') => { const v = ctxById(id).v; setHeld(v, true); v.turned = true; v.darkDays = TURN_DAYS; v.told = 'turned'; holdStep(); save(); return refreshLand(); }, days: (n = 1) => { for (let i = 0; i < n; i++) { setTick(village.tick + DAY_TICKS); const was = growthSeen.day; stepGrowthToDay(); /* The dev step(n) may have run the growth ahead of the villages' day: the hold step still runs at each of their dawns. */ if (growthSeen.day === was) holdStep(); } return refreshLand(); }, state: (id = 'village') => { const v = ctxById(id).v; return { held: v.held, darkDays: v.darkDays, turned: v.turned, germ: v.germ, folk: v.hobbits.length, infants: v.hobbits.filter(h => h.stage === 'infant').length, brood: v.brood.length, bred: v.bred.length, taken: v.taken, darkMeals: v.darkMealsToday, cleanMeals: v.cleanMealsToday, source: germSource(v), state: villageState(v).kind, sacs: v.brood.map((_, i) => broodSpotOf(v, i)) }; } } });
// C3 (dev): `clean(id, days)` the village fed only clean meals for n days with the dawns (its stores filled after each dawn's fouling, so a turned village is itself again after UNTURN_DAYS), `thrive(id)` the village made thriving and shrined now (so the next dawn's step reads it as an irritant), `unturn(id)` the village itself again now with its germ taken away; each returns the refresh's milliseconds. `front(id)` what the keeper knows of the front day over day.
Object.assign((window as unknown as { __village: object }).__village, { c3: { clean: (id = 'village', days = 1) => { const v = ctxById(id).v, fill = (): void => { for (const f of FOODS) v.stores[f] = STORES[f].cap; v.stores.water = STORES.water.cap; v.stores.dark = 0; v.heapBanished = true; }, cross = (): void => { setTick(v.tick - (v.tick % DAY_TICKS) + DAY_TICKS + 1); const was = growthSeen.day; stepGrowthToDay(); if (growthSeen.day === was) holdStep(); }; /* The day already begun may have had dark meals: the clean days are whole ones from the next dawn. */ cross(); for (let i = 0; i < days; i++) { const dawn = v.tick - (v.tick % DAY_TICKS) + DAY_TICKS; for (let k = 3; k >= 0; k--) { fill(); setTick(Math.max(v.tick, dawn - 1 - Math.round(k * DAY_TICKS / 4))); } fill(); cross(); } save(); return refreshLand(); }, thrive: (id = 'village') => { const v = ctxById(id).v; setHeld(v, false); /* Dev: its Dark Young as if slain and their infants carried home (bred or kept, a village is besieged, not thriving). */ v.raiders = v.raiders.filter(r => r.kind !== 'dy'); v.brood = [...v.brood, ...v.bred.map(b => ({ infant: b, due: 1e12 }))]; v.bred = []; homeBrood(v); /* Dev: huts enough for its beds (a village grown under her is crowded once its beds are its own again). */ v.site = null; v.huts = Math.min(HOUSE_CAP - 6, Math.max(v.huts, Math.ceil(v.hobbits.length / BEDS) - 6)); for (const k of YIELD_SITES) v.land.spoiled[k] = 0; for (const f of FOODS) v.stores[f] = STORES[f].cap; v.stores.water = STORES.water.cap; v.stores.wood = STORES.wood.cap; v.fedStreak = THRIVE_DAYS; v.dayMissed = false; for (const h of v.hobbits) h.missed = 0; v.lastRaidEaten = 0; v.lastBitten = 0; v.dropped = []; v.prayed = Math.max(v.prayed, SHRINE_PRAYER); save(); return { state: villageState(v).kind, irritant: villageIrritant(v) }; }, unturn: (id = 'village') => { const v = ctxById(id).v; unturn(v); holdStep(); save(); return refreshLand(); }, front: (id = 'village') => ({ ...(fronts[ctxById(id).id] ?? null) }), needs: (id = 'village') => villageState(ctxById(id).v).needs } });
Object.assign((window as unknown as { __village: object }).__village, { taint: { breach: { x: breach.x, z: breach.z }, edge: TAINT, get now() { return { ...taintNow, attention: home_().v.lair.attention, breath, liftT, liftClear }; }, set attention(a: number) { home_().v.lair.attention = a; }, grassOpen, veins: () => { const v = taintVeins(); return { lines: v.length, points: v.reduce((n, l) => n + l.length, 0) }; }, /** Dev: thin the fog now (her arms glimpsed), or flare the next tree at once. */ lift: () => { liftT = 0; }, flareNext: () => { forceSpot = true; }, get spot() { return spot ? { ...spot } : null; }, /** Dev: hang n newcomers in the sacs. */ keep: (n = 1) => { const v = home_().v; for (let i = 0; i < n; i++) { const id = newcomersOf(v).find(c => !v.brood.some(b => b.infant.id === c.id) && !v.bred.some(b => b.id === c.id) && !v.hobbits.some(h => h.id === c.id))?.id; if (id) v.brood.push({ infant: { id, home: 0, born: v.tick }, due: 1e12 }); } return v.brood.length; } } });
