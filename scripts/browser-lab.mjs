// Production-bundle smoke tests and visual evidence, run on a browser-capable CI runner.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import assert from 'node:assert/strict';
const out = 'artifacts/lab-v25';
await mkdir(out, {recursive:true});
const root = resolve('dist');
const server = createServer(async (req,res) => {
  try {
    const pathname = new URL(req.url,'http://localhost').pathname.replace(/^\/Rootwake\/lab\//, '/');
    if (pathname === '/favicon.ico') { res.statusCode=204; res.end(); return; }
    const path = resolve(root, '.' + pathname);
    if (!path.startsWith(root + '/')) throw new Error('Invalid path');
    const types = {'.html':'text/html','.js':'application/javascript','.css':'text/css'};
    res.setHeader('Content-Type', types[extname(path)] ?? 'application/octet-stream');
    res.end(await readFile(path));
  } catch { res.statusCode=404; res.end('Not found'); }
});
await new Promise(r=>server.listen(4173,'127.0.0.1',r));
const browser = await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results = [];
// Wait for rendered frames, not a guessed number of milliseconds on software WebGL.
async function rendered(page, count = 2) {
  const before = await page.evaluate(() => window.__rootwake.renderer.info.render.frame);
  await page.waitForFunction(({before, count}) => window.__rootwake.renderer.info.render.frame >= before + count, {before, count}, {timeout:60000});
}
try {
  for (const [name,viewport] of [['desktop',{width:1440,height:1000}],['phone',{width:430,height:932}]]) {
    const page = await browser.newPage({viewport,deviceScaleFactor:1,isMobile:name==='phone',hasTouch:name==='phone'});
    const errors=[]; page.on('pageerror',e=>errors.push(e.message));
    page.on('response',res=>{ if(res.status()>=400) errors.push(`${res.status()} ${res.url()}`); });
    await page.goto('http://127.0.0.1:4173/lab.html');
    await page.waitForFunction(()=>!!window.__rootwake?.extras?.[0]?.gallery);
    for (const view of ['live','hall','gait','surface','feeding','turn','regard','idle']) {
      await page.selectOption('#lab-view',view);
      await rendered(page);
      const state=await page.evaluate(()=>{
        const r=window.__rootwake,g=r.extras[0].gallery;
        let invalid=0;r.scene.traverse(o=>{if(o.matrixWorld.elements.some(v=>!Number.isFinite(v))) invalid++;});
        return {position:r.player.position.toArray(),walkable:r.cave.isWalkable(r.player.position),visible:g.studies.filter(s=>s.group.visible).map(s=>s.id),invalid,drawCalls:r.renderer.info.render.calls};
      });
      assert.ok(state.walkable,`Invalid viewing position: ${view}`);
      assert.equal(state.invalid,0);
      assert.ok(state.drawCalls>10);
      if (!['live','hall'].includes(view)) assert.ok(state.visible.includes(view), `Selected bay is hidden: ${view}`);
      await page.screenshot({path:`${out}/${name}-${view}.png`});
      results.push({name,view,...state});
    }
    await page.click('#lab-pause');
    const clock = await page.evaluate(()=>window.__rootwake.extras[0].gallery.clockMs);
    await rendered(page);
    assert.equal(await page.evaluate(()=>window.__rootwake.extras[0].gallery.clockMs),clock);
    await page.selectOption('#lab-view','surface');
    await rendered(page);
    assert.ok(await page.evaluate(()=>window.__rootwake.extras[0].gallery.studies.find(s=>s.id==='surface').group.visible));
    await page.click('#lab-step'); await rendered(page);
    assert.ok(Math.abs(await page.evaluate(()=>window.__rootwake.extras[0].gallery.clockMs)-clock-1000/60)<1e-5);
    // Capture the actual shared rig at three successive first-corner stages, and on the ceiling/descent.
    for (const [label,distance] of [['head-first',3.72],['thorax-follows',4.15],['abdomen-follows',4.9],['ceiling',10.0],['descending',15.5]]) {
      await page.evaluate(({distance})=>{
        const r=window.__rootwake,g=r.extras[0].gallery,s=g.studies.find(s=>s.id==='surface');
        const seconds=(distance-1)/0.9;
        s.monster.updateStudy(1+seconds*1000,s.sample(seconds),r.player.eye());
        r.renderer.render(r.scene,r.camera);
      },{distance});
      await rendered(page);
      await page.screenshot({path:`${out}/${name}-${label}.png`});
    }
    assert.deepEqual(errors,[],`Browser errors: ${name}`);
    await page.close();
  }
  await writeFile(`${out}/browser-results.json`,JSON.stringify({passed:true,results},null,2));
  console.log(`Browser verification passed: ${results.length} views, pause/step/navigation, 10 corner/contact screenshots.`);
} finally { await browser.close(); await new Promise(r=>server.close(r)); }
