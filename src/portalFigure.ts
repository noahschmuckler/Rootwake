// The portal between the karst's catwalks and the outside world (PLATEAU.md, T5): an arch of the karst's
// old stone, brass-banded, round a standing film of light that swirls slowly while it is shut and opens
// (brightens, spins, its centre clearing) while she channels clarity into it. The same figure stands in an
// alcove of each catwalk and at the island's foot.
import * as THREE from 'three';

const filmVert = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const filmFrag = /* glsl */`
uniform float uTime; uniform float uOpen; uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * vec2(1.0, 1.55); float r = length(p), a = atan(p.y, p.x);
  if (r > 0.5) discard;
  float spin = a + uTime * (0.4 + 2.2 * uOpen) + r * (8.0 - 3.0 * uOpen);
  float arms = 0.5 + 0.5 * sin(spin * 3.0), rings = 0.5 + 0.5 * sin(r * 30.0 - uTime * (2.0 + 4.0 * uOpen));
  vec3 col = mix(uA, uB, arms) * (0.6 + 0.5 * rings);
  float edge = smoothstep(0.5, 0.38, r), core = smoothstep(0.32 * uOpen, 0.0, r) * uOpen;
  col += vec3(1.0) * core * 1.4;
  gl_FragColor = vec4(col * (1.0 + 1.6 * uOpen), edge * (0.55 + 0.4 * uOpen));
}`;

export interface PortalFigure { group: THREE.Group; film: THREE.Mesh; update(t: number, open: number): void; dispose(): void }
/** A portal `h` m tall, its opening facing +z. */
export function makePortal(h: number): PortalFigure {
  const group = new THREE.Group(); group.name = 'portal';
  const w = h * 0.62, stone = new THREE.MeshStandardMaterial({ color: '#8f8a7e', roughness: 0.95, flatShading: true }), brass = new THREE.MeshStandardMaterial({ color: '#b08a3e', roughness: 0.45, metalness: 0.7, flatShading: true });
  const geos: THREE.BufferGeometry[] = [];
  // The arch: two posts and a round top of blocks.
  for (const s of [-1, 1]) { const post = new THREE.BoxGeometry(h * 0.14, h * 0.62, h * 0.16); post.translate(s * (w / 2 + h * 0.05), h * 0.31, 0); geos.push(post); }
  const arc = new THREE.TorusGeometry(w / 2 + h * 0.05, h * 0.075, 5, 14, Math.PI); arc.translate(0, h * 0.62, 0); geos.push(arc);
  const band = new THREE.TorusGeometry(w / 2 + h * 0.05, h * 0.085, 4, 14, Math.PI); band.scale(1, 1, 0.35); band.translate(0, h * 0.62, h * 0.05);
  const step = new THREE.BoxGeometry(w + h * 0.4, h * 0.05, h * 0.42); step.translate(0, h * 0.025, 0); geos.push(step);
  for (const g of geos) group.add(new THREE.Mesh(g, stone));
  group.add(new THREE.Mesh(band, brass));
  const film = new THREE.Mesh(new THREE.PlaneGeometry(w, h * 0.9), new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uOpen: { value: 0 }, uA: { value: new THREE.Color('#3fb8d8') }, uB: { value: new THREE.Color('#9a6cff') } }, vertexShader: filmVert, fragmentShader: filmFrag, transparent: true, depthWrite: false, side: THREE.FrontSide, blending: THREE.AdditiveBlending }));
  // One-sided: a camera that swings behind it (her third person, stepping out) does not look out through its light.
  film.position.set(0, h * 0.5, 0); film.name = 'portal-film'; group.add(film);
  // A faint glow while shut (in daylight it should not tint whoever stands before it), brighter as it opens. Tuning.
  const light = new THREE.PointLight('#9fc8ff', 0.4, h * 2, 2); light.position.set(0, h * 0.5, h * 0.4); group.add(light);
  return {
    group, film,
    update(t, open) { const u = (film.material as THREE.ShaderMaterial).uniforms; u.uTime.value = t; u.uOpen.value = open; light.intensity = 0.4 + open * 4; },
    dispose() { group.removeFromParent(); group.traverse(o => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach(x => x.dispose()); }); },
  };
}
