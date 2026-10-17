"use client"

import { Popover, Portal, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"
import { Fragment, useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SideMenuItem = {
  label: string
  href: string
  children?: SideMenuItem[]
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  items?: SideMenuItem[]
  tone?: "default" | "inverse"
  desktopEnabled?: boolean
  compactItems?: boolean
}

const fallbackMenuItems: SideMenuItem[] = [...GARDEN_CATEGORIES]

const ChevronIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5 stroke-[1.8]"
    fill="none"
    viewBox="0 0 28 28"
    stroke="currentColor"
  >
    <path
      d="m10.5 6.5 7 7.5-7 7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <circle cx="10.5" cy="10.5" r="6.25" />
    <path d="m15.2 15.2 5 5" strokeLinecap="round" />
  </svg>
)

const AccountIcon = () => (
  <svg
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.7-4 3.1-6 7-6s6.3 2 7 6" />
  </svg>
)

const BodyScrollLock = () => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousOverscroll = document.documentElement.style.overscrollBehavior
    document.body.style.overflow = "hidden"
    document.documentElement.style.overscrollBehavior = "none"

    return () => {
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overscrollBehavior = previousOverscroll
    }
  }, [])

  return null
}

const MenuIcon = () => (
  <svg
    aria-hidden="true"
    className="h-6 w-6 stroke-[1.55] small:h-7 small:w-7"
    fill="none"
    viewBox="0 0 28 28"
    stroke="currentColor"
  >
    <path d="M4 8h20" />
    <path d="M4 14h20" />
    <path d="M4 20h20" />
  </svg>
)

