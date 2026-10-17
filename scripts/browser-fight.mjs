// F1, the practice clearing (headless Chromium, SwiftShader): it boots past the intro with nothing saved (the page's own
// storage), a wave of foes is set down hunting her, a strike that lands freezes the world (hit-stop), shakes the camera,
// drives the foe back and throws flecks; the thorns tear up round her; a bite reddens the screen's edge; the last foe of a
// wave falls in slow motion. Screenshots at a phone's portrait aspect land in artifacts/fight.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/fight');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/'||path==='/fight/')path='/fight.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4194,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={};
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4194${BASE}fight/?q=${process.env.FIGHT_Q??'low'}`);await page.click('#begin');
  await page.waitForFunction(()=>window.__village&&window.__village.character.status!=='loading'&&window.__look,null,{timeout:180000});
  report.storage=await page.evaluate(()=>!(window.localStorage instanceof Storage));
  assert.ok(report.storage,'the practice saves nothing to the real storage');
  // The first wave comes.
  await page.waitForFunction(()=>window.__village.feel.practice.wave>=1&&window.__village.raiders().some(r=>r.state==='hunting'),null,{timeout:120000});
  report.first=await page.evaluate(()=>({wave:window.__village.feel.practice.wave,foes:window.__village.raiders().map(r=>({kind:r.kind,state:r.state})),fight:!document.getElementById('fight').classList.contains('closed'),clock:window.__village.clock}));
  assert.ok(report.first.fight,'the fight buttons are open');
  // Set the foe just ahead of her and strike.
  const ahead=d=>page.evaluate(d=>{const v=window.__village,f=v.player.feet(),yaw=v.player.yaw,l=v.herLocal(),dx=-Math.sin(yaw)*d,dz=-Math.cos(yaw)*d;for(const r of v.raiders())if(v.feel.practice.ids.includes(r.id)&&r.state==='hunting')v.placeRaider(r.id,l.x+dx,l.z+dz);void f;},d);
  // F2: her fight clips are loaded, so a press starts a move and the blow lands at its contact.
  await page.waitForFunction(()=>window.__village.feel.fightClips==='ready',null,{timeout:180000});
  await ahead(1.2);
  report.strike=await page.evaluate(()=>{const v=window.__village,r=v.raiders().find(r=>r.state==='hunting');window.__t={id:r.id,hp:r.hp,felt:v.feel.impact.log.length};v.attack('strike');return {hp:r.hp,move:v.feel.moves.playing};});
  assert.equal(report.strike.move,'attack-1','a tap starts the first blow of the combo');
  await page.waitForFunction(()=>{const v=window.__village,r=v.raiders().find(r=>r.id===window.__t.id);return r.hp<window.__t.hp;},null,{timeout:120000});
  report.landed=await page.evaluate(()=>{const v=window.__village;return {hp:v.raiders().find(r=>r.id===window.__t.id).hp,felt:v.feel.impact.log.slice(window.__t.felt),staff:v.feel.staff.shown};});
  assert.ok(report.landed.felt.length>0,'the blow is felt (hit-stop, shake)');assert.ok(report.landed.staff,'the staff is out');
  await page.waitForFunction(()=>window.__village.feel.fx.live>5,null,{timeout:60000});
  // Freeze mid-swing for the screenshot.
  await page.waitForFunction(()=>!window.__village.feel.moves.queue.busy,null,{timeout:120000});
  await ahead(1.2);
  await page.evaluate(()=>{window.__village.attack('strike');});
  await page.waitForFunction(()=>{const c=window.__village.feel.moves.queue.current;return c&&c.t>=1.0;},null,{timeout:120000});
  await page.evaluate(()=>{const v=window.__village;v.feel.impact.stop=60;v.feel.impact.trauma=0;});
  await page.waitForTimeout(2500);
  await page.screenshot({path:`${out}/strike.png`,timeout:180000});
  await page.evaluate(()=>{window.__village.feel.impact.stop=0;});
  // The thorns: the cast, then the spikes.
  await page.waitForFunction(()=>!window.__village.feel.moves.queue.busy,null,{timeout:120000});
  await ahead(1.5);
  await page.evaluate(()=>{const v=window.__village;v.cooldowns.thorn=0;v.attack('thorn');});
  await page.waitForFunction(()=>window.__village.scene.getObjectByName('hit-thorns').count>=24,null,{timeout:120000});
  await page.evaluate(()=>{const v=window.__village;v.feel.impact.stop=60;v.feel.impact.trauma=0;});
  await page.waitForTimeout(2500);
  await page.screenshot({path:`${out}/thorns.png`,timeout:180000});
  await page.evaluate(()=>{window.__village.feel.impact.stop=0;});
  // A bite: stand still by a hunting foe until it bites.
  await page.waitForFunction(()=>window.__village.raiders().some(r=>window.__village.feel.practice.ids.includes(r.id)&&r.state==='hunting'),null,{timeout:120000});
  await ahead(0.9);
  await page.waitForFunction(()=>Number(document.getElementById('hurt').style.opacity)>0.05,null,{timeout:120000});
  report.bite=await page.evaluate(()=>({vigor:window.__village.hero.vigor,hurt:Number(document.getElementById('hurt').style.opacity)}));
  await page.screenshot({path:`${out}/bitten.png`,timeout:180000});
  // Finish the wave: the last one falls in slow motion.
  const wave=await page.evaluate(()=>window.__village.feel.practice.wave);
  for(let i=0;i<30;i++){
    const left=await page.evaluate(()=>window.__village.raiders().filter(r=>window.__village.feel.practice.ids.includes(r.id)&&r.state==='hunting').length);if(!left)break;
    await ahead(1.1);await page.evaluate(()=>{window.__t2=window.__village.feel.impact.log.length;window.__village.attack('strike');});
    await page.waitForFunction(()=>window.__village.feel.impact.log.length>window.__t2||!window.__village.feel.moves.queue.busy,null,{timeout:60000});
  }
  report.finale=await page.evaluate(()=>window.__village.feel.impact.log);
  assert.ok(report.finale.includes('finale'),'the last foe of a wave falls in slow motion');
  await page.waitForFunction(w=>window.__village.feel.practice.wave>w,wave,{timeout:120000});
  report.second=await page.evaluate(()=>window.__village.feel.practice.wave);
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('fight browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
