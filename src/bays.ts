// The lab's second viewing bay: a row of cubbies, each with its own rust
// monster puppeted through one behaviour on a loop, so a movement can be
// judged without waiting for the live creature to get round to it.
//   treadmill — walking on the spot, side on, the floor scrolling under it
//   wheel     — walking a square: floor, up the right wall, across the
//               ceiling, down the left wall, round again
//   feeding   — on the left wall under a vein: tickle, scrape, groom, again
//   corner    — up the right wall's corner head-first, turn, down head-first,
//               walk off, turn, back
//   regard & turn — facing him, feelers reaching, then furled; and pivots
//               left and right with the body curving into them

import * as THREE from 'three';
import { RustMonster, BODY_HEIGHT, WALL_HUG, CORNER_RADIUS, SKITTER_SPEED, WALL_SPEED, TURN_RATE, TICKLE_S, SCRAPE_S, GROOM_S, type WallFrame } from './rustmonster';
import { OreVein } from './orevein';
import { BAY_W, BAY_H, BAY_D, BAY_FLOOR, BAY_Z_BACK } from './arena';

export interface Bay {
  monster: RustMonster;
  update(nowMs: number, player: THREE.Vector3): void;
}

const UP = new THREE.Vector3(0, 1, 0);
const ZC = BAY_Z_BACK + BAY_D / 2; // the cubby's mid-depth
/** Facing +x (across the cubby, side on to him): forward = (−sin h, −cos h). */
const FACE_RIGHT = -Math.PI / 2;
const FACE_LEFT = Math.PI / 2;
const FACE_HIM = Math.PI;

/** Time inside one mode, for the puppets that step through modes on a clock. */
function due(m: RustMonster, nowMs: number): boolean {
  return nowMs >= m.modeUntil;
}
function turnToward(a: number, b: number, max: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + Math.max(-max, Math.min(max, d));
}

// ---- treadmill --------------------------------------------------------------------
export class TreadmillBay implements Bay {
  readonly monster: RustMonster;
  private readonly belt: THREE.Mesh;
  private lastMs = 0;
  constructor(scene: THREE.Scene, bx: number, seed: number) {
    this.monster = new RustMonster(BAY_FLOOR, new THREE.Vector3(bx, BAY_FLOOR, ZC), [], () => true, seed);
    this.monster.puppet = true;
    this.monster.heading = FACE_RIGHT;
    this.monster.mode = 'skitter';
    scene.add(this.monster.group);
    // The belt: a striped strip that scrolls under it at its walking speed.
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 32;
    const g = c.getContext('2d')!;
    g.fillStyle = '#2a2d33';
    g.fillRect(0, 0, 256, 32);
    g.fillStyle = '#4a4f58';
    for (let x = 0; x < 256; x += 32) g.fillRect(x, 0, 12, 32);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1);
    this.belt = new THREE.Mesh(new THREE.PlaneGeometry(BAY_W - 0.4, 1.4), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
    this.belt.rotation.x = -Math.PI / 2;
    this.belt.position.set(bx, BAY_FLOOR + 0.01, ZC);
    scene.add(this.belt);
  }
  update(nowMs: number, player: THREE.Vector3): void {
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    const m = this.monster;
    m.speed = SKITTER_SPEED;
    m.stride += SKITTER_SPEED * dt;
    m.floorPose();
    m.group.quaternion.copy(m['floorQuat']);
    m.group.position.y = BAY_FLOOR + BODY_HEIGHT;
    (this.belt.material as THREE.MeshStandardMaterial).map!.offset.x -= (SKITTER_SPEED * dt) / ((BAY_W - 0.4) / 3);
    m.update(nowMs, player);
  }
}

// ---- wheel ----------------------------------------------------------------------------
/** A closed path in the cubby's x–y plane: a rounded rectangle the body's track follows, corners of the
 *  creature's own radius. Sampled by arc length: point, forward, and up (away from the surface). */
