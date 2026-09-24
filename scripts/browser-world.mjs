// Real controller crossings and sphere GPU/streaming checks. Run against production output.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const BASE=process.env.STUDY_BASE??'/Rootwake/village/',root=resolve('dist'),out=resolve('artifacts/world');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/')path='/village.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4188,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],report={};
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:4188'+BASE);await page.click('#begin');await page.waitForFunction(()=>window.__village?.character.status==='ready',null,{timeout:120000});
 await page.evaluate(()=>window.__village.renderer.setPixelRatio(1));
 for(const which of ['village','karst']){
  const route=await page.evaluate(which=>{const k=window.__village,c=which==='village'?{x:0,z:0}:k.karst.origin,inner=which==='village'?78:87,outer=inner+20;
   k.network.update(c.x,c.z);
   for(let a=0;a<Math.PI*2;a+=Math.PI/64){const dx=Math.cos(a),dz=Math.sin(a);let clear=true;for(let r=inner;r<=outer;r+=.25){const p={x:c.x+dx*r,z:c.z+dz*r};if(!k.canGrass(p.x,p.z)||k.network.aligned(p,{x:dx,z:dz},.8,.55)){clear=false;break;}}if(clear)return {x:c.x+dx*inner,z:c.z+dz*inner,dx,dz,yaw:Math.atan2(-dx,-dz)};}return null;},which);
  assert.ok(route,`an unobstructed ${which} boundary route`);
  await page.evaluate(r=>{const k=window.__village;k.sinkAt(r.x,r.z);k.player.yaw=r.yaw;},route);await page.waitForFunction(()=>window.__village.mode==='grass',null,{timeout:30000});
  await page.evaluate(()=>{const k=window.__village;window.__cross=[];let active=true;window.__stopCross=()=>active=false;function sample(){if(!active)return;const p=k.player.feet();window.__cross.push({x:p.x,y:p.y,z:p.z,mode:k.mode,under:k.under});requestAnimationFrame(sample);}sample();const w=document.getElementById('walk');w.dispatchEvent(new PointerEvent('pointerdown',{pointerId:81,clientX:315,clientY:710,pointerType:'touch',bubbles:true}));w.dispatchEvent(new PointerEvent('pointermove',{pointerId:81,clientX:315,clientY:672,pointerType:'touch',bubbles:true}));});
  await page.waitForFunction(r=>{const p=window.__village.player.feet();return (p.x-r.x)*r.dx+(p.z-r.z)*r.dz>18;},route,{timeout:120000});
  const samples=await page.evaluate(()=>{window.__stopCross();document.getElementById('walk').dispatchEvent(new PointerEvent('pointerup',{pointerId:81,clientX:315,clientY:672,pointerType:'touch',bubbles:true}));return window.__cross;});
  assert.ok(samples.length>20);assert.ok(samples.every(s=>s.mode==='grass'));
  let maxStep=0;for(let i=1;i<samples.length;i++)maxStep=Math.max(maxStep,Math.hypot(samples[i].x-samples[i-1].x,samples[i].y-samples[i-1].y,samples[i].z-samples[i-1].z));assert.ok(maxStep<.3,`no seam jump: ${maxStep}`);
  assert.ok(samples.at(-1).under>.95);await page.screenshot({path:`${out}/${which}-grass.png`});
  await page.evaluate(()=>window.__village.emerge());await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:30000});report[which]={frames:samples.length,maxStep};
 }
 // Enter a generated root using the real grass capture rule, then leave it with the shared exit.
 const rootRoute=await page.evaluate(()=>{const k=window.__village;k.network.update(220,220);const r=k.network.dynamic.find(r=>r.id.endsWith(':east'));const p=r.curve.getPointAt(.5),t=r.curve.getTangentAt(.5);k.sinkAt(p.x,p.z);k.player.yaw=Math.atan2(-t.x,-t.z);return r.id;});
 await page.waitForFunction(()=>window.__village.mode==='grass',null,{timeout:30000});
 await page.evaluate(()=>{const w=document.getElementById('walk');w.dispatchEvent(new PointerEvent('pointerdown',{pointerId:82,clientX:315,clientY:710,pointerType:'touch',bubbles:true}));w.dispatchEvent(new PointerEvent('pointermove',{pointerId:82,clientX:315,clientY:662,pointerType:'touch',bubbles:true}));});
 await page.waitForFunction(()=>window.__village.mode==='root',null,{timeout:30000});assert.equal(await page.evaluate(()=>window.__village.root.root),rootRoute);
 await page.evaluate(()=>{window.__village.player.cancelInput();window.__village.emerge();});await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:30000});
 report.generatedRoot=rootRoute;
 await page.goto('http://127.0.0.1:4188'+BASE+'planet.html');await page.waitForFunction(()=>window.__planet?.stats.pending===0&&window.__planet.stats.visible>6,null,{timeout:120000});
 const start=await page.evaluate(()=>window.__planet.pose);await page.click('#overview');await page.screenshot({path:out+'/planet-overview.png'});
 let peak=0;for(let i=0;i<24;i++){await page.evaluate(()=>{const k=window.__planet;k.step(2*Math.PI*k.world.radius/24);});await page.waitForTimeout(150);await page.waitForFunction(()=>window.__planet.stats.pending===0,null,{timeout:60000});const stats=await page.evaluate(()=>window.__planet.stats);peak=Math.max(peak,stats.resident);assert.ok(stats.resident<900);}
 const end=await page.evaluate(()=>window.__planet.pose);assert.ok(Math.hypot(start.up.x-end.up.x,start.up.y-end.up.y,start.up.z-end.up.z)<1e-8);
 report.planet={circuit:true,peakTiles:peak};await page.click('#overview');await page.screenshot({path:out+'/planet-ground.png'});
 assert.deepEqual(errors,[]);await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server.close();}
