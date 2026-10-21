"use client"

import { T } from "@lib/i18n/client"
import { useId, useState } from "react"

type PerformanceSeoContentProps = {
  title?: string | null
  content: string
  variant?: "default" | "banner"
}

const PerformanceSeoContent = ({
  title,
  content,
  variant = "default",
}: PerformanceSeoContentProps) => {
  const [expanded, setExpanded] = useState(false)
  const contentId = useId()

  if (variant === "banner") {
    return (
      <div className="mt-4 max-w-[680px] border-l-2 border-[#c42026] pl-4">
        {title ? (
          <h3 className="text-[15px] font-semibold leading-5 text-white small:text-[17px]">
            <T>{title}</T>
          </h3>
        ) : null}
        <div className="relative mt-1.5">
          <div
            id={contentId}
            className={`whitespace-pre-line text-[13px] leading-5 text-white/78 transition-[max-height] duration-300 small:text-[14px] small:leading-6 ${
              expanded
                ? "max-h-[2000px]"
                : "max-h-5 overflow-hidden small:max-h-6"
            }`}
          >
            <T>{content}</T>
          </div>
          {!expanded ? (
            <span className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/70 to-transparent" />
          ) : null}
        </div>
        <button
          type="button"
          className="mt-2 inline-flex min-h-10 items-center text-[12px] font-semibold text-white underline decoration-[#e51f28] decoration-2 underline-offset-4 transition-colors hover:text-[#ff5a60] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => setExpanded((current) => !current)}
        >
          <T>{expanded ? "Daha az göster" : "Devamını oku"}</T>
        </button>
      </div>
    )
  }

  return (
    <section className="relative overflow-hidden border-y border-[#e5e5e5] bg-[#f7f7f7] px-5 py-6 small:px-8 small:py-8">
      {title ? (
        <h2 className="mb-3 text-[20px] font-semibold leading-tight tracking-[-0.015em] text-[#171717] small:text-[24px]">
          <T>{title}</T>
        </h2>
      ) : null}
      <div className="relative">
        <div
          id={contentId}
          className={`whitespace-pre-line text-[14px] leading-6 text-[#525252] transition-[max-height] duration-300 small:text-[15px] small:leading-7 ${
            expanded ? "max-h-[2000px]" : "max-h-[72px] overflow-hidden"
          }`}
        >
          <T>{content}</T>
        </div>
        {!expanded ? (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-9 bg-gradient-to-t from-[#f7f7f7] to-transparent" />
        ) : null}
      </div>
      <button
        type="button"
        className="mt-3 inline-flex min-h-11 items-center text-[13px] font-semibold text-[#171717] underline decoration-[#c42026] decoration-2 underline-offset-4 transition-colors hover:text-[#c42026] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c42026]"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
      >
        <T>{expanded ? "Daha az göster" : "Devamını oku"}</T>
      </button>
    </section>
  )
}

export default PerformanceSeoContent
