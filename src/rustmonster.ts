// The lab: a rust monster. Insect, not any one insect — a cockroach's low
// plated body, a cave cricket's hind legs, a mantis's scraping arms,
// grasping feet — built of metallic particles, and above all the two long
// feathery feelers that move like a whip in slow motion. It works the ore on
// the walls: it climbs to it (silverfish-like, the body flexing into the
// corner as it goes from floor to wall), circles it, lays the feelers over
// the silver until it rusts, scrapes the rust off onto the feelers like
// pollen, and grooms each feeler through its mouthparts. It skitters in
// bursts and freezes, on the floor and on the wall, and it notices him.

import * as THREE from 'three';
import { mulberry32 } from './colors';
import type { OreVein } from './orevein';
import type { CircleCollider } from './player';

// ---- Tuning constants ---------------------------------------------------------
/** Body length (head to tail); the body's centre off the floor; and off a wall (it hugs it). */
export const BODY_LENGTH = 1.5;
export const BODY_HEIGHT = 0.46;
export const WALL_HUG = 0.36;
export const FEELER_SEGMENTS = 22;
export const FEELER_LENGTH = 2.6;
/** Skitter: speed on the floor and on the wall, and the burst/freeze rhythm (seconds). */
export const SKITTER_SPEED = 3.4;
export const WALL_SPEED = 2.2;
export const BURST_S: [number, number] = [0.35, 0.9];
export const FREEZE_S: [number, number] = [0.25, 1.4];
/** Floor to wall and back: seconds, and where it starts up the wall. */
export const MOUNT_S = 1.1;
export const MOUNT_V = 0.55;
/** The circle it walks around a vein before feeding, and how far below the vein it stops. */
export const CIRCLE_RADIUS = 1.05;
export const FEED_BELOW = 0.95;
/** Seconds to rust a vein with the feelers, to scrape it clean, to groom one feeler. */
export const TICKLE_S = 7;
export const SCRAPE_S = 4;
export const GROOM_S = 3.2;
/** Feelers unfurl from their rest over the body in UNFURL_S, and furl back in FURL_S. */
export const UNFURL_S = 1.1;
export const FURL_S = 2.4;
/** The rest pose: the base raised, and a curl per segment that sweeps the chain back over the body. */
export const REST_PITCH = 0.8;
export const REST_CURL = 0.115; // 22 segments × 0.115 + the base ≈ 190°: up, over the back, tips near the tail
/** He is noticed within this; it freezes and reaches toward him for REGARD_S. */
export const REGARD_DISTANCE = 4.5;
export const REGARD_S = 1.8;
export const COLLIDER_RADIUS = 0.8;
// -------------------------------------------------------------------------------

/** The core under the particles: near-black, so the gaps between plates read as gaps. */
const chitin = new THREE.MeshStandardMaterial({ color: 0x1b1d21, metalness: 0.8, roughness: 0.6, flatShading: true });
const chitinEdge = new THREE.MeshStandardMaterial({ color: 0x2a2e34, metalness: 0.85, roughness: 0.5, flatShading: true });
const claw = new THREE.MeshStandardMaterial({ color: 0xa3a9b1, metalness: 1, roughness: 0.25, flatShading: true });
/** The skin: thousands of small metal plates lying on the body like scales, each glinting on its own. */
const flake = new THREE.MeshStandardMaterial({ color: 0xb4bcc5, metalness: 0.55, roughness: 0.42, flatShading: true });
const eye = new THREE.MeshStandardMaterial({ color: 0x120404, emissive: 0x7a1608, emissiveIntensity: 0.9, roughness: 0.2, metalness: 0.3 });
const BARB = new THREE.Color(0xd6dce3);
const BARB_RUST = new THREE.Color(0x8a4016);
const DUST = new THREE.Color(0x8a4a1c);
const UP = new THREE.Vector3(0, 1, 0);

/** A limb segment: a tapered cylinder from its origin along −Z. */
function bone(r1: number, r2: number, len: number, mat: THREE.Material): THREE.Mesh {
  const g = new THREE.CylinderGeometry(r2, r1, len, 6);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, -len / 2);
  return new THREE.Mesh(g, mat);
}

