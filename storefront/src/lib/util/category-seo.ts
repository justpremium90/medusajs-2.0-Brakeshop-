import type { StoreProductCategory } from "@medusajs/types"

export const getCategorySeo = (categories: StoreProductCategory[]) => {
  const category = categories[categories.length - 1]
  const title = category?.name?.trim() || "Bahçe Mobilyaları"
  return {
    subject: title,
    title,
    description:
      category?.description?.trim() ||
      `${title} koleksiyonunu Pip Garden'da keşfedin. Alanınıza uygun ürünleri ölçü, malzeme ve renk seçenekleriyle karşılaştırın.`,
    content: `${title} seçerken kullanacağınız alanın ölçülerini ve yerleşimini birlikte değerlendirin. Ürüne özel malzeme, takım içeriği, ölçü ve renk seçeneklerini detay sayfasında inceleyebilirsiniz. Bakım ve kullanım için seçtiğiniz ürünün üretici talimatlarını esas alın.`,
  }
}
