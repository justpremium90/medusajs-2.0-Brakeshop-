import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getFooterSocials } from "@lib/data/footer-socials"
import { BRAKESHOP_COMPANY } from "@lib/constants/company"

const ctText = "#3a080a"
const baseFont = {
  fontFamily:
    '"Helvetica Neue LT Std", "Avenir light", Helvetica, Arial, sans-serif',
}

const companyInfo = `${BRAKESHOP_COMPANY.displayName} | ${BRAKESHOP_COMPANY.address} | Tel: ${BRAKESHOP_COMPANY.telephoneDisplay} | E-posta: ${BRAKESHOP_COMPANY.email} | Vergi Dairesi: ${BRAKESHOP_COMPANY.taxOffice} | VKN: ${BRAKESHOP_COMPANY.taxNumber}`

// Cloudflare email protection splits this single React text node, causing #418
// and invalidating later streamed Suspense placeholders. Scope its documented
// opt-out to this public contact line; escape every value before emitting HTML.
const companyInfoHtml = `<!--email_off-->${companyInfo
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;")}<!--/email_off-->`

const FooterCompanyInfo = () => (
  <>
    <span dangerouslySetInnerHTML={{ __html: companyInfoHtml }} />
    <br />
    <span>Brakeshop Ümraniye: </span>
    <span>
      Yamanevler, Alemdağ Cd Küçük Sanayi Sitesi A BLOK NO:177/A 42, 34768 Ümraniye/İstanbul
    </span>
  </>
)

type FooterBanner = {
  title: string | null
  subtitle: string | null
  image_url: string
  mobile_image_url: string | null
}

const getBackendUrl = () => {
  return (
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"
  )
}

const getFooterBanner = async (): Promise<FooterBanner | null> => {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  const headers = publishableKey
    ? {
        "x-publishable-api-key": publishableKey,
      }
    : undefined

  try {
    const response = await fetch(`${getBackendUrl()}/store/footer-banner`, {
      headers,
      next: {
        revalidate: 60,
        tags: ["footer-banner"],
      },
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as { banner: FooterBanner | null }

    return data.banner
  } catch (error) {
    return null
  }
}

const FooterEditorialBanner = ({ banner }: { banner: FooterBanner | null }) => {
  if (!banner?.image_url) {
    return null
  }

  return (
    <section
      className="w-full overflow-hidden bg-[#120706]"
      aria-label={banner.title ?? "Footer banner"}
    >
      <picture>
        {banner.mobile_image_url ? (
          <source media="(max-width: 767px)" srcSet={banner.mobile_image_url} />
        ) : null}
        <img
          src={banner.image_url}
          alt={banner.title ?? ""}
          className="block h-auto w-full"
          loading="lazy"
        />
      </picture>
    </section>
  )
}

const benefits = [
  {
    title: "Özenli Paketleme",
    subtitle: "kırılabilir ürünler için güvenli hazırlık",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" />
        <path d="M4 8.5v7L12 20l8-4.5v-7" />
        <path d="M12 13v7" />
      </svg>
    ),
  },
  {
    title: "Güvenli Ödeme",
    subtitle: "korumalı ödeme altyapısı",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />
        <path d="m9.5 12 1.8 1.8 3.7-4" />
      </svg>
    ),
  },
  {
    title: "Kolay İade",
    subtitle: "14 gün içinde iade talebi",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 7H5V3" />
        <path d="M5.5 7.5A8 8 0 1 1 4 12" />
        <path d="M12 8v5l3 2" />
      </svg>
    ),
  },
  {
    title: "Araç Uyumluluğu",
    subtitle: "marka, model, kasa ve parça kodu",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3c3 2.2 5 5.5 5 9a5 5 0 0 1-10 0c0-3.5 2-6.8 5-9Z" />
        <path d="M12 16c1.5-1.2 2.4-2.8 2.4-4.8" />
      </svg>
    ),
  },
  {
    title: "Brakeshop Desteği",
    subtitle: "ürün ve sipariş soruları için",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
]

const linkColumns = [
  {
    heading: "Brakeshop",
    links: [
      { label: "Hakkımızda", href: "/about" },
      { label: "Tüm Ürünler", href: "/store" },
      { label: "Fren Markaları", href: "/markalar" },
      { label: "Çok Satanlar", href: "/store" },
      { label: "Yeni Gelenler", href: "/store" },
      { label: "Fren Bakım Rehberi", href: "/care-guide" },
    ],
  },
  {
    heading: "Yardım",
    links: [
      { label: "İletişim", href: "/contact" },
      { label: "Kargo Teslimat", href: "/kargo-teslimat" },
      { label: "İade Değişim", href: "/iade-degisim" },
      { label: "Sıkça Sorulan Sorular", href: "/faq" },
      { label: "Hesabım", href: "/account" },
    ],
  },
  {
    heading: "Fren Kategorileri",
    links: [
      {
        label: "Fren Balataları",
        href: "/fren-balatalari",
      },
      {
        label: "Fren Diskleri",
        href: "/fren-diskleri",
      },
      { label: "Fren Sistemleri", href: "/store" },
      { label: "Tüm Fren Parçaları", href: "/store" },
      { label: "Arama", href: "/search" },
    ],
  },
]

