const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(relative, mocks={}) {
 const filename=path.resolve(__dirname,'../src',relative);
 const source=fs.readFileSync(filename,'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText;
 const mod={exports:{}};
 new Function('require','module','exports',code)((id)=>mocks[id]||require(path.resolve(path.dirname(filename),id)),mod,mod.exports);
 return mod.exports;
}
const {translate}=load('lib/i18n/translate.ts');
const {translatedSearchHandles}=load('lib/i18n/search.ts');
const config=load('lib/i18n/config.ts');
const catalog=require('../../backend/data/kafkasgarden-catalog.json');
test('every catalogue title, option and description has an English and Arabic translation without modifying selection values',()=>{
 const messages=require('../src/lib/i18n/messages.json');
 for(const product of catalog.products){
  for(const source of [product.title,product.description,...product.options.flatMap(o=>[o.title,...o.values])]){
   if(!source?.trim())continue;
   const entry=messages[source.replace(/\s+/g,' ').trim()];
   assert.ok(entry,source); assert.ok(entry[1]);assert.ok(entry[2]);assert.equal(translate(source,'tr').trim(),source.trim());
  }
 }
});
test('dynamic labels and mixed-case technical names translate',()=>{
 assert.equal(translate('Sepet (3)','en'),'Cart (3)');
 assert.equal(translate('Sepet (3)','ar'),'السلة (3)');
 assert.match(translate('Comfort Salıncak Takımı','en'),/Swing Set/);
 assert.doesNotMatch(translate('IROKO AMİRAL SALINCAK TAKIMI','en'),/SALINCAK/);
 assert.equal(translate('  Ödemeye geç  ','en'),'  Checkout  ');
});
test('English and Arabic searches find the same original product identities',()=>{
 const handle='roma-vip-ipli-salincak-takimi-aluminyum';
 assert.ok(translatedSearchHandles('swing').includes(handle));
 assert.ok(translatedSearchHandles('أرجوحة').includes(handle));
 assert.ok(translatedSearchHandles('أُرْجُوحَة').includes(handle));
 assert.ok(translatedSearchHandles(encodeURIComponent('أرجوحة')).includes(handle));
 assert.equal(new Set(translatedSearchHandles('swing')).size,translatedSearchHandles('swing').length);
 assert.deepEqual(translatedSearchHandles('zzzznotaproduct'),[]);
});
class Response {
 constructor(body,init={}){this.body=body;Object.assign(this,init)}
 static next(options){return {kind:'next',...options}}
 static redirect(url,status){const saved={};return {kind:'redirect',url:String(url),status,saved,cookies:{set(key,value){saved[key]=value}}}}
 static rewrite(url,options){return {kind:'rewrite',url:String(url),...options,cookies:{set(){}}}}
}
const originalFetch=global.fetch;
global.fetch=async()=>({json:async()=>({regions:[{id:'tr',countries:[{iso_2:'tr'}]},{id:'europe',countries:[{iso_2:'gb'}]}]})});
const {middleware}=load('middleware.ts',{'@lib/i18n/config':config,'next/server':{NextResponse:Response},'next/navigation':{notFound(){throw Error('not found')}}});
function request(url,headers={}){
 const u=new URL(url);u.clone=()=>new URL(u);
 const values=new Map([['_medusa_cart_id','existing-cart']]);
 return {url,nextUrl:u,headers:new Headers(headers),cookies:{get:key=>values.has(key)?{value:values.get(key)}:undefined,set:(key,value)=>values.set(key,value),delete:key=>values.delete(key)}};
}
test('language routes keep the TR country and query without replacing the cart',async()=>{
 const old=process.env.STOREFRONT_PASSWORD;delete process.env.STOREFRONT_PASSWORD;
 try{for(const language of ['tr','en','ar']){
  const req=request(`https://pipgarden.com/${language}/products/test?step=address`);
  const response=await middleware(req);
  assert.equal(response.kind,'rewrite');
  assert.equal(response.url,`https://pipgarden.com/${language}/tr/products/test?step=address`);
  assert.equal(response.request.headers.get('x-pipgarden-locale'),language);
  assert.equal(req.cookies.get('_medusa_cart_id').value,'existing-cart');
 }}finally{if(old!==undefined)process.env.STOREFRONT_PASSWORD=old;}
});
test('the existing password protection still covers language routes',async()=>{
 const old=process.env.STOREFRONT_PASSWORD;process.env.STOREFRONT_PASSWORD='unit-test-only';
 try{const response=await middleware(request('https://pipgarden.com/ar/cart'));assert.equal(response.status,401);}
 finally{if(old===undefined)delete process.env.STOREFRONT_PASSWORD;else process.env.STOREFRONT_PASSWORD=old;}
});

test('cart recovery keeps the language and completes a cookie round trip',async()=>{
 const req=request('https://pipgarden.com/ar/checkout?cart_id=resume-cart&source=email');
 req.cookies.delete('_medusa_cart_id');
 const response=await middleware(req);
 assert.equal(response.kind,'redirect');
 assert.equal(response.url,'https://pipgarden.com/ar/checkout?source=email&step=address');
 assert.equal(response.saved._medusa_cart_id,'resume-cart');
});
