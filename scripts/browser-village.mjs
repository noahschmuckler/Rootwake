import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/village');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/Rootwake/village/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/')path='/village.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4187,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
const stick=(page,id)=>({down:async(dx,dy)=>{await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.locator('#walk').dispatchEvent('pointermove',{pointerId:id,clientX:315+dx,clientY:710+dy,pointerType:'touch',bubbles:true});},up:async()=>{await page.locator('#walk').dispatchEvent('pointerup',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.waitForTimeout(150);}});
const v=(page,expr)=>page.evaluate(expr);
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4187'+BASE);await page.click('#begin');await page.waitForFunction(()=>window.__village&&window.__village.character.status!=='loading',null,{timeout:120000});
 const character=await v(page,()=>window.__village.character);assert.equal(character.status,'ready',character.error);assert.deepEqual(character.roles,{idle:'idle',walk:'walking',run:'running'});assert.equal(character.hobbitWeights.filter(Boolean).length,8,'the eight hobbits have the clips too');
 assert.equal(await v(page,()=>window.__village.player.view),'third','Third person');assert.equal(await page.locator('#hint, #story, #actions button:visible').count(),0,'no hints');
 // Dawn: eight hobbits, all indoors; the clock reads day one, six o'clock or a little after.
 assert.equal(await v(page,()=>window.__village.hobbits.length),8);assert.equal(await v(page,()=>window.__village.houses.length),6);
 const start=await v(page,()=>({tick:window.__village.tick,inside:window.__village.count('inside'),clock:window.__village.clock}));assert.ok(start.tick<200,'starts at dawn on a fresh page');assert.equal(start.clock.day,1);
 await page.waitForTimeout(700);await page.screenshot({path:out+'/01-dawn.png'});
 // Hulda walks the meadow toward the green.
 const z0=await v(page,()=>window.__village.player.feet().z);const s=stick(page,1);await s.down(0,-38);await page.waitForFunction(z=>window.__village.player.feet().z>z+1.5,z0,{timeout:15000});await s.up();
 // Time passes only while watched: a real second is about 1.2 ticks.
 const t0=await v(page,()=>window.__village.tick);await page.waitForTimeout(3000);const t1=await v(page,()=>window.__village.tick);assert.ok(t1-t0>=2&&t1-t0<=6,`ticks in three seconds: ${t1-t0}`);
 // Morning: they are out at their places, walking with the walk clip, names over their heads when near.
 await v(page,()=>{window.__village.advance(200-window.__village.tick);window.__village.player.teleport(0,-5,Math.PI);window.__village.player.pitch=.05;});await page.waitForTimeout(1500);
 assert.equal(await v(page,()=>window.__village.count('inside')),0,'all out by morning');assert.equal(await v(page,()=>window.__village.figures.filter(f=>f.group.visible).length),8,'eight figures shown');
 await page.screenshot({path:out+'/02-morning.png'});
 const walked=await v(page,()=>new Promise(res=>{let best=0,n=0;const tick=()=>{const c=window.__village;for(let i=0;i<8;i++){const w=c.character.hobbitWeights[i];if(w&&c.shown[i].speed>.3)best=Math.max(best,w.walk+w.run);}if(++n<240&&best<.5)requestAnimationFrame(tick);else res(best);};tick();}));assert.ok(walked>.5,`a walking hobbit plays the walk clip (${walked.toFixed(2)})`);
 const labels=await v(page,()=>window.__village.shown.filter(s=>s.label).length);assert.ok(labels>=1,`${labels} names in view`);
 // Noon: together at the fire, talking; a thought bubble or two.
 await v(page,()=>{window.__village.advance(400-window.__village.tick);window.__village.player.teleport(0,-5,Math.PI);});await page.waitForTimeout(2500);
 const noon=await v(page,()=>({green:window.__village.count('green'),talking:window.__village.village.hobbits.filter(h=>h.activity==='talking').length,labels:window.__village.shown.filter(s=>s.label).length}));assert.ok(noon.green>=7,`${noon.green} at the fire at one o'clock`);assert.ok(noon.talking>=6);assert.ok(noon.labels>=5,`${noon.labels} names round the fire`);
 await page.screenshot({path:out+'/03-noon.png'});
 let bubbles=0;for(let i=0;i<12&&!bubbles;i++){await v(page,()=>window.__village.advance(20));await page.waitForTimeout(250);bubbles=await v(page,()=>window.__village.shown.filter(s=>s.bubble).length);}assert.ok(bubbles>=1,'someone says something at the fire');await page.screenshot({path:out+'/04-talk.png'});
 // Dusk and night: home, the fire lit, windows glowing.
 await v(page,()=>{window.__village.advance(900-window.__village.tick);});await page.waitForTimeout(2000);assert.equal(await v(page,()=>window.__village.count('inside')),8,'all home by night');assert.equal(await v(page,()=>window.__village.figures.filter(f=>f.group.visible).length),0,'nobody shown indoors');
 await page.screenshot({path:out+'/05-night.png'});
 // A second dawn: out again.
 await v(page,()=>{window.__village.advance(window.__village.dayTicks+200-window.__village.tick);});await page.waitForTimeout(1500);assert.equal(await v(page,()=>window.__village.clock.day),2);assert.equal(await v(page,()=>window.__village.count('inside')),0,'day two, all out again');
 // Reload keeps the village's day; nothing passed while the page was away.
 const before=await v(page,()=>window.__village.tick);await page.reload();await page.click('#begin');await page.waitForFunction(()=>window.__village);await page.waitForTimeout(500);const after=await v(page,()=>window.__village.tick);assert.ok(after>=before&&after-before<10,`kept its day (${before} → ${after})`);
 for(const[name,size]of[['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await page.waitForTimeout(600);await page.screenshot({path:out+'/'+name+'.png'});}
 assert.deepEqual(errors,[]);report.push({passed:true,hobbits:8,houses:6,rhythm:'dawn out, noon at the fire, night home, day two',clips:'Hulda and the eight hobbits on one skeleton',labels:true,bubbles:true,pausesWhenHidden:'ticks only while watched',saveReload:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const c=window.__village;return c?{tick:c.tick,phase:c.phase,inside:c.count('inside'),green:c.count('green'),status:c.character.status}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
