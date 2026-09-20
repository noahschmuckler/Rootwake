import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/flow');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/flow\//,'/');if(path==='/')path='/flow.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4185,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
async function settle(page){await page.waitForFunction(()=>window.__clearing&&!window.__clearing.transitioning,null,{timeout:120000});await page.waitForTimeout(750);}
// A finger tap spans several animation frames; page.touchscreen.tap lands down and up inside one,
// which hid a per-frame input reset that swallowed every real tap and drag while the player was disabled.
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
async function drag(page,x,y,dx,dy,steps=8){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(8,x,y));for(let i=1;i<=steps;i++){await page.waitForTimeout(30);await canvas.dispatchEvent('pointermove',touch(8,x+dx*i/steps,y+dy*i/steps));}await canvas.dispatchEvent('pointerup',touch(8,x+dx,y+dy));}
const stick=async(page,id)=>({down:async(dx,dy)=>{await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.locator('#walk').dispatchEvent('pointermove',{pointerId:id,clientX:315+dx,clientY:710+dy,pointerType:'touch',bubbles:true});},up:async()=>{await page.locator('#walk').dispatchEvent('pointerup',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});}});
async function tapStick(page,id){await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.waitForTimeout(60);await page.locator('#walk').dispatchEvent('pointerup',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});}
async function doubleTapStick(page){await tapStick(page,21);await page.waitForTimeout(90);await tapStick(page,22);}
const mode=page=>page.evaluate(()=>window.__clearing.mode);
const waitMode=(page,m,timeout=30000)=>page.waitForFunction(m=>window.__clearing.mode===m,m,{timeout});
const stand=(page,x,z,yaw)=>page.evaluate(({x,z,yaw})=>{const c=window.__clearing;c.player.teleport(x,z,yaw);c.player.pitch=.08;},{x,z,yaw});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4185/Rootwake/flow/');await page.click('#begin');await page.waitForFunction(()=>window.__clearing);await page.waitForTimeout(800);await page.screenshot({path:out+'/01-clearing.png'});
 assert.equal(await mode(page),'ground');assert.equal(await page.evaluate(()=>window.__clearing.player.view),'third','Third person is native');
 // Walk: the stick moves her and she leaves a trail.
 const z0=await page.evaluate(()=>window.__clearing.player.feet().z);const s=await stick(page,1);await s.down(0,-38);await page.waitForFunction(z=>window.__clearing.player.feet().z<z-1.2,z0);await s.up();
 assert.ok(await page.evaluate(()=>Object.keys(window.__clearing.growth.trail).length>0),'Walking leaves a trail');
 // Press into a tree: she enters the trunk; keep pushing up to the crown.
 const t0=await page.evaluate(()=>window.__clearing.trees[0]);await stand(page,t0.x,t0.z+0.32*t0.size+0.6,0);await page.waitForTimeout(300);
 await s.down(0,-38);await waitMode(page,'trunk');await page.waitForTimeout(600);await page.screenshot({path:out+'/02-trunk.png'});
 await waitMode(page,'crown');await s.up();await page.waitForTimeout(500);await page.screenshot({path:out+'/03-crown.png'});
 // Slide round the crown, then leap to a neighbour by pushing toward it.
 const az0=await page.evaluate(()=>window.__clearing.crown.az);await s.down(38,0);await page.waitForTimeout(500);await s.up();assert.notEqual(await page.evaluate(()=>window.__clearing.crown.az),az0,'Sideways slides round the crown');
 const t1=await page.evaluate(()=>window.__clearing.trees[1]);await page.evaluate(({a,b})=>{window.__clearing.player.yaw=Math.atan2(-(b.x-a.x),-(b.z-a.z));},{a:t0,b:t1});await page.waitForTimeout(200);
 await s.down(0,-38);await waitMode(page,'hop');await page.waitForTimeout(450);await page.screenshot({path:out+'/04-hop.png'});await waitMode(page,'crown');await s.up();assert.equal(await page.evaluate(()=>window.__clearing.crown.tree),1,'Leapt to the neighbouring crown');
 // Down the trunk; at the ground keep pushing down: into the roots, and the ground goes glassy.
 await s.down(0,38);await waitMode(page,'trunk');await waitMode(page,'root',40000);await s.up();await page.waitForFunction(()=>window.__clearing.under>.6);await page.screenshot({path:out+'/05-roots.png'});
 const rs=await page.evaluate(()=>window.__clearing.root.s);await page.evaluate(()=>{const c=window.__clearing;c.player.yaw=0;});
 await s.down(0,-38);await page.waitForTimeout(900);await s.up();assert.notEqual(await page.evaluate(()=>window.__clearing.root.s),rs,'The stick travels the roots');
 // Double tap the stick: she rises and reforms on the ground.
 await doubleTapStick(page);await waitMode(page,'rise',5000);await waitMode(page,'ground',10000);assert.ok(await page.evaluate(()=>window.__clearing.player.feet().y>-.2));
 // Double tap the ground: she sinks and attaches to the nearest root; then out again.
 await press(page,195,420);await page.waitForTimeout(120);await press(page,195,420);await waitMode(page,'sink',5000);await waitMode(page,'root',10000);await doubleTapStick(page);await waitMode(page,'ground',10000);
 // Handholds: press into the wall and climb up to the ledge, then back down.
 await stand(page,5.5,-16+0.9,0);await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'climb');await page.waitForTimeout(500);await page.screenshot({path:out+'/06-climb.png'});await waitMode(page,'ground',30000);await s.up();
 assert.ok(await page.evaluate(()=>{const f=window.__clearing.player.feet();return f.z<-16&&f.y>5;}),'Topped out on the ledge');
 await stand(page,5.5,-16-0.9,Math.PI);await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'climb');await s.up();await s.down(0,38);await waitMode(page,'ground',30000);await s.up();assert.ok(await page.evaluate(()=>window.__clearing.player.feet().z>-16),'Climbed back down');
 // Blank stone: she becomes ivy and grows up it; the ivy stays, and next time it is a quick climb.
 await stand(page,-6,-16+0.9,0);await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'ivy');await s.up();assert.equal(await page.evaluate(()=>window.__clearing.ivy.grown),false);await page.waitForTimeout(1500);await page.screenshot({path:out+'/07-ivy.png'});
 await waitMode(page,'ground',30000);assert.ok(await page.evaluate(()=>window.__clearing.growth.ivy.includes(-2)),'The ivy is recorded');assert.ok(await page.evaluate(()=>window.__clearing.player.feet().y>5));
 await stand(page,-6,-16-0.9,Math.PI);await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'ivy');await s.up();await waitMode(page,'ground',30000);assert.ok(await page.evaluate(()=>window.__clearing.player.feet().z>-16),'Descended by the ivy');
 await stand(page,-6,-16+0.9,0);await page.waitForTimeout(300);const tIvy=Date.now();await s.down(0,-38);await waitMode(page,'ivy');assert.equal(await page.evaluate(()=>window.__clearing.ivy.grown),true,'Reconnects to grown ivy');await waitMode(page,'ground',30000);await s.up();assert.ok(Date.now()-tIvy<12000,'A grown climb is quick');
 await page.screenshot({path:out+'/08-ledge.png'});
 // Reload keeps the trail and the ivy.
 const saved=await page.evaluate(()=>window.__clearing.growth);await page.reload();await page.click('#begin');await page.waitForFunction(()=>window.__clearing);await page.waitForTimeout(500);const loaded=await page.evaluate(()=>window.__clearing.growth);assert.deepEqual(loaded.ivy,saved.ivy);assert.equal(Object.keys(loaded.trail).length,Object.keys(saved.trail).length);
 await stand(page,0.5,15,0);await page.waitForTimeout(400);await page.screenshot({path:out+'/09-trail.png'});
 for(const[name,size]of[['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await page.waitForTimeout(600);await page.screenshot({path:out+'/'+name+'.png'});}
 assert.deepEqual(errors,[]);report.push({passed:true,thirdPerson:true,trunk:true,crown:true,hop:true,roots:'down from the trunk and by ground double tap; out by stick double tap',climb:'up and down',ivy:'grown, kept, descended, reconnected',trail:true,saveReload:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const c=window.__clearing;return c?{mode:c.mode,feet:c.player.feet().toArray(),trunk:c.trunk,crown:c.crown,root:c.root,climb:c.climb,ivy:c.ivy}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
