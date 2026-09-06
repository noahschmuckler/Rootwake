// Rootwake prototype entry (see DESIGN.md).
// Pass 0:   one voxel face — five hand-authored branches with flowers,
//           tap-to-select, 3-same-colour match, staggered recede.
// Pass 0.1a: lock/unlock camera transition into that face and back.
// Pass 0.2: the confinement→vista test. A tight thicket of 8 voxels around a
//           dark start pocket, first-person touch movement, whole-voxel
//           resolve once a voxel is cleared, one bright way out.
// Pass 0.3a: the match-3 pivot. A real board of 3D gems in the locked view;
//           runs fire shots at the flower of their colour, fill its pool,
//           recede it; five receded flowers resolve the voxel.
// Pass 0.3b: waypoint movement — hold, pick a marker ahead, release to hop.
// Pass 0.4:  the trees do the confining (no hedge/canopy), rock ground, and
//           tillable grass patches — a second interactable with one shared
//           pool, worked from a look-down lock.
// Pass 0.5:  the plateau ends at a cliff. The edge refuses steps; below and
//           beyond, a landscape you can only look at.
// Pass 0.6a: objects have weight. A cleared tree topples and leaves a log,
//           sticks and seeds where it stood; the footprint is blocked ground
//           until they're moved.
// Pass 0.6b: hands. Two boxes; drag a hand to a thing to take or place it;
//           two hands drag a log on a luminescent leash.
// Pass 0.6c: planting. Seeds onto tilled ground grow a sapling into a new
//           tree — the first regrowth, and the player's to choose.
// Pass 0.7a: vitality. Effort and time drain it, seeds and rest restore it;
//           it drives strength, hands, hop reach and the look of the world.
//           No bar: a halo, colour and exposure are the meter. Collapse is
//           a blackout and a tired waking, never death.
// Pass 0.7b: day and night. Well fed at night sees far but washed out; tired
//           at night sees dark — and the lichen on the rock glows for tired
//           eyes only, the first thing worth being tired for.
// Pass 0.8:  rocks and the stone hand axe. Tilling turns up rocks; long-press
//           a rock while holding one and it hovers in front of you; matches
//           strike it with the rock in your hand until it is a hand axe.
// Still out of scope: combat, specials, the 6-face mirror, a real field, art.

import * as THREE from 'three';
import { CameraRig, lockedPoseFor, type CameraMode, type CameraPose } from './cameraLock';
import { Player, THIRD_ZOOM_MIN, THIRD_ZOOM_MAX } from './player';
import { Voxel } from './voxel';
import { Patch } from './patch';
import type { Interactable } from './interactable';
import { buildWorld, EDGE_MARGIN, GROUND_Y } from './world';
import { ObjectWorld } from './objects';
import { Hands, DRAG_FAN_SCALE, DRAG_MOVE_SLOWDOWN } from './hands';
import { PLANT_SEEDS } from './growth';
import { Vitality, DRAIN_TREE_HIT, DRAIN_TILL_HIT, DRAIN_HOP, DRAIN_DRAG_HOP } from './vitality';
import { DayCycle, GLOW_VISIBLE, START_TIME } from './daylight';
import { Sky } from './sky';
import { CraftSession } from './craft';
import { recipesFor, type Recipe } from './recipes';
import { OBJECT_TYPES, HANDS, handsToLift, type WorldObject, type ObjectTypeId } from './objects';
import { Structure, Structures } from './structures';
import { BuildSite, CutDoorway, Deconstruct, Ignite, Transmute, DRAIN_BUILD, DRAIN_UNBUILD, DRAIN_TRANSMUTE } from './site';
import { Fire, FUEL_MS } from './fire';
import { BLUEPRINTS, blueprintsFor, BUILD_MATERIALS, drawPlan, ingredientsText, type Blueprint } from './blueprints';
import { GROUND_REST, type RestQuality } from './vitality';
import { Weather, DRAIN_RAIN_PER_SECOND, LIGHTNING_SAP_TO } from './weather';
import { lichenMaterial } from './objects';
import { mulberry32 } from './colors';
import { HAZE_COLOR, HEMI_SKY_COLOR } from './world';
import { BoardView, BOARD_DISTANCE } from './board3d';
import { Projectiles } from './projectiles';
import { PALETTE } from './colors';

// ---- URL params -------------------------------------------------------------
// `?seed=N` for a repeatable set of boards (R reloads with a fresh one).
// `?slowmo=N` runs the recede, resolve and camera tweens at 1/N speed.
const params = new URLSearchParams(window.location.search);
const seed = Number.parseInt(params.get('seed') ?? '', 10) || 1;
const slowmo = Math.max(1, Number.parseFloat(params.get('slowmo') ?? '') || 1);
const debug = params.has('debug');
// `?time=0.75` starts at midnight (0 dawn, 0.25 noon, 0.5 dusk).
const startTime = Number.parseFloat(params.get('time') ?? '') || START_TIME;
/** `?rain=1`: the first shower starts at once (testing, and for meeting the rain on a short phone session). */
const forceRain = params.has('rain');

