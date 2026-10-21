import { T } from "@lib/i18n/client"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { GARDEN_CATEGORIES } from "@lib/constants/garden"
import { PIPGARDEN_COMPANY as company } from "@lib/constants/company"
export default function Footer() {
  return (
    <footer className="border-t border-white/15 bg-[#111211] px-5 pb-8 pt-14 text-white small:px-12">
      <div className="mx-auto grid max-w-[1600px] gap-10 pb-14 small:grid-cols-[2fr_2fr_1fr_1fr]">
        <div>
          <LocalizedClientLink
            href="/"
            className="text-3xl font-bold tracking-tighter"
          >
            <T>PIP</T>
            <span className="font-normal">
              <T>GARDEN</T>
            </span>
            <span className="text-[#e3262e]">.</span>
          </LocalizedClientLink>
          <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
            <T>Bahçeniz, terasınız, balkonunuz.</T>
            <br />
            <T>Dışarıda yaşam için bir araya getirdik.</T>
          </p>
        </div>
        <div>
          <h2 className="mb-5 text-[11px] uppercase tracking-widest text-white/45">
            <T>Koleksiyon</T>
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {GARDEN_CATEGORIES.map((c) => (
              <LocalizedClientLink href={c.href} key={c.handle}>
                <T>{c.label}</T>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-[11px] uppercase tracking-widest text-white/45">
            <T>Pip Garden</T>
          </h2>
          <div className="flex flex-col gap-3 text-xs">
            {[
              ["Hakkımızda", "/about"],
              ["İletişim", "/contact"],
              ["Bakım rehberi", "/care-guide"],
              ["Sık sorulan sorular", "/faq"],
            ].map(([label, href]) => (
              <LocalizedClientLink key={href} href={href}>
                <T>{label}</T>
              </LocalizedClientLink>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-5 text-[11px] uppercase tracking-widest text-white/45">
            <T>İletişim</T>
          </h2>
          <dl className="space-y-3 text-xs">
            <div>
              <dt className="text-white/45">
                <T>Telefon / WhatsApp</T>
              </dt>
              <dd className="mt-1">
                <T>{company.telephoneDisplay}</T>
              </dd>
            </div>
            <div>
              <dt className="text-white/45">
                <T>E-posta</T>
              </dt>
              <dd className="mt-1">
                <T>{company.email}</T>
              </dd>
            </div>
            <div>
              <dt className="text-white/45">
                <T>Adres</T>
              </dt>
              <dd className="mt-1">
                <T>{company.address}</T>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-wrap justify-between gap-5 border-t border-white/15 pt-7 text-[10px] text-white/45">
        <p>
          © <T>{new Date().getFullYear()}</T> <T>Pip Garden</T>
        </p>
        <div className="flex flex-wrap gap-5">
          {[
            ["Gizlilik", "/privacy-policy"],
            ["Teslimat ve iade", "/kargo-teslimat"],
            ["Mesafeli satış", "/mesafeli-satis-sozlesmesi"],
          ].map(([label, href]) => (
            <LocalizedClientLink key={href} href={href}>
              <T>{label}</T>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </footer>
  )
}
