import type { HttpTypes } from "@medusajs/types"

type SourceCategory = {
  name: string
  sourceHandle: string
}

type CompatibleVehicle = {
  brand: string
  model: string
  type: string
  power: string
}

type ProductCategory = {
  id?: string
  name?: string
  handle?: string
}

type ProductWithCategories = HttpTypes.StoreProduct & {
  categories?: ProductCategory[]
}

const PART_CATEGORY_PATTERN =
  /\b(fren|disk\w*|balata\w*|pabuc\w*|kampana\w*|kaliper\w*|set\w*|takim\w*)\b/i
const ROOT_CATEGORY_PATTERN = /^(anasayfa|yedek parca|tum urunler)$/i
const VEHICLE_STOP_WORDS = new Set([
  "adet",
  "arka",
  "fren",
  "icin",
  "model",
  "on",
  "parca",
  "serisi",
  "takim",
  "yedek",
])

const parseArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

export const normalizeVehicleText = (value: string) =>
  value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const getMetadata = (product: HttpTypes.StoreProduct) =>
  ((product as any).metadata || {}) as Record<string, unknown>

export const getSourceCategoryPath = (
  product: HttpTypes.StoreProduct
): SourceCategory[] => {
  return parseArray(getMetadata(product).source_category_path).flatMap(
    (rawCategory) => {
      if (!rawCategory || typeof rawCategory !== "object") return []

      const category = rawCategory as Record<string, unknown>
      const name = typeof category.name === "string" ? category.name.trim() : ""
      const sourceHandle =
        typeof category.sourceHandle === "string"
          ? category.sourceHandle.trim()
          : ""

      return name && sourceHandle ? [{ name, sourceHandle }] : []
    }
  )
}

const getVehicleCategoryPath = (product: HttpTypes.StoreProduct) =>
  getSourceCategoryPath(product).filter((category) => {
    const normalizedName = normalizeVehicleText(category.name)
    return (
      normalizedName &&
      !PART_CATEGORY_PATTERN.test(normalizedName) &&
      !ROOT_CATEGORY_PATTERN.test(normalizedName)
    )
  })

const getCompatibleVehicles = (
  product: HttpTypes.StoreProduct
): CompatibleVehicle[] => {
  return parseArray(getMetadata(product).compatible_vehicles).flatMap(
    (rawVehicle) => {
      if (!rawVehicle || typeof rawVehicle !== "object") return []

      const vehicle = rawVehicle as Record<string, unknown>
      const read = (key: string) => {
        const value = vehicle[key]
        return typeof value === "string" ? value.trim() : ""
      }
      const brand = read("brand")
      const model = read("model")

      return brand && model
        ? [
            {
              brand,
              model,
              type: read("type"),
              power: read("power"),
            },
          ]
        : []
    }
  )
}

const getVehicleKey = (vehicle: CompatibleVehicle) =>
  `${normalizeVehicleText(vehicle.brand)}|${normalizeVehicleText(
    vehicle.model
  )}`

const getDetailedVehicleKey = (vehicle: CompatibleVehicle) =>
  `${getVehicleKey(vehicle)}|${normalizeVehicleText(
    vehicle.type
  )}|${normalizeVehicleText(vehicle.power)}`

const getPartKind = (product: HttpTypes.StoreProduct) => {
  const value = normalizeVehicleText(
    [
      product.title,
      product.type?.value || "",
      ...getSourceCategoryPath(product).map((category) => category.name),
    ].join(" ")
  )

  if (/\bbalata\w*/.test(value)) return "pad"
  if (/\bdisk\w*/.test(value)) return "disc"
  return "other"
}

const getVehicleSignals = (product: HttpTypes.StoreProduct) => {
  const values = getVehicleCategoryPath(product)
    .slice(-2)
    .flatMap((category) => normalizeVehicleText(category.name).split(" "))

  return Array.from(new Set(values)).filter(
    (token) =>
      token.length >= 2 &&
      !VEHICLE_STOP_WORDS.has(token) &&
      !/^(19|20)\d{2}$/.test(token)
  )
}

export const getRelatedVehicleCategoryIds = (
  product: HttpTypes.StoreProduct
) => {
  const pathHandles = getRelatedVehicleCategoryHandles(product)
  const categories = (product as ProductWithCategories).categories || []

  return pathHandles.flatMap((handle) => {
    const category = categories.find(
      (candidate) => candidate.handle === handle && candidate.id
    )
    return category?.id ? [category.id] : []
  })
}

