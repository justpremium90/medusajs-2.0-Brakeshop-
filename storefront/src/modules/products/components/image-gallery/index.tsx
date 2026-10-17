"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import Image from "next/image"
import { getImageVariant } from "@lib/util/performance-media"
import { useEffect, useMemo, useState } from "react"

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
  productTitle = "Product",
}: ImageGalleryProps) => {
  const [failedUrls, setFailedUrls] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

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

  return (
    <div className="flex w-full flex-col bg-white small:flex-row small:items-start small:gap-3 large:gap-5">
      {!usesFallback ? (
        <div className="order-2 hidden gap-2 overflow-x-auto small:order-1 small:flex small:max-h-[calc(100vh-235px)] small:w-[112px] small:flex-col small:overflow-y-auto small:overflow-x-hidden medium:w-[128px] large:w-[200px]">
          {validImages.map((image, index) => (
            <button
              key={image.id || image.url}
              type="button"
              aria-label={`Show ${productTitle} image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={clx(
                "relative h-[92px] w-[92px] shrink-0 overflow-hidden bg-white transition-colors small:h-[112px] small:w-full medium:h-[128px] large:h-[200px]",
                index === activeIndex
                  ? "border border-[#3a080a]"
                  : "border border-transparent hover:border-[#d9b8b0]"
              )}
            >
              <Image
                src={getImageVariant(image.url!, 320)}
                alt={`${productTitle} thumbnail ${index + 1}`}
                fill
                sizes="(max-width: 768px) 92px, (max-width: 1280px) 128px, 200px"
                className="object-contain"
                onError={() => markFailed(image.url)}
                onLoad={(event) =>
                  rejectIfInvalid(image.url, event.currentTarget)
                }
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="order-1 relative aspect-[1/1.03] w-full flex-1 overflow-hidden border-y border-[#eee5e1] bg-white small:order-2 small:h-[calc(100vh-235px)] small:min-h-[560px] small:max-h-[900px] small:aspect-auto small:border-0">
        {usesFallback ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={PRODUCT_FALLBACK_IMAGE}
            alt={`${productTitle} görseli hazırlanıyor`}
            className="absolute inset-0 h-full w-full object-contain object-center p-5 small:object-top small:p-0"
            decoding="async"
          />
        ) : (
          <Image
            key={activeImage.url}
            src={getImageVariant(activeImage.url!, 1280)}
            priority
            className="absolute inset-0 object-contain object-center p-5 small:object-top small:p-0"
            alt={`${productTitle} product image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 680px, 920px"
            onError={() => markFailed(activeImage.url)}
            onLoad={(event) =>
              rejectIfInvalid(activeImage.url, event.currentTarget)
            }
          />
        )}
      </div>

      {!usesFallback ? (
        <div className="order-2 flex h-8 items-center justify-center gap-2 bg-white small:hidden">
          {validImages.map((image, index) => (
            <button
              key={`dot-${image.id || image.url}`}
              type="button"
              aria-label={`${productTitle} görseli ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
              className={clx(
                "h-1.5 w-1.5 rounded-full border border-[#8e7c77] transition-colors",
                index === activeIndex ? "bg-[#3a080a]" : "bg-transparent"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default ImageGallery
