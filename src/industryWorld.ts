// The industrial ruins drawn and stood on (RUINS.md; industryModel.ts holds their plans): each yard's earthwork with its
// slag, cullet or spoil mounded on it; its stone, brick, sand, peat and timber; and what stands about them only to be
// looked at: the furnace's arch, the mill's wheel and gear, glass in the cullet, the railbed's ties and rails and the
// water tower's tank, the charcoal burns, the cranberry beds, the cart, the stumps, the drowned street under the lake.
// The stones of lore glow amber with a pillar of light over each unread one (the wards' are pale blue).
import * as THREE from 'three';
import { mulberry32 } from './colors';
import { stoneTexture } from './ruinWorld';
import { type Yard, type Stone, type Stuff, type Decor, extentOf, outsideYard, yardEarth, yardGround, yardOccupy } from './industryModel';

/** How near (m) to a stone her feet must come to read it, and how far under or over it. Tuning. */
export const STONE_R = 0.75, STONE_DY = 0.45;
const SUNK = 1.4;
const STUFF: Record<Stuff, { side: string; top: string; tex: 'stone' | 'brick' | 'wood' | null }> = {
  ironstone: { side: '#a07a62', top: '#7d8456', tex: 'stone' }, brick: { side: '#b06a4c', top: '#7f8a58', tex: 'brick' }, fieldstone: { side: '#c4bfae', top: '#87956a', tex: 'stone' },
  sand: { side: '#e6dcc0', top: '#efe6cc', tex: null }, peat: { side: '#5a4634', top: '#6f7a3e', tex: null }, timber: { side: '#8a6a4a', top: '#9a7a54', tex: 'wood' }, gravel: { side: '#9a948a', top: '#a8a296', tex: null },
};
const EARTH: Record<string, string> = { furnace: '#6d5a48', glassworks: '#7a7058', charcoal: '#4a4036', bogDikes: '#5a4a38', paperMill: '#6d6a52', sandPit: '#d8cdb0', railbed: '#8a847a', drownedTown: '#706a58', corduroy: '#4e4a36' };
const BUMP: Record<string, THREE.Color> = { slag: new THREE.Color('#1e1c24'), cullet: new THREE.Color('#4f7a5c'), spoil: new THREE.Color('#e2d8bc') };

function canvasTex(draw: (g: CanvasRenderingContext2D, rand: () => number) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d')!; draw(g, mulberry32(51));
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; return t;
}
const brickTex = () => canvasTex((g, r) => { g.fillStyle = '#6a3a2a'; g.fillRect(0, 0, 256, 256); for (let row = 0; row < 16; row++) for (let col = -1; col < 9; col++) { const l = 150 + r() * 50; g.fillStyle = `rgb(${l},${l * 0.55},${l * 0.4})`; g.fillRect(col * 32 + (row % 2) * 16 + 1, row * 16 + 1, 30, 14); } });
const woodTex = () => canvasTex((g, r) => { g.fillStyle = '#7a5a3c'; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 8; i++) { const l = 100 + r() * 50; g.fillStyle = `rgb(${l},${l * 0.75},${l * 0.5})`; g.fillRect(0, i * 32 + 1, 256, 30); for (let k = 0; k < 30; k++) { g.fillStyle = `rgba(40,25,10,${0.15 + r() * 0.2})`; g.fillRect(r() * 256, i * 32 + r() * 30, 20 + r() * 60, 1); } } });

