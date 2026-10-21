"use client"
import { usePathname, useRouter } from "next/navigation"
import { locales, type Locale } from "./config"
import { useLocale, useT } from "./client"
export default function LanguageSelector() {
  const locale = useLocale()
  const t = useT()
  const pathname = usePathname()
  const router = useRouter()
  return (
    <label className="garden-language">
      <span className="sr-only">{t("Dil seçin")}</span>
      <select
        aria-label={t("Dil seçin")}
        value={locale}
        onChange={(event) => {
          const next = event.target.value as Locale
          const path = pathname.replace(/^\/(tr|en|ar)(?=\/|$)/, "")
          router.push(
            `/${next}${path}${window.location.search}${window.location.hash}`
          )
        }}
      >
        {locales.map((code) => (
          <option key={code} value={code} lang={code}>
            {code === "ar" ? "العربية" : code.toUpperCase()}
          </option>
        ))}
      </select>
      <span aria-hidden="true">⌄</span>
    </label>
  )
}