// ---- Scene / camera / renderer ---------------------------------------------
const scene = new THREE.Scene();
const BASE_FOV = 40;
const camera = new THREE.PerspectiveCamera(BASE_FOV, window.innerWidth / window.innerHeight, 0.05, 4000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
// Linear tone mapping at exposure 1 is a no-op; vitality lowers the exposure as you tire.
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const world = buildWorld(scene);
const cameraRig = new CameraRig(camera);
// The board rides on the camera so "ahead and below, tilted" is a constant.
scene.add(camera);
const boardView = new BoardView(camera);
const projectiles = new Projectiles(scene);
const objects = new ObjectWorld(scene);
const player = new Player(renderer.domElement, scene, camera);
player.position.set(0, GROUND_Y, 0);
// Face away from the way out, so the vista is something you find, not something you're shown.
player.yaw = Math.PI / 2;

const hands = new Hands(
  camera,
  player,
  objects,
  scene,
  [...document.querySelectorAll<HTMLElement>('#hands .hand')],
  document.getElementById('links') as unknown as SVGSVGElement,
  GROUND_Y,
  (p) => world.isWalkable(p)
);
// Seeds released over a tilled patch plant it (Pass 0.6c).
hands.placeOnTarget = (x, y, type, count) => {
  if (type.id !== 'seed' && type.id !== 'wheat_seed') return null;
  castFrom(x, y);
  const hit = raycaster.intersectObjects(patches.flatMap((p) => p.lockTargets), false)[0];
  if (!hit) return null;
  const patch = hit.object.userData.interactable as Patch;
  if (patch.distanceTo(player.position) > patch.lockReach) {
    hands.notice = 'Out of reach.';
    return 0;
  }
  if (!patch.acceptsSeeds) {
    hands.notice = patch.status === 'planted' ? 'Already planted.' : 'Till it first.';
    return 0;
  }
  if (count < PLANT_SEEDS) {
    hands.notice = `Needs ${PLANT_SEEDS} seeds.`;
    return 0;
  }
  const used = patch.plant(count, animClock, type.id === 'wheat_seed' ? 'wheat' : 'tree');
  if (used > 0 && type.id === 'wheat_seed') {
    hint.textContent = 'Wheat, planted. Four stalks in a minute; harvest them with the board.';
    tooFarUntil = animClock + 3000;
  }
  updateHud();
  return used;
};

// ---- Structures (Pass 0.9 → 1.0c) ------------------------------------------------
// Structures are built by blueprints at a site (site.ts); nothing snaps on release any more.
const structures = new Structures(GROUND_Y);
const sites: (BuildSite | Deconstruct | CutDoorway | Ignite | Transmute)[] = [];
/** Things still animating after their session ended (a rune's burst). */
let effects: Transmute[] = [];
/** Runes the character knows (1.1c). Starts with wheat (designer's call). */
const runes: { rune: 'wheat'; from: ObjectTypeId; to: ObjectTypeId; label: string }[] = [{ rune: 'wheat', from: 'seed', to: 'wheat_seed', label: 'Wheat rune' }];
/** A blueprint whose needs the HUD shows (the checkbox in the blueprint menu). */
let trackedBlueprint: Blueprint | null = null;

// ---- Feeding a fire (1.1b): shavings and sticks from a stack, a knuckle from a hand ----
/** The campfire under a screen point, within reach, or null. */
function fireUnder(x: number, y: number): Fire | null {
  castFrom(x, y);
  const hit = raycaster.intersectObjects(structures.raycastTargets(), true)[0];
  if (!hit) return null;
  const s = hit.object.userData.structure as Structure;
  if (!s.fire) return null;
  if (Math.hypot(s.center.x - player.position.x, s.center.z - player.position.z) > 2.6) {
    hands.notice = 'Out of reach.';
    return null;
  }
  return s.fire;
}
const placeSeeds = hands.placeOnTarget;
const popping: { fire: Fire; at: number; count: number }[] = [];
const POP_DELAY_MS = 2600;
hands.placeOnTarget = (x, y, type, count) => {
  if (type.id === 'wheat_seed') {
    const fire = fireUnder(x, y);
    if (fire) {
      if (!fire.lit) {
        hands.notice = 'The fire is out.';
        return 0;
      }
      const n = Math.min(count, 5);
      popping.push({ fire, at: animClock + POP_DELAY_MS, count: n });
      hint.textContent = 'The seeds go on the coals…';
      tooFarUntil = animClock + POP_DELAY_MS + 600;
      return n;
    }
  }
  if (FUEL_MS[type.id]) {
    const fire = fireUnder(x, y);
    if (fire) {
      let took = 0;
      for (let i = 0; i < count; i++) if (fire.feed(type.id)) took++;
      hint.textContent = `The fire takes it: ${Math.ceil(fire.fuelMs / 1000)} s of burn.`;
      tooFarUntil = animClock + 2000;
      return took;
    }
  }
  return placeSeeds(x, y, type, count);
};
hands.placeHeldOnTarget = (x, y, type) => {
  if (!FUEL_MS[type.id]) return false;
  const fire = fireUnder(x, y);
  if (!fire) return false;
  fire.feed(type.id);
  hint.textContent = `The fire takes the ${type.label}: ${Math.ceil(fire.fuelMs / 1000)} s of burn.`;
  tooFarUntil = animClock + 2000;
  return true;
};

// ---- Lock framing safety ---------------------------------------------------------
/** The board's lowest corner must stay this far above the ground in any lock. */
const BOARD_GROUND_CLEARANCE = 0.12;
/** The lock camera must stay this far (horizontally) from any standing tree's centre. */
const CAMERA_TREE_CLEARANCE = 1.35;

/**
 * Lock onto `it` with a framing that keeps the board out of the ground and
 * the camera out of the trees. Lifts the whole pose (and tells the target,
 * which may hover) rather than steepening it, so the framing angle survives.
 */
function lockOnto(it: Interactable): void {
  const pose = it.lockPose(viewerNow());
  // Camera inside a standing tree: step forward toward the target until clear.
  for (let guard = 0; guard < 6; guard++) {
    const inside = voxels.find((v) => v.status !== 'resolved' && Math.hypot(v.center.x - pose.position.x, v.center.z - pose.position.z) < CAMERA_TREE_CLEARANCE && pose.position.y < 1);
    if (!inside) break;
    pose.position.lerp(pose.target, 0.25);
  }
  const lowest = boardView.lowestWorldY(pose.position, pose.target, it.board.cols, it.board.rows);
  const lift = (it.floorY ?? GROUND_Y) + BOARD_GROUND_CLEARANCE - lowest;
  if (lift > 0) {
    pose.position.y += lift;
    pose.target.y += lift;
    it.onPoseLifted?.(lift);
  }
  locked = it;
  lockedPose = pose;
  cameraRig.lock(animClock, pose);
}

// ---- Orbit and zoom while locked (Pass 1.0d) ------------------------------------
// Designer: reposition in match-3 mode — a drag orbits the framing around what you
// are working, the zoom buttons move in and out, and the board comes along (it
// lives on the camera). The board keeps its ground/floor clearance throughout.
const ORBIT_PITCH_MIN = 0.12; // radians from straight down
const ORBIT_PITCH_MAX = 1.5;
const ZOOM_MIN = 1.1;
const ZOOM_MAX = 7;
function reframeLocked(fn: (offset: THREE.Spherical) => void): void {
  if (cameraRig.mode !== 'locked' || !locked || !lockedPose) return;
  const offset = new THREE.Spherical().setFromVector3(lockedPose.position.clone().sub(lockedPose.target));
  fn(offset);
  offset.phi = THREE.MathUtils.clamp(offset.phi, ORBIT_PITCH_MIN, ORBIT_PITCH_MAX);
  offset.radius = THREE.MathUtils.clamp(offset.radius, ZOOM_MIN, ZOOM_MAX);
  const position = lockedPose.target.clone().add(new THREE.Vector3().setFromSpherical(offset));
  const target = lockedPose.target.clone();
  // Keep the board above the ground (or the site's floor): lift the whole framing, as lockOnto does.
  const lowest = boardView.lowestWorldY(position, target, locked.board.cols, locked.board.rows);
  const lift = (locked.floorY ?? GROUND_Y) + BOARD_GROUND_CLEARANCE - lowest;
  if (lift > 0) {
    position.y += lift;
    target.y += lift;
  }
  lockedPose = { position, target };
  camera.position.copy(position);
  camera.lookAt(target);
}
player.onOrbit = (dx, dy) =>
  reframeLocked((o) => {
    o.theta -= dx;
    o.phi -= dy;
  });
const zoomInButton = document.getElementById('zoom-in') as HTMLButtonElement;
const zoomOutButton = document.getElementById('zoom-out') as HTMLButtonElement;
for (const [el, k] of [
  [zoomInButton, 0.8],
  [zoomOutButton, 1.25],
] as const) {
  el.addEventListener('pointerdown', (e) => e.stopPropagation());
  el.addEventListener('click', () => {
    if (cameraRig.mode === 'free') player.thirdZoom = THREE.MathUtils.clamp(player.thirdZoom * k, THIRD_ZOOM_MIN, THIRD_ZOOM_MAX);
    else reframeLocked((o) => (o.radius *= k));
  });
}

// ---- Third person and the walk button (Pass 1.0d) --------------------------------
scene.add(player.avatar);
// A timber floor is ground you stand on (1.0e): the eye and the waypoint fan rise onto it.
player.standHeightAt = (x, z) => (structures.list.some((st) => st.floorBoards > 0 && st.inside(x, z)) ? 0.1 : 0);
const viewButton = document.getElementById('view') as HTMLButtonElement;
viewButton.addEventListener('pointerdown', (e) => e.stopPropagation());
viewButton.addEventListener('click', () => {
  player.view = player.view === 'first' ? 'third' : 'first';
  viewButton.innerHTML = player.view === 'third' ? '<b>◉</b>1st' : '<b>◎</b>3rd';
  viewButton.classList.toggle('active', player.view === 'third');
  updateHud(); // the zoom buttons follow the view
});
const walkButton = document.getElementById('walk') as HTMLButtonElement;
walkButton.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  e.preventDefault();
  walkButton.setPointerCapture(e.pointerId);
  walkButton.classList.add('active');
  player.startMove(e);
});
walkButton.addEventListener('pointermove', (e) => player.pointerMove(e));
for (const ev of ['pointerup', 'pointercancel'] as const) {
  walkButton.addEventListener(ev, (e) => {
    walkButton.classList.remove('active');
    player.pointerUp(e);
  });
}

// ---- Recipes and crafting (Pass 0.8) --------------------------------------------
const menu = document.getElementById('menu')!;
let craft: CraftSession | null = null;

function viewerNow() {
  return { position: player.position.clone(), forward: player.forward() };
}

