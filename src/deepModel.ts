// The deep node (G4, EXPANSION.md, Noah's second brief): a heavenly stream falls on the karst's summit into
// a crystal pool; she meditates there (the match-3 board) gathering clarity, dives into the pool and down the
// karst's taproot to a node as deep as the karst is tall, and from there looks up at the world and is launched
// along a deep root to any convergence or shrine within the node's reach. Clarity pays for the dive and for
// the way back from a shrine or a convergence; enough shrined villages and she can deepen the node at the
// pool, widening its reach. Pure: no Three.js. Saved under its own key.
export interface Deep { clarity: number; depth: number; dives: number; launches: number; deepened: number }
/** Clarity: gathered a gem at a time on the board up to CLARITY_CAP; DIVE_COST for the dive at the pool, RETURN_COST for the way back from a shrine or a convergence, DEEPEN_COST spent with the puzzle. The node lies NODE_DEPTH below the karst's foot (as deep as the pillar is tall), DEPTH_STEP deeper per deepening; its deep roots reach DEEP_REACH_BASE m from the karst, DEEP_REACH_STEP more per deepening. A village is shrined once its prayer given at the stone passes SHRINE_PRAYER; DEEPEN_VILLAGES shrined and the node can be deepened, by a puzzle of DEEPEN_POINTS gems. She travels the deep roots at DEEP_SPEED m/s. Tuning, all of it; "clarity" is a working name (Noah: the match-3 energy needs a different name). */
export const CLARITY_CAP = 60, DIVE_COST = 20, RETURN_COST = 12, DEEPEN_COST = 30, NODE_DEPTH = 64, DEPTH_STEP = 24, DEEP_REACH_BASE = 1000, DEEP_REACH_STEP = 300, SHRINE_PRAYER = 100, DEEPEN_VILLAGES = 2, DEEPEN_POINTS = 40, DEEP_SPEED = 60, CLARITY_PER_GEM = 1;
export const freshDeep = (): Deep => ({ clarity: 0, depth: 0, dives: 0, launches: 0, deepened: 0 });
export const nodeDepth = (d: Deep): number => NODE_DEPTH + DEPTH_STEP * d.depth;
export const deepReach = (d: Deep): number => DEEP_REACH_BASE + DEEP_REACH_STEP * d.depth;
/** A run on the board: its gems become clarity, to the cap. Returns what was gained. */
export function gather(d: Deep, gems: number): number { const before = d.clarity; d.clarity = Math.min(CLARITY_CAP, d.clarity + gems * CLARITY_PER_GEM); return d.clarity - before; }
export const canDive = (d: Deep): boolean => d.clarity >= DIVE_COST;
export function dive(d: Deep): boolean { if (!canDive(d)) return false; d.clarity -= DIVE_COST; d.dives += 1; return true; }
export const canReturn = (d: Deep): boolean => d.clarity >= RETURN_COST;
export function returnDeep(d: Deep): boolean { if (!canReturn(d)) return false; d.clarity -= RETURN_COST; return true; }
export function launch(d: Deep): void { d.launches += 1; }
/** A village is shrined to her once enough prayer has been given at its stone. */
export const isShrined = (v: { prayed: number }): boolean => v.prayed >= SHRINE_PRAYER;
/** The node can be deepened once enough villages are shrined (the controlled territory) and she holds the clarity for it. */
export const canDeepen = (d: Deep, shrined: number): boolean => shrined >= DEEPEN_VILLAGES * (d.depth + 1) && d.clarity >= DEEPEN_COST;
export function deepen(d: Deep, shrined: number): boolean { if (!canDeepen(d, shrined)) return false; d.clarity -= DEEPEN_COST; d.depth += 1; d.deepened += 1; return true; }
/** A destination of the deep roots: where on the surface it comes out, and what it is. */
export type DeepKind = 'pool' | 'shrine' | 'convergence';
export interface DeepPlace { id: string; kind: DeepKind; name: string; x: number; z: number }
/** Which destinations the node's roots reach from the karst: all within its reach; the pool always. */
export function reachable(d: Deep, karst: { x: number; z: number }, places: DeepPlace[]): DeepPlace[] { const r = deepReach(d); return places.filter(p => p.kind === 'pool' || Math.hypot(p.x - karst.x, p.z - karst.z) <= r); }
/** How long a launch takes, by the deep root's length (down from the surface to the node's depth and across). */
export function launchSeconds(d: Deep, karst: { x: number; z: number }, to: { x: number; z: number }): number { const across = Math.hypot(to.x - karst.x, to.z - karst.z); return Math.max(2.5, Math.hypot(across, nodeDepth(d)) / DEEP_SPEED); }
/** The fisheye (Noah): the world seen from the node, looking up. A surface point at distance r from the node's foot lies at an angle atan(r / depth) from the zenith, which is the screen's centre; the edge is the horizon. Seen from below, east and west swap. Returns a unit-square position (-1..1). */
export function fisheye(d: Deep, karst: { x: number; z: number }, p: { x: number; z: number }): { u: number; v: number } {
  const dx = p.x - karst.x, dz = p.z - karst.z, r = Math.hypot(dx, dz), a = Math.atan2(r, nodeDepth(d)) / (Math.PI / 2), k = r > 1e-6 ? a / r : 0;
  return { u: -dx * k, v: dz * k };
}
export const serializeDeep = (d: Deep): string => JSON.stringify({ clarity: Math.round(d.clarity * 100) / 100, depth: d.depth, dives: d.dives, launches: d.launches, deepened: d.deepened });
export function parseDeep(raw: string | null): Deep {
  try { const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshDeep(); const num = (x: unknown, lo: number, hi: number, dflt: number): number => (typeof x === 'number' && Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : dflt); return { clarity: num(p.clarity, 0, CLARITY_CAP, 0), depth: Math.floor(num(p.depth, 0, 20, 0)), dives: Math.floor(num(p.dives, 0, 1e6, 0)), launches: Math.floor(num(p.launches, 0, 1e6, 0)), deepened: Math.floor(num(p.deepened, 0, 1e6, 0)) }; } catch { return freshDeep(); }
}
