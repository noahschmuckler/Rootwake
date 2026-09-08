// Run TypeScript math/rig regression tests without needing a WebGL renderer.
import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
const output = '.lab-tests.mjs';
try {
  await build({ entryPoints: ['tests/lab-motion.test.ts'], bundle: true, platform: 'node', format: 'esm', outfile: output, packages: 'external' });
  const result = spawnSync(process.execPath, ['--test', output], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} finally { rmSync(output, { force: true }); }
