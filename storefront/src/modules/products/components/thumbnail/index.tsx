"use client"

import { I18nElement, useT } from "@lib/i18n/client"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { getImageVariant } from "@lib/util/performance-media"
import React, { useEffect, useMemo, useState } from "react"

type ThumbnailProps = {
  thumbnail?: string | null
  // TODO: Fix image typings
  images?: any[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  alt?: string
  className?: string
  imageClassName?: string
  fallbackImageClassName?: string
  imageHeightPercent?: number
  imageAreaHeightPercent?: number
  "data-testid"?: string
}

const PRODUCT_FALLBACK_IMAGE = "/product-fallback-v2.webp"
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
    return false
  }
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  isFeatured,
  alt = "Product image",
  className,
  imageClassName,
  fallbackImageClassName,
  imageHeightPercent = 100,
  imageAreaHeightPercent = 100,
  "data-testid": dataTestid,
}) => {
  const t = useT()
  const imageCandidates = useMemo(
    () =>
      Array.from(
        new Set(
          [thumbnail, ...(images || []).map((image) => image?.url)].filter(
            isUsableImageUrl
          )
        )
      ),
    [thumbnail, images]
  )
  const [candidateIndex, setCandidateIndex] = useState(0)

  useEffect(() => {
    setCandidateIndex(0)
  }, [imageCandidates.join("|")])

  const rejectCurrentImage = () =>
    setCandidateIndex((index) => Math.min(index + 1, imageCandidates.length))

  const usesFallback = candidateIndex >= imageCandidates.length
  const currentImage = usesFallback
    ? PRODUCT_FALLBACK_IMAGE
    : imageCandidates[candidateIndex]
  const normalizedImageHeight = Math.min(100, Math.max(40, imageHeightPercent))
  const normalizedImageAreaHeight = Math.min(
    120,
    Math.max(40, imageAreaHeightPercent)
  )
  const verticalInset = (100 - normalizedImageHeight) / 2
  const baseAspectRatio = isFeatured ? 11 / 14 : size === "square" ? 1 : 9 / 16
  const adjustedAspectRatio =
    baseAspectRatio / (normalizedImageAreaHeight / 100)

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden rounded-none bg-ui-bg-subtle p-4 shadow-elevation-card-rest transition-shadow duration-150 ease-in-out group-hover:shadow-elevation-card-hover",
        className,
        {
          "aspect-[11/14]": isFeatured,
          "aspect-[9/16]": !isFeatured && size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      style={{ aspectRatio: String(adjustedAspectRatio) }}
      data-testid={dataTestid}
    >
      <div
        className="absolute inset-x-0"
        style={{ top: `${verticalInset}%`, bottom: `${verticalInset}%` }}
      >
        {usesFallback ? (
          // eslint-disable-next-line @next/next/no-img-element
          <I18nElement
            as="img"
            src={PRODUCT_FALLBACK_IMAGE}
            alt={t(alt || "Ürün görseli")}
            className={clx(
              "absolute inset-0 h-full w-full object-contain object-center",
              fallbackImageClassName
            )}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Image
            key={currentImage}
            src={getImageVariant(currentImage, 640)}
            alt={t(alt || "Ürün görseli")}
            className={clx(
              "absolute inset-0 object-center",
              !/\bobject-(contain|cover|fill|none|scale-down)\b/.test(
                imageClassName || ""
              ) && "object-cover",
              imageClassName
            )}
            draggable={false}
            quality={50}
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            fill
            onError={rejectCurrentImage}
            onLoad={(event) => {
              if (
                isTinyImage(event.currentTarget) ||
                isVisuallyBlankImage(event.currentTarget)
              ) {
                rejectCurrentImage()
              }
            }}
          />
        )}
      </div>
    </Container>
  )
}

export default Thumbnail
