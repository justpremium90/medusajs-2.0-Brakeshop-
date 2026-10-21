import { T } from "@lib/i18n/client"
import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
  showFromLabel = true,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  showFromLabel?: boolean
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block h-8 w-32 animate-pulse bg-gray-100" />
  }

  return (
    <div className="brand-price-text flex flex-col gap-y-1">
      <span
        className={clx("text-[28px] font-normal leading-8", {
          "text-ui-fg-interactive": selectedPrice.price_type === "sale",
        })}
      >
        <T>{!variant && showFromLabel && "Başlangıç "}</T>
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          <T>{selectedPrice.calculated_price}</T>
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p className="text-[15px] leading-5 text-[#9a7470]">
            <span>
              <T>Orijinal: </T>
            </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              <T>{selectedPrice.original_price}</T>
            </span>
          </p>
          <span className="text-[15px] leading-5 text-ui-fg-interactive">
            -<T>{selectedPrice.percentage_diff}</T>%
          </span>
        </>
      )}
    </div>
  )
}
