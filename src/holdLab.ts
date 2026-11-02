// The Hearth-Hold's pieces on plain ground (hold.html): the Ever-Hearth at the centre and a row of every stone furniture piece
// (holdFurniture.ts), a hobbit (0.9 m) and a 1.7 m pole (Hulda) for scale. Drag to turn, pinch or scroll to zoom; three views;
// day or night. `window.__holdLab` for checks.
import * as THREE from 'three';
import { createEverHearth, stoneMaterial, stoneBench, stoneTable, stoneDesk, blockSeat, stoneBedShelf, stoneBin, slabShelf } from './holdFurniture';
import { createHobbit, hobbitLook } from './hobbitFigure';

const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.setSize(innerWidth, innerHeight); renderer.outputColorSpace = THREE.SRGBColorSpace; document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.05, 200);
const sky = new THREE.Color('#a8bccb'), nightSky = new THREE.Color('#121a26'); scene.background = sky.clone(); scene.fog = new THREE.Fog(sky.clone(), 30, 80);
const hemi = new THREE.HemisphereLight('#e2e6ea', '#4a4030', 1.2), sun = new THREE.DirectionalLight('#fff2dc', 2.2); sun.position.set(6, 10, 4); scene.add(hemi, sun);
const ground = new THREE.Mesh(new THREE.CircleGeometry(50, 48), new THREE.MeshStandardMaterial({ color: '#6e6450', roughness: 1 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);

const hearth = createEverHearth(); scene.add(hearth.group);
// The furniture, behind the hearth on -z in short rows (a portrait phone sees ~22° across), each piece facing -z, its usual front,
// toward the row view's camera; the hearth beyond them.
const ROW_Z = -12, placed: Record<string, THREE.Mesh> = {};
const rows: [string, THREE.BufferGeometry, number][][] = [
  [['shelf', slabShelf(), 6]],
  [['table', stoneTable(), 9]],
  [['bed', stoneBedShelf(), 2.1], ['bin', stoneBin(), 1.7]],
  [['seat', blockSeat(), 0.8], ['bench', stoneBench(), 3], ['desk', stoneDesk(), 2.4]],
];
rows.forEach((row, ri) => {
  const total = row.reduce((s, r) => s + r[2], 0) + 1.2 * (row.length - 1); let x = -total / 2;
  for (const [k, g, w] of row) { const m = new THREE.Mesh(g, stoneMaterial()); m.position.set(x + w / 2, 0, ROW_Z + 4.5 - ri * 3); m.name = k; scene.add(m); placed[k] = m; x += w + 1.2; }
});
// Scale: a hobbit 0.9 m by the bench and by the hearth's seats; a 1.7 m pole (Hulda) by the table.
const still = { speed: 0, carry: null, eating: false, taking: false, inside: false } as const;
const hobbits = [[placed.bench.position.x - 1.9, placed.bench.position.z - 0.3, 0], [-1.9, -3.7, Math.PI * 0.8], [-1, 4.8, 0]].map(([hx, hz, h], i) => { const look = { ...hobbitLook(3, i), height: 0.9 }, f = createHobbit(look, 7 + i); scene.add(f.group); f.update(hx, 0, hz, h, { ...still }, 0.016); return { f, hx, hz, h }; });
const poleMat = new THREE.MeshStandardMaterial({ color: '#c8402a', roughness: 0.8 });
for (const [px, pz] of [[placed.table.position.x - 3.6, placed.table.position.z - 1.0], [1.4, 5.0]]) { const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.7, 8).translate(0, 0.85, 0), poleMat); pole.position.set(px, 0, pz); scene.add(pole); }

let fixed: THREE.Vector3 | null = null, view: 'hearth' | 'row' | 'wide' = 'hearth', night = 0, yaw = 0.5, pitch = 0.32, dist = 11;
const target = new THREE.Vector3(0, 0.8, 0);
const VIEWS = { hearth: { t: [0, 1.0, 0], yaw: 0.55, pitch: 0.3, dist: 11 }, row: { t: [0, 0.6, ROW_Z + 0.5], yaw: Math.PI + 0.08, pitch: 0.4, dist: 29 }, wide: { t: [0, 0.5, -5], yaw: 2.3, pitch: 0.55, dist: 40 } } as const;
const setView = (v: typeof view): void => { view = v; const p = VIEWS[v]; fixed = new THREE.Vector3(...p.t); yaw = p.yaw; pitch = p.pitch; dist = p.dist; document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('on', (b as HTMLElement).dataset.view === v)); };
setView('hearth');
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(b => b.onclick = () => setView(b.dataset.view as typeof view));
const nightB = document.getElementById('night')!; const setNight = (n: number): void => { night = n; nightB.textContent = night ? 'night' : 'day'; }; nightB.onclick = () => setNight(night ? 0 : 1);
const pts = new Map<number, { x: number; y: number }>(); let pinch = 0;
renderer.domElement.addEventListener('pointerdown', e => { pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); renderer.domElement.setPointerCapture(e.pointerId); });
renderer.domElement.addEventListener('pointermove', e => { const p = pts.get(e.pointerId); if (!p) return; if (pts.size === 1) { yaw -= (e.clientX - p.x) * 0.008; pitch = Math.max(0.05, Math.min(1.4, pitch + (e.clientY - p.y) * 0.006)); } p.x = e.clientX; p.y = e.clientY; if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch) dist = Math.max(1, Math.min(60, dist * pinch / d)); pinch = d; } });
const up = (e: PointerEvent): void => { pts.delete(e.pointerId); pinch = 0; }; renderer.domElement.addEventListener('pointerup', up); renderer.domElement.addEventListener('pointercancel', up);
renderer.domElement.addEventListener('wheel', e => { dist = Math.max(1, Math.min(60, dist * (1 + e.deltaY * 0.001))); });
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
let last = performance.now(), shown = 0;
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000); last = now;
  shown += (night - shown) * Math.min(1, dt * 4);
  hearth.update(now / 1000, dt, shown);
  if (fixed) target.copy(fixed);
  camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist, target.z + Math.cos(yaw) * Math.cos(pitch) * dist); camera.lookAt(target);
  const bg = sky.clone().lerp(nightSky, shown); (scene.background as THREE.Color).copy(bg); (scene.fog as THREE.Fog).color.copy(bg); hemi.intensity = 1.2 - 1.0 * shown; sun.intensity = 2.2 - 2.1 * shown;
  renderer.render(scene, camera); requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
Object.assign(window, { __holdLab: { scene, camera, THREE, renderer, hearth, hobbits, placed, setView, setNight: (n: number) => { setNight(n); shown = n; }, look: (lx: number, ly: number, lz: number, yw: number, p: number, d: number) => { fixed = new THREE.Vector3(lx, ly, lz); yaw = yw; pitch = p; dist = d; } } });
