// The Clearing: a traversal study where the moves are contextual and automatic. Trees, the root
// network between them, the stone wall with its handholds and its blank faces, the trail Hulda
// leaves, and what she has grown. Pure data and geometry; no Three.js scene here.
import { CatmullRomCurve3, Vector3 } from 'three';
import type { TraversalWorld } from './mobility';

export const vec = (x: number, y: number, z: number) => new Vector3(x, y, z);
export const CLEARING_RADIUS = 30;
/** The wall runs along z = WALL_Z, facing +z (the clearing); the ledge lies beyond it, WALL_H up. */
export const WALL_Z = -16, WALL_H = 5.5, LEDGE_DEPTH = 12, WALL_HALF = 30;
/** Where the wall has handholds (x range): a climb; anywhere else, ivy. */
export const HANDHOLDS = { x0: 3, x1: 8.5 };
export const IVY_SITE_WIDTH = 3;
export const relief = (x: number, z: number): number => 0.06 * Math.sin(x * 0.7) * Math.cos(z * 0.6);
/** Ground under any x,z: the clearing's floor, or the ledge beyond the wall. */
export const groundAt = (x: number, z: number): number => (z < WALL_Z ? WALL_H : 0) + relief(x, z);
export const onGround = (x: number, z: number): boolean => Math.hypot(x, z) <= CLEARING_RADIUS + 6 && (z >= WALL_Z + 0.55 ? true : z <= WALL_Z - 0.55 && z >= WALL_Z - LEDGE_DEPTH && Math.abs(x) <= WALL_HALF);

export interface Tree { id: number; x: number; z: number; size: number; y: number }
/** Placed by hand so the root network joins every tree and reaches the wall's foot. */
const LAYOUT: [number, number, number][] = [
  [0, 4, 1.35], [-6, 1, 1.1], [6.5, 0, 1.2], [-3, -6, 1.25], [4, -7, 1.05], [-9.5, -8, 1.0], [10.5, -6.5, 1.15],
  [-1, -12, 1.2], [7.5, -12.5, 1.0], [-8, -13.5, 1.1], [-13, 6, 0.95], [12, 7, 1.05], [2, 11, 1.1], [-7, 12, 1.0], [9, 13.5, 0.9],
];
export const TREES: Tree[] = LAYOUT.map(([x, z, size], id) => ({ id, x, z, size, y: relief(x, z) }));
export const crownHeight = (t: Tree): number => 3.4 * t.size;
export const trunkRadius = (t: Tree): number => 0.32 * t.size;
export interface RootEdge { id: string; a: number; b: number | null; curve: CatmullRomCurve3; length: number; taper: boolean; samples: Vector3[] }
function edge(id: string, a: Tree, b: Tree | null, taper: boolean, end: Vector3): RootEdge {
  const A = vec(a.x, -0.35, a.z), B = end, mid = A.clone().lerp(B, 0.5); mid.y = -1.2 - A.distanceTo(B) * 0.05;
  const q1 = A.clone().lerp(B, 0.25); q1.y = -0.9; const q3 = A.clone().lerp(B, 0.75); q3.y = taper ? -0.6 : -0.9;
  const curve = new CatmullRomCurve3([A, q1, mid, q3, B], false, 'centripetal', 0.5);
  return { id, a: a.id, b: b?.id ?? null, curve, length: curve.getLength(), taper, samples: curve.getSpacedPoints(Math.max(8, Math.ceil(curve.getLength() * 2))) };
}
export const ROOT_LINK = 10;
/** Every tree joins its neighbours within reach; the outermost trees also send one root outward that tapers to nothing. */
export const ROOTS: RootEdge[] = (() => {
  const out: RootEdge[] = [], seen = new Set<string>();
  for (const t of TREES) {
    const near = TREES.filter(o => o !== t && Math.hypot(o.x - t.x, o.z - t.z) <= ROOT_LINK).sort((p, q) => Math.hypot(p.x - t.x, p.z - t.z) - Math.hypot(q.x - t.x, q.z - t.z)).slice(0, 3);
    for (const o of near) { const key = [Math.min(t.id, o.id), Math.max(t.id, o.id)].join('-'); if (seen.has(key)) continue; seen.add(key); out.push(edge(key, t, o, false, vec(o.x, -0.35, o.z))); }
  }
  for (const t of TREES) {
    const r = Math.hypot(t.x, t.z); if (r < 9) continue;
    const dir = vec(t.x / r, 0, t.z / r), end = vec(t.x + dir.x * 4.5, -0.4, t.z + dir.z * 4.5);
    if (end.z < WALL_Z + 1.2) continue;
    out.push(edge(`${t.id}-out`, t, null, true, end));
  }
  return out;
})();
export const rootsAt = (treeId: number): RootEdge[] => ROOTS.filter(r => r.a === treeId || r.b === treeId);
/** Is the network one piece: from any tree, can every other be reached along roots? */
export function connected(): boolean {
  const seen = new Set<number>([0]); const stack = [0];
  while (stack.length) { const t = stack.pop()!; for (const r of ROOTS) { const o = r.a === t ? r.b : r.b === t ? r.a : null; if (o !== null && !seen.has(o)) { seen.add(o); stack.push(o); } } }
  return seen.size === TREES.length;
}
/** The nearest point on the network to a position: which root, how far along it. */
export function nearestRoot(p: Vector3): { root: RootEdge; s: number; distance: number } {
  let best = { root: ROOTS[0], s: 0, distance: Infinity };
  for (const r of ROOTS) for (let i = 0; i < r.samples.length; i++) { const d = Math.hypot(p.x - r.samples[i].x, p.z - r.samples[i].z); if (d < best.distance) best = { root: r, s: i / (r.samples.length - 1) * r.length, distance: d }; }
  return best;
}
export const rootPoint = (r: RootEdge, s: number): Vector3 => r.curve.getPointAt(Math.min(1, Math.max(0, s / r.length)));
export const rootTangent = (r: RootEdge, s: number): Vector3 => r.curve.getTangentAt(Math.min(1, Math.max(0, s / r.length)));
/** At a root's end: the tree there (or null at a tapered dead end). */
export const endTree = (r: RootEdge, atEnd: boolean): number | null => atEnd ? r.b : r.a;
/** Which root to take on leaving a tree along a wanted direction: the best-aligned one, if any is aligned at all. */
export function nextRoot(treeId: number, want: Vector3, exclude?: RootEdge): { root: RootEdge; forward: boolean } | null {
  let best: { root: RootEdge; forward: boolean; dot: number } | null = null;
  for (const r of rootsAt(treeId)) {
    if (r === exclude) continue;
    const forward = r.a === treeId, tangent = rootTangent(r, forward ? 0.3 : r.length - 0.3); if (!forward) tangent.negate();
    const flat = vec(tangent.x, 0, tangent.z).normalize(), dot = flat.dot(want);
    if (dot > 0.2 && (!best || dot > best.dot)) best = { root: r, forward, dot };
  }
  return best;
}
export const treeAt = (id: number): Tree => TREES[id];
export function nearestTree(x: number, z: number): { tree: Tree; distance: number } {
  let best = { tree: TREES[0], distance: Infinity };
  for (const t of TREES) { const d = Math.hypot(x - t.x, z - t.z) - trunkRadius(t); if (d < best.distance) best = { tree: t, distance: d }; }
  return best;
}
/** Crowns within a leap of one another: where she can slide across the canopy. */
export const HOP_REACH = 9;
export const hopTargets = (t: Tree): Tree[] => TREES.filter(o => o !== t && Math.hypot(o.x - t.x, o.z - t.z) <= HOP_REACH);