/** Is there a world object under this point, within reach, that a long-press could act on? */
/** Structure pieces you can long-press: not those of the structure you are standing inside — in there, a still hold is rest. */
function pressableStructureTargets(): THREE.Object3D[] {
  return structures.list.filter((s) => !s.inside(player.position.x, player.position.z)).flatMap((s) => s.pieces.map((p) => p.obj.mesh));
}
player.objectAt = (x, y) => {
  if (cameraRig.mode !== 'free') return false;
  castFrom(x, y);
  const hit = raycaster.intersectObjects([...objects.raycastTargets(), ...pressableStructureTargets()], true)[0];
  if (!hit) return false;
  const obj = hit.object.userData.object as WorldObject;
  return Math.hypot(obj.position.x - player.position.x, obj.position.z - player.position.z) <= 3.5;
};

/** Show the recipe-style menu at a screen point with these rows. */
function showMenu(x: number, y: number, rows: { label: string; small?: string; disabled?: boolean; onPick: () => void }[]): void {
  menu.innerHTML = rows
    .map((r, i) => `<button type="button" data-i="${i}" ${r.disabled ? 'disabled' : ''}>${r.label}${r.small ? `<small>${r.small}</small>` : ''}</button>`)
    .join('');
  menu.style.left = `${Math.min(window.innerWidth - 230, Math.max(10, x - 100))}px`;
  menu.style.top = `${Math.min(window.innerHeight - 40 - rows.length * 52, Math.max(90, y - 30))}px`;
  menu.hidden = false;
  menu.querySelectorAll<HTMLButtonElement>('button').forEach((b) => {
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
    b.addEventListener('click', () => {
      menu.hidden = true;
      rows[Number(b.dataset.i)].onPick();
    });
  });
}

player.onLongPress = (x, y) => {
  castFrom(x, y);
  // A piece of a structure: what can be added to it, or take it apart.
  const structHit = raycaster.intersectObjects(pressableStructureTargets(), true)[0];
  if (structHit) {
    const s = structHit.object.userData.structure as Structure;
    const pending = sites.find((site) => 'structure' in site && site.structure === s && site.status === 'growing');
    const rows: Parameters<typeof showMenu>[2] = [];
    if (pending) {
      rows.push({ label: pending instanceof BuildSite ? `Building: ${pending.blueprint.label}` : 'Taking apart', small: 'tap inside the ring to continue', disabled: true, onPick: () => {} });
      rows.push({ label: 'Abandon that', onPick: () => abandonSite(pending) });
    } else if (s.isCampfire) {
      const fire = s.fire;
      if (fire && !fire.lit) rows.push({ label: 'Light it', small: fire.fuelMs > 0 ? 'a few matches' : 'a few matches; then feed it', onPick: () => startIgnite(s) });
      else rows.push({ label: 'Burning', small: `${Math.ceil((fire?.fuelMs ?? 0) / 1000)} s of fuel — drag shavings, sticks or a knuckle onto it`, disabled: true, onPick: () => {} });
      rows.push({ label: 'Take apart', small: `${s.pieces.length} pieces`, onPick: () => startDeconstruct(s) });
    } else {
      rows.push({ label: 'Blueprints…', small: 'add to this', onPick: () => openBlueprints(s, null) });
      // A wall of whole long logs can have a doorway cut through it — with the axe in hand.
      const placed = s.pieces.find((pc) => pc.obj === (structHit.object.userData.object as WorldObject));
      const wall = placed ? s.wallOf(placed) : null;
      if (wall && s.uncutLogs(wall).length > 0) {
        const axe = hands.heldTypes().includes('hand_axe');
        rows.push({
          label: 'Cut a doorway here',
          small: axe ? `${s.uncutLogs(wall).length} logs; the middles come out as knuckles` : 'needs a hand axe in hand',
          disabled: !axe,
          onPick: () => startCut(s, wall),
        });
      }
      rows.push({ label: 'Take apart', small: `${s.pieces.length} pieces`, onPick: () => startDeconstruct(s) });
    }
    showMenu(x, y, rows);
    return;
  }
  const hit = raycaster.intersectObjects(objects.raycastTargets(), true)[0];
  if (!hit) return;
  const obj = hit.object.userData.object as WorldObject;
  const rows: Parameters<typeof showMenu>[2] = recipesFor(obj.type.id, hands.heldTypes()).map((r) => ({
    label: r.recipe.label,
    small: r.available ? undefined : r.reason,
    disabled: !r.available,
    onPick: () => startCraft(obj, r.recipe),
  }));
  for (const r of runes) {
    if (r.from !== obj.type.id) continue;
    rows.push({ label: 'Transmute…', small: `${r.label}: seeds within reach become ${OBJECT_TYPES[r.to].label}`, onPick: () => startTransmute(obj, r.rune, r.to) });
  }
  if (BUILD_MATERIALS.includes(obj.type.id)) {
    // Inside a pending site's ring, the material's menu can abandon that site; otherwise it can start one here.
    const pending = sites.find((site) => site instanceof BuildSite && site.status === 'growing' && site.distanceTo(obj.position) <= site.ringRadius) as BuildSite | undefined;
    if (pending) rows.push({ label: `Abandon: ${pending.blueprint.label}`, small: 'the site here', onPick: () => abandonSite(pending) });
    else rows.push({ label: 'Blueprints…', small: 'build here, from this', onPick: () => openBlueprints(null, obj) });
  }
  if (rows.length === 0) {
    hint.textContent = `Nothing to make from ${obj.type.label} yet.`;
    tooFarUntil = animClock + 1400;
    return;
  }
  showMenu(x, y, rows);
};
// Any other press closes the menus.
renderer.domElement.addEventListener('pointerdown', () => {
  menu.hidden = true;
  blueprintMenu.hidden = true;
});

// ---- Blueprints (Pass 1.0c) ----------------------------------------------------------
const blueprintMenu = document.getElementById('blueprints')!;
const bpPlan = document.getElementById('bp-plan') as HTMLCanvasElement;
const bpName = document.getElementById('bp-name')!;
const bpBlurb = document.getElementById('bp-blurb')!;
const bpNeeds = document.getElementById('bp-needs')!;
const bpTrack = document.getElementById('bp-track') as HTMLInputElement;
const bpBuild = document.getElementById('bp-build') as HTMLButtonElement;
let bpRows: { bp: Blueprint; reason: string | null }[] = [];
let bpIndex = 0;
let bpOn: Structure | null = null;
let bpAnchor: WorldObject | null = null;

function openBlueprints(on: Structure | null, anchor: WorldObject | null): void {
  bpRows = blueprintsFor(on);
  if (bpRows.length === 0) return;
  bpOn = on;
  bpAnchor = anchor;
  bpIndex = 0;
  renderBlueprint();
  blueprintMenu.hidden = false;
}
function renderBlueprint(): void {
  const row = bpRows[bpIndex];
  drawPlan(row.bp, bpPlan);
  bpName.textContent = `${row.bp.label}  (${bpIndex + 1}/${bpRows.length})`;
  bpBlurb.textContent = row.bp.blurb;
  bpNeeds.textContent = `Needs: ${ingredientsText(row.bp)}`;
  bpTrack.checked = trackedBlueprint === row.bp;
  bpBuild.disabled = !!row.reason;
  bpBuild.textContent = row.reason ?? (bpOn ? 'Add it here' : 'Build here');
}
for (const el of [blueprintMenu]) el.addEventListener('pointerdown', (e) => e.stopPropagation());
document.getElementById('bp-prev')!.addEventListener('click', () => {
  bpIndex = (bpIndex + bpRows.length - 1) % bpRows.length;
  renderBlueprint();
});
document.getElementById('bp-next')!.addEventListener('click', () => {
  bpIndex = (bpIndex + 1) % bpRows.length;
  renderBlueprint();
});
document.getElementById('bp-close')!.addEventListener('click', () => (blueprintMenu.hidden = true));
bpTrack.addEventListener('change', () => {
  trackedBlueprint = bpTrack.checked ? bpRows[bpIndex].bp : null;
  updateHud();
});
bpBuild.addEventListener('click', () => {
  blueprintMenu.hidden = true;
  const bp = bpRows[bpIndex].bp;
  let structure = bpOn;
  if (!structure) {
    // A new structure where the pressed material lies, its open front toward you.
    const at = bpAnchor ? bpAnchor.position.clone() : player.position.clone();
    const dx = player.position.x - at.x;
    const dz = player.position.z - at.z;
    const yaw = Math.hypot(dx, dz) > 1e-3 ? Math.atan2(-dz, dx) : 0;
    structure = new Structure(new THREE.Vector3(at.x, GROUND_Y, at.z), yaw);
    structures.add(structure);
  }
  startSite(bp, structure);
});

