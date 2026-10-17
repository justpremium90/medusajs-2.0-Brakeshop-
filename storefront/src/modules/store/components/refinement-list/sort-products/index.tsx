"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  search?: boolean
  "data-testid"?: string
}

const sortOptions: Array<{ value: SortOptions; label: string }> = [
  {
    value: "created_at",
    label: "En yeni gelenler",
  },
  {
    value: "price_asc",
    label: "Fiyat: düşükten yükseğe",
  },
  {
    value: "price_desc",
    label: "Fiyat: yüksekten düşüğe",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
  search = false,
}: SortProductsProps) => {
  const visibleOptions = search
    ? [{ value: "relevance" as const, label: "En alakalı" }, ...sortOptions]
    : sortOptions
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title="Sıralama"
      items={visibleOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
