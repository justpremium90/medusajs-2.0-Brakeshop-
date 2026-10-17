import BrakeshopStaticPage, { getBrakeshopPageMetadata } from "@modules/content/brakeshop-static-page"
export const metadata = getBrakeshopPageMetadata("pre-information-form")
export default function Page() { return <BrakeshopStaticPage pageKey="pre-information-form" /> }
