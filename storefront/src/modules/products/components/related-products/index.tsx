import { T } from "@lib/i18n/client"
import ProductPreview from "../product-preview"
import { getRegion } from "@lib/data/regions"
import { getProductsList } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
export default async function RelatedProducts({
  product,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  if (!region) return null
  const categoryId = product.categories?.[0]?.id
  const { response } = await getProductsList({
    countryCode,
    queryParams: {
      limit: 5,
      ...(categoryId ? { category_id: [categoryId] } : {}),
    },
  })
  const products = response.products
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
  if (!products.length) return null
  return (
    <section className="pdp-related" aria-labelledby="pdp-related-title">
      <p className="pdp-eyebrow">
        <T>Koleksiyonu tamamlayın</T>
      </p>
      <h2 id="pdp-related-title">
        <T>Birlikte, daha güzel.</T>
      </h2>
      <ul className="pdp-related-grid">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
