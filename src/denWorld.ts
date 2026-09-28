// The dens as places she walks into (Noah, 2026-09-27): each den's layout (denModel) is built as dirt
// tubes and hollows seen from inside, with a packed floor to stand on, roots hanging from the roofs,
// bones in the deepest chamber and a dim light in each; built when she comes within DEN_BUILD_M and let
// go beyond DEN_DROP_M, so nothing loads. The field is also her ground there: the traversal world asks it
// for the den's floor under (x, z) beside the land's surface, and refuses the land's surface where the
// hall's roof breaks it (the mouth), so a step down the hall is a step, and the earth over a deeper hall
// stays walkable. The camera may not leave the hollow while she is in it.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { denLayout, floorAt, floorsAt, insideDen, hallLines, FLOOR_DROP, FLOOR_WIDTH, CHAMBER_FLOOR, type DenLayout } from './denModel';
import { mulberry32 } from './colors';
import { makeWolf, setDireLook, type WolfBody } from './wolfFigure';
import type { Terrain } from './worldTerrain';
/** Built within DEN_BUILD_M, dropped beyond DEN_DROP_M; the land's surface is offered over a hall only where it lies DEN_ROOF_CUT above the roof (else the mouth is cut through it). The pack asleep (Noah): its wolves lie in the deepest chamber, SLEEP_RING of its radius out from the centre; a sleeping wolf has SLEEP_HP and is struck within SLEEP_REACH ahead of her. Tuning. */
export const DEN_BUILD_M = 140, DEN_DROP_M = 260, DEN_ROOF_CUT = 0.8, SLEEP_RING = 0.5, SLEEP_HP = 18, SLEEP_REACH = 2.4;
export function createDenField(scene: THREE.Scene, terrain: Terrain, dens: { id: string; x: number; z: number; tier?: number }[], seed: number) {
  const layouts = dens.map(d => denLayout(d, seed, terrain.height)), byId = new Map(layouts.map(l => [l.id, l]));
  const dirt = new THREE.MeshStandardMaterial({ color: '#4a3622', roughness: 1, flatShading: true, side: THREE.BackSide }), floorMat = new THREE.MeshStandardMaterial({ color: '#4a3826', roughness: 1, side: THREE.DoubleSide }), rootMat = new THREE.MeshStandardMaterial({ color: '#5a4a34', roughness: 1 }), boneMat = new THREE.MeshStandardMaterial({ color: '#d9d2bf', roughness: 0.9 });
  const built = new Map<string, { group: THREE.Group; geometries: THREE.BufferGeometry[]; pack: { body: WolfBody; hp: number; hurt: number; x: number; z: number; y: number }[] }>();
  const jitter = (g: THREE.BufferGeometry, rand: () => number, k: number): THREE.BufferGeometry => { const p = g.attributes.position as THREE.BufferAttribute; for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + (rand() - 0.5) * k, p.getY(i) + (rand() - 0.5) * k, p.getZ(i) + (rand() - 0.5) * k); g.computeVertexNormals(); return g; };
  function build(d: DenLayout): void {
    if (built.has(d.id)) return; const group = new THREE.Group(); group.name = `den:${d.id}`; const geometries: THREE.BufferGeometry[] = [], rand = mulberry32((d.x * 7 + d.z * 13 + seed) >>> 0), roots: THREE.BufferGeometry[] = [], bones: THREE.BufferGeometry[] = [];
    for (const line of hallLines(d)) {
      const r = d.halls.find(h => h.a === line[0])!.r, pts = line.map(p => new THREE.Vector3(p.x, p.y, p.z)); pts.unshift(pts[0].clone().add(new THREE.Vector3(pts[0].x - pts[1].x, 0, pts[0].z - pts[1].z).normalize().multiplyScalar(1.2)));
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5), segs = Math.max(8, Math.ceil(curve.getLength() / 1.2)), tube = jitter(new THREE.TubeGeometry(curve, segs, r, 10, false).toNonIndexed(), rand, 0.14); geometries.push(tube); group.add(new THREE.Mesh(tube, dirt));
      // The packed floor: a ribbon FLOOR_WIDTH of the radius wide at the chord's height.
      const n = segs * 2, pos: number[] = [], idx: number[] = []; for (let i = 0; i <= n; i++) { const t = i / n, c = curve.getPointAt(t), tg = curve.getTangentAt(t), nx = -tg.z, nz = tg.x, l = Math.hypot(nx, nz) || 1, w = r * FLOOR_WIDTH * 1.08, y = c.y - r * FLOOR_DROP + 0.02; pos.push(c.x + nx / l * w, y, c.z + nz / l * w, c.x - nx / l * w, y, c.z - nz / l * w); if (i < n) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); } }
      const floor = new THREE.BufferGeometry(); floor.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); floor.setIndex(idx); floor.computeVertexNormals(); geometries.push(floor); group.add(new THREE.Mesh(floor, floorMat));
      // Roots hang by the walls, short, out of her way down the middle (they never collide; Noah read them as the block when the chamber's floor was the block).
      for (let i = 0; i < segs / 2; i++) { const t = rand(), c = curve.getPointAt(t), tg = curve.getTangentAt(t), side = (rand() < 0.5 ? -1 : 1) * (0.55 + rand() * 0.3) * r, len = 0.15 + rand() * 0.35, g = new THREE.CylinderGeometry(0.02, 0.04, len, 4); g.translate(c.x - tg.z * side, c.y + r * 0.7 - len / 2, c.z + tg.x * side); roots.push(g); }
    }
    for (const c of d.chambers) {
      const hollow = jitter(new THREE.SphereGeometry(c.r, 18, 12).toNonIndexed(), rand, 0.22); hollow.scale(1, c.h * 0.6 / c.r, 1); hollow.translate(c.c.x, c.c.y, c.c.z); geometries.push(hollow); group.add(new THREE.Mesh(hollow, dirt));
      const fy = c.c.y - c.h * CHAMBER_FLOOR + 0.02, floor = new THREE.CircleGeometry(c.r * 0.95, 24); floor.rotateX(-Math.PI / 2); floor.translate(c.c.x, fy, c.c.z); geometries.push(floor); group.add(new THREE.Mesh(floor, floorMat));
      for (let i = 0; i < 9; i++) { const a = rand() * Math.PI * 2, rr = (0.55 + rand() * 0.35) * c.r, len = 0.25 + rand() * 0.5, g = new THREE.CylinderGeometry(0.02, 0.05, len, 4); g.translate(c.c.x + Math.cos(a) * rr, c.c.y + c.h * 0.5 - len / 2, c.c.z + Math.sin(a) * rr); roots.push(g); }
      const light = new THREE.PointLight(c.deepest ? '#d08050' : '#c8a070', c.deepest ? 1.5 : 1.3, c.r * 3.2, 1.5); light.position.set(c.c.x, c.c.y + c.h * 0.05, c.c.z); group.add(light);
      if (c.deepest) for (let i = 0; i < 12; i++) { const a = rand() * Math.PI * 2, rr = 0.4 + rand() * c.r * 0.6, g = new THREE.CylinderGeometry(0.03, 0.045, 0.35 + rand() * 0.4, 4); g.rotateZ(Math.PI / 2); g.rotateY(rand() * Math.PI); g.translate(c.c.x + Math.cos(a) * rr, fy + 0.04, c.c.z + Math.sin(a) * rr); bones.push(g); }
    }
    if (roots.length) { const g = mergeGeometries(roots)!; geometries.push(g); group.add(new THREE.Mesh(g, rootMat)); }
    if (bones.length) { const g = mergeGeometries(bones)!; geometries.push(g); group.add(new THREE.Mesh(g, boneMat)); }
    scene.add(group); built.set(d.id, { group, geometries, pack: [] });
  }
  function drop(id: string): void { const b = built.get(id); if (!b) return; scene.remove(b.group); for (const g of b.geometries) g.dispose(); built.delete(id); }
  /** The pack asleep: `n` wolves lying in the deepest chamber, made or taken away as the count changes; they breathe. */
  /** S4c: the dire den's pack sleeps black and red-eyed. */
  let direId: string | null = null;
  function setPack(id: string, n: number, time: number): void {
    const b = built.get(id), d = byId.get(id); if (!b || !d) return; const c = d.chambers.find(ch => ch.deepest)!, fy = c.c.y - c.h * CHAMBER_FLOOR + 0.02;
    while (b.pack.length > n) { const w = b.pack.pop()!; b.group.remove(w.body.group); }
    while (b.pack.length < n) { const i = b.pack.length, a = i * 2.4 + 0.7, r = c.r * SLEEP_RING * (0.6 + 0.4 * ((i * 7) % 3) / 2), x = c.c.x + Math.cos(a) * r, z = c.c.z + Math.sin(a) * r, body = makeWolf(); setDireLook(body, id === direId); body.group.position.set(x, fy, z); body.group.rotation.y = a + 1.2; body.group.rotation.z = 1.35; b.group.add(body.group); b.pack.push({ body, hp: SLEEP_HP, hurt: 0, x, z, y: fy }); }
    for (const [i, w] of b.pack.entries()) { w.body.group.scale.set(1, 1 + 0.035 * Math.sin(time * 0.0016 + i * 1.9), 1); w.hurt = Math.max(0, w.hurt - 0.016); w.body.hide.emissive.set(w.hurt > 0 ? '#b03030' : '#000000'); }
  }
  /** Her strike in the den: the nearest sleeping wolf within SLEEP_REACH ahead of her takes `dmg`; returns what it hit and whether it died (the caller tells the model). */
  function strikeAsleep(feet: THREE.Vector3, fx: number, fz: number, dmg: number): { hit: boolean; killed: boolean } {
    const d = current; if (!d) return { hit: false, killed: false }; const b = built.get(d.id); if (!b) return { hit: false, killed: false };
    let best = -1, bd = Infinity; for (const [i, w] of b.pack.entries()) { const dx = w.x - feet.x, dz = w.z - feet.z, dist = Math.hypot(dx, dz); if (dist <= SLEEP_REACH && (dist < 0.6 || (dx * fx + dz * fz) / dist > 0.5) && dist < bd) { best = i; bd = dist; } }
    if (best < 0) return { hit: false, killed: false }; const w = b.pack[best]; w.hp -= dmg; w.hurt = 0.3;
    if (w.hp > 0) return { hit: true, killed: false }; b.group.remove(w.body.group); b.pack.splice(best, 1); return { hit: true, killed: true };
  }
  /** The sleeping wolves' places (dev). */
  const packAt = (id: string): { x: number; y: number; z: number }[] => (built.get(id)?.pack ?? []).map(w => ({ x: w.x, y: w.y, z: w.z }));
  const lantern = new THREE.PointLight('#ffd9a0', 0, 11, 1.5); scene.add(lantern);
  let inside = false, current: DenLayout | null = null;
  /** The den whose layout could lie under (x, z), if any. */
  const near = (x: number, z: number): DenLayout | null => { for (const d of layouts) if (Math.hypot(x - d.x, z - d.z) <= d.reach) return d; return null; };
  /** The tops at (x, z) as the den sees them: the den's floor where a hall or chamber lies under, with the land's surface only where the roof lies DEN_ROOF_CUT beneath it; null where no den lies. */
  function surfacesAt(x: number, z: number): number[] | null { const d = near(x, z); if (!d) return null; const fs = floorsAt(d, x, z); if (!fs.length) return null; const t = terrain.height(x, z), floors = fs.map(f => f.floor); return t - fs[0].roof > DEN_ROOF_CUT ? [t, ...floors] : floors; }
  /** Whether a body may stand at p as the den sees it: on the den's floor under its roof; null where the land decides (no den, or on the surface over a deep hall); false in the earth. */
  function canOccupy(p: THREE.Vector3, _radius: number, height: number): boolean | null {
    const d = near(p.x, p.z); if (!d) return null; const t = terrain.height(p.x, p.z), fs = floorsAt(d, p.x, p.z);
    if (!fs.length) return p.y >= t - 0.3 ? null : false;
    if (p.y >= t - 0.03 && t - fs[0].roof > DEN_ROOF_CUT) return null;
    return fs.some(f => p.y >= f.floor - 0.03 && p.y + height <= f.roof + 0.35);
  }
  /** The camera's clearance: while she is in a den the camera stays in its hollow; on the land it stays out of the earth. */
  function cameraClear(p: THREE.Vector3): boolean { const t = terrain.height(p.x, p.z); if (p.y >= t - 0.3) return !inside; const d = near(p.x, p.z); return !!d && insideDen(d, p.x, p.y, p.z); }
  function update(feet: THREE.Vector3, time: number, asleep: (id: string) => number): void {
    for (const d of layouts) { const dist = Math.hypot(feet.x - d.x, feet.z - d.z); if (dist <= DEN_BUILD_M) { build(d); setPack(d.id, asleep(d.id), time); } else if (dist > DEN_DROP_M) drop(d.id); }
    current = near(feet.x, feet.z); inside = !!current && feet.y < terrain.height(feet.x, feet.z) - 0.6 && !!floorAt(current, feet.x, feet.z);
    lantern.position.set(feet.x, feet.y + 1.3, feet.z); lantern.intensity = inside ? 2.2 + 0.2 * Math.sin(time * 0.011) : 0;
  }
  /** S4c: which den is dire (null: none); a built pack takes the look at once. */
  function setDire(id: string | null): void { if (id === direId) return; direId = id; for (const [k, b] of built) for (const w of b.pack) setDireLook(w.body, k === id); }
  return { setDire, layouts, layout: (id: string) => byId.get(id) ?? null, surfacesAt, canOccupy, cameraClear, update, strikeAsleep, packAt, get inside() { return inside; }, get current() { return current; }, get builtCount() { return built.size; } };
}
export type DenField = ReturnType<typeof createDenField>;