const SideMenu = ({
  items,
  tone = "default",
  desktopEnabled = false,
  compactItems = false,
}: SideMenuProps) => {
  const menuItems = items?.length ? items : fallbackMenuItems
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  return (
    <div className="h-full">
      <div className="flex h-full items-center">
        <Popover className="flex h-full">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  aria-label="Menüyü aç"
                  className={`relative flex h-full items-center transition-colors duration-200 focus:outline-none ${
                    tone === "inverse"
                      ? "text-white hover:text-[#ef3b42]"
                      : "text-[#3a080a] hover:text-[#7b3432]"
                  }`}
                >
                  <MenuIcon />
                </Popover.Button>
              </div>

              <Portal>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition-opacity duration-200 ease-out motion-reduce:transition-none"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150 ease-out motion-reduce:transition-none"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Panel
                    className={`fixed inset-0 z-[200] text-[#151617] ${
                      desktopEnabled ? "" : "small:hidden"
                    }`}
                  >
                    <BodyScrollLock />
                    <button
                      type="button"
                      className="absolute inset-0 cursor-default bg-black/55"
                      onClick={close}
                      aria-label="Menüyü kapat"
                    />

                    <div
                      data-testid="nav-menu-popup"
                      className={`relative flex h-dvh w-[88vw] flex-col overflow-hidden border-r border-black/10 bg-white shadow-[18px_0_56px_rgba(0,0,0,.28)] overscroll-contain [-webkit-tap-highlight-color:transparent] ${
                        compactItems ? "max-w-[420px]" : "max-w-[360px]"
                      }`}
                      style={{
                        fontFamily:
                          '"Helvetica Neue LT Condensed", "Arial Narrow", "Segoe UI", sans-serif',
                      }}
                    >
                      <div
                        className="flex min-h-16 items-center justify-between border-b border-[#e7e7e5] px-5"
                        style={{
                          paddingTop: "env(safe-area-inset-top, 0px)",
                        }}
                      >
                        <LocalizedClientLink
                          href="/"
                          onClick={close}
                          aria-label="Pip Garden ana sayfa"
                          className="flex h-12 items-center"
                        >
                          <span className="text-2xl font-semibold tracking-tighter">
                            PIPGARDEN<span className="text-[#e3262e]">.</span>
                          </span>
                        </LocalizedClientLink>
                        <button
                          type="button"
                          data-testid="close-menu-button"
                          onClick={close}
                          aria-label="Menüyü kapat"
                          className="flex h-11 w-11 touch-manipulation select-none items-center justify-center rounded-full text-[#151617] active:bg-black/[.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c42026]"
                        >
                          <XMark className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="px-5 pb-2 pt-5">
                        <LocalizedClientLink
                          href="/arama"
                          onClick={close}
                          className="flex min-h-12 touch-manipulation select-none items-center gap-3 rounded-md bg-[#151617] px-4 text-[14px] font-semibold text-white active:bg-[#c42026] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c42026] focus-visible:ring-offset-2"
                        >
                          <SearchIcon />
                          <span>Ürün, koleksiyon veya malzeme ara</span>
                        </LocalizedClientLink>
                      </div>

                      <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#797b7c]">
                          Alışveriş
                        </p>
                        <ul className="divide-y divide-[#e7e7e5] border-y border-[#e7e7e5]">
                          {menuItems.map((item) => {
                            const itemKey = `${item.label}-${item.href}`
                            const hasChildren = Boolean(item.children?.length)
                            const isOpen = Boolean(openItems[itemKey])

                            return (
                              <li key={itemKey}>
                                <div className="grid min-h-14 grid-cols-[1fr_44px] items-center">
                                  <LocalizedClientLink
                                    href={item.href}
                                    onClick={close}
                                    className="flex min-h-14 touch-manipulation select-none items-center pr-2 text-[18px] font-medium uppercase leading-5 tracking-[.035em] text-[#151617] active:text-[#c42026] focus:outline-none focus-visible:text-[#c42026]"
                                    data-testid={`${item.label
                                      .toLowerCase()
                                      .replace(/[^a-z0-9]+/g, "-")}-link`}
                                  >
                                    {item.label}
                                  </LocalizedClientLink>

                                  {hasChildren ? (
                                    <button
                                      type="button"
                                      onClick={() => toggleItem(itemKey)}
                                      aria-label={`${item.label} alt menüsünü ${
                                        isOpen ? "kapat" : "aç"
                                      }`}
                                      aria-expanded={isOpen}
                                      className="flex h-11 w-11 touch-manipulation select-none items-center justify-center rounded-full text-[#55585a] active:bg-black/[.06] active:text-[#c42026] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c42026]"
                                    >
                                      <span
                                        className={
                                          isOpen
                                            ? "rotate-90 transition-transform duration-150 motion-reduce:transition-none"
                                            : "transition-transform duration-150 motion-reduce:transition-none"
                                        }
                                      >
                                        <ChevronIcon />
                                      </span>
                                    </button>
                                  ) : (
                                    <span className="flex h-11 w-11 items-center justify-center text-[#8a8c8d]">
                                      <ChevronIcon />
                                    </span>
                                  )}
                                </div>

                                {hasChildren && isOpen ? (
                                  <ul className="mb-3 border-l-2 border-[#c42026] bg-[#f5f5f3] px-4 py-1">
                                    {item.children?.map((child) => (
                                      <li
                                        key={`${itemKey}-${child.label}-${child.href}`}
                                      >
                                        <LocalizedClientLink
                                          href={child.href}
                                          onClick={close}
                                          className="flex min-h-11 touch-manipulation items-center border-b border-black/[.06] text-[14px] font-medium leading-5 text-[#4c4f50] last:border-b-0 active:text-[#c42026] focus:outline-none focus-visible:text-[#c42026]"
                                        >
                                          {child.label}
                                        </LocalizedClientLink>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </li>
                            )
                          })}
                        </ul>
                      </nav>

                      <div
                        className="border-t border-[#e7e7e5] bg-[#f7f7f5] px-5 pb-3 pt-3"
                        style={{
                          paddingBottom:
                            "calc(12px + env(safe-area-inset-bottom, 0px))",
                        }}
                      >
                        <LocalizedClientLink
                          href="/hesabim"
                          onClick={close}
                          className="flex min-h-12 touch-manipulation select-none items-center justify-between rounded-md border border-[#d8d9d7] bg-white px-4 text-[14px] font-semibold text-[#151617] active:border-[#c42026] active:text-[#c42026] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c42026]"
                        >
                          <span className="flex items-center gap-3">
                            <AccountIcon />
                            Hesabım / Giriş yap
                          </span>
                          <ChevronIcon />
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Portal>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
