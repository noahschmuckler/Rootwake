// Run TypeScript regression tests without a WebGL renderer: the opening (O1: the stage save, the water's chaos, the ending's timing, the swipe).
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
const suites = [['tests/opening.test.ts', '.opening-tests.mjs'], ['tests/eden.test.ts', '.eden-tests.mjs']];
try {
  for (const [entry, outfile] of suites) await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile, packages: 'external' });
  const result = spawnSync(process.execPath, ['--test', ...suites.map(s => s[1])], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} finally { for (const [, outfile] of suites) rmSync(outfile, { force: true }); }
