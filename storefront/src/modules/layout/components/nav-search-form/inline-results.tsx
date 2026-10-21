"use client"

import { T, I18nElement, useLocale } from "@lib/i18n/client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { fetchSearchSuggestions } from "@lib/util/search-suggestions"
import type { ProductSearchSuggestion } from "@lib/util/product-search"

export default function InlineSearchResults({
  id,
  query,
  open,
  onClose,
}: {
  id: string
  query: string
  open: boolean
  onClose: () => void
}) {
  const countryCode = useLocale()
  const [result, setResult] = useState<{
    query: string
    hits: ProductSearchSuggestion[]
    failed: boolean
  } | null>(null)
  const normalized = query.trim()

  useEffect(() => {
    if (!open || normalized.length < 2) return
    let active = true
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        const hits = await fetchSearchSuggestions(
          normalized,
          controller.signal,
          countryCode
        )
        if (active) setResult({ query: normalized, hits, failed: false })
      } catch {
        if (active && !controller.signal.aborted)
          setResult({ query: normalized, hits: [], failed: true })
      }
    }, 180)
    return () => {
      active = false
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [normalized, open, countryCode])

  if (!open || normalized.length < 2) return null
  const current = result?.query === normalized ? result : null

  return (
    <I18nElement
      as="section"
      id={id}
      aria-label="Arama eşleşmeleri"
      className="absolute inset-x-0 top-full z-50 mt-2 max-h-[50dvh] overflow-y-auto rounded-lg border border-black/10 bg-white p-3 text-[#17191a] shadow-xl"
    >
      <p role="status" className="px-2 py-2 text-sm text-[#62666a]">
        <T>
          {!current
            ? "Aranıyor…"
            : current.failed
            ? "Arama şu anda tamamlanamadı. Tekrar deneyin."
            : current.hits.length
            ? `${current.hits.length} ürün eşleşmesi`
            : "Eşleşen ürün bulunamadı."}
        </T>
      </p>
      {current && !current.failed && (
        <ul>
          {current.hits.map((product) => (
            <li key={product.id}>
              <LocalizedClientLink
                href={`/products/${product.handle}`}
                prefetch={false}
                onClick={onClose}
                className="block rounded px-2 py-3 text-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e31c25]"
              >
                <span className="block font-medium">
                  <T>{product.title}</T>
                </span>
                {product.sku && (
                  <span className="text-xs text-[#62666a]">
                    <T>{product.sku}</T>
                  </span>
                )}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
      <LocalizedClientLink
        href={`/results/${encodeURIComponent(normalized)}`}
        prefetch={false}
        onClick={onClose}
        className="mt-2 block rounded bg-[#e31c25] px-3 py-3 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e31c25]"
      >
        <T>Tüm sonuçları gör</T>
      </LocalizedClientLink>
    </I18nElement>
  )
}
