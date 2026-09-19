import { CatmullRomCurve3, Vector3 } from 'three';
import type { TraversalWorld } from './mobility';
export const SAP_CAP = 120, SHORTCUT_COST = 12, COMMUNION_COST = 24, MANIFEST_SECONDS = 90;
export const CORRIDOR_RADIUS = 1.5;
export const vec = (x: number, y: number, z: number) => new Vector3(x, y, z);
export const NODES = {
  oak: vec(-9, -1.8, 5), fork: vec(-7, -2.2, 0), spring: vec(-13, -2.7, -5),
  fern: vec(-5, -3.1, -7), under: vec(.5, -8.4, -7), grove: vec(10, -1.8, -7),
};
export type NodeId = keyof typeof NODES;
export interface Progress { sap: number; shortcut: boolean; heard: boolean; communion: boolean; spring: boolean; arrived: boolean }
export const freshProgress = (): Progress => ({ sap: 0, shortcut: false, heard: false, communion: false, spring: false, arrived: false });
export function parseProgress(raw: string | null): Progress {
  try { const p = JSON.parse(raw ?? 'null'); if (!p || !Number.isFinite(p.sap)) return freshProgress(); return {sap: Math.min(SAP_CAP, Math.max(0, Math.floor(p.sap))), shortcut: p.shortcut === true, heard: p.heard === true || p.communion === true, communion: p.communion === true, spring: p.spring === true, arrived: p.arrived === true && p.communion === true}; } catch { return freshProgress(); }
}
export type Gate = 'open' | 'shortcut' | 'communion';
export interface RootEdge { id: string; a: NodeId; b: NodeId; gate: Gate; curve: CatmullRomCurve3; samples: Vector3[]; length: number }
function edge(id: string, a: NodeId, b: NodeId, gate: Gate, via: Vector3[] = []): RootEdge {
  const curve = new CatmullRomCurve3([NODES[a], ...via, NODES[b]], false, 'centripetal');
  return { id, a, b, gate, curve, samples: curve.getSpacedPoints(100), length: curve.getLength() };
}
export const EDGES = [
  edge('oak-fork', 'oak', 'fork', 'open', [vec(-9,-2,2)]),
  edge('spring-way', 'fork', 'spring', 'open', [vec(-11,-2.6,-1.7)]),
  edge('spring-fern', 'spring', 'fern', 'open', [vec(-11,-3,-8),vec(-7.5,-3.1,-9)]),
  edge('short-root', 'fork', 'fern', 'shortcut', [vec(-5.6,-2.6,-3.4)]),
  edge('fine-descent', 'fern', 'under', 'communion', [vec(-4.5,-6,-7),vec(-2.5,-8.3,-7)]),
  edge('far-ascent', 'under', 'grove', 'communion', [vec(4,-8.2,-7),vec(7,-5,-7),vec(9,-2.6,-7)]),
];
export const isOpen = (edge: RootEdge, p: Progress): boolean => edge.gate === 'open' || (edge.gate === 'shortcut' ? p.shortcut : p.communion);
export function nearestRoot(position: Vector3, p: Progress): { edge: RootEdge; index: number; distance: number } {
  let best = { edge: EDGES[0], index: 0, distance: Infinity };
  for (const edge of EDGES) if (isOpen(edge,p)) for (let i=0;i<edge.samples.length;i++) { const distance = position.distanceTo(edge.samples[i]); if(distance<best.distance) best={edge,index:i,distance}; }
  return best;
}
/** Bank edges are deliberately wider than the normal 4.2 m jump reach. */
export function groundHeight(x: number, z: number): number {
  if(x > -2.5 && x < 4.5) return -5.7 + .1 * Math.sin(z * .3);
  return .12 * Math.sin(x*.3) * Math.cos(z*.25);
}
export const onBank = (x: number, z: number) => x >= -20 && x <= 18 && z >= -16 && z <= 14 && (x < -3 || x > 5);
export function makeSoil(progress: () => Progress): TraversalWorld {
  return { surfacesAt: () => [], canOccupy: (p, radius, height) => p.y + height <= groundHeight(p.x,p.z)-.12 && nearestRoot(p,progress()).distance <= CORRIDOR_RADIUS-radius };
}
export function spend(p: Progress, kind: 'shortcut'|'communion'): boolean {
  const cost = kind === 'shortcut' ? SHORTCUT_COST : COMMUNION_COST;
  if(p[kind] || p.sap < cost || (kind === 'communion' && !p.heard)) return false;
  p.sap -= cost; p[kind] = true; return true;
}
/** Follow the connected graph toward a destination; guide orientation only, never move the body. */
export function guide(position: Vector3, target: NodeId, p: Progress): Vector3 {
  const distances = Object.fromEntries(Object.keys(NODES).map(k=>[k,Infinity])) as Record<NodeId,number>;
  distances[target]=0;
  for(let pass=0;pass<6;pass++) for(const e of EDGES) if(isOpen(e,p)) { distances[e.a]=Math.min(distances[e.a],distances[e.b]+e.length); distances[e.b]=Math.min(distances[e.b],distances[e.a]+e.length); }
  const n = nearestRoot(position,p), along = n.index/100*n.edge.length;
  const forward = n.edge.length-along+distances[n.edge.b] < along+distances[n.edge.a];
  const endpoint = forward?n.edge.b:n.edge.a;
  if(position.distanceTo(NODES[endpoint])<1.5 && endpoint!==target) {
    const next=EDGES.filter(e=>isOpen(e,p)&&(e.a===endpoint||e.b===endpoint)).sort((a,b)=>a.length+distances[a.a===endpoint?a.b:a.a]-b.length-distances[b.a===endpoint?b.b:b.a])[0];
    if(next) return next.curve.getPointAt(next.a===endpoint?Math.min(.7,3/next.length):Math.max(.3,1-3/next.length));
  }
  return n.edge.samples[Math.max(0,Math.min(100,n.index+(forward?1:-1)*Math.ceil(270/n.edge.length)))].clone();
}
