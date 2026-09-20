import { defineConfig } from 'vite';
import { existsSync, readdirSync } from 'node:fs';

// A rigged character dropped into public/models takes over from the procedural Hulda (public/models/README.md).
const huldaModel = ['hulda.glb', 'hulda.gltf', 'hulda.fbx'].map(f => `models/${f}`).find(f => existsSync(`public/${f}`)) ?? null;
// Its clips, exported separately (Mixamo without skin): only the ones the gait drives, idle / walking / running.
const huldaClips = existsSync('public/models/clips') ? readdirSync('public/models/clips').filter(f => /^(idle|walk|walking|run|running)\.(fbx|glb|gltf)$/i.test(f)).sort().map(f => `models/clips/${f}`) : [];

export default defineConfig({
  define: { __HULDA_MODEL__: JSON.stringify(huldaModel), __HULDA_CLIPS__: JSON.stringify(huldaClips) },
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      // Two entries: the plateau (index.html) and the underworld (under.html).
      input: { index: 'index.html', under: 'under.html', lab: 'lab.html', rootDiscovery: 'root-discovery.html', ravine: 'ravine.html', watershed: 'watershed.html', karst: 'karst.html', flow: 'flow.html' },
    },
  },
});
