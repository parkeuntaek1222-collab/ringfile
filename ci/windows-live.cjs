'use strict';
// Run on Windows against the installed release's own engine and bundled tools.
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os');
const {createHash}=require('node:crypto'),{execFile}=require('node:child_process'),{promisify}=require('node:util');
const exec=promisify(execFile);
async function main(){
 if(process.platform!=='win32')throw Error('A real Windows runner is required');
 const [appdir,reportFile]=process.argv.slice(2);
 if(!appdir||!reportFile)throw Error('Expected installed app directory and report filename');
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ringfile-live-'));
 const bin=path.join(appdir,'resources','bin');
 const {Engine}=require(path.join(appdir,'resources','app','engine.cjs'));
 const report={status:'running',testedAt:new Date().toISOString(),platform:process.platform,arch:process.arch,os:os.release(),runner:process.env.QA_LABEL,source:'https://www.youtube.com/watch?v=jNQXAC9IVRw',scope:'Installed release engine and bundled tools; real direct YouTube MP3/MP4 download and full decode. This is not a physical-PC or browser security-dialog test.',files:[]};
 const engine=new Engine({bin,jobs:path.join(root,'jobs')});
 const run=async(name,args)=>{const r=await exec(path.join(bin,name+'.exe'),args,{windowsHide:true,timeout:120000,maxBuffer:1048576});return r.stdout;};
 try{
  report.tools=(await engine.preflight()).tools;
  const destination=path.join(root,'saved');await fs.mkdir(destination);
  for(const format of ['mp3','mp4']){
   const inspection=await engine.inspect(report.source);
   const choices=inspection.options[format];
   const choice=format==='mp3'?choices.find(c=>c.id==='320'):choices.filter(c=>Number(c.id)<=720).sort((a,b)=>Number(b.id)-Number(a.id))[0];
   if(!choice)throw Object.assign(Error('Required output format unavailable'),{code:'FORMAT_UNAVAILABLE'});
   const file=await engine.download({inspectionID:inspection.inspectionID,format,quality:choice.id,destination});
   const probe=JSON.parse(await run('ffprobe',['-v','error','-show_format','-show_streams','-of','json',file.path]));
   const audio=probe.streams.find(s=>s.codec_type==='audio');
   if(!audio)throw Error('Audio stream missing');
   const duration=Number(probe.format.duration);
   if(Math.abs(duration-inspection.duration)>Math.max(2,inspection.duration*.02))throw Error('Incomplete download');
   if(format==='mp3'&&(audio.codec_name!=='mp3'||Number(audio.bit_rate)!==320000))throw Error('MP3 320kbps verification failed');
   if(format==='mp4'&&!probe.streams.some(s=>s.codec_type==='video'&&s.codec_name==='h264'))throw Error('H264 video missing');
   if(!probe.format.tags?.title)throw Error('Title metadata missing');
   await run('ffmpeg',['-v','error','-i',file.path,'-map',format==='mp3'?'0:a:0':'0','-f','null','-']);
   report.files.push({name:file.name,format,quality:choice.id,bytes:file.bytes,duration,sha256:createHash('sha256').update(await fs.readFile(file.path)).digest('hex'),audioCodec:audio.codec_name,audioBitrate:Number(audio.bit_rate),coverEmbedded:file.coverEmbedded,metadataEmbedded:file.metadataEmbedded,fullDecode:'passed'});
  }
  report.status='passed';
 }catch(error){
  report.status=error.code==='ACCESS_RESTRICTED'?'blocked':'failed';
  report.error={code:error.code||'TEST_FAILED',message:error.code?String(error.message).slice(0,400):'A media validation assertion failed'};
  process.exitCode=1;
 }finally{
  await engine.cancel();
  await fs.writeFile(reportFile,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report));
  await fs.rm(root,{recursive:true,force:true});
 }
}
main().catch(error=>{console.error('Windows live test could not start:',error.code||error.name);process.exitCode=1;});
