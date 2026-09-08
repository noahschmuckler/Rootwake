// Verify publication against the tested bundle, not just a successful upload.
import {readFile} from 'node:fs/promises';
const base='https://noahschmuckler.github.io/Rootwake/';
const expected=JSON.parse(await readFile('dist/revision.json','utf8')).sourceCommit;
const pages=[['','index.html'],['under.html','under.html'],['lab/','lab.html']];
let lastError;
for(let attempt=0;attempt<36;attempt++){
 try{
  const revision=await fetch(base+'revision.json?source='+expected,{cache:'no-store',signal:AbortSignal.timeout(10000)});
  if(!revision.ok||(await revision.json()).sourceCommit!==expected)throw new Error('Public revision is not yet '+expected);
  const assets=new Set();
  for(const[route,file]of pages){
   const html=await readFile('dist/'+file,'utf8');
   const response=await fetch(base+route+'?source='+expected,{cache:'no-store',signal:AbortSignal.timeout(10000)});
   if(!response.ok||await response.text()!==html)throw new Error('Public HTML does not match tested '+file);
   for(const match of html.matchAll(/(?:src|href)="([^\"]+\.js)"/g))assets.add(new URL(match[1],base+route).href);
  }
  for(const url of assets){const response=await fetch(url,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('Asset HTTP '+response.status+': '+url);}
  console.log('Verified public plateau, underworld, lab, and JavaScript assets at '+expected);process.exit(0);
 }catch(error){lastError=error;console.log(String(error));await new Promise(resolve=>setTimeout(resolve,5000));}
}
throw lastError;
