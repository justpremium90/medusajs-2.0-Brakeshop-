"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { useId, useMemo, useState } from "react"
import VehicleBrandRail from "@modules/layout/components/unsection-motorsport-nav/vehicle-brand-rail"

type Item = { label: string; href: string }
const searchable = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")

export default function CategorySelector({
  items,
  context,
  isModelSelection,
}: {
  items: Item[]
  context: string
  isModelSelection: boolean
}) {
  const [query, setQuery] = useState("")
  const searchId = useId()
  const titleId = useId()
  const filtered = useMemo(() => {
    const terms = searchable(query).trim().split(/\s+/).filter(Boolean)
    return items.filter((item) =>
      terms.every((term) => searchable(item.label).includes(term))
    )
  }, [items, query])
  const title = isModelSelection ? "Model / kasa seç" : "Alt kategori seç"

  return (
    <section
      aria-labelledby={titleId}
      className="relative left-1/2 mb-4 w-screen min-w-0 -translate-x-1/2 overflow-hidden border-y border-[#303030] bg-[#171717] text-white small:static small:mb-6 small:w-auto small:translate-x-0 small:rounded-lg small:border"
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/15 px-3 py-2 small:px-6 small:py-4">
        <div className="min-w-0 max-w-[35%] small:max-w-none">
          <I18nElement
            as="p"
            className="truncate text-[11px] font-medium uppercase tracking-[.12em] text-white/75 small:mb-1 small:text-white/60"
            title={context}
          >
            <T>{context}</T>
          </I18nElement>
          <h2
            id={titleId}
            className="sr-only small:not-sr-only small:text-base small:font-medium small:tracking-[-.01em]"
          >
            <T>{title}</T>
          </h2>
        </div>
        {items.length > 8 && (
          <div className="relative min-w-0 flex-1 small:w-72 small:flex-none">
            <label htmlFor={searchId} className="sr-only">
              <T>
                {isModelSelection ? "Model veya kasa ara" : "Alt kategori ara"}
              </T>
            </label>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-white/60"
            >
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <I18nElement
              as="input"
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                isModelSelection ? "Model veya kasa ara" : "Alt kategori ara"
              }
              className="h-11 w-full rounded-full border border-white/25 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/60 focus:border-[#ef3b42] focus:outline-none focus:ring-1 focus:ring-[#ef3b42]"
            />
          </div>
        )}
      </div>
      <VehicleBrandRail
        items={filtered}
        appearance="category"
        ariaLabel="Alt kategoriler"
        scrollLabel="Alt kategorileri"
      />
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        <T>{filtered.length}</T> <T>seçenek bulundu</T>
      </p>
      {filtered.length === 0 && (
        <div className="px-4 pb-4 text-sm text-white/75 small:px-6">
          <T>Bu aramayla eşleşen seçenek yok.</T>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="ml-2 inline-flex min-h-11 items-center text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <T>Aramayı temizle</T>
          </button>
        </div>
      )}
    </section>
  )
}
