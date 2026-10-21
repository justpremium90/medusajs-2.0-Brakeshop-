import { T, I18nElement } from "@lib/i18n/client"
import logos from "@lib/content/product-brand-logos.json"
import { findBrandByName, normalizeProductBrand } from "@lib/util/product-brand"

type BrandLogoProps = { name: string; kind: "product" | "vehicle" }
const vehicleLogos: Record<string, string> = {
  "MERCEDES BENZ": "mercedes",
  MERCEDES: "mercedes",
  "LAND ROVER": "landrover",
  "ALFA ROMEO": "alfa-romeo",
  DS: "dsautomobiles",
  VW: "volkswagen",
}

const BrandLogo = ({ name, kind }: BrandLogoProps) => {
  if (!name) return null
  const brand = findBrandByName(name)
  const normalized = normalizeProductBrand(name)
  const asset = (
    logos as Record<
      string,
      { src: string; source: string; background?: string }
    >
  )[brand?.slug || ""]
  const vehicleSlug =
    vehicleLogos[normalized] || normalized.toLowerCase().replace(/ /g, "-")
  // Only existing local vehicle artwork is used; unknown makes remain plain text.
  const knownVehicles = new Set([
    "fiat",
    "volkswagen",
    "smart",
    "volvo",
    "tesla",
    "toyota",
    "mercedes",
    "skoda",
    "dsautomobiles",
    "chevrolet",
    "seat",
    "peugeot",
    "audi",
    "ferrari",
    "ssangyong",
    "honda",
    "maserati",
    "subaru",
    "mini",
    "citroen",
    "mitsubishi",
    "isuzu",
    "alfa-romeo",
    "bmw",
    "kia",
    "byd",
    "porsche",
    "dacia",
    "suzuki",
    "opel",
    "nissan",
    "mazda",
    "jaguar",
    "landrover",
    "infiniti",
    "renault",
    "ford",
    "lexus",
    "hyundai",
    "jeep",
    "astonmartin",
  ])
  const src =
    kind === "vehicle"
      ? knownVehicles.has(vehicleSlug)
        ? `/images/vehicle-brands/${vehicleSlug}.svg`
        : null
      : asset?.src ||
        (
          {
            bmw: "/images/vehicle-brands/bmw.svg",
            "mercedes-benz": "/images/vehicle-brands/mercedes.svg",
            hyundai: "/images/vehicle-brands/hyundai.svg",
            "land-rover": "/images/vehicle-brands/landrover.svg",
          } as Record<string, string>
        )[brand?.slug || ""]

  return (
    <I18nElement
      as="span"
      className={
        kind === "vehicle"
          ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white p-1.5"
          : "inline-flex min-w-0 items-center gap-2"
      }
      title={kind === "vehicle" ? `${name} uyumlu` : `Ürün markası: ${name}`}
      data-brand-logo={brand?.slug || normalized}
      data-brand-kind={kind}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <I18nElement
          as="img"
          src={src}
          alt={
            kind === "vehicle"
              ? `${name} uyumlu araç`
              : `${brand?.name || name} logosu`
          }
          width={kind === "vehicle" ? 32 : 100}
          height={32}
          loading="lazy"
          style={{
            filter: kind === "vehicle" || !asset ? "brightness(0)" : undefined,
            backgroundColor:
              kind === "product" && asset
                ? asset.background || "#fff"
                : undefined,
          }}
          className={
            kind === "vehicle"
              ? "h-full w-full object-contain"
              : `h-8 w-[100px] shrink-0 rounded ${
                  asset ? "bg-white" : ""
                } object-contain p-1`
          }
        />
      ) : (
        <span className="truncate text-xs font-semibold">
          <T>{name}</T>
        </span>
      )}
    </I18nElement>
  )
}
export default BrandLogo
