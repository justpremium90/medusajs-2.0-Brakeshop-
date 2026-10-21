import { localizeMetadata } from "@lib/i18n/metadata"
import { Metadata } from "next"

import SearchResultsTemplate from "@modules/search/templates/search-results-template"

import { search } from "@modules/search/actions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const pageMetadata = {
  title: "Search",
  description: "Explore all of our products.",
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}

type Params = {
  params: Promise<{ query: string; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export default async function SearchResults({ params, searchParams }: Params) {
  const { query, countryCode } = await params
  const { sortBy, page } = await searchParams

  let decodedQuery = query
  try {
    decodedQuery = decodeURIComponent(query)
  } catch {}
  const hits = await search(decodedQuery, countryCode).then((data) => data)

  const ids = hits
    .map((h) => h.id)
    .filter((id): id is string => {
      return typeof id === "string"
    })

  return (
    <SearchResultsTemplate
      query={decodedQuery}
      ids={ids}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
    />
  )
}
