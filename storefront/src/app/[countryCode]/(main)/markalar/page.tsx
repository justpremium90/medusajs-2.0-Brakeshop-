import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"
export const metadata = { title: "Koleksiyon | Pip Garden" }
export default function CollectionIndex() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs uppercase tracking-widest text-[#c42026]">
        Pip Garden
      </p>
      <h1 className="mt-3 text-4xl font-semibold">
        Dışarıda yaşam koleksiyonu
      </h1>
      <div className="mt-10 grid grid-cols-2 gap-5 small:grid-cols-3">
        {GARDEN_CATEGORIES.map((c) => (
          <LocalizedClientLink
            key={c.handle}
            href={c.href}
            className="border-b border-gray-300 py-5 text-xl"
          >
            {c.label} →
          </LocalizedClientLink>
        ))}
      </div>
    </main>
  )
}
