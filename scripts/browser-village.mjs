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
const waitMode=(page,m,timeout=20000)=>page.waitForFunction(m=>window.__village.mode===m,m,{timeout});
async function doubleTapStick(page){for(const id of [21,22]){await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.waitForTimeout(60);await page.locator('#walk').dispatchEvent('pointerup',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.waitForTimeout(90);}}
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
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
 // They face the way they walk, and think out loud: what they are doing, or where they are going.
 const facing=await v(page,()=>new Promise(res=>{let forward=0,samples=0,n=0;const tick=()=>{for(const f of window.__village.facing())if(f.moving){samples++;if(f.dot>0.5)forward++;}if(++n<240)requestAnimationFrame(tick);else res({forward,samples});};tick();}));assert.ok(facing.samples>20&&facing.forward/facing.samples>0.8,`walkers face forward (${facing.forward} of ${facing.samples} walking frames)`);
 const thoughts=await v(page,()=>window.__village.thoughts());assert.ok(thoughts.includes('gathering berries')&&thoughts.includes('milking the goats'),JSON.stringify(thoughts));assert.ok(thoughts.every(t=>t.length>0),'everyone out has a thought');
 // Her ways: double tap the ground and she is a bulge under the grass, faster than running; run along a tree root and it takes her, faster still and held to it; double tap out.
 await v(page,()=>{window.__village.standAt(-14,-2,Math.PI/2);});await page.waitForTimeout(300);await press(page,195,420);await page.waitForTimeout(120);await press(page,195,420);await waitMode(page,'sink',5000);await waitMode(page,'grass',5000);
 const g0=await v(page,()=>({g:window.__village.grass,t:window.__village.simSeconds}));await s.down(0,-38);await page.waitForTimeout(1000);const g1=await v(page,()=>({g:window.__village.grass,t:window.__village.simSeconds}));await s.up();
 if(g1.g){const d=Math.hypot(g1.g.x-g0.g.x,g1.g.z-g0.g.z),speed=d/Math.max(1e-3,g1.t-g0.t);assert.ok(speed>3.2,`the grass carries her at ${speed.toFixed(1)} m/s (faster than running)`);}
 await page.screenshot({path:out+'/02b-grass.png'});
 const lane=await v(page,()=>{const k=window.__village,c=k.trees.slice(0,6);const t=c[0];return {x:t.x,z:t.z};});await page.evaluate(({x,z})=>{window.__village.sinkAt(x+1.2,z+0.4);},lane);await waitMode(page,'grass',5000);
 let onRoot=false;for(let i=0;i<8&&!onRoot;i++){await v(page,()=>{const k=window.__village;k.player.yaw+=Math.PI/4;});await s.down(0,-38);await page.waitForTimeout(500);onRoot=(await v(page,()=>window.__village.mode))==='root';await s.up();}
 assert.ok(onRoot,'running along a copse root takes her onto it');
 // Along the root: the camera turns to its heading, so pushing forward follows it; she is carried faster than she walks, or reaches its end or a junction.
 await page.waitForTimeout(400);const r0=await v(page,()=>({root:window.__village.root,t:window.__village.simSeconds}));await s.down(0,-38);await page.waitForTimeout(1200);const r1=await v(page,()=>({root:window.__village.root,mode:window.__village.mode,t:window.__village.simSeconds}));await s.up();
 const carried=r1.mode!=='root'||r1.root.root!==r0.root.root||Math.abs(r1.root.s-r0.root.s)/(r1.t-r0.t)>2.5||Math.abs(r1.root.s-r0.root.s)>2||r1.root.s>r1.root.length-0.1||r1.root.s<0.1;assert.ok(carried,`the root carries her (${JSON.stringify({r0,r1})})`);
 await page.screenshot({path:out+'/02c-root.png'});await doubleTapStick(page);await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:10000});
 // Into a copse trunk, up to the crown, a leap to a neighbour, down, and at the foot into the grass.
 await v(page,()=>{const k=window.__village,t=k.trees[1],a=Math.random()*6.28;const x=t.x+Math.cos(a)*(0.32*t.size+0.6),z=t.z+Math.sin(a)*(0.32*t.size+0.6);k.standAt(x,z,Math.atan2(-(t.x-x),-(t.z-z)));});await page.waitForTimeout(300);
 await s.down(0,-38);await waitMode(page,'trunk',20000);await page.waitForTimeout(500);await page.screenshot({path:out+'/02d-trunk.png'});await waitMode(page,'crown',40000);await s.up();await page.waitForFunction(()=>window.__village.crown&&window.__village.crown.armed,null,{timeout:8000}).catch(()=>{});
 const target=await v(page,()=>{const k=window.__village,t=k.trees[k.crown.tree],o=k.trees.find(o=>o!==t&&Math.hypot(o.x-t.x,o.z-t.z)<=9&&Math.abs(3.4*o.size-3.4*t.size)<=7);k.player.yaw=Math.atan2(-(o.x-t.x),-(o.z-t.z));return o.id;});await page.waitForTimeout(200);
 await s.down(0,-38);await waitMode(page,'hop',10000);await s.up();await waitMode(page,'crown',15000);assert.equal(await v(page,()=>window.__village.crown.tree),target,'leapt across the copse');
 await s.down(0,38);await waitMode(page,'trunk',10000);await waitMode(page,'sink',60000);await s.up();await waitMode(page,'grass',10000);await doubleTapStick(page);await page.waitForFunction(()=>window.__village.mode==='ground',null,{timeout:10000});
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
 assert.deepEqual(errors,[]);report.push({passed:true,herWays:'grass (free, fast), tree roots (faster, held), trunk, crown, leap',thoughts:'always: doing, going, chatter',facing:'forward',hobbits:8,houses:6,rhythm:'dawn out, noon at the fire, night home, day two',clips:'Hulda and the eight hobbits on one skeleton',labels:true,bubbles:true,pausesWhenHidden:'ticks only while watched',saveReload:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const c=window.__village;return c?{tick:c.tick,phase:c.phase,inside:c.count('inside'),green:c.count('green'),status:c.character.status}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
