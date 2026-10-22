// The contagion (CONTAGION.md, C1, the front): her growth as mycelium along the roots. Pure: no Three.js;
// seeded and deterministic; every function takes state in and returns state or a value.
//
// Her growth is a set of germination points and the hyphae between the root hubs. The breach is the first
// germ, at the lair, with M1's rings exactly (taintModel's TAINT, by distance); Noah (2026-10-21): the breach
// always keeps M1's rings and can never be starved. Other germs (C2 adds them: a turned village, an overgrown
// ward, a fouled grove, a poisoned warren) have rings scaled by their reach (nursery at a third, grey at 0.8,
// the edge at the reach, no heart) and can wither to nothing.
//
// The hyphae run along the root edges: a hub is the root network's hub of a chunk (chunkModel.hubAt), joined
// to its neighbours at [1,0], [0,1], [1,1], [-1,1] as worldRoots lays them. A hypha is a claimed length along
// an edge out of a claimed hub, t in (0, 1]; at t >= 1 the far hub is claimed. Every hub within a germ's edge
// is claimed from the start. Claimed is the closure: a germ's hubs, and whatever a chain of full hyphae
// reaches from them; a hypha dies with its source.
//
// The daily step, at dawn. Growth seeks nourishment (villages above all) and avoids irritants: an open edge
// (claimed hub to unclaimed) has an appetite, the sum over the nourishment of weight over distance from the
// far hub (softened by PULL_SOFTEN m); an edge whose far hub lies in an irritant is never open. Each day the
// TIPS highest-appetite far hubs advance (one hypha each, plus a tip per FOOD_PER_TIP of food), STEP m along
// the edge, what is left of the step past the far hub running on along the hungriest open edge out of it (else
// the pace is quantised to whole days an edge); with nothing to seek (no appetite) she sits. Food is what the raids bring: a Dark Young bred of an
// infant, and the stores eaten.
//
// The cycle: seek, feed, starve (C1.1, reconciling Noah's rules: the breach can never be starved; lesser germs
// can; about twelve days to the first village if she does nothing). The growth SEEKS until it has fed: `fed`
// is false until an infant is taken (or a Dark Young bred), and while it is false there is no starvation: a
// fresh world's front creeps the twelve days to the first village on nothing. Once fed, STARVE_DAYS without an
// infant and the front withers instead of growing: its tips retreat STEP a day (the frontier recedes as it
// advanced; a whole-growth retreat would erase a 500 m front in two days), a lesser germ's reach shrinks STEP
// a day and it is removed once no hub lies in it. When the growth has withered back to the breach alone (no
// hypha left, every lesser germ gone) `fed` resets and it seeks again: the mycelium always comes back seeking;
// only irritants hold it (C3's bulwark). A lesser germ caught mid-shrink keeps the starvation going until it
// is gone (it starves out of existence, as Noah asked); a germ's death never resets `fed` by itself. A hypha
// whose far hub stands in an irritant withers every day regardless (Noah: a woken ward is an irritant the
// hyphae avoid and wither inside, not only a calming of the Colour).
//
// Reading the field: indexGrowth builds a GrowthIndex (claimed hubs' positions, the hyphae as segments, on a
// cell grid) and ringOf / depthOf / veinOf / inGrowth read from it, cheap enough for the ground tint build
// (many thousands of reads a frame). Within a germ's edge the field is the germ's rings alone (the germ's hubs
// carry no mats), so day one reads exactly as M1 does; a hub claimed by a hypha reads grey within MAT m, a
// hypha's claimed length grey within VEIN_W, and a band of MILD_W past either reads mild.
// Every read at a point depends only on the germs whose influence reaches it and on the index cell it falls
// in (the mats and the hyphae spanned there, each hypha listed over its whole edge's bounds plus PAD): fieldStamp
// names exactly that for a rectangle, so a reader that keeps what it drew (the land's tint, the trees' kinds, a
// chunk) can redraw only the rectangles whose stamp moved (C1.1, the dawn hitch) and be byte-equal to a full draw.
//
// The nourishment and the irritants are the caller's, each day (village.ts): a village weighs folk + 3 ×
// infants (WEIGHTS), a warren 1, a wallow 1; a woken ward is an irritant of r 170 (RUINS.md WARD_CALM_R), a
// sanctified grove 120, the karst's foot 140 (IRRITANT_R). Reading those from the live village is not pure, so
// no helper here builds them.
import { CHUNK, hubAt } from './chunkModel';
import { lairPlace } from './overworldModel';
import { TAINT, ringAt, depthAt, veinAt, type Ring } from './taintModel';

