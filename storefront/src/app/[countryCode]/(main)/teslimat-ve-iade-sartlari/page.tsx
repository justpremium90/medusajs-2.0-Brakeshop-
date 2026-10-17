import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("delivery-return-terms")
export default function Page() { return <BrakeshopStaticPage pageKey="delivery-return-terms" /> }
