// PINE BARRENS, T4c (Noah, 2026-10-21): the floor and the bark as tiling textures. Noah asked for texture maps from the internet; this
// session's network reaches only the repository, so each texture here is drawn (tileable, in colour, on a canvas) and stands in for a
// photograph: drop a CC0 photo at public/textures/barrens/<name>.jpg (ambientCG, Poly Haven: 1K JPEG is plenty on a phone) and it
// replaces the drawn one when it loads, nothing else changing. What the barrens' floor is: not tan sand alone but sand with needles,
// leaf mould, twigs, cones and lichen over it, more of each the denser the wood; the sand shows where the canopy opens.
import * as THREE from 'three';
import { mulberry32 } from './colors';

export type FloorName = 'sand' | 'needles' | 'leaves' | 'moss' | 'bark-pine' | 'bark-oak' | 'bark-cedar';
const made = new Map<FloorName, THREE.Texture>();
const SIZE = 512;

/** Draw with `fn` at the nine wrap offsets, so what runs off one edge comes in at the other. */
function wrapped(ctx: CanvasRenderingContext2D, fn: () => void): void {
  for (const dx of [-SIZE, 0, SIZE]) for (const dz of [-SIZE, 0, SIZE]) { ctx.save(); ctx.translate(dx, dz); fn(); ctx.restore(); }
}
const rgb = (r: number, g: number, b: number, a = 1) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
/** Per-pixel grain over the whole canvas: ±amp of brightness, seeded. */
function grain(ctx: CanvasRenderingContext2D, rand: () => number, amp: number): void {
  const img = ctx.getImageData(0, 0, SIZE, SIZE), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const k = 1 + (rand() - 0.5) * 2 * amp; d[i] = Math.min(255, d[i] * k); d[i + 1] = Math.min(255, d[i + 1] * k); d[i + 2] = Math.min(255, d[i + 2] * k); }
  ctx.putImageData(img, 0, 0);
}
/** A needle: a thin stroke, slightly bent. */
function needle(ctx: CanvasRenderingContext2D, rand: () => number, x: number, y: number, len: number, w: number, col: string): void {
  const a = rand() * Math.PI * 2, bend = (rand() - 0.5) * 0.25 * len;
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y);
  ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 - Math.sin(a) * bend, y + Math.sin(a) * len * 0.5 + Math.cos(a) * bend, x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
}
/** A fallen oak leaf: a lobed outline about an ellipse, with a midrib. */
function leaf(ctx: CanvasRenderingContext2D, rand: () => number, x: number, y: number, len: number, col: string, dark: string): void {
  const a = rand() * Math.PI * 2, w = len * (0.5 + rand() * 0.25), lobes = 5 + Math.floor(rand() * 3);
  ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = col; ctx.beginPath();
  for (let i = 0; i <= 24; i++) { const t = i / 24, ang = t * Math.PI * 2, r = 1 - 0.22 * Math.abs(Math.sin(ang * lobes * 0.5)) * (0.5 + 0.5 * Math.abs(Math.sin(ang))); const px = Math.cos(ang) * len * 0.5 * r, py = Math.sin(ang) * w * 0.5 * r; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-len * 0.45, 0); ctx.lineTo(len * 0.45, 0); ctx.stroke(); ctx.restore();
}
function twig(ctx: CanvasRenderingContext2D, rand: () => number, x: number, y: number, len: number): void {
  const a = rand() * Math.PI * 2; ctx.strokeStyle = rgb(70 + rand() * 30, 52 + rand() * 20, 35); ctx.lineWidth = 2 + rand() * 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); const mx = x + Math.cos(a) * len * 0.5 + (rand() - 0.5) * 8, my = y + Math.sin(a) * len * 0.5 + (rand() - 0.5) * 8; ctx.lineTo(mx, my); ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); ctx.stroke();
  if (rand() < 0.5) { const b = a + 0.5 + rand(); ctx.lineWidth *= 0.6; ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(b) * len * 0.35, my + Math.sin(b) * len * 0.35); ctx.stroke(); }
}
function draw(name: FloorName): HTMLCanvasElement {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d')!, rand = mulberry32({ sand: 101, needles: 102, leaves: 103, moss: 104, 'bark-pine': 105, 'bark-oak': 106, 'bark-cedar': 107 }[name]);
  if (name === 'sand') {
    // Sugar sand, as it lies in the open wood: pale but never clean, darker grains, grey-green lichen crusts, needles and leaf scraps blown over it, twigs, a cone.
    ctx.fillStyle = rgb(168, 152, 120); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 1400; i++) { ctx.fillStyle = rgb(120 + rand() * 70, 105 + rand() * 60, 75 + rand() * 45, 0.5); ctx.beginPath(); ctx.arc(rand() * SIZE, rand() * SIZE, 0.6 + rand() * 1.8, 0, 7); ctx.fill(); } });
    wrapped(ctx, () => { for (let i = 0; i < 16; i++) { const x = rand() * SIZE, y = rand() * SIZE, r = 10 + rand() * 26; ctx.fillStyle = rgb(150 + rand() * 20, 158 + rand() * 20, 132 + rand() * 20, 0.5); for (let k = 0; k < 7; k++) { ctx.beginPath(); ctx.arc(x + (rand() - 0.5) * r, y + (rand() - 0.5) * r, r * 0.3 * (0.6 + rand()), 0, 7); ctx.fill(); } } });
    wrapped(ctx, () => { for (let i = 0; i < 24; i++) { const v = rand(); leaf(ctx, rand, rand() * SIZE, rand() * SIZE, 22 + rand() * 20, rgb(110 + v * 50, 80 + v * 35, 40 + v * 15), rgb(60, 40, 20, 0.5)); } });
    wrapped(ctx, () => { for (let i = 0; i < 260; i++) needle(ctx, rand, rand() * SIZE, rand() * SIZE, 18 + rand() * 24, 1.5, rgb(130 + rand() * 50, 95 + rand() * 35, 50, 0.8)); for (let i = 0; i < 9; i++) twig(ctx, rand, rand() * SIZE, rand() * SIZE, 30 + rand() * 50); });
    grain(ctx, rand, 0.07);
  } else if (name === 'needles') {
    // The needle mat: a dark humus under thousands of fallen needles, russet to grey-brown, a cone and a twig here and there.
    ctx.fillStyle = rgb(62, 44, 30); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 1700; i++) { const v = rand(); needle(ctx, rand, rand() * SIZE, rand() * SIZE, 22 + rand() * 34, 1.3 + rand() * 1.4, rgb(120 + v * 80, 78 + v * 50, 38 + v * 30, 0.85)); } });
    wrapped(ctx, () => { for (let i = 0; i < 9; i++) twig(ctx, rand, rand() * SIZE, rand() * SIZE, 36 + rand() * 60); for (let i = 0; i < 4; i++) { const x = rand() * SIZE, y = rand() * SIZE; for (let k = 0; k < 14; k++) { ctx.fillStyle = rgb(80 + rand() * 40, 58 + rand() * 25, 36, 0.95); ctx.beginPath(); ctx.ellipse(x + (rand() - 0.5) * 16, y + (rand() - 0.5) * 24, 4, 2.5, rand() * 3, 0, 7); ctx.fill(); } } });
    wrapped(ctx, () => { for (let i = 0; i < 500; i++) { const v = rand(); needle(ctx, rand, rand() * SIZE, rand() * SIZE, 20 + rand() * 30, 1.2 + rand(), rgb(150 + v * 60, 100 + v * 40, 50 + v * 20, 0.8)); } });
    grain(ctx, rand, 0.06);
  } else if (name === 'leaves') {
    // Leaf mould: oak leaves fallen on oak leaves, the ones beneath dark and rotting, the top ones still ochre and russet; needles among them.
    ctx.fillStyle = rgb(48, 34, 22); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 140; i++) { const v = rand(), top = rand() < 0.35, c = top ? rgb(150 + v * 50, 95 + v * 40, 40 + v * 20) : rgb(70 + v * 40, 50 + v * 25, 30 + v * 12); leaf(ctx, rand, rand() * SIZE, rand() * SIZE, 34 + rand() * 30, c, top ? rgb(110, 70, 30, 0.6) : rgb(40, 28, 16, 0.6)); } });
    wrapped(ctx, () => { for (let i = 0; i < 260; i++) { const v = rand(); needle(ctx, rand, rand() * SIZE, rand() * SIZE, 20 + rand() * 28, 1.4, rgb(130 + v * 60, 90 + v * 40, 45, 0.8)); } for (let i = 0; i < 6; i++) twig(ctx, rand, rand() * SIZE, rand() * SIZE, 30 + rand() * 50); });
    grain(ctx, rand, 0.06);
  } else if (name === 'moss') {
    // The streamside: peat, black and wet, under cushions of sphagnum, yellow-green to deep green, with sedge and fallen needles.
    ctx.fillStyle = rgb(40, 34, 24); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 70; i++) { const x = rand() * SIZE, y = rand() * SIZE, r = 14 + rand() * 30, v = rand(); for (let k = 0; k < 40; k++) { ctx.fillStyle = rgb(70 + v * 60 + rand() * 30, 95 + v * 60 + rand() * 30, 30 + v * 20, 0.7); const a = rand() * 7, d = Math.sqrt(rand()) * r; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 2 + rand() * 3, 0, 7); ctx.fill(); } } });
    wrapped(ctx, () => { for (let i = 0; i < 160; i++) { const v = rand(); needle(ctx, rand, rand() * SIZE, rand() * SIZE, 16 + rand() * 26, 1.2, rgb(110 + v * 50, 80 + v * 30, 40, 0.7)); } for (let i = 0; i < 120; i++) needle(ctx, rand, rand() * SIZE, rand() * SIZE, 30 + rand() * 40, 1.6, rgb(90 + rand() * 50, 120 + rand() * 50, 40, 0.75)); });
    grain(ctx, rand, 0.06);
  } else if (name === 'bark-pine') {
    // Pitch pine bark: thick, irregular plates, dark grey-brown, set in reddish-brown furrows; the plates run up the trunk.
    ctx.fillStyle = rgb(70, 42, 30); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 160; i++) { const x = rand() * SIZE, y = rand() * SIZE, w = 22 + rand() * 40, h = 40 + rand() * 90, v = rand(); ctx.fillStyle = rgb(78 + v * 40, 66 + v * 32, 54 + v * 26); ctx.beginPath(); for (let k = 0; k <= 10; k++) { const t = k / 10 * Math.PI * 2, r = 1 + (rand() - 0.5) * 0.3; const px = x + Math.cos(t) * w * 0.5 * r, py = y + Math.sin(t) * h * 0.5 * r; if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgb(40, 24, 16, 0.8); ctx.lineWidth = 2.5; ctx.stroke(); ctx.fillStyle = rgb(120 + v * 50, 105 + v * 40, 85 + v * 30, 0.35); ctx.beginPath(); ctx.ellipse(x - w * 0.1, y - h * 0.15, w * 0.22, h * 0.25, 0, 0, 7); ctx.fill(); } });
    grain(ctx, rand, 0.09);
  } else if (name === 'bark-oak') {
    // Blackjack and post oak bark: deep vertical ridges, dark, broken into blocks, their crests paler and grey.
    ctx.fillStyle = rgb(52, 42, 34); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 220; i++) { const x = rand() * SIZE, y = rand() * SIZE, w = 7 + rand() * 12, h = 40 + rand() * 90, v = rand(); ctx.fillStyle = rgb(72 + v * 30, 64 + v * 26, 54 + v * 22); ctx.beginPath(); ctx.moveTo(x - w / 2, y - h / 2); ctx.lineTo(x + w / 2 + (rand() - 0.5) * 5, y - h / 2 + 4); ctx.lineTo(x + w / 2, y + h / 2); ctx.lineTo(x - w / 2 + (rand() - 0.5) * 5, y + h / 2 - 4); ctx.closePath(); ctx.fill(); ctx.strokeStyle = rgb(32, 24, 18, 0.8); ctx.lineWidth = 2.5; ctx.stroke(); ctx.strokeStyle = rgb(100 + v * 30, 94 + v * 26, 84 + v * 22, 0.4); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - w * 0.15, y - h * 0.4); ctx.lineTo(x - w * 0.1, y + h * 0.4); ctx.stroke(); } });
    grain(ctx, rand, 0.08);
  } else {
    // Atlantic white cedar bark: thin, fibrous, ashy grey-brown, shredding in long vertical strips.
    ctx.fillStyle = rgb(92, 78, 64); ctx.fillRect(0, 0, SIZE, SIZE);
    wrapped(ctx, () => { for (let i = 0; i < 600; i++) { const x = rand() * SIZE, y = rand() * SIZE, h = 40 + rand() * 160, v = rand(); ctx.strokeStyle = rgb(60 + v * 70, 52 + v * 60, 42 + v * 50, 0.7); ctx.lineWidth = 1 + rand() * 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rand() - 0.5) * 6, y + h); ctx.stroke(); } });
    grain(ctx, rand, 0.08);
  }
  return canvas;
}

/** The texture by name: drawn now, and replaced by public/textures/barrens/<name>.jpg if that exists (a photo Noah drops in). */
export function floorTexture(name: FloorName): THREE.Texture {
  const cached = made.get(name); if (cached) return cached;
  const tex = new THREE.CanvasTexture(draw(name)); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy = 4;
  made.set(name, tex);
  // The folder's index.json names the photos present (so no request is ever made for a file that is not there); a photo's pixels replace the drawn ones in the same texture object.
  manifest().then(names => { if (!names.includes(name)) return; new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}textures/barrens/${name}.jpg`, photo => { tex.image = photo.image; tex.needsUpdate = true; }); });
  return tex;
}
let listed: Promise<string[]> | null = null;
const manifest = (): Promise<string[]> => (listed ??= fetch(`${import.meta.env.BASE_URL}textures/barrens/index.json`).then(r => (r.ok ? r.json() : [])).then(v => (Array.isArray(v) ? v.filter(x => typeof x === 'string') : [])).catch(() => []));
