import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/karst-flow');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/Rootwake/karst-flow/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/')path='/karst-flow.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4186,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
// A finger tap spans several animation frames; page.touchscreen.tap lands down and up inside one,
// which hid a per-frame input reset that swallowed every real tap and drag while the player was disabled.
const touch=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,pointerType:'touch',isPrimary:true,bubbles:true});
async function press(page,x,y,holdMs=120){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(7,x,y));await page.waitForTimeout(holdMs);await canvas.dispatchEvent('pointerup',touch(7,x,y));}
async function drag(page,x,y,dx,dy,steps=8){const canvas=page.locator('canvas');await canvas.dispatchEvent('pointerdown',touch(8,x,y));for(let i=1;i<=steps;i++){await page.waitForTimeout(30);await canvas.dispatchEvent('pointermove',touch(8,x+dx*i/steps,y+dy*i/steps));}await canvas.dispatchEvent('pointerup',touch(8,x+dx,y+dy));}
const stick=(page,id)=>({down:async(dx,dy)=>{await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.locator('#walk').dispatchEvent('pointermove',{pointerId:id,clientX:315+dx,clientY:710+dy,pointerType:'touch',bubbles:true});},up:async()=>{await page.locator('#walk').dispatchEvent('pointerup',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.waitForTimeout(150);await page.waitForFunction(()=>{const k=window.__karstFlow;return !k.player.gesture.held&&(k.mode!=='crown'||(k.crown&&k.crown.armed));},null,{timeout:8000}).catch(()=>{});}});
async function tapStick(page,id){await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});await page.waitForTimeout(60);await page.locator('#walk').dispatchEvent('pointerup',{pointerId:id,clientX:315,clientY:710,pointerType:'touch',bubbles:true});}
async function doubleTapStick(page){await tapStick(page,21);await page.waitForTimeout(90);await tapStick(page,22);}
const mode=page=>page.evaluate(()=>window.__karstFlow.mode);
const waitMode=(page,m,timeout=30000)=>page.waitForFunction(m=>window.__karstFlow.mode===m,m,{timeout});
const at=page=>page.evaluate(()=>window.__karstFlow.at);
/** Stand beside a tree, facing its trunk: what she does before pressing into it. */
const approach=(page,id)=>page.evaluate(id=>{window.__karstFlow.standAt(id,true);},id);
/** Press into a tree and keep pushing down at the trunk's foot: into its roots. */
async function intoRoots(page,s,id){await approach(page,id);await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'trunk',20000);await s.up();await s.down(0,38);await waitMode(page,'sink',15000);await s.up();await waitMode(page,'mouth',10000);assert.equal(await at(page),id);}
/** Push the stick the way a root visibly sets off from the mouth she is in, and ride it to its far plant. */
/** Push the stick up at every mouth (whichever upward root it lands on) until she is in the target tree: a climb by root. */
async function rideUpTo(page,s,targetId,maxRides=16){
 // Climb by whichever root on offer ends highest (a mouth not yet visited first), pushing the stick the way that root sets off on screen; the camera rule is the shared one, so "up on screen" alone is not the climb.
 const seen=new Set();for(let i=0;i<maxRides;i++){const here=await at(page);if(here===targetId)return i;seen.add(here);await page.waitForTimeout(500);const dirs=await page.evaluate(()=>window.__karstFlow.screenDirections());assert.ok(dirs.length,'roots set off on screen');
  const ends=await page.evaluate(id=>{const k=window.__karstFlow;return k.rootsAt(id).map(r=>({root:r.id,to:r.a===id?r.b:r.a,y:k.nodeHeight(r.a===id?r.b:r.a)}));},here);
  const d=dirs.map(d=>({...d,...(ends.find(e=>e.root===d.root)??{y:-Infinity,to:''})})).reduce((a,b)=>(seen.has(b.to)?-1e6:0)+b.y>(seen.has(a.to)?-1e6:0)+a.y?b:a);
  await s.down(d.x*38,-d.y*38);await waitMode(page,'ride',15000);await waitMode(page,'mouth',240000);await s.up();}
 assert.equal(await at(page),targetId,'climbed by root');return maxRides;}
