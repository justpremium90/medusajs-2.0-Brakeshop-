import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("shipping-delivery")
export default function Page() { return <BrakeshopStaticPage pageKey="shipping-delivery" /> }
