"use client"

import { T, I18nElement } from "@lib/i18n/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WhatsAppContactButton from "@modules/common/components/whatsapp-contact-button"
import {
  CSSProperties,
  MouseEvent,
  TouchEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react"

import HeroMedia from "./hero-media"
import useVisibleMedia from "@lib/hooks/use-visible-media"
import type { HeroVideoQuality } from "@lib/util/performance-media"
import { getHeroSlideDuration } from "@lib/util/hero-slide-duration"

export type HeroSlide = {
  id: string
  title: string
  cta_label: string | null
  cta_url: string | null
  image_url: string | null
  mobile_image_url: string | null
  video_url: string | null
  mobile_video_url: string | null
  video_quality?: HeroVideoQuality
  mobile_video_quality?: HeroVideoQuality
  slide_duration_ms?: number | null
  slide_timing_mode?: "video" | "fixed" | null
  mobile_video_position: "top" | "center" | "bottom" | null
  video_rotation?: number | null
  mobile_video_rotation?: number | null
}

type HeroCarouselProps = {
  slides: HeroSlide[]
  ariaLabel?: string
  className?: string
  viewportClassName?: string
  viewportStyle?: CSSProperties
}

const SWIPE_THRESHOLD = 42
const HERO_FADE_MS = 700
const VIDEO_START_OR_STALL_TIMEOUT_MS = 15000
const whatsappMessage =
  "Merhaba, bahçe mobilyalarınız hakkında bilgi almak istiyorum."

const HeroCarousel = ({
  slides,
  ariaLabel = "Ana sayfa vitrin görselleri",
  className = "bg-[#d8e9f7]",
  viewportClassName = "min-h-[420px] small:aspect-[1920/733] small:min-h-0",
  viewportStyle,
}: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const previousIndex = useRef(activeIndex)
  const activeSlideDuration = getHeroSlideDuration(
    slides[activeIndex]?.slide_duration_ms
  )
  const activeSlide = slides[activeIndex]
  const activeUsesFullVideo =
    activeSlide?.slide_timing_mode === "video" &&
    Boolean(activeSlide?.video_url || activeSlide?.mobile_video_url)
  const { ref, visible, motionAllowed } = useVisibleMedia()
  const useVideoTiming = activeUsesFullVideo && motionAllowed
  const touchStartX = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex
  const videoWatchdog = useRef<number | null>(null)

  useLayoutEffect(() => {
    if (previousIndex.current === activeIndex) return
    // Keep the previous video mounted until its exit transition finishes.
    setOutgoingIndex(previousIndex.current)
    previousIndex.current = activeIndex
    const timer = window.setTimeout(
      () => setOutgoingIndex(null),
      motionAllowed ? HERO_FADE_MS : 200
    )
    return () => window.clearTimeout(timer)
  }, [activeIndex, motionAllowed])

  const clearVideoWatchdog = useCallback(() => {
    if (videoWatchdog.current !== null) {
      window.clearTimeout(videoWatchdog.current)
      videoWatchdog.current = null
    }
  }, [])

  const advanceIfActive = useCallback(
    (slideIndex: number) => {
      if (activeIndexRef.current !== slideIndex) return
      clearVideoWatchdog()
      setActiveIndex((current) =>
        current === slideIndex ? (current + 1) % slides.length : current
      )
    },
    [clearVideoWatchdog, slides.length]
  )

  const armVideoWatchdog = useCallback(
    (slideIndex: number, timeout = VIDEO_START_OR_STALL_TIMEOUT_MS) => {
      // A paused previous video can reject an outstanding play() promise.
      // Never let that stale callback clear the current slide's watchdog.
      if (activeIndexRef.current !== slideIndex) return
      clearVideoWatchdog()
      videoWatchdog.current = window.setTimeout(
        () => advanceIfActive(slideIndex),
        timeout
      )
    },
    [advanceIfActive, clearVideoWatchdog]
  )

  useEffect(() => {
    if (slides.length < 2) return

    if (useVideoTiming) {
      // Playback progress continually rearms this watchdog. A failed start or
      // a network stall can never trap the carousel on one slide.
      armVideoWatchdog(activeIndex)
      return clearVideoWatchdog
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, activeSlideDuration)

    return () => window.clearTimeout(timeout)
  }, [
    activeIndex,
    activeSlideDuration,
    useVideoTiming,
    armVideoWatchdog,
    clearVideoWatchdog,
    slides.length,
  ])

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0)
  }, [activeIndex, slides.length])

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    )
  }

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return

    const distance =
      (event.changedTouches[0]?.clientX ?? touchStartX.current) -
      touchStartX.current
    touchStartX.current = null

    if (Math.abs(distance) < SWIPE_THRESHOLD) return

    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 500)

    if (distance > 0) showPrevious()
    else showNext()
  }

  const handleTouchCancel = () => {
    touchStartX.current = null
  }

  const handleClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (suppressClick.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressClick.current = false
    }
  }

  return (
    <I18nElement
      as="section"
      ref={ref}
      className={`relative w-full touch-pan-y overflow-hidden ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClickCapture={handleClickCapture}
    >
      <div
        className={`relative w-full ${viewportClassName}`}
        style={viewportStyle}
      >
        {slides.map((hero, index) => {
          const isActive = index === activeIndex
          const isOutgoing = index === outgoingIndex
          const isNext =
            slides.length > 1 && index === (activeIndex + 1) % slides.length
          const playFullVideo =
            motionAllowed &&
            hero.slide_timing_mode === "video" &&
            Boolean(hero.video_url || hero.mobile_video_url)

          return (
            <LocalizedClientLink
              key={hero.id}
              href={hero.cta_url || "/store"}
              aria-label={hero.cta_label || hero.title || "Mağazayı keşfet"}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              style={{
                transitionDuration: `${motionAllowed ? HERO_FADE_MS : 200}ms`,
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                transform: `scale(${!motionAllowed || isActive ? 1 : 1.012})`,
              }}
              className={`absolute inset-0 block transition-[opacity,transform] ${
                isActive
                  ? "z-[2] opacity-100"
                  : isOutgoing
                  ? "pointer-events-none z-[1] opacity-0"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            >
              <HeroMedia
                imageUrl={hero.image_url}
                mobileImageUrl={hero.mobile_image_url}
                videoUrl={hero.video_url}
                mobileVideoUrl={hero.mobile_video_url}
                videoQuality={hero.video_quality}
                mobileVideoQuality={hero.mobile_video_quality}
                mobileVideoPosition={hero.mobile_video_position}
                videoRotation={hero.video_rotation}
                mobileVideoRotation={hero.mobile_video_rotation}
                active={isActive}
                priority={index === 0}
                loadVideo={
                  visible && motionAllowed && (isActive || isNext || isOutgoing)
                }
                preload={isActive ? "auto" : isNext ? "metadata" : "none"}
                playFullVideo={playFullVideo}
                onPlaybackProgress={
                  playFullVideo ? () => armVideoWatchdog(index) : undefined
                }
                onPlaybackEnded={
                  playFullVideo ? () => advanceIfActive(index) : undefined
                }
                onPlaybackUnavailable={
                  playFullVideo
                    ? () => armVideoWatchdog(index, activeSlideDuration)
                    : undefined
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10" />
              <div className="absolute bottom-[14%] left-[6%] max-w-[760px] pr-6 text-white">
                <p className="mb-4 text-[10px] uppercase tracking-[.24em] small:text-xs">
                  <T>Pip Garden / Dışarıda yaşam</T>
                </p>
                <h2 className="text-[46px] font-semibold leading-[1.02] tracking-[-.04em] small:text-[74px] large:text-[90px]">
                  <T>{hero.title}</T>
                </h2>
                <span className="mt-7 inline-flex border-b border-white pb-2 text-xs font-semibold uppercase tracking-[.12em]">
                  <T>{hero.cta_label}</T> <span className="ml-8">→</span>
                </span>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 small:bottom-6">
          <I18nElement
            as="div"
            className="flex items-center justify-center gap-3 rounded-full bg-black/10 px-3 py-2 backdrop-blur-[2px]"
            role="group"
            aria-label={`${ariaLabel} slaytları`}
          >
            {slides.map((hero, index) => {
              const isActive = index === activeIndex

              return (
                <I18nElement
                  as="button"
                  key={`indicator-${hero.id}`}
                  type="button"
                  aria-label={`${index + 1}. slaytı göster: ${hero.title}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                  className="flex h-5 w-5 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90"
                >
                  <span
                    className={`block h-2 w-2 rounded-full border border-white shadow-[0_1px_5px_rgba(0,0,0,0.35)] transition-[background-color,transform] duration-300 ${
                      isActive
                        ? "scale-125 bg-white"
                        : "bg-white/25 hover:bg-white/70"
                    }`}
                  />
                </I18nElement>
              )
            })}
          </I18nElement>

          <WhatsAppContactButton
            label="İletişime geç"
            message={whatsappMessage}
            className="h-9 w-9 rounded-full border border-white/30 bg-[#25D366]/95 p-0 text-white shadow-[0_8px_24px_rgba(0,0,0,.24)] backdrop-blur-sm transition hover:bg-[#20bd5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/90 [&>svg]:h-[18px] [&>svg]:w-[18px] [&>span]:hidden small:hidden"
          />
        </div>
      ) : null}
    </I18nElement>
  )
}

export default HeroCarousel
