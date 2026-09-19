import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/root-study');await mkdir(out,{recursive:true});
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/root-study\//,'/');if(path==='/')path='/root-discovery.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(4178,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report=[];
async function settle(page){await page.waitForFunction(()=>window.__rootStudy&&!window.__rootStudy.boardView.isBusy&&!window.__rootStudy.transitioning);await page.waitForTimeout(750);}
async function tapCell(page,cell){const point=await page.evaluate(cell=>{const r=window.__rootStudy;const mesh=r.boardView.group.children.find(x=>x.userData.gemId===r.board.grid[cell.row][cell.col].id);const p=mesh.position.clone();mesh.localToWorld(p.set(0,0,0));p.project(r.camera);return {x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};},cell);await page.touchscreen.tap(point.x,point.y);}
try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:4178/Rootwake/root-study/');await page.click('#begin');await settle(page);await page.screenshot({path:out+'/phone-surface.png'});
 const start=await page.evaluate(()=>window.__rootStudy.player.position.z);
 await page.locator('#walk').dispatchEvent('pointerdown',{pointerId:1,clientX:315,clientY:710,pointerType:'touch',bubbles:true});
 await page.locator('#walk').dispatchEvent('pointermove',{pointerId:1,clientX:315,clientY:678,pointerType:'touch',bubbles:true});
 await page.waitForFunction(start=>window.__rootStudy.player.position.z<start-.3,start);
 await page.locator('#walk').dispatchEvent('pointercancel',{pointerId:1,pointerType:'touch'});
 assert.equal(await page.evaluate(()=>window.__rootStudy.player.gesture.held),false);
 await page.click('#vision');await settle(page);assert.equal(await page.locator('#deepen').isDisabled(),true);await page.screenshot({path:out+'/phone-roots.png'});
 const tip=await page.evaluate(()=>{const r=window.__rootStudy,p=r.tipPoint.clone().project(r.camera);return{x:(p.x+1)*innerWidth/2,y:(1-p.y)*innerHeight/2};});await page.touchscreen.tap(tip.x,tip.y);assert.equal(await page.evaluate(()=>window.__rootStudy.state.listened),true);
 await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/phone-board.png'});
 for(let i=0;i<55;i++){if(await page.evaluate(()=>window.__rootStudy.state.energy>=100))break;const cells=await page.evaluate(()=>window.__rootStudy.possibleMove());assert.equal(cells.length,2);await tapCell(page,cells[0]);await tapCell(page,cells[1]);await page.waitForTimeout(50);await page.waitForFunction(()=>!window.__rootStudy.boardView.isBusy);}
 assert.ok(await page.evaluate(()=>window.__rootStudy.state.energy>=100),'Real board taps must gather sap');
 await page.click('#done');await settle(page);const before=await page.evaluate(()=>window.__rootStudy.state.energy);await page.click('#widen');assert.equal(await page.evaluate(()=>window.__rootStudy.state.energy),before-24);await settle(page);await page.screenshot({path:out+'/phone-wide.png'});
 await page.click('#deepen');await settle(page);assert.equal(await page.evaluate(()=>window.__rootStudy.state.energy),before-72);await page.screenshot({path:out+'/phone-deep.png'});
 await page.click('#mend');await settle(page);assert.equal(await page.evaluate(()=>window.__rootStudy.state.restored),true);assert.equal(await page.evaluate(()=>window.__rootStudy.state.energy),before-96);await page.screenshot({path:out+'/phone-restored.png'});
 const saved=await page.evaluate(()=>window.__rootStudy.state);await page.reload();await settle(page);assert.deepEqual(await page.evaluate(()=>window.__rootStudy.state),saved);
 await page.click('#vision');await settle(page);
 for(const [name,size]of [['small',{width:375,height:667}],['landscape',{width:844,height:390}],['desktop',{width:1280,height:900}]]){await page.setViewportSize(size);await settle(page);await page.screenshot({path:out+'/'+name+'-roots.png'});await page.click('#cultivate');await settle(page);await page.screenshot({path:out+'/'+name+'-board.png'});await page.click('#done');await settle(page);}
 assert.deepEqual(errors,[]);const stats=await page.evaluate(()=>({calls:window.__rootStudy.renderer.info.render.calls,triangles:window.__rootStudy.renderer.info.render.triangles}));report.push({passed:true,realMatch3:true,movement:true,saveReload:true,spending:true,viewports:4,stats});await writeFile(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}catch(e){for(const c of browser.contexts())for(const p of c.pages())await p.screenshot({path:out+'/failure.png'}).catch(()=>{});throw e;}finally{await browser.close();await new Promise(r=>server.close(r));}
