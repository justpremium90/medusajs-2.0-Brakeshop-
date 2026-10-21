import { T } from "@lib/i18n/client"
import type { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import BrandLogo from "@modules/products/components/product-preview/brand-logo"

export default function QuoteProductCard({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[9px] border border-[#eaeaea] bg-white"
      data-testid="product-wrapper"
      data-catalog-mode="vehicle_enquiry"
    >
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        prefetch={false}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c42026]"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          alt={`${product.title} — temsili Zimmermann görseli`}
          className="rounded-none bg-white shadow-none"
          imageClassName="object-contain"
        />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <BrandLogo name="Zimmermann" kind="product" />
            <BrandLogo
              name={String(product.metadata?.vehicle_brand || "")}
              kind="vehicle"
            />
          </div>
          <h3
            className="text-[14px] font-semibold leading-5 text-[#171717]"
            data-testid="product-title"
          >
            <T>{product.title}</T>
          </h3>
          <p className="text-xs leading-5 text-[#737373]">
            <T>Temsili görsel · Araç uyumluluğu ve tedarik için bilgi alın.</T>
          </p>
          <span className="mt-auto flex min-h-11 items-center justify-center rounded-[5px] bg-[#171717] px-3 text-sm font-semibold text-white">
            <T>Ürünü incele ve bilgi al</T>
          </span>
        </div>
      </LocalizedClientLink>
    </article>
  )
}
