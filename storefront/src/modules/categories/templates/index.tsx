import { T } from "@lib/i18n/client"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getProductListingSettings } from "@lib/data/product-listing-settings"
import { getCategorySeo } from "@lib/util/category-seo"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import CategoryLinks from "@modules/categories/components/category-links"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ListingHeading from "@modules/store/components/listing-heading"
import EditorialListingHeading from "@modules/store/components/editorial-listing-heading"
import PerformanceListingShell from "@modules/store/components/performance-listing-shell"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default async function CategoryTemplate({
  categories,
  sortBy,
  page,
  countryCode,
  period,
}: {
  categories: HttpTypes.StoreProductCategory[]
  sortBy?: SortOptions
  page?: string
  countryCode: string
  period?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const listingSettings = await getProductListingSettings()
  const isCharlotteStyle = listingSettings.layout_style === "charlotte"
  const isTechnicalStyle = listingSettings.layout_style === "technical"
  const category = categories[categories.length - 1]

  if (!category || !countryCode) notFound()

  const seo = getCategorySeo(categories)
  const breadcrumbItems = [
    { label: "Ana sayfa", href: "/" },
    ...categories.map((item, index) => ({
      label: item.name,
      href:
        index < categories.length - 1
          ? `/kategori/${categories
              .slice(0, index + 1)
              .map((parent) => parent.handle)
              .join("/")}`
          : undefined,
    })),
  ]

  if (listingSettings.site_theme === "performance") {
    return (
      <PerformanceListingShell
        compactMobileSelection={Boolean(category.category_children?.length)}
        breadcrumbItems={breadcrumbItems}
        heroTitle={seo.title}
        heroDescription={seo.description}
        bannerEnabled={listingSettings.performance_banner_enabled}
        bannerImageUrl={listingSettings.performance_banner_image_url}
        bannerTitle={seo.title}
        bannerDescription={seo.description}
        bannerHeightDesktop={listingSettings.performance_banner_height_desktop}
        bannerHeightMobile={listingSettings.performance_banner_height_mobile}
        seoTitle={pageNumber === 1 ? seo.title : null}
        seoContent={pageNumber === 1 ? seo.content : null}
      >
        <CategoryLinks categories={categories} />
        <Suspense fallback={<SkeletonProductGrid variant="performance" />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            categoryHandle={category.handle}
            period={period}
            countryCode={countryCode}
            displayStyle="performance"
            performanceTitle={seo.title}
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
          title={seo.title}
          description={seo.description}
          sort={sort}
        />
        <CategoryLinks categories={categories} />
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            categoryHandle={category.handle}
            period={period}
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

  if (isTechnicalStyle || isCharlotteStyle) {
    const variant = isTechnicalStyle ? "technical" : undefined
    return (
      <main
        className={
          isTechnicalStyle
            ? "w-full bg-[#f1f1f1] px-3 pb-16 pt-5 small:px-[4%] small:pt-7"
            : "w-full px-3 pb-12 pt-6 xsmall:px-4 small:px-6 small:pb-16 small:pt-7"
        }
        data-testid="category-container"
      >
        <div className={isTechnicalStyle ? "mx-auto max-w-[1500px]" : ""}>
          <Breadcrumbs
            items={breadcrumbItems}
            variant={variant}
            className="mb-4"
          />
          <ListingHeading
            title={seo.title}
            eyebrow={listingSettings.eyebrow}
            description={seo.description}
            sort={sort}
            category={category}
            showLinks={false}
          />
          <CategoryLinks categories={categories} />
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              categoryHandle={category.handle}
              period={period}
              countryCode={countryCode}
              displayStyle={isTechnicalStyle ? "technical" : "charlotte"}
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

  return (
    <div
      className="w-full px-[3%] py-6 small:px-[5%]"
      data-testid="category-container"
    >
      <Breadcrumbs items={breadcrumbItems} className="mb-6" />
      <div className="mb-8 flex items-center justify-between gap-x-4 text-2xl-semi">
        <h1 data-testid="category-page-title">
          <T>{seo.title}</T>
        </h1>
        <RefinementList sortBy={sort} data-testid="sort-by-container" />
      </div>
      <div className="mb-8 text-base-regular">
        <p>
          <T>{seo.description}</T>
        </p>
      </div>
      <CategoryLinks categories={categories} />
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={category.id}
          categoryHandle={category.handle}
          period={period}
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
