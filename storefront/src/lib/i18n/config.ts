export const locales = ["tr", "en", "ar"] as const
export type Locale = (typeof locales)[number]
export const isLocale = (value: unknown): value is Locale =>
  locales.includes(value as Locale)
export const localeFromPath = (path: string): Locale => {
  const first = path.split("/")[1]
  return isLocale(first) ? first : "tr"
}
export const localePath = (locale: Locale, path: string) => {
  if (!path.startsWith("/") || path.startsWith("//")) return path
  return `/${locale}${path === "/" ? "" : path}`
}
export const languageNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
}
