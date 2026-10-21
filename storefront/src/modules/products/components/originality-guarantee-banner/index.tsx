import { T, I18nElement } from "@lib/i18n/client"
import { ShieldCheck } from "@medusajs/icons"

const OriginalityGuaranteeBanner = () => {
  return (
    <I18nElement
      as="div"
      aria-label="%100 Orijinal Ürün"
      className="grid min-h-[72px] w-full grid-cols-[68px_minmax(0,1fr)] overflow-hidden rounded-[8px] border border-[#ddb7b1] bg-[#fff9f7] text-[#56080d] small:min-h-[76px] small:grid-cols-[72px_minmax(0,1fr)]"
      data-testid="originality-guarantee-banner"
    >
      <span className="flex items-center justify-center bg-[#7b0710] text-white">
        <ShieldCheck aria-hidden="true" className="h-9 w-9" />
      </span>

      <span className="flex min-w-0 items-center border-l border-[#d9a6a0] px-4 py-3 small:px-5">
        <strong className="text-[17px] font-semibold uppercase leading-5 tracking-[0.015em] small:text-[18px] small:leading-[22px]">
          <T>%100 Orijinal Ürün</T>
        </strong>
      </span>
    </I18nElement>
  )
}

export default OriginalityGuaranteeBanner
