import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("about")
export default function Page() { return <BrakeshopStaticPage pageKey="about" /> }
