const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
const catalog=require('../data/kafkasgarden-catalog.json');
// Execute the pure input builder with the same JSON used by the Medusa script.
const file=path.resolve(__dirname,'../src/lib/garden-catalog.ts');const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod={exports:{}};new Function('require','exports',compiled)(()=>catalog,mod.exports);const {gardenProductInput,optionCombinations}=mod.exports;
test('snapshot includes every category and 135 unique, traceable, priced products',()=>{
 assert.equal(catalog.products.length,135);assert.equal(catalog.categories.length,10);
 assert.equal(new Set(catalog.products.map(p=>p.handle)).size,135);const cats=new Set(catalog.categories.map(c=>c.handle));
 for(const p of catalog.products){assert.ok(p.price>0&&Number.isFinite(p.price));assert.equal(p.currency_code,'try');assert.ok(p.source_url.startsWith('https://www.kafkasgarden.com/urun/'));assert.ok(p.captured_at);assert.ok(p.categories.length);for(const c of p.categories)assert.ok(cats.has(c));for(const image of p.images)assert.ok(fs.existsSync(path.resolve(__dirname,'../../storefront/public'+image)));assert.ok(p.images.length);assert.equal(p.stock_quantity,null);}
});
test('draft inputs preserve exact TRY selling prices without inventing available stock',()=>{
 for(const p of catalog.products){const input=gardenProductInput(p,['pcat_test'],'sc_test','sp_test','https://pipgarden.com');assert.equal(input.status,'draft');assert.equal(input.metadata.source_sku,p.sku);assert.deepEqual(input.metadata.specifications,p.specifications);assert.equal(input.metadata.variant_combinations_verified,false);assert.ok(input.variants.length);assert.equal(new Set(input.variants.map(v=>v.sku)).size,input.variants.length);
 for(const v of input.variants){assert.equal(v.prices[0].amount,p.price);assert.equal(v.prices[0].currency_code,'try');assert.equal(v.manage_inventory,true);assert.equal(v.allow_backorder,false);assert.equal(v.inventory_quantity,undefined);assert.equal(v.metadata.combination_verified,false);for(const o of input.options)assert.ok(o.values.includes(v.options[o.title]));}}
});
test('two independent color options retain both values in each draft combination',()=>{assert.deepEqual(optionCombinations([{title:'Gövde',values:['Antrasit','Krem']},{title:'Minder',values:['Gri','Yeşil']}]),[{'Gövde':'Antrasit',Minder:'Gri'},{'Gövde':'Antrasit',Minder:'Yeşil'},{'Gövde':'Krem',Minder:'Gri'},{'Gövde':'Krem',Minder:'Yeşil'}]);});