class SquareWheel {
  private readonly pieces: { len: number; at: (k: number) => { position: THREE.Vector3; forward: THREE.Vector3; up: THREE.Vector3 } }[] = [];
  readonly total: number;
  constructor(bx: number) {
    const r = CORNER_RADIUS;
    const x0 = bx - (BAY_W / 2 - WALL_HUG), x1 = bx + (BAY_W / 2 - WALL_HUG);
    const y0 = BAY_FLOOR + BODY_HEIGHT, y1 = BAY_FLOOR + BAY_H - WALL_HUG;
    const straight = (a: THREE.Vector3, b: THREE.Vector3, up: THREE.Vector3) => {
      const len = a.distanceTo(b);
      const f = b.clone().sub(a).normalize();
      this.pieces.push({ len, at: (k) => ({ position: a.clone().lerp(b, k), forward: f.clone(), up: up.clone() }) });
    };
    const arc = (c: THREE.Vector3, a0: number, a1: number) => {
      // counterclockwise seen from +z: the inside corner, the body's up pointing at the centre… no — away
      // from both surfaces, i.e. toward the room's middle, which for an inside corner is toward the arc's centre.
      const len = r * Math.abs(a1 - a0);
      this.pieces.push({
        len,
        at: (k) => {
          const a = a0 + (a1 - a0) * k;
          const position = new THREE.Vector3(c.x + r * Math.cos(a), c.y + r * Math.sin(a), ZC);
          const forward = new THREE.Vector3(-Math.sin(a), Math.cos(a), 0);
          const up = new THREE.Vector3(-Math.cos(a), -Math.sin(a), 0);
          return { position, forward, up };
        },
      });
    };
    const P = (x: number, y: number) => new THREE.Vector3(x, y, ZC);
    // floor → right wall → ceiling → left wall, counterclockwise from his side
    straight(P(x0 + r, y0), P(x1 - r, y0), UP);
    arc(P(x1 - r, y0 + r), -Math.PI / 2, 0);
    straight(P(x1, y0 + r), P(x1, y1 - r), new THREE.Vector3(-1, 0, 0));
    arc(P(x1 - r, y1 - r), 0, Math.PI / 2);
    straight(P(x1 - r, y1), P(x0 + r, y1), new THREE.Vector3(0, -1, 0));
    arc(P(x0 + r, y1 - r), Math.PI / 2, Math.PI);
    straight(P(x0, y1 - r), P(x0, y0 + r), new THREE.Vector3(1, 0, 0));
    arc(P(x0 + r, y0 + r), Math.PI, Math.PI * 1.5);
    this.total = this.pieces.reduce((a, p) => a + p.len, 0);
  }
  at(s: number): { position: THREE.Vector3; forward: THREE.Vector3; up: THREE.Vector3 } {
    let u = ((s % this.total) + this.total) % this.total;
    for (const p of this.pieces) {
      if (u <= p.len) return p.at(u / p.len);
      u -= p.len;
    }
    return this.pieces[0].at(0);
  }
}
export class WheelBay implements Bay {
  readonly monster: RustMonster;
  private readonly path: SquareWheel;
  private s = 0;
  private lastMs = 0;
  constructor(scene: THREE.Scene, bx: number, seed: number) {
    this.monster = new RustMonster(BAY_FLOOR, new THREE.Vector3(bx, BAY_FLOOR, ZC), [], () => true, seed);
    this.monster.puppet = true;
    this.monster.puppetBent = true;
    this.monster.surface = 'wall';
    this.monster.mode = 'wallmove';
    this.path = new SquareWheel(bx);
    scene.add(this.monster.group);
  }
  update(nowMs: number, player: THREE.Vector3): void {
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    const m = this.monster;
    this.s += WALL_SPEED * dt;
    m.speed = WALL_SPEED;
    m.stride += WALL_SPEED * dt;
    m.followPath(this.s, (s) => this.path.at(s));
    m.update(nowMs, player);
  }
}

