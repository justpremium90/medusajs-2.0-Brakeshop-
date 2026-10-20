"use client"

import { Fragment, useEffect, useRef } from "react"
import { Popover, Transition } from "@headlessui/react"
import { usePathname } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"

function CloseOnNavigation({ close }: { close: () => void }) {
  const pathname = usePathname()
  const previousPath = useRef(pathname)
  useEffect(() => {
    if (previousPath.current !== pathname) {
      previousPath.current = pathname
      close()
    }
  }, [pathname, close])
  return null
}

export default function CollectionMenu() {
  return (
    <Popover className="garden-collection">
      {({ open, close }) => (
        <div data-open={open} className="garden-collection-disclosure">
          <CloseOnNavigation close={close} />
          <Popover.Button className="garden-collection-trigger">
            Koleksiyon
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
            >
              <path d="m3 4.5 3 3 3-3" />
            </svg>
          </Popover.Button>
          <Popover.Backdrop className="garden-collection-backdrop" />
          <Transition
            as={Fragment}
            show={open}
            enter="garden-collection-transition"
            enterFrom="garden-collection-enter"
            enterTo="garden-collection-shown"
            leave="garden-collection-transition"
            leaveFrom="garden-collection-shown"
            leaveTo="garden-collection-enter"
          >
            <Popover.Panel
              focus
              className="garden-collection-panel"
              aria-label="Bahçe mobilyası koleksiyonları"
            >
              <div className="garden-collection-inner">
                <div className="garden-collection-categories">
                  <div className="garden-collection-heading">
                    <span>Koleksiyon</span>
                    <LocalizedClientLink href="/store" onClick={() => close()}>
                      Tümünü keşfet <span aria-hidden="true">↗</span>
                    </LocalizedClientLink>
                  </div>
                  <ul>
                    {GARDEN_CATEGORIES.map((category) => (
                      <li key={category.handle}>
                        <LocalizedClientLink
                          href={category.href}
                          onClick={() => close()}
                        >
                          {category.label}
                          <span aria-hidden="true">↗</span>
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                  <p>Bahçeniz, terasınız, balkonunuz.</p>
                </div>
                <LocalizedClientLink
                  href="/categories/oturma-gruplari"
                  onClick={() => close()}
                  className="garden-collection-feature"
                >
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/garden/entry_slider_image_1.jpeg"
                      alt="Bahçede oturma grubu"
                      width={800}
                      height={500}
                    />
                  </div>
                  <span>
                    Birlikte geçirilen zaman <span aria-hidden="true">↗</span>
                  </span>
                </LocalizedClientLink>
              </div>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  )
}
