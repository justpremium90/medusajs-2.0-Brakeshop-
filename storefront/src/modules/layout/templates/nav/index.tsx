import { listRegions } from "@lib/data/regions"
import UnsectionMotorsportNav from "@modules/layout/components/unsection-motorsport-nav"

export default async function Nav() {
  const regions = await listRegions()
  return (
    <UnsectionMotorsportNav
      regions={regions}
      items={[
        { label: "Fren Diskleri", href: "/results/fren%20diski" },
        { label: "Fren Balataları", href: "/results/fren%20balatas%C4%B1" },
        { label: "Tüm Ürünler", href: "/store" },
      ]}
      navigationMode="horizontal"
    />
  )
}
