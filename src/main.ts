// Pass 0 (DESIGN.md): one voxel face — five hand-authored branches with
// flowers, click-to-select, 3-same-colour match, staggered recede.
// Pass 0.1a: a free-orbit view of that voxel, a tween into the Pass 0 locked
// framing on tapping it, and a button to back out. No movement, no field,
// no mirror, no regrowth, no payout — still deferred.

import * as THREE from 'three';
import { assignColors, PALETTE } from './colors';
import { buildRig, TIP_COUNT, type Branch } from './rig';
import { PuzzleState } from './puzzle';
import { RecedeAnimator } from './recede';
import { CameraRig, HALF_VOXEL, type CameraMode } from './cameraLock';

// ---- URL params -------------------------------------------------------------
// `?seed=N` for a repeatable board (R reloads with a fresh one).
// `?slowmo=N` runs the recede and camera tweens at 1/N speed.
const params = new URLSearchParams(window.location.search);
const seed = Number.parseInt(params.get('seed') ?? '', 10) || 1;
const slowmo = Math.max(1, Number.parseFloat(params.get('slowmo') ?? '') || 1);

// ---- Scene / camera ---------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Starts in the free-orbit view; tapping the voxel tweens into the locked
// Pass 0 framing (see cameraLock.ts).
const cameraRig = new CameraRig(camera, renderer.domElement);

scene.add(new THREE.AmbientLight(0x404060, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(3, 5, 4);
scene.add(key);
const fill = new THREE.DirectionalLight(0x8090ff, 0.5);
fill.position.set(-4, 1, 3);
scene.add(fill);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x1c2418 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
scene.add(ground);

// ---- Puzzle state + rig -----------------------------------------------------
const colors = assignColors(TIP_COUNT, seed);
const puzzle = new PuzzleState(colors);
const rig = buildRig(colors);
scene.add(rig.root);
const animator = new RecedeAnimator();

// Invisible box over the whole voxel: in the free view, tapping anywhere on
// it (or on a flower) is "lock onto this voxel". No per-face picking yet —
// there is only one face with flowers, so the lock always goes to +Z.
const voxelHitBox = new THREE.Mesh(new THREE.BoxGeometry(HALF_VOXEL * 2, HALF_VOXEL * 2, HALF_VOXEL * 2));
voxelHitBox.visible = false;
scene.add(voxelHitBox);

// ---- Selection visuals ------------------------------------------------------
// Tuning: selected flowers glow (emissive) and swell slightly. No outline pass
// yet — keeping the render pipeline plain until the feel is judged.
const SELECTED_SCALE = 1.18;
const SELECTED_EMISSIVE = 0.55;

function setSelectedLook(branch: Branch, on: boolean): void {
  branch.petalMaterial.emissiveIntensity = on ? SELECTED_EMISSIVE : 0;
  branch.flower.scale.setScalar(on ? SELECTED_SCALE : 1);
}

// ---- HUD --------------------------------------------------------------------
const hud = document.getElementById('hud')!;
const hint = document.getElementById('hint')!;
const backButton = document.getElementById('back') as HTMLButtonElement;

const HINTS: Record<CameraMode, string> = {
  free: 'Drag to orbit. Tap the voxel to lock in.',
  locking: '',
  locked: 'Tap three flowers of the same colour.',
  unlocking: '',
};
function applyMode(mode: CameraMode): void {
  hint.textContent = HINTS[mode];
  backButton.hidden = mode !== 'locked';
  renderer.domElement.style.cursor = 'default';
}
cameraRig.onModeChange = applyMode;
applyMode(cameraRig.mode);
backButton.addEventListener('click', () => cameraRig.unlock(animClock));

function updateHud(): void {
  const sel = puzzle.selected();
  const selText = sel.length ? `${sel.length}/3 ${PALETTE[colors[sel[0]]].name}` : 'none';
  const dead = puzzle.isDead() && !animator.isBusy;
  hud.textContent =
    `seed ${seed}${slowmo > 1 ? ` · slowmo ×${slowmo}` : ''} · selected: ${selText}` +
    (dead ? ' · nothing left to clear — press R for a new arrangement' : ' · R: new arrangement');
}
updateHud();

// ---- Input ------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function castFrom(clientX: number, clientY: number): void {
  pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
}

function pickTip(clientX: number, clientY: number): number | null {
  castFrom(clientX, clientY);
  const hits = raycaster.intersectObjects(rig.hitTargets, false);
  for (const h of hits) {
    const tip = h.object.userData.tipIndex;
    if (typeof tip === 'number' && h.object.parent?.visible) return tip;
  }
  return null;
}

function pickVoxel(clientX: number, clientY: number): boolean {
  castFrom(clientX, clientY);
  return raycaster.intersectObjects([voxelHitBox, ...rig.hitTargets], false).length > 0;
}

/** Is there something tappable under the pointer in the current mode? */
function hoverable(clientX: number, clientY: number): boolean {
  switch (cameraRig.mode) {
    case 'free':
      return pickVoxel(clientX, clientY);
    case 'locked':
      return pickTip(clientX, clientY) !== null;
    default:
      return false;
  }
}

function onTap(clientX: number, clientY: number): void {
  if (cameraRig.mode === 'free') {
    if (pickVoxel(clientX, clientY)) cameraRig.lock(animClock);
    return;
  }
  if (cameraRig.mode !== 'locked') return; // mid-tween: ignore input

  const tip = pickTip(clientX, clientY);
  if (tip === null) return;
  const result = puzzle.toggle(tip);
  switch (result.kind) {
    case 'noop':
      break;
    case 'selected':
      for (const t of result.deselected) setSelectedLook(rig.branches[t], false);
      setSelectedLook(rig.branches[tip], true);
      break;
    case 'deselected':
      setSelectedLook(rig.branches[tip], false);
      break;
    case 'match': {
      // The completing flower glows like the other two, then all three go.
      // Recede order = tap order, so the flower that closed the match leaves
      // last. The animator owns scale from here; the glow stays on the way home.
      setSelectedLook(rig.branches[tip], true);
      const group = result.tips.map((t) => rig.branches[t]);
      animator.start(group, animClock, (b) => {
        puzzle.markCleared(b.index);
        updateHud();
      });
      break;
    }
  }
  updateHud();
}

// Orbit drags end with a click event too, so a tap only counts if the pointer
// barely moved between down and up. Tuning: 6px is comfortable for mouse;
// touch may want more.
const TAP_SLOP_PX = 6;
let downX = 0;
let downY = 0;
renderer.domElement.addEventListener('pointerdown', (e) => {
  downX = e.clientX;
  downY = e.clientY;
});
renderer.domElement.addEventListener('click', (e) => {
  if (Math.hypot(e.clientX - downX, e.clientY - downY) <= TAP_SLOP_PX) onTap(e.clientX, e.clientY);
});
renderer.domElement.addEventListener('pointermove', (e) => {
  renderer.domElement.style.cursor = hoverable(e.clientX, e.clientY) ? 'pointer' : 'default';
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    const next = new URL(window.location.href);
    next.searchParams.set('seed', String(Math.floor(Math.random() * 1_000_000)));
    window.location.href = next.toString();
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---- Loop -------------------------------------------------------------------
// Animation clock in ms, scaled by slowmo so every tuning constant in
// recede.ts and cameraLock.ts stays expressed in real-speed milliseconds.
let animClock = 0;
let lastFrame = performance.now();
function animate(now: number): void {
  requestAnimationFrame(animate);
  animClock += (now - lastFrame) / slowmo;
  lastFrame = now;
  cameraRig.update(animClock);
  animator.update(animClock);
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
