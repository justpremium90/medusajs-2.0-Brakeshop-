"use client"

import { T } from "@lib/i18n/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WhatsAppContactButton from "@modules/common/components/whatsapp-contact-button"
import NavSearchForm from "@modules/layout/components/nav-search-form"
import type { HeroSearchStyle } from "@lib/data/site-shell-settings"

const quickSearches = [
  { label: "Fren diskleri", href: "/results/fren%20diski" },
  { label: "Fren balataları", href: "/results/fren%20balatas%C4%B1" },
  { label: "Brembo", href: "/results/brembo" },
]

const whatsappMessage =
  "Merhaba, aracım için doğru fren parçasını seçme konusunda bilgi almak istiyorum."

const DesktopWhatsApp = ({ className = "" }: { className?: string }) => (
  <WhatsAppContactButton
    label="İletişime geç"
    message={whatsappMessage}
    className={`pointer-events-auto hidden h-11 rounded-full border border-white/20 bg-[#25D366] px-5 text-[11px] font-bold uppercase tracking-[.08em] text-white shadow-[0_10px_30px_rgba(0,0,0,.24)] transition hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 small:inline-flex ${className}`}
  />
)

type HeroSearchPanelProps = {
  style?: HeroSearchStyle
}

const HeroSearchPanel = ({ style = "performance" }: HeroSearchPanelProps) => {
  if (style === "minimal") {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 px-4 small:px-8">
        <DesktopWhatsApp className="absolute right-8 top-1/2 -translate-y-1/2" />
        <div className="pointer-events-auto relative mx-auto w-full max-w-[900px]">
          <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[.24em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,.8)] small:mb-4 small:text-[12px]">
            <T>Aracına uygun fren parçasını bul</T>
          </p>
          <NavSearchForm
            hero
            heroStyle="minimal"
            className="flex h-[58px] items-center overflow-hidden bg-white shadow-[0_18px_60px_rgba(0,0,0,.3)] small:h-[66px]"
            inputClassName="h-full min-w-0 flex-1 bg-transparent px-4 text-[16px] font-medium text-[#161819] outline-none placeholder:text-[#777b7d] small:px-5 small:text-[17px]"
          />
        </div>
      </div>
    )
  }

  if (style === "technical") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-[11%] z-20 px-5 small:px-[7vw]">
        <DesktopWhatsApp className="absolute bottom-2 right-8" />
        <div className="pointer-events-auto relative max-w-[940px]">
          <div className="mb-4 flex items-center gap-3 text-white">
            <span className="h-px w-10 bg-[#e31c25]" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[.22em] drop-shadow-[0_2px_8px_rgba(0,0,0,.8)] small:text-[12px]">
              <T>Marka · Model · OEM · Parça kodu</T>
            </p>
          </div>
          <NavSearchForm
            hero
            heroStyle="technical"
            className="flex h-[56px] items-center border-b-2 border-white bg-black/25 py-1 backdrop-blur-sm small:h-[62px]"
            inputClassName="h-full min-w-0 flex-1 bg-transparent px-4 text-[16px] font-medium text-white outline-none placeholder:text-white/70 small:text-[18px]"
          />
        </div>
      </div>
    )
  }

  if (style === "floating") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-[9%] z-20 px-4 small:px-8">
        <DesktopWhatsApp className="absolute right-8 top-1/2 -translate-y-1/2" />
        <div className="pointer-events-auto relative mx-auto w-full max-w-[900px]">
          <NavSearchForm
            hero
            heroStyle="floating"
            className="flex h-[56px] items-center overflow-hidden rounded-full border border-white/70 bg-white/95 shadow-[0_16px_55px_rgba(0,0,0,.32)] backdrop-blur-md small:h-[64px]"
            inputClassName="h-full min-w-0 flex-1 bg-transparent px-3 text-[16px] font-medium text-[#161819] outline-none placeholder:text-[#666a6c] small:px-5 small:text-[16px]"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[68px] z-20 px-4 small:bottom-[78px] small:px-8">
      <DesktopWhatsApp className="absolute right-8 top-6" />
      <div className="pointer-events-auto relative mx-auto w-full max-w-[1120px] border border-white/20 border-l-[4px] border-l-[#e31c25] bg-[#0b0d0e]/85 p-4 shadow-[0_24px_70px_rgba(0,0,0,.38)] backdrop-blur-md small:p-6">
        <div className="flex items-end justify-between gap-6 small:pr-[175px]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#e31c25] small:text-[12px]">
              <T>Fren parçası arama</T>
            </p>
            <h2 className="mt-1 text-[22px] font-semibold leading-tight tracking-[-.01em] text-white small:text-[30px]">
              <T>Doğru parçayı tek aramada bul.</T>
            </h2>
          </div>
          <p className="hidden pb-1 text-right text-[11px] font-semibold uppercase tracking-[.15em] text-white/55 medium:block">
            <T>Marka · Model · OEM · Parça kodu</T>
          </p>
        </div>

        <NavSearchForm
          hero
          heroStyle="performance"
          className="mt-4 flex h-[60px] items-center overflow-hidden bg-white shadow-[0_10px_34px_rgba(0,0,0,.22)] small:h-[68px]"
          inputClassName="h-full min-w-0 flex-1 bg-transparent px-4 text-[16px] font-medium text-[#161819] outline-none placeholder:text-[#777b7d] small:px-5 small:text-[17px]"
        />

        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[.14em] text-white/45">
            <T>Hızlı ara</T>
          </span>
          {quickSearches.map((item) => (
            <LocalizedClientLink
              key={item.label}
              href={item.href}
              className="shrink-0 border border-white/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-white/80 transition-colors hover:border-[#e31c25] hover:bg-[#e31c25] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e31c25]"
            >
              <T>{item.label}</T>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroSearchPanel
