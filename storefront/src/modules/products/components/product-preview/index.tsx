import {
  getPricesForVariant,
  getProductPrice,
} from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import QuickAddRibbon from "./quick-add-ribbon"
import { getProductsById } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import BrandLogo from "./brand-logo"
import { hasProductCardData } from "@lib/util/product-card-data"
import { getProductBrandName } from "@lib/util/product-brand"
import { isQuoteProduct } from "@lib/util/quote-product"
import QuoteProductCard from "@modules/products/components/quote-product-card"

const baseFont = {
  fontFamily:
    '"Helvetica Neue LT Std", "Avenir light", Helvetica, Arial, sans-serif',
}

const condensedFont = {
  fontFamily:
    '"Helvetica Neue LT Condensed", "Avenir Next Condensed Medium", Helvetica, Arial, sans-serif',
  fontWeight: 500,
  letterSpacing: ".03125rem",
}

const DESKTOP_PRODUCT_TITLE_LIMIT = 64

const getDesktopProductTitle = (title: string) => {
  const normalizedTitle = title.trim()
  const characters = Array.from(normalizedTitle)

  if (characters.length <= DESKTOP_PRODUCT_TITLE_LIMIT) {
    return normalizedTitle
  }

  const availableTitle = characters
    .slice(0, DESKTOP_PRODUCT_TITLE_LIMIT - 1)
    .join("")
  const lastSpace = availableTitle.lastIndexOf(" ")
  const cutAt = lastSpace >= 48 ? lastSpace : availableTitle.length

  return `${availableTitle.slice(0, cutAt).trimEnd()}…`
}

const isSourceProductAvailable = (product: HttpTypes.StoreProduct) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  return (
    metadata.source !== "online-yedek-parca" ||
    metadata.source_in_stock !== false
  )
}

const canAddVariant = (variant: any, sourceInStock = true) => {
  if (!variant?.id || !sourceInStock) {
    return false
  }

  if (!variant.manage_inventory || variant.allow_backorder) {
    return true
  }

  return (variant.inventory_quantity || 0) > 0
}

const getMobileBadge = (product: HttpTypes.StoreProduct) => {
  return product.collection?.title || product.type?.value || "Yeni!"
}

const getMobileSubtitle = (product: HttpTypes.StoreProduct) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const subtitle = (product as any).subtitle || metadata.subtitle

  return typeof subtitle === "string" && subtitle.trim()
    ? subtitle
    : product.type?.value || product.collection?.title || ""
}

const getDeliveryLabel = (product: HttpTypes.StoreProduct) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const deliveryLabel = metadata.delivery_label || metadata.deliveryLabel

  return typeof deliveryLabel === "string" && deliveryLabel.trim()
    ? deliveryLabel.trim()
    : ""
}

const getMetadataText = (product: HttpTypes.StoreProduct, keys: string[]) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>

  for (const key of keys) {
    const value = metadata[key]

    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  return ""
}

type VehicleBrandDefinition = {
  name: string
  aliases: string[]
}

const vehicleBrandDefinitions: VehicleBrandDefinition[] = [
  { name: "MERCEDES-BENZ", aliases: ["MERCEDES BENZ", "MERCEDES"] },
  { name: "ALFA ROMEO", aliases: ["ALFA ROMEO"] },
  { name: "LAND ROVER", aliases: ["LAND ROVER", "RANGE ROVER"] },
  { name: "VOLKSWAGEN", aliases: ["VOLKSWAGEN", "VW"] },
  { name: "MITSUBISHI", aliases: ["MITSUBISHI"] },
  { name: "CHEVROLET", aliases: ["CHEVROLET"] },
  { name: "HYUNDAI", aliases: ["HYUNDAI"] },
  { name: "CITROEN", aliases: ["CITROEN"] },
  { name: "PEUGEOT", aliases: ["PEUGEOT"] },
  { name: "RENAULT", aliases: ["RENAULT"] },
  { name: "PORSCHE", aliases: ["PORSCHE"] },
  { name: "TOYOTA", aliases: ["TOYOTA"] },
  { name: "NISSAN", aliases: ["NISSAN"] },
  { name: "SUZUKI", aliases: ["SUZUKI"] },
  { name: "SUBARU", aliases: ["SUBARU"] },
  { name: "CHRYSLER", aliases: ["CHRYSLER"] },
  { name: "INFINITI", aliases: ["INFINITI"] },
  { name: "LEXUS", aliases: ["LEXUS"] },
  { name: "JAGUAR", aliases: ["JAGUAR"] },
  { name: "SKODA", aliases: ["SKODA"] },
  { name: "HONDA", aliases: ["HONDA"] },
  { name: "MAZDA", aliases: ["MAZDA"] },
  { name: "DACIA", aliases: ["DACIA"] },
  { name: "OPEL", aliases: ["OPEL"] },
  { name: "VAUXHALL", aliases: ["VAUXHALL"] },
  { name: "FORD", aliases: ["FORD"] },
  { name: "FIAT", aliases: ["FIAT"] },
  { name: "AUDI", aliases: ["AUDI"] },
  { name: "SEAT", aliases: ["SEAT"] },
  { name: "CUPRA", aliases: ["CUPRA"] },
  { name: "VOLVO", aliases: ["VOLVO"] },
  { name: "SAAB", aliases: ["SAAB"] },
  { name: "ISUZU", aliases: ["ISUZU"] },
  { name: "JEEP", aliases: ["JEEP"] },
  { name: "DODGE", aliases: ["DODGE"] },
  { name: "KIA", aliases: ["KIA"] },
  { name: "TESLA", aliases: ["TESLA"] },
  { name: "SMART", aliases: ["SMART"] },
  { name: "MINI", aliases: ["MINI"] },
  { name: "BMW", aliases: ["BMW"] },
  { name: "DS", aliases: ["DS AUTOMOBILES", "DS"] },
]

