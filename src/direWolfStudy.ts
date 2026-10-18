// The black wolves on their own (dire-wolf.html): a pack of three trotting a ring together (or one alone),
// beside an ordinary grey wolf and Hulda for comparison; bite, hit, sleep and death on buttons; a day,
// a dusk and a night light. Drag to turn, pinch to zoom.
import * as THREE from 'three';
import { createDireWolf } from './direWolf';
import { makeWolf } from './wolfFigure';
import { createHulda } from './huldaCharacter';
import { TELL_S } from './villageModel';

const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(); const sky = new THREE.Color('#9cb7c9'); scene.background = sky; scene.fog = new THREE.Fog(sky, 10, 36);
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.05, 80);
const hemi = new THREE.HemisphereLight('#b0cdf2', '#5c6640', 1.6); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff4e0', 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = sc.bottom = -4; sc.right = sc.top = 4; sc.near = 0.5; sc.far = 30; scene.add(sun, sun.target);
const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#6f8a45', roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
{ const g = new THREE.ConeGeometry(0.04, 0.2, 4), m = new THREE.MeshStandardMaterial({ color: '#56702f', roughness: 1 }), tufts = new THREE.InstancedMesh(g, m, 700), o = new THREE.Object3D(); let r = 7;
  const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 700; i++) { const a = rand() * 6.28, d = 1 + rand() * 16; o.position.set(Math.cos(a) * d, 0.08, Math.sin(a) * d); o.rotation.set((rand() - 0.5) * 0.4, 0, (rand() - 0.5) * 0.4); o.updateMatrix(); tufts.setMatrixAt(i, o.matrix); } scene.add(tufts); }

const query = new URLSearchParams(location.search);
const pack = [0, 1, 2].map(i => { const w = createDireWolf(i + 4); w.group.traverse(o => { o.castShadow = true; }); scene.add(w.group); return w; });
const SLOT = [[0, 0], [-1.3, 0.9], [-1.5, -0.8]];
const grey = makeWolf(); grey.group.visible = false; grey.group.traverse(o => { o.castShadow = true; }); scene.add(grey.group);
const hulda = createHulda(); hulda.group.visible = false; scene.add(hulda.group);

let gait = 0, along = 0, asleep = false, dead = 0, tell = 0, biting = false, single = query.has('one'), now = 0, flash = 0;
const RING = 4.5;
document.querySelectorAll<HTMLButtonElement>('[data-gait]').forEach(b => (b.onclick = () => { gait = Number(b.dataset.gait); document.querySelectorAll('[data-gait]').forEach(x => x.classList.toggle('on', x === b)); }));
const toggle = (id: string, on: (v: boolean) => void) => { const b = document.getElementById(id)!; b.onclick = () => on(b.classList.toggle('on')); };
document.getElementById('bite')!.onclick = () => { if (!dead && !asleep) { biting = true; tell = 0.001; } };
document.getElementById('hit')!.onclick = () => { pack[0].flinch(1.5); flash = 0.09; };
toggle('sleep', v => (asleep = v)); toggle('die', v => (dead = v ? 0.001 : 0)); toggle('one', v => (single = v)); toggle('grey', v => (grey.group.visible = v)); toggle('hulda', v => (hulda.group.visible = v));
const hours = [['#fff4e0', 2.4, 3, 5, 2, '#9cb7c9', 1.6], ['#ff9a5a', 2.2, -4, 1.3, 2, '#c08a6a', 1.0], ['#8fa6e0', 0.5, 1, 4, -2, '#1a2232', 0.35]] as const; let hi = query.has('night') ? 2 : 0;
const setHour = () => { const [c, i, x, y, z, s, h] = hours[hi]; sun.color.set(c); sun.intensity = i; sun.userData.dir = new THREE.Vector3(x, y, z); sky.set(s); (scene.fog as THREE.Fog).color.set(s); hemi.intensity = h; };
setHour(); document.getElementById('hour')!.onclick = () => { hi = (hi + 1) % hours.length; setHour(); };

