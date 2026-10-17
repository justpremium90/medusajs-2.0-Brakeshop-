import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { gardenCatalog, gardenProductInput } from "../lib/garden-catalog";

/** Run with `medusa exec ./src/scripts/import-garden-catalog.ts`.
 * Default is a read-only plan. GARDEN_IMPORT_APPLY=true creates missing drafts.
 * Re-running skips existing handles and never changes existing products/orders. */
export default async function importGardenCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve(Modules.PRODUCT);
  const storeService = container.resolve(Modules.STORE);
  const fulfillment = container.resolve(Modules.FULFILLMENT);
  const regionService = container.resolve(Modules.REGION);
  const [store] = await storeService.listStores();
  const regions = await regionService.listRegions(
    {},
    { relations: ["countries"] }
  );
  const turkey = regions.find(
    (region) =>
      region.currency_code === "try" &&
      region.countries?.some((country) => country.iso_2 === "tr")
  );
  if (!turkey)
    logger.warn(
      "A TRY region containing TR is required before publishing. Region, payment and shipping configuration is unchanged."
    );
  const existing = await productService.listProducts(
    { handle: gardenCatalog.products.map((product) => product.handle) },
    { take: 1000 }
  );
  const handles = new Set(existing.map((product) => product.handle));
  const pending = gardenCatalog.products.filter(
    (product) => !handles.has(product.handle)
  );
  logger.info(
    `Garden catalogue: ${gardenCatalog.products.length} products, ${gardenCatalog.categories.length} categories; ${pending.length} missing, ${existing.length} skipped.`
  );
  if (process.env.GARDEN_IMPORT_APPLY !== "true") {
    logger.info(
      "Plan only. Set GARDEN_IMPORT_APPLY=true to create missing drafts; inventory remains unallocated."
    );
    return;
  }
  const origin = process.env.GARDEN_ASSET_ORIGIN;
  if (!origin || !/^https?:\/\//.test(origin))
    throw new Error(
      "Set GARDEN_ASSET_ORIGIN to the deployed storefront URL serving /images/garden/."
    );
  const salesChannelId =
    store?.default_sales_channel_id || process.env.GARDEN_SALES_CHANNEL_ID;
  if (!salesChannelId)
    throw new Error(
      "Store has no default sales channel. No products imported."
    );
  const [profile] = await fulfillment.listShippingProfiles({ type: "default" });
  if (!profile)
    throw new Error("No default shipping profile. No products imported.");
  const categoryMap = new Map<string, string>();
  for (const category of gardenCatalog.categories) {
    const [existingCategory] = await productService.listProductCategories({
      handle: category.handle,
    });
    if (existingCategory) {
      categoryMap.set(category.handle, existingCategory.id);
      continue;
    }
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: category.name,
            handle: category.handle,
            is_active: true,
            is_internal: false,
            metadata: {
              source: "kafkasgarden",
              source_url: category.source_url,
            },
          },
        ],
      },
    });
    categoryMap.set(category.handle, result[0].id);
  }
  for (const product of pending) {
    const input = gardenProductInput(
      product,
      product.categories.map((handle) => categoryMap.get(handle)!),
      salesChannelId,
      profile.id,
      origin
    );
    await createProductsWorkflow(container).run({
      input: { products: [input] },
    });
    logger.info(`Created garden draft: ${product.handle}`);
  }
  logger.info(
    "Garden drafts created. Confirm variant prices/combinations, inventory, TRY region, tax/shipping/payment and company details before publishing in Admin."
  );
}
