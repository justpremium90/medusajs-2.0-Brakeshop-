import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("brand") || ""
  if (!/^[a-z0-9-]{2,120}$/i.test(handle)) return NextResponse.json({ models: [] }, { status: 400 })
  try {
    const { product_categories } = await sdk.client.fetch<HttpTypes.StoreProductCategoryListResponse>("/store/product-categories", { query: { handle, fields: "+category_children" } })
    return NextResponse.json({ models: product_categories[0]?.category_children || [] })
  } catch {
    return NextResponse.json({ models: [] }, { status: 503 })
  }
}
