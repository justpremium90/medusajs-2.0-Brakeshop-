"use client"

import { PointerEvent, useEffect, useRef, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

type VehicleBrandLink = {
  label: string
  href: string
  logo?: string
}

type Props = {
  items: VehicleBrandLink[]
  ariaLabel?: string
  scrollLabel?: string
  appearance?: "navbar" | "category"
}

const SCROLL_AMOUNT = 520
const DRAG_THRESHOLD = 6

const VehicleBrandRail = ({
  items,
  ariaLabel = "Araç markaları",
  scrollLabel = "Araç markalarını",
  appearance = "navbar",
}: Props) => {
  const isCategory = appearance === "category"
  const railRef = useRef<HTMLElement>(null)
  const dragStartX = useRef(0)
  const dragStartScrollLeft = useRef(0)
  const activePointerId = useRef<number | null>(null)
  const dragged = useRef(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const updateScrollState = () => {
    const rail = railRef.current

    if (!rail) return

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth
    setCanScrollLeft(rail.scrollLeft > 2)
    setCanScrollRight(rail.scrollLeft < maxScrollLeft - 2)
  }

  useEffect(() => {
    const rail = railRef.current

    if (!rail) return

    updateScrollState()
    rail.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      rail.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [items])

  const scrollBy = (left: number) => {
    railRef.current?.scrollBy({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    // A new gesture must not inherit click suppression from an earlier drag.
    dragged.current = false
    activePointerId.current = null
    setIsDragging(false)
    if (
      event.pointerType !== "mouse" ||
      event.button !== 0 ||
      !event.isPrimary ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const rail = railRef.current
    if (!rail) return

    dragStartX.current = event.clientX
    dragStartScrollLeft.current = rail.scrollLeft
    activePointerId.current = event.pointerId
    // Keep ordinary clicks targeted at the link. Capture only after a drag
    // crosses the threshold, otherwise Chromium retargets the click to nav.
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      activePointerId.current !== event.pointerId ||
      event.pointerType !== "mouse"
    )
      return

    if ((event.buttons & 1) === 0) {
      endDrag(event)
      return
    }

    const rail = railRef.current
    if (!rail) return

    const distance = event.clientX - dragStartX.current

    if (!dragged.current) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return
      dragged.current = true
      setIsDragging(true)
      rail.setPointerCapture(event.pointerId)
    }

    event.preventDefault()
    rail.scrollLeft = dragStartScrollLeft.current - distance
  }

  const endDrag = (event: PointerEvent<HTMLElement>) => {
    if (activePointerId.current !== event.pointerId) return

    activePointerId.current = null
    const rail = railRef.current
    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId)
    }
    setIsDragging(false)
  }

  const handleClickCapture = (event: React.MouseEvent<HTMLElement>) => {
    // Keyboard/assistive activation is never a mouse drag.
    if (!dragged.current || event.detail === 0) return

    event.preventDefault()
    event.stopPropagation()
    dragged.current = false
  }

  return (
    <div
      className={`relative mx-auto max-w-[1800px] ${
        isCategory ? "" : "small:flex"
      }`}
    >
      {!isCategory ? (
        <div className="hidden h-12 w-[142px] shrink-0 items-center border-r border-white/10 px-7 text-[10px] font-bold uppercase tracking-[.18em] text-white/45 large:flex">
          Markaya göre
        </div>
      ) : null}
      <div className="relative min-w-0 flex-1">
        <button
          type="button"
          aria-label={`${scrollLabel} sola kaydır`}
          onClick={() => scrollBy(-SCROLL_AMOUNT)}
          disabled={!canScrollLeft}
          className={`absolute left-2 top-1/2 z-20 ${
            isCategory ? "flex h-11 w-11" : "hidden h-8 w-8 large:flex"
          } -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-xl leading-none text-white shadow-lg backdrop-blur-md transition-[background-color,border-color,opacity] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            canScrollLeft
              ? "hover:border-white/60 hover:bg-black/75"
              : "pointer-events-none opacity-0"
          }`}
        >
          ‹
        </button>

        <nav
          ref={railRef}
          className={`flex ${
            isCategory
              ? "h-16 gap-2 px-3 small:h-[72px] small:px-14"
              : "h-12 gap-2 px-4 small:px-5 large:px-12"
          } items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isDragging ? "cursor-grabbing select-none" : "large:cursor-grab"
          }`}
          aria-label={ariaLabel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={(event) => {
            if (activePointerId.current !== event.pointerId) return
            dragged.current = false
            endDrag(event)
          }}
          onPointerLeave={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId))
              endDrag(event)
          }}
          onLostPointerCapture={endDrag}
          onClickCapture={handleClickCapture}
        >
          {items.map((item) => (
            <LocalizedClientLink
              key={item.href}
              href={item.href}
              prefetch={isCategory ? false : undefined}
              draggable={false}
              className={`flex ${
                isCategory ? "h-11" : "h-8"
              } shrink-0 items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3.5 text-[11px] font-bold uppercase tracking-[.09em] text-white/82 backdrop-blur-[3px] transition-[background-color,border-color,color] duration-200 hover:border-[#ef3b42] hover:bg-[#ef3b42] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white small:px-4 small:text-[11px]`}
            >
              {item.logo && (
                <img
                  src={item.logo}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  className="h-5 w-7 shrink-0 object-contain brightness-0 invert"
                  loading="lazy"
                />
              )}
              <span>{item.label}</span>
            </LocalizedClientLink>
          ))}
        </nav>

        <button
          type="button"
          aria-label={`${scrollLabel} sağa kaydır`}
          onClick={() => scrollBy(SCROLL_AMOUNT)}
          disabled={!canScrollRight}
          className={`absolute right-2 top-1/2 z-20 ${
            isCategory ? "flex h-11 w-11" : "hidden h-8 w-8 large:flex"
          } -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/65 text-xl leading-none text-white shadow-lg backdrop-blur-md transition-[background-color,border-color,opacity] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            canScrollRight
              ? "hover:border-white/60 hover:bg-black/75"
              : "pointer-events-none opacity-0"
          }`}
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default VehicleBrandRail
