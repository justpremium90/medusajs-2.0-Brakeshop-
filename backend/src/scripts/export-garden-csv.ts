import { writeFileSync, readFileSync } from "node:fs";
import { gardenCatalog, gardenProductInput } from "../lib/garden-catalog";
import { CSVNormalizer } from "@medusajs/framework/utils";

// Optional mapping supplies existing Admin category IDs and sales/shipping IDs.
const mapping: {
  categories?: Record<string, string>;
  salesChannelId?: string;
  shippingProfileId?: string;
} = process.env.GARDEN_IMPORT_MAPPING
  ? JSON.parse(readFileSync(process.env.GARDEN_IMPORT_MAPPING, "utf8"))
  : {};
const rows: Record<string, string>[] = [];
for (const source of gardenCatalog.products) {
  const input = gardenProductInput(
    source,
    [],
    mapping.salesChannelId || "",
    mapping.shippingProfileId || "",
    process.env.GARDEN_ASSET_ORIGIN || "https://pipgarden.com"
  );
  for (const [index, variant] of input.variants.entries()) {
    const row: Record<string, string> = {
      "Product Handle": input.handle,
      "Product Title": input.title,
      "Product Status": "draft",
      "Product Description": input.description || "",
      "Product Thumbnail": input.thumbnail,
      "Product Metadata": JSON.stringify({
        ...input.metadata,
        source_category_handles: source.categories,
      }),
      "Variant Title": variant.title,
      "Variant SKU": variant.sku,
      "Variant Manage Inventory": "true",
      "Variant Allow Backorder": "false",
      "Variant Price TRY": String(source.price),
      "Variant Variant Rank": String(index),
      "Variant Metadata": JSON.stringify(variant.metadata),
    };
    if (mapping.salesChannelId)
      row["Product Sales Channel 1"] = mapping.salesChannelId;
    if (mapping.shippingProfileId)
      row["Shipping Profile Id"] = mapping.shippingProfileId;
    source.categories.forEach((handle, i) => {
      if (mapping.categories?.[handle])
        row[`Product Category ${i + 1}`] = mapping.categories[handle];
    });
    input.images.forEach((image, i) => {
      row[`Product Image ${i + 1}`] = image.url;
    });
    Object.entries(variant.options).forEach(([title, value], i) => {
      row[`Variant Option ${i + 1} Name`] = title;
      row[`Variant Option ${i + 1} Value`] = value;
    });
    // Product fields are shared by all variants; avoid repeating large metadata
    // and gallery URLs in every row of the upload.
    if (index > 0) {
      for (const key of Object.keys(row)) {
        if (key !== "Product Handle" && !key.startsWith("Variant "))
          delete row[key];
      }
    }
    rows.push(row);
  }
}
// Validate against the installed Medusa 2.19 CSV importer before writing.
const normalized = new CSVNormalizer(
  rows.map((row, index) => CSVNormalizer.preProcess(row, index + 1))
).proccess();
if (Object.keys(normalized.toCreate).length !== gardenCatalog.products.length)
  throw new Error("CSV product count mismatch");
const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
const output = process.argv[2] || "/private/tmp/pipgarden-drafts.csv";
writeFileSync(
  output,
  "\uFEFF" +
    [headers, ...rows.map((row) => headers.map((header) => row[header] || ""))]
      .map((row) => row.map(quote).join(","))
      .join("\r\n") +
    "\r\n"
);
console.log(
  `Validated ${gardenCatalog.products.length} draft products, ${rows.length} variant rows. CSV: ${output}`
);
