"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { useEffect, useMemo, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type VehicleModel = {
  id: string
  name: string
  handle: string
}

type Brand = {
  name: string
  handle: string
  logo?: string
}

const logo = (slug: string) => `/images/vehicle-brands/${slug}.svg`

const brands: Brand[] = [
  { name: "BMW", handle: "bmw-yedek-parca", logo: logo("bmw") },
  { name: "Mercedes-Benz", handle: "mercedes-yedek-parca" },
  { name: "Opel", handle: "opel-yedek-parca", logo: logo("opel") },
  {
    name: "Volkswagen",
    handle: "volkswagen-yedek-parca",
    logo: logo("volkswagen"),
  },
  { name: "Audi", handle: "audi-yedek-parca", logo: logo("audi") },
  { name: "Peugeot", handle: "peugeot-yedek-parca", logo: logo("peugeot") },
  { name: "Renault", handle: "renault-yedek-parca", logo: logo("renault") },
  { name: "Ford", handle: "ford-yedek-parca", logo: logo("ford") },
  { name: "Citroën", handle: "citroen-yedek-parca", logo: logo("citroen") },
  {
    name: "Toyota",
    handle: "toyota-oto-yedek-parca-urunleri",
    logo: logo("toyota"),
  },
  { name: "Land Rover", handle: "land-rover-yedek-parca" },
  {
    name: "Hyundai",
    handle: "hyundai-oto-yedek-parca-urunleri",
    logo: logo("hyundai"),
  },
  { name: "Kia", handle: "kia", logo: logo("kia") },
  { name: "Honda", handle: "honda-yedek-parca", logo: logo("honda") },
  {
    name: "Chevrolet",
    handle: "chevrolet-yedek-parca",
    logo: logo("chevrolet"),
  },
  { name: "Fiat", handle: "fiat-marka-oto-yedek-parca", logo: logo("fiat") },
  { name: "Škoda", handle: "skoda-yedek-parca", logo: logo("skoda") },
  { name: "Seat", handle: "seat-yedek-parca", logo: logo("seat") },
  {
    name: "Nissan",
    handle: "nissan-oto-yedek-parca-urunleri",
    logo: logo("nissan"),
  },
  { name: "Porsche", handle: "porsche-yedek-parca", logo: logo("porsche") },
  { name: "Mazda", handle: "mazda", logo: logo("mazda") },
  { name: "Mini", handle: "mini-cooper-yedek-parca", logo: logo("mini") },
  { name: "Dacia", handle: "dacia-yedek-parca", logo: logo("dacia") },
  { name: "Jeep", handle: "jeep", logo: logo("jeep") },
  { name: "Mitsubishi", handle: "mitsubishi", logo: logo("mitsubishi") },
  { name: "Subaru", handle: "subaru", logo: logo("subaru") },
  { name: "Suzuki", handle: "suzuki", logo: logo("suzuki") },
  { name: "Alfa Romeo", handle: "alfa-romeo" },
  { name: "Jaguar", handle: "jaguar-yedek-parca" },
  { name: "Lexus", handle: "lexus" },
  { name: "Infiniti", handle: "infiniti" },
  {
    name: "Cupra",
    handle: "cupra-marka-oto-yedek-parca-urunleri",
    logo: logo("seat"),
  },
  { name: "DS", handle: "ds-automobiles", logo: logo("dsautomobiles") },
  {
    name: "Smart",
    handle: "smart-marka-otomobil-yedek-parcalari",
    logo: logo("smart"),
  },
  { name: "Tesla", handle: "tesla-yedek-parca", logo: logo("tesla") },
  { name: "Volvo", handle: "volvo-yedek-parca", logo: logo("volvo") },
  { name: "BYD", handle: "byd" },
  { name: "Aston Martin", handle: "aston-martin", logo: logo("astonmartin") },
  { name: "Maserati", handle: "maserati", logo: logo("maserati") },
  { name: "SsangYong", handle: "ssangyong" },
  { name: "Isuzu", handle: "isuzu-yedek-parca" },
  { name: "Ferrari", handle: "ferrari", logo: logo("ferrari") },
]

