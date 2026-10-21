import { T } from "@lib/i18n/client"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type ListingLink = {
  label: string
  href: string
}

const baseFont = {
  fontFamily:
    '"Helvetica Neue LT Std", "Avenir light", Helvetica, Arial, sans-serif',
}

const editorialTitleFont = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontWeight: 400,
}

const defaultLinks: ListingLink[] = [
  { label: "Tüm ürünler", href: "/store" },
  { label: "Yeni gelenler", href: "/store?sortBy=created_at" },
]

const buildCategoryLinks = (
  category?: HttpTypes.StoreProductCategory | null
) => {
  const children = category?.category_children || []

  if (!children.length) {
    return defaultLinks
  }

  return children
    .filter((child) => child.handle && child.name)
    .map((child) => ({
      label: child.name,
      href: `/categories/${child.handle}`,
    }))
}

const ListingHeading = ({
  title,
  description,
  eyebrow,
  sort,
  category,
  showLinks,
}: {
  title: string
  description?: string | null
  eyebrow?: string | null
  sort: SortOptions
  category?: HttpTypes.StoreProductCategory | null
  showLinks?: boolean
}) => {
  const links = showLinks ? buildCategoryLinks(category) : []
  const hasMoreContent = Boolean(eyebrow || description)

  return (
    <section className="relative mb-4 text-[#3a080a]" style={baseFont}>
      <div className="relative flex min-h-[64px] items-center justify-between gap-4 px-1 small:min-h-[86px] small:flex-col small:justify-center small:px-0 small:text-center">
        <h1
          className="min-w-0 text-[32px] leading-8 tracking-[-0.02em] small:text-[36px] small:leading-9"
          style={editorialTitleFont}
        >
          <T>{title}</T>
        </h1>

        <div className="flex shrink-0 items-center gap-4 small:mt-1 small:justify-center">
          {hasMoreContent ? (
            <details className="group relative">
              <summary className="flex h-8 cursor-pointer list-none items-center text-[14px] font-normal leading-[18px] underline underline-offset-2 [&::-webkit-details-marker]:hidden">
                <T>Daha fazla</T>
              </summary>
              <div className="absolute right-0 z-40 mt-2 w-[min(330px,calc(100vw-24px))] border border-[#e4c8c0] bg-white p-4 text-left shadow-[0_10px_28px_rgba(58,8,10,0.12)] small:left-1/2 small:right-auto small:-translate-x-1/2">
                {eyebrow ? (
                  <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.1em] text-[#8a5b58]">
                    <T>{eyebrow}</T>
                  </p>
                ) : null}
                {description ? (
                  <p
                    className={`${
                      eyebrow ? "mt-2" : ""
                    } text-[14px] leading-5 text-[#5f302f]`}
                  >
                    <T>{description}</T>
                  </p>
                ) : null}
              </div>
            </details>
          ) : null}
          <RefinementList sortBy={sort} variant="editorial" />
        </div>
      </div>

      {links.length ? (
        <nav className="flex gap-5 overflow-x-auto border-t border-[#ead8d2] pb-1 pt-3 text-[13px] leading-5 no-scrollbar small:justify-center">
          {links.map((link) => (
            <LocalizedClientLink
              key={`${link.label}-${link.href}`}
              href={link.href}
              className="shrink-0 underline-offset-4 transition-colors hover:text-[#8a5b58] hover:underline"
            >
              <T>{link.label}</T>
            </LocalizedClientLink>
          ))}
        </nav>
      ) : null}
    </section>
  )
}

export default ListingHeading
