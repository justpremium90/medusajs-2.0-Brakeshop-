import json,hashlib,urllib.request,concurrent.futures,pathlib,subprocess
root=pathlib.Path(__file__).resolve().parents[2]
c=json.loads((root/'backend/data/kafkasgarden-catalog.json').read_text())
out=root/'storefront/public/images/garden/collection';out.mkdir(exist_ok=True)
urls=list(dict.fromkeys(u for p in c['products'] for u in p['source_images'][:2]))
def fetch(u):
 name=hashlib.sha256(u.encode()).hexdigest()[:16]+pathlib.Path(u.split('?')[0]).suffix.lower()
 f=out/name
 try:
  if not f.exists():
   with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=30) as response: data=response.read()
   f.write_bytes(data)
  text=subprocess.check_output(['sips','-g','pixelWidth','-g','pixelHeight',str(f)],text=True)
  w=int(text.split('pixelWidth: ')[1].split()[0]);h=int(text.split('pixelHeight: ')[1].split()[0])
  return u,dict(src='/images/garden/collection/'+name,width=w,height=h,bytes=f.stat().st_size)
 except Exception as e:return u,dict(error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: rows=dict(pool.map(fetch,urls))
manifest={}
for p in c['products']:
 candidates=[rows[u] for u in p['source_images'][:2] if 'error' not in rows[u]]
 # Prefer the requested second photograph when it is genuinely high resolution.
 candidates=sorted(enumerate(candidates),key=lambda x:(x[1]['width']>=1400,x[0]==1,x[1]['width']*x[1]['height']),reverse=True)
 manifest[p['handle']]=[v for _,v in candidates]
(root/'storefront/src/lib/data/garden-product-media.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
if any(not photos for photos in manifest.values()):
 raise RuntimeError('A product has no usable original photograph; inspect the download errors.')
print(json.dumps(dict(products=len(manifest),files=len(rows),errors=[v for v in rows.values() if 'error' in v],low=[k for k,v in manifest.items() if not v or min(v[0]['width'],v[0]['height'])<900],bytes=sum(v.get('bytes',0) for v in rows.values())),indent=2))