/** Small metal plates lying tangent on an ellipsoid's surface — the "made of particles" skin. */
interface Skin {
  mesh: THREE.InstancedMesh;
  normals: THREE.Vector3[];
  positions: THREE.Vector3[];
  spins: number[];
  rates: number[];
  scales: number[];
}
function plates(rx: number, ry: number, rz: number, count: number, size: number, rand: () => number): Skin {
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(size, size * 0.8, size * 0.12), flake, count);
  const normals: THREE.Vector3[] = [], positions: THREE.Vector3[] = [], spins: number[] = [], rates: number[] = [], scales: number[] = [];
  for (let i = 0; i < count; i++) {
    const u = rand() * Math.PI * 2, v = Math.acos(2 * rand() - 1);
    const n = new THREE.Vector3(Math.sin(v) * Math.cos(u), Math.cos(v), Math.sin(v) * Math.sin(u));
    positions.push(new THREE.Vector3(n.x * rx, n.y * ry, n.z * rz));
    normals.push(new THREE.Vector3(n.x / rx, n.y / ry, n.z / rz).normalize());
    spins.push(rand() * Math.PI * 2);
    rates.push((rand() - 0.5) * 0.6);
    scales.push(0.55 + rand() * 0.9);
  }
  const skin = { mesh, normals, positions, spins, rates, scales };
  layPlates(skin, 0);
  return skin;
}
const _o = new THREE.Object3D();
const _q = new THREE.Quaternion();
const _z = new THREE.Vector3(0, 0, 1);
/** Each plate sits on the surface, turned a little on its own — and the turn drifts, so the skin never quite holds still. */
function layPlates(skin: Skin, t: number): void {
  for (let i = 0; i < skin.positions.length; i++) {
    _o.position.copy(skin.positions[i]);
    _q.setFromUnitVectors(_z, skin.normals[i]);
    _o.quaternion.copy(_q);
    _o.rotateZ(skin.spins[i] + t * skin.rates[i]);
    _o.scale.setScalar(skin.scales[i]);
    _o.updateMatrix();
    skin.mesh.setMatrixAt(i, _o.matrix);
  }
  skin.mesh.instanceMatrix.needsUpdate = true;
}

interface Leg {
  hip: THREE.Group;
  knee: THREE.Group;
  side: 1 | -1;
  yaw: number;
  pitch: number;
  bend: number;
  phase: number;
  kind: 'arm' | 'mid' | 'hind';
}

interface Feeler {
  base: THREE.Group;
  segs: THREE.Group[];
  barbMats: THREE.LineBasicMaterial[];
  rust: number[];
  side: 1 | -1;
  /** 0 = at rest, curled back up over the body; 1 = unfurled to work or to reach. */
  furl: number;
}

/** A wall it can climb: a point on its face at the floor, its inward normal, and the along-wall direction. */
interface WallFrame {
  origin: THREE.Vector3;
  normal: THREE.Vector3;
  tangent: THREE.Vector3;
}

type Mode = 'skitter' | 'freeze' | 'mount' | 'wallmove' | 'wallfreeze' | 'tickle' | 'scrape' | 'groom' | 'dismount' | 'regard';

export class RustMonster {
  readonly group = new THREE.Group();
  readonly collider: CircleCollider;
  mode: Mode = 'freeze';
  vein: OreVein | null = null;
  /** 'floor' or 'wall'; `blend` 0..1 is how far onto the wall it is (the mount and dismount run it). */
  surface: 'floor' | 'wall' = 'floor';
  private blend = 0;
  private wall: WallFrame | null = null;
  /** On the wall: along-wall and up-wall coordinates, and the in-plane heading (0 = straight up). */
  private u = 0;
  private v = 0;
  private phi = 0;
  private wallPath: { u: number; v: number }[] = [];
  private readonly rand: () => number;
  private readonly body = new THREE.Group();
  private readonly pivots: THREE.Group[] = [];
  private readonly abdomen: THREE.Mesh[] = [];
  private readonly skins: Skin[] = [];
  private readonly head = new THREE.Group();
  private readonly mandibles: THREE.Mesh[] = [];
  private readonly legs: Leg[] = [];
  private readonly feelers: Feeler[] = [];
  private readonly dust: THREE.Points;
  private readonly dustVel: THREE.Vector3[] = [];
  private dustLife = 0;
  private heading = 0;
  private speed = 0;
  private stride = 0;
  private modeUntil = 0;
  private modeStart = 0;
  private target = new THREE.Vector3();
  private lastMs = 0;
  private groomSide = 0;
  private regardCooldownUntil = 0;
  private aimAt: THREE.Vector3 | null = null;
  private twitchUntil = 0;
  private twitch = new THREE.Vector3();
  private readonly floorQuat = new THREE.Quaternion();
  private readonly wallQuat = new THREE.Quaternion();
  private readonly floorPos = new THREE.Vector3();
  private readonly wallPos = new THREE.Vector3();

