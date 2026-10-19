// The plateau's waterworks drawn (PLATEAU.md, T2): the rivers' water (a ribbon down each course at its
// surface, lit and hazed as the vista's lake is, flowing), the ford's gravel, stepping stones across the
// shallows, plank footbridges, and the island's old stone bridge of arches. The lake itself is the
// vista's water plane at WATER_Y.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { NOISE, ATMOS, MAP, FINISH } from './vistaShaders';
import { mulberry32 } from './colors';
import { FOOTBRIDGE_OVER, FOOTBRIDGE_HALF_W, ISLAND_R, type Plateau, type River } from './plateauModel';

const riverVert = /* glsl */`
attribute float aDepth; attribute vec2 aFlow;
varying vec3 vWorld; varying float vDepth; varying vec2 vFlow;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vWorld = w.xyz; vDepth = aDepth; vFlow = aFlow; gl_Position = projectionMatrix * viewMatrix * w; }`;
/** The vista's lake water, with its depth from the channel (the grid is too coarse to know a river's bed) and its ripples carried downstream. */
const riverFrag = /* glsl */`
${NOISE}${ATMOS}${MAP}
varying vec3 vWorld; varying float vDepth; varying vec2 vFlow;
float waves(vec2 p){ return vnoise(p * 0.5) * 0.55 + vnoise(p * 1.6) * 0.3 + vnoise(p * 4.0) * 0.15; }
void main(){
  vec2 p = vWorld.xz, q = p - vFlow * uTime * 1.3; float depth = vDepth;
  float e = 0.15, w0 = waves(q), calm = 1.0 / (1.0 + length(vWorld - cameraPosition) * 0.03);
  vec3 n = normalize(vec3((w0 - waves(q + vec2(e, 0.0))) * 1.6 * calm, e * 3.0, (w0 - waves(q + vec2(0.0, e))) * 1.6 * calm));
  vec3 v = normalize(cameraPosition - vWorld);
  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  vec4 md = mapData(p);
  vec3 body = mix(srgb(vec3(0.42, 0.74, 0.66)), srgb(vec3(0.1, 0.34, 0.42)), 1.0 - exp(-max(depth, 0.0) * 0.9));
  body *= uAmbSky * 1.1 + uSunCol * 0.45 * md.r;
  vec3 col = mix(body, skyColour(reflect(-v, n)), clamp(fres * 0.8, 0.0, 0.7));
  col += uSunCol * pow(max(dot(reflect(-uSunDir, n), v), 0.0), 180.0) * 2.5 * md.r;
  // White water where it runs shallow (a ford, the stones) and in streaks downstream.
  float streak = smoothstep(0.62, 0.9, vnoise(vec2(dot(q, vFlow) * 0.35, dot(q, vec2(-vFlow.y, vFlow.x)) * 2.2)));
  float foam = (1.0 - smoothstep(0.0, 0.3 + 0.25 * vnoise(q * 2.0), depth)) + streak * 0.25;
  col = mix(col, (uAmbSky + uSunCol * md.r) * 0.9, clamp(foam, 0.0, 1.0) * 0.7);
  float alpha = clamp(smoothstep(-0.02, 0.35, depth) * 0.85 + fres * 0.15, 0.0, 1.0);
  gl_FragColor = vec4(applyHaze(col, vWorld), alpha);
  ${FINISH}
}`;

