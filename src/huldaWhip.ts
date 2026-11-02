// F5a (WHIP.md): her staff unwound into a whip. A living vine lash that hangs from her right fist while she flows and
// shoots out to a foe's chest when a figure lashes it: a tapered tube along a curve drawn each frame, not a rope
// simulation (the phone's budget: one small dynamic mesh). The curve runs from her hand to its tip; the tip hangs
// below her fist at rest and travels to the target as the plan's rope reaches out (`out`, 0..1). Along the way a
// loop runs down the lash toward the tip (the crack) and the slack sags; held taut on a foe it is nearly straight
// and trembles. It grows out of the fist as the staff withdraws into it, and back. Tuning constants at the top.
import * as THREE from 'three';

/** Points along the lash, sides round it, its radius at the hand and at the tip (m). Tuning. */
export const WHIP_POINTS = 26, WHIP_SIDES = 5, WHIP_R0 = 0.026, WHIP_R1 = 0.006;
/** How far it hangs at rest (m), seconds to grow out of the fist and to withdraw. Tuning. */
export const WHIP_HANG = 1.15, WHIP_GROW_S = 0.25, WHIP_WITHDRAW_S = 0.35;
/** The crack's loop: how big, how many waves along the lash, and how fast it travels while the lash flies out. Tuning. */
export const CRACK_AMP = 0.35, CRACK_WAVES = 1.4;

export interface Whip {
  readonly mesh: THREE.Mesh;
  /** Unwind it from her fist (true) or wind it back (false). */ show(on: boolean): void;
  readonly shown: boolean; readonly grown: number;
  /** Each frame after her figure is posed: her hand (world), the target's chest (world) or null, how far out the rope is (0..1), seconds. */
  update(hand: THREE.Vector3, target: THREE.Vector3 | null, out: number, dt: number): void;
  /** The tip's world position (for the crack's spark). */ tip(o: THREE.Vector3): THREE.Vector3;
  dispose(): void;
}

