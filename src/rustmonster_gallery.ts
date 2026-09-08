// Deterministic rust-monster animation gallery for the lab branch.
// Each bay uses the real RustMonster mesh/animation code, but removes the AI wait:
// one motion is forced on a loop so the designer can judge it continuously.

import * as THREE from 'three';
import { OreVein } from './orevein';
import {
  BODY_HEIGHT,
  RustMonster,
  TICKLE_S,
  SCRAPE_S,
  GROOM_S,
} from './rustmonster';

const BAY_W = 3.05;
const BAY_D = 2.55;
const BAY_H = 2.8;
const CENTRES = [-6.25, -3.12, 0, 3.12, 6.25];
const FAR_PLAYER = new THREE.Vector3(0, 0, 1000);
const ALWAYS = () => true;

interface MonsterHack {
  mode: string;
  surface: string;
  modeStart: number;
  modeUntil: number;
  target: THREE.Vector3;
  heading: number;
  speed: number;
  groomSide: number;
  feelers: { rust: number[] }[];
}

interface Demo {
  update(nowMs: number, player: THREE.Vector3): void;
}

const rockMat = new THREE.MeshStandardMaterial({ color: 0x24282d, roughness: 0.92, metalness: 0.08, flatShading: true });
const edgeMat = new THREE.MeshStandardMaterial({ color: 0x555d65, roughness: 0.55, metalness: 0.55, flatShading: true });
const floorMat = new THREE.MeshStandardMaterial({ color: 0x171a1d, roughness: 0.8, metalness: 0.3, flatShading: true });
const trackMat = new THREE.MeshStandardMaterial({ color: 0x6c747b, roughness: 0.48, metalness: 0.75, flatShading: true });

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}

function label(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(7,9,11,0.88)';
  ctx.fillRect(0, 5, canvas.width, 86);
  ctx.strokeStyle = '#89939d';
  ctx.lineWidth = 4;
  ctx.strokeRect(3, 8, canvas.width - 6, 80);
  ctx.fillStyle = '#e1e6eb';
  ctx.font = '600 34px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, 49);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true }));
  s.scale.set(2.45, 0.46, 1);
  return s;
}

function makeBay(root: THREE.Group, x: number, title: string): THREE.Group {
  const bay = new THREE.Group();
  bay.position.x = x;
  root.add(bay);

  bay.add(box(BAY_W, 0.12, BAY_D, floorMat, 0, 0, 0));
  bay.add(box(BAY_W, BAY_H, 0.13, rockMat, 0, BAY_H / 2, -BAY_D / 2));
  bay.add(box(0.13, BAY_H, BAY_D, rockMat, -BAY_W / 2, BAY_H / 2, 0));
  bay.add(box(0.13, BAY_H, BAY_D, rockMat, BAY_W / 2, BAY_H / 2, 0));
  // A low front sill reads as an enclosure without hiding the creature.
  bay.add(box(BAY_W, 0.22, 0.13, edgeMat, 0, 0.11, BAY_D / 2));
  const sign = label(title);
  sign.position.set(0, BAY_H + 0.35, -BAY_D / 2 + 0.08);
  bay.add(sign);

  const lamp = new THREE.PointLight(0xb9c9da, 10, 5.5, 1.4);
  lamp.position.set(0, BAY_H - 0.25, 0.55);
  bay.add(lamp);
  return bay;
}

function hack(monster: RustMonster): MonsterHack {
  return monster as unknown as MonsterHack;
}

/** Keep the real locomotion animation running while its world translation is pinned in the bay. */
function treadmill(monster: RustMonster, nowMs: number, player = FAR_PLAYER): void {
  const h = hack(monster);
  h.mode = 'skitter';
  h.surface = 'floor';
  h.modeStart = nowMs;
  h.modeUntil = nowMs + 60_000;
  h.target.set(0, 0, -100);
  monster.update(nowMs, player);
  monster.group.position.set(0, BODY_HEIGHT, 0);
}

function setBasis(q: THREE.Quaternion, forward: THREE.Vector3, up: THREE.Vector3): void {
  const f = forward.clone().normalize();
  const u = up.clone().normalize();
  const right = f.clone().cross(u).normalize();
  const back = f.clone().multiplyScalar(-1);
  const m = new THREE.Matrix4().makeBasis(right, u, back);
  q.setFromRotationMatrix(m);
}

