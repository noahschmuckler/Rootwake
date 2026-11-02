// The Hearth-Hold drawn (holdModel.ts; HOLD.md): the masonwork's stone and bronze. Large dressed blocks in warm tan-grey laid in hard
// courses (each block its own tint, the joints dark behind them), copings with a bronze band under them, the terraces paved in
// flagstones with moss and needle litter creeping up from the forest, the beds' curbs round dry cracked soil, the runnels and their
// seized sluices, the processional stair and the side stairs, the lantern pylons, the watchtower stumps, the gate's plinths and fallen
// lintel, the collapse's scree, and the facade with its pilasters, frieze, cornice and dark doorways. Built in the hold's frame and
// merged per material: a handful of draws for the whole of it.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TERRACES, APRON, FLIGHTS, BEDS, WALLS, PYLONS, TOWERS, GATE_PLINTHS, COLLAPSE, DOORS, HEARTH, FACADE_V, FACADE_TOP, FACADE_HW, FACADE_D, STAIR_HW, CURB_H, levelAt, type HoldFrame, type Flight } from './holdModel';
import { mulberry32 } from './colors';
import { createEverHearth } from './holdFurniture';

// ---- Tuning ----------------------------------------------------------------------------------------------------------------------
/** The stone's colour, the joints' dark behind it, the coping's, the moss it greens toward low down; bronze and its verdigris. */
const STONE = new THREE.Color('#d9a66c'), JOINT = new THREE.Color('#33281c'), COPING = new THREE.Color('#e8bf86'), MOSS = new THREE.Color('#7c8448'), STEP = new THREE.Color('#c89a64');
const BRONZE = new THREE.Color('#7a5630'), VERDIGRIS = new THREE.Color('#4f8a76');
/** A course's height range, a block's length range (m), the gap between blocks (the joint), how much a block's tint wanders. */
const COURSE: [number, number] = [0.55, 0.8], BLOCK: [number, number] = [1.1, 2.4], JOINT_W = 0.035, TINT = 0.09;
/** How often a top block or a coping is missing (the ruin), how far moss climbs a wall (m). */
const MISSING = 0.1, MOSS_CLIMB = 0.9;
/** A wall's thickness behind its face; a coping's lip past the face and its height; the bronze band under it. */
const WALL_D = 0.8, COPE_LIP = 0.14, COPE_H = 0.14, BAND_H = 0.09;

export interface HoldWorld { root: THREE.Group; update(time: number, dt: number, night: number): void; dispose(): void; readonly triangles: number; readonly draws: number }

