import { T } from "@lib/i18n/client"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading level="h2" className="flex flex-row text-3xl-regular my-6">
        <T>Delivery</T>
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            <T>Shipping Address</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{order.shipping_address?.first_name}</T>
            <T> </T>
            <T>{order.shipping_address?.last_name}</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{order.shipping_address?.address_1}</T>
            <T> </T>
            <T>{order.shipping_address?.address_2}</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{order.shipping_address?.postal_code}</T>,<T> </T>
            <T>{order.shipping_address?.city}</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{order.shipping_address?.country_code?.toUpperCase()}</T>
          </Text>
        </div>

        <div
          className="flex flex-col w-1/3 "
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            <T>Contact</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{order.shipping_address?.phone}</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{order.email}</T>
          </Text>
        </div>

        <div
          className="flex flex-col w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus text-ui-fg-base mb-1">
            <T>Method</T>
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            <T>{(order as any).shipping_methods[0]?.name}</T> (
            <T>
              {convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code,
              })
                .replace(/,/g, "")
                .replace(/\./g, ",")}
            </T>
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
