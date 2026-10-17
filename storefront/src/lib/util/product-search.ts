export type SearchableProductHit = {
  id?: string
  objectID?: string
  title?: string | null
  description?: string | null
  handle?: string | null
  variant_sku?: string | string[] | null
  product_type?: string | string[] | null
  vehicle_search?: string | null
  oem_search?: string | null
  brand_search?: string | null
  category_search?: string | null
}

export type ProductSearchSuggestion = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  sku: string | null
}

const decodeSearchValue = (value: unknown) => {
  const text = String(value ?? "")
  try {
    return decodeURIComponent(text)
  } catch {
    return text
  }
}

const normalize = (value: unknown) =>
  decodeSearchValue(value)
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const typeAliases = {
  balata: ["balata", "balatasi", "pad", "pads"],
  disk: ["disk", "diski", "rotor"],
} as const

type ProductType = keyof typeof typeAliases

const words = (value: unknown) => normalize(value).split(/\s+/).filter(Boolean)

const queryProductTypes = (query: string): ProductType[] => {
  const queryWords = new Set(words(query))
  return (Object.keys(typeAliases) as ProductType[]).filter((type) =>
    typeAliases[type].some((alias) => queryWords.has(alias))
  )
}

const hitProductTypes = (hit: SearchableProductHit): Set<ProductType> => {
  const titleWords = new Set(words(hit.title))
  const titleTypes = new Set(
    (Object.keys(typeAliases) as ProductType[]).filter((type) =>
      typeAliases[type].some((alias) => titleWords.has(alias))
    )
  )

  // A combined "disk ve balata" category must not turn a disk-only product
  // into a balata result. The product title is the authoritative type signal.
  if (titleTypes.size) return titleTypes

  const explicit = Array.isArray(hit.product_type)
    ? hit.product_type
    : [hit.product_type]
  const haystack = new Set([
    ...explicit.flatMap(words),
    ...words(hit.title),
    ...words(hit.category_search),
  ])

  return new Set(
    (Object.keys(typeAliases) as ProductType[]).filter((type) =>
      typeAliases[type].some((alias) => haystack.has(alias))
    )
  )
}

// Chassis/model codes such as W205, E90, 8V and 5G must match a product's
// high-confidence fields. This prevents a generic SEO description from
// admitting an unrelated product.
const queryCodes = (query: string) =>
  Array.from(
    new Set(
      words(query).filter(
        (word) =>
          /[a-z]/.test(word) &&
          /\d/.test(word) &&
          word.length >= 2 &&
          word.length <= 16
      )
    )
  )

// For a chassis-code search (for example, "W205 balata"), searching the
// distinctive code first gives the filter the complete vehicle-specific pool;
// the requested product type is then enforced locally below.
export const buildProductSearchEngineQuery = (query: string) => {
  const decodedQuery = decodeSearchValue(query).trim()
  const requestedTypes = queryProductTypes(decodedQuery)

  // A standalone alphanumeric value is usually an SKU/OEM reference. Keep
  // every separator and segment so 09.C405.13 does not degrade into C405.
  if (!requestedTypes.length) return decodedQuery

  const codes = queryCodes(decodedQuery)
  return codes.length ? codes.join(" ") : decodedQuery
}

const primaryText = (hit: SearchableProductHit) =>
  normalize(
    [
      hit.title,
      hit.handle,
      Array.isArray(hit.variant_sku)
        ? hit.variant_sku.join(" ")
        : hit.variant_sku,
      hit.vehicle_search,
      hit.oem_search,
      hit.brand_search,
      hit.category_search,
    ].join(" ")
  )

const normalizedSkus = (hit: SearchableProductHit) =>
  (Array.isArray(hit.variant_sku) ? hit.variant_sku : [hit.variant_sku])
    .map(normalize)
    .filter(Boolean)

const relevanceScore = (query: string, hit: SearchableProductHit) => {
  const queryText = normalize(query)
  const queryWords = words(query)
  const title = normalize(hit.title)
  const skus = normalizedSkus(hit)
  const primary = primaryText(hit)
  let score = 0

  if (skus.some((sku) => sku === queryText)) score += 25_000
  else if (skus.some((sku) => sku.includes(queryText))) score += 8_000
  if (title === queryText) score += 5_000
  if (title.includes(queryText)) score += 1_000
  for (const word of queryWords) {
    if (title.split(" ").includes(word)) score += 80
    else if (title.includes(word)) score += 35
    else if (primary.includes(word)) score += 15
  }

  return score
}

export function refineProductSearchHits<T extends SearchableProductHit>(
  query: string,
  hits: T[]
): T[] {
  const queryText = normalize(query)
  const exactSkuHits = hits.filter((hit) =>
    normalizedSkus(hit).some((sku) => sku === queryText)
  )

  // An exact SKU is unambiguous. Do not bury it among partial matches.
  if (exactSkuHits.length) return exactSkuHits

  const requestedTypes = queryProductTypes(query)
  // Only apply chassis-code filtering when the user also stated the wanted
  // product type. A raw SKU/OEM query must remain intact and rank by SKU.
  const requiredCodes = requestedTypes.length ? queryCodes(query) : []

  return hits
    .map((hit, index) => ({ hit, index, score: relevanceScore(query, hit) }))
    .filter(({ hit }) => {
      const types = hitProductTypes(hit)
      if (requestedTypes.some((type) => !types.has(type))) return false

      const primary = ` ${primaryText(hit)} `
      return requiredCodes.every((code) => primary.includes(` ${code} `))
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ hit }) => hit)
}
