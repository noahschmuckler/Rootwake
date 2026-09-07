// Underworld U3: the greblin miners. They cut the vein he woke in, left
// their snack on the tables, and fled up the stairs when he stirred. Now
// they cower in the corners of the upper chamber: dead still in the dark,
// and when his light touches one it bolts along the walls to a corner
// away from him. Nothing about them is a threat — that is what running
// says. No colliders: they keep out of his way themselves.

import * as THREE from 'three';
import { mulberry32 } from './colors';
import { ROOM_B_CX, ROOM_B_HALF, ROOM_B_FLOOR } from './cave';

// ---- Tuning constants ---------------------------------------------------------
export const GREBLIN_COUNT = 4;
/** Running speed (units/s) — faster than his hops, so they are never caught. */
export const RUN_SPEED = 2.8;
/** His light touches one within this fraction of his darksight reach, if it is also in front of him. */
export const LIT_FRACTION = 0.75;
/** …or he is simply this close, light or no light: they hear him. */
export const NEAR_DISTANCE = 1.6;
/** Cosine of the half-angle of "in front of him" (about 40°). */
export const IN_VIEW_COS = 0.77;
/** After arriving, how long one holds before it will react again (ms). */
export const SETTLE_MS = 700;
/** How far in from the walls the hiding spots lie. */
export const SPOT_INSET = 0.9;
// -------------------------------------------------------------------------------

const skin = new THREE.MeshStandardMaterial({ color: 0x6f8a4a, roughness: 0.95, flatShading: true });
const rag = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 1, flatShading: true });
const iron = new THREE.MeshStandardMaterial({ color: 0x55585c, metalness: 0.7, roughness: 0.5, flatShading: true });
const eye = new THREE.MeshStandardMaterial({ color: 0xfff0a0, emissive: 0xffe070, emissiveIntensity: 2.2, toneMapped: false });

function greblinMesh(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.22, 6), rag);
  body.position.y = 0.11;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 7, 6), skin);
  head.position.y = 0.27;
  const earL = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 4), skin);
  earL.rotation.z = Math.PI / 2 - 0.4;
  earL.position.set(0.09, 0.3, 0);
  const earR = earL.clone();
  earR.rotation.z = -(Math.PI / 2 - 0.4);
  earR.position.x = -0.09;
  // Eyes catch the light: the first thing he sees of them is two points in the dark.
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.016, 5, 4), eye);
  eyeL.position.set(0.028, 0.285, -0.072); // on the head's surface, not inside it
  const eyeR = eyeL.clone();
  eyeR.position.x = -0.028;
  // A miner's pick slung on the back.
  const haft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.26, 5), rag);
  haft.rotation.z = 0.5;
  haft.position.set(0.02, 0.16, 0.07);
  const pickHead = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 0.02), iron);
  pickHead.position.set(-0.04, 0.27, 0.07);
  pickHead.rotation.z = 0.5;
  g.add(body, head, earL, earR, eyeL, eyeR, haft, pickHead);
  return g;
}

interface Greblin {
  mesh: THREE.Group;
  spot: number;
  /** Where it is running, as a list of spots to pass through; empty = hiding. */
  route: number[];
  settleAt: number;
  phase: number;
}

export class Greblins {
  readonly group = new THREE.Group();
  readonly list: Greblin[] = [];
  /** The hiding spots, in order around the room's perimeter: corners and mid-walls. */
  readonly spots: THREE.Vector3[] = [];
  /** How many times one has bolted from his light. */
  flights = 0;
  private lastMs = 0;
  private readonly rand: () => number;

  constructor(scene: THREE.Scene, seed: number) {
    this.rand = mulberry32(seed ^ 0x9eb1);
    const h = ROOM_B_HALF - SPOT_INSET;
    for (const [dx, dz] of [
      [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0],
    ]) this.spots.push(new THREE.Vector3(ROOM_B_CX + dx * h, ROOM_B_FLOOR, dz * h));
    // Cowering at the top of the stairs: the two corners and the wall-middle by the −x doorway.
    const starts = [0, 6, 7, 0];
    for (let i = 0; i < GREBLIN_COUNT; i++) {
      const mesh = greblinMesh();
      const spot = starts[i % starts.length];
      const p = this.spots[spot];
      mesh.position.set(p.x + (this.rand() - 0.5) * 0.5, p.y, p.z + (this.rand() - 0.5) * 0.5);
      this.group.add(mesh);
      this.list.push({ mesh, spot, route: [], settleAt: 0, phase: this.rand() * 10 });
    }
    scene.add(this.group);
  }

