import { NextRequest, NextResponse } from "next/server"
import { getProductsList } from "@lib/data/products"
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") || "").trim().slice(0, 160)
  const countryCode = request.nextUrl.searchParams.get("country") || ""
  if (q.length < 2 || !/^[a-z]{2}$/.test(countryCode)) return NextResponse.json({ hits: [] })
  try {
    const { response: { products } } = await getProductsList({ countryCode, queryParams: { q, limit: 6 } })
    return NextResponse.json({ hits: products.map((product) => ({ id: product.id, title: product.title, handle: product.handle, thumbnail: product.thumbnail, sku: product.variants?.[0]?.sku || null })) })
  } catch {
    return NextResponse.json({ message: "Arama şu anda tamamlanamadı." }, { status: 503 })
  }
}
