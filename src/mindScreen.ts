// O1 (OPENING_SEQUENCE.md, Noah 2026-10-30): the match-3 on her mind. On entering a meditation the world fades quickly and a
// field fills the screen: a water shader, its waves disturbed and its lights erratic, pulsing and multicoloured by her chaos
// (1 - clarity / cap, from the entry each frame), settling to a gentle blue with a slow steady turn of the light as her clarity
// gathers. The gems lie flat on it, cel shaded; a tap pair or a finger swipe moves them; a numbered meter fills with each match.
// At the cap the board fades fast, one drop lands in the middle, its ripples spread, and the world shows from the middle outward.
// On a first launch the screen opens dark: the solids drift past, ever faster and more chaotic, then land in the dealt grid.
// Its own orthographic scene, drawn over the world (or instead of it while it covers everything, for a phone's sake).
import * as THREE from 'three';
import { BoardView, SWIPE_PX } from './board3d';
import { DRIFT_S, LAND_S, endingAt, endingSeconds } from './openingModel';

/** Tuning: the world's fade under the field (s), the field's fade when she leaves early (s), how fast the water follows her
 * clarity (per second of the gap), the board's share of the view and its place, the ripple's speed (view units/s). */
export const FADE_S = 0.4, LEAVE_S = 0.35, CHAOS_EASE = 1.3, BOARD_FIT = { width: 0.9, height: 0.62, y: -0.09 }, RIPPLE_SPEED = 0.9;
/** A tap: this little travel (px), this quickly (ms). Tuning. */
const TAP_PX = 10, TAP_MS = 450;

export type MindPhase = 'off' | 'dark' | 'fade' | 'play' | 'ending' | 'leaving';

export interface MindScreen {
  readonly board: BoardView;
  /** Dev: the field's own camera (to project a gem for a finger). */ readonly camera: THREE.Camera;
  readonly phase: MindPhase;
  /** Drawn at all. */ readonly active: boolean;
  /** Opaque over the world: the world need not be drawn beneath it. */ readonly covering: boolean;
  /** The water's chaos as drawn now (eased), and the value it is following. */ readonly chaos: number; readonly chaosWant: number;
  /** Show the screen over the world: a quick fade, or, `dark`, the first launch's dark opening (the board must be bound first). */
  enter(nowMs: number, opts?: { dark?: boolean; seed?: number }): void;
  /** The ending at full clarity: the board fades, the drop, the ripples, the reveal; `then` once the world is wholly shown. */
  end(nowMs: number, then: () => void): void;
  /** Leave early: the field fades out over LEAVE_S, then `then`. */
  leave(nowMs: number, then?: () => void): void;
  /** Hide at once (a mode change under it). */ off(): void;
  setChaos(k: number): void;
  setMeter(value: number, cap: number): void;
  update(nowMs: number): void;
  render(renderer: THREE.WebGLRenderer): void;
  resize(): void;
  /** Dev: the shader's uniforms. */ readonly uniforms: Record<string, THREE.IUniform>;
  /** Dev: a swipe or a tap at screen pixels, as a finger would; where a cell's gem is on the screen (px). */ swipeAt(x: number, y: number, dx: number, dy: number): boolean; tapAt(x: number, y: number): boolean; cellScreen(cell: { row: number; col: number }): { x: number; y: number } | null;
}

