export type YouTubePlayer = {
  mute: () => void
  playVideo: () => void
  pauseVideo: () => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getIframe: () => HTMLIFrameElement
  destroy: () => void
}

type PlayerEvent = { target: YouTubePlayer; data: number }
type YouTubeAPI = {
  Player: new (
    element: HTMLElement,
    options: {
      host: string
      videoId: string
      width: string
      height: string
      playerVars: Record<string, string | number>
      events: {
        onReady: (event: PlayerEvent) => void
        onStateChange: (event: PlayerEvent) => void
        onError: () => void
        onAutoplayBlocked: () => void
      }
    }
  ) => YouTubePlayer
}
type YouTubeWindow = Window & {
  YT?: YouTubeAPI
  onYouTubeIframeAPIReady?: () => void
}

let pendingAPI: Promise<YouTubeAPI> | null = null

export function loadYouTubeAPI(): Promise<YouTubeAPI> {
  const target = window as YouTubeWindow
  if (target.YT?.Player) return Promise.resolve(target.YT)
  if (pendingAPI) return pendingAPI

  pendingAPI = new Promise((resolve, reject) => {
    const previousReady = target.onYouTubeIframeAPIReady
    target.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      if (target.YT?.Player) resolve(target.YT)
    }
    const script = document.createElement("script")
    script.src = "https://www.youtube.com/iframe_api"
    script.async = true
    script.onerror = () => {
      pendingAPI = null
      script.remove()
      reject(new Error("YouTube player could not load"))
    }
    document.head.appendChild(script)
  })
  return pendingAPI
}
