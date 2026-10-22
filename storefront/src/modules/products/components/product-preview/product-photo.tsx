"use client"

import { useState } from "react"
import { useT } from "@lib/i18n/client"

export default function ProductPhoto({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const t = useT()
  const [failed, setFailed] = useState<string[]>([])
  const available = images.filter((src) => !failed.includes(src))
  const primary = available[0]
  const alternate = primary?.includes("/images/garden/collection/")
    ? available[1]?.includes("/images/garden/collection/") ? available[1] : undefined
    : available[1]
  return (
    <div className="garden-product-photo">
      {primary ? (
        <>
          {/* Originals are served locally at their native resolution. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={primary}
            src={primary}
            alt={t(title)}
            loading="lazy"
            decoding="async"
            className="garden-product-photo-main"
            onError={() => setFailed((old) => [...old, primary])}
          />
          {alternate && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={alternate}
              src={alternate}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="garden-product-photo-alternate"
              onError={() => setFailed((old) => [...old, alternate])}
            />
          )}
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/garden/product-unavailable.svg"
          alt={t(title)}
          loading="lazy"
          className="garden-product-photo-main"
        />
      )}
      <span className="garden-product-photo-arrow" aria-hidden="true">
        ↗
      </span>
    </div>
  )
}