// ---- feeding --------------------------------------------------------------------------
export class FeedBay implements Bay {
  readonly monster: RustMonster;
  readonly vein: OreVein;
  private step = 0;
  constructor(scene: THREE.Scene, bx: number, seed: number) {
    // The vein on the left wall; the creature on that wall below it, facing up, side on to him.
    const wallX = bx - BAY_W / 2;
    this.vein = new OreVein(new THREE.Vector3(wallX, BAY_FLOOR + 2.65, ZC), new THREE.Vector3(1, 0, 0), seed ^ 0x77);
    scene.add(this.vein.group);
    this.monster = new RustMonster(BAY_FLOOR, new THREE.Vector3(bx, BAY_FLOOR, ZC), [this.vein], () => true, seed);
    const m = this.monster;
    m.puppet = true;
    m.vein = this.vein;
    m.wall = m.wallFrameFor(this.vein);
    m.surface = 'wall';
    m.u = 0;
    m.v = 2.65 - 0.95;
    m.phi = 0;
    m.wallPose();
    m.group.position.copy(m['wallPos']);
    m.group.quaternion.copy(m['wallQuat']);
    scene.add(m.group);
  }
  update(nowMs: number, player: THREE.Vector3): void {
    const m = this.monster;
    if (due(m, nowMs)) {
      const steps: [string, number][] = [['tickle', TICKLE_S], ['scrape', SCRAPE_S], ['groom', GROOM_S], ['groom', GROOM_S], ['wallfreeze', 1.6]];
      const [mode, secs] = steps[this.step % steps.length];
      if (mode === 'groom') m.groomSide = this.step % steps.length === 2 ? 0 : 1;
      m.enter(mode as RustMonster['mode'], nowMs, secs);
      this.step++;
    }
    m.wallPose();
    m.group.position.copy(m['wallPos']);
    m.group.quaternion.copy(m['wallQuat']);
    m.update(nowMs, player);
  }
}

// ---- corner ---------------------------------------------------------------------------
export class CornerBay implements Bay {
  readonly monster: RustMonster;
  private phase: 'in' | 'mount' | 'pause' | 'turn' | 'dismount' | 'out' | 'about' = 'in';
  private phaseStart = 0;
  private lastMs = 0;
  private readonly wall: WallFrame;
  private readonly startX: number;
  private readonly awayX: number;
  constructor(scene: THREE.Scene, bx: number, seed: number) {
    // The right wall: its inward normal is −x; along it is −z.
    const wallX = bx + BAY_W / 2;
    this.wall = { origin: new THREE.Vector3(wallX, BAY_FLOOR, ZC), normal: new THREE.Vector3(-1, 0, 0), tangent: new THREE.Vector3(0, 0, -1) };
    this.monster = new RustMonster(BAY_FLOOR, new THREE.Vector3(bx, BAY_FLOOR, ZC), [], () => true, seed);
    const m = this.monster;
    m.puppet = true;
    m.wall = this.wall;
    m.u = 0;
    this.startX = wallX - m.track(m.sigmaFloor).d;
    this.awayX = bx - 0.6;
    m.group.position.set(this.awayX, BAY_FLOOR + BODY_HEIGHT, ZC);
    m.heading = FACE_RIGHT;
    scene.add(m.group);
  }
  update(nowMs: number, player: THREE.Vector3): void {
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    const m = this.monster;
    const p = m.group.position;
    const since = (nowMs - this.phaseStart) / 1000;
    const go = (ph: typeof this.phase) => {
      this.phase = ph;
      this.phaseStart = nowMs;
    };
    m.speed = 0;
    switch (this.phase) {
      case 'in': {
        // Walk to the track's start, then onto it.
        m.surface = 'floor';
        m.mode = 'skitter';
        m.heading = turnToward(m.heading, FACE_RIGHT, TURN_RATE * dt);
        m.speed = SKITTER_SPEED * 0.6;
        p.x = Math.min(this.startX, p.x + m.speed * dt);
        m.stride += m.speed * dt;
        m.floorPose();
        m.group.quaternion.copy(m['floorQuat']);
        p.y = BAY_FLOOR + BODY_HEIGHT;
        if (p.x >= this.startX - 1e-3) {
          m.surface = 'corner';
          m.mode = 'mount';
          m['sigma'] = m.sigmaFloor;
          go('mount');
        }
        break;
      }
      case 'mount': {
        m.speed = 1.5;
        m.stride += m.speed * dt;
        m['sigma'] = Math.min(m.sigmaWall, m['sigma'] + 1.5 * dt);
        m.cornerPose(m['sigma'], 1);
        if (m['sigma'] >= m.sigmaWall) {
          m.surface = 'wall';
          m.mode = 'wallfreeze';
          m.v = m.track(m.sigmaWall).h;
          m.phi = 0;
          go('pause');
        }
        break;
      }
      case 'pause':
      case 'turn': {
        // A breath at the top, then about-face on the wall to come down head-first.
        if (this.phase === 'pause' && since > 0.7) go('turn');
        if (this.phase === 'turn') {
          m.mode = 'wallmove';
          m.phi = turnToward(m.phi, Math.PI, 2.2 * dt);
          m.speed = 0.8;
          m.stride += m.speed * dt;
        }
        m.wallPose();
        m.group.position.copy(m['wallPos']);
        m.group.quaternion.copy(m['wallQuat']);
        if (this.phase === 'turn' && Math.abs(m.phi - Math.PI) < 0.02) {
          m.phi = Math.PI;
          m.surface = 'corner';
          m.mode = 'dismount';
          m['sigma'] = m.sigmaWall;
          go('dismount');
        }
        break;
      }
      case 'dismount': {
        m.speed = 1.5;
        m.stride += m.speed * dt;
        m['sigma'] = Math.max(m.sigmaFloor, m['sigma'] - 1.5 * dt);
        m.cornerPose(m['sigma'], -1);
        if (m['sigma'] <= m.sigmaFloor) {
          m.surface = 'floor';
          m.mode = 'skitter';
          m.heading = FACE_LEFT;
          p.set(this.startX, BAY_FLOOR + BODY_HEIGHT, ZC);
          go('out');
        }
        break;
      }
      case 'out': {
        // Off along the floor, then about-face, and in again.
        m.speed = SKITTER_SPEED * 0.6;
        p.x = Math.max(this.awayX, p.x - m.speed * dt);
        m.stride += m.speed * dt;
        m.floorPose();
        m.group.quaternion.copy(m['floorQuat']);
        if (p.x <= this.awayX + 1e-3) go('about');
        break;
      }
      case 'about': {
        m.mode = 'skitter';
        m.heading = turnToward(m.heading, FACE_RIGHT, TURN_RATE * 0.6 * dt);
        m.speed = 1.0; // the legs step through the pivot
        m.stride += m.speed * dt;
        m.floorPose();
        m.group.quaternion.copy(m['floorQuat']);
        if (Math.abs(m.heading - FACE_RIGHT) < 0.02) {
          m.heading = FACE_RIGHT;
          go('in');
        }
        break;
      }
    }
    m.update(nowMs, player);
  }
}

