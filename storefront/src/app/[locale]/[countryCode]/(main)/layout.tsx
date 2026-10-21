import { localizeMetadata } from "@lib/i18n/metadata"
import { T } from "@lib/i18n/client"
import { Metadata } from "next"

import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { getBaseURL } from "@lib/util/env"

const pageMetadata = {
  metadataBase: new URL(getBaseURL()),
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <T>{props.children}</T>
      <Footer />
    </>
  )
}
