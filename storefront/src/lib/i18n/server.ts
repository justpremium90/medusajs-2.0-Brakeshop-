import "server-only"
import { headers } from "next/headers"
import { cache } from "react"
import { isLocale, type Locale } from "./config"
import { translate } from "./translate"
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await headers()).get("x-pipgarden-locale")
  return isLocale(value) ? value : "tr"
})
export async function getT() {
  const locale = await getLocale()
  return (text: string) => translate(text, locale)
}