const normalizeVehicleText = (value: string) =>
  value
    .toLocaleUpperCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/İ/g, "I")

const detectVehicleBrand = (value: string) => {
  const normalized = normalizeVehicleText(value)

  for (const definition of vehicleBrandDefinitions) {
    for (const alias of definition.aliases) {
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const expression = new RegExp(
        `(^|[^A-Z0-9])${escapedAlias}(?=$|[^A-Z0-9])`,
        "i"
      )

      if (expression.test(normalized)) {
        return definition.name
      }
    }
  }

  return ""
}

const getPerformanceVehicleBrand = (product: HttpTypes.StoreProduct) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const compatibleVehicles =
    metadata.compatible_vehicles || metadata.compatibleVehicles

  if (Array.isArray(compatibleVehicles)) {
    for (const compatibleVehicle of compatibleVehicles.slice(0, 8)) {
      if (typeof compatibleVehicle === "string") {
        const detected = detectVehicleBrand(compatibleVehicle)
        if (detected) return detected
      }

      if (compatibleVehicle && typeof compatibleVehicle === "object") {
        const vehicle = compatibleVehicle as Record<string, unknown>
        const vehicleBrand = vehicle.brand || vehicle.make

        if (typeof vehicleBrand === "string") {
          const detected = detectVehicleBrand(vehicleBrand)
          if (detected) return detected
        }
      }
    }
  }

  const directMetadataBrand = getMetadataText(product, [
    "vehicle_brand",
    "vehicleBrand",
    "vehicle_make",
    "vehicleMake",
  ])
  const directMatch = detectVehicleBrand(directMetadataBrand)
  if (directMatch) return directMatch

  const sourceCategoryPath = metadata.source_category_path
  const categoryText = Array.isArray(sourceCategoryPath)
    ? sourceCategoryPath
        .map((category) => {
          if (typeof category === "string") return category
          if (category && typeof category === "object") {
            const item = category as Record<string, unknown>
            return typeof item.name === "string" ? item.name : ""
          }
          return ""
        })
        .join(" ")
    : ""

  return detectVehicleBrand(`${product.title} ${categoryText}`)
}

const ProductBrandRow = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const vehicleBrand = getPerformanceVehicleBrand(product)
  return (
    <div className="mb-2 flex min-h-9 items-center justify-between gap-2">
      <BrandLogo name={getProductBrandName(product)} kind="product" />
      {vehicleBrand ? <BrandLogo name={vehicleBrand} kind="vehicle" /> : null}
    </div>
  )
}

const getPerformanceCompatibility = (product: HttpTypes.StoreProduct) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const compatibleVehicles =
    metadata.compatible_vehicles || metadata.compatibleVehicles

  if (Array.isArray(compatibleVehicles) && compatibleVehicles.length) {
    const firstVehicle = compatibleVehicles[0]

    if (typeof firstVehicle === "string") {
      return firstVehicle
    }

    if (firstVehicle && typeof firstVehicle === "object") {
      const vehicle = firstVehicle as Record<string, unknown>
      const description = [
        vehicle.brand || vehicle.make,
        vehicle.model,
        vehicle.generation || vehicle.year,
        vehicle.position,
      ]
        .filter((value): value is string => typeof value === "string")
        .join(" • ")

      if (description) {
        return description
      }
    }
  }

  return (
    getMetadataText(product, [
      "vehicle_compatibility",
      "vehicleCompatibility",
      "compatible_vehicle_summary",
      "source_category_path",
      "subtitle",
    ]) || getMobileSubtitle(product)
  )
}

const formatPerformancePrice = (
  price: ReturnType<typeof getProductPrice>["cheapestPrice"]
) => {
  if (!price) {
    return "Fiyat için iletişime geçin"
  }

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: price.currency_code || "TRY",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price.calculated_price_number)
}

