import "server-only"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { getLocale } from "./server"
import { locales } from "./config"
import { translate } from "./translate"
export async function localizeMetadata(metadata: Metadata): Promise<Metadata> {
  const locale = await getLocale()
  const pathname = (await headers()).get("x-pipgarden-path") || `/${locale}`
  const suffix = pathname.replace(/^\/(tr|en|ar|ru)(?=\/|$)/, "")
  const title =
    typeof metadata.title === "string"
      ? translate(metadata.title, locale)
      : metadata.title
  const description = metadata.description
    ? translate(metadata.description, locale)
    : metadata.description
  return {
    ...metadata,
    title,
    description,
    alternates: {
      canonical: pathname,
      languages: {
        ...Object.fromEntries(
          locales.map((code) => [code, `/${code}${suffix}`])
        ),
        "x-default": `/tr${suffix}`,
      },
    },
    openGraph: {
      ...metadata.openGraph,
      title: typeof title === "string" ? title : undefined,
      description: description || undefined,
      locale: `${locale}_TR`,
      alternateLocale: locales.filter((code) => code !== locale),
    },
  }
}
