import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("withdrawal-form")
export default function Page() { return <BrakeshopStaticPage pageKey="withdrawal-form" /> }
