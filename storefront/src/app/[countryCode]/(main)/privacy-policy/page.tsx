import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("privacy-policy")
export default function Page() { return <BrakeshopStaticPage pageKey="privacy-policy" /> }
