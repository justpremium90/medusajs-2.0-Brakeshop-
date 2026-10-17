import type { HttpTypes } from "@medusajs/types"

export type BreadcrumbItem = {
  label: string
  href?: string
}

type SourceCategory = {
  name?: unknown
  sourceHandle?: unknown
}

const parseSourceCategoryPath = (value: unknown): SourceCategory[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is SourceCategory =>
      Boolean(item && typeof item === "object")
    )
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)

      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return []
}

const getSourceCategoryItems = (
  product: HttpTypes.StoreProduct
): BreadcrumbItem[] => {
  const metadata = ((product as any).metadata || {}) as Record<string, unknown>
  const sourcePath = parseSourceCategoryPath(metadata.source_category_path)
    .map((category) => ({
      label: typeof category.name === "string" ? category.name.trim() : "",
      handle:
        typeof category.sourceHandle === "string"
          ? category.sourceHandle.trim()
          : "",
    }))
    .filter((category) => category.label && category.handle)

  return sourcePath.map((category, index) => ({
    label: category.label,
    href: `/categories/${sourcePath
      .slice(0, index + 1)
      .map((item) => item.handle)
      .join("/")}`,
  }))
}

const getAssignedCategoryItems = (
  product: HttpTypes.StoreProduct
): BreadcrumbItem[] => {
  const seen = new Set<string>()

  return (product.categories || [])
    .filter((category) => {
      const key = category.handle || category.id

      if (!category.name || !category.handle || !key || seen.has(key)) {
        return false
      }

      seen.add(key)
      return true
    })
    .map((category) => ({
      label: category.name,
      href: `/categories/${category.handle}`,
    }))
}

export const getProductBreadcrumbItems = (
  product: HttpTypes.StoreProduct
): BreadcrumbItem[] => {
  const sourceCategoryItems = getSourceCategoryItems(product)
  const categoryItems = sourceCategoryItems.length
    ? sourceCategoryItems
    : getAssignedCategoryItems(product)
  const navigationItems = categoryItems.length
    ? categoryItems
    : [{ label: "Tüm Fren Diski ve Balataları", href: "/store" }]

  return [
    { label: "Ana sayfa", href: "/" },
    ...navigationItems,
    { label: product.title },
  ]
}