type Rect = { x0: number; x1: number; z0: number; z1: number };
function block(r: Rect, y0: number, y1: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(r.x1 - r.x0, y1 - y0, r.z1 - r.z0); g.translate((r.x0 + r.x1) / 2, (y0 + y1) / 2, (r.z0 + r.z1) / 2);
  const p = g.attributes.position as THREE.BufferAttribute, n = g.attributes.normal as THREE.BufferAttribute, uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) { const ny = Math.abs(n.getY(i)), nx = Math.abs(n.getX(i)); uv.setXY(i, (ny > 0.5 ? p.getX(i) : nx > 0.5 ? p.getZ(i) : p.getX(i)) * 0.9, (ny > 0.5 ? p.getZ(i) : p.getY(i)) * 0.9); }
  return g;
}
const merge = (gs: THREE.BufferGeometry[]): THREE.BufferGeometry => {
  const ng = gs.map(g => (g.index ? g.toNonIndexed() : g)), out = new THREE.BufferGeometry(), keys = ['position', 'normal', 'uv'].filter(k => ng.every(g => g.attributes[k]));
  for (const k of keys) { const size = ng[0].attributes[k].itemSize, arr = new Float32Array(ng.reduce((n, g) => n + g.attributes[k].count, 0) * size); let o = 0; for (const g of ng) { arr.set(g.attributes[k].array as Float32Array, o); o += g.attributes[k].count * size; } out.setAttribute(k, new THREE.BufferAttribute(arr, size)); }
  return out;
};

export interface IndustryField {
  yards: Yard[]; group: THREE.Group; readonly read: ReadonlySet<string>;
  surfacesAt(x: number, z: number): number[] | null;
  canOccupy(p: THREE.Vector3, radius: number): boolean | null;
  yardAt(x: number, z: number): Yard | null;
  /** Each frame: the stones glow; a stone she stands on that she hasn't read is returned (and marked read). */
  update(feet: THREE.Vector3, time: number): Stone | null;
  face(yaw: number): void;
}

