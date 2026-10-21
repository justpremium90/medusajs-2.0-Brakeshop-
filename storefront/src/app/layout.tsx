import { getLocale } from "@lib/i18n/server"
import { LocaleProvider } from "@lib/i18n/client"
import "styles/i18n.css"
import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-mode="light">
      <body>
        <LocaleProvider locale={locale}>
          <main className="relative">{props.children}</main>
        </LocaleProvider>
      </body>
    </html>
  )
}
