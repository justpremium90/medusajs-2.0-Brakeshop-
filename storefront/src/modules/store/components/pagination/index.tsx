"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { clx } from "@medusajs/ui"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestid,
}: {
  page: number
  totalPages: number
  "data-testid"?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper function to generate an array of numbers within a range
  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  // Build a real URL so crawlers and users without JavaScript can navigate.
  const getPageHref = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    return `${pathname}?${params.toString()}`
  }

  // Function to render a page button
  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => {
    const className = clx(
      "txt-xlarge-plus inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
      {
        "bg-neutral-900 text-white": isCurrent,
        "text-ui-fg-muted hover:bg-neutral-100 hover:text-ui-fg-base":
          !isCurrent,
      }
    )

    return isCurrent ? (
      <span key={p} className={className} aria-current="page">
        <T>{label}</T>
      </span>
    ) : (
      <Link
        key={p}
        href={getPageHref(p)}
        className={className}
        aria-label={`${p}. sayfaya git`}
        rel={p === page - 1 ? "prev" : p === page + 1 ? "next" : undefined}
      >
        <T>{label}</T>
      </Link>
    )
  }

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="txt-xlarge-plus text-ui-fg-muted items-center cursor-default"
    >
      ...
    </span>
  )

  // Function to render page buttons based on the current page and total pages
  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 7) {
      // Show all pages
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      // Handle different cases for displaying pages and ellipses
      if (page <= 4) {
        // Show 1, 2, 3, 4, 5, ..., lastpage
        buttons.push(
          ...arrayRange(1, 5).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 3) {
        // Show 1, ..., lastpage - 4, lastpage - 3, lastpage - 2, lastpage - 1, lastpage
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 4, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        // Show 1, ..., page - 1, page, page + 1, ..., lastpage
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  // Render the component
  return (
    <I18nElement
      as="nav"
      className="flex justify-center w-full mt-12"
      aria-label="Ürün sayfaları"
    >
      <div className="flex gap-3 items-end" data-testid={dataTestid}>
        <T>{renderPageButtons()}</T>
      </div>
    </I18nElement>
  )
}
