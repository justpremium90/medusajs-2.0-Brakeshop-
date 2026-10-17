import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("ssl-certificate")
export default function Page() { return <BrakeshopStaticPage pageKey="ssl-certificate" /> }
