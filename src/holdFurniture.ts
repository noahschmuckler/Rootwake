// The Hearth-Hold's stone furniture and its Ever-Hearth (hold.html judges them). The Hold is an ancient masonwork: large dressed
// blocks of warm tan-grey stone, hard horizontals, chamfered corners; dark bronze with verdigris the only metal. Nothing soft:
// everything to sit, sleep or work at is stone. Every piece is a chamfered block (or several) carrying vertex colours (per-block
// shade, a darker foot, grime), so a caller merges any number of them into one stone mesh. Origins at the floor centre, fronts -z.
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from './colors';

// ── materials ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
let stoneShared: THREE.MeshStandardMaterial | null = null, bronzeShared: THREE.MeshStandardMaterial | null = null;
/** The Hold's stone: white under its vertex colours, flat-shaded, nearly matte. Shared; don't dispose it per piece. */
export function stoneMaterial(): THREE.MeshStandardMaterial { return stoneShared ??= new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, flatShading: true, roughness: 0.95, metalness: 0 }); }
/** Dark bronze, its verdigris in the vertex colours. Shared. */
export function bronzeMaterial(): THREE.MeshStandardMaterial { return bronzeShared ??= new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, flatShading: true, roughness: 0.45, metalness: 0.55 }); }

/** The stone's base colour and the bronze's (and its verdigris). Tuning. */
export const STONE_BASE = '#cf9f68', BRONZE_BASE = '#5e4426', VERDIGRIS = '#5f9a82';
/** How far (0..1) a block's shade wanders, and how much darker its foot runs. Tuning. */
const SHADE_VAR = 0.16, FOOT_DARK = 0.22;

// ── the block ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
/** A box w×h×d, every edge chamfered by c, its base at y = 0 and centred on x, z (so ~44 triangles). Non-indexed, normals only. */
export function chamferBox(w: number, h: number, d: number, c: number): THREE.BufferGeometry {
  c = Math.min(c, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
  const x = w / 2, y = h / 2, z = d / 2, pts: THREE.Vector3[] = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    pts.push(new THREE.Vector3(sx * x, sy * (y - c), sz * (z - c)), new THREE.Vector3(sx * (x - c), sy * y, sz * (z - c)), new THREE.Vector3(sx * (x - c), sy * (y - c), sz * z));
  }
  const g = new ConvexGeometry(pts); g.translate(0, y, 0); g.deleteAttribute('uv'); return g;
}
/** Paints a block: one shade for the whole block (its own stone), darker toward its foot (yFoot..yFoot+0.6 in world), and a
 *  little per-vertex grime, so neighbouring blocks read as separate stones without any geometry noise. */
function paint(g: THREE.BufferGeometry, base: THREE.Color, rand: () => number, yFoot = 0): THREE.BufferGeometry {
  const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3);
  const k = 1 + (rand() * 2 - 1) * SHADE_VAR, warm = (rand() * 2 - 1) * 0.03;
  for (let i = 0; i < p.count; i++) {
    const fy = Math.min(1, Math.max(0, (p.getY(i) - yFoot) / 0.6)), foot = 1 - FOOT_DARK * (1 - fy);
    const h = Math.sin(p.getX(i) * 12.9898 + p.getY(i) * 78.233 + p.getZ(i) * 37.719) * 43758.5453, grime = 1 - 0.07 * (h - Math.floor(h));
    const m = k * foot * grime;
    col[i * 3] = base.r * m * (1 + warm); col[i * 3 + 1] = base.g * m; col[i * 3 + 2] = base.b * m * (1 - warm);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g;
}
const STONE_LIN = new THREE.Color(STONE_BASE);
/** One stone: a chamfered block at (px, py, pz) (its base), turned by ry about y and tilted by rx about x, painted. */
function stone(rand: () => number, w: number, h: number, d: number, px: number, py: number, pz: number, c = 0.04, rx = 0, ry = 0, base = STONE_LIN): THREE.BufferGeometry {
  const g = chamferBox(w, h, d, c);
  if (rx) g.rotateX(rx); if (ry) g.rotateY(ry);
  g.translate(px, py, pz); return paint(g, base, rand, 0);
}
const join = (parts: THREE.BufferGeometry[]): THREE.BufferGeometry => { const g = mergeGeometries(parts, false)!; for (const p of parts) p.dispose(); return g; };

