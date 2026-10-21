import { T } from "@lib/i18n/client"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function ProductTabs({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const raw = (product.metadata as Record<string, unknown> | null)
    ?.specifications
  const specs = Array.isArray(raw)
    ? raw.filter(
        (v): v is { label: string; value: string } =>
          !!v &&
          typeof v === "object" &&
          typeof v.label === "string" &&
          typeof v.value === "string" &&
          v.value.trim() !== "-" &&
          v.value.trim() !== ""
      )
    : []
  return (
    <div className="pdp-accordions">
      <details open>
        <summary>
          <T>Ölçüler & özellikler</T>
          <span aria-hidden="true" />
        </summary>
        {specs.length ? (
          <dl className="pdp-specifications">
            {specs.map((spec, i) => (
              <div key={`${spec.label}-${i}`}>
                <dt>
                  <T>{spec.label}</T>
                </dt>
                <dd>
                  <T>{spec.value}</T>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="pdp-detail-copy">
            <T>Ürün özellikleri hazırlanıyor.</T>
          </p>
        )}
      </details>
      {product.description && (
        <details>
          <summary>
            <T>Ürün açıklaması</T>
            <span aria-hidden="true" />
          </summary>
          <p className="pdp-detail-copy">
            <T>{product.description}</T>
          </p>
        </details>
      )}
      <details>
        <summary>
          <T>Teslimat & bakım</T>
          <span aria-hidden="true" />
        </summary>
        <p className="pdp-detail-copy">
          <T>
            Teslimat bilgilerini sipariş aşamasında inceleyebilirsiniz. Kullanım
            ve bakım için ürünün malzemesine uygun üretici önerilerini takip
            edin.
          </T>
        </p>
        <LocalizedClientLink href="/care-guide" className="pdp-text-link">
          <T>Bakım rehberini inceleyin ↗</T>
        </LocalizedClientLink>
      </details>
    </div>
  )
}