const brakeGroups = [
  { label: "Tüm Ürünler", href: "/store", code: "00" },
  {
    label: "Fren Diskleri",
    href: "/fren-diskleri",
    code: "01",
  },
  {
    label: "Fren Balataları",
    href: "/fren-balatalari",
    code: "02",
  },
]

const BrandMark = ({ brand }: { brand: Brand }) => {
  if (brand.logo) {
    return (
      <I18nElement
        as="img"
        src={brand.logo}
        alt=""
        className="h-6 w-9 object-contain"
        loading="lazy"
      />
    )
  }

  if (brand.name === "Mercedes-Benz") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 40 40"
        className="h-7 w-7 fill-none stroke-current"
      >
        <circle cx="20" cy="20" r="16" strokeWidth="1.5" />
        <path
          d="m20 5 2.5 14.2L35 27M20 5l-2.5 14.2L5 27m12.5-7.8L20 35l2.5-15.8"
          strokeWidth="1.5"
        />
      </svg>
    )
  }

  if (brand.name === "Land Rover") {
    return (
      <span className="rounded-[50%] border border-current px-1.5 py-1 text-[7px] font-bold italic">
        <T>LAND</T>
        <br />
        <T>ROVER</T>
      </span>
    )
  }

  return (
    <span className="text-[9px] font-bold uppercase tracking-[.08em]">
      <T>{brand.name}</T>
    </span>
  )
}

type BodyType = "sedan" | "hatch" | "suv" | "van" | "pickup" | "coupe"

const getBodyType = (name: string): BodyType => {
  const value = name.toLocaleLowerCase("tr-TR")
  if (
    /transit|vito|sprinter|partner|berlingo|doblo|ducato|trafic|kango|caddy|crafter|boxer|connect|touran|lodgy|dokker/.test(
      value
    )
  )
    return "van"
  if (/ranger|amarok|l200|hilux|d-max|pick/.test(value)) return "pickup"
  if (
    /x[1-7]\b|q[2-8]\b|suv|mokka|tiguan|touareg|t-roc|t-cross|cayenne|macan|koleos|kadjar|captur|kuga|ecosport|puma|aircross|sportage|sorento|qashqai|x-trail|juke|discovery|range|freelander|duster|pajero|forester|rav|cr-v|hr-v|cx-|ateca|arona|kodiaq|kamiq|yeti|vitara|jimny|asx|compass|cherokee|renegade/.test(
      value
    )
  )
    return "suv"
  if (
    /2 seri f2[23]|coupe|coupé|scirocco|911|tt\b|rcz|mustang|brz|mx-5|f-type|supra|taycan/.test(
      value
    )
  )
    return "coupe"
  if (
    /1 seri (e8[17]|f20|f40)|a serisi w1(68|69|76|77)|astra|corsa|golf|polo|clio|megane|focus|fiesta|206|207|208|307|308|c3\b|c4\b|a1\b|a3\b|fabia|ibiza|leon|yaris|i20|i30|rio|picanto|swift|jazz|mini|sandero|almera|micra/.test(
      value
    )
  )
    return "hatch"
  return "sedan"
}

const VehicleIcon = ({ name }: { name: string }) => {
  const bodyType = getBodyType(name)
  const roof = {
    sedan: "M12 43 27 25h36l18 18",
    hatch: "M12 43 25 24h39l16 19",
    suv: "M10 43 22 20h45l14 23",
    van: "M8 43 18 16h54l12 27",
    pickup: "M8 43 20 20h25l9 12h27",
    coupe: "M12 43 32 23h22l17 20",
  }[bodyType]

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 62"
      className="h-12 w-full fill-none stroke-current"
    >
      <path
        d={roof}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {bodyType === "pickup" ? <path d="M62 35h27" strokeWidth="2" /> : null}
      <path d="M7 43h85l-3 8H11l-4-8Z" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="26" cy="51" r="7" fill="#111211" strokeWidth="2" />
      <circle cx="75" cy="51" r="7" fill="#111211" strokeWidth="2" />
      <path d="M43 26v17M65 27l7 16" strokeWidth="1.2" opacity=".6" />
    </svg>
  )
}