const WATER_VERT = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const WATER_FRAG = `
precision highp float;
uniform float uTime, uChaos, uAspect, uAlpha, uReveal, uRipple, uDark;
varying vec2 vUv;
float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
void main() {
  vec2 p = vec2((vUv.x - 0.5) * 2.0 * uAspect, (vUv.y - 0.5) * 2.0);
  float t = uTime, c = uChaos;
  // The waves: six directional sines; in chaos they are short, steep and quick and their directions wander; calm, long and slow.
  float amp = mix(0.035, 0.16, c), freq = mix(2.6, 7.5, c), speed = mix(0.45, 3.2, c);
  float h = 0.0; vec2 g = vec2(0.0);
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float a = hash(fi * 7.1) * 6.2831 + c * sin(t * (0.3 + 0.17 * fi) + fi * 1.7) * 1.4;
    vec2 d = vec2(cos(a), sin(a));
    float f = freq * (1.0 + fi * 0.5);
    float ph = dot(d, p) * f + t * speed * (0.6 + hash(fi * 3.3)) + hash(fi) * 6.2831;
    float am = amp / (1.0 + fi * 0.6);
    h += am * sin(ph); g += am * cos(ph) * d * f;
  }
  // The drop's ripples: rings running out from the middle, fading with their age and behind their front.
  if (uRipple >= 0.0) {
    float r = length(p), front = uRipple * ${RIPPLE_SPEED.toFixed(2)};
    float env = smoothstep(front + 0.05, front - 0.35, r) * exp(-uRipple * 0.45) * 0.08;
    float k = 28.0, ph = r * k - front * k;
    h += env * sin(ph); g += env * cos(ph) * k * (p / max(r, 1e-4));
  }
  float steep = mix(0.9, 1.7, c);
  vec3 n = normalize(vec3(-g.x * steep, 1.0, -g.y * steep));
  vec3 pos = vec3(p.x, h, p.y), V = normalize(vec3(0.0, 1.0, 0.35));
  vec3 deep = mix(vec3(0.03, 0.07, 0.16), vec3(0.06, 0.015, 0.10), c);
  vec3 body = mix(vec3(0.08, 0.26, 0.46), vec3(0.26, 0.05, 0.36), c);
  vec3 col = deep + body * (0.12 + 0.30 * n.y * n.y);
  // Five lights over the water: the gems' five colours, erratic and pulsing in chaos; one soft blue-white in a slow steady turn when calm.
  vec3 cols[5];
  cols[0] = vec3(0.91, 0.32, 0.50); cols[1] = vec3(0.95, 0.71, 0.23); cols[2] = vec3(0.36, 0.72, 0.94); cols[3] = vec3(0.49, 0.85, 0.34); cols[4] = vec3(0.70, 0.53, 0.96);
  vec3 calm = vec3(0.72, 0.86, 1.0);
  float rot = mix(0.22, 1.4, c);
  for (int i = 0; i < 5; i++) {
    float fi = float(i), hi = hash(fi * 5.7 + 1.0);
    float ang = fi * 1.2566 + t * rot * (1.0 + 0.3 * hi) + c * sin(t * (1.3 + 2.0 * hi) + fi) * 1.2;
    float rad = mix(0.55, 0.75, hi) + c * 0.3 * sin(t * (0.9 + 1.5 * hi) * 2.0 + fi * 2.0);
    vec3 lp = vec3(cos(ang) * rad * uAspect * 1.2, mix(0.9, 0.5, c), sin(ang) * rad);
    vec3 lc = mix(calm, cols[i], c);
    float pulse = 1.0 + c * 0.7 * sin(t * (3.0 + 7.0 * hi) + fi * 2.1) + (1.0 - c) * 0.08 * sin(t * 0.8 + fi);
    vec3 L = lp - pos; float dist = length(L); L /= dist;
    float diff = max(dot(n, L), 0.0);
    float spec = pow(max(dot(n, normalize(L + V)), 0.0), mix(60.0, 14.0, c));
    col += lc * (diff * 0.04 + spec * mix(0.4, 0.75, c)) * pulse / (1.0 + dist * dist * 2.2);
  }
  col += mix(vec3(0.05, 0.10, 0.18), vec3(0.12, 0.03, 0.16), c) * (1.0 - n.y) * 1.2;
  col *= uDark;
  // The reveal: the world shows from the middle outward; at 0 the field is whole, at 1 gone to the corners.
  float rs = length(p) / length(vec2(uAspect, 1.0)), rev = uReveal * 1.35 - 0.18;
  float alpha = uAlpha * smoothstep(rev - 0.14, rev + 0.02, rs);
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export function createMindScreen(opts: { meterHost?: HTMLElement; seed?: number } = {}): MindScreen {
  const scene = new THREE.Scene(), aspect = (): number => innerWidth / innerHeight;
  const camera = new THREE.OrthographicCamera(-aspect(), aspect(), 1, -1, 0.1, 20); camera.position.z = 5; scene.add(camera);
  const uniforms = { uTime: { value: 0 }, uChaos: { value: 1 }, uAspect: { value: aspect() }, uAlpha: { value: 0 }, uReveal: { value: 0 }, uRipple: { value: -1 }, uDark: { value: 1 } };
  const water = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms, vertexShader: WATER_VERT, fragmentShader: WATER_FRAG, transparent: true, depthWrite: false, depthTest: false })); water.renderOrder = -10; water.frustumCulled = false; scene.add(water);
  const boardRoot = new THREE.Group(); scene.add(boardRoot);
  const board = new BoardView(camera, { flat: { parent: boardRoot, fitWidth: BOARD_FIT.width, fitHeight: BOARD_FIT.height, yFraction: BOARD_FIT.y, aspect }, toon: true });
  const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(1.2, 2.2, 3); scene.add(key); scene.add(new THREE.AmbientLight('#ffffff', 0.7));
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), new THREE.MeshToonMaterial({ color: '#dff4ff', emissive: '#8ecfff', emissiveIntensity: 0.6 })); drop.visible = false; drop.position.z = 0.5; scene.add(drop);
  // The finger's pad over the canvas (the shared player's canvas gets nothing while the field is up), and the meter.
  const style = document.createElement('style'); style.textContent = `#mindPad{position:fixed;inset:0;z-index:4;touch-action:none}#mindPad[hidden]{display:none}#mindMeter{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%}#mindMeter b{font:600 15px/1 system-ui;letter-spacing:.5px;color:#eaf6ff;text-shadow:0 1px 6px #000}#mindMeter i{display:block;width:100%;height:7px;border-radius:4px;background:#ffffff22;overflow:hidden}#mindMeter i em{display:block;height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,#b387f5,#5cb8f0 60%,#cfeeff);transition:width .25s}`; document.head.append(style);
  const pad = document.createElement('div'); pad.id = 'mindPad'; pad.hidden = true; document.body.append(pad);
  const meter = document.createElement('div'); meter.id = 'mindMeter'; const meterText = document.createElement('b'); const meterBar = document.createElement('i'); const meterFill = document.createElement('em'); meterBar.append(meterFill); meter.append(meterText, meterBar); if (opts.meterHost) opts.meterHost.insertBefore(meter, opts.meterHost.querySelector('button')); else { meter.style.cssText = 'position:fixed;z-index:8;left:50%;top:calc(env(safe-area-inset-top,0px) + 150px);transform:translateX(-50%);width:min(260px,70vw)'; document.body.append(meter); } meter.hidden = true;
  let phase: MindPhase = 'off', phaseAt = 0, lastMs = 0, chaosWant = 1, chaos = 1, then: (() => void) | null = null, seed = opts.seed ?? 1;
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const rayAt = (x: number, y: number): THREE.Raycaster => { ndc.set(x / innerWidth * 2 - 1, -y / innerHeight * 2 + 1); ray.setFromCamera(ndc, camera); return ray; };
  let down: { id: number; x: number; y: number; at: number; done: boolean } | null = null;
  pad.addEventListener('pointerdown', e => { if (phase !== 'play' || down) return; e.preventDefault(); down = { id: e.pointerId, x: e.clientX, y: e.clientY, at: performance.now(), done: false }; try { pad.setPointerCapture(e.pointerId); } catch { /* synthetic */ } });
  pad.addEventListener('pointermove', e => { if (!down || down.id !== e.pointerId || down.done) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; if (Math.hypot(dx, dy) >= SWIPE_PX) { down.done = true; board.swipe(rayAt(down.x, down.y), dx, dy); } });
  const up = (e: PointerEvent): void => { if (!down || down.id !== e.pointerId) return; const d = down; down = null; if (e.type === 'pointerup' && !d.done && Math.hypot(e.clientX - d.x, e.clientY - d.y) < TAP_PX && performance.now() - d.at < TAP_MS) board.tap(rayAt(e.clientX, e.clientY)); };
  pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up);
  function setPhase(p: MindPhase, nowMs: number): void { phase = p; phaseAt = nowMs; pad.hidden = p !== 'play'; }
  function resize(): void { const a = aspect(); camera.left = -a; camera.right = a; camera.updateProjectionMatrix(); uniforms.uAspect.value = a; water.scale.set(1, 1, 1); board.layout(); }
  function enter(nowMs: number, o: { dark?: boolean; seed?: number } = {}): void {
    resize(); lastMs = nowMs; uniforms.uReveal.value = 0; uniforms.uRipple.value = -1; board.setOpacity(1); drop.visible = false; meter.hidden = false; then = null;
    if (o.dark) { seed = o.seed ?? seed; uniforms.uAlpha.value = 1; uniforms.uDark.value = 0; chaos = chaosWant = 1; board.show(nowMs); board.driftIn(nowMs, DRIFT_S, LAND_S, seed); setPhase('dark', nowMs); }
    else { uniforms.uAlpha.value = 0; uniforms.uDark.value = 1; chaos = chaosWant; board.show(nowMs); setPhase('fade', nowMs); }
  }
  function end(nowMs: number, after: () => void): void { if (phase === 'off') return; then = after; meter.hidden = true; setPhase('ending', nowMs); }
  function leave(nowMs: number, after?: () => void): void { if (phase === 'off') return; then = after ?? null; meter.hidden = true; setPhase('leaving', nowMs); }
  function off(): void { setPhase('off', lastMs); meter.hidden = true; drop.visible = false; uniforms.uAlpha.value = 0; down = null; const t = then; then = null; t?.(); }
  function update(nowMs: number): void {
    if (phase === 'off') return;
    const dt = Math.min(0.1, Math.max(0, (nowMs - lastMs) / 1000)); lastMs = nowMs; uniforms.uTime.value += dt;
    chaos += (chaosWant - chaos) * Math.min(1, CHAOS_EASE * dt); uniforms.uChaos.value = chaos;
    const t = (nowMs - phaseAt) / 1000;
    board.update(nowMs);
    switch (phase) {
      case 'dark': { const k = Math.min(1, t / DRIFT_S); uniforms.uDark.value = 0.08 + 0.92 * k * k; if (!board.isBusy) { uniforms.uDark.value = 1; setPhase('play', nowMs); } break; }
      case 'fade': { uniforms.uAlpha.value = Math.min(1, t / FADE_S); if (t >= FADE_S) setPhase('play', nowMs); break; }
      case 'ending': {
        const e = endingAt(t); board.setOpacity(e.board);
        drop.visible = e.drop > 0 && e.drop < 1; drop.position.set(0, 1.15 * (1 - e.drop * e.drop) + 0.02, 0.5);
        uniforms.uRipple.value = e.drop >= 1 ? e.rippleAge : -1; uniforms.uReveal.value = e.reveal;
        if (t >= endingSeconds()) off(); break;
      }
      case 'leaving': { uniforms.uAlpha.value = Math.max(0, 1 - t / LEAVE_S); board.setOpacity(uniforms.uAlpha.value); if (t >= LEAVE_S) off(); break; }
      case 'play': break;
    }
  }
  function render(renderer: THREE.WebGLRenderer): void { if (phase === 'off') return; const ac = renderer.autoClear; renderer.autoClear = false; renderer.clearDepth(); renderer.render(scene, camera); renderer.autoClear = ac; }
  addEventListener('resize', resize);
  return {
    board, camera, uniforms, get phase() { return phase; }, get active() { return phase !== 'off'; },
    get covering() { return (phase === 'dark' || phase === 'play') && uniforms.uAlpha.value >= 1 || (phase === 'ending' && uniforms.uReveal.value <= 0); },
    get chaos() { return chaos; }, get chaosWant() { return chaosWant; },
    enter, end, leave, off, update, render, resize,
    setChaos: (k: number) => { chaosWant = Math.min(1, Math.max(0, k)); },
    setMeter: (v: number, cap: number) => { meterText.textContent = `${Math.floor(v)} / ${cap}`; meterFill.style.width = `${Math.min(100, Math.max(0, v / cap * 100))}%`; },
    swipeAt: (x, y, dx, dy) => board.swipe(rayAt(x, y), dx, dy), tapAt: (x, y) => board.tap(rayAt(x, y)),
    cellScreen: cell => { const m = board.model_; if (!m || cell.row < 0 || cell.col < 0 || cell.row >= m.rows || cell.col >= m.cols) return null; const id = m.grid[cell.row][cell.col].id, mesh = board.group.children.find(o => o.userData.gemId === id); if (!mesh) return null; const p = new THREE.Vector3(); mesh.getWorldPosition(p); p.project(camera); return { x: (p.x + 1) * innerWidth / 2, y: (1 - p.y) * innerHeight / 2 }; },
  };
}
