const base='https://noahschmuckler.github.io/Rootwake/flow/';
let error;
// Up to eight minutes: a Pages build plus CDN propagation can outlast the old three.
for(let attempt=0;attempt<96;attempt++){
 try{
  const revision=await fetch(base+'revision.json?source='+process.env.STUDY_COMMIT,{cache:'no-store'});
  if(!revision.ok||(await revision.json()).sourceCommit!==process.env.STUDY_COMMIT)throw Error('Waiting for published source revision');
  const response=await fetch(base,{cache:'no-store'});if(!response.ok)throw Error('Study unavailable');const html=await response.text();
  if(!html.includes('The Clearing'))throw Error('Unexpected study page');
  for(const [,path]of html.matchAll(/(?:src|href)="([^\"]+\.(?:js|css))"/g)){const asset=await fetch(new URL(path,base));if(!asset.ok)throw Error('Missing asset '+path);}
  console.log('Verified '+base+' at '+process.env.STUDY_COMMIT);process.exit(0);
 }catch(e){error=e;console.log(String(e));await new Promise(r=>setTimeout(r,5000));}
}throw error;
