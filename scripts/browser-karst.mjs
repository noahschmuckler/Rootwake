import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/karst');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/karst\//,'/');if(path==='/')path='/karst.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4184,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
async function settle(page){await page.waitForFunction(()=>window.__karst&&!window.__karst.transitioning);await page.waitForTimeout(750);}
// A finger tap spans several animation frames; page.touchscreen.tap lands down and up inside one,
// which hid a per-frame input reset that swallowed every real tap and drag while the player was disabled.
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
async function drag(page,x,y,dx,dy,steps=8){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(8,x,y));for(let i=1;i<=steps;i++){await page.waitForTimeout(30);await canvas.dispatchEvent('pointermove',touch(8,x+dx*i/steps,y+dy*i/steps));}await canvas.dispatchEvent('pointerup',touch(8,x+dx,y+dy));}
async function tapMove(page,cells){
 const points=await page.evaluate(cells=>{const r=window.__karst;return cells.map(cell=>{const mesh=r.boardView.group.children.find(x=>x.userData.gemId===r.board.grid[cell.row][cell.col].id);if(!mesh)throw Error('Stable board is missing a gem');const p=mesh.position.clone().set(0,0,0);mesh.localToWorld(p);p.project(r.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};});},cells);
 for(const p of points)await press(page,p.x,p.y);
 await page.waitForTimeout(100);await page.waitForFunction(()=>!window.__karst.boardView.isBusy);
}
async function rideTo(page,rootId){
 await page.click(`#rides button[data-root="${rootId}"]`);await page.waitForFunction(()=>window.__karst.mode==='ride');
 const top=await page.evaluate(()=>new Promise(res=>{let top=0;const tick=()=>{const r=window.__karst.ride;if(!r){res(top);return;}top=Math.max(top,r.speed);requestAnimationFrame(tick);};tick();}));
 await page.waitForFunction(()=>window.__karst.mode==='arrive',null,{timeout:90000});return top;
}
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4184/Rootwake/karst/?debug=1');await page.click('#begin');await settle(page);
 assert.equal(await page.evaluate(()=>window.__karst.zone),'summit');assert.ok(await page.evaluate(()=>window.__karst.player.feet().y>window.__karst.pillarHeight-.5),'Wakes on the top');await page.screenshot({path:out+'/01-summit.png'});
 // The top is narrow: the stick cannot walk off it.
 await page.evaluate(()=>{window.__karst.player.yaw=0;});
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:1,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.locator('#walk').dispatchEvent('pointermove',{pointerId:1,clientX:315,clientY:672,pointerType:'touch',bubbles:true});
 await page.waitForTimeout(2500);await page.locator('#walk').dispatchEvent('pointercancel',{pointerId:1,pointerType:'touch'});
 assert.ok(await page.evaluate(()=>{const f=window.__karst.player.feet();return Math.hypot(f.x,f.z)<=3.25&&f.y>window.__karst.pillarHeight-.5;}),'Held on the summit');
 // Root vision: the limestone goes glassy; the roots are visible through it.
 await page.click('#vision');await page.waitForFunction(()=>window.__karst.vision>.9);await page.click('#orient');await page.waitForTimeout(1200);await page.screenshot({path:out+'/02-root-vision.png'});
 const look=await page.evaluate(()=>window.__karst.player.yaw);await drag(page,190,330,70,10);assert.notEqual(await page.evaluate(()=>window.__karst.player.yaw),look,'A real drag looks around');
 // Commune with the pine: shrink to its root mouth, then choose a root.
 await page.evaluate(()=>{const r=window.__karst,p=r.plants.pine;r.player.teleport(p.stand.x,p.stand.z,p.stand.yaw);});await page.waitForTimeout(300);
 await page.click('#commune');await page.waitForFunction(()=>window.__karst.mode==='choose');await page.screenshot({path:out+'/03-choose.png'});
 assert.equal(await page.locator('#rides button').count(),3,'The pine has three roots, one dormant');assert.ok(await page.locator('#rides button[data-root="taproot"]').isDisabled(),'The taproot is dormant until tended');
 // Slide down the east face, then into the stone, to the cavern.
 const slide=await rideTo(page,'pine-east');assert.ok(slide>6,`downhill slide reached ${slide.toFixed(1)} m/s`);assert.equal(await page.evaluate(()=>window.__karst.at),'eastShrub');await page.screenshot({path:out+'/04-arrived-east.png'});
 await rideTo(page,'east-cavern');assert.equal(await page.evaluate(()=>window.__karst.at),'cavernFern');
 await page.click('#emerge');await settle(page);assert.equal(await page.evaluate(()=>window.__karst.mode),'surface');assert.equal(await page.evaluate(()=>window.__karst.zone),'cavern');
 await page.evaluate(()=>{window.__karst.player.yaw=2.4;window.__karst.player.pitch=.1;});await page.waitForTimeout(400);await page.screenshot({path:out+'/05-cavern.png'});
 // Look during a ride is a real drag; then down to the floor.
 await page.click('#commune');await page.waitForFunction(()=>window.__karst.mode==='choose');await page.click('#rides button[data-root="cavern-floor"]');await page.waitForFunction(()=>window.__karst.mode==='ride');
 const yawBefore=await page.evaluate(()=>window.__karst.player.yaw);await drag(page,190,330,80,0);assert.notEqual(await page.evaluate(()=>window.__karst.player.yaw),yawBefore,'Looking around while riding');await page.screenshot({path:out+'/06-riding.png'});
 await page.waitForFunction(()=>window.__karst.mode==='arrive',null,{timeout:90000});assert.equal(await page.evaluate(()=>window.__karst.state.reachedFloor),true);
 await page.click('#emerge');await settle(page);assert.equal(await page.evaluate(()=>window.__karst.zone),'floor');await page.click('#orient');await page.waitForTimeout(1200);await page.evaluate(()=>{window.__karst.player.pitch=.55;});await page.waitForTimeout(300);await page.screenshot({path:out+'/07-floor-look-up.png'});
 // The forest floor has the earlier studies in it. Pause the seasons while the scripted checks run.
 await page.click('#pause');
 // Sink into the soil and drift where you look; the floor is a roof, the pillar's foot a wall; then rise.
 await page.click('#sink');await settle(page);assert.equal(await page.evaluate(()=>window.__karst.mode),'soil');
 assert.ok(await page.evaluate(()=>{const r=window.__karst,f=r.player.feet();return f.y<-1&&r.soil.canOccupy(f,.25,.72);}),'Sunk into occupiable soil');await page.screenshot({path:out+'/08-soil.png'});
 const feetBefore=await page.evaluate(()=>{window.__karst.player.pitch=-.4;return window.__karst.player.feet().toArray();});
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:3,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.locator('#walk').dispatchEvent('pointermove',{pointerId:3,clientX:315,clientY:672,pointerType:'touch',bubbles:true});
 await page.waitForFunction(f=>{const p=window.__karst.player.feet();return p.y<f[1]-.3&&Math.hypot(p.x-f[0],p.z-f[2])>.3;},feetBefore);await page.locator('#walk').dispatchEvent('pointercancel',{pointerId:3,pointerType:'touch'});
 assert.ok(await page.evaluate(()=>{const r=window.__karst;return r.soil.canOccupy(r.player.feet(),.25,.72);}),'Drifting stays inside the soil');
 await page.click('#sink');await settle(page);assert.equal(await page.evaluate(()=>window.__karst.mode),'surface');assert.ok(await page.evaluate(()=>window.__karst.player.feet().y>-.3),'Rose to the surface');
 // Cultivate sap on the original board, then spend it: tend the taproot, lean the spring, the basin.
 await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/09-board.png'});
 for(let i=0;i<45;i++){if(await page.evaluate(()=>window.__karst.state.sap>=52))break;await tapMove(page,await page.evaluate(()=>window.__karst.possibleMove()));}
 assert.ok(await page.evaluate(()=>window.__karst.state.sap>=52),'Multi-frame board touches earn sap');await page.click('#done');await settle(page);
 const sap=await page.evaluate(()=>window.__karst.state.sap);await page.click('#tend');assert.equal(await page.evaluate(()=>window.__karst.state.tended),true);assert.equal(await page.evaluate(()=>window.__karst.state.sap),sap-12);
 await page.click('#west');assert.equal(await page.evaluate(()=>window.__karst.state.w.allocation),'west');assert.equal(await page.evaluate(()=>window.__karst.state.sap),sap-20);
 await page.click('#basin');assert.equal(await page.evaluate(()=>window.__karst.state.w.basin),true);assert.equal(await page.evaluate(()=>window.__karst.state.sap),sap-44);await page.screenshot({path:out+'/10-tended.png'});
 // Under stress the fine roots withdraw: the foot root and the taproot cannot be entered; the deep roots can.
 await page.evaluate(()=>{const r=window.__karst,p=r.plants.floorMaple;r.player.teleport(p.stand.x,p.stand.z,p.stand.yaw);});await page.waitForTimeout(300);
 await page.evaluate(()=>{let g=0;while(window.__karst.state.w.shortcut==='open'&&g++<600)window.__karst.advance(.5);});
 assert.notEqual(await page.evaluate(()=>window.__karst.state.w.shortcut),'open');
 await page.click('#commune');await page.waitForFunction(()=>window.__karst.mode==='choose');
 assert.ok(await page.locator('#rides button[data-root="taproot"]').isDisabled(),'A withdrawn taproot cannot be ridden');assert.ok(await page.locator('#rides button[data-root="foot-root"]').isDisabled());assert.ok(!await page.locator('#rides button[data-root="west-floor"]').isDisabled(),'The deep root still serves');
 await page.screenshot({path:out+'/11-withdrawn.png'});await page.click('#emerge');await settle(page);
 // Recovery regrows them; then the taproot is the fastest way up: maple to pine in one climb.
 await page.evaluate(()=>{let g=0;while(window.__karst.state.w.shortcut!=='open'&&g++<800)window.__karst.advance(.5);});assert.equal(await page.evaluate(()=>window.__karst.state.w.shortcut),'open');
 await page.click('#commune');await page.waitForFunction(()=>window.__karst.mode==='choose');
 const climb=await rideTo(page,'taproot');assert.ok(climb<6.5,`uphill climb stayed slow (${climb.toFixed(1)} m/s)`);assert.equal(await page.evaluate(()=>window.__karst.at),'pine');assert.equal(await page.evaluate(()=>window.__karst.state.returned),true,'Returned to the summit from below');
 await page.click('#emerge');await settle(page);assert.equal(await page.evaluate(()=>window.__karst.zone),'summit');await page.click('#play');await page.screenshot({path:out+'/12-returned.png'});
 // Reload resumes at the last plant with everything met.
 await page.click('#pause');await page.waitForTimeout(200);const saved=await page.evaluate(()=>window.__karst.state);assert.equal(saved.visited.length,5);await page.reload();await page.click('#begin');await settle(page);const loaded=await page.evaluate(()=>window.__karst.state);assert.deepEqual(loaded.visited,saved.visited);assert.equal(loaded.tended,true);assert.equal(loaded.w.basin,true);assert.equal(loaded.sap,saved.sap);assert.equal(await page.evaluate(()=>window.__karst.zone),'summit');
 for(const[name,size]of[['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await settle(page);await page.screenshot({path:out+'/'+name+'-summit.png'});await page.click('#commune');await page.waitForFunction(()=>window.__karst.mode==='choose');await page.screenshot({path:out+'/'+name+'-choose.png'});await page.click('#emerge');await settle(page);}
 assert.deepEqual(errors,[]);report.push({passed:true,summitHeld:true,rootVision:true,rides:'slide, into the stone, cavern, floor, taproot climb, return',lookWhileRiding:true,soil:'sink, drift, rise',board:true,purchases:'tend, lean, basin',withdrawal:'fine roots gated by the ledger',saveReload:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const r=window.__karst;return r?{mode:r.mode,at:r.at,zone:r.zone,feet:r.player.feet().toArray(),state:r.state}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
