const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.resolve(__dirname,'../src/lib/util/category-seo.ts'),'utf8');
const code = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const mod = {exports:{}}; new Function('exports',code)(mod.exports);
const {getCategorySeo} = mod.exports;
const catalogue = require('../../backend/data/kafkasgarden-catalog.json');
test('all garden category titles retain their source names without automotive intent',()=>{
 for(const category of catalogue.categories){const seo=getCategorySeo([{name:category.name,handle:category.handle}]);assert.equal(seo.title,category.name);assert.doesNotMatch(JSON.stringify(seo),/fren|brakeshop|araç|OEM/i);assert.match(seo.description,/Pip Garden/);}
});
test('nested garden category headings use the selected leaf rather than inventing a vehicle title',()=>{assert.equal(getCategorySeo([{name:'Oturma Grubu'},{name:'İroko'}]).title,'İroko');});
