import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local'],
  },
  build: {
    rollupOptions: {
      // Two entries: the plateau (index.html) and the underworld (under.html).
      input: { index: 'index.html', under: 'under.html', lab: 'lab.html', rootvision: 'rootvision.html' },
    },
  },
});
