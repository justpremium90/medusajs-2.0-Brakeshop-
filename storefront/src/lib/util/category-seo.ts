import { StoreProductCategory } from "@medusajs/types"
import { cleanVehicleLabel } from "./category-label"

const TR_LOCALE = "tr-TR"

const normalized = (value: string) => value.toLocaleLowerCase(TR_LOCALE)

const informationScore = (value: string) => {
  const tokens = value.split(/\s+/).filter(Boolean)
  const digitBonus = /\d/.test(value) ? 4 : 0
  const generationBonus = /\b(?:w|f|e|g|x|c|a|q|mk|b|k)\d{1,4}\b/i.test(value) ? 3 : 0
  return tokens.length * 3 + value.length / 12 + digitBonus + generationBonus
}

const getVehicleSubject = (categories: StoreProductCategory[]) => {
  const labels = categories.map((item) => item.name?.trim() || "").filter(Boolean)
  if (!labels.length) return null

  if (!cleanVehicleLabel(labels[0])) return null

  const cleaned = labels.map(cleanVehicleLabel).filter(Boolean)
  if (!cleaned.length) return null

  const root = cleaned[0]
  const candidates = cleaned.slice(1).filter((value) => {
    const lower = normalized(value)
    return lower !== normalized(root) && value.length > 1
  })

  const best = candidates.sort((a, b) => informationScore(b) - informationScore(a))[0]
  if (!best) return root

  if (normalized(best).includes(normalized(root))) return best
  return `${root} ${best}`.replace(/\s+/g, " ").trim()
}

const getBrakeIntent = (value: string) => {
  const lower = normalized(value)
  const hasDisc = /fren\s*disk|\bdisk(?:i|leri)?\b/.test(lower)
  const hasPad = /fren\s*balata|\bbalata(?:sı|si|ları|lari)?\b/.test(lower)

  if (hasDisc && hasPad) return "combined" as const
  if (hasDisc) return "disc" as const
  if (hasPad) return "pad" as const
  return "general" as const
}

const titleForVehicle = (subject: string, intent: ReturnType<typeof getBrakeIntent>) => {
  if (intent === "disc") return `${subject} Fren Diskleri`
  if (intent === "pad") return `${subject} Fren Balataları`
  return `${subject} Fren Diski ve Fren Balatası`
}

const titleForGenericCategory = (categoryName: string) => {
  const value = categoryName.trim()
  if (getBrakeIntent(value) === "combined") return "Fren Diski ve Fren Balatası"
  if (/fren\s*disk/i.test(value)) return "Fren Diskleri"
  if (/fren\s*balata/i.test(value)) return "Fren Balataları"
  if (/fren\s*sistem/i.test(value)) return "Fren Sistemleri ve Fren Parçaları"
  return value
}

export const getCategorySeo = (categories: StoreProductCategory[]) => {
  const category = categories[categories.length - 1]
  const rawLeaf = category?.name?.trim() || "Fren Parçaları"
  const vehicleSubject = getVehicleSubject(categories)
  const intent = getBrakeIntent(rawLeaf)

  const subject = vehicleSubject || titleForGenericCategory(rawLeaf)
  const title = vehicleSubject
    ? titleForVehicle(vehicleSubject, intent)
    : titleForGenericCategory(rawLeaf)

  const description = vehicleSubject
    ? `${title} seçeneklerini Brakeshop'ta inceleyin. Aracınıza uygun ön ve arka fren parçalarını teknik ölçü, üretim yılı ve parça koduna göre karşılaştırın.`
    : `${title} seçeneklerini Brakeshop'ta inceleyin. Araç uyumluluğu, teknik ölçü ve üretici parça koduna göre doğru fren parçasını bulun.`

  const content = vehicleSubject
    ? `${vehicleSubject} için doğru fren balatası ve fren diski seçimi; aracın üretim yılı, kasa, motor seçeneği ve kullanılan fren sistemine göre değişebilir. Brakeshop'ta ${vehicleSubject} ile uyumlu ön ve arka fren balatalarını, fren disklerini ve ilgili fren sistemi parçalarını inceleyebilirsiniz. Ürün seçerken araç bilgisinin yanında disk çapı, kalınlık, balata ölçüsü ve üretici parça kodu gibi teknik detayların da eşleşmesi önemlidir. Ürün sayfalarındaki uyumluluk ve ölçü bilgilerini kontrol ederek doğru parçayı belirleyebilir; emin olmadığınız durumda araç modelinizi, üretim yılını veya OEM parça kodunu paylaşarak destek alabilirsiniz.`
    : `${title} seçerken araç marka, model, üretim yılı ve fren sisteminin teknik özellikleri birlikte değerlendirilmelidir. Brakeshop'ta fren sistemi parçalarını teknik ölçü, kullanım konumu ve üretici parça koduna göre karşılaştırabilirsiniz. Doğru eşleşme için ürün sayfasındaki uyumluluk ve ölçü bilgilerini kontrol etmeniz önerilir.`

  return {
    subject,
    title,
    description,
    content,
  }
}