function startSite(bp: Blueprint, structure: Structure): void {
  const site = new BuildSite(bp, structure, objects, GROUND_Y, seed * 977 + sites.length * 31);
  scene.add(site.group);
  sites.push(site);
  interactables.push(site);
  site.onMissing = (type) => {
    hint.textContent = `Needs ${OBJECT_TYPES[type].label} inside the ring.`;
    tooFarUntil = animClock + 1600;
  };
  site.onPlaced = () => updateHud();
  site.onDone = (it) => {
    finishSite(site);
    if (bp.id === 'campfire' && !structure.fire) {
      structure.fire = new Fire(structure.center, GROUND_Y);
      scene.add(structure.fire.group);
    }
    hint.textContent = bp.id === 'campfire' ? 'A campfire, unlit. Long-press it to light it.' : `${bp.label}: built.`;
    tooFarUntil = animClock + 2200;
    onInteractableDone(it);
  };
  hint.textContent = `A site. Bring ${ingredientsText(bp)} inside the ring; it turns green. Tap inside to build.`;
  tooFarUntil = animClock + 4500;
  updateHud();
}
function finishSite(site: BuildSite | Deconstruct | CutDoorway | Ignite | Transmute): void {
  if (site instanceof BuildSite) site.dispose();
  if (site instanceof Transmute) {
    if (site.status !== 'resolved') site.dispose();
    else effects.push(site); // the burst plays out after the session is gone
  }
  sites.splice(sites.indexOf(site), 1);
  const i = interactables.indexOf(site);
  if (i >= 0) interactables.splice(i, 1);
}
function abandonSite(site: BuildSite | Deconstruct | CutDoorway | Ignite | Transmute): void {
  site.status = 'resolved';
  finishSite(site);
  if (site instanceof BuildSite && site.structure.pieces.length === 0) structures.remove(site.structure);
  hint.textContent = 'Site abandoned. What was placed stays.';
  tooFarUntil = animClock + 2000;
  updateHud();
}
function startTransmute(anchor: WorldObject, rune: 'wheat', to: ObjectTypeId): void {
  const site = new Transmute(rune, to, anchor, objects, GROUND_Y, seed * 271 + sites.length * 5);
  scene.add(site.group);
  sites.push(site);
  interactables.push(site);
  site.onCharged = () => updateHud();
  site.onDone = (it) => {
    finishSite(site);
    shakeUntil = animClock + SHAKE_MS * 0.7; // the burst has weight
    hint.textContent = `${OBJECT_TYPES[to].label[0].toUpperCase()}${OBJECT_TYPES[to].label.slice(1)}. Eat them, plant four on tilled ground, or pop them on a fire.`;
    tooFarUntil = animClock + 3600;
    onInteractableDone(it);
  };
  if (site.distanceTo(player.position) > site.lockReach) {
    hint.textContent = 'Closer.';
    tooFarUntil = animClock + 900;
    site.cancel();
    finishSite(site);
    return;
  }
  lockOnto(site);
}
function startIgnite(s: Structure): void {
  const site = new Ignite(s, GROUND_Y, seed * 389 + sites.length * 7);
  sites.push(site);
  interactables.push(site);
  site.onSpark = () => updateHud();
  site.onDone = (it) => {
    finishSite(site);
    hint.textContent = 'It catches. Feed it shavings, sticks or a knuckle to keep it going.';
    tooFarUntil = animClock + 3000;
    onInteractableDone(it);
  };
  if (site.distanceTo(player.position) > site.lockReach) {
    hint.textContent = 'Closer.';
    tooFarUntil = animClock + 900;
    finishSite(site);
    return;
  }
  lockOnto(site);
}
function startCut(s: Structure, wall: 'A' | 'B' | 'back'): void {
  const site = new CutDoorway(s, wall, objects, GROUND_Y, seed * 743 + sites.length * 13);
  sites.push(site);
  interactables.push(site);
  site.onCut = () => updateHud();
  site.onDone = (it) => {
    finishSite(site);
    hint.textContent = 'A doorway. The knuckles lie outside it.';
    tooFarUntil = animClock + 2400;
    onInteractableDone(it);
  };
  if (site.distanceTo(player.position) > site.lockReach) {
    hint.textContent = 'Closer.';
    tooFarUntil = animClock + 900;
    finishSite(site);
    return;
  }
  lockOnto(site);
}
function startDeconstruct(s: Structure): void {
  const site = new Deconstruct(s, structures, GROUND_Y, seed * 611 + sites.length * 17);
  sites.push(site);
  interactables.push(site);
  site.onRemoved = () => updateHud();
  site.onDone = (it) => {
    finishSite(site);
    if (s.fire) {
      s.fire.group.removeFromParent();
      s.fire = null;
    }
    hint.textContent = 'Taken apart. The pieces lie out the front.';
    tooFarUntil = animClock + 2200;
    onInteractableDone(it);
  };
  if (site.distanceTo(player.position) > site.lockReach) {
    hint.textContent = 'Closer.';
    tooFarUntil = animClock + 900;
    finishSite(site);
    return;
  }
  lockOnto(site);
}

function startCraft(target: WorldObject, recipe: Recipe): void {
  const strength = vitality.effects(animClock).strength;
  // A target the hands could lift hovers in front of you; a heavier one (a log) is worked where it lies.
  const lifts = handsToLift(target.type.mass, strength) <= HANDS;
  craft = new CraftSession(target, recipe, objects, viewerNow(), seed * 17 + target.id, lifts, GROUND_Y);
  craft.onDone = (it) => {
    const session = it as CraftSession;
    const type = OBJECT_TYPES[session.result as keyof typeof OBJECT_TYPES];
    const count = session.recipe.resultCount ?? 1;
    // Each result lands in a free hand if one hand can take it; otherwise it lies where the target lay:
    // halves end to end along the log, timbers in a bundle beside each other.
    const along = new THREE.Vector3(Math.cos(session.restYaw), 0, -Math.sin(session.restYaw));
    const perp = new THREE.Vector3(Math.sin(session.restYaw), 0, Math.cos(session.restYaw));
    for (let i = 0; i < count; i++) {
      const free = hands.freeHand();
      if (free >= 0 && handsToLift(type.mass, strength) === 1) {
        hands.give(free, type);
        continue;
      }
      const at = session.restPosition.clone();
      if (type.halfLength && type.halfLength > 0.6) at.addScaledVector(along, (i - (count - 1) / 2) * (type.halfLength * 2 + 0.1));
      else at.addScaledVector(along, (i % 2) * 1.3 - 0.65 * Math.min(1, count - 1)).addScaledVector(perp, (Math.floor(i / 2) - (Math.ceil(count / 2) - 1) / 2) * 0.32);
      objects.spawn(type.id, at.x, GROUND_Y, at.z, session.restYaw);
    }
    hint.textContent = count > 1 ? `${count} ${type.label}.` : `A ${type.label}.`;
    tooFarUntil = animClock + 1800;
    onInteractableDone(it);
  };
  lockOnto(craft);
}