const MotorsportMegaMenu = ({
  variant = "classic",
}: {
  variant?: "classic" | "unsection"
}) => {
  const [activeBrand, setActiveBrand] = useState(brands[0])
  const [modelsByBrand, setModelsByBrand] = useState<
    Record<string, VehicleModel[]>
  >({})
  const [loadingBrand, setLoadingBrand] = useState<string | null>(null)

  useEffect(() => {
    if (modelsByBrand[activeBrand.handle]) return
    const controller = new AbortController()
    setLoadingBrand(activeBrand.handle)

    fetch(`/api/vehicle-menu?brand=${encodeURIComponent(activeBrand.handle)}`, {
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { models: [] }))
      .then((data: { models?: VehicleModel[] }) => {
        setModelsByBrand((current) => ({
          ...current,
          [activeBrand.handle]: data.models || [],
        }))
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setModelsByBrand((current) => ({
            ...current,
            [activeBrand.handle]: [],
          }))
        }
      })
      .finally(() =>
        setLoadingBrand((current) =>
          current === activeBrand.handle ? null : current
        )
      )

    return () => controller.abort()
  }, [activeBrand, modelsByBrand])

  const models = useMemo(
    () => modelsByBrand[activeBrand.handle] || [],
    [activeBrand.handle, modelsByBrand]
  )

  return (
    <div className="group/mega relative flex h-full items-stretch">
      <button
        type="button"
        aria-haspopup="true"
        className={
          variant === "unsection"
            ? "relative flex items-center gap-2 whitespace-nowrap px-4 text-[12px] font-bold uppercase tracking-[.12em] text-white transition-colors after:absolute after:inset-x-4 after:bottom-0 after:h-px after:origin-left after:scale-x-100 after:bg-[#ef3b42] group-hover/mega:bg-white/[.055] large:px-5 large:text-[13px]"
            : "relative flex items-center gap-2 whitespace-nowrap px-3 text-[13px] font-semibold uppercase tracking-[.065em] text-white transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-[#e51f28] after:transition-transform group-hover/mega:bg-white/[.045] group-hover/mega:after:scale-x-100 large:px-4 large:text-[14px] xlarge:px-5 xlarge:text-[15px]"
        }
      >
        <T>Fren sistemleri</T>
        <span className="text-[#ef3b42]">+</span>
      </button>

      <div
        className={`invisible fixed inset-x-0 z-[95] translate-y-2 border-t border-white/10 bg-[#101111]/[0.985] opacity-0 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-xl transition-[opacity,transform,visibility] duration-200 group-focus-within/mega:visible group-focus-within/mega:translate-y-0 group-focus-within/mega:opacity-100 group-hover/mega:visible group-hover/mega:translate-y-0 group-hover/mega:opacity-100 ${
          variant === "unsection"
            ? "top-[120px]"
            : "top-[88px] large:top-[92px]"
        }`}
      >
        <div className="mx-auto grid max-w-[1600px] grid-cols-[220px_minmax(350px,1fr)_minmax(330px,480px)] large:grid-cols-[250px_minmax(430px,1fr)_minmax(360px,520px)]">
          <section className="border-r border-white/10 px-8 py-8">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[.24em] text-[#e51f28]">
              <T>Fren sistemleri</T>
            </p>
            <div className="space-y-1">
              {brakeGroups.map((item) => (
                <LocalizedClientLink
                  key={item.label}
                  href={item.href}
                  className="group/link flex items-center gap-3 border-b border-white/8 py-3 text-[14px] font-semibold uppercase tracking-[.045em] text-white/78 transition-colors hover:text-white"
                >
                  <span className="text-[9px] text-white/30 group-hover/link:text-[#e51f28]">
                    <T>{item.code}</T>
                  </span>
                  <T>{item.label}</T>
                </LocalizedClientLink>
              ))}
            </div>
            <LocalizedClientLink
              href="/search"
              className="mt-7 flex h-11 items-center justify-center border border-[#e51f28] text-[11px] font-bold uppercase tracking-[.16em] text-white transition-colors hover:bg-[#e51f28]"
            >
              <T>Parça koduyla ara</T>
            </LocalizedClientLink>
          </section>

          <section className="border-r border-white/10 px-7 py-8">
            <div className="mb-5 flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#e51f28]">
                  <T>Araç markası</T>
                </p>
                <h2 className="mt-1 text-[22px] font-semibold uppercase tracking-[.02em] text-white">
                  <T>Markanı seç</T>
                </h2>
              </div>
              <span className="text-[10px] uppercase tracking-[.12em] text-white/35">
                <T>{brands.length}</T> <T>marka</T>
              </span>
            </div>
            <div className="grid max-h-[390px] grid-cols-4 gap-1.5 overflow-y-auto pr-2 xlarge:grid-cols-5">
              {brands.map((brand) => {
                const active = activeBrand.handle === brand.handle
                return (
                  <button
                    key={brand.handle}
                    type="button"
                    onMouseEnter={() => setActiveBrand(brand)}
                    onFocus={() => setActiveBrand(brand)}
                    onClick={() => setActiveBrand(brand)}
                    className={`flex min-h-[68px] flex-col items-center justify-center gap-2 border px-2 py-2 transition-[background-color,border-color,color] duration-200 ${
                      active
                        ? "border-[#e51f28] bg-[#e51f28]/12 text-white"
                        : "border-white/8 bg-white/[.025] text-white/62 hover:border-white/25 hover:bg-white/[.055] hover:text-white"
                    }`}
                  >
                    <BrandMark brand={brand} />
                    <span className="max-w-full truncate text-[9px] font-bold uppercase tracking-[.08em]">
                      <T>{brand.name}</T>
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="px-7 py-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#e51f28]">
                  <T>Araç modelleri</T>
                </p>
                <h2 className="mt-1 text-[22px] font-semibold uppercase tracking-[.02em] text-white">
                  <T>{activeBrand.name}</T>
                </h2>
              </div>
              <BrandMark brand={activeBrand} />
            </div>

            <div className="grid max-h-[330px] grid-cols-2 gap-2 overflow-y-auto pr-2">
              {loadingBrand === activeBrand.handle && !models.length ? (
                <div className="col-span-2 flex h-32 items-center justify-center text-[11px] uppercase tracking-[.14em] text-white/40">
                  <T>Modeller yükleniyor…</T>
                </div>
              ) : models.length ? (
                models.map((model) => (
                  <LocalizedClientLink
                    key={model.id}
                    href={`/categories/${activeBrand.handle}/${model.handle}`}
                    className="group/model border border-white/8 bg-white/[.025] px-3 py-2 text-white/55 transition-[background-color,border-color,color] duration-200 hover:border-[#e51f28]/70 hover:bg-white/[.055] hover:text-white"
                  >
                    <VehicleIcon name={model.name} />
                    <span className="block truncate border-t border-white/8 pt-2 text-[10px] font-semibold uppercase tracking-[.06em]">
                      <T>{model.name}</T>
                    </span>
                  </LocalizedClientLink>
                ))
              ) : (
                <div className="col-span-2 flex h-32 items-center justify-center text-center text-[11px] uppercase tracking-[.12em] text-white/40">
                  <T>
                    Bu marka için model listesini marka sayfasından inceleyin.
                  </T>
                </div>
              )}
            </div>

            <LocalizedClientLink
              href={`/results/${encodeURIComponent(activeBrand.name)}`}
              className="mt-4 flex h-11 items-center justify-between border-t border-white/15 text-[11px] font-bold uppercase tracking-[.14em] text-white transition-colors hover:text-[#ef3b42]"
            >
              <T>Tüm </T>
              <T>{activeBrand.name}</T> <T>modelleri</T>
              <span aria-hidden="true">→</span>
            </LocalizedClientLink>
          </section>
        </div>
      </div>
    </div>
  )
}

export default MotorsportMegaMenu