export function createIndustryField(parent: THREE.Object3D, yards: Yard[], land: (x: number, z: number) => number, read: Set<string> = new Set(), onRead?: (ids: Set<string>) => void): IndustryField {
  const group = new THREE.Group(); group.name = 'industry'; parent.add(group);
  const stoneTex = stoneTexture(), tex = { stone: stoneTex, brick: brickTex(), wood: woodTex() };
  const mats = new Map<string, THREE.MeshStandardMaterial>();
  const mat = (key: string, make: () => THREE.MeshStandardMaterial) => { let m = mats.get(key); if (!m) { m = make(); mats.set(key, m); } return m; };
  const sideMat = (s: Stuff) => mat(`side:${s}`, () => new THREE.MeshStandardMaterial({ map: STUFF[s].tex ? tex[STUFF[s].tex!] : null, color: STUFF[s].side, roughness: 0.95, flatShading: true }));
  const topMat = (s: Stuff) => mat(`top:${s}`, () => new THREE.MeshStandardMaterial({ map: STUFF[s].tex === 'wood' ? tex.wood : STUFF[s].tex ? stoneTex : null, color: STUFF[s].top, roughness: 1 }));
  const earth = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, vertexColors: true });
  const iron = new THREE.MeshStandardMaterial({ color: '#5a3a2a', roughness: 0.7, metalness: 0.4 }), wood = new THREE.MeshStandardMaterial({ map: tex.wood, color: '#8a6a4a', roughness: 0.9 }), dark = new THREE.MeshBasicMaterial({ color: '#0a0806' });
  const glass = new THREE.MeshStandardMaterial({ color: '#8fe0a0', emissive: '#3a9a5a', emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.85 });
  const charred = new THREE.MeshBasicMaterial({ color: '#141210' }), bog = new THREE.MeshStandardMaterial({ color: '#5a1a22', roughness: 0.6 }), stump = new THREE.MeshStandardMaterial({ color: '#8a8378', roughness: 1 });
  const glyph = new THREE.MeshBasicMaterial({ color: '#ffd9a0', transparent: true, opacity: 0.9 });
  const beamTex = (() => { const c = document.createElement('canvas'); c.width = 16; c.height = 128; const g = c.getContext('2d')!; const gr = g.createLinearGradient(0, 128, 0, 0); gr.addColorStop(0, 'rgba(255,215,150,0.85)'); gr.addColorStop(1, 'rgba(255,215,150,0)'); g.fillStyle = gr; g.fillRect(0, 0, 16, 128); const h = g.createLinearGradient(0, 0, 16, 0); h.addColorStop(0, 'rgba(0,0,0,1)'); h.addColorStop(0.5, 'rgba(0,0,0,0)'); h.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = h; g.fillRect(0, 0, 16, 128); return new THREE.CanvasTexture(c); })();
  const beamMat = new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const stones: { stone: Stone; mesh: THREE.Mesh; beam: THREE.Mesh }[] = [];

  function decor(g: THREE.Group, d: Decor, rand: () => number): void {
    const o = new THREE.Group(); o.position.set(d.x, d.y, d.z); o.rotation.y = d.yaw; g.add(o);
    const add = (geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => { const mesh = new THREE.Mesh(geo, m); mesh.position.set(x, y, z); o.add(mesh); return mesh; };
    switch (d.kind) {
      case 'arch': { // the tuyere arch in the stack's face: dark within, ringed in voussoirs; faces back down the yard (−u)
        o.rotation.y += Math.PI; const hole = add(new THREE.CircleGeometry(0.7, 16, 0, Math.PI), dark, 0, 0.02, 0.012); hole.scale.set(1, 1.4, 1);
        const ring = add(new THREE.TorusGeometry(0.78, 0.14, 5, 12, Math.PI), sideMat('ironstone'), 0, 0.02, 0.02); ring.scale.set(1, 1.4, 1); break; }
      case 'wheel': { // the mill wheel standing in its pit, a third below the ground
        const r = 1.6 * d.size; add(new THREE.TorusGeometry(r, 0.09, 5, 20), wood, 0, r * 0.66, 0);
        for (let i = 0; i < 8; i++) { const s = add(new THREE.BoxGeometry(0.07, r * 2, 0.07), wood, 0, r * 0.66, 0); s.rotation.z = (i / 8) * Math.PI; }
        for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, p = add(new THREE.BoxGeometry(0.5, 0.05, 0.36), wood, Math.cos(a) * r, r * 0.66 + Math.sin(a) * r, 0); p.rotation.z = a; } break; }
      case 'gear': { const r = 0.8 * d.size, ge = add(new THREE.TorusGeometry(r, 0.1, 6, 18), iron, 0, 0.12, 0); ge.rotation.x = Math.PI / 2 - 0.2; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, t = add(new THREE.BoxGeometry(0.14, 0.12, 0.14), iron, Math.cos(a) * (r + 0.12), 0.12, Math.sin(a) * (r + 0.12)); t.rotation.y = -a; } break; }
      case 'shards': for (let i = 0; i < 40; i++) { const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * d.size, s = add(new THREE.TetrahedronGeometry(0.05 + rand() * 0.07), glass, Math.cos(a) * rr, 0.05 + rand() * 0.3, Math.sin(a) * rr); s.rotation.set(rand() * 6, rand() * 6, rand() * 6); } break;
      case 'ties': { const n = Math.floor((d.len ?? 20) / 0.8), geo: THREE.BufferGeometry[] = []; for (let i = 0; i < n; i++) { if (rand() < 0.12) continue; const t = new THREE.BoxGeometry(0.22, 0.12, 2.3); t.rotateY((rand() - 0.5) * 0.15); t.translate(-(d.len ?? 20) / 2 + i * 0.8, 0.04, 0); geo.push(t); } add(merge(geo), wood); break; }
      case 'rails': { const L = d.len ?? 20, geo: THREE.BufferGeometry[] = []; for (const z of [-0.72, 0.72]) for (let x = -L / 2; x < L / 2; x += 9) { if (rand() < 0.3) continue; const r = new THREE.BoxGeometry(8.6, 0.1, 0.08); r.rotateY((rand() - 0.5) * 0.04); r.translate(x + 4.5, 0.15, z); geo.push(r); } if (geo.length) add(merge(geo), iron); break; }
      case 'tank': { const t = add(new THREE.CylinderGeometry(1.6, 1.6, 1.8, 14, 1, true), wood, 0, 0.9, 0); t.material = wood; add(new THREE.CircleGeometry(1.6, 14).rotateX(-Math.PI / 2), wood, 0, 0.02, 0); for (const y of [0.3, 0.9, 1.5]) add(new THREE.TorusGeometry(1.62, 0.03, 4, 18).rotateX(Math.PI / 2), iron, 0, y, 0); const roof = add(new THREE.ConeGeometry(1.75, 0.8, 14, 1), wood, 0, 2.2, 0); roof.rotation.z = 0.12; break; }
      case 'logs': { const L = d.len, geo: THREE.BufferGeometry[] = []; if (L) { for (let x = -L / 2; x < L / 2; x += 0.3) { if (rand() < 0.06) continue; const c = new THREE.CylinderGeometry(0.12, 0.13, 2.6 + rand() * 0.6, 6); c.rotateX(Math.PI / 2); c.rotateY((rand() - 0.5) * 0.2); c.translate(x, 0.08, (rand() - 0.5) * 0.3); geo.push(c); } } else { for (let i = 0; i < 9; i++) { const c = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 6); c.rotateZ(Math.PI / 2); c.translate((rand() - 0.5) * 0.4, 0.12 + Math.floor(i / 4) * 0.22, (i % 4) * 0.25); geo.push(c); } } add(merge(geo), wood); break; }
      case 'cart': { add(new THREE.BoxGeometry(1.1, 0.45, 0.7), iron, 0, 0.42, 0); for (const [x, z] of [[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]]) add(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 10).rotateX(Math.PI / 2), iron, x, 0.17, z); break; }
      case 'sunk': { const a = d.size, t = 0.5, geo = [new THREE.BoxGeometry(a * 2, 0.6, t).translate(0, 0, -a), new THREE.BoxGeometry(a * 2, 0.6, t).translate(0, 0, a), new THREE.BoxGeometry(t, 0.6, a * 2).translate(-a, 0, 0), new THREE.BoxGeometry(t, 0.6, a * 2).translate(a, 0, 0)]; add(merge(geo), sideMat('fieldstone')); break; }
      case 'charred': add(new THREE.CircleGeometry(d.size, 14).rotateX(-Math.PI / 2), charred, 0, 0.03, 0); break;
      case 'bog': add(new THREE.PlaneGeometry(d.size * 2, d.len ?? 4).rotateX(-Math.PI / 2), bog, 0, 0.025, 0); break;
      case 'stump': add(new THREE.CylinderGeometry(0.28 * d.size, 0.36 * d.size, 0.5 * d.size, 7), stump, 0, 0.2 * d.size, 0); break;
    }
  }

  for (const y of yards) {
    const g = new THREE.Group(); g.name = `industry:${y.id}`; group.add(g); const rand = mulberry32((y.x * 17 + y.z * 31) >>> 0);
    // The earthwork, its mounds coloured as what they are.
    const [ex, ez] = extentOf(y), RX = ex + y.skirt, RZ = ez + y.skirt, eg = new THREE.PlaneGeometry(2 * RX, 2 * RZ, Math.ceil(RX * 4), Math.ceil(RZ * 4)); eg.rotateX(-Math.PI / 2);
    const ep = eg.attributes.position as THREE.BufferAttribute, cols = new Float32Array(ep.count * 3), base = new THREE.Color(EARTH[y.kind]), edge = new THREE.Color('#5a5440'), c = new THREE.Color();
    for (let i = 0; i < ep.count; i++) {
      const x = y.x + ep.getX(i), z = y.z + ep.getZ(i), l = land(x, z), h = yardEarth(y, x, z, l) ?? l; ep.setXYZ(i, x, h - 0.02, z);
      c.lerpColors(base, edge, Math.min(1, outsideYard(y, x, z) / Math.max(0.1, y.skirt)) * 0.8);
      for (const b of y.bumps) { const d = Math.hypot(x - b.x, z - b.z); if (d < b.r) c.lerp(BUMP[b.stuff], Math.min(1, (1 - d / b.r) * 1.6)); }
      c.multiplyScalar(0.92 + rand() * 0.16); cols.set([c.r, c.g, c.b], i * 3);
    }
    eg.setAttribute('color', new THREE.BufferAttribute(cols, 3)); eg.computeVertexNormals(); const em = new THREE.Mesh(eg, earth); em.receiveShadow = true; g.add(em);
    // The blocks by what they're made of: sides sunk into the earthwork, a top of moss or sand or planks.
    const byStuff = new Map<Stuff, { sides: THREE.BufferGeometry[]; tops: THREE.BufferGeometry[] }>();
    for (const b of y.blocks) { let e = byStuff.get(b.stuff); if (!e) { e = { sides: [], tops: [] }; byStuff.set(b.stuff, e); } e.sides.push(block(b, y.y0 - SUNK, b.top - 0.04)); e.tops.push(block({ x0: b.x0 + 0.02, x1: b.x1 - 0.02, z0: b.z0 + 0.02, z1: b.z1 - 0.02 }, b.top - 0.04, b.top)); }
    for (const [s, e] of byStuff) { const sm = new THREE.Mesh(merge(e.sides), sideMat(s)), tm = new THREE.Mesh(merge(e.tops), topMat(s)); for (const m of [sm, tm]) { m.castShadow = m.receiveShadow = true; g.add(m); } }
    for (const d of y.decor) decor(g, d, rand);
    for (const st of y.stones) {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), glyph.clone()); mesh.rotation.x = -Math.PI / 2; mesh.position.set(st.x, st.y + 0.012, st.z); g.add(mesh);
      const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 3.2), beamMat.clone()); beam.position.set(st.x, st.y + 1.6, st.z); beam.renderOrder = 2; g.add(beam);
      stones.push({ stone: st, mesh, beam });
    }
  }

  function yardAt(x: number, z: number): Yard | null { for (const y of yards) if (outsideYard(y, x, z) < y.skirt) return y; return null; }
  function surfacesAt(x: number, z: number): number[] | null { const y = yardAt(x, z); if (!y) return null; const h = yardGround(y, x, z, land(x, z)); return h === null ? null : [h]; }
  function canOccupy(p: THREE.Vector3, radius: number): boolean | null { const y = yardAt(p.x, p.z); if (!y) return null; return yardOccupy(y, p, radius, land(p.x, p.z)); }
  const camQ = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
  function update(feet: THREE.Vector3, time: number): Stone | null {
    let found: Stone | null = null; const t = time / 1000;
    for (const e of stones) {
      const seen = read.has(e.stone.id), m = e.mesh.material as THREE.MeshBasicMaterial, bm = e.beam.material as THREE.MeshBasicMaterial;
      m.opacity = seen ? 0.45 : 0.75 + 0.25 * Math.sin(t * 2.2 + e.stone.x); e.beam.visible = !seen;
      if (!seen) { bm.opacity = 0.5 + 0.25 * Math.sin(t * 1.5 + e.stone.z); e.beam.quaternion.copy(camQ); }
      if (!seen && !found && Math.hypot(feet.x - e.stone.x, feet.z - e.stone.z) < STONE_R && Math.abs(feet.y - e.stone.y) < STONE_DY) found = e.stone;
    }
    if (found) { read.add(found.id); onRead?.(read); }
    return found;
  }
  return { yards, group, read, surfacesAt, canOccupy, yardAt, update, face: yaw => { camQ.setFromAxisAngle(up, yaw); } };
}
