"use client"

import { T } from "@lib/i18n/client"
import { Button } from "@medusajs/ui"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div className="bg-white flex flex-col" data-testid="order-card">
      <div className="uppercase text-large-semi mb-1">
        #
        <span data-testid="order-display-id">
          <T>{order.display_id}</T>
        </span>
      </div>
      <div className="flex items-center divide-x divide-gray-200 text-small-regular text-ui-fg-base">
        <span className="pr-2" data-testid="order-created-at">
          <T>{new Date(order.created_at).toDateString()}</T>
        </span>
        <span className="px-2" data-testid="order-amount">
          <T>
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </T>
        </span>
        <span className="pl-2">
          <T>{`${numberOfLines} ${numberOfLines > 1 ? "items" : "item"}`}</T>
        </span>
      </div>
      <div className="grid grid-cols-2 small:grid-cols-4 gap-4 my-4">
        {order.items?.slice(0, 3).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-2"
              data-testid="order-item"
            >
              <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              <div className="flex items-center text-small-regular text-ui-fg-base">
                <span
                  className="text-ui-fg-base font-semibold"
                  data-testid="item-title"
                >
                  <T>{i.title}</T>
                </span>
                <span className="ml-2">
                  <T>x</T>
                </span>
                <span data-testid="item-quantity">
                  <T>{i.quantity}</T>
                </span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-small-regular text-ui-fg-base">
              + <T>{numberOfLines - 4}</T>
            </span>
            <span className="text-small-regular text-ui-fg-base">
              <T>more</T>
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
          <Button data-testid="order-details-link" variant="secondary">
            <T>See details</T>
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderCard
