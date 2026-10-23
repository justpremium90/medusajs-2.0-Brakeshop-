import { expect, test } from "@playwright/test"

test.use({
  viewport: { width: 375, height: 667 },
  isMobile: true,
  hasTouch: true,
  contextOptions: { reducedMotion: "no-preference" },
})

const home = process.env.QA_COMPAT_HOME || "/tr"
const store = process.env.QA_COMPAT_STORE || "/tr/store"

test("legacy Safari media listeners do not crash hydration; blocked film can be started", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.addInitScript(() => {
    const matchMedia = window.matchMedia.bind(window)
    window.matchMedia = (query: string) => {
      const media = matchMedia(query)
      if (!query.includes("prefers-reduced-motion")) return media
      return {
        get matches() { return media.matches },
        media: media.media,
        addListener: media.addListener.bind(media),
        removeListener: media.removeListener.bind(media),
      } as MediaQueryList
    }
    // Deterministically model a ready player whose autoplay is silently denied.
    // No YouTube request or real video playback is needed for this regression.
    const target = window as any
    target.__allowFilmPlayback = false
    target.YT = {
      Player: class {
        iframe: HTMLIFrameElement
        constructor(mount: HTMLElement, private options: any) {
          this.iframe = document.createElement("iframe")
          mount.replaceWith(this.iframe)
          setTimeout(() => options.events.onReady({ target: this }), 0)
        }
        mute() {}
        seekTo() {}
        getCurrentTime() { return 3 }
        getIframe() { return this.iframe }
        destroy() { this.iframe.remove() }
        playVideo() {
          if (target.__allowFilmPlayback)
            this.options.events.onStateChange({ target: this, data: 1 })
        }
        pauseVideo() {
          this.options.events.onStateChange({ target: this, data: 2 })
        }
      },
    }
  })
  await page.goto(home)
  await expect(page.getByText("Oynatmak için dokun", { exact: true })).toBeVisible()
  await page.evaluate(() => { (window as any).__allowFilmPlayback = true })
  await page.getByRole("button", { name: "Filmi oynat", exact: true }).click()
  await expect(page.locator(".garden-film")).toHaveAttribute("data-video-state", "playing")
  await page.getByRole("button", { name: "Filmi duraklat", exact: true }).click()
  await expect(page.locator(".garden-film")).toHaveAttribute("data-video-state", "paused")
  expect(errors).toEqual([])
})

test("product captions stay unboxed and long names do not cause horizontal scrolling", async ({ page }) => {
  await page.goto(store)
  const titles = page.locator('[data-testid="product-wrapper"] [data-testid="product-title"]')
  await expect(titles.first()).toBeVisible()
  // Exercise wrapping even when the current catalogue only has short names.
  await titles.first().evaluate((element) => {
    element.textContent = "LevanteVeryLongUnbrokenProductNameForSmallScreens".repeat(3)
  })
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    for (const title of await titles.all()) {
      await expect(title).toHaveCSS("background-color", "rgba(0, 0, 0, 0)")
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width + 1)
  }
})
