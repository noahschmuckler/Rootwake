// Foliage as crossed standees, the way the plateau's grass has always been drawn (patch.ts): a
// textured quad and its twin at right angles read as a tuft from any side, and a third, flat
// quad fills them in from above. One shared canvas texture per kind, tinted by the material.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from './colors';

export type SpriteKind = 'grass' | 'leaf' | 'needle' | 'frond' | 'bloom' | 'pine' | 'berry' | 'oak' | 'cedar' | 'highbush';
const textures = new Map<SpriteKind, THREE.CanvasTexture>();
/** Drawn in pale neutral tones so the material's colour sets the hue; alpha does the shaping. */
export function spriteTexture(kind: SpriteKind): THREE.CanvasTexture {
  const cached = textures.get(kind); if (cached) return cached;
  const size = 256, canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!; ctx.clearRect(0, 0, size, size);
  const rand = mulberry32(kind === 'grass' ? 42 : kind === 'leaf' ? 7 : kind === 'needle' ? 11 : kind === 'bloom' ? 23 : kind === 'pine' ? 29 : kind === 'berry' ? 31 : kind === 'oak' ? 37 : kind === 'cedar' ? 41 : kind === 'highbush' ? 43 : 19);
  const tone = () => { const v = 170 + Math.floor(rand() * 85); return `rgb(${v - 20}, ${v}, ${v - 30})`; };
  if (kind === 'grass' || kind === 'frond') {
    const blades = kind === 'grass' ? 13 : 9;
    for (let i = 0; i < blades; i++) {
      const t = (i + 0.5) / blades, lean = (t - 0.5) * (kind === 'grass' ? 1.7 : 2.4), height = 0.55 + rand() * 0.45;
      const baseX = size * (0.42 + rand() * 0.16), tipX = baseX + lean * size * 0.32, tipY = size * (1 - height), width = (kind === 'grass' ? 8 : 16) + rand() * 8;
      ctx.fillStyle = tone(); ctx.beginPath(); ctx.moveTo(baseX - width / 2, size);
      ctx.quadraticCurveTo(baseX + lean * size * 0.1, size * 0.6, tipX, tipY);
      ctx.quadraticCurveTo(baseX + lean * size * 0.12 + width * 0.3, size * 0.62, baseX + width / 2, size); ctx.closePath(); ctx.fill();
      if (kind === 'frond') for (let k = 0; k < 7; k++) { const u = 0.25 + k * 0.1, px = baseX + (tipX - baseX) * u, py = size - (size - tipY) * u; ctx.fillStyle = tone(); ctx.beginPath(); ctx.ellipse(px, py, 14, 5, Math.atan2(tipY - size, tipX - baseX) + (k % 2 ? 0.9 : -0.9), 0, Math.PI * 2); ctx.fill(); }
    }
  } else if (kind === 'bloom') {
    // A flowering tuft: a few leaves low, blossoms above them. Drawn in colour: it is Hulda's trail.
    for (let i = 0; i < 9; i++) { const x = size * (0.3 + rand() * 0.4), y = size * (0.62 + rand() * 0.3); ctx.fillStyle = `rgb(${70 + Math.floor(rand() * 40)}, ${120 + Math.floor(rand() * 60)}, ${60 + Math.floor(rand() * 30)})`; ctx.beginPath(); ctx.ellipse(x, y, 16 + rand() * 12, 7 + rand() * 5, rand() * Math.PI, 0, Math.PI * 2); ctx.fill(); }
    for (let i = 0; i < 11; i++) {
      const x = size * (0.28 + rand() * 0.44), y = size * (0.22 + rand() * 0.4), r = 9 + rand() * 9; const pink = rand() < 0.6;
      ctx.fillStyle = pink ? `rgb(${230 + Math.floor(rand() * 25)}, ${150 + Math.floor(rand() * 60)}, ${190 + Math.floor(rand() * 50)})` : `rgb(250, 246, ${200 + Math.floor(rand() * 50)})`;
      for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.55, r * 0.5, r * 0.32, a, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#f2c94c'; ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(80,120,60,0.9)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x, y + r * 0.4); ctx.lineTo(x + (rand() - 0.5) * 10, size * 0.8); ctx.stroke();
    }
  } else if (kind === 'leaf') {
    // A loose cluster of overlapping leaves, denser toward the middle, ragged at the edges.
    for (let i = 0; i < 46; i++) {
      const a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.6) * size * 0.42, x = size / 2 + Math.cos(a) * r, y = size / 2 + Math.sin(a) * r;
      const len = 14 + rand() * 22, wid = len * (0.45 + rand() * 0.3);
      ctx.fillStyle = tone(); ctx.beginPath(); ctx.ellipse(x, y, len, wid, rand() * Math.PI, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(90,110,80,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - len * 0.8, y); ctx.lineTo(x + len * 0.8, y); ctx.stroke();
    }
  } else if (kind === 'pine') {
    // PINE BARRENS (Noah, 2026-10-21): a pitch pine's needle tuft, the bottle-brush at a limb's end: stiff needles in threes radiating from a few
    // short twigs about the middle, thick at the heart and ragged at the rim, so a crown of these reads as needle masses with sky between them.
    const twigs = 7;
    ctx.strokeStyle = 'rgba(95, 75, 55, 0.9)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let t = 0; t < twigs; t++) { const a = (t / twigs) * Math.PI * 2 + rand() * 0.6, len = size * (0.12 + rand() * 0.14); ctx.beginPath(); ctx.moveTo(size / 2, size / 2); ctx.lineTo(size / 2 + Math.cos(a) * len, size / 2 + Math.sin(a) * len); ctx.stroke(); }
    for (let i = 0; i < 340; i++) {
      // Each needle grows from a point on a twig (near the heart) outward, a little past the twig's end; the heart is in its own shade.
      const t = Math.floor(rand() * twigs), ta = (t / twigs) * Math.PI * 2 + 0.3, along = rand() * size * 0.2, bx = size / 2 + Math.cos(ta) * along, by = size / 2 + Math.sin(ta) * along;
      const a = ta + (rand() - 0.5) * 2.2, len = size * (0.12 + rand() * 0.15), v = 115 + Math.floor(rand() * 90) + Math.floor(along / size * 160);
      ctx.strokeStyle = `rgb(${v - 30}, ${v}, ${v - 45})`; ctx.lineWidth = 1.6 + rand() * 1.4; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a) * len, by + Math.sin(a) * len); ctx.stroke();
    }
  } else if (kind === 'oak') {
    // T4c: a blackjack oak's leaf cluster: big lobed leaves (broadest toward the tip), overlapping, on a few twigs, ragged at the rim.
    ctx.strokeStyle = 'rgba(95, 75, 55, 0.9)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let t = 0; t < 5; t++) { const a = (t / 5) * Math.PI * 2 + rand() * 0.8, len = size * (0.15 + rand() * 0.2); ctx.beginPath(); ctx.moveTo(size / 2, size / 2); ctx.lineTo(size / 2 + Math.cos(a) * len, size / 2 + Math.sin(a) * len); ctx.stroke(); }
    for (let i = 0; i < 30; i++) {
      const a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.6) * size * 0.36, x = size / 2 + Math.cos(a) * r, y = size / 2 + Math.sin(a) * r, len = 40 + rand() * 34, rot = rand() * Math.PI * 2, v = 160 + Math.floor(rand() * 85);
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = `rgb(${v - 30}, ${v}, ${v - 45})`; ctx.beginPath();
      // The blackjack's leaf: narrow at the stem, three broad lobes at the tip.
      for (let k = 0; k <= 30; k++) { const t = k / 30, ang = t * Math.PI * 2, c = Math.cos(ang), w = 0.22 + 0.5 * Math.max(0, c) + 0.12 * Math.abs(Math.sin(ang * 3)) * Math.max(0, c); const px = Math.cos(ang) * len * 0.5, py = Math.sin(ang) * len * w; if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(90, 100, 70, 0.45)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-len * 0.5, 0); ctx.lineTo(len * 0.45, 0); ctx.stroke(); ctx.restore();
    }
  } else if (kind === 'cedar') {
    // T4c: an Atlantic white cedar's spray: flat fans of scale-like foliage on branching twigs, fine, dense at the heart, feathered at the rim.
    ctx.lineCap = 'round';
    const fan = (x: number, y: number, a: number, len: number, depth: number): void => {
      ctx.strokeStyle = depth > 1 ? 'rgba(100, 85, 65, 0.9)' : `rgb(${150 + Math.floor(rand() * 40)}, ${175 + Math.floor(rand() * 60)}, ${130 + Math.floor(rand() * 40)})`; ctx.lineWidth = depth > 1 ? 2.2 : 3.5;
      const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
      if (depth === 0) return;
      const n = 3 + Math.floor(rand() * 3); for (let k = 1; k <= n; k++) { const t = k / (n + 0.5), side = k % 2 ? 1 : -1; fan(x + (ex - x) * t, y + (ey - y) * t, a + side * (0.7 + rand() * 0.3), len * (0.45 - t * 0.2), depth - 1); }
    };
    for (let t = 0; t < 11; t++) { const a = -Math.PI / 2 + (t / 11 - 0.5) * 3.6 + rand() * 0.3; fan(size / 2 + (rand() - 0.5) * size * 0.2, size * (0.5 + rand() * 0.25), a, size * (0.28 + rand() * 0.12), 2); }
  } else if (kind === 'highbush') {
    // T4c: highbush blueberry (sweet pepperbush, leatherleaf too), the streamside's thicket over her head: many arching stems, branching, leafy to the top.
    ctx.lineCap = 'round';
    for (let t = 0; t < 12; t++) { const x0 = size * (0.25 + rand() * 0.5), lean = (rand() - 0.5) * 1.1, top = size * (0.04 + rand() * 0.2); ctx.strokeStyle = 'rgba(95, 70, 50, 0.95)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, size); ctx.quadraticCurveTo(x0 + lean * size * 0.15, size * 0.55, x0 + lean * size * 0.35, top); ctx.stroke();
      for (let k = 0; k < 7; k++) { const u = 0.3 + rand() * 0.65, px = x0 + lean * size * 0.3 * u, py = size - (size - top) * u, b = (rand() - 0.5) * 2.4; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(b) * 22, py - 14 + Math.sin(b) * 10); ctx.stroke(); }
      for (let k = 0; k < 22; k++) { const u = 0.2 + rand() * 0.8, px = x0 + lean * size * 0.3 * u + (rand() - 0.5) * 34, py = size - (size - top) * u + (rand() - 0.5) * 10, v = 150 + Math.floor(rand() * 85); ctx.fillStyle = `rgb(${v - 30}, ${v}, ${v - 45})`; ctx.beginPath(); ctx.ellipse(px, py, 7 + rand() * 5, 4 + rand() * 2.5, rand() * Math.PI, 0, Math.PI * 2); ctx.fill(); } }
  } else if (kind === 'berry') {
    // Lowbush blueberry and huckleberry, the barrens' knee-high carpet: a thicket of fine twigs with small oval leaves, open enough to see through.
    ctx.lineCap = 'round';
    for (let t = 0; t < 9; t++) { const x0 = size * (0.3 + rand() * 0.4), lean = (rand() - 0.5) * 0.9, top = size * (0.12 + rand() * 0.25); ctx.strokeStyle = 'rgba(110, 80, 60, 0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, size); ctx.quadraticCurveTo(x0 + lean * size * 0.2, size * 0.6, x0 + lean * size * 0.35, top); ctx.stroke();
      for (let k = 0; k < 9; k++) { const u = 0.15 + rand() * 0.8, px = x0 + lean * size * 0.3 * u + (rand() - 0.5) * 14, py = size - (size - top) * u, v = 165 + Math.floor(rand() * 80); ctx.fillStyle = `rgb(${v - 25}, ${v}, ${v - 40})`; ctx.beginPath(); ctx.ellipse(px, py, 5 + rand() * 4, 3 + rand() * 2, rand() * Math.PI, 0, Math.PI * 2); ctx.fill(); } }
  } else {
    // Needles: a spray of thin triangles fanning out and down from a stem.
    for (let i = 0; i < 70; i++) {
      const a = -Math.PI / 2 + (rand() - 0.5) * 2.6, r0 = rand() * size * 0.18, len = size * (0.22 + rand() * 0.25);
      const x0 = size / 2 + Math.cos(a) * r0, y0 = size * 0.35 + Math.sin(a) * r0 * 0.4, x1 = x0 + Math.cos(a) * len, y1 = y0 - Math.sin(a) * len * 0.15 + len * 0.55;
      ctx.strokeStyle = tone(); ctx.lineWidth = 3 + rand() * 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  textures.set(kind, texture); return texture;
}
export function spriteMaterial(kind: SpriteKind, color: THREE.ColorRepresentation, extra: Partial<THREE.MeshStandardMaterialParameters> = {}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ map: spriteTexture(kind), color, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 1, ...extra });
}
export interface Standee { position: THREE.Vector3; yaw: number; width: number; height: number; /** +y of the card; default world up. */ up?: THREE.Vector3; /** Add a flat card too (crowns seen from above). */ flat?: boolean; }
const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0), align = new THREE.Quaternion();
/** Crossed standees merged into one geometry: two quads at right angles per tuft, bottom edge at the position. */
export function standees(items: Standee[]): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (const it of items) {
    const quad = new THREE.PlaneGeometry(1, 1); quad.translate(0, 0.5, 0);
    s.set(it.width, it.height, it.width);
    align.identity(); if (it.up) align.setFromUnitVectors(Y, it.up.clone().normalize());
    for (const turn of [0, Math.PI / 2]) { q.setFromEuler(e.set(0, it.yaw + turn, 0)).premultiply(align); parts.push(quad.clone().applyMatrix4(m.compose(it.position, q, s))); }
    if (it.flat) { const flat = new THREE.PlaneGeometry(1, 1); flat.rotateX(-Math.PI / 2); flat.translate(0, 0.5, 0); q.setFromEuler(e.set(0, it.yaw, 0)).premultiply(align); parts.push(flat.applyMatrix4(m.compose(it.position, q, s))); }
    quad.dispose();
  }
  return mergeGeometries(parts)!;
}
/** A leafy crown: cards scattered through an ellipsoid above a trunk, bigger and denser at the middle. */
export function crownStandees(rand: () => number, centre: THREE.Vector3, rx: number, ry: number, rz: number, count: number, card: number): Standee[] {
  const out: Standee[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * 2 - 1, a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.5);
    const p = new THREE.Vector3(centre.x + Math.cos(a) * r * rx * Math.sqrt(1 - u * u), centre.y + u * ry * 0.8 - card * 0.45, centre.z + Math.sin(a) * r * rz * Math.sqrt(1 - u * u));
    const k = card * (0.75 + rand() * 0.6);
    out.push({ position: p, yaw: rand() * Math.PI, width: k, height: k * (0.85 + rand() * 0.3), flat: i % 2 === 0 });
  }
  return out;
}
