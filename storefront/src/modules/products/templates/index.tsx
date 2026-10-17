import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export default function ProductTemplate({
  product,
  region,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  if (!product?.id) notFound()
  const category = product.categories?.[0]
  const metadata = product.metadata as Record<string, unknown> | null
  return (
    <main
      className="bg-[#faf9f6] pb-24 text-[#171717]"
      data-testid="product-container"
    >
      <div className="mx-auto max-w-[1600px] px-4 small:px-8 large:px-12">
        <nav
          aria-label="İçerik yolu"
          className="flex flex-wrap gap-2 py-6 text-[11px] text-[#777]"
        >
          <LocalizedClientLink href="/">Ana sayfa</LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink
            href={
              category?.handle ? `/categories/${category.handle}` : "/store"
            }
          >
            {category?.name || "Koleksiyon"}
          </LocalizedClientLink>
          <span>/</span>
          <span>{product.title}</span>
        </nav>
        <div className="grid gap-8 small:grid-cols-[1.3fr_1fr] large:gap-16">
          <div className="min-w-0">
            <ImageGallery
              images={product.images || []}
              productTitle={product.title}
            />
          </div>
          <aside className="py-4 small:py-8">
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#c42026]">
              Pip Garden / {category?.name || "Dışarıda yaşam"}
            </p>
            <h1
              className="mt-4 text-[32px] font-semibold leading-tight tracking-tight large:text-[42px]"
              data-testid="product-title"
            >
              {product.title}
            </h1>
            {typeof metadata?.material === "string" && (
              <p className="mt-4 text-sm text-[#777]">{metadata.material}</p>
            )}
            <div className="mt-8 border-y border-[#d9d7d1] py-6">
              <Suspense
                fallback={
                  <ProductActions product={product} region={region} disabled />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>
            <div className="mt-6">
              <ProductTabs product={product} />
            </div>
          </aside>
        </div>
        <section className="my-14 border-t border-[#d9d7d1] pt-10">
          <h2 className="text-2xl font-semibold">Ürünü yakından tanıyın</h2>
          <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-7 text-[#666]">
            {product.description ||
              "Ölçü, malzeme ve renk seçeneklerini inceleyerek alanınıza uygun ürünü seçin."}
          </p>
        </section>
        <Suspense fallback={null}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </main>
  )
}
