// The hen's grove on plain ground (hen.html): the two trunks, a hearth, the hen's cycle and the hobbit's harvest on a loop, to judge
// the figure and its beats at a phone's size without the Eden around it. Drag to turn, pinch or scroll to zoom; follow the hen, the
// hobbit or the whole grove; ×1/×4 time; day or night. `window.__hen` for checks.
import * as THREE from 'three';
import { createHenGrove, TRUNK_R, GROVE_GAP } from './henGrove';

const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.setSize(innerWidth, innerHeight); renderer.outputColorSpace = THREE.SRGBColorSpace; document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.05, 200);
const sky = new THREE.Color('#9cc0d8'), nightSky = new THREE.Color('#162030'); scene.background = sky.clone(); scene.fog = new THREE.Fog(sky.clone(), 20, 60);
const hemi = new THREE.HemisphereLight('#dfe8f0', '#4a4030', 1.2), sun = new THREE.DirectionalLight('#fff2dc', 2.2); sun.position.set(6, 10, 4); scene.add(hemi, sun);
const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 48), new THREE.MeshStandardMaterial({ color: '#7a6a48', roughness: 1 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
const hearth = { x: 0, z: 10 }, trees: [{ x: number; z: number }, { x: number; z: number }] = [{ x: -GROVE_GAP / 2, z: 0 }, { x: GROVE_GAP / 2, z: 0 }];
const bark = new THREE.MeshStandardMaterial({ color: '#5a4030', roughness: 1, flatShading: true }), hull = new THREE.MeshBasicMaterial({ color: '#1a1008', side: THREE.BackSide }), leaf = new THREE.MeshStandardMaterial({ color: '#3e5a2a', roughness: 1, flatShading: true });
for (const t of trees) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, TRUNK_R, 9, 12).translate(0, 4.5, 0), bark); trunk.position.set(t.x, 0, t.z); const h = new THREE.Mesh(trunk.geometry, hull); h.scale.set(1.05, 1, 1.05); trunk.add(h); scene.add(trunk);
  for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 + (i % 3) * 0.3, 0), leaf); c.position.set(t.x + Math.cos(i * 2.3) * 0.9, 7 + i * 0.5, t.z + Math.sin(i * 2.3) * 0.9); scene.add(c); }
}
const stone = new THREE.MeshStandardMaterial({ color: '#6a6660', roughness: 1, flatShading: true });
for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.14, 0), stone); m.position.set(hearth.x + Math.cos(a) * 0.55, 0.08, hearth.z + Math.sin(a) * 0.55); scene.add(m); }
const grove = createHenGrove(scene, () => 0, hearth, trees, 1);
let follow: 'hen' | 'hobbit' | 'wide' = 'hen', speed = 1, night = 0, yaw = 0.35, pitch = 0.32, dist = 2.6;
const target = new THREE.Vector3(0, 0.3, 0); let snap = true;
document.querySelectorAll<HTMLButtonElement>('[data-follow]').forEach(b => b.onclick = () => { follow = b.dataset.follow as typeof follow; dist = follow === 'wide' ? 11 : 2.6; document.querySelectorAll('[data-follow]').forEach(x => x.classList.toggle('on', x === b)); });
const fast = document.getElementById('fast')!; fast.onclick = () => { speed = speed === 1 ? 4 : 1; fast.textContent = `×${speed}`; };
const nightB = document.getElementById('night')!; nightB.onclick = () => { night = night ? 0 : 1; nightB.textContent = night ? 'night' : 'day'; };
const pts = new Map<number, { x: number; y: number }>(); let pinch = 0;
renderer.domElement.addEventListener('pointerdown', e => { pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); renderer.domElement.setPointerCapture(e.pointerId); });
renderer.domElement.addEventListener('pointermove', e => { const p = pts.get(e.pointerId); if (!p) return; if (pts.size === 1) { yaw -= (e.clientX - p.x) * 0.008; pitch = Math.max(0.05, Math.min(1.3, pitch + (e.clientY - p.y) * 0.006)); } p.x = e.clientX; p.y = e.clientY; if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch) dist = Math.max(0.8, Math.min(30, dist * pinch / d)); pinch = d; } });
const up = (e: PointerEvent): void => { pts.delete(e.pointerId); pinch = 0; }; renderer.domElement.addEventListener('pointerup', up); renderer.domElement.addEventListener('pointercancel', up);
renderer.domElement.addEventListener('wheel', e => { dist = Math.max(0.8, Math.min(30, dist * (1 + e.deltaY * 0.001))); });
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
let last = performance.now();
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000) * speed; last = now;
  for (let s = dt; s > 0; s -= 0.05) grove.update(Math.min(0.05, s), night);
  const st = grove.state, want = follow === 'hen' ? new THREE.Vector3(st.hen.x, 0.25, st.hen.z) : follow === 'hobbit' ? new THREE.Vector3(st.hobbit.x, 0.25, st.hobbit.z) : new THREE.Vector3(0, 0.3, 4);
  target.lerp(want, snap ? 1 : 0.08); snap = false;
  camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist); camera.lookAt(target);
  const bg = sky.clone().lerp(nightSky, night); (scene.background as THREE.Color).copy(bg); (scene.fog as THREE.Fog).color.copy(bg); hemi.intensity = 1.2 - 0.9 * night; sun.intensity = 2.2 - 2.0 * night;
  renderer.render(scene, camera); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
Object.assign(window, { __hen: { grove, camera, view: (y: number, p: number, d: number, f: typeof follow = follow) => { yaw = y; pitch = p; dist = d; follow = f; snap = true; }, set speed(v: number) { speed = v; } } });
