// F5a, the whip in the practice clearing (headless Chromium, SwiftShader; WHIP.md "F5a as built"): the whip button is there; a foe
// set 6 m ahead is played a matador (hauled in, clotheslined, hurt, laid prone and held while it lies there), and a foe 2.4 m ahead with
// a neighbour by her old spot is played a swap (she ends where it stood, it is crashed into the neighbour, both hurt); no page errors.
// The figures' time is hers, so at SwiftShader's frame rate each plays in slow motion: screenshots in artifacts/whip.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {execSync} from 'node:child_process';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require('playwright'));}catch{({chromium}=require(execSync('npm root -g').toString().trim()+'/playwright'));}
const root=resolve('dist'),out=resolve('artifacts/whip');await mkdir(out,{recursive:true});
const BASE=process.env.STUDY_BASE??'/';
const server=createServer(async(req,res)=>{try{let path=new URL(req.url,'http://localhost').pathname;if(path.startsWith(BASE))path='/'+path.slice(BASE.length);if(path==='/'||path==='/fight/')path='/fight.html';if(path==='/favicon.ico'){res.writeHead(204).end();return;}const file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('Bad path');res.setHeader('Content-Type',{'.html':'text/html','.js':'application/javascript','.css':'text/css'}[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(4197,'127.0.0.1',r));
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={};
try{
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true});
  const errors=[];page.on('console',m=>{if(m.type()==='error'||/THREE\.WebGLProgram|Shader Error/.test(m.text()))errors.push(m.text());});page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(`http://127.0.0.1:4197${BASE}fight/?q=low`);await page.click('#begin',{timeout:400000});
  await page.waitForFunction(()=>window.__village&&window.__village.feel.fightClips==='ready',null,{timeout:300000});
  await page.waitForFunction(()=>window.__village.feel.practice.wave>=1,null,{timeout:120000});
  report.button=await page.evaluate(()=>window.__village.feel.whip.button);assert.ok(report.button,'the whip button is shown in the practice clearing');
  // Set foes down at (ahead, right) metres from her, the rest sent far off; their wind ups cleared and their hp topped up so a beat does not kill.
  const stage=ps=>page.evaluate(ps=>{const v=window.__village,yaw=v.player.yaw,l=v.herLocal(),f=v.player.feet(),ox=f.x-l.x,oz=f.z-l.z,fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);const ids=v.raiders().filter(r=>r.state==='hunting'&&!(r.choreo>0)).map(r=>r.id);ps.forEach(([a,b],i)=>{const x=l.x+fx*a+rx*b,z=l.z+fz*a+rz*b;if(ids[i]!==undefined)v.placeRaider(ids[i],x,z);else v.feel.spawn('wolf',x+ox,z+oz);});for(const id of ids.slice(ps.length))v.placeRaider(id,l.x+fx*40,l.z+fz*40);for(const r of v.live.raiders){r.biteClock=0;r.hp=Math.max(r.hp,20);}},ps);
  // A screenshot is for the eye, not the check: the runner's SwiftShader can take longer than a screenshot's default wait.
  const shot=n=>page.screenshot({path:`${out}/${n}.png`,timeout:120000}).catch(e=>console.warn('screenshot',n,String(e).split('\n')[0]));
  async function play(name,ps){
    await stage(ps);
    const start=await page.evaluate(()=>{const v=window.__village,l=v.herLocal();window.__hp=Object.fromEntries(v.raiders().map(r=>[r.id,r.hp]));window.__at=l;window.__pose={roll:0,lift:0,held:[]};const watch=()=>{if(!v.feel.whip.flow)for(const r of v.live.raiders)if(r.choreo>0&&!window.__pose.held.includes(r.id))window.__pose.held.push(r.id);for(const p of v.feel.whip.poses){window.__pose.roll=Math.max(window.__pose.roll,Math.abs(p.roll));window.__pose.lift=Math.max(window.__pose.lift,p.lift);}if(v.feel.whip.flow||v.feel.whip.poses.length)requestAnimationFrame(watch);};requestAnimationFrame(watch);v.feel.whip.press();return v.feel.whip.flow;});
    assert.ok(start,`${name}: a figure starts`);assert.equal(start.figure,name);
    let maxRoll=0,maxLift=0;
    for(let i=0;i<80;i++){const st=await page.evaluate(()=>{const v=window.__village;return {f:v.feel.whip.flow,poses:v.feel.whip.poses,flowing:v.defense.flowing};});for(const p of st.poses){maxRoll=Math.max(maxRoll,Math.abs(p.roll));maxLift=Math.max(maxLift,p.lift);}if(i%4===0)await shot(`${name}-${String(i).padStart(2,'0')}`);if(!st.f)break;}
    const end=await page.evaluate(t=>{const v=window.__village,l=v.herLocal();return {seen:window.__pose,moved:Math.hypot(l.x-window.__at.x,l.z-window.__at.z),hurt:v.raiders().filter(r=>r.hp<window.__hp[r.id]).map(r=>r.id),held:[...new Set([...v.raiders().filter(r=>r.choreo>0).map(r=>r.id),...window.__pose.held])],target:t,out:v.feel.whip.out};},start.target);
    // Every frame's pose, recorded in the page (a slow runner's screenshots span many frames).
    return {start,...end,maxRoll:Math.max(maxRoll,end.seen.roll),maxLift:Math.max(maxLift,end.seen.lift)};
  }
  report.matador=await play('matador',[[6,0]]);
  assert.ok(report.matador.hurt.includes(report.matador.target),'the clothesline hurts it');
  assert.ok(report.matador.maxRoll>1.2&&report.matador.maxLift>0.3,'it is thrown up and laid on its side');
  assert.ok(report.matador.held.includes(report.matador.target),'it is held lying there after her part ends');
  assert.ok(report.matador.out,'the whip is out');
  await page.waitForFunction(()=>window.__village.raiders().every(r=>!(r.choreo>0)),null,{timeout:120000});
  report.swap=await play('swap',[[2.4,0],[-1.2,0.9]]);
  assert.equal(report.swap.start.foes.length,2,'the swap takes the neighbour in');
  assert.ok(report.swap.hurt.length>=2,'the crash hurts both');
  assert.ok(report.swap.moved>1.5,`she has crossed to where it stood (${report.swap.moved.toFixed(2)} m)`);
  // A strike takes the staff back.
  report.strike=await page.evaluate(()=>{const v=window.__village;v.attack('strike');return {out:v.feel.whip.out,staff:v.feel.staff.shown};});
  assert.ok(!report.strike.out&&report.strike.staff,'a strike brings the staff back');
  report.errors=errors;assert.equal(errors.length,0,`no page errors: ${errors.slice(0,3).join(' | ')}`);
  console.log('whip browser checks passed');
}finally{await writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2));await browser.close();server.close();}
