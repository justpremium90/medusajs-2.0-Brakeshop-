import { T } from "@lib/i18n/client"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div>
      <h2 className="text-base-semi">
        <T>Order Summary</T>
      </h2>
      <div className="text-small-regular text-ui-fg-base my-2">
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>
            <T>Subtotal</T>
          </span>
          <span>
            <T>{getAmount(order.subtotal)}</T>
          </span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>
                <T>Discount</T>
              </span>
              <span>
                - <T>{getAmount(order.discount_total)}</T>
              </span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>
                <T>Discount</T>
              </span>
              <span>
                - <T>{getAmount(order.gift_card_total)}</T>
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>
              <T>Shipping</T>
            </span>
            <span>
              <T>{getAmount(order.shipping_total)}</T>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>
              <T>Taxes</T>
            </span>
            <span>
              <T>{getAmount(order.tax_total)}</T>
            </span>
          </div>
        </div>
        <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
        <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
          <span>
            <T>Total</T>
          </span>
          <span>
            <T>{getAmount(order.total)}</T>
          </span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
