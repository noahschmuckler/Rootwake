import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/root-study');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/root-study\//,'/');if(path==='/')path='/root-discovery.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4178,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
async function settle(page){await page.waitForFunction(()=>window.__rootStudy&&!window.__rootStudy.boardView.isBusy&&!window.__rootStudy.transitioning);await page.waitForTimeout(750);}
// A finger tap spans several animation frames; page.touchscreen.tap lands down and up inside one,
// which hid a per-frame input reset that swallowed every real tap and drag while the player was disabled.
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
async function drag(page,x,y,dx,dy,steps=8){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(8,x,y));for(let i=1;i<=steps;i++){await page.waitForTimeout(30);await canvas.dispatchEvent('pointermove',touch(8,x+dx*i/steps,y+dy*i/steps));}await canvas.dispatchEvent('pointerup',touch(8,x+dx,y+dy));}
async function tapMove(page,cells){
 const points=await page.evaluate(cells=>{const r=window.__rootStudy;return cells.map(cell=>{const mesh=r.boardView.group.children.find(x=>x.userData.gemId===r.board.grid[cell.row][cell.col].id);if(!mesh)throw Error('Stable board is missing a gem');const p=mesh.position.clone().set(0,0,0);mesh.localToWorld(p);p.project(r.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};});},cells);
 // Capture both positions before either tap: selection can itself finish a prior pair.
 for(const p of points)await press(page,p.x,p.y);
 await page.waitForTimeout(100);
 await page.waitForFunction(()=>!window.__rootStudy.boardView.isBusy);
}

