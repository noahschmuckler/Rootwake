// Unified traversal data. Authored roots and seeded, chunk-owned roots expose the
// same graph. Border nodes are generated from coordinates, never load order.
// R1 (Noah): the graph is also a way to travel: `plan` finds a course through the
// surface roots from a tree near her to a node near a chosen place, generating the
// chunks it crosses as it goes, so the entry can carry her along it.
import { CatmullRomCurve3, Vector3 } from 'three';
import { TREES, TREE_ROOTS, type RootEdge, grassCan } from './villageModel';
import { NODES, FLOW_ROOTS, PILLARS, ZONES, type Node } from './karstFlowModel';
import { KARST_AT } from './overworldModel';
import { CHUNK, chunkKey, chunksAround, chunkTrees, noise } from './chunkModel';
import type { Terrain } from './worldTerrain';
export interface WorldRoot extends RootEdge { surface: boolean; bounds: [number, number, number, number] }
/** A node of the graph: a tree (the village's, a chunk's, a karst plant) or a hub (a junction under a chunk). Ids: village trees 0.., chunk trees 100000.., karst plants -1.., hubs -1000000... */
export interface WorldNode { id: number; x: number; z: number; kind: 'village' | 'tree' | 'karst' | 'hub'; cx: number; cz: number }
/** A course: the entry tree, the goal node, the nodes in order and the roots between them. */
export interface Course { entry: number; goal: number; nodes: number[]; roots: WorldRoot[]; length: number }
/** How far round her the entry tree and the goal node are looked for; how many nodes a search may open. Tuning. */
export const ENTRY_REACH = 70, GOAL_REACH = 90, PLAN_BUDGET = 6000, ATTACH_BUDGET = 160;
const offset = new Vector3(KARST_AT.x, 0, KARST_AT.z);
const nodeIds = new Map(Object.keys(NODES).sort().map((id, i) => [id, -1 - i]));
export function soilAt(x: number, z: number): boolean {
  return grassCan(x, z) && PILLARS.every(p => Math.hypot(x - KARST_AT.x - p.x, z - KARST_AT.z - p.z) > p.radius(0) + 0.5);
}
function wrap(r: RootEdge, surface: boolean): WorldRoot {
  const xs = r.samples.map(p => p.x), zs = r.samples.map(p => p.z);
  return { ...r, surface, bounds: [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)] };
}
const chunkOf = (x: number, z: number) => ({ cx: Math.floor(x / CHUNK), cz: Math.floor(z / CHUNK) });
export function createRootNetwork(terrain: Terrain) {
  const authored: WorldRoot[] = TREE_ROOTS.map(r => wrap(r, true));
  const endpoints = new Map<number, Node>(Object.entries(NODES).map(([id, n]) => [nodeIds.get(id)!, n]));
  for (const r of FLOW_ROOTS) {
    const curve = new CatmullRomCurve3(r.curve.points.map(p => p.clone().add(offset)), false, r.curve.curveType, r.curve.tension);
    authored.push(wrap({ id: `karst:${r.id}`, a: nodeIds.get(r.a)!, b: nodeIds.get(r.b)!, curve, length: curve.getLength(), samples: curve.getSpacedPoints(Math.max(8, Math.ceil(r.length * 2))) }, NODES[r.a].zone === 'floor' && NODES[r.b].zone === 'floor' && !r.interior));
  }
  const authoredAt = new Map<number, WorldRoot[]>(); for (const r of authored) for (const id of [r.a, r.b]) (authoredAt.get(id) ?? authoredAt.set(id, []).get(id)!).push(r);
  // Every node the graph has met, by id: where it stands and which chunk owns it.
  const where = new Map<number, WorldNode>();
  for (const t of TREES) { const c = chunkOf(t.x, t.z); where.set(t.id, { id: t.id, x: t.x, z: t.z, kind: 'village', ...c }); }
  for (const [id, n] of endpoints) { const x = n.mouth.x + offset.x, z = n.mouth.z + offset.z; where.set(id, { id, x, z, kind: 'karst', ...chunkOf(x, z) }); }
  const memo = new Map<string, WorldRoot[]>(), loaded = new Map<string, WorldRoot[]>();
  let all = [...authored];
  const junctions = new Map<number, WorldRoot[]>();
  function reindex() { all = [...authored, ...[...loaded.values()].flat()]; junctions.clear(); for (const r of all) for (const id of [r.a, r.b]) { const list = junctions.get(id) ?? []; list.push(r); junctions.set(id, list); } }
  const hubId = (cx: number, cz: number): number => { const a = cx >= 0 ? cx * 2 : -cx * 2 - 1, b = cz >= 0 ? cz * 2 : -cz * 2 - 1; return -1000000 - ((a + b) * (a + b + 1) / 2 + b); };
  const hub = (cx: number, cz: number) => {
    const x = (cx + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, terrain.seed + 31) - 0.5) * 16;
    const z = (cz + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, terrain.seed + 67) - 0.5) * 16;
    // Signed coordinate pairing avoids the old modulo-1024 identity collisions.
    const id = hubId(cx, cz);
    if (!where.has(id)) where.set(id, { id, x, z, kind: 'hub', cx, cz });
    return { id, x, z };
  };
  function generated(cx: number, cz: number): WorldRoot[] {
    const out: WorldRoot[] = [], h = hub(cx, cz);
    const join = (a: {id: number; x: number; z: number}, b: {id: number; x: number; z: number}, key: string) => {
      const len = Math.hypot(a.x - b.x, a.z - b.z), points: Vector3[] = [];
      for (let i = 0, n = Math.max(4, Math.ceil(len / 2)); i <= n; i++) {
        const t = i / n, x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t;
        if (!soilAt(x, z)) return;
        points.push(new Vector3(x, terrain.height(x, z) - 0.5 - Math.sin(t * Math.PI) * 0.7, z));
      }
      // Authored sockets must meet exactly, even when their mouth sits above soil.
      const socket = (id: number): Vector3 | undefined => endpoints.get(id)?.mouth.clone().add(offset) ?? (id >= 0 && id < 100000 ? TREE_ROOTS.find(r => r.a === id || r.b === id)?.curve.getPointAt(TREE_ROOTS.find(r => r.a === id || r.b === id)!.a === id ? 0 : 1) : undefined);
      const A = socket(a.id), B = socket(b.id); if (A) points[0] = A; if (B) points[points.length - 1] = B;
      const curve = new CatmullRomCurve3(points), length = curve.getLength();
      out.push(wrap({ id: `world:${cx},${cz}:${key}`, a: a.id, b: b.id, curve, length, samples: curve.getSpacedPoints(Math.ceil(length * 2)) }, true));
    };
    // Each edge has exactly one owner; neighbors compute identical hubs. Eight ways out of a hub (the two diagonals south), so a course runs near straight, not Manhattan-long.
    join(h, hub(cx + 1, cz), 'east'); join(h, hub(cx, cz + 1), 'south'); join(h, hub(cx + 1, cz + 1), 'southeast'); join(h, hub(cx - 1, cz + 1), 'southwest');
    for (const t of chunkTrees(cx, cz, terrain.seed)) { if (!where.has(t.id)) where.set(t.id, { id: t.id, x: t.x, z: t.z, kind: 'tree', cx, cz }); join(h, t, `tree:${t.id}`); }
    for (const t of TREES) if (Math.floor(t.x / CHUNK) === cx && Math.floor(t.z / CHUNK) === cz) join(h, t, `village:${t.id}`);
    const floor = Object.values(NODES).filter(n => n.zone === 'floor').map(n => ({ id: nodeIds.get(n.id)!, x: n.mouth.x + offset.x, z: n.mouth.z + offset.z }));
    const near = floor.filter(n => Math.hypot(n.x - h.x, n.z - h.z) < CHUNK * 1.5).sort((a, b) => Math.hypot(a.x - h.x, a.z - h.z) - Math.hypot(b.x - h.x, b.z - h.z));
    for (const n of near.slice(0, 3)) join(h, n, `karst:${n.id}`);
    return out;
  }
  /** A chunk's roots, generated once and kept (the planner crosses many chunks she never loads; past a few hundred the ones not loaded are let go). */
  function chunkRoots(cx: number, cz: number): WorldRoot[] {
    const key = chunkKey(cx, cz); let rs = memo.get(key);
    if (!rs) { if (memo.size > 600) for (const k of [...memo.keys()]) if (!loaded.has(k)) memo.delete(k); rs = generated(cx, cz); memo.set(key, rs); }
    return rs;
  }
  function update(x: number, z: number): boolean {
    let changed = false; const want = new Set<string>();
    for (const c of chunksAround(x, z, 2)) { const key = chunkKey(c.cx, c.cz); want.add(key); if (!loaded.has(key)) { loaded.set(key, chunkRoots(c.cx, c.cz)); changed = true; } }
    for (const key of loaded.keys()) if (!want.has(key)) { loaded.delete(key); changed = true; }
    if (changed) reindex(); return changed;
  }
  /** Every root at a node, loaded or not: the authored ones, and the ones of the chunks that could own a join to it. */
  function rootsTouching(id: number): WorldRoot[] {
    const n = where.get(id); if (!n) return authoredAt.get(id) ?? [];
    const out = [...(authoredAt.get(id) ?? [])], chunks: [number, number][] = n.kind === 'hub' ? [[n.cx, n.cz], [n.cx - 1, n.cz], [n.cx, n.cz - 1], [n.cx - 1, n.cz - 1], [n.cx + 1, n.cz - 1]] : n.kind === 'karst' ? [] : [[n.cx, n.cz]];
    if (n.kind === 'karst') for (let i = -2; i <= 2; i++) for (let k = -2; k <= 2; k++) chunks.push([n.cx + i, n.cz + k]);
    for (const [cx, cz] of chunks) for (const r of chunkRoots(cx, cz)) if (r.a === id || r.b === id) out.push(r);
    return out;
  }
  const nodeAt = (id: number): WorldNode | undefined => where.get(id);
  const otherEnd = (r: WorldRoot, id: number): number => (r.a === id ? r.b : r.a);
  /** The nodes near a point that have a surface root: trees (a way in), and hubs too when `hubs` (a place to arrive). The chunks round it are generated first, so their trees are known. */
  function nodesNear(x: number, z: number, reach: number, hubs: boolean): WorldNode[] {
    for (const c of chunksAround(x, z, Math.ceil(reach / CHUNK))) chunkRoots(c.cx, c.cz);
    const out: WorldNode[] = [];
    for (const n of where.values()) { if (Math.hypot(n.x - x, n.z - z) > reach || (n.kind === 'hub' && !hubs)) continue; if (n.kind === 'karst' && endpoints.get(n.id)!.zone !== 'floor') continue; if (rootsTouching(n.id).some(r => r.surface)) out.push(n); }
    return out.sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z));
  }
  /** The shortest way through the surface roots from one node to another (A* by root length, opening at most PLAN_BUDGET nodes); null when there is none. */
  function route(from: number, to: number, budget = PLAN_BUDGET): Course | null {
    const goal = where.get(to); if (!goal) return null;
    const h = (id: number): number => { const n = where.get(id); return n ? Math.hypot(n.x - goal.x, n.z - goal.z) : 0; };
    const g = new Map<number, number>([[from, 0]]), via = new Map<number, { root: WorldRoot; from: number }>(), open: { id: number; f: number }[] = [{ id: from, f: h(from) }], closed = new Set<number>();
    let opened = 0;
    while (open.length && opened < budget) {
      let bi = 0; for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
      const { id } = open.splice(bi, 1)[0]; if (closed.has(id)) continue; closed.add(id); opened++;
      if (id === to) { const nodes = [to], roots: WorldRoot[] = []; let cur = to; while (cur !== from) { const v = via.get(cur)!; roots.unshift(v.root); cur = v.from; nodes.unshift(cur); } return { entry: from, goal: to, nodes, roots, length: g.get(to)! }; }
      for (const r of rootsTouching(id)) { if (!r.surface) continue; const next = otherEnd(r, id), cost = g.get(id)! + r.length; if (cost < (g.get(next) ?? Infinity)) { g.set(next, cost); via.set(next, { root: r, from: id }); open.push({ id: next, f: cost + h(next) }); } }
    }
    return null;
  }
  /** Whether a node has a short way onto the hubs (the backbone every course runs on): a tree in a cluster of its own has none, and is no way in or out. */
  function attached(id: number): boolean {
    const n = where.get(id); if (!n) return false; if (n.kind === 'hub') return true;
    for (let i = -1; i <= 1; i++) for (let k = -1; k <= 1; k++) { chunkRoots(n.cx + i, n.cz + k); if (route(id, hubId(n.cx + i, n.cz + k), ATTACH_BUDGET)) return true; }
    return false;
  }
  /** The nodes near a point that are attached, nearest first, at most `take` of them. */
  const attachedNear = (x: number, z: number, reach: number, hubs: boolean, take: number): WorldNode[] => { const out: WorldNode[] = []; for (const n of nodesNear(x, z, reach, hubs)) { if (attached(n.id)) out.push(n); if (out.length >= take) break; } return out; };
  /** A course from a tree near `from` to a node near `to`: the nearest attached tree, and the nearest attached node to the place. */
  function plan(from: { x: number; z: number }, to: { x: number; z: number }): Course | null {
    const goals = attachedNear(to.x, to.z, GOAL_REACH, true, 2), entries = attachedNear(from.x, from.z, ENTRY_REACH, false, 2);
    for (const e of entries) for (const gl of goals) { const c = route(e.id, gl.id); if (c) return c; }
    return null;
  }
  /** A course from a node she is already at (or between: the caller tries both ends) to a place. */
  function planFrom(nodeId: number, to: { x: number; z: number }): Course | null {
    for (const gl of attachedNear(to.x, to.z, GOAL_REACH, true, 2)) { const c = route(nodeId, gl.id); if (c) return c; }
    return null;
  }
  function aligned(p: {x:number; z:number}, dir: {x:number; z:number}, within: number, minDot: number) {
    let best: {root: WorldRoot; s:number; forward:boolean; dot:number} | null = null;
    for (const r of all) {
      if (!r.surface || p.x < r.bounds[0] - within || p.x > r.bounds[2] + within || p.z < r.bounds[1] - within || p.z > r.bounds[3] + within) continue;
      let near = -1, distance = within;
      for (let i = 0; i < r.samples.length; i++) { const d = Math.hypot(p.x-r.samples[i].x,p.z-r.samples[i].z); if(d < distance) { near=i; distance=d; } }
      if (near < 0) continue;
      const t = near/(r.samples.length-1), tangent = r.curve.getTangentAt(t), l = Math.hypot(tangent.x,tangent.z) || 1, dot=(tangent.x*dir.x+tangent.z*dir.z)/l;
      if(Math.abs(dot)>=minDot && (!best || Math.abs(dot)>best.dot)) best={root:r,s:t*r.length,forward:dot>0,dot:Math.abs(dot)};
    }
    return best;
  }
  /** The nearest loaded surface root to a point, within `within` m: where a tap takes her in. */
  function nearest(p: { x: number; z: number }, within: number): { root: WorldRoot; s: number; distance: number } | null {
    let best: { root: WorldRoot; s: number; distance: number } | null = null;
    for (const r of all) {
      if (!r.surface || p.x < r.bounds[0] - within || p.x > r.bounds[2] + within || p.z < r.bounds[1] - within || p.z > r.bounds[3] + within) continue;
      for (let i = 0; i < r.samples.length; i++) { const d = Math.hypot(p.x - r.samples[i].x, p.z - r.samples[i].z); if (d < within && (!best || d < best.distance)) best = { root: r, s: i / (r.samples.length - 1) * r.length, distance: d }; }
    }
    return best;
  }
  function next(id:number, dir:{x:number;z:number}, exclude?: RootEdge) {
    let best: {root:WorldRoot;forward:boolean;dot:number} | null=null;
    for(const r of junctions.get(id) ?? []) { if(r.id===exclude?.id) continue; const forward=r.a===id, t=r.curve.getTangentAt(forward?0.03:0.97).multiplyScalar(forward?1:-1), l=Math.hypot(t.x,t.z)||1, dot=(t.x*dir.x+t.z*dir.z)/l;
      if(dot>0.2&&(!best||dot>best.dot)) best={root:r,forward,dot}; }
    return best;
  }
  reindex();
  return { update, aligned, nearest, next, generated, chunkRoots, rootsTouching, nodeAt, nodesNear, attached, plan, planFrom, route, get roots(){return all;}, get dynamic(){return [...loaded.values()].flat();}, node(id:number){return endpoints.get(id);}, nodeId(id:string){return nodeIds.get(id)!;}, atNode(id:string){return junctions.get(nodeIds.get(id)!) ?? [];}, zone(id:number){const n=endpoints.get(id); return n?ZONES[n.zone]:null;} };
}
export type RootNetwork = ReturnType<typeof createRootNetwork>;
