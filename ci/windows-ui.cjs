'use strict';
const fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const {_electron}=require(path.resolve('.ci-tools/node_modules/playwright'));
(async()=>{
 const executable=path.resolve(process.argv[2]),report=process.argv[3];
 const app=await _electron.launch({executablePath:executable,timeout:60000});
 try{
  const page=await app.firstWindow();await page.locator('#app-version').filter({hasText:'준비됨'}).waitFor({timeout:90000});
  assert.equal(await page.title(),'링파일');assert.ok(await page.locator('#url').isEnabled());
  await page.locator('#url').fill('https://example.com/');await page.locator('#submit').click();
  await page.locator('#status-panel').waitFor({state:'visible'});assert.match(await page.locator('#status-panel').innerText(),/YouTube|링크/);
  await page.screenshot({path:'Windows-UI.png',fullPage:true});
  await fs.writeFile(report,JSON.stringify({platform:'Windows',status:'passed',checks:['installed application starts','sandboxed packaged UI loads','tool preflight succeeds','IPC status bridge responds','invalid link rejected'],liveYouTubeRequest:false},null,2));
 }finally{await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
