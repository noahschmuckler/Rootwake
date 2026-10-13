// The vista under headless Chromium (SwiftShader): it builds, renders without shader or console errors at every hour
// and postcard, the readout reports, and screenshots at a phone's portrait aspect land in artifacts/vista for judging.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/vista');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/')path='/vista.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4191,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const W=+(process.env.VISTA_W??390),H=+(process.env.VISTA_H??844),Q=process.env.VISTA_Q??'medium';
const only=process.env.VISTA_SHOTS?.split(',');
const report=[];
try{
  const page=await browser.newPage({viewport:{width:W,height:H},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4191${BASE}?intro=0&dpr=1&q=${Q}&photo=${process.env.VISTA_PHOTO??'1'}`);
  await page.waitForFunction(()=>window.__rootwake?.cards,null,{timeout:120000});
  const cards=await page.evaluate(()=>window.__rootwake.cards.map(c=>c.name));
  for(let c=0;c<cards.length;c++)for(let h=0;h<4;h++){
    const name=`card${c}-hour${h}`;if(only&&!only.includes(name))continue;
    await page.evaluate(([c,h])=>{window.__rootwake.setHour(h);window.__rootwake.goCard(c);},[c,h]);
    await page.waitForTimeout(1500);
    await page.screenshot({path:`${out}/${name}.png`,timeout:180000});
    report.push({name,card:cards[c]});
  }
  const hud=await page.evaluate(()=>document.getElementById('hud').textContent);
  report.push({hud});
  assert.match(hud,/fps/);assert.match(hud,/tris/);
  assert.deepEqual(errors,[],'no console or shader errors');
  console.log('vista browser checks passed');
}finally{await writeFile(`${out}/report.json`,JSON.stringify(report,null,2));await browser.close();server.close();}
