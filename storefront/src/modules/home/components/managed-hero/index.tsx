import HeroCarousel, {
  type HeroSlide,
} from "@modules/home/components/shared-hero-carousel"
import slides from "./slides.json"
export default function ManagedHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#111211]">
      <HeroCarousel
        slides={slides as HeroSlide[]}
        ariaLabel="Pip Garden bahçe koleksiyonu"
        viewportClassName="h-[92svh] min-h-[640px] small:min-h-[700px]"
      />
    </section>
  )
}