// ── the furniture kit ──────────────────────────────────────────────────────────────────────────────────────────────────────
/** Seat heights and table heights (m): a hobbit's seat, a table at a standing hobbit's chest. Tuning. */
export const SEAT_H = 0.45, TABLE_H = 0.8;

/** A bench: a slab seat (SEAT_H, 0.5 deep) on two blocky legs, `len` long along x. */
export function stoneBench(len = 3, seed = 1): THREE.BufferGeometry {
  const r = mulberry32(seed * 101 + 7), slab = 0.13, legW = Math.min(0.4, len * 0.14), inset = Math.min(0.35, len * 0.1);
  return join([
    stone(r, len, slab, 0.5, 0, SEAT_H - slab, 0, 0.035),
    stone(r, legW, SEAT_H - slab, 0.42, -len / 2 + inset + legW / 2, 0, 0, 0.03),
    stone(r, legW, SEAT_H - slab, 0.42, len / 2 - inset - legW / 2, 0, 0, 0.03),
  ]);
}
/** A long table: a slab top (TABLE_H, 1.4 wide) on block piers, `len` long along x; a pier at least every 3 m. */
export function stoneTable(len = 9, seed = 2): THREE.BufferGeometry {
  const r = mulberry32(seed * 101 + 11), top = 0.16, n = Math.max(2, Math.ceil(len / 3) + 1), parts: THREE.BufferGeometry[] = [];
  // The top as stones laid end to end (no stone over 4.5 m), so its joins show.
  const slabs = Math.max(1, Math.ceil(len / 4.5)), sl = len / slabs;
  for (let i = 0; i < slabs; i++) parts.push(stone(r, sl - 0.015, top, 1.4, -len / 2 + sl * (i + 0.5), TABLE_H - top, 0, 0.04));
  for (let i = 0; i < n; i++) { const x = -len / 2 + 0.45 + (len - 0.9) * i / (n - 1); parts.push(stone(r, 0.42, TABLE_H - top, 0.95, x, 0, 0, 0.04)); }
  return join(parts);
}
/** A desk, 2.4 × 1.2 and TABLE_H high: a pedestal at each end, a top tilted toward the writer (front -z low), a raised back lip. */
export function stoneDesk(seed = 3): THREE.BufferGeometry {
  const r = mulberry32(seed * 101 + 13), w = 2.4, d = 1.2, tilt = 0.14;
  return join([
    stone(r, 0.55, TABLE_H - 0.14, d - 0.1, -w / 2 + 0.3, 0, 0, 0.04),
    stone(r, 0.55, TABLE_H - 0.14, d - 0.1, w / 2 - 0.3, 0, 0, 0.04),
    stone(r, 1.2, 0.3, d - 0.4, 0, TABLE_H - 0.45, 0.05, 0.03),
    stone(r, w, 0.12, d - 0.2, 0, TABLE_H - 0.12, -0.08, 0.03, -tilt),
    stone(r, w, 0.18, 0.22, 0, TABLE_H - 0.02, d / 2 - 0.11, 0.03),
  ]);
}
/** A single seat block, 0.8 × 0.7 × SEAT_H. */
export function blockSeat(seed = 4): THREE.BufferGeometry { const r = mulberry32(seed * 101 + 17); return join([stone(r, 0.8, SEAT_H, 0.7, 0, 0, 0, 0.05)]); }
/** A bed shelf for a niche, 2.1 (x) × 0.95, its top at 0.5: a slab on a recessed plinth, a raised headrest at the -x end. */
export function stoneBedShelf(seed = 5): THREE.BufferGeometry {
  const r = mulberry32(seed * 101 + 19), top = 0.5;
  return join([
    stone(r, 2.0, top - 0.14, 0.82, 0, 0, 0.05, 0.03),
    stone(r, 2.1, 0.14, 0.95, 0, top - 0.14, 0, 0.035),
    stone(r, 0.32, 0.16, 0.78, -2.1 / 2 + 0.2, top, 0.0, 0.04),
  ]);
}
/** A storage bin: an open-topped box 1.7 × 1.4 (x × z) and 0.9 high, its walls 0.12 thick. */
export function stoneBin(seed = 6): THREE.BufferGeometry {
  const r = mulberry32(seed * 101 + 23), w = 1.7, d = 1.4, h = 0.9, t = 0.12;
  return join([
    stone(r, w, 0.12, d, 0, 0, 0, 0.03),
    stone(r, w, h, t, 0, 0, -d / 2 + t / 2, 0.03),
    stone(r, w, h, t, 0, 0, d / 2 - t / 2, 0.03),
    stone(r, t, h - 0.02, d - 2 * t, -w / 2 + t / 2, 0, 0, 0.025),
    stone(r, t, h - 0.02, d - 2 * t, w / 2 - t / 2, 0, 0, 0.025),
  ]);
}
/** Shelves against a wall (the wall behind, at +z): three slabs on uprights 2 m tall, `len` along x, 0.45 deep. */
export function slabShelf(len = 6, seed = 7): THREE.BufferGeometry {
  const r = mulberry32(seed * 101 + 29), H = 2, D = 0.45, ups = Math.max(2, Math.ceil(len / 3) + 1), parts: THREE.BufferGeometry[] = [];
  const shelves = len > 6.5 ? 2 : 1, sl = len / shelves;
  for (let i = 0; i < ups; i++) parts.push(stone(r, 0.22, H, D, -len / 2 + 0.11 + (len - 0.22) * i / (ups - 1), 0, 0, 0.03));
  for (const y of [0.12, 0.85, 1.55]) for (let i = 0; i < shelves; i++) parts.push(stone(r, sl - 0.01, 0.09, D + 0.04, -len / 2 + sl * (i + 0.5), y, -0.02, 0.025));
  return join(parts);
}