function squareTrack(t: number): { p: THREE.Vector3; forward: THREE.Vector3; up: THREE.Vector3 } {
  // A square wheel in the plane facing the viewing platform. Straight sections are deliberately long;
  // the quarter-turns are short and rounded so floor/wall/ceiling changes can be watched repeatedly.
  const half = 0.95;
  const top = 2.02;
  const bottom = BODY_HEIGHT;
  const straight = 2.35;
  const corner = 0.55;
  const total = 4 * (straight + corner);
  let s = (t % total + total) % total;
  const p = new THREE.Vector3();
  const f = new THREE.Vector3();
  const u = new THREE.Vector3();

  const cornerPose = (cx: number, cy: number, a0: number, a1: number, k: number): void => {
    const a = THREE.MathUtils.lerp(a0, a1, k);
    const r = 0.24;
    p.set(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0);
    // Tangent counter-clockwise around the front-facing square.
    f.set(-Math.sin(a), Math.cos(a), 0).normalize();
    // Surface normal points toward the square's interior.
    u.set(-Math.cos(a), -Math.sin(a), 0).normalize();
  };

  if (s < straight) {
    const k = s / straight;
    p.set(THREE.MathUtils.lerp(-half + 0.24, half - 0.24, k), bottom, 0);
    f.set(1, 0, 0); u.set(0, 1, 0);
    return { p, forward: f, up: u };
  }
  s -= straight;
  if (s < corner) {
    cornerPose(half - 0.24, bottom + 0.24, -Math.PI / 2, 0, s / corner);
    return { p, forward: f, up: u };
  }
  s -= corner;
  if (s < straight) {
    const k = s / straight;
    p.set(half, THREE.MathUtils.lerp(bottom + 0.24, top - 0.24, k), 0);
    f.set(0, 1, 0); u.set(-1, 0, 0);
    return { p, forward: f, up: u };
  }
  s -= straight;
  if (s < corner) {
    cornerPose(half - 0.24, top - 0.24, 0, Math.PI / 2, s / corner);
    return { p, forward: f, up: u };
  }
  s -= corner;
  if (s < straight) {
    const k = s / straight;
    p.set(THREE.MathUtils.lerp(half - 0.24, -half + 0.24, k), top, 0);
    f.set(-1, 0, 0); u.set(0, -1, 0);
    return { p, forward: f, up: u };
  }
  s -= straight;
  if (s < corner) {
    cornerPose(-half + 0.24, top - 0.24, Math.PI / 2, Math.PI, s / corner);
    return { p, forward: f, up: u };
  }
  s -= corner;
  if (s < straight) {
    const k = s / straight;
    p.set(-half, THREE.MathUtils.lerp(top - 0.24, bottom + 0.24, k), 0);
    f.set(0, -1, 0); u.set(1, 0, 0);
    return { p, forward: f, up: u };
  }
  s -= straight;
  cornerPose(-half + 0.24, bottom + 0.24, Math.PI, Math.PI * 1.5, s / corner);
  return { p, forward: f, up: u };
}

export class RustMonsterGallery implements Demo {
  readonly group = new THREE.Group();
  private readonly demos: Demo[] = [];

