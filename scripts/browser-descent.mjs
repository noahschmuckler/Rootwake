// The Descent, D0 (headless Chromium, SwiftShader): the catwalk loads, she stands at the gangway's end, the snerk at
// the archive answers her, every layer builds, the draw calls stay within a phone's budget, no errors. Screenshots at a
// phone's portrait aspect land in artifacts/descent.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/descent');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/'||path==='/descent/')path='/descent.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4200,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={};
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4200${BASE}descent/?hud=1`);await page.click('#begin');
  await page.waitForFunction(()=>window.__descent&&window.__descent.renderer.info.render.calls>0,null,{timeout:120000});
  await page.waitForTimeout(3000);
  report.start=await page.evaluate(()=>{const D=window.__descent,f=D.player.feet();return {depth:D.depth,letter:D.catwalk.letter,feet:[f.x,f.y,f.z],calls:D.renderer.info.render.calls,tris:D.renderer.info.render.triangles};});
  assert.equal(report.start.letter,'R');assert.ok(Math.abs(report.start.feet[1])<0.05,'she stands on the catwalk');
  assert.ok(report.start.calls<150,`draw calls within budget (${report.start.calls})`);
  await page.screenshot({path:`${out}/step-out.png`,timeout:180000});
  // To the archive: the snerk answers.
  await page.evaluate(()=>{const D=window.__descent,sp=D.stationSpot(0),a=Math.atan2(sp.z,sp.x);D.player.teleport(sp.x+Math.sin(a)*1.0,sp.z-Math.cos(a)*1.0,0,0);const f=D.player.feet();D.player.yaw=Math.atan2(-(sp.x-f.x),-(sp.z-f.z));});
  await page.waitForFunction(()=>window.__descent.near&&window.__descent.near.kind==='listen',null,{timeout:60000});
  await page.evaluate(()=>window.__descent.act());
  await page.waitForFunction(()=>!document.getElementById('bubble').hidden,null,{timeout:60000});
  report.said=await page.evaluate(()=>document.getElementById('bubble').textContent);
  assert.ok(report.said.length>10,'the snerk speaks');
  await page.waitForTimeout(1500);await page.screenshot({path:`${out}/archive.png`,timeout:180000});
  // Every layer builds; the deepest one too.
  for(const d of [1,3,6]){await page.evaluate(d=>window.__descent.setDepth(d),d);await page.waitForTimeout(2500);report['d'+d]=await page.evaluate(()=>{const D=window.__descent;return {letter:D.catwalk.letter,keepers:D.world.keepers.map(k=>k.kind),calls:D.renderer.info.render.calls};});assert.ok(report['d'+d].calls<200,`layer ${d} within budget`);}
  assert.deepEqual(report.d6.keepers.sort(),['greeblin','hollowed','snerk']);
  await page.screenshot({path:`${out}/layer-d.png`,timeout:180000});
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('descent browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
