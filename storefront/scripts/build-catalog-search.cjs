// Rebuild the multilingual lookup after catalogue or translation edits.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const catalog = require(path.resolve(root, "../backend/data/kafkasgarden-catalog.json"));
const messages = require(path.join(root, "src/lib/i18n/messages.json"));
const rows = catalog.products.map((product) => ({
  handle: product.handle,
  text: [product.title, product.sku, product.material,
    ...(messages[product.title] || []),
    ...product.categories.flatMap(handle => {
      const category = catalog.categories.find(c => c.handle === handle);
      return category ? [category.name, ...(messages[category.name] || [])] : [];
    }),
  ].join(" "),
}));
fs.writeFileSync(path.join(root, "src/lib/i18n/catalog-search.json"), JSON.stringify(rows, null, 2) + "\n");
console.log(`Indexed ${rows.length} products in TR, EN, AR and RU.`);
