import manifest from "@lib/data/garden-product-media.json"

type ProductMedia = {
  handle?: string | null
  thumbnail?: string | null
  images?: { url: string }[] | null
}
type Photo = { src: string; width: number; height: number }
const catalogue = manifest as Record<string, Photo[]>

/** Original catalogue photos precede Medusa's small thumbnail, without changing product data. */
export function getGardenProductImages(product: ProductMedia): string[] {
  const originals = product.handle ? catalogue[product.handle] || [] : []
  return Array.from(
    new Set(
      [
        ...originals.map((photo) => photo.src),
        ...(product.images || []).map((image) => image.url),
        product.thumbnail,
      ].filter(
        (url): url is string => typeof url === "string" && Boolean(url.trim())
      )
    )
  )
}
