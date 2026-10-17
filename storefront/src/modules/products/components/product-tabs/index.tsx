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
          Ölçüler & özellikler
          <span aria-hidden="true" />
        </summary>
        {specs.length ? (
          <dl className="pdp-specifications">
            {specs.map((spec, i) => (
              <div key={`${spec.label}-${i}`}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="pdp-detail-copy">Ürün özellikleri hazırlanıyor.</p>
        )}
      </details>
      {product.description && (
        <details>
          <summary>
            Ürün açıklaması
            <span aria-hidden="true" />
          </summary>
          <p className="pdp-detail-copy">{product.description}</p>
        </details>
      )}
      <details>
        <summary>
          Teslimat & bakım
          <span aria-hidden="true" />
        </summary>
        <p className="pdp-detail-copy">
          Teslimat bilgilerini sipariş aşamasında inceleyebilirsiniz. Kullanım
          ve bakım için ürünün malzemesine uygun üretici önerilerini takip edin.
        </p>
        <LocalizedClientLink href="/care-guide" className="pdp-text-link">
          Bakım rehberini inceleyin ↗
        </LocalizedClientLink>
      </details>
    </div>
  )
}