// ---- Vitality (Pass 0.7a) -----------------------------------------------------
const vitality = new Vitality();
const halo = document.getElementById('halo')!;
const blackout = document.getElementById('blackout')!;
hands.onEat = (type) => {
  if (!type.food) return false;
  vitality.eat(type.food, type.nourishMs ?? 0);
  return true;
};
player.onHop = () => vitality.drain(hands.dragging ? DRAIN_DRAG_HOP : DRAIN_HOP);
let restQuality: RestQuality = GROUND_REST;
player.onRestHold = () => {
  if (cameraRig.mode !== 'free' || vitality.busy) return;
  // Pass 0.9: beside a bed you made, the same hold is a night in it. Pass 1.0: a roof over it counts too.
  restQuality = { bed: !!structures.bedNear(player.position.x, player.position.z), shelter: structures.shelterAt(player.position.x, player.position.z) };
  vitality.rest(animClock, restQuality);
};
vitality.onEvent = (what) => {
  if (what === 'ate') updateHud(); // 'nourished' appears the moment it applies
  const rested = restQuality.bed
    ? restQuality.shelter >= 1
      ? 'You sleep in your bed, in your cabin, and wake whole.'
      : 'You sleep in your bed under a patchy roof, and wake rested.'
    : restQuality.shelter > 0
      ? 'You rest on the cabin floor.'
      : 'You rest.';
  const text = { collapse: 'You collapse.', wake: 'You wake, still tired.', rest: rested, ate: '' }[what];
  if (text) {
    hint.textContent = text;
    tooFarUntil = animClock + 1800;
  }
};
let lastBand = vitality.band;
function applyVitality(): void {
  const fx = vitality.effects(animClock);
  hands.setCondition({ strength: fx.strength, capScale: fx.capScale, handsAvailable: fx.handsAvailable });
  // Halo: a dark vignette that closes in as you tire; a faint warm rim when well fed.
  const inner = 100 - 70 * fx.haloDark; // % radius where the dark begins
  halo.style.background =
    fx.haloDark > 0.01
      ? `radial-gradient(ellipse at center, rgba(0,0,0,0) ${Math.max(15, inner - 45)}%, rgba(0,0,0,${(0.92 * fx.haloDark).toFixed(3)}) ${inner}%)`
      : fx.haloLight > 0.01
        ? `radial-gradient(ellipse at center, rgba(255,240,200,0) 62%, rgba(255,236,190,${(0.22 * fx.haloLight).toFixed(3)}) 100%)`
        : 'none';
  renderer.domElement.style.filter = fx.saturation < 0.995 ? `saturate(${fx.saturation.toFixed(3)})` : '';
  renderer.toneMappingExposure = fx.exposure;
  blackout.style.opacity = fx.blackout.toFixed(3);
  if (fx.band !== lastBand) {
    lastBand = fx.band;
    updateHud();
  }
}

/** Night vision from vitality, applied on top of the vitality look; lichen lights for tired eyes. */
function applyNight(): void {
  const vision = dayCycle.vision(vitality.effects(animClock).vision);
  renderer.toneMappingExposure *= vision.exposure;
  const sat = (Number.parseFloat(renderer.domElement.style.filter.replace(/[^0-9.]/g, '')) || 1) * vision.saturation;
  renderer.domElement.style.filter = sat < 0.995 ? `saturate(${sat.toFixed(3)})` : '';
  lichenMaterial.emissiveIntensity = 2.6 * vision.glow;
  const visible = vision.glow > GLOW_VISIBLE;
  for (const o of objects.objects) if (o.type.id === 'lichen') o.collectible = visible;
}


// ---- The thicket ------------------------------------------------------------
// Pass 0.4a: the trees do the confining. Voxels sit on a hex lattice around
// the start, three rings deep, faces turned toward the start, so every
// direction is roughly three voxels thick before open rock. The one way out
// is kept as before: a sector toward +X is cleared in rings 2–3, and the two
// staggered voxels behind the +X ring voxel stand in it — clear the ring
// voxel to see them, clear one of them to get out. Tuning: LATTICE_SPACING
// sets how cramped everything is; at 2.45 cube corners nearly touch.
const LATTICE_SPACING = 2.45;
const LATTICE_RINGS = 3;
/** Half-angle of the cleared sector toward +X (rings 2–3 only). */
const OPENING_HALF_ANGLE = (35 * Math.PI) / 180;
const START = new THREE.Vector3(0, 0, 0);
const voxels: Voxel[] = [];
const addVoxel = (pos: THREE.Vector3, faceToward: THREE.Vector3) =>
  voxels.push(new Voxel(voxels.length, pos, faceToward, seed * 131 + voxels.length * 17));

for (let i = -LATTICE_RINGS; i <= LATTICE_RINGS; i++) {
  for (let j = -LATTICE_RINGS; j <= LATTICE_RINGS; j++) {
    const ring = Math.max(Math.abs(i), Math.abs(j), Math.abs(i + j)); // axial hex distance
    if (ring === 0 || ring > LATTICE_RINGS) continue;
    const x = LATTICE_SPACING * (i + j / 2);
    const z = LATTICE_SPACING * j * (Math.sqrt(3) / 2);
    if (ring >= 2 && Math.abs(Math.atan2(z, x)) < OPENING_HALF_ANGLE) continue;
    addVoxel(new THREE.Vector3(x, 0, z), START);
  }
}
// The staggered pair in the corridor. ±1.4 leaves a 0.8 slit between them
// (a glimpse, not a way through) and closes the gap to the ring-3 voxels
// beside them, so the only way past is to clear one.
const slot = new THREE.Vector3(LATTICE_SPACING, 0, 0); // where the player stands once the +X ring voxel is gone
for (const z of [-1.4, 1.4]) addVoxel(new THREE.Vector3(LATTICE_SPACING * 2, 0, z), slot);
for (const v of voxels) scene.add(v.group);

// ---- Tillable ground ---------------------------------------------------------
// Pass 0.4b. Authored positions that read as a grid (2.5 apart, a couple of
// cells left as rock) without the world being a grid: one under your feet in
// the pocket, one in the corridor, the rest out on the open rock past the
// opening. Patches never collide.
const patches: Patch[] = [];
const PATCH_POSITIONS: [number, number][] = [
  [0, 0],
  [LATTICE_SPACING * 3, 0],
  [10.5, -2.5], [10.5, 0], [10.5, 2.5],
  [13, -2.5], [13, 2.5],
  [15.5, 0], [15.5, 2.5],
];
for (const [x, z] of PATCH_POSITIONS) {
  patches.push(new Patch(patches.length, new THREE.Vector3(x, GROUND_Y, z), seed * 977 + patches.length * 23));
}
for (const p of patches) scene.add(p.group);

const interactables: Interactable[] = [...voxels, ...patches];

// ---- Felling aftermath (Pass 0.6a) ---------------------------------------------
// Thud → camera shake. Done → the log lies along the fall, sticks and seeds
// around it, and a blocked footprint patch under all of it.
const SHAKE_MS = 320;
const SHAKE_AMP = 0.045;
let shakeUntil = -1;
const shakeOffset = new THREE.Vector3();
for (const v of voxels) {
  v.onThud = () => {
    shakeUntil = animClock + SHAKE_MS;
  };
}
/** Pass 0.6c: a grown sapling becomes a tree where its patch was. */
function onSaplingGrown(patch: Patch): void {
  const v = new Voxel(voxels.length, new THREE.Vector3(patch.center.x, 0, patch.center.z), player.position.clone(), seed * 131 + 4000 + voxels.length * 17);
  v.onDone = onInteractableDone;
  v.onThud = () => {
    shakeUntil = animClock + SHAKE_MS;
  };
  voxels.push(v);
  interactables.push(v);
  scene.add(v.group);
  scene.remove(patch.group);
  patches.splice(patches.indexOf(patch), 1);
  interactables.splice(interactables.indexOf(patch), 1);
  updateHud();
}
for (const p of patches) p.onGrown = onSaplingGrown;
/** 1.1c: a harvest scatters wheat seeds over the patch. */
function onHarvest(patch: Patch, seeds: number): void {
  const rand = mulberry32(seed * 7 + patch.index * 31 + Math.floor(animClock));
  for (let i = 0; i < seeds; i++) {
    const a = rand() * Math.PI * 2;
    const r = 0.15 + rand() * 0.45;
    objects.spawn('wheat_seed', patch.center.x + Math.cos(a) * r, GROUND_Y, patch.center.z + Math.sin(a) * r, rand() * Math.PI);
  }
  hint.textContent = `Wheat: ${seeds} seeds. Eat them, plant them, or pop them on a fire.`;
  tooFarUntil = animClock + 3200;
}
for (const p of patches) p.onHarvest = onHarvest;

