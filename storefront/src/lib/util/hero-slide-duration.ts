export const DEFAULT_HERO_SLIDE_DURATION_MS = 8000
const MIN_HERO_SLIDE_DURATION_MS = 2000
const MAX_HERO_SLIDE_DURATION_MS = 60000

export const getHeroSlideDuration = (value?: number | null) => {
  const duration = Number(value)

  if (!Number.isFinite(duration)) return DEFAULT_HERO_SLIDE_DURATION_MS

  return Math.min(
    MAX_HERO_SLIDE_DURATION_MS,
    Math.max(MIN_HERO_SLIDE_DURATION_MS, Math.round(duration))
  )
}