// ── the Ever-Hearth ────────────────────────────────────────────────────────────────────────────────────────────────────────
/** The plinth's tiers (m): the lower 4.8 square and 0.45 tall, the upper 3.6 square and 0.4. */
export const HEARTH_LOWER = 4.8, HEARTH_LOWER_H = 0.45, HEARTH_UPPER = 3.6, HEARTH_UPPER_H = 0.4;
/** The plinth's top: where the bowl sits. */
export const HEARTH_TOP = HEARTH_LOWER_H + HEARTH_UPPER_H;
/** The bowl's rim radius and depth (m), its rim's teeth. */
export const BOWL_R = 1.6, BOWL_DEPTH = 0.5, BOWL_TEETH = 48, BOWL_SIDES = 16;
/** The seats' ring: radius (m) to their centres, how many, the arc they span (rad, centred on -z; the gap faces +z, the door). */
export const SEAT_RING_R = 4.2, SEAT_COUNT = 7, SEAT_ARC = Math.PI * 1.5;
/** The gas line: its radius, height of its axis, where it leaves the plinth, where it ends for the world to carry on, its valve. */
export const PIPE_R = 0.09, PIPE_Y = 0.16, PIPE_END_Z = 6, VALVE_Z = 3.5;
/** The flame's light: reach (m), its intensity by day and by night. Tuning. */
export const HEARTH_LIGHT_REACH = 10, HEARTH_LIGHT_DAY = 6, HEARTH_LIGHT_NIGHT = 28;
/** The flame's height (m) over the bowl's floor, and how many sparks rise. Tuning. */
const FLAME_H = 1.45, SPARKS = 28;

export interface EverHearth { group: THREE.Group; /** `time` s; `night` 0 by day, 1 at night. */ update(time: number, dt: number, night: number): void; dispose(): void }

