import { T } from "@lib/i18n/client"
import { GARDEN_FEATURED_HANDLES } from "@lib/constants/garden"
import { HttpTypes } from "@medusajs/types"
import { getProductsList } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const HomeBestSellers = async ({
  region,
  countryCode,
}: {
  region: HttpTypes.StoreRegion
  countryCode: string
}) => {
  const {
    response: { products: orderedProducts },
  } = await getProductsList({
    countryCode,
    queryParams: { limit: 10, handle: GARDEN_FEATURED_HANDLES },
  })
  if (!orderedProducts.length) return null

  return (
    <section className="garden-curated">
      <div className="garden-collection-width">
        <div className="garden-curated-heading">
          <div>
            <p className="garden-collection-eyebrow">
              <T>Pip Garden seçkisi</T>
            </p>
            <h2 className="garden-curated-title">
              <T>Açık havaya yakışanlar</T>
            </h2>
          </div>
          <LocalizedClientLink href="/store" className="garden-collection-link">
            <T>Tümünü Gör</T>
          </LocalizedClientLink>
        </div>
        <ul className="garden-product-grid">
          {orderedProducts.slice(0, 6).map((product) => (
            <li key={product.id} className="min-w-0">
              <ProductPreview
                product={product}
                region={region}
                displayStyle="performance"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HomeBestSellers
