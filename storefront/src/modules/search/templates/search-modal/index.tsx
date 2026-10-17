"use client"

import type { ProductSearchSuggestion } from "@lib/util/product-search"
import { fetchSearchSuggestions } from "@lib/util/search-suggestions"
import { toPublicPath } from "@lib/util/public-path"
import { MagnifyingGlassMini } from "@medusajs/icons"
import { useParams, useRouter } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"

export default function SearchModal() {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode?: string }
  const requestRef = useRef(0)
  const [query, setQuery] = useState("")
  const [hits, setHits] = useState<ProductSearchSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const normalizedQuery = query.trim()
    const requestId = ++requestRef.current

    if (normalizedQuery.length < 2) {
      setHits([])
      setLoading(false)
      setFailed(false)
      return
    }

    setLoading(true)
    setFailed(false)
    const timer = window.setTimeout(async () => {
      try {
        const results = await fetchSearchSuggestions(
          normalizedQuery,
          undefined,
          countryCode
        )
        if (requestRef.current === requestId) setHits(results)
      } catch {
        if (requestRef.current === requestId) {
          setHits([])
          setFailed(true)
        }
      } finally {
        if (requestRef.current === requestId) setLoading(false)
      }
    }, 180)

    return () => window.clearTimeout(timer)
  }, [query, countryCode])

  const showAll = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedQuery = String(
      new FormData(event.currentTarget).get("query") || ""
    ).trim()
    if (!normalizedQuery || !countryCode) return
    const nativeEvent = event.nativeEvent as Event & {
      agentInvoked?: boolean
      respondWith?: (result: Promise<unknown>) => void
    }
    if (nativeEvent.agentInvoked && nativeEvent.respondWith) {
      nativeEvent.respondWith(
        Promise.resolve({
          query: normalizedQuery,
          resultsUrl: `/${countryCode}/results/${encodeURIComponent(
            normalizedQuery
          )}`,
        })
      )
    }
    router.push(
      `/${countryCode}/results/${encodeURIComponent(normalizedQuery)}`
    )
  }

  return (
    <main className="bg-white px-4 py-8 text-[#3a080a] small:px-10 small:py-12">
      <section
        className="mx-auto flex w-full max-w-4xl flex-col gap-y-6"
        data-testid="search-modal-container"
      >
        <form
          className="flex h-14 w-full items-center gap-x-3 rounded-circle border border-[#3a080a] px-4 text-[#3a080a]"
          onSubmit={showAll}
          role="search"
          aria-label="Katalogda parça ara"
          {...{
            toolname: "search_products_page",
            tooldescription:
              "Search the Pip Garden outdoor furniture collection.",
            toolautosubmit: "",
            action: `/${countryCode}/search`,
            method: "get",
          }}
        >
          <MagnifyingGlassMini />
          <label className="sr-only" htmlFor="catalog-search-query">
            Ürün, koleksiyon veya malzeme
          </label>
          <input
            id="catalog-search-query"
            name="query"
            required
            {...{
              toolparamdescription:
                "Product, collection or material to search for.",
            }}
            autoFocus
            autoComplete="off"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#92706e]"
            data-testid="search-input"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Ürün, koleksiyon veya malzeme ile ara"
            type="search"
            value={query}
          />
          <button
            className="text-[12px] font-bold uppercase tracking-[.1em]"
            type="submit"
          >
            Tümünü gör
          </button>
        </form>

        {loading ? (
          <p className="text-sm text-[#765c5b]">Ürünler aranıyor…</p>
        ) : null}

        {!loading && failed ? (
          <p
            className="border border-[#8f090f]/25 p-5 text-sm"
            data-testid="no-search-results-container"
          >
            Arama servisine ulaşılamadı. Lütfen tekrar deneyin.
          </p>
        ) : null}

        {!loading && !failed && query.trim().length >= 2 && !hits.length ? (
          <p
            className="border border-black/10 p-5 text-sm"
            data-testid="no-search-results-container"
          >
            Sonuç bulunamadı. Farklı bir ürün adı veya malzeme deneyin.
          </p>
        ) : null}

        {hits.length ? (
          <ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            data-testid="search-results"
          >
            {hits.slice(0, 6).map((hit) => (
              <li key={hit.id}>
                <button
                  className="flex h-full w-full flex-col gap-3 border border-black/10 p-4 text-left transition hover:border-[#8f090f]"
                  data-testid="search-result"
                  onClick={() =>
                    router.push(
                      `/${countryCode}${toPublicPath(
                        `/products/${hit.handle}`
                      )}`
                    )
                  }
                  type="button"
                >
                  <span className="flex aspect-square w-full items-center justify-center bg-[#f5f5f3]">
                    {hit.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt=""
                        className="h-full w-full object-contain p-3"
                        src={hit.thumbnail}
                      />
                    ) : null}
                  </span>
                  <span
                    className="line-clamp-2 text-sm font-semibold"
                    data-testid="search-result-title"
                  >
                    {hit.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}
