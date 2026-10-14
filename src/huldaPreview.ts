// Hulda's figure on its own (design/hulda): turn her, zoom, see her idle, walk and run on her
// Mixamo clips under the vista's light, beside a hobbit for scale, and against the old figure.
import * as THREE from 'three';
import { createHulda } from './huldaCharacter';
import { HUMAN_CENTRE } from './huldaPresentation';

const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; document.body.prepend(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color('#9cc3e6'); scene.fog = new THREE.Fog('#9cc3e6', 6, 18);
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.05, 50);
const hemi = new THREE.HemisphereLight('#b0cdf2', '#7c8656', 1.9); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff4e0', 2.3); sun.position.set(2, 4, 3); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); const sc = sun.shadow.camera; sc.left = sc.bottom = -1.5; sc.right = sc.top = 1.5; sc.near = 0.5; sc.far = 12; sun.shadow.bias = -0.0005; scene.add(sun);
const ground = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.MeshToonMaterial({ color: '#7fa64a' })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
const query = new URLSearchParams(location.search);
const make = (old: boolean) => { const h = createHulda(old ? { style: 'rigid' } : {}); h.group.traverse(o => { o.castShadow = true; }); h.group.position.y = 0; scene.add(h.group); return h; };
let hulda = make(query.get('figure') === 'old');
const hobbit = createHulda({ name: 'hobbit', height: 0.5, skin: '#e0c4a0', cloth: '#7a5a3a', clothLight: '#a0805a', hair: '#4a3020', feet: '#5a4a3a', locks: false, leaves: false, skirt: true }); hobbit.group.position.set(0.45, 0, 0.1); hobbit.group.visible = false; hobbit.group.traverse(o => { o.castShadow = true; }); scene.add(hobbit.group);
let clips: THREE.AnimationClip[] | null = null;
const base = (c: string) => import.meta.env.BASE_URL + c;
if (__HULDA_CLIPS__.length) import('./huldaModel').then(({ loadHuldaClips }) => loadHuldaClips(__HULDA_CLIPS__.map(base))).then(c => { clips = c; hulda.setClips(c); hobbit.setClips(c); }, e => console.warn('clips', e));
let speed = 0, yaw = Math.PI - 0.5, dist = 2.2;
document.querySelectorAll<HTMLButtonElement>('[data-speed]').forEach(b => b.onclick = () => { speed = Number(b.dataset.speed); document.querySelectorAll('[data-speed]').forEach(x => x.classList.toggle('on', x === b)); });
document.getElementById('hobbit')!.onclick = e => { hobbit.group.visible = !hobbit.group.visible; (e.target as HTMLElement).classList.toggle('on', hobbit.group.visible); };
document.getElementById('old')!.onclick = e => { const old = hulda.group.name !== 'Hulda' || (e.target as HTMLElement).classList.toggle('on'); hulda.dispose(); hulda = make((e.target as HTMLElement).classList.contains('on')); if (clips) hulda.setClips(clips); void old; };
const hours = [['#fff4e0', 2.3, 2, 4, 3], ['#ffb070', 2.4, -3, 1.4, 2], ['#9fb4e0', 0.6, 1, 3, -2]] as const; let hi = 0;
document.getElementById('hour')!.onclick = () => { hi = (hi + 1) % hours.length; const [c, i, x, y, z] = hours[hi]; sun.color.set(c); sun.intensity = i; sun.position.set(x, y, z); hemi.intensity = hi === 2 ? 0.7 : 1.9; };
const pointers = new Map<number, { x: number; y: number }>(); let pinch = 0;
addEventListener('pointerdown', e => { if ((e.target as HTMLElement).tagName === 'BUTTON') return; pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); });
addEventListener('pointermove', e => { const p = pointers.get(e.pointerId); if (!p) return; if (pointers.size === 2) { const [a, b] = [...pointers.values()]; const d0 = Math.hypot(a.x - b.x, a.y - b.y); p.x = e.clientX; p.y = e.clientY; const d1 = Math.hypot(a.x - b.x, a.y - b.y); if (pinch) dist = THREE.MathUtils.clamp(dist * d0 / Math.max(1, d1), 0.6, 5); pinch = 1; return; } yaw -= (e.clientX - p.x) * 0.01; p.x = e.clientX; p.y = e.clientY; });
const up = (e: PointerEvent) => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = 0; }; addEventListener('pointerup', up); addEventListener('pointercancel', up);
addEventListener('wheel', e => { dist = THREE.MathUtils.clamp(dist * (1 + e.deltaY * 0.001), 0.6, 5); });
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); });
let last = performance.now();
renderer.setAnimationLoop(now => {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  // She walks in place facing the camera's turn; the ground scrolls under nothing, as in the preview of the clearing.
  hulda.update(dt, speed, 0, true); hobbit.update(dt, speed, 0, true);
  camera.position.set(Math.sin(yaw) * dist, 0.42 + dist * 0.12, Math.cos(yaw) * dist); camera.lookAt(0, HUMAN_CENTRE + 0.05, 0);
  renderer.render(scene, camera);
});
Object.assign(window, { __hulda: { THREE, scene, camera, renderer, get figure() { return hulda; }, set yaw(v: number) { yaw = v; }, set dist(v: number) { dist = v; }, set speed(v: number) { speed = v; } } });