  /** The shorter way round the perimeter from one spot to another, as the spots passed through. */
  private routeBetween(from: number, to: number): number[] {
    const n = this.spots.length;
    const cw = (to - from + n) % n;
    const ccw = (from - to + n) % n;
    const step = cw <= ccw ? 1 : -1;
    const count = Math.min(cw, ccw);
    const out: number[] = [];
    for (let k = 1; k <= count; k++) out.push((from + step * k + n) % n);
    return out;
  }

  /** Per frame. `sight` is his darksight reach; the light is at `eye` looking along `forward`. */
  update(nowMs: number, eye: THREE.Vector3, forward: THREE.Vector3, sight: number, player: THREE.Vector3): void {
    const dt = this.lastMs ? Math.min(0.1, (nowMs - this.lastMs) / 1000) : 0;
    this.lastMs = nowMs;
    const litRange = sight * LIT_FRACTION;
    const toG = new THREE.Vector3();
    for (const g of this.list) {
      const p = g.mesh.position;
      if (g.route.length === 0) {
        // Hiding: watch him, tremble, and bolt if his light or his feet reach here.
        g.mesh.lookAt(player.x, p.y, player.z);
        g.mesh.rotation.y += Math.PI; // the face is −Z; lookAt points +Z at him
        g.mesh.rotation.y += Math.sin(nowMs / 90 + g.phase) * 0.06;
        g.mesh.position.y = p.y; // no bob
        if (nowMs < g.settleAt) continue;
        toG.subVectors(p, eye);
        const dist = toG.length();
        const inFront = dist > 1e-3 && toG.divideScalar(dist).dot(forward) > IN_VIEW_COS;
        const near = Math.hypot(p.x - player.x, p.z - player.z) < NEAR_DISTANCE;
        if ((inFront && dist < litRange) || near) this.bolt(g, eye, forward, litRange, player);
        continue;
      }
      // Running: along the route, wall to wall, with a bob.
      const target = this.spots[g.route[0]];
      const dx = target.x - p.x, dz = target.z - p.z;
      const d = Math.hypot(dx, dz);
      const step = RUN_SPEED * dt;
      if (d <= step) {
        p.x = target.x;
        p.z = target.z;
        g.spot = g.route.shift()!;
        if (g.route.length === 0) {
          g.settleAt = nowMs + SETTLE_MS;
          g.mesh.position.y = ROOM_B_FLOOR;
        }
      } else {
        p.x += (dx / d) * step;
        p.z += (dz / d) * step;
        g.mesh.rotation.y = Math.atan2(-dx, -dz) + Math.PI; // face along the run (face is −Z)
        g.mesh.position.y = ROOM_B_FLOOR + Math.abs(Math.sin(nowMs / 70 + g.phase)) * 0.035;
      }
    }
  }

  /** Pick a spot away from him, out of his light, and run for it along the walls. */
  private bolt(g: Greblin, eye: THREE.Vector3, forward: THREE.Vector3, litRange: number, player: THREE.Vector3): void {
    const toS = new THREE.Vector3();
    let best = -1;
    let bestScore = -Infinity;
    this.spots.forEach((s, i) => {
      if (i === g.spot) return;
      const dPlayer = Math.hypot(s.x - player.x, s.z - player.z);
      toS.subVectors(s, eye);
      const dEye = toS.length();
      const lit = dEye < litRange && toS.divideScalar(dEye).dot(forward) > IN_VIEW_COS;
      const score = dPlayer - (lit ? 6 : 0) + this.rand() * 1.5;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    });
    if (best < 0) return;
    g.route = this.routeBetween(g.spot, best);
    this.flights++;
  }
}
