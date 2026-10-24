// The village under the vista's look (headless Chromium, SwiftShader): it boots past the intro, the vista's land is drawn and
// the chunks' own ground and trees are not, the land and the sky change with the clock, the deep hides the land, and no
// console or shader errors; under the grass the stratum (T8) is on and gone again on surfacing; her stag (STAGS.md) rises on the green, outruns her walk and collapses in the growth. Screenshots at a phone's portrait aspect land in artifacts/village-vista.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/village-vista');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/'||path==='/village/')path='/village-vista.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4193,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={};
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4193${BASE}village/?q=${process.env.VILLAGE_VISTA_Q??"medium"}&hud=1`);/* The village builds its whole land on load: under CI's SwiftShader that can run past a click's default 30 s. */await page.click('#begin',{timeout:180000});
  await page.waitForFunction(()=>window.__village&&window.__village.character.status!=='loading'&&window.__look,null,{timeout:180000});
  // PLATEAU.md: she wakes on the karst's summit.
  report.start=await page.evaluate(()=>({zone:window.__village.karst.zone,mode:window.__village.mode,baked:window.__plateau.land}));assert.equal(report.start.zone,'summit',`she wakes on the summit (${JSON.stringify(report.start)})`);assert.ok(report.start.baked?.baked,'the land was baked at build');
  const shot=async(name,js)=>{await page.evaluate(js);await page.waitForTimeout(2500);await page.screenshot({path:`${out}/${name}.png`,timeout:180000});};
  await shot('noon-green',()=>{const v=window.__village;v.jumpTo('noon');v.standAt(6,34,0.15);});
  report.state=await page.evaluate(()=>{const v=window.__village,s=v.scene,vista=s.getObjectByName('vista');let chunkGround=0,chunkTrees=0;s.traverse(o=>{if(o.visible&&o.name==='world-ground'){let p=o,seen=true;while(p){if(!p.visible)seen=false;p=p.parent;}if(seen)chunkGround++;}if(o.visible&&(o.name==='tree-leaves')){let p=o,seen=true;while(p){if(!p.visible)seen=false;p=p.parent;}if(seen)chunkTrees++;}});return {vista:!!vista&&vista.visible,chunkGround,chunkTrees,far:v.camera.far,height:(()=>{const m=window.__plateau.model;return v.relief(m.centre.x+2250,m.centre.z);})(),brinks:v.deep.places().filter(p=>p.kind==='brink').length,brinksReach:v.deep.reachable().filter(id=>id.startsWith('brink:')).length};});
  assert.equal(report.state.vista,true,'the vista land is drawn');assert.equal(report.state.chunkGround,0,'the chunks draw no ground');assert.equal(report.state.chunkTrees,0,'nor their trees');
  assert.ok(report.state.height>60,`mountains past the farthest place (${report.state.height})`);
  // T6 (PLATEAU.md): the belt's passes end at brinks, deep-root destinations from the first.
  assert.equal(report.state.brinks,3,'three brinks');assert.equal(report.state.brinksReach,3,'all of them reachable by default');
  // T7 (PLATEAU.md, every place stands clear): at each village's green (the finest land mesh is built about her), every house's base lies on the drawn ground within 0.15 m over its whole footprint, no house, site, store, strip or tree of the village stands in water, and the fairy rings about it stand on the drawn ground, dry.
  report.t7=[];
  for(const vil of await page.evaluate(()=>window.__village.villages().map(v=>({id:v.id,x:v.x,z:v.z})))){
    await page.evaluate(([x,z])=>{const v=window.__village;v.jumpTo('noon');v.standAt(x,z-10,0);},[vil.x,vil.z]);await page.waitForTimeout(2500);
    const r=await page.evaluate(([id,ox,oz])=>{const v=window.__village,m=window.__plateau.model,tiles=v.scene.getObjectByName('terrain').children;
      const drawnAt=(x,z)=>{for(const t of tiles){const g=t.geometry;if(!g||!t.visible)continue;const pa=g.attributes.position,pos=pa.array,n=Math.round(-3+Math.sqrt(pa.count+8)),x0=pos[0],z0=pos[2],sp=pos[3]-pos[0];if(x<x0||z<z0||x>x0+n*sp||z>z0+n*sp)continue;const fx=(x-x0)/sp,fz=(z-z0)/sp,i=Math.min(n-1,Math.floor(fx)),j=Math.min(n-1,Math.floor(fz)),u=fx-i,w=fz-j,at=(ii,jj)=>pos[(jj*(n+1)+ii)*3+1],a=at(i,j),b=at(i+1,j),c=at(i,j+1),d=at(i+1,j+1);return {y:u+w<=1?a*(1-u-w)+b*u+c*w:d*(u+w-1)+c*(1-u)+b*(1-w),sp};}return null;};
      const ring=(x,z,r,n=8)=>{const out=[[x,z]];for(let i=0;i<n;i++)out.push([x+Math.cos(i/n*6.2832)*r,z+Math.sin(i/n*6.2832)*r]);return out;};
      const root=v.scene.children.find(o=>o.name==='village-root'&&Math.abs(o.position.x-ox)<0.5&&Math.abs(o.position.z-oz)<0.5),houses=[],wet=[];let sp=0;
      for(const h of root.children.filter(o=>o.name.startsWith('house-'))){const x=ox+h.position.x,z=oz+h.position.z;let off=0;for(const [px,pz] of ring(x,z,1.35)){const d=drawnAt(px,pz);if(!d){off=NaN;break;}sp=d.sp;off=Math.max(off,Math.abs(h.position.y-d.y));}houses.push({id:h.name,off:+off.toFixed(3)});if(m.water(x,z))wet.push(h.name);}
      for(const [k,s] of Object.entries(v.sites))if(m.water(ox+s.x,oz+s.z))wet.push(`site ${k}`);
      for(const [k,s] of Object.entries(v.storeSpots))if(m.water(ox+s.x,oz+s.z))wet.push(`store ${k}`);
      for(const t of v.trees)if(m.water(ox+t.x,oz+t.z))wet.push(`tree ${t.id}`);
      for(let n=0;n<5;n++)if(m.water(ox+v.sites.field.x+(n-2),oz+v.sites.field.z+(n-2)*0.3))wet.push(`strip ${n}`);
      const f=v.player.feet(),rings=[];v.scene.traverse(o=>{if(o.name==='fairy-ring'&&Math.hypot(o.position.x-f.x,o.position.z-f.z)<90){let off=0;for(const [px,pz] of ring(o.position.x,o.position.z,0.85)){const d=drawnAt(px,pz);off=d?Math.max(off,Math.abs(o.position.y-d.y)):NaN;}rings.push({x:+o.position.x.toFixed(1),z:+o.position.z.toFixed(1),off:+off.toFixed(3),wet:!!m.water(o.position.x,o.position.z)});}});
      return {id,sp,houses,wet,rings};},[vil.id,vil.x,vil.z]);
    report.t7.push(r);
    assert.ok(r.houses.length>=6&&r.sp<=3.3,`${vil.id}: its houses on the finest land mesh (${r.houses.length} houses, ${r.sp} m)`);
    for(const h of r.houses)assert.ok(h.off<=0.15,`${vil.id}'s ${h.id} stands on the drawn ground (off ${h.off})`);
    assert.deepEqual(r.wet,[],`nothing of ${vil.id} stands in water`);
    assert.ok(r.rings.length>=1,`a fairy ring near ${vil.id}'s green`);for(const g of r.rings)assert.ok(g.off<=0.15&&!g.wet,`the fairy ring at (${g.x}, ${g.z}) stands dry on the drawn ground (off ${g.off}, wet ${g.wet})`);
  }
  const sky=()=>page.evaluate(()=>{const m=window.__village.scene.getObjectByName('sky').material.uniforms;return {zenith:m.uZenith.value.getHex(),stars:m.uStars.value,sun:m.uSunDir.value.y};});
  report.noon=await sky();
  await shot('night-green',()=>{const v=window.__village;v.jumpTo('night');v.setTick(v.tick+200);});
  report.night=await sky();
  assert.notEqual(report.noon.zenith,report.night.zenith,'the sky follows the clock');assert.ok(report.night.stars>0.5,'stars by night');
  await shot('dusk-karst',()=>{const v=window.__village;v.jumpTo('dusk');v.standAt(-60+160,-330+60,Math.atan2(160,60));});
  await shot('wood-noon',()=>{const v=window.__village;v.jumpTo('noon');v.standAt(120,60,0.4);});
  // The mount (STAGS.md): on the green's healthy soil a stag of soil, grass and branches rises at her sap's cost; mounted, eight seconds of the ride's clock carry her farther than her walk would.
  /* Pass 3: the stag rises RISE_AHEAD m to her right (her facing +z, so 2 m toward −x): she stands at x 8 so it stands on the line x 6 that the ride and the call below were measured on. */
  await page.evaluate(()=>{const v=window.__village;v.jumpTo('noon');v.standAt(8,34,Math.PI);});await page.waitForTimeout(1500);
  report.mount=await page.evaluate(()=>{const v=window.__village,m=v.mount,can=m.canSummon(),ctx=m.ctx(),sapBefore=v.hero.sap,summoned=m.summon();let stags=0;v.scene.traverse(o=>{if(o.name==='stag')stags++;});return {can,ctx,sapBefore,sapAfter:v.hero.sap,summoned,stags,state:m.state.stag,constants:m.constants};});
  assert.equal(report.mount.can,null,`she can summon on the green (${JSON.stringify(report.mount.ctx)})`);assert.ok(report.mount.summoned&&report.mount.stags===1&&report.mount.state?.phase==='rising',`a stag rises (${JSON.stringify(report.mount.state)})`);assert.equal(report.mount.sapBefore-report.mount.sapAfter,report.mount.constants.SUMMON_SAP,'the summon costs its sap');
  await page.waitForFunction(()=>window.__village.mount.state.stag?.phase==='up',null,{timeout:60000});
  assert.ok(await page.evaluate(()=>window.__village.mount.mount()),'she mounts it');await page.waitForFunction(()=>window.__village.mount.state.riding,null,{timeout:60000});
  report.mount.ride=await page.evaluate(()=>{const v=window.__village,f=v.player.feet();v.mount.ride(0,1,8);return {from:f,mode:v.mode,seat:v.mount.state.seat};});assert.equal(report.mount.ride.mode,'ride');
  await page.waitForFunction(()=>!window.__village.mount.state.driving,null,{timeout:120000});
  report.mount.ride.to=await page.evaluate(()=>window.__village.player.feet());report.mount.ride.distance=Math.hypot(report.mount.ride.to.x-report.mount.ride.from.x,report.mount.ride.to.z-report.mount.ride.from.z);report.mount.ride.walkWould=report.mount.constants.walk*8;
  assert.ok(report.mount.ride.distance>report.mount.ride.walkWould*1.3,`eight seconds mounted carry her farther than her walk would (${report.mount.ride.distance.toFixed(1)} m against ${report.mount.ride.walkWould} m)`);
  await page.screenshot({path:`${out}/mounted.png`,timeout:180000});
  // Pass 2 (STAGS.md): across the river (the ride above crossed it) and beyond CALL_RUN_M, a call sinks the stag into the soil, travels it at root travel's pace and surfaces it beside her; the file's body wears our dressing.
  /* She stands on the near bank: the river between (a run would answer over open ground; the water makes it travel). The spot is chosen on the page, not assumed: where the ride left the stag varies with the renderer's clock, so of a few spots on the near bank the first is taken whose sampled line to the stag crosses water (the mount's own `soil`: the village's stream or the plateau's rivers) and that the stag's own `runnable` refuses; that refusal is asserted before the call. SwiftShader runs the ride's clock at about a tenth of real time, so the waits are generous. */report.mount.call=await page.evaluate(()=>{const v=window.__village,m=v.mount;m.dismount();const s=m.state.stag,crosses=f=>{let n=0;for(let i=0;i<=60;i++){const x=s.x+(f.x-s.x)*i/60,z=s.z+(f.z-s.z)*i/60;if(m.soil(x,z)==='water')n++;}return n;};let spot=null;const tried=[];for(const [x,z] of [[6,40],[6,36],[6,44],[2,40],[10,40],[6,32],[6,48],[0,36],[12,36],[6,28],[6,24]]){v.standAt(x,z,0);const f=v.player.feet(),r=m.runnable(f.x,f.z),w=crosses(f);tried.push({x,z,runnable:r,water:w});if(!r&&w>0){spot={x,z,feet:{x:f.x,z:f.z},water:w};break;}}const f=v.player.feet();return {kind:s.kind,tris:s.triangles,meshes:s.meshes,asset:m.asset,stag:{x:s.x,z:s.z},spot,tried,distance:Math.hypot(s.x-f.x,s.z-f.z),runnable:m.runnable(f.x,f.z),answer:spot?m.call():false,phase:m.state.stag.phase};});
  assert.ok(report.mount.call.asset&&report.mount.call.kind==='asset'&&report.mount.call.tris<6000,`the file's stag, dressed (${JSON.stringify(report.mount.call)})`);assert.ok(report.mount.call.spot&&report.mount.call.runnable===false,`a spot on the near bank with the river between her and the stag (${JSON.stringify({stag:report.mount.call.stag,tried:report.mount.call.tried})})`);assert.equal(report.mount.call.answer,'travel',`a call from across the river travels (${JSON.stringify(report.mount.call)})`);assert.equal(report.mount.call.phase,'sinking');
  await page.waitForFunction(()=>window.__village.mount.state.stag?.phase==='travelling',null,{timeout:120000});await page.waitForFunction(()=>window.__village.mount.state.stag?.phase==='up',null,{timeout:240000});
  report.mount.called=await page.evaluate(()=>{const v=window.__village,s=v.mount.state.stag,f=v.player.feet();return {distance:Math.hypot(s.x-f.x,s.z-f.z),health:s.health,x:s.x,z:s.z};});
  assert.ok(report.mount.called.distance<=report.mount.constants.MOUNT_REACH+1.5&&report.mount.called.health>99,`it surfaces beside her, undrained outside the growth (${JSON.stringify(report.mount.called)})`);
  assert.ok(await page.evaluate(()=>window.__village.mount.mount()),'she mounts it again');await page.waitForFunction(()=>window.__village.mount.state.riding,null,{timeout:60000});
  // Back over the river to where the first ride ended, so the growth's dawn below is stepped from the same standing spot as before the call (C1.1's chunk count reads where she stands).
  await page.evaluate(()=>window.__village.mount.ride(0,1,8));await page.waitForFunction(()=>!window.__village.mount.state.driving,null,{timeout:120000});
  report.mount.back=await page.evaluate(()=>window.__village.player.feet());assert.ok(report.mount.back.z>60,`ridden back over the river (${JSON.stringify(report.mount.back)})`);
  // C1 (CONTAGION.md): her growth creeps along the roots toward the first village: twelve fed dawns bring the front's nearest claimed hub to its green, ground she could cross on day 0 is hers, the land's tint is drawn again. (C3: a village left alone shrines itself in a few days and, thriving, pushes the front off at VILLAGE_HOLD_R; in play her own first snatch breaks its thriving before the front is near, but here the village's clock stands still through the twelve dawns, so the pace is measured with the villages' pushes left out, `step(12, false)`; the push itself is checked in the C3 block.)
  report.growth=await page.evaluate(()=>{const v=window.__village,g=v.growth,bytes=window.__look.world.uniforms.uGround.value.image.data,sum=()=>{let s=0;for(let i=0;i<bytes.length;i+=97)s=(s+bytes[i])|0;return s;},probe=[];for(let x=-600;x<=600;x+=50)for(let z=-600;z<=600;z+=50)probe.push([x,z]);
    const read=()=>{const st=g.state;return {day:st.day,hyphae:st.hyphae.length,claimed:st.claimed.length,nearest:Math.round(g.nearest(0,0).d),sum:sum(),open:probe.filter(([x,z])=>!g.inGrowth(x,z)).length};};
    const before=read(),ms=Math.round(g.step(12,false)),after=read();return {before,after,ms};});
  assert.equal(report.growth.after.day,report.growth.before.day+12,`twelve dawns stepped (${JSON.stringify(report.growth)})`);
  assert.ok(report.growth.after.nearest<60,`the front's nearest hub within 60 m of the first village's green (${JSON.stringify(report.growth)})`);
  assert.ok(report.growth.after.open<report.growth.before.open,'ground open on day 0 is hers now');assert.notEqual(report.growth.after.sum,report.growth.before.sum,'the ground tint drawn again');
  // C1.1 (the dawn hitch): the dawn's refresh draws again only what the front crossed (the look's trees by chunk, its ground by tile, the chunks, the roots); what it leaves must be exactly what a full draw gives.
  const digest=()=>page.evaluate(()=>{const v=window.__village,l=window.__look,bytes=l.world.groundBytes;let g=0;for(let i=0;i<bytes.length;i++)g=(g*31+bytes[i])|0;let t=0;for(const x of l.trees())t=(t*31+x.kind*7+Math.round(x.x*10)+Math.round(x.z*10)*3+Math.round(x.scale*100))|0;
    let c=0,cg=0,r=0,rp=0;v.scene.traverse(o=>{if(o.name==='world-ground'){const a=o.geometry.attributes.color.array;let h=0;for(let i=0;i<a.length;i++)h=(h*31+Math.round(a[i]*1000))|0;c=(c+h)|0;cg++;}if(o.name.startsWith('root-chunk:')){r++;rp+=o.geometry.attributes.position.count;}});return {ground:g,trees:t,treeCount:l.trees().length,chunkGround:c,chunks:cg,roots:r,rootPoints:rp,parts:v.growth.parts};});
  report.incremental=await digest();report.fullMs=Math.round(await page.evaluate(()=>window.__village.growth.refresh(true)));report.full=await digest();
  const drawn=d=>{const {parts,...rest}=d;return rest;};assert.deepEqual(drawn(report.incremental),drawn(report.full),`the incremental refresh leaves the land as a full one draws it (${JSON.stringify({incremental:report.incremental,full:report.full})})`);
  assert.ok(report.incremental.parts.chunksRebuilt<report.incremental.chunks&&report.incremental.parts.groundTiles<report.full.parts.groundTiles,`the incremental refresh drew less than the full one (${JSON.stringify({incremental:report.incremental.parts,full:report.full.parts})})`);
  // The mount in the growth (STAGS.md): ridden into the front (the twelve dawns above), the stag's health drains by the depth where it stands at the model's rate; at nothing it collapses and she is on her feet.
  await page.evaluate(()=>{const v=window.__village,s=v.mount.state.stag,n=v.growth.nearest(s.x,s.z);v.mount.ride(n.x-s.x,n.z-s.z,40);});
  await page.waitForFunction(()=>{const v=window.__village,s=v.mount.state.stag;return !!s&&v.growth.depth(s.x,s.z)>0.1;},null,{timeout:180000});await page.evaluate(()=>window.__village.mount.ride(0,0,0));
  const drain=()=>page.evaluate(()=>{const v=window.__village,s=v.mount.state.stag;return {health:s.health,t:s.t,depth:v.growth.depth(s.x,s.z),phase:s.phase,lasts:s.lasts};});
  report.mount.growth=await drain();await page.waitForTimeout(3000);report.mount.growthLater=await drain();
  {const a=report.mount.growth,b=report.mount.growthLater,rate=(a.health-b.health)/(b.t-a.t),expected=report.mount.constants.DRAIN*(a.depth+b.depth)/2;report.mount.drain={rate,expected};assert.ok(b.health<a.health&&b.t>a.t&&Math.abs(rate-expected)<expected*0.5+0.1,`its health drains at DRAIN by depth (${JSON.stringify(report.mount.drain)})`);assert.ok(Math.abs(a.lasts-100/(report.mount.constants.DRAIN*a.depth))<1e-6,'the readout counts the seconds it has');}
  /* Set near nothing: at a mild depth DRAIN × depth is under a point a second, and SwiftShader's frames run the ride's clock at a quarter of real time. */await page.evaluate(()=>window.__village.mount.set({health:0.5}));await page.waitForFunction(()=>window.__village.mount.state.stag?.phase==='collapsing',null,{timeout:60000});
  report.mount.collapsed=await page.evaluate(()=>{const v=window.__village,s=v.mount.state;return {mode:s.mode,riding:s.riding,landing:s.landing,feetY:v.player.feet().y,ground:v.relief(v.player.feet().x,v.player.feet().z)};});
  assert.ok(report.mount.collapsed.mode==='ground'&&!report.mount.collapsed.riding&&Math.abs(report.mount.collapsed.feetY-report.mount.collapsed.ground)<0.6,`she lands on her feet (${JSON.stringify(report.mount.collapsed)})`);
  await page.waitForFunction(()=>window.__village.mount.state.stag===null,null,{timeout:60000});
  // Noah (2026-10-24): at the second village's healthy ground the stag rises beside her facing her own way; with a basket of grain on her back she mounts it all the same (the basket stays on); at a gallop a tap of guard plants it, head down, and she dives over its neck to land and roll on ahead of it, on her feet, the basket still full.
  await page.evaluate(()=>{const v=window.__village,o=v.villages()[1];v.jumpTo('noon');v.standAt(o.x+6,o.z+30,Math.PI);});await page.waitForTimeout(1500);
  report.vault=await page.evaluate(()=>{const v=window.__village,m=v.mount;v.live.hero.sap=100;v.live.stack={kind:'grain',n:9};const can=m.canSummon(),ok=m.summon(),s=m.state;return {can,ok,heading:s.stag?.heading,her:s.her,constants:m.constants};});
  assert.ok(report.vault.can===null&&report.vault.ok,`a stag rises at the second village (${JSON.stringify(report.vault)})`);assert.ok(Math.abs(Math.atan2(Math.sin(report.vault.heading-report.vault.her),Math.cos(report.vault.heading-report.vault.her)))<1e-6,`facing her way (${report.vault.heading} against ${report.vault.her})`);
  await page.waitForFunction(()=>window.__village.mount.state.stag?.phase==='up',null,{timeout:60000});
  assert.ok(await page.evaluate(()=>window.__village.mount.mount()),'she mounts it with her basket full');await page.waitForFunction(()=>window.__village.mount.state.riding,null,{timeout:60000});
  assert.ok(await page.evaluate(()=>window.__village.mount.state.basket),'the basket rides on her back');
  await page.evaluate(()=>window.__village.mount.ride(0,1,30));await page.waitForFunction(v=>window.__village.mount.state.stag.speed>v+0.5,report.vault.constants.VAULT_SPEED,{timeout:120000});
  await page.evaluate(()=>window.__village.mount.guardTap());await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:120000});
  report.vault.landed=await page.evaluate(()=>{const v=window.__village,s=v.mount.state.stag,f=v.player.feet(),fw={x:-Math.sin(s.heading),z:-Math.cos(s.heading)};return {ahead:(f.x-s.x)*fw.x+(f.z-s.z)*fw.z,phase:s.phase,stack:v.stack,feetY:f.y,ground:v.relief(f.x,f.z)};});
  assert.ok(report.vault.landed.ahead>1.5&&report.vault.landed.phase==='up'&&Math.abs(report.vault.landed.feetY-report.vault.landed.ground)<0.6,`over its head and down ahead of it, on her feet (${JSON.stringify(report.vault.landed)})`);assert.equal(report.vault.landed.stack?.n,9,'the basket kept');
  await page.evaluate(()=>{window.__village.mount.dismiss();window.__village.live.stack=null;});await page.waitForFunction(()=>window.__village.mount.state.stag===null,null,{timeout:60000});
  // C2 (CONTAGION.md, capture and germination): the front at the green (the twelve dawns above) holds the first village: four village days on nothing but her leavings and it is hers (a lesser germ at its green, the second village untouched); that night its own snatcher takes an infant from a house to the sac grove at the green's edge, and the sac is drawn in its scene.
  report.c2=await page.evaluate(()=>{const v=window.__village,c=v.c2,before=c.state('village'),ms=Math.round(c.days(4)),after=c.state('village'),germ=v.growth.state.germs.find(g=>g.id==='germ:village')??null;return {before,after,ms,germ,villages:v.villages().map(x=>({id:x.id,held:x.held,turned:x.turned}))};});
  assert.ok(report.c2.before.held&&!report.c2.before.turned,`held at the twelfth dawn, not yet turned (${JSON.stringify(report.c2.before)})`);assert.ok(report.c2.after.turned&&report.c2.after.state==='turned'&&report.c2.after.darkDays>=3,`turned after four days on her leavings (${JSON.stringify(report.c2.after)})`);
  assert.ok(report.c2.germ&&Math.hypot(report.c2.germ.x,report.c2.germ.z)<1&&report.c2.germ.kind==='village',`a germ stands at its green (${JSON.stringify(report.c2.germ)})`);assert.ok(report.c2.villages.slice(1).every(x=>!x.turned),'the other villages are not hers');
  await page.evaluate(()=>{const v=window.__village;v.jumpTo('night');v.setTick(v.tick+95);v.standAt(0,-12,Math.PI);});
  await page.waitForFunction(()=>window.__village.c2.state('village').brood>=1,null,{timeout:60000});await page.waitForTimeout(1500);
  report.c2.sacs=await page.evaluate(()=>{const v=window.__village;let sacs=0;v.scene.traverse(o=>{if(o.name==='sac'){let p=o,seen=true;while(p){if(!p.visible)seen=false;p=p.parent;}if(seen)sacs++;}});return {sacs,brood:v.c2.state('village').brood,at:v.c2.state('village').sacs};});
  assert.ok(report.c2.sacs.sacs>=1&&report.c2.sacs.sacs>=report.c2.sacs.brood,`the sacs are drawn at the green's edge (${JSON.stringify(report.c2.sacs)})`);assert.ok(report.c2.sacs.at.every(p=>Math.hypot(p.x,p.z)<16),'on the green');
  await page.screenshot({path:`${out}/turned-green.png`,timeout:180000});
  // C3 (CONTAGION.md, the bulwark): three village days on clean meals alone (c3.clean fills the stores after each dawn's fouling, the heap banished) and the first village is itself again, its germ gone from the growth and its sacs gone from the green; made thriving and shrined (c3.thrive) it pushes the front: two dawns on and no claimed hub stands within VILLAGE_HOLD_R of its green, the lost lengths are on record for the map and its keeper knows the front drew back.
  report.c3=await page.evaluate(()=>{const v=window.__village,ms=Math.round(v.c3.clean('village',3)),s=v.c2.state('village'),germ=v.growth.state.germs.find(g=>g.id==='germ:village')??null;return {ms,turned:s.turned,held:s.held,brood:s.brood,germ,state:s.state,villages:v.villages().map(x=>({id:x.id,turned:x.turned}))};});
  assert.ok(!report.c3.turned&&report.c3.state!=='turned'&&report.c3.germ===null,`itself again after three clean days, its germ gone (${JSON.stringify(report.c3)})`);assert.equal(report.c3.brood,0,'the sacs drop empty');assert.ok(report.c3.villages.every(x=>!x.turned),'no village is hers');
  // The sac's mesh is hidden on the next frame's setSacs (a frame is seconds under SwiftShader).
  await page.waitForFunction(()=>{let sacs=0;window.__village.scene.traverse(o=>{if(o.name==='sac'){let p=o,seen=true;while(p){if(!p.visible)seen=false;p=p.parent;}if(seen)sacs++;}});return sacs===0;},null,{timeout:60000});report.c3.sacs=0;
  report.c3.thrive=await page.evaluate(()=>{const v=window.__village,t=v.c3.thrive('village'),steps=[];let ms=0,withered=0;for(let i=0;i<2;i++){ms+=v.growth.step(1);const n=v.growth.nearest(0,0),s=v.c2.state('village');withered+=v.growth.state.withered.length;steps.push({nearest:n?Math.round(n.d):null,state:s.state,needs:v.c3.needs('village'),held:s.held,germs:v.growth.state.germs.map(g=>g.id),withered:v.growth.state.withered.length,irritants:v.growth.inputs().irritants.length});}const n=v.growth.nearest(0,0);return {...t,ms:Math.round(ms),steps,nearest:n?n.d:null,withered,front:v.c3.front('village'),after:v.c2.state('village').state,held:v.c2.state('village').held};});
  assert.ok(report.c3.thrive.state==='thriving'&&report.c3.thrive.irritant&&report.c3.thrive.irritant.r===150,`thriving and shrined, an irritant of 150 m (${JSON.stringify(report.c3.thrive)})`);assert.ok(report.c3.thrive.nearest===null||report.c3.thrive.nearest>=150,`no claimed hub within 150 m of its green two dawns on (${JSON.stringify(report.c3.thrive)})`);assert.ok(!report.c3.thrive.held&&report.c3.thrive.after==='thriving','let go, and thriving still');assert.ok(report.c3.thrive.withered>0,'the lost lengths on record');assert.ok(report.c3.thrive.steps.every(x=>x.state==='thriving'&&!x.held&&x.nearest>=150),`thriving and unheld at both dawns (${JSON.stringify(report.c3.thrive.steps)})`);assert.ok(report.c3.thrive.front&&report.c3.thrive.front.pushed&&report.c3.thrive.front.d>=150,`its keeper was told the first push-back, the front standing off (${JSON.stringify(report.c3.thrive.front)})`);
  // D1 (DESCENT.md): down to the node, out onto the catwalk of its depth, a keeper heard, back into the drop.
  // PLATEAU.md: she wakes on the summit; the first dive waits on her cultivation, however much clarity she has.
  assert.equal(await page.evaluate(()=>{const v=window.__village;v.jumpTo('noon');v.karst.standOn('summit',-1.3,0.5,0);v.deep.clarity=v.deep.costs.dive+v.deep.costs.back+5;return v.deep.dive();}),false,'no first dive before she has cultivated');
  await page.evaluate(()=>{const v=window.__village;v.cult.grow(25);v.deep.dive();});
  await page.waitForFunction(()=>window.__village.mode==='deep'&&!document.getElementById('deepOut').closest('#deep').hidden,null,{timeout:120000});
  await page.click('#deepOut');await page.waitForFunction(()=>window.__village.mode==='catwalk',null,{timeout:10000});
  report.catwalk=await page.evaluate(()=>{const v=window.__village,w=v.deep.visit,n=v.deep.node(),f=v.player.feet();return {active:w.active,letter:w.catwalk.letter,feetY:f.y,dropY:n.y,deepHidden:document.getElementById('deep').hidden,interior:!v.scene.getObjectByName('vista')?.visible};});
  assert.ok(report.catwalk.active&&report.catwalk.letter==='R','the first catwalk, layer R');assert.ok(Math.abs(report.catwalk.feetY-(report.catwalk.dropY-0.95))<0.05,`she stands on its floor beneath the drop (${JSON.stringify(report.catwalk)})`);assert.ok(report.catwalk.deepHidden,'the node\'s panel is closed');
  await page.waitForTimeout(2500);await page.screenshot({path:`${out}/catwalk-out.png`,timeout:180000});
  await page.evaluate(()=>{const v=window.__village,w=v.deep.visit,c=w.catwalk,s=c.stations[0],o=w.world.root.position,r=c.wallR-0.6;v.player.teleport(o.x+Math.cos(s.angle)*r,o.z+Math.sin(s.angle)*r,Math.atan2(Math.cos(s.angle),Math.sin(s.angle))+Math.PI,o.y);});
  await page.waitForFunction(()=>window.__village.deep.visit.near==='listen'&&!document.getElementById('descentAct').hidden,null,{timeout:20000});
  await page.click('#descentAct');await page.waitForFunction(()=>!document.getElementById('descentBubble').hidden,null,{timeout:10000});
  report.keeper=await page.evaluate(()=>({act:document.getElementById('descentAct').textContent,said:document.getElementById('descentBubble').textContent,mode:window.__village.mode}));
  assert.equal(report.keeper.act,'listen to the snerk');assert.ok(report.keeper.said.length>10,'the snerk speaks');assert.equal(report.keeper.mode,'catwalk','she is still on the catwalk');
  await page.waitForTimeout(1500);await page.screenshot({path:`${out}/catwalk-snerk.png`,timeout:180000});
  // T5 (PLATEAU.md): the catwalk's portal to the outside world, opened with clarity on the board, a passage, and out at the island's foot; and back in by the island's portal.
  await page.evaluate(()=>{const v=window.__village,w=v.deep.visit,c=w.catwalk,o=w.world.root.position,a=c.portal.angle,r=c.wallR-0.6;v.deep.clarity=60;v.player.teleport(o.x+Math.cos(a)*r,o.z+Math.sin(a)*r,Math.atan2(Math.cos(a),Math.sin(a)),o.y);});
  await page.waitForFunction(()=>window.__village.deep.visit.near==='portal'&&document.getElementById('descentAct').textContent==='open the portal',null,{timeout:20000});
  await page.click('#descentAct');await page.waitForFunction(()=>window.__village.mode==='meditate'&&window.__village.deep.boardShown,null,{timeout:10000});
  await page.waitForTimeout(1500);await page.screenshot({path:`${out}/catwalk-portal.png`,timeout:180000});
  // Noah (2026-10-19): the last gems land while the board still cascades; the board must close when it is still, and the passage follow.
  assert.ok(await page.evaluate(()=>{const d=window.__village.deep;d.feed(d.portalGems-2);return d.busyFeed(2);}),'the last gems land mid-cascade');
  await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.karst.zone==='floor',null,{timeout:90000});
  await page.waitForFunction(()=>!window.__village.deep.boardShown&&document.getElementById('meditate').hidden,null,{timeout:20000});
  report.island=await page.evaluate(()=>{const v=window.__village,f=v.player.feet(),p=v.deep.islandPortal().world;return {d:Math.hypot(f.x-p.x,f.z-p.z),y:f.y,visit:v.deep.visit.active};});
  assert.ok(report.island.d<5&&!report.island.visit,`out of the portal at the island's foot (${JSON.stringify(report.island)})`);
  await page.waitForTimeout(2500);await page.screenshot({path:`${out}/island-portal.png`,timeout:180000});
  await page.waitForFunction(()=>!document.getElementById('portalAct').hidden,null,{timeout:20000});await page.click('#portalAct');
  await page.waitForFunction(()=>window.__village.mode==='meditate',null,{timeout:10000});await page.evaluate(()=>window.__village.deep.feed(window.__village.deep.portalGems));
  await page.waitForFunction(()=>window.__village.mode==='catwalk'&&window.__village.deep.visit.active,null,{timeout:90000});
  await page.evaluate(()=>{const v=window.__village,w=v.deep.visit,o=w.world.root.position,r=1.75;v.player.teleport(o.x+r,o.z,Math.PI/2,o.y);});
  await page.waitForFunction(()=>window.__village.deep.visit.near==='drop',null,{timeout:20000});await page.click('#descentAct');
  await page.waitForFunction(()=>window.__village.mode==='deep'&&!document.getElementById('deep').hidden,null,{timeout:10000});
  report.back=await page.evaluate(()=>({active:window.__village.deep.visit.active,act:document.getElementById('descentAct').hidden}));assert.ok(!report.back.active&&report.back.act,'back in the drop, the catwalk gone');
  await page.evaluate(()=>window.__village.deep.launch('pool'));await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:120000});
  // T8 (PLATEAU.md, the stratum): under the grass the rock is drawn beneath her, the fog closes within a few tens of metres and the sky and the far things are not drawn; once she is up, none of it is left.
  await page.evaluate(()=>{const v=window.__village;v.jumpTo('noon');v.sinkAt(6,34);});await page.waitForFunction(()=>window.__village.mode==='grass'&&window.__village.under>0.9,null,{timeout:90000});
  report.under=await page.evaluate(()=>window.__look.stratum());assert.ok(report.under.amount>0.9&&report.under.rock&&report.under.fogReach<40&&report.under.hidden.includes('sky'),`under the grass: the rock, a short fog, no sky (${JSON.stringify(report.under)})`);
  await page.waitForTimeout(1500);await page.screenshot({path:`${out}/under-grass.png`,timeout:180000});
  await page.evaluate(()=>window.__village.emerge());await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.under===0,null,{timeout:90000});
  report.surfaced=await page.evaluate(()=>window.__look.stratum());/* The green is her germ's nursery by now (the village turned above), whose gloom's fog closes to about 60 m (C1's hyphae alone left it about 140): still past the under fog's 24. */assert.ok(report.surfaced.amount===0&&!report.surfaced.rock&&report.surfaced.fogReach>40&&report.surfaced.hidden.length===0,`surfaced: nothing of it left (${JSON.stringify(report.surfaced)})`);
  report.hud=await page.evaluate(()=>document.getElementById('look-hud')?.textContent??'');
  assert.match(report.hud,/tris/);
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('village-vista browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
