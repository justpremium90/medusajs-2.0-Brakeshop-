"use client"

import { T } from "@lib/i18n/client"
import { Table, Text, clx } from "@medusajs/ui"

import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview" | "mobile"
}

const Item = ({ item, type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [removed, setRemoved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { handle } = item.variant?.product ?? {}

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .then(() => {
        router.refresh()
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  if (removed) {
    return null
  }

  if (type === "mobile") {
    return (
      <article
        className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 border-b border-[#eadfdb] py-5 last:border-b-0"
        data-testid="mobile-product-row"
      >
        <LocalizedClientLink href={`/products/${handle}`} className="w-[88px]">
          <Thumbnail
            thumbnail={item.variant?.product?.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>

        <div className="min-w-0">
          <LocalizedClientLink
            href={`/products/${handle}`}
            className="block text-[14px] font-medium leading-5 text-[#252221]"
          >
            <T>{item.product_title}</T>
          </LocalizedClientLink>
          <div className="mt-1 text-[12px] leading-5 text-[#756b68]">
            <LineItemOptions
              variant={item.variant}
              data-testid="mobile-product-variant"
            />
          </div>
          <div className="mt-2 text-[15px] font-semibold leading-6 text-[#252221]">
            <LineItemPrice item={item} style="tight" />
          </div>

          <div className="mt-3 flex flex-wrap items-start gap-2">
            <label className="flex h-11 items-center gap-2 border border-[#d9cfcb] bg-white px-3 text-[12px] leading-5 text-[#514946]">
              <span>
                <T>Adet</T>
              </span>
              <CartItemSelect
                value={item.quantity}
                onChange={(value) =>
                  changeQuantity(parseInt(value.target.value, 10))
                }
                className="h-9 w-12 border-0 bg-transparent p-0 text-center text-[14px] leading-5"
                data-testid="mobile-product-select-button"
              >
                {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
                  <option value={i + 1} key={i + 1}>
                    <T>{i + 1}</T>
                  </option>
                ))}
              </CartItemSelect>
            </label>

            <DeleteButton
              id={item.id}
              onDeleted={() => setRemoved(true)}
              buttonClassName="h-11 border border-[#c42026] px-3 text-[12px] font-medium leading-5 text-[#a7191e] hover:bg-[#fff3f1] hover:text-[#a7191e]"
              data-testid="mobile-product-delete-button"
            >
              <T>Sepetten sil</T>
            </DeleteButton>
            {updating ? <Spinner className="mt-3" /> : null}
          </div>
          <ErrorMessage
            error={error}
            data-testid="mobile-product-error-message"
          />
        </div>
      </article>
    )
  }

  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <LocalizedClientLink
          href={`/products/${handle}`}
          className={clx("flex", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.variant?.product?.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          <T>{item.product_title}</T>
        </Text>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell>
          <div className="flex gap-2 items-center w-28">
            <DeleteButton
              id={item.id}
              onDeleted={() => setRemoved(true)}
              data-testid="product-delete-button"
            >
              <T>Sil</T>
            </DeleteButton>
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-14 h-10 p-4"
              data-testid="product-select-button"
            >
              {/* TODO: Update this with the v2 way of managing inventory */}
              {Array.from(
                {
                  length: Math.min(maxQuantity, 10),
                },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    <T>{i + 1}</T>
                  </option>
                )
              )}

              <option value={1} key={1}>
                1
              </option>
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice item={item} style="tight" />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">
                <T>{item.quantity}</T>
                <T>x </T>
              </Text>
              <LineItemUnitPrice item={item} style="tight" />
            </span>
          )}
          <LineItemPrice item={item} style="tight" />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