/** Pass 0.8: a rock turns up at the patch's edge each time tilling steps its look down. */
const rockRand = mulberry32(seed * 3 + 11);
function onRockTurnedUp(patch: Patch): void {
  // Clear of the footprint square (the blocked check is per-axis, so the corner needs the margin too),
  // so turning up a rock never blocks the round you are in.
  const rockRadius = OBJECT_TYPES.rock.radius;
  const clear = patch.footprintHalf + rockRadius + 0.3;
  for (let tries = 0; tries < 8; tries++) {
    const a = rockRand() * Math.PI * 2;
    const r = clear * Math.SQRT2 * (1 + rockRand() * 0.25);
    const x = patch.center.x + Math.cos(a) * r;
    const z = patch.center.z + Math.sin(a) * r;
    if (Math.abs(x - patch.center.x) < clear && Math.abs(z - patch.center.z) < clear) continue;
    if (!world.isWalkable(new THREE.Vector3(x, GROUND_Y, z))) continue;
    objects.spawn('rock', x, GROUND_Y, z, rockRand() * Math.PI);
    return;
  }
}
for (const p of patches) p.onRock = onRockTurnedUp;

function onTreeFelled(v: Voxel): void {
  const dir = v.normal; // the face the lock chose = the side it fell toward
  objects.scatterFelledTree(v.center, dir, GROUND_Y, seed * 53 + v.index);
  // Disturbed ground under a felled tree: sparse, already part-worked (stage 2), with the log on it.
  const footprint = new Patch(patches.length, new THREE.Vector3(v.center.x, GROUND_Y, v.center.z), seed * 977 + 500 + v.index, true, 2);
  footprint.onDone = onInteractableDone;
  footprint.onGrown = onSaplingGrown;
  footprint.onHarvest = onHarvest;
  footprint.onRock = onRockTurnedUp;
  patches.push(footprint);
  interactables.push(footprint);
  scene.add(footprint.group);
}

// ---- Day and night (Pass 0.7b) --------------------------------------------------
const dayCycle = new DayCycle(
  { sun: world.sun, moon: world.moon, hemi: world.hemi, skyMaterial: world.skyMaterial, fog: world.fog, background: scene.background as THREE.Color, dayHaze: HAZE_COLOR, dayHemiSky: HEMI_SKY_COLOR },
  startTime
);
dayCycle.apply();
const sky = new Sky(scene);

// ---- Weather (Pass 1.0) -----------------------------------------------------------
const weather = new Weather(scene, seed, 0, forceRain);
const rainSheet = document.getElementById('rain')!;
let wasRoofed = false;
/** The screen rain sheet at full shower. Designer, after 1.0: rain must read even tired at night. */
const RAIN_SHEET_OPACITY = 0.55;
weather.onRain = (raining) => {
  const sheltered = structures.shelterAt(player.position.x, player.position.z) > 0;
  hint.textContent = raining ? (sheltered ? 'Rain on the roof.' : 'Rain. It wears at you out here.') : 'The rain passes.';
  tooFarUntil = animClock + 3200;
  updateHud();
};
const flashSheet = document.getElementById('flash')!;
let flashUntil = -1;
const FLASH_SHEET_MS = 380;
weather.onLightning = (near) => {
  shakeUntil = animClock + SHAKE_MS; // the crack
  if (!near) return;
  if (structures.shelterAt(player.position.x, player.position.z) > 0) {
    hint.textContent = 'Lightning, close. The roof holds.';
  } else {
    // Struck (1.0e): the screen goes white, you are thrown a step, everything goes black,
    // and it comes back up on what the strike left you with.
    flashUntil = animClock + FLASH_SHEET_MS;
    player.knock();
    vitality.sap(LIGHTNING_SAP_TO, animClock + FLASH_SHEET_MS * 0.5);
    hint.textContent = 'Struck. You come to on the ground, shaking.';
  }
  tooFarUntil = animClock + 4200;
};

// Lichen on the rock: near the outer trees and toward the lip. Rock-coloured by day.
{
  const rand = mulberry32(seed * 7 + 3);
  let placed = 0;
  for (let tries = 0; tries < 400 && placed < 40; tries++) {
    const x = -12 + rand() * 34;
    const z = (rand() * 2 - 1) * 20;
    if (!world.isWalkable(new THREE.Vector3(x, GROUND_Y, z))) continue;
    if (voxels.some((v) => Math.hypot(v.center.x - x, v.center.z - z) < 1.7)) continue;
    if (patches.some((p) => Math.hypot(p.center.x - x, p.center.z - z) < 1.1)) continue;
    objects.spawn('lichen', x, GROUND_Y, z, rand() * Math.PI);
    placed++;
  }
}

// ---- Lock / unlock plumbing --------------------------------------------------
let locked: Interactable | null = null;
/** The pose lockOnto actually applied (after stepping out of trees and lifting). */
let lockedPose: CameraPose | null = null;
/** After a locked voxel resolves, hold this long on the empty spot, then back out to reveal the gap. */
const RELEASE_HOLD_MS = 450;
let autoUnlockAt: number | null = null;

function onInteractableDone(done: Interactable): void {
  if (done === locked && cameraRig.mode === 'locked') autoUnlockAt = animClock + RELEASE_HOLD_MS;
  if (done.kind === 'voxel' && (done as Voxel).ending === 'fell') onTreeFelled(done as Voxel);
  updateHud();
}
for (const it of interactables) it.onDone = onInteractableDone;

/** Radius around the locked camera position inside which a neighbour is faded. */
const FADE_NEAR_CAMERA = 2.4;
/** Neighbours on the camera's side of the target, within this lateral distance of the view axis, are faded. */
const FADE_CORRIDOR = 2.6;
/**
 * Which neighbours to drop out of the locked view: the one the camera is
 * inside, and the ones between or beside the camera and the face — they
 * clutter the puzzle read. Anything *behind* the face plane stays, so what
 * is beyond the voxel you're clearing keeps blocking the light until you
 * clear it too.
 */
/** For a look-down lock on a patch, voxels this close to the patch would loom into the frame. */
const FADE_NEAR_PATCH = 2.3;
/** Third person: a tree near the camera, or in the corridor from the camera to the player, is in the way. */
const THIRD_PERSON_FADE = 0.22;
const THIRD_NEAR_CAMERA = 1.5;
const THIRD_CORRIDOR = 1.1;
function obstructsThirdPerson(v: Voxel): boolean {
  if (v.status === 'resolved') return false;
  const c = v.center;
  const eye = player.eye();
  if (Math.hypot(c.x - camera.position.x, c.z - camera.position.z) < THIRD_NEAR_CAMERA) return true;
  const ax = eye.x - camera.position.x;
  const az = eye.z - camera.position.z;
  const len = Math.hypot(ax, az);
  if (len < 1e-3) return false;
  const rx = c.x - camera.position.x;
  const rz = c.z - camera.position.z;
  const along = (rx * ax + rz * az) / len;
  if (along < 0 || along > len + 0.3) return false;
  const lateral = Math.abs(rx * az - rz * ax) / len;
  return lateral < THIRD_CORRIDOR;
}

function obstructsLockedView(v: Voxel, target: Interactable): boolean {
  if (target.kind === 'craft' || target.kind === 'site') {
    // The camera backs off and lifts from the player: a neighbouring tree (or its
    // flowers) can end up beside or ahead of it, over the board. Fade what is
    // near the camera or in the corridor between camera and board.
    if (!lockedPose) return false;
    const c = v.center;
    if (c.distanceTo(lockedPose.position) < FADE_NEAR_CAMERA) return true;
    const axis = lockedPose.target.clone().sub(lockedPose.position).normalize();
    const rel = c.clone().sub(lockedPose.position);
    const along = rel.dot(axis);
    if (along < 0 || along > BOARD_DISTANCE + 1) return false;
    const lateral = rel.clone().sub(axis.multiplyScalar(along)).length();
    return lateral < FADE_CORRIDOR;
  }
  if (target.kind === 'patch') return v.distanceTo(target.center) < FADE_NEAR_PATCH;
  const locked = target as Voxel;
  const pose = lockedPoseFor(locked.center, locked.normal); // the face the lock chose
  const c = v.center;
  if (c.distanceTo(pose.position) < FADE_NEAR_CAMERA) return true;
  const toCamera = locked.normal; // face normal points from the face toward the locked camera
  const cameraSide = c.clone().sub(locked.center).dot(toCamera) > 0.5;
  if (!cameraSide) return false;
  const axis = pose.target.clone().sub(pose.position).normalize();
  const rel = c.clone().sub(pose.position);
  const lateral = rel.clone().sub(axis.multiplyScalar(rel.dot(axis))).length();
  return lateral < FADE_CORRIDOR;
}

