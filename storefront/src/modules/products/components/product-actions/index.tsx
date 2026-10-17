"use client"

import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
import Divider from "@modules/common/components/divider"
import WhatsAppContactButton from "@modules/common/components/whatsapp-contact-button"
import OptionSelect from "@modules/products/components/product-actions/option-select"

import MobileActions from "./mobile-actions"
import ProductPrice from "../product-price"
import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { toPublicPath } from "@lib/util/public-path"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  showMobileProductActions?: boolean
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce(
    (acc: Record<string, string | undefined>, varopt: any) => {
      if (
        varopt.option &&
        varopt.value !== null &&
        varopt.value !== undefined
      ) {
        acc[varopt.option.title] = varopt.value
      }
      return acc
    },
    {}
  )
}

export default function ProductActions({
  product,
  region,
  disabled,
  showMobileProductActions = false,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string
  const router = useRouter()
  const subtitle =
    product.type?.value || product.collection?.title || "Fren sistemi parçası"
  const sourceInStock =
    (product.metadata as Record<string, unknown> | null)?.source !==
      "online-yedek-parca" ||
    (product.metadata as Record<string, unknown> | null)?.source_in_stock !==
      false

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (title: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [title]: value,
    }))
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    if (!sourceInStock) {
      return false
    }

    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant, sourceInStock])

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  const buttonLabel = !selectedVariant
    ? "Varyant seçin"
    : !inStock
      ? "Stokta yok"
      : "Sepete ekle"

  const whatsappMessage = `Merhaba, ${product.title} ürünü hakkında bilgi almak istiyorum.${
    product.handle ? ` Ürün: https://brakeshop.com.tr${toPublicPath(`/products/${product.handle}`)}` : ""
  }`

  return (
    <>
      <div className="flex flex-col gap-y-4 small:gap-y-5" ref={actionsRef}>
        <div className="order-2 border-y border-[#ead8d2] py-3 small:order-none small:border-0 small:py-0">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        {(product.variants?.length ?? 0) > 1 && (
          <div className="order-1 flex flex-col gap-y-4 small:order-none">
            {(product.options || []).map((option) => {
              return (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.title ?? ""]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              )
            })}
            <Divider className="mt-0" />
          </div>
        )}

        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          variant="primary"
          className="brand-add-to-cart order-3 h-12 w-full rounded-none text-[13px] font-semibold uppercase tracking-[0.08em] small:hidden"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {buttonLabel}
        </Button>

        <WhatsAppContactButton
          message={whatsappMessage}
          className="product-whatsapp-button order-4 min-h-12 w-full rounded-[8px] border border-[#159947] bg-[#25D366] px-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#159947] focus-visible:ring-offset-2 small:order-none"
        />

        {showMobileProductActions ? (
          <MobileActions
            product={product}
            variant={selectedVariant}
            options={options}
            updateOptions={setOptionValue}
            inStock={inStock}
            handleAddToCart={handleAddToCart}
            isAdding={isAdding}
            show={!inView}
            optionsDisabled={!!disabled || isAdding}
          />
        ) : null}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[70] hidden items-end gap-x-4 px-2 pb-0 small:flex">
        <div className="flex h-[52px] w-[300px] items-center justify-between bg-[#fff5f3] px-4 text-[#3a080a] shadow-[0_-5px_18px_rgba(58,8,10,0.07)]">
          <div className="flex items-center gap-x-3">
            <svg
              aria-hidden="true"
              className="h-5 w-5 stroke-[1.5]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="m4 14 6-10 2.5 4.5L15 4l5 10-8 6-8-6Zm5.5 0h5" />
            </svg>
            <span className="text-[12px] font-semibold uppercase leading-4 tracking-[0.02em]">
              Doğru fren parçası, güvenli sürüş
            </span>
          </div>
          <span className="text-[18px] leading-none">^</span>
        </div>

        <div className="flex h-[52px] flex-1 items-center justify-between gap-x-5 bg-white px-4 shadow-[0_-5px_18px_rgba(58,8,10,0.1)]">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold uppercase leading-4 tracking-[0.02em] text-[#3a080a]">
              {product.title}
            </p>
            <p className="text-[12px] uppercase leading-4 text-[#9a7470]">
              {subtitle}
            </p>
          </div>
          <div className="shrink-0 text-right [&_p]:!text-[11px] [&_p]:!leading-4 [&_span]:!text-[16px] [&_span]:!leading-5">
            <ProductPrice product={product} variant={selectedVariant} />
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || !selectedVariant || !!disabled || isAdding}
            variant="primary"
            className="brand-add-to-cart h-10 w-[280px] shrink-0 rounded-none text-[13px] font-semibold uppercase tracking-[0.06em]"
            isLoading={isAdding}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </>
  )
}
