// Parkour (headless Chromium, SwiftShader; MOBILITY.md "Parkour"): the practice course loads with its clips, and
// the stick alone (a held W) takes her onto a waist-high top by the mount, up a climb, over a rail and off a sheer drop by a hang, each posed by its
// clip, with no errors. Screenshots at a phone's portrait aspect land in artifacts/parkour.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/parkour');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/'||path==='/parkour/')path='/parkour.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4201,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={};
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4201${BASE}parkour/?hud=1&intro=0`);
  await page.waitForFunction(()=>window.__parkour&&window.__parkour.clipStatus!=='loading',null,{timeout:180000});
  report.clips=await page.evaluate(()=>({status:window.__parkour.clipStatus,clips:window.__parkour.traverse?.clips}));
  assert.equal(report.clips.status,'ready',JSON.stringify(report.clips));assert.ok(report.clips.clips.length>=10,'every parkour clip is loaded');
  // Every move she makes and every clip stage it plays, as the frames go by.
  await page.evaluate(()=>{const P=window.__parkour;P.seen={moves:[],stages:new Set()};const on=P.player.motor.onCommit;P.player.motor.onCommit=p=>{P.seen.moves.push(p.kind);on(p);};(function poll(){const s=P.traverse?.stage;if(s)P.seen.stages.add(s);requestAnimationFrame(poll);})();});
  const run=async(name,x,z,want,shots)=>{
    await page.evaluate(([x,z])=>{const P=window.__parkour;P.player.teleport(x,z,0);P.player.pitch=0.1;P.seen.moves.length=0;},[x,z]);
    await page.keyboard.down('w');
    for(let i=0;i<shots;i++){await page.waitForFunction(w=>window.__parkour.seen.moves.includes(w)||null,want,{timeout:120000}).catch(()=>{});await page.waitForTimeout(500);await page.screenshot({path:`${out}/${name}-${i}.png`,timeout:120000});}
    await page.waitForFunction(()=>window.__parkour.player.motor.mode==='grounded'&&!window.__parkour.player.motor.traversal,null,{timeout:120000});
    await page.keyboard.up('w');
    return page.evaluate(()=>[...window.__parkour.seen.moves]);
  };
  report.clamber=await run('clamber',0,-6.3,'clamber',3);assert.ok(report.clamber.includes('clamber'),`a clamber from the stick (${report.clamber})`);
  report.ramp=await run('ramp',12,-2,'step',1);assert.ok(report.ramp.includes('step')&&!report.ramp.includes('clamber'),`the bridge's foot is stepped, not clambered (${report.ramp})`);
  report.climb=await run('climb',0,-11.6,'climb',3);assert.ok(report.climb.includes('climb'),`a climb from the stick (${report.climb})`);
  report.vault=await run('vault',4,-2,'vault',2);assert.ok(report.vault.includes('vault'),`a vault from the stick (${report.vault})`);
  report.drop=await run('drop',0,-21.5,'hangDrop',3);assert.ok(report.drop.includes('hangDrop'),`a hang drop from the stick (${report.drop})`);
  report.stages=await page.evaluate(()=>[...window.__parkour.seen.stages]);
  for(const s of ['mount','stand','reach','hang','pull','vault','lower','fall'])assert.ok(report.stages.includes(s),`the ${s} stage played its clip (${report.stages})`);
  assert.deepEqual(errors,[]);
  await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
  console.log('parkour browser checks passed');
}finally{await browser.close();server.close();}
