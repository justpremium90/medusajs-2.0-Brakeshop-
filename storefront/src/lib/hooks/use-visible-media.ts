"use client"

import { useEffect, useRef, useState } from "react"
import { listenMediaQuery } from "@lib/util/listen-media-query"

// Posters render on the server; video waits until visibility is known.
export default function useVisibleMedia() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [motionAllowed, setMotionAllowed] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let intersecting = typeof IntersectionObserver === "undefined"
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setVisible(intersecting && !document.hidden)
      setMotionAllowed(!motion.matches)
    }
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              intersecting = entry.isIntersecting
              update()
            },
            { threshold: 0.01 }
          )
        : null
    observer?.observe(element)
    const stopListening = listenMediaQuery(motion, update)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      observer?.disconnect()
      stopListening()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])
  return { ref, visible, motionAllowed }
}
