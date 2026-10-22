import { T, I18nElement } from "@lib/i18n/client"
import type { CSSProperties, ReactNode } from "react"

import type { BreadcrumbItem } from "@lib/util/product-breadcrumbs"
import Breadcrumbs from "@modules/common/components/breadcrumbs"
import PerformanceSeoContent from "@modules/store/components/performance-seo-content"

type PerformanceListingShellProps = {
  breadcrumbItems: BreadcrumbItem[]
  heroTitle: string
  heroDescription?: string | null
  bannerEnabled?: boolean
  bannerImageUrl?: string | null
  bannerTitle?: string | null
  bannerDescription?: string | null
  bannerHeightDesktop?: number
  bannerHeightMobile?: number
  seoTitle?: string | null
  seoContent?: string | null
  children: ReactNode
  compactMobileSelection?: boolean
  showTrustItems?: boolean
}

const trustItems = [
  {
    label: "Orijinal Ürün",
    path: "M12 3 4.5 6v5.2c0 4.5 3 8.6 7.5 9.8 4.5-1.2 7.5-5.3 7.5-9.8V6L12 3Zm-3 9 2 2 4-4",
  },
  {
    label: "Güvenli Ödeme",
    path: "M5 10h14v10H5V10Zm3 0V7a4 4 0 0 1 8 0v3",
  },
  {
    label: "Aynı Gün Kargo",
    path: "M3 6h11v11H3V6Zm11 4h4l3 3v4h-7v-7ZM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  },
  {
    label: "Kolay İade",
    path: "M8 7H4v-4M4.5 7A8 8 0 1 1 4 15m5-4-3 3 3 3",
  },
]

const PerformanceListingShell = ({
  breadcrumbItems,
  heroTitle,
  heroDescription,
  bannerEnabled = true,
  bannerImageUrl,
  bannerTitle,
  bannerDescription,
  bannerHeightDesktop = 240,
  bannerHeightMobile = 170,
  seoTitle,
  seoContent,
  children,
  compactMobileSelection = false,
  showTrustItems = false,
}: PerformanceListingShellProps) => {
  const bannerStyle = {
    "--listing-banner-height-mobile": `${bannerHeightMobile}px`,
    "--listing-banner-height-desktop": `${bannerHeightDesktop}px`,
  } as CSSProperties

  return (
    <main
      className="garden-listing"
      data-testid="category-container"
    >
      <div className="garden-collection-width pt-6">
        <Breadcrumbs
          items={breadcrumbItems}
          variant="performance"
          className={`${
            compactMobileSelection ? "mb-2 max-[1023px]:!pb-0" : "mb-4"
          } border-0 pb-0 small:mb-5`}
        />
      </div>

      <div className="garden-collection-width pb-20">
        <div
          className={`${compactMobileSelection ? "pt-0" : "pt-2"} small:pt-3`}
        >
          {children}
        </div>
      </div>

      {bannerEnabled ? (
        <I18nElement
          as="section"
          className="relative isolate flex min-h-[var(--listing-banner-height-mobile)] w-full overflow-hidden bg-[#151515] text-white small:min-h-[var(--listing-banner-height-desktop)] small:items-end"
          style={bannerStyle}
          aria-label={bannerTitle || heroTitle}
        >
          {bannerImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <I18nElement
              as="img"
              src={bannerImageUrl}
              alt=""
              className="absolute inset-0 -z-20 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <>
              <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_46%,rgba(255,255,255,.16)_0,rgba(255,255,255,.035)_17%,transparent_18%),radial-gradient(circle_at_78%_46%,transparent_0,transparent_30%,rgba(196,32,38,.65)_31%,transparent_32%),linear-gradient(110deg,#0c0c0c_0%,#202020_58%,#101010_100%)]" />
              <div className="absolute -right-[8%] top-1/2 -z-10 aspect-square w-[52%] -translate-y-1/2 rounded-full border-[18px] border-white/[0.08] shadow-[0_0_0_34px_rgba(255,255,255,.025),inset_0_0_36px_rgba(0,0,0,.75)] small:border-[30px]" />
            </>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
          <div className="mx-auto flex min-h-[var(--listing-banner-height-mobile)] w-full max-w-[1480px] items-end px-4 py-6 xsmall:px-6 small:min-h-[var(--listing-banner-height-desktop)] small:px-8 small:py-9 large:px-12 xlarge:px-16">
            <div className="max-w-[720px]">
              <span className="mb-3 block h-[3px] w-10 bg-[#c42026]" />
              <h2 className="text-[26px] font-semibold leading-[1.08] tracking-[-0.025em] small:text-[36px]">
                <T>{bannerTitle || heroTitle}</T>
              </h2>
              <p className="mt-3 max-w-[560px] text-[13px] leading-5 text-white/75 small:text-[15px] small:leading-6">
                <T>
                  {bannerDescription ||
                    heroDescription ||
                    "Bahçede, terasta, balkonda. Dışarıda yaşam için Pip Garden."}
                </T>
              </p>
              {seoContent?.trim() ? (
                <PerformanceSeoContent
                  title={seoTitle}
                  content={seoContent.trim()}
                  variant="banner"
                />
              ) : null}
            </div>
          </div>
        </I18nElement>
      ) : null}

      {showTrustItems && (
        <div className="mx-auto max-w-[1480px] px-3 pb-16 xsmall:px-6 small:px-8 small:pb-20 large:px-12 xlarge:px-16">
          <I18nElement
            as="section"
            aria-label="Alışveriş güvenceleri"
            className="grid grid-cols-2 border-b border-[#e5e5e5] py-3 small:grid-cols-4 small:py-4"
          >
            {trustItems.map((item, index) => (
              <div
                key={item.label}
                className={`flex min-h-10 items-center justify-center gap-2 px-2 text-[11px] font-medium text-[#404040] xsmall:text-[12px] small:gap-3 small:text-[13px] ${
                  index % 2 ? "border-l border-[#e5e5e5]" : ""
                } ${
                  index > 1 ? "border-t border-[#e5e5e5] small:border-t-0" : ""
                } ${index > 0 ? "small:border-l" : ""}`}
              >
                <svg
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0 fill-none stroke-[#c42026] stroke-[1.6]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.path} />
                </svg>
                <span>
                  <T>{item.label}</T>
                </span>
              </div>
            ))}
          </I18nElement>
        </div>
      )}
    </main>
  )
}

export default PerformanceListingShell
