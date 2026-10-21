import LanguageSelector from "@lib/i18n/language-selector"
import { T, I18nElement } from "@lib/i18n/client"
import { Suspense } from "react"
import type { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import HeaderFrame from "@modules/layout/components/motorsport-header-frame"
import SideMenu from "@modules/layout/components/side-menu"
import CollectionMenu from "./collection-menu"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"
import "./garden-header.css"

const BagIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path d="M5 7.5h14L20 21H4L5 7.5Z" />
    <path d="M8.5 9V6a3.5 3.5 0 0 1 7 0v3" />
  </svg>
)

export default function GardenNav({ regions }: { regions: StoreRegion[] }) {
  return (
    <HeaderFrame>
      <header className="garden-header">
        <div className="garden-header-main">
          <div className="garden-header-mobile-menu">
            <SideMenu
              regions={regions}
              items={[...GARDEN_CATEGORIES]}
              tone="inverse"
            />
          </div>
          <LocalizedClientLink
            href="/"
            aria-label="Pip Garden ana sayfa"
            className="garden-header-logo"
          >
            <T>PIP</T>
            <span>
              <T>GARDEN</T>
            </span>
            <span className="garden-header-dot">.</span>
          </LocalizedClientLink>
          <I18nElement
            as="nav"
            aria-label="Ana menü"
            className="garden-header-nav"
          >
            <CollectionMenu />
            <LocalizedClientLink href="/about">
              <T>Hakkımızda</T>
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact">
              <T>İletişim</T>
            </LocalizedClientLink>
          </I18nElement>
          <div className="garden-header-tools">
            <LanguageSelector />
            <LocalizedClientLink
              href="/search"
              aria-label="Ürün ara"
              className="garden-header-icon"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="10.5" cy="10.5" r="6.2" />
                <path d="m15 15 5.5 5.5" />
              </svg>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account"
              aria-label="Hesabım"
              className="garden-header-icon garden-header-account"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <circle cx="12" cy="7.5" r="3.5" />
                <path d="M5 21v-1.5a7 7 0 0 1 14 0V21" />
              </svg>
            </LocalizedClientLink>
            <div className="garden-header-cart">
              <Suspense
                fallback={
                  <LocalizedClientLink
                    href="/cart"
                    aria-label="Sepet"
                    className="garden-header-icon"
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
      </header>
    </HeaderFrame>
  )
}
