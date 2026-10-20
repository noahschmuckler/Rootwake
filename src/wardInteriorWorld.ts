// R2's interior drawn and stood in (wardInterior.ts holds its plan and its quest): dressed stone rooms lit by the
// snerk's lantern, the junction box's lamp and, once the crew has it humming, the crystal; the knot of her growth in
// the passage, thinning as it is cut; the mirrors on their posts, turning; the light's beam; the ward's core on its dais.
import * as THREE from 'three';
import { ROOMS, SOLIDS, ENTRY, EXIT, SNERK_AT, CREW_AT, CABINET_FRONT, EMITTER, MIRRORS, MIRROR_FOOT, CORE, BEAM_Y, KNOT_CUTS, INTERIOR_DEPTH, groundIn, occupyIn, clearIn, traceBeam, type Quest, type Room } from './wardInterior';
import { stoneTexture } from './ruinWorld';
import { makeSnerk, makeGreeblin } from './descentWorld';
import type { Ward } from './ruinsModel';
import { mulberry32 } from './colors';

export interface WardInteriorWorld {
  readonly root: THREE.Group;
  /** The interior's origin (the vestibule's floor at its centre), absolute. */
  readonly origin: THREE.Vector3;
  surfacesAt(x: number, z: number): number[];
  canOccupy(p: THREE.Vector3, radius: number, height: number): boolean;
  cameraClear(p: THREE.Vector3): boolean;
  /** Where she arrives inside (absolute) and the yaw she faces; whether she stands at the way out. */
  entry(): { x: number; y: number; z: number; yaw: number };
  atExit(feet: THREE.Vector3): boolean;
  /** Each frame while she's inside (or the crew's work goes on). */
  update(q: Quest, feet: THREE.Vector3, time: number, dt: number): void;
  setVisible(on: boolean): void;
}

