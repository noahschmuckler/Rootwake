// Underworld U0: an ore-bearing boulder. Lockable like a tree face: the
// board plays it, every match superheats the ore streaks — dim gold to
// white — and at full heat the rock vaporizes, leaving molten metal that
// cools and sets into an ingot. Bare rock has no streaks and is not an
// interactable at all.

import * as THREE from 'three';
import type { Interactable, InteractableStatus, Viewer } from './interactable';
import { Board, BOARD_COLS, BOARD_ROWS, type Run } from './match3';
import { single } from './targeting';
import type { CameraPose } from './cameraLock';
import { mulberry32 } from './colors';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { CircleCollider } from './player';

// ---- Tuning constants ---------------------------------------------------------
/** Gems the ore absorbs before the rock goes. */
export const ORE_HP = 30;
/** From the centre cell every boulder (the diagonals at CELL·√2) is within reach. */
export const ORE_LOCK_REACH = 4.6;
export const BOULDER_RADIUS = 1.3;
/** Veins per boulder, and the length of each plate along a vein's walk over the rock. */
export const STREAKS = 16; // portrait FOV shows only a strip of a boulder at arm's length: enough veins that some are always in it
export const VEIN_STEP = 0.13;
/** The ore framing: the camera stands this far from the boulder's centre, this much above it,
 *  so the board hangs in the air between him and the rock instead of inside it. */
export const ORE_VIEW_DISTANCE = 4.2; // ≥ BOARD_DISTANCE (2.2) + the jittered radius (R·1.14) + clearance
export const ORE_VIEW_HEIGHT = 0.55;
/** Streak glow at cold, and at the moment of vaporizing. */
export const GLOW_COLD = 0.55;
export const GLOW_HOT = 4.5;
/** The vaporize beat, the molten pool's cooling, and the pool's fade once the ingot has set. */
export const VAPORIZE_MS = 800;
export const COOL_MS = 4200;
export const POOL_FADE_MS = 900;
// -------------------------------------------------------------------------------

const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x4a423c, roughness: 1, flatShading: true });
const coldStreak = new THREE.Color(0xd9a441);
const hotStreak = new THREE.Color(0xfff4dc);
const moltenColor = new THREE.Color(0xff6a12);
const coolColor = new THREE.Color(0x3a3634);

export class OreBoulder implements Interactable {
  readonly kind = 'voxel' as const;
  readonly group = new THREE.Group();
  readonly board: Board;
  readonly lockReach = ORE_LOCK_REACH;
  readonly hintLocked = 'Tap a gem, then a neighbour, to swap. Every match heats the ore.';
  readonly lockTargets: THREE.Object3D[];
  status: InteractableStatus = 'growing';
  pool = 0;
  onDone: (it: Interactable) => void = () => {};
  /** Fired when the pool has set: spawn an ingot here. */
  onIngot: (at: THREE.Vector3) => void = () => {};

  private readonly rock: THREE.Mesh;
  private readonly streakMaterial: THREE.MeshStandardMaterial;
  private readonly streaks: THREE.Mesh[] = [];
  private pool3d: THREE.Mesh | null = null;
  private poolMaterial: THREE.MeshStandardMaterial | null = null;
  private phaseStart = -1;
  private phase: 'solid' | 'vaporizing' | 'molten' | 'set' | 'gone' = 'solid';
  private facing = new THREE.Vector3(0, 0, 1);

  constructor(readonly index: number, position: THREE.Vector3, seed: number) {
    this.board = new Board(BOARD_ROWS, BOARD_COLS, seed ^ 0x0be5);
    const rand = mulberry32(seed);
    // The boulder: a jittered icosahedron sitting on the floor.
    // IcosahedronGeometry is non-indexed (no shared vertices): merge first, or jittering cracks it open.
    const geo = mergeVertices(new THREE.IcosahedronGeometry(BOULDER_RADIUS, 2));
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const k = 0.86 + rand() * 0.28;
      pos.setXYZ(i, pos.getX(i) * k, pos.getY(i) * (0.8 + rand() * 0.25), pos.getZ(i) * k);
    }
    geo.computeVertexNormals();
    this.rock = new THREE.Mesh(geo, rockMaterial.clone());
    this.rock.position.y = BOULDER_RADIUS * 0.85;
    this.rock.userData.interactable = this;
    this.group.add(this.rock);
    // The ore: veins walked across the actual rock surface — each a chain of
    // small plates raycast onto the mesh, so they lie in the rock, not on it.
    // (Raycast before the group is placed: world space is still boulder space.)
    this.streakMaterial = new THREE.MeshStandardMaterial({ color: 0x8a6a2a, emissive: coldStreak.clone(), emissiveIntensity: GLOW_COLD, roughness: 0.5, metalness: 0.6 });
    this.rock.updateMatrixWorld(true);
    const rockCenter = new THREE.Vector3(0, BOULDER_RADIUS * 0.85, 0);
    const ray = new THREE.Raycaster();
    const plates: THREE.BufferGeometry[] = [];
    for (let i = 0; i < STREAKS; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = 0.8 + rand() * 1.4; // the eye band: not the crown, not the ground
      let dir = new THREE.Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
      let walk = new THREE.Vector3(rand() - 0.5, (rand() - 0.5) * 0.6, rand() - 0.5).cross(dir).normalize();
      const steps = 6 + Math.floor(rand() * 7);
      const width = 0.045 + rand() * 0.035;
      for (let s = 0; s < steps; s++) {
        // From outside, inward: the raycaster culls back faces, so casting from the centre finds nothing.
        ray.set(rockCenter.clone().addScaledVector(dir, 3), dir.clone().negate());
        const hit = ray.intersectObject(this.rock, false)[0];
        if (!hit || !hit.face) break;
        const n = hit.face.normal.clone();
        const x = walk.clone().projectOnPlane(n).normalize();
        const y = new THREE.Vector3().crossVectors(n, x);
        const plate = new THREE.BoxGeometry(VEIN_STEP * 1.2, width * (0.7 + 0.6 * Math.sin((s / steps) * Math.PI)), 0.02);
        plate.applyMatrix4(new THREE.Matrix4().makeBasis(x, y, n).setPosition(hit.point.clone().addScaledVector(n, 0.004)));
        plates.push(plate);
        dir = hit.point.clone().sub(rockCenter).addScaledVector(x, VEIN_STEP).normalize();
        walk = x.clone().addScaledVector(y, (rand() - 0.5) * 0.7).normalize();
      }
    }
    // Origin at the rock's centre so the veins shrink into the same point as the rock.
    const veins = new THREE.Mesh(mergeGeometries(plates).translate(0, -rockCenter.y, 0), this.streakMaterial);
    veins.position.copy(rockCenter);
    veins.userData.interactable = this;
    this.streaks.push(veins);
    this.group.add(veins);
    this.group.position.copy(position);
    this.lockTargets = [this.rock, ...this.streaks];
  }

  get center(): THREE.Vector3 {
    return this.group.position.clone().add(new THREE.Vector3(0, BOULDER_RADIUS * 0.85, 0));
  }

  /** The face toward the viewer is the one to frame. */
  get normal(): THREE.Vector3 {
    return this.facing.clone();
  }

  lockPose(viewer: Viewer): CameraPose {
    const toViewer = new THREE.Vector3(viewer.position.x - this.group.position.x, 0, viewer.position.z - this.group.position.z);
    if (toViewer.lengthSq() < 1e-4) toViewer.set(0, 0, 1);
    toViewer.normalize();
    this.facing.copy(toViewer);
    const target = this.center;
    const position = target.clone().addScaledVector(toViewer, ORE_VIEW_DISTANCE);
    position.y += ORE_VIEW_HEIGHT;
    return { position, target };
  }

  distanceTo(p: THREE.Vector3): number {
    return Math.hypot(p.x - this.group.position.x, p.z - this.group.position.z);
  }

  collider(): CircleCollider | null {
    if (this.phase !== 'solid' && this.phase !== 'vaporizing') return null;
    return { x: this.group.position.x, z: this.group.position.z, radius: BOULDER_RADIUS, cameraClearance: BOULDER_RADIUS * 1.14 + 0.2 };
  }

  targetFor(run: Run): number | null {
    if (this.status !== 'growing') return null;
    return single.target(run, { targetCount: 1, boardCols: this.board.cols, colorOfTarget: () => -1 });
  }

  targetWorldPosition(): THREE.Vector3 {
    return this.center.addScaledVector(this.facing, BOULDER_RADIUS * 0.9);
  }

  feed(_target: number, amount: number, nowMs: number): void {
    if (this.status !== 'growing') return;
    this.pool = Math.min(ORE_HP, this.pool + amount);
    this.applyHeat(this.pool / ORE_HP);
    if (this.pool >= ORE_HP) {
      this.status = 'resolving';
      this.phase = 'vaporizing';
      this.phaseStart = nowMs;
    }
  }

  private applyHeat(k: number): void {
    this.streakMaterial.emissive.copy(coldStreak).lerp(hotStreak, k);
    this.streakMaterial.emissiveIntensity = GLOW_COLD + (GLOW_HOT - GLOW_COLD) * k * k;
    const rm = this.rock.material as THREE.MeshStandardMaterial;
    rm.emissive.setHex(0xff5a10);
    rm.emissiveIntensity = 0.25 * k * k; // the rock itself only warms; the veins carry the heat
  }

  poolText(): string {
    if (this.phase !== 'solid') return this.phase;
    return `ore ${this.pool}/${ORE_HP}`;
  }

  update(nowMs: number): void {
    // Cold ore breathes a little.
    if (this.phase === 'solid') {
      const k = this.pool / ORE_HP;
      this.streakMaterial.emissiveIntensity = GLOW_COLD + (GLOW_HOT - GLOW_COLD) * k * k + 0.12 * Math.sin(nowMs / 700 + this.index);
      return;
    }
    const t = nowMs - this.phaseStart;
    if (this.phase === 'vaporizing') {
      // White-hot, then gone: the rock shrinks into the glow.
      const k = Math.min(1, t / VAPORIZE_MS);
      const rm = this.rock.material as THREE.MeshStandardMaterial;
      rm.emissive.setHex(0xfff0d0);
      rm.emissiveIntensity = 0.8 + 1.6 * k;
      this.rock.scale.setScalar(1 - 0.85 * k * k);
      this.streaks.forEach((s) => s.scale.setScalar(1 - 0.85 * k * k));
      this.streakMaterial.emissiveIntensity = GLOW_HOT * (1 + k);
      if (k >= 1) {
        this.rock.visible = false;
        for (const s of this.streaks) s.visible = false;
        // The molten pool where it stood.
        this.poolMaterial = new THREE.MeshStandardMaterial({ color: moltenColor.clone(), emissive: moltenColor.clone(), emissiveIntensity: 2.6, roughness: 0.4, metalness: 0.5 });
        this.pool3d = new THREE.Mesh(new THREE.CircleGeometry(0.62, 18), this.poolMaterial);
        this.pool3d.rotation.x = -Math.PI / 2;
        this.pool3d.position.y = 0.02;
        this.group.add(this.pool3d);
        this.phase = 'molten';
        this.phaseStart = nowMs;
      }
      return;
    }
    if (this.phase === 'molten' && this.poolMaterial) {
      // Cooling: orange to dark, the glow going out of it, until it sets.
      const k = Math.min(1, t / COOL_MS);
      this.poolMaterial.color.copy(moltenColor).lerp(coolColor, k);
      this.poolMaterial.emissive.copy(moltenColor).lerp(coolColor, k);
      this.poolMaterial.emissiveIntensity = 2.6 * (1 - k) * (1 - k);
      this.poolMaterial.roughness = 0.4 + 0.5 * k;
      if (k >= 1) {
        this.phase = 'set';
        this.phaseStart = nowMs;
        this.onIngot(this.group.position.clone());
        this.status = 'resolved';
        this.onDone(this);
      }
      return;
    }
    if (this.phase === 'set' && this.pool3d && this.poolMaterial) {
      const k = Math.min(1, t / POOL_FADE_MS);
      this.pool3d.scale.setScalar(1 - k);
      if (k >= 1) {
        this.group.remove(this.pool3d);
        this.pool3d = null;
        this.phase = 'gone';
      }
    }
  }
}
