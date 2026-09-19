import './rootDiscovery.css';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Player, type Collider } from './player';
import { installMobilityControls } from './mobilityControls';
import { Board, type Cell } from './match3';
import { BoardView } from './board3d';
import { mulberry32, PALETTE } from './colors';
import type { TraversalWorld } from './mobility';

// Root vision is entered by sinking: the same body, the same stick and look, freed from the ground.
// Tuning (judge on the phone): how long the sink takes, how deep it rests, how far a single drift
// reaches per ability, and where each ability's floor lies.
const SINK_S = 2.6, RISE_S = 1.6;
/** Feet come to rest this far under the surface; the eye rides EYE_HEIGHT above the feet. */
const SINK_DEPTH = 1.7;
/** The eye never breaks the surface from below: the ground is the roof. */
const ROOF_MARGIN = 0.1;
/** Close and wide listening reach through loam down to here (feet); the clay is a harder soil. */
const LISTEN_FLOOR = -3.6;
/** Bedrock: solid rock under everything, the floor of deep listening. */
const BEDROCK = -7.0;
const CLAY_TOP = -2.22, CLAY_X = 2, CLAY_Z = -2, CLAY_RADIUS = 8;
/** How far one drift reaches, as a share of the shared reach (4.2 m), per ability. */
const REACH_SCALE = { close: 0.8, wide: 1.0, deep: 1.1 };
const WORLD_RADIUS = 25;

