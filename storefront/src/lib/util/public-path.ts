const aliases: Record<string, string> = {
  "/magaza": "/store", "/sepet": "/cart", "/odeme": "/checkout",
  "/hesabim": "/account", "/arama": "/search",
  "/fren-diskleri": "/results/fren%20diski",
  "/fren-balatalari": "/results/fren%20balatas%C4%B1",
}
export const stripCountryPrefix = (path: string) =>
  path.replace(/^\/[a-z]{2}(?=\/|$)/i, "") || "/"

export const toInternalPath = (value: string) => {
  if (!value.startsWith("/") || value.startsWith("//")) return value
  const match = value.match(/^([^?#]*)(.*)$/)!
  const path = stripCountryPrefix(match[1])
  const suffix = match[2]
  if (aliases[path]) return aliases[path] + suffix
  for (const [from, to] of [["/kategori", "/categories"], ["/urun", "/products"], ["/koleksiyon", "/collections"], ["/arama-sonuclari", "/results"]]) {
    if (path.startsWith(from + "/")) return to + path.slice(from.length) + suffix
  }
  return path + suffix
}
// The target continues to use the Medusa starter's country-prefixed URLs.
export const toPublicPath = toInternalPath
export const isLegacyPublicPath = (path: string) => toInternalPath(path) !== path
