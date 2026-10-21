import { localizeMetadata } from "@lib/i18n/metadata"
import StaticPage, {
  getBrakeshopPageMetadata,
} from "@modules/content/brakeshop-static-page"
export async function generateMetadata() {
  return localizeMetadata(getBrakeshopPageMetadata("terms-conditions"))
}
export default function TermsPage() {
  return <StaticPage pageKey="terms-conditions" />
}
