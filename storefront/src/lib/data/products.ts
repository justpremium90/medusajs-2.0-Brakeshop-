import { getLocale } from "@lib/i18n/server"
import { translatedSearchHandles } from "@lib/i18n/search"
import { getCategoryByHandle } from "./categories"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"
import { getCacheDirectives } from "./cookies"

// See the note in regions.ts for why these are client.fetch calls rather than
// the sdk.store.* helpers.
export const getProductsById = cache(async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.client
    .fetch<HttpTypes.StoreProductListResponse>("/store/products", {
      method: "GET",
      query: {
        id: ids,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      ...(await getCacheDirectives("products")),
    })
    .then(({ products }) => products)
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  return sdk.client
    .fetch<HttpTypes.StoreProductListResponse>("/store/products", {
      method: "GET",
      query: {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      ...(await getCacheDirectives("products")),
    })
    .then(({ products }) => products[0])
})

export const getProductsList = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: HttpTypes.StoreProductListParams
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.StoreProductListParams
}> {
  const limit = queryParams?.limit || 12
  const queryLocale =
    countryCode === "en" || countryCode === "ar"
      ? countryCode
      : await getLocale()
  const translatedHandles =
    queryParams?.q && queryLocale !== "tr"
      ? translatedSearchHandles(queryParams.q)
      : []
  const validPageParam = Math.max(pageParam, 1)
  const offset = (validPageParam - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
  const { product_categories } = await getCategoryByHandle(
    GARDEN_CATEGORIES.map((category) => category.handle)
  )
  if (!product_categories.length)
    return { response: { products: [], count: 0 }, nextPage: null, queryParams }
  return sdk.client
    .fetch<HttpTypes.StoreProductListResponse>("/store/products", {
      method: "GET",
      query: {
        category_id: product_categories.map((category) => category.id),
        limit,
        offset,
        region_id: region.id,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
        ...queryParams,
        ...(translatedHandles.length
          ? { q: undefined, handle: translatedHandles }
          : {}),
      },
      ...(await getCacheDirectives("products")),
    })
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
})

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const getProductsListWithSort = cache(async function ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.StoreProductListParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.StoreProductListParams
}> {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await getProductsList({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  // Sorting must include the full catalogue, including products after row 100.
  for (let batchPage = 2; products.length < count; batchPage++) {
    const batch = await getProductsList({
      countryCode,
      pageParam: batchPage,
      queryParams: { ...queryParams, limit: 100 },
    })
    if (!batch.response.products.length) break
    products.push(...batch.response.products)
  }
  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? page + 1 : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
})
