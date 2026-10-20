"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { stripCountryPrefix } from "@lib/util/public-path"

export default function MotorsportHeaderFrame({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = stripCountryPrefix(usePathname())
  const pathParts = pathname.split("/").filter(Boolean)
  const isHomePage = pathParts.length === 0
  const isProductPage = pathParts[0] === "products" && pathParts.length >= 2
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [pathname])

  return (
    <div
      className="garden-header-frame"
      data-header-variant="garden"
      data-header-page={
        isProductPage ? "product" : isHomePage ? "home" : "default"
      }
      data-header-solid={scrolled || !isHomePage}
    >
      {children}
    </div>
  )
}