export interface Waterworks { root: THREE.Group; dispose(): void }
/** Build the waterworks under `parent`. `uniforms`: the vista's shared ones (its light and haze); without them (the plain look) the water is a plain translucent blue. */
export function buildWaterworks(parent: THREE.Object3D, p: Plateau, uniforms: Record<string, THREE.IUniform> | null): Waterworks {
  const root = new THREE.Group(); root.name = 'waterworks'; parent.add(root);
  const geos: THREE.BufferGeometry[] = [], mats: THREE.Material[] = [];
  const water = uniforms ? new THREE.ShaderMaterial({ uniforms: { ...uniforms }, vertexShader: riverVert, fragmentShader: riverFrag, transparent: true, depthWrite: false }) : new THREE.MeshStandardMaterial({ color: '#3f7f8f', transparent: true, opacity: 0.8, roughness: 0.2 });
  mats.push(water);
  for (const r of p.rivers) { const g = riverGeometry(p, r); if (g) { geos.push(g); const m = new THREE.Mesh(g, water); m.name = `water:${r.id}`; m.renderOrder = 1; root.add(m); } }

  // ── the crossings ──
  const rand = mulberry32(190926), stone: THREE.BufferGeometry[] = [], gravel: THREE.BufferGeometry[] = [], wood: THREE.BufferGeometry[] = [];
  const rock = (x: number, y: number, z: number, r: number, flat: number, out: THREE.BufferGeometry[]) => { const g = new THREE.IcosahedronGeometry(r, 0); g.scale(1 + rand() * 0.3, flat, 1 + rand() * 0.3); g.rotateY(rand() * 6.28); g.translate(x, y, z); out.push(g); };
  for (const c of p.crossings) {
    const ux = -Math.sin(c.along), uz = Math.cos(c.along), fx = Math.cos(c.along), fz = Math.sin(c.along), river = p.rivers.find(r => r.id === c.river)!, s = river.surface[c.i];
    if (c.kind === 'stones' || c.kind === 'ford') {
      // Stepping stones straight across, their tops just out of the water; a ford's are fewer and its bed is gravel.
      const span = c.half * (c.kind === 'ford' ? 1.6 : 1) + 0.6, step = c.kind === 'ford' ? 1.6 : 0.85;
      for (let t = -span; t <= span + 1e-6; t += step) { const j = (rand() - 0.5) * 0.25; rock(c.x + ux * t + fx * j, s + 0.04, c.z + uz * t + fz * j, 0.32 + rand() * 0.12, 0.45, stone); }
      if (c.kind === 'ford') for (let k = 0; k < 90; k++) { const t = (rand() - 0.5) * 2 * span, a = (rand() - 0.5) * 12; const x = c.x + ux * t + fx * a, z = c.z + uz * t + fz * a; rock(x, p.ground(x, z) + 0.02, z, 0.08 + rand() * 0.1, 0.5, gravel); }
    } else {
      // A footbridge of planks between two logs, a little arched, with a rail on posts each side.
      const len = c.half + FOOTBRIDGE_OVER;
      for (let t = -len; t <= len + 1e-6; t += 0.3) { const x = c.x + ux * t, z = c.z + uz * t, y = p.deckAt(x, z) ?? s + 1; const g = new THREE.BoxGeometry(FOOTBRIDGE_HALF_W * 2, 0.07, 0.27); g.rotateY(Math.atan2(ux, uz)); g.translate(x, y - 0.04, z); wood.push(g); }
      for (const side of [-1, 1]) {
        const ox = fx * side * (FOOTBRIDGE_HALF_W - 0.05), oz = fz * side * (FOOTBRIDGE_HALF_W - 0.05);
        for (let t = -len; t <= len + 1e-6; t += len / 3) { const x = c.x + ux * t + ox, z = c.z + uz * t + oz, y = p.deckAt(c.x + ux * t, c.z + uz * t) ?? s + 1; const post = new THREE.CylinderGeometry(0.05, 0.06, 0.75, 5); post.translate(x, y + 0.35, z); wood.push(post); }
        const a = { x: c.x - ux * len + ox, z: c.z - uz * len + oz }, b = { x: c.x + ux * len + ox, z: c.z + uz * len + oz }, ya = (p.deckAt(c.x - ux * len, c.z - uz * len) ?? s) + 0.72, yb = (p.deckAt(c.x + ux * len, c.z + uz * len) ?? s) + 0.72, mid = (p.deckAt(c.x, c.z) ?? s) + 0.72;
        const rail = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(a.x, ya, a.z), new THREE.Vector3(c.x + ox, mid * 2 - (ya + yb) / 2, c.z + oz), new THREE.Vector3(b.x, yb, b.z)), 8, 0.04, 4); wood.push(rail);
        const log = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(a.x, ya - 0.82, a.z), new THREE.Vector3(c.x + ox, mid * 2 - (ya + yb) / 2 - 0.82, c.z + oz), new THREE.Vector3(b.x, yb - 0.82, b.z)), 10, 0.13, 6); wood.push(log);
      }
    }
  }
  const stoneMat = new THREE.MeshStandardMaterial({ color: '#8c8778', roughness: 0.95, flatShading: true }), gravelMat = new THREE.MeshStandardMaterial({ color: '#9d907a', roughness: 1, flatShading: true }), woodMat = new THREE.MeshStandardMaterial({ color: '#6b5034', roughness: 0.9, flatShading: true });
  mats.push(stoneMat, gravelMat, woodMat);
  for (const [list, mat, name] of [[stone, stoneMat, 'crossing-stones'], [gravel, gravelMat, 'ford-gravel'], [wood, woodMat, 'footbridges']] as const) if (list.length) { const g = mergeGeometries(list.map(x => x.index ? x.toNonIndexed() : x))!; g.computeVertexNormals(); geos.push(g); const m = new THREE.Mesh(g, mat); m.name = name; m.castShadow = m.receiveShadow = true; root.add(m); for (const x of list) x.dispose(); }

  // ── the island's bridge ──
  { const g = bridgeGeometry(p); geos.push(g); const mat = new THREE.MeshStandardMaterial({ color: '#a39a86', roughness: 0.95, flatShading: true, vertexColors: true }); mats.push(mat); const m = new THREE.Mesh(g, mat); m.name = 'old-bridge'; m.castShadow = m.receiveShadow = true; root.add(m); }
  return { root, dispose() { parent.remove(root); for (const g of geos) g.dispose(); for (const m of mats) m.dispose(); } };
}