export function createWardInterior(parent: THREE.Object3D, w: Ward): WardInteriorWorld {
  const origin = new THREE.Vector3(w.x, w.y0 - INTERIOR_DEPTH, w.z);
  const root = new THREE.Group(); root.name = `ward-interior:${w.id}`; root.position.copy(origin); parent.add(root); root.visible = false;
  const tex = stoneTexture(), rand = mulberry32(911);
  const stone = new THREE.MeshStandardMaterial({ map: tex, color: '#b7b19e', roughness: 0.95, side: THREE.DoubleSide });
  const floorMat = new THREE.MeshStandardMaterial({ map: tex, color: '#8a8676', roughness: 1 });
  const iron = new THREE.MeshStandardMaterial({ color: '#3b3b44', roughness: 0.6, metalness: 0.5 }), brass = new THREE.MeshStandardMaterial({ color: '#a3824a', roughness: 0.45, metalness: 0.6 });
  const grow = new THREE.MeshStandardMaterial({ color: '#160b1c', roughness: 0.35, emissive: '#3a0838', emissiveIntensity: 0.7 });
  const quad = (x0: number, z0: number, x1: number, z1: number, y0: number, y1: number): THREE.BufferGeometry => {
    const len = Math.hypot(x1 - x0, z1 - z0), g = new THREE.PlaneGeometry(len, y1 - y0); const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * len * 0.9, (uv.getY(i) * (y1 - y0) + y0) * 0.9);
    g.rotateY(-Math.atan2(z1 - z0, x1 - x0)); g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); return g;
  };
  // ── the rooms: floors, ceilings, and walls with their openings (a lintel over each, a step face where the floor drops) ──
  const walls: THREE.BufferGeometry[] = [], floors: THREE.BufferGeometry[] = [];
  for (const r of ROOMS) {
    const f = new THREE.PlaneGeometry(r.x1 - r.x0, r.z1 - r.z0); f.rotateX(-Math.PI / 2); const uv = f.attributes.uv as THREE.BufferAttribute; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * (r.x1 - r.x0) * 0.9, uv.getY(i) * (r.z1 - r.z0) * 0.9);
    f.translate((r.x0 + r.x1) / 2, r.floor, (r.z0 + r.z1) / 2); floors.push(f);
    const c = f.clone(); c.translate(0, r.ceiling - r.floor, 0); walls.push(c);
    // Each side as a line: [fixed coordinate, along from, along to, axis].
    const sides: [number, number, number, 'x' | 'z'][] = [[r.z0, r.x0, r.x1, 'z'], [r.z1, r.x0, r.x1, 'z'], [r.x0, r.z0, r.z1, 'x'], [r.x1, r.z0, r.z1, 'x']];
    for (const [k, a0, a1, axis] of sides) {
      const opens: { s0: number; s1: number; o: Room }[] = [];
      for (const o of ROOMS) if (o !== r) {
        const touch = axis === 'z' ? (o.z1 === k || o.z0 === k) && !(o.z0 === r.z0 && o.z1 === r.z1) : (o.x1 === k || o.x0 === k) && !(o.x0 === r.x0 && o.x1 === r.x1);
        const b0 = axis === 'z' ? o.x0 : o.z0, b1 = axis === 'z' ? o.x1 : o.z1, s0 = Math.max(a0, b0), s1 = Math.min(a1, b1);
        if (touch && s1 > s0 + 1e-6) opens.push({ s0, s1, o });
      }
      opens.sort((p, q) => p.s0 - q.s0);
      const seg = (s0: number, s1: number, y0: number, y1: number) => { if (s1 - s0 < 1e-6 || y1 - y0 < 1e-6) return; walls.push(axis === 'z' ? quad(s0, k, s1, k, y0, y1) : quad(k, s0, k, s1, y0, y1)); };
      let at = a0;
      for (const { s0, s1, o } of opens) { seg(at, s0, r.floor, r.ceiling); seg(s0, s1, Math.min(r.ceiling, o.ceiling), r.ceiling); if (o.floor > r.floor) seg(s0, s1, r.floor, o.floor); at = s1; }
      seg(at, a1, r.floor, r.ceiling);
    }
  }
  const merge = (gs: THREE.BufferGeometry[]): THREE.BufferGeometry => { const ng = gs.map(g => (g.index ? g.toNonIndexed() : g)), out = new THREE.BufferGeometry(); for (const k of ['position', 'normal', 'uv']) { const size = ng[0].attributes[k].itemSize, arr = new Float32Array(ng.reduce((n, g) => n + g.attributes[k].count, 0) * size); let o = 0; for (const g of ng) { arr.set(g.attributes[k].array as Float32Array, o); o += g.attributes[k].count * size; } out.setAttribute(k, new THREE.BufferAttribute(arr, size)); } return out; };
  root.add(new THREE.Mesh(merge(walls), stone), new THREE.Mesh(merge(floors), floorMat));
  // ── the solids ──
  let knot: THREE.Group | null = null;
  for (const s of SOLIDS) {
    const floor = ROOMS.find(r => (s.x0 + s.x1) / 2 > r.x0 && (s.x0 + s.x1) / 2 < r.x1 && (s.z0 + s.z1) / 2 > r.z0 && (s.z0 + s.z1) / 2 < r.z1)!.floor;
    if (s.kind === 'knot') {
      knot = new THREE.Group(); root.add(knot);
      for (let i = 0; i < 16; i++) { const pts: THREE.Vector3[] = []; const x0 = s.x0 + rand() * (s.x1 - s.x0); for (let k = 0; k < 6; k++) pts.push(new THREE.Vector3(Math.max(s.x0 - 0.1, Math.min(s.x1 + 0.1, x0 + Math.sin(k * 1.7 + i) * 0.5)), floor + 0.05 + (k / 5) * (s.top - floor - 0.1) * (0.5 + rand() * 0.5), s.z0 + rand() * (s.z1 - s.z0))); const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 16, 0.06 + rand() * 0.1, 7, false), grow); t.userData.k = i; knot.add(t); }
      continue;
    }
    const g = new THREE.BoxGeometry(s.x1 - s.x0, s.top - floor, s.z1 - s.z0); g.translate((s.x0 + s.x1) / 2, (floor + s.top) / 2, (s.z0 + s.z1) / 2);
    root.add(new THREE.Mesh(g, s.kind === 'cabinet' ? iron : stone));
  }
  // The junction box's face: brass dials and its lamp, red while dead, flaring at each try, green once it hums.
  const cab = SOLIDS.find(s => s.kind === 'cabinet')!, lampMat = new THREE.MeshBasicMaterial({ color: '#ff3020' });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), lampMat); lamp.position.set(cab.x1 + 0.03, ROOMS[1].floor + 1.4, (cab.z0 + cab.z1) / 2); root.add(lamp);
  for (let i = 0; i < 3; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 12), brass); d.rotation.z = Math.PI / 2; d.position.set(cab.x1 + 0.02, ROOMS[1].floor + 0.9, cab.z0 + 0.35 + i * 0.35); root.add(d); }
  const boxLight = new THREE.PointLight('#ff6040', 5, 7, 1.6); boxLight.position.set(cab.x1 + 0.6, ROOMS[1].floor + 1.6, (cab.z0 + cab.z1) / 2); root.add(boxLight);
  // The way out: the door's light in the vestibule's end wall.
  const out = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), new THREE.MeshBasicMaterial({ color: '#e9f2e2' })); out.position.set(EXIT.x, 0.6, EXIT.z - 0.01); out.rotation.y = Math.PI; root.add(out);
  // ── the figures ──
  const snerk = makeSnerk(); snerk.group.position.set(SNERK_AT.x, 0, SNERK_AT.z); snerk.group.rotation.y = SNERK_AT.yaw; root.add(snerk.group);
  const lantern = new THREE.PointLight('#ffc070', 8, 9, 1.4); lantern.position.set(SNERK_AT.x, 1.1, SNERK_AT.z); root.add(lantern);
  const crew = CREW_AT.map(p => { const m = makeGreeblin(); m.group.position.set(p.x, ROOMS[1].floor, p.z); root.add(m.group); return { ...m, home: p }; });
  // ── the light ──
  const chamberFloor = ROOMS.find(r => r.id === 'chamber')!.floor, beamY = chamberFloor + BEAM_Y;
  const crystalMat = new THREE.MeshStandardMaterial({ color: '#7fd6ff', emissive: '#7fd6ff', emissiveIntensity: 0.08, roughness: 0.2, transparent: true, opacity: 0.9 });
  const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), crystalMat); crystal.scale.y = 1.6; crystal.position.set(EMITTER.x + 0.1, beamY, EMITTER.z); root.add(crystal);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.32, beamY - chamberFloor - 0.45, 8), stone); plinth.position.set(EMITTER.x + 0.1, chamberFloor + (beamY - chamberFloor - 0.45) / 2, EMITTER.z); root.add(plinth);
  const crystalLight = new THREE.PointLight('#8fe0ff', 0, 14, 1.3); crystalLight.position.set(EMITTER.x + 0.6, beamY, EMITTER.z); root.add(crystalLight);
  const mirrorMat = new THREE.MeshStandardMaterial({ color: '#dfe8f0', roughness: 0.08, metalness: 0.95, emissive: '#3a5a6a', emissiveIntensity: 0.4, side: THREE.DoubleSide });
  const mirrors = MIRRORS.map((m, i) => {
    const foot = MIRROR_FOOT[i], post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, beamY - foot - 0.25, 6), brass); post.position.set(m.x, foot + (beamY - foot - 0.25) / 2, m.z); root.add(post);
    const head = new THREE.Group(); head.position.set(m.x, beamY, m.z); root.add(head);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.42), mirrorMat); head.add(glass);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.025, 6, 20), brass); ring.scale.y = 0.7; head.add(ring);
    return { head, turn: 0 };
  });
  const beamMat = new THREE.MeshBasicMaterial({ color: '#bff4ff', transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
  const beam = new THREE.Group(); root.add(beam);
  const daisTop = SOLIDS.find(s => s.id === 'dais')!.top, coreMat = new THREE.MeshStandardMaterial({ color: '#d8f4ff', emissive: '#9fe8ff', emissiveIntensity: 0.05, roughness: 0.3 });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28, 1), coreMat); core.position.set(CORE.x, beamY, CORE.z); root.add(core);
  const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, beamY - daisTop + 0.4, 8, 1, true), new THREE.MeshStandardMaterial({ color: '#a3824a', wireframe: true })); cage.position.set(CORE.x, daisTop + (beamY - daisTop + 0.4) / 2, CORE.z); root.add(cage);
  const coreLight = new THREE.PointLight('#e8fbff', 0, 16, 1.2); coreLight.position.set(CORE.x, beamY + 0.4, CORE.z); root.add(coreLight);
  // A cool fill in each room, as the descent's chambers have, so the stone reads before the crystal wakes.
  for (const [x, y, z, i] of [[0, 2.4, 0.5, 5], [0, 2.7, -7.5, 7], [0, 3.9, -20, 9]]) { const l = new THREE.PointLight('#a8b4d8', i, 16, 1.4); l.position.set(x, y, z); root.add(l); }

  let beamKey = '';
  function drawBeam(q: Quest): void {
    const lit = q.stage === 'powered' || q.stage === 'woken', key = lit ? q.mirrors.join() : '';
    if (key === beamKey) return; beamKey = key; beam.clear(); if (!lit) return;
    const pts = traceBeam(q.mirrors).points;
    for (let i = 0; i + 1 < pts.length; i++) { const a = pts[i], b = pts[i + 1], len = Math.hypot(b.x - a.x, b.z - a.z); if (len < 1e-3) continue; const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, len), beamMat); m.position.set((a.x + b.x) / 2, beamY, (a.z + b.z) / 2); m.rotation.y = Math.atan2(b.x - a.x, b.z - a.z); beam.add(m); }
  }
  const rel = new THREE.Vector3();
  const relOf = (p: THREE.Vector3) => rel.set(p.x - origin.x, p.y - origin.y, p.z - origin.z);
  let lastQ: Quest | null = null;
  function update(q: Quest, feet: THREE.Vector3, time: number, dt: number): void {
    lastQ = q; const t = time / 1000, f = relOf(feet).clone();
    // The knot thins with each cut, and is gone once cut through.
    if (knot) { const left = q.stage === 'open' || q.stage === 'sealed' ? 1 - q.knot / KNOT_CUTS : 0; knot.visible = left > 0; knot.children.forEach((c, i) => { c.visible = i / knot!.children.length < 0.25 + left * 0.75; c.scale.setScalar(1 + 0.03 * Math.sin(t * 1.4 + i)); }); }
    // The box's lamp: red while dead, a flare at each try, green once it hums.
    const humming = q.stage === 'powered' || q.stage === 'woken', trying = q.stage === 'fixing';
    lampMat.color.set(humming ? '#40ff70' : trying && Math.sin(t * 23) > 0.2 ? '#ffd040' : '#ff3020'); boxLight.color.set(humming ? '#60ff90' : '#ff6040'); boxLight.intensity = trying ? 2 + Math.random() * 8 : 5;
    crystalMat.emissiveIntensity = humming ? 1.6 + 0.3 * Math.sin(t * 4) : 0.08; crystalLight.intensity = humming ? 14 : 0;
    coreMat.emissiveIntensity = q.stage === 'woken' ? 2.2 + 0.4 * Math.sin(t * 2.2) : 0.05; coreLight.intensity = q.stage === 'woken' ? 18 : 0;
    core.rotation.y += dt * (q.stage === 'woken' ? 1.2 : 0.1);
    mirrors.forEach((m, i) => { const want = -(q.mirrors[i] * Math.PI) / 4; let d = want - m.turn; d = Math.atan2(Math.sin(d), Math.cos(d)); m.turn += d * Math.min(1, dt * 8); m.head.rotation.y = m.turn; });
    drawBeam(q);
    // The snerk turns its head to her; the crew bob, go to the box to fix it, and dance when it hums.
    snerk.head.rotation.y = Math.atan2(f.x - SNERK_AT.x, f.z - SNERK_AT.z) - SNERK_AT.yaw;
    crew.forEach((c, i) => {
      const fixing = q.stage === 'fixing', target = fixing ? { x: CABINET_FRONT.x + (i - 1) * 0.45, z: CABINET_FRONT.z + Math.abs(i - 1) * 0.3 } : c.home;
      const g = c.group, dx = target.x - g.position.x, dz = target.z - g.position.z, d = Math.hypot(dx, dz);
      if (d > 0.05) { const s = Math.min(d, dt * 1.6); g.position.x += (dx / d) * s; g.position.z += (dz / d) * s; g.rotation.y = Math.atan2(dx, dz); }
      else g.rotation.y = fixing ? Math.atan2(cab.x1 - g.position.x, (cab.z0 + cab.z1) / 2 - g.position.z) : Math.atan2(f.x - g.position.x, f.z - g.position.z);
      g.position.y = ROOMS[1].floor + Math.abs(Math.sin(t * (q.stage === 'woken' ? 7 : 3) + i * 1.3)) * (q.stage === 'woken' ? 0.12 : 0.015);
    });
  }
  const surfacesAt = (x: number, z: number): number[] => { if (!lastQ) return []; const y = groundIn(lastQ, x - origin.x, z - origin.z); return y === null ? [] : [y + origin.y]; };
  const canOccupy = (p: THREE.Vector3, radius: number, height: number): boolean => !!lastQ && occupyIn(lastQ, relOf(p), radius, height);
  const cameraClear = (p: THREE.Vector3): boolean => !!lastQ && clearIn(lastQ, relOf(p));
  return {
    root, origin, surfacesAt, canOccupy, cameraClear, update,
    entry: () => ({ x: origin.x + ENTRY.x, y: origin.y, z: origin.z + ENTRY.z, yaw: ENTRY.yaw }),
    atExit: feet => { const r = relOf(feet); return Math.hypot(r.x - EXIT.x, r.z - EXIT.z) < 0.6 && Math.abs(r.y) < 0.3; },
    setVisible: on => { root.visible = on; },
  };
}
