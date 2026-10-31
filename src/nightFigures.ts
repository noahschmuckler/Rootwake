// E2a (EDEN.md, ECOLOGY.md): the night's living things. The nest-burl: a lumpy growth on a trunk high up with three luminescent eggs
// in its top (the eggs the birds hatch from, glowing by night; Noah, 2026-10-31: "luminescent, both as eggs in their burl nests and
// when flying"). The bird-fungus: a glowing puffball body with two membrane wings, soaring like a spore. The bobcat, in the Hollowed's
// design language (ECOLOGY.md: tall, gaunt, hooded and robed, a beaked mask, glowing red-orange eyes, grey clawed hands): a gaunt grey
// cat with a hood-like ruff, a dark beaked muzzle, ember eyes and grey claws, that prowls, climbs a trunk and leaps. Cel look: flat
// shading and black back-face hulls, as the Eden's other figures.
import * as THREE from 'three';
import { mulberry32 } from './colors';

/** The eggs' and the birds' glow colour, and how bright they get by full night (bloom catches what is brighter than sunlit ground). Tuning. */
const GLOW = '#9df5c8', EGG_GLOW_NIGHT = 3.6, BIRD_GLOW_NIGHT = 3.2, EYE_GLOW = '#ff6a2a';
const hullMat = (): THREE.MeshBasicMaterial => new THREE.MeshBasicMaterial({ color: '#120d08', side: THREE.BackSide });
function lumpy(radius: number, seed: number, lump = 0.22, detail = 1): THREE.BufferGeometry {
  const g = new THREE.IcosahedronGeometry(radius, detail), p = g.attributes.position as THREE.BufferAttribute, r = mulberry32(seed), j = new Map<string, number>();
  for (let i = 0; i < p.count; i++) { const k = `${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`; let f = j.get(k); if (f === undefined) { f = 1 + (r() - 0.5) * 2 * lump; j.set(k, f); } p.setXYZ(i, p.getX(i) * f, p.getY(i) * f, p.getZ(i) * f); }
  g.computeVertexNormals(); return g;
}

export interface BurlFigure { group: THREE.Group; /** The eggs' glow by the night (0..1) and whether there are eggs. */ update(night: number, eggs: boolean, time: number): void; dispose(): void }
export function createBurl(seed = 1): BurlFigure {
  const group = new THREE.Group(), geoms: THREE.BufferGeometry[] = [];
  const bark = new THREE.MeshStandardMaterial({ color: '#5a4630', roughness: 1, flatShading: true }), egg = new THREE.MeshStandardMaterial({ color: '#cfe8d8', emissive: GLOW, emissiveIntensity: 0.2, roughness: 0.5 }), hull = hullMat();
  const body = lumpy(0.46, seed * 23 + 1); geoms.push(body); const m = new THREE.Mesh(body, bark); m.scale.set(1.25, 0.8, 1); group.add(m); const o = new THREE.Mesh(body, hull); o.scale.setScalar(1.06); o.renderOrder = -1; m.add(o);
  const eggs: THREE.Mesh[] = []; const eg = new THREE.SphereGeometry(0.15, 10, 8); geoms.push(eg);
  for (let i = 0; i < 3; i++) { const e = new THREE.Mesh(eg, egg); const a = i * 2.1; e.position.set(Math.cos(a) * 0.19, 0.46, Math.sin(a) * 0.19); e.scale.set(1, 1.2, 1); group.add(e); eggs.push(e); }
  function update(night: number, has: boolean, time: number): void { for (const e of eggs) e.visible = has; egg.emissiveIntensity = 0.2 + EGG_GLOW_NIGHT * night * (0.85 + Math.sin(time * 0.0017 + seed) * 0.15); }
  function dispose(): void { for (const g of geoms) g.dispose(); bark.dispose(); egg.dispose(); hull.dispose(); }
  return { group, update, dispose };
}

