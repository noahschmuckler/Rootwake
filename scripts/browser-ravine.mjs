import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/ravine');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/ravine\//,'/');if(path==='/')path='/ravine.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4182,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
async function settle(page){await page.waitForFunction(()=>window.__ravine&&!window.__ravine.boardView.isBusy&&!window.__ravine.transitioning);await page.waitForTimeout(750);}
// A finger tap spans several animation frames; page.touchscreen.tap lands down and up inside one,
// which hid a per-frame input reset that swallowed every real tap and drag while the player was disabled.
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
async function drag(page,x,y,dx,dy,steps=8){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(8,x,y));for(let i=1;i<=steps;i++){await page.waitForTimeout(30);await canvas.dispatchEvent('pointermove',touch(8,x+dx*i/steps,y+dy*i/steps));}await canvas.dispatchEvent('pointerup',touch(8,x+dx,y+dy));}
async function tapMove(page,cells){
 const points=await page.evaluate(cells=>{const r=window.__ravine;return cells.map(cell=>{const mesh=r.boardView.group.children.find(x=>x.userData.gemId===r.board.grid[cell.row][cell.col].id);if(!mesh)throw Error('Stable board is missing a gem');const p=mesh.position.clone().set(0,0,0);mesh.localToWorld(p);p.project(r.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};});},cells);
 // Capture both positions before either tap: selection can itself finish a prior pair.
 for(const p of points)await press(page,p.x,p.y);
 await page.waitForTimeout(100);
 await page.waitForFunction(()=>!window.__ravine.boardView.isBusy);
}
async function drive(page,id,reverse=false){
 await page.evaluate(({id,reverse})=>{const r=window.__ravine,e=r.edges.find(e=>e.id===id),points=e.curve.getSpacedPoints(Math.ceil(e.length/1.1));if(reverse)points.reverse();window.__drive={points,index:1,done:false,started:performance.now()};const stick=document.querySelector('#walk'),b=stick.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+b.height/2;const send=(type,dy=0)=>stick.dispatchEvent(new PointerEvent(type,{pointerId:41,pointerType:'touch',clientX:x,clientY:y+dy,bubbles:true}));send('pointerdown');send('pointermove',-38);
 const step=()=>{const d=window.__drive,p=r.player.feet();while(d.index<d.points.length&&p.distanceTo(d.points[d.index])<.48)d.index++;if(d.index>=d.points.length){send('pointerup',-38);d.done=true;return;}const target=d.points[d.index],delta=target.clone().sub(p);r.player.yaw=Math.atan2(-delta.x,-delta.z);r.player.pitch=Math.atan2(delta.y,Math.hypot(delta.x,delta.z));if(performance.now()-d.started>45000){send('pointercancel');d.error={feet:p.toArray(),target:target.toArray(),index:d.index};return;}requestAnimationFrame(step);};step();},{id,reverse});
 await page.waitForFunction(()=>window.__drive.done||window.__drive.error,null,{timeout:50000});const error=await page.evaluate(()=>window.__drive.error);assert.equal(error,undefined,JSON.stringify(error));
 assert.ok(await page.evaluate(()=>{const r=window.__ravine;return r.soil.canOccupy(r.player.feet(),.25,.72);}));console.log('Traversed '+id+(reverse?' reverse':''));
}
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4182/Rootwake/ravine/');await page.click('#begin');await settle(page);await page.screenshot({path:out+'/01-oak.png'});
 await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/02-board.png'});
 for(let i=0;i<35;i++){if(await page.evaluate(()=>window.__ravine.state.sap>=36))break;await tapMove(page,await page.evaluate(()=>window.__ravine.possibleMove()));}
 assert.ok(await page.evaluate(()=>window.__ravine.state.sap>=36),'Multi-frame board touches earn sap');await page.click('#done');await settle(page);
 await page.click('#enter');await settle(page);assert.equal(await page.evaluate(()=>window.__ravine.mode),'roots');
 const look=await page.evaluate(()=>window.__ravine.player.yaw);await drag(page,190,290,60,20);assert.notEqual(await page.evaluate(()=>window.__ravine.player.yaw),look);await page.screenshot({path:out+'/03-entered.png'});
 await drive(page,'oak-fork');await page.click('#orient');await page.waitForTimeout(1100);await page.screenshot({path:out+'/04-fork.png'});
 // Tending is a real purchase, never required to reach the fern by the living route.
 const sap=await page.evaluate(()=>window.__ravine.state.sap);await page.click('#tend');assert.equal(await page.evaluate(()=>window.__ravine.state.sap),sap-12);
 await drive(page,'short-root');await drive(page,'short-root',true);await drive(page,'spring-way');await page.waitForFunction(()=>window.__ravine.state.spring);await page.screenshot({path:out+'/05-spring.png'});await drive(page,'spring-fern');
 assert.equal(await page.evaluate(()=>{const r=window.__ravine;return r.soil.canOccupy(r.nodes.under,.25,.72);}),false,'Gate cannot be bypassed by drift');
 await page.click('#listen');assert.equal(await page.evaluate(()=>window.__ravine.state.heard),true);const before=await page.evaluate(()=>window.__ravine.state.sap);await page.click('#commune');assert.equal(await page.evaluate(()=>window.__ravine.state.sap),before-24);await page.screenshot({path:out+'/06-communion.png'});
 await drive(page,'fine-descent');await page.screenshot({path:out+'/07-beneath-river.png'});await drive(page,'far-ascent');await page.waitForTimeout(400);await page.screenshot({path:out+'/08-far-root.png'});
 await page.click('#manifest');await settle(page);assert.equal(await page.evaluate(()=>window.__ravine.mode),'dryad');assert.equal(await page.evaluate(()=>window.__ravine.state.arrived),true);assert.ok(await page.evaluate(()=>window.__ravine.player.feet().x>5));await page.click('#orient');await page.waitForTimeout(1300);await page.screenshot({path:out+'/09-look-back.png'});
 const remaining=await page.evaluate(()=>window.__ravine.manifestRemaining);await page.click('#help');await page.waitForTimeout(1000);assert.ok(Math.abs(await page.evaluate(()=>window.__ravine.manifestRemaining)-remaining)<.2,'Help pauses manifestation');await page.click('#begin');
 await page.click('#enter');await settle(page);assert.equal(await page.evaluate(()=>window.__ravine.mode),'roots');assert.ok(await page.evaluate(()=>{const r=window.__ravine;return r.soil.canOccupy(r.player.feet(),.25,.72);}));
 const saved=await page.evaluate(()=>window.__ravine.state);await page.reload();await page.click('#begin');await settle(page);assert.deepEqual(await page.evaluate(()=>window.__ravine.state),saved);assert.equal(await page.evaluate(()=>window.__ravine.mode),'surface');
 for(const[name,size]of[['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await settle(page);await page.screenshot({path:out+'/'+name+'-surface.png'});await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/'+name+'-board.png'});await page.click('#done');await settle(page);}
 assert.deepEqual(errors,[]);report.push({passed:true,multiframeMatch3:true,rootTravel:'both branches and crossing',speciesGate:true,saveReload:true,manifestation:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const r=window.__ravine;return r?{mode:r.mode,feet:r.player.feet().toArray(),state:r.state}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
