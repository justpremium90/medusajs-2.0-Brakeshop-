import catalog from "./catalog-search.json"
export const normalizeSearch = (value: string) =>
  value
    .toLocaleLowerCase("tr")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g, "")
    .replace(/ı/g, "i")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
export function translatedSearchHandles(query: string): string[] {
  try {
    query = decodeURIComponent(query)
  } catch {}
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean)
  return catalog
    .filter((row) => {
      const text = normalizeSearch(row.text)
      return words.every(
        (word) =>
          text.includes(word) ||
          (word.length > 3 &&
            ((word.endsWith("s") && text.includes(word.slice(0, -1))) ||
              (word.startsWith("ال") && text.includes(word.slice(2)))))
      )
    })
    .map((row) => row.handle)
}
