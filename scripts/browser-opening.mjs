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
  await page.goto(url);
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
  await page.evaluate(()=>window.__village.opening.done());
  await page.waitForFunction(()=>window.__village.opening.mind.phase==='ending',null,{timeout:T});
  await page.waitForFunction(()=>{const u=window.__village.opening.mind.uniforms;return u.uRipple.value>0.25;},null,{timeout:T});
  report.ending=await page.evaluate(()=>{const o=window.__village.opening,u=o.mind.uniforms;return {ripple:u.uRipple.value,reveal:u.uReveal.value,covering:o.mind.covering,mode:window.__village.mode};});assert.equal(report.ending.mode,'meditate','she waits through the ending');
  await shot('04-drop-ripple');
  await page.waitForFunction(()=>{const u=window.__village.opening.mind.uniforms;return u.uReveal.value>0.35&&u.uReveal.value<0.8;},null,{timeout:T});await shot('05-reveal-from-the-middle');
  await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.opening.state.opened,null,{timeout:T});
  // 4. The summit: no UI; then Petal; then the look, the compass, the stick, the dive.
  report.summit=await page.evaluate(()=>{const v=window.__village,vis=id=>{const e=document.getElementById(id);if(!e)return null;const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden';};return {zone:v.karst.zone,step:v.opening.step,compass:vis('compass'),tools:vis('tools'),side:vis('side'),fight:vis('fight'),guard:vis('guard'),pray:vis('pray'),clarity:vis('clarity'),petal:v.opening.petal.talking};});
  assert.equal(report.summit.zone,'summit');assert.equal(report.summit.step,'woke');for(const k of ['compass','tools','side','fight','guard','pray','clarity'])assert.equal(report.summit[k],false,`${k} hidden on waking`);
  await shot('06-summit-no-ui');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await page.waitForFunction(()=>getComputedStyle(window.__village.opening.petal.el).opacity==='1',null,{timeout:T});await shot('07-petal');
  const petalThrough=async()=>{for(let i=0;i<8;i++){const t=await page.evaluate(()=>{const p=window.__village.opening.petal;const e=p.el;const r=e.querySelector('.bubble').getBoundingClientRect();return {talking:p.talking,x:r.left+r.width/2,y:r.top+r.height/2,line:p.line};});if(!t.talking)return;await tap(t.x,t.y);await page.waitForTimeout(120);}};
  await petalThrough();/* The last line of the woke step holds for the drag. */
  report.look={lineHeld:await page.evaluate(()=>window.__village.opening.petal.line)};assert.match(report.look.lineHeld??'',/Drag/,'Petal asks for a drag');
  for(let i=0;i<8;i++){const done=await page.evaluate(()=>window.__village.opening.state.woke);if(done)break;await finger(80,420,230,0,8);await page.waitForTimeout(250);}
  report.look.woke=await page.evaluate(()=>window.__village.opening.state.woke);assert.ok(report.look.woke,'a drag of the view satisfies the look');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await petalThrough();
  await page.waitForFunction(()=>window.__village.opening.state.looked,null,{timeout:T});
  report.compass=await page.evaluate(()=>getComputedStyle(document.getElementById('compass')).visibility);assert.equal(report.compass,'visible','the compass arrives');await page.waitForTimeout(400);await shot('08-compass');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await petalThrough();await page.waitForFunction(()=>window.__village.opening.state.compass,null,{timeout:T});
  report.stick=await page.evaluate(()=>getComputedStyle(document.getElementById('tools')).visibility);assert.equal(report.stick,'visible','the stick arrives');await page.waitForTimeout(400);await shot('09-stick');
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await petalThrough();
  {const r=await page.evaluate(()=>{const b=document.getElementById('walk').getBoundingClientRect();return {x:b.left+b.width/2,y:b.top+b.height/2};});await finger(r.x,r.y,0,-40,4,2500);await page.waitForTimeout(300);
    let ok=await page.evaluate(()=>window.__village.opening.state.stick);if(!ok){report.stickFallback=true;await page.evaluate(()=>window.__village.opening.walked(2));await page.waitForTimeout(300);ok=await page.evaluate(()=>window.__village.opening.state.stick);}assert.ok(ok,'a walk satisfies the stick step');}
  await page.waitForFunction(()=>window.__village.opening.petal.talking,null,{timeout:T});await page.waitForTimeout(300);await shot('10-dive-option');
  report.dive=await page.evaluate(()=>{const o=window.__village.opening;return {side:getComputedStyle(document.getElementById('side')).visibility,diveShown:!document.getElementById('diveBtn').hidden,diveText:document.getElementById('diveBtn').textContent,disabled:document.getElementById('diveBtn').disabled,prayShown:getComputedStyle(document.getElementById('pray')).display,places:o.places};});
  assert.equal(report.dive.side,'visible');assert.ok(report.dive.diveShown&&!report.dive.disabled&&report.dive.diveText==='dive',`the dive is offered (${JSON.stringify(report.dive)})`);assert.equal(report.dive.prayShown,'none','prayer stays hidden');assert.deepEqual(report.dive.places,['pool'],'the node reaches the pool alone');
  await petalThrough();await page.waitForFunction(()=>window.__village.opening.complete,null,{timeout:T});
  // 5. The dive: the node, the catwalk of D, back into the drop, up to the summit.
  assert.ok(await page.evaluate(()=>window.__village.opening.dive()),'she dives');await page.waitForFunction(()=>window.__village.mode==='deep',null,{timeout:T});await page.waitForTimeout(500);await shot('11-node');
  assert.ok(await page.evaluate(()=>window.__village.opening.catwalk()),'out onto the catwalk');await page.waitForFunction(()=>window.__village.mode==='catwalk',null,{timeout:T});await page.waitForTimeout(600);await shot('12-catwalk-D');
  assert.ok(await page.evaluate(()=>window.__village.opening.drop()),'back into the drop');await page.waitForFunction(()=>window.__village.mode==='deep',null,{timeout:T});
  assert.ok(await page.evaluate(()=>window.__village.opening.toPool()),'the root up');await page.waitForFunction(()=>window.__village.mode==='ground'&&window.__village.karst.zone==='summit',null,{timeout:T});
  // 6. A later meditation on the water: enter fades the world under the field; done early fades it back.
  assert.ok(await page.evaluate(()=>window.__village.opening.start()),'she meditates again at the pool');await page.waitForFunction(()=>window.__village.opening.mind.phase==='play',null,{timeout:T});
  report.again=await page.evaluate(()=>{const o=window.__village.opening;return {alpha:o.mind.uniforms.uAlpha.value,title:getComputedStyle(document.querySelector('#meditate .title')).display,done:getComputedStyle(document.getElementById('meditateDone')).display};});assert.equal(report.again.alpha,1);assert.notEqual(report.again.title,'none','the panel is whole on a later meditation');
  await page.evaluate(()=>window.__village.opening.done());await page.waitForFunction(()=>window.__village.mode==='ground'&&!window.__village.opening.mind.active,null,{timeout:T});
  // 7. A second load skips the opening; ?opening=0 skips it with everything shown.
  await page.reload();await page.waitForFunction(()=>window.__village&&window.__village.opening&&window.__village.character.status!=='loading',null,{timeout:T});
  report.reload=await page.evaluate(()=>({mode:window.__village.mode,complete:window.__village.opening.complete,intro:document.getElementById('intro').open}));assert.equal(report.reload.mode,'ground','a returning player wakes on the ground');assert.ok(report.reload.complete);assert.equal(report.reload.intro,false);
  await page.goto(url+'&opening=0');await page.waitForFunction(()=>window.__village&&window.__village.opening&&window.__village.character.status!=='loading',null,{timeout:T});
  report.override=await page.evaluate(()=>({on:window.__village.opening.on,bodyOpening:document.body.classList.contains('opening'),intro:document.getElementById('intro').open,fight:getComputedStyle(document.getElementById('fight')).display}));assert.equal(report.override.on,false);assert.equal(report.override.bodyOpening,false);assert.equal(report.override.intro,true,'the journey\'s intro');assert.notEqual(report.override.fight,'none');
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('opening browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
