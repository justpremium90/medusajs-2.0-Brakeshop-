import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import "./product-detail.css"

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
  const material =
    typeof metadata?.material === "string" ? metadata.material : null
  const [name, ...suffix] = product.title.split("|")
  // The imported local cover is a copy of the first source image.
  const sourceImages = metadata?.source_images
  const sourceCover = Array.isArray(sourceImages) ? sourceImages[0] : null
  const hasLocalCover = product.images?.some((image) =>
    image.url?.includes("/images/garden/catalog/")
  )
  const galleryImages = (product.images || []).filter(
    (image) => !hasLocalCover || image.url !== sourceCover
  )

  return (
    <main className="pdp" data-testid="product-container">
      <div className="pdp-shell">
        <nav aria-label="İçerik yolu" className="pdp-breadcrumb">
          <LocalizedClientLink href="/">Ana sayfa</LocalizedClientLink>
          <span aria-hidden="true">/</span>
          <LocalizedClientLink
            href={
              category?.handle ? `/categories/${category.handle}` : "/store"
            }
          >
            {category?.name || "Koleksiyon"}
          </LocalizedClientLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{name.trim()}</span>
        </nav>
        <div className="pdp-intro">
          <div className="pdp-visual">
            <ImageGallery
              images={galleryImages}
              productTitle={product.title}
            />
          </div>
          <div className="pdp-information">
            <div className="pdp-heading">
              <p className="pdp-eyebrow">
                <span />
                Pip Garden koleksiyonu
              </p>
              <p className="pdp-category">
                {category?.name || "Dışarıda yaşam"}
              </p>
              <h1
                className="pdp-title"
                data-testid="product-title"
                aria-label={product.title}
              >
                {name.trim()}
              </h1>
              {(material || suffix.length > 0) && (
                <p className="pdp-material">
                  {suffix.join(" · ").trim() || material}
                </p>
              )}
            </div>
            <Suspense
              fallback={
                <ProductActions product={product} region={region} disabled />
              }
            >
              <ProductActionsWrapper id={product.id} region={region} />
            </Suspense>
            <div className="pdp-detail-links">
              <a href="#product-details">
                Ölçüler & ürün detayları <span aria-hidden="true">↗</span>
              </a>
              <LocalizedClientLink href="/care-guide">
                Kullanım & bakım <span aria-hidden="true">↗</span>
              </LocalizedClientLink>
            </div>
          </div>
        </div>
        <section
          className="pdp-details"
          id="product-details"
          aria-labelledby="product-details-title"
        >
          <div className="pdp-details-heading">
            <p className="pdp-eyebrow">01 / Yakından bakın</p>
            <h2 id="product-details-title">
              Tasarımın
              <br />
              <em>detaylarında.</em>
            </h2>
            <p>
              Malzemeden ölçülere, alanınız için bilmeniz gereken her detay.
            </p>
            {material && (
              <div className="pdp-material-note">
                <span>Malzeme</span>
                <strong>{material}</strong>
              </div>
            )}
          </div>
          <ProductTabs product={product} />
        </section>
        <Suspense fallback={null}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
        <div className="pdp-collection-footer">
          <span>Pip Garden</span>
          <LocalizedClientLink
            href={
              category?.handle ? `/categories/${category.handle}` : "/store"
            }
          >
            Koleksiyona dön <span aria-hidden="true">↗</span>
          </LocalizedClientLink>
        </div>
      </div>
    </main>
  )
}