try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4178/Rootwake/root-study/');await page.click('#begin');await settle(page);await page.screenshot({path:out+'/phone-surface.png'});
 const start=await page.evaluate(()=>window.__rootStudy.player.position.z);
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:1,clientX:315,clientY:710,pointerType:'touch',bubbles:true});
 await page.locator('#walk').dispatchEvent('pointermove',{pointerId:1,clientX:315,clientY:678,pointerType:'touch',bubbles:true});
 await page.waitForFunction(start=>window.__rootStudy.player.position.z<start-.3,start);
 await page.locator('#walk').dispatchEvent('pointercancel',{pointerId:1,pointerType:'touch'});
 assert.equal(await page.evaluate(()=>window.__rootStudy.player.gesture.held),false);
 // Hold the stick still for landing targets; the selected circle must stay an overlay on the uneven ground.
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:2,clientX:315,clientY:710,pointerType:'touch',bubbles:true});
 await page.waitForFunction(()=>window.__rootStudy.player.targeting);
 await page.locator('#walk').dispatchEvent('pointermove',{pointerId:2,clientX:315,clientY:686,pointerType:'touch',bubbles:true});
 await page.waitForFunction(()=>window.__rootStudy.player.selectedTarget!==null);await page.waitForTimeout(200);await page.screenshot({path:out+'/phone-targets.png'});
 await page.locator('#walk').dispatchEvent('pointercancel',{pointerId:2,pointerType:'touch'});
 await page.click('#vision');await settle(page);assert.equal(await page.locator('#deepen').isDisabled(),true);
 // Root vision is entered by sinking: the eye ends under the ground, the ground thinned into a roof.
 assert.equal(await page.evaluate(()=>window.__rootStudy.underground),true);
 assert.ok(await page.evaluate(()=>{const r=window.__rootStudy,c=r.camera.position;return c.y<r.groundHeight(c.x,c.z)-.5;}),'The eye must have sunk beneath the surface');
 await page.screenshot({path:out+'/phone-roots.png'});
 const lookBefore=await page.evaluate(()=>window.__rootStudy.camera.quaternion.toArray());
 await drag(page,195,300,70,-30);await page.waitForTimeout(100);
 assert.notDeepEqual(await page.evaluate(()=>window.__rootStudy.camera.quaternion.toArray()),lookBefore,'A real drag must look around under the soil');
 // The stick drifts where the eye looks: forward while looking down sinks and advances, and never breaks the roof.
 const feetBefore=await page.evaluate(()=>{window.__rootStudy.player.pitch=-.5;return window.__rootStudy.player.feet().toArray();});
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:3,clientX:315,clientY:710,pointerType:'touch',bubbles:true});
 await page.locator('#walk').dispatchEvent('pointermove',{pointerId:3,clientX:315,clientY:672,pointerType:'touch',bubbles:true});
 await page.waitForFunction(f=>{const p=window.__rootStudy.player.feet();return p.y<f[1]-.3&&Math.hypot(p.x-f[0],p.z-f[2])>.3;},feetBefore);
 await page.locator('#walk').dispatchEvent('pointercancel',{pointerId:3,pointerType:'touch'});
 assert.ok(await page.evaluate(()=>{const r=window.__rootStudy;return r.soil.canOccupy(r.player.feet(),.25,.72);}),'Drifting stays inside the soil volume');
 // A held stick lays drift targets in the view; releasing on one travels a straight line to it.
 await page.evaluate(()=>{window.__rootStudy.player.pitch=.15;});
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:4,clientX:315,clientY:710,pointerType:'touch',bubbles:true});
 await page.waitForFunction(()=>window.__rootStudy.player.targeting);
 await page.locator('#walk').dispatchEvent('pointermove',{pointerId:4,clientX:315,clientY:686,pointerType:'touch',bubbles:true});
 await page.waitForFunction(()=>window.__rootStudy.player.selectedTarget!==null);await page.waitForTimeout(200);await page.screenshot({path:out+'/phone-drift-targets.png'});
 assert.equal(await page.evaluate(()=>window.__rootStudy.player.selectedTarget.plan.kind),'drift');
 const driftTo=await page.evaluate(()=>window.__rootStudy.player.selectedTarget.plan.to.toArray());
 await page.locator('#walk').dispatchEvent('pointerup',{pointerId:4,clientX:315,clientY:686,pointerType:'touch',bubbles:true});
 await page.waitForFunction(t=>{const p=window.__rootStudy.player.feet();return Math.hypot(p.x-t[0],p.y-t[1],p.z-t[2])<.05&&window.__rootStudy.player.motor.mode==='free';},driftTo);
 // Look at the root tip (a drag would do the same), then a real tap on it listens.
 await page.evaluate(()=>{const r=window.__rootStudy,e=r.player.eye(),d=r.tipPoint.clone().sub(e);r.player.yaw=Math.atan2(-d.x,-d.z);r.player.pitch=Math.atan2(d.y,Math.hypot(d.x,d.z));});await page.waitForFunction(()=>{const r=window.__rootStudy,p=r.tipPoint.clone().project(r.camera);return Math.abs(p.x)<.05&&Math.abs(p.y)<.05;});
 const tip=await page.evaluate(()=>{const r=window.__rootStudy,p=r.tipPoint.clone().project(r.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};});await press(page,tip.x,tip.y);assert.equal(await page.evaluate(()=>window.__rootStudy.state.listened),true,'A real tap on the root tip must listen');
 await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/phone-board.png'});
 for(let i=0;i<55;i++){if(await page.evaluate(()=>window.__rootStudy.state.energy>=100))break;const cells=await page.evaluate(()=>window.__rootStudy.possibleMove());assert.equal(cells.length,2);await tapMove(page,cells);}
 assert.ok(await page.evaluate(()=>window.__rootStudy.state.energy>=100),'Real board taps must gather sap');
 await page.click('#done');await settle(page);const before=await page.evaluate(()=>window.__rootStudy.state.energy);await page.click('#widen');assert.equal(await page.evaluate(()=>window.__rootStudy.state.energy),before-24);await settle(page);await page.screenshot({path:out+'/phone-wide.png'});
 await page.click('#deepen');await settle(page);assert.equal(await page.evaluate(()=>window.__rootStudy.state.energy),before-72);await page.screenshot({path:out+'/phone-deep.png'});
 await page.click('#mend');await settle(page);assert.equal(await page.evaluate(()=>window.__rootStudy.state.restored),true);assert.equal(await page.evaluate(()=>window.__rootStudy.state.energy),before-96);await page.screenshot({path:out+'/phone-restored.png'});
 const saved=await page.evaluate(()=>window.__rootStudy.state);await page.reload();await settle(page);assert.deepEqual(await page.evaluate(()=>window.__rootStudy.state),saved);
 await page.click('#vision');await settle(page);
 for(const [name,size]of [['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await settle(page);await page.screenshot({path:out+'/'+name+'-roots.png'});await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/'+name+'-board.png'});await page.click('#done');await settle(page);}
 // Rising returns the same body to the surface, standing.
 await page.click('#vision');await settle(page);assert.equal(await page.evaluate(()=>window.__rootStudy.underground),false);assert.equal(await page.evaluate(()=>window.__rootStudy.player.motor.mode),'grounded');
 assert.ok(await page.evaluate(()=>{const r=window.__rootStudy,c=r.camera.position;return c.y>r.groundHeight(c.x,c.z);}),'The eye must be back above the ground');await page.screenshot({path:out+'/desktop-risen.png'});
 assert.deepEqual(errors,[]);const stats=await page.evaluate(()=>({calls:window.__rootStudy.renderer.info.render.calls,triangles:window.__rootStudy.renderer.info.render.triangles}));report.push({passed:true,realMatch3:true,movement:true,saveReload:true,spending:true,viewports:4,stats});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages())await p.screenshot({path:out+'/failure.png'}).catch(()=>{});throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
