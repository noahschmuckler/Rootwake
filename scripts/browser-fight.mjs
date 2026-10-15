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
  await ahead(1.2);
  const strike=await page.evaluate(()=>{const v=window.__village,id=v.raiders().find(r=>r.state==='hunting').id,hp=v.raiders().find(r=>r.id===id).hp;v.cooldowns.strike=0;v.attack('strike');const r=v.raiders().find(r=>r.id===id);return {hp,after:r.hp,stop:v.feel.impact.stop,trauma:v.feel.impact.trauma,kick:v.feel.impact.kick};});
  report.strike=strike;
  assert.ok(strike.after<strike.hp,'the strike lands');assert.ok(strike.stop>0,'the world stops for it');assert.ok(strike.trauma>0,'the camera jolts');
  // Freeze the world on the blow for the screenshot.
  await page.evaluate(()=>{const v=window.__village;v.cooldowns.strike=0;v.attack('strike');v.feel.impact.stop=60;v.feel.impact.trauma=0;});
  await page.waitForFunction(()=>window.__village.feel.fx.live>5,null,{timeout:60000});report.live=await page.evaluate(()=>window.__village.feel.fx.live);
  await page.screenshot({path:`${out}/strike.png`,timeout:180000});
  await page.evaluate(()=>{window.__village.feel.impact.stop=0;});
  // The thorns.
  await ahead(1.5);
  await page.evaluate(()=>{const v=window.__village;v.cooldowns.thorn=0;v.attack('thorn');});
  await page.waitForFunction(()=>window.__village.scene.getObjectByName('hit-thorns').count>=24,null,{timeout:60000});
  await page.evaluate(()=>{const v=window.__village;v.feel.impact.stop=60;v.feel.impact.trauma=0;});
  await page.screenshot({path:`${out}/thorns.png`,timeout:180000});
  await page.evaluate(()=>{window.__village.feel.impact.stop=0;});
  // A bite: stand still by a hunting foe until it bites.
  await ahead(0.9);
  await page.waitForFunction(()=>Number(document.getElementById('hurt').style.opacity)>0.05,null,{timeout:120000});
  report.bite=await page.evaluate(()=>({vigor:window.__village.hero.vigor,hurt:Number(document.getElementById('hurt').style.opacity)}));
  await page.screenshot({path:`${out}/bitten.png`,timeout:180000});
  // Finish the wave: the last one falls in slow motion.
  await page.waitForFunction(()=>window.__village.raiders().some(r=>window.__village.feel.practice.ids.includes(r.id)&&r.state==='hunting'),null,{timeout:120000});
  report.before=await page.evaluate(()=>({wave:window.__village.feel.practice.wave,foes:window.__village.raiders().map(r=>[r.kind,r.state,r.hp])}));
  const finale=await page.evaluate(()=>{const v=window.__village;let slow=0;for(let i=0;i<40;i++){const foes=v.raiders().filter(r=>v.feel.practice.ids.includes(r.id)&&r.state==='hunting');if(!foes.length)break;const l=v.herLocal(),yaw=v.player.yaw;for(const r of foes)v.placeRaider(r.id,l.x-Math.sin(yaw)*1.1,l.z-Math.cos(yaw)*1.1);v.cooldowns.strike=0;v.attack('strike');slow=Math.max(slow,v.feel.impact.slow);}return {slow,left:v.raiders().filter(r=>v.feel.practice.ids.includes(r.id)&&r.state==='hunting').length};});
  report.finale=finale;assert.equal(finale.left,0,'the wave is beaten');assert.ok(finale.slow>0,'its last foe falls in slow motion');
  await page.waitForFunction(()=>window.__village.feel.practice.wave>=2,null,{timeout:120000});
  report.second=await page.evaluate(()=>window.__village.feel.practice.wave);
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('fight browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
