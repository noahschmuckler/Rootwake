// The Descent, D0 (DESCENT.md): a catwalk of the placid layers as a scene. A round chamber in the karst's
// magitech: plated walls ribbed with brass, pipes crusted white with limescale, a band of techno-runes lit
// in the layer's colour, alcoves with blue crystal sconces, the layer's letter as a sigil over the
// archive. The beam rises through the shaft at its centre; the crystal drop hangs in it with a gangway to
// the ring; below, the shaft falls to the next layer's glow. Its keepers stand at their stations: a snerk
// at the archive, a hollowed at a power node, a greeblin at a machine. Cel-shaded like Hulda (toon ramp),
// the glow left to bloom. Built from `catwalk(depth)` (descentModel.ts); rebuilt per depth.
import * as THREE from 'three';
import { catwalk, ALCOVE_D, ALCOVE_H, ALCOVE_W, DROP_VIS_R, GANGWAY_HALF, SPOKE_HALF, INNER_W, BANDS, type Catwalk, type Station } from './descentModel';
import { toonRamp } from './huldaDress';
import { mulberry32 } from './colors';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const ramp = toonRamp();
const toon = (color: string, emissive = '#000000', ei = 0): THREE.MeshToonMaterial => new THREE.MeshToonMaterial({ color, emissive, emissiveIntensity: ei, gradientMap: ramp });
/** The palette (after the cutaway): grey-blue stone plates, brass and iron, limescale cream, upper-layer blue crystal. Tuning. */
export const DESCENT_PALETTE = { stone: '#4c4d5a', plate: '#5c5b6a', seam: '#2a2a33', brass: '#a3824a', iron: '#3b3b44', lime: '#e6dfc4', crystal: '#7fd6ff', floor: '#4a4a56', rock: '#2a2830', lamp: '#ffc070' };

/** SGA-like glyphs (DiggyDwarves: the Standard Galactic Alphabet homage) drawn into a strip: lines, dots and hooks per cell. */
function glyphStrip(cells: number, seed: number, w = 64, h = 64): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = w * cells; c.height = h; const g = c.getContext('2d')!, r = mulberry32(seed);
  g.strokeStyle = 'white'; g.fillStyle = 'white'; g.lineWidth = 5; g.lineCap = 'round';
  for (let i = 0; i < cells; i++) {
    const x0 = i * w + 12, y0 = 12, s = w - 24, strokes = 2 + Math.floor(r() * 3);
    for (let k = 0; k < strokes; k++) { const t = r(); g.beginPath(); if (t < 0.4) { const v = r() < 0.5; const p = Math.floor(r() * 3) / 2; if (v) { g.moveTo(x0 + p * s, y0); g.lineTo(x0 + p * s, y0 + s); } else { g.moveTo(x0, y0 + p * s); g.lineTo(x0 + s, y0 + p * s); } g.stroke(); } else if (t < 0.65) { g.arc(x0 + Math.floor(r() * 3) / 2 * s, y0 + Math.floor(r() * 3) / 2 * s, 4, 0, Math.PI * 2); g.fill(); } else if (t < 0.85) { g.moveTo(x0, y0 + s); g.lineTo(x0 + s / 2, y0); g.lineTo(x0 + s, y0 + s); g.stroke(); } else { g.arc(x0 + s / 2, y0 + s / 2, s / 2.4, r() * 3, r() * 3 + 3); g.stroke(); } }
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
/** The layer's letter as a large sigil (a ring of strokes round the glyph). */
function letterSigil(letter: string): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d')!;
  g.strokeStyle = 'white'; g.lineWidth = 6; g.beginPath(); g.arc(128, 128, 110, 0, Math.PI * 2); g.stroke(); g.lineWidth = 3; g.beginPath(); g.arc(128, 128, 96, 0, Math.PI * 2); g.stroke();
  for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; g.beginPath(); g.moveTo(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); g.lineTo(128 + Math.cos(a) * (i % 3 ? 102 : 110), 128 + Math.sin(a) * (i % 3 ? 102 : 110)); g.stroke(); }
  g.fillStyle = 'white'; g.font = 'bold 120px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(letter, 128, 136);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export interface Keeper { group: THREE.Group; kind: Station['keeper']; station: Station; update(t: number, herX: number, herZ: number): void }
/** A snerk: hunched in a purple hooded cloak, a long pink beak of a nose in a green face, a huge pack with a lantern. About her height bent over. */
function makeSnerk(): { group: THREE.Group; head: THREE.Group; lantern: THREE.Object3D } {
  const g = new THREE.Group(), cloak = toon('#5b3c7c'), face = toon('#6f8f4c'), nose = toon('#d98e9c'), pack = toon('#5e4630'), strap = toon('#4a3422');
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.62, 9), cloak); body.position.y = 0.31; g.add(body);
  const head = new THREE.Group(); head.position.set(0, 0.6, 0.1); g.add(head);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), cloak); hood.rotation.x = 0.5; head.add(hood);
  const f = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), face); f.position.set(0, -0.02, 0.07); head.add(f);
  const n = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.26, 7), nose); n.rotation.x = Math.PI / 2 + 0.35; n.position.set(0, -0.06, 0.24); head.add(n);
  for (const sx of [-0.045, 0.045]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5), new THREE.MeshBasicMaterial({ color: '#fff3a0' })); e.position.set(sx, 0.01, 0.16); head.add(e); }
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.3), pack); bag.position.set(0, 0.6, -0.24); bag.rotation.x = -0.25; g.add(bag);
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.48, 8), toon('#8a7a5a')); roll.rotation.z = Math.PI / 2; roll.position.set(0, 0.9, -0.3); g.add(roll);
  for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.12 + i * 0.02, 0.1, 0.1), i % 2 ? strap : toon('#9a8a6a')); b.position.set(-0.12 + i * 0.08, 0.98 + (i % 2) * 0.06, -0.28); b.rotation.y = i; g.add(b); }
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.5, 4), strap); rod.position.set(0.2, 1.0, -0.2); rod.rotation.z = -0.6; g.add(rod);
  const lantern = new THREE.Group(); lantern.position.set(0.36, 1.12, -0.2); g.add(lantern);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(DESCENT_PALETTE.lamp).multiplyScalar(2.5) })); glass.position.y = -0.1; lantern.add(glass);
  for (const sx of [-0.18, 0.18]) { const hnd = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), face); hnd.position.set(sx, 0.36, 0.18); g.add(hnd); }
  return { group: g, head, lantern };
}
/** A hollowed: tall, gaunt, hooded and robed, a beaked bone mask, eyes like coals, grey clawed hands. */
function makeHollowed(): { group: THREE.Group; head: THREE.Group } {
  const g = new THREE.Group(), robe = toon('#2b2433'), bone = toon('#d9d0bc'), skin = toon('#7a7a80');
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 1.0, 9), robe); body.position.y = 0.5; g.add(body);
  const head = new THREE.Group(); head.position.set(0, 1.08, 0.03); g.add(head);
  const hood = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.42, 9), robe); hood.position.y = 0.08; head.add(hood);
  const mask = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.3, 6), bone); mask.rotation.x = Math.PI / 2 + 0.25; mask.position.set(0, -0.04, 0.2); head.add(mask);
  for (const sx of [-0.05, 0.05]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 5), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a30').multiplyScalar(2.5) })); e.position.set(sx, 0.0, 0.12); head.add(e); }
  for (const sx of [-0.16, 0.16]) { const h = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.14, 5), skin); h.position.set(sx, 0.62, 0.14); h.rotation.x = Math.PI; g.add(h); }
  return { group: g, head };
}
/** A greeblin: small, green, big ears and tusks, a mohawk, a wrench. */
function makeGreeblin(): { group: THREE.Group; head: THREE.Group } {
  const g = new THREE.Group(), skin = toon('#5f9a3c'), hide = toon('#7a5a3a'), tusk = toon('#efe6cf'), iron = toon(DESCENT_PALETTE.iron);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.17, 9, 7), skin); body.scale.set(1, 1.2, 0.9); body.position.y = 0.3; g.add(body);
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.12, 9), hide); cloth.position.y = 0.16; g.add(cloth);
  for (const sx of [-0.07, 0.07]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.035, 0.16, 5), skin); leg.position.set(sx, 0.08, 0); g.add(leg); }
  const head = new THREE.Group(); head.position.set(0, 0.56, 0.02); g.add(head);
  head.add(new THREE.Mesh(new THREE.SphereGeometry(0.13, 9, 7), skin));
  for (const sx of [-1, 1]) { const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.24, 5), skin); ear.rotation.z = sx * -1.3; ear.position.set(sx * 0.17, 0.03, 0); head.add(ear); const t = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.05, 4), tusk); t.position.set(sx * 0.04, -0.07, 0.11); head.add(t); const e = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 5), new THREE.MeshBasicMaterial({ color: '#ffe060' })); e.position.set(sx * 0.045, 0.02, 0.115); head.add(e); }
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 5), skin); nose.rotation.x = Math.PI / 2; nose.position.set(0, -0.01, 0.15); head.add(nose);
  const hawk = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.2), toon('#2a2a2a')); hawk.position.set(0, 0.14, -0.01); head.add(hawk);
  const wrench = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.32, 0.03), iron); wrench.position.set(0.2, 0.32, 0.08); wrench.rotation.z = -0.4; g.add(wrench);
  return { group: g, head };
}

