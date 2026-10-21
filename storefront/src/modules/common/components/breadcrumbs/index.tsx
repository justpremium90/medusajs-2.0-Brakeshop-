import { T, I18nElement } from "@lib/i18n/client"
import type { BreadcrumbItem } from "@lib/util/product-breadcrumbs"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  variant?: "default" | "editorial" | "technical" | "performance"
  className?: string
}

const baseFont = {
  fontFamily:
    '"Helvetica Neue LT Std", "Avenir light", Helvetica, Arial, sans-serif',
}

const variantClasses = {
  default: "border-[#ead8d2] text-[#7f4c49]",
  editorial: "border-[#aaa198] text-[#625d57]",
  technical: "border-[#d4d4d4] text-[#666]",
  performance: "border-transparent text-[#737373]",
}

const currentClasses = {
  default: "text-[#3a080a]",
  editorial: "text-[#1d1a17]",
  technical: "text-[#222]",
  performance: "text-[#171717]",
}

const Breadcrumbs = ({
  items,
  variant = "default",
  className = "",
}: BreadcrumbsProps) => {
  if (!items.length) {
    return null
  }

  return (
    <I18nElement
      as="nav"
      aria-label="Sayfa yolu"
      className={`w-full overflow-x-auto border-b pb-3 no-scrollbar ${variantClasses[variant]} ${className}`}
      style={baseFont}
      data-testid="breadcrumbs"
    >
      <ol className="flex min-w-max items-center gap-2 text-[11px] font-normal leading-4 small:gap-2.5 small:text-[12px]">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex max-w-[240px] items-center gap-2 small:max-w-[360px] small:gap-2.5"
            >
              {index > 0 ? (
                <span aria-hidden="true" className="shrink-0 opacity-55">
                  /
                </span>
              ) : null}
              {item.href && !isCurrent ? (
                <LocalizedClientLink
                  href={item.href}
                  className="truncate underline-offset-4 transition-colors hover:text-current hover:underline"
                >
                  <T>{item.label}</T>
                </LocalizedClientLink>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={`truncate ${
                    isCurrent ? `${currentClasses[variant]} font-semibold` : ""
                  }`}
                >
                  <T>{item.label}</T>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </I18nElement>
  )
}

export default Breadcrumbs