export const getRelatedVehicleCategoryHandles = (
  product: HttpTypes.StoreProduct
) => {
  const vehiclePath = getVehicleCategoryPath(product)

  // A manufacturer-only category (for example just "BMW") is not enough to
  // prove vehicle fitment. Require at least a brand and model/chassis level.
  if (vehiclePath.length < 2) return []

  return vehiclePath.map((category) => category.sourceHandle).reverse()
}

export const getRelatedVehicleSearchTerms = (
  product: HttpTypes.StoreProduct
) => {
  const vehicleTerms = getCompatibleVehicles(product).map((vehicle) =>
    `${vehicle.brand} ${vehicle.model}`.trim()
  )
  const categoryTerms = getVehicleCategoryPath(product)
    .slice(-2)
    .reverse()
    .map((category) => category.name)

  // Search the imported model/chassis category first. Compatible-vehicle
  // labels often include catalog-only suffixes such as "(_E15_)" that are
  // absent from product titles and therefore return no Store API results.
  return Array.from(new Set([...categoryTerms, ...vehicleTerms]))
    .filter((term) => normalizeVehicleText(term).length >= 3)
    .slice(0, 2)
}

const scoreCandidate = (
  current: HttpTypes.StoreProduct,
  candidate: HttpTypes.StoreProduct,
  anchoredProductIds: Set<string>
) => {
  let score = 0
  let hasReliableVehicleMatch = false

  if (candidate.id && anchoredProductIds.has(candidate.id)) {
    score += 180
    hasReliableVehicleMatch = true
  }

  const currentHandles = new Set(
    getVehicleCategoryPath(current).map((category) => category.sourceHandle)
  )
  const candidateHandles = getVehicleCategoryPath(candidate).map(
    (category) => category.sourceHandle
  )
  const sharedHandleCount = candidateHandles.filter((handle) =>
    currentHandles.has(handle)
  ).length

  if (sharedHandleCount) {
    score += 80 + sharedHandleCount * 25
    hasReliableVehicleMatch = true
  }

  const currentVehicles = getCompatibleVehicles(current)
  const candidateVehicles = getCompatibleVehicles(candidate)
  const currentVehicleKeys = new Set(currentVehicles.map(getVehicleKey))
  const currentDetailedVehicleKeys = new Set(
    currentVehicles.map(getDetailedVehicleKey)
  )
  const sharesVehicle = candidateVehicles.some((vehicle) =>
    currentVehicleKeys.has(getVehicleKey(vehicle))
  )
  const sharesDetailedVehicle = candidateVehicles.some((vehicle) =>
    currentDetailedVehicleKeys.has(getDetailedVehicleKey(vehicle))
  )

  if (sharesVehicle) {
    score += 180
    hasReliableVehicleMatch = true
  }
  if (sharesDetailedVehicle) score += 40

  const signals = getVehicleSignals(current)
  const candidateText = normalizeVehicleText(
    [
      candidate.title,
      ...getVehicleCategoryPath(candidate).map((category) => category.name),
    ].join(" ")
  )
  const matchedSignals = signals.filter((signal) =>
    new RegExp(`(^| )${signal}(?= |$)`).test(candidateText)
  )
  const hasChassisMatch = matchedSignals.some((signal) =>
    /^(?=.*[a-z])(?=.*\d)[a-z0-9-]{3,}$/.test(signal)
  )

  if (hasChassisMatch || (signals.length >= 2 && matchedSignals.length >= 2)) {
    score += 100 + matchedSignals.length * 10
    hasReliableVehicleMatch = true
  }

  if (!hasReliableVehicleMatch) return Number.NEGATIVE_INFINITY

  const currentPartKind = getPartKind(current)
  const candidatePartKind = getPartKind(candidate)

  if (
    (currentPartKind === "disc" && candidatePartKind === "pad") ||
    (currentPartKind === "pad" && candidatePartKind === "disc")
  ) {
    score += 30
  } else if (currentPartKind === candidatePartKind) {
    score += 12
  }

  if (getMetadata(candidate).source_in_stock === false) score -= 25

  return score
}

export const rankRelatedProducts = ({
  current,
  candidates,
  anchoredProductIds = new Set<string>(),
  limit = 4,
}: {
  current: HttpTypes.StoreProduct
  candidates: HttpTypes.StoreProduct[]
  anchoredProductIds?: Set<string>
  limit?: number
}) => {
  const uniqueCandidates = new Map<string, HttpTypes.StoreProduct>()

  for (const candidate of candidates) {
    if (candidate.id && candidate.id !== current.id) {
      uniqueCandidates.set(candidate.id, candidate)
    }
  }

  return Array.from(uniqueCandidates.values())
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(current, candidate, anchoredProductIds),
    }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

