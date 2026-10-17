export type SiteShellMode = "classic" | "motorsport"
export type SiteShellNavigationMode = "horizontal" | "hamburger"
export type SiteShellNavbarStyle = "classic" | "unsection"
export type HeroSearchStyle =
  | "performance"
  | "minimal"
  | "technical"
  | "floating"

export type SiteShellSettings = {
  mode: SiteShellMode
  navigation_mode: SiteShellNavigationMode
  navbar_style: SiteShellNavbarStyle
  hero_search_style: HeroSearchStyle
  header_background_color: string
  brand_bar_background_color: string
  header_video_url: string
  brand_bar_video_url: string
  header_overlay_opacity: number
  brand_bar_overlay_opacity: number
}

const defaults: SiteShellSettings = {
  mode: "classic",
  navigation_mode: "horizontal",
  navbar_style: "classic",
  hero_search_style: "performance",
  header_background_color: "#111211",
  brand_bar_background_color: "#080909",
  header_video_url: "",
  brand_bar_video_url: "",
  header_overlay_opacity: 58,
  brand_bar_overlay_opacity: 42,
}

const color = (value: unknown, fallback: string) =>
  typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : fallback
const video = (value: unknown) =>
  typeof value === "string" && /^(https?:\/\/|\/)/i.test(value) ? value : ""
const opacity = (value: unknown, fallback: number) =>
  Number.isFinite(Number(value))
    ? Math.min(90, Math.max(0, Math.round(Number(value))))
    : fallback

const getBackendUrl = () => {
  return (
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"
  )
}

const getStoreHeaders = () => {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  return publishableKey
    ? {
        "x-publishable-api-key": publishableKey,
      }
    : undefined
}

export const getSiteShellSettings = async (): Promise<SiteShellSettings> => {
  try {
    const response = await fetch(`${getBackendUrl()}/store/site-shell`, {
      headers: getStoreHeaders(),
      next: {
        revalidate: 60,
        tags: ["site-shell"],
      },
    })

    if (!response.ok) {
      return defaults
    }

    const data = (await response.json()) as {
      settings?: Partial<SiteShellSettings>
    }

    return {
      mode: data.settings?.mode === "motorsport" ? "motorsport" : "classic",
      navigation_mode:
        data.settings?.navigation_mode === "hamburger"
          ? "hamburger"
          : "horizontal",
      navbar_style:
        data.settings?.navbar_style === "unsection" ? "unsection" : "classic",
      hero_search_style:
        data.settings?.hero_search_style === "minimal" ||
        data.settings?.hero_search_style === "technical" ||
        data.settings?.hero_search_style === "floating"
          ? data.settings.hero_search_style
          : "performance",
      header_background_color: color(
        data.settings?.header_background_color,
        defaults.header_background_color
      ),
      brand_bar_background_color: color(
        data.settings?.brand_bar_background_color,
        defaults.brand_bar_background_color
      ),
      header_video_url: video(data.settings?.header_video_url),
      brand_bar_video_url: video(data.settings?.brand_bar_video_url),
      header_overlay_opacity: opacity(
        data.settings?.header_overlay_opacity,
        defaults.header_overlay_opacity
      ),
      brand_bar_overlay_opacity: opacity(
        data.settings?.brand_bar_overlay_opacity,
        defaults.brand_bar_overlay_opacity
      ),
    }
  } catch {
    return defaults
  }
}
