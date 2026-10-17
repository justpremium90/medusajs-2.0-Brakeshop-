"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import type { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type PerformanceToolbarProps = {
  sortBy: SortOptions
  search?: boolean
}

const sortOptions: Array<{ value: SortOptions; label: string }> = [
  { value: "created_at", label: "En yeni" },
  { value: "price_asc", label: "Fiyat: düşükten yükseğe" },
  { value: "price_desc", label: "Fiyat: yüksekten düşüğe" },
]

const FilterIcon = () => (
  <svg
    aria-hidden="true"
    className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7]"
    viewBox="0 0 24 24"
    strokeLinecap="round"
  >
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
)

const ChevronIcon = () => (
  <svg
    aria-hidden="true"
    className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m7 9 5 5 5-5" />
  </svg>
)

const PerformanceToolbar = ({
  sortBy,
  search = false,
}: PerformanceToolbarProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const visibleSortOptions = search
    ? [{ value: "relevance" as const, label: "En alakalı" }, ...sortOptions]
    : sortOptions

  useEffect(() => {
    if (!filtersOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFiltersOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [filtersOpen])

  const setSort = (value: SortOptions) => {
    const params = new URLSearchParams(searchParams)
    params.set("sortBy", value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
    setFiltersOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 small:flex small:items-center small:justify-between">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-[#d9d9d9] bg-white px-4 text-[13px] font-semibold text-[#171717] transition-colors duration-200 hover:border-[#171717] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c42026] small:justify-start"
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
        >
          <FilterIcon />
          Sıralama
        </button>

        <label className="relative flex h-11 min-w-0 items-center rounded-[5px] border border-[#d9d9d9] bg-white pl-3 pr-9 text-[13px] text-[#525252] transition-colors focus-within:border-[#171717] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#c42026] small:min-w-[230px]">
          <span className="sr-only">Ürünleri sırala</span>
          <select
            value={sortBy}
            onChange={(event) =>
              setSort(event.currentTarget.value as SortOptions)
            }
            className="h-full w-full appearance-none bg-transparent pr-2 font-medium text-[#171717] outline-none"
            aria-label="Ürünleri sırala"
          >
            {visibleSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sırala: {option.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3">
            <ChevronIcon />
          </span>
        </label>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[100]" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/35"
            onClick={() => setFiltersOpen(false)}
            aria-label="Filtre panelini kapat"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="performance-filter-title"
            className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-[12px] bg-white p-5 shadow-[0_-18px_50px_rgba(0,0,0,.16)] small:inset-y-0 small:left-auto small:right-0 small:w-[390px] small:rounded-none small:p-7"
          >
            <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
              <div>
                <h2
                  id="performance-filter-title"
                  className="text-[20px] font-semibold"
                >
                  Sıralama
                </h2>
                <p className="mt-1 text-[12px] text-[#737373]">
                  Katalog görünümünü düzenleyin
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e5e5e5] text-[24px] leading-none transition-colors hover:border-[#c42026] hover:text-[#c42026] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c42026]"
                aria-label="Filtre panelini kapat"
              >
                ×
              </button>
            </div>

            <fieldset className="mt-6">
              <legend className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#525252]">
                Sıralama
              </legend>
              <div className="mt-3 divide-y divide-[#eeeeee] border-y border-[#eeeeee]">
                {visibleSortOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex min-h-12 cursor-pointer items-center justify-between gap-3 text-[14px]"
                  >
                    <span>{option.label}</span>
                    <input
                      type="radio"
                      name="performance-sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={() => setSort(option.value)}
                      className="h-4 w-4 accent-[#c42026]"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          </section>
        </div>
      ) : null}
    </>
  )
}

export default PerformanceToolbar
