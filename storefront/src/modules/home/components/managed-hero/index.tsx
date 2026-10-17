import HeroCarousel, { type HeroSlide } from "@modules/home/components/shared-hero-carousel"
import HeroSearchPanel from "@modules/home/components/hero-search-panel"
import slides from "./slides.json"

export default function ManagedHero() {
  return (
    <section className="relative z-0 w-full overflow-hidden bg-[#111211]">
      <HeroCarousel slides={slides as HeroSlide[]} ariaLabel="Brakeshop ana sayfa vitrin görselleri" className="bg-[#111211]" viewportClassName="h-[100svh] min-h-[560px]" />
      <HeroSearchPanel style="floating" />
    </section>
  )
}
