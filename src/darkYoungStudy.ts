// The Dark Young on its own (dark-young.html): turn it, zoom, walk and charge it round a ring, and set
// off each of its moves (the head-butt, the lash, the grab, feeding, a blow, the roots, the flight,
// death) under a day, a dusk and a night light, beside Hulda for scale.
import * as THREE from 'three';
import { createDarkYoung, type DyAttack } from './darkYoung';
import { createHulda } from './huldaCharacter';
import { TELL_S } from './villageModel';

const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(); const sky = new THREE.Color('#9cb7c9'); scene.background = sky; scene.fog = new THREE.Fog(sky, 12, 40);
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.05, 80);
const hemi = new THREE.HemisphereLight('#b0cdf2', '#5c6640', 1.6); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff4e0', 2.4); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = sc.bottom = -4; sc.right = sc.top = 4; sc.near = 0.5; sc.far = 30; scene.add(sun, sun.target);
const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 64), new THREE.MeshStandardMaterial({ color: '#6f8a45', roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
// A few tufts and stones so the gait reads against something.
{ const g = new THREE.ConeGeometry(0.05, 0.25, 4), m = new THREE.MeshStandardMaterial({ color: '#56702f', roughness: 1 }), tufts = new THREE.InstancedMesh(g, m, 600), o = new THREE.Object3D(); let r = 7;
  const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 600; i++) { const a = rand() * 6.28, d = 1 + rand() * 16; o.position.set(Math.cos(a) * d, 0.1, Math.sin(a) * d); o.rotation.set((rand() - 0.5) * 0.4, 0, (rand() - 0.5) * 0.4); o.updateMatrix(); tufts.setMatrixAt(i, o.matrix); } scene.add(tufts); }

const query = new URLSearchParams(location.search);
const dy = createDarkYoung(3); dy.group.traverse(o => { o.castShadow = true; }); scene.add(dy.group);
const hulda = createHulda(); hulda.group.visible = false; hulda.group.traverse(o => { o.castShadow = true; }); scene.add(hulda.group);

let gait = 0, along = 0, feed = false, rooted = false, flat = false, dead = 0, tell = 0, telling: DyAttack | null = null;
const RING = 4.5;
const pick = (sel: string, on: (b: HTMLButtonElement) => void) => document.querySelectorAll<HTMLButtonElement>(sel).forEach(b => (b.onclick = () => on(b)));
pick('[data-gait]', b => { gait = Number(b.dataset.gait); document.querySelectorAll('[data-gait]').forEach(x => x.classList.toggle('on', x === b)); });
pick('[data-attack]', b => { if (dead || flat) return; telling = b.dataset.attack as DyAttack; tell = 0.001; dy.prepare(telling); });
pick('[data-hit]', b => { const p = Number(b.dataset.hit); dy.flinch(p); flash = 0.09; });
const toggle = (id: string, on: (v: boolean) => void) => { const b = document.getElementById(id)!; b.onclick = () => on(b.classList.toggle('on')); };
toggle('feed', v => (feed = v)); toggle('root', v => (rooted = v)); toggle('flat', v => (flat = v)); toggle('hulda', v => (hulda.group.visible = v));
toggle('die', v => (dead = v ? 0.001 : 0));
const hours = [['#fff4e0', 2.4, 3, 5, 2, '#9cb7c9', 1.6], ['#ff9a5a', 2.2, -4, 1.3, 2, '#c08a6a', 1.0], ['#8fa6e0', 0.5, 1, 4, -2, '#1a2232', 0.35]] as const; let hi = query.has('night') ? 2 : 0;
const setHour = () => { const [c, i, x, y, z, s, h] = hours[hi]; sun.color.set(c); sun.intensity = i; sun.userData.dir = new THREE.Vector3(x, y, z); sky.set(s); (scene.fog as THREE.Fog).color.set(s); hemi.intensity = h; };
setHour(); document.getElementById('hour')!.onclick = () => { hi = (hi + 1) % hours.length; setHour(); };
let flash = 0;

let yaw = 0.9, pitch = 0.18, dist = 6.5;
const pointers = new Map<number, { x: number; y: number }>();
addEventListener('pointerdown', e => { if ((e.target as HTMLElement).tagName === 'BUTTON') return; pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); });
addEventListener('pointermove', e => { const p = pointers.get(e.pointerId); if (!p) return;
  if (pointers.size === 2) { const [a, b] = [...pointers.values()], d0 = Math.hypot(a.x - b.x, a.y - b.y); p.x = e.clientX; p.y = e.clientY; const [c, d] = [...pointers.values()], d1 = Math.hypot(c.x - d.x, c.y - d.y); if (d0 > 0) dist = THREE.MathUtils.clamp(dist * d0 / d1, 1.5, 16); return; }
  yaw -= (e.clientX - p.x) * 0.008; pitch = THREE.MathUtils.clamp(pitch + (e.clientY - p.y) * 0.005, -0.1, 1.3); p.x = e.clientX; p.y = e.clientY; });
