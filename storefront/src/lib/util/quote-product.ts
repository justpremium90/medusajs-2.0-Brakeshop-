import type { HttpTypes } from "@medusajs/types"

export const isQuoteProduct = (product: Pick<HttpTypes.StoreProduct, "metadata">) =>
  product.metadata?.catalog_mode === "vehicle_enquiry"

export const quoteProductMessage = (
  product: Pick<HttpTypes.StoreProduct, "title" | "handle">
) =>
  `Merhaba, ${product.title} için fiyat, tedarik ve aracıma uygunluk bilgisi almak istiyorum. Ürün: https://brakeshop.com.tr/${product.handle}`
