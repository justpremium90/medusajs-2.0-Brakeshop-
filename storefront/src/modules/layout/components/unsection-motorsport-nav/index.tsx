import { Suspense } from "react"
import type { CSSProperties } from "react"
import type { StoreRegion } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MotorsportHeaderFrame from "@modules/layout/components/motorsport-header-frame"
import MotorsportMegaMenu from "@modules/layout/components/motorsport-mega-menu"
import SideMenu from "@modules/layout/components/side-menu"
import VehicleBrandRail from "./vehicle-brand-rail"
import HeaderBackgroundVideo from "@modules/layout/components/header-background-video"
import { getImageVariant } from "@lib/util/performance-media"

type NavItem = {
  label: string
  href: string
  children?: Array<{ label: string; href: string }>
}
type HeaderAppearance = {
  header_background_color: string
  brand_bar_background_color: string
  header_video_url: string
  brand_bar_video_url: string
  header_overlay_opacity: number
  brand_bar_overlay_opacity: number
}
type Props = {
  regions: StoreRegion[]
  items: NavItem[]
  logoUrl?: string | null
  logoAlt?: string | null
  navigationMode?: "horizontal" | "hamburger"
  appearance?: HeaderAppearance
}

const navFont: CSSProperties = {
  fontFamily:
    '"Helvetica Neue LT Condensed", "Arial Narrow", Helvetica, Arial, sans-serif',
  fontStretch: "condensed",
}
const categoryLinks = [
  { label: "Fren Diskleri", href: "/fren-diskleri" },
  { label: "Fren Balataları", href: "/fren-balatalari" },
  { label: "Tüm Ürünler", href: "/magaza" },
]
const brandLogo = (slug: string) => `/images/vehicle-brands/${slug}.svg`
const vehicleBrandLinks = [
  { label: "BMW", href: "/categories/bmw-yedek-parca", logo: brandLogo("bmw") },
  {
    label: "Mercedes-Benz",
    href: "/categories/mercedes-yedek-parca",
    logo: brandLogo("mercedes"),
  },
  {
    label: "Opel",
    href: "/categories/opel-yedek-parca",
    logo: brandLogo("opel"),
  },
  {
    label: "Volkswagen",
    href: "/categories/volkswagen-yedek-parca",
    logo: brandLogo("volkswagen"),
  },
  {
    label: "Audi",
    href: "/categories/audi-yedek-parca",
    logo: brandLogo("audi"),
  },
  {
    label: "Peugeot",
    href: "/categories/peugeot-yedek-parca",
    logo: brandLogo("peugeot"),
  },
  {
    label: "Renault",
    href: "/categories/renault-yedek-parca",
    logo: brandLogo("renault"),
  },
  {
    label: "Ford",
    href: "/categories/ford-yedek-parca",
    logo: brandLogo("ford"),
  },
  {
    label: "Citroën",
    href: "/categories/citroen-yedek-parca",
    logo: brandLogo("citroen"),
  },
  {
    label: "Toyota",
    href: "/categories/toyota-yedek-parca",
    logo: brandLogo("toyota"),
  },
  {
    label: "Land Rover",
    href: "/categories/land-rover-yedek-parca",
    logo: brandLogo("landrover"),
  },
  {
    label: "Hyundai",
    href: "/categories/hyundai-yedek-parca",
    logo: brandLogo("hyundai"),
  },
  { label: "Kia", href: "/categories/kia-yedek-parca", logo: brandLogo("kia") },
  {
    label: "Honda",
    href: "/categories/honda-yedek-parca",
    logo: brandLogo("honda"),
  },
  {
    label: "Chevrolet",
    href: "/categories/chevrolet-yedek-parca",
    logo: brandLogo("chevrolet"),
  },
  {
    label: "Fiat",
    href: "/categories/fiat-yedek-parca",
    logo: brandLogo("fiat"),
  },
  {
    label: "Škoda",
    href: "/categories/skoda-yedek-parca",
    logo: brandLogo("skoda"),
  },
  {
    label: "Seat",
    href: "/categories/seat-yedek-parca",
    logo: brandLogo("seat"),
  },
  {
    label: "Nissan",
    href: "/categories/nissan-yedek-parca",
    logo: brandLogo("nissan"),
  },
  {
    label: "Porsche",
    href: "/categories/porsche-yedek-parca",
    logo: brandLogo("porsche"),
  },
  {
    label: "Mazda",
    href: "/categories/mazda-yedek-parca",
    logo: brandLogo("mazda"),
  },
  {
    label: "Mini",
    href: "/categories/mini-yedek-parca",
    logo: brandLogo("mini"),
  },
  {
    label: "Dacia",
    href: "/categories/dacia-yedek-parca",
    logo: brandLogo("dacia"),
  },
  {
    label: "Jeep",
    href: "/categories/jeep-yedek-parca",
    logo: brandLogo("jeep"),
  },
  {
    label: "Mitsubishi",
    href: "/categories/mitsubishi-yedek-parca",
    logo: brandLogo("mitsubishi"),
  },
  {
    label: "Subaru",
    href: "/categories/subaru-yedek-parca",
    logo: brandLogo("subaru"),
  },
  {
    label: "Suzuki",
    href: "/categories/suzuki-yedek-parca",
    logo: brandLogo("suzuki"),
  },
  {
    label: "Alfa Romeo",
    href: "/categories/alfa-romeo-yedek-parca",
    logo: brandLogo("alfa-romeo"),
  },
  {
    label: "Jaguar",
    href: "/categories/jaguar-yedek-parca",
    logo: brandLogo("jaguar"),
  },
  {
    label: "Lexus",
    href: "/categories/lexus-yedek-parca",
    logo: brandLogo("lexus"),
  },
  {
    label: "Infiniti",
    href: "/categories/infiniti-yedek-parca",
    logo: brandLogo("infiniti"),
  },
  {
    label: "Cupra",
    href: "/categories/cupra-yedek-parca",
    logo: brandLogo("seat"),
  },
  {
    label: "DS",
    href: "/categories/ds-yedek-parca",
    logo: brandLogo("dsautomobiles"),
  },
  {
    label: "Smart",
    href: "/categories/smart-yedek-parca",
    logo: brandLogo("smart"),
  },
  {
    label: "Tesla",
    href: "/categories/tesla-yedek-parca",
    logo: brandLogo("tesla"),
  },
  {
    label: "Volvo",
    href: "/categories/volvo-yedek-parca",
    logo: brandLogo("volvo"),
  },
  { label: "BYD", href: "/categories/byd", logo: brandLogo("byd") },
  {
    label: "Aston Martin",
    href: "/categories/aston-martin",
    logo: brandLogo("astonmartin"),
  },
  {
    label: "Maserati",
    href: "/categories/maserati",
    logo: brandLogo("maserati"),
  },
  {
    label: "SsangYong",
    href: "/categories/ssangyong",
    logo: brandLogo("ssangyong"),
  },
  {
    label: "Isuzu",
    href: "/categories/isuzu-yedek-parca",
    logo: brandLogo("isuzu"),
  },
  { label: "Ferrari", href: "/categories/ferrari", logo: brandLogo("ferrari") },
]
const SearchIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-none stroke-current"
  >
    <circle cx="10.5" cy="10.5" r="6.25" strokeWidth="1.7" />
    <path d="m15.2 15.2 5 5" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)
const AccountIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-none stroke-current"
  >
    <circle cx="12" cy="8" r="3.6" strokeWidth="1.6" />
    <path d="M5 20c.7-4 3.1-6 7-6s6.3 2 7 6" strokeWidth="1.6" />
  </svg>
)
const BagIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-none stroke-current"
  >
    <path d="M5.5 8.5h13l.8 12h-14.6l.8-12Z" strokeWidth="1.6" />
    <path d="M8.7 10V6.8a3.3 3.3 0 0 1 6.6 0V10" strokeWidth="1.6" />
  </svg>
)

const LayerMedia = ({
  videoUrl,
  overlay,
}: {
  videoUrl: string
  overlay: number
}) => (
  <>
    {videoUrl ? <HeaderBackgroundVideo src={videoUrl} /> : null}
    {videoUrl ? (
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black motion-reduce:hidden"
        style={{ opacity: overlay / 100 }}
      />
    ) : null}
  </>
)

const UnsectionMotorsportNav = ({
  regions,
  items,
  logoUrl,
  logoAlt,
  navigationMode = "horizontal",
  appearance,
}: Props) => {
  const logo = getImageVariant(logoUrl || "/images/brakeshop-logo.png", 640)
  const utilityItems = items.filter((item) => /servis|blog/i.test(item.label))
  const mobileItems: NavItem[] = [...categoryLinks, ...utilityItems]
  const sharedVideoUrl =
    appearance?.header_video_url || appearance?.brand_bar_video_url || ""
  const sharedOverlay = appearance?.header_video_url
    ? appearance.header_overlay_opacity
    : appearance?.brand_bar_overlay_opacity ?? 0
  const hasSharedVideo = Boolean(appearance && sharedVideoUrl)

  return (
    <MotorsportHeaderFrame>
      <header
        data-unsection-header
        data-unified-header-video={hasSharedVideo ? "true" : undefined}
        className={`text-white [text-shadow:0_1px_18px_rgba(0,0,0,.45)] ${
          appearance
            ? "relative overflow-hidden"
            : "[background:linear-gradient(180deg,rgba(6,7,7,.58),rgba(6,7,7,.14))] small:backdrop-blur-[2px]"
        }`}
        style={
          appearance
            ? {
                ...navFont,
                backgroundColor: appearance.header_background_color,
              }
            : navFont
        }
      >
        {hasSharedVideo ? (
          <LayerMedia videoUrl={sharedVideoUrl} overlay={sharedOverlay} />
        ) : null}
        <div
          className="relative z-10 border-b border-white/15"
          style={
            appearance && !hasSharedVideo
              ? { backgroundColor: appearance.header_background_color }
              : undefined
          }
        >
          <div className="mx-auto flex h-[72px] max-w-[1800px] items-stretch px-4 small:px-6 large:px-10">
            <div className="flex w-11 shrink-0 items-center small:hidden">
              <SideMenu regions={regions} items={mobileItems} tone="inverse" />
            </div>
            <LocalizedClientLink
              href="/"
              aria-label="Brakeshop ana sayfa"
              className="flex min-w-0 flex-1 items-center justify-center small:w-[180px] small:flex-none small:justify-start small:border-r small:border-white/10 small:pr-5 medium:w-[205px] large:w-[220px]"
            >
              <img
                src={logo}
                alt={logoAlt || "Brakeshop"}
                className="h-9 w-[162px] object-contain brightness-0 invert small:h-[38px] small:w-full small:object-left"
              />
            </LocalizedClientLink>
            {navigationMode === "horizontal" ? (
              <nav
                className="ml-2 hidden min-w-0 flex-1 items-stretch small:flex medium:ml-3"
                aria-label="Ana menü"
              >
                <MotorsportMegaMenu variant="unsection" />
                {categoryLinks.map((item, index) => (
                  <LocalizedClientLink
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className={`relative hidden items-center whitespace-nowrap px-3 text-[11px] font-bold uppercase tracking-[.1em] text-white/72 transition-[background-color,color] duration-200 hover:bg-white/[.055] hover:text-white medium:flex large:px-4 large:text-[12px] ${
                      index === 2 ? "medium:hidden xlarge:flex" : ""
                    }`}
                  >
                    {item.label}
                  </LocalizedClientLink>
                ))}
                {utilityItems.map((item) => (
                  <LocalizedClientLink
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="relative flex items-center whitespace-nowrap px-3 text-[11px] font-bold uppercase tracking-[.1em] text-white/72 transition-[background-color,color] duration-200 hover:bg-white/[.055] hover:text-white large:px-4 large:text-[12px]"
                  >
                    {item.label}
                  </LocalizedClientLink>
                ))}
              </nav>
            ) : (
              <div className="ml-5 hidden min-w-0 flex-1 items-center small:flex">
                <SideMenu
                  regions={regions}
                  items={mobileItems}
                  tone="inverse"
                  desktopEnabled
                  compactItems
                />
              </div>
            )}
            <div className="ml-auto flex shrink-0 items-center gap-1.5 small:pl-2 medium:gap-2">
              <LocalizedClientLink
                href="/search"
                aria-label="Parça ara"
                className="group/search flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/15 text-white transition-[background-color,border-color] duration-200 hover:border-white/45 hover:bg-white/10 large:w-[116px] large:justify-start large:px-4"
              >
                <SearchIcon />
                <span className="hidden whitespace-nowrap text-[11px] font-bold uppercase tracking-[.12em] text-white/78 group-hover/search:text-white large:inline">
                  Parça ara
                </span>
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/account"
                aria-label="Hesabım"
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white transition-[background-color,border-color] duration-200 hover:border-white/45 hover:bg-white/10 small:flex"
              >
                <AccountIcon />
              </LocalizedClientLink>
              <div className="flex h-10 w-10 items-stretch overflow-hidden rounded-full bg-[#e3262e] text-white shadow-[0_8px_26px_rgba(170,12,20,.34)] transition-colors hover:bg-[#bd171e] small:w-12">
                <Suspense
                  fallback={
                    <LocalizedClientLink
                      href="/cart"
                      aria-label="Sepet"
                      className="flex h-full w-full items-center justify-center gap-2 px-3"
                    >
                      <BagIcon />
                    </LocalizedClientLink>
                  }
                >
                  <CartButton tone="inverse" />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`relative z-10 border-b border-white/10 ${
            appearance ? "" : "bg-black/[.12]"
          }`}
          style={
            appearance && !hasSharedVideo
              ? { backgroundColor: appearance.brand_bar_background_color }
              : undefined
          }
        >
          <VehicleBrandRail items={vehicleBrandLinks.map(item => ({ ...item, href: `/results/${encodeURIComponent(item.label)}` }))} />
        </div>
      </header>
    </MotorsportHeaderFrame>
  )
}
export default UnsectionMotorsportNav
