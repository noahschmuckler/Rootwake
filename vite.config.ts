import { defineConfig } from 'vite';
import { existsSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

// A rigged character dropped into public/models takes over from the procedural Hulda (public/models/README.md).
const huldaModel = ['hulda.glb', 'hulda.gltf', 'hulda.fbx'].map(f => `models/${f}`).find(f => existsSync(`public/${f}`)) ?? null;
// Its clips, exported separately (Mixamo without skin): only the ones the gait drives, idle / walking / running.
// F2: her fight clips (Mixamo, without skin), loaded after the gait's: FIGHT_HANDOFF.md.
const fightClips = existsSync('public/models/clips') ? ['attack-1', 'attack-2', 'attack-3', 'heavy', 'cast-burst', 'cast-bind', 'hit', 'dodge'].filter(n => existsSync(`public/models/clips/${n}.fbx`)).map(n => `models/clips/${n}.fbx`) : [];
const traverseClips = existsSync('public/models/clips') ? ['step-up', 'clamber', 'jump-to-hang', 'hang', 'climb-up', 'vault', 'hang-drop', 'running-jump', 'landing', 'jump'].filter(n => existsSync(`public/models/clips/${n}.fbx`)).map(n => `models/clips/${n}.fbx`) : [];
const huldaClips = existsSync('public/models/clips') ? readdirSync('public/models/clips').filter(f => /^(idle|walk|walking|run|running)\.(fbx|glb|gltf)$/i.test(f)).sort().map(f => `models/clips/${f}`) : [];

// PLATEAU.md: the plateau's eroded land, baked at build (its erosion costs a phone seconds at every load; the world's seed is fixed). The page loads it, and erodes itself when it is missing or stale.
const plateauBake = { name: 'plateau-bake', apply: 'build' as const, async generateBundle(this: { emitFile(f: { type: 'asset'; fileName: string; source: Uint8Array }): string }) {
  const { bakeLand, encodeLand } = await import('./src/plateauLand');
  const t0 = Date.now(), bytes = gzipSync(encodeLand(1, bakeLand(1)), { level: 9 });
  this.emitFile({ type: 'asset', fileName: 'land/plateau-1.bin.gz', source: bytes });
  console.log(`plateau: baked the land in ${Date.now() - t0} ms, ${(bytes.length / 1048576).toFixed(2)} MB`);
} };

export default defineConfig({
  define: { __HULDA_MODEL__: JSON.stringify(huldaModel), __HULDA_CLIPS__: JSON.stringify(huldaClips), __FIGHT_CLIPS__: JSON.stringify(fightClips), __TRAVERSE_CLIPS__: JSON.stringify(traverseClips) },
  server: {
    host: true,
  },
  plugins: [plateauBake],
  build: {
    // The village awaits its baked land at the top of its module (PLATEAU.md).
    target: 'es2022',
    rollupOptions: {
      // Two entries: the plateau (index.html) and the underworld (under.html).
      input: { index: 'index.html', under: 'under.html', lab: 'lab.html', rootDiscovery: 'root-discovery.html', ravine: 'ravine.html', watershed: 'watershed.html', karst: 'karst.html', flow: 'flow.html', karstFlow: 'karst-flow.html', village: 'village.html', planet: 'planet.html', vista: 'vista.html', villageVista: 'village-vista.html', hulda: 'hulda.html', fight: 'fight.html', darkYoung: 'dark-young.html', direWolf: 'dire-wolf.html', descent: 'descent.html', parkour: 'parkour.html' },
    },
  },
});
