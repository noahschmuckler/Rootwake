// The village under the vista's look (headless Chromium, SwiftShader): it boots past the intro, the vista's land is drawn and
// the chunks' own ground and trees are not, the land and the sky change with the clock, the deep hides the land, and no
// console or shader errors. Screenshots at a phone's portrait aspect land in artifacts/village-vista.
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
  const sky=()=>page.evaluate(()=>{const m=window.__village.scene.getObjectByName('sky').material.uniforms;return {zenith:m.uZenith.value.getHex(),stars:m.uStars.value,sun:m.uSunDir.value.y};});
  report.noon=await sky();
  await shot('night-green',()=>{const v=window.__village;v.jumpTo('night');v.setTick(v.tick+200);});
  report.night=await sky();
  assert.notEqual(report.noon.zenith,report.night.zenith,'the sky follows the clock');assert.ok(report.night.stars>0.5,'stars by night');
  await shot('dusk-karst',()=>{const v=window.__village;v.jumpTo('dusk');v.standAt(-60+160,-330+60,Math.atan2(160,60));});
  await shot('wood-noon',()=>{const v=window.__village;v.jumpTo('noon');v.standAt(120,60,0.4);});
  // C1 (CONTAGION.md): her growth creeps along the roots toward the first village: twelve fed dawns bring the front's nearest claimed hub to its green, ground she could cross on day 0 is hers, the land's tint is drawn again.
  report.growth=await page.evaluate(()=>{const v=window.__village,g=v.growth,bytes=window.__look.world.uniforms.uGround.value.image.data,sum=()=>{let s=0;for(let i=0;i<bytes.length;i+=97)s=(s+bytes[i])|0;return s;},probe=[];for(let x=-600;x<=600;x+=50)for(let z=-600;z<=600;z+=50)probe.push([x,z]);
    const read=()=>{const st=g.state;return {day:st.day,hyphae:st.hyphae.length,claimed:st.claimed.length,nearest:Math.round(g.nearest(0,0).d),sum:sum(),open:probe.filter(([x,z])=>!g.inGrowth(x,z)).length};};
    const before=read(),ms=Math.round(g.step(12)),after=read();return {before,after,ms};});
  assert.equal(report.growth.after.day,report.growth.before.day+12,`twelve dawns stepped (${JSON.stringify(report.growth)})`);
  assert.ok(report.growth.after.nearest<60,`the front's nearest hub within 60 m of the first village's green (${JSON.stringify(report.growth)})`);
  assert.ok(report.growth.after.open<report.growth.before.open,'ground open on day 0 is hers now');assert.notEqual(report.growth.after.sum,report.growth.before.sum,'the ground tint drawn again');
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
  report.hud=await page.evaluate(()=>document.getElementById('look-hud')?.textContent??'');
  assert.match(report.hud,/tris/);
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('village-vista browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
