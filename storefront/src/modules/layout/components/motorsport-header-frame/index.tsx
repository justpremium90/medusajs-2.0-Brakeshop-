"use client"

import { usePathname } from "next/navigation"
import { stripCountryPrefix } from "@lib/util/public-path"

const MotorsportHeaderFrame = ({ children }: { children: React.ReactNode }) => {
  const pathname = stripCountryPrefix(usePathname())
  const pathParts = pathname.split("/").filter(Boolean)
  const isHomePage = pathParts.length === 0
  const isProductPage = pathParts[0] === "products" && pathParts.length >= 2

  return (
    <div
      data-header-variant="motorsport"
      data-header-page={
        isProductPage ? "product" : isHomePage ? "home" : "default"
      }
      className={
        isHomePage
          ? "absolute inset-x-0 top-0 z-[80] text-white"
          : "relative z-[80] bg-[#111211] text-white"
      }
    >
      {children}
    </div>
  )
}

export default MotorsportHeaderFrame
