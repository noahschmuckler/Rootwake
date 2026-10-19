// The Descent, D1 (DESCENT.md): a visit to a catwalk from the village's deep node. The catwalk of the
// node's depth is built where the node is (the drop hangs at the node, the chamber round it), the shared
// player walks it on its own traversal world, the keepers answer her, and "into the drop" hands her back
// to the node. The entry (village.ts) switches its mode and lights; this holds the place and its talk.
import * as THREE from 'three';
import type { TraversalWorld } from './mobility';
import { walkable, stepOut, stationSpot, portalSpot, KEEPER_LINES, LAYERS, type Catwalk, type Station } from './descentModel';
import { buildDescent, type DescentWorld } from './descentWorld';

/** How near a station's spot (m) she can listen, and the drop's gangway foot she can step back in. Tuning. */
export const LISTEN_M = 1.5, DROP_M = 1.0, BUBBLE_S = 7;
const HEAD_Y: Record<Station['keeper'], number> = { snerk: 1.25, hollowed: 1.5, greeblin: 0.9 };
const keeperName = (s: Station): string => (s.keeper === 'snerk' ? 'the snerk' : s.keeper === 'hollowed' ? 'the hollowed' : 'the greeblin');

export interface DescentVisit {
  readonly active: boolean; readonly catwalk: Catwalk | null; readonly world: DescentWorld | null;
  /** The ground she walks while on the catwalk, and the air the camera may use. */
  readonly traversal: TraversalWorld; cameraClear(p: THREE.Vector3): boolean;
  /** Build the catwalk of `depth` round the drop's centre `drop`; where she stands on stepping out, and her yaw. */
  enter(depth: number, drop: THREE.Vector3, at?: 'gangway' | 'portal'): { at: THREE.Vector3; yaw: number };
  /** The portal's middle in the world (where the passage out begins), while she is on a catwalk. */
  portalAt(): THREE.Vector3 | null;
  exit(): void;
  /** Each frame while active: the keepers turn to her, the act button and the bubble follow. */
  update(t: number, feet: THREE.Vector3, quiet?: boolean): void;
  readonly near: 'listen' | 'drop' | 'portal' | null;
  /** The portal's film, opening (0..1) while she channels into it. */
  setPortalOpen(k: number): void;
  /** Press the act button (dev and checks). */ act(): void;
}

