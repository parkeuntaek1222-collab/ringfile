from pathlib import Path
import hashlib,sys
root=Path(sys.argv[1]);digests={}
for line in (root/'SHA256SUMS.txt').read_text().splitlines():
    digest,name=line.split('  ',1);digests[name]=digest
for item in root.iterdir():
    if item.name=='SHA256SUMS.txt':continue
    assert item.name in digests and hashlib.sha256(item.read_bytes()).hexdigest()==digests[item.name],item.name
print('Downloaded package SHA256 values match.')
