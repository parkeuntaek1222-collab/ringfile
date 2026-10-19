'use strict';
// Runs on a fresh Windows or macOS host against the actual packaged tools.
// All media is generated locally; this does not claim a successful YouTube request.
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const assert=require('node:assert/strict'),{spawnSync}=require('node:child_process'),{createHash}=require('node:crypto');
const [binArg,engineArg,fixtureArg,reportArg]=process.argv.slice(2);
const bin=path.resolve(binArg),{Engine}=require(path.resolve(engineArg));
const tool=name=>path.join(bin,name+(process.platform==='win32'?'.exe':''));
const run=(name,args)=>{const r=spawnSync(tool(name),args,{encoding:'utf8',timeout:90000,windowsHide:true});assert.equal(r.status,0,r.stderr);return r.stdout;};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ringfile-release-')),dest=path.join(root,'한글 저장 폴더'),jobs=path.join(root,'jobs');
 await fs.mkdir(dest);let server;
 const report={platform:process.platform,arch:process.arch,os:os.release(),source:'generated local media',checks:[]};
 try{
  run('ffmpeg',['-v','error','-f','lavfi','-i','sine=frequency=440:duration=2','-c:a','aac','-b:a','128k','-f','mp4',path.join(root,'audio.m4a')]);
  run('ffmpeg',['-v','error','-f','lavfi','-i','color=c=red:s=64x64','-frames:v','1',path.join(root,'cover.jpg')]);
  await fs.copyFile(path.resolve(fixtureArg),path.join(root,'video.mp4'));
  server=http.createServer(async(req,res)=>{const name=req.url.slice(1);if(!['audio.m4a','cover.jpg','video.mp4'].includes(name)){res.writeHead(404);res.end();return;}const bytes=await fs.readFile(path.join(root,name));res.writeHead(200,{'Content-Length':bytes.length});res.end(bytes);});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
  const raw={id:'abcdefghijk',title:'링파일 배포 검증',artist:'Ringfile test tone',duration:2,age_limit:0,availability:'public',is_live:false,is_upcoming:false,extractor:'generic',extractor_key:'Generic',webpage_url:origin+'/audio.m4a',thumbnail:origin+'/cover.jpg',thumbnails:[{url:origin+'/cover.jpg',id:'test'}],formats:[{format_id:'140',url:origin+'/audio.m4a',ext:'m4a',container:'m4a_dash',vcodec:'none',acodec:'mp4a.40.2',abr:128},{format_id:'137',url:origin+'/video.mp4',ext:'mp4',vcodec:'avc1.64000a',acodec:'none',height:64,width:64,tbr:30}]};
  const infoFile=path.join(root,'fixture.json');await fs.writeFile(infoFile,JSON.stringify(raw));
  const engine=new Engine({bin,jobs});await engine.preflight();report.checks.push('all bundled tools start');
  const actualRun=engine.run.bind(engine);
  engine.run=async(name,args,op,options)=>{
   if(name==='yt-dlp'&&args.includes('--dump-single-json'))return JSON.stringify(raw);
   if(name==='yt-dlp')return actualRun(name,[...args.slice(0,args.lastIndexOf('--')),'--load-info-json',infoFile],op,options);
   return actualRun(name,args,op,options);
  };
  const info=await engine.inspect('https://www.youtube.com/watch?v=abcdefghijk');
  const download=(format,quality)=>engine.download({inspectionID:info.inspectionID,format,quality,destination:dest});
  const audio=await download('mp3','320');assert.ok(audio.coverEmbedded&&audio.metadataEmbedded);
  const probe=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',audio.path]));
  assert.ok(probe.streams.some(s=>s.codec_name==='mp3'&&s.bit_rate==='320000'));
  assert.equal(probe.format.tags.title,raw.title);assert.ok(probe.streams.some(s=>s.disposition?.attached_pic===1));
  run('ffmpeg',['-v','error','-i',audio.path,'-map','0:a:0','-f','null','-']);report.checks.push('AAC source -> 320kbps MP3, cover, Unicode tags, complete decode');
  const firstHash=hash(await fs.readFile(audio.path));const again=await download('mp3','320');
  assert.notEqual(again.path,audio.path);assert.equal(hash(await fs.readFile(audio.path)),firstHash);report.checks.push('atomic no-overwrite save and duplicate naming');
  const video=await download('mp4','64');const mp4=JSON.parse(run('ffprobe',['-v','error','-show_streams','-show_format','-of','json',video.path]));
  assert.ok(mp4.streams.some(s=>s.codec_name==='h264'));assert.ok(mp4.streams.some(s=>s.codec_name==='aac'));
  run('ffmpeg',['-v','error','-i',video.path,'-f','null','-']);report.checks.push('M4A repair + H264/AAC MP4 merge and complete decode');
  const bad=path.join(root,'bad.mp3');await fs.writeFile(bad,'invalid');await engine.operation(op=>assert.rejects(engine.verify(bad,'mp3',2,op),{code:'INVALID_MEDIA'}));report.checks.push('corrupt output rejected');
  const pidFile=path.join(root,'child.pid');
  const pending=engine.operation(op=>engine.run('node',['-e',`const {spawn}=require('node:child_process');const fs=require('node:fs');const c=spawn(process.execPath,['-e','setTimeout(()=>{},60000)']);fs.writeFileSync(process.argv[1],String(c.pid));setTimeout(()=>{},60000);`,pidFile],op));
  const cancelled=assert.rejects(pending,{code:'CANCELLED'});
  for(let i=0;i<200;i++){try{await fs.access(pidFile);break;}catch{}await new Promise(r=>setTimeout(r,25));}
  await fs.access(pidFile);await assert.rejects(engine.inspect('https://youtu.be/abcdefghijk'),{code:'BUSY'});
  await engine.cancel();await cancelled;assert.equal(engine.active,null);
  const childPID=Number(await fs.readFile(pidFile,'utf8'));let alive=true;
  for(let i=0;i<80;i++){try{process.kill(childPID,0);}catch{alive=false;break;}await new Promise(r=>setTimeout(r,25));}
  assert.equal(alive,false,'cancel stops the child process tree');report.checks.push('serialization, cancel and child process cleanup');
  assert.deepEqual(await fs.readdir(jobs),[]);report.status='passed';
 }finally{if(server)await new Promise(resolve=>server.close(resolve));await fs.rm(root,{recursive:true,force:true,maxRetries:5,retryDelay:300});}
 await fs.writeFile(reportArg,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
})().catch(e=>{console.error(e);process.exitCode=1;});
