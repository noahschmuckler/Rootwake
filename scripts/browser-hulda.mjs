import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist');
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(req.url.split('?')[0]).replace(/^\/Rootwake\/hulda/,'');const file=resolve(root,'.'+(path==='/'?'/hulda.html':path));if(!file.startsWith(root+'/'))throw Error();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'})[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404);res.end();}}).listen(4178,'127.0.0.1');
const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
await mkdir('artifacts/hulda',{recursive:true});
const errors=[];
async function idle(page){await page.waitForFunction(()=>!window.__hulda.boardView.isBusy&&!document.querySelector('#back').disabled,null,{timeout:60000});}
async function swap(page,index){
  const points=await page.evaluate(index=>{
    const h=window.__hulda,b=h.boards[index],grid=b.grid.map(row=>row.map(g=>g.type));
    const runs=()=>{for(let r=0;r<6;r++)for(let c=0;c<6;c++){if(c<4&&grid[r][c]===grid[r][c+1]&&grid[r][c]===grid[r][c+2])return true;if(r<4&&grid[r][c]===grid[r+1][c]&&grid[r][c]===grid[r+2][c])return true;}return false;};
    for(let r=0;r<6;r++)for(let c=0;c<6;c++)for(const[dr,dc]of[[0,1],[1,0]]){
      if(r+dr>=6||c+dc>=6)continue;[grid[r][c],grid[r+dr][c+dc]]=[grid[r+dr][c+dc],grid[r][c]];const valid=runs();[grid[r][c],grid[r+dr][c+dc]]=[grid[r+dr][c+dc],grid[r][c]];
      if(valid)return [b.grid[r][c].id,b.grid[r+dr][c+dc].id].map(id=>{const m=h.boardView.group.children.find(m=>m.userData.gemId===id),v=m.position.clone();h.boardView.group.localToWorld(v);v.project(h.camera);return {x:(v.x+1)*innerWidth/2,y:(1-v.y)*innerHeight/2};});
    }
  },index);
  assert.ok(points,'legal swap');
  for(const p of points){assert.ok(p.x>0&&p.x<page.viewportSize().width&&p.y>0&&p.y<page.viewportSize().height);await page.mouse.click(p.x,p.y);}
  await page.waitForFunction(()=>window.__hulda.boardView.isBusy,null,{timeout:10000});await idle(page);
}
try{
  for(const[name,viewport]of[['phone',{width:390,height:844}],['landscape',{width:844,height:390}],['desktop',{width:1440,height:900}]]){
    const page=await browser.newPage({viewport,hasTouch:true,isMobile:name!=='desktop'});page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:4178/hulda.html?debug=1');await page.waitForFunction(()=>!!window.__hulda);await page.click('#continue');
    await page.screenshot({path:`artifacts/hulda/${name}-garden.png`});
    // Genuine pointer movement; direction is forward from the initial viewpoint.
    const before=await page.evaluate(()=>window.__hulda.player.position.z);
    const stick=await page.locator('#walk').boundingBox();await page.mouse.move(stick.x+58,stick.y+58);await page.mouse.down();await page.mouse.move(stick.x+58,stick.y+26);
    await page.waitForFunction(z=>window.__hulda.player.position.z<z-.15,before);await page.mouse.up();
    await page.click('#attune');await idle(page);await page.screenshot({path:`artifacts/hulda/${name}-matching.png`});
    await swap(page,0);assert.ok(await page.evaluate(()=>window.__hulda.state.progress[0]>0));
    if(name==='phone'){
      for(let i=0;i<6;i++){
        if(i){await page.evaluate(i=>{const h=window.__hulda,n=h.garden.nodes[i].group.position;h.player.teleport(n.x,n.z+2);},i);await page.waitForFunction(i=>document.querySelector('#attune').textContent===['Coax fruit','Weave a bower','Call the roots','Awaken medicine','Recall abundance','Cleanse the blight'][i],i);await page.click('#attune');await idle(page);}
        for(let n=0;n<65;n++){
          if(await page.evaluate(i=>window.__hulda.state.progress[i]>=[30,54,45,54,66,90][i],i))break;
          if(i===5&&await page.locator('#ward').isEnabled())await page.click('#ward');
          if(await page.locator('#surge').isEnabled())await page.click('#surge');else await swap(page,i);
          await idle(page);
        }
        assert.ok(await page.evaluate(i=>window.__hulda.state.progress[i]>=[30,54,45,54,66,90][i],i),`form ${i} completed`);
        await page.screenshot({path:`artifacts/hulda/phone-form-${i}.png`});await page.click('#back');await page.locator('#story[open]').waitFor();await page.click('#continue');
        console.log(`phone: form ${i+1}/6 completed through board taps and powers`);
      }
      const saved=await page.evaluate(()=>window.__hulda.state.progress);await page.reload();await page.waitForFunction(()=>!!window.__hulda);assert.deepEqual(await page.evaluate(()=>window.__hulda.state.progress),saved);
    }
    await page.close();console.log(`${name}: rendered and pointer interaction passed`);
  }
  assert.deepEqual(errors,[]);
}finally{await browser.close();server.close();}