/** The wall at x: handholds, or an ivy site keyed by a bucket of x. */
export const wallSite = (x: number): { kind: 'handholds' } | { kind: 'ivy'; site: number } => x >= HANDHOLDS.x0 && x <= HANDHOLDS.x1 ? { kind: 'handholds' } : { kind: 'ivy', site: Math.round(x / IVY_SITE_WIDTH) };
export const ivySiteX = (site: number): number => site * IVY_SITE_WIDTH;

/** The trail: cells she has walked, each deepening with every pass; the ivy she has grown. */
export const TRAIL_CELL = 0.9, TRAIL_MAX = 3, TRAIL_PER_SECOND = 1.1;
export interface Growth { trail: Record<string, number>; ivy: number[] }
export const freshGrowth = (): Growth => ({ trail: {}, ivy: [] });
export const cellKey = (x: number, z: number): string => `${Math.round(x / TRAIL_CELL)},${Math.round(z / TRAIL_CELL)}`;
export const cellCentre = (key: string): { x: number; z: number } => { const [i, j] = key.split(',').map(Number); return { x: i * TRAIL_CELL, z: j * TRAIL_CELL }; };
/** A pass deepens the cell under her feet a little; returns the new level. */
export function tread(g: Growth, x: number, z: number, dt: number): number {
  const k = cellKey(x, z), v = Math.min(TRAIL_MAX, (g.trail[k] ?? 0) + TRAIL_PER_SECOND * dt); g.trail[k] = v; return v;
}
export function parseGrowth(raw: string | null): Growth {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshGrowth();
    const trail: Record<string, number> = {};
    if (p.trail && typeof p.trail === 'object') for (const [k, v] of Object.entries(p.trail)) if (/^-?\d+,-?\d+$/.test(k) && typeof v === 'number' && Number.isFinite(v) && v > 0) trail[k] = Math.min(TRAIL_MAX, v);
    const ivy = Array.isArray(p.ivy) ? [...new Set(p.ivy.filter((s: unknown) => Number.isInteger(s) && Math.abs(s as number) * IVY_SITE_WIDTH <= WALL_HALF))] as number[] : [];
    return { trail, ivy };
  } catch { return freshGrowth(); }
}
/** Round for saving: two decimals are plenty for a flower's size. */
export const serializeGrowth = (g: Growth): string => JSON.stringify({ trail: Object.fromEntries(Object.entries(g.trail).map(([k, v]) => [k, Math.round(v * 100) / 100])), ivy: g.ivy });

/** Walking, for the shared player: the clearing and the ledge, the wall and the trunks as obstacles. */
export function makeGroundWorld(): TraversalWorld {
  return {
    surfacesAt: (x, z) => (onGround(x, z) ? [groundAt(x, z)] : []),
    canOccupy: (p, radius) => {
      if (!onGround(p.x, p.z)) return false;
      if (p.y < groundAt(p.x, p.z) - 0.03) return false;
      for (const t of TREES) if (Math.hypot(p.x - t.x, p.z - t.z) < trunkRadius(t) + radius) return false;
      return true;
    },
  };
}