/** Bronze colours a geometry: dark bronze with verdigris pooling in patches (a hash of position) and low down. */
function bronzePaint(g: THREE.BufferGeometry, seed: number, verdi = 0.45): THREE.BufferGeometry {
  if (g.index) { const n = g.toNonIndexed(); g.dispose(); g = n; }
  if (g.attributes.uv) g.deleteAttribute('uv');
  const p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3), b = new THREE.Color(BRONZE_BASE), v = new THREE.Color(VERDIGRIS), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    // Patches: two crossed waves and a finer one, so long straight parts (the pipe) still break into blotches; more low down.
    const n = Math.sin(x * 3.1 + z * 1.7 + seed) * Math.sin(z * 2.3 - y * 4.1 + seed * 1.3) + Math.sin((x - y + z) * 5.7 + seed * 2) * 0.4 + (0.3 - y) * 0.25;
    const t = Math.min(1, Math.max(0, (n - (0.55 - verdi)) * 2.2));
    c.copy(b).lerp(v, t * 0.85); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g;
}
/** The flame's tongue: a lathe of 7 sides, widest low and drawn to a point, its vertex colour fading to black at the tip
 *  (additive, so the tip melts into the air). Unit height. */
function tongue(colLow: THREE.Color, colHigh: THREE.Color): THREE.BufferGeometry {
  const prof = [[0, 0], [0.42, 0.06], [0.5, 0.22], [0.42, 0.45], [0.26, 0.7], [0.1, 0.9], [0, 1]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 7), p = g.attributes.position as THREE.BufferAttribute, col = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); c.copy(colLow).lerp(colHigh, Math.min(1, y * 1.15)).multiplyScalar(Math.max(0, 1 - Math.pow(y, 1.6))); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.deleteAttribute('uv'); return g;
}

