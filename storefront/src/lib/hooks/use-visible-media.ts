"use client"

import { useEffect, useRef, useState } from "react"

// Posters render on the server; video waits until visibility is known.
export default function useVisibleMedia() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [motionAllowed, setMotionAllowed] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let intersecting = false
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setVisible(intersecting && !document.hidden)
      setMotionAllowed(!motion.matches)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting
        update()
      },
      { threshold: 0.01 }
    )
    observer.observe(element)
    motion.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    update()
    return () => {
      observer.disconnect()
      motion.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
    }
  }, [])
  return { ref, visible, motionAllowed }
}
