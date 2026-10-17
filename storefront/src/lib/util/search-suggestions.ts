import type { ProductSearchSuggestion } from "./product-search"

const recent = new Map<
  string,
  { at: number; hits: ProductSearchSuggestion[] }
>()

export async function fetchSearchSuggestions(
  query: string,
  signal?: AbortSignal,
  countryCode?: string
) {
  const normalized = query.trim()
  const cached = recent.get(`${countryCode}:${normalized}`)
  if (cached && Date.now() - cached.at < 10000) return cached.hits
  const controller = new AbortController()
  const abort = () => controller.abort()
  if (signal?.aborted) controller.abort()
  signal?.addEventListener("abort", abort, { once: true })
  const timeout = setTimeout(abort, 12000)
  try {
    const response = await fetch(
      `/api/search?q=${encodeURIComponent(normalized)}&country=${encodeURIComponent(countryCode || "")}`,
      {
        signal: controller.signal,
      }
    )
    if (!response.ok) throw new Error("Search unavailable")
    const { hits } = (await response.json()) as {
      hits: ProductSearchSuggestion[]
    }
    if (recent.size >= 30) recent.delete(recent.keys().next().value!)
    recent.set(`${countryCode}:${normalized}`, { at: Date.now(), hits })
    return hits
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener("abort", abort)
  }
}
