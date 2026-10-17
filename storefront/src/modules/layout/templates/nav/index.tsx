import { listRegions } from "@lib/data/regions"
import GardenNav from "@modules/layout/components/unsection-motorsport-nav"
export default async function Nav() {
  return <GardenNav regions={await listRegions()} />
}
