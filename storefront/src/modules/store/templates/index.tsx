import { T } from "@lib/i18n/client"
import { Suspense } from "react"

import { getProductListingSettings } from "@lib/data/product-listing-settings"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ListingHeading from "@modules/store/components/listing-heading"
import EditorialListingHeading from "@modules/store/components/editorial-listing-heading"
import PerformanceListingShell from "@modules/store/components/performance-listing-shell"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const listingSettings = await getProductListingSettings()
  const isCharlotteStyle = listingSettings.layout_style === "charlotte"
  const isTechnicalStyle = listingSettings.layout_style === "technical"
  const breadcrumbItems = [
    { label: "Ana sayfa", href: "/" },
    { label: "Tüm Koleksiyon" },
  ]

  if (listingSettings.site_theme === "performance") {
    return (
      <PerformanceListingShell
        breadcrumbItems={breadcrumbItems}
        heroTitle="Bahçe ve Dış Mekan Mobilyaları"
        heroDescription={listingSettings.description}
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
        <Suspense fallback={<SkeletonProductGrid variant="performance" />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            displayStyle="performance"
            performanceTitle="Tüm ürünler"
          />
        </Suspense>
      </PerformanceListingShell>
    )
  }

  if (listingSettings.site_theme === "editorial") {
    return (
      <main
        className="w-full bg-[#f3efe8] px-4 pb-20 pt-5 small:px-[5%] small:pt-8"
        data-testid="category-container"
      >
        <Breadcrumbs
          items={breadcrumbItems}
          variant="editorial"
          className="mb-5"
        />
        <EditorialListingHeading
          title="Tüm ürünler"
          description={listingSettings.description}
          sort={sort}
        />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            displayStyle="editorial"
            productImageFit={listingSettings.product_image_fit}
            productImageHeightPercent={
              listingSettings.product_image_height_percent
            }
            productImageAreaHeightPercent={
              listingSettings.product_image_area_height_percent
            }
          />
        </Suspense>
      </main>
    )
  }

  if (isTechnicalStyle) {
    return (
      <main
        className="w-full bg-[#f1f1f1] px-3 pb-16 pt-5 small:px-[4%] small:pt-7"
        data-testid="category-container"
      >
        <div className="mx-auto max-w-[1500px]">
          <Breadcrumbs
            items={breadcrumbItems}
            variant="technical"
            className="mb-4"
          />
          <ListingHeading
            title="Tüm ürünler"
            eyebrow={listingSettings.eyebrow}
            description={listingSettings.description}
            sort={sort}
            showLinks={listingSettings.show_category_links}
          />
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              displayStyle="technical"
              productImageFit={listingSettings.product_image_fit}
              productImageHeightPercent={
                listingSettings.product_image_height_percent
              }
              productImageAreaHeightPercent={
                listingSettings.product_image_area_height_percent
              }
            />
          </Suspense>
        </div>
      </main>
    )
  }

  if (isCharlotteStyle) {
    return (
      <div
        className="w-full px-3 pb-12 pt-6 xsmall:px-4 small:px-6 small:pb-16 small:pt-7"
        data-testid="category-container"
      >
        <Breadcrumbs items={breadcrumbItems} className="mb-4" />
        <ListingHeading
          title="Tüm ürünler"
          eyebrow={listingSettings.eyebrow}
          description={listingSettings.description}
          sort={sort}
          showLinks={listingSettings.show_category_links}
        />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            displayStyle="charlotte"
            productImageFit={listingSettings.product_image_fit}
            productImageHeightPercent={
              listingSettings.product_image_height_percent
            }
            productImageAreaHeightPercent={
              listingSettings.product_image_area_height_percent
            }
          />
        </Suspense>
      </div>
    )
  }

  return (
    <div
      className="w-full px-[3%] py-6 small:px-[5%]"
      data-testid="category-container"
    >
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <div className="mb-8 flex items-center justify-between gap-x-4 text-2xl-semi">
        <h1 data-testid="store-page-title">
          <T>Tüm ürünler</T>
        </h1>
        <RefinementList sortBy={sort} />
      </div>
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          productImageFit={listingSettings.product_image_fit}
          productImageHeightPercent={
            listingSettings.product_image_height_percent
          }
          productImageAreaHeightPercent={
            listingSettings.product_image_area_height_percent
          }
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
