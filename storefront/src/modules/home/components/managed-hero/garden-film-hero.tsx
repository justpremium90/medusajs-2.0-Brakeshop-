"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { useEffect, useRef, useState } from "react"
import useVisibleMedia from "@lib/hooks/use-visible-media"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { loadYouTubeAPI, type YouTubePlayer } from "./youtube-api"
import film from "./film.json"
import "./garden-film-hero.css"

const sourceURL = `https://www.youtube.com/watch?v=${film.videoId}&t=${film.startSeconds}s`

export default function GardenFilmHero() {
  const { ref, visible, motionAllowed } = useVisibleMedia()
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [started, setStarted] = useState(false)
  const [ready, setReady] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [failed, setFailed] = useState(false)
  const [loops, setLoops] = useState(0)
  const shouldPlay = visible && motionAllowed && !paused
  const shouldPlayRef = useRef(shouldPlay)
  shouldPlayRef.current = shouldPlay

  useEffect(() => {
    if (visible && motionAllowed) setStarted(true)
  }, [visible, motionAllowed])

  useEffect(() => {
    if (!started || failed || !hostRef.current) return
    let cancelled = false
    const host = hostRef.current
    let player: YouTubePlayer | null = null
    const loadingTimeout = window.setTimeout(() => setFailed(true), 15000)
    loadYouTubeAPI()
      .then((api) => {
        if (cancelled) return
        const mount = document.createElement("div")
        host.appendChild(mount)
        player = new api.Player(mount, {
          host: "https://www.youtube-nocookie.com",
          videoId: film.videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            mute: 1,
            controls: 0,
            playsinline: 1,
            rel: 0,
            fs: 0,
            disablekb: 1,
            start: film.startSeconds,
            end: film.endSeconds,
            origin: window.location.origin,
          },
          events: {
            onReady: ({ target }) => {
              if (cancelled) return
              window.clearTimeout(loadingTimeout)
              target.getIframe().title = film.title
              target.getIframe().setAttribute("tabindex", "-1")
              target.getIframe().referrerPolicy =
                "strict-origin-when-cross-origin"
              target.mute()
              target.seekTo(film.startSeconds, true)
              setReady(true)
              if (shouldPlayRef.current) target.playVideo()
            },
            onStateChange: ({ target, data }) => {
              if (cancelled) return
              setPlaying(data === 1)
              if (data === 1) {
                setHasPlayed(true)
                setBlocked(false)
                if (!shouldPlayRef.current) target.pauseVideo()
              }
              if (data === 0 && shouldPlayRef.current) {
                target.seekTo(film.startSeconds, true)
                target.playVideo()
                setLoops((value) => value + 1)
              }
            },
            onError: () => {
              if (!cancelled) setFailed(true)
            },
            onAutoplayBlocked: () => {
              if (!cancelled) setBlocked(true)
            },
          },
        })
        playerRef.current = player
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
      window.clearTimeout(loadingTimeout)
      player?.destroy()
      host.replaceChildren()
      playerRef.current = null
    }
  }, [started, failed])

  useEffect(() => {
    const player = playerRef.current
    if (!ready || !player) return
    if (shouldPlay) {
      player.mute()
      player.playVideo()
    } else player.pauseVideo()
  }, [ready, shouldPlay])

  useEffect(() => {
    if (!ready || !shouldPlay || failed) return
    const timer = window.setInterval(() => {
      const player = playerRef.current
      if (player && player.getCurrentTime() >= film.endSeconds - 0.15) {
        player.seekTo(film.startSeconds, true)
        setLoops((value) => value + 1)
      }
    }, 200)
    return () => window.clearInterval(timer)
  }, [ready, shouldPlay, failed])

  const togglePlayback = () => {
    if (playing) setPaused(true)
    else {
      setPaused(false)
      setBlocked(false)
      playerRef.current?.mute()
      playerRef.current?.playVideo()
    }
  }

  return (
    <I18nElement
      as="section"
      ref={ref}
      className="garden-film"
      aria-label="Pip Garden dışarıda yaşam"
      data-video-state={
        failed
          ? "unavailable"
          : playing
          ? "playing"
          : hasPlayed
          ? "paused"
          : "poster"
      }
      data-video-loops={loops}
    >
      {/* The original garden image stays visible if embedding or autoplay fails. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <I18nElement
        as="img"
        src={film.poster}
        alt="Bahçede açık hava oturma alanı"
        fetchPriority="high"
        className="garden-film-poster"
      />
      <div
        className={`garden-film-player ${
          hasPlayed && !failed && motionAllowed ? "is-visible" : ""
        }`}
        aria-hidden="true"
      >
        <div ref={hostRef} />
      </div>
      <div className="garden-film-shade" />
      <div className="garden-film-content">
        <p>
          <span />
          <T>Pip Garden / Dışarıda yaşam</T>
        </p>
        <h2>
          <T>Dışarıda,</T>
          <br />
          <em>
            <T>hayatın içinde.</T>
          </em>
        </h2>
        <LocalizedClientLink href="/store" className="garden-film-cta">
          <T>Koleksiyonu keşfet </T>
          <span aria-hidden="true">↗</span>
        </LocalizedClientLink>
      </div>
      <div className="garden-film-bottom">
        <I18nElement
          as="a"
          href={sourceURL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${film.title} — YouTube’da izle`}
        >
          <T>Film: </T>
          <T>{film.creator}</T> <span aria-hidden="true">↗</span>
        </I18nElement>
        {motionAllowed && !failed ? (
          <I18nElement
            as="button"
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Filmi duraklat" : "Filmi oynat"}
            disabled={!ready}
          >
            {playing ? (
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <path
                  d="M5 3v10M11 3v10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 16 16">
                <path
                  d="m5 3 8 5-8 5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
            )}
            <span>
              <T>
                {playing
                  ? "Duraklat"
                  : blocked
                  ? "Filmi oynat"
                  : paused
                  ? "Devam et"
                  : "Filmi oynat"}
              </T>
            </span>
          </I18nElement>
        ) : (
          <span className="garden-film-still">
            <T>Dışarıda yaşam koleksiyonu</T>
          </span>
        )}
      </div>
    </I18nElement>
  )
}
