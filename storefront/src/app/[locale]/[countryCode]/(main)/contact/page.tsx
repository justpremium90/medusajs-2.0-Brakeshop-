import { localizeMetadata } from "@lib/i18n/metadata"
import BrakeshopStaticPage, {
  getBrakeshopPageMetadata,
} from "@modules/content/brakeshop-static-page"
const pageMetadata = getBrakeshopPageMetadata("contact")
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}
export default function Page() {
  return <BrakeshopStaticPage pageKey="contact" />
}
