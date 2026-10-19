// The parkour study (/parkour.html, MOBILITY.md "Parkour"): Hulda on the shared player and mobility, in the
// village's third-person framing, on a practice course of every move parkour.ts tells apart, posed by Noah's
// Mixamo clips (huldaTraverse.ts). ?hud=1 shows the move and its stage; ?intro=0 skips the card.
import './descent.css';
import * as THREE from 'three';
import { Player } from './player';
import { createHuldaPresentation, HUMAN_CENTRE } from './huldaPresentation';
import { installMobilityControls } from './mobilityControls';
import { createTraverseLayer, type TraverseLayer } from './huldaTraverse';
import { COURSE, RAMP, BOUNDS, START, courseWorld, groundAt, PRACTICE_WARD } from './parkourCourse';
import { createWardField } from './ruinWorld';
import { leanAt } from './parkour';

const query = new URLSearchParams(location.search);
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#9fb6c4'); scene.fog = new THREE.Fog('#9fb6c4', 30, 90);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.05, 300); scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.shadowMap.enabled = true; renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.prepend(renderer.domElement);
function resize(): void { renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
scene.add(new THREE.HemisphereLight('#dfeaf2', '#5a5040', 1.6));
const sun = new THREE.DirectionalLight('#fff2dc', 2.2); sun.position.set(-12, 22, 8); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -32, right: 32, top: 32, bottom: -32, far: 90 }); sun.target.position.set(20, 0, -12); scene.add(sun, sun.target);

// The course: the floor, the blocks (a pit is a hole with a floor far below), the ramp, and a label on each lane.
const stone = new THREE.MeshStandardMaterial({ color: '#8d8a80', roughness: 0.95, flatShading: true }), rail = new THREE.MeshStandardMaterial({ color: '#7a5a3a', roughness: 0.8 });
const floorMat = new THREE.MeshStandardMaterial({ color: '#6f7f5a', roughness: 1 }), pitMat = new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 1 });
{ // The floor in strips around the pits.
  const xs = [...new Set([BOUNDS.x0, BOUNDS.x1, ...COURSE.filter(b => b.kind === 'pit').flatMap(b => [b.x0, b.x1])])].sort((a, b) => a - b);
  const zs = [...new Set([BOUNDS.z0, BOUNDS.z1, ...COURSE.filter(b => b.kind === 'pit').flatMap(b => [b.z0, b.z1])])].sort((a, b) => a - b);
  for (let i = 0; i + 1 < xs.length; i++) for (let j = 0; j + 1 < zs.length; j++) {
    const cx = (xs[i] + xs[i + 1]) / 2, cz = (zs[j] + zs[j + 1]) / 2; if ((groundAt(cx, cz) ?? 0) < -0.5) continue;
    const m = new THREE.Mesh(new THREE.BoxGeometry(xs[i + 1] - xs[i], 0.2, zs[j + 1] - zs[j]), floorMat); m.position.set(cx, -0.1, cz); m.receiveShadow = true; scene.add(m);
  }
}
for (const b of COURSE) {
  const w = b.x1 - b.x0, d = b.z1 - b.z0;
  if (b.kind === 'pit') {
    // Its floor and its four walls, dark.
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2, h = -b.top;
    for (const [sx, sy, sz, px, py, pz] of [[w, 0.2, d, cx, b.top - 0.1, cz], [w, h, 0.1, cx, b.top / 2, b.z0], [w, h, 0.1, cx, b.top / 2, b.z1], [0.1, h, d, b.x0, b.top / 2, cz], [0.1, h, d, b.x1, b.top / 2, cz]]) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), pitMat); m.position.set(px, py, pz); scene.add(m);
    }
  }
  else { const m = new THREE.Mesh(new THREE.BoxGeometry(w, b.top, d), b.kind === 'rail' ? rail : stone); m.position.set((b.x0 + b.x1) / 2, b.top / 2, (b.z0 + b.z1) / 2); m.castShadow = m.receiveShadow = true; scene.add(m); }
  if (b.label) scene.add(label(b.label, (b.x0 + b.x1) / 2 - w / 2 - 0.3, Math.max(0, b.top) + 0.9, b.z1));
}
{ // The ramp: a deck of slabs, rising steep at its foot.
  const n = 80, g = new THREE.BoxGeometry(RAMP.halfW * 2, 0.15, RAMP.length / n + 0.02);
  for (let i = 0; i < n; i++) { const z = RAMP.z0 - (i + 0.5) * RAMP.length / n, y = groundAt(RAMP.x, z) ?? 0; const m = new THREE.Mesh(g, stone); m.position.set(RAMP.x, y - 0.075, z); m.castShadow = m.receiveShadow = true; scene.add(m); }
  scene.add(label('the old bridge\'s foot', RAMP.x - 1.8, 1, RAMP.z0));
}
// RUINS.md: a ward east of the lanes, as the wards about the dark forest are built.
const wardField = createWardField(scene, [PRACTICE_WARD], () => 0);
scene.add(label('a ward', PRACTICE_WARD.x, 3.2, PRACTICE_WARD.z + 11));
function label(text: string, x: number, y: number, z: number): THREE.Sprite {
  const c = document.createElement('canvas'); c.width = 512; c.height = 96; const g = c.getContext('2d')!;
  g.fillStyle = '#0b1918c0'; g.roundRect(0, 0, 512, 96, 22); g.fill(); g.fillStyle = '#f2efe4'; g.font = '44px Georgia'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 50);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthWrite: false })); s.scale.set(1.6, 0.3, 1); s.position.set(x, y, z); return s;
}