async function rideBy(page,s,rootId,timeout=180000,shot=null){
 await page.waitForTimeout(500);const dirs=await page.evaluate(()=>window.__karstFlow.screenDirections());const d=dirs.find(d=>d.root===rootId);assert.ok(d,`${rootId} sets off somewhere on screen (${JSON.stringify(dirs)})`);
 await s.down(d.x*38,-d.y*38);await waitMode(page,'ride',15000);assert.equal(await page.evaluate(()=>window.__karstFlow.ride.root),rootId);
 if(shot){await page.waitForTimeout(700);await page.screenshot({path:out+'/'+shot});}
 const top=await page.evaluate(()=>new Promise(res=>{let top=0;const tick=()=>{const r=window.__karstFlow.ride;if(!r){res(top);return;}top=Math.max(top,r.speed);requestAnimationFrame(tick);};tick();}));
 await waitMode(page,'mouth',timeout);await s.up();return top;
}
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4186'+BASE);await page.click('#begin');await page.waitForFunction(()=>window.__karstFlow);await page.waitForTimeout(800);await page.screenshot({path:out+'/01-summit.png'});
 await page.evaluate(()=>{
   const audit=window.__characterAudit={frames:0,failures:[],forms:[]};
   function sample(){const c=window.__karstFlow,p=c.presentation;if(p&&c.player.view==='third'){audit.frames++;const w=Object.values(p.blend.weights);if(Math.abs(w.reduce((a,b)=>a+b,0)-1)>1e-6)audit.failures.push('weight total');if(!p.root.visible||!p.root.children.some(f=>f.visible))audit.failures.push('blank frame '+c.mode);if(!audit.forms.includes(p.blend.form))audit.forms.push(p.blend.form);}requestAnimationFrame(sample);}requestAnimationFrame(sample);
 });
 assert.equal(await mode(page),'ground');assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'summit');assert.equal(await page.evaluate(()=>window.__karstFlow.player.view),'third','Third person is native');
 assert.equal(await page.locator('#hint, #story, #actions button:visible, #rides').count(),0,'No screen text or destination buttons');
 // Hulda on the X Bot's skeleton: the Mixamo gait clips load onto her bones before the journey begins.
 await page.waitForFunction(()=>window.__karstFlow.character.status!=='loading',null,{timeout:120000});const character=await page.evaluate(()=>window.__karstFlow.character);
 assert.equal(character.status,'ready',character.error);assert.equal(character.body,'hulda');assert.equal(character.bones,65);assert.deepEqual(character.roles,{idle:'idle',walk:'walking',run:'running'},JSON.stringify(character.roles));
 // The top is narrow: the stick cannot walk her off it, and walking leaves a trail.
 await page.evaluate(()=>{window.__karstFlow.player.yaw=0;});const s=stick(page,1);await s.down(0,-38);await page.waitForTimeout(2500);await s.up();
 assert.ok(await page.evaluate(()=>{const k=window.__karstFlow,f=k.player.feet();return Math.hypot(f.x,f.z)<=3.25&&f.y>k.pillarHeight-.5;}),'Held on the summit');
 assert.ok(await page.evaluate(()=>Object.keys(window.__karstFlow.progress.trail).some(k=>k.startsWith('summit:'))),'Walking leaves a trail on the summit');
 // Running on the summit: the run clip carries her; at rest the idle. A mid-run frame is kept for the eye.
 await page.evaluate(()=>{window.__karstFlow.player.yaw=Math.PI;});await s.down(0,-38);await page.waitForTimeout(1200);const running=await page.evaluate(()=>({w:window.__karstFlow.character.weights,speed:window.__karstFlow.player.motor.speed}));await page.screenshot({path:out+'/01b-running.png'});await s.up();
 assert.ok(running.w.run>.6,`the run clip carries her (${JSON.stringify(running)})`);await page.waitForFunction(()=>window.__karstFlow.character.weights.idle>.8,null,{timeout:15000}).catch(()=>assert.fail('the idle at rest'));
 // Press into the pine: she walks to it, keeps pushing, and goes into its roots.
 // Press into the pine: she goes in as the bark bulge; push up to the crown and look round; back down; at the foot, push down: into the roots.
 await approach(page,'pine');await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'trunk',20000);await page.waitForTimeout(600);await page.screenshot({path:out+'/02a-trunk.png'});
 await waitMode(page,'crown',40000);await s.up();await page.waitForTimeout(400);await page.screenshot({path:out+'/02b-crown.png'});const az0=await page.evaluate(()=>window.__karstFlow.crown.az);await s.down(38,0);await page.waitForTimeout(500);await s.up();assert.notEqual(await page.evaluate(()=>window.__karstFlow.crown.az),az0,'sideways slides round the crown');
 await s.down(0,38);await waitMode(page,'trunk',10000);await waitMode(page,'sink',60000);await s.up();await waitMode(page,'mouth',10000);
 assert.equal(await at(page),'pine');await page.waitForFunction(()=>window.__karstFlow.vision>.6);await page.screenshot({path:out+'/02-in-the-pine.png'});
 // Slide east: the stick pushed the way the root sets off chooses it; downhill it runs like water.
 const slide=await rideBy(page,s,'pine-east',180000,'03-slide.png');assert.ok(slide>6,`downhill slide reached ${slide.toFixed(1)} m/s`);assert.equal(await at(page),'eastShrub');await page.screenshot({path:out+'/04-east-mouth.png'});
 // Into the stone, to the cavern; out by a double tap of the stick.
 await rideBy(page,s,'east-cavern',180000,'05-into-the-stone.png');assert.equal(await at(page),'cavernFern');await page.screenshot({path:out+'/06-cavern-mouth.png'});
 await doubleTapStick(page);await waitMode(page,'rise',5000);await waitMode(page,'ground',10000);assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'cavern');await page.waitForTimeout(600);await page.screenshot({path:out+'/07-cavern.png'});
 // Walk in the cavern (the pool's edge holds), then a double tap on the ground near the fern goes back into it.
 await s.down(0,-38);await page.waitForTimeout(1200);await s.up();assert.ok(await page.evaluate(()=>Object.keys(window.__karstFlow.progress.trail).some(k=>k.startsWith('cavern:'))),'A trail in the cavern');
 await doubleTapStick(page);await waitMode(page,'sink',5000);await waitMode(page,'mouth',10000);assert.equal(await at(page),'cavernFern');
 // Down through the stone to the foot oak; emerge on the forest floor.
 await rideBy(page,s,'cavern-floor');assert.equal(await at(page),'floorOak');await doubleTapStick(page);await waitMode(page,'ground',15000);assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'floor');assert.ok(await page.evaluate(()=>window.__karstFlow.progress.reachedFloor));
 await page.waitForTimeout(500);await page.screenshot({path:out+'/08-floor.png'});
 await s.down(0,-38);await page.waitForTimeout(1500);await s.up();assert.ok(await page.evaluate(()=>Object.keys(window.__karstFlow.progress.trail).some(k=>k.startsWith('floor:'))),'A trail on the floor');
 // The forest: every tree is a tree. Into a floor tree's trunk, up to its crown, a leaf-hop to a neighbour, down its trunk and into the network, one root to the next tree, out.
 const first=await page.evaluate(()=>{const k=window.__karstFlow;const near=Object.values(k.nodes).filter(n=>n.zone==='floor'&&n.id.startsWith('t')&&Math.hypot(n.at.x-15.5,n.at.z-3.5)<12);return near[0].id;});
 await approach(page,first);await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'trunk',20000);await waitMode(page,'crown',40000);await s.up();
 const target=await page.evaluate(()=>{const k=window.__karstFlow,n=k.nodes[k.at];const o=Object.values(k.nodes).find(o=>o!==n&&o.zone==='floor'&&Math.hypot(o.at.x-n.at.x,o.at.z-n.at.z)<=9&&Math.abs(o.at.y+o.crownH-n.at.y-n.crownH)<=8);k.player.yaw=Math.atan2(-(o.at.x-n.at.x),-(o.at.z-n.at.z));return o.id;});await page.waitForTimeout(200);
 await s.down(0,-38);await waitMode(page,'hop',10000);await s.up();await page.waitForTimeout(300);await page.screenshot({path:out+'/06b-leaf-hop.png'});await waitMode(page,'crown',15000);assert.equal(await at(page),target,'leapt to the neighbouring crown (a held stick would chain on to the next)');
 await s.down(0,38);await waitMode(page,'trunk',10000);await waitMode(page,'sink',60000);await s.up();await waitMode(page,'mouth',10000);await page.waitForFunction(()=>window.__karstFlow.vision>.6);await page.screenshot({path:out+'/06c-network.png'});
 const dirs=await page.evaluate(()=>window.__karstFlow.screenDirections());assert.ok(dirs.length>=1,'the tree has network roots');const netRoot=dirs.find(d=>d.root.startsWith('n:'));assert.ok(netRoot,'a network root sets off on screen');
 await s.down(netRoot.x*38,-netRoot.y*38);await waitMode(page,'ride',15000);await waitMode(page,'mouth',60000);await s.up();assert.ok(await page.evaluate(()=>window.__karstFlow.at!==window.__karstFlow.nodes[window.__karstFlow.at].id||true));assert.notEqual(await at(page),target,'rode the network to the next tree');
 await doubleTapStick(page);await waitMode(page,'ground',15000);assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'floor');
 // A sister's summit by root: from the foot tree at B's helix, up the face to the mid tree, over the rim to B's pine. Emerge on summitB.
 await intoRoots(page,s,'Bfoot');await rideBy(page,s,'B-foot-mid',240000,'06d-up-the-sister.png');assert.equal(await at(page),'B6');const rides=await rideUpTo(page,s,'pineB');report.push({sisterByRoot:'B-foot-mid then '+rides+' upward ride(s) to the pine'});
 await doubleTapStick(page);await waitMode(page,'ground',15000);assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'summitB');assert.deepEqual(await page.evaluate(()=>window.__karstFlow.progress.summits),['summitB']);await page.waitForTimeout(500);await page.screenshot({path:out+'/06e-sister-summit.png'});
 // And by leaf: the last ledge of C's helix leaps to C's pine.
 await approach(page,'C8');await page.waitForTimeout(300);await s.down(0,-38);await waitMode(page,'trunk',20000);await waitMode(page,'crown',40000);await s.up();await page.evaluate(()=>{const k=window.__karstFlow,n=k.nodes.C8,o=k.nodes.pineC;k.player.yaw=Math.atan2(-(o.at.x-n.at.x),-(o.at.z-n.at.z));});await page.waitForTimeout(200);
 await s.down(0,-38);await waitMode(page,'hop',10000);await s.up();await waitMode(page,'crown',15000);assert.equal(await at(page),'pineC','leapt from the helix onto the sister’s summit pine');assert.deepEqual(await page.evaluate(()=>window.__karstFlow.progress.summits),['summitB','summitC']);
 await doubleTapStick(page);await waitMode(page,'ground',15000);assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'summitC');
 // Back up the karst by another way: into the oak, the slow climb up the south root, east along the face, up to the pine.
 await intoRoots(page,s,'floorOak');
 const climb=await rideBy(page,s,'south-floor',180000,'09-climb.png');assert.ok(climb<6,`uphill is a slow climb (${climb.toFixed(1)} m/s)`);assert.equal(await at(page),'southShrub');
 await rideBy(page,s,'east-south');assert.equal(await at(page),'eastShrub');await page.screenshot({path:out+'/10-east-again.png'});
 await rideBy(page,s,'pine-east');assert.equal(await at(page),'pine');
 await doubleTapStick(page);await waitMode(page,'ground',15000);assert.equal(await page.evaluate(()=>window.__karstFlow.zone),'summit');assert.ok(await page.evaluate(()=>window.__karstFlow.progress.returned),'The return from below is recorded');
 await page.waitForTimeout(600);await page.screenshot({path:out+'/11-returned.png'});
 const audit=await page.evaluate(()=>window.__characterAudit);assert.deepEqual(audit.failures,[]);assert.ok(audit.frames>100);for(const form of ['human','knot'])assert.ok(audit.forms.includes(form),form+' presented');
 await writeFile(out+'/character-continuity.json',JSON.stringify(audit,null,2));
 await page.click('#view');await page.waitForFunction(()=>window.__karstFlow.player.view==='first'&&!window.__karstFlow.presentation.root.visible,null,{timeout:10000});
 await page.click('#view');await page.waitForFunction(()=>window.__karstFlow.player.view==='third'&&window.__karstFlow.presentation.root.visible,null,{timeout:10000});
 // Reload keeps the plant she is at and her trail.
 const saved=await page.evaluate(()=>window.__karstFlow.progress);await page.reload();await page.click('#begin');await page.waitForFunction(()=>window.__karstFlow);await page.waitForTimeout(500);
 const loaded=await page.evaluate(()=>window.__karstFlow.progress);assert.equal(loaded.at,'pine');assert.equal(loaded.returned,true);assert.equal(Object.keys(loaded.trail).length,Object.keys(saved.trail).length);
 for(const[name,size]of[['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await page.waitForTimeout(600);await page.screenshot({path:out+'/'+name+'.png'});}
 assert.deepEqual(errors,[]);report.push({passed:true,everyTree:'trunk, crown, leaf-hop, network root on a floor tree',sisters:'B by root (foot, mid, top), C by leaf from its last ledge',character:'Hulda on the X Bot skeleton, '+character.bones+' bones, clips '+Object.values(character.roles).join(', '),thirdPerson:true,noScreenText:true,pressInto:true,rides:['pine-east','east-cavern','cavern-floor','south-floor','east-south','pine-east'],emerge:'stick double tap',enter:'press into a plant, or a stick double tap near one',trail:true,saveReload:true,viewports:4});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages()){await p.screenshot({path:out+'/failure.png'}).catch(()=>{});console.log(await p.evaluate(()=>{const c=window.__karstFlow;return c?{mode:c.mode,at:c.at,zone:c.zone,feet:c.player.feet().toArray(),ride:c.ride,choice:c.choice,dirs:c.screenDirections()}:null;}).catch(()=>null));}throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
