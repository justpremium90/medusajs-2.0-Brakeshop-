import manifest from "@lib/data/performance-media.json"

type VideoAsset = { mobile: string; desktop: string; poster: string }
const images = manifest.images as Record<string, Record<string, string>>
const videos = manifest.videos as Record<string, VideoAsset>
const mediaOrigin = (
  process.env.NEXT_PUBLIC_PERFORMANCE_MEDIA_ORIGIN || ""
).replace(/\/$/, "")
const mediaUrl = (path: string) => `${mediaOrigin}${path}`
export type HeroVideoQuality = "original" | "balanced" | "economy"

// Exact originals only: changing the admin upload never leaves an old override.
export const getVideoAsset = (src?: string | null) => {
  const asset = src ? videos[src] : undefined
  return asset
    ? {
        mobile: mediaUrl(asset.mobile),
        desktop: mediaUrl(asset.desktop),
        poster: mediaUrl(asset.poster),
      }
    : undefined
}

export const getHeroVideoSource = (
  src: string | null,
  quality: HeroVideoQuality | undefined,
  isMobile: boolean
) => {
  if (!src || quality === "original") return src
  const asset = getVideoAsset(src)
  if (!asset) return src // A new admin upload never reuses another video's copy.
  if (quality === "balanced") return asset.desktop
  if (quality === "economy") return asset.mobile
  // Other shared carousels without a quality setting retain their old behavior.
  return isMobile ? asset.mobile : asset.desktop
}
export const getImageVariant = (src: string, width = 640) => {
  const variants = images[src]
  if (!variants) return src
  const widths = Object.keys(variants)
    .map(Number)
    .sort((a, b) => a - b)
  return mediaUrl(
    variants[
      String(widths.find((size) => size >= width) || widths[widths.length - 1])
    ]
  )
}
