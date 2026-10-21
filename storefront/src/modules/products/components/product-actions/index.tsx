"use client"

import { T } from "@lib/i18n/client"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { useIntersection } from "@lib/hooks/use-in-view"
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

const optionsAsKeymap = (
  variantOptions: any,
  productOptions: HttpTypes.StoreProductOption[] = []
) => {
  return variantOptions?.reduce(
    (acc: Record<string, string | undefined>, varopt: any) => {
      const title =
        varopt.option?.title ||
        productOptions.find((option) => option.id === varopt.option_id)?.title
      if (title && varopt.value !== null && varopt.value !== undefined) {
        acc[title] = varopt.value
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
  const [error, setError] = useState<string | null>(null)
  const countryCode = useParams().countryCode as string
  const router = useRouter()
  const sourceInStock =
    (product.metadata as Record<string, unknown> | null)?.source !==
      "online-yedek-parca" ||
    (product.metadata as Record<string, unknown> | null)?.source_in_stock !==
      false

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(
        product.variants[0].options,
        product.options ?? []
      )
      setOptions(variantOptions ?? {})
    }
  }, [product.variants, product.options])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options, product.options ?? [])
      return isEqual(variantOptions, options)
    })
  }, [product.variants, product.options, options])

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

    setError(null)
    setIsAdding(true)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity: 1,
        countryCode,
      })
      router.refresh()
    } catch (error) {
      setError("Ürün sepete eklenemedi. Lütfen tekrar deneyin.")
    } finally {
      setIsAdding(false)
    }
  }

  const pendingStock =
    (product.metadata as Record<string, unknown> | null)
      ?.stock_quantity_verified === false &&
    !product.variants?.some(
      (variant) =>
        !variant.manage_inventory ||
        variant.allow_backorder ||
        (variant.inventory_quantity || 0) > 0
    )
  const buttonLabel = !selectedVariant
    ? "Seçenekleri belirleyin"
    : !inStock
    ? pendingStock
      ? "Stok bilgisi bekleniyor"
      : "Stokta yok"
    : "Sepete ekle"

  const whatsappMessage = `Merhaba, ${
    product.title
  } ürünü hakkında bilgi almak istiyorum.${
    product.handle
      ? ` Ürün: https://pipgarden.com${toPublicPath(
          `/products/${product.handle}`
        )}`
      : ""
  }`

  const priceAmounts = new Set(
    product.variants
      ?.map((variant) => variant.calculated_price?.calculated_amount)
      .filter((amount) => amount !== undefined)
  )

  return (
    <div
      className="pdp-actions"
      ref={actionsRef}
      aria-busy={disabled || isAdding}
    >
      <div className="pdp-price-block">
        <span className="pdp-price-label">
          <T>{selectedVariant ? "Seçiminizin fiyatı" : "Ürün fiyatı"}</T>
        </span>
        <ProductPrice
          product={product}
          variant={selectedVariant}
          showFromLabel={priceAmounts.size > 1}
        />
      </div>
      {(product.variants?.length ?? 0) > 1 && (
        <div className="pdp-options">
          {(product.options || []).map((option) => (
            <OptionSelect
              key={option.id}
              option={option}
              current={options[option.title ?? ""]}
              updateOption={setOptionValue}
              title={option.title ?? ""}
              data-testid="product-options"
              disabled={!!disabled || isAdding}
            />
          ))}
        </div>
      )}
      <div className="pdp-purchase">
        <Button
          onClick={handleAddToCart}
          disabled={!inStock || !selectedVariant || !!disabled || isAdding}
          variant="primary"
          className="pdp-add-button"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          <T>{buttonLabel}</T>
          <span aria-hidden="true">↗</span>
        </Button>
        <p className="pdp-availability" role="status">
          <span className={inStock ? "is-available" : ""} aria-hidden="true" />
          <T>
            {pendingStock && !inStock
              ? "Stok bilgisi henüz doğrulanmadı."
              : selectedVariant
              ? inStock
                ? "Seçtiğiniz ürün siparişe hazır."
                : "Seçtiğiniz varyant şu anda stokta bulunmuyor."
              : "Ürününüzü renk ve ölçü seçenekleriyle kişiselleştirin."}
          </T>
        </p>
        {error && (
          <p className="pdp-error" role="alert">
            <T>{error}</T>
          </p>
        )}
        <WhatsAppContactButton
          message={whatsappMessage}
          label="Ürün hakkında bilgi alın"
          className="pdp-contact-button"
        />
      </div>
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
  )
}