  constructor(scene: THREE.Scene, floorY: number, seed: number) {
    // The gallery sits just below the platform lip, immediately in front of the observer.
    this.group.position.set(0, floorY + 0.55, 3.0);
    scene.add(this.group);

    // 1. Pure gait: feet and body motion without translation.
    {
      const bay = makeBay(this.group, CENTRES[0], 'GAIT / TREADMILL');
      for (let i = -5; i <= 5; i++) bay.add(box(0.035, 0.018, 1.65, trackMat, i * 0.18, 0.075, 0));
      const m = new RustMonster(0, new THREE.Vector3(0, 0, 0), [], ALWAYS, seed ^ 0x101);
      bay.add(m.group);
      this.demos.push({
        update: (nowMs) => {
          treadmill(m, nowMs);
          m.group.quaternion.identity();
        },
      });
    }

    // 2. The requested stationary square wheel: floor -> wall -> ceiling -> wall -> floor.
    {
      const bay = makeBay(this.group, CENTRES[1], 'SURFACE LOOP');
      bay.add(box(2.25, 0.07, 0.08, trackMat, 0, 0.08, -0.05));
      bay.add(box(2.25, 0.07, 0.08, trackMat, 0, 2.1, -0.05));
      bay.add(box(0.07, 2.1, 0.08, trackMat, -1.05, 1.05, -0.05));
      bay.add(box(0.07, 2.1, 0.08, trackMat, 1.05, 1.05, -0.05));
      const rig = new THREE.Group();
      rig.position.z = 0.12;
      bay.add(rig);
      const m = new RustMonster(0, new THREE.Vector3(0, 0, 0), [], ALWAYS, seed ^ 0x202);
      rig.add(m.group);
      this.demos.push({
        update: (nowMs) => {
          treadmill(m, nowMs);
          m.group.quaternion.identity();
          const pose = squareTrack(nowMs / 1000);
          rig.position.set(pose.p.x, pose.p.y - BODY_HEIGHT, 0.12);
          setBasis(rig.quaternion, pose.forward, pose.up);
        },
      });
    }

    // 3. Feeding sequence: real tickle, scrape and grooming animation states, looped without travel time.
    {
      const bay = makeBay(this.group, CENTRES[2], 'FEED / SCRAPE / GROOM');
      const vein = new OreVein(new THREE.Vector3(0, 1.1, -1.16), new THREE.Vector3(0, 0, 1), seed ^ 0x303);
      bay.add(vein.group);
      const m = new RustMonster(0, new THREE.Vector3(0, 0, 0.38), [vein], ALWAYS, seed ^ 0x304);
      m.group.rotation.y = 0;
      m.vein = vein;
      bay.add(m.group);
      let lastCycle = -1;
      this.demos.push({
        update: (nowMs) => {
          const cycleLength = TICKLE_S + SCRAPE_S + GROOM_S * 2 + 1.0;
          const raw = nowMs / 1000;
          const cycle = Math.floor(raw / cycleLength);
          const t = raw - cycle * cycleLength;
          const h = hack(m);
          if (cycle !== lastCycle) {
            lastCycle = cycle;
            vein.setRust(0);
            for (const f of h.feelers) f.rust.fill(0);
          }
          let mode: 'tickle' | 'scrape' | 'groom' | 'freeze' = 'freeze';
          let local = 0;
          let duration = 1;
          if (t < TICKLE_S) {
            mode = 'tickle'; local = t; duration = TICKLE_S;
            vein.setRust(t / TICKLE_S);
          } else if (t < TICKLE_S + SCRAPE_S) {
            mode = 'scrape'; local = t - TICKLE_S; duration = SCRAPE_S;
            vein.setRust(1 - local / SCRAPE_S);
          } else if (t < TICKLE_S + SCRAPE_S + GROOM_S) {
            mode = 'groom'; local = t - TICKLE_S - SCRAPE_S; duration = GROOM_S; h.groomSide = 0;
          } else if (t < TICKLE_S + SCRAPE_S + GROOM_S * 2) {
            mode = 'groom'; local = t - TICKLE_S - SCRAPE_S - GROOM_S; duration = GROOM_S; h.groomSide = 1;
          }
          h.mode = mode;
          h.surface = 'floor';
          h.speed = 0;
          h.modeStart = nowMs - local * 1000;
          h.modeUntil = h.modeStart + duration * 1000;
          m.update(nowMs, FAR_PLAYER);
          m.group.position.set(0, BODY_HEIGHT, 0.38);
          m.group.quaternion.identity();
        },
      });
    }

    // 4. Turning/body flex: alternating targets force the real heading/yaw-rate code to bend the body.
    {
      const bay = makeBay(this.group, CENTRES[3], 'TURN / BODY CURVE');
      const m = new RustMonster(0, new THREE.Vector3(0, 0, 0), [], ALWAYS, seed ^ 0x404);
      bay.add(m.group);
      this.demos.push({
        update: (nowMs) => {
          const h = hack(m);
          const side = Math.floor(nowMs / 2400) % 2 === 0 ? -1 : 1;
          h.mode = 'skitter';
          h.surface = 'floor';
          h.modeStart = nowMs;
          h.modeUntil = nowMs + 60_000;
          h.target.set(side * 2.2, 0, -1.7);
          m.update(nowMs, FAR_PLAYER);
          m.group.position.set(0, BODY_HEIGHT, 0);
        },
      });
    }

    // 5. Regard: the actual player-targeting head/feeler state, held continuously for inspection.
    {
      const bay = makeBay(this.group, CENTRES[4], 'REGARD / REACH');
      const m = new RustMonster(0, new THREE.Vector3(0, 0, 0), [], ALWAYS, seed ^ 0x505);
      bay.add(m.group);
      this.demos.push({
        update: (nowMs, player) => {
          const h = hack(m);
          h.mode = 'regard';
          h.surface = 'floor';
          h.speed = 0;
          h.modeStart = nowMs;
          h.modeUntil = nowMs + 60_000;
          m.update(nowMs, player);
          m.group.position.set(0, BODY_HEIGHT, 0);
          m.group.quaternion.identity();
        },
      });
    }
  }

  update(nowMs: number, player: THREE.Vector3): void {
    for (const demo of this.demos) demo.update(nowMs, player);
  }
}
