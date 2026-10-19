from pathlib import Path
import json,os,plistlib,shutil,subprocess,tempfile,time
root=Path.cwd();image=next((root/'payload').glob('*.dmg'))
def run(args,**kwargs):return subprocess.run([str(a) for a in args],check=True,**kwargs)
with tempfile.TemporaryDirectory(prefix='ringfile-install-') as temporary:
    work=Path(temporary);mount=work/'mounted';mount.mkdir()
    run(['hdiutil','attach','-readonly','-nobrowse','-mountpoint',mount,image])
    try:
        source=next(mount.glob('*.app'));app=work/'한글 폴더'/'링파일.app';app.parent.mkdir()
        run(['ditto',source,app]);run(['codesign','--verify','--deep','--strict',app])
    finally:run(['hdiutil','detach',mount])
    info=plistlib.loads((app/'Contents/Info.plist').read_bytes());assert info['CFBundleDisplayName']=='링파일'
    exe=app/'Contents/MacOS'/info['CFBundleExecutable'];p=subprocess.Popen([str(exe)],stdout=subprocess.PIPE,stderr=subprocess.PIPE)
    try:
        time.sleep(8);assert p.poll() is None,'App exited before startup completed'
    finally:p.terminate();p.communicate(timeout=15)
    binary=app/'Contents/Resources/bin'
    run([binary/'node',root/'ci/media-verify.cjs',binary,root/'source/Windows/engine.cjs',root/'source/Tests/fixtures/video-h264.mp4',root/'Mac-media.json'])
    shutil.rmtree(app);assert not app.exists()
    (root/'Mac-install.json').write_text(json.dumps({'status':'passed','host':'fresh macOS15 Apple Silicon hosted VM','checks':['DMG read-only mount','Korean/space path copy','ad-hoc signature verification','native app launch','packaged media pipeline and cancellation','app removal'],'limits':'Browser quarantine, Gatekeeper approval and physical-device security prompts were not exercised; no security settings changed.'},indent=2))
