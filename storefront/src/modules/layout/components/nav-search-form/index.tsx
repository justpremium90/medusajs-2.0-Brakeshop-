"use client"
import { useLocale } from "@lib/i18n/client"

import { T, I18nElement } from "@lib/i18n/client"
import type {
  ComponentPropsWithoutRef,
  FocusEvent,
  FormEvent,
  KeyboardEvent,
} from "react"
import { useEffect, useId, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toPublicPath } from "@lib/util/public-path"
import type { HeroSearchStyle } from "@lib/data/site-shell-settings"
import InlineSearchResults from "./inline-results"

type NavSearchFormProps = ComponentPropsWithoutRef<"form"> & {
  compact?: boolean
  hero?: boolean
  heroStyle?: HeroSearchStyle
  inputClassName?: string
}

const SEARCH_PLACEHOLDER = "Marka, model, OEM veya parça kodu ara"

const SearchIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 28 28"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12.4" cy="12.4" r="7.6" />
    <path d="m18 18 6.2 6.2" />
  </svg>
)

const NavSearchForm = ({
  compact = false,
  hero = false,
  heroStyle = "performance",
  className,
  inputClassName,
  style,
  ...props
}: NavSearchFormProps) => {
  const [query, setQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const inputId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node))
        setSearchOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [])
  const router = useRouter()
  const countryCode = useLocale()
  const toolAttributes = {
    toolname: `search_products_${inputId.replace(/[^a-zA-Z0-9]/g, "")}`,
    tooldescription:
      "Search Brakeshop brake parts by brand, vehicle model, OEM number or part code. Opens the full product results page.",
    toolautosubmit: "",
    action: `/${countryCode}/search`,
    method: "get",
  }
  const inputAttributes = {
    name: "query",
    required: true,
    toolparamdescription:
      "Brand, vehicle model, OEM number or product code to search for.",
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") setSearchOpen(false)
    },
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedQuery = String(
      new FormData(event.currentTarget).get("query") || ""
    ).trim()

    if (!normalizedQuery || !countryCode) {
      return
    }

    const nativeEvent = event.nativeEvent as Event & {
      agentInvoked?: boolean
      respondWith?: (result: Promise<unknown>) => void
    }
    if (nativeEvent.agentInvoked && nativeEvent.respondWith) {
      nativeEvent.respondWith(
        Promise.resolve({
          query: normalizedQuery,
          resultsUrl: `/${countryCode}/results/${encodeURIComponent(
            normalizedQuery
          )}`,
        })
      )
    }
    setSearchOpen(false)
    router.push(
      `/${countryCode}${toPublicPath(
        `/results/${encodeURIComponent(normalizedQuery)}`
      )}`
    )
  }

  const searchResults = (
    <InlineSearchResults
      id={`${inputId}-results`}
      query={query}
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
    />
  )
  const containerAttributes = {
    ref: containerRef,
    className: "relative w-full min-w-0",
    onBlur: (event: FocusEvent<HTMLDivElement>) => {
      if (
        event.relatedTarget &&
        !event.currentTarget.contains(event.relatedTarget as Node)
      )
        setSearchOpen(false)
    },
  }

  if (hero) {
    const searchIconClassName =
      heroStyle === "technical"
        ? "ml-1 h-6 w-6 shrink-0 text-white"
        : heroStyle === "floating"
        ? "ml-5 h-5 w-5 shrink-0 text-[#252728] small:ml-6 small:h-6 small:w-6"
        : "ml-5 h-6 w-6 shrink-0 text-[#252728] small:ml-6 small:h-7 small:w-7"
    const buttonClassName =
      heroStyle === "technical"
        ? "ml-3 flex h-11 min-w-[92px] items-center justify-center gap-2 border border-[#e31c25] bg-[#e31c25] px-5 text-[12px] font-bold uppercase tracking-[.14em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#161819] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        : heroStyle === "floating"
        ? "mr-1.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e31c25] text-white transition-colors hover:bg-[#b71920] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e31c25] focus-visible:ring-offset-2 small:mr-2 small:h-12 small:w-12"
        : "flex h-full min-w-[82px] items-center justify-center gap-2 bg-[#e31c25] px-4 text-[13px] font-bold uppercase tracking-[.12em] text-white transition-colors hover:bg-[#b71920] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#e31c25] small:min-w-[148px] small:px-7 small:text-[14px]"

    return (
      <div {...containerAttributes}>
        <I18nElement
          as="form"
          {...props}
          {...toolAttributes}
          className={className}
          onSubmit={handleSubmit}
          role="search"
          aria-label="Fren parçası ara"
          style={style}
        >
          <label className="sr-only" htmlFor={inputId}>
            <T>{SEARCH_PLACEHOLDER}</T>
          </label>
          <SearchIcon className={searchIconClassName} />
          <I18nElement
            as="input"
            {...inputAttributes}
            id={inputId}
            className={inputClassName}
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value)
              setSearchOpen(true)
            }}
            placeholder={SEARCH_PLACEHOLDER}
            autoComplete="off"
            enterKeyHint="search"
            type="search"
            onFocus={() => setSearchOpen(true)}
            aria-controls={
              searchOpen && query.trim().length >= 2
                ? `${inputId}-results`
                : undefined
            }
          />
          <I18nElement
            as="button"
            className={buttonClassName}
            type="submit"
            aria-label="Ürünleri ara"
          >
            <span className={heroStyle === "floating" ? "sr-only" : undefined}>
              <T>Ara</T>
            </span>
            <SearchIcon className="h-5 w-5" />
          </I18nElement>
        </I18nElement>
        <T>{searchResults}</T>
      </div>
    )
  }

  if (compact) {
    return (
      <div {...containerAttributes}>
        <I18nElement
          as="form"
          {...props}
          {...toolAttributes}
          className={className}
          onSubmit={handleSubmit}
          role="search"
          aria-label="Site içinde ara"
        >
          <label className="sr-only" htmlFor={inputId}>
            <T>{SEARCH_PLACEHOLDER}</T>
          </label>
          <I18nElement
            as="button"
            className="transition-colors hover:text-[#7b3432]"
            type="submit"
            aria-label="Ara"
          >
            <SearchIcon className="h-7 w-7" />
          </I18nElement>
          <I18nElement
            as="input"
            {...inputAttributes}
            id={inputId}
            className={inputClassName}
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value)
              setSearchOpen(true)
            }}
            placeholder={SEARCH_PLACEHOLDER}
            type="search"
            onFocus={() => setSearchOpen(true)}
            aria-controls={
              searchOpen && query.trim().length >= 2
                ? `${inputId}-results`
                : undefined
            }
          />
        </I18nElement>
        <T>{searchResults}</T>
      </div>
    )
  }

  return (
    <div {...containerAttributes}>
      <I18nElement
        as="form"
        {...props}
        {...toolAttributes}
        className={className}
        onSubmit={handleSubmit}
        role="search"
        aria-label="Site içinde ara"
        style={style}
      >
        <label className="sr-only" htmlFor={inputId}>
          <T>{SEARCH_PLACEHOLDER}</T>
        </label>
        <SearchIcon className="h-7 w-7 shrink-0" />
        <I18nElement
          as="input"
          {...inputAttributes}
          id={inputId}
          className={inputClassName}
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value)
            setSearchOpen(true)
          }}
          placeholder={SEARCH_PLACEHOLDER}
          type="search"
          onFocus={() => setSearchOpen(true)}
          aria-controls={
            searchOpen && query.trim().length >= 2
              ? `${inputId}-results`
              : undefined
          }
        />
      </I18nElement>
      <T>{searchResults}</T>
    </div>
  )
}

export default NavSearchForm
