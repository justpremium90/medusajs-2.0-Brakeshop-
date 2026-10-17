import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"
import QuickAddRibbon from "./quick-add-ribbon"
import PreviewPrice from "./price"
type Props = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isFeatured?: boolean
  displayStyle?: string
  productImageFit?: string
  productImageHeightPercent?: number
  productImageAreaHeightPercent?: number
}
export default function ProductPreview({ product }: Props) {
  const { cheapestPrice } = getProductPrice({ product })
  const variant =
    product.variants?.length === 1 ? product.variants[0] : undefined
  const available =
    variant &&
    (!variant.manage_inventory ||
      variant.allow_backorder ||
      (variant.inventory_quantity || 0) > 0)
  const metadata = product.metadata as Record<string, unknown> | null
  const material =
    typeof metadata?.material === "string"
      ? metadata.material
      : product.categories?.[0]?.name || "Dış mekan mobilyası"
  return (
    <article
      className="group flex h-full min-w-0 flex-col text-[#171717]"
      data-testid="product-wrapper"
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="block overflow-hidden bg-[#f4f3f0]"
      >
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center text-xs text-gray-400">
            Pip Garden
          </div>
        )}
      </LocalizedClientLink>
      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[9px] uppercase tracking-[.14em] text-[#777]">
          {material}
        </p>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="mt-2 text-[14px] font-semibold leading-5 small:text-base"
          data-testid="product-title"
        >
          {product.title}
        </LocalizedClientLink>
        <div className="mt-auto pt-3 text-sm">
          {cheapestPrice ? (
            <PreviewPrice price={cheapestPrice} />
          ) : (
            <span className="text-xs text-gray-500">
              Fiyat bilgisi için inceleyin
            </span>
          )}
        </div>
        {variant ? (
          <QuickAddRibbon
            variantId={variant.id}
            disabled={!available}
            disabledLabel="Stokta yok"
            className="mt-4 border border-[#171717] bg-transparent text-[#171717]"
          />
        ) : (
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="mt-4 flex h-[34px] items-center justify-center border border-[#171717] text-[11px] uppercase tracking-wider"
          >
            Seçenekleri incele →
          </LocalizedClientLink>
        )}
      </div>
    </article>
  )
}
