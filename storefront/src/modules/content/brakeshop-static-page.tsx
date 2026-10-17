import LocalizedClientLink from "@modules/common/components/localized-client-link"
export type BrakeshopPageKey =
  | "about"
  | "contact"
  | "shipping-delivery"
  | "delivery-return-terms"
  | "returns-exchanges"
  | "faq"
  | "privacy-policy"
  | "cookies-policy"
  | "terms-conditions"
  | "pre-information-form"
  | "distance-sales-agreement"
  | "withdrawal-form"
  | "ssl-certificate"
  | "accessibility"
  | "care-guide"

type PageContent = {
  eyebrow: string
  title: string
  description: string
  sections: { title: string; body: string[] }[]
}
export const brakeshopPages: Record<BrakeshopPageKey, PageContent> = {
  about: {
    eyebrow: "Pip Garden",
    title: "Hakkımızda",
    description: "Açık havada, kendinize ait bir yaşam alanı.",
    sections: [
      {
        title: "Dışarıda yaşam",
        body: [
          "Pip Garden; bahçe, teras ve balkonlar için oturma gruplarını, salıncakları, masa takımlarını ve tamamlayıcı parçaları bir araya getirir.",
          "İroko, alüminyum ve örgü dokular arasından alanınıza uyan malzemeyi; ölçü ve renk seçenekleriyle birlikte keşfedin.",
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Pip Garden",
    title: "İletişim",
    description:
      "Ürünler, ölçüler ve seçenekler hakkında bizimle iletişime geçin.",
    sections: [
      {
        title: "İletişim bilgileri",
        body: [
          "Telefon / WhatsApp: Lorem ipsum",
          "E-posta: Lorem ipsum",
          "Adres: Lorem ipsum",
        ],
      },
      {
        title: "Firma bilgileri",
        body: [
          "Firma unvanı: Lorem ipsum",
          "Vergi dairesi / numarası: Lorem ipsum",
        ],
      },
    ],
  },
  "shipping-delivery": {
    eyebrow: "Pip Garden",
    title: "Kargo ve Teslimat",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Kargo ve Teslimat",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "delivery-return-terms": {
    eyebrow: "Pip Garden",
    title: "Teslimat ve İade Şartları",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Teslimat ve İade Şartları",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "returns-exchanges": {
    eyebrow: "Pip Garden",
    title: "İade ve Değişim",
    description: "Lorem ipsum",
    sections: [
      {
        title: "İade ve Değişim",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  faq: {
    eyebrow: "Pip Garden",
    title: "Sık Sorulan Sorular",
    description: "Koleksiyonu keşfederken merak ettikleriniz.",
    sections: [
      {
        title: "Ölçüleri nerede görebilirim?",
        body: [
          "Her ürünün detay sayfasındaki ölçüler ve ürün özellikleri bölümünü inceleyebilirsiniz.",
        ],
      },
      {
        title: "Renk seçimi yapabilir miyim?",
        body: [
          "Renk seçeneği olan ürünlerde gövde ve minder seçenekleri ürün sayfasında ayrı ayrı gösterilir.",
        ],
      },
    ],
  },
  "privacy-policy": {
    eyebrow: "Pip Garden",
    title: "Gizlilik Politikası",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Gizlilik Politikası",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "cookies-policy": {
    eyebrow: "Pip Garden",
    title: "Çerez Politikası",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Çerez Politikası",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "terms-conditions": {
    eyebrow: "Pip Garden",
    title: "Kullanım Koşulları",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Kullanım Koşulları",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "pre-information-form": {
    eyebrow: "Pip Garden",
    title: "Ön Bilgilendirme Formu",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Ön Bilgilendirme Formu",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "distance-sales-agreement": {
    eyebrow: "Pip Garden",
    title: "Mesafeli Satış Sözleşmesi",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Mesafeli Satış Sözleşmesi",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "withdrawal-form": {
    eyebrow: "Pip Garden",
    title: "Cayma Formu",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Cayma Formu",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "ssl-certificate": {
    eyebrow: "Pip Garden",
    title: "Güvenli Alışveriş",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Güvenli Alışveriş",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  accessibility: {
    eyebrow: "Pip Garden",
    title: "Erişilebilirlik",
    description: "Lorem ipsum",
    sections: [
      {
        title: "Erişilebilirlik",
        body: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
      },
    ],
  },
  "care-guide": {
    eyebrow: "Pip Garden",
    title: "Bakım Rehberi",
    description: "Her malzeme, kendine uygun bir bakım ister.",
    sections: [
      {
        title: "Ürününüzün bakımını planlayın",
        body: [
          "Ürünle birlikte verilen üretici bakım talimatlarını esas alın. Ahşap, alüminyum, örgü yüzey ve minder kumaşını kendi malzemesine uygun yöntemlerle temizleyin.",
          "Temizlik ürünü kullanmadan önce görünmeyen küçük bir alanda deneyin. Ürünü uzun süre kullanmayacağınız dönemlerde kuru ve korunaklı bir alanda saklayın.",
        ],
      },
    ],
  },
}
export default function BrakeshopStaticPage({
  pageKey,
}: {
  pageKey: BrakeshopPageKey
}) {
  const p = brakeshopPages[pageKey]
  return (
    <main className="mx-auto max-w-[1000px] px-5 py-14 small:py-20">
      <LocalizedClientLink href="/" className="text-xs text-gray-500">
        Ana sayfa / {p.title}
      </LocalizedClientLink>
      <p className="mt-10 text-xs uppercase tracking-widest text-[#c42026]">
        {p.eyebrow}
      </p>
      <h1 className="mt-3 text-4xl font-semibold">{p.title}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
        {p.description}
      </p>
      {p.sections.map((s, i) => (
        <section key={i} className="mt-10 border-t border-gray-200 pt-7">
          <h2 className="text-xl font-semibold">{s.title}</h2>
          {s.body.map((b, j) => (
            <p key={j} className="mt-4 text-sm leading-7 text-gray-600">
              {b}
            </p>
          ))}
        </section>
      ))}
    </main>
  )
}

export const getBrakeshopPageMetadata = (key: BrakeshopPageKey) => ({
  title: `${brakeshopPages[key].title} | Pip Garden`,
  description: brakeshopPages[key].description,
})
