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
          typeof v.value === "string"
      )
    : []
  return (
    <div className="divide-y divide-[#d9d7d1]">
      <details open className="py-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Ölçüler ve ürün özellikleri
        </summary>
        {specs.length ? (
          <dl className="mt-5 divide-y divide-[#e5e3dd] text-[12px]">
            {specs.map((s, i) => (
              <div
                key={`${s.label}-${i}`}
                className="grid grid-cols-[1fr_1.4fr] gap-4 py-3"
              >
                <dt className="text-[#777]">{s.label}</dt>
                <dd className="whitespace-pre-line">{s.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-xs text-[#777]">
            Ürün özellikleri hazırlanıyor.
          </p>
        )}
      </details>
      <details className="py-4">
        <summary className="cursor-pointer text-sm font-semibold">
          Teslimat ve bakım
        </summary>
        <p className="mt-4 text-xs leading-6 text-[#777]">
          Teslimat bilgilerini sipariş aşamasında inceleyebilirsiniz. Kullanım
          ve bakım için ürünün malzemesine uygun üretici önerilerini takip edin.
        </p>
        <LocalizedClientLink
          href="/care-guide"
          className="mt-3 inline-block border-b border-current text-xs"
        >
          Bakım rehberi →
        </LocalizedClientLink>
      </details>
    </div>
  )
}
