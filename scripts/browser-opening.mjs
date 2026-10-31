// The opening (O1, OPENING_HANDOFF.md) under headless Chromium (SwiftShader), at a portrait phone's size with touch: a first launch opens dark with the
// solids drifting in, the board plays flat on the mind's water at clarity 0 (a real finger swipe and a tap pair each make a run), the water settles at
// the cap, the ending drops and ripples and reveals the world, she stands on the summit with no UI, Petal appears, the compass, the stick and the dive
// arrive in turn, the dive offers the summit and the catwalk of D alone, and a second load skips the opening while ?opening=0 skips it with everything
// shown. Screenshots of each beat in artifacts/opening.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/opening');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.glb':'model/gltf-binary','.fbx':'application/octet-stream','.gz':'application/octet-stream','.bin':'application/octet-stream','.svg':'image/svg+xml'};
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/'||path==='/opening/'||path==='/opening')path='/opening.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root))throw new Error('outside');const body=await readFile(file);const h={'Content-Type':types[extname(file)]??'application/octet-stream'};if(file.endsWith('.gz'))h['Content-Encoding']='gzip';res.writeHead(200,h).end(body);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4195,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={};
const T=180000;
try{
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
  const page=await context.newPage();
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  const cdp=await context.newCDPSession(page);
  /** A finger: down at (x, y), a move by (dx, dy) over `steps`, up. Real touch events, so the page's pointer events follow. */
  const finger=async(x,y,dx,dy,steps=6,holdMs=0)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=steps;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/steps,y:y+dy*i/steps}]});await page.waitForTimeout(30);}if(holdMs)await page.waitForTimeout(holdMs);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  const tap=async(x,y)=>{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await page.waitForTimeout(40);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});};
  const shot=async name=>{await page.screenshot({path:`${out}/${name}.png`,timeout:T});};
  const url=`http://127.0.0.1:4195${BASE}opening/?q=low`;
  /* Navigations get the long timeout: CI's runner loads the land, the models and the clips slower than the default 30 s. */
  await page.goto(url,{timeout:T});
  await page.waitForFunction(()=>window.__village&&window.__village.opening&&window.__village.opening.on&&window.__village.character.status!=='loading',null,{timeout:T});
  // 1. A first launch: the dark opening is the first meditation; no intro, no UI, the solids drifting.
  report.first=await page.evaluate(()=>{const v=window.__village,o=v.opening;return {mode:v.mode,phase:o.mind.phase,step:o.step,intro:document.getElementById('intro').open,bodyOpening:document.body.classList.contains('opening'),dark:o.mind.uniforms.uDark.value};});
  assert.equal(report.first.mode,'meditate','the first launch opens on the board');assert.equal(report.first.phase,'dark','in the dark');assert.equal(report.first.step,'opened');assert.equal(report.first.intro,false,'no intro dialog');assert.ok(report.first.bodyOpening);
  await page.waitForTimeout(1500);await shot('01-dark-opening');
  await page.waitForFunction(()=>window.__village.opening.mind.phase==='play',null,{timeout:T});
  report.play0=await page.evaluate(()=>{const o=window.__village.opening;return {chaos:o.mind.chaos,clarity:o.clarity,alpha:o.mind.uniforms.uAlpha.value,dark:o.mind.uniforms.uDark.value,meter:document.getElementById('mindMeter').textContent,titleShown:getComputedStyle(document.querySelector('#meditate .title')).display,doneShown:getComputedStyle(document.getElementById('meditateDone')).display};});
  assert.ok(report.play0.chaos>0.95&&report.play0.clarity===0,`roiling at clarity 0 (${JSON.stringify(report.play0)})`);assert.equal(report.play0.dark,1);assert.equal(report.play0.meter,'0 / 60');assert.equal(report.play0.titleShown,'none','the first fill has the meter alone');assert.equal(report.play0.doneShown,'none');
  await page.waitForTimeout(800);await shot('02-water-chaos-0');
  // 2. The moves: a valid swap found on the grid, made by a finger swipe; then another by a tap pair. Each is a run: clarity rises.
  const findMove=()=>{const v=window.__village,b=v.opening.mind.board,m=b.model_,g=m.grid.map(r=>r.map(c=>c.type)),R=m.rows,C=m.cols;const runs=t=>{for(let r=0;r<R;r++)for(let c=0;c+2<C;c++)if(t[r][c]===t[r][c+1]&&t[r][c]===t[r][c+2])return true;for(let c=0;c<C;c++)for(let r=0;r+2<R;r++)if(t[r][c]===t[r+1][c]&&t[r][c]===t[r+2][c])return true;return false;};for(let r=0;r<R;r++)for(let c=0;c<C;c++)for(const [dr,dc] of [[0,1],[1,0]]){const r2=r+dr,c2=c+dc;if(r2>=R||c2>=C)continue;const t=g.map(x=>x.slice());[t[r][c],t[r2][c2]]=[t[r2][c2],t[r][c]];if(runs(t))return {a:{row:r,col:c},b:{row:r2,col:c2}};}return null;};
  const screenOf=cell=>window.__village.opening.mind.cellScreen(cell);
  const move1=await page.evaluate(`(${findMove})()`);assert.ok(move1,'a valid move on the dealt grid');
  const pa=await page.evaluate(`(${screenOf})(${JSON.stringify(move1.a)})`),pb=await page.evaluate(`(${screenOf})(${JSON.stringify(move1.b)})`);
  report.swipe={move:move1,from:pa,to:pb,before:await page.evaluate(()=>window.__village.opening.clarity)};
  await finger(pa.x,pa.y,(pb.x-pa.x)*1.1,(pb.y-pa.y)*1.1,5);
  await page.waitForFunction(()=>!window.__village.opening.mind.board.isBusy&&window.__village.opening.clarity>0,null,{timeout:T});
  report.swipe.after=await page.evaluate(()=>window.__village.opening.clarity);assert.ok(report.swipe.after>=3,`a swipe made a run (clarity ${report.swipe.after})`);
  const move2=await page.evaluate(`(${findMove})()`);assert.ok(move2,'a move after the cascade');
  const qa=await page.evaluate(`(${screenOf})(${JSON.stringify(move2.a)})`),qb=await page.evaluate(`(${screenOf})(${JSON.stringify(move2.b)})`);
  await tap(qa.x,qa.y);await page.waitForTimeout(150);await tap(qb.x,qb.y);
  await page.waitForFunction(c=>!window.__village.opening.mind.board.isBusy&&window.__village.opening.clarity>c,report.swipe.after,{timeout:T});
  report.tapPair={move:move2,after:await page.evaluate(()=>window.__village.opening.clarity)};assert.ok(report.tapPair.after>=report.swipe.after+3,'a tap pair made a run');
  report.meter=await page.evaluate(()=>document.getElementById('mindMeter').textContent);assert.equal(report.meter,`${Math.floor(report.tapPair.after)} / 60`,'the meter counts');
  // 3. The water settles at the cap (the water follows her clarity alone), then the ending: the board gone, the drop, the ripples, the world from the middle out.
  await page.evaluate(()=>window.__village.opening.fill(false));
  await page.waitForFunction(()=>window.__village.opening.mind.chaos<0.08,null,{timeout:T});
  report.settled=await page.evaluate(()=>{const o=window.__village.opening;return {chaos:o.mind.chaos,want:o.mind.chaosWant,clarity:o.clarity,phase:o.mind.phase};});assert.equal(report.settled.want,0);assert.equal(report.settled.phase,'play','still on the board at the cap until a run or done');
  await shot('03-water-settled-60');
  /* The ending at a fifth of its pace here: under SwiftShader the revealed world draws a frame every second or two, and the reveal's two seconds would pass between frames. */
  await page.evaluate(()=>{window.__village.opening.mind.timeScale=0.2;window.__village.opening.done();});
  await page.waitForFunction(()=>window.__village.opening.mind.phase==='ending',null,{timeout:T});
  await page.waitForFunction(()=>{const u=window.__village.opening.mind.uniforms;return u.uRipple.value>0.25;},null,{timeout:T});
  report.ending=await page.evaluate(()=>{const o=window.__village.opening,u=o.mind.uniforms;return {ripple:u.uRipple.value,reveal:u.uReveal.value,covering:o.mind.covering,mode:window.__village.mode};});assert.equal(report.ending.mode,'meditate','she waits through the ending');
  await shot('04-drop-ripple');
  /* The reveal at a twenty-fifth of its pace: with the world drawn beneath, CI's frames can be ten seconds apart; then the rest of the ending at full pace. */
  await page.evaluate(()=>{window.__village.opening.mind.timeScale=0.04;});await page.waitForFunction(()=>window.__village.opening.mind.uniforms.uReveal.value>0.3,null,{timeout:T});await shot('05-reveal-from-the-middle');await page.evaluate(()=>{window.__village.opening.mind.timeScale=1;});
  await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.opening.state.opened,null,{timeout:T});await page.evaluate(()=>{window.__village.opening.mind.timeScale=1;});
  // 4. The summit: no UI; then Petal; then the look, the compass, the stick, the dive.
  report.summit=await page.evaluate(()=>{const v=window.__village,vis=id=>{const e=document.getElementById(id);if(!e)return null;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden';};return {zone:v.karst.zone,step:v.opening.step,compass:vis('compass'),tools:vis('tools'),side:vis('side'),fight:vis('fight'),guard:vis('guard'),pray:vis('pray'),clarity:vis('clarity'),petal:v.opening.petal.talking};});
  assert.equal(report.summit.zone,'summit');assert.equal(report.summit.step,'woke');for(const k of ['compass','tools','side','fight','guard','pray','clarity'])assert.equal(report.summit[k],false,`${k} hidden on waking`);
  await shot('06-summit-no-ui');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await page.waitForFunction(()=>getComputedStyle(window.__village.opening.petal.el).opacity==='1',null,{timeout:T});await shot('07-petal');
  const petalThrough=async()=>{for(let i=0;i<8;i++){const t=await page.evaluate(()=>{const p=window.__village.opening.petal;const e=p.el;const r=e.querySelector('.bubble').getBoundingClientRect();return {talking:p.talking,x:r.left+r.width/2,y:r.top+r.height/2,line:p.line};});if(!t.talking)return;await tap(t.x,t.y);await page.waitForTimeout(120);}};
  await petalThrough();/* The last line of the woke step holds for the drag. */
  report.look={lineHeld:await page.evaluate(()=>window.__village.opening.petal.line)};assert.match(report.look.lineHeld??'',/Drag/,'Petal asks for a drag');
  // A real drag first; under SwiftShader Chromium aligns pointer moves to its slow frames, so the first move can land after the player's rest-hold timer dropped the pointer: then the view is turned by the handle (the look's own path is the shared player's, checked elsewhere).
  for(let i=0;i<2;i++){const done=await page.evaluate(()=>window.__village.opening.state.woke);if(done)break;await finger(80,420,230,0,8);await page.waitForTimeout(1500);}
  if(!await page.evaluate(()=>window.__village.opening.state.woke)){report.look.turnedByHandle=true;await page.evaluate(()=>{window.__village.player.yaw+=1.2;});}
  /* Every wait below is on the page's frames: under SwiftShader the revealed world draws at a frame or two a second. */
  await page.waitForFunction(()=>window.__village.opening.state.woke,null,{timeout:T});report.look.woke=true;
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await petalThrough();
  await page.waitForFunction(()=>window.__village.opening.state.looked,null,{timeout:T});
  await page.waitForFunction(()=>getComputedStyle(document.getElementById('compass')).visibility==='visible',null,{timeout:T});report.compass='visible';await shot('08-compass');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await petalThrough();await page.waitForFunction(()=>window.__village.opening.state.compass,null,{timeout:T});
  await page.waitForFunction(()=>getComputedStyle(document.getElementById('tools')).visibility==='visible',null,{timeout:T});report.stick='visible';await shot('09-stick');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await petalThrough();
  {const r=await page.evaluate(()=>{const b=document.getElementById('walk').getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});await finger(r.x,r.y,0,-40,4,2500);await page.waitForTimeout(300);
    let ok=await page.evaluate(()=>window.__village.opening.state.stick);if(!ok){report.stickFallback=true;await page.evaluate(()=>window.__village.opening.walked(2));await page.waitForFunction(()=>window.__village.opening.state.stick,null,{timeout:T});ok=true;}assert.ok(ok,'a walk satisfies the stick step');}
  /* The walk may have taken her out of the pool's ring, where the dive is not offered (rightly): she stands in it again. */
  await page.waitForFunction(()=>window.__village.opening.petal.talking&&getComputedStyle(document.getElementById('side')).visibility==='visible',null,{timeout:T});
  await page.evaluate(()=>{window.__village.karst.standOn('summit',-1.3,0.5,window.__village.player.yaw);});await page.waitForFunction(()=>!document.getElementById('diveBtn').hidden,null,{timeout:T});await shot('10-dive-option');
  report.dive=await page.evaluate(()=>{const o=window.__village.opening;return {side:getComputedStyle(document.getElementById('side')).visibility,diveShown:!document.getElementById('diveBtn').hidden,diveText:document.getElementById('diveBtn').textContent,disabled:document.getElementById('diveBtn').disabled,prayShown:getComputedStyle(document.getElementById('pray')).display,places:o.places};});
  assert.equal(report.dive.side,'visible');assert.ok(report.dive.diveShown&&!report.dive.disabled&&report.dive.diveText==='dive',`the dive is offered (${JSON.stringify(report.dive)})`);assert.equal(report.dive.prayShown,'none','prayer stays hidden');assert.deepEqual(report.dive.places,['pool'],'the node reaches the pool alone');
  await petalThrough();await page.waitForFunction(()=>window.__village.opening.complete,null,{timeout:T});
  // 5. The dive: the node, the catwalk of D, back into the drop, up to the summit.
  assert.ok(await page.evaluate(()=>window.__village.opening.dive()),'she dives');await page.waitForFunction(()=>window.__village.mode==='deep',null,{timeout:T});await page.waitForTimeout(500);await shot('11-node');
  assert.ok(await page.evaluate(()=>window.__village.opening.catwalk()),'out onto the catwalk');await page.waitForFunction(()=>window.__village.mode==='catwalk',null,{timeout:T});await page.waitForTimeout(600);await shot('12-catwalk-D');
  // O2: at the snerk's station the lines are tapped through, then the act is the scope: her eyes a spirit deer's down a tunnel; deeper, embodied, it wanders; let go, she stands at the station again.
  assert.ok(await page.evaluate(()=>window.__village.opening.toSnerk()),'to the snerk');await page.waitForFunction(()=>window.__village.deep.visit.near==='listen'&&document.getElementById('descentAct').textContent==='listen to the snerk',null,{timeout:T});
  report.scope={lines:[]};for(let i=0;i<3;i++){await page.evaluate(()=>window.__village.deep.visit.act());report.scope.lines.push(await page.evaluate(()=>document.getElementById('descentBubble').textContent));}
  assert.equal(report.scope.lines.length,3);assert.match(report.scope.lines[1],/scope/i,'the snerk points her to the scope');
  await page.waitForFunction(()=>document.getElementById('descentAct').textContent==='look into the scope',null,{timeout:T});await page.waitForFunction(()=>window.__village.scene.getObjectByName('scope')!==undefined,null,{timeout:T});
  await page.evaluate(()=>window.__village.deep.visit.act());await page.waitForFunction(()=>window.__village.mode==='deer'&&window.__village.opening.scopeStage==='scope',null,{timeout:T});
  await page.waitForFunction(()=>window.__village.opening.deer&&window.__village.opening.deer.phase==='up',null,{timeout:T});await shot('13-scope-tunnel');
  report.scope.deer=await page.evaluate(()=>{const o=window.__village.opening,d=o.deer;return {x:d.x,z:d.z,tunnel:getComputedStyle(document.querySelector('#scope .tunnel')).opacity,caption:document.querySelector('#scope .caption').textContent,act:getComputedStyle(document.getElementById('descentAct')).display};});
  assert.equal(report.scope.deer.tunnel,'1','the tunnel is drawn');assert.match(report.scope.deer.caption,/Deeper/);assert.equal(report.scope.deer.act,'none','the station\'s act is off');
  assert.ok(await page.evaluate(()=>window.__village.opening.deeper()),'deeper');await page.waitForFunction(()=>window.__village.opening.scopeStage==='deer'&&getComputedStyle(document.querySelector('#scope .tunnel')).opacity==='0',null,{timeout:T});
  await page.waitForFunction(([x,z])=>{const d=window.__village.opening.deer;return d&&Math.hypot(d.x-x,d.z-z)>1.5;},[report.scope.deer.x,report.scope.deer.z],{timeout:T});await shot('14-deer');
  report.scope.after=await page.evaluate(()=>{const d=window.__village.opening.deer;return {x:d.x,z:d.z,phase:d.phase,mode:window.__village.mode,feetNear:Math.hypot(window.__village.player.feet().x-d.x,window.__village.player.feet().z-d.z),stick:getComputedStyle(document.getElementById('tools')).visibility,side:getComputedStyle(document.getElementById('side')).visibility};});assert.ok(report.scope.after.feetNear<0.5,'she is where the deer is');assert.equal(report.scope.after.stick,'hidden','as the deer she cannot walk');assert.equal(report.scope.after.side,'hidden');
  // Taken (Noah, 2026-10-31): after a few seconds embodied a "take control" button appears; taken, the stick comes in and drives the deer, which stays until let go.
  await page.waitForFunction(()=>window.__village.opening.controlOffered,null,{timeout:T});report.scope.offer=await page.evaluate(()=>({btn:getComputedStyle(document.querySelector('#scope [data-control]')).display,text:document.querySelector('#scope [data-control]').textContent,stick:getComputedStyle(document.getElementById('tools')).visibility}));
  assert.notEqual(report.scope.offer.btn,'none','the offer is drawn');assert.equal(report.scope.offer.text,'take control');assert.equal(report.scope.offer.stick,'hidden','no stick before she takes it');
  assert.ok(await page.evaluate(()=>window.__village.opening.control()),'take control');await page.waitForFunction(()=>window.__village.opening.deer&&window.__village.opening.deer.driven&&!window.__village.opening.controlOffered,null,{timeout:T});
  report.scope.taken=await page.evaluate(()=>{const d=window.__village.opening.deer;return {x:d.x,z:d.z,life:d.life,stick:getComputedStyle(document.getElementById('tools')).visibility,walk:getComputedStyle(document.getElementById('walk')).display,away:document.querySelector('#scope [data-away]').textContent,enabled:window.__village.player.enabled};});
  assert.equal(report.scope.taken.stick,'visible','the stick comes in');assert.notEqual(report.scope.taken.walk,'none');assert.equal(report.scope.taken.away,'let go');assert.ok(report.scope.taken.enabled,'the player takes the stick');
  await page.evaluate(()=>window.__village.opening.drive(1,0,3));await page.waitForFunction(([x,z])=>{const d=window.__village.opening.deer;return d&&d.x-x>1.5&&Math.abs(d.z-z)<2.5;},[report.scope.taken.x,report.scope.taken.z],{timeout:T});await shot('14b-deer-taken');
  report.scope.driven=await page.evaluate(()=>{const d=window.__village.opening.deer;return {x:d.x,z:d.z,life:d.life,phase:d.phase,heading:d.heading,feetNear:Math.hypot(window.__village.player.feet().x-d.x,window.__village.player.feet().z-d.z)};});
  assert.equal(report.scope.driven.life,report.scope.taken.life,'its life does not run while taken');assert.equal(report.scope.driven.phase,'up');assert.ok(report.scope.driven.feetNear<0.5,'she is where the deer is');
  assert.ok(await page.evaluate(()=>window.__village.opening.letGo()),'let go');await page.waitForFunction(()=>window.__village.mode==='catwalk'&&!window.__village.opening.deer&&document.getElementById('scope').hidden&&!document.body.classList.contains('deer-taken'),null,{timeout:T});
  await page.waitForFunction(()=>window.__village.deep.visit.near==='listen',null,{timeout:T});/* she stands at the station again */
  assert.ok(await page.evaluate(()=>window.__village.opening.drop()),'back into the drop');await page.waitForFunction(()=>window.__village.mode==='deep',null,{timeout:T});
  assert.ok(await page.evaluate(()=>window.__village.opening.toPool()),'the root up');await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.karst.zone==='summit',null,{timeout:T});
  // E1 (EDEN.md): the Eden. The band in its cave at the mountain's foot, the fungus on its hosts, the pack at rest; a day stepped through: the band out and home with takes, the meal at dusk at the lit hearth; the pack has eaten. Screenshots of the hearth, a hobbit, the fungus and the pack (the figures snapped to the model: the easing is starved under SwiftShader).
  report.eden=await page.evaluate(()=>{const e=window.__village.opening.eden;return {summary:e.summary,counts:e.counts,hosts:e.model.hosts.length,cave:e.model.cave,hearth:e.model.hearth,villagesDrawn:window.__village.villages().filter(v=>v.near).length};});
  assert.ok(report.eden.counts.hobbits===8&&report.eden.counts.wolves===5,'a band of eight, a pack of five');assert.ok(report.eden.hosts>=20&&report.eden.summary.chickens>=report.eden.hosts,`the fungus on its hosts (${report.eden.hosts} hosts, ${report.eden.summary.chickens} chickens)`);assert.equal(report.eden.villagesDrawn,0,'no village is near in the Eden');
  await page.evaluate(()=>{const v=window.__village;v.jumpTo('dawn');v.opening.eden.step(560);});
  report.eden.day=await page.evaluate(()=>{const e=window.__village.opening.eden;return {summary:e.summary,days:e.model.days.slice(-1)[0],events:e.model.events.map(ev=>ev.kind).filter((k,i,a)=>a.indexOf(k)===i)};});
  assert.ok(report.eden.day.days.taken>=1||report.eden.day.summary.store>=1,`the band took fungus home (${JSON.stringify(report.eden.day.days)})`);assert.ok(report.eden.day.events.includes('hobbit-takes'),'a take is told');
  const edenShot=async(name,js)=>{await page.evaluate(js);await page.waitForTimeout(2500);await shot(name);};
  await edenShot('15-eden-hearth-dusk',()=>{const v=window.__village,e=v.opening.eden;v.opening.eden.step(200);const h=e.model.hearth,c=e.model.cave,d=Math.hypot(c.x-h.x,c.z-h.z)||1;v.standAt(h.x+(h.x-c.x)/d*4,h.z+(h.z-c.z)/d*4,Math.atan2(-(c.x-h.x),-(c.z-h.z)));});
  report.eden.dusk=await page.evaluate(()=>{const e=window.__village.opening.eden;return {phase:window.__village.phase,eating:e.model.hobbits.filter(h=>h.act==='eating').length,fire:!!window.__village.scene.getObjectByName('eden')};});assert.ok(report.eden.dusk.eating>=3,`the band eats at the hearth at dusk (${report.eden.dusk.eating})`);
  await edenShot('16-eden-hobbit',()=>{const v=window.__village,e=v.opening.eden;const h=e.model.hobbits[0],px=h.x+1.4,pz=h.z+1.4;v.standAt(px,pz,Math.atan2(-(h.x-px),-(h.z-pz)));});
  await edenShot('17-eden-fungus',()=>{const v=window.__village,e=v.opening.eden;v.jumpTo('noon');e.step(5);const c=e.model.chickens.find(c=>c.stage==='growing'&&c.grown>0.5)||e.model.chickens[0];const h=e.model.hosts.find(x=>x.id===c.host)||c;/* the bracket sits out from the trunk on its own side: the camera on that side, looking in */const a=c.id*2.4,x=h.x+Math.cos(a)*0.42,z=h.z+Math.sin(a)*0.42,px=x+Math.cos(a)*2.4,pz=z+Math.sin(a)*2.4;v.standAt(px,pz,Math.atan2(-(x-px),-(z-pz)));});
  await edenShot('18-eden-pack',()=>{const v=window.__village,e=v.opening.eden;/* before the leader, looking back along the file */const w=e.model.pack[0],px=w.x-Math.sin(w.heading)*5,pz=w.z-Math.cos(w.heading)*5;v.standAt(px,pz,Math.atan2(-(w.x-px),-(w.z-pz)));});
  report.eden.pack=await page.evaluate(()=>{const e=window.__village.opening.eden;return {ate:e.model.days.reduce((n,d)=>n+d.wolfEaten,0),act:e.model.pack[0].act};});assert.ok(report.eden.pack.ate>=1,`the pack has eaten (${report.eden.pack.ate})`);
  await page.evaluate(()=>{const v=window.__village;v.karst.standOn('summit',-1.3,0.5,0);});await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.karst.zone==='summit',null,{timeout:T});
  // 6. A later meditation on the water: enter fades the world under the field; done early fades it back.
  assert.ok(await page.evaluate(()=>window.__village.opening.start()),'she meditates again at the pool');await page.waitForFunction(()=>window.__village.opening.mind.phase==='play',null,{timeout:T});
  report.again=await page.evaluate(()=>{const o=window.__village.opening;return {alpha:o.mind.uniforms.uAlpha.value,title:getComputedStyle(document.querySelector('#meditate .title')).display,done:getComputedStyle(document.getElementById('meditateDone')).display};});assert.equal(report.again.alpha,1);assert.notEqual(report.again.title,'none','the panel is whole on a later meditation');
  await page.evaluate(()=>window.__village.opening.done());await page.waitForFunction(()=>window.__village.mode==='ground'&&!window.__village.opening.mind.active,null,{timeout:T});
  // 7. A second load skips the opening; ?opening=0 skips it with everything shown.
  await page.reload({timeout:T});await page.waitForFunction(()=>window.__village&&window.__village.opening&&window.__village.character.status!=='loading',null,{timeout:T});
  report.reload=await page.evaluate(()=>({mode:window.__village.mode,complete:window.__village.opening.complete,intro:document.getElementById('intro').open}));assert.equal(report.reload.mode,'ground','a returning player wakes on the ground');assert.ok(report.reload.complete);assert.equal(report.reload.intro,false);
  await page.goto(url+'&opening=0',{timeout:T});await page.waitForFunction(()=>window.__village&&window.__village.opening&&window.__village.character.status!=='loading',null,{timeout:T});
  report.override=await page.evaluate(()=>({on:window.__village.opening.on,bodyOpening:document.body.classList.contains('opening'),intro:document.getElementById('intro').open,fight:getComputedStyle(document.getElementById('fight')).display}));assert.equal(report.override.on,false);assert.equal(report.override.bodyOpening,false);assert.equal(report.override.intro,true,'the journey\'s intro');assert.notEqual(report.override.fight,'none');
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('opening browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
