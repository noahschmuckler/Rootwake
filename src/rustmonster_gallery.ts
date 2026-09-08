// Deterministic rust-monster animation gallery for the lab branch.
// The gallery is deliberately behind the observation position, leaving the original pit unobstructed.

import * as THREE from 'three';
import { OreVein } from './orevein';
import { BODY_HEIGHT, RustMonster, TICKLE_S, SCRAPE_S, GROOM_S } from './rustmonster';
import { refineRustMonsterRig, refineRustMonsterTurnPose } from './rustmonster_refinements';

const BAY_W = 3.05;
const BAY_D = 3.55;
const BAY_H = 3.0;
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
  pivots: THREE.Group[];
  head: THREE.Group;
  body: THREE.Group;
}
interface Demo { update(nowMs: number, player: THREE.Vector3): void; }

const rockMat = new THREE.MeshStandardMaterial({ color: 0x24282d, roughness: 0.92, metalness: 0.08, flatShading: true });
const floorMat = new THREE.MeshStandardMaterial({ color: 0x171a1d, roughness: 0.8, metalness: 0.3, flatShading: true });
const trackMat = new THREE.MeshStandardMaterial({ color: 0x6c747b, roughness: 0.48, metalness: 0.75, flatShading: true });

function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
}
function label(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = 'rgba(7,9,11,0.88)'; ctx.fillRect(0, 5, 512, 86);
  ctx.strokeStyle = '#89939d'; ctx.lineWidth = 4; ctx.strokeRect(3, 8, 506, 80);
  ctx.fillStyle = '#e1e6eb'; ctx.font = '600 34px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 256, 49);
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true }));
  s.scale.set(2.45, 0.46, 1); return s;
}
function makeBay(root: THREE.Group, x: number, title: string): THREE.Group {
  const bay = new THREE.Group(); bay.position.x = x; root.add(bay);
  bay.add(box(BAY_W, 0.1, BAY_D, floorMat, 0, 0, 0));
  bay.add(box(BAY_W, BAY_H, 0.12, rockMat, 0, BAY_H / 2, BAY_D / 2));
  bay.add(box(0.12, BAY_H, BAY_D, rockMat, -BAY_W / 2, BAY_H / 2, 0));
  bay.add(box(0.12, BAY_H, BAY_D, rockMat, BAY_W / 2, BAY_H / 2, 0));
  // No front lip: the viewing edge is completely open.
  const sign = label(title); sign.position.set(0, BAY_H + 0.34, BAY_D / 2 - 0.08); bay.add(sign);
  const lamp = new THREE.PointLight(0xb9c9da, 11, 6, 1.35); lamp.position.set(0, BAY_H - 0.2, -0.45); bay.add(lamp);
  return bay;
}
function hack(m: RustMonster): MonsterHack { return m as unknown as MonsterHack; }
function makeMonster(seed: number): RustMonster {
  const m = new RustMonster(0, new THREE.Vector3(), [], ALWAYS, seed);
  refineRustMonsterRig(m); return m;
}
function treadmill(m: RustMonster, nowMs: number, player = FAR_PLAYER): void {
  const h = hack(m); h.mode = 'skitter'; h.surface = 'floor'; h.modeStart = nowMs; h.modeUntil = nowMs + 60000;
  h.target.set(0, 0, -100); m.update(nowMs, player); m.group.position.set(0, BODY_HEIGHT, 0); refineRustMonsterTurnPose(m);
}

/**
 * Square surface study. Translation/orientation follows the square, while local articulation leads the corner:
 * head pitches first, thorax/body follows, then the six abdomen pivots progressively catch up.
 */
function surfaceLoopPose(m: RustMonster, seconds: number): void {
  const h = hack(m);
  const side = 1.72;
  const bottom = BODY_HEIGHT;
  const top = 2.32;
  const straightT = 2.1;
  const turnT = 1.55; // intentionally slow so the head->thorax->abdomen transition is inspectable
  const legT = straightT + turnT;
  const total = legT * 4;
  let t = seconds % total;
  const leg = Math.floor(t / legT); t -= leg * legT;
  const turning = t > straightT;
  const k = turning ? THREE.MathUtils.smoothstep((t - straightT) / turnT, 0, 1) : t / straightT;

  let x = 0, y = bottom, angle = 0;
  if (leg === 0) { x = THREE.MathUtils.lerp(-side / 2, side / 2, Math.min(1, t / straightT)); y = bottom; angle = turning ? k * Math.PI / 2 : 0; }
  if (leg === 1) { x = side / 2; y = THREE.MathUtils.lerp(bottom, top, Math.min(1, t / straightT)); angle = Math.PI / 2 + (turning ? k * Math.PI / 2 : 0); }
  if (leg === 2) { x = THREE.MathUtils.lerp(side / 2, -side / 2, Math.min(1, t / straightT)); y = top; angle = Math.PI + (turning ? k * Math.PI / 2 : 0); }
  if (leg === 3) { x = -side / 2; y = THREE.MathUtils.lerp(top, bottom, Math.min(1, t / straightT)); angle = Math.PI * 1.5 + (turning ? k * Math.PI / 2 : 0); }

  m.group.position.set(x, y, 0);
  m.group.rotation.z = angle;

  // Progressive articulation. During each 90-degree transition the head anticipates the corner,
  // thorax follows, then abdomen segments follow one after another. The offsets settle back to zero
  // before the next straight run.
  if (turning) {
    const q = (t - straightT) / turnT;
    const bend = (phase: number): number => {
      const u = THREE.MathUtils.clamp((q - phase) / 0.34, 0, 1);
      return Math.sin(u * Math.PI) * 0.62;
    };
    h.head.rotation.x = -bend(0.0);
    h.body.rotation.x = -bend(0.12) * 0.45;
    const phases = [0.22, 0.30, 0.38, 0.46, 0.54, 0.62];
    for (let i = 0; i < h.pivots.length; i++) h.pivots[i].rotation.x = -bend(phases[i]);
  } else {
    h.head.rotation.x *= 0.7; h.body.rotation.x *= 0.7;
    for (const p of h.pivots) p.rotation.x *= 0.7;
  }
}

