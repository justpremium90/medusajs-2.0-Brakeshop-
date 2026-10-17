import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("care-guide")
export default function Page() { return <BrakeshopStaticPage pageKey="care-guide" /> }
