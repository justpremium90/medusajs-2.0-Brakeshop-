"use client"
import React, { createContext, useContext, useEffect } from "react"
import { useParams } from "next/navigation"
import { isLocale } from "./config"
import type { Locale } from "./config"
import { translate } from "./translate"

const LocaleContext = createContext<Locale>("tr")
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const params = useParams()
  const current = isLocale(params?.locale) ? params.locale : locale
  useEffect(() => {
    document.documentElement.lang = current
    document.documentElement.dir = current === "ar" ? "rtl" : "ltr"
  }, [current])
  return (
    <LocaleContext.Provider value={current}>{children}</LocaleContext.Provider>
  )
}
export const useLocale = () => useContext(LocaleContext)
export function useT() {
  const locale = useLocale()
  return (text: string) => translate(text, locale)
}
/** A text-only translation boundary: no DOM wrapper and no browser text mutation. */
export function T({ children }: { children: React.ReactNode }) {
  const t = useT()
  return <>{typeof children === "string" ? t(children) : children}</>
}
/** Preserve native elements while localizing their accessible names and hints. */
type I18nElementProps = Omit<React.DOMAttributes<any>, "onChange"> & {
  as: string
  ref?: React.Ref<any>
  onChange?: React.ChangeEventHandler<any>
  children?: React.ReactNode
  [key: string]: any
}
export function I18nElement({ as, children, ref, ...props }: I18nElementProps) {
  const t = useT()
  const localized = { ...props }
  for (const key of ["aria-label", "placeholder", "title", "alt"]) {
    if (typeof localized[key] === "string") localized[key] = t(localized[key])
  }
  return React.createElement(as, { ...localized, ref }, children)
}
