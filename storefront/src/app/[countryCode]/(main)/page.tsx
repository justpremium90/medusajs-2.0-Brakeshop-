import { Metadata } from "next"
import Hero from "@modules/home/components/managed-hero"
import HomeBestSellers from "@modules/home/components/home-best-sellers"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Fren Diski ve Fren Balatası | Brakeshop",
  description: "Aracınıza uygun fren balatası ve fren diskini marka, model ve parça koduna göre bulun.",
}
export default async function Home({ params }: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)
  return (
    <>
      <h1 className="sr-only">Fren diski ve fren balatası</h1>
      <Hero />
      {region && <HomeBestSellers region={region} countryCode={countryCode} />}
      <section className="bg-white px-[5%] py-12 text-[#171918] small:py-16">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b1e22]">Doğru parçayı seçin</p>
          <h2 className="mt-3 text-2xl font-semibold small:text-3xl">Fren balatası ve fren diski uzmanı</h2>
          <p className="mt-4 max-w-[820px] text-[15px] leading-7 text-[#4b4d4c] small:text-base">
            Brakeshop; ön ve arka fren balatası, havalı veya düz fren diski,
            disk-balata seti ve fren sistemi yardımcı parçalarını araç
            uyumluluğu ve teknik ölçülerle birlikte sunar. Marka, model, kasa ve
            parça kodunu karşılaştırarak aracınız için doğru ürüne ulaşın.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LocalizedClientLink className="border border-[#171918] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em]" href="/fren-balatalari">Fren balataları</LocalizedClientLink>
            <LocalizedClientLink className="border border-[#171918] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em]" href="/fren-diskleri">Fren diskleri</LocalizedClientLink>
          </div>
        </div>
      </section>
    </>
  )
}
