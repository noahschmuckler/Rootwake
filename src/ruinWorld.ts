// The wards drawn and stood on (RUINS.md; ruinsModel.ts holds their plan): weathered stone courses rising out of a
// level earthwork, moss on their tops, the tower's door clogged with her black growth, faint runes humming in the
// tower's faces, and the glyph-plates glowing in the stone, a pale pillar of light over each one she hasn't read, so
// the climb to it shows from below. As a field, near a ward its ground and its solids are hers (as the dens are).
import * as THREE from 'three';
import { type Ward, type Plate, WARD, earthAt, wardGround, wardOccupy, outside } from './ruinsModel';
import { mulberry32 } from './colors';

/** How near (m) to a plate her feet must come to read it, and how far under or over it. Tuning. */
export const READ_R = 0.75, READ_DY = 0.45;
/** How deep (m) the stone runs into the earthwork below the court. */
const SUNK = 1.6;

type Rect = { x0: number; x1: number; z0: number; z1: number };
/** A rectangle less its cuts, as rectangles. */
function minus(r: Rect, cuts: Rect[]): Rect[] {
  let out = [r];
  for (const c of cuts) {
    const next: Rect[] = [];
    for (const a of out) {
      if (c.x1 <= a.x0 || c.x0 >= a.x1 || c.z1 <= a.z0 || c.z0 >= a.z1) { next.push(a); continue; }
      if (c.x0 > a.x0) next.push({ ...a, x1: c.x0 }); if (c.x1 < a.x1) next.push({ ...a, x0: c.x1 });
      const x0 = Math.max(a.x0, c.x0), x1 = Math.min(a.x1, c.x1);
      if (c.z0 > a.z0) next.push({ x0, x1, z0: a.z0, z1: c.z0 }); if (c.z1 < a.z1) next.push({ x0, x1, z0: c.z1, z1: a.z1 });
    }
    out = next;
  }
  return out;
}

/** A stone texture: courses of dressed blocks, worn and stained. */
function stoneTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d')!, rand = mulberry32(77);
  g.fillStyle = '#8d8a7c'; g.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 8; row++) {
    const off = (row % 2) * 32;
    for (let col = -1; col < 5; col++) {
      const x = col * 64 + off, y = row * 32, l = 118 + rand() * 30;
      g.fillStyle = `rgb(${l},${l - 4},${l - 16})`; g.fillRect(x + 2, y + 2, 60, 28);
      if (rand() < 0.35) { g.fillStyle = `rgba(52,70,44,${0.25 + rand() * 0.3})`; g.fillRect(x + 2, y + 18 + rand() * 8, 60, 6 + rand() * 6); }
    }
  }
  for (let i = 0; i < 900; i++) { const v = rand() * 60; g.fillStyle = `rgba(${v},${v},${v},0.12)`; g.fillRect(rand() * 256, rand() * 256, 2, 2); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

/** A box from y0 to y1 over a rectangle, its UVs in metres (so the courses keep their size on every face). */
function block(r: Rect, y0: number, y1: number, perM: number): THREE.BufferGeometry {
  const w = r.x1 - r.x0, h = y1 - y0, d = r.z1 - r.z0, g = new THREE.BoxGeometry(w, h, d);
  g.translate((r.x0 + r.x1) / 2, (y0 + y1) / 2, (r.z0 + r.z1) / 2);
  const p = g.attributes.position as THREE.BufferAttribute, n = g.attributes.normal as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const nx = Math.abs(n.getX(i)), ny = Math.abs(n.getY(i));
    const a = ny > 0.5 ? p.getX(i) : nx > 0.5 ? p.getZ(i) : p.getX(i), b = ny > 0.5 ? p.getZ(i) : p.getY(i);
    uv.setXY(i, a * perM, b * perM);
  }
  return g;
}

/** Her growth in the door: black tubes writhing out of the dark, thickest at the frame's foot. */
function growth(rand: () => number): THREE.BufferGeometry[] {
  const out: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 9; i++) {
    const pts: THREE.Vector3[] = [], x0 = (rand() - 0.5) * 0.7, y0 = rand() * 1.0;
    for (let k = 0; k < 5; k++) pts.push(new THREE.Vector3(x0 + (rand() - 0.5) * 0.5 + Math.sin(k + i) * 0.12, Math.min(1.05, Math.max(0.02, y0 + (rand() - 0.5) * 0.6)), -0.15 + k * 0.08));
    out.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 0.035 + rand() * 0.05, 6, false));
  }
  return out;
}

const merge = (gs: THREE.BufferGeometry[]): THREE.BufferGeometry => {
  // Every part here is non-indexed or indexed alike per kind; merge by concatenation of their attributes.
  const ng = gs.map(g => (g.index ? g.toNonIndexed() : g)); const keys = ['position', 'normal', 'uv'].filter(k => ng.every(g => g.attributes[k]));
  const out = new THREE.BufferGeometry();
  for (const k of keys) { const size = ng[0].attributes[k].itemSize, total = ng.reduce((n, g) => n + g.attributes[k].count, 0), arr = new Float32Array(total * size); let o = 0; for (const g of ng) { arr.set(g.attributes[k].array as Float32Array, o); o += g.attributes[k].count * size; } out.setAttribute(k, new THREE.BufferAttribute(arr, size)); }
  return out;
};

export interface WardField {
  wards: Ward[];
  /** Her ground at x, z where a ward stands (every top there), else null. */
  surfacesAt(x: number, z: number): number[] | null;
  canOccupy(p: THREE.Vector3, radius: number, height: number): boolean | null;
  /** Each frame: the plates glow; returns a plate she stands on that she hasn't read (and marks it read). */
  update(feet: THREE.Vector3, time: number): Plate | null;
  readonly read: ReadonlySet<string>;
  /** The ward whose earthwork she stands on, if any. */
  wardAt(x: number, z: number): Ward | null;
  group: THREE.Group;
  /** The light over each unread plate turns to face the view about its upright: the camera's yaw, each frame. */
  face(yaw: number): void;
}

export function createWardField(parent: THREE.Object3D, wards: Ward[], land: (x: number, z: number) => number, read: Set<string> = new Set(), onRead?: (ids: Set<string>) => void): WardField {
  const group = new THREE.Group(); group.name = 'wards'; parent.add(group);
  const tex = stoneTexture();
  const stone = new THREE.MeshStandardMaterial({ map: tex, color: '#ebe6d4', roughness: 0.95, flatShading: true });
  const moss = new THREE.MeshStandardMaterial({ map: tex, color: '#9aa87a', roughness: 1 });
  const earth = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, vertexColors: true });
  const dark = new THREE.MeshBasicMaterial({ color: '#050307' });
  const grow = new THREE.MeshStandardMaterial({ color: '#160b1c', roughness: 0.35, metalness: 0.1, emissive: '#2a0628', emissiveIntensity: 0.6 });
  const rune = new THREE.MeshBasicMaterial({ color: '#8fe8ff', transparent: true, opacity: 0.35, depthWrite: false });
  const glyph = new THREE.MeshBasicMaterial({ color: '#bff6ff', transparent: true, opacity: 0.9 });
  const beamTex = (() => { const c = document.createElement('canvas'); c.width = 16; c.height = 128; const g = c.getContext('2d')!; const gr = g.createLinearGradient(0, 128, 0, 0); gr.addColorStop(0, 'rgba(190,245,255,0.85)'); gr.addColorStop(1, 'rgba(190,245,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 16, 128); const h = g.createLinearGradient(0, 0, 16, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(0.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = h; g.fillRect(0, 0, 16, 128); return new THREE.CanvasTexture(c); })();
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const plates: { plate: Plate; mesh: THREE.Mesh; beam: THREE.Mesh }[] = [], growths: THREE.Mesh[] = [];

  for (const w of wards) {
    const g = new THREE.Group(); g.name = `ward:${w.id}`; group.add(g); const rand = mulberry32((w.x * 31 + w.z * 17) >>> 0);
    // The earthwork: the court and its skirt down to the land, soil darkening into moss at its top.
    const R = WARD.court + w.skirt, N = Math.ceil((2 * R) / 0.5), eg = new THREE.PlaneGeometry(2 * R, 2 * R, N, N); eg.rotateX(-Math.PI / 2);
    const ep = eg.attributes.position as THREE.BufferAttribute, cols = new Float32Array(ep.count * 3), c0 = new THREE.Color('#7f7a62'), c1 = new THREE.Color('#6b6352'), cc = new THREE.Color();
    for (let i = 0; i < ep.count; i++) { const x = w.x + ep.getX(i), z = w.z + ep.getZ(i), l = land(x, z), y = earthAt(w, x, z, l) ?? l; ep.setY(i, y - 0.02); ep.setX(i, x); ep.setZ(i, z); cc.lerpColors(c0, c1, Math.min(1, outside(w, x, z) / Math.max(0.1, w.skirt)) * 0.8 + rand() * 0.2); cols.set([cc.r, cc.g, cc.b], i * 3); }
    eg.setAttribute('color', new THREE.BufferAttribute(cols, 3)); eg.computeVertexNormals();
    const em = new THREE.Mesh(eg, earth); em.receiveShadow = true; g.add(em);
    // The stone: each block less its cuts, sunk into the earthwork; its top a moss slab.
    const sides: THREE.BufferGeometry[] = [], tops: THREE.BufferGeometry[] = [];
    for (const b of w.blocks) for (const r of minus(b, b.cuts)) { sides.push(block(r, w.y0 - SUNK, b.top - 0.04, 0.9)); tops.push(block({ x0: r.x0 + 0.02, x1: r.x1 - 0.02, z0: r.z0 + 0.02, z1: r.z1 - 0.02 }, b.top - 0.04, b.top, 0.9)); }
    const sm = new THREE.Mesh(merge(sides), stone), tm = new THREE.Mesh(merge(tops), moss); sm.geometry.computeVertexNormals(); for (const m of [sm, tm]) { m.castShadow = m.receiveShadow = true; g.add(m); }
    // The tower's door, toward the breach: a dark frame clogged with her growth.
    const door = new THREE.Group(); door.position.set(w.door.x, w.door.y, w.door.z); door.rotation.y = w.door.yaw; g.add(door);
    const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.1), dark); hole.position.set(0, 0.56, 0.008); door.add(hole);
    const gm = new THREE.Mesh(merge(growth(rand)), grow); door.add(gm); growths.push(gm);
    for (const [x, wd] of [[-0.52, 0.18], [0.52, 0.18]] as const) { const post = new THREE.Mesh(block({ x0: x - wd / 2, x1: x + wd / 2, z0: -0.1, z1: 0.06 }, 0, 1.25, 0.9), stone); door.add(post); }
    door.add(new THREE.Mesh(block({ x0: -0.62, x1: 0.62, z0: -0.1, z1: 0.06 }, 1.12, 1.32, 0.9), stone));
    // Runes in the tower's four faces: faint strips that hum.
    const tw = w.blocks.find(b => b.kind === 'tower')!;
    for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.32 + rand() * 0.25), rune), cx = (tw.x0 + tw.x1) / 2, cz = (tw.z0 + tw.z1) / 2, hw = (tw.x1 - tw.x0) / 2 + 0.006, a = (k * Math.PI) / 2, off = (j - 1) * 0.55;
      s.position.set(cx + Math.sin(a) * hw + Math.cos(a) * off, w.y0 + (tw.top - w.y0) - 0.55 + rand() * 0.2, cz + Math.cos(a) * hw - Math.sin(a) * off); s.rotation.y = a; g.add(s);
    }
    // The glyph-plates, and a pillar of light over each unread one.
    for (const p of w.plates) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), glyph.clone()); mesh.rotation.x = -Math.PI / 2; mesh.position.set(p.x, p.y + 0.012, p.z); g.add(mesh);
      const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 3.2), beamMat.clone()); beam.position.set(p.x, p.y + 1.6, p.z); g.add(beam); beam.renderOrder = 2;
      plates.push({ plate: p, mesh, beam });
    }
  }

  const reach = (w: Ward, x: number, z: number): boolean => outside(w, x, z) < w.skirt;
  function wardAt(x: number, z: number): Ward | null { for (const w of wards) if (Math.abs(x - w.x) < WARD.court + w.skirt && Math.abs(z - w.z) < WARD.court + w.skirt && reach(w, x, z)) return w; return null; }
  function surfacesAt(x: number, z: number): number[] | null { const w = wardAt(x, z); if (!w) return null; const y = wardGround(w, x, z, land(x, z)); return y === null ? null : [y]; }
  function canOccupy(p: THREE.Vector3, radius: number): boolean | null { const w = wardAt(p.x, p.z); if (!w) return null; return wardOccupy(w, p, radius, land(p.x, p.z)); }
  const camQ = new THREE.Quaternion();
  function update(feet: THREE.Vector3, time: number): Plate | null {
    let found: Plate | null = null; const t = time / 1000;
    for (const g of growths) { const s = 1 + 0.04 * Math.sin(t * 1.3 + g.id); g.scale.set(s, 1 + 0.03 * Math.sin(t * 0.9 + g.id * 2), s); }
    rune.opacity = 0.22 + 0.12 * Math.sin(t * 2.1) + 0.05 * Math.sin(t * 13.7);
    for (const e of plates) {
      const seen = read.has(e.plate.id), m = e.mesh.material as THREE.MeshBasicMaterial, bm = e.beam.material as THREE.MeshBasicMaterial;
      m.opacity = seen ? 0.45 : 0.75 + 0.25 * Math.sin(t * 2.4 + e.plate.x);
      e.beam.visible = !seen; if (!seen) { bm.opacity = 0.55 + 0.25 * Math.sin(t * 1.7 + e.plate.z); e.beam.quaternion.copy(camQ); }
      if (!seen && !found && Math.hypot(feet.x - e.plate.x, feet.z - e.plate.z) < READ_R && Math.abs(feet.y - e.plate.y) < READ_DY) found = e.plate;
    }
    if (found) { read.add(found.id); onRead?.(read); }
    return found;
  }
  const up = new THREE.Vector3(0, 1, 0);
  return { wards, surfacesAt, canOccupy, update, read, wardAt, group, face: yaw => { camQ.setFromAxisAngle(up, yaw); } };
}