// ---- HUD --------------------------------------------------------------------
const hud = document.getElementById('hud')!;
const hint = document.getElementById('hint')!;
const backButton = document.getElementById('back') as HTMLButtonElement;

const HINTS: Record<CameraMode, string> = {
  free: 'Hold walk to move, drag to look, tap growth or grass to lock in, long-press a thing for what it can become. Drag a hand box to a thing to take or place it.',
  locking: '',
  locked: '',
  unlocking: '',
};
function applyMode(mode: CameraMode): void {
  hint.textContent = mode === 'locked' && locked ? locked.hintLocked : HINTS[mode];
  player.enabled = mode === 'free';
  if (mode !== 'free') setFov(BASE_FOV); // the edge widen is a free-view thing; the board lays out at base
  if (mode === 'locked' && locked) {
    boardView.bind(locked.board);
    boardView.show(animClock);
    // Finished (or blocked) while the camera was still on its way in: back out rather than sit on a dead board.
    if (locked.status !== 'growing' && autoUnlockAt === null) autoUnlockAt = animClock + RELEASE_HOLD_MS;
  }
  if (mode === 'unlocking') {
    boardView.hide();
    if (craft && craft.status === 'growing') craft.cancel();
    if (locked instanceof Transmute && locked.status === 'growing') {
      locked.cancel();
      finishSite(locked);
    }
  }
  if (mode === 'free') {
    boardView.unbind();
    locked = null;
    craft = null;
  }
  updateHud();
}

// A run cleared on the board: shoot at the flower it targets; the hit feeds the pool.
boardView.onRun = (run, origin) => {
  const it = locked;
  if (!it) return;
  const target = it.targetFor(run);
  if (target === null) return;
  const amount = run.cells.length;
  if (it.kind === 'craft') {
    // The rock in your hand flies out, strikes, and comes back.
    const session = it as CraftSession;
    const hand = hands.handHolding(session.recipe.requiresHeld ?? 'rock');
    const from = hand >= 0 ? hands.pointUnderBox(hand) : origin;
    projectiles.strike(OBJECT_TYPES[session.recipe.requiresHeld ?? 'rock'].build(), from, it.targetWorldPosition(target), animClock, () => {
      it.feed(target, amount, animClock);
      vitality.drain(session.recipe.drain);
      updateHud();
    });
    return;
  }
  projectiles.fire(origin, it.targetWorldPosition(target), PALETTE[run.type].hex, animClock, () => {
    it.feed(target, amount, animClock);
    vitality.drain(it.kind === 'voxel' ? DRAIN_TREE_HIT : it.kind === 'patch' ? DRAIN_TILL_HIT : it instanceof Deconstruct ? DRAIN_UNBUILD : it instanceof Transmute ? DRAIN_TRANSMUTE : DRAIN_BUILD);
    updateHud();
  });
};
cameraRig.onModeChange = applyMode;
backButton.addEventListener('click', () => {
  if (cameraRig.mode === 'locked') cameraRig.unlock(animClock, playerPose());
});

function playerPose() {
  const eye = player.eye();
  return { position: eye, target: eye.clone().add(player.forward()) };
}

function updateHud(): void {
  const resolved = voxels.filter((v) => v.status === 'resolved').length;
  const tilled = patches.filter((p) => p.status === 'resolved').length;
  const planted = patches.filter((p) => p.status === 'planted').length;
  const parts = [`seed ${seed}`, `cleared ${resolved}/${voxels.length}`, `tilled ${tilled}/${patches.length}`];
  if (planted) parts.push(`planted ${planted}`);
  if (weather.raining) parts.push('rain');
  if (vitality.nourished(animClock)) parts.push('nourished');
  if (trackedBlueprint) parts.push(`${trackedBlueprint.label}: ${ingredientsText(trackedBlueprint)}`);
  if (slowmo > 1) parts.push(`slowmo ×${slowmo}`);
  if (debug) parts.push(`vit ${vitality.value.toFixed(2)} ${vitality.band}`, `time ${dayCycle.time.toFixed(2)} day ${dayCycle.day.toFixed(2)}`, `rain ${weather.rain.toFixed(2)} roof ${structures.shelterAt(player.position.x, player.position.z).toFixed(2)}`);
  if (locked && cameraRig.mode === 'locked' && locked.status === 'growing') {
    parts.push(locked.poolText());
  }
  parts.push('R: new arrangement');
  hud.textContent = parts.join(' · ');
  backButton.hidden = !(cameraRig.mode === 'locked' && locked?.status === 'growing');
  const lockedNow = cameraRig.mode === 'locked' && locked?.status === 'growing';
  const zoomable = lockedNow || (cameraRig.mode === 'free' && player.view === 'third');
  zoomInButton.hidden = !zoomable;
  zoomOutButton.hidden = !zoomable;
  document.getElementById('tools')!.classList.toggle('locked', lockedNow); // side by side along the bottom, off the gems
  walkButton.hidden = cameraRig.mode !== 'free';
  viewButton.hidden = cameraRig.mode !== 'free';
}

// ---- Vertigo at the lip (Pass 0.5, nice-to-have) ----------------------------
// Within EDGE_VERTIGO_RANGE of the cliff line the FOV widens a little and the
// eye dips, ramping to full at EDGE_MARGIN. Calibration, not mechanic.
const EDGE_VERTIGO_RANGE = 1.6;
const EDGE_FOV_WIDEN = 9;
const EDGE_EYE_DIP = 0.08;
function setFov(fov: number): void {
  if (Math.abs(camera.fov - fov) < 1e-3) return;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  boardView.layout();
}
function edgeCloseness(): number {
  const d = world.distanceToEdge(player.position) - EDGE_MARGIN;
  return THREE.MathUtils.clamp(1 - d / EDGE_VERTIGO_RANGE, 0, 1);
}

// ---- Input ------------------------------------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function castFrom(clientX: number, clientY: number): void {
  pointer.set((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
}

let tooFarUntil = 0;
let lastDebugHud = -1;
player.onTap = (x, y) => {
  castFrom(x, y);
  if (cameraRig.mode === 'free') {
    // A pending site's ring wins over the ground (patches) and trees inside it.
    const siteTargets = sites.filter((it) => it.status === 'growing').flatMap((it) => it.lockTargets);
    const targets = interactables.filter((it) => it.status === 'growing' && it.kind !== 'site').flatMap((it) => it.lockTargets);
    const hit = raycaster.intersectObjects(siteTargets, false)[0] ?? raycaster.intersectObjects(targets, false)[0];
    if (!hit) {
      // Tapping blocked ground: the thing in the way waggles. That is the whole hint.
      const blockedHit = raycaster.intersectObjects(patches.filter((p) => p.status === 'blocked').flatMap((p) => p.lockTargets), false)[0];
      if (blockedHit) {
        const patch = blockedHit.object.userData.interactable as Patch;
        for (const o of objects.overlapsSquare(patch.center.x, patch.center.z, patch.footprintHalf)) o.waggle(animClock);
        hint.textContent = 'Something is in the way.';
        tooFarUntil = animClock + 1200;
      }
      return;
    }
    const it = hit.object.userData.interactable as Interactable;
    if (it.distanceTo(player.position) > it.lockReach) {
      hint.textContent = 'Closer.';
      tooFarUntil = animClock + 900;
      return;
    }
    if (it instanceof BuildSite && !it.isReady) {
      const missing = it.missing();
      hint.textContent = `Not yet: bring ${missing.map((m) => `${m.count} ${OBJECT_TYPES[m.type].label}`).join(', ')} inside the ring.`;
      tooFarUntil = animClock + 2600;
      return;
    }
    lockOnto(it);
  } else if (cameraRig.mode === 'locked' && locked) {
    if (boardView.tap(raycaster)) updateHud();
  }
};

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
  boardView.layout();
});

