"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { useMemo, useState } from "react"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

type CompatibleVehicle = {
  brand: string
  model: string
  type: string
  power: string
}

const getCompatibleVehicles = (
  product: HttpTypes.StoreProduct
): CompatibleVehicle[] => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const rawVehicles = metadata.compatible_vehicles

  if (!Array.isArray(rawVehicles)) return []

  return rawVehicles.flatMap((rawVehicle) => {
    if (!rawVehicle || typeof rawVehicle !== "object") return []

    const vehicle = rawVehicle as Record<string, unknown>
    const brand = typeof vehicle.brand === "string" ? vehicle.brand.trim() : ""
    const model = typeof vehicle.model === "string" ? vehicle.model.trim() : ""
    const type = typeof vehicle.type === "string" ? vehicle.type.trim() : ""
    const power = typeof vehicle.power === "string" ? vehicle.power.trim() : ""

    return brand && model ? [{ brand, model, type, power }] : []
  })
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const compatibleVehicles = getCompatibleVehicles(product)
  const tabs = [
    {
      label: "Ürün Özellikleri",
      component: <ProductInfoTab product={product} />,
    },
    ...(compatibleVehicles.length
      ? [
          {
            label: `Uyumlu Araçlar (${compatibleVehicles.length})`,
            component: <CompatibleVehiclesTab vehicles={compatibleVehicles} />,
          },
        ]
      : []),
    {
      label: "Kargo ve iade",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full border-t border-[#ead8d2]">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const CompatibleVehiclesTab = ({
  vehicles,
}: {
  vehicles: CompatibleVehicle[]
}) => {
  const [query, setQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(100)
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR")
  const filteredVehicles = useMemo(
    () =>
      normalizedQuery
        ? vehicles.filter((vehicle) =>
            [vehicle.brand, vehicle.model, vehicle.type, vehicle.power]
              .join(" ")
              .toLocaleLowerCase("tr-TR")
              .includes(normalizedQuery)
          )
        : vehicles,
    [normalizedQuery, vehicles]
  )
  const visibleVehicles = filteredVehicles.slice(0, visibleCount)

  return (
    <div className="py-5 text-[13px] leading-5 text-[#5d3432]">
      <p className="mb-4">
        Sipariş vermeden önce aracınızın model, motor tipi ve güç bilgisini
        kontrol edin.
      </p>
      <label className="mb-4 block">
        <span className="sr-only">Uyumlu araçlarda ara</span>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setVisibleCount(100)
          }}
          placeholder="Marka, model veya motor ara"
          className="w-full rounded-none border border-[#d7bdb4] bg-white px-3 py-2 text-[#3a080a] outline-none placeholder:text-[#8b6c66] focus:border-[#3a080a]"
        />
      </label>

      {visibleVehicles.length ? (
        <>
          <div className="max-h-[420px] overflow-auto border border-[#ead8d2]">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead className="sticky top-0 bg-[#f8f1ef] text-[#3a080a]">
                <tr>
                  <th className="px-3 py-2 font-semibold">Marka</th>
                  <th className="px-3 py-2 font-semibold">Model</th>
                  <th className="px-3 py-2 font-semibold">Motor tipi</th>
                  <th className="px-3 py-2 font-semibold">Güç</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ead8d2]">
                {visibleVehicles.map((vehicle, index) => (
                  <tr
                    key={`${vehicle.brand}-${vehicle.model}-${vehicle.type}-${vehicle.power}-${index}`}
                  >
                    <td className="px-3 py-2 font-semibold text-[#3a080a]">
                      {vehicle.brand}
                    </td>
                    <td className="px-3 py-2">{vehicle.model}</td>
                    <td className="px-3 py-2">{vehicle.type || "—"}</td>
                    <td className="px-3 py-2">{vehicle.power || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleVehicles.length < filteredVehicles.length ? (
            <button
              type="button"
              className="mt-4 border border-[#3a080a] px-4 py-2 font-semibold text-[#3a080a] transition-colors hover:bg-[#3a080a] hover:text-white"
              onClick={() => setVisibleCount((count) => count + 100)}
            >
              Daha fazla göster
            </button>
          ) : null}
          <p className="mt-3 text-[12px] text-[#8b6c66]">
            {filteredVehicles.length.toLocaleString("tr-TR")} uyumlu araç kaydı
          </p>
        </>
      ) : (
        <p>Aramanızla eşleşen uyumlu araç bulunamadı.</p>
      )}
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const rawAttributes = metadata.technical_attributes
  const technicalAttributes =
    rawAttributes &&
    typeof rawAttributes === "object" &&
    !Array.isArray(rawAttributes)
      ? Object.entries(rawAttributes as Record<string, unknown>).flatMap(
          ([name, rawValue]) => {
            const value =
              typeof rawValue === "string" || typeof rawValue === "number"
                ? String(rawValue).trim()
                : ""

            return name.trim() && value ? [[name.trim(), value] as const] : []
          }
        )
      : []

  if (technicalAttributes.length) {
    return (
      <div className="py-5 text-[13px] leading-5 text-[#5d3432]">
        <dl className="divide-y divide-[#ead8d2]">
          {technicalAttributes.map(([name, value]) => (
            <div
              key={name}
              className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 py-3 first:pt-0 last:pb-0"
            >
              <dt className="font-semibold text-[#3a080a]">{name}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  }

  return (
    <div className="py-5 text-[13px] leading-5 text-[#5d3432]">
      <div className="grid grid-cols-1 gap-y-4 large:grid-cols-2 large:gap-x-6">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-[#3a080a]">Materyal</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-[#3a080a]">Menşei</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-[#3a080a]">Tür</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-[#3a080a]">Ağırlık</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold text-[#3a080a]">Ölçüler</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}U x ${product.width}G x ${product.height}Y`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-5 text-[13px] leading-5 text-[#5d3432]">
      <div className="grid grid-cols-1 gap-y-6">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold text-[#3a080a]">Hızlı teslimat</span>
            <p className="max-w-sm">
              Paketiniz 3-5 iş günü içinde adresinize veya seçtiğiniz teslimat
              noktasına ulaşır.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold text-[#3a080a]">Kolay değişim</span>
            <p className="max-w-sm">
              Ürün beklentinizi karşılamadıysa sorun değil; değişim sürecinde
              size yardımcı oluruz.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold text-[#3a080a]">Kolay iade</span>
            <p className="max-w-sm">
              İade talebinizde süreci mümkün olduğunca hızlı ve zahmetsiz
              tamamlamanız için yanınızdayız.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
