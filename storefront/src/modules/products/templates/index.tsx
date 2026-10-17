import React, { Suspense } from "react"
import BrandLogo from "@modules/products/components/product-preview/brand-logo"
import { getProductBrandName } from "@lib/util/product-brand"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { getProductListingSettings } from "@lib/data/product-listing-settings"
import { getProductBreadcrumbItems } from "@lib/util/product-breadcrumbs"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import OriginalityGuaranteeBanner from "@modules/products/components/originality-guarantee-banner"
import DiscountCodeBanner from "@modules/products/components/discount-code-banner"
import { isQuoteProduct } from "@lib/util/quote-product"
import QuoteProductTemplate from "./quote-product"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const magicItems = [
  "Aracınıza uygun fren diski ve balatasını teknik ölçülerle karşılaştırın",
  "Parça kodu, aks konumu ve ürün özelliklerini siparişten önce doğrulayın",
  "Güvenilir üreticilerin fren ürünlerini tek katalogda inceleyin",
  "Doğru parçayı seçmek için marka, model ve kasa bilgilerini kullanın",
]

const MagicIcon = ({ index }: { index: number }) => {
  const icons = [
    <path key="sparkle" d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm9 11 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />,
    <path key="home" d="M4 11.5 12 4l8 7.5M6.5 10v9h11v-9M10 19v-5h4v5" />,
    <path key="gift" d="M4.5 9h15v10h-15V9Zm7.5 0v10M4.5 13h15M8 9C6.5 8.2 6 7.3 6.5 6.4 7.2 5.2 9.2 5.9 12 9c2.8-3.1 4.8-3.8 5.5-2.6.5.9 0 1.8-1.5 2.6" />,
    <path key="heart" d="M12 21S4 16.2 4 9.8C4 7.3 5.8 5.5 8.1 5.5c1.6 0 3 .9 3.9 2.2.9-1.3 2.3-2.2 3.9-2.2 2.3 0 4.1 1.8 4.1 4.3C20 16.2 12 21 12 21Z" />,
  ]

  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 h-7 w-7 shrink-0 stroke-[1.5]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {icons[index]}
    </svg>
  )
}

const OriginalProductIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="h-8 w-8 stroke-[1.7]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        d="M12 3.5 19 6v5.4c0 4.3-2.8 7.9-7 9.1-4.2-1.2-7-4.8-7-9.1V6l7-2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m8.8 12 2.1 2.1 4.4-4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const EditorialProductTemplate = ({
  product,
  region,
  countryCode,
}: ProductTemplateProps) => {
  const description =
    product.description ||
    "Aracınızın fren sistemi için seçilmiş, teknik uyumluluk ve güvenilir performans odağındaki BrakeShop ürünü."
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const breadcrumbItems = getProductBreadcrumbItems(product)
  const facts = [
    ["Ürün tipi", product.type?.value || "Fren sistemi parçası"],
    ["Koleksiyon", product.collection?.title || "BrakeShop seçkisi"],
    ["Parça kodu", String(metadata.part_number || metadata.sku || product.handle || "—")],
    ["Durum", "Satışta"],
  ]

  return (
    <main className="bg-[#f3efe8] text-[#1d1a17]" data-testid="product-container">
      <div className="px-4 pt-4 small:px-[5%]">
        <Breadcrumbs
          items={breadcrumbItems}
          variant="editorial"
          className="mb-4"
        />
        <div className="flex items-center justify-between border-y border-[#1d1a17] py-2 text-[9px] font-bold uppercase tracking-[0.18em] small:text-[11px]">
          <span>BrakeShop Journal</span>
          <span className="text-[#d1492e]">Ürün dosyası</span>
          <span className="hidden small:block">Teknik seçki / Güncel</span>
        </div>
      </div>

      <div className="grid gap-8 px-4 py-7 small:grid-cols-12 small:gap-0 small:px-[5%] small:py-10">
        <div className="min-w-0 small:col-span-7 small:border-r small:border-[#1d1a17] small:pr-8">
          <ImageGallery images={product.images || []} productTitle={product.title} />
        </div>

        <aside className="small:col-span-5 small:pl-8">
          <div className="small:sticky small:top-32">
            <div className="flex items-center justify-between border-b-2 border-[#1d1a17] pb-3 text-[10px] font-bold uppercase tracking-[0.16em]">
              <span className="text-[#d1492e]">{product.type?.value || "Fren sistemleri"}</span>
              <span>Dosya no. {product.id.slice(-6).toUpperCase()}</span>
            </div>
            <div className="mt-4">
              <BrandLogo name={getProductBrandName(product)} kind="product" />
            </div>
            <h1
              className="mt-5 text-[43px] font-normal leading-[0.94] tracking-[-0.05em] small:text-[56px] medium:text-[68px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              data-testid="product-title"
            >
              {product.title}
            </h1>
            <p className="mt-5 border-l-2 border-[#d1492e] pl-4 text-[14px] leading-[1.6] text-[#57524c]">
              {description}
            </p>

            <div className="mt-7 border-y border-[#1d1a17] py-5">
              <ProductOnboardingCta />
              <Suspense
                fallback={<ProductActions disabled product={product} region={region} />}
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            <dl className="mt-6 grid grid-cols-2 border-t border-[#1d1a17]">
              {facts.map(([label, value]) => (
                <div key={label} className="border-b border-[#aaa198] py-4 odd:pr-4 even:border-l even:pl-4">
                  <dt className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#6b655e]">{label}</dt>
                  <dd className="mt-1 text-[13px] leading-[1.4]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center gap-4 border border-[#1d1a17] p-4">
              <OriginalProductIcon />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em]">Orijinallik taahhüdü</p>
                <p className="mt-1 text-[12px] text-[#625d57]">%100 orijinal ürün ve güvenli alışveriş.</p>
              </div>
            </div>

            <div className="mt-7 border-t-2 border-[#1d1a17] pt-2">
              <ProductTabs product={product} />
            </div>
          </div>
        </aside>
      </div>

      <section className="border-t-2 border-[#1d1a17] px-4 py-12 small:px-[5%] small:py-20" data-testid="related-products-container">
        <div className="mb-8 flex items-end justify-between gap-5 border-b border-[#1d1a17] pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d1492e]">Sonraki dosya</p>
            <h2 className="mt-2 text-[38px] leading-none tracking-[-0.04em] small:text-[58px]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Benzer parçalar
            </h2>
          </div>
          <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] small:block">BrakeShop seçkisi</span>
        </div>
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </section>
    </main>
  )
}

const ProductTemplate = async ({
  product,
  region,
  countryCode,
}: ProductTemplateProps) => {
  if (!product || !product.id) {
    return notFound()
  }

  if (isQuoteProduct(product)) return <QuoteProductTemplate product={product} />

  const listingSettings = await getProductListingSettings()

  if (listingSettings.site_theme === "editorial") {
    return (
      <EditorialProductTemplate
        product={product}
        region={region}
        countryCode={countryCode}
      />
    )
  }

  const description =
    product.description ||
    "Aracınıza uygun fren diski ve fren balatasını teknik özellikleriyle inceleyin."
  const breadcrumbItems = getProductBreadcrumbItems(product)

  return (
    <>
      <div className="px-4 pt-3 small:px-[5%] small:pt-5 large:px-[13%]">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div
        className="mx-auto flex w-full flex-col px-0 pb-10 pt-4 small:grid small:grid-cols-[minmax(0,1fr)_320px] small:items-start small:gap-x-8 small:px-[4%] small:pb-32 small:pt-[10px] medium:grid-cols-[minmax(0,1fr)_340px] medium:gap-x-10 medium:px-[5%] large:grid-cols-[minmax(0,1fr)_390px] large:gap-x-12 large:px-[13%]"
        style={{
          fontFamily:
            '"Helvetica Neue LT Std", "Avenir light", Helvetica, Arial, sans-serif',
        }}
        data-testid="product-container"
      >
        <ProductInfo
          product={product}
          id="product-info"
          className="mb-4 px-4 small:hidden"
        />

        <div className="w-full min-w-0">
          <ImageGallery images={product?.images || []} productTitle={product.title} />
        </div>

        <aside className="flex w-full flex-col gap-y-5 px-4 pt-5 small:sticky small:top-40 small:max-w-[320px] small:shrink-0 small:gap-y-6 small:px-0 small:pt-0 medium:max-w-[340px] large:max-w-[390px]">
          <ProductInfo
            product={product}
            id="desktop-product-info"
            className="hidden small:block"
          />
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <div className="flex flex-col gap-3">
            <OriginalityGuaranteeBanner />
            {process.env.NEXT_PUBLIC_BRAKESHOP_BANK_DISCOUNT_ENABLED === "true" && <DiscountCodeBanner />}
          </div>

          <div className="max-w-[390px] text-[16px] leading-5 text-[#5a2424]">
            <p>{description}</p>
            <a href="#product-info" className="mt-1 inline-block underline underline-offset-2">
              Ürün detayları
            </a>
          </div>

          <section className="text-[#3a080a]">
            <h2 className="text-[25px] font-semibold uppercase leading-8 tracking-[0.02em]">
              Brakeshop güvencesini keşfedin
            </h2>
            <div className="mt-5 flex flex-col gap-y-4 text-[18px] leading-[22px] text-[#5a2424]">
              {magicItems.map((item, index) => (
                <div key={item} className="flex items-start gap-x-4">
                  <MagicIcon index={index} />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </section>

          <ProductTabs product={product} />
        </aside>
      </div>
      <div
        className="mx-auto my-16 w-full max-w-[1440px] px-[2%] small:my-24 small:px-[5%] small:pb-28"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
