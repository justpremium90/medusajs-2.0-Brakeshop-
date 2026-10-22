import { T } from "@lib/i18n/client"
import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" &&
        price.original_price_number > price.calculated_price_number && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          <T>{price.original_price}</T>
        </Text>
      )}
      <Text
        className={clx("brand-price-text", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        <T>{price.calculated_price}</T>
      </Text>
    </>
  )
}