// ---- Loop -------------------------------------------------------------------
// Animation clock in ms, scaled by slowmo so every tuning constant stays in
// real-speed milliseconds. Movement uses real time — slowmo is for watching
// animations, not for hopping.
let animClock = 0;
let lastFrame = performance.now();
applyMode(cameraRig.mode);
player.applyCamera(camera);

function animate(now: number): void {
  requestAnimationFrame(animate);

// Debug handle for headless/console poking. Not part of the design surface.
(window as unknown as { __rootwake: unknown }).__rootwake = { scene, camera, renderer, player, voxels, patches, objects, hands, vitality, dayCycle, world, cameraRig, boardView, structures, sites, weather, startSite, blueprints: BLUEPRINTS, Structure, get craft() { return craft; }, startCraft, get shake() { return { shakeUntil, animClock, offset: shakeOffset.clone() }; } };
  // Clamped at zero: the first rAF timestamp can predate the module's own init time, and a
  // negative delta once sent the animation clock negative — which armed the thud shake at load.
  const dt = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000));
  animClock += (dt * 1000) / slowmo;
  lastFrame = now;

  if (cameraRig.mode === 'free') {
    const colliders = [...voxels.flatMap((v) => v.collider() ?? []), ...structures.colliders()];
    player.update(now, colliders, world.isWalkable);
    player.thirdBackScale = structures.list.some((st) => st.inside(player.position.x, player.position.z)) ? 0.45 : 1;
    player.applyCamera(camera);
    const k = edgeCloseness();
    setFov(BASE_FOV + EDGE_FOV_WIDEN * k);
    camera.position.y -= EDGE_EYE_DIP * k;
  }
  // Vitality: drains with time, drives hands/reach, paints the halo. Then the hour of the day on top.
  vitality.update(animClock);
  applyVitality();
  dayCycle.advance((dt * 1000) / slowmo);
  weather.update(animClock, camera.position, structures.dryStrips());
  // The rain sheet is rain on your face: none under a roof — there you look out at it.
  const roofed = structures.shelterAt(player.position.x, player.position.z) > 0;
  rainSheet.style.opacity = (roofed ? 0 : weather.rain * RAIN_SHEET_OPACITY).toFixed(3);
  flashSheet.style.opacity = flashUntil > animClock ? Math.min(1, (flashUntil - animClock) / (FLASH_SHEET_MS * 0.6)).toFixed(3) : '0';
  if (weather.rain > 0.3 && roofed !== wasRoofed && animClock > tooFarUntil) {
    hint.textContent = roofed ? 'Under your roof. The rain falls outside.' : 'Out in the rain again.';
    tooFarUntil = animClock + 2600;
  }
  wasRoofed = roofed;
  if (debug && animClock - lastDebugHud > 500) {
    lastDebugHud = animClock;
    updateHud(); // the debug readouts (vitality, time, rain, roof) move on their own
  }
  // Out in the rain, vitality drains (SYSTEMS §1.1, §4); under a roof it doesn't.
  if (weather.rain > 0 && !vitality.busy && structures.shelterAt(player.position.x, player.position.z) <= 0) vitality.drain(DRAIN_RAIN_PER_SECOND * weather.rain * dt);
  dayCycle.apply(vitality.effects(animClock).vision, weather.overcast, weather.flash);
  sky.update(camera.position, dayCycle.sunDirection, dayCycle.day, dayCycle.time, dt, weather.overcast);
  applyNight();
  const vfx = vitality.effects(animClock);
  // Encumbrance: dragging shortens and slows hops; straining stops them. Fatigue shortens them too.
  player.fanScale = (hands.dragging ? DRAG_FAN_SCALE : 1) * vfx.fanScale;
  player.moveSlowdown = hands.dragging ? DRAG_MOVE_SLOWDOWN : 1;
  player.canMove = !hands.straining;
  player.enabled = cameraRig.mode === 'free' && !vitality.busy;
  hands.update(animClock);
  if (hands.notice) {
    hint.textContent = hands.notice;
    hands.notice = null;
    tooFarUntil = animClock + 1200;
  }
  cameraRig.update(animClock);

  // Thud shake: applied on top of whoever owns the camera this frame, removed before they run again.
  camera.position.sub(shakeOffset);
  shakeOffset.set(0, 0, 0);
  if (animClock < shakeUntil) {
    const k = (shakeUntil - animClock) / SHAKE_MS;
    shakeOffset.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 0).multiplyScalar(SHAKE_AMP * k * k);
    camera.position.add(shakeOffset);
  }

  // A patch with anything lying on it is blocked ground.
  for (const p of patches) {
    if (p.status === 'resolved' || p.status === 'resolving' || p.status === 'planted') continue;
    p.setBlocked(objects.overlapsSquare(p.center.x, p.center.z, p.footprintHalf).length > 0);
  }

  // If what we're locked onto stops being workable (a patch blocked mid-till), back out on our own.
  if (locked && cameraRig.mode === 'locked' && locked.status === 'blocked' && autoUnlockAt === null) autoUnlockAt = animClock + 300;
  if (autoUnlockAt !== null && animClock >= autoUnlockAt) {
    autoUnlockAt = null;
    cameraRig.unlock(animClock, playerPose());
  }
  if (tooFarUntil && animClock >= tooFarUntil) {
    tooFarUntil = 0;
    hint.textContent = HINTS[cameraRig.mode];
  }

  // The locked framing sits 4.6 back from the face, which in a tight
  // thicket means inside or right beside a neighbour. Those neighbours — the
  // ones the camera is in, or looking through — fade out on the way in and
  // back on the way out. Everything else stays: what's behind the voxel you
  // are clearing must keep blocking the light until you clear it too, or
  // the locked view gives the vista away.
  const lockedness = cameraRig.lockedness();
  const third = player.view === 'third' && cameraRig.mode === 'free';
  for (const v of voxels) {
    let fade = locked && v !== locked && obstructsLockedView(v, locked) ? 1 - lockedness : 1;
    // Third person (1.0d): trees between the camera and you, or around the camera, go translucent.
    if (third && fade === 1 && obstructsThirdPerson(v)) fade = THIRD_PERSON_FADE;
    v.setFade(fade);
  }
  for (const it of interactables) it.update(animClock);
  for (const st of structures.list) st.fire?.update(animClock);
  for (const fx of effects) fx.update(animClock);
  effects = effects.filter((fx) => !fx.finished);
  // Popcorn (1.1c): a moment after wheat seeds go on a lit fire, giant kernels pop out around it.
  for (let i = popping.length - 1; i >= 0; i--) {
    const pop = popping[i];
    if (animClock < pop.at) continue;
    popping.splice(i, 1);
    const c = pop.fire.group.position;
    for (let k = 0; k < pop.count; k++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.55 + Math.random() * 0.45;
      objects.spawn('popcorn', c.x + Math.cos(a) * r, GROUND_Y, c.z + Math.sin(a) * r, a).waggle(animClock);
    }
    hint.textContent = 'Pop! Popcorn, out of the fire.';
    tooFarUntil = animClock + 2600;
  }
  if (craft) craft.update(animClock);
  objects.update(animClock);

  // The board's job is done once its target starts resolving (or is tilled): get out of the way.
  if (locked && locked.status !== 'growing') boardView.hide();
  boardView.update(animClock);
  projectiles.update(animClock);

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

// Debug handle for headless/console poking. Not part of the design surface.
(window as unknown as { __rootwake: unknown }).__rootwake = { scene, camera, renderer, player, voxels, patches, objects, hands, vitality, dayCycle, world, cameraRig, boardView, structures, sites, weather, startSite, blueprints: BLUEPRINTS, Structure, get craft() { return craft; }, startCraft, get shake() { return { shakeUntil, animClock, offset: shakeOffset.clone() }; } };