export function createEverHearth(seed = 1): EverHearth {
  const group = new THREE.Group(); group.name = 'ever-hearth';
  const rand = mulberry32(seed * 977 + 3), disposables: { dispose(): void }[] = [];
  // ── stone: the two tiers (each a ring of dressed blocks round a core, so the joins read), the seats ──
  const st: THREE.BufferGeometry[] = [];
  const tier = (size: number, h: number, y: number, n: number): void => {
    // A course of n blocks along each side, with a heavier block at each corner: the blocks' shades give the joins.
    const cs = size / (n + 0.6), corner = cs * 1.3, side = (size - 2 * corner) / (n - 2 + 1e-9);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) st.push(stone(rand, corner, h, corner, sx * (size - corner) / 2, y, sz * (size - corner) / 2, 0.06));
    for (let i = 0; i < n - 2; i++) {
      const a = -size / 2 + corner + side * (i + 0.5);
      st.push(stone(rand, side - 0.02, h, corner, a, y, -(size - corner) / 2, 0.06), stone(rand, side - 0.02, h, corner, a, y, (size - corner) / 2, 0.06));
      st.push(stone(rand, corner, h, side - 0.02, -(size - corner) / 2, y, a, 0.06), stone(rand, corner, h, side - 0.02, (size - corner) / 2, y, a, 0.06));
    }
    st.push(stone(rand, size - 2 * corner + 0.02, h - 0.02, size - 2 * corner + 0.02, 0, y, 0, 0.01));
  };
  tier(HEARTH_LOWER, HEARTH_LOWER_H, 0, 5);
  tier(HEARTH_UPPER, HEARTH_UPPER_H, HEARTH_LOWER_H, 4);
  for (let i = 0; i < SEAT_COUNT; i++) {
    const th = -SEAT_ARC / 2 + SEAT_ARC * i / (SEAT_COUNT - 1), x = Math.sin(th) * SEAT_RING_R, z = -Math.cos(th) * SEAT_RING_R;
    st.push(stone(rand, 1.4, SEAT_H, 0.8, x, 0, z, 0.06, 0, Math.PI - th));
  }
  // The gas line's stone chocks under the pipe.
  for (const z of [2.9, 4.6, 5.6]) st.push(stone(rand, 0.42, PIPE_Y - PIPE_R + 0.01, 0.26, 0, 0, z, 0.03));
  const stoneGeo = join(st); disposables.push(stoneGeo);
  const stoneMesh = new THREE.Mesh(stoneGeo, stoneMaterial()); stoneMesh.name = 'hearth-stone'; group.add(stoneMesh);

  // ── bronze: the bowl (an octagonal lathe), its rim's teeth, its foot ring, the burner grate, the gas line and its valve ──
  const br: THREE.BufferGeometry[] = [];
  const y0 = HEARTH_TOP, floorY = 0.12;
  const prof = [[0.0, floorY], [0.82, floorY], [BOWL_R - 0.14, BOWL_DEPTH - 0.04], [BOWL_R - 0.1, BOWL_DEPTH], [BOWL_R, BOWL_DEPTH], [BOWL_R + 0.04, BOWL_DEPTH - 0.1], [0.95, 0.06], [0.8, 0], [0, 0]].map(([x, y]) => new THREE.Vector2(x, y));
  // Lathe winds its profile one way: inner surface (outward-up), the rim, the outer surface down to the foot.
  const bowl = new THREE.LatheGeometry(prof, BOWL_SIDES); bowl.rotateY(Math.PI / BOWL_SIDES); bowl.translate(0, y0, 0); br.push(bronzePaint(bowl, seed, 0.5));
  // The rim's gear: a band round the lip, its teeth standing out of it (blocky, wider at the root, the gear's flanks).
  const band = new THREE.CylinderGeometry(BOWL_R + 0.06, BOWL_R + 0.06, 0.16, BOWL_SIDES * 2, 1, true); band.translate(0, y0 + BOWL_DEPTH - 0.06, 0); br.push(bronzePaint(band, seed + 1, 0.45));
  const toothR = BOWL_R + 0.1;
  for (let i = 0; i < BOWL_TEETH; i++) {
    const a = i / BOWL_TEETH * Math.PI * 2, t = new THREE.CylinderGeometry(0.045, 0.075, 0.1, 4, 1); t.rotateY(Math.PI / 4); t.scale(1, 1, 1.4);
    t.rotateX(Math.PI / 2); t.rotateY(a); t.translate(Math.sin(a) * toothR, y0 + BOWL_DEPTH - 0.06, Math.cos(a) * toothR);
    br.push(bronzePaint(t, seed + i, 0.4));
  }
  const foot = new THREE.CylinderGeometry(1.05, 1.15, 0.1, 8); foot.rotateY(Math.PI / 8); foot.translate(0, y0 + 0.05, 0); br.push(bronzePaint(foot, seed + 3, 0.6));
  // The burner: a raised octagonal boss in the bowl's floor, the flame's mouth.
  const boss = new THREE.CylinderGeometry(0.42, 0.55, 0.1, 8); boss.translate(0, y0 + floorY + 0.05, 0); br.push(bronzePaint(boss, seed + 4, 0.3));
  // The gas line: from inside the plinth's +z face out to PIPE_END_Z, with flanged collars.
  const pz0 = HEARTH_LOWER / 2 - 0.25, pipe = new THREE.CylinderGeometry(PIPE_R, PIPE_R, PIPE_END_Z - pz0, 8, 16, true);
  pipe.rotateX(Math.PI / 2); pipe.translate(0, PIPE_Y, (pz0 + PIPE_END_Z) / 2); br.push(bronzePaint(pipe, seed + 5, 0.55));
  for (const z of [HEARTH_LOWER / 2 + 0.05, 4.6, PIPE_END_Z - 0.06]) { const f = new THREE.CylinderGeometry(PIPE_R * 1.55, PIPE_R * 1.55, 0.07, 8); f.rotateX(Math.PI / 2); f.translate(0, PIPE_Y, z); br.push(bronzePaint(f, seed + z, 0.5)); }
  // The valve: a squared body on the pipe, a stem, and a seized wheel (a torus and four spokes), stuck a little askew.
  const body = new THREE.BoxGeometry(0.3, 0.3, 0.36); body.translate(0, PIPE_Y + 0.02, VALVE_Z); br.push(bronzePaint(body, seed + 6, 0.6));
  const stem = new THREE.CylinderGeometry(0.03, 0.03, 0.34, 6); stem.translate(0, PIPE_Y + 0.3, VALVE_Z); br.push(bronzePaint(stem, seed + 7, 0.5));
  const wheel: THREE.BufferGeometry[] = [new THREE.TorusGeometry(0.26, 0.032, 5, 12)];
  for (let k = 0; k < 4; k++) { const s = new THREE.BoxGeometry(0.5, 0.028, 0.028); s.rotateZ(k * Math.PI / 4 * 2 + 0.3); wheel.push(s); }
  const hub = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 6); hub.rotateX(Math.PI / 2); wheel.push(hub);
  const wg = mergeGeometries(wheel.map(w => { const n = w.index ? w.toNonIndexed() : w; if (n !== w) w.dispose(); n.deleteAttribute('uv'); return n; }), false)!;
  wg.rotateX(-Math.PI / 2 + 0.12); wg.rotateZ(0.08); wg.translate(0, PIPE_Y + 0.47, VALVE_Z); br.push(bronzePaint(wg, seed + 8, 0.7));
  const bronzeGeo = mergeGeometries(br.map(g => { if (g.index) { const n = g.toNonIndexed(); g.dispose(); return n; } return g; }), false)!; for (const g of br) g.dispose(); disposables.push(bronzeGeo);
  const bronzeMesh = new THREE.Mesh(bronzeGeo, bronzeMaterial()); bronzeMesh.name = 'hearth-bronze'; group.add(bronzeMesh);

  // ── the flame: three instanced layers of tongues (gas-blue base, orange body, pale core), additive; sparks rising ──
  const add = (): THREE.MeshBasicMaterial => new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false });
  const fy = y0 + floorY + 0.09;
  const layers = [
    // [geometry colours low→high, count, ring radius, height, width]
    { geo: tongue(new THREE.Color('#2f6bff'), new THREE.Color('#3fb0ff')), n: 9, ring: 0.36, h: 0.36, w: 0.34, k: 0.6 },
    { geo: tongue(new THREE.Color('#c8501a'), new THREE.Color('#f0a336')), n: 7, ring: 0.2, h: FLAME_H, w: 0.6, k: 0.42 },
    { geo: tongue(new THREE.Color('#fde6a6'), new THREE.Color('#f8c070')), n: 3, ring: 0.08, h: FLAME_H * 0.55, w: 0.36, k: 0.45 },
  ].map((L, li) => {
    const m = add(); m.opacity = L.k; disposables.push(L.geo, m);
    const mesh = new THREE.InstancedMesh(L.geo, m, L.n); mesh.frustumCulled = false; mesh.name = `hearth-flame-${li}`; group.add(mesh);
    const seeds = Array.from({ length: L.n }, () => ({ ph: rand() * 6.28, f: 0.8 + rand() * 0.8, hk: 0.75 + rand() * 0.45 }));
    return { ...L, mesh, seeds };
  });
  const dummy = new THREE.Object3D();
  // Sparks: a few dozen points rising from the core, reborn at the bowl.
  const sparkPos = new Float32Array(SPARKS * 3), sparkLife = new Float32Array(SPARKS), sparkVel = new Float32Array(SPARKS * 3);
  const sparkGeo = new THREE.BufferGeometry(); sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({ color: '#ffc46a', size: 0.06, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
  const sparks = new THREE.Points(sparkGeo, sparkMat); sparks.frustumCulled = false; sparks.name = 'hearth-sparks'; group.add(sparks); disposables.push(sparkGeo, sparkMat);
  const respawn = (i: number, life: number): void => {
    const a = rand() * 6.28, r = rand() * 0.35; sparkPos[i * 3] = Math.cos(a) * r; sparkPos[i * 3 + 1] = fy + 0.3 + rand() * 0.6; sparkPos[i * 3 + 2] = Math.sin(a) * r;
    sparkVel[i * 3] = (rand() - 0.5) * 0.3; sparkVel[i * 3 + 1] = 0.9 + rand() * 1.1; sparkVel[i * 3 + 2] = (rand() - 0.5) * 0.3; sparkLife[i] = life;
  };
  for (let i = 0; i < SPARKS; i++) respawn(i, rand() * 2.2);

  // ── the light: warm, over the bowl, brighter at night, its flicker the flame's ──
  const light = new THREE.PointLight('#ffa64a', HEARTH_LIGHT_DAY, HEARTH_LIGHT_REACH, 1.6); light.position.set(0, y0 + 1.3, 0); group.add(light);
  const glow = new THREE.PointLight('#ff8a30', 0, 4, 2); glow.position.set(0, y0 + 0.35, 0); group.add(glow);

  function update(time: number, dt: number, night: number): void {
    const t = time;
    // The flame's breath: one slow sway for the whole column (a draught off the mountain), each tongue its own flicker.
    const swayX = Math.sin(t * 0.7) * 0.06 + Math.sin(t * 1.9) * 0.03, swayZ = Math.cos(t * 0.53) * 0.05 + Math.sin(t * 2.3 + 1) * 0.025;
    const pulse = 1 + Math.sin(t * 9.3) * 0.04 + Math.sin(t * 13.7 + 2) * 0.03 + Math.sin(t * 3.1) * 0.05;
    for (const L of layers) {
      for (let i = 0; i < L.n; i++) {
        const s = L.seeds[i], a = i / L.n * Math.PI * 2 + t * 0.35, central = L.n === 7 && i === 0;
        const r = central ? 0 : L.ring, fl = 1 + Math.sin(t * 7 * s.f + s.ph) * 0.14 + Math.sin(t * 15.3 * s.f + s.ph * 2) * 0.07;
        const h = L.h * s.hk * fl * pulse * (central ? 1.18 : 1), w = L.w * (0.85 + 0.15 * Math.sin(t * 5 * s.f + s.ph));
        dummy.position.set(Math.cos(a) * r, fy, Math.sin(a) * r);
        dummy.rotation.set(swayZ * (h / FLAME_H) + Math.sin(t * 4.1 * s.f + s.ph) * 0.05 + (central ? 0 : Math.sin(a) * 0.12), 0, -swayX * (h / FLAME_H) + Math.cos(t * 3.7 * s.f + s.ph) * 0.05 - (central ? 0 : Math.cos(a) * 0.12));
        dummy.scale.set(w, h, w); dummy.updateMatrix(); L.mesh.setMatrixAt(i, dummy.matrix);
      }
      L.mesh.instanceMatrix.needsUpdate = true;
    }
    for (let i = 0; i < SPARKS; i++) {
      sparkLife[i] -= dt; if (sparkLife[i] <= 0) { respawn(i, 1.2 + rand() * 1.4); continue; }
      sparkVel[i * 3] += (Math.sin(t * 2 + i) * 0.4 + swayX * 3) * dt; sparkVel[i * 3 + 2] += (Math.cos(t * 1.7 + i * 1.3) * 0.4 + swayZ * 3) * dt;
      sparkPos[i * 3] += sparkVel[i * 3] * dt; sparkPos[i * 3 + 1] += sparkVel[i * 3 + 1] * dt; sparkPos[i * 3 + 2] += sparkVel[i * 3 + 2] * dt;
    }
    (sparkGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    const flick = 0.88 + 0.07 * Math.sin(t * 8.7) + 0.05 * Math.sin(t * 17.1 + 1.3);
    light.intensity = (HEARTH_LIGHT_DAY + (HEARTH_LIGHT_NIGHT - HEARTH_LIGHT_DAY) * night) * flick * pulse;
    light.position.set(swayX * 2, y0 + 1.3, swayZ * 2);
    glow.intensity = (3 + 9 * night) * flick;
    sparkMat.opacity = 0.55 + 0.4 * night;
  }
  update(0, 0, 0);
  return { group, update, dispose() { group.removeFromParent(); for (const d of disposables) d.dispose(); } };
}
