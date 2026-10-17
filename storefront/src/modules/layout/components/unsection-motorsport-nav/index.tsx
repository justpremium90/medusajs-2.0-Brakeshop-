import { Suspense } from "react"
import type { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import HeaderFrame from "@modules/layout/components/motorsport-header-frame"
import SideMenu from "@modules/layout/components/side-menu"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"

export default function GardenNav({ regions }: { regions: StoreRegion[] }) {
  const items = GARDEN_CATEGORIES.map((c) => ({ ...c }))
  return (
    <HeaderFrame>
      <header className="border-b border-white/20 bg-black/35 text-white backdrop-blur-sm">
        <div className="mx-auto flex h-[76px] max-w-[1800px] items-center gap-5 px-4 small:px-8 large:px-12">
          <div className="small:hidden">
            <SideMenu regions={regions} items={items} tone="inverse" />
          </div>
          <LocalizedClientLink
            href="/"
            aria-label="Pip Garden ana sayfa"
            className="mr-auto text-[28px] font-bold uppercase tracking-[-.06em] small:text-[34px]"
          >
            PIP<span className="font-normal tracking-[-.04em]">GARDEN</span>
            <span className="ml-1 text-[#e3262e]">.</span>
          </LocalizedClientLink>
          <nav
            aria-label="Ana menü"
            className="hidden items-center gap-7 text-[11px] font-semibold uppercase tracking-[.12em] small:flex"
          >
            <LocalizedClientLink href="/store">Koleksiyon</LocalizedClientLink>
            <LocalizedClientLink href="/about">
              Pip Garden hakkında
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact">İletişim</LocalizedClientLink>
          </nav>
          <LocalizedClientLink
            href="/search"
            aria-label="Ürün ara"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-current"
            >
              <circle cx="10" cy="10" r="6" strokeWidth="1.5" />
              <path d="m15 15 5 5" strokeWidth="1.5" />
            </svg>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/account"
            className="hidden text-xs small:block"
          >
            Hesabım
          </LocalizedClientLink>
          <div className="flex h-10 min-w-11 items-stretch rounded-full bg-[#e3262e]">
            <Suspense
              fallback={
                <LocalizedClientLink href="/cart" className="px-3 py-2 text-xs">
                  Sepet
                </LocalizedClientLink>
              }
            >
              <CartButton tone="inverse" />
            </Suspense>
          </div>
        </div>
        <nav
          aria-label="Ürün kategorileri"
          className="flex gap-7 overflow-x-auto border-t border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[.08em] small:justify-center small:px-8"
        >
          {items.map((c) => (
            <LocalizedClientLink
              key={c.handle}
              href={c.href}
              className="shrink-0 py-1 text-white/85 transition-colors hover:text-white"
            >
              {c.label}
            </LocalizedClientLink>
          ))}
        </nav>
      </header>
    </HeaderFrame>
  )
}