type Kind = 'stone' | 'bronze' | 'dark' | 'paving' | 'soil';
export function createHoldWorld(parent: THREE.Object3D, frame: HoldFrame, datum: number, land: (x: number, z: number) => number, seed = 1): HoldWorld {
  const root = new THREE.Group(); root.name = 'hold'; parent.add(root);
  // The hold's frame as a group: local (u, height over the datum, -v).
  root.position.set(frame.x, datum, frame.z); root.rotation.y = frame.dir + Math.PI; root.updateMatrixWorld(true);
  const landLocal = (u: number, v: number): number => { const x = frame.x + frame.ix * v + frame.rx * u, z = frame.z + frame.iz * v + frame.rz * u; return land(x, z) - datum; };
  const rand = mulberry32((seed * 9157 + 31) >>> 0), rr = (a: number, b: number): number => a + (b - a) * rand();
  const parts: Record<Kind, THREE.BufferGeometry[]> = { stone: [], bronze: [], dark: [], paving: [], soil: [] };
  const tmp = new THREE.Color();
  const paint = (g: THREE.BufferGeometry, c: THREE.Color): THREE.BufferGeometry => { const n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; };
  const add = (k: Kind, g: THREE.BufferGeometry, c?: THREE.Color): void => { if (g.index) g = g.toNonIndexed(); parts[k].push(c ? paint(g, c) : g); };
  /** A box in the frame: u and v ranges, y range over the datum. */
  const box = (k: Kind, u0: number, u1: number, y0: number, y1: number, v0: number, v1: number, c: THREE.Color, m?: THREE.Matrix4): void => {
    const g = new THREE.BoxGeometry(Math.abs(u1 - u0), Math.abs(y1 - y0), Math.abs(v1 - v0)); g.translate((u0 + u1) / 2, (y0 + y1) / 2, -(v0 + v1) / 2); if (m) g.applyMatrix4(m); add(k, g, c);
  };
  const stoneTint = (y: number, base: number, c = STONE): THREE.Color => { tmp.copy(c).multiplyScalar(1 + (rand() - 0.5) * 2 * TINT); const moss = Math.max(0, 1 - (y - base) / MOSS_CLIMB) * 0.45 * rand(); return tmp.clone().lerp(MOSS, moss); };
  const inCollapse = (u: number, v: number): boolean => { let inside = false; for (let i = 0, j = COLLAPSE.length - 1; i < COLLAPSE.length; j = i++) { const a = COLLAPSE[i], b = COLLAPSE[j]; if ((a.v > v) !== (b.v > v) && u < ((b.u - a.u) * (v - a.v)) / (b.v - a.v) + a.u) inside = !inside; } return inside; };

  /** A masonry run: courses of blocks along canonical x from 0 to `len`, its face at z = 0 looking -z, its body behind (+z) `depth`;
   * placed by `m` into the frame (`at` maps canonical x to the frame's (u, v) for the ruin's tests). `holes` are x ranges open below a height. */
  function masonry(len: number, y0: number, y1: number, m: THREE.Matrix4, at: (x: number) => { u: number; v: number }, opts: { depth?: number; coping?: boolean; band?: boolean; holes?: { x0: number; x1: number; top: number }[]; ruin?: boolean } = {}): void {
    const depth = opts.depth ?? WALL_D, holes = opts.holes ?? [];
    const open = (x0: number, x1: number, ya: number): boolean => holes.some(h => x1 > h.x0 && x0 < h.x1 && ya < h.top);
    // The dark core behind the blocks: what the joints show.
    for (const [a, b] of spans(0, len, holes.map(h => [h.x0, h.x1] as [number, number]))) { const g = new THREE.BoxGeometry(b - a, y1 - y0, depth - 0.06); g.translate((a + b) / 2, (y0 + y1) / 2, 0.06 + (depth - 0.06) / 2); g.applyMatrix4(m); add('stone', g, JOINT); }
    for (const h of holes) if (h.top < y1) { const g = new THREE.BoxGeometry(h.x1 - h.x0, y1 - h.top, depth - 0.06); g.translate((h.x0 + h.x1) / 2, (h.top + y1) / 2, 0.06 + (depth - 0.06) / 2); g.applyMatrix4(m); add('stone', g, JOINT); }
    let y = y0, course = 0;
    while (y < y1 - 0.05) {
      const ch = Math.min(rr(COURSE[0], COURSE[1]), y1 - y), top = y + ch >= y1 - 0.05;
      let x = course % 2 ? -rr(0.3, 0.9) : 0;
      while (x < len) {
        const bl = rr(BLOCK[0], BLOCK[1]), xa = Math.max(0, x), xb = Math.min(len, x + bl); x += bl;
        if (xb - xa < 0.2) continue;
        if (open(xa, xb, y)) { // a block over a doorway's edge is cut to it
          for (const h of holes) if (xb > h.x0 && xa < h.x1 && y < h.top) { if (xa < h.x0) piece(xa, h.x0); if (xb > h.x1) piece(h.x1, xb); }
          continue;
        }
        piece(xa, xb);
      }
      function piece(xa: number, xb: number): void {
        const mid = at((xa + xb) / 2); if (opts.ruin !== false && inCollapse(mid.u, mid.v)) return;
        if (top && opts.ruin !== false && rand() < MISSING) return;
        const out = rr(-0.015, 0.03), g = new THREE.BoxGeometry(xb - xa - JOINT_W, ch - JOINT_W, 0.32);
        g.translate((xa + xb) / 2, y + ch / 2, 0.16 - out); g.applyMatrix4(m); add('stone', g, stoneTint(y, y0));
      }
      y += ch; course++;
    }
    if (opts.coping !== false) for (const [a, b] of spans(0, len, [])) {
      let x = a; while (x < b) { const l = Math.min(rr(1.6, 3), b - x), mid = at(x + l / 2); if (!inCollapse(mid.u, mid.v) && rand() > MISSING * 0.7) { const g = new THREE.BoxGeometry(l - 0.03, COPE_H, depth + COPE_LIP); g.translate(x + l / 2, y1 + COPE_H / 2, (depth - COPE_LIP) / 2); g.applyMatrix4(m); add('stone', g, tmp.copy(COPING).multiplyScalar(1 + (rand() - 0.5) * 0.12).clone()); if (opts.band !== false && rand() > 0.15) { const bnd = new THREE.BoxGeometry(l - 0.03, BAND_H, 0.05); bnd.translate(x + l / 2, y1 - BAND_H / 2 - 0.04, -0.035); bnd.applyMatrix4(m); add('bronze', bnd, bronzeTint()); } } x += l; }
    }
  }
  const bronzeTint = (): THREE.Color => tmp.copy(BRONZE).lerp(VERDIGRIS, rand() ** 2 * 0.7).multiplyScalar(0.9 + rand() * 0.2).clone();
  /** [a, b] minus the given ranges. */
  function spans(a: number, b: number, cut: [number, number][]): [number, number][] { let out: [number, number][] = [[a, b]]; for (const [c0, c1] of cut) out = out.flatMap(([x0, x1]) => (c1 <= x0 || c0 >= x1 ? [[x0, x1]] : [...(c0 > x0 ? [[x0, c0]] : []), ...(c1 < x1 ? [[c1, x1]] : [])]) as [number, number][]); return out; }
  const ry = (a: number): THREE.Matrix4 => new THREE.Matrix4().makeRotationY(a), tr = (x: number, y: number, z: number): THREE.Matrix4 => new THREE.Matrix4().makeTranslation(x, y, z);
  /** A wall facing -v (toward the foot) along v, from u0 to u1 (u0 < u1): its body behind into +v. */
  const faceDown = (u0: number, u1: number, v: number, y0: number, y1: number, opts?: Parameters<typeof masonry>[5]): void => masonry(u1 - u0, y0, y1, tr(u1, 0, -v).multiply(ry(Math.PI)), x => ({ u: u1 - x, v }), opts);
  /** A wall facing out across a wing's end (s: +1 the right, -1 the left), along u = s·at from v0 to v1, its body inward. */
  const faceSide = (s: number, at: number, v0: number, v1: number, y0: number, y1: number, opts?: Parameters<typeof masonry>[5]): void => s > 0 ? masonry(v1 - v0, y0, y1, tr(at, 0, -v1).multiply(ry(-Math.PI / 2)), x => ({ u: at, v: v1 - x }), opts) : masonry(v1 - v0, y0, y1, tr(-at, 0, -v0).multiply(ry(Math.PI / 2)), x => ({ u: -at, v: v0 + x }), opts);

  // ── the retaining walls: each terrace's front, from the stair's cheek out to its wing; and the wings' ends ──
  for (const w of WALLS) { const a = Math.min(w.u0, w.u1), b = Math.max(w.u0, w.u1); faceDown(a < 0 ? a : a + 0.45, a < 0 ? b - 0.45 : b, w.v, w.low - 0.5, w.high); }
  TERRACES.forEach((t, i) => {
    const below = (u: number, v: number): number => Math.min(t.z, landLocal(u, v)) - 0.6;
    for (const s of [-1, 1]) { const y0 = Math.min(below(s * t.hw, t.v0), below(s * t.hw, t.v1), t.z - 1.4); faceSide(s, t.hw, t.v0, i === TERRACES.length - 1 ? FACADE_V : t.v1, y0, t.z + (i === TERRACES.length - 1 ? 0.6 : 0)); }
  });
  // ── the paving: each terrace and the apron, flagstones, moss and litter creeping up from the forest, worse low down ──
  const paveTex = flagTexture(seed), soilTex = soilTexture(seed);
  const pave = (u0: number, u1: number, v0: number, v1: number, y: number, wild: number): void => {
    const w = u1 - u0, d = v1 - v0, g = new THREE.PlaneGeometry(w, d, Math.max(1, Math.round(w / 3)), Math.max(1, Math.round(d / 3)));
    g.rotateX(-Math.PI / 2); g.translate((u0 + u1) / 2, y, -(v0 + v1) / 2);
    const p = g.attributes.position as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute, col = new Float32Array(p.count * 3);
    for (let k = 0; k < p.count; k++) {
      const u = p.getX(k), v = -p.getZ(k); uv.setXY(k, u / 4, v / 4);
      const n = 0.5 + 0.5 * Math.sin(u * 0.31 + Math.sin(v * 0.17) * 2.1) * Math.cos(v * 0.27 + Math.sin(u * 0.13) * 1.7), m = Math.max(0, Math.min(1, (n - 0.45 + wild * 0.5) * 1.6));
      tmp.setRGB(1, 1, 1).lerp(MOSS, m * 0.55).multiplyScalar(0.92 + 0.12 * Math.sin(u * 1.7 + v * 2.3)); col[k * 3] = tmp.r; col[k * 3 + 1] = tmp.g; col[k * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); add('paving', g);
  };
  pave(APRON.u0, APRON.u1, APRON.v0, APRON.v1, APRON.z + 0.02, 0.6);
  TERRACES.forEach((t, i) => pave(-t.hw, t.hw, t.v0, t.v1, t.z + 0.02, 0.5 - i * 0.09));
  // ── the beds: a curb round dry cracked soil; the runnel along the terrace's back and a sluice gate seized at each bed ──
  for (const b of BEDS) {
    const t = TERRACES[b.terrace], u0 = Math.min(b.u0, b.u1), u1 = Math.max(b.u0, b.u1), y = t.z, c = 0.28;
    for (const [a0, a1, w0, w1] of [[u0, u1, b.v0, b.v0 + c], [u0, u1, b.v1 - c, b.v1], [u0, u0 + c, b.v0 + c, b.v1 - c], [u1 - c, u1, b.v0 + c, b.v1 - c]] as const) {
      let x = a0; const along = a1 - a0 > w1 - w0;
      if (along) while (x < a1) { const l = Math.min(rr(0.9, 1.6), a1 - x); if (!inCollapse(x, w0) && rand() > 0.04) box('stone', x + 0.015, x + l - 0.015, y - 0.15, y + CURB_H, w0, w1, stoneTint(y, y - 0.2, STEP)); x += l; }
      else { let v = w0; while (v < w1) { const l = Math.min(rr(0.9, 1.6), w1 - v); if (rand() > 0.04) box('stone', a0, a1, y - 0.15, y + CURB_H, v + 0.015, v + l - 0.015, stoneTint(y, y - 0.2, STEP)); v += l; } }
    }
    const g = new THREE.PlaneGeometry(u1 - u0 - 2 * c, b.v1 - b.v0 - 2 * c); g.rotateX(-Math.PI / 2); g.translate((u0 + u1) / 2, y + CURB_H - 0.05, -(b.v0 + b.v1) / 2);
    const uv = g.attributes.uv as THREE.BufferAttribute, pp = g.attributes.position as THREE.BufferAttribute; for (let k = 0; k < pp.count; k++) uv.setXY(k, pp.getX(k) / 5, -pp.getZ(k) / 5);
    add('soil', g);
    // The sluice: a bronze gate in the bed's back curb, shut.
    const cu = (u0 + u1) / 2; box('bronze', cu - 0.32, cu + 0.32, y, y + CURB_H + 0.22, b.v1 - 0.06, b.v1 + 0.04, bronzeTint());
    box('bronze', cu - 0.05, cu + 0.05, y + CURB_H + 0.22, y + CURB_H + 0.42, b.v1 - 0.03, b.v1 + 0.01, bronzeTint());
  }
  TERRACES.forEach(t => {
    if (!t.beds) return; const vr = t.v1 - 1.6, y = t.z;
    for (const s of [-1, 1]) {
      const a = s > 0 ? 4.2 : -(t.hw - 1.2), b = s > 0 ? t.hw - 1.2 : -4.2;
      for (const off of [-0.38, 0.38]) { let x = a; while (x < b) { const l = Math.min(rr(1.2, 2.2), b - x); if (!inCollapse(x, vr) && rand() > 0.05) box('stone', x + 0.015, x + l - 0.015, y - 0.1, y + 0.2, vr + off - 0.1, vr + off + 0.1, stoneTint(y, y - 0.2, STEP)); x += l; } }
      box('stone', a, b, y - 0.05, y + 0.035, vr - 0.28, vr + 0.28, tmp.copy(JOINT).multiplyScalar(1.6).clone());
    }
  });
  // ── the stairs: each flight's steps, solid to below the foot; the central flights' cheeks; the side stairs' outer parapet ──
  for (const f of FLIGHTS) flight(f);
  function flight(f: Flight): void {
    const rise = (f.to - f.from) / f.steps, run = f.climb === 'v' ? f.v1 - f.v0 : f.u1 - f.u0, tread = run / f.steps;
    for (let k = 0; k < f.steps; k++) {
      const top = f.from + rise * (k + 1), c = stoneTint(top, f.from - 0.3, STEP);
      if (f.climb === 'v') box('stone', f.u0 + 0.01, f.u1 - 0.01, f.from - 0.4, top, f.v0 + k * tread, f.v0 + (k + 1) * tread + 0.02, c);
      else if (f.climb === 'u+') box('stone', f.u0 + k * tread, f.u0 + (k + 1) * tread + 0.02, f.from - 0.4, top, f.v0, f.v1, c);
      else box('stone', f.u1 - (k + 1) * tread - 0.02, f.u1 - k * tread, f.from - 0.4, top, f.v0, f.v1, c);
      // The side stair's parapet on its open side, a block a step.
      if (f.climb !== 'v') { const a = f.climb === 'u+' ? f.u0 + k * tread : f.u1 - (k + 1) * tread; box('stone', a + 0.01, a + tread - 0.01, f.from - 0.4, top + 0.55, f.v0 - 0.4, f.v0, stoneTint(top, f.from - 0.3)); }
    }
    if (f.climb === 'v') for (const s of [-1, 1]) {
      const a = s < 0 ? -STAIR_HW - 0.45 : STAIR_HW, b = s < 0 ? -STAIR_HW : STAIR_HW + 0.45;
      faceSideCheek(a, b, f);
    }
  }
  function faceSideCheek(a: number, b: number, f: Flight): void {
    let v = f.v0; while (v < f.v1 - 0.05) { const l = Math.min(rr(1.2, 2), f.v1 - v); box('stone', a, b, f.from - 0.4, f.to + 0.02, v + 0.015, v + l - 0.015, stoneTint(f.to, f.from - 0.4)); v += l; }
    box('stone', a - 0.06, b + 0.06, f.to + 0.02, f.to + 0.02 + COPE_H, f.v0, f.v1, tmp.copy(COPING).clone());
  }
  // ── the lantern pylons: a stone shaft, a dark lamp housing, a bronze pyramid cap ──
  const pylon = (u: number, v: number, base: number, m?: THREE.Matrix4): void => {
    let y = base; for (let k = 0; k < 4; k++) { const h = 0.55; box('stone', u - 0.4, u + 0.4, y, y + h - 0.02, v - 0.4, v + 0.4, stoneTint(y, base), m); y += h; }
    box('dark', u - 0.3, u + 0.3, y, y + 0.5, v - 0.3, v + 0.3, JOINT, m);
    for (const [du, dv] of [[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) box('bronze', u + du - 0.05, u + du + 0.05, y, y + 0.5, v + dv - 0.05, v + dv + 0.05, bronzeTint(), m);
    const cap = new THREE.ConeGeometry(0.62, 0.75, 4, 1); cap.rotateY(Math.PI / 4); cap.translate(u, y + 0.5 + 0.375, -v); if (m) cap.applyMatrix4(m); add('bronze', cap, bronzeTint());
    box('bronze', u - 0.48, u + 0.48, y + 0.5, y + 0.58, v - 0.48, v + 0.48, bronzeTint(), m);
  };
  for (const p of PYLONS) pylon(p.u, p.v, levelAt(p.u, p.v) ?? 0);
  // ── the watchtower stumps: rings of blocks, broken off at different heights, dark within ──
  for (const t of TOWERS) {
    const base = Math.min(levelAt(t.u, t.v) ?? 99, landLocal(t.u, t.v)) - 0.6, n = 12, tops = Array.from({ length: n }, () => Math.floor(rr(3, 8)));
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2; let y = base;
      for (let c = 0; c < tops[k]; c++) { const ch = 0.65, g = new THREE.BoxGeometry(2 * t.r * Math.sin(Math.PI / n) + 0.25 - JOINT_W, ch - JOINT_W, 0.85); g.translate(0, y + ch / 2, -(t.r - 0.42)); g.applyMatrix4(ry(a + (c % 2) * 0.08)); g.translate(t.u, 0, -t.v); add('stone', g, stoneTint(y, base + 0.6)); y += ch; }
    }
    const fl = new THREE.CircleGeometry(t.r - 0.8, 12); fl.rotateX(-Math.PI / 2); fl.translate(t.u, (levelAt(t.u, t.v) ?? base + 0.6) + 0.05, -t.v); add('stone', fl, JOINT);
  }
  // ── the gate: two plinths at the stair's foot, bronze-capped; the lintel fallen across the apron ──
  for (const p of GATE_PLINTHS) {
    let y = -0.4; for (let c = 0; c < 5; c++) { const ch = 0.72; box('stone', p.u0 + (c % 2) * 0.05, p.u1 - ((c + 1) % 2) * 0.05, y, y + ch - JOINT_W, p.v0, p.v1, stoneTint(y, 0)); y += ch; }
    box('stone', p.u0 - 0.15, p.u1 + 0.15, y, y + 0.22, p.v0 - 0.15, p.v1 + 0.15, COPING.clone()); box('bronze', p.u0 - 0.05, p.u1 + 0.05, y - 0.12, y, p.v0 - 0.05, p.v1 + 0.05, bronzeTint());
  }
  { const m = tr(6.6, 0, -4.4).multiply(ry(0.35)).multiply(new THREE.Matrix4().makeRotationZ(0.08)); box('stone', -3.3, 3.3, 0, 0.95, -0.55, 0.55, stoneTint(0.5, 0), m); box('bronze', -3.3, 3.3, 0.95, 1.03, -0.6, 0.6, bronzeTint(), m); }
  // ── the collapse: scree and a fallen pylon over the right wing of T4 and T5 ──
  for (let k = 0; k < 140; k++) {
    const u = rr(18, 41), v = rr(57, 95); if (!inCollapse(u, v)) continue;
    const r = rr(0.25, 1.1) * (rand() < 0.15 ? 1.6 : 1), g = new THREE.IcosahedronGeometry(r, 0), p = g.attributes.position as THREE.BufferAttribute;
    for (let q = 0; q < p.count; q++) p.setXYZ(q, p.getX(q) * rr(0.75, 1.2), p.getY(q) * rr(0.5, 0.9), p.getZ(q) * rr(0.75, 1.2));
    g.computeVertexNormals(); const y = (levelAt(u, v) ?? landLocal(u, v)); g.rotateY(rand() * 6); g.translate(u, y + r * 0.3, -v); add('stone', g, stoneTint(y + 1, y));
  }
  { const m = tr(29, (levelAt(29, 70.6) ?? 8.6) + 0.4, -70.6).multiply(ry(-0.5)).multiply(new THREE.Matrix4().makeRotationZ(Math.PI / 2 - 0.12)).multiply(tr(0, 0, 0)); pylon(0, 0, -1.6, m); }
  // ── the facade: masonry from the hearth terrace (lower past its ends) to its top; doorways dark; pilasters, frieze, cornice ──
  const H = TERRACES[TERRACES.length - 1], sideBase = Math.min(landLocal(-FACADE_HW, FACADE_V - 1), landLocal(FACADE_HW, FACADE_V - 1), H.z) - 0.8;
  const holes = DOORS.map(d => ({ x0: d.u0, x1: d.u1, top: H.z + d.height }));
  const shifted = (u: number): number => u + FACADE_HW;
  faceDown(-H.hw, H.hw, FACADE_V, H.z - 0.4, FACADE_TOP, { depth: FACADE_D, coping: false, holes: holes.map(h => ({ x0: H.hw - h.x1, x1: H.hw - h.x0, top: h.top })), ruin: false });
  for (const s of [-1, 1]) { const a = s < 0 ? -FACADE_HW : H.hw, b = s < 0 ? -H.hw : FACADE_HW; faceDown(a, b, FACADE_V, sideBase, FACADE_TOP, { depth: FACADE_D, coping: false, ruin: false }); }
  void shifted;
  for (const d of DOORS) {
    const top = H.z + d.height, w = d.u1 - d.u0;
    // The dark within (the halls are H4's), and a stepped lintel over the opening: three slabs, each wider and further out.
    box('dark', d.u0, d.u1, H.z, top, FACADE_V + 0.4, FACADE_V + 1.3, JOINT);
    for (let k = 0; k < 3; k++) box('stone', d.u0 - 0.35 - k * 0.3, d.u1 + 0.35 + k * 0.3, top + k * 0.32, top + (k + 1) * 0.32 - 0.02, FACADE_V - 0.12 - k * 0.1, FACADE_V + 0.3, tmp.copy(COPING).multiplyScalar(1 - k * 0.04).clone());
    for (const e of [d.u0, d.u1]) box('stone', e - (e === d.u0 ? 0.5 : 0), e + (e === d.u1 ? 0.5 : 0), H.z, top, FACADE_V - 0.18, FACADE_V + 0.3, stoneTint(H.z + 1, H.z, COPING));
    box('stone', d.u0, d.u1, H.z - 0.05, H.z + 0.06, FACADE_V - 0.25, FACADE_V + 1.3, STEP.clone());
    if (d.kind === 'great') {
      // Two bronze leaves jammed half open, inward.
      for (const s of [-1, 1]) { const hinge = s < 0 ? d.u0 : d.u1, m = tr(hinge, 0, -(FACADE_V + 0.5)).multiply(ry(s * 0.75)); box('bronze', s < 0 ? 0 : -w / 2 + 0.05, s < 0 ? w / 2 - 0.05 : 0, H.z + 0.05, top - 0.1, -0.08, 0.08, bronzeTint(), m); for (const yy of [1.2, 2.6, 3.8]) box('bronze', s < 0 ? 0.1 : -w / 2 + 0.15, s < 0 ? w / 2 - 0.15 : -0.1, H.z + yy, H.z + yy + 0.12, -0.13, -0.08, bronzeTint(), m); }
    } else if (d.kind === 'sealed') {
      // The sealed door: a bronze slab flush in its frame, a gear rosette at its heart, its teeth blocks round it.
      box('bronze', d.u0 + 0.04, d.u1 - 0.04, H.z + 0.05, top - 0.05, FACADE_V + 0.1, FACADE_V + 0.3, bronzeTint());
      const cu = (d.u0 + d.u1) / 2, cy = H.z + d.height * 0.55, ring = new THREE.TorusGeometry(0.9, 0.12, 6, 16); ring.translate(cu, cy, -(FACADE_V + 0.05)); add('bronze', ring, bronzeTint());
      const hub = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 8); hub.rotateX(Math.PI / 2); hub.translate(cu, cy, -(FACADE_V + 0.02)); add('bronze', hub, bronzeTint());
      for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2, g = new THREE.BoxGeometry(0.22, 0.26, 0.16); g.translate(0, 1.08, 0); g.rotateZ(a); g.translate(cu, cy, -(FACADE_V + 0.05)); add('bronze', g, bronzeTint()); }
      for (let k = 0; k < 4; k++) { const a = (k / 4) * Math.PI * 2 + 0.4, g = new THREE.BoxGeometry(0.1, 0.62, 0.1); g.translate(0, 0.5, 0); g.rotateZ(a); g.translate(cu, cy, -(FACADE_V + 0.03)); add('bronze', g, bronzeTint()); }
    }
  }
  // Pilasters between the doors: a shaft standing out of the face, a bronze capital band; the frieze band across; the stepped cornice.
  for (const u of [-33, -14.5, -8, 8, 19.3, 33]) {
    const base = Math.abs(u) > H.hw ? sideBase : H.z;
    let y = base; while (y < FACADE_TOP - 2.2) { const ch = Math.min(rr(0.7, 1.0), FACADE_TOP - 2.2 - y); box('stone', u - 0.55, u + 0.55, y, y + ch - JOINT_W, FACADE_V - 0.45, FACADE_V, stoneTint(y, base, COPING)); y += ch; }
    box('bronze', u - 0.62, u + 0.62, FACADE_TOP - 2.2, FACADE_TOP - 1.95, FACADE_V - 0.52, FACADE_V, bronzeTint());
    box('stone', u - 0.65, u + 0.65, base, base + 0.5, FACADE_V - 0.55, FACADE_V, stoneTint(base, base - 1, COPING));
  }
  box('stone', -FACADE_HW, FACADE_HW, FACADE_TOP - 1.95, FACADE_TOP - 0.85, FACADE_V - 0.2, FACADE_V + 0.5, tmp.copy(STONE).multiplyScalar(0.86).clone());
  for (const y of [FACADE_TOP - 1.95, FACADE_TOP - 0.93]) box('bronze', -FACADE_HW, FACADE_HW, y, y + 0.08, FACADE_V - 0.26, FACADE_V, bronzeTint());
  for (let k = 0; k < 3; k++) { const y = FACADE_TOP - 0.85 + k * 0.3; let u = -FACADE_HW - k * 0.2; while (u < FACADE_HW + k * 0.2) { const l = Math.min(rr(2, 3.5), FACADE_HW + k * 0.2 - u); if (rand() > 0.06 * (k + 1)) box('stone', u, u + l - 0.03, y, y + 0.28, FACADE_V - 0.25 - k * 0.22, FACADE_V + FACADE_D + 0.4, tmp.copy(COPING).multiplyScalar(1 - k * 0.03 + (rand() - 0.5) * 0.08).clone()); u += l; } }

  // ── the Ever-Hearth (holdFurniture.ts) on the hearth terrace, its gas line running to the Great Door; its +z toward the door (+v) ──
  const hearth = createEverHearth(seed); hearth.group.position.set(HEARTH.u, H.z, -HEARTH.v); hearth.group.rotation.y = Math.PI; root.add(hearth.group);
  box('bronze', HEARTH.u - 0.09, HEARTH.u + 0.09, H.z + 0.07, H.z + 0.25, HEARTH.v + 6, FACADE_V + 1.2, bronzeTint());
  // ── merged per material ──
  const mats: Record<Kind, THREE.Material> = {
    stone: new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.95, flatShading: true }),
    bronze: new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: 0.42, metalness: 0.55, flatShading: true }),
    dark: new THREE.MeshBasicMaterial({ color: '#070605' }),
    paving: new THREE.MeshStandardMaterial({ map: paveTex, vertexColors: true, roughness: 1 }),
    soil: new THREE.MeshStandardMaterial({ map: soilTex, color: '#ffffff', roughness: 1 }),
  };
  let triangles = 0, draws = 0; const geoms: THREE.BufferGeometry[] = [];
  for (const k of Object.keys(parts) as Kind[]) {
    const list = parts[k]; if (!list.length) continue;
    for (const g of list) { for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv', 'color'].includes(name)) g.deleteAttribute(name); if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2)); if (!g.attributes.color) paint(g, new THREE.Color(1, 1, 1)); }
    const merged = mergeGeometries(list, false); list.forEach(g => g.dispose()); if (!merged) continue;
    merged.computeBoundingSphere(); geoms.push(merged);
    const mesh = new THREE.Mesh(merged, mats[k]); mesh.name = `hold-${k}`; mesh.castShadow = k === 'stone' || k === 'bronze'; mesh.receiveShadow = k !== 'dark'; root.add(mesh);
    triangles += merged.attributes.position.count / 3; draws++;
  }
  return {
    root, get triangles() { return triangles; }, get draws() { return draws; },
    update(time, dt, night) { hearth.update(time, dt, night); },
    dispose() { hearth.dispose(); root.removeFromParent(); geoms.forEach(g => g.dispose()); Object.values(mats).forEach(m => m.dispose()); paveTex.dispose(); soilTex.dispose(); },
  };
}

