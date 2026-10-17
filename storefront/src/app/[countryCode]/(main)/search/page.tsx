import { Metadata } from "next"
import { redirect } from "next/navigation"
import { toPublicPath } from "@lib/util/public-path"

import SearchModal from "@modules/search/templates/search-modal"

export const metadata: Metadata = {
  title: "Fren Diski ve Balatası Ara | Brakeshop",
  description:
    "Marka, model veya parça koduyla Brakeshop kataloğunda arama yapın.",
  robots: {
    index: false,
    follow: true,
  },
}

export default async function SearchModalRoute({
  searchParams,
  params,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ query?: string | string[] }>
}) {
  const { countryCode } = await params
  const { query } = await searchParams
  const normalizedQuery = (Array.isArray(query) ? query[0] : query)?.trim()
  if (normalizedQuery) {
    redirect(`/${countryCode}${toPublicPath(`/results/${encodeURIComponent(normalizedQuery)}`)}`)
  }
  return <SearchModal />
}
