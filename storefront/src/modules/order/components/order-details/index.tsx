import { T } from "@lib/i18n/client"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        <T>We have sent the order confirmation details to</T>
        <T> </T>
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          <T>{order.email}</T>
        </span>
        .
      </Text>
      <Text className="mt-2">
        <T>Order date:</T>
        <T> </T>
        <span data-testid="order-date">
          <T>{new Date(order.created_at).toDateString()}</T>
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        <T>Order number: </T>
        <span data-testid="order-id">
          <T>{order.display_id}</T>
        </span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              <T>Order status:</T>
              <T> </T>
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {/* TODO: Check where the statuses should come from */}
                {/* {formatStatus(order.fulfillment_status)} */}
              </span>
            </Text>
            <Text>
              <T>Payment status:</T>
              <T> </T>
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {/* {formatStatus(order.payment_status)} */}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
