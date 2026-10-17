import { cache } from "react"

export type ProductListingStyle = "default" | "charlotte" | "technical"
export type ProductImageFit = "contain" | "cover"
export type SiteTheme = "legacy" | "editorial" | "performance"

export type ProductListingSettings = {
  site_theme: SiteTheme
  layout_style: ProductListingStyle
  eyebrow: string | null
  description: string | null
  product_image_fit: ProductImageFit
  product_image_height_percent: number
  product_image_area_height_percent: number
  show_category_links: boolean
  show_mobile_product_actions: boolean
  home_below_hero_lazy_enabled: boolean
  performance_banner_enabled: boolean
  performance_banner_image_url: string | null
  performance_banner_title: string | null
  performance_banner_description: string | null
  performance_banner_height_desktop: number
  performance_banner_height_mobile: number
  performance_seo_title: string | null
  performance_seo_content: string | null
}

const fallbackSettings: ProductListingSettings = {
  site_theme: "performance",
  layout_style: "default",
  eyebrow: "BrakeShop",
  description:
    "Aracınız için doğru fren parçalarını, teknik bilgileri ve güncel ürün seçeneklerini keşfedin.",
  product_image_fit: "contain",
  product_image_height_percent: 100,
  product_image_area_height_percent: 100,
  show_category_links: true,
  show_mobile_product_actions: false,
  home_below_hero_lazy_enabled: true,
  performance_banner_enabled: true,
  performance_banner_image_url: null,
  performance_banner_title: null,
  performance_banner_description:
    "Güvenli duruş, yüksek performans ve aracınız için doğru parça seçimi.",
  performance_banner_height_desktop: 240,
  performance_banner_height_mobile: 170,
  performance_seo_title: null,
  performance_seo_content: null,
}

const getBackendUrl = () => {
  return (
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"
  )
}

const getHeaders = () => {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  return publishableKey
    ? {
        "x-publishable-api-key": publishableKey,
      }
    : undefined
}

export const getProductListingSettings = cache(
  async (): Promise<ProductListingSettings> => {
    try {
      const response = await fetch(
        `${getBackendUrl()}/store/product-listing-settings`,
        {
          headers: getHeaders(),
          next: {
            revalidate: 60,
            tags: ["product-listing-settings"],
          },
        }
      )

      if (!response.ok) {
        return fallbackSettings
      }

      const data = (await response.json()) as {
        settings?: Partial<ProductListingSettings>
      }

      return {
        ...fallbackSettings,
        ...data.settings,
        site_theme:
          data.settings?.site_theme === "editorial" ||
          data.settings?.site_theme === "performance"
            ? data.settings.site_theme
            : "legacy",
        layout_style:
          data.settings?.layout_style === "charlotte" ||
          data.settings?.layout_style === "technical"
            ? data.settings.layout_style
            : "default",
        product_image_fit:
          data.settings?.product_image_fit === "cover" ? "cover" : "contain",
        product_image_height_percent:
          typeof data.settings?.product_image_height_percent === "number"
            ? Math.min(
                100,
                Math.max(40, data.settings.product_image_height_percent)
              )
            : fallbackSettings.product_image_height_percent,
        product_image_area_height_percent:
          typeof data.settings?.product_image_area_height_percent === "number"
            ? Math.min(
                120,
                Math.max(40, data.settings.product_image_area_height_percent)
              )
            : fallbackSettings.product_image_area_height_percent,
        show_mobile_product_actions:
          typeof data.settings?.show_mobile_product_actions === "boolean"
            ? data.settings.show_mobile_product_actions
            : fallbackSettings.show_mobile_product_actions,
        home_below_hero_lazy_enabled:
          typeof data.settings?.home_below_hero_lazy_enabled === "boolean"
            ? data.settings.home_below_hero_lazy_enabled
            : fallbackSettings.home_below_hero_lazy_enabled,
        performance_banner_enabled:
          typeof data.settings?.performance_banner_enabled === "boolean"
            ? data.settings.performance_banner_enabled
            : fallbackSettings.performance_banner_enabled,
        performance_banner_height_desktop:
          typeof data.settings?.performance_banner_height_desktop === "number"
            ? Math.min(
                480,
                Math.max(160, data.settings.performance_banner_height_desktop)
              )
            : fallbackSettings.performance_banner_height_desktop,
        performance_banner_height_mobile:
          typeof data.settings?.performance_banner_height_mobile === "number"
            ? Math.min(
                320,
                Math.max(120, data.settings.performance_banner_height_mobile)
              )
            : fallbackSettings.performance_banner_height_mobile,
      }
    } catch (error) {
      return fallbackSettings
    }
  }
)
