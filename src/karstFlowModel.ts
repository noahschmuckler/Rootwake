// The Karst, ridden the Clearing's way, grown into a range: every tree that renders is a tree she
// can enter (press into the trunk, rise to the crown, leap crown to crown, or sink to its roots and
// ride them), the forest at the foot is dense and joined underground by a root network, and two of
// the neighbouring pillars can be climbed by a helix of clinging trees (leaf) or by long roots up
// their faces (root). No springs, no sap, no soil: the traversal alone. Pure data and geometry.
import { CatmullRomCurve3, Euler, Matrix4, Vector3 } from 'three';
import type { TraversalWorld } from './mobility';
import { PLANTS, ROOTS, ZONES as KARST_ZONES, inZone as inDisc, relief, pillarRadius, ridePoint, PILLAR_HEIGHT, CAVERN, vec, type Root, type Plant, type Zone as Disc } from './karstModel';
import { mulberry32 } from './colors';
export { relief, vec, otherEnd, stepRide, ridePoint, pillarRadius, CAVERN, PILLAR_HEIGHT } from './karstModel';
export type { Root } from './karstModel';

/** The pillars: the karst she wakes on and its sisters in the mist. Two of the sisters can be climbed. */
export interface Pillar { id: string; x: number; z: number; height: number; base: number; climbable: boolean; radius: (y: number) => number }
const sister = (id: string, x: number, z: number, height: number, base: number, climbable: boolean): Pillar => ({ id, x, z, height, base, climbable, radius: y => base * (1.1 - 0.6 * Math.pow(Math.min(1, Math.max(0, y / height)), 1.2)) + 1.5 * Math.sin(y * 0.2) });
export const PILLARS: Pillar[] = [
  { id: 'main', x: 0, z: 0, height: PILLAR_HEIGHT, base: pillarRadius(0), climbable: true, radius: pillarRadius },
  sister('B', 60, -30, 78, 9, true), sister('C', -55, 40, 58, 12, true),
  sister('D', 20, 75, 66, 8, false), sister('E', -70, -50, 84, 10, false), sister('F', 85, 45, 52, 11, false), sister('G', -30, -85, 70, 9, false),
];
export const pillarById = (id: string): Pillar => PILLARS.find(p => p.id === id)!;
/** A point on a pillar's face, pushed out by `out`, at height y and angle a about its axis. */
export const onPillar = (p: Pillar, y: number, a: number, out = 0): Vector3 => new Vector3(p.x + Math.cos(a) * (p.radius(y) + out), y, p.z + Math.sin(a) * (p.radius(y) + out));
/** The forest floor: one ground around every pillar, out to FOREST_RADIUS, minus the pillars' feet. */
export const FOREST_RADIUS = 92, FOOT_MARGIN = 0.9;
export const onFloor = (x: number, z: number): boolean => Math.hypot(x, z) <= FOREST_RADIUS && PILLARS.every(p => Math.hypot(x - p.x, z - p.z) >= p.radius(0) + FOOT_MARGIN);
/** Where a body can stand: a disc (the summits, ledges, the cavern floor) or the whole forest floor. */
export interface Zone extends Disc { pillar: string; contains?: (x: number, z: number) => boolean }
export const ZONES: Record<string, Zone> = {
  summit: { ...KARST_ZONES.summit, pillar: 'main' }, east: { ...KARST_ZONES.east, pillar: 'main' }, west: { ...KARST_ZONES.west, pillar: 'main' }, south: { ...KARST_ZONES.south, pillar: 'main' }, cavern: { ...KARST_ZONES.cavern, pillar: 'main' },
  floor: { id: 'floor', x: 0, z: 0, y: 0, radius: FOREST_RADIUS, pillar: 'main', contains: onFloor },
};
export const inZone = (zone: Zone, x: number, z: number): boolean => (zone.contains ? zone.contains(x, z) : inDisc(zone, x, z));
export const groundAt = (zone: Zone, x: number, z: number): number => zone.y + relief(x, z);
/** The helix of ledges up a climbable sister: each a shelf with one clinging tree, a leaf-hop from the last. Tuning: the climb's rhythm. */
export const HELIX = { B: { from: 6, step: 6.05, count: 12, angle0: 3.6, turn: 0.75 }, C: { from: 6, step: 5.9, count: 9, angle0: 0.4, turn: 0.55 } } as const;
export const LEDGE_RADIUS = 1.55, LEDGE_OUT = 1.3;
for (const [pid, h] of Object.entries(HELIX)) {
  const p = pillarById(pid);
  ZONES[`summit${pid}`] = { id: `summit${pid}`, x: p.x, z: p.z, y: p.height, radius: p.radius(p.height) - 0.4, pillar: pid };
  for (let i = 0; i < h.count; i++) { const y = h.from + i * h.step, a = h.angle0 + i * h.turn, at = onPillar(p, y, a, LEDGE_OUT); ZONES[`ledge${pid}${i}`] = { id: `ledge${pid}${i}`, x: at.x, z: at.z, y: y + 0.3, radius: LEDGE_RADIUS, pillar: pid }; }
}
/** Every tree and plant is a node: where it stands, its zone, its trunk and crown, and the root mouth at its foot. */
export type NodeKind = 'tree' | 'pine' | 'fern';
export interface Node { id: string; kind: NodeKind; zone: string; at: Vector3; mouth: Vector3; size: number; trunk: number; crownH: number; crownR: number; tilt: number; tiltDir: number; leaf: 'leaf' | 'maple' | 'oak' | 'needle' | 'frond'; climb: boolean; stand?: { x: number; z: number; yaw: number } }
const TRUNK_K = 0.42, CROWN_H = 3.5, CROWN_R = 1.7;
function node(id: string, kind: NodeKind, zone: string, at: Vector3, size: number, leaf: Node['leaf'], tilt = 0, tiltDir = 0, mouth?: Vector3, stand?: Node['stand']): Node {
  const trunk = kind === 'pine' ? 0.35 * size : kind === 'fern' ? 0.3 : TRUNK_K * size * 0.75;
  const crownH = kind === 'pine' ? 4.4 * size : kind === 'fern' ? 0 : CROWN_H * size, crownR = kind === 'pine' ? 1.0 * size : CROWN_R * size;
  const m = mouth ?? at.clone().add(vec(Math.cos(tiltDir + 2.4) * (trunk + 0.55), 0.1, Math.sin(tiltDir + 2.4) * (trunk + 0.55)));
  return { id, kind, zone, at, mouth: m, size, trunk, crownH, crownR, tilt, tiltDir, leaf, climb: kind !== 'fern', stand };
}
export const NODES: Record<string, Node> = {};
const plantKind = (p: Plant): NodeKind => (p.kind === 'pine' ? 'pine' : p.kind === 'fern' ? 'fern' : 'tree');
const plantSize = (p: Plant): number => (p.kind === 'pine' ? 1.1 : p.kind === 'fig' ? 0.75 : p.kind === 'shrub' ? 0.55 : p.kind === 'oak' ? 1.5 : p.kind === 'maple' ? 1.3 : 1);
for (const p of Object.values(PLANTS)) {
  const face = p.kind === 'shrub' || p.kind === 'fig', away = Math.atan2(p.at.z, p.at.x);
  NODES[p.id] = node(p.id, plantKind(p), p.zone, p.at, plantSize(p), p.kind === 'pine' ? 'needle' : p.kind === 'fern' ? 'frond' : p.kind === 'fig' || p.kind === 'maple' ? 'maple' : p.kind === 'oak' ? 'oak' : 'leaf', face ? 0.55 : 0, face ? away + Math.PI / 2 : 0, p.mouth, p.stand);
}
// The sisters' summit pines, the clinging trees of their helices, and a foot tree at each helix's start: the first leaf-hop up.
for (const [pid, h] of Object.entries(HELIX)) {
  const p = pillarById(pid), top = h.angle0 + (h.count - 1) * h.turn;
  const footAt = onPillar(p, 0, h.angle0, 3.6); footAt.y = relief(footAt.x, footAt.z);
  NODES[`${pid}foot`] = node(`${pid}foot`, 'tree', 'floor', footAt, 1.35, 'oak', 0, h.angle0 + Math.PI);
  const pineAt = vec(p.x + Math.cos(top) * 1.6, p.height, p.z + Math.sin(top) * 1.6);
  NODES[`pine${pid}`] = node(`pine${pid}`, 'pine', `summit${pid}`, pineAt, 1.0, 'needle', 0, 0, pineAt.clone().add(vec(-Math.cos(top) * 0.8, 0.1, -Math.sin(top) * 0.8)), { x: p.x - Math.cos(top) * 1.2, z: p.z - Math.sin(top) * 1.2, yaw: Math.atan2(Math.cos(top), Math.sin(top)) });
  for (let i = 0; i < h.count; i++) { const y = h.from + i * h.step, a = h.angle0 + i * h.turn, at = onPillar(p, y + 0.3, a, 0.45); NODES[`${pid}${i}`] = node(`${pid}${i}`, 'tree', `ledge${pid}${i}`, at, 0.6, i % 3 === 2 ? 'maple' : 'leaf', 0.5, a + Math.PI / 2, onPillar(p, y + 0.4, a, LEDGE_OUT + 0.2)); }
}
/** The forest at the foot: dense within the main pillar's reach and along the ways to the climbable sisters, sparser beyond. Tuning: the spacings. */
export const FOREST_SEED = 410926, DENSE_SPACING = 4.6, SPARSE_SPACING = 7.6, CORRIDOR_HALF = 14, DENSE_RADIUS = 40, FOOT_REACH = 18;
const segmentDistance = (x: number, z: number, ax: number, az: number, bx: number, bz: number): number => { const dx = bx - ax, dz = bz - az, t = Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz))); return Math.hypot(x - ax - dx * t, z - az - dz * t); };
export function dense(x: number, z: number): boolean {
  if (Math.hypot(x, z) < DENSE_RADIUS) return true;
  for (const p of PILLARS) if (p.climbable && p.id !== 'main' && (Math.hypot(x - p.x, z - p.z) < p.radius(0) + FOOT_REACH || segmentDistance(x, z, 0, 0, p.x, p.z) < CORRIDOR_HALF)) return true;
  return false;
}
export const FOREST: Node[] = (() => {
  const rand = mulberry32(FOREST_SEED), out: Node[] = [], keep = [NODES.floorOak, NODES.floorMaple, NODES.Bfoot, NODES.Cfoot];
  const clearOf = (x: number, z: number): boolean => keep.every(k => Math.hypot(x - k.at.x, z - k.at.z) > 5) && PILLARS.every(p => Math.hypot(x - p.x, z - p.z) > p.radius(0) + 3.2) && Math.hypot(x - PLANTS.floorOak.mouth.x, z - PLANTS.floorOak.mouth.z) > 4;
  for (let i = 0; i < 40000 && out.length < 460; i++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * (FOREST_RADIUS - 3), x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (!onFloor(x, z) || !clearOf(x, z)) continue;
    const spacing = dense(x, z) ? DENSE_SPACING : SPARSE_SPACING;
    if (out.some(t => Math.hypot(t.at.x - x, t.at.z - z) < spacing) || keep.some(k => Math.hypot(k.at.x - x, k.at.z - z) < spacing)) continue;
    const size = 0.85 + rand() * 0.55, dir = rand() * Math.PI * 2;
    out.push(node(`t${out.length}`, 'tree', 'floor', vec(x, relief(x, z), z), size, rand() < 0.2 ? 'maple' : 'leaf', 0, dir));
  }
  return out;
})();
for (const t of FOREST) NODES[t.id] = t;
export const nodesOf = (zoneId: string): Node[] => Object.values(NODES).filter(n => n.zone === zoneId);
/** Trunk footprints on a grid, so the floor's hundreds of trees are cheap to walk round. */
const CELL = 6, grid = new Map<string, Node[]>();
const cellKeyOf = (x: number, z: number): string => `${Math.floor(x / CELL)},${Math.floor(z / CELL)}`;
for (const n of Object.values(NODES)) { const k = cellKeyOf(n.at.x, n.at.z); (grid.get(k) ?? grid.set(k, []).get(k)!).push(n); }
export function nodesNear(x: number, z: number, zoneId?: string): Node[] {
  const cx = Math.floor(x / CELL), cz = Math.floor(z / CELL), out: Node[] = [];
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (const n of grid.get(`${cx + i},${cz + j}`) ?? []) if (!zoneId || n.zone === zoneId) out.push(n);
  return out;
}
export function nearestNode(zoneId: string, x: number, z: number): { node: Node; distance: number } {
  let best: { node: Node; distance: number } | null = null;
  for (const n of nodesNear(x, z, zoneId).length ? nodesNear(x, z, zoneId) : nodesOf(zoneId)) { const d = Math.hypot(x - n.at.x, z - n.at.z) - n.trunk; if (!best || d < best.distance) best = { node: n, distance: d }; }
  return best!;
}
const FACE_ZONE = /^(east|west|south|ledge)/;
/** Walking, for the shared player: one world per zone. The zone's edge holds her (no falling), trunks block, and on a ledge the pillar's face is a wall. */
export function makeZoneWorld(zone: Zone): TraversalWorld {
  const pillar = pillarById(zone.pillar);
  return {
    surfacesAt: (x, z) => (inZone(zone, x, z) ? [groundAt(zone, x, z)] : []),
    canOccupy: (p, radius) => {
      if (!inZone(zone, p.x, p.z)) return false;
      if (p.y < groundAt(zone, p.x, p.z) - 0.03) return false;
      if (FACE_ZONE.test(zone.id) && Math.hypot(p.x - pillar.x, p.z - pillar.z) < pillar.radius(zone.y) + radius - 0.05) return false;
      for (const t of nodesNear(p.x, p.z, zone.id)) if (Math.hypot(p.x - t.at.x, p.z - t.at.z) < t.trunk + radius) return false;
      return true;
    },
  };
}
/** A tree's frame: its trunk leans out of the rock by `tilt` toward `tiltDir`. */
export const nodeFrame = (n: Node): Matrix4 => new Matrix4().makeRotationFromEuler(new Euler(Math.sin(n.tiltDir) * n.tilt, 0, -Math.cos(n.tiltDir) * n.tilt)).setPosition(n.at.x, n.at.y, n.at.z);
/** On the trunk's surface at height h and azimuth az: where the bark bulge rides. */
export const trunkPoint = (n: Node, h: number, az: number): Vector3 => vec(Math.cos(az) * (n.trunk + 0.12), h, Math.sin(az) * (n.trunk + 0.12)).applyMatrix4(nodeFrame(n));
/** The crown's edge at azimuth az: where the leaf figure stands when she is in the canopy. */
export const crownPoint = (n: Node, az: number): Vector3 => vec(Math.cos(az) * n.crownR * 0.65, n.crownH + 0.15, Math.sin(az) * n.crownR * 0.65).applyMatrix4(nodeFrame(n));
export const crownTop = (n: Node): number => n.at.y + n.crownH;
/** Crowns within a leap: near enough sideways, and not too far up or down. Tuning. */
export const HOP_REACH = 9, HOP_RISE = 8;
export const hopTargets = (n: Node): Node[] => Object.values(NODES).filter(o => o !== n && o.climb && Math.hypot(o.at.x - n.at.x, o.at.z - n.at.z) <= HOP_REACH && Math.abs(crownTop(o) - crownTop(n)) <= HOP_RISE);
/** Where she stands on emerging from a node: its authored stand, or the first clear spot round its trunk, facing away from it. */
export function standNear(n: Node): { x: number; z: number; yaw: number } {
  if (n.stand) return n.stand;
  const zone = ZONES[n.zone], world = makeZoneWorld(zone), first = n.kind === 'tree' && n.tilt > 0 ? n.tiltDir : n.tiltDir + 2.4;
  for (let i = 0; i < 8; i++) { const a = first + i * Math.PI / 4, x = n.at.x + Math.cos(a) * (n.trunk + 0.6), z = n.at.z + Math.sin(a) * (n.trunk + 0.6); if (world.canOccupy(vec(x, groundAt(zone, x, z), z), 0.25, 0.72)) return { x, z, yaw: Math.atan2(-Math.cos(a), -Math.sin(a)) }; }
  return { x: n.at.x + n.trunk + 0.6, z: n.at.z, yaw: -Math.PI / 2 };
}
// Roots. The karst's own (its dormant taproot left out), a network under the forest joining every
// floor tree to its neighbours, and the sisters' long roots: from a foot tree up the face to a
// mid-helix tree, and from there over the rim to the summit pine.
const makeRoot = (id: string, a: string, b: string, interior: boolean, points: Vector3[]): Root => { const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.6); return { id, a, b, interior, curve, length: curve.getLength() }; };
export const KARST_ROOTS: Root[] = ROOTS.filter(r => !r.dormant);
export const NETWORK_LINK = 9.5, NETWORK_JOIN = 18;
export const NETWORK_ROOTS: Root[] = (() => {
  const floor = nodesOf('floor'), out: Root[] = [], seen = new Set<string>();
  const edge = (a: Node, b: Node): void => { const key = [a.id, b.id].sort().join('|'); if (seen.has(key)) return; seen.add(key); const A = a.mouth, B = b.mouth, mid = A.clone().lerp(B, 0.5); mid.y = -1.2 - A.distanceTo(B) * 0.05; const q1 = A.clone().lerp(B, 0.25); q1.y = -0.9; const q3 = A.clone().lerp(B, 0.75); q3.y = -0.9; out.push(makeRoot(`n:${key}`, a.id, b.id, false, [A.clone(), q1, mid, q3, B.clone()])); };
  for (const t of floor) { const near = floor.filter(o => o !== t && Math.hypot(o.at.x - t.at.x, o.at.z - t.at.z) <= NETWORK_LINK).sort((p, q) => Math.hypot(p.at.x - t.at.x, p.at.z - t.at.z) - Math.hypot(q.at.x - t.at.x, q.at.z - t.at.z)).slice(0, 3); for (const o of near) edge(t, o); }
  // One piece: join the components by their closest pair until there is one, so the network reaches every foot.
  const parent = new Map(floor.map(n => [n.id, n.id])); const find = (id: string): string => { let r = id; while (parent.get(r) !== r) r = parent.get(r)!; parent.set(id, r); return r; };
  for (const r of out) parent.set(find(r.a), find(r.b));
  for (let guard = 0; guard < floor.length; guard++) {
    const comps = new Set(floor.map(n => find(n.id))); if (comps.size <= 1) break;
    let best: { a: Node; b: Node; d: number } | null = null;
    for (const a of floor) for (const b of floor) { if (find(a.id) === find(b.id)) continue; const d = Math.hypot(a.at.x - b.at.x, a.at.z - b.at.z); if (d <= NETWORK_JOIN && (!best || d < best.d)) best = { a, b, d }; }
    if (!best) break; edge(best.a, best.b); parent.set(find(best.a.id), find(best.b.id));
  }
  return out;
})();
export const SISTER_ROOTS: Root[] = (() => {
  const out: Root[] = [];
  for (const [pid, h] of Object.entries(HELIX)) {
    const p = pillarById(pid), mid = Math.floor(h.count / 2), midNode = NODES[`${pid}${mid}`], foot = NODES[`${pid}foot`];
    // Draped over the face the short way round, keeping just outside the rock (the sisters' faces are jittered more than the karst's).
    const drape = (a: Node, b: Node, y0: number, y1: number, a0: number, a1: number): Vector3[] => { const sweep = Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0)), pts: Vector3[] = []; for (let i = 1; i < 7; i++) { const t = i / 7; pts.push(onPillar(p, y0 + (y1 - y0) * t, a0 + sweep * t, 0.75 + 0.15 * Math.sin(t * 9))); } return [a.mouth.clone(), ...pts, b.mouth.clone()]; };
    const footAngle = h.angle0, midAngle = h.angle0 + mid * h.turn, topAngle = h.angle0 + (h.count - 1) * h.turn;
    out.push(makeRoot(`${pid}-foot-mid`, foot.id, midNode.id, false, drape(foot, midNode, 1.5, midNode.at.y - 0.5, footAngle, midAngle)));
    // And ledge to ledge up the helix, so every clinging tree has roots to sink into and the climb can be taken a ledge at a time.
    for (let i = -1; i + 1 < h.count; i++) { const a = i < 0 ? foot : NODES[`${pid}${i}`], b = NODES[`${pid}${i + 1}`]; out.push(makeRoot(`${pid}-h${i + 1}`, a.id, b.id, false, drape(a, b, i < 0 ? 1.5 : a.at.y + 0.3, b.at.y - 0.3, i < 0 ? footAngle : h.angle0 + i * h.turn, h.angle0 + (i + 1) * h.turn))); }
    const pine = NODES[`pine${pid}`], rim = [onPillar(p, p.height - 1.5, topAngle, 0.6), onPillar(p, p.height, topAngle, 0.35).setY(p.height + 0.1), onPillar(p, p.height, topAngle, -1.2).setY(p.height + 0.15)];
    out.push(makeRoot(`${pid}-mid-top`, midNode.id, pine.id, false, [...drape(midNode, pine, midNode.at.y + 0.5, p.height - 2.5, midAngle, topAngle).slice(0, -1), ...rim, pine.mouth.clone()]));
  }
  return out;
})();
export const FLOW_ROOTS: Root[] = [...KARST_ROOTS, ...SISTER_ROOTS, ...NETWORK_ROOTS];
/** The long roots (the karst's and the sisters'): the ones that carry motes. */
export const LONG_ROOTS: Root[] = [...KARST_ROOTS, ...SISTER_ROOTS];
const rootIndex = new Map<string, Root[]>(); for (const r of FLOW_ROOTS) for (const end of [r.a, r.b]) (rootIndex.get(end) ?? rootIndex.set(end, []).get(end)!).push(r);
export const rootsAt = (nodeId: string): Root[] => rootIndex.get(nodeId) ?? [];
const other = (r: Root, id: string): string => (r.a === id ? r.b : r.a);
/** Can `to` be reached from `from` along roots (or by leaf-hops)? Breadth first over a graph of hundreds of nodes. */
export function reachable(from: string, to: string, by: 'root' | 'hop' = 'root'): boolean {
  const seen = new Set([from]), queue = [from];
  while (queue.length) { const id = queue.shift()!; if (id === to) return true; const next = by === 'root' ? rootsAt(id).map(r => other(r, id)) : hopTargets(NODES[id]).map(n => n.id); for (const n of next) if (!seen.has(n)) { seen.add(n); queue.push(n); } }
  return false;
}
/** The shortest way over every karst root from one node to another, by length (Dijkstra over a graph of hundreds); null when there is none. */
export function shortestPath(from: string, to: string): Root[] | null {
  const dist = new Map<string, number>([[from, 0]]), via = new Map<string, Root>(), open = [from], done = new Set<string>();
  while (open.length) {
    let bi = 0; for (let i = 1; i < open.length; i++) if (dist.get(open[i])! < dist.get(open[bi])!) bi = i;
    const id = open.splice(bi, 1)[0]; if (done.has(id)) continue; done.add(id);
    if (id === to) { const out: Root[] = []; let cur = to; while (cur !== from) { const r = via.get(cur)!; out.unshift(r); cur = other(r, cur); } return out; }
    for (const r of rootsAt(id)) { const next = other(r, id), d = dist.get(id)! + r.length; if (d < (dist.get(next) ?? Infinity)) { dist.set(next, d); via.set(next, r); open.push(next); } }
  }
  return null;
}
/** Every node's distance from one over the karst's roots, for the portal's menu. */
export function reachFrom(from: string): Map<string, number> {
  const dist = new Map<string, number>([[from, 0]]), open = [from], done = new Set<string>();
  while (open.length) {
    let bi = 0; for (let i = 1; i < open.length; i++) if (dist.get(open[i])! < dist.get(open[bi])!) bi = i;
    const id = open.splice(bi, 1)[0]; if (done.has(id)) continue; done.add(id);
    for (const r of rootsAt(id)) { const next = other(r, id), d = dist.get(id)! + r.length; if (d < (dist.get(next) ?? Infinity)) { dist.set(next, d); open.push(next); } }
  }
  return dist;
}
/** A node's name, for the portal's menu: the karst's own plants have theirs; the sisters' by pillar and ledge. */
export function nodeName(id: string): string {
  if (id in PLANTS) return PLANTS[id].name;
  const pine = /^pine([A-Z])$/.exec(id); if (pine) return `sister ${pine[1]}'s summit`;
  const foot = /^([A-Z])foot$/.exec(id); if (foot) return `the foot of sister ${foot[1]}`;
  const ledge = /^([A-Z])(\d+)$/.exec(id); if (ledge) return `sister ${ledge[1]}, ledge ${Number(ledge[2]) + 1}`;
  return 'a floor tree';
}
/** The places the karst's roots reach from a node: one per zone above the floor, the nearest of its nodes (a sister's helix by its halfway ledge only), nearest first. */
export function destinationsFrom(from: string): { id: string; name: string; length: number }[] {
  const dist = reachFrom(from), best = new Map<string, { id: string; length: number }>();
  for (const [id, length] of dist) {
    const n = NODES[id]; if (n.zone === 'floor' || id === from) continue;
    if (n.zone.startsWith('ledge')) { const pid = n.zone.slice(5, 6); if (id !== `${pid}${Math.floor(HELIX[pid as keyof typeof HELIX].count / 2)}`) continue; }
    const b = best.get(n.zone); if (!b || length < b.length) best.set(n.zone, { id, length });
  }
  return [...best.values()].sort((a, b) => a.length - b.length).map(d => ({ ...d, name: NODES[d.id].zone.startsWith('ledge') ? `sister ${NODES[d.id].zone.slice(5, 6)}, halfway up` : nodeName(d.id) }));
}
/** Every simple route between two of the karst's own plants over its own roots (small graph). */
export function routes(from: string, to: string, seen: string[] = []): string[][] {
  if (from === to) return [[to]];
  const out: string[][] = [];
  for (const r of KARST_ROOTS.filter(r => r.a === from || r.b === from)) { const next = other(r, from); if (seen.includes(next) || next === from) continue; for (const rest of routes(next, to, [...seen, from])) out.push([from, ...rest]); }
  return out;
}
/** Pressing into a tree: within this of its trunk, pushing toward it, for PRESS_S. A double tap on the ground within ENTER_RANGE goes straight to its roots. */
export const PRESS_S = 0.35, PRESS_RANGE = 0.6, ENTER_RANGE = 3.2;
/** At a mouth the stick chooses; the chosen root brightens and, held for ARM_S, is taken. SETTLE_S is the beat after arriving. */
export const ARM_S = 0.3, SETTLE_S = 0.45, CHOOSE_DOT = 0.55;
/** Inside a trunk the stick climbs at TRUNK_CLIMB m/s; crowns slide at CROWN_SLIDE rad/s; a leap takes HOP_S. Tuning. */
export const TRUNK_CLIMB = 2.4, CROWN_SLIDE = 1.7, HOP_S = 0.9;
export const DEPART_M = 3;
export const departure = (r: Root, from: string): Vector3 => ridePoint(r, from, Math.min(DEPART_M, r.length * 0.4)).point;
export type Screen = (p: Vector3) => { x: number; y: number } | null;
/** The stick chooses the root whose departure, seen from where the camera is, best matches its direction. */
export function chooseRoot(nodeId: string, stick: { x: number; y: number }, screen: Screen, exclude: Root | null = null): Root | null {
  const m = Math.hypot(stick.x, stick.y); if (m < 0.35) return null;
  const sx = stick.x / m, sy = stick.y / m, origin = screen(NODES[nodeId].mouth); if (!origin) return null;
  let best: Root | null = null, bestDot = CHOOSE_DOT;
  for (const r of rootsAt(nodeId)) {
    if (r === exclude) continue;
    const d = screen(departure(r, nodeId)); if (!d) continue;
    const dx = d.x - origin.x, dy = d.y - origin.y, l = Math.hypot(dx, dy); if (l < 1e-6) continue;
    const dot = (dx * sx + dy * sy) / l; if (dot > bestDot) { bestDot = dot; best = r; }
  }
  return best;
}
export function screenDirections(nodeId: string, screen: Screen): { root: string; x: number; y: number }[] {
  const origin = screen(NODES[nodeId].mouth); if (!origin) return [];
  const out: { root: string; x: number; y: number }[] = [];
  for (const r of rootsAt(nodeId)) { const d = screen(departure(r, nodeId)); if (!d) continue; const dx = d.x - origin.x, dy = d.y - origin.y, l = Math.hypot(dx, dy) || 1; out.push({ root: r.id, x: dx / l, y: dy / l }); }
  return out;
}
/** Her trail: cells she has walked, per zone, deepening with every pass. */
export const TRAIL_CELL = 0.9, TRAIL_MAX = 3, TRAIL_PER_SECOND = 1.1;
export const cellKey = (zone: string, x: number, z: number): string => `${zone}:${Math.round(x / TRAIL_CELL)},${Math.round(z / TRAIL_CELL)}`;
export const cellCentre = (key: string): { zone: string; x: number; z: number } => { const [zone, rest] = key.split(':'); const [i, j] = rest.split(',').map(Number); return { zone, x: i * TRAIL_CELL, z: j * TRAIL_CELL }; };
export interface Progress { at: string; visited: string[]; reachedFloor: boolean; returned: boolean; summits: string[]; trail: Record<string, number> }
export const freshProgress = (): Progress => ({ at: 'pine', visited: ['pine'], reachedFloor: false, returned: false, summits: [], trail: {} });
export function tread(p: Progress, zone: string, x: number, z: number, dt: number): number {
  const k = cellKey(zone, x, z), v = Math.min(TRAIL_MAX, (p.trail[k] ?? 0) + TRAIL_PER_SECOND * dt); p.trail[k] = v; return v;
}
export function parseProgress(raw: string | null): Progress {
  try {
    const p = JSON.parse(raw ?? 'null'); if (!p || typeof p !== 'object') return freshProgress();
    const visited = Array.isArray(p.visited) ? p.visited.filter((v: unknown) => typeof v === 'string' && v in NODES) : [];
    const at = typeof p.at === 'string' && p.at in NODES ? p.at : 'pine';
    if (!visited.includes(at)) visited.push(at);
    const reachedFloor = p.reachedFloor === true && visited.some((v: string) => NODES[v].zone === 'floor');
    const summits = Array.isArray(p.summits) ? [...new Set(p.summits.filter((s: unknown) => typeof s === 'string' && s in ZONES && (s as string).startsWith('summit') && s !== 'summit'))] as string[] : [];
    const trail: Record<string, number> = {};
    if (p.trail && typeof p.trail === 'object') for (const [k, v] of Object.entries(p.trail)) if (/^[A-Za-z0-9]+:-?\d+,-?\d+$/.test(k) && k.split(':')[0] in ZONES && typeof v === 'number' && Number.isFinite(v) && v > 0) trail[k] = Math.min(TRAIL_MAX, v);
    return { at, visited, reachedFloor, returned: p.returned === true && reachedFloor, summits, trail };
  } catch { return freshProgress(); }
}
export const serializeProgress = (p: Progress): string => JSON.stringify({ ...p, trail: Object.fromEntries(Object.entries(p.trail).map(([k, v]) => [k, Math.round(v * 100) / 100])) });
/** Arriving in a node: remember it; note the floor, the return to the summit from below, and each sister's summit. */
export function arrive(p: Progress, nodeId: string): 'floor' | 'returned' | 'summit' | null {
  p.at = nodeId; if (!p.visited.includes(nodeId)) p.visited.push(nodeId);
  const zone = NODES[nodeId].zone;
  if (zone === 'floor' && !p.reachedFloor) { p.reachedFloor = true; return 'floor'; }
  if (nodeId === 'pine' && p.reachedFloor && !p.returned) { p.returned = true; return 'returned'; }
  if (zone.startsWith('summit') && zone !== 'summit' && !p.summits.includes(zone)) { p.summits.push(zone); return 'summit'; }
  return null;
}
/** Is a point inside any pillar's limestone (and not in the cavern)? The third-person camera pulls in rather than enter it. */
export function insideRock(p: Vector3): boolean {
  if (p.distanceTo(CAVERN.centre) < CAVERN.radius - 0.3) return false;
  for (const pillar of PILLARS) if (p.y >= 0 && p.y <= pillar.height && Math.hypot(p.x - pillar.x, p.z - pillar.z) < pillar.radius(p.y) - 0.1) return true;
  return false;
}
