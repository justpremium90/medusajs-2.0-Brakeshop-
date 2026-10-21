import { T } from "@lib/i18n/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import BrandLogo from "@modules/products/components/product-preview/brand-logo"
import { getProductBrandName } from "@lib/util/product-brand"
import ProductPrice from "@modules/products/components/product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  id?: string
  className?: string
}

const productTitleStyle = {
  fontFamily:
    '"Helvetica Neue LT Condensed", "Avenir Next Condensed Medium", Helvetica, Arial, sans-serif',
  fontStretch: "condensed",
  fontWeight: 500,
  letterSpacing: ".03125rem",
}

const ProductInfo = ({
  product,
  id = "product-info",
  className = "",
}: ProductInfoProps) => {
  return (
    <div id={id} className={`relative w-full pr-10 ${className}`}>
      <LocalizedClientLink
        href="/account"
        aria-label="Favorilere ekle"
        className="absolute right-0 top-0 text-[#3a080a] transition-colors hover:text-[#7b3432]"
      >
        <svg
          aria-hidden="true"
          className="h-7 w-7 stroke-[1.5]"
          fill="none"
          viewBox="0 0 28 28"
          stroke="currentColor"
        >
          <path d="M14 24.4S4.5 18.7 4.5 10.9c0-3.1 2.2-5.5 5.1-5.5 1.9 0 3.5 1 4.4 2.5.9-1.5 2.5-2.5 4.4-2.5 2.9 0 5.1 2.4 5.1 5.5 0 7.8-9.5 13.5-9.5 13.5Z" />
        </svg>
      </LocalizedClientLink>

      <div className="mb-3">
        <BrandLogo name={getProductBrandName(product)} kind="product" />
      </div>
      <Heading
        level="h1"
        className="max-w-[340px] text-[21px] uppercase leading-[23px] text-[#3a080a] small:text-[25px] small:leading-[29px] medium:text-[27px] medium:leading-[31px] large:text-[32px] large:leading-9"
        style={productTitleStyle}
        data-testid="product-title"
      >
        <T>{product.title}</T>
      </Heading>

      <div className="mt-2 [&_span]:!text-[22px] [&_span]:!leading-7 small:hidden">
        <ProductPrice product={product} showFromLabel={false} />
      </div>
    </div>
  )
}

export default ProductInfo