type Mode = 'surface' | 'roots' | 'cultivate';
interface Progress { energy: number; wide: boolean; listened: boolean; deep: boolean; restored: boolean }
const KEY = 'rootwake-remembering-spring-v1';
const fresh = (): Progress => ({ energy: 0, wide: false, listened: false, deep: false, restored: false });
let state = fresh();
try {
  const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
  if (saved && Number.isFinite(saved.energy)) state = { energy: THREE.MathUtils.clamp(saved.energy, 0, 120), wide: saved.wide === true, listened: saved.listened === true, deep: saved.deep === true, restored: saved.restored === true };
} catch { /* Storage can be unavailable in private browsing. */ }
function save(): void { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* Play remains available. */ } }
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const button = (id: string) => el<HTMLButtonElement>(id);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#172d29');
scene.fog = new THREE.FogExp2('#172d29', .026);
const camera = new THREE.PerspectiveCamera(63, innerWidth / innerHeight, .05, 160);
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
document.body.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight('#e1f1cf', '#344640', 2.4));
const sunlight = new THREE.DirectionalLight('#ffe5ab', 2.6); sunlight.position.set(-10, 20, 8); scene.add(sunlight);
const underlight = new THREE.PointLight('#93cfb0', 35, 35, 1.5); underlight.position.set(0, -5, 5); scene.add(underlight);
const surface = new THREE.Group(), roots = new THREE.Group(), shallow = new THREE.Group(), extended = new THREE.Group(), deep = new THREE.Group(), chamber = new THREE.Group();
scene.add(surface, roots); roots.add(shallow, extended, deep, chamber); roots.visible = false;
const rand = mulberry32(190926);
const groundHeight = (x: number, z: number) => .16 * Math.sin(x * .34) * Math.cos(z * .29) + .10 * Math.sin(z * .8);
const groundGeo = new THREE.PlaneGeometry(55, 55, 70, 70); groundGeo.rotateX(-Math.PI / 2);
const positions = groundGeo.attributes.position;
for (let i = 0; i < positions.count; i++) positions.setY(i, groundHeight(positions.getX(i), positions.getZ(i)));
groundGeo.computeVertexNormals();
const earth = new THREE.MeshStandardMaterial({ color: '#465944', roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 1 });
const ground = new THREE.Mesh(groundGeo, earth); scene.add(ground);
const bark = new THREE.MeshStandardMaterial({ color: '#656245', roughness: 1 });
const foliage = new THREE.MeshStandardMaterial({ color: '#5b7852', roughness: 1, flatShading: true });
const dryFoliage = new THREE.MeshStandardMaterial({ color: '#867549', roughness: 1, flatShading: true });
const trees: { x: number; z: number; scale: number; dry?: boolean }[] = [{ x: 0, z: 0, scale: 1.4 }, { x: 10, z: -5, scale: 1.05, dry: true }, { x: -7, z: -5, scale: 1.2 }];
for (let i = 0; i < 25; i++) { const a = rand() * Math.PI * 2, r = 13 + rand() * 12; trees.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, scale: .8 + rand() * .6 }); }
const colliders: Collider[] = [];
const crownGeo = new THREE.IcosahedronGeometry(1, 1);
for (const tree of trees) {
  const g = new THREE.Group(); g.position.set(tree.x, groundHeight(tree.x, tree.z), tree.z); surface.add(g);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18 * tree.scale, .45 * tree.scale, 4 * tree.scale, 7), bark); trunk.position.y = 2 * tree.scale; g.add(trunk);
  for (let j = 0; j < 4; j++) {
    const crown = new THREE.Mesh(crownGeo, tree.dry ? dryFoliage : foliage);
    crown.position.set((rand() - .5) * 2, (3.7 + rand() * 1.5) * tree.scale, (rand() - .5) * 2); crown.scale.set(1.5 * tree.scale, 1.1 * tree.scale, 1.5 * tree.scale); g.add(crown);
  }
  colliders.push({ x: tree.x, z: tree.z, radius: .45 * tree.scale, minY: 0, maxY: 5 });
}
const grassGeo = new THREE.ConeGeometry(.075, .3, 3), grass = new THREE.InstancedMesh(grassGeo, foliage, 700), transform = new THREE.Object3D();
for (let i = 0; i < 700; i++) { const x = (rand() - .5) * 46, z = (rand() - .5) * 46; transform.position.set(x, groundHeight(x, z) + .1, z); transform.rotation.y = rand() * 6.28; transform.scale.setScalar(.4 + rand()); transform.updateMatrix(); grass.setMatrixAt(i, transform.matrix); } surface.add(grass);
const poolMat = new THREE.MeshStandardMaterial({ color: '#76c2b8', emissive: '#28585c', emissiveIntensity: .45, roughness: .23, metalness: .25, transparent: true, opacity: .8, side: THREE.DoubleSide });
const pool = new THREE.Mesh(new THREE.CircleGeometry(1.4, 40), poolMat); pool.rotation.x = -Math.PI / 2; pool.position.set(-2.2, .10, -1.8); scene.add(pool);
const rootMat = new THREE.MeshStandardMaterial({ color: '#c8b078', emissive: '#806b30', emissiveIntensity: .42, roughness: .85 });
const fineMat = new THREE.MeshStandardMaterial({ color: '#a3bd8b', emissive: '#416b51', emissiveIntensity: .6, roughness: .8 });
const deepMat = new THREE.MeshStandardMaterial({ color: '#ddc989', emissive: '#a77c31', emissiveIntensity: .5, roughness: .65 });
function tube(points: THREE.Vector3[], radius: number, material: THREE.Material, parent: THREE.Group, segments = 30): THREE.CatmullRomCurve3 {
  const curve = new THREE.CatmullRomCurve3(points); parent.add(new THREE.Mesh(new THREE.TubeGeometry(curve, segments, radius, 5, false), material)); return curve;
}
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
// The root graph and chamber position are authored once; every perception mode reveals the same place.
for (const [index, tree] of trees.slice(0, 3).entries()) {
  const parent = index === 0 ? shallow : extended;
  const fine: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * Math.PI * 2, len = 3 + rand() * 3;
    const points = [v(tree.x, .08, tree.z), v(tree.x + Math.cos(a) * .8, -.45, tree.z + Math.sin(a) * .8), v(tree.x + Math.cos(a + .1) * len * .5, -.7 - rand() * .35, tree.z + Math.sin(a + .1) * len * .5), v(tree.x + Math.cos(a) * len, -1.2 - rand() * .45, tree.z + Math.sin(a) * len)];
    const curve = tube(points, .065 + rand() * .04, rootMat, parent);
    for (let j = 0; j < 10; j++) {
      const p = curve.getPoint(.2 + j * .075), sign = j % 2 ? 1 : -1;
      const end = p.clone().add(v(Math.cos(a + sign) * .7, -.12 - rand() * .28, Math.sin(a + sign) * .7));
      const twig = new THREE.CatmullRomCurve3([p, p.clone().lerp(end, .5).add(v(0, -.1, .1)), end]);
      fine.push(new THREE.TubeGeometry(twig, 5, .013, 3, false));
    }
  }
  const merged = mergeGeometries(fine); if (merged) parent.add(new THREE.Mesh(merged, fineMat)); fine.forEach(g => g.dispose());
}
const tipPoint = v(2, -2.15, -2.6);
const seeking = tube([v(0, -.1, 0), v(.3, -.8, -1), v(1, -1.5, -1.7), tipPoint], .12, deepMat, shallow);
const buried = tube([tipPoint, v(2.3, -3.2, -2.8), v(2.9, -4.7, -3.2), v(3.9, -5.1, -3.6), v(5.8, -5.1, -3.6)], .10, deepMat, deep);
const channel = tube([v(5.8, -5.1, -3.6), v(7.2, -4.8, -4.5), v(8.7, -2.8, -5), v(10, -.4, -5)], .08, fineMat, extended);
const clayMat = new THREE.MeshStandardMaterial({ color: '#a16d4b', transparent: true, opacity: .24, roughness: 1, side: THREE.DoubleSide, depthWrite: false });
const grain = new Uint8Array(64 * 64 * 4);
for (let i = 0; i < 64 * 64; i++) { const n = Math.floor(140 + rand() * 100); grain.set([n, n, n, 255], i * 4); }
const soilTexture = new THREE.DataTexture(grain, 64, 64, THREE.RGBAFormat); soilTexture.wrapS = soilTexture.wrapT = THREE.RepeatWrapping; soilTexture.repeat.set(8, 8); soilTexture.needsUpdate = true;
clayMat.map = soilTexture;
const clay = new THREE.Mesh(new THREE.CircleGeometry(8, 50), clayMat); clay.rotation.x = -Math.PI / 2; clay.position.set(2, -2.22, -2); roots.add(clay);
const rim = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 80 }, (_, i) => v(2 + Math.cos(i / 80 * 6.28) * 8, -2.22, -2 + Math.sin(i / 80 * 6.28) * 8))), new THREE.LineBasicMaterial({ color: '#c09c6b', transparent: true, opacity: .25 })); roots.add(rim);
const stone = new THREE.MeshStandardMaterial({ color: '#647e79', emissive: '#233e3b', emissiveIntensity: .6, roughness: 1 });
const ruinOutline = new THREE.LineBasicMaterial({ color: '#a8d3c1', transparent: true, opacity: .65 });
const blocks: THREE.Box3[] = [];
function block(x: number, y: number, z: number, sx: number, sy: number, sz: number): void {
  const geometry = new THREE.BoxGeometry(sx, sy, sz), mesh = new THREE.Mesh(geometry, stone); mesh.position.set(x, y, z); chamber.add(mesh);
  blocks.push(new THREE.Box3(v(x - sx / 2, y - sy / 2, z - sz / 2), v(x + sx / 2, y + sy / 2, z + sz / 2)));
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), ruinOutline); edges.position.copy(mesh.position); chamber.add(edges);
}
block(4.6, -5.8, -4.9, 4.2, .25, 3.4);
for (const x of [2.7, 6.5]) for (const z of [-6.3, -3.6]) block(x, -4.7, z, .35, 2.2, .35);
block(4.6, -3.55, -6.3, 4.2, .35, .45);
block(4.6, -5.52, -4.9, 2, .2, .55);
const springLight = new THREE.PointLight('#8de5d2', 0, 9); springLight.position.set(4.6, -4.6, -4.5); chamber.add(springLight);
const tip = new THREE.Mesh(new THREE.SphereGeometry(.17, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffe1a0' })); tip.position.copy(tipPoint); shallow.add(tip);
const halo = new THREE.Mesh(new THREE.SphereGeometry(.34, 12, 8), new THREE.MeshBasicMaterial({ color: '#f9c677', transparent: true, opacity: .14, depthWrite: false })); tip.add(halo);
const motes = new THREE.Group(); roots.add(motes);
const particles: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; offset: number }[] = [];
const moteGeo = new THREE.SphereGeometry(.045, 5, 4), moteMat = new THREE.MeshBasicMaterial({ color: '#bcffe3' });
for (let i = 0; i < 21; i++) { const mesh = new THREE.Mesh(moteGeo, moteMat); motes.add(mesh); particles.push({ mesh, curve: i < 7 ? seeking : i < 14 ? buried : channel, offset: i / 7 % 1 }); }
/** The floor of listening: a dark haze at the ability's limit, bedrock once communed. */
const limitMat = new THREE.MeshBasicMaterial({ color: '#050d0c', transparent: true, opacity: .62, depthWrite: false, side: THREE.DoubleSide });
const limit = new THREE.Mesh(new THREE.PlaneGeometry(64, 64), limitMat); limit.rotation.x = -Math.PI / 2; roots.add(limit);
/** A little light travels with the awareness so the nearest soil and roots read up close. */
const lantern = new THREE.PointLight('#c9e6cf', 0, 7, 1.6); camera.add(lantern);
const player = new Player(renderer.domElement, scene, camera);
player.position.y = 0; player.standHeightAt = groundHeight;
player.teleport(0, 6.5, 0); player.pitch = .1;
installMobilityControls(player);
/** The soil as a volume. No surfaces: nothing to stand on. canOccupy is the roof (the ground), the
 * floor (the ability's limit, or bedrock), the clay (a soil the awareness cannot enter until it has
 * communed with the root that does) and the buried structure's stone. */
const soil: TraversalWorld = {
  surfacesAt: () => [],
  canOccupy: (p, radius, height) => {
    if (Math.hypot(p.x, p.z) > WORLD_RADIUS) return false;
    if (p.y + height > groundHeight(p.x, p.z) - ROOF_MARGIN) return false;
    if (p.y < (state.deep ? BEDROCK : LISTEN_FLOOR)) return false;
    if (!state.deep && p.y < CLAY_TOP && Math.hypot(p.x - CLAY_X, p.z - CLAY_Z) < CLAY_RADIUS + radius) return false;
    for (const b of blocks) if (p.x + radius > b.min.x && p.x - radius < b.max.x && p.y + height > b.min.y && p.y < b.max.y && p.z + radius > b.min.z && p.z - radius < b.max.z) return false;
    return true;
  },
};
interface Descent { from: number; to: number; t: number; up: boolean }
let underground = false, descent: Descent | null = null;
function startDescent(up: boolean): void {
  const feet = player.feet(), surfaceY = groundHeight(feet.x, feet.z);
  if (!up) { underground = true; player.traversalWorld = soil; player.free = true; }
  descent = { from: feet.y, to: up ? surfaceY : surfaceY - SINK_DEPTH, t: 0, up };
  player.canMove = false;
}
const surfaceTint = new THREE.Color('#172d29'), rootsTint = new THREE.Color('#0b2021'), tint = new THREE.Color();
const board = new Board(6, 6, 190926), boardView = new BoardView(camera);
const ray = new THREE.Raycaster();
let mode: Mode = 'surface', time = 0, last = performance.now();
let transition = 0;
const oldCamera = new THREE.Vector3(), oldQuat = new THREE.Quaternion();
const shoots: { mesh: THREE.Mesh; from: THREE.Vector3; to: THREE.Vector3; born: number }[] = [];
const sapGeo = new THREE.SphereGeometry(.055, 7, 5);
const sapMats = PALETTE.map(p => new THREE.MeshBasicMaterial({ color: p.hex, depthTest: false }));
let hintCells: Cell[] = [], hintUntil = 0;
const hintRing = new THREE.Mesh(new THREE.TorusGeometry(.46, .045, 6, 24), new THREE.MeshBasicMaterial({ color: '#ffffff', depthTest: false })); hintRing.visible = false; boardView.group.add(hintRing);
function message(text: string): void { el('story').textContent = text; }
function defaultMessage(): void {
  if (mode === 'cultivate') message('Tap neighbouring gems. Each cleared gem gathers one sap; cascades feed the same reservoir.');
  else if (mode === 'surface') message(state.restored ? 'The grove drinks again. Below its roots, an older kindness still works.' : 'The spring feeds this tree. Beyond it, a grove thirsts. Listen beneath the soil.');
  else if (state.restored) message('Water runs through a channel made by hands. The roots remembered what the forest forgot.');
  else if (state.deep) message('Straight edges. Pillars. A water channel. Spend 24 sap to restore its connection to the grove.');
  else if (state.listened) message('The tree already knows a way through. Commune for 48 sap to follow its deep-seeking root.');
  else message('One thick root plunges into clay. Tap its warm, glowing tip to listen.');
}
function refresh(): void {
  document.body.dataset.mode = mode;
  el('mode-name').textContent = mode === 'surface' ? 'Forest floor' : mode === 'cultivate' ? 'Cultivating the old tree' : state.deep ? 'Deep listening · beneath the clay' : state.wide ? 'Wide listening · the neighbouring grove' : 'Close listening · loamy soil';
  el('energy').textContent = `${state.energy} / 120 sap`;
  el('energy-fill').style.width = `${state.energy / 120 * 100}%`;
  button('walk').hidden = mode === 'cultivate';
  button('vision').disabled = descent !== null;
  el('actions').hidden = mode === 'cultivate'; el('board-tools').hidden = mode !== 'cultivate';
  button('vision').innerHTML = mode === 'roots' ? 'Rise to the surface<small>Walk among the trees</small>' : 'Root vision<small>Sink beneath the forest</small>';
  button('widen').hidden = mode !== 'roots' || state.wide || state.restored; button('widen').disabled = state.energy < 24;
  button('deepen').hidden = mode !== 'roots' || state.deep; button('deepen').disabled = !state.listened || state.energy < 48;
  button('deepen').innerHTML = state.listened ? 'Commune · 48 sap<small>Learn the deep-seeking root</small>' : 'Commune · 48 sap<small>First, tap the glowing root tip</small>';
  button('mend').hidden = mode !== 'roots' || !state.deep || state.restored; button('mend').disabled = state.energy < 24;
  button('done').disabled = boardView.isBusy;
  el('instruction').textContent = mode === 'surface' ? 'Drag to look. Thumbstick to walk; hold centre for targets.' : mode === 'roots' ? 'Drag to look. Thumbstick to drift where you look; hold centre for targets. Tap the glowing tip.' : 'Tap two adjacent gems. Cascades gather sap.';
  player.fanScale = underground ? (state.deep ? REACH_SCALE.deep : state.wide ? REACH_SCALE.wide : REACH_SCALE.close) : 1;
  limit.position.y = (state.deep ? BEDROCK : LISTEN_FLOOR) - .15;
  limitMat.color.set(state.deep ? '#2b3230' : '#050d0c'); limitMat.opacity = state.deep ? .9 : .62;
  extended.visible = state.wide || state.restored; deep.visible = state.deep; chamber.visible = state.deep;
  clayMat.opacity = state.deep ? .075 : .24;
  dryFoliage.color.set(state.restored ? '#64945e' : '#867549');
  springLight.intensity = state.restored ? 12 : 3;
  el('target-label').textContent = state.listened ? 'THE DEEP-SEEKING ROOT' : 'TAP TO LISTEN';
  el('target-label').hidden = mode !== 'roots' || state.deep;
}
function setMode(next: Mode): void {
  if (boardView.isBusy || descent) return;
  // The board has its own camera pose, so it is tweened; the soil is entered by sinking instead.
  if (next === 'cultivate' || mode === 'cultivate') { oldCamera.copy(camera.position); oldQuat.copy(camera.quaternion); transition = 1; }
  player.cancelInput(); mode = next; player.enabled = next !== 'cultivate';
  if (next === 'roots' && !underground) startDescent(false);
  if (next === 'surface' && underground) startDescent(true);
  if (next === 'cultivate') { boardView.bind(board); boardView.show(time); }
  else { boardView.hide(); boardView.unbind(); hintCells = []; hintRing.visible = false; }
  refresh(); defaultMessage();
}
function listen(): void { if (state.listened) { message('This root enters the clay intact. Its tree knows a path Hulda has yet to remember.'); return; } state.listened = true; save(); refresh(); defaultMessage(); }
player.onTap = (x, y) => {
  if (transition > 0 || descent) return;
  ray.setFromCamera(new THREE.Vector2(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1), camera);
  if (mode === 'cultivate') { hintRing.visible = false; hintCells = []; boardView.tap(ray); refresh(); }
  else if (mode === 'roots' && !state.deep) {
    // Screen-space allowance makes the tiny root tip finger-sized without changing its appearance.
    const p = tipPoint.clone().project(camera);
    if (Math.hypot(x - (p.x + 1) * innerWidth / 2, y - (1 - p.y) * innerHeight / 2) < 38) listen();
  }
};
boardView.onRun = (run, origin) => {
  state.energy = Math.min(120, state.energy + run.cells.length); save(); refresh();
  const mesh = new THREE.Mesh(sapGeo, sapMats[run.type]); mesh.renderOrder = 100; mesh.position.copy(origin); scene.add(mesh);
  shoots.push({ mesh, from: origin.clone(), to: v(0, 1.5, 0), born: time });
  message(state.energy === 120 ? 'The reservoir is full. Return to the roots and choose where to spend it.' : `+${run.cells.length} sap. The old tree takes up your cultivation.`);
};
button('cultivate').onclick = () => setMode('cultivate');
button('vision').onclick = () => setMode(mode === 'roots' ? 'surface' : 'roots');
button('done').onclick = () => setMode('roots');
button('widen').onclick = () => { if (state.energy < 24 || state.wide) return; state.energy -= 24; state.wide = true; save(); refresh(); message('Your awareness reaches the neighbouring trees. A dry root descends toward something still hidden in clay.'); };
button('deepen').onclick = () => { if (!state.listened || state.energy < 48 || state.deep) return; state.energy -= 48; state.deep = true; save(); refresh(); defaultMessage(); };
button('mend').onclick = () => { if (!state.deep || state.energy < 24 || state.restored) return; state.energy -= 24; state.restored = true; save(); refresh(); defaultMessage(); };
function possibleMove(): Cell[] {
  for (let row = 0; row < board.rows; row++) for (let col = 0; col < board.cols; col++) for (const [dr, dc] of [[1, 0], [0, 1]]) {
    const r = row + dr, c = col + dc; if (r >= board.rows || c >= board.cols) continue;
    const a = board.grid[row][col], b = board.grid[r][c]; board.grid[row][col] = b; board.grid[r][c] = a;
    const found = board.findRuns().length > 0; board.grid[row][col] = a; board.grid[r][c] = b;
    if (found) return [{ row, col }, { row: r, col: c }];
  } return [];
}
button('hint').onclick = () => { if (boardView.isBusy) return; hintCells = possibleMove(); hintUntil = time + 4500; message('The white ring alternates between two neighbours. Tap one, then the other.'); };
const intro = el<HTMLDialogElement>('intro');
button('help').onclick = () => { player.cancelInput(); intro.showModal(); };
button('begin').onclick = () => { intro.close(); last = performance.now(); };
button('reset').onclick = () => { if (boardView.isBusy) return; if (!confirm('Restart this field study and clear its saved sap and discoveries?')) return; state = fresh(); save(); underground = false; descent = null; player.free = false; player.traversalWorld = null; player.canMove = true; setMode('surface'); player.teleport(0, 6.5, 0); player.pitch = .1; };
function resize(): void { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); boardView.layout(); }
window.addEventListener('resize', resize);
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('visibilitychange', () => { last = performance.now(); });
function frame(now: number): void {
  requestAnimationFrame(frame);
  const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
  if (document.hidden || intro.open) return;
  time += dt * 1000;
  player.update(now, colliders, p => Math.hypot(p.x, p.z) < WORLD_RADIUS);
  if (descent) {
    // Sink (or rise) straight through the surface at the feet; looking stays free the whole way.
    descent.t = Math.min(1, descent.t + dt / (descent.up ? RISE_S : SINK_S));
    const k = descent.t * descent.t * (3 - 2 * descent.t);
    player.motor.feet.y = THREE.MathUtils.lerp(descent.from, descent.to, k);
    if (descent.t >= 1) {
      const feet = player.motor.feet;
      if (descent.up) { underground = false; player.free = false; player.traversalWorld = null; player.teleport(feet.x, feet.z, player.yaw); }
      player.canMove = true; descent = null; refresh();
    }
  }
  if (mode === 'cultivate') { camera.position.set(0, 2.9, 6.8); camera.lookAt(0, 2, 0); }
  else player.applyCamera(camera);
  // The atmosphere follows the eye through the surface: the ground thins into a roof as it is crossed.
  const under = mode === 'cultivate' ? 0 : THREE.MathUtils.smoothstep(groundHeight(camera.position.x, camera.position.z) - camera.position.y, -.25, .25);
  earth.opacity = THREE.MathUtils.lerp(1, .16, under);
  tint.lerpColors(surfaceTint, rootsTint, under); (scene.background as THREE.Color).copy(tint); (scene.fog as THREE.FogExp2).color.copy(tint);
  (scene.fog as THREE.FogExp2).density = THREE.MathUtils.lerp(.026, .018, under);
  lantern.intensity = 5 * under;
  roots.visible = mode !== 'cultivate' && (underground || descent !== null);
  if (transition > 0) { transition = Math.max(0, transition - dt * 1.8); const k = transition * transition * (3 - 2 * transition); camera.position.lerp(oldCamera, k); camera.quaternion.slerp(oldQuat, k); }
  camera.updateMatrixWorld();
  boardView.update(time);
  // Keep the original board's geometry, timing, and input; reserve room for phone chrome.
  if (mode === 'cultivate') {
    boardView.group.scale.multiplyScalar(innerHeight < 520 ? .78 : innerHeight < 740 ? .82 : .95);
    boardView.group.position.y = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * 2.2 * 2 * (innerHeight < 520 ? -.08 : innerHeight < 740 ? -.12 : -.15);
  }
  button('done').disabled = boardView.isBusy; button('hint').disabled = boardView.isBusy;
  if (hintCells.length && time < hintUntil && !boardView.isBusy) { const cell = hintCells[Math.floor(time / 700) % 2]; hintRing.position.set(cell.col - 2.5, 2.5 - cell.row, .15); hintRing.visible = true; } else hintRing.visible = false;
  tip.scale.setScalar(1 + Math.sin(time * .003) * .12);
  if (mode === 'roots' && !state.deep) { const p = tipPoint.clone().project(camera); el('target-label').style.left = `${(p.x + 1) * innerWidth / 2}px`; el('target-label').style.top = `${(1 - p.y) * innerHeight / 2}px`; el('target-label').style.visibility = p.z < 1 && Math.abs(p.x) < 1.1 && Math.abs(p.y) < 1.1 ? 'visible' : 'hidden'; }
  for (let i = 0; i < particles.length; i++) { const p = particles[i]; p.mesh.visible = i < 7 || (i < 14 ? state.deep : state.restored); p.mesh.position.copy(p.curve.getPoint((time * (state.restored ? .00009 : .00004) + p.offset) % 1)); }
  for (let i = shoots.length - 1; i >= 0; i--) { const p = shoots[i], k = Math.min(1, (time - p.born) / 650); p.mesh.position.lerpVectors(p.from, p.to, k); p.mesh.position.y += Math.sin(k * Math.PI) * .5; if (k === 1) { scene.remove(p.mesh); shoots.splice(i, 1); } }
  renderer.render(scene, camera);
}
refresh(); defaultMessage(); player.applyCamera(camera); renderer.render(scene, camera);
if (!state.listened && state.energy === 0) intro.showModal();
requestAnimationFrame(frame);
// Read-only state and original components for browser verification, no alternate gameplay path.
Object.assign(window, { __rootStudy: { scene, camera, renderer, player, board, boardView, tipPoint, possibleMove, soil, groundHeight, get state() { return { ...state }; }, get mode() { return mode; }, get underground() { return underground; }, get transitioning() { return transition > 0 || descent !== null; } } });
