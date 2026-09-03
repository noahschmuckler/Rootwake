// Pass 0 (DESIGN.md): one voxel face, viewed from an already-locked camera.
// Five hand-authored branches with flowers, click-to-select, 3-same-colour
// match, staggered recede. No movement, no camera transition, no mirror,
// no regrowth, no payout — all deliberately deferred to Pass 0.1+.

import * as THREE from 'three';
import { assignColors, PALETTE } from './colors';
import { buildRig, TIP_COUNT, type Branch } from './rig';
import { PuzzleState } from './puzzle';
import { RecedeAnimator } from './recede';

// ---- Seed: `?seed=N` for a repeatable board; R reloads with a fresh one. ----
const params = new URLSearchParams(window.location.search);
const seed = Number.parseInt(params.get('seed') ?? '', 10) || 1;

// ---- Scene / locked camera -------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a12);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
// Straight-on framing of the +Z face: this IS the "locked puzzle view". The
// 2D-legible puzzle plane is z = +1; the camera never moves in Pass 0.
camera.position.set(0, 0, 4.6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

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
function updateHud(): void {
  const sel = puzzle.selected();
  const selText = sel.length ? `${sel.length}/3 ${PALETTE[colors[sel[0]]].name}` : 'none';
  const dead = puzzle.isDead() && !animator.isBusy;
  hud.textContent =
    `seed ${seed} · selected: ${selText}` +
    (dead ? ' · nothing left to clear — press R for a new arrangement' : ' · R: new arrangement');
}
updateHud();

// ---- Input ------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function pickTip(clientX: number, clientY: number): number | null {
  pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(rig.hitTargets, false);
  for (const h of hits) {
    const tip = h.object.userData.tipIndex;
    if (typeof tip === 'number' && h.object.parent?.visible) return tip;
  }
  return null;
}

function onTap(clientX: number, clientY: number): void {
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
      // Leave the glow on while they recede — the animator owns scale from here.
      // Recede order = selection order, so the last-tapped flower leaves last.
      const group = result.tips.map((t) => rig.branches[t]);
      animator.start(group, performance.now(), (b) => {
        puzzle.markCleared(b.index);
        updateHud();
      });
      break;
    }
  }
  updateHud();
}

renderer.domElement.addEventListener('click', (e) => onTap(e.clientX, e.clientY));
renderer.domElement.addEventListener('pointermove', (e) => {
  renderer.domElement.style.cursor = pickTip(e.clientX, e.clientY) === null ? 'default' : 'pointer';
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
function animate(): void {
  requestAnimationFrame(animate);
  animator.update(performance.now());
  renderer.render(scene, camera);
}
animate();
