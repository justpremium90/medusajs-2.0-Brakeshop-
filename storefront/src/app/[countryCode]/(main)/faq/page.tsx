import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("faq")
export default function Page() { return <BrakeshopStaticPage pageKey="faq" /> }
