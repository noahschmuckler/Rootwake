// Writes the parkour clips' own motion into src/parkourClips.ts (between its clip-motion markers): for each clip
// in public/models/clips that parkour plays, its lowest foot's height and its hips' travel forward, every
// CLIP_STEP s, in the X Bot's centimetres. Run after replacing or adding a clip: `node scripts/parkour-clips.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const STEP = 0.05, CLIPS = ['step-up', 'clamber', 'jump', 'jump-to-hang', 'hang', 'climb-up', 'vault', 'hang-drop', 'running-jump', 'landing'], rows = [];
const warn = console.warn; console.warn = () => {}; // FBXLoader's notes on the skinless files
for (const f of CLIPS) {
  const buf = readFileSync(`public/models/clips/${f}.fbx`), g = new FBXLoader().parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength), '');
  const c = g.animations[0], mixer = new THREE.AnimationMixer(g), a = mixer.clipAction(c); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.play();
  const bone = n => { let b; g.traverse(o => { if (!b && o.name.endsWith(n)) b = o; }); return b; };
  const lf = bone('LeftFoot'), rf = bone('RightFoot'), hip = bone('Hips'), v = new THREE.Vector3(), F = [], Z = [];
  for (let i = 0; i * STEP <= c.duration + 1e-6; i++) {
    mixer.setTime(Math.min(i * STEP, c.duration - 1e-4)); g.updateMatrixWorld(true);
    F.push(Math.round(Math.min(lf.getWorldPosition(v).y, rf.getWorldPosition(v).y))); Z.push(Math.round(hip.getWorldPosition(v).z));
  }
  rows.push(`  '${f}': { duration: ${c.duration.toFixed(3)}, foot: [${F.join(', ')}], hipsZ: [${Z.join(', ')}] },`);
}
console.warn = warn;
const path = 'src/parkourClips.ts', src = readFileSync(path, 'utf8'), a = src.indexOf('// <clip-motion>'), b = src.indexOf('  // </clip-motion>');
writeFileSync(path, src.slice(0, src.indexOf('\n', a) + 1) + rows.join('\n') + '\n' + src.slice(b));
console.log(`wrote ${rows.length} clips to ${path}`);
