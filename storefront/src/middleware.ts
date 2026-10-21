import { isLocale } from "@lib/i18n/config"
import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

// httpOnly because nothing on the client ever reads this. lib/data/cookies.ts
// is "server-only", so the id is consumed exclusively during server rendering.
// sameSite is left at the default rather than "strict" on purpose: a visitor
// arriving from an external link would otherwise not send it, be issued a new
// one, and lose their warm cache on every inbound visit.
const CACHE_ID_COOKIE_OPTIONS = {
  maxAge: 60 * 60 * 24,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
} as const

async function getRegionMap() {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: ["regions"],
      },
    }).then((res) => res.json())

    if (!regions?.length) {
      notFound()
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Middleware to handle region selection.
 */
export async function middleware(request: NextRequest) {
  // Railway probes this public status endpoint without browser credentials.
  // Exempt only the exact route; every other storefront API stays protected.
  if (request.nextUrl.pathname === "/api/healthcheck") {
    return NextResponse.next()
  }

  const password = process.env.STOREFRONT_PASSWORD
  if (password) {
    const username = process.env.STOREFRONT_USERNAME || "admin"
    const authorization = request.headers.get("authorization")
    let credentials = ""
    if (authorization?.startsWith("Basic ")) {
      try {
        credentials = atob(authorization.slice(6))
      } catch {
        // Malformed credentials receive the same challenge as missing ones.
      }
    }

    // Compare fixed-length digests so comparison time does not reveal prefixes.
    const encoder = new TextEncoder()
    const expectedBytes = encoder.encode(`${username}:${password}`)
    const expected = Array.from(expectedBytes, (byte) =>
      String.fromCharCode(byte)
    ).join("")
    const digest = async (value: string) =>
      new Uint8Array(
        await crypto.subtle.digest("SHA-256", encoder.encode(value))
      )
    const [actualHash, expectedHash] = await Promise.all([
      digest(credentials),
      digest(expected),
    ])
    let difference = 0
    for (let i = 0; i < actualHash.length; i++) {
      difference |= actualHash[i] ^ expectedHash[i]
    }
    if (difference !== 0) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Storefront", charset="UTF-8"',
          "Cache-Control": "no-store",
        },
      })
    }
  }

  // These paths still require authentication, but have no regional routing.
  if (
    /^\/(?:api(?:\/|$)|_next(?:\/|$)|favicon\.ico$|sitemap\.xml$|robots\.txt$|opengraph-image)/.test(
      request.nextUrl.pathname
    ) ||
    /\.(?:png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|mp4|webm)$/i.test(
      request.nextUrl.pathname
    )
  ) {
    return NextResponse.next()
  }

  // Public URLs carry a language. The internal country segment remains TR,
  // so language switching never changes region, currency, delivery or cart.
  const segments = request.nextUrl.pathname.split("/").filter(Boolean)
  const first = segments[0]
  if (!isLocale(first)) {
    const url = request.nextUrl.clone()
    const regionMap = await getRegionMap()
    const rest = regionMap.has(first) ? segments.slice(1) : segments
    url.pathname = `/tr${rest.length ? "/" + rest.join("/") : ""}`
    return NextResponse.redirect(url, 307)
  }
  const regionMap = await getRegionMap()
  if (!regionMap.has("tr"))
    return new NextResponse("Türkiye region is unavailable", { status: 503 })
  const cacheCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheCookie?.value || crypto.randomUUID()
  request.cookies.set("_medusa_cache_id", cacheId)
  const cartId = request.nextUrl.searchParams.get("cart_id")
  if (cartId && !request.cookies.get("_medusa_cart_id")) {
    // Render only after the browser has the recovered cart cookie. Keep the
    // public language prefix and all unrelated checkout parameters.
    const target = request.nextUrl.clone()
    target.searchParams.delete("cart_id")
    if (!target.searchParams.has("step"))
      target.searchParams.set("step", "address")
    const recovered = NextResponse.redirect(target, 307)
    recovered.cookies.set("_medusa_cart_id", cartId, {
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    if (!cacheCookie)
      recovered.cookies.set(
        "_medusa_cache_id",
        cacheId,
        CACHE_ID_COOKIE_OPTIONS
      )
    return recovered
  }
  const forwarded = new Headers(request.headers)
  forwarded.set("x-pipgarden-locale", first)
  forwarded.set("x-pipgarden-path", request.nextUrl.pathname)
  const internal = request.nextUrl.clone()
  internal.pathname = `/${first}/tr${
    segments.length > 1 ? "/" + segments.slice(1).join("/") : ""
  }`
  const response = NextResponse.rewrite(internal, {
    request: { headers: forwarded },
  })
  if (!cacheCookie)
    response.cookies.set("_medusa_cache_id", cacheId, CACHE_ID_COOKIE_OPTIONS)
  return response
}

// Authenticate every storefront route, including API and static resources.
export const config = {
  matcher: ["/:path*"],
}
