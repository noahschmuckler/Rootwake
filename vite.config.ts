import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      // Two entries: the plateau (index.html) and the underworld (under.html).
      input: { index: 'index.html', under: 'under.html', lab: 'lab.html', rootDiscovery: 'root-discovery.html', ravine: 'ravine.html', watershed: 'watershed.html', karst: 'karst.html', flow: 'flow.html', karstFlow: 'karst-flow.html' },
    },
  },
});
