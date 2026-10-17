export const PRODUCT_LISTING_LIMIT = 20

export const parseListingPage = (value: unknown): number | null => {
  if (value === undefined) return 1
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null
  const page = Number(value)
  return Number.isSafeInteger(page) && page <= Math.floor(Number.MAX_SAFE_INTEGER / PRODUCT_LISTING_LIMIT)
    ? page : null
}

export const isListingPageInRange = (page: number, count: number) =>
  Number.isSafeInteger(page) && page >= 1 &&
  page <= Math.max(1, Math.ceil(count / PRODUCT_LISTING_LIMIT))
