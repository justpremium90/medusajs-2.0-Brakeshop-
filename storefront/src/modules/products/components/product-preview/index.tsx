import { T } from "@lib/i18n/client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"
import QuickAddRibbon from "./quick-add-ribbon"
import PreviewPrice from "./price"
import ProductPhoto from "./product-photo"
import { getGardenProductImages } from "@lib/util/garden-product-media"
import "./product-preview.css"
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
    <article className="garden-product" data-testid="product-wrapper">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="garden-product-image-link"
      >
        <ProductPhoto
          key={product.id}
          images={getGardenProductImages(product)}
          title={product.title}
        />
      </LocalizedClientLink>
      <div className="garden-product-caption">
        <p className="garden-product-material">
          <T>{material}</T>
        </p>
        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="garden-product-title"
          data-testid="product-title"
        >
          <T>{product.title}</T>
        </LocalizedClientLink>
        <div className="garden-product-price">
          {cheapestPrice ? (
            <PreviewPrice price={cheapestPrice} />
          ) : (
            <span className="text-xs text-gray-500">
              <T>Fiyat bilgisi için inceleyin</T>
            </span>
          )}
        </div>
        {variant ? (
          <QuickAddRibbon
            variantId={variant.id}
            disabled={!available}
            disabledLabel={
              metadata?.stock_quantity_verified === false
                ? "Stok bilgisi bekleniyor"
                : "Stokta yok"
            }
            className="garden-product-action"
          />
        ) : (
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="garden-product-action"
          >
            <T>Seçenekleri incele →</T>
          </LocalizedClientLink>
        )}
      </div>
    </article>
  )
}
