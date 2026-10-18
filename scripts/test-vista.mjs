// Run TypeScript math/rig regression tests without needing a WebGL renderer: the vista's land, and the feel of a blow (F1).
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
const suites = [['tests/vista.test.ts', '.vista-tests.mjs'], ['tests/impact.test.ts', '.impact-tests.mjs'], ['tests/descent.test.ts', '.descent-tests.mjs']];
try {
  for (const [entry, outfile] of suites) await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile, packages: 'external' });
  const result = spawnSync(process.execPath, ['--test', ...suites.map(s => s[1])], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} finally { for (const [, outfile] of suites) rmSync(outfile, { force: true }); }
