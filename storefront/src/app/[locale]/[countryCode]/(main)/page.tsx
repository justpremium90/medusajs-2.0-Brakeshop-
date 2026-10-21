import { localizeMetadata } from "@lib/i18n/metadata"
import { T, I18nElement } from "@lib/i18n/client"
import { Metadata } from "next"
import Hero from "@modules/home/components/managed-hero"
import HomeBestSellers from "@modules/home/components/home-best-sellers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getRegion } from "@lib/data/regions"
const pageMetadata = {
  title: "Bahçe ve Dış Mekan Mobilyaları | Pip Garden",
  description:
    "Bahçeniz, terasınız ve balkonunuz için oturma grupları, salıncaklar, masa takımları ve şezlonglar. Pip Garden koleksiyonunu keşfedin.",
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}
export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  return (
    <>
      <h1 className="sr-only">
        <T>Pip Garden bahçe ve dış mekan mobilyaları</T>
      </h1>
      <Hero />
      <section className="grid gap-5 bg-[#f6f5f2] px-4 py-12 small:grid-cols-3 small:px-8 large:px-12">
        {[
          {
            title: "Birlikte geçirilen zaman",
            label: "Oturma grupları",
            handle: "oturma-gruplari",
            image: "entry_slider_image_1.jpeg",
          },
          {
            title: "Günün en sakin köşesi",
            label: "Salıncak takımları",
            handle: "salincak-takimlari",
            image: "entry_slider_image_5.jpeg",
          },
          {
            title: "Uzun sofralar, güzel anılar",
            label: "Masa takımları",
            handle: "masa-takimlari",
            image: "entry_slider_image_3.jpeg",
          },
        ].map((c) => (
          <LocalizedClientLink
            href={`/categories/${c.handle}`}
            key={c.handle}
            className="group relative overflow-hidden bg-[#242823]"
          >
            <I18nElement
              as="img"
              src={`/images/garden/${c.image}`}
              alt={c.label}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 start-6 text-white">
              <p className="text-[10px] uppercase tracking-[.13em]">
                <T>{c.label}</T>
              </p>
              <h2 className="mt-2 text-[25px] leading-tight">
                <T>{c.title}</T>
              </h2>
              <span className="mt-4 inline-block border-b border-white/70 pb-1 text-xs">
                <T>Keşfet →</T>
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </section>
      {region && <HomeBestSellers region={region} countryCode={countryCode} />}
      <section className="grid gap-8 bg-[#111211] px-5 py-16 text-white small:grid-cols-2 small:px-12 small:py-24">
        <p className="text-xs uppercase tracking-[.18em] text-white/55">
          <T>Pip Garden / Dışarıda yaşam</T>
        </p>
        <div>
          <h2 className="max-w-xl text-4xl leading-tight small:text-5xl">
            <T>Evinizin en güzel odası,</T>
            <br />
            <T>gökyüzünün altında.</T>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/65">
            <T>
              İroko ağacının doğal dokusundan alüminyumun yalın çizgilerine;
              alanınıza ve yaşamınıza uyan mobilyaları keşfedin. Ölçü, malzeme
              ve renk seçeneklerini karşılaştırarak kendi açık hava alanınızı
              oluşturun.
            </T>
          </p>
          <LocalizedClientLink
            href="/store"
            className="mt-8 inline-block border-b border-white pb-2 text-xs uppercase tracking-widest"
          >
            <T>Tüm koleksiyon →</T>
          </LocalizedClientLink>
        </div>
      </section>
    </>
  )
}