export class RustMonsterGallery implements Demo {
  readonly group = new THREE.Group();
  private readonly demos: Demo[] = [];

  constructor(scene: THREE.Scene, floorY: number, seed: number) {
    // Completely separate study area: behind the player's initial observation position.
    // The open faces point toward the pit; nothing now stands between player and original live bay.
    this.group.position.set(0, floorY + 2.23, 7.15);
    scene.add(this.group);

    {
      const bay = makeBay(this.group, CENTRES[0], 'GAIT / TREADMILL');
      for (let i = -5; i <= 5; i++) bay.add(box(0.035, 0.018, 2.45, trackMat, i * 0.18, 0.075, -0.25));
      const m = makeMonster(seed ^ 0x101); m.group.position.z = -0.35; bay.add(m.group);
      this.demos.push({ update: (nowMs) => { treadmill(m, nowMs); m.group.position.z = -0.35; m.group.quaternion.identity(); } });
    }

    {
      const bay = makeBay(this.group, CENTRES[1], 'SURFACE LOOP');
      bay.add(box(2.15, 0.055, 0.07, trackMat, 0, 0.08, 0.2));
      bay.add(box(2.15, 0.055, 0.07, trackMat, 0, 2.42, 0.2));
      bay.add(box(0.055, 2.4, 0.07, trackMat, -1.05, 1.2, 0.2));
      bay.add(box(0.055, 2.4, 0.07, trackMat, 1.05, 1.2, 0.2));
      const m = makeMonster(seed ^ 0x202); bay.add(m.group);
      this.demos.push({ update: (nowMs) => { treadmill(m, nowMs); m.group.quaternion.identity(); surfaceLoopPose(m, nowMs / 1000); } });
    }

    {
      const bay = makeBay(this.group, CENTRES[2], 'FEED / SCRAPE / GROOM');
      const vein = new OreVein(new THREE.Vector3(0, 1.2, 1.66), new THREE.Vector3(0, 0, -1), seed ^ 0x303); bay.add(vein.group);
      const m = makeMonster(seed ^ 0x304); m.vein = vein; m.group.position.z = -0.45; m.group.rotation.y = Math.PI; bay.add(m.group);
      let lastCycle = -1;
      this.demos.push({ update: (nowMs) => {
        const cycleLength = TICKLE_S + SCRAPE_S + GROOM_S * 2 + 1;
        const raw = nowMs / 1000, cycle = Math.floor(raw / cycleLength), t = raw - cycle * cycleLength; const h = hack(m);
        if (cycle !== lastCycle) { lastCycle = cycle; vein.setRust(0); for (const f of h.feelers) f.rust.fill(0); }
        let mode: 'tickle' | 'scrape' | 'groom' | 'freeze' = 'freeze', local = 0, duration = 1;
        if (t < TICKLE_S) { mode = 'tickle'; local = t; duration = TICKLE_S; vein.setRust(t / TICKLE_S); }
        else if (t < TICKLE_S + SCRAPE_S) { mode = 'scrape'; local = t - TICKLE_S; duration = SCRAPE_S; vein.setRust(1 - local / SCRAPE_S); }
        else if (t < TICKLE_S + SCRAPE_S + GROOM_S) { mode = 'groom'; local = t - TICKLE_S - SCRAPE_S; duration = GROOM_S; h.groomSide = 0; }
        else if (t < TICKLE_S + SCRAPE_S + GROOM_S * 2) { mode = 'groom'; local = t - TICKLE_S - SCRAPE_S - GROOM_S; duration = GROOM_S; h.groomSide = 1; }
        h.mode = mode; h.surface = 'floor'; h.speed = 0; h.modeStart = nowMs - local * 1000; h.modeUntil = h.modeStart + duration * 1000;
        m.update(nowMs, FAR_PLAYER); m.group.position.set(0, BODY_HEIGHT, -0.45); m.group.rotation.set(0, Math.PI, 0);
      } });
    }

    {
      const bay = makeBay(this.group, CENTRES[3], 'TURN / BODY WAVE');
      const m = makeMonster(seed ^ 0x404); bay.add(m.group);
      this.demos.push({ update: (nowMs) => {
        const h = hack(m); const phase = nowMs / 1500; const side = Math.sin(phase);
        h.mode = 'skitter'; h.surface = 'floor'; h.modeStart = nowMs; h.modeUntil = nowMs + 60000;
        h.target.set(side * 3.2, 0, -1.4); m.update(nowMs, FAR_PLAYER); refineRustMonsterTurnPose(m);
        m.group.position.set(0, BODY_HEIGHT, -0.3);
      } });
    }

    {
      const bay = makeBay(this.group, CENTRES[4], 'REGARD / REACH');
      const m = makeMonster(seed ^ 0x505); bay.add(m.group);
      this.demos.push({ update: (nowMs, player) => {
        const h = hack(m); h.mode = 'regard'; h.surface = 'floor'; h.speed = 0; h.modeStart = nowMs; h.modeUntil = nowMs + 60000;
        m.update(nowMs, player); m.group.position.set(0, BODY_HEIGHT, -0.3); m.group.quaternion.identity();
      } });
    }
  }

  update(nowMs: number, player: THREE.Vector3): void { for (const demo of this.demos) demo.update(nowMs, player); }
}
