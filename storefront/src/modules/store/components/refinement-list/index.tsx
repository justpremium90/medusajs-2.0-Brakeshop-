"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  variant?: "default" | "editorial"
  "data-testid"?: string
}

const sortLabels: Record<SortOptions, string> = {
  relevance: "En alakalı",
  created_at: "En yeni",
  price_asc: "Düşük fiyat",
  price_desc: "Yüksek fiyat",
}

const RefinementList = ({
  sortBy,
  search = false,
  variant = "default",
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isEditorial = variant === "editorial"

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="relative flex justify-end">
      <details className="group relative">
        <summary
          className={
            isEditorial
              ? "flex h-8 cursor-pointer list-none items-center text-[14px] font-normal leading-[18px] text-[#3a080a] underline underline-offset-2 [&::-webkit-details-marker]:hidden"
              : "flex h-10 cursor-pointer list-none items-center gap-x-2 border border-[#e4c8c0] bg-white px-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#3a080a] transition-colors hover:border-[#3a080a] [&::-webkit-details-marker]:hidden"
          }
        >
          {!isEditorial ? (
            <svg
              aria-hidden="true"
              className="h-4 w-4 stroke-[1.8]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
          ) : null}
          <span>{isEditorial ? "Sırala" : "Filtrele"}</span>
          {!isEditorial ? (
            <span className="hidden text-[#8f6f6b] small:inline">
              {sortLabels[sortBy]}
            </span>
          ) : null}
        </summary>
        <div className="absolute right-0 z-30 mt-2 w-[230px] border border-[#e4c8c0] bg-white p-4 text-[#3a080a] shadow-[0_10px_28px_rgba(58,8,10,0.12)]">
          <SortProducts
            sortBy={sortBy}
            setQueryParams={setQueryParams}
            search={search}
            data-testid={dataTestId}
          />
        </div>
      </details>
    </div>
  )
}

export default RefinementList