const player = new Player(renderer.domElement, scene, camera); scene.add(player.avatar); player.view = 'third';
player.traversalWorld = courseWorld; player.motor.parkour = true;
for (const child of [...player.avatar.children]) player.avatar.remove(child);
installMobilityControls(player);
const reset = (): void => { player.teleport(START.x, START.z, START.yaw, 0); player.pitch = 0.18; };
reset();
const presentation = createHuldaPresentation(scene, new THREE.Group(), new THREE.Group());
const base = (c: string) => import.meta.env.BASE_URL + c;
let traverse: TraverseLayer | null = null, clipStatus = 'loading';
import('./huldaModel').then(async ({ loadHuldaClips }) => {
  presentation.setClips(await loadHuldaClips(__HULDA_CLIPS__.map(base)));
  const gait = presentation.hulda.gait; if (!gait) return;
  traverse = createTraverseLayer(gait, presentation.hulda.rig, await loadHuldaClips(__TRAVERSE_CLIPS__.map(base))); clipStatus = 'ready';
}).catch(e => { clipStatus = 'failed'; console.warn('clips', e); });

const toast = el('toast'); let toastTimer = 0;
function say(text: string, s = 2.2): void { toast.textContent = text; toast.classList.add('on'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('on'), s * 1000); }
player.motor.onCommit = plan => { if (!player.motor.hanging) say(plan.kind === 'hangDrop' ? 'hang drop' : plan.kind, 1.2); };
el('reset').onclick = reset;
el('view').onclick = () => { player.view = player.view === 'third' ? 'first' : 'third'; el('view').textContent = player.view === 'third' ? '3rd' : '1st'; };
const intro = el<HTMLDialogElement>('intro');
el('help').onclick = () => { player.cancelInput(); intro.showModal(); };
el('begin').onclick = () => { intro.close(); last = performance.now(); };
document.addEventListener('contextmenu', e => e.preventDefault());
if (query.get('intro') !== '0') intro.showModal();

const hud = el('hud'); hud.hidden = query.get('hud') !== '1';
const visualPosition = new THREE.Vector3(), visualRotation = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
let last = performance.now(), wasHanging = false, hangTips = 0; const look = new THREE.Vector3();
function frame(now: number): void {
  requestAnimationFrame(frame); const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; if (document.hidden || intro.open) return;
  player.update(now, [], undefined); player.applyCamera(camera);
  const move = player.motor.traversal;
  visualPosition.copy(player.feet()); visualPosition.y += HUMAN_CENTRE;
  let heading = player.yaw; if (player.motor.speed > 0.08 && !move) heading = Math.atan2(-player.motor.velocity.x, -player.motor.velocity.z);
  if (move?.face !== undefined) { heading = move.face; const l = leanAt(move, player.motor.traversalTime); visualPosition.x -= Math.sin(move.face) * l; visualPosition.z -= Math.cos(move.face) * l; }
  traverse?.update(dt, move, player.motor.traversalTime);
  visualRotation.setFromAxisAngle(up, heading);
  presentation.update(dt, 'human', visualPosition, visualRotation, player.motor.speed, heading, player.motor.mode === 'grounded', player.view === 'third');
  player.avatar.visible = false;
  // The braced hang waits for the stick: say how, the first times.
  if (player.motor.hanging && !wasHanging && hangTips++ < 3) say('hanging: push toward the wall to climb, away to drop', 2.6);
  wasHanging = !!player.motor.hanging;
  // RUINS.md: the practice ward's glyph-plates, read where she stands on one (read again each visit to the page).
  camera.getWorldDirection(look); wardField.face(Math.atan2(-look.x, -look.z)); const plate = wardField.update(player.feet(), now); if (plate) say(plate.lore, 7);
  if (!hud.hidden) hud.textContent = `${move ? `${move.kind} · ${traverse?.stage ?? '-'}` : player.motor.mode}\nclips ${clipStatus}`;
  renderer.render(scene, camera);
}
(window as unknown as { __parkour: unknown }).__parkour = { THREE, scene, camera, player, presentation, get traverse() { return traverse; }, get clipStatus() { return clipStatus; }, reset, ward: PRACTICE_WARD, wardField };
requestAnimationFrame(frame);
