"use client"

import { Popover, Transition } from "@headlessui/react"
import { Button } from "@medusajs/ui"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

const BagIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 stroke-[1.55] small:h-6 small:w-6"
    fill="none"
    viewBox="0 0 28 28"
    stroke="currentColor"
  >
    <path d="M7.2 9.4h13.6l1 14.5H6.2L7.2 9.4Z" />
    <path d="M10.4 12.2V8.1a3.6 3.6 0 0 1 7.2 0v4.1" />
  </svg>
)

const CartDropdown = ({
  cart: cartState,
  tone = "default",
}: {
  cart?: HttpTypes.StoreCart | null
  tone?: "default" | "inverse"
}) => {
  const [cart, setCart] = useState(cartState)
  const [activeTimer, setActiveTimer] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cart?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    setCart(cartState)
  }, [cartState])

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className={`h-full z-50 ${
        tone === "inverse" ? "w-full text-white" : "text-[#3a080a]"
      }`}
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover
        className={`relative h-full ${tone === "inverse" ? "w-full" : ""}`}
      >
        <Popover.Button
          className={`relative h-full ${tone === "inverse" ? "w-full" : ""}`}
        >
          <LocalizedClientLink
            className={`relative flex h-full items-center transition-colors ${
              tone === "inverse"
                ? "w-full justify-center hover:text-white/75"
                : "hover:text-[#7b3432]"
            }`}
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Sepet (${totalItems})`}
          >
            <BagIcon />
            <span
              className={`absolute z-10 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border px-1 text-[10px] font-bold leading-none shadow-[0_2px_7px_rgba(0,0,0,.22)] small:h-5 small:min-w-5 small:text-[11px] ${
                tone === "inverse"
                  ? "right-0 top-0.5 border-[#b71920]/20 bg-white text-[#b71920] small:right-0 small:top-1"
                  : "-right-2 -top-2 border-white bg-[#c42026] text-white"
              }`}
              aria-hidden="true"
              data-testid="nav-cart-count"
            >
              {totalItems}
            </span>
          </LocalizedClientLink>
        </Popover.Button>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center">
              <h3 className="text-large-semi">Sepetiniz</h3>
            </div>
            {cart && cart.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {[...cart.items]
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={
                            item.product_handle || item.variant?.product?.handle
                              ? `/products/${
                                  item.product_handle ||
                                  item.variant?.product?.handle
                                }`
                              : "/store"
                          }
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3
                                  className="text-base-regular overflow-hidden text-ellipsis"
                                  data-testid="product-title"
                                >
                                  <LocalizedClientLink
                                    href={
                                      item.product_handle ||
                                      item.variant?.product?.handle
                                        ? `/products/${
                                            item.product_handle ||
                                            item.variant?.product?.handle
                                          }`
                                        : "/store"
                                    }
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                />
                                <span data-testid="cart-item-quantity">
                                  Adet: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end">
                                <LineItemPrice item={item} style="tight" />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Sil
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                  <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold">
                      Ara toplam
                    </span>
                    <span
                      className="text-large-semi"
                      data-testid="cart-subtotal"
                      data-value={subtotal || 0}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cart.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button className="w-full" size="large">
                      Sepeti görüntüle
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span className="text-small-regular">0</span>
                  </div>
                  <span>Sepetiniz henüz boş.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <Button onClick={close}>Ürünleri keşfet</Button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
