import brands from "@lib/content/product-brands.json"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
export const metadata = { title: "Fren Diski ve Fren Balatası Markaları | Brakeshop" }
export default function BrandsPage() {
  return (
    <div className="mx-auto max-w-[1480px] px-4 py-8 small:px-8">
      <LocalizedClientLink href="/" className="text-sm text-neutral-500">Ana sayfa / Markalar</LocalizedClientLink>
      <h1 className="mt-6 text-3xl font-semibold">Fren Diski ve Fren Balatası Markaları</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-600">Tercih ettiğiniz markanın ürünlerini inceleyin. Her ürünün teknik bilgilerini ve araç uyumluluğunu kontrol ederek ihtiyacınız olan fren parçasına ulaşın.</p>
      <ul className="mt-8 grid grid-cols-2 gap-3 small:grid-cols-3 medium:grid-cols-4">
        {brands.map((brand) => <li key={brand.slug}><LocalizedClientLink href={`/results/${encodeURIComponent(brand.name)}`} className="block rounded border border-neutral-200 px-4 py-5 font-medium hover:border-neutral-500">{brand.name}</LocalizedClientLink></li>)}
      </ul>
    </div>
  )
}
