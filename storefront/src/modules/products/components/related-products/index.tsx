import ProductPreview from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { getCategoryByHandle } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import {
  getRelatedVehicleCategoryHandles,
  getRelatedVehicleCategoryIds,
  getRelatedVehicleSearchTerms,
  rankRelatedProducts,
} from "@lib/util/related-products"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const categoryHandles = getRelatedVehicleCategoryHandles(product)
  const categoryIds = getRelatedVehicleCategoryIds(product)
  const searchTerms = getRelatedVehicleSearchTerms(product)
  const anchoredProductIds = new Set<string>()
  let candidates: HttpTypes.StoreProduct[] = []

  if (!categoryIds[0] && categoryHandles[0]) {
    const { product_categories: resolvedCategories } =
      await getCategoryByHandle([categoryHandles[0]])
    const resolvedCategory = resolvedCategories.find(
      (category) => category.handle === categoryHandles[0]
    )

    if (resolvedCategory?.id) categoryIds.push(resolvedCategory.id)
  }

  if (categoryIds[0]) {
    const { response } = await getProductsList({
      queryParams: {
        limit: 100,
        category_id: [categoryIds[0]],
        is_giftcard: false,
      } as HttpTypes.FindParams & HttpTypes.StoreProductParams,
      countryCode,
    })

    candidates = response.products
    response.products.forEach((candidate) => {
      if (candidate.id) anchoredProductIds.add(candidate.id)
    })
  }

  if (searchTerms.length && candidates.length < 12) {
    const responses = await Promise.all(
      searchTerms.map((term) =>
        getProductsList({
          queryParams: {
            limit: 50,
            q: term,
            is_giftcard: false,
          } as HttpTypes.FindParams & HttpTypes.StoreProductParams,
          countryCode,
        })
      )
    )

    candidates = [
      ...candidates,
      ...responses.flatMap(({ response }) => response.products),
    ]
  }

  const products = rankRelatedProducts({
    current: product,
    candidates,
    anchoredProductIds,
    limit: 4,
  })

  if (!products.length) {
    return null
  }

  return (
    <section className="w-full">
      <div className="mb-8 flex flex-col text-[#3a080a] small:mb-12 small:items-center small:text-center">
        <span className="text-[13px] font-semibold uppercase leading-none tracking-[0.08em] text-[#8a5b58]">
          Araç eşleşmesine göre
        </span>
        <h2 className="mt-3 text-[28px] font-semibold leading-8 small:text-[34px] small:leading-10">
          Bu araç için uyumlu ürünler
        </h2>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-1 gap-y-11 small:grid-cols-3 small:gap-x-5 small:gap-y-14 medium:grid-cols-4 medium:gap-x-6 large:grid-cols-4 large:gap-x-7">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview
              region={region}
              product={product}
              displayStyle="charlotte"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
