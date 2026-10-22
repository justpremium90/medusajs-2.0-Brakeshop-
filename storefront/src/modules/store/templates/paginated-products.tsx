import { T } from "@lib/i18n/client"
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
  } = await getListingPage(
    countryCode,
    page,
    effectiveSortBy,
    categoryId,
    collectionId,
    productsIds ? JSON.stringify(productsIds) : undefined,
    period,
    categoryHandle
  )

  const totalPages = Math.ceil(count / PRODUCT_LISTING_LIMIT)
  const gridClass = "garden-product-grid"

  return (
    <>
      {displayStyle === "performance" ? (
        <div className="garden-listing-heading">
          <div className="flex flex-col gap-5 small:flex-row small:items-end small:justify-between small:gap-8">
            <div>
              <h1 className="garden-listing-title">
                <T>{performanceTitle}</T>
              </h1>
              <p className="mt-2 text-[13px] text-[#737373] small:text-[14px]">
                <T>{new Intl.NumberFormat("tr-TR").format(count)}</T>{" "}
                <T>ürün bulundu</T>
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
          <span className="px-4 py-3">
            <T>Ürün görseli</T>
          </span>
          <span className="border-l border-[#4c5158] px-5 py-3">
            <T>Ürün bilgisi</T>
          </span>
          <span className="grid grid-cols-[minmax(120px,1fr)_100px_105px_46px] border-l border-[#4c5158] px-3 py-3">
            <span>
              <T>Varyant / ölçü</T>
            </span>
            <span>
              <T>Stok</T>
            </span>
            <span className="text-right">
              <T>Fiyat</T>
            </span>
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
