import { localizeMetadata } from "@lib/i18n/metadata"
import BrakeshopStaticPage, {
  getBrakeshopPageMetadata,
} from "@modules/content/brakeshop-static-page"
const pageMetadata = getBrakeshopPageMetadata("care-guide")
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}
export default function Page() {
  return <BrakeshopStaticPage pageKey="care-guide" />
}
