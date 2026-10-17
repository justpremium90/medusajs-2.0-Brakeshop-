import snapshot from "../../data/kafkasgarden-catalog.json";

export const gardenCatalog = snapshot;

export function optionCombinations(
  options: { title: string; values: string[] }[]
) {
  return options.reduce<Record<string, string>[]>(
    (rows, option) =>
      rows.flatMap((row) =>
        option.values.map((value) => ({ ...row, [option.title]: value }))
      ),
    [{}]
  );
}

/** Drafts deliberately have no invented stock. The source exposes option values,
 * not the valid inventory/price of every combination; review them before publishing. */
export function gardenProductInput(
  product: (typeof snapshot.products)[number],
  categoryIds: string[],
  salesChannelId: string,
  shippingProfileId: string,
  assetOrigin: string,
  status: "draft" | "published" = "draft"
) {
  const options = product.options.length
    ? product.options
    : [{ title: "Seçenek", values: ["Standart"] }];
  const combinations = optionCombinations(options);
  return {
    title: product.title,
    handle: product.handle,
    description: product.description || null,
    status,
    shipping_profile_id: shippingProfileId,
    category_ids: categoryIds,
    sales_channels: [{ id: salesChannelId }],
    thumbnail: new URL(product.thumbnail, assetOrigin).href,
    images: [
      ...new Set([
        ...product.images.map((path) => new URL(path, assetOrigin).href),
        ...product.source_images,
      ]),
    ].map((url) => ({ url })),
    options,
    variants: combinations.map((values, index) => ({
      title: Object.values(values).join(" / "),
      sku: `PIP-${product.handle}-${index + 1}`,
      manage_inventory: true,
      allow_backorder: false,
      options: values,
      prices: [{ currency_code: "try", amount: product.price }],
      metadata: { source_sku: product.sku, combination_verified: false },
    })),
    metadata: {
      source: "kafkasgarden",
      source_url: product.source_url,
      source_sku: product.sku,
      source_captured_at: product.captured_at,
      source_price_try: product.price,
      source_availability_text: product.availability_text,
      source_images: product.source_images,
      source_option_values: product.options,
      specifications: product.specifications,
      material: product.material,
      stock_quantity_verified: false,
      variant_combinations_verified: false,
      requires_catalog_review: true,
    },
  };
}
