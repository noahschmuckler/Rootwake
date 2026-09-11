// A private campaign preview can open directly on the new scenario, while the
// normal dist/index.html remains the plateau for the existing release workflow.
import { existsSync, readFileSync, cpSync, copyFileSync, rmSync } from 'node:fs';
if (existsSync('.openai/hosting.json')) {
 const manifest=JSON.parse(readFileSync('.openai/hosting.json','utf8'));
 if(manifest.static?.directory==='build') {
  if(!existsSync('dist/conduit.html'))throw new Error('The campaign entry is missing from the build.');
  rmSync('build',{recursive:true,force:true});cpSync('dist','build',{recursive:true});
  copyFileSync('dist/conduit.html','build/index.html');
 }
}
