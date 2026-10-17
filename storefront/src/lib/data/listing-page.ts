import { cache } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { getProductsListWithSort } from "./products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { isListingPageInRange, parseListingPage, PRODUCT_LISTING_LIMIT } from "../util/listing-page"

// Primitive cache keys reuse the same Medusa response in metadata, page and grid.
export const getListingPage = cache(async (
  countryCode: string,
  page: number,
  sortBy: SortOptions = "created_at",
  categoryId?: string,
  collectionId?: string,
  productIds?: string,
  period?: string,
  categoryHandle?: string
) => {
  if (productIds && sortBy === "relevance") {
    const rankedIds = JSON.parse(productIds) as string[]
    const offset = (page - 1) * PRODUCT_LISTING_LIMIT
    const pageIds = rankedIds.slice(offset, offset + PRODUCT_LISTING_LIMIT)
    const result = await getProductsListWithSort({
      countryCode,
      page: 1,
      sortBy: "created_at",
      queryParams: {
        limit: Math.max(pageIds.length, 1),
        id: pageIds,
      } as HttpTypes.FindParams & HttpTypes.StoreProductParams,
    })
    const productsById = new Map(
      result.response.products.map((product) => [product.id, product])
    )
    const products = pageIds.flatMap((id) => {
      const product = productsById.get(id)
      return product ? [product] : []
    })
    const count = rankedIds.length
    if (!isListingPageInRange(page, count)) notFound()
    return {
      ...result,
      response: { products, count },
      nextPage:
        count > offset + PRODUCT_LISTING_LIMIT ? page + 1 : null,
    }
  }

  const result = await getProductsListWithSort({
    countryCode,
    page,
    sortBy,
    queryParams: {
      limit: PRODUCT_LISTING_LIMIT,
      ...(categoryId ? { category_id: [categoryId] } : {}),
      ...(collectionId ? { collection_id: [collectionId] } : {}),
      ...(productIds ? { id: JSON.parse(productIds) as string[] } : {}),
    },
  })
  if (!isListingPageInRange(page, result.response.count)) notFound()
  return result
})

export async function validateListingPage(
  rawPage: unknown,
  countryCode: string,
  sortBy: SortOptions = "created_at",
  categoryId?: string,
  collectionId?: string,
  period?: string,
  categoryHandle?: string
) {
  const page = parseListingPage(rawPage)
  if (page === null) notFound()
  // Validate before entering a streaming/Suspense boundary so HTTP can be 404.
  // Page one remains valid for an empty category and keeps skeleton loading.
  if (page > 1) await getListingPage(countryCode, page, sortBy, categoryId, collectionId, undefined, period, categoryHandle)
  return page
}
