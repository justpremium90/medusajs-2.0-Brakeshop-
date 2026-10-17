import { HttpTypes } from "@medusajs/types"
import { cleanVehicleLabel } from "@lib/util/category-label"
import CategorySelector from "./selector"

export default function CategoryLinks({ categories }: {
  categories: HttpTypes.StoreProductCategory[]
}) {
  const category = categories[categories.length - 1]
  type PublicChild = HttpTypes.StoreProductCategory & {
    is_active?: boolean
    is_internal?: boolean
  }
  const children = (category?.category_children as PublicChild[] | undefined)?.filter((child) =>
    child.handle && child.name && child.is_active !== false && child.is_internal !== true
  ) || []
  if (!children.length) return null

  const parentPath = categories.map((item) => item.handle).join("/")
  const vehicle = cleanVehicleLabel(category.name)
  const isModelSelection = categories.length === 1 && Boolean(vehicle)
  return <CategorySelector
    context={vehicle || category.name}
    isModelSelection={isModelSelection}
    items={children.map((child) => ({
      label: isModelSelection ? cleanVehicleLabel(child.name) || child.name : child.name,
      href: `/kategori/${parentPath}/${child.handle}`,
    }))}
  />
}
