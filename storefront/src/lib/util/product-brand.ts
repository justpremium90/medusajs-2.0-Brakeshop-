import type { HttpTypes } from "@medusajs/types"
import brands from "@lib/content/product-brands.json"

export const normalizeProductBrand = (value: string) =>
  value
    .toLocaleUpperCase("tr-TR")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/İ/g, "I")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim()

const aliases = brands
  .flatMap((brand) =>
    [brand.name, ...brand.aliases].map((name) => ({
      brand,
      alias: normalizeProductBrand(name),
    }))
  )
  .sort((a, b) => b.alias.length - a.alias.length)
const byName = new Map(aliases.map(({ brand, alias }) => [alias, brand]))

export const findBrandByName = (name: string) =>
  byName.get(normalizeProductBrand(name))

export const getProductBrandName = (product: HttpTypes.StoreProduct) => {
  const metadata = product.metadata || {}
  for (const key of ["source_brand", "brand", "manufacturer", "marka"]) {
    const value = metadata[key]
    if (typeof value === "string" && value.trim()) {
      return findBrandByName(value)?.name || value.trim()
    }
  }
  const collection = product.collection?.title
  if (collection && findBrandByName(collection))
    return findBrandByName(collection)!.name
  const title = ` ${normalizeProductBrand(product.title || "")} `
  return (
    aliases.find(({ alias }) => title.includes(` ${alias} `))?.brand.name || ""
  )
}
