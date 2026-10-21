"use client"

import Link from "next/link"
import { toInternalPath } from "@lib/util/public-path"
import { useLocale, useT } from "@lib/i18n/client"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const locale = useLocale()
  const t = useT()
  const localizedProps = { ...props }
  for (const key of ["aria-label", "title"])
    if (typeof localizedProps[key] === "string")
      localizedProps[key] = t(localizedProps[key])

  return (
    <Link
      href={
        href.startsWith("/") && !href.startsWith("//")
          ? `/${locale}${
              toInternalPath(href) === "/" ? "" : toInternalPath(href)
            }`
          : href
      }
      {...localizedProps}
    >
      {children}
    </Link>
  )
}

export default LocalizedClientLink
