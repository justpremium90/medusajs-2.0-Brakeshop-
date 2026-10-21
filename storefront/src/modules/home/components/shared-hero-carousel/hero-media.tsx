"use client"

import { I18nElement } from "@lib/i18n/client"
import type { CSSProperties, SyntheticEvent } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  getImageVariant,
  getVideoAsset,
  getHeroVideoSource,
  type HeroVideoQuality,
} from "@lib/util/performance-media"

type HeroMediaProps = {
  imageUrl: string | null
  mobileImageUrl: string | null
  videoUrl: string | null
  mobileVideoUrl: string | null
  videoQuality?: HeroVideoQuality
  mobileVideoQuality?: HeroVideoQuality
  mobileVideoPosition: "top" | "center" | "bottom" | null
  videoRotation?: number | null
  mobileVideoRotation?: number | null
  active?: boolean
  priority?: boolean
  loadVideo?: boolean
  preload?: "auto" | "metadata" | "none"
  playFullVideo?: boolean
  onPlaybackProgress?: () => void
  onPlaybackEnded?: () => void
  onPlaybackUnavailable?: () => void
}
const rotation = (value?: number | null) =>
  [90, 180, 270].includes(value || 0) ? value! : 0
const mediaStyle = (angle: number, objectPosition: string): CSSProperties => ({
  height: angle === 90 || angle === 270 ? "100cqw" : "100%",
  width: angle === 90 || angle === 270 ? "100cqh" : "100%",
  maxHeight: "none",
  maxWidth: "none",
  left: "50%",
  top: "50%",
  objectPosition,
  transform: `translate(-50%, -50%) rotate(${angle}deg)`,
  transformOrigin: "center",
})

export default function HeroMedia({
  imageUrl,
  mobileImageUrl,
  videoUrl,
  mobileVideoUrl,
  videoQuality,
  mobileVideoQuality,
  mobileVideoPosition,
  videoRotation,
  mobileVideoRotation,
  active = true,
  priority = false,
  loadVideo = false,
  preload = "auto",
  playFullVideo = false,
  onPlaybackProgress,
  onPlaybackEnded,
  onPlaybackUnavailable,
}: HeroMediaProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active
  const lastReportedTime = useRef(-1)
  const resumeTimes = useRef<Record<string, number>>({})
  const desktopAsset = getVideoAsset(videoUrl)
  const mobileAsset = getVideoAsset(mobileVideoUrl || videoUrl)
  const desktopPoster = imageUrl
    ? getImageVariant(imageUrl, 1280)
    : desktopAsset?.poster
  const mobilePoster = mobileImageUrl
    ? getImageVariant(mobileImageUrl, 640)
    : mobileAsset?.poster || desktopPoster
  const selectedSource = isMobile ? mobileVideoUrl || videoUrl : videoUrl
  const src = getHeroVideoSource(
    selectedSource,
    isMobile ? mobileVideoQuality : videoQuality,
    isMobile === true
  )
  const angle = rotation(
    isMobile && mobileVideoUrl ? mobileVideoRotation : videoRotation
  )
  const style = mediaStyle(
    angle,
    isMobile ? mobileVideoPosition || "bottom" : "center"
  )
  const poster = isMobile ? mobilePoster : desktopPoster || mobilePoster

  const rememberProgress = useCallback(
    (video: HTMLVideoElement | null) => {
      if (!video || !src || playFullVideo) return

      const currentTime = video.currentTime
      if (Number.isFinite(currentTime) && currentTime > 0) {
        resumeTimes.current[src] = currentTime
      }
    },
    [playFullVideo, src]
  )

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  useEffect(() => {
    setPlaying(false)
    if (!loadVideo) {
      rememberProgress(videoRef.current)
      setStarted(false)
      return
    }
    // Leave the first connection/CPU budget to the poster, logo and search UI.
    const timer = window.setTimeout(() => setStarted(true), priority ? 900 : 0)
    return () => window.clearTimeout(timer)
  }, [loadVideo, src, priority, rememberProgress])
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.play().catch(() => {
        // Keep the poster and let the carousel use its configured fallback.
        if (activeRef.current) onPlaybackUnavailable?.()
      })
    }

    if (active) {
      if (playFullVideo) {
        lastReportedTime.current = -1
        video.currentTime = 0
        play()
        return
      }

      const resumeAt = src ? resumeTimes.current[src] || 0 : 0
      if (resumeAt > 0 && video.readyState < 1) {
        const resumeAndPlay = () => {
          video.currentTime = resumeAt
          play()
        }

        video.addEventListener("loadedmetadata", resumeAndPlay, { once: true })
        return () => video.removeEventListener("loadedmetadata", resumeAndPlay)
      }

      if (resumeAt > 0) video.currentTime = resumeAt
      play()
      return
    }

    rememberProgress(video)
    video.pause()
  }, [
    active,
    started,
    src,
    playFullVideo,
    onPlaybackUnavailable,
    rememberProgress,
  ])

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    const currentTime = event.currentTarget.currentTime
    rememberProgress(event.currentTarget)

    // Some browsers emit repeated timeupdate events at 0 while a request is
    // stalled. Only real forward movement may extend the stall watchdog.
    if (currentTime - lastReportedTime.current < 0.25) return

    lastReportedTime.current = currentTime
    onPlaybackProgress?.()
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ containerType: "size" }}
    >
      {desktopPoster || mobilePoster ? (
        <picture>
          {mobilePoster ? (
            <source media="(max-width: 767px)" srcSet={mobilePoster} />
          ) : null}
          <I18nElement
            as="img"
            src={desktopPoster || mobilePoster}
            alt=""
            loading={priority || loadVideo ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="absolute object-cover"
            style={selectedSource ? style : { width: "100%", height: "100%" }}
          />
        </picture>
      ) : null}
      {started && isMobile !== null && src ? (
        <video
          key={src}
          ref={videoRef}
          data-resume-progress="2026-10-02"
          src={src}
          className="absolute object-cover transition-opacity duration-500 motion-reduce:duration-200"
          style={{ ...style, opacity: playing ? 1 : 0 }}
          autoPlay={active}
          loop={!playFullVideo}
          muted
          playsInline
          preload={preload}
          poster={poster}
          onPlaying={() => {
            setPlaying(true)
            onPlaybackProgress?.()
          }}
          onTimeUpdate={handleTimeUpdate}
          onPause={(event) => rememberProgress(event.currentTarget)}
          onEnded={onPlaybackEnded}
          onError={onPlaybackUnavailable}
        />
      ) : null}
    </div>
  )
}
