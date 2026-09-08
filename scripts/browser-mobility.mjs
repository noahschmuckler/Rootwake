// Browser verification of the production bundle, including two simultaneous Pointer Events.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import assert from 'node:assert/strict';
const out='artifacts/mobility-v3';await mkdir(out,{recursive:true});
const root=resolve('dist');
const server=createServer(async(req,res)=>{
  try{
    let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/(?:lab\/)?/,'/');
    if(path==='/')path='/index.html';if(path==='/favicon.ico'){res.statusCode=204;res.end();return;}
    const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw new Error('Invalid path');
    res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));
  }catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(r=>server.listen(4174,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
async function rendered(page,count=2){const before=await page.evaluate(()=>window.__rootwake.renderer.info.render.frame);await page.waitForFunction(({before,count})=>window.__rootwake.renderer.info.render.frame>=before+count,{before,count},{timeout:60000});}
async function dispatch(page,selector,type,id,dx=0,dy=0){await page.evaluate(({selector,type,id,dx,dy})=>{const el=document.querySelector(selector),r=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',clientX:r.x+r.width/2+dx,clientY:r.y+r.height/2+dy,buttons:type==='pointerup'?0:1}));},{selector,type,id,dx,dy});}
async function frameStep(page,seconds,input){return page.evaluate(({seconds,input})=>{const r=window.__rootwake,p=r.player;for(let i=0;i<Math.ceil(seconds*120);i++)p.motor.update(1/120,p.movementWorld,input);p.position.x=p.motor.feet.x;p.position.z=p.motor.feet.z;p.yaw=p.motor.yaw;p.applyCamera(r.camera);return{feet:p.feet().toArray(),mode:p.motor.mode};},{seconds,input});}
try{
 const views=process.env.MOBILITY_SMOKE?[['phone',{width:430,height:932}]]:[['desktop',{width:1440,height:1000}],['phone',{width:430,height:932}],['landscape',{width:932,height:430}]];
 const selectedViews=process.env.MOBILITY_VIEW?views.filter(([name])=>name===process.env.MOBILITY_VIEW):views;
 assert.ok(selectedViews.length,'Unknown MOBILITY_VIEW');
 for(const[name,viewport]of selectedViews){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,isMobile:name!=='desktop',hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.stack));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:4174/lab.html?course=track');await page.waitForFunction(()=>!!window.__rootwake?.extras?.[0]?.course);await rendered(page);
  assert.equal(await page.locator('#lab-view').inputValue(),'track');
  for(const section of ['track','slalom','jumps','parkour','powered','flight']){
   await page.selectOption('#lab-view',section);await rendered(page);
   const state=await page.evaluate(()=>{const r=window.__rootwake,p=r.player;let invalid=0;r.scene.traverse(o=>{if(o.matrixWorld.elements.some(v=>!Number.isFinite(v)))invalid++;});return{feet:p.feet().toArray(),valid:p.movementWorld.canOccupy(p.feet(),.25,.72),invalid,mode:p.motor.mode};});
   assert.equal(state.invalid,0);assert.ok(state.valid,`${name} ${section}: ${JSON.stringify(state)}`);assert.equal(state.mode,'grounded');
   await page.screenshot({path:`${out}/${name}-${section}.png`});results.push({name,section,...state});console.log(`${name}: ${section} rendered with valid support`);
  }
  if(process.env.MOBILITY_SMOKE){assert.deepEqual(errors,[]);await page.close();continue;}
  await page.selectOption('#lab-view','track');await rendered(page);
  const before=await page.evaluate(()=>window.__rootwake.player.position.x);
  await dispatch(page,'#walk','pointerdown',11);await dispatch(page,'#walk','pointermove',11,0,-36);
  await page.waitForFunction(x=>window.__rootwake.player.position.x>x+.3,before,{timeout:30000});
  assert.equal(await page.evaluate(()=>window.__rootwake.player.targeting),false);
  await dispatch(page,'#walk','pointercancel',11);await rendered(page);assert.equal(await page.evaluate(()=>window.__rootwake.player.gesture.held),false);
  await page.evaluate(()=>{const p=window.__rootwake.player;p.teleport(74,7.5,-Math.PI/2);p.pitch=-.35;});await rendered(page);
  await dispatch(page,'#walk','pointerdown',12);await page.waitForFunction(()=>window.__rootwake.player.targets.length>0,null,{timeout:30000});
  const markers=await page.evaluate(()=>window.__rootwake.player.targets.map(t=>({depth:t.marker.material.depthTest,fog:t.marker.material.fog,order:t.marker.renderOrder,point:t.plan.to.toArray()})));
  assert.ok(markers.length>5);assert.ok(markers.every(m=>m.depth===false&&m.fog===false&&m.order>1000));
  await dispatch(page,'#walk','pointermove',12,0,-32);await rendered(page);
  assert.ok(await page.evaluate(()=>!!window.__rootwake.player.selectedTarget));await page.screenshot({path:`${out}/${name}-terrain-targets.png`});
  const stationary=await page.evaluate(()=>window.__rootwake.player.feet().toArray());await dispatch(page,'#walk','pointercancel',12);await rendered(page);
  const afterCancel=await page.evaluate(()=>window.__rootwake.player.feet().toArray());assert.ok(Math.hypot(afterCancel[0]-stationary[0],afterCancel[2]-stationary[2])<.03);
  await page.selectOption('#lab-view','jumps');await rendered(page);await page.evaluate(()=>window.__rootwake.player.teleport(64.5,-4.3,-Math.PI/2));await rendered(page);
  await dispatch(page,'#walk','pointerdown',13);await page.waitForFunction(()=>window.__rootwake.player.targets.length>0);
  await dispatch(page,'#walk','pointermove',13,0,-40);await rendered(page);
  const selection=await page.evaluate(()=>{const t=window.__rootwake.player.selectedTarget;return t?{kind:t.plan.kind,to:t.plan.to.toArray()}:null;});
  assert.ok(selection);assert.equal(selection.kind,'jump');await dispatch(page,'#walk','pointerup',13);
  await page.waitForFunction(()=>window.__rootwake.player.motor.mode==='grounded',null,{timeout:30000});
  const landing=await page.evaluate(()=>window.__rootwake.player.feet().toArray());assert.ok(Math.hypot(landing[0]-selection.to[0],landing[1]-selection.to[1],landing[2]-selection.to[2])<.08);
  await page.selectOption('#lab-view','flight');await rendered(page);await page.click('#trial-legs');assert.equal(await page.evaluate(()=>window.__rootwake.worn.legs),true);
  assert.equal(await page.evaluate(()=>window.__rootwake.player.poweredLegs),true);
  await page.evaluate(()=>{const el=document.querySelector('#walk'),r=el.getBoundingClientRect();const send=(type,id)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',clientX:r.x+r.width/2,clientY:r.y+r.height/2}));send('pointerdown',20);send('pointerup',20);send('pointerdown',21);});
  await page.waitForFunction(()=>window.__rootwake.player.isFlying,null,{timeout:30000});assert.equal(await page.locator('#flight-stick').isVisible(),true);
  await dispatch(page,'#flight-stick','pointerdown',22);await dispatch(page,'#flight-stick','pointermove',22,18,-28);await dispatch(page,'#walk','pointermove',21,15,-30);
  const flightBefore=await page.evaluate(()=>({y:window.__rootwake.player.feet().y,yaw:window.__rootwake.player.yaw,x:window.__rootwake.player.position.x}));await rendered(page,6);
  const flightAfter=await page.evaluate(()=>({y:window.__rootwake.player.feet().y,yaw:window.__rootwake.player.yaw,x:window.__rootwake.player.position.x}));
  assert.ok(flightAfter.y>flightBefore.y);assert.ok(flightAfter.yaw<flightBefore.yaw);assert.ok(flightAfter.x>flightBefore.x);
  await page.screenshot({path:`${out}/${name}-two-stick-flight.png`});
  await dispatch(page,'#walk','pointerup',21);assert.equal(await page.evaluate(()=>window.__rootwake.player.flightStick.held),true);
  await dispatch(page,'#flight-stick','pointerup',22);assert.equal(await page.evaluate(()=>window.__rootwake.player.flightStick.held),false);
  const idle={right:0,forward:0,lift:0,turn:0,held:false};
  let flight=await frameStep(page,1.5,idle);assert.equal(flight.mode,'hover');flight=await frameStep(page,1.5,idle);assert.ok(['descending','grounded'].includes(flight.mode));
  flight=await frameStep(page,20,idle);assert.equal(flight.mode,'grounded',`${name} automatic landing: ${JSON.stringify(flight)}`);
  await page.evaluate(()=>window.__rootwake.takeOff('chest'));assert.equal(await page.evaluate(()=>window.__rootwake.player.poweredLegs),false);
  assert.deepEqual(await page.evaluate(()=>window.__rootwake.worn),{chest:false,helm:false,legs:false});
  assert.deepEqual(errors,[],`${name} browser errors`);await page.close();console.log(`Passed ${name}: sections, analog, cancel, target jump, equipment and multi-touch hover.`);
 }
 if(!process.env.MOBILITY_SMOKE){
  for(const route of ['index.html','under.html']){
   const page=await browser.newPage({viewport:{width:430,height:932},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.stack));
   await page.goto('http://127.0.0.1:4174/'+route);await page.waitForFunction(()=>!!window.__rootwake?.player?.motor);await rendered(page);
   assert.equal(await page.locator('#walk .stick-puck').count(),1);assert.equal(await page.locator('#flight-stick').isVisible(),false);
   await dispatch(page,'#walk','pointerdown',31);await page.waitForFunction(()=>window.__rootwake.player.targeting);await dispatch(page,'#walk','pointercancel',31);assert.equal(await page.evaluate(()=>window.__rootwake.player.gesture.held),false);
   await page.screenshot({path:`${out}/phone-${route.replace('.html','')}.png`});assert.deepEqual(errors,[]);await page.close();
  }
 }
 await writeFile(`${out}/browser-results.json`,JSON.stringify({passed:true,results},null,2));console.log(`Mobility browser verification passed: ${results.length} course views.`);
}catch(error){
 for(const context of browser.contexts())for(const page of context.pages()){
  await page.screenshot({path:`${out}/failure-${page.viewportSize()?.width??0}.png`}).catch(()=>{});
  const state=await page.evaluate(()=>{const r=window.__rootwake,p=r?.player;return p?{feet:p.feet().toArray(),mode:p.motor.mode,yaw:p.yaw,gesture:p.gesture,flight:p.flightStick}:null;}).catch(()=>null);
  await writeFile(`${out}/failure-state.json`,JSON.stringify({error:String(error),state},null,2));
 }
 throw error;
}finally{await browser.close();await new Promise(r=>server.close(r));}
