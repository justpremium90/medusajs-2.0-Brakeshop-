"use client"

import { T, I18nElement, useT } from "@lib/i18n/client"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { getImageVariant } from "@lib/util/performance-media"
import { useEffect, useMemo, useRef, useState } from "react"
import "./product-gallery.css"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle?: string
}

const PRODUCT_FALLBACK_IMAGE = "/images/garden/product-unavailable.svg"
const PLACEHOLDER_URL_RE =
  /(?:no[-_ ]?(?:image|photo|product)|noimage|not[-_ ]?available|image[-_ ]?(?:not[-_ ]?found|none|missing)|(?:product|image)[-_ ]?placeholder|placeholder|blank(?:[-_.]|$)|resim[-_ ]?yok|urun[-_ ]?resm[iı][-_ ]?yok|gorsel[-_ ]?yok|default[-_ ]?(?:product|image|photo))/i

const isUsableImageUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false
  const url = value.trim()
  if (
    !url ||
    url === "null" ||
    url === "undefined" ||
    url === "#" ||
    url === "about:blank" ||
    url.startsWith("data:image/")
  ) {
    return false
  }

  return !PLACEHOLDER_URL_RE.test(decodeURIComponent(url))
}

const isTinyImage = (image: HTMLImageElement) =>
  image.naturalWidth > 0 &&
  image.naturalHeight > 0 &&
  (image.naturalWidth <= 16 || image.naturalHeight <= 16)

const isVisuallyBlankImage = (image: HTMLImageElement) => {
  if (!image.naturalWidth || !image.naturalHeight) return true

  try {
    const sampleSize = 32
    const canvas = document.createElement("canvas")
    canvas.width = sampleSize
    canvas.height = sampleSize
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return false

    context.clearRect(0, 0, sampleSize, sampleSize)
    context.drawImage(image, 0, 0, sampleSize, sampleSize)
    const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data

    let visiblePixels = 0
    let foregroundPixels = 0
    let darkPixels = 0
    let luminanceTotal = 0
    let luminanceSquaredTotal = 0

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index]
      const green = pixels[index + 1]
      const blue = pixels[index + 2]
      const alpha = pixels[index + 3]

      if (alpha < 16) continue

      visiblePixels += 1
      const maxChannel = Math.max(red, green, blue)
      const minChannel = Math.min(red, green, blue)
      const luminance = (red + green + blue) / 3

      luminanceTotal += luminance
      luminanceSquaredTotal += luminance * luminance

      if (luminance < 242 || maxChannel - minChannel > 18) {
        foregroundPixels += 1
      }
      if (luminance < 220) {
        darkPixels += 1
      }
    }

    if (!visiblePixels) return true

    const pixelCount = sampleSize * sampleSize
    const visibleRatio = visiblePixels / pixelCount
    const foregroundRatio = foregroundPixels / visiblePixels
    const darkRatio = darkPixels / visiblePixels
    const averageLuminance = luminanceTotal / visiblePixels
    const luminanceVariance =
      luminanceSquaredTotal / visiblePixels -
      averageLuminance * averageLuminance

    return (
      visibleRatio < 0.02 ||
      (foregroundRatio < 0.018 && darkRatio < 0.008) ||
      (averageLuminance > 248 &&
        luminanceVariance < 18 &&
        foregroundRatio < 0.035)
    )
  } catch {
    // If the browser blocks pixel inspection for a remote image, keep the image.
    // Network failures and known placeholder URLs are handled separately.
    return false
  }
}

