// The deep node as scene (G4): the taproot's bore she dives down from the pool (a tube seen from inside,
// dark, its veins faintly lit) and the bore of a deep root she is launched along, built for each launch
// from its curve and taken away after; and the node itself (Noah): the inside of a spherical waterdrop,
// where every place the deep roots could reach is a point of light on the drop's skin, seen from below,
// and the reachable ones have a thread of root running up to them. Fog does the rest: while she is in a
// bore the entry sets it thick, so only the walls near her show, and the world beyond the pillar's stone
// never leaks through.
import * as THREE from 'three';
export interface DeepPoint { id: string; dir: THREE.Vector3; colour: string; size: number; reachable: boolean; faint?: boolean }
/** The drop's radius round the node; she sits at its centre. Tuning. */
export const DROP_R = 8;
/** The rush (Noah, 2026-09-27: the bore's wireframe held still and the ride did not read as fast travel): STREAK_N streaks of light in a sleeve round the camera's forward line, each STREAK_LEN long, rushing past at STREAK_SPEED and wrapping, like the stars of a jump to lightspeed. Tuning. */
export const STREAK_N = 320, STREAK_LEN = 5, STREAK_SPEED = 90, STREAK_AHEAD = 70;
export function createDeepWorld(scene: THREE.Scene, camera: THREE.Camera) {
  const wall = new THREE.MeshStandardMaterial({ color: '#2a1d0c', emissive: '#4a2c10', emissiveIntensity: 0.25, roughness: 1, side: THREE.BackSide });
  // The veins: the bore's own mesh drawn again as a wireframe, seen from inside, so the walls have lines that stream past (the pace reads).
  const vein = new THREE.MeshBasicMaterial({ color: '#c9a24a', transparent: true, opacity: 0.35, depthWrite: false, wireframe: true, side: THREE.BackSide });
  const group = new THREE.Group(); group.name = 'deep'; group.visible = false; scene.add(group);
  let bore: THREE.Mesh | null = null, veins: THREE.Mesh | null = null;
  // The rush: line segments in the camera's own space (z forward is -z), each at its angle and radius round the axis, moving toward the camera and wrapping ahead again.
  const streakPos = new Float32Array(STREAK_N * 6), streakZ = new Float32Array(STREAK_N), streakR = new Float32Array(STREAK_N), streakA = new Float32Array(STREAK_N), streakL = new Float32Array(STREAK_N);
  for (let i = 0; i < STREAK_N; i++) { streakZ[i] = -Math.random() * STREAK_AHEAD; streakR[i] = 0.25 + Math.random() * 1.1; streakA[i] = Math.random() * Math.PI * 2; streakL[i] = STREAK_LEN * (0.4 + Math.random() * 0.9); }
  const streakGeo = new THREE.BufferGeometry(); streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPos, 3));
  const streaks = new THREE.LineSegments(streakGeo, new THREE.LineBasicMaterial({ color: '#dff4ff', transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending })); streaks.frustumCulled = false; streaks.visible = false; camera.add(streaks);
  const rushGlow = new THREE.Sprite(new THREE.SpriteMaterial({ color: '#9fd8ff', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending })); rushGlow.position.set(0, 0, -STREAK_AHEAD * 0.9); rushGlow.scale.setScalar(14); rushGlow.visible = false; camera.add(rushGlow);
  function layStreaks(): void { for (let i = 0; i < STREAK_N; i++) { const x = Math.cos(streakA[i]) * streakR[i], y = Math.sin(streakA[i]) * streakR[i], o = i * 6; streakPos[o] = x; streakPos[o + 1] = y; streakPos[o + 2] = streakZ[i]; streakPos[o + 3] = x; streakPos[o + 4] = y; streakPos[o + 5] = streakZ[i] - streakL[i]; } (streakGeo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true; }
  /** The rush on or off (dive and launch). */
  function rush(on: boolean): void { streaks.visible = on; rushGlow.visible = on; if (on) layStreaks(); }
  let lastT = -1;
  // The drop: a sphere seen from inside, deep water-blue, its skin a slow wireframe of caustics, specks drifting in it.
  const drop = new THREE.Group(); drop.name = 'drop'; group.add(drop);
  const skinMat = new THREE.MeshStandardMaterial({ color: '#0b1c2e', emissive: '#12304a', emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.1, side: THREE.BackSide });
  drop.add(new THREE.Mesh(new THREE.SphereGeometry(DROP_R, 32, 24), skinMat));
  const causticMat = new THREE.MeshBasicMaterial({ color: '#6fb8e8', transparent: true, opacity: 0.12, depthWrite: false, wireframe: true, side: THREE.BackSide });
  const caustics = new THREE.Mesh(new THREE.SphereGeometry(DROP_R * 0.985, 18, 12), causticMat); drop.add(caustics);
  const horizonMat = new THREE.LineBasicMaterial({ color: '#8fd0f0', transparent: true, opacity: 0.35 });
  const ring = (r: number, y: number): THREE.Line => { const pts: THREE.Vector3[] = []; for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)); } return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), horizonMat); };
  drop.add(ring(DROP_R * 0.99, 0));
  let reachRing: THREE.Line | null = null;
  const specks = (() => { const n = 260, pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, b = Math.acos(2 * Math.random() - 1), r = DROP_R * (0.3 + 0.65 * Math.cbrt(Math.random())); pos[i * 3] = Math.sin(b) * Math.cos(a) * r; pos[i * 3 + 1] = Math.cos(b) * r; pos[i * 3 + 2] = Math.sin(b) * Math.sin(a) * r; } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); return new THREE.Points(g, new THREE.PointsMaterial({ color: '#bfe8ff', size: 0.06, transparent: true, opacity: 0.5, depthWrite: false })); })();
  drop.add(specks);
  const glow = new THREE.PointLight('#b8d8ff', 1.8, 30, 1.5); glow.position.y = 1.5; drop.add(glow);
  // The points of light: a soft disc each, on the drop's skin; the reachable ones with a thread of root up from the node.
  const discTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d')!, grad = g.createRadialGradient(32, 32, 0, 32, 32, 32); grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.35, 'rgba(255,255,255,0.85)'); grad.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = grad; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); return t; })();
  const points = new THREE.Group(); drop.add(points); const threads = new THREE.Group(); drop.add(threads);
  const sprites = new Map<string, THREE.Sprite>();
  function setPoints(list: DeepPoint[]): void {
    for (const s of [...points.children]) { points.remove(s); (s as THREE.Sprite).material.dispose(); } sprites.clear();
    for (const l of [...threads.children]) { threads.remove(l); (l as THREE.Line).geometry.dispose(); }
    for (const p of list) {
      const mat = new THREE.SpriteMaterial({ map: discTex, color: p.colour, transparent: true, opacity: p.faint ? 0.35 : p.reachable ? 1 : 0.45, depthWrite: false }), s = new THREE.Sprite(mat); s.position.copy(p.dir).multiplyScalar(DROP_R * 0.96); s.scale.setScalar(p.size); s.name = p.id; s.userData.id = p.id; points.add(s); sprites.set(p.id, s);
      if (p.reachable) { const a = p.dir.clone().multiplyScalar(1.2), b = p.dir.clone().multiplyScalar(DROP_R * 0.95), pts: THREE.Vector3[] = []; for (let i = 0; i <= 12; i++) { const t = i / 12, q = a.clone().lerp(b, t); q.x += Math.sin(t * 9 + p.dir.x * 5) * 0.12 * (1 - t); q.z += Math.cos(t * 7 + p.dir.z * 5) * 0.12 * (1 - t); pts.push(q); } threads.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: p.colour, transparent: true, opacity: 0.55 }))); }
    }
  }
  /** The reach's ring on the drop, at the angle from the zenith the reach subtends. */
  function setReach(angle: number): void { if (reachRing) { drop.remove(reachRing); reachRing.geometry.dispose(); } reachRing = ring(DROP_R * 0.985 * Math.sin(angle), DROP_R * 0.985 * Math.cos(angle)); (reachRing.material as THREE.LineBasicMaterial).opacity = 0.2; drop.add(reachRing); }
  /** The point a ray hits, if any. */
  function pointAt(ray: THREE.Raycaster): string | null { const hits = ray.intersectObjects(points.children, false); return hits.length ? (hits[0].object.userData.id as string) : null; }
  const spritePosition = (id: string, out: THREE.Vector3): boolean => { const s = sprites.get(id); if (!s) return false; s.getWorldPosition(out); return true; };
  function clearBore(): void { if (bore) { group.remove(bore); bore.geometry.dispose(); bore = null; } if (veins) { group.remove(veins); veins.geometry.dispose(); veins = null; } }
  /** A bore along a curve (world coordinates), radius r: she rides inside it. */
  function setBore(curve: THREE.Curve<THREE.Vector3>, r = 1.4): void {
    clearBore(); const segs = Math.max(12, Math.ceil(curve.getLength() / 3));
    bore = new THREE.Mesh(new THREE.TubeGeometry(curve, segs, r, 10, false), wall); group.add(bore);
    veins = new THREE.Mesh(new THREE.TubeGeometry(curve, segs * 2, r * 0.97, 10, false), vein); group.add(veins);
  }
  /** The drop at the node. */
  function setNode(at: THREE.Vector3): void { drop.position.copy(at); }
  function showDrop(on: boolean): void { drop.visible = on; }
  function show(on: boolean): void { group.visible = on; if (!on) clearBore(); }
  function update(t: number): void {
    const dt = lastT < 0 ? 0 : Math.min(0.25, (t - lastT) / 1000); lastT = t;
    if (streaks.visible && dt > 0) { for (let i = 0; i < STREAK_N; i++) { streakZ[i] += STREAK_SPEED * dt; if (streakZ[i] > 1) streakZ[i] -= STREAK_AHEAD; } layStreaks(); }
    if (!group.visible) return; vein.opacity = 0.25 + 0.15 * Math.sin(t * 0.004); if (!drop.visible) return; caustics.rotation.y = t * 0.00005; caustics.rotation.x = Math.sin(t * 0.00007) * 0.2; specks.rotation.y = -t * 0.00003; glow.intensity = 1.6 + 0.4 * Math.sin(t * 0.0023); for (const s of points.children) { const k = 1 + 0.12 * Math.sin(t * 0.003 + s.position.x * 3); (s as THREE.Sprite).scale.setScalar(((s as THREE.Sprite).userData.size ?? s.scale.x / (s.userData.k ?? 1)) * k); s.userData.size = s.userData.size ?? s.scale.x / k; s.userData.k = k; } }
  return { setBore, clearBore, setNode, setPoints, setReach, pointAt, spritePosition, showDrop, show, rush, update, get rushing() { return streaks.visible; }, get shown() { return group.visible; }, get dropShown() { return drop.visible; }, get pointCount() { return points.children.length; } };
}
export type DeepWorld = ReturnType<typeof createDeepWorld>;