const up = (e: PointerEvent) => pointers.delete(e.pointerId); addEventListener('pointerup', up); addEventListener('pointercancel', up);
addEventListener('wheel', e => { dist = THREE.MathUtils.clamp(dist * (1 + e.deltaY * 0.001), 1.5, 16); });
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });

const target = new THREE.Vector3();
function step(dt: number): void {
  const pace = dead ? 0 : rooted ? 0 : flat ? 2.6 : feed ? 0 : gait;
  along += pace * dt / RING;
  const x = Math.cos(along) * RING, z = Math.sin(along) * RING, heading = pace > 0 ? along + Math.PI / 2 : (dy.group.userData.heading ?? along + Math.PI / 2);
  dy.group.userData.heading = heading;
  if (telling) { tell = Math.min(1, tell + dt / TELL_S); if (tell >= 1) { dy.attack(telling); telling = null; tell = 0; } }
  if (dead) dead += dt;
  dy.group.position.set(x, 0, z); dy.group.rotation.y = -heading; dy.group.scale.setScalar(1);
  dy.update(x, z, { moving: pace > 0, tell, rooted: rooted ? 1 : 0, dead, flat, feed }, dt);
  flash = Math.max(0, flash - dt); dy.hide.emissive.setRGB(flash > 0 ? 1.4 : 0, flash > 0 ? 1.35 : 0, flash > 0 ? 1.2 : 0);
  // Hulda stands before it, facing it.
  const fx = Math.cos(heading), fz = Math.sin(heading); hulda.group.position.set(x + fx * 2.2 - fz * 0.4, 0, z + fz * 2.2 + fx * 0.4); hulda.group.rotation.y = Math.atan2(-fx, -fz); hulda.update(dt, 0, 0, true);
  target.set(x, 1.1, z);
  const cy = yaw - heading * (query.has('free') ? 0 : 0);
  camera.position.set(x + Math.sin(cy) * Math.cos(pitch) * dist, 1.1 + Math.sin(pitch) * dist, z + Math.cos(cy) * Math.cos(pitch) * dist); camera.lookAt(target);
  const d = sun.userData.dir as THREE.Vector3; sun.position.set(x + d.x, d.y, z + d.z); sun.target.position.set(x, 0, z);
}
let last = performance.now();
renderer.setAnimationLoop(now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; step(dt); renderer.render(scene, camera); });
Object.assign(window, { __dy: { THREE, scene, camera, renderer, dy, step, render: () => renderer.render(scene, camera), set yaw(v: number) { yaw = v; }, set pitch(v: number) { pitch = v; }, set dist(v: number) { dist = v; }, set gait(v: number) { gait = v; }, set feed(v: boolean) { feed = v; }, set rooted(v: boolean) { rooted = v; }, set flat(v: boolean) { flat = v; }, set dead(v: number) { dead = v; }, hit: (p: number) => dy.flinch(p), act: (k: DyAttack) => { telling = k; tell = 0.001; dy.prepare(k); }, hulda: (v: boolean) => (hulda.group.visible = v), hour: (h: number) => { hi = h; setHour(); } } });
