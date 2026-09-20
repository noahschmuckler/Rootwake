// Foliage as crossed standees, the way the plateau's grass has always been drawn (patch.ts): a
// textured quad and its twin at right angles read as a tuft from any side, and a third, flat
// quad fills them in from above. One shared canvas texture per kind, tinted by the material.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32 } from './colors';

export type SpriteKind = 'grass' | 'leaf' | 'needle' | 'frond';
const textures = new Map<SpriteKind, THREE.CanvasTexture>();
/** Drawn in pale neutral tones so the material's colour sets the hue; alpha does the shaping. */
export function spriteTexture(kind: SpriteKind): THREE.CanvasTexture {
  const cached = textures.get(kind); if (cached) return cached;
  const size = 256, canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d')!; ctx.clearRect(0, 0, size, size);
  const rand = mulberry32(kind === 'grass' ? 42 : kind === 'leaf' ? 7 : kind === 'needle' ? 11 : 19);
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
  } else if (kind === 'leaf') {
    // A loose cluster of overlapping leaves, denser toward the middle, ragged at the edges.
    for (let i = 0; i < 46; i++) {
      const a = rand() * Math.PI * 2, r = Math.pow(rand(), 0.6) * size * 0.42, x = size / 2 + Math.cos(a) * r, y = size / 2 + Math.sin(a) * r;
      const len = 14 + rand() * 22, wid = len * (0.45 + rand() * 0.3);
      ctx.fillStyle = tone(); ctx.beginPath(); ctx.ellipse(x, y, len, wid, rand() * Math.PI, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(90,110,80,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - len * 0.8, y); ctx.lineTo(x + len * 0.8, y); ctx.stroke();
    }
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
