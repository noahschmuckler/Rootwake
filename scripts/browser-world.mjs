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
 // Enter a generated root with the stick's single tap (R1: no root takes her by itself), leave it with a tap, then out.
 const singleTap=async()=>{await page.evaluate(()=>{const w=document.getElementById('walk');for(const type of ['pointerdown','pointerup'])w.dispatchEvent(new PointerEvent(type,{pointerId:23,clientX:315,clientY:710,pointerType:'touch',bubbles:true}));});await page.waitForTimeout(450);};
 const rootRoute=await page.evaluate(()=>{const k=window.__village;k.network.update(220,220);const r=k.network.dynamic.find(r=>r.id.endsWith(':east'));const p=r.curve.getPointAt(.5),t=r.curve.getTangentAt(.5);k.sinkAt(p.x,p.z);k.player.yaw=Math.atan2(-t.x,-t.z);return r.id;});
 await page.waitForFunction(()=>window.__village.mode==='grass',null,{timeout:30000});
 await singleTap();await page.waitForFunction(()=>window.__village.mode==='root',null,{timeout:30000});assert.equal(await page.evaluate(()=>window.__village.root.root),rootRoute);
 await singleTap();await page.waitForFunction(()=>window.__village.mode==='grass',null,{timeout:30000});
 await page.evaluate(()=>{window.__village.player.cancelInput();window.__village.emerge();});await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:30000});
 report.generatedRoot=rootRoute;
 // A course (R1): a place tapped on the map plots a way through the roots and the entry tree glows; a tap beside it sinks her in, the roots carry her to the place, and she rises out there.
 await page.evaluate(()=>{const k=window.__village;k.standAt(0,-16,Math.PI);k.openMap(true);});
 const target={x:40,z:-120},pt=await page.evaluate(t=>{const f=window.__village.player.feet();return {x:innerWidth/2+(t.x-f.x)*0.6,y:innerHeight/2+(t.z-f.z)*0.6};},target);
 for(const type of ['pointerdown','pointerup'])await page.locator('#mapwrap').dispatchEvent(type,{pointerId:91,clientX:pt.x,clientY:pt.y,pointerType:'touch',bubbles:true});
 const course=await page.evaluate(()=>window.__village.course);assert.ok(course&&course.roots.length>0,'a tap on the map plots a course');assert.ok(Math.hypot(course.target.x-target.x,course.target.z-target.z)<2,'to the place tapped');
 await page.screenshot({path:out+'/course-map.png'});await page.evaluate(()=>window.__village.openMap(false));
 const entry=await page.evaluate(()=>window.__village.wayIn());assert.ok(entry,'the entry tree glows');
 await page.evaluate(()=>{const k=window.__village,e=k.wayIn();k.standAt(e.x+5,e.z+5,Math.atan2(-(e.x-(e.x+5)),-(e.z-(e.z+5))));k.player.pitch=0.25;});await page.waitForTimeout(500);await page.screenshot({path:out+'/course-entry.png'});assert.ok(await page.locator('#labels .way').isVisible(),'the way in is named');
 await page.evaluate(()=>{const k=window.__village,e=k.wayIn();k.standAt(e.x+1.2,e.z+1.2,Math.atan2(-(e.x-(e.x+1.2)),-(e.z-(e.z+1.2))));});await page.waitForTimeout(300);
 await singleTap();await page.waitForFunction(()=>window.__village.mode==='root'&&window.__village.carried,null,{timeout:8000});await page.waitForTimeout(600);await page.screenshot({path:out+'/course-carried.png'});
 await page.waitForFunction(()=>window.__village.mode==='ground'&&!window.__village.course,null,{timeout:180000});
 const there=await page.evaluate(t=>{const f=window.__village.player.feet();return Math.hypot(f.x-t.x,f.z-t.z);},target);assert.ok(there<100,`she rises out near the place (${there.toFixed(0)} m off)`);report.course={roots:course.roots.length,length:course.length,off:there};
 await page.goto('http://127.0.0.1:4188'+BASE+'planet.html');await page.waitForFunction(()=>window.__planet?.stats.pending===0&&window.__planet.stats.visible>6,null,{timeout:120000});
 const start=await page.evaluate(()=>window.__planet.pose);await page.click('#overview');await page.screenshot({path:out+'/planet-overview.png'});
 let peak=0;for(let i=0;i<24;i++){await page.evaluate(()=>{const k=window.__planet;k.step(2*Math.PI*k.world.radius/24);});await page.waitForTimeout(150);await page.waitForFunction(()=>window.__planet.stats.pending===0,null,{timeout:60000});const stats=await page.evaluate(()=>window.__planet.stats);peak=Math.max(peak,stats.resident);assert.ok(stats.resident<900);}
 const end=await page.evaluate(()=>window.__planet.pose);assert.ok(Math.hypot(start.up.x-end.up.x,start.up.y-end.up.y,start.up.z-end.up.z)<1e-8);
 report.planet={circuit:true,peakTiles:peak};await page.click('#overview');await page.screenshot({path:out+'/planet-ground.png'});
 assert.deepEqual(errors,[]);await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();server.close();}