const legalLinks = [
  { label: "Hakkımızda", href: "/about" },
  { label: "SSL Sertifikası", href: "/ssl-sertifikasi" },
  {
    label: "Teslimat ve İade Şartları",
    href: "/teslimat-ve-iade-sartlari",
  },
  { label: "Ön Bilgilendirme Formu", href: "/on-bilgilendirme-formu" },
  { label: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis-sozlesmesi" },
  { label: "Cayma Formu", href: "/cayma-formu" },
  { label: "Gizlilik Politikası", href: "/privacy-policy" },
]

const socialIcons = {
  instagram: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  ),
  pinterest: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.2 2C6.7 2 3 5.8 3 10.5c0 3.2 1.8 5.1 3.6 5.1.6 0 1-.3 1.1-.9l.3-1.2c.1-.4 0-.6-.2-.9-.7-.8-1.1-1.8-1.1-3.1 0-2.9 2.2-5.6 5.8-5.6 3.1 0 4.9 1.9 4.9 4.5 0 3.4-1.5 6.2-3.7 6.2-1.2 0-2.1-1-1.8-2.2.3-1.5 1-3.1 1-4.2 0-1-.5-1.8-1.6-1.8-1.3 0-2.3 1.3-2.3 3.1 0 1.1.4 1.9.4 1.9l-1.5 6.2c-.4 1.7-.1 3.8-.1 4 .1.1.2.1.3 0 .1-.1 1.8-2.2 2.4-4.2l.7-2.6c.6 1.1 1.9 2 3.4 2 4.5 0 7.5-4.1 7.5-9.5C21.8 5.1 18.3 2 12.2 2Z" />
    </svg>
  ),
  tiktok: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 3c.3 2.3 1.8 4 4 4.3V10c-1.5 0-2.9-.4-4-1.2v6.7a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.9a2.6 2.6 0 1 0 1.8 2.5V3z" />
    </svg>
  ),
}

const PaymentTrustBand = () => (
  <div
    className="flex flex-col items-center gap-3 small:flex-row small:justify-center small:gap-5 lg:justify-start"
    aria-label="Kabul edilen güvenli ödeme yöntemleri"
  >
    <img
      src="/images/payment/iyzico-payment-band.svg"
      alt="iyzico ile Öde, Mastercard, Visa, American Express ve Troy"
      width="429"
      height="32"
      loading="lazy"
      className="h-auto w-full max-w-[429px]"
    />
    <LocalizedClientLink
      href="/ssl-sertifikasi"
      className="inline-flex min-h-10 shrink-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] opacity-75 transition-opacity hover:opacity-100"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
      SSL Korumalı
    </LocalizedClientLink>
  </div>
)

