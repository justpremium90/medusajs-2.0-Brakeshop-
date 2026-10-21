import { T } from "@lib/i18n/client"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
}

const LineItemUnitPrice = ({
  item,
  style = "default",
}: LineItemUnitPriceProps) => {
  const {
    original_price,
    calculated_price,
    original_price_number,
    calculated_price_number,
    percentage_diff,
  } = getPricesForVariant(item.variant) ?? {}
  const hasReducedPrice = calculated_price_number < original_price_number

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">
                <T>Orijinal: </T>
              </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              <T>{original_price}</T>
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">
              -<T>{percentage_diff}</T>%
            </span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        <T>{calculated_price}</T>
      </span>
    </div>
  )
}

export default LineItemUnitPrice