let yaw = 0.9, pitch = 0.15, dist = 4.2, aim = 0, aimY = 0.6;
const pointers = new Map<number, { x: number; y: number }>();
addEventListener('pointerdown', e => { if ((e.target as HTMLElement).tagName === 'BUTTON') return; pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); });
addEventListener('pointermove', e => { const p = pointers.get(e.pointerId); if (!p) return;
  if (pointers.size === 2) { const [a, b] = [...pointers.values()], d0 = Math.hypot(a.x - b.x, a.y - b.y); p.x = e.clientX; p.y = e.clientY; const [c, d] = [...pointers.values()], d1 = Math.hypot(c.x - d.x, c.y - d.y); if (d0 > 0) dist = THREE.MathUtils.clamp(dist * d0 / d1, 1, 16); return; }
  yaw -= (e.clientX - p.x) * 0.008; pitch = THREE.MathUtils.clamp(pitch + (e.clientY - p.y) * 0.005, -0.1, 1.3); p.x = e.clientX; p.y = e.clientY; });
const up = (e: PointerEvent) => pointers.delete(e.pointerId); addEventListener('pointerup', up); addEventListener('pointercancel', up);
addEventListener('wheel', e => { dist = THREE.MathUtils.clamp(dist * (1 + e.deltaY * 0.001), 1, 16); });
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

let heading = Math.PI / 2;
function step(dt: number): void {
  now += dt; const pace = dead || asleep ? 0 : gait; along += pace * dt / RING;
  if (pace > 0) heading = along + Math.PI / 2;
  if (biting) { tell = Math.min(1, tell + dt / TELL_S); if (tell >= 1) { pack.forEach(w => w.bite()); biting = false; tell = 0; } }
  if (dead) dead += dt;
  const cx = Math.cos(along) * RING, cz = Math.sin(along) * RING, fx = Math.cos(heading), fz = Math.sin(heading);
  pack.forEach((w, i) => {
    w.group.visible = !single || i === 0;
    const [sx, sz] = SLOT[i], x = cx + fx * sx - fz * sz, z = cz + fz * sx + fx * sz;
    w.group.position.set(x, 0, z); w.group.rotation.y = -heading; w.group.scale.setScalar(1);
    w.update(x, z, { moving: pace > 0, tell, rooted: 0, dead: i === 0 ? dead : 0, asleep }, dt, now);
  });
  flash = Math.max(0, flash - dt); pack[0].hide.emissive.setRGB(flash > 0 ? 1.4 : 0, flash > 0 ? 1.35 : 0, flash > 0 ? 1.2 : 0);
  grey.group.position.set(cx - fz * -1.6, 0, cz + fx * -1.6); grey.group.rotation.y = -heading; grey.legs.forEach((l, i) => (l.rotation.z = pace ? Math.sin(now * 14 + i * 1.6) * 0.5 : 0));
  hulda.group.position.set(cx + fx * 1.8 + fz * 0.9, 0, cz + fz * 1.8 - fx * 0.9); hulda.group.rotation.y = Math.atan2(-fx, -fz); hulda.update(dt, 0, 0, true);
  const tx = cx + fx * aim, tz = cz + fz * aim; camera.position.set(tx + Math.sin(yaw) * Math.cos(pitch) * dist, aimY + Math.sin(pitch) * dist, tz + Math.cos(yaw) * Math.cos(pitch) * dist); camera.lookAt(tx, aimY, tz);
  const d = sun.userData.dir as THREE.Vector3; sun.position.set(cx + d.x, d.y, cz + d.z); sun.target.position.set(cx, 0, cz);
}
let last = performance.now();
renderer.setAnimationLoop(t => { const dt = Math.min(0.05, (t - last) / 1000); last = t; step(dt); renderer.render(scene, camera); });
Object.assign(window, { __dw: { THREE, scene, camera, renderer, pack, step, render: () => renderer.render(scene, camera), set yaw(v: number) { yaw = v; }, set pitch(v: number) { pitch = v; }, set dist(v: number) { dist = v; }, set aim(v: number) { aim = v; }, set aimY(v: number) { aimY = v; }, set gait(v: number) { gait = v; }, set asleep(v: boolean) { asleep = v; }, set dead(v: number) { dead = v; }, set single(v: boolean) { single = v; }, bite: () => { biting = true; tell = 0.001; }, hit: (p: number) => pack[0].flinch(p), grey: (v: boolean) => (grey.group.visible = v), hulda: (v: boolean) => (hulda.group.visible = v), hour: (h: number) => { hi = h; setHour(); } } });
