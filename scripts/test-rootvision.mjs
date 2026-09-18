import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const temp=mkdtempSync(join(tmpdir(),'rootvision-tests-'));
try {const file=join(temp,'test.mjs');await build({entryPoints:['tests/rootvision.test.ts'],bundle:true,platform:'node',format:'esm',outfile:file});const r=spawnSync(process.execPath,['--test',file],{stdio:'inherit'});process.exitCode=r.status??1;}finally{rmSync(temp,{recursive:true,force:true});}
