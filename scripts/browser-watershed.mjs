import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/watershed');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/watershed\//,'/');if(path==='/')path='/watershed.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4183,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
async function settle(page){await page.waitForFunction(()=>window.__watershed&&!window.__watershed.boardView.isBusy&&!window.__watershed.transitioning);await page.waitForTimeout(750);}
// A finger tap spans several animation frames; page.touchscreen.tap lands down and up inside one,
// which hid a per-frame input reset that swallowed every real tap and drag while the player was disabled.
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
async function drag(page,x,y,dx,dy,steps=8){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(8,x,y));for(let i=1;i<=steps;i++){await page.waitForTimeout(30);await canvas.dispatchEvent('pointermove',touch(8,x+dx*i/steps,y+dy*i/steps));}await canvas.dispatchEvent('pointerup',touch(8,x+dx,y+dy));}
async function tapMove(page,cells){
 const points=await page.evaluate(cells=>{const r=window.__watershed;return cells.map(cell=>{const mesh=r.boardView.group.children.find(x=>x.userData.gemId===r.board.grid[cell.row][cell.col].id);if(!mesh)throw Error('Stable board is missing a gem');const p=mesh.position.clone().set(0,0,0);mesh.localToWorld(p);p.project(r.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};});},cells);
 // Capture both positions before either tap: selection can itself finish a prior pair.
 for(const p of points)await press(page,p.x,p.y);
 await page.waitForTimeout(100);
 await page.waitForFunction(()=>!window.__watershed.boardView.isBusy);
}
async function drive(page,id,reverse=false){
 await page.evaluate(({id,reverse})=>{const r=window.__watershed,e=r.edges.find(e=>e.id===id),points=e.curve.getSpacedPoints(Math.ceil(e.length/1.1));if(reverse)points.reverse();window.__drive={points,index:1,done:false,started:performance.now()};const stick=document.querySelector('#walk'),b=stick.getBoundingClientRect(),x=b.x+b.width/2,y=b.y+b.height/2;const send=(type,dy=0)=>stick.dispatchEvent(new PointerEvent(type,{pointerId:41,pointerType:'touch',clientX:x,clientY:y+dy,bubbles:true}));send('pointerdown');send('pointermove',-38);
 const step=()=>{const d=window.__drive,p=r.player.feet();while(d.index<d.points.length&&p.distanceTo(d.points[d.index])<.48)d.index++;if(d.index>=d.points.length){send('pointerup',-38);d.done=true;return;}const target=d.points[d.index],delta=target.clone().sub(p);r.player.yaw=Math.atan2(-delta.x,-delta.z);r.player.pitch=Math.atan2(delta.y,Math.hypot(delta.x,delta.z));if(performance.now()-d.started>45000){send('pointercancel');d.error={feet:p.toArray(),target:target.toArray(),index:d.index};return;}requestAnimationFrame(step);};step();},{id,reverse});
 await page.waitForFunction(()=>window.__drive.done||window.__drive.error,null,{timeout:50000});const error=await page.evaluate(()=>window.__drive.error);assert.equal(error,undefined,JSON.stringify(error));
 assert.ok(await page.evaluate(()=>{const r=window.__watershed;return r.soil.canOccupy(r.player.feet(),.25,.72);}));console.log('Traversed '+id+(reverse?' reverse':''));
}
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4183/Rootwake/watershed/?debug=1');await page.click('#begin');await settle(page);await page.screenshot({path:out+'/01-valley.png'});
 // The seasons run in real time while watching, at the chosen speed, and pause on the board.
 const day0=await page.evaluate(()=>window.__watershed.state.day);await page.click('#fast');await page.waitForTimeout(1500);const day1=await page.evaluate(()=>window.__watershed.state.day);assert.ok(day1>day0+.4,`6x advances the seasons (${day0} -> ${day1})`);
 await page.click('#pause');await page.waitForTimeout(600);const dayP=await page.evaluate(()=>window.__watershed.state.day);await page.waitForTimeout(600);assert.equal(await page.evaluate(()=>window.__watershed.state.day),dayP,'Pause holds the seasons');await page.click('#play');
 await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/02-board.png'});const dayB=await page.evaluate(()=>window.__watershed.state.day);
 for(let i=0;i<40;i++){if(await page.evaluate(()=>window.__watershed.state.sap>=44))break;await tapMove(page,await page.evaluate(()=>window.__watershed.possibleMove()));}
 assert.ok(await page.evaluate(()=>window.__watershed.state.sap>=44),'Multi-frame board touches earn sap');assert.equal(await page.evaluate(()=>window.__watershed.state.day),dayB,'The board pauses the seasons');await page.click('#done');await settle(page);
 // Enter the west grove's ring and cross by the fine root while it is open.
 assert.equal(await page.evaluate(()=>window.__watershed.state.shortcut),'open');
 await page.click('#enter');await settle(page);assert.equal(await page.evaluate(()=>window.__watershed.mode),'roots');await page.click('#pause');
 const look=await page.evaluate(()=>window.__watershed.player.yaw);await drag(page,190,290,60,20);assert.notEqual(await page.evaluate(()=>window.__watershed.player.yaw),look);await page.screenshot({path:out+'/03-entered.png'});
 await page.click('#orient');await page.waitForTimeout(900);
 // Halfway across, the dry season closes the root around the awareness: it withdraws but holds.
 await page.evaluate(()=>{const r=window.__watershed,e=r.edges.find(e=>e.fine),p=e.curve.getPointAt(.5);r.player.teleport(p.x,p.z,r.player.yaw,p.y);});await page.waitForTimeout(200);
 assert.equal(await page.evaluate(()=>window.__watershed.insideFine()),true);
 await page.evaluate(()=>{let g=0;while(window.__watershed.state.shortcut==='open'&&g++<200)window.__watershed.advance(.5);window.__watershed.advance(4);});
 assert.equal(await page.evaluate(()=>window.__watershed.state.shortcut),'closing','A withdrawing root holds while an awareness is inside');
 assert.ok(await page.evaluate(()=>{const r=window.__watershed;return r.soil.canOccupy(r.player.feet(),.25,.72);}),'The held passage stays occupiable');await page.screenshot({path:out+'/04-withdrawing.png'});
 await drive(page,'fine-root');await page.waitForTimeout(300);
 assert.equal(await page.evaluate(()=>window.__watershed.state.shortcut),'closing','Still held at the root\'s very end');
 // The deep route through the spring is always usable, in both directions. Once the awareness is on it, the fine root closes.
 await drive(page,'spring-east',true);assert.equal(await page.evaluate(()=>window.__watershed.insideFine()),false);
 await page.evaluate(()=>window.__watershed.advance(.05));assert.equal(await page.evaluate(()=>window.__watershed.state.shortcut),'closed','Once empty the fine root closes');
 assert.equal(await page.evaluate(()=>{const r=window.__watershed,e=r.edges.find(e=>e.fine);return r.soil.canOccupy(e.curve.getPointAt(.5),.25,.72);}),false,'A closed fine root cannot be entered');
 await page.screenshot({path:out+'/05-spring-closed.png'});await drive(page,'west-spring',true);
 assert.ok(await page.evaluate(()=>{const r=window.__watershed;return r.player.feet().distanceTo(r.nodes.west)<2.5;}));
 // Interventions are real purchases with visible consequences.
 const sap=await page.evaluate(()=>window.__watershed.state.sap);await page.click('#east');assert.equal(await page.evaluate(()=>window.__watershed.state.sap),sap-8);assert.equal(await page.evaluate(()=>window.__watershed.state.allocation),'east');
 await page.click('#basin');assert.equal(await page.evaluate(()=>window.__watershed.state.sap),sap-32);assert.equal(await page.evaluate(()=>window.__watershed.state.basin),true);
 await page.evaluate(()=>{let g=0;while(window.__watershed.state.shortcut!=='open'&&g++<400)window.__watershed.advance(.5);});assert.equal(await page.evaluate(()=>window.__watershed.state.shortcut),'open','Recovery regrows the fine root');
 await page.click('#enter');await settle(page);assert.equal(await page.evaluate(()=>window.__watershed.mode),'surface');await page.click('#play');await page.click('#orient');await page.waitForTimeout(1200);await page.screenshot({path:out+'/07-risen-basin.png'});
 // Help pauses the seasons; reload resumes the watershed and returns to the west grove.
 await page.click('#help');await page.waitForTimeout(300);const dayH=await page.evaluate(()=>window.__watershed.state.day);await page.waitForTimeout(900);assert.equal(await page.evaluate(()=>window.__watershed.state.day),dayH,'Help pauses the seasons');await page.click('#begin');
 await page.waitForTimeout(3500);const saved=await page.evaluate(()=>window.__watershed.state);await page.reload();await page.click('#begin');await settle(page);const loaded=await page.evaluate(()=>window.__watershed.state);
 assert.equal(loaded.basin,saved.basin);assert.equal(loaded.allocation,saved.allocation);assert.equal(loaded.sap,saved.sap);assert.ok(Math.abs(loaded.day-saved.day)<1.5,`day resumes (${saved.day} -> ${loaded.day})`);assert.equal(await page.evaluate(()=>window.__watershed.mode),'surface');
 assert.ok(await page.evaluate(()=>{const r=window.__watershed;return Math.hypot(r.player.position.x-r.groves.west.x,r.player.position.z-r.groves.west.z)<3;}),'Reload returns to the west grove');
 for(const[name,size]of[['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await settle(page);await page.screenshot({path:out+'/'+name+'-valley.png'});await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/'+name+'-board.png'});await page.click('#done');await settle(page);}
 assert.deepEqual(errors,[]);report.push({passed:true,multiframeMatch3:true,seasons:'live 6x, pause, board and help pause',routeSafety:'held while inside, closed when empty, deep route both ways',purchases:'lean east and basin',saveReload:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const r=window.__watershed;return r?{mode:r.mode,feet:r.player.feet().toArray(),state:r.state}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