/** Flagstones: irregular courses of rectangles in warm grey, dark joints, worn speckle; tiles every 4 m. */
function flagTexture(seed: number): THREE.CanvasTexture {
  const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d')!, rand = mulberry32(seed * 31 + 7);
  g.fillStyle = '#5d5446'; g.fillRect(0, 0, S, S);
  let y = 0; while (y < S) { const h = Math.min(S - y, 70 + rand() * 70); let x = -rand() * 80; while (x < S) { const w = 80 + rand() * 120, l = 150 + rand() * 34; g.fillStyle = `rgb(${l},${l - 22 - rand() * 8},${l - 52 - rand() * 12})`; g.fillRect(x + 4, y + 4, w - 8, h - 8); if (x + w > S) { g.fillRect(x + 4 - S, y + 4, w - 8, h - 8); } x += w; } y += h; }
  for (let k = 0; k < 2600; k++) { const a = rand() * 0.14; g.fillStyle = rand() < 0.5 ? `rgba(40,34,26,${a})` : `rgba(255,248,230,${a})`; g.fillRect(rand() * S, rand() * S, 2 + rand() * 4, 2 + rand() * 4); }
  for (let k = 0; k < 14; k++) { g.strokeStyle = 'rgba(50,42,32,0.55)'; g.lineWidth = 1.5; g.beginPath(); let x = rand() * S, yy = rand() * S; g.moveTo(x, yy); for (let q = 0; q < 5; q++) { x += (rand() - 0.5) * 40; yy += (rand() - 0.5) * 40; g.lineTo(x, yy); } g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
/** Dry soil: dusty brown, cracked into plates; tiles every 5 m. */
function soilTexture(seed: number): THREE.CanvasTexture {
  const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d')!, rand = mulberry32(seed * 53 + 11);
  g.fillStyle = '#8c6b47'; g.fillRect(0, 0, S, S);
  for (let k = 0; k < 900; k++) { const a = 0.05 + rand() * 0.12; g.fillStyle = rand() < 0.5 ? `rgba(70,50,30,${a})` : `rgba(200,170,130,${a})`; const r = 4 + rand() * 18; g.beginPath(); g.arc(rand() * S, rand() * S, r, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = 'rgba(45,30,18,0.75)'; g.lineWidth = 2;
  for (let k = 0; k < 90; k++) { let x = rand() * S, y = rand() * S, a = rand() * Math.PI * 2; g.beginPath(); g.moveTo(x, y); for (let q = 0; q < 6; q++) { a += (rand() - 0.5) * 1.4; x += Math.cos(a) * 14; y += Math.sin(a) * 14; g.lineTo(x, y); } g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
