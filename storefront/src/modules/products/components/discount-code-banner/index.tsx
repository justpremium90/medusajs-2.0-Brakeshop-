"use client"

import { T, I18nElement } from "@lib/i18n/client"
import { useEffect, useRef, useState } from "react"

const DISCOUNT_CODE = "BRAKE5"

const TicketIcon = () => (
  <svg
    aria-hidden="true"
    className="h-8 w-8 stroke-[1.7]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      d="M4 7.5A2.5 2.5 0 0 0 6.5 10 2.5 2.5 0 0 0 4 12.5V17h16v-4.5a2.5 2.5 0 0 0 0-5V3H4v4.5Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 7h6M9 11h6M9 15h3" strokeLinecap="round" />
  </svg>
)

const CopyIcon = ({ copied }: { copied: boolean }) => (
  <svg
    aria-hidden="true"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 20 20"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    {copied ? (
      <path
        d="m4.5 10.5 3.25 3.25L15.5 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <>
        <rect x="6.5" y="3.5" width="9" height="10" rx="1.5" />
        <path d="M12.5 13.5v1A2.5 2.5 0 0 1 10 17H5A2.5 2.5 0 0 1 2.5 14.5v-6A2.5 2.5 0 0 1 5 6h1.5" />
      </>
    )}
  </svg>
)

const DiscountCodeBanner = () => {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }
    }
  }, [])

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE)
      setCopied(true)

      if (resetTimer.current) {
        clearTimeout(resetTimer.current)
      }

      resetTimer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <I18nElement
      as="div"
      aria-label={`Havale ile %5 indirim kodu: ${DISCOUNT_CODE}`}
      className="discount-code-banner grid min-h-[72px] w-full grid-cols-[68px_minmax(0,1fr)] overflow-hidden rounded-[8px] border border-[#303231] bg-[#181a19] text-white small:min-h-[76px] small:grid-cols-[72px_minmax(0,1fr)]"
      data-testid="discount-code-banner"
    >
      <span className="discount-code-banner__icon flex items-center justify-center bg-[#7b0710] text-white">
        <TicketIcon />
      </span>

      <span className="flex min-w-0 items-center justify-between gap-3 border-l border-white/15 px-3 py-2.5 small:px-4">
        <span className="min-w-0">
          <span className="block text-[10px] font-medium uppercase leading-none tracking-[0.16em] text-white/65">
            <T>Havale ile</T>
          </span>
          <strong className="mt-1 block text-[17px] font-semibold uppercase leading-5 tracking-[0.015em] small:text-[18px] small:leading-[22px]">
            <T>%5 İndirim</T>
          </strong>
        </span>

        <I18nElement
          as="button"
          type="button"
          onClick={copyCode}
          className="discount-code-banner__copy flex min-h-11 shrink-0 items-center gap-2 rounded-[5px] border border-dashed border-white/35 bg-white/10 px-3 text-[12px] font-semibold tracking-[0.08em] text-white outline-none transition-[background-color,border-color,transform] duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#181a19]"
          data-copied={copied ? "true" : "false"}
          aria-label={`${DISCOUNT_CODE} indirim kodunu kopyala`}
        >
          <span aria-live="polite">
            <T>{copied ? "KOPYALANDI" : DISCOUNT_CODE}</T>
          </span>
          <CopyIcon copied={copied} />
        </I18nElement>
      </span>
    </I18nElement>
  )
}

export default DiscountCodeBanner