  constructor(readonly floorY: number, at: THREE.Vector3, private readonly veins: OreVein[], private readonly isWalkable: (p: THREE.Vector3) => boolean, seed: number) {
    this.rand = mulberry32(seed ^ 0xb00b);
    this.group.position.set(at.x, floorY + BODY_HEIGHT, at.z);
    this.collider = { x: at.x, z: at.z, radius: COLLIDER_RADIUS, cameraClearance: COLLIDER_RADIUS + 0.4 };
    this.group.add(this.body);
    this.build();
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(40 * 3), 3));
    this.dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: DUST, size: 0.035, transparent: true, opacity: 0 }));
    this.dust.frustumCulled = false;
    this.group.add(this.dust);
    for (let i = 0; i < 40; i++) this.dustVel.push(new THREE.Vector3());
  }

  // ---- the build --------------------------------------------------------------
  private build(): void {
    const r = this.rand;
    // Abdomen: a chain of pivots (so it can flex), each carrying an overlapping plate with its skin.
    const n = 6;
    let parent: THREE.Object3D = this.body;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const pivot = new THREE.Group();
      pivot.position.set(0, i === 0 ? -0.02 : -0.01, i === 0 ? 0.12 : 0.17);
      parent.add(pivot);
      parent = pivot;
      this.pivots.push(pivot);
      const rx = 0.36 - t * 0.16, ry = 0.2 - t * 0.09, rz = 0.22;
      const seg = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 7), i % 2 ? chitin : chitinEdge);
      seg.scale.set(rx, ry, rz);
      const sk = plates(1, 1, 1, 220, 0.16, r);
      seg.add(sk.mesh);
      this.skins.push(sk);
      pivot.add(seg);
      this.abdomen.push(seg);
    }
    // Thorax: the pronotum hood over the front, wider than the abdomen.
    const thorax = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), chitin);
    thorax.scale.set(0.42, 0.24, 0.42);
    thorax.position.set(0, 0.02, -0.22);
    const tk = plates(1, 1, 1, 380, 0.13, r);
    thorax.add(tk.mesh);
    this.skins.push(tk);
    this.body.add(thorax);
    const hood = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), chitinEdge);
    hood.scale.set(0.46, 0.2, 0.44);
    hood.position.set(0, 0.06, -0.24);
    this.body.add(hood);
    // Head: tucked under the hood, low, eyes and mouthparts forward.
    this.head.position.set(0, -0.08, -0.62);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.15, 9, 7), chitin);
    skull.scale.set(1.1, 0.85, 1);
    const hk = plates(0.15, 0.13, 0.15, 90, 0.035, r);
    skull.add(hk.mesh);
    this.skins.push(hk);
    this.head.add(skull);
    for (const s of [1, -1]) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.034, 7, 6), eye);
      e.scale.set(1, 0.8, 1.2);
      e.position.set(s * 0.12, 0.04, -0.08);
      this.head.add(e);
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.16, 4), claw);
      m.geometry.rotateX(-Math.PI / 2);
      m.geometry.translate(0, 0, -0.08);
      m.position.set(s * 0.06, -0.07, -0.12);
      m.rotation.y = -s * 0.5;
      this.head.add(m);
      this.mandibles.push(m);
      const palp = bone(0.012, 0.008, 0.14, chitinEdge);
      palp.position.set(s * 0.09, -0.09, -0.1);
      palp.rotation.set(0.4, -s * 0.9, 0);
      this.head.add(palp);
    }
    this.body.add(this.head);
    // Feelers: from the brow, a chain of thin segments with fine barbs.
    for (const side of [1, -1] as const) {
      const base = new THREE.Group();
      base.rotation.order = 'YXZ';
      base.position.set(side * 0.08, 0.1, -0.1);
      this.head.add(base);
      const segs: THREE.Group[] = [];
      const barbMats: THREE.LineBasicMaterial[] = [];
      let par: THREE.Object3D = base;
      const len = FEELER_LENGTH / FEELER_SEGMENTS;
      for (let i = 0; i < FEELER_SEGMENTS; i++) {
        const t = i / FEELER_SEGMENTS;
        const seg = new THREE.Group();
        seg.add(bone(0.009 * (1 - t) + 0.0025, 0.008 * (1 - t) + 0.002, len, chitinEdge));
        const pts: number[] = [];
        const bl = 0.05 + 0.08 * Math.sin(t * Math.PI) + 0.04 * t;
        for (let k = 0; k < 12; k++) {
          const z = -(k + 0.5) * (len / 12);
          const a = k * 2.4 + i * 0.7;
          const l1 = bl * (0.7 + (0.6 * ((k * 7 + i * 3) % 5)) / 5);
          pts.push(0, 0, z, Math.cos(a) * l1, Math.sin(a) * l1, z - l1 * 0.7);
          pts.push(0, 0, z, -Math.cos(a) * l1 * 0.85, -Math.sin(a) * l1 * 0.85, z - l1 * 0.6);
        }
        const bg = new THREE.BufferGeometry();
        bg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const bm = new THREE.LineBasicMaterial({ color: BARB.clone() });
        seg.add(new THREE.LineSegments(bg, bm));
        barbMats.push(bm);
        par.add(seg);
        segs.push(seg);
        const next = new THREE.Group();
        next.position.z = -len;
        seg.add(next);
        par = next;
      }
      this.feelers.push({ base, segs, barbMats, rust: new Array(FEELER_SEGMENTS).fill(0), side, furl: 0 });
    }
    // Legs: two scraping arms at the front, mid legs, and the big leaping hind legs.
    const mk = (kind: Leg['kind'], side: 1 | -1, z: number, femur: [number, number, number], tibia: [number, number, number], yaw: number, pitch: number, bend: number, phase: number): void => {
      const hip = new THREE.Group();
      hip.rotation.order = 'YXZ';
      hip.position.set(side * 0.3, -0.02, z);
      this.body.add(hip);
      hip.add(bone(femur[0], femur[1], femur[2], chitin));
      const knee = new THREE.Group();
      knee.position.z = -femur[2];
      hip.add(knee);
      knee.add(bone(tibia[0], tibia[1], tibia[2], chitinEdge));
      const foot = new THREE.Group();
      foot.position.z = -tibia[2];
      knee.add(foot);
      const teeth = kind === 'arm' ? 5 : 3;
      for (let k = 0; k < teeth; k++) {
        const c = new THREE.Mesh(new THREE.ConeGeometry(0.014, kind === 'arm' ? 0.09 : 0.11, 4), claw);
        c.geometry.rotateX(-Math.PI / 2);
        c.geometry.translate(0, 0, -0.04);
        if (kind === 'arm') {
          c.position.set(0, -0.02, 0.08 + k * 0.07);
          c.rotation.x = -1.3;
        } else {
          c.rotation.set(-0.4, (k - 1) * 0.8, 0);
        }
        foot.add(c);
      }
      this.legs.push({ hip, knee, side, yaw, pitch, bend, phase, kind });
    };
    // Yaw: local −Z turned about Y by a points to (−sin a, 0, −cos a), so the right side (+x) needs a < 0.
    for (const s of [1, -1] as const) {
      mk('arm', s, -0.5, [0.05, 0.035, 0.42], [0.03, 0.02, 0.4], -s * 0.4, 0.9, -2.5, 0);
      mk('mid', s, -0.15, [0.045, 0.03, 0.48], [0.028, 0.016, 0.55], -s * 1.5, 0.75, -1.9, s > 0 ? 0 : Math.PI);
      mk('hind', s, 0.3, [0.07, 0.04, 0.72], [0.035, 0.02, 0.82], -s * 2.05, 1.15, -2.45, s > 0 ? Math.PI : 0);
    }
    this.poseLegs(0);
  }

  // ---- frames: where the body is, on the floor and on the wall ---------------------
  private wallFrameFor(vein: OreVein): WallFrame {
    const origin = new THREE.Vector3(vein.anchor.x, this.floorY, vein.anchor.z);
    const normal = vein.normal.clone();
    const tangent = new THREE.Vector3().crossVectors(normal, UP).normalize();
    return { origin, normal, tangent };
  }
  private veinUV(vein: OreVein, w: WallFrame): { u: number; v: number } {
    const d = vein.anchor.clone().sub(w.origin);
    return { u: d.dot(w.tangent), v: vein.anchor.y - this.floorY };
  }
  private static basis(out: THREE.Quaternion, up: THREE.Vector3, forward: THREE.Vector3): THREE.Quaternion {
    const z = forward.clone().negate();
    const x = new THREE.Vector3().crossVectors(up, z).normalize();
    const y = new THREE.Vector3().crossVectors(z, x).normalize();
    return out.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
  }
  private floorPose(): void {
    const p = this.group.position;
    this.floorPos.set(p.x, this.floorY + BODY_HEIGHT, p.z);
    RustMonster.basis(this.floorQuat, UP, new THREE.Vector3(-Math.sin(this.heading), 0, -Math.cos(this.heading)));
  }
  private wallPose(): void {
    const w = this.wall!;
    this.wallPos.copy(w.origin).addScaledVector(w.tangent, this.u).addScaledVector(UP, this.v).addScaledVector(w.normal, WALL_HUG);
    const f = UP.clone().multiplyScalar(Math.cos(this.phi)).addScaledVector(w.tangent, Math.sin(this.phi)).normalize();
    RustMonster.basis(this.wallQuat, w.normal, f);
  }

  // ---- per frame ----------------------------------------------------------------
  update(nowMs: number, player: THREE.Vector3): void {
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    const t = nowMs / 1000;
    const p = this.group.position;
    const dPlayer = Math.hypot(player.x - p.x, player.z - p.z);
    if (dPlayer < REGARD_DISTANCE && nowMs > this.regardCooldownUntil && (this.mode === 'skitter' || this.mode === 'freeze' || this.mode === 'wallfreeze')) {
      this.enter('regard', nowMs, REGARD_S);
      this.regardCooldownUntil = nowMs + 9000;
    }
    if (nowMs >= this.modeUntil) this.next(nowMs);

    this.speed = 0;
    switch (this.mode) {
      case 'skitter': {
        const dx = this.target.x - p.x, dz = this.target.z - p.z;
        const d = Math.hypot(dx, dz);
        this.heading = turnToward(this.heading, Math.atan2(-dx, -dz), 9 * dt);
        this.speed = SKITTER_SPEED;
        const step = Math.min(d, this.speed * dt);
        const nx = p.x - Math.sin(this.heading) * step, nz = p.z - Math.cos(this.heading) * step;
        if (this.isWalkable(new THREE.Vector3(nx, this.floorY, nz))) {
          p.x = nx;
          p.z = nz;
        }
        this.stride += step;
        if (d < 0.08) this.enter('freeze', nowMs, 0.25);
        break;
      }
      case 'mount':
      case 'dismount': {
        const k = Math.min(1, (nowMs - this.modeStart) / (MOUNT_S * 1000));
        this.blend = this.mode === 'mount' ? k : 1 - k;
        this.speed = WALL_SPEED * 0.6;
        this.stride += this.speed * dt;
        break;
      }
      case 'wallmove': {
        const wp = this.wallPath[0];
        if (!wp) break;
        const du = wp.u - this.u, dv = wp.v - this.v;
        const d = Math.hypot(du, dv);
        this.phi = turnToward(this.phi, Math.atan2(du, dv), 8 * dt);
        this.speed = WALL_SPEED;
        const step = Math.min(d, this.speed * dt);
        this.u += Math.sin(this.phi) * step;
        this.v += Math.cos(this.phi) * step;
        this.stride += step;
        if (d < 0.06) {
          this.wallPath.shift();
          if (this.wallPath.length === 0) {
            if (this.wallPathDone) {
              // The way down is walked: off the wall.
              const f = this.wallPathDone;
              this.wallPathDone = null;
              f();
            } else if (this.vein) {
              // In position under the vein, facing up at it.
              this.phi = turnToward(this.phi, 0, 10);
              this.enter(this.vein.rust > 0.6 ? 'scrape' : 'tickle', nowMs, this.vein.rust > 0.6 ? SCRAPE_S : TICKLE_S);
            } else this.enter('wallfreeze', nowMs, 0.3);
          } else if (this.rand() < 0.5) this.enter('wallfreeze', nowMs, 0.2 + this.rand() * 0.6);
        }
        break;
      }
      default:
        break;
    }
    // Where the body is: the floor pose, the wall pose, or the flex between them.
    if (this.wall) this.wallPose();
    this.floorPose();
    if (this.blend <= 0 || !this.wall) {
      this.group.quaternion.copy(this.floorQuat);
      p.y = this.floorPos.y;
    } else if (this.blend >= 1) {
      this.group.position.copy(this.wallPos);
      this.group.quaternion.copy(this.wallQuat);
    } else {
      const k = this.blend;
      this.group.position.lerpVectors(this.floorPos, this.wallPos, k);
      this.group.quaternion.slerpQuaternions(this.floorQuat, this.wallQuat, k);
    }
    this.collider.x = p.x;
    this.collider.z = p.z;

    // Body: a low fast breath, a wag when moving; the flex into the corner while mounting.
    const breathe = 1 + 0.02 * Math.sin(t * 7.5);
    const flex = Math.sin(this.blend * Math.PI) * 0.62; // total bend, spread over the joints
    this.abdomen.forEach((seg, i) => {
      seg.scale.y = (0.2 - (i / 5) * 0.09) * breathe;
      this.pivots[i].rotation.y = this.speed > 0 ? Math.sin(this.stride * 6 - i * 0.6) * 0.06 : Math.sin(t * 2.1 + i) * 0.015;
      this.pivots[i].rotation.x = i === 0 ? 0 : (flex / 5) * (this.mode === 'dismount' ? 1 : 1);
    });
    this.body.position.y = this.speed > 0 && this.blend <= 0 ? Math.abs(Math.sin(this.stride * 9)) * 0.02 : Math.sin(t * 7.5) * 0.004;
    for (const sk of this.skins) layPlates(sk, t);
    eye.emissiveIntensity = 0.7 + 0.5 * Math.max(0, Math.sin(t * 1.7) * Math.sin(t * 0.43));
    if (this.speed === 0 && nowMs > this.twitchUntil && this.rand() < dt * 0.35) {
      this.twitchUntil = nowMs + 140;
      this.twitch.set((this.rand() - 0.5) * 0.12, 0, (this.rand() - 0.5) * 0.08);
    }
    const tw = nowMs < this.twitchUntil ? Math.sin(((this.twitchUntil - nowMs) / 140) * Math.PI) : 0;
    this.body.rotation.z = tw * this.twitch.x;
    this.body.rotation.x = tw * this.twitch.z;
    this.poseLegs(t);
    this.poseHead(t, player);
    this.poseFeelers(t, dt);
    this.work(nowMs, dt);
    this.updateDust(dt);
  }

  private enter(mode: Mode, nowMs: number, seconds: number): void {
    this.mode = mode;
    this.modeStart = nowMs;
    this.modeUntil = nowMs + seconds * 1000;
    if (mode !== 'regard') this.aimAt = null;
  }

  /** The loop: skitter to the wall under a vein; mount; circle it on the wall; tickle; scrape; groom; down; again. */
  private next(nowMs: number): void {
    const r = this.rand;
    const range = (a: [number, number]) => a[0] + r() * (a[1] - a[0]);
    if (this.mode === 'regard' && this.surface === 'wall') {
      this.enter('wallfreeze', nowMs, 0.3);
      return;
    }
    switch (this.mode) {
      case 'regard':
      case 'freeze': {
        if (!this.vein) {
          const candidates = this.veins.filter((v) => v.rust < 0.5);
          this.vein = candidates.length ? candidates[Math.floor(r() * candidates.length)] : this.veins[Math.floor(r() * this.veins.length)];
          this.wall = this.wallFrameFor(this.vein);
        }
        const w = this.wall!;
        const uv = this.veinUV(this.vein!, w);
        // The wall base under the vein (a little to one side, so it comes up beside it).
        const base = w.origin.clone().addScaledVector(w.tangent, uv.u + (r() - 0.5) * 1.2).addScaledVector(w.normal, WALL_HUG + 0.5);
        const dist = Math.hypot(base.x - this.group.position.x, base.z - this.group.position.z);
        if (dist < 0.3) {
          // At the wall: face it and go up.
          this.heading = Math.atan2(w.normal.x, w.normal.z);
          this.u = uv.u + (r() - 0.5) * 1.2;
          this.v = MOUNT_V;
          this.phi = 0;
          this.surface = 'wall';
          this.enter('mount', nowMs, MOUNT_S);
          return;
        }
        this.target.copy(base);
        if (r() < 0.25) {
          const a = r() * Math.PI * 2;
          const feint = new THREE.Vector3(this.group.position.x + Math.cos(a) * 1.2, this.floorY, this.group.position.z + Math.sin(a) * 1.2);
          if (this.isWalkable(feint)) this.target.copy(feint);
        }
        this.enter('skitter', nowMs, range(BURST_S));
        return;
      }
      case 'skitter':
        this.enter('freeze', nowMs, range(FREEZE_S));
        return;
      case 'mount': {
        // Up on the wall: a loop around the vein, then the feeding spot below it.
        this.blend = 1;
        const uv = this.veinUV(this.vein!, this.wall!);
        const dir = r() < 0.5 ? 1 : -1;
        const start = Math.atan2(this.u - uv.u, this.v - uv.v);
        this.wallPath = [];
        for (let k = 1; k <= 5; k++) {
          const a = start + dir * (k / 5) * Math.PI * 1.6;
          this.wallPath.push({ u: uv.u + Math.sin(a) * CIRCLE_RADIUS, v: Math.max(0.35, uv.v + Math.cos(a) * CIRCLE_RADIUS) });
        }
        this.wallPath.push({ u: uv.u, v: Math.max(0.35, uv.v - FEED_BELOW) });
        this.enter('wallmove', nowMs, 30);
        return;
      }
      case 'wallfreeze':
        this.enter('wallmove', nowMs, 30);
        return;
      case 'wallmove':
        this.enter('wallfreeze', nowMs, 0.3);
        return;
      case 'tickle':
        this.enter('scrape', nowMs, SCRAPE_S);
        return;
      case 'scrape':
        this.groomSide = 0;
        this.enter('groom', nowMs, GROOM_S);
        return;
      case 'groom':
        if (this.groomSide === 0) {
          this.groomSide = 1;
          this.enter('groom', nowMs, GROOM_S);
          return;
        }
        // Done here: back down the wall to just above the floor, then off it.
        this.wallPath = [{ u: this.u + (r() - 0.5) * 0.8, v: MOUNT_V }];
        this.vein = null;
        this.wallPathDone = () => this.enter('dismount', this.lastMs, MOUNT_S);
        this.enter('wallmove', nowMs, 30);
        return;
      case 'dismount':
        this.blend = 0;
        this.surface = 'floor';
        this.wall = null;
        this.enter('freeze', nowMs, range(FREEZE_S));
        return;
    }
  }
  private wallPathDone: (() => void) | null = null;

  /** What the feelers and arms do to the vein, and the rust that moves between them. */
  private work(nowMs: number, dt: number): void {
    const v = this.vein;
    const k = (nowMs - this.modeStart) / Math.max(1, this.modeUntil - this.modeStart);
    if (this.mode === 'tickle' && v) {
      v.setRust(v.rust + dt / TICKLE_S);
    } else if (this.mode === 'scrape' && v) {
      v.setRust(v.rust - dt / SCRAPE_S);
      for (const f of this.feelers) for (let i = 0; i < FEELER_SEGMENTS; i++) f.rust[i] = Math.min(1, f.rust[i] + (dt / SCRAPE_S) * (0.4 + 0.9 * (i / FEELER_SEGMENTS)));
    } else if (this.mode === 'groom') {
      const f = this.feelers[this.groomSide];
      const front = Math.floor(k * FEELER_SEGMENTS * 1.05);
      for (let i = 0; i < front && i < FEELER_SEGMENTS; i++) {
        if (f.rust[i] > 0.02) this.puff();
        f.rust[i] = Math.max(0, f.rust[i] - dt * 4);
      }
    }
    for (const f of this.feelers) f.barbMats.forEach((m, i) => m.color.copy(BARB).lerp(BARB_RUST, f.rust[i]));
  }

  private poseHead(t: number, player: THREE.Vector3): void {
    const g = this.mode === 'groom';
    const open = g ? 0.5 + 0.35 * Math.sin(t * 14) : 0.25 + 0.15 * Math.sin(t * 2.3);
    this.mandibles.forEach((m, i) => (m.rotation.y = (i === 0 ? -1 : 1) * (0.2 + open)));
    if (this.mode === 'regard') this.aimAt = new THREE.Vector3(player.x, this.floorY + 0.5, player.z);
    if (this.aimAt) {
      const local = this.group.worldToLocal(this.aimAt.clone());
      const yaw = Math.atan2(-(local.x - this.head.position.x), -(local.z - this.head.position.z));
      const pitch = Math.atan2(local.y - this.head.position.y, Math.hypot(local.x - this.head.position.x, local.z - this.head.position.z));
      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, THREE.MathUtils.clamp(yaw, -1.1, 1.1), 0.08);
      this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, THREE.MathUtils.clamp(pitch, -0.6, 0.8), 0.08);
    } else {
      this.head.rotation.y = THREE.MathUtils.lerp(this.head.rotation.y, Math.sin(t * 0.9) * 0.15, 0.05);
      this.head.rotation.x = THREE.MathUtils.lerp(this.head.rotation.x, g ? 0.45 : 0, 0.05);
    }
  }

  /**
   * The feelers: a slow whip — a travelling wave along the chain — aimed by what it is doing. On the
   * wall the wave runs in the wall's plane and the lifts are only away from the rock, so nothing goes
   * through it.
   */
  private poseFeelers(t: number, dt: number): void {
    const onWall = this.blend > 0.5;
    for (const f of this.feelers) {
      const s = f.side;
      // At rest they lie curled back over the body; they unfurl to work the ore, to reach for him, or to be groomed.
      const mine = this.feelers[this.groomSide] === f;
      const wantOut = this.mode === 'tickle' || this.mode === 'scrape' || this.mode === 'regard' || (this.mode === 'groom' && mine);
      f.furl = wantOut ? Math.min(1, f.furl + dt / UNFURL_S) : Math.max(0, f.furl - dt / FURL_S);
      const k = f.furl * f.furl * (3 - 2 * f.furl);
      let basePitch = -0.25, baseYaw = s * 0.55, amp = 0.16, omega = 1.1, curl = 0.02, wave = 0.55;
      let lift = 0; // wall modes: how much the tips lift off the rock and lay back
      switch (this.mode) {
        case 'skitter':
          basePitch = -0.15; baseYaw = s * 0.4; amp = 0.22; omega = 2.6; wave = 0.7;
          break;
        case 'wallmove':
        case 'wallfreeze':
        case 'mount':
        case 'dismount':
          basePitch = -0.08; baseYaw = s * 0.45; amp = 0.2; omega = 2.2; wave = 0.6; lift = 0.1;
          break;
        case 'tickle':
          // Laid up over the vein, sweeping across it slowly, the tips lifting and laying.
          basePitch = -0.05; baseYaw = s * 0.2 + Math.sin(t * 0.9 + s) * 0.3; amp = 0.3; omega = 1.35; wave = 0.5; lift = 0.14;
          break;
        case 'scrape':
          basePitch = 0.0; baseYaw = s * 0.15; amp = 0.4; omega = 6.5; wave = 0.35; lift = 0.2;
          break;
        case 'groom': {
          if (mine) {
            basePitch = onWall ? 0.55 : -1.35; baseYaw = s * 0.15; amp = 0.05; omega = 3; curl = onWall ? -0.12 : 0.16; wave = 0.2;
          } else {
            basePitch = onWall ? -0.05 : -0.35; baseYaw = s * 0.7; amp = 0.1; omega = 0.8;
          }
          break;
        }
        case 'regard':
          basePitch = onWall ? 0.25 : 0.05; baseYaw = s * 0.12; amp = 0.08; omega = 4.5; wave = 0.9; curl = -0.01;
          break;
        default:
          break;
      }
      // The rest pose breathes: a slow sway in the curl and a drift of the base.
      const restPitch = REST_PITCH + Math.sin(t * 0.7 + s) * 0.06;
      const restYaw = s * (0.32 + Math.sin(t * 0.5 + s * 2) * 0.05);
      f.base.rotation.set(THREE.MathUtils.lerp(restPitch, basePitch, k), THREE.MathUtils.lerp(restYaw, baseYaw, k), 0);
      for (let i = 0; i < FEELER_SEGMENTS; i++) {
        const u = i / FEELER_SEGMENTS;
        const seg = f.segs[i];
        const w = Math.sqrt(u + 0.05);
        const quiver = u > 0.6 ? (u - 0.6) * 0.09 * Math.sin(t * 23 + i * 1.7 + s) : 0;
        let ax: number, ay: number;
        if (onWall) {
          // in-plane sweep, and only-upward lifts
          ay = amp * w * Math.sin(omega * t - wave * i + s * 0.3) + quiver;
          ax = lift * w * (0.5 + 0.5 * Math.sin(omega * 0.8 * t - wave * i)) + curl + quiver * 0.3;
        } else {
          ax = curl + amp * w * Math.sin(omega * t - wave * i + s * 0.3) + quiver;
          ay = amp * 0.6 * w * Math.sin(omega * 0.73 * t - wave * 1.3 * i + s) + quiver * 0.7;
        }
        const rx = REST_CURL + Math.sin(t * 0.7 + i * 0.25 + s) * 0.012 + quiver * 0.25;
        const ry = s * 0.006 + quiver * 0.2;
        seg.rotation.x = THREE.MathUtils.lerp(rx, ax, k);
        seg.rotation.y = THREE.MathUtils.lerp(ry, ay, k);
      }
    }
  }

  /** Legs: a tripod gait when moving (floor or wall), a settle when still, and the arms' scraping strokes. */
  private poseLegs(t: number): void {
    for (const l of this.legs) {
      let yaw = l.yaw, pitch = l.pitch, bend = l.bend;
      if (l.kind === 'arm') {
        if (this.mode === 'scrape') {
          const s = Math.sin(t * 6.5 + (l.side > 0 ? 0 : Math.PI));
          pitch = 0.9 + s * 0.5;
          bend = -1.6 + s * 0.6;
          yaw = l.side * 0.15;
        } else if (this.mode === 'tickle') {
          pitch = 0.75 + Math.sin(t * 1.3 + l.side) * 0.1;
          bend = -2.3;
        } else if (this.mode === 'regard') {
          pitch = 1.1 + Math.sin(t * 5) * 0.03;
          bend = -2.7;
        } else if (this.speed > 0) {
          const ph = this.stride * 9 + (l.side > 0 ? 0 : Math.PI);
          yaw = l.yaw + Math.sin(ph) * 0.35;
          pitch = 0.85 + Math.max(0, Math.cos(ph)) * 0.2;
        }
      } else if (this.speed > 0) {
        const ph = this.stride * (l.kind === 'hind' ? 6 : 9) + l.phase;
        const liftK = Math.max(0, Math.sin(ph));
        yaw = l.yaw + Math.cos(ph) * (l.kind === 'hind' ? 0.25 : 0.4) * l.side;
        pitch = l.pitch + liftK * 0.35;
        bend = l.bend + liftK * 0.5;
      } else {
        pitch = l.pitch + (l.kind === 'hind' ? Math.sin(t * 11 + l.side) * 0.012 : 0);
      }
      // On the wall the legs splay a little flatter, gripping.
      if (this.blend > 0.5 && l.kind !== 'arm') pitch -= 0.15;
      l.hip.rotation.set(pitch, yaw, 0);
      l.knee.rotation.x = bend;
    }
  }

  private puff(): void {
    if (this.dustLife > 0) return;
    const pos = this.dust.geometry.attributes.position as THREE.BufferAttribute;
    const mouth = this.head.position.clone().add(new THREE.Vector3(0, -0.12, -0.18));
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(i, mouth.x + (this.rand() - 0.5) * 0.08, mouth.y, mouth.z + (this.rand() - 0.5) * 0.08);
      this.dustVel[i].set((this.rand() - 0.5) * 0.3, -0.1 - this.rand() * 0.3, (this.rand() - 0.5) * 0.3);
    }
    pos.needsUpdate = true;
    this.dustLife = 1.1;
  }

  private updateDust(dt: number): void {
    const m = this.dust.material as THREE.PointsMaterial;
    if (this.dustLife <= 0) {
      m.opacity = 0;
      return;
    }
    this.dustLife -= dt;
    m.opacity = Math.min(1, this.dustLife);
    const pos = this.dust.geometry.attributes.position as THREE.BufferAttribute;
    // Dust falls in the world's down, whichever way the body is turned.
    const down = this.group.worldToLocal(this.group.position.clone().add(new THREE.Vector3(0, -1, 0))).normalize();
    for (let i = 0; i < pos.count; i++) {
      const v = this.dustVel[i];
      v.addScaledVector(down, 1.6 * dt);
      pos.setXYZ(i, pos.getX(i) + v.x * dt, pos.getY(i) + v.y * dt, pos.getZ(i) + v.z * dt);
    }
    pos.needsUpdate = true;
  }
}

function turnToward(a: number, b: number, max: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + Math.max(-max, Math.min(max, d));
}
