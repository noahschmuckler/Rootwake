import { defineConfig } from 'vite';
import { existsSync } from 'node:fs';

// A rigged character dropped into public/models takes over from the procedural Hulda (public/models/README.md).
const huldaModel = ['hulda.glb', 'hulda.gltf', 'hulda.fbx'].map(f => `models/${f}`).find(f => existsSync(`public/${f}`)) ?? null;

export default defineConfig({
  define: { __HULDA_MODEL__: JSON.stringify(huldaModel) },
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
