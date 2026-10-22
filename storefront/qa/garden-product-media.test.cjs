const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const manifest=require('../src/lib/data/garden-product-media.json');
const catalogue=require('../../backend/data/kafkasgarden-catalog.json');
const source=fs.readFileSync(path.join(__dirname,'../src/lib/util/garden-product-media.ts'),'utf8');
const mod={exports:{}};
new Function('require','module','exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText)(()=>manifest,mod,mod.exports);
const {getGardenProductImages}=mod.exports;
test('all 135 catalogue covers exist locally and exceed the old 480px thumbnail',()=>{
 assert.equal(Object.keys(manifest).length,135);
 for(const p of catalogue.products){
  const cover=manifest[p.handle][0];
  assert.ok(cover.width>=900,p.handle);
  assert.ok(fs.existsSync(path.join(__dirname,'../public',cover.src)),cover.src);
  assert.equal(getGardenProductImages({...p,images:p.images.map(url=>({url}))})[0],cover.src);
 }
});
test('unknown products retain their gallery and deduplicate the thumbnail',()=>{
 assert.deepEqual(getGardenProductImages({handle:'new-product',images:[{url:'/large.jpg'},{url:'/large.jpg'}],thumbnail:'/small.jpg'}),['/large.jpg','/small.jpg']);
 assert.deepEqual(getGardenProductImages({}),[]);
});
