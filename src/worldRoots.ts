// Unified traversal data. Authored roots and seeded, chunk-owned roots expose the
// same graph. Border nodes are generated from coordinates, never load order.
import { CatmullRomCurve3, Vector3 } from 'three';
import { TREES, TREE_ROOTS, type RootEdge, grassCan } from './villageModel';
import { NODES, FLOW_ROOTS, PILLARS, ZONES, type Node } from './karstFlowModel';
import { KARST_AT } from './overworldModel';
import { CHUNK, chunkKey, chunksAround, chunkTrees, noise } from './chunkModel';
import type { Terrain } from './worldTerrain';
export interface WorldRoot extends RootEdge { surface: boolean; bounds: [number, number, number, number] }
const offset = new Vector3(KARST_AT.x, 0, KARST_AT.z);
const nodeIds = new Map(Object.keys(NODES).sort().map((id, i) => [id, -1 - i]));
export function soilAt(x: number, z: number): boolean {
  return grassCan(x, z) && PILLARS.every(p => Math.hypot(x - KARST_AT.x - p.x, z - KARST_AT.z - p.z) > p.radius(0) + 0.5);
}
function wrap(r: RootEdge, surface: boolean): WorldRoot {
  const xs = r.samples.map(p => p.x), zs = r.samples.map(p => p.z);
  return { ...r, surface, bounds: [Math.min(...xs), Math.min(...zs), Math.max(...xs), Math.max(...zs)] };
}
export function createRootNetwork(terrain: Terrain) {
  const authored: WorldRoot[] = TREE_ROOTS.map(r => wrap(r, true));
  const endpoints = new Map<number, Node>(Object.entries(NODES).map(([id, n]) => [nodeIds.get(id)!, n]));
  for (const r of FLOW_ROOTS) {
    const curve = new CatmullRomCurve3(r.curve.points.map(p => p.clone().add(offset)), false, r.curve.curveType, r.curve.tension);
    authored.push(wrap({ id: `karst:${r.id}`, a: nodeIds.get(r.a)!, b: nodeIds.get(r.b)!, curve, length: curve.getLength(), samples: curve.getSpacedPoints(Math.max(8, Math.ceil(r.length * 2))) }, NODES[r.a].zone === 'floor' && NODES[r.b].zone === 'floor' && !r.interior));
  }
  const loaded = new Map<string, WorldRoot[]>();
  let all = [...authored];
  const junctions = new Map<number, WorldRoot[]>();
  function reindex() { all = [...authored, ...[...loaded.values()].flat()]; junctions.clear(); for (const r of all) for (const id of [r.a, r.b]) { const list = junctions.get(id) ?? []; list.push(r); junctions.set(id, list); } }
  const hub = (cx: number, cz: number) => {
    const x = (cx + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, terrain.seed + 31) - 0.5) * 16;
    const z = (cz + 0.5) * CHUNK + (noise(cx * 19, cz * 19, 13, terrain.seed + 67) - 0.5) * 16;
    // Signed coordinate pairing avoids the old modulo-1024 identity collisions.
    const a = cx >= 0 ? cx * 2 : -cx * 2 - 1, b = cz >= 0 ? cz * 2 : -cz * 2 - 1;
    return { id: -1000000 - ((a + b) * (a + b + 1) / 2 + b), x, z };
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
    // Each edge has exactly one owner; neighbors compute identical hubs.
    join(h, hub(cx + 1, cz), 'east'); join(h, hub(cx, cz + 1), 'south');
    for (const t of chunkTrees(cx, cz, terrain.seed)) join(h, t, `tree:${t.id}`);
    for (const t of TREES) if (Math.floor(t.x / CHUNK) === cx && Math.floor(t.z / CHUNK) === cz) join(h, t, `village:${t.id}`);
    const floor = Object.values(NODES).filter(n => n.zone === 'floor').map(n => ({ id: nodeIds.get(n.id)!, x: n.mouth.x + offset.x, z: n.mouth.z + offset.z }));
    const near = floor.filter(n => Math.hypot(n.x - h.x, n.z - h.z) < CHUNK * 1.5).sort((a, b) => Math.hypot(a.x - h.x, a.z - h.z) - Math.hypot(b.x - h.x, b.z - h.z));
    for (const n of near.slice(0, 3)) join(h, n, `karst:${n.id}`);
    return out;
  }
  function update(x: number, z: number): boolean {
    let changed = false; const want = new Set<string>();
    for (const c of chunksAround(x, z, 2)) { const key = chunkKey(c.cx, c.cz); want.add(key); if (!loaded.has(key)) { loaded.set(key, generated(c.cx, c.cz)); changed = true; } }
    for (const key of loaded.keys()) if (!want.has(key)) { loaded.delete(key); changed = true; }
    if (changed) reindex(); return changed;
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
  function next(id:number, dir:{x:number;z:number}, exclude?: RootEdge) {
    let best: {root:WorldRoot;forward:boolean;dot:number} | null=null;
    for(const r of junctions.get(id) ?? []) { if(r.id===exclude?.id) continue; const forward=r.a===id, t=r.curve.getTangentAt(forward?0.03:0.97).multiplyScalar(forward?1:-1), l=Math.hypot(t.x,t.z)||1, dot=(t.x*dir.x+t.z*dir.z)/l;
      if(dot>0.2&&(!best||dot>best.dot)) best={root:r,forward,dot}; }
    return best;
  }
  reindex();
  return { update, aligned, next, generated, get roots(){return all;}, get dynamic(){return [...loaded.values()].flat();}, node(id:number){return endpoints.get(id);}, nodeId(id:string){return nodeIds.get(id)!;}, atNode(id:string){return junctions.get(nodeIds.get(id)!) ?? [];}, zone(id:number){const n=endpoints.get(id); return n?ZONES[n.zone]:null;} };
}