export type GermKind = 'breach' | 'village' | 'ward' | 'grove' | 'warren';
export interface Germ { id: string; x: number; z: number; kind: GermKind; reach: number }
/** A hub by its chunk's coords. */
export type HubRef = [number, number];
export interface Hypha { from: HubRef; to: HubRef; t: number }
export interface Growth { day: number; germs: Germ[]; /** Hub keys, sorted. */ claimed: string[]; hyphae: Hypha[]; food: number; /** Days since the last infant was taken, counted only once fed. */ starved: number; /** It has fed (an infant taken, a Dark Young bred) and can starve; false while it seeks, and again once it has withered back to the breach alone. */ fed: boolean }
export interface Nourish { x: number; z: number; w: number }
export interface Irritant { x: number; z: number; r: number }
export interface GrowthInputs { nourish: Nourish[]; irritants: Irritant[]; infantsTaken: number; darkYoungBred: number; meals: number }

/** Tuning. Noah (2026-10-21): about twelve days from the breach's edge to the first village if she does nothing. The edge's
 * nearest hub stands 504 m from the first village's hub (seed 1), five or six diagonal hops along the roots; at STEP 45 a 90 m
 * diagonal is claimed in two days, so the front gains a hub every two days on its best lane and reaches the village on day 12
 * (seeds 1, 2 and 5; day 13 at seed 3; tests/contagion.test.ts measures it). TIPS: the hubs advanced a day; FOOD_PER_TIP:
 * food for one more. Food: a Dark Young bred of an infant FOOD_DY, a store eaten in a raid FOOD_MEAL, spent FOOD_SPEND a day.
 * Once fed, STARVE_DAYS without an infant taken and the front withers. PULL_SOFTEN keeps a hub on top of a village from an infinite pull. */
export const TIPS = 3, STEP = 45, PULL_SOFTEN = 40, FOOD_PER_TIP = 2, FOOD_DY = 3, FOOD_MEAL = 0.5, FOOD_SPEND = 1, STARVE_DAYS = 3;
/** Tuning: the grey mat round a claimed hub (m), the grey of a hypha's claimed length either side (m), the mild band past either (m); their depths. */
export const MAT = 24, VEIN_W = 8, MILD_W = 20, MAT_DEPTH = 0.45, MILD_DEPTH = 0.2;
/** A lesser germ's rings as fractions of its reach: the nursery to a third, the grey to 0.8, the mild to the edge; no heart. Tuning. */
export const GERM_RINGS = { nursery: 0.33, grey: 0.8 } as const;
/** The weights the integrator gives the nourishment (a village: folk × folk + infants × infant; a warren; a wallow) and the irritants' radii (m). Tuning. */
export const WEIGHTS = { folk: 1, infant: 3, warren: 1, wallow: 1 } as const;
export const IRRITANT_R = { ward: 170, grove: 120, karst: 140 } as const;

