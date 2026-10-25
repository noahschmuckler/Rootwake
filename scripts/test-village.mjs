// Run TypeScript math/rig regression tests without needing a WebGL renderer: the village, the contagion (C1, her front along the roots), her mount (STAGS.md) and the overworld map's pure parts (T9).
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
const suites = [['tests/village.test.ts', '.village-tests.mjs'], ['tests/contagion.test.ts', '.contagion-tests.mjs'], ['tests/mount.test.ts', '.mount-tests.mjs'], ['tests/overworldMap.test.ts', '.overworld-map-tests.mjs']];
try {
  for (const [entry, outfile] of suites) await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile, packages: 'external' });
  const result = spawnSync(process.execPath, ['--test', ...suites.map(s => s[1])], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} finally { for (const [, outfile] of suites) rmSync(outfile, { force: true }); }
