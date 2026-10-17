export type FooterSocialPlatform = "instagram" | "pinterest" | "tiktok"

export type FooterSocial = {
  platform: FooterSocialPlatform
  label: string
  url: string
  sort_order: number
}

const defaultSocials: FooterSocial[] = []

const isSupportedPlatform = (
  platform: string
): platform is FooterSocialPlatform => {
  return ["instagram", "pinterest", "tiktok"].includes(platform)
}

export const getFooterSocials = async (): Promise<FooterSocial[]> => {
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

  try {
    const response = await fetch(`${backendUrl}/store/footer-socials`, {
      headers: publishableKey
        ? { "x-publishable-api-key": publishableKey }
        : undefined,
      next: {
        revalidate: 60,
        tags: ["footer-socials"],
      },
    })

    if (!response.ok) {
      throw new Error("Footer social settings request failed")
    }

    const data = (await response.json()) as {
      socials?: Array<{
        platform?: string
        label?: string
        url?: string | null
        sort_order?: number
      }>
    }

    return (data.socials ?? [])
      .filter(
        (
          social
        ): social is typeof social & {
          platform: FooterSocialPlatform
          url: string
        } =>
          Boolean(
            social.platform &&
              isSupportedPlatform(social.platform) &&
              social.url &&
              !/sisterhood/i.test(social.url)
          )
      )
      .map((social) => ({
        platform: social.platform,
        label: social.label || social.platform,
        url: social.url,
        sort_order: social.sort_order ?? 0,
      }))
      .sort((a, b) => a.sort_order - b.sort_order)
  } catch (error) {
    return defaultSocials
  }
}