export function createDescentVisit(scene: THREE.Scene, camera: THREE.Camera, onDrop: () => void, onPortal: () => void = () => {}): DescentVisit {
  let world: DescentWorld | null = null, cw: Catwalk | null = null;
  const origin = new THREE.Vector3();
  const local = (x: number, z: number): [number, number] => [x - origin.x, z - origin.z];
  const stand = (x: number, z: number): boolean => { if (!cw) return false; const [lx, lz] = local(x, z); return walkable(cw, lx, lz); };
  const traversal: TraversalWorld = {
    surfacesAt: (x, z) => (stand(x, z) ? [origin.y] : []),
    canOccupy: (p, radius) => { const k = radius * 0.6; return Math.abs(p.y - origin.y) < 0.3 && stand(p.x, p.z) && stand(p.x + k, p.z) && stand(p.x - k, p.z) && stand(p.x, p.z + k) && stand(p.x, p.z - k); },
  };
  function cameraClear(p: THREE.Vector3): boolean {
    if (!cw || !world) return true; const [lx, lz] = local(p.x, p.z), r = Math.hypot(lx, lz), y = p.y - origin.y;
    return r < cw.wallR - 0.25 && r > 0.95 && y < cw.height - 0.25 && y > -2 && Math.hypot(lx, y - world.drop.y, lz) > 1.6;
  }
  // The act button and the keeper's speech bubble (styled here: the village's sheet does not know them).
  const act = document.createElement('button'); act.id = 'descentAct'; act.hidden = true;
  act.style.cssText = 'position:fixed;z-index:24;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 150px);min-width:160px;min-height:44px;padding:8px 14px;border-radius:14px;font:15px Georgia,serif;background:#2a2238e6;border:1px solid #c8a8ff66;color:#f1e8ff';
  const bubbleEl = document.createElement('div'); bubbleEl.id = 'descentBubble'; bubbleEl.hidden = true;
  bubbleEl.style.cssText = 'position:fixed;z-index:21;max-width:min(300px,80vw);transform:translate(-50%,-100%);padding:9px 12px;border-radius:12px;background:#f4ecd8f2;color:#2a2018;font:14px/1.4 Georgia,serif;box-shadow:0 4px 14px #0008;pointer-events:none';
  document.body.append(act, bubbleEl);
  let near: { kind: 'listen'; station: Station } | { kind: 'drop' } | { kind: 'portal' } | null = null, bubble: { station: Station; until: number } | null = null, clock = 0;
  const said = new Map<string, number>();
  act.addEventListener('pointerdown', e => { e.preventDefault(); press(); });
  function press(): void {
    if (!near || !cw) return;
    if (near.kind === 'drop') { onDrop(); return; }
    if (near.kind === 'portal') { onPortal(); return; }
    const s = near.station, key = `${cw.depth}:${s.keeper}`, lines = KEEPER_LINES[s.keeper], i = said.get(key) ?? 0; said.set(key, i + 1);
    bubbleEl.textContent = lines[i % lines.length].replace('{L}', cw.letter); bubbleEl.hidden = false; bubble = { station: s, until: clock + BUBBLE_S };
  }
  const tmp = new THREE.Vector3();
  function update(t: number, feet: THREE.Vector3, quiet = false): void {
    if (!world || !cw) return; clock = t;
    world.update(t, tmp.set(feet.x - origin.x, feet.y - origin.y, feet.z - origin.z));
    // At the portal's board: the chamber lives on, but nothing is offered.
    if (quiet) { near = null; act.hidden = true; bubble = null; bubbleEl.hidden = true; return; }
    const [fx, fz] = local(feet.x, feet.z); let next: typeof near = null;
    for (const s of cw.stations) { const p = stationSpot(cw, s); if (Math.hypot(fx - p.x, fz - p.z) < LISTEN_M) next = { kind: 'listen', station: s }; }
    const o = stepOut(cw); if (!next && Math.hypot(fx - o.x, fz - o.z) < DROP_M) next = { kind: 'drop' };
    const ps = portalSpot(cw); if (!next && Math.hypot(fx - ps.x, fz - ps.z) < LISTEN_M) next = { kind: 'portal' };
    near = next; act.hidden = !near; if (near) act.textContent = near.kind === 'drop' ? 'into the drop' : near.kind === 'portal' ? 'open the portal' : `listen to ${keeperName(near.station)}`;
    if (bubble && (clock > bubble.until || !near || near.kind !== 'listen' || near.station !== bubble.station)) { bubble = null; bubbleEl.hidden = true; }
    if (bubble) { const k = world.keepers.find(k => k.station === bubble!.station); if (k) { k.group.getWorldPosition(tmp); tmp.y += HEAD_Y[k.kind]; tmp.project(camera); if (tmp.z > 1) bubbleEl.hidden = true; else { bubbleEl.hidden = false; bubbleEl.style.left = `${(tmp.x + 1) * innerWidth / 2}px`; bubbleEl.style.top = `${(1 - tmp.y) * innerHeight / 2 - 10}px`; } } }
  }
  function enter(depth: number, drop: THREE.Vector3, where: 'gangway' | 'portal' = 'gangway'): { at: THREE.Vector3; yaw: number } {
    exit();
    world = buildDescent(scene, Math.max(0, Math.min(LAYERS - 1, depth))); cw = world.catwalk;
    // The chamber's floor is where the drop's centre puts it: the drop hangs DROP centre-height above the walkway.
    origin.set(drop.x, drop.y - world.drop.y, drop.z); world.root.position.copy(origin); world.root.updateMatrixWorld(true);
    // Through the portal she stands before it, turned to the shaft.
    if (where === 'portal') { const ps = portalSpot(cw), a = cw.portal.angle; return { at: new THREE.Vector3(origin.x + ps.x, origin.y, origin.z + ps.z), yaw: Math.atan2(Math.cos(a), Math.sin(a)) }; }
    // She stands on the gangway a few steps out, turned back to the drop she came out of: room behind her for the third-person camera (at the ring's end it was squeezed against the wall into her eyes).
    const a = cw.gangway, r = Math.max(2.4, cw.ringIn - 2);
    return { at: new THREE.Vector3(origin.x + Math.cos(a) * r, origin.y, origin.z + Math.sin(a) * r), yaw: Math.atan2(Math.cos(a), Math.sin(a)) };
  }
  function exit(): void { if (world) { world.dispose(); world = null; } cw = null; near = null; bubble = null; act.hidden = true; bubbleEl.hidden = true; }
  function portalAt(): THREE.Vector3 | null { if (!world || !cw) return null; const a = cw.portal.angle, r = cw.wallR + 0.3; return new THREE.Vector3(origin.x + Math.cos(a) * r, origin.y + 0.75, origin.z + Math.sin(a) * r); }
  return { portalAt, setPortalOpen: (k: number) => world?.setPortalOpen(k), get active() { return !!world; }, get catwalk() { return cw; }, get world() { return world; }, traversal, cameraClear, enter, exit, update, get near() { return near?.kind ?? null; }, act: press };
}