export interface BirdFigure { group: THREE.Group; update(x: number, y: number, z: number, heading: number, night: number, dt: number): void; dispose(): void }
export function createBird(seed = 1): BirdFigure {
  const group = new THREE.Group(), geoms: THREE.BufferGeometry[] = [];
  const puff = new THREE.MeshStandardMaterial({ color: '#dff5ea', emissive: GLOW, emissiveIntensity: 0.3, roughness: 0.6 }), wing = new THREE.MeshStandardMaterial({ color: '#bfeedd', emissive: GLOW, emissiveIntensity: 0.2, roughness: 0.7, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
  const bg = lumpy(0.2, seed * 29 + 3, 0.15, 1); geoms.push(bg); const body = new THREE.Mesh(bg, puff); body.scale.set(1, 0.85, 1.3); group.add(body);
  const wings: THREE.Mesh[] = []; const wg = new THREE.PlaneGeometry(0.62, 0.36); geoms.push(wg);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(wg, wing); w.position.set(s * 0.32, 0.02, 0); w.rotation.x = -Math.PI / 2; group.add(w); wings.push(w); }
  let phase = seed;
  function update(x: number, y: number, z: number, heading: number, night: number, dt: number): void {
    group.position.set(x, y, z); group.rotation.y = heading; phase += dt * 2.2;
    const flap = Math.sin(phase) * 0.55; wings[0].rotation.z = flap; wings[1].rotation.z = -flap; group.rotation.z = Math.sin(phase * 0.5) * 0.12;
    puff.emissiveIntensity = 0.3 + BIRD_GLOW_NIGHT * night; wing.emissiveIntensity = 0.2 + BIRD_GLOW_NIGHT * 0.5 * night;
  }
  function dispose(): void { for (const g of geoms) g.dispose(); puff.dispose(); wing.dispose(); }
  return { group, update, dispose };
}

export interface BobcatState { act: 'sleeping' | 'prowling' | 'climbing' | 'eating' | 'descending' | 'leaping' | 'homing'; speed: number; /** 0..1 up the trunk. */ up: number }
export interface BobcatFigure { group: THREE.Group; update(x: number, y: number, z: number, heading: number, s: BobcatState, night: number, dt: number): void; dispose(): void }
export function createBobcat(): BobcatFigure {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body); const geoms: THREE.BufferGeometry[] = [];
  const hide = new THREE.MeshStandardMaterial({ color: '#b4b0a6', roughness: 0.95, flatShading: true }), robe = new THREE.MeshStandardMaterial({ color: '#5c5864', roughness: 1, flatShading: true }), mask = new THREE.MeshStandardMaterial({ color: '#1e1a1c', roughness: 0.9, flatShading: true }), claw = new THREE.MeshStandardMaterial({ color: '#b8b4ac', roughness: 0.8 }), eye = new THREE.MeshStandardMaterial({ color: EYE_GLOW, emissive: EYE_GLOW, emissiveIntensity: 1.5 }), hull = hullMat();
  const mk = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D = body): THREE.Mesh => { geoms.push(g); const o = new THREE.Mesh(g, m); parent.add(o); return o; };
  const outline = (m: THREE.Mesh, k = 1.07): void => { const o = new THREE.Mesh(m.geometry, hull); o.scale.setScalar(k); o.renderOrder = -1; m.add(o); };
  // Gaunt: a long narrow body high on its legs (the figure faces -z), a hood-like ruff round the neck, a small head with a beaked muzzle and ember eyes, a bobbed tail.
  const trunk = mk(new THREE.SphereGeometry(0.2, 9, 7), hide); trunk.scale.set(0.75, 0.8, 2.1); trunk.position.set(0, 0.5, 0); outline(trunk);
  const ruff = mk(new THREE.ConeGeometry(0.21, 0.26, 8, 1, true), robe); ruff.rotation.x = -Math.PI / 2; ruff.position.set(0, 0.58, -0.34); outline(ruff, 1.05);
  const head = mk(new THREE.SphereGeometry(0.11, 8, 6), hide); head.scale.set(1, 0.9, 1.1); head.position.set(0, 0.64, -0.5); outline(head);
  const beak = mk(new THREE.ConeGeometry(0.05, 0.16, 6), mask); beak.rotation.x = -Math.PI / 2; beak.position.set(0, 0.6, -0.64);
  const eyes: THREE.Mesh[] = []; for (const s of [-1, 1]) { const e = mk(new THREE.SphereGeometry(0.03, 6, 5), eye); e.position.set(s * 0.055, 0.66, -0.58); eyes.push(e); const ear = mk(new THREE.ConeGeometry(0.035, 0.09, 4), hide); ear.position.set(s * 0.07, 0.75, -0.47); const tuft = mk(new THREE.ConeGeometry(0.012, 0.05, 3), mask); tuft.position.set(s * 0.07, 0.81, -0.47); }
  const legs: THREE.Group[] = [];
  for (let i = 0; i < 4; i++) { const l = new THREE.Group(); l.position.set((i % 2 ? 1 : -1) * 0.11, 0.42, i < 2 ? -0.26 : 0.26); body.add(l); legs.push(l); const up = mk(new THREE.CylinderGeometry(0.035, 0.03, 0.42, 5), hide, l); up.position.y = -0.21; const paw = mk(new THREE.SphereGeometry(0.04, 6, 5), hide, l); paw.position.y = -0.42; paw.scale.set(1, 0.6, 1.3); for (let c = 0; c < 3; c++) { const cl = mk(new THREE.ConeGeometry(0.008, 0.035, 3), claw, l); cl.position.set((c - 1) * 0.022, -0.43, -0.055); cl.rotation.x = -Math.PI / 2; } }
  const tail = mk(new THREE.CylinderGeometry(0.03, 0.02, 0.14, 5), hide); tail.position.set(0, 0.56, 0.44); tail.rotation.x = 0.9;
  let phase = 0;
  function update(x: number, y: number, z: number, heading: number, s: BobcatState, night: number, dt: number): void {
    group.position.set(x, y, z); group.rotation.y = heading; eye.emissiveIntensity = 0.6 + 2.2 * night;
    const climbing = s.act === 'climbing' || s.act === 'eating' || s.act === 'descending', lying = s.act === 'sleeping';
    if (s.speed > 0 || s.act === 'leaping') { phase += dt * (s.act === 'leaping' ? 14 : 7 + s.speed * 3); for (let i = 0; i < 4; i++) legs[i].rotation.x = Math.sin(phase + (i % 3) * Math.PI * 0.6) * 0.55; } else { phase += dt; for (const l of legs) l.rotation.x = climbing ? 0.9 : lying ? 1.3 : 0; }
    // Up a trunk: the body stands vertical against it, head up; eating, the head dips. Asleep: low, curled a little. Leaping: the body stretched forward and up.
    body.rotation.x = climbing ? -Math.PI / 2 + 0.15 : s.act === 'leaping' ? -0.35 : 0; body.position.y = climbing ? 0.3 : lying ? -0.22 : s.act === 'leaping' ? 0.25 + Math.sin(phase) * 0.1 : 0; body.rotation.z = lying ? 0.25 : 0; head.rotation.x = s.act === 'eating' ? 0.6 + Math.sin(phase * 3) * 0.2 : 0; tail.rotation.z = Math.sin(phase * 0.7) * 0.3;
  }
  function dispose(): void { for (const g of geoms) g.dispose(); hide.dispose(); robe.dispose(); mask.dispose(); claw.dispose(); eye.dispose(); hull.dispose(); }
  return { group, update, dispose };
}