// ---- regard & turn ---------------------------------------------------------------------
export class RegardTurnBay implements Bay {
  readonly monster: RustMonster;
  private step = 0;
  private target = FACE_HIM;
  private lastMs = 0;
  constructor(scene: THREE.Scene, bx: number, seed: number) {
    this.monster = new RustMonster(BAY_FLOOR, new THREE.Vector3(bx, BAY_FLOOR, ZC), [], () => true, seed);
    const m = this.monster;
    m.puppet = true;
    m.heading = FACE_HIM;
    m.mode = 'freeze';
    scene.add(m.group);
  }
  update(nowMs: number, player: THREE.Vector3): void {
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    const m = this.monster;
    if (due(m, nowMs)) {
      // regard him → furl → pivot left → pivot back → pivot right → pivot back → again
      const steps: [RustMonster['mode'], number, number][] = [
        ['regard', 3.2, FACE_HIM],
        ['freeze', 2.6, FACE_HIM],
        ['skitter', 2.2, FACE_HIM + 1.6],
        ['skitter', 2.2, FACE_HIM],
        ['skitter', 2.2, FACE_HIM - 1.6],
        ['skitter', 2.2, FACE_HIM],
      ];
      const [mode, secs, target] = steps[this.step % steps.length];
      m.enter(mode, nowMs, secs);
      this.target = target;
      this.step++;
    }
    if (m.mode === 'skitter') {
      m.heading = turnToward(m.heading, this.target, TURN_RATE * 0.5 * dt);
      const turning = Math.abs(m.heading - this.target) > 0.02;
      m.speed = turning ? 1.0 : 0;
      m.stride += m.speed * dt;
    } else m.speed = 0;
    m.floorPose();
    m.group.quaternion.copy(m['floorQuat']);
    m.group.position.y = BAY_FLOOR + BODY_HEIGHT;
    m.update(nowMs, player);
  }
}