export function createWhip(scene: THREE.Scene, palette: { vine: string; leaf: string }): Whip {
  const n = WHIP_POINTS, m = WHIP_SIDES, pos = new Float32Array(n * m * 3), idx: number[] = [], col = new Float32Array(n * m * 3);
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < m; j++) { const a = i * m + j, b = i * m + (j + 1) % m, c = a + m, d = b + m; idx.push(a, c, b, b, c, d); }
  // Vine to leaf-green toward the tip, a lighter tip.
  const c0 = new THREE.Color(palette.vine), c1 = new THREE.Color(palette.leaf), c = new THREE.Color();
  for (let i = 0; i < n; i++) { c.copy(c0).lerp(c1, Math.pow(i / (n - 1), 1.5)); for (let j = 0; j < m; j++) col.set([c.r, c.g, c.b], (i * m + j) * 3); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx);
  const mat = new THREE.MeshToonMaterial({ vertexColors: true, emissive: new THREE.Color(palette.leaf), emissiveIntensity: 0.12 });
  const mesh = new THREE.Mesh(g, mat); mesh.frustumCulled = false; mesh.name = 'hulda-whip'; mesh.visible = false; scene.add(mesh);
  const pts = Array.from({ length: n }, () => new THREE.Vector3());
  let shown = false, grown = 0, phase = 0, lastOut = 0, crack = 0, time = 0;
  // The tip at rest swings a little behind her fist.
  const restTip = new THREE.Vector3(), lastHand = new THREE.Vector3(), handVel = new THREE.Vector3(), swing = new THREE.Vector3();
  const tipNow = new THREE.Vector3(), d = new THREE.Vector3(), side = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), t0 = new THREE.Vector3(), nrm = new THREE.Vector3(), bin = new THREE.Vector3();
  let first = true;
  function update(hand: THREE.Vector3, target: THREE.Vector3 | null, out: number, dt: number): void {
    time += dt; grown = THREE.MathUtils.clamp(grown + (shown ? dt / WHIP_GROW_S : -dt / WHIP_WITHDRAW_S), 0, 1); mesh.visible = grown > 0.01;
    if (!mesh.visible) { first = true; return; }
    if (first) { lastHand.copy(hand); swing.set(0, 0, 0); first = false; }
    // The hanging tip lags the hand like a pendulum.
    // (Skipped on a frame frozen by hit-stop: a hand moved by her figure over no time is no speed at all.)
    if (dt > 1e-3) { handVel.subVectors(hand, lastHand).divideScalar(dt).clampLength(0, 6); swing.addScaledVector(handVel, -dt * 0.5).multiplyScalar(Math.exp(-dt * 4)); swing.clampLength(0, 0.45); } lastHand.copy(hand);
    restTip.copy(hand).add(swing); restTip.y -= WHIP_HANG * grown;
    // The crack: as the rope flies out, a loop runs down the lash; it rings on a little after.
    if (out > lastOut + 1e-4) crack = 1; else crack = Math.max(0, crack - dt * 2.2); lastOut = out;
    phase += dt * (6 + crack * 18);
    if (target && out > 0) tipNow.copy(restTip).lerp(target, out); else tipNow.copy(restTip);
    d.subVectors(tipNow, hand); const len = d.length() || 1e-3, rest = WHIP_HANG * Math.max(0.3, grown);
    // Slack: a lash shorter than its rest length sags; reaching far it is drawn out taut (it is a living vine; it stretches).
    const slack = target && out > 0 ? Math.max(0.05, (1 - out) * 0.6 + Math.max(0, rest - len) * 0.5) : 0.12;
    side.crossVectors(d, up); if (side.lengthSq() < 1e-6) side.set(1, 0, 0); side.normalize();
    for (let i = 0; i < n; i++) {
      const s = i / (n - 1), p = pts[i]; p.copy(hand).addScaledVector(d, s);
      p.y -= Math.sin(Math.PI * s) * slack * Math.min(1, len);
      // The loop travels from hand to tip; a taut lash only trembles.
      const env = Math.sin(Math.PI * s) * (0.25 + s), wave = Math.sin((s * CRACK_WAVES - phase * 0.16) * Math.PI * 2);
      p.addScaledVector(side, wave * env * (CRACK_AMP * crack + 0.02 + (target ? 0 : 0.05)));
      p.y += Math.cos((s * CRACK_WAVES - phase * 0.16) * Math.PI * 2) * env * CRACK_AMP * crack * 0.5;
    }
    // A tube round the curve, thinner toward the tip, grown out of the fist from the hand.
    const shown_ = grown;
    for (let i = 0; i < n; i++) {
      const s = i / (n - 1), p = pts[i]; t0.subVectors(pts[Math.min(n - 1, i + 1)], pts[Math.max(0, i - 1)]).normalize();
      nrm.crossVectors(t0, side); if (nrm.lengthSq() < 1e-6) nrm.set(0, 1, 0); nrm.normalize(); bin.crossVectors(t0, nrm).normalize();
      const r = (WHIP_R0 + (WHIP_R1 - WHIP_R0) * s) * (s <= shown_ ? 1 : 0.0001);
      for (let j = 0; j < m; j++) { const a = j / m * Math.PI * 2, k = (i * m + j) * 3; pos[k] = p.x + (nrm.x * Math.cos(a) + bin.x * Math.sin(a)) * r; pos[k + 1] = p.y + (nrm.y * Math.cos(a) + bin.y * Math.sin(a)) * r; pos[k + 2] = p.z + (nrm.z * Math.cos(a) + bin.z * Math.sin(a)) * r; }
    }
    g.attributes.position.needsUpdate = true; g.computeVertexNormals();
    void time;
  }
  return { mesh, show(on) { shown = on; }, get shown() { return shown; }, get grown() { return grown; }, update, tip: o => o.copy(pts[n - 1]), dispose() { mesh.removeFromParent(); g.dispose(); mat.dispose(); } };
}