const ImageGallery = ({
  images,
  productTitle: sourceProductTitle = "Product",
}: ImageGalleryProps) => {
  const t = useT()
  const productTitle = t(sourceProductTitle)
  const [failedUrls, setFailedUrls] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!zoomed) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const dialog = dialogRef.current
    if (dialog && typeof dialog.showModal === "function") dialog.showModal()
    else dialog?.setAttribute("open", "")
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [zoomed])

  const validImages = useMemo(
    () =>
      images.filter(
        (image) =>
          isUsableImageUrl(image.url) &&
          !failedUrls.includes(image.url as string)
      ),
    [images, failedUrls]
  )

  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, validImages.length])

  const markFailed = (url?: string | null) => {
    if (!url) return
    setFailedUrls((current) =>
      current.includes(url) ? current : [...current, url]
    )
  }

  const rejectIfInvalid = (
    url: string | null | undefined,
    image: HTMLImageElement
  ) => {
    if (isTinyImage(image) || isVisuallyBlankImage(image)) {
      markFailed(url)
    }
  }

  const activeImage = validImages[activeIndex] || validImages[0]
  const usesFallback = !activeImage

  const stepImage = (direction: number) =>
    setActiveIndex(
      (index) => (index + direction + validImages.length) % validImages.length
    )
  const closeZoom = () => {
    const dialog = dialogRef.current
    if (dialog && typeof dialog.close === "function") dialog.close()
    else setZoomed(false)
  }
  const count = String(validImages.length).padStart(2, "0")
  const current = String(activeIndex + 1).padStart(2, "0")

  return (
    <div className="product-gallery">
      <div className="product-gallery-stage">
        <span className="product-gallery-signature" aria-hidden="true">
          <T>Pip Garden / Outdoor living</T>
        </span>
        {usesFallback ? (
          // eslint-disable-next-line @next/next/no-img-element
          <I18nElement
            as="img"
            src={PRODUCT_FALLBACK_IMAGE}
            alt={`${productTitle} görseli hazırlanıyor`}
            className="product-gallery-fallback"
            decoding="async"
          />
        ) : (
          <I18nElement
            as="button"
            className="product-gallery-image-button"
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`${productTitle} görselini büyüt`}
            aria-haspopup="dialog"
          >
            <Image
              key={activeImage.url}
              src={getImageVariant(activeImage.url!, 1280)}
              priority
              className="product-gallery-image"
              alt={t(`${productTitle} — ${activeIndex + 1}. görsel`)}
              fill
              sizes="(max-width: 1023px) 100vw, 60vw"
              onError={() => markFailed(activeImage.url)}
              onLoad={(event) =>
                rejectIfInvalid(activeImage.url, event.currentTarget)
              }
            />
            <span className="product-gallery-zoom" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"
                  strokeWidth="1.2"
                />
              </svg>
            </span>
          </I18nElement>
        )}
        <div className="product-gallery-caption">
          <span>
            <T>
              {usesFallback ? "Görsel hazırlanıyor" : `${current} / ${count}`}
            </T>
          </span>
          {!usesFallback && (
            <button type="button" onClick={() => setZoomed(true)}>
              <T>Yakından inceleyin </T>
              <span aria-hidden="true">+</span>
            </button>
          )}
        </div>
      </div>
      {validImages.length > 1 && (
        <I18nElement
          as="div"
          className="product-gallery-thumbnails"
          aria-label="Ürün görselleri"
        >
          {validImages.map((image, index) => (
            <I18nElement
              as="button"
              key={image.id || image.url}
              type="button"
              aria-label={`${productTitle} — ${index + 1}. görseli göster`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={getImageVariant(image.url!, 320)}
                alt=""
                fill
                sizes="80px"
                className="object-contain"
                onError={() => markFailed(image.url)}
              />
            </I18nElement>
          ))}
        </I18nElement>
      )}
      {zoomed && (
        <I18nElement
          as="dialog"
          ref={dialogRef}
          className="product-gallery-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={`${productTitle} — görsel galerisi`}
          onClose={() => setZoomed(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeZoom()
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault()
              closeZoom()
              return
            }
            if (
              validImages.length > 1 &&
              ["ArrowRight", "ArrowLeft"].includes(event.key)
            ) {
              event.preventDefault()
              stepImage(event.key === "ArrowRight" ? 1 : -1)
            }
          }}
        >
          <div className="product-gallery-dialog-header">
            <span>
              <T>{productTitle}</T>
            </span>
            <I18nElement
              as="button"
              type="button"
              onClick={closeZoom}
              aria-label="Galeriyi kapat"
              autoFocus
            >
              ✕
            </I18nElement>
          </div>
          <div className="product-gallery-dialog-image">
            {activeImage && (
              <Image
                src={activeImage.url!}
                alt={`${productTitle} — ${
                  activeIndex + 1
                }. görsel, büyük görünüm`}
                fill
                sizes="100vw"
                className="object-contain"
                onError={() => markFailed(activeImage.url)}
              />
            )}
          </div>
          <div className="product-gallery-dialog-controls">
            {validImages.length > 1 && (
              <I18nElement
                as="button"
                type="button"
                onClick={() => stepImage(-1)}
                aria-label="Önceki görsel"
              >
                ←
              </I18nElement>
            )}
            <span aria-live="polite">
              <T>{current}</T> / <T>{count}</T>
            </span>
            {validImages.length > 1 && (
              <I18nElement
                as="button"
                type="button"
                onClick={() => stepImage(1)}
                aria-label="Sonraki görsel"
              >
                →
              </I18nElement>
            )}
          </div>
        </I18nElement>
      )}
    </div>
  )
}

export default ImageGallery