/** A river's water: a ribbon five vertices across, from bank to bank a little past the channel, at its surface, until it meets the lake. */
function riverGeometry(p: Plateau, r: River): THREE.BufferGeometry | null {
  const C = p.centre, across = [-1.35, -0.55, 0, 0.55, 1.35], pos: number[] = [], depth: number[] = [], flow: number[] = [], idx: number[] = [];
  let rows = 0;
  for (let i = 0; i < r.points.length; i++) {
    const a = r.points[Math.max(0, i - 1)], b = r.points[Math.min(r.points.length - 1, i + 1)], pt = r.points[i], ang = Math.atan2(pt.z - C.z, pt.x - C.x);
    if (Math.hypot(pt.x - C.x, pt.z - C.z) < p.lakeR(ang) - 6 || Math.hypot(pt.x - C.x, pt.z - C.z) < ISLAND_R) break;
    const tx = b.x - a.x, tz = b.z - a.z, tl = Math.hypot(tx, tz) || 1, nx = -tz / tl, nz = tx / tl, s = r.surface[i];
    for (const k of across) { const x = pt.x + nx * k * r.half[i], z = pt.z + nz * k * r.half[i]; pos.push(x, s + 0.03, z); depth.push(s - p.ground(x, z)); flow.push(tx / tl, tz / tl); }
    if (rows) { const o = (rows - 1) * 5; for (let k = 0; k < 4; k++) idx.push(o + k, o + k + 1, o + k + 5, o + k + 1, o + k + 6, o + k + 5); } // wound to face up
    rows++;
  }
  if (rows < 2) return null;
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aDepth', new THREE.Float32BufferAttribute(depth, 1)); g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 2)); g.setIndex(idx); g.computeBoundingSphere();
  return g;
}

/** The island's bridge: an ancient arcade of stone. Piers stand in the lake every SPAN m; between them the deck's underside arches up; a parapet runs each side. Tuning. */
const SPAN = 13, PIER_W = 2.4, PARAPET_H = 0.75;
function bridgeGeometry(p: Plateau): THREE.BufferGeometry {
  const b = p.bridge, dx = b.to.x - b.from.x, dz = b.to.z - b.from.z, len = Math.hypot(dx, dz), ux = dx / len, uz = dz / len, yaw = Math.atan2(ux, uz), rand = mulberry32(260917), parts: THREE.BufferGeometry[] = [];
  const at = (t: number) => ({ x: b.from.x + ux * t, z: b.from.z + uz * t });
  const tint = (g: THREE.BufferGeometry) => { const n = g.attributes.position.count, c = new Float32Array(n * 3), k = 0.82 + rand() * 0.3, moss = rand() < 0.3; for (let i = 0; i < n; i++) { const y = g.attributes.position.getY(i); const m = moss && y < 1 ? 0.25 : 0; c[i * 3] = k * (1 - m * 0.4); c[i * 3 + 1] = k * (1 + m * 0.15); c[i * 3 + 2] = k * (1 - m * 0.5); } g.setAttribute('color', new THREE.BufferAttribute(c, 3)); return g; };
  const spans = Math.max(1, Math.round(len / SPAN)), span = len / spans;
  for (let t = 0; t < len; t += 0.9) {
    const c = at(t + 0.45), deck = p.deckAt(c.x, c.z) ?? 1, u = ((t + 0.45) % span) / span, arch = 1 - Math.sin(Math.PI * u), thick = 0.55 + 2.6 * arch * arch;
    // The deck's block, deeper toward the piers (the arch's spandrel), with its parapets.
    const slab = new THREE.BoxGeometry(b.halfW * 2 + 0.5, thick, 0.95); slab.rotateY(yaw); slab.translate(c.x, deck - thick / 2, c.z); parts.push(tint(slab.toNonIndexed()));
    for (const side of [-1, 1]) { const w = new THREE.BoxGeometry(0.32, PARAPET_H * (0.85 + rand() * 0.25), 0.95); w.rotateY(yaw); w.translate(c.x + uz * side * (b.halfW + 0.1), deck + PARAPET_H / 2, c.z - ux * side * (b.halfW + 0.1)); parts.push(tint(w.toNonIndexed())); }
  }
  for (let k = 1; k < spans; k++) {
    const c = at(k * span), deck = p.deckAt(c.x, c.z) ?? 1, bed = p.ground(c.x, c.z) - 0.5, h = deck - 2.4 - bed;
    if (h <= 0) continue;
    const pier = new THREE.BoxGeometry(b.halfW * 2 + 1.1, h, PIER_W); pier.rotateY(yaw); pier.translate(c.x, bed + h / 2, c.z); parts.push(tint(pier.toNonIndexed()));
    // A cutwater on its upstream face, as the old builders shaped them.
    const cut = new THREE.CylinderGeometry(0.01, (b.halfW * 2 + 1.1) / 2, h, 3, 1); cut.rotateY(yaw); cut.translate(c.x, bed + h / 2, c.z); parts.push(tint(cut.toNonIndexed()));
  }
  const g = mergeGeometries(parts)!; g.computeVertexNormals(); for (const x of parts) x.dispose(); return g;
}
