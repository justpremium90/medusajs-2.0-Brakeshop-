import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("returns-exchanges")
export default function Page() { return <BrakeshopStaticPage pageKey="returns-exchanges" /> }