export default async function Footer() {
  const [footerBanner, footerSocials] = await Promise.all([
    getFooterBanner(),
    getFooterSocials(),
  ])
  const socials = footerSocials.map((social) => ({
    ...social,
    icon: socialIcons[social.platform],
  }))

  return (
    <footer
      className="w-full border-t bg-white"
      style={{
        ...baseFont,
        color: ctText,
        borderColor: "rgba(58,8,10,0.12)",
      }}
    >
      <div className="lg:hidden">
        <section className="bg-[#f8f2f2] px-4 pb-5 pt-4">
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto no-scrollbar">
            {benefits.slice(0, 4).map((benefit) => (
              <div
                key={benefit.title}
                className="flex min-w-[47%] snap-start flex-col items-center gap-y-2 px-3 text-center"
              >
                <span className="flex h-8 items-center justify-center">
                  {benefit.icon}
                </span>
                <span className="max-w-[120px] text-[12px] font-semibold leading-[14px]">
                  {benefit.title}
                </span>
                <span className="max-w-[130px] text-[10px] leading-[13px] opacity-70">
                  {benefit.subtitle}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-1.5 w-1.5 rounded-full ${
                  dot === 3 ? "bg-[#3a080a]" : "bg-[#d8cdca]"
                }`}
              />
            ))}
          </div>
        </section>

        <section className="bg-[#fff5f3] px-4 py-6">
          <h2 className="text-[16px] font-bold uppercase leading-5 tracking-[0.04em]">
            Brakeshop Bülteni
          </h2>
          <p className="mt-3 text-[13px] leading-5 opacity-80">
            Yeni fren balatası, fren diski ve kampanya duyurularını ilk siz
            görün.
          </p>
          <form className="mt-5 grid grid-cols-[1fr_92px] gap-2">
            <label htmlFor="footer-email-mobile" className="sr-only">
              E-posta adresi
            </label>
            <input
              id="footer-email-mobile"
              type="email"
              placeholder="E-posta adresi"
              className="h-10 w-full border bg-white px-3 text-[13px] outline-none placeholder:opacity-60"
              style={{ borderColor: "rgba(58,8,10,0.28)" }}
            />
            <button
              type="submit"
              className="h-10 bg-[#d8c9c5] px-3 text-[11px] font-bold uppercase tracking-[0.04em] text-white"
            >
              Kayıt Ol
            </button>
          </form>
        </section>

        <section className="flex items-center justify-center gap-x-5 border-t border-[#ead8d2] bg-[#fff8f6] px-4 py-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-6 w-6 items-center justify-center"
            >
              {social.icon}
            </a>
          ))}
        </section>

        <section className="border-t border-[#ead8d2] px-4 py-5">
          <p className="text-[12px] font-bold uppercase tracking-[0.04em]">
            Gönderim Bölgesi:
          </p>
          <p className="mt-2 flex items-center gap-x-2 text-[13px] opacity-85">
            <span aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21M12 3C9.6 5.4 8.4 8.4 8.4 12S9.6 18.6 12 21" />
              </svg>
            </span>
            Türkiye | TR | TRY ₺
          </p>
        </section>

        <section className="border-t border-[#ead8d2]">
          {linkColumns.map((column, index) => (
            <details
              key={column.heading}
              className="group border-b border-[#ead8d2] px-4"
              open={index === 0}
            >
              <summary className="flex h-12 cursor-pointer list-none items-center justify-between text-[12px] font-bold uppercase tracking-[0.04em] [&::-webkit-details-marker]:hidden">
                {column.heading}
                <span className="text-[16px] leading-none group-open:hidden">
                  ⌄
                </span>
                <span className="hidden text-[16px] leading-none group-open:inline">
                  ⌃
                </span>
              </summary>
              <ul className="flex flex-col gap-y-3 pb-5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <LocalizedClientLink
                      href={link.href}
                      className="text-[13px] leading-5 opacity-85"
                    >
                      {link.label}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>

        <FooterEditorialBanner banner={footerBanner} />

        <section className="border-t border-[#ead8d2] bg-[#fff8f6] px-4 py-6">
          <PaymentTrustBand />
          <p className="mt-6 text-[11px] leading-5 opacity-65"><FooterCompanyInfo /></p>
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1">
            {legalLinks.map((link, index) => (
              <li key={link.label} className="text-[11px] leading-4 opacity-75">
                <LocalizedClientLink
                  href={link.href}
                  className="underline underline-offset-2"
                >
                  {link.label}
                </LocalizedClientLink>
                {index < legalLinks.length - 1 ? (
                  <span className="ml-2">|</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="hidden lg:block">
        <div className="content-container">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex flex-col items-center gap-y-2 px-2 text-center"
              >
                <span className="opacity-90">{benefit.icon}</span>
                <span className="text-[13px] font-medium leading-tight">
                  {benefit.title}
                </span>
                <span className="text-[11px] leading-tight opacity-70">
                  {benefit.subtitle}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="border-t"
          style={{ borderColor: "rgba(58,8,10,0.12)" }}
        />

        <div className="content-container">
          <div className="grid grid-cols-1 gap-y-10 py-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
            {linkColumns.map((column) => (
              <div key={column.heading} className="flex flex-col gap-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                  {column.heading}
                </span>
                <ul className="flex flex-col gap-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <LocalizedClientLink
                        href={link.href}
                        className="text-[13px] leading-snug opacity-80 transition-opacity hover:opacity-100"
                      >
                        {link.label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
                {column.heading === "Brakeshop" && (
                  <div className="mt-4 flex flex-col gap-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                      Gönderim Bölgesi
                    </span>
                    <span className="text-[13px] opacity-80">
                      Türkiye | TR | TRY ₺
                    </span>
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                Brakeshop Bülteni
              </span>
              <p className="text-[13px] leading-snug opacity-80">
                Yeni fren balatası, fren diski ve kampanya duyurularını ilk siz
                görün.
              </p>
              <form className="flex flex-col gap-y-3">
                <label htmlFor="footer-email" className="sr-only">
                  E-posta adresi
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="E-posta adresi"
                  className="w-full border-b bg-transparent px-1 py-2 text-[13px] outline-none placeholder:opacity-60"
                  style={{ borderColor: "rgba(58,8,10,0.4)" }}
                />
                <button
                  type="submit"
                  className="w-fit px-8 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: ctText }}
                >
                  Kayıt Ol
                </button>
              </form>
              <div className="mt-2 flex items-center gap-x-4">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="opacity-80 transition-opacity hover:opacity-100"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <FooterEditorialBanner banner={footerBanner} />

        <div
          className="border-t"
          style={{ borderColor: "rgba(58,8,10,0.12)" }}
        />

        <div className="content-container">
          <div className="flex flex-col gap-y-4 py-8">
            <PaymentTrustBand />
            <p className="text-[11px] leading-relaxed opacity-60">
              <FooterCompanyInfo />
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <LocalizedClientLink
                    href={link.href}
                    className="text-[11px] uppercase tracking-[0.08em] opacity-70 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
