"use client"

import { I18nElement } from "@lib/i18n/client"
import { useEffect, useState } from "react"
import useVisibleMedia from "@lib/hooks/use-visible-media"
import { getVideoAsset } from "@lib/util/performance-media"

export default function HeaderBackgroundVideo({ src }: { src: string }) {
  const { ref, visible, motionAllowed } = useVisibleMedia()
  const [mobile, setMobile] = useState(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const asset = getVideoAsset(src)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  useEffect(() => {
    setPlaying(false)
    if (!visible || !motionAllowed) {
      setReady(false)
      return
    }
    // Product imagery and navigation get the first network budget, not decoration.
    const timer = window.setTimeout(() => setReady(true), 1800)
    return () => window.clearTimeout(timer)
  }, [visible, motionAllowed, src, mobile])
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {asset?.poster ? (
        <I18nElement
          as="img"
          src={asset.poster}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {ready && visible && motionAllowed ? (
        <video
          key={`${src}-${mobile}`}
          src={asset ? (mobile ? asset.mobile : asset.desktop) : src}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={asset?.poster}
          onPlaying={() => setPlaying(true)}
          style={{ opacity: playing ? 1 : 0 }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
    </div>
  )
}
