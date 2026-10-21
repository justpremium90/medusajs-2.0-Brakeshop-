import messages from "./messages.json"
import { locales, type Locale } from "./config"
export const normalizeText = (text: string) => text.replace(/\s+/g, " ").trim()
const dictionary = messages as Record<string, string[]>
const folded = Object.fromEntries(
  Object.entries(dictionary).map(([key, value]) => [key.toLowerCase(), value])
)
export function translate(text: string, locale: Locale): string {
  const key = normalizeText(text)
  if (!key) return text
  const entry = dictionary[key] || folded[key.toLowerCase()]
  if (!entry) {
    const i = locales.indexOf(locale)
    const image = key.match(/^(.*) — (\d+)\. görsel(i göster)?$/)
    if (image)
      return `${translate(image[1], locale)} — ${
        [
          `${image[2]}. görsel`,
          `Image ${image[2]}`,
          `الصورة ${image[2]}`,
          `Изображение ${image[2]}`,
        ][i]
      }`
    const zoom = key.match(/^(.*) görselini büyüt$/)
    if (zoom)
      return `${translate(zoom[1], locale)} — ${
        [
          "Görseli büyüt",
          "Zoom image",
          "تكبير الصورة",
          "Увеличить изображение",
        ][i]
      }`
    const gallery = key.match(/^(.*) — görsel galerisi$/)
    if (gallery)
      return `${translate(gallery[1], locale)} — ${
        [
          "Görsel galerisi",
          "Image gallery",
          "معرض الصور",
          "Галерея изображений",
        ][i]
      }`
    const categoryIntro = key.match(
      /^(.*) koleksiyonunu Pip Garden'da keşfedin\./
    )
    if (categoryIntro)
      return [
        text,
        `Discover ${translate(
          categoryIntro[1],
          locale
        )} at Pip Garden. Compare dimensions, materials and colours to find the right pieces for your space.`,
        `اكتشف ${translate(
          categoryIntro[1],
          locale
        )} لدى Pip Garden. قارن المقاسات والخامات والألوان لاختيار القطع المناسبة لمساحتك.`,
        `Откройте ${translate(
          categoryIntro[1],
          locale
        )} в Pip Garden. Сравните размеры, материалы и цвета, чтобы подобрать мебель для вашего пространства.`,
      ][i]
    const categoryDetail = key.match(
      /^(.*) seçerken kullanacağınız alanın ölçülerini/
    )
    if (categoryDetail)
      return [
        text,
        `Consider the dimensions and layout of your space when choosing ${translate(
          categoryDetail[1],
          locale
        )}. Product pages list materials, set contents, sizes and colour options. Follow the manufacturer's instructions for care and use.`,
        `عند اختيار ${translate(
          categoryDetail[1],
          locale
        )}، راعِ مقاسات مساحتك وتوزيعها. ستجد الخامات ومحتويات الطقم والمقاسات وخيارات الألوان في صفحة المنتج. اتبع تعليمات الشركة المصنّعة للاستخدام والعناية.`,
        `При выборе ${translate(
          categoryDetail[1],
          locale
        )} учитывайте размеры и планировку вашего пространства. На страницах товаров указаны материалы, комплектация, размеры и варианты цвета. Следуйте рекомендациям производителя по использованию и уходу.`,
      ][i]
  }
  if (!entry && key.includes(" / "))
    return key
      .split(" / ")
      .map((part) => translate(part, locale))
      .join(" / ")
  if (!entry && key.includes(" | "))
    return key
      .split(" | ")
      .map((part) => translate(part, locale))
      .join(" | ")
  if (!entry) {
    const index = locales.indexOf(locale)
    const bag = key.match(/^Sepet \((\d+)\)$/)
    if (bag) return `${translate("Sepet", locale)} (${bag[1]})`
    const matches = key.match(/^(\d+) ürün eşleşmesi$/)
    if (matches)
      return `${matches[1]} ${
        ["ürün eşleşmesi", "matching products", "منتجات مطابقة", "совпадений"][
          index
        ]
      }`
    const search = key.match(/^Arama: (.*)$/)
    if (search)
      return `${["Arama", "Search", "بحث", "Поиск"][index]}: ${search[1]}`
    const results = key.match(/^“(.*)” araması$/)
    if (results)
      return `${["Arama", "Search", "بحث", "Поиск"][index]}: “${results[1]}”`
    const credit = key.match(/^(.*) — YouTube’da izle$/)
    if (credit)
      return `${credit[1]} — ${
        [
          "YouTube’da izle",
          "Watch on YouTube",
          "شاهد على يوتيوب",
          "Смотреть на YouTube",
        ][index]
      }`
    return text
  }
  const result = entry[locales.indexOf(locale)]
  return `${text.match(/^\s*/)?.[0] || ""}${result}${
    text.match(/\s*$/)?.[0] || ""
  }`
}
