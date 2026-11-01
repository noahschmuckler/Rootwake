// A look at a GLB before it is dressed: `node scripts/view-glb.mjs model.glb out.png [clip] [seconds]` renders it with its axes under a
// plain light from the front-right and above (Playwright, SwiftShader), the named clip advanced `seconds` in, printing its bounds, so a
// file's facing, size and gait can be judged before a figure is written round it.
import { createServer } from 'node:http';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
const [, , glbPath, outPath, clipName = '', at = '0.3'] = process.argv;
if (!glbPath || !outPath) { console.error('usage: node scripts/view-glb.mjs model.glb out.png [clip] [seconds]'); process.exit(2); }
const root = resolve('.'), glb = readFileSync(glbPath);
const types = { '.js': 'text/javascript', '.html': 'text/html', '.glb': 'model/gltf-binary' };
const html = `<!doctype html><html><body style="margin:0;background:#8aa"><script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const r = new THREE.WebGLRenderer({ antialias: true }); r.setSize(900, 600); document.body.appendChild(r.domElement);
const s = new THREE.Scene(); s.background = new THREE.Color('#8aa'); s.add(new THREE.HemisphereLight('#fff', '#446', 1.2)); const d = new THREE.DirectionalLight('#fff', 2); d.position.set(3, 5, 4); s.add(d);
const g = await new GLTFLoader().loadAsync('/model.glb'); const m = g.scene; s.add(m);
const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3()), L = Math.max(size.x, size.y, size.z);
m.traverse(o => { if (o.isMesh) o.material = new THREE.MeshStandardMaterial({ color: '#c9b', flatShading: true, side: THREE.DoubleSide }); });
const mixer = new THREE.AnimationMixer(m), clip = g.animations.find(x => x.name === ${JSON.stringify(clipName)}); if (clip) { mixer.clipAction(clip).play(); mixer.update(${Number(at)}); }
s.add(new THREE.AxesHelper(L)); // x red, y green, z blue
const cam = new THREE.PerspectiveCamera(35, 1.5, L / 100, L * 20); cam.position.set(c.x + L * 1.6, c.y + L * 0.9, c.z + L * 2.2); cam.lookAt(c); r.render(s, cam);
window.__info = { size: [size.x, size.y, size.z], center: [c.x, c.y, c.z], clips: g.animations.map(a => a.name + ' ' + a.duration.toFixed(2) + 's'), bones: (() => { let n = 0; m.traverse(o => { if (o.isBone) n++; }); return n; })() };
</script></body></html>`;
const server = createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(html); }
  if (url === '/model.glb') { res.writeHead(200, { 'content-type': 'model/gltf-binary' }); return res.end(glb); }
  const p = resolve(root, '.' + url); if (!p.startsWith(root + '/node_modules/')) { res.writeHead(403); return res.end(); }
  try { statSync(p); res.writeHead(200, { 'content-type': types[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); } catch { res.writeHead(404); res.end(); }
});
await new Promise(ok => server.listen(0, ok)); const port = server.address().port;
const require = createRequire(import.meta.url); let playwright; try { playwright = require('playwright'); } catch { playwright = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const browser = await playwright.chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] }); const page = await browser.newPage({ viewport: { width: 900, height: 600 } });
page.on('pageerror', e => console.error('page error', e.message)); page.on('console', m => { if (m.type() === 'error') console.error('console', m.text()); });
await page.goto(`http://127.0.0.1:${port}/`); await page.waitForFunction(() => !!window.__info, null, { timeout: 60000 });
console.log(JSON.stringify(await page.evaluate(() => window.__info))); await page.screenshot({ path: outPath }); await browser.close(); server.close();
