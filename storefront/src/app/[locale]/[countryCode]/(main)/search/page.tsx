import { localizeMetadata } from "@lib/i18n/metadata"
import { getLocale } from "@lib/i18n/server"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { toPublicPath } from "@lib/util/public-path"

import SearchModal from "@modules/search/templates/search-modal"

const pageMetadata = {
  title: "Bahçe Mobilyası Ara | Pip Garden",
  description:
    "Marka, model veya parça koduyla Pip Garden kataloğunda arama yapın.",
  robots: {
    index: false,
    follow: true,
  },
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
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
    redirect(
      `/${await getLocale()}${toPublicPath(
        `/results/${encodeURIComponent(normalizedQuery)}`
      )}`
    )
  }
  return <SearchModal />
}
