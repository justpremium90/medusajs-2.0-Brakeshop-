import { localizeMetadata } from "@lib/i18n/metadata"
import { T } from "@lib/i18n/client"
import InteractiveLink from "@modules/common/components/interactive-link"
import { Metadata } from "next"

const pageMetadata = {
  title: "404",
  description: "Something went wrong",
}
export async function generateMetadata() {
  return localizeMetadata(pageMetadata)
}

export default async function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">
        <T>Page not found</T>
      </h1>
      <p className="text-small-regular text-ui-fg-base">
        <T>The page you tried to access does not exist.</T>
      </p>
      <InteractiveLink href="/">
        <T>Go to frontpage</T>
      </InteractiveLink>
    </div>
  )
}
