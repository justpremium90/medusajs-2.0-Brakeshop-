import { localizeMetadata } from "@lib/i18n/metadata"
import { T } from "@lib/i18n/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"
const pageMetadata = { title: "Koleksiyon | Pip Garden" }
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}
export default function CollectionIndex() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-[#c42026]">
        <T>Pip Garden</T>
      </p>
      <h1 className="mt-3 text-4xl font-semibold">
        <T>Dışarıda yaşam koleksiyonu</T>
      </h1>
      <div className="mt-10 grid grid-cols-2 gap-5 small:grid-cols-3">
        {GARDEN_CATEGORIES.map((c) => (
          <LocalizedClientLink
            key={c.handle}
            href={c.href}
            className="border-b border-gray-300 py-5 text-xl"
          >
            <T>{c.label}</T> →
          </LocalizedClientLink>
        ))}
      </div>
    </main>
  )
}