export interface DescentWorld {
  readonly root: THREE.Group; readonly catwalk: Catwalk; readonly keepers: Keeper[];
  /** The drop's centre and radius (to step back into). */ readonly drop: THREE.Vector3;
  update(t: number, her: THREE.Vector3): void;
  dispose(): void;
}
/** Build catwalk `depth` into `scene` (the beam, the drop, the chamber, its keepers and stations, its lights). */
export function buildDescent(scene: THREE.Scene, depth: number): DescentWorld {
  const c = catwalk(depth), P = DESCENT_PALETTE, root = new THREE.Group(); root.name = 'descent'; scene.add(root);
  const band = new THREE.Color(c.band), rnd = mulberry32(77 + depth);
  const disposables: { dispose(): void }[] = [];
  const keep = <T extends { dispose(): void }>(x: T): T => { disposables.push(x); return x; };
  const m = { stone: keep(toon(P.stone)), plate: keep(toon(P.plate)), seam: keep(toon(P.seam)), brass: keep(toon(P.brass)), iron: keep(toon(P.iron)), lime: keep(toon(P.lime)), floor: keep(toon(P.floor)), rock: keep(toon(P.rock)),
    crystal: keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(P.crystal).multiplyScalar(1.8) })), trim: keep(new THREE.MeshBasicMaterial({ color: band.clone().lerp(new THREE.Color('#ffffff'), 0.25).multiplyScalar(0.9) })) };
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, parent: THREE.Object3D = root): THREE.Mesh => { keep(geo); const mesh = new THREE.Mesh(geo, mat); parent.add(mesh); return mesh; };
  const H = c.height, R = c.wallR;
  // ── the walkway: the ring, its rim and trim, the gangway, the spokes and the inner ring ──
  const ringGeo = new THREE.RingGeometry(c.ringIn, R + 0.02, 96, 1); ringGeo.rotateX(-Math.PI / 2); add(ringGeo, m.floor);
  const lip = new THREE.CylinderGeometry(c.ringIn, c.ringIn, 0.22, 96, 1, true); lip.translate(0, -0.11, 0); add(lip, m.iron).material = m.iron;
  const trimGeo = new THREE.TorusGeometry(c.ringIn + 0.08, 0.025, 4, 96); trimGeo.rotateX(Math.PI / 2); trimGeo.translate(0, 0.012, 0); add(trimGeo, m.trim);
  // Radial plates across the walkway (grating seams).
  { const seams = Math.round(R * 6); const geo = new THREE.BoxGeometry(RING_SEAM_W, 0.01, R - c.ringIn); geo.translate(0, 0.006, (R + c.ringIn) / 2); const inst = new THREE.InstancedMesh(keep(geo), m.seam, seams); const mat4 = new THREE.Matrix4(); for (let i = 0; i < seams; i++) { mat4.makeRotationY(i / seams * Math.PI * 2); inst.setMatrixAt(i, mat4); } root.add(inst); }
  const beamWalk = (a: number, from: number, to: number, half: number): void => {
    const len = to - from, g = new THREE.BoxGeometry(len, 0.14, half * 2); g.translate(from + len / 2, -0.07, 0); g.rotateY(-a); add(g, m.floor);
    for (const side of [-1, 1]) { const rail = new THREE.CylinderGeometry(0.025, 0.025, len, 5); rail.rotateZ(Math.PI / 2); rail.translate(from + len / 2, 0.62, side * half); rail.rotateY(-a); add(rail, m.brass);
      for (let k = 0; k <= Math.floor(len / 0.9); k++) { const post = new THREE.CylinderGeometry(0.02, 0.02, 0.62, 4); post.translate(from + k * 0.9, 0.31, side * half); post.rotateY(-a); add(post, m.iron); } }
  };
  beamWalk(c.gangway, DROP_VIS_R * 0.7, c.ringIn + 0.05, GANGWAY_HALF);
  for (const s of c.spokes) beamWalk(s, c.innerR - 0.05, c.ringIn + 0.05, SPOKE_HALF);
  if (c.innerR > 0) { const g = new THREE.RingGeometry(c.innerR - INNER_W, c.innerR, 64, 1); g.rotateX(-Math.PI / 2); add(g, m.floor); const t = new THREE.TorusGeometry(c.innerR - INNER_W, 0.025, 4, 64); t.rotateX(Math.PI / 2); add(t, m.trim); }
  // The railing round the ring's inner edge, open where a gangway or spoke meets it.
  const openings = [c.gangway, ...c.spokes].map(a => ({ a, half: (GANGWAY_HALF + 0.15) / c.ringIn }));
  { const rr = c.ringIn + 0.12, posts = Math.round(rr * Math.PI * 2 / 0.9);
    const free = (a: number) => !openings.some(o => Math.abs(Math.atan2(Math.sin(a - o.a), Math.cos(a - o.a))) < o.half);
    for (let i = 0; i < posts; i++) { const a = i / posts * Math.PI * 2; if (!free(a)) continue; const p = new THREE.CylinderGeometry(0.02, 0.02, 0.62, 4); p.translate(Math.cos(a) * rr, 0.31, Math.sin(a) * rr); add(p, m.iron); }
    const segs = 160; for (let i = 0; i < segs; i++) { const a0 = i / segs * Math.PI * 2, a1 = (i + 1) / segs * Math.PI * 2; if (!free(a0) || !free(a1)) continue; const len = rr * (a1 - a0), g = new THREE.CylinderGeometry(0.025, 0.025, len * 1.02, 4); g.rotateZ(Math.PI / 2); g.rotateY(-(a0 + a1) / 2 - Math.PI / 2); g.translate(Math.cos((a0 + a1) / 2) * rr, 0.62, Math.sin((a0 + a1) / 2) * rr); add(g, m.brass); } }
  // ── the wall: plated above the alcoves, panels between them, ribs, a rune band, pipes and their crust ──
  const halfA = ALCOVE_W / 2 / R;
  const upper = new THREE.CylinderGeometry(R, R, H - ALCOVE_H, 96, 1, true); upper.translate(0, ALCOVE_H + (H - ALCOVE_H) / 2, 0); add(upper, wallInside);
  for (let i = 0; i < c.alcoves.length; i++) {
    const a0 = c.alcoves[i] + halfA, a1 = (c.alcoves[(i + 1) % c.alcoves.length] - halfA + Math.PI * 2 * (i === c.alcoves.length - 1 ? 1 : 0));
    // three.js cylinders sweep from +z toward +x: theta = π/2 − our angle.
    const len = a1 - a0, g = new THREE.CylinderGeometry(R, R, ALCOVE_H, 12, 1, true, Math.PI / 2 - a1, len); g.translate(0, ALCOVE_H / 2, 0); add(g, wallInside);
    // A rib at each alcove's edges, floor to ceiling, and a brass pipe beside it.
    for (const a of [c.alcoves[i] - halfA - 0.02, c.alcoves[i] + halfA + 0.02]) { const rib = new THREE.BoxGeometry(0.16, H, 0.16); rib.translate(Math.cos(a) * (R - 0.06), H / 2, Math.sin(a) * (R - 0.06)); add(rib, m.iron); }
    const pa = (a0 + a1) / 2, pipe = new THREE.CylinderGeometry(0.08, 0.08, H, 7); pipe.translate(Math.cos(pa) * (R - 0.14), H / 2, Math.sin(pa) * (R - 0.14)); add(pipe, m.brass);
    // Limescale crusting the pipe at its joints and at its foot.
    for (let k = 0; k < 5; k++) { const y = k === 0 ? 0.1 : rnd() * H, s = 0.06 + rnd() * 0.08, lump = new THREE.SphereGeometry(s, 6, 5); lump.scale(1, 0.7 + rnd() * 0.8, 1); lump.translate(Math.cos(pa + (rnd() - 0.5) * 0.02) * (R - 0.14 - s * 0.4), y, Math.sin(pa) * (R - 0.14 - s * 0.4)); add(lump, m.lime); }
  }
  // Horizontal ribs: the band over the alcoves, and the cornice; a ring pipe under the ceiling.
  for (const y of [ALCOVE_H + 0.06, H - 0.25]) { const t = new THREE.TorusGeometry(R - 0.05, 0.07, 4, 96); t.rotateX(Math.PI / 2); t.translate(0, y, 0); add(t, m.iron); }
  { const t = new THREE.TorusGeometry(R - 0.3, 0.1, 6, 96); t.rotateX(Math.PI / 2); t.translate(0, H - 0.65, 0); add(t, m.brass); }
  // The rune band: SGA-like glyphs lit in the layer's colour, round the wall above the alcoves.
  const runeTex = keep(glyphStrip(24, 11 + depth)); runeTex.repeat.set(Math.round(R * 1.4), 1);
  const runeMat = keep(new THREE.MeshBasicMaterial({ map: runeTex, color: band.clone().multiplyScalar(2.2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide }));
  { const g = new THREE.CylinderGeometry(R - 0.03, R - 0.03, 0.34, 96, 1, true); g.translate(0, ALCOVE_H + 0.45, 0); add(g, runeMat); }
  // The ceiling: rock with the shaft's mouth open for the beam; the shaft above, dark.
  { const g = new THREE.RingGeometry(1.6, R + ALCOVE_D + 0.2, 64, 1); g.rotateX(Math.PI / 2); g.translate(0, H, 0); add(g, m.rock); const up = new THREE.CylinderGeometry(1.6, 1.6, 40, 24, 1, true); up.translate(0, H + 20, 0); add(up, new THREE.MeshToonMaterial({ color: P.rock, gradientMap: ramp, side: THREE.BackSide })); }
  // Below: the shaft falls away, its wall dark, the next layer's glow far down.
  { const down = new THREE.CylinderGeometry(c.ringIn, c.ringIn * 1.15, 40, 48, 1, true); down.translate(0, -20.2, 0); add(down, new THREE.MeshToonMaterial({ color: P.rock, gradientMap: ramp, side: THREE.BackSide }));
    const next = BANDS[Math.min(BANDS.length - 1, depth + 1)], glow = new THREE.CircleGeometry(c.ringIn * 1.1, 48); glow.rotateX(-Math.PI / 2); glow.translate(0, -38, 0); add(glow, keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(next).multiplyScalar(0.6) }))); }
  // ── the alcoves: a niche each, a crystal sconce in the empty ones ──
  const stationAt = new Map(c.stations.map(s => [s.alcove, s]));
  for (let i = 0; i < c.alcoves.length; i++) {
    const a = c.alcoves[i], niche = new THREE.Group(); niche.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); niche.rotation.y = -a; root.add(niche);
    // In the niche's frame +x is outward (into the rock), z across it.
    const back = new THREE.BoxGeometry(0.1, ALCOVE_H, ALCOVE_W); back.translate(ALCOVE_D, ALCOVE_H / 2, 0); add(back, m.stone, niche);
    for (const s of [-1, 1]) { const side = new THREE.BoxGeometry(ALCOVE_D, ALCOVE_H, 0.1); side.translate(ALCOVE_D / 2, ALCOVE_H / 2, s * ALCOVE_W / 2); add(side, m.stone, niche); }
    const top = new THREE.BoxGeometry(ALCOVE_D, 0.12, ALCOVE_W + 0.1); top.translate(ALCOVE_D / 2, ALCOVE_H, 0); add(top, m.iron, niche);
    const fl = new THREE.BoxGeometry(ALCOVE_D, 0.05, ALCOVE_W); fl.translate(ALCOVE_D / 2, -0.025, 0); add(fl, m.floor, niche);
    if (stationAt.has(i)) continue;
    // A cluster of blue crystal on a brass bracket, glowing.
    const bracket = new THREE.BoxGeometry(0.3, 0.06, 0.3); bracket.translate(ALCOVE_D - 0.15, 1.05, 0); add(bracket, m.brass, niche);
    for (let k = 0; k < 4; k++) { const h = 0.25 + rnd() * 0.3, cr = new THREE.ConeGeometry(0.05 + rnd() * 0.03, h, 5); cr.translate(0, h / 2, 0); const mesh = add(cr, m.crystal, niche); mesh.position.set(ALCOVE_D - 0.15 + (rnd() - 0.5) * 0.15, 1.08, (rnd() - 0.5) * 0.18); mesh.rotation.set((rnd() - 0.5) * 0.6, 0, (rnd() - 0.5) * 0.6); }
  }
  // ── the stations and their keepers ──
  const keepers: Keeper[] = [];
  for (const s of c.stations) {
    const st = new THREE.Group(), a = s.angle; st.position.set(Math.cos(a) * R, 0, Math.sin(a) * R); st.rotation.y = -a; root.add(st);
    if (s.kind === 'archive') {
      // A brass lectern with a slanted screen of scrolling glyphs; scroll racks on the niche's back wall.
      const ped = new THREE.CylinderGeometry(0.08, 0.14, 0.75, 7); ped.translate(0.35, 0.375, 0); add(ped, m.brass, st);
      const scr = keep(glyphStrip(8, 300 + depth, 64, 64)); scr.repeat.set(1, 1);
      const screenMat = keep(new THREE.MeshBasicMaterial({ map: scr, color: new THREE.Color('#9ff0ff').multiplyScalar(1.8), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const screen = add(new THREE.PlaneGeometry(0.5, 0.32), screenMat, st); screen.position.set(0.33, 0.86, 0); screen.rotation.set(0, -Math.PI / 2, 0.6); screen.name = 'archive-screen';
      const frame = new THREE.BoxGeometry(0.04, 0.36, 0.56); frame.rotateZ(0.6); frame.translate(0.36, 0.86, 0); add(frame, m.iron, st);
      for (let k = 0; k < 3; k++) { const rack = new THREE.BoxGeometry(0.22, 0.04, ALCOVE_W - 0.3); rack.translate(ALCOVE_D - 0.15, 0.5 + k * 0.42, 0); add(rack, m.brass, st); for (let j = 0; j < 6; j++) { const tube = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 6); tube.rotateZ(Math.PI / 2); tube.translate(ALCOVE_D - 0.15, 0.56 + k * 0.42, -0.5 + j * 0.2); add(tube, j % 2 ? m.lime : m.iron, st); } }
      // The layer's letter as a sigil above the archive.
      const sig = keep(letterSigil(c.letter)), sm = keep(new THREE.MeshBasicMaterial({ map: sig, color: band.clone().multiplyScalar(2.4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const plane = add(new THREE.PlaneGeometry(1.5, 1.5), sm, st); plane.position.set(-0.04, ALCOVE_H + 1.45, 0); plane.rotation.y = -Math.PI / 2;
    } else if (s.kind === 'power') {
      // A power node: a chaos crystal (violet) caged in brass, pulsing.
      const cage = new THREE.CylinderGeometry(0.28, 0.28, 0.9, 8, 1, true); cage.translate(0.5, 0.65, 0); const cm = add(cage, keep(new THREE.MeshToonMaterial({ color: P.brass, gradientMap: ramp, wireframe: true })), st); cm.name = 'node-cage';
      const cr = new THREE.OctahedronGeometry(0.2, 0); cr.scale(1, 1.8, 1); cr.translate(0.5, 0.65, 0); const core = add(cr, keep(new THREE.MeshBasicMaterial({ color: new THREE.Color('#b47aff').multiplyScalar(2) })), st); core.name = 'node-core';
      const base = new THREE.CylinderGeometry(0.34, 0.4, 0.2, 8); base.translate(0.5, 0.1, 0); add(base, m.iron, st);
    } else {
      // A machine: a great gear turning and a furnace mouth glowing.
      const gear = new THREE.TorusGeometry(0.42, 0.08, 5, 12); gear.rotateY(Math.PI / 2); const gm = add(gear, m.brass, st); gm.position.set(ALCOVE_D - 0.2, 1.0, 0); gm.name = 'machine-gear';
      for (let k = 0; k < 10; k++) { const tooth = new THREE.BoxGeometry(0.06, 0.12, 0.12); tooth.translate(0, 0.5, 0); const t = add(tooth, m.brass, gm); t.rotation.x = k / 10 * Math.PI * 2; }
      const mouth = new THREE.PlaneGeometry(0.5, 0.36); const mm = add(mouth, keep(new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a30').multiplyScalar(2.2) })), st); mm.position.set(ALCOVE_D - 0.06, 0.32, 0); mm.rotation.y = -Math.PI / 2;
    }
    // The keeper stands in front of its station, facing out onto the ring.
    const made = s.keeper === 'snerk' ? makeSnerk() : s.keeper === 'hollowed' ? makeHollowed() : makeGreeblin();
    const kg = made.group; kg.userData.keeper = true; kg.position.set(Math.cos(a) * (R - 0.15) + Math.cos(a + Math.PI / 2) * 0.45, 0, Math.sin(a) * (R - 0.15) + Math.sin(a + Math.PI / 2) * 0.45); root.add(kg);
    kg.traverse(o => { if ((o as THREE.Mesh).geometry) keep((o as THREE.Mesh).geometry); });
    // The figures face +z; it faces the shaft.
    const face = Math.atan2(-Math.cos(a), -Math.sin(a)); kg.rotation.y = face; let look = 0;
    const lantern = 'lantern' in made ? (made as { lantern: THREE.Object3D }).lantern : null;
    keepers.push({ group: kg, kind: s.keeper, station: s, update(t, hx, hz) {
      // Faces the ring; turns its head to her when she is near.
      const dx = hx - kg.position.x, dz = hz - kg.position.z, near = Math.hypot(dx, dz) < 3.5;
      const want = near ? Math.atan2(dx, dz) - face : Math.sin(t * 0.4 + a) * 0.4;
      look += (Math.atan2(Math.sin(want - look), Math.cos(want - look))) * 0.08; made.head.rotation.y = THREE.MathUtils.clamp(Math.atan2(Math.sin(look), Math.cos(look)), -1.1, 1.1);
      kg.position.y = Math.abs(Math.sin(t * (s.keeper === 'greeblin' ? 3 : 1.4))) * 0.012;
      if (lantern) lantern.rotation.z = Math.sin(t * 1.7) * 0.25;
    } });
  }
  // ── the beam and the drop ──
  const beamCore = keep(new THREE.MeshBasicMaterial({ color: band.clone().lerp(new THREE.Color('#ffffff'), 0.55).multiplyScalar(2.6), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
  { const g = new THREE.CylinderGeometry(0.18, 0.18, 140, 12, 1, true); add(g, beamCore); }
  const glowMat = keep(new THREE.ShaderMaterial({ uniforms: { uColor: { value: band.clone().lerp(new THREE.Color('#ffffff'), 0.3) }, uTime: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vY = w.y; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: 'uniform vec3 uColor; uniform float uTime; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 2.0); float flow = 0.75 + 0.25 * sin(vY * 1.3 - uTime * 3.0); gl_FragColor = vec4(uColor * f * flow * 0.55, f * 0.6); }' }));
  { const g = new THREE.CylinderGeometry(0.75, 0.75, 140, 24, 1, true); add(g, glowMat); }
  // Motes rising in the beam.
  const moteN = 160, motePos = new Float32Array(moteN * 3), moteSeed = new Float32Array(moteN);
  for (let i = 0; i < moteN; i++) { moteSeed[i] = rnd(); }
  const moteGeo = keep(new THREE.BufferGeometry()); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const motes = new THREE.Points(moteGeo, keep(new THREE.PointsMaterial({ color: band.clone().lerp(new THREE.Color('#ffffff'), 0.5).multiplyScalar(2), size: 0.06, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }))); motes.frustumCulled = false; root.add(motes);
  // The drop: a crystal water sphere seen from outside, its rim bright, its skin turning slowly; the beam runs through it.
  const dropC = new THREE.Vector3(0, 0.95, 0);
  const dropMat = keep(new THREE.ShaderMaterial({ uniforms: { uTint: { value: new THREE.Color('#9fe4ff') }, uBand: { value: band.clone() }, uTime: { value: 0 } }, transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vP = position; vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }',
    fragmentShader: 'uniform vec3 uTint; uniform vec3 uBand; uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP; void main(){ float ndv = abs(dot(normalize(vN), normalize(vV))); float rim = pow(1.0 - ndv, 2.5); float caus = 0.5 + 0.5 * sin(vP.x * 7.0 + uTime * 0.9) * sin(vP.y * 6.0 - uTime * 0.7) * sin(vP.z * 7.5 + uTime * 0.5); vec3 c = mix(uTint * 0.25, uTint * 1.8, rim) + uBand * pow(caus, 6.0) * 0.6; gl_FragColor = vec4(c, 0.18 + rim * 0.7); }' }));
  const drop = add(new THREE.SphereGeometry(DROP_VIS_R, 40, 28), dropMat); drop.position.copy(dropC); drop.name = 'drop';
  const veins = add(new THREE.IcosahedronGeometry(DROP_VIS_R * 0.98, 2), keep(new THREE.MeshBasicMaterial({ color: new THREE.Color('#9fe4ff').multiplyScalar(0.9), wireframe: true, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending })));
  veins.position.copy(dropC); veins.name = 'drop-veins';
  // One draw per material for everything that does not move (a phone's budget is draw calls).
  mergeStatic(root, keep);
  // ── the light ──
  const hemi = new THREE.HemisphereLight('#8a96c0', '#2a241c', 2.0 + depth * 0.15); root.add(hemi);
  const beamLight = new THREE.PointLight(band.clone().lerp(new THREE.Color('#ffffff'), 0.75), 18 + depth * 3, R * 2.6, 1.0); beamLight.position.set(0, 1.6, 0); root.add(beamLight);
  const fill = new THREE.PointLight('#8fb8ff', 6, R * 1.8, 1.6); fill.position.set(0, H - 0.8, 0); root.add(fill);
  for (const s of c.stations) { const l = new THREE.PointLight(s.kind === 'archive' ? '#ffc070' : s.kind === 'power' ? '#c080ff' : '#ff9040', 5, 4.5, 1.6); l.position.set(Math.cos(s.angle) * (R - 0.4), 1.3, Math.sin(s.angle) * (R - 0.4)); root.add(l); }
  function update(t: number, her: THREE.Vector3): void {
    glowMat.uniforms.uTime.value = t; dropMat.uniforms.uTime.value = t; veins.rotation.y = t * 0.12; veins.rotation.x = t * 0.05;
    for (let i = 0; i < moteN; i++) { const s = moteSeed[i], y = ((s * 97 + t * (0.6 + s * 0.8)) % 24) - 8, a = s * 40 + t * 0.3, r = 0.15 + (s * 13 % 1) * 0.55; motePos[i * 3] = Math.cos(a) * r; motePos[i * 3 + 1] = y; motePos[i * 3 + 2] = Math.sin(a) * r; }
    moteGeo.attributes.position.needsUpdate = true;
    runeTex.offset.x = (t * 0.01) % 1;
    root.traverse(o => { if (o.name === 'node-core') { const k = 1 + Math.sin(t * 2.4) * 0.12; o.scale.setScalar(k); } else if (o.name === 'machine-gear') o.rotation.x = t * 0.6; else if (o.name === 'archive-screen') { const mat = (o as THREE.Mesh).material as THREE.MeshBasicMaterial; if (mat.map) mat.map.offset.y = Math.floor(t * 2) * 0.125; } });
    for (const k of keepers) k.update(t, her.x, her.z);
  }
  function dispose(): void { root.removeFromParent(); for (const d of disposables) d.dispose(); }
  return { root, catwalk: c, keepers, drop: dropC, update, dispose };
}
const RING_SEAM_W = 0.035;
/** Merge the static meshes under `root` (not the keepers, nothing named, no instanced or point meshes) into one mesh per material. */
function mergeStatic(root: THREE.Group, keep: <T extends { dispose(): void }>(x: T) => T): void {
  root.updateMatrixWorld(true);
  const groups = new Map<THREE.Material, THREE.BufferGeometry[]>(), victims: THREE.Mesh[] = [];
  root.traverse(o => {
    const m = o as THREE.Mesh; if (!m.isMesh || (m as THREE.InstancedMesh).isInstancedMesh || m.name || Array.isArray(m.material)) return;
    for (let p: THREE.Object3D | null = m.parent; p && p !== root; p = p.parent) if (p.userData.keeper || p.name) return;
    const g = m.geometry.index ? m.geometry.clone() : m.geometry.clone(); g.applyMatrix4(m.matrixWorld); for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k);
    const list = groups.get(m.material) ?? []; list.push(g); groups.set(m.material, list); victims.push(m);
  });
  for (const v of victims) v.removeFromParent();
  for (const [mat, list] of groups) { const merged = mergeGeometries(list.map(g => (g.index ? g : g)), false); for (const g of list) g.dispose(); if (!merged) continue; keep(merged); const mesh = new THREE.Mesh(merged, mat); mesh.matrixAutoUpdate = false; root.add(mesh); }
}
const wallInside = new THREE.MeshToonMaterial({ color: DESCENT_PALETTE.plate, emissive: '#151824', gradientMap: ramp, side: THREE.BackSide });
