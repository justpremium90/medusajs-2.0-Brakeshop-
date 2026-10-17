import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("contact")
export default function Page() { return <BrakeshopStaticPage pageKey="contact" /> }
