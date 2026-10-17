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
    <section className="overflow-hidden bg-white py-12 small:overflow-visible small:py-16">
      <div className="mx-auto max-w-[1480px] px-3 xsmall:px-6 small:px-8 large:px-12 xlarge:px-16">
        <div className="mb-7 flex items-end justify-between gap-4 small:mb-9">
          <div>
            <p className="text-[11px] font-semibold uppercase leading-4 tracking-[0.12em] text-[#c42026] small:text-[12px]">
              Pip Garden seçkisi
            </p>
            <h2 className="mt-1.5 text-[27px] font-semibold leading-[1.1] tracking-[-0.025em] text-[#171717] small:text-[34px]">
              Açık havaya yakışanlar
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="inline-flex min-h-11 items-center border-b-2 border-[#171717] text-[12px] font-semibold text-[#171717] transition-colors hover:border-[#c42026] hover:text-[#c42026] small:text-[13px]"
          >
            Tümünü Gör
          </LocalizedClientLink>
        </div>
        <ul className="grid grid-cols-2 gap-2 pb-2 xsmall:gap-4 min-[768px]:grid-cols-3 min-[768px]:gap-5 medium:grid-cols-4 large:gap-6 xlarge:grid-cols-5">
          {orderedProducts.map((product) => (
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
