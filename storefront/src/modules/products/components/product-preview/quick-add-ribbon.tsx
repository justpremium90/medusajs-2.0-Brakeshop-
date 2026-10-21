"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { addToCart } from "@lib/data/cart"
import { clx } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

const condensedFont = {
  fontFamily:
    '"Helvetica Neue LT Condensed", "Helvetica Neue LT Com 77 Bold Condensed", "Avenir Next Condensed Medium", Helvetica, Arial, sans-serif',
}

type QuickAddRibbonProps = {
  variantId?: string
  disabled?: boolean
  className?: string
  disabledLabel?: string
}

const QuickAddRibbon = ({
  variantId,
  disabled,
  className,
  disabledLabel = "Sepete Ekle",
}: QuickAddRibbonProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const countryCode = useParams().countryCode as string
  const router = useRouter()

  const handleAddToCart = async () => {
    if (!variantId || disabled || isAdding) {
      return
    }

    setIsAdding(true)
    setIsAdded(false)
    setHasError(false)

    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
      })
      router.refresh()
      setIsAdded(true)
      window.setTimeout(() => setIsAdded(false), 1600)
    } catch (error) {
      setHasError(true)
      window.setTimeout(() => setHasError(false), 1800)
    } finally {
      setIsAdding(false)
    }
  }

  const label = disabled
    ? disabledLabel
    : isAdding
    ? "Ekleniyor"
    : isAdded
    ? "Eklendi"
    : hasError
    ? "Tekrar Dene"
    : "Sepete Ekle"

  return (
    <I18nElement
      as="button"
      type="button"
      onClick={handleAddToCart}
      disabled={!variantId || disabled || isAdding}
      className={clx(
        "brand-add-to-cart mt-1 flex h-[34px] w-full shrink-0 items-center justify-center px-3 text-[12px] font-medium uppercase leading-none tracking-[0.09em] transition-[background-color,border-color,color] duration-200 disabled:cursor-not-allowed disabled:opacity-55 small:h-[34px] small:text-[12px]",
        className
      )}
      style={condensedFont}
      aria-label={disabled ? disabledLabel : "Sepete ekle"}
    >
      <T>{label}</T>
    </I18nElement>
  )
}

export default QuickAddRibbon
