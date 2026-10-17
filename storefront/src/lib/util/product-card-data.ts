import type { HttpTypes } from "@medusajs/types"

// Listing reads already contain regional prices and stock. Reuse that response
// instead of issuing one additional Medusa request for every visible card.
export function hasProductCardData(product: HttpTypes.StoreProduct) {
  return (
    Array.isArray(product.variants) &&
    product.variants.length > 0 &&
    product.variants.every(
      (variant) =>
        Object.prototype.hasOwnProperty.call(variant, "calculated_price") &&
        (!variant.manage_inventory ||
          variant.allow_backorder ||
          Object.prototype.hasOwnProperty.call(variant, "inventory_quantity"))
    )
  )
}