// The germs' rings.
/** A germ's ring at distance d from it: the breach's are M1's; a lesser germ's are scaled by its reach. */
export function germRing(g: Germ, d: number): Ring { if (g.kind === 'breach') return ringAt(d); const r = g.reach; return r <= 0 || d >= r ? null : d < r * GERM_RINGS.nursery ? 'nursery' : d < r * GERM_RINGS.grey ? 'grey' : 'mild'; }
/** How deep in a germ's growth a point at distance d is, 0 at its edge and beyond. */
export function germDepth(g: Germ, d: number): number { if (g.kind === 'breach') return depthAt(d); return g.reach <= 0 || d >= g.reach ? 0 : 1 - d / g.reach; }
/** A germ's veins' strength at distance d: full within its edge, fading to nothing TAINT.veins past it (taintModel.veinAt for the breach). */
export function germVein(g: Germ, d: number): number { if (g.kind === 'breach') return veinAt(d); return g.reach <= 0 ? 0 : d <= g.reach ? 1 : Math.max(0, 1 - (d - g.reach) / TAINT.veins); }

// The hubs and their edges.
export const hubKey = (cx: number, cz: number): string => `${cx},${cz}`;
const refKey = (h: HubRef): string => hubKey(h[0], h[1]);
const keyRef = (k: string): HubRef => { const [a, b] = k.split(','); return [Number(a), Number(b)]; };
/** The root network's neighbours of a hub: worldRoots joins each hub to [1,0], [0,1], [1,1], [-1,1], so each hub has eight. */
export const HUB_LINKS: HubRef[] = [[1, 0], [0, 1], [1, 1], [-1, 1], [-1, 0], [0, -1], [-1, -1], [1, -1]];
export const hubNeighbours = (h: HubRef): HubRef[] => HUB_LINKS.map(([dx, dz]) => [h[0] + dx, h[1] + dz] as HubRef);
/** The hubs within r of a point. */
export function hubsWithin(x: number, z: number, r: number, seed: number): HubRef[] {
  const out: HubRef[] = [], c0 = Math.floor((x - r) / CHUNK) - 1, c1 = Math.floor((x + r) / CHUNK) + 1, d0 = Math.floor((z - r) / CHUNK) - 1, d1 = Math.floor((z + r) / CHUNK) + 1;
  for (let cx = c0; cx <= c1; cx++) for (let cz = d0; cz <= d1; cz++) { const h = hubAt(cx, cz, seed); if (Math.hypot(h.x - x, h.z - z) < r) out.push([cx, cz]); }
  return out;
}
/** An edge's key, the same whichever way it is walked. */
export const edgeKey = (a: HubRef, b: HubRef): string => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${refKey(a)}>${refKey(b)}` : `${refKey(b)}>${refKey(a)}`);
/** A deterministic tie-breaker in [0, 1) from a key and the seed (FNV-1a), so ties never fall to insertion order. */
export function hashKey(key: string, seed: number): number { let h = (2166136261 ^ Math.imul(seed | 0, 16777619)) >>> 0; for (let i = 0; i < key.length; i++) { h = Math.imul(h ^ key.charCodeAt(i), 16777619) >>> 0; } h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; return ((h ^ (h >>> 13)) >>> 0) / 4294967296; }
const sameRef = (a: HubRef, b: HubRef): boolean => a[0] === b[0] && a[1] === b[1];

/** The hubs every germ claims by its reach. */
export function germHubs(germs: Germ[], seed: number): Set<string> { const out = new Set<string>(); for (const g of germs) for (const h of hubsWithin(g.x, g.z, g.reach, seed)) out.add(refKey(h)); return out; }
/** The claimed hubs: the germs' and whatever a chain of full hyphae reaches from them; the hyphae with no claimed source are dropped. */
function closure(germs: Germ[], hyphae: Hypha[], seed: number): { claimed: string[]; hyphae: Hypha[] } {
  const claimed = germHubs(germs, seed), queue = [...claimed];
  while (queue.length) { const k = queue.pop()!; for (const h of hyphae) { if (h.t < 1 || refKey(h.from) !== k) continue; const to = refKey(h.to); if (!claimed.has(to)) { claimed.add(to); queue.push(to); } } }
  return { claimed: [...claimed].sort(), hyphae: hyphae.filter(h => claimed.has(refKey(h.from))) };
}

/** The breach only, its hubs claimed. */
export function freshGrowth(seed: number): Growth { const l = lairPlace(seed), breach: Germ = { id: 'breach', x: l.x, z: l.z, kind: 'breach', reach: TAINT.edge }; return { day: 0, germs: [breach], claimed: [...germHubs([breach], seed)].sort(), hyphae: [], food: 0, starved: 0, fed: false }; }
/** C2: a new germination point; its hubs are claimed at once. */
export function addGerm(g: Growth, germ: Germ, seed: number): Growth { const germs = [...g.germs.filter(x => x.id !== germ.id), { ...germ }], c = closure(germs, g.hyphae, seed); return { ...g, germs, claimed: c.claimed, hyphae: c.hyphae }; }
/** C2: a lesser germ taken away (a warren healed, a village begun again); the breach never. The closure is rebuilt: the hubs only it claimed are let go, with the hyphae that grew from them. */
export function removeGerms(g: Growth, gone: (x: Germ) => boolean, seed: number): Growth { const germs = g.germs.filter(x => x.kind === 'breach' || !gone(x)); if (germs.length === g.germs.length) return g; const c = closure(germs, g.hyphae, seed); return { ...g, germs, claimed: c.claimed, hyphae: c.hyphae }; }
/** C2 (CONTAGION.md): a lesser germ's reach by its kind: a turned village's nursery ring (a third of it) then covers its green and its houses; a poisoned warren's its burrows. Tuning (open for Noah). */
export const GERM_REACH = { village: 110, warren: 40 } as const;

/** The daily step, at dawn: growth toward the nourishment or, starved, withering. */
export function stepGrowth(g: Growth, seed: number, inputs: GrowthInputs): Growth {
  const pos = new Map<string, { x: number; z: number }>(), at = (h: HubRef): { x: number; z: number } => { const k = refKey(h); let p = pos.get(k); if (!p) { p = hubAt(h[0], h[1], seed); pos.set(k, p); } return p; };
  const irritated = (h: HubRef): boolean => { const p = at(h); return inputs.irritants.some(i => Math.hypot(p.x - i.x, p.z - i.z) < i.r); };
  // Seek, feed, starve: unfed, it seeks and the starved count stays at 0; an infant taken feeds it and ends a starvation; fed, every day without one counts.
  const fed = g.fed || inputs.infantsTaken > 0 || inputs.darkYoungBred > 0;
  const food = Math.max(0, g.food + inputs.darkYoungBred * FOOD_DY + inputs.meals * FOOD_MEAL - FOOD_SPEND), starved = inputs.infantsTaken > 0 || !fed ? 0 : g.starved + 1, starving = starved >= STARVE_DAYS;
  const germs = g.germs.map(x => (x.kind !== 'breach' && starving ? { ...x, reach: Math.max(0, x.reach - STEP) } : { ...x }));
  const hyphae = g.hyphae.map(h => ({ from: [h.from[0], h.from[1]] as HubRef, to: [h.to[0], h.to[1]] as HubRef, t: h.t }));
  const claimed = new Set(g.claimed); for (const k of germHubs(germs, seed)) claimed.add(k);
  const lengthOf = (h: Hypha): number => { const a = at(h.from), b = at(h.to); return Math.max(1, Math.hypot(b.x - a.x, b.z - a.z)); };
  if (!starving) {
    // The open edges, one candidate a far hub: the hypha already farthest along it, else the source the hash picks.
    const cands = new Map<string, { to: HubRef; from: HubRef; appetite: number; hypha: Hypha | null; t0: number; tie: number }>();
    for (const k of claimed) {
      const from = keyRef(k);
      for (const to of hubNeighbours(from)) {
        const tk = refKey(to); if (claimed.has(tk) || irritated(to)) continue;
        const p = at(to); let appetite = 0; for (const n of inputs.nourish) appetite += n.w / (Math.hypot(p.x - n.x, p.z - n.z) + PULL_SOFTEN);
        if (appetite <= 0) continue;
        const hypha = hyphae.find(h => sameRef(h.from, from) && sameRef(h.to, to)) ?? null, t0 = hypha ? hypha.t : 0, tie = hashKey(edgeKey(from, to), seed), have = cands.get(tk);
        if (!have || t0 > have.t0 || (t0 === have.t0 && tie < have.tie)) cands.set(tk, { to, from, appetite, hypha, t0, tie });
      }
    }
    const order = [...cands.values()].sort((a, b) => b.appetite - a.appetite || hashKey(refKey(a.to), seed) - hashKey(refKey(b.to), seed));
    const appetiteOf = (h: HubRef): number => { const p = at(h); let a = 0; for (const n of inputs.nourish) a += n.w / (Math.hypot(p.x - n.x, p.z - n.z) + PULL_SOFTEN); return a; };
    const tips = TIPS + Math.floor(food / FOOD_PER_TIP);
    for (const c of order.slice(0, tips)) {
      let h = c.hypha; if (!h) { h = { from: c.from, to: c.to, t: 0 }; hyphae.push(h); }
      // The day's step along the edge; what is left past the far hub runs on along the hungriest open edge out of it (else the pace is quantised to whole days an edge).
      let left = STEP; for (let guard = 0; guard < 4 && h && left > 0; guard++) {
        const len = lengthOf(h), need = (1 - h.t) * len; if (left < need) { h.t += left / len; break; }
        h.t = 1; left -= need; const from: HubRef = h.to; claimed.add(refKey(from));
        const next: { n: HubRef; a: number; tie: number } | undefined = hubNeighbours(from).filter(n => !claimed.has(refKey(n)) && !irritated(n)).map(n => ({ n, a: appetiteOf(n), tie: hashKey(edgeKey(from, n), seed) })).filter(x => x.a > 0).sort((p, q) => q.a - p.a || p.tie - q.tie)[0];
        if (!next) break;
        const on = hyphae.find(x => sameRef(x.from, from) && sameRef(x.to, next.n)); if (on) h = on; else { h = { from, to: next.n, t: 0 }; hyphae.push(h); }
      }
    }
  }
  // Withering: the tips while starved; any hypha into an irritant always.
  const hasOut = (h: HubRef): boolean => hyphae.some(x => sameRef(x.from, h));
  for (const h of hyphae) if (irritated(h.to) || (starving && (h.t < 1 || !hasOut(h.to)))) h.t -= STEP / lengthOf(h);
  const c = closure(germs, hyphae.filter(h => h.t > 0), seed);
  // A lesser germ with no hub left in it, starved, is gone.
  const kept = germs.filter(x => x.kind === 'breach' || !(starving && hubsWithin(x.x, x.z, x.reach, seed).length === 0));
  const cc = kept.length === germs.length ? c : closure(kept, c.hyphae, seed);
  // Withered back to the breach alone, it seeks again.
  const bare = starving && kept.length === 1 && cc.hyphae.length === 0;
  return { day: g.day + 1, germs: kept, claimed: cc.claimed, hyphae: cc.hyphae.map(h => ({ ...h, t: Math.min(1, h.t) })), food, starved: bare ? 0 : starved, fed: fed && !bare };
}

/** Saved under its own key. */
export const serializeGrowth = (g: Growth): string => JSON.stringify({ day: g.day, germs: g.germs, claimed: g.claimed, hyphae: g.hyphae.map(h => ({ from: h.from, to: h.to, t: Math.round(h.t * 10000) / 10000 })), food: Math.round(g.food * 1000) / 1000, starved: g.starved, fed: g.fed });
/** Tolerant of garbage: anything unreadable is the breach alone; the breach is always present with M1's reach; claimed is rebuilt as the closure. */
export function parseGrowth(raw: string | null, seed: number): Growth {
  const fresh = freshGrowth(seed);
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return fresh;
    const num = (x: unknown, lo: number, hi: number, d: number): number => (typeof x === 'number' && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d);
    const kinds: GermKind[] = ['breach', 'village', 'ward', 'grove', 'warren'];
    const germs: Germ[] = (Array.isArray(p.germs) ? p.germs : []).filter((x: unknown): x is Germ => { const g = x as Germ; return !!g && typeof g === 'object' && typeof g.id === 'string' && g.id.length > 0 && Number.isFinite(g.x) && Number.isFinite(g.z) && kinds.includes(g.kind) && g.kind !== 'breach' && Number.isFinite(g.reach) && g.reach > 0; }).map((g: Germ) => ({ id: g.id, x: g.x, z: g.z, kind: g.kind, reach: Math.min(TAINT.edge, g.reach) }));
    const seen = new Set<string>(); const lesser = germs.filter(g => !seen.has(g.id) && seen.add(g.id));
    const ref = (x: unknown): HubRef | null => (Array.isArray(x) && x.length === 2 && Number.isInteger(x[0]) && Number.isInteger(x[1]) && Math.abs(x[0]) < 1e5 && Math.abs(x[1]) < 1e5 ? [x[0], x[1]] : null);
    const edges = new Set<string>(), hyphae: Hypha[] = [];
    for (const x of Array.isArray(p.hyphae) ? p.hyphae : []) { const h = x as Hypha, from = ref(h?.from), to = ref(h?.to); if (!from || !to || sameRef(from, to) || !hubNeighbours(from).some(n => sameRef(n, to))) continue; const t = num(h.t, 0, 1, 0); if (t <= 0) continue; const k = `${refKey(from)}>${refKey(to)}`; if (edges.has(k)) continue; edges.add(k); hyphae.push({ from, to, t }); }
    const all = [fresh.germs[0], ...lesser], c = closure(all, hyphae, seed);
    return { day: Math.floor(num(p.day, 0, 1e7, 0)), germs: all, claimed: c.claimed, hyphae: c.hyphae, food: num(p.food, 0, 1e6, 0), starved: p.fed === true ? Math.floor(num(p.starved, 0, 1e7, 0)) : 0, fed: p.fed === true };
  } catch { return fresh; }
}

// Reading the field.
interface Seg { from: HubRef; to: HubRef; ax: number; az: number; bx: number; bz: number; ux: number; uz: number; len: number; t: number }
export interface GrowthIndex { seed: number; germs: Germ[]; /** Every claimed hub, with its key, for the front's nearest. */ claimed: { key: string; x: number; z: number }[]; /** The claimed hubs outside every germ's edge: these carry mats. */ mats: { x: number; z: number }[]; segs: Seg[]; cell: number; grid: Map<string, { mats: number[]; segs: number[] }> }
const CELL = 64, PAD = Math.max(MAT, VEIN_W) + MILD_W;
const cellKey = (i: number, k: number): string => `${i},${k}`;
/** The index the field reads from: build it once a day (the growth moves at dawn), read it many thousands of times a frame. */
export function indexGrowth(g: Growth, seed: number): GrowthIndex {
  const inGerm = germHubs(g.germs, seed), claimed = g.claimed.map(k => { const r = keyRef(k), p = hubAt(r[0], r[1], seed); return { key: k, x: p.x, z: p.z }; });
  const mats = claimed.filter(h => !inGerm.has(h.key)).map(h => ({ x: h.x, z: h.z }));
  const segs: Seg[] = g.hyphae.filter(h => h.t > 0).map(h => { const a = hubAt(h.from[0], h.from[1], seed), b = hubAt(h.to[0], h.to[1], seed), len = Math.max(1, Math.hypot(b.x - a.x, b.z - a.z)); return { from: h.from, to: h.to, ax: a.x, az: a.z, bx: b.x, bz: b.z, ux: (b.x - a.x) / len, uz: (b.z - a.z) / len, len, t: Math.min(1, h.t) }; });
  const grid = new Map<string, { mats: number[]; segs: number[] }>(), cellOf = (k: string): { mats: number[]; segs: number[] } => { let c = grid.get(k); if (!c) { c = { mats: [], segs: [] }; grid.set(k, c); } return c; };
  const span = (x0: number, z0: number, x1: number, z1: number, f: (c: { mats: number[]; segs: number[] }) => void): void => { for (let i = Math.floor((x0 - PAD) / CELL); i <= Math.floor((x1 + PAD) / CELL); i++) for (let k = Math.floor((z0 - PAD) / CELL); k <= Math.floor((z1 + PAD) / CELL); k++) f(cellOf(cellKey(i, k))); };
  mats.forEach((m, i) => span(m.x, m.z, m.x, m.z, c => c.mats.push(i)));
  segs.forEach((s, i) => span(Math.min(s.ax, s.bx), Math.min(s.az, s.bz), Math.max(s.ax, s.bx), Math.max(s.az, s.bz), c => c.segs.push(i)));
  return { seed, germs: g.germs.map(x => ({ ...x })), claimed, mats, segs, cell: CELL, grid };
}
const RANK: Record<string, number> = { heart: 4, nursery: 3, grey: 2, mild: 1 };
/** The nearest distances from a point to a mat's centre and to a hypha's claimed length, among the cell's. */
function nearHere(idx: GrowthIndex, x: number, z: number): { mat: number; vein: number } {
  const c = idx.grid.get(cellKey(Math.floor(x / idx.cell), Math.floor(z / idx.cell))); let mat = Infinity, vein = Infinity; if (!c) return { mat, vein };
  for (const i of c.mats) { const m = idx.mats[i]; mat = Math.min(mat, Math.hypot(x - m.x, z - m.z)); }
  for (const i of c.segs) { const s = idx.segs[i], px = x - s.ax, pz = z - s.az, along = Math.max(0, Math.min(s.len * s.t, px * s.ux + pz * s.uz)); vein = Math.min(vein, Math.hypot(px - s.ux * along, pz - s.uz * along)); }
  return { mat, vein };
}
/** The ring at a point: the deepest of the germs' rings by distance, a mat's or a hypha's grey, and the mild band past them. */
export function ringOf(idx: GrowthIndex, x: number, z: number): Ring {
  let best: Ring = null, rank = 0;
  for (const g of idx.germs) { const r = germRing(g, Math.hypot(x - g.x, z - g.z)); if (r && RANK[r] > rank) { best = r; rank = RANK[r]; } }
  if (rank >= 2) return best;
  const n = nearHere(idx, x, z); if (n.mat < MAT || n.vein < VEIN_W) return 'grey';
  return rank >= 1 ? best : n.mat < MAT + MILD_W || n.vein < VEIN_W + MILD_W ? 'mild' : null;
}
/** Depth 0..1 at a point, consistent with ringOf: the germs' by distance; a mat or a hypha MAT_DEPTH; the mild band MILD_DEPTH fading to nothing. */
export function depthOf(idx: GrowthIndex, x: number, z: number): number {
  let d = 0; for (const g of idx.germs) d = Math.max(d, germDepth(g, Math.hypot(x - g.x, z - g.z)));
  if (d >= MAT_DEPTH) return d;
  const n = nearHere(idx, x, z); if (n.mat < MAT || n.vein < VEIN_W) return MAT_DEPTH;
  const band = Math.min((n.mat - MAT) / MILD_W, (n.vein - VEIN_W) / MILD_W); return band < 1 ? Math.max(d, MILD_DEPTH * (1 - band)) : d;
}
/** A vein's strength at a point for drawing: the germs' as taintModel.veinAt (a field the look masks by its root lines), and the hyphae themselves: 1 along a claimed length, fading to 0 TAINT.veins past its tip, never past the far hub. */
export function veinOf(idx: GrowthIndex, x: number, z: number): number {
  let v = 0; for (const g of idx.germs) v = Math.max(v, germVein(g, Math.hypot(x - g.x, z - g.z))); if (v >= 1) return 1;
  const c = idx.grid.get(cellKey(Math.floor(x / idx.cell), Math.floor(z / idx.cell))); if (!c) return v;
  for (const i of c.segs) {
    const s = idx.segs[i], px = x - s.ax, pz = z - s.az, along = px * s.ux + pz * s.uz; if (along < 0 || along > s.len || Math.abs(px * s.uz - pz * s.ux) >= VEIN_W) continue;
    const tip = s.len * s.t; v = Math.max(v, along <= tip ? 1 : Math.max(0, 1 - (along - tip) / TAINT.veins)); if (v >= 1) return 1;
  }
  return v;
}
/** Inside her growth: grass and roots refuse her. */
export const inGrowth = (idx: GrowthIndex, x: number, z: number): boolean => ringOf(idx, x, z) !== null;
/** C1.1: everything the reads within a world rectangle (x0..x1, z0..z1, inclusive) can depend on, as a string: the germs whose influence (reach + TAINT.veins)
 * touches it, and each index cell it covers with that cell's mats and hyphae (position, edge and t, in the index's order: the land's vein pass writes in that
 * order). Two indexes giving a rectangle the same stamp read identically at every point in it (tests/contagion.test.ts), so a reader may keep what it
 * drew there. Cheap: a rectangle a cell wide is a few string joins. */
export function fieldStamp(idx: GrowthIndex, x0: number, z0: number, x1: number, z1: number): string {
  const parts: string[] = [];
  for (const g of idx.germs) { const dx = Math.max(x0 - g.x, 0, g.x - x1), dz = Math.max(z0 - g.z, 0, g.z - z1); if (Math.hypot(dx, dz) < g.reach + TAINT.veins + 1) parts.push(`${g.id}:${g.x},${g.z},${g.reach}`); }
  for (let i = Math.floor(x0 / idx.cell); i <= Math.floor(x1 / idx.cell); i++) for (let k = Math.floor(z0 / idx.cell); k <= Math.floor(z1 / idx.cell); k++) {
    const c = idx.grid.get(cellKey(i, k)); if (!c) continue; parts.push(`@${i},${k}`);
    for (const m of c.mats) { const p = idx.mats[m]; parts.push(`m${p.x},${p.z}`); }
    for (const si of c.segs) { const s = idx.segs[si]; parts.push(`s${s.from[0]},${s.from[1]}>${s.to[0]},${s.to[1]}:${s.t}`); }
  }
  return parts.join(';');
}
/** The hyphae as world segments with their t (the tip at a + (b - a) t), for the minimap and the look's veins; the germs' own veins are by distance (veinOf), as M1 draws them. */
export const hyphaSegments = (idx: GrowthIndex): { from: HubRef; to: HubRef; a: { x: number; z: number }; b: { x: number; z: number }; tip: { x: number; z: number }; t: number }[] => idx.segs.map(s => ({ from: s.from, to: s.to, a: { x: s.ax, z: s.az }, b: { x: s.bx, z: s.bz }, tip: { x: s.ax + (s.bx - s.ax) * s.t, z: s.az + (s.bz - s.az) * s.t }, t: s.t }));
/** The germ whose rings cover a point (the deepest, the nearer on a tie), else null. */
export function germAt(idx: GrowthIndex, x: number, z: number): Germ | null { let best: Germ | null = null, rank = 0, bd = Infinity; for (const g of idx.germs) { const d = Math.hypot(x - g.x, z - g.z), r = germRing(g, d); if (!r) continue; const k = RANK[r]; if (k > rank || (k === rank && d < bd)) { best = g; rank = k; bd = d; } } return best; }
/** The nearest claimed hub to a point, with its bearing in degrees clockwise from north (villageModel.bearingFromGreen's convention, for bearingWords), for the keeper's rumor. */
export function nearestFront(idx: GrowthIndex, x: number, z: number): { x: number; z: number; d: number; bearing: number } | null {
  let best: { x: number; z: number; d: number; bearing: number } | null = null;
  for (const h of idx.claimed) { const d = Math.hypot(h.x - x, h.z - z); if (!best || d < best.d) best = { x: h.x, z: h.z, d, bearing: ((Math.atan2(h.x - x, -(h.z - z)) * 180 / Math.PI) + 360) % 360 }; }
  return best;
}
