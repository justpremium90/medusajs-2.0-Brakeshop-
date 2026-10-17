import { Heading, Text } from "@medusajs/ui"
import Link from "next/link"

import { getProductListingSettings } from "@lib/data/product-listing-settings"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import PerformanceListingShell from "@modules/store/components/performance-listing-shell"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchResultsTemplateProps = {
  query: string
  ids: string[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

const SearchResultsTemplate = async ({
  query,
  ids,
  sortBy,
  page,
  countryCode,
}: SearchResultsTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const listingSettings = await getProductListingSettings()
  const decodedQuery = query
  const effectiveSortBy = sortBy || "relevance"
  const breadcrumbItems = [
    { label: "Ana sayfa", href: "/" },
    { label: "Tüm Fren Diski ve Balataları", href: "/store" },
    { label: `Arama: ${decodedQuery}` },
  ]

  if (listingSettings.site_theme === "performance") {
    return (
      <PerformanceListingShell
        breadcrumbItems={breadcrumbItems}
        heroTitle={`“${decodedQuery}” araması`}
        heroDescription="Aradığınız fren parçasını ürün kodu ve araç uyumluluğuyla birlikte inceleyin."
        bannerEnabled={listingSettings.performance_banner_enabled}
        bannerImageUrl={listingSettings.performance_banner_image_url}
        bannerTitle={listingSettings.performance_banner_title}
        bannerDescription={listingSettings.performance_banner_description}
        bannerHeightDesktop={listingSettings.performance_banner_height_desktop}
        bannerHeightMobile={listingSettings.performance_banner_height_mobile}
        seoTitle={
          pageNumber === 1 ? listingSettings.performance_seo_title : null
        }
        seoContent={
          pageNumber === 1 ? listingSettings.performance_seo_content : null
        }
      >
        {ids.length > 0 ? (
          <PaginatedProducts
            productsIds={ids}
            sortBy={effectiveSortBy}
            page={pageNumber}
            countryCode={countryCode}
            displayStyle="performance"
            performanceTitle="Arama sonuçları"
            preserveProductOrder={effectiveSortBy === "relevance"}
            searchMode
          />
        ) : (
          <div className="rounded-[8px] border border-[#e5e5e5] px-5 py-12 text-center">
            <h1 className="text-[26px] font-semibold text-[#171717]">
              Sonuç bulunamadı
            </h1>
            <p className="mt-2 text-[14px] text-[#737373]">
              Farklı bir marka, model, OEM veya parça kodu deneyin.
            </p>
            <LocalizedClientLink
              href="/store"
              className="mt-6 inline-flex h-11 items-center rounded-[5px] bg-[#171717] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#c42026]"
            >
              Tüm ürünleri göster
            </LocalizedClientLink>
          </div>
        )}
      </PerformanceListingShell>
    )
  }

  return (
    <>
      <div className="w-full px-8 pt-5 small:px-14">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div className="flex justify-between border-b w-full py-6 px-8 small:px-14 items-center">
        <div className="flex flex-col items-start">
          <Text className="text-ui-fg-muted">Arama sonuçları:</Text>
          <Heading>
            {decodedQuery} ({ids.length})
          </Heading>
        </div>
        <LocalizedClientLink
          href="/store"
          className="txt-medium text-ui-fg-subtle hover:text-ui-fg-base"
        >
          Temizle
        </LocalizedClientLink>
      </div>
      <div className="flex flex-col p-3 small:flex-row small:items-start small:p-6">
        {ids.length > 0 ? (
          <>
            <RefinementList sortBy={effectiveSortBy} search />
            <div className="content-container">
              <PaginatedProducts
                productsIds={ids}
                sortBy={effectiveSortBy}
                page={pageNumber}
                countryCode={countryCode}
                productImageFit={listingSettings.product_image_fit}
                productImageHeightPercent={
                  listingSettings.product_image_height_percent
                }
                productImageAreaHeightPercent={
                  listingSettings.product_image_area_height_percent
                }
                preserveProductOrder={effectiveSortBy === "relevance"}
              />
            </div>
          </>
        ) : (
          <Text className="ml-8 small:ml-14 mt-3">Sonuç bulunamadı.</Text>
        )}
      </div>
    </>
  )
}

export default SearchResultsTemplate
