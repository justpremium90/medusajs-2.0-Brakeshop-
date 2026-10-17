import { getListingPage } from "@lib/data/listing-page"
import { PRODUCT_LISTING_LIMIT } from "@lib/util/listing-page"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import PerformanceToolbar from "@modules/store/components/performance-toolbar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  categoryHandle,
  period,
  productsIds,
  countryCode,
  displayStyle = "default",
  productImageFit = "contain",
  productImageHeightPercent = 100,
  productImageAreaHeightPercent = 100,
  performanceTitle = "Tüm ürünler",
  preserveProductOrder = false,
  searchMode = false,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  categoryHandle?: string
  period?: string
  productsIds?: string[]
  countryCode: string
  displayStyle?:
    | "default"
    | "charlotte"
    | "editorial"
    | "technical"
    | "performance"
  productImageFit?: "contain" | "cover"
  productImageHeightPercent?: number
  productImageAreaHeightPercent?: number
  performanceTitle?: string
  preserveProductOrder?: boolean
  searchMode?: boolean
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const effectiveSortBy = preserveProductOrder ? "relevance" : sortBy
  const {
    response: { products, count },
  } = await getListingPage(countryCode, page, effectiveSortBy, categoryId, collectionId,
    productsIds ? JSON.stringify(productsIds) : undefined, period, categoryHandle)

  const totalPages = Math.ceil(count / PRODUCT_LISTING_LIMIT)
  const gridClass =
    displayStyle === "technical"
      ? "grid w-full grid-cols-1 gap-y-3"
      : displayStyle === "editorial"
      ? "grid w-full grid-cols-2 gap-x-3 gap-y-10 small:grid-cols-3 small:gap-x-6 small:gap-y-16 large:grid-cols-4 large:gap-x-8"
      : displayStyle === "charlotte"
      ? "grid w-full grid-cols-2 gap-x-2 gap-y-6 xsmall:grid-cols-3 xsmall:gap-x-4 small:grid-cols-4 small:gap-x-5 medium:grid-cols-5 medium:gap-x-6"
      : displayStyle === "performance"
      ? "grid w-full grid-cols-2 gap-2 xsmall:gap-4 min-[768px]:grid-cols-3 min-[768px]:gap-5 medium:grid-cols-4 large:grid-cols-4 large:gap-6 xlarge:grid-cols-5"
      : "grid w-full grid-cols-2 gap-x-2 gap-y-8 small:grid-cols-4 small:gap-x-5 medium:grid-cols-4 large:grid-cols-4"

  return (
    <>
      {displayStyle === "performance" ? (
        <div className="mb-6 small:mb-8">
          <div className="flex flex-col gap-5 small:flex-row small:items-end small:justify-between small:gap-8">
            <div>
              <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#171717] small:text-[34px]">
                {performanceTitle}
              </h1>
              <p className="mt-2 text-[13px] text-[#737373] small:text-[14px]">
                {new Intl.NumberFormat("tr-TR").format(count)} ürün bulundu
              </p>
            </div>
            <div className="small:min-w-[360px]">
              <PerformanceToolbar
                sortBy={effectiveSortBy || "created_at"}
                search={searchMode}
              />
            </div>
          </div>
        </div>
      ) : null}
      {displayStyle === "technical" ? (
        <div className="mb-2 hidden grid-cols-[190px_minmax(230px,1fr)_minmax(430px,1.65fr)] bg-[#30343a] text-[9px] font-bold uppercase tracking-[0.08em] text-white small:grid">
          <span className="px-4 py-3">Ürün görseli</span>
          <span className="border-l border-[#4c5158] px-5 py-3">
            Ürün bilgisi
          </span>
          <span className="grid grid-cols-[minmax(120px,1fr)_100px_105px_46px] border-l border-[#4c5158] px-3 py-3">
            <span>Varyant / ölçü</span>
            <span>Stok</span>
            <span className="text-right">Fiyat</span>
            <span />
          </span>
        </div>
      ) : null}
      <ul className={gridClass} data-testid="products-list">
        {products.map((p) => {
          return (
            <li
              key={p.id}
              className={displayStyle !== "default" ? "h-full" : undefined}
            >
              <ProductPreview
                product={p}
                region={region}
                displayStyle={displayStyle}
                productImageFit={productImageFit}
                productImageHeightPercent={productImageHeightPercent}
                productImageAreaHeightPercent={productImageAreaHeightPercent}
              />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