const formatPerformanceOriginalPrice = (
  price: NonNullable<ReturnType<typeof getProductPrice>["cheapestPrice"]>
) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: price.currency_code || "TRY",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price.original_price_number)
}

const PerformanceProductCard = ({
  product,
  cheapestPrice,
  quickAddVariant,
  quickAddDisabled,
  deliveryLabel,
}: {
  product: HttpTypes.StoreProduct
  cheapestPrice: ReturnType<typeof getProductPrice>["cheapestPrice"]
  quickAddVariant?: any
  quickAddDisabled: boolean
  deliveryLabel?: string
}) => {
  const brand = getProductBrandName(product)
  const vehicleBrand = getPerformanceVehicleBrand(product)
  const compatibility = getPerformanceCompatibility(product)
  const sku = quickAddVariant?.sku
  const formattedPrice = formatPerformancePrice(cheapestPrice)

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[9px] border border-[#eaeaea] bg-white transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#dedede] hover:shadow-[0_12px_30px_rgba(0,0,0,.075)] focus-within:border-[#c42026]"
      data-testid="product-wrapper"
    >
      <div className="relative overflow-hidden bg-[#f7f7f7]">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#c42026]"
          aria-label={`${product.title} ürününü incele`}
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            alt={`${product.title} ürün görseli`}
            className="w-full rounded-none bg-[#f7f7f7] p-0 shadow-none"
            imageClassName="object-contain transition-transform duration-200 ease-out group-hover:scale-[1.02]"
            fallbackImageClassName="small:-translate-y-[3%] small:scale-[1.12] small:transition-transform small:duration-200 small:ease-out small:group-hover:scale-[1.14]"
          />
        </LocalizedClientLink>

        <LocalizedClientLink
          href="/account"
          aria-label={`${product.title} için favorileri aç`}
          className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white/95 text-[#171717] shadow-[0_2px_10px_rgba(0,0,0,.06)] transition-[color,opacity,transform] duration-200 hover:text-[#c42026] focus:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c42026] small:opacity-0 small:group-hover:opacity-100"
        >
          <svg
            aria-hidden="true"
            className="h-[21px] w-[21px] fill-none stroke-current stroke-[1.7]"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20.8S4 16.2 4 9.8a4.2 4.2 0 0 1 7.8-2.2l.2.3.2-.3A4.2 4.2 0 0 1 20 9.8c0 6.4-8 11-8 11Z" />
          </svg>
        </LocalizedClientLink>
      </div>

      <div className="flex flex-1 flex-col p-3 xsmall:p-4">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
          className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c42026]"
        >
          <div className="mb-1.5 flex min-h-9 items-center justify-between gap-2">
            <BrandLogo name={brand} kind="product" />
            {vehicleBrand ? (
              <BrandLogo name={vehicleBrand} kind="vehicle" />
            ) : null}
          </div>
          <h3
            className="min-h-[42px] overflow-hidden text-[14px] font-semibold leading-[20px] tracking-[-0.01em] text-[#171717] xsmall:text-[15px] xsmall:leading-[21px] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
            data-testid="product-title"
            title={product.title}
          >
            {product.title}
          </h3>
          <p className="mt-2 min-h-[36px] overflow-hidden text-[12px] leading-[18px] text-[#737373] xsmall:text-[13px] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {compatibility || "Araç uyumluluğunu ürün detayında inceleyin"}
          </p>
          {sku ? (
            <p className="mt-1 truncate text-[10px] leading-4 text-[#a3a3a3] xsmall:text-[11px]">
              Ürün Kodu: {sku}
            </p>
          ) : null}

          <div className="mt-4">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <p
                className={`text-[18px] font-semibold leading-6 tracking-[-0.02em] xsmall:text-[20px] ${
                  cheapestPrice?.price_type === "sale"
                    ? "text-[#c42026]"
                    : "text-[#111]"
                }`}
              >
                {formattedPrice}
              </p>
              {cheapestPrice?.price_type === "sale" ? (
                <span className="text-[11px] text-[#858585] line-through xsmall:text-[12px]">
                  {formatPerformanceOriginalPrice(cheapestPrice)}
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex min-h-5 flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium text-[#525252] xsmall:text-[11px]">
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    quickAddDisabled ? "bg-[#a3a3a3]" : "bg-[#288a4b]"
                  }`}
                />
                {quickAddDisabled ? "Stokta Yok" : "Stokta"}
              </span>
              {!quickAddDisabled ? (
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.6]"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7h11v10H3V7Zm11 3h4l3 3v4h-7v-7Z" />
                    <circle cx="7" cy="18" r="1.5" />
                    <circle cx="18" cy="18" r="1.5" />
                  </svg>
                  {deliveryLabel || "Hızlı Kargo"}
                </span>
              ) : null}
            </div>
          </div>
        </LocalizedClientLink>

        <QuickAddRibbon
          variantId={quickAddVariant?.id}
          disabled={quickAddDisabled}
          disabledLabel="Stokta Yok"
          className="mt-4 h-11 rounded-[5px] border border-[#171717] bg-[#171717] text-[12px] font-semibold normal-case tracking-[0.03em] text-white hover:border-[#c42026] hover:bg-[#c42026] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c42026] disabled:border-[#dedede] disabled:bg-[#e5e5e5] disabled:text-[#858585] disabled:opacity-100 xsmall:text-[13px] small:h-12"
        />
      </div>
    </article>
  )
}

const DeliveryLabel = ({ label }: { label?: string }) => {
  if (!label) {
    return null
  }

  return (
    <span
      className="shrink-0 whitespace-nowrap rounded-[2px] border border-[#e4b9ad] bg-[#fff5f3] px-1.5 py-[3px] text-right text-[9px] font-semibold leading-none text-[#3a080a] small:text-[10px]"
      style={condensedFont}
    >
      {label}
    </span>
  )
}

const getStableNumber = (value: string) => {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0)
}

const getRating = (product: HttpTypes.StoreProduct) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const stableNumber = getStableNumber(
    product.id || product.handle || product.title || ""
  )
  const rating =
    typeof metadata.rating === "number"
      ? metadata.rating
      : typeof metadata.rating === "string"
      ? Number(metadata.rating)
      : 4 + (stableNumber % 10) / 10
  const reviewCount =
    typeof metadata.review_count === "number"
      ? metadata.review_count
      : typeof metadata.review_count === "string"
      ? Number(metadata.review_count)
      : 24 + (stableNumber % 760)

  if (Number.isNaN(rating)) {
    return {
      rating: 4,
      reviewCount,
    }
  }

  return {
    rating: Math.max(4, Math.min(4.9, rating)),
    reviewCount: reviewCount && !Number.isNaN(reviewCount) ? reviewCount : 24,
  }
}

const getMobileImages = (product: HttpTypes.StoreProduct) => {
  const urls = [
    product.thumbnail,
    ...(product.images || []).map((image) => image.url),
  ]
    .filter(Boolean)
    .filter((url, index, array) => array.indexOf(url) === index) as string[]

  if (!urls.length) {
    return []
  }

  return Array.from({ length: 3 }, (_, index) => urls[index % urls.length])
}

const MobileProductImages = ({
  product,
  productImageFit,
  productImageHeightPercent,
  productImageAreaHeightPercent,
}: {
  product: HttpTypes.StoreProduct
  productImageFit: "contain" | "cover"
  productImageHeightPercent: number
  productImageAreaHeightPercent: number
}) => {
  const images = getMobileImages(product)
  const imageVerticalInset = (100 - productImageHeightPercent) / 2

  if (!images.length) {
    return (
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="block"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          alt={`${product.title} product image`}
          className="w-full rounded-none bg-white p-0 shadow-none"
          imageClassName={
            productImageFit === "cover" ? "object-cover" : "object-contain"
          }
          imageHeightPercent={productImageHeightPercent}
          imageAreaHeightPercent={productImageAreaHeightPercent}
        />
      </LocalizedClientLink>
    )
  }

  return (
    <div
      className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth bg-white no-scrollbar"
      style={{ aspectRatio: `${100 / productImageAreaHeightPercent} / 1` }}
    >
      {images.map((image, index) => (
        <LocalizedClientLink
          key={`${image}-${index}`}
          href={`/products/${product.handle}`}
          prefetch={false}
          className="relative block min-w-full snap-start"
          aria-label={`${product.title} görsel ${index + 1}`}
        >
          <span
            className="absolute inset-x-0"
            style={{
              top: `${imageVerticalInset}%`,
              bottom: `${imageVerticalInset}%`,
            }}
          >
            <Image
              src={image}
              alt={`${product.title} product image ${index + 1}`}
              className={`${
                productImageFit === "cover" ? "object-cover" : "object-contain"
              } object-center`}
              draggable={false}
              quality={60}
              sizes="(max-width: 1023px) 50vw, 25vw"
              fill
            />
          </span>
        </LocalizedClientLink>
      ))}
    </div>
  )
}

const MobileProductCard = ({
  product,
  cheapestPrice,
  quickAddVariant,
  quickAddDisabled,
  deliveryLabel,
  productImageFit,
  productImageHeightPercent,
  productImageAreaHeightPercent,
}: {
  product: HttpTypes.StoreProduct
  cheapestPrice: ReturnType<typeof getProductPrice>["cheapestPrice"]
  quickAddVariant?: any
  quickAddDisabled: boolean
  deliveryLabel?: string
  productImageFit: "contain" | "cover"
  productImageHeightPercent: number
  productImageAreaHeightPercent: number
}) => {
  const badge = getMobileBadge(product)
  const subtitle = getMobileSubtitle(product)
  const rating = getRating(product)

  return (
    <article
      className="group flex h-full flex-col text-[#3a080a] small:hidden"
      style={baseFont}
      data-testid="product-wrapper"
    >
      <div className="relative bg-white">
        <MobileProductImages
          product={product}
          productImageFit={productImageFit}
          productImageHeightPercent={productImageHeightPercent}
          productImageAreaHeightPercent={productImageAreaHeightPercent}
        />
        <div
          className="pointer-events-none absolute left-3 top-3 flex items-center gap-x-1.5"
          aria-hidden="true"
        >
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={`h-2 w-2 rounded-full shadow-[0_0_0_1px_rgba(58,8,10,0.08)] ${
                dot === 0 ? "bg-[#3a080a]" : "bg-[#d8d3d1]"
              }`}
            />
          ))}
        </div>
        <span
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#3a080a] shadow-[0_2px_8px_rgba(58,8,10,0.08)]"
          aria-hidden="true"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21S4 16.2 4 9.8C4 7.3 5.8 5.5 8.1 5.5c1.6 0 3 .9 3.9 2.2.9-1.3 2.3-2.2 3.9-2.2 2.3 0 4.1 1.8 4.1 4.3C20 16.2 12 21 12 21Z" />
          </svg>
        </span>
        <p
          className="flex h-6 items-center bg-[#fde8e6] px-2.5 text-[11px] uppercase leading-none text-[#7f4c49]"
          style={condensedFont}
        >
          <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {badge}
          </span>
        </p>
      </div>

      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="mt-3 flex flex-1 flex-col"
      >
        <ProductBrandRow product={product} />
        <h3
          className="min-h-[51px] text-[16px] uppercase leading-[17px] text-[#3a080a]"
          style={condensedFont}
          data-testid="product-title"
        >
          <span className="block min-w-0 overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {product.title}
          </span>
        </h3>
        <p className="mt-1 min-h-[18px] text-[13px] leading-4 text-[#5f302f]">
          <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {subtitle}
          </span>
        </p>
        <p className="mt-3 flex min-h-[18px] items-center gap-x-1.5 text-[12px] leading-4 text-[#3a080a]">
          <span className="text-[12px] tracking-[0.02em]" aria-hidden="true">
            ★★★★★
          </span>
          <span>
            {rating.rating.toFixed(1)} ({rating.reviewCount})
          </span>
        </p>
        <div className="brand-price-text mt-4 flex min-h-[18px] items-center justify-between gap-x-2 text-[12px] font-normal leading-none">
          <span className="flex min-w-0 items-center gap-x-1.5">
            {cheapestPrice?.price_type === "sale" ? (
              <span className="font-normal text-[#7f4c49] line-through">
                {cheapestPrice.original_price}
              </span>
            ) : null}
            <span
              className={
                cheapestPrice?.price_type === "sale" ? "text-[#b95757]" : ""
              }
            >
              {cheapestPrice?.calculated_price}
            </span>
          </span>
          <DeliveryLabel label={deliveryLabel} />
        </div>
      </LocalizedClientLink>

      <QuickAddRibbon
        variantId={quickAddVariant?.id}
        disabled={quickAddDisabled}
        className="mt-4 h-[34px] border border-[#3a080a] bg-white text-[13px] hover:bg-[#fff8f6] disabled:bg-white small:hidden"
      />
    </article>
  )
}

const CharlotteProductCard = ({
  product,
  cheapestPrice,
  quickAddVariant,
  quickAddDisabled,
  productImageFit,
  productImageHeightPercent,
  productImageAreaHeightPercent,
}: {
  product: HttpTypes.StoreProduct
  cheapestPrice: ReturnType<typeof getProductPrice>["cheapestPrice"]
  quickAddVariant?: any
  quickAddDisabled: boolean
  productImageFit: "contain" | "cover"
  productImageHeightPercent: number
  productImageAreaHeightPercent: number
}) => {
  const badge = getMobileBadge(product)
  const subtitle = getMobileSubtitle(product)
  const desktopTitle = getDesktopProductTitle(product.title)

  return (
    <article
      className="group flex h-full flex-col bg-white text-[#3a080a]"
      style={baseFont}
      data-testid="product-wrapper"
    >
      <div className="relative">
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
          className="block"
          aria-label={product.title}
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            alt={`${product.title} product image`}
            className="w-full rounded-none bg-[#f7f7f7] p-0 shadow-none transition-opacity duration-200 group-hover:opacity-95"
            imageClassName={
              productImageFit === "cover" ? "object-cover" : "object-contain"
            }
            imageHeightPercent={productImageHeightPercent}
            imageAreaHeightPercent={productImageAreaHeightPercent}
          />
        </LocalizedClientLink>
        <span
          className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#3a080a]"
          aria-hidden="true"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21S4 16.2 4 9.8C4 7.3 5.8 5.5 8.1 5.5c1.6 0 3 .9 3.9 2.2.9-1.3 2.3-2.2 3.9-2.2 2.3 0 4.1 1.8 4.1 4.3C20 16.2 12 21 12 21Z" />
          </svg>
        </span>
      </div>

      <p
        className="flex h-6 shrink-0 items-center overflow-hidden bg-[#fde8e6] px-2 text-[11px] uppercase leading-none text-[#7f4c49] small:h-5"
        style={{ ...condensedFont, fontWeight: 700 }}
      >
        <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {badge}
        </span>
      </p>

      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="flex min-h-[116px] flex-1 flex-col px-2 pb-3 pt-3 small:min-h-[120px]"
      >
        <ProductBrandRow product={product} />
        <h3
          className="min-h-[54px] text-[16px] leading-[18px] text-[#3a080a]"
          data-testid="product-title"
        >
          <span
            className="block overflow-hidden text-ellipsis uppercase [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
            style={{ ...condensedFont, fontWeight: 700 }}
            title={product.title}
          >
            {desktopTitle}
          </span>
          {subtitle ? (
            <span
              className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal normal-case leading-[18px]"
              style={baseFont}
            >
              {subtitle}
            </span>
          ) : null}
        </h3>

        <div className="brand-price-text mt-auto flex min-h-[18px] items-center gap-x-2 pt-2 text-[14px] font-normal leading-[18px]">
          {cheapestPrice?.price_type === "sale" ? (
            <span className="text-[#7f4c49] line-through">
              {cheapestPrice.original_price}
            </span>
          ) : null}
          <span
            className={
              cheapestPrice?.price_type === "sale" ? "text-[#b95757]" : ""
            }
          >
            {cheapestPrice?.calculated_price}
          </span>
        </div>
      </LocalizedClientLink>

      <QuickAddRibbon
        variantId={quickAddVariant?.id}
        disabled={quickAddDisabled}
        className="mt-0 h-[34px] shrink-0 border border-[#3a080a]/70 bg-transparent px-2 text-[12px] font-medium tracking-[0.09em] hover:border-[#3a080a] hover:bg-[#fff8f6] disabled:bg-white small:h-[34px] small:text-[12px]"
      />
    </article>
  )
}

const EditorialProductCard = ({
  product,
  cheapestPrice,
  quickAddVariant,
  quickAddDisabled,
  productImageFit,
  productImageHeightPercent,
  productImageAreaHeightPercent,
}: {
  product: HttpTypes.StoreProduct
  cheapestPrice: ReturnType<typeof getProductPrice>["cheapestPrice"]
  quickAddVariant?: any
  quickAddDisabled: boolean
  productImageFit: "contain" | "cover"
  productImageHeightPercent: number
  productImageAreaHeightPercent: number
}) => {
  const kicker =
    product.type?.value || product.collection?.title || "Fren sistemleri"
  const subtitle = getMobileSubtitle(product)
  const desktopTitle = getDesktopProductTitle(product.title)

  return (
    <article
      className="group flex h-full flex-col border-t border-[#1d1a17] pt-3 text-[#1d1a17]"
      data-testid="product-wrapper"
    >
      <div className="mb-3 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.16em]">
        <span className="truncate text-[#d1492e]">{kicker}</span>
        <span className="shrink-0 text-[#6f6a64]">BrakeShop seçkisi</span>
      </div>
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="block overflow-hidden bg-[#ebe6de]"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          alt={`${product.title} ürün görseli`}
          className="w-full rounded-none bg-[#ebe6de] p-0 shadow-none transition-transform duration-500 group-hover:scale-[1.02]"
          imageClassName={
            productImageFit === "cover" ? "object-cover" : "object-contain"
          }
          imageHeightPercent={productImageHeightPercent}
          imageAreaHeightPercent={productImageAreaHeightPercent}
        />
      </LocalizedClientLink>
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="flex flex-1 flex-col py-4"
      >
        <ProductBrandRow product={product} />
        <h3
          className="text-[21px] font-normal leading-[1.02] tracking-[-0.025em] small:text-[24px]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          data-testid="product-title"
          title={product.title}
        >
          {desktopTitle}
        </h3>
        {subtitle ? (
          <p className="mt-2 line-clamp-2 text-[12px] leading-[1.45] text-[#625d57]">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 border-b border-[#bdb5aa] pb-3 pt-5 text-[13px] font-semibold">
          <span>{cheapestPrice && <PreviewPrice price={cheapestPrice} />}</span>
          <span className="text-[10px] uppercase tracking-[0.14em]">
            İncele →
          </span>
        </div>
      </LocalizedClientLink>
      <QuickAddRibbon
        variantId={quickAddVariant?.id}
        disabled={quickAddDisabled}
        className="h-[34px] min-h-[34px] border border-[#1d1a17] bg-[#1d1a17] text-[11px] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#d1492e] disabled:bg-[#8d8882]"
      />
    </article>
  )
}

const TechnicalListProductCard = ({
  product,
  pricedProduct,
  productImageFit,
  productImageHeightPercent,
  productImageAreaHeightPercent,
}: {
  product: HttpTypes.StoreProduct
  pricedProduct: HttpTypes.StoreProduct
  productImageFit: "contain" | "cover"
  productImageHeightPercent: number
  productImageAreaHeightPercent: number
}) => {
  const variants = (pricedProduct.variants || []).slice(0, 5)
  const sourceInStock = isSourceProductAvailable(pricedProduct)
  const description =
    product.description ||
    getMobileSubtitle(product) ||
    "Ürün detayları ve araç uyumluluğu için inceleyin."

  return (
    <article
      className="grid bg-white text-[#222] shadow-[0_1px_3px_rgba(0,0,0,0.08)] small:grid-cols-[190px_minmax(230px,1fr)_minmax(430px,1.65fr)]"
      data-testid="product-wrapper"
      style={baseFont}
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="border-b border-[#e2e2e2] bg-white p-4 small:border-b-0 small:border-r"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          alt={`${product.title} ürün görseli`}
          className="mx-auto w-full max-w-[210px] rounded-none bg-white p-0 shadow-none"
          imageClassName={
            productImageFit === "cover" ? "object-cover" : "object-contain"
          }
          imageHeightPercent={productImageHeightPercent}
          imageAreaHeightPercent={productImageAreaHeightPercent}
        />
      </LocalizedClientLink>

      <div className="border-b border-[#e2e2e2] p-4 small:border-b-0 small:border-r small:p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="bg-[#f2b500] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.06em] text-white">
            {product.collection?.title || "Önerilen"}
          </span>
          {getDeliveryLabel(product) ? (
            <span className="bg-[#3c4653] px-2 py-1 text-[9px] font-bold uppercase text-white">
              {getDeliveryLabel(product)}
            </span>
          ) : null}
        </div>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
        >
          <ProductBrandRow product={product} />
          <h3
            className="text-[17px] font-bold leading-[1.15] text-[#171717]"
            data-testid="product-title"
          >
            {product.title}
          </h3>
        </LocalizedClientLink>
        <p className="mt-3 line-clamp-4 text-[11px] leading-[1.55] text-[#666]">
          {description}
        </p>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
          className="mt-4 inline-block text-[10px] font-bold text-[#d92f2f] underline underline-offset-2"
        >
          Ürün detaylarını incele
        </LocalizedClientLink>
      </div>

      <div className="divide-y divide-[#e8e8e8]">
        {variants.length ? (
          variants.map((variant: any) => {
            const variantPrice = getPricesForVariant(variant)
            const optionText =
              variant.options
                ?.map((option: any) => option.value)
                .filter(Boolean)
                .join(" / ") ||
              variant.title ||
              "Standart"
            const available = canAddVariant(variant, sourceInStock)

            return (
              <div
                key={variant.id}
                className="grid min-h-[52px] grid-cols-[minmax(0,1fr)_74px_84px_42px] items-center gap-2 px-3 py-2 text-[10px] small:grid-cols-[minmax(120px,1fr)_100px_105px_46px]"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#333]">{optionText}</p>
                  <p className="mt-0.5 truncate text-[9px] text-[#999]">
                    {variant.sku || "Stok kodu tanımlanmadı"}
                  </p>
                </div>
                <span
                  className={`font-semibold ${
                    available ? "text-[#4b8b38]" : "text-[#999]"
                  }`}
                >
                  {available ? "Stokta" : "Tükendi"}
                </span>
                <span className="brand-price-text text-right text-[12px] font-bold">
                  {variantPrice?.calculated_price || "—"}
                </span>
                <QuickAddRibbon
                  variantId={variant.id}
                  disabled={!available}
                  className="m-0 h-8 min-h-8 w-8 justify-self-end bg-[#e83b3b] p-0 text-[0px] text-white hover:bg-[#c92626] disabled:bg-[#cfcfcf] small:h-9 small:min-h-9 small:w-9 after:text-[18px] after:content-['+']"
                />
              </div>
            )
          })
        ) : (
          <div className="p-5 text-[11px] text-[#777]">
            Bu ürün için satış varyantı bulunamadı.
          </div>
        )}
      </div>
    </article>
  )
}

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  displayStyle = "performance",
  productImageFit = "contain",
  productImageHeightPercent = 100,
  productImageAreaHeightPercent = 100,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  displayStyle?:
    | "default"
    | "charlotte"
    | "editorial"
    | "technical"
    | "performance"
  productImageFit?: "contain" | "cover"
  productImageHeightPercent?: number
  productImageAreaHeightPercent?: number
}) {
  if (isQuoteProduct(product)) return <QuoteProductCard product={product} />

  const normalizedProductImageHeight = Math.min(
    100,
    Math.max(40, productImageHeightPercent)
  )
  const normalizedProductImageAreaHeight = Math.min(
    120,
    Math.max(40, productImageAreaHeightPercent)
  )
  const pricedProduct = hasProductCardData(product)
    ? product
    : (await getProductsById({ ids: [product.id!], regionId: region.id }))[0]

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
  })
  const sourceInStock = isSourceProductAvailable(pricedProduct)
  const quickAddVariant =
    pricedProduct.variants?.find((variant) =>
      canAddVariant(variant, sourceInStock)
    ) || pricedProduct.variants?.[0]
  const quickAddDisabled =
    !quickAddVariant || !canAddVariant(quickAddVariant, sourceInStock)
  const deliveryLabel =
    getDeliveryLabel(product) || getDeliveryLabel(pricedProduct)
  const desktopTitle = getDesktopProductTitle(product.title)

  if (displayStyle === "performance") {
    return (
      <PerformanceProductCard
        product={pricedProduct}
        cheapestPrice={cheapestPrice}
        quickAddVariant={quickAddVariant}
        quickAddDisabled={quickAddDisabled}
        deliveryLabel={deliveryLabel}
      />
    )
  }

  if (displayStyle === "charlotte") {
    return (
      <CharlotteProductCard
        product={product}
        cheapestPrice={cheapestPrice}
        quickAddVariant={quickAddVariant}
        quickAddDisabled={quickAddDisabled}
        productImageFit={productImageFit}
        productImageHeightPercent={normalizedProductImageHeight}
        productImageAreaHeightPercent={normalizedProductImageAreaHeight}
      />
    )
  }

  if (displayStyle === "editorial") {
    return (
      <EditorialProductCard
        product={product}
        cheapestPrice={cheapestPrice}
        quickAddVariant={quickAddVariant}
        quickAddDisabled={quickAddDisabled}
        productImageFit={productImageFit}
        productImageHeightPercent={normalizedProductImageHeight}
        productImageAreaHeightPercent={normalizedProductImageAreaHeight}
      />
    )
  }

  if (displayStyle === "technical") {
    return (
      <TechnicalListProductCard
        product={product}
        pricedProduct={pricedProduct}
        productImageFit={productImageFit}
        productImageHeightPercent={normalizedProductImageHeight}
        productImageAreaHeightPercent={normalizedProductImageAreaHeight}
      />
    )
  }

  return (
    <>
      <MobileProductCard
        product={product}
        cheapestPrice={cheapestPrice}
        quickAddVariant={quickAddVariant}
        quickAddDisabled={quickAddDisabled}
        deliveryLabel={deliveryLabel}
        productImageFit={productImageFit}
        productImageHeightPercent={normalizedProductImageHeight}
        productImageAreaHeightPercent={normalizedProductImageAreaHeight}
      />
      <article
        className="group hidden h-full flex-col small:flex"
        data-testid="product-wrapper"
      >
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
          className="block"
        >
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            alt={`${product.title} product image`}
            className="w-full rounded-none bg-white p-0 shadow-none"
            imageClassName={
              productImageFit === "cover" ? "object-cover" : "object-contain"
            }
            imageHeightPercent={normalizedProductImageHeight}
            imageAreaHeightPercent={normalizedProductImageAreaHeight}
          />
        </LocalizedClientLink>
        <QuickAddRibbon
          variantId={quickAddVariant?.id}
          disabled={quickAddDisabled}
          className="shrink-0 border border-[#3a080a]/70 bg-transparent hover:border-[#3a080a] hover:bg-[#fff8f6]"
        />
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          prefetch={false}
          className="mt-1 block text-[#3a080a]"
        >
          <div className="px-3 pt-2">
            <ProductBrandRow product={product} />
          </div>
          <div className="flex h-12 items-center bg-[#fff3f2] px-3">
            <span
              className="block min-w-0 overflow-hidden text-ellipsis text-[12px] uppercase leading-[15px] text-[#3a080a] small:text-[13px] small:leading-4 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
              style={condensedFont}
              data-testid="product-title"
              title={product.title}
            >
              {desktopTitle}
            </span>
          </div>
          <div className="flex h-10 items-center justify-between gap-x-2 bg-white px-3 text-[13px] leading-none text-[#3a080a] small:text-[14px]">
            <span className="min-w-0">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </span>
            <DeliveryLabel label={deliveryLabel} />
          </div>
        </LocalizedClientLink>
      </article>
    </>
  )
}
