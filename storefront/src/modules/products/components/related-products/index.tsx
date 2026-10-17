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
    <section>
      <p className="text-[10px] uppercase tracking-widest text-[#777]">
        Koleksiyonu tamamlayın
      </p>
      <h2 className="mb-7 mt-2 text-3xl font-semibold">
        Aynı alana yakışanlar
      </h2>
      <ul className="grid grid-cols-2 gap-4 small:grid-cols-4 small:gap-6">
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
